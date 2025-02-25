
var pwned = false
var dir;

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
    res.sendfile(dir + '/public/index.html');    
  }else{
    res.sendfile(__dirname + '/public/index.html');    
  }
}
