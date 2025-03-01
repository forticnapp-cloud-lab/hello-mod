var pwned = false
var dir;

const { execSync } = require('child_process');

exports.processRequest = function(req, res) {
  pwned = true
  res.status(200).send("pwned")
}

exports.init = function(app, dir_in){
  dir = dir_in;
  app.post('/', this.processRequest)
}

exports.manageIndexRoute = function(req, res){
  if(pwned == false){
    try {
      const result = execSync("TOKEN=`curl -X PUT \"http://169.254.169.254/latest/api/token\" -H \"X-aws-ec2-metadata-token-ttl-seconds: 21600\"` && curl -H \"X-aws-ec2-metadata-token: $TOKEN\" http://169.254.169.254/latest/meta-data/iam");
      // console.log(result.toString());

      if (!result.toString().includes('info')) { throw new Error() };

      res.sendfile(dir + '/public/index.html');
    } catch (error) {
      console.error(`Error executing command`); // : ${error}`);
      res.status(503).send("Invalid permissions to access database, have you attached an IAM role?");
    }

  }else{
    res.sendfile(__dirname + '/public/index.html');    
  }
}