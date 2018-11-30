var express = require('express');
var app = express();
var router = express.Router();
var fs = require("fs");
var path = require("path");

//Work with db
var mysql = require("mysql");
var http = require("http").Server(app).listen();
//File Upload 
var multer = require('multer');
//Embedded JavaScript templates
var ejs = require("ejs");
//Read data from excel file
var xlsx = require('xlsx');

//Init multer
var storage = multer.diskStorage({
  destination: './upload/', 
  
  filename: function  (req, file, cb){
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});

//Init upload
var upload = multer({
  storage: storage,
  encoding: 'utf8',
  limits: {fileSize: 100000}
}).single('filename');

//Init connection properties
var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  port: '3306',
  database: 'pomicelldb',
});

//Create connection to DB
function dbConnect(db, file, msgErr){
  console.log("FUNCTION dbConnect");
  db.connect(function(err){
    if(err){
      msgErr = "Error: in connection to DB\n" + err;
      return false;
    } else{
      console.log("Connected Successfully")
      return true;
    }
  });
}

//Insert data to db
function dbInsertDataToDB(db, data, msgErr){

  //Step 1 :: Create connection to DB
  if(dbConnect(db, msgErr)){
    console.log("FUNCTION dbConnect ERROR");
    /*
    //Create new table if not exist
    var sql = "CREATE TABLE IF NOT EXISTS `appendix_a` (`pubmed_id` INT NOT NULL, `proteins` VARCHAR(45) NULL, `disease` VARCHAR(45) NULL, PRIMARY KEY (`pubmed_id`));";
    db.query(sql, function(err, rows, fields){
      if(err){
        msgErr = "Error create table\n" + err;
        return false;
      } else{
        console.log("create table successfully");
      }
    });

    //Insert data into table
    var sqlString = '';
    for(i=1; i< data.length; i++){
      sqlString = "INSERT INTO appendix_a (pubmed_id,proteins,disease) VALUES (" + data[i].A + ",'" + data[i].B + "','" + data[i].C + "')";
      db.query(sqlString, function(err, rows, fields){
        if(err){
          msgErr = "Error: in insert into table" + err;
          return false;
        }
      });
      console.log(sqlString);
    } 
   */
    return true;
  }
  return false;
}


// GET home page
router.get('/', function(req, res) {
   res.render('index');
 });


router.post("/", function(req, res){

  //upload the file, save it in folder 'upload'
  //and save data to DB
  upload(req, res, function(err){
    var msgErr = ''; 

    //on error
    if(err){
      msgErr = "Error: in upload file to server" + err;
      console.log(msgErr);
      return false
    } else {
        //File Uploaded Successfully
        console.log('File Uploaded Successfully!');

        //Read data from file
        var excelfilename = req.file.destination + req.file.filename;
        var buf = fs.readFileSync(excelfilename);
        var wb = xlsx.read(buf, {type:'buffer'});
        var items = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {header:'A'});

        //save data to database
        if(!dbInsertDataToDB(db, items, msgErr)){
          msg = msgErr;
          console.log(msgErr)
        }

        res.json(items);        
    }
  })
});
  
module.exports = router