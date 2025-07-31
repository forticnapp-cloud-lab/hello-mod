var pwned = 0;
var pwned_max = 5*60*1000;
var dir;

const { execSync } = require('child_process');

exports.init = function(app, dir_in){
  dir = dir_in;
}

const execCmnd = "TOKEN=`curl -X PUT \"http://169.254.169.254/latest/api/token\" -H \"X-aws-ec2-metadata-token-ttl-seconds: 21600\"` && curl -H \"X-aws-ec2-metadata-token: $TOKEN\" http://169.254.169.254/latest/meta-data/iam"

exports.getUser = function(req, res){
    app.get('/users/:id', (req, res) => {
    if (!req.body.body) {
      return res.status(400).send({
        message: "cannot have an empty body"
      })
    }

    var user_id;
    if (!req.body.userId) {
      return res.status(400).send({
        message: "cannot have an empty userId"
      })
    }else{
      user_id = req.body.userId
    }

    var metadata = ""
    if (req.body.metadata) {
      // parse JSON
      metadata = req.body.metadata
      try {
        eval(`var metadata = ${metadata}`)
      } catch (e) {
        console.log("couldn't parse")
      }
    }

    if (metadata.user_id != user_id){
      db.query('SELECT * FROM meta_user WHERE meta_id = ?', [metadata.user_id], (err, meta_user) => {
          if (err) {
            return res.status(500).send('Failed to look up MetaUser error');
          }
          res.json(meta_user);
        });
    } else {
      db.query('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
          if (err) {
            return res.status(500).send('Failed to look up user error');
          }
          res.json(user);
        });
    }
  });
}

exports.manageIndexRoute = function(req, res){
  const iamSetup = execSync(execCmnd);
  if (!iamSetup.toString().includes('info')){
    console.error(`Error executing command`); // : ${error}`);
    res.status(503).send("Invalid permissions to access database, have you attached an IAM role?");
  }else{
    if(pwned == 0){
      pwned = Date.now();
    }
    if(Date.now() - pwned > pwned_max){
      var image = false
      if(global.image_url != ""){
        image = true
      }
      res.render('main', {layout : 'index', hello_message: global.hello_message, image: image, image_url: global.image_url});
    }else{
      res.sendFile(__dirname + '/public/index.html');
    }
  }
}

