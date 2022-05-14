let express = require("express");
let app = express();
let bodyParser= require("body-parser");

var absolutePath= __dirname;

console.log( "process.env.MESSAGE_STYLE= " + process.env.MESSAGE_STYLE )

var jsonObj= {"message": "Hello json"};

function myMiddleware(req, res, next){
  var string = req.method + " " + req.path + " - " + req.ip;
  console.log(string);
  next();
}

if( process.env.MESSAGE_STYLE == "uppercase")
  jsonObj["message"]= jsonObj["message"].toUpperCase();

app.use(express.static(absolutePath + "/public"));
app.use(myMiddleware)
app.use(bodyParser.urlencoded({extended: false}));

app.get('/',
        function(req,res){
          res.sendFile(absolutePath + "/views/index.html");
        })

app.get('/now', 
        function(req,res,next) {
          req.time= new Date().toString();
          next();
        },
        function(req,res) {
          res.json({time: req.time});
        })

app.get('/json',
        function(req,res) {
          res.json(jsonObj);
        })

app.get('/:word/echo',
        function(req,res) {
          res.json({"echo": req.params.word});
        })

app.route('/name').get(
  function(req,res){
    var firstName= req.query.first;
    var lastName= req.query.last;    
    res.json({"name": firstName + " " + lastName});
  }).post(
    function(req,res){   
      var firstName= req.body.first;
      var lastName= req.body.last;   
      res.json({"name": firstName + " " + lastName});
    })

module.exports = app;
    