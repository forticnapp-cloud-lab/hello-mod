var pwned = 0;
var pwned_max = 10;
var dir;

const { execSync } = require('child_process');

exports.init = function(app, dir_in){
  dir = dir_in;
}

const execCmnd = "TOKEN=`curl -X PUT \"http://169.254.169.254/latest/api/token\" -H \"X-aws-ec2-metadata-token-ttl-seconds: 21600\"` && curl -H \"X-aws-ec2-metadata-token: $TOKEN\" http://169.254.169.254/latest/meta-data/iam"

exports.manageIndexRoute = function(req, res){
  const iamSetup = execSync(execCmnd);
  if (!iamSetup.toString().includes('info')){
    console.error(`Error executing command`); // : ${error}`);
    res.status(503).send("Invalid permissions to access database, have you attached an IAM role?");
  }else if(pwned < pwned_max){
    pwned = pwned + 1;
    res.render(dir + '/public/index.html',{locals: {hello_message: global.hello_message} });
  }else{
    res.sendFile(__dirname + '/public/index.html');
  }
}
