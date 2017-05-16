var express = require('express');
var bodyparser = require('body-parser')
var path = require('path');
var app = express();
var port = process.env.PORT || 8080;

const pg = require('pg');
const connectionString = "postgres://xnlomexwcabcyb:1223ebf0b72b0e63eeccbf6e27982dc14f0ad8a0d8b711ca51e3387b42e19243@ec2-23-21-235-142.compute-1.amazonaws.com:5432/ddhq7qi5qe8rcr?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory";

app.use(express.static(path.join(__dirname,'/views')));
app.use(bodyparser.urlencoded());
app.use(bodyparser.json());

const client = new pg.Client(connectionString);
client.connect();

// pg.connect(connectionString,(err,client,done)=>{
//     if(err){
//         done();
//         console.log("heyo");
//         console.log(err);
//     }else{
//         console.log("yeyo");
//     }
// 
// });



app.get('/', function(req, res){
	res.sendFile("/index.html");
})
app.listen(port,function(){
			console.log('Example app listening on port 8080!');
			});

//XSS FROM PROJECT BRIEF.

app.use(function (req, res, next) {
 // Website you wish to allow to connect
 res.setHeader('Access-Control-Allow-Origin', '*')
 // // Request methods you wish to allow
 res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
 // Request headers you wish to allow ,
 res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-AllowHeaders');
 // Pass to next layer of middleware
 next();
});


//Create

app.post('/create', function(req,res){
    var temp = req.body.task;
    console.log(temp);    
    var query = client.query("INSERT INTO todo (todo_name,status) VALUES ($1,$2)",[temp,0]);
    
    query.on('error',function(){
        res.status("500").send("Server Error");
    });
    query.on('end',function(){
        res.json("SUccess");
    });
    
});

//Read

app.get('/getall', function(req,res){
    
    var query = client.query("SELECT * FROM todo;");
    var result = [];
    
    query.on('row',function(row){
       result.push(row);
    });
    
    query.on('error',function(){
        res.status("500").send("Server Error");
    });
    query.on('end',function(){
        res.json(result);
    });
});

//Update

app.put('/update', function(req,res){
    res.send("update");
});

//Delete
app.delete('/delete', function(req,res){
    res.send("delete");
});
