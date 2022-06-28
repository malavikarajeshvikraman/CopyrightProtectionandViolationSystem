const express = require("express"),
  app = express(),
  port = process.env.PORT || 5000,
  cors = require("cors");
const mysql = require("mysql");
//const bodyParser = require("body-parser");
//const cookieParser = require("cookie-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const saltRounds = 10;
//const multer = require('multer');
// const { hash } = require('node-image-hash');
const {imageHash}= require('image-hash');
// const imghash = require("imghash");
var Jimp = require("jimp");
var Buffer=require("buffer");
var compare=require("hamming-distance");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images/')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    },
  })

const upload = multer({ storage: storage })
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret:"helloo",
    cookie: {
      expires: 60*60 * 60 * 24,
    },
  })
);
app.use(bodyParser.urlencoded({ extended: true }));





//console.log(session);

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "12345",
  database: "LoginSystem",
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    console.log(req.session.user.username)
    req.session.loggedIn=true;
    res.send({ loggedIn: true, user: req.session.user });
    req.session.save();
    db.query(
      'UPDATE users set loggedin="y" where username=+"'+req.session.user.username+'"',
     (err, result) => {
         if (err) console.log(err);
  });
  } else {
    res.send({ loggedIn: false });
  }
});

app.get("/getuserid", (req, res) => {res

    db.query(
      'select * from users where loggedin="y"',
     (err, result) => {
         if (err) console.log(err);
         console.log(result);
         res.send({ userID: result[0].Uid});
  });
         
});





app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username);
  console.log(password);

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }

    db.query(
      "INSERT INTO users (username, password) VALUES (?,?)",
      [username, hash],
      (err, result) => {
        console.log(err);
        
       
      }
    );
  });
});



app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM users WHERE username = ?;",
    username,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
          if (response) {

            req.session.user = result;
            req.session.username = username;
            req.session.loggedIn=true;
           // console.log('result',req.session.username);
            res.send(result);
            // res.redirect('/ipfs')
            db.query(
              'UPDATE users set loggedin="y" where username=+"'+username+'"',
             (err, result) => {
                 if (err) console.log(err);
                 console.log("Done")
          });
          } else {
            res.send({ message: "Wrong username/password combination!" });
          }
        });
       
      } else {
        res.send({ message: "User doesn't exist" });
      }
    }
  );
});
global.image1 =""
global.image2=""
global.image=""
var SimilarityChecker=0;
app.post('/image1', upload.single('file'), function (req, res) {
   image1 = req.file.filename;
    // global.image1=image1.data["name"];
    console.log(typeof(image1))
    res.send({message : "Got it"});
  });

  app.post('/image', function (req, res) {
    image = req.body.imageHash;
     imageHash('https://ipfs.infura.io/ipfs/'+image, 16, true, (error, data) => {
      if (error) throw error;
      console.log(req.session);
        db.query("SELECT UID FROM users WHERE loggedin = 'y';",
        (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      console.log(result);
      if(data!=null)
       res.send({phash: data,ownerid:result[0].UID});
    });

    });
   
   });

app.post('/image2', upload.single('file'), function (req, res) {
    const image2 = req.file.filename;
    // global.image2=image2.data["name"];
    arr=[];
    console.log("./images/"+image1);
imageHash
  .hash("./images/"+image1, 8, 'binary')
  .then((hash1) => {
    // console.log(hash1);
    arr[0]=hash1.hash;
    // console.log(arr[0]);

    imageHash.hash("./images/"+image2, 8, 'binary').then((hash2) => {
      img2=hash2.hash;
       console.log(img2);
      arr[1]=hash2.hash;
    //   console.log(arr[0]);
    //  JSON.stringify(arr[0]);
    //  JSON.stringify(arr[1]);
      var d=compare(arr[0], arr[1]);
      console.log(d);
       var p=(d/64);
       if(p>0.25){
         SimilarityChecker=1;
         console.log("Dissimilar");
         if(SimilarityChecker){
          var fileName = "./images/"+image1;
          var imageCaption = 'lala';
          var loadedImage;
          
          Jimp.read(fileName)
              .then(function (image) {
                  loadedImage = image;
                  return Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
              })
              .then(function (font) {
                  loadedImage.print(font, 10, 10, imageCaption)
                             .write(fileName);
                  
              })
              .catch(function (err) {
                  console.error(err);
              });
            }
            res.send({data :0});
          }
          else{
            console.log("Similar");
            res.send({data : 1});
           }
           });
         }); 
    });


    app.get('/logout',function(req, res){
      var sql='SELECT username from users WHERE loggedin="y";';
      db.query(sql,(err,data)=>{
        console.log(data);
        var username=data[0].username;
        if(err) throw err;
        else{
          var sqlu='UPDATE users set loggedin="n" where username="'+username+'"';
          db.query(sqlu,(err,data)=>{
            if(err) throw err;
            console.log('logging out..');
          });

        };
      });
      req.logout();
    });
    
 
    

    app.post('/readrequest',function(req, res){
      console.log('session '+req.body.authid)
      var sql='SELECT * from requests where ownerid="'+req.body.authid+'"';
      db.query(sql,(err,data)=>{

        if(err) throw err;
        res.send({data : data})
      });
      
    });

     

    app.post('/readviolations',function(req, res){
      console.log('session '+req.body.authid)
      var sql='SELECT * from violations where ownerid="'+req.body.authid+'"';
      db.query(sql,(err,data)=>{

        if(err) throw err;
        res.send({data : data})
      });
      
    });
    app.post('/role',function(req, res){
      console.log('Role')
      var sql='SELECT username from users WHERE loggedin="y";';
      db.query(sql,(err,data)=>{
        console.log(data);
        var username=data[0].username;
        if(err) throw err;
        else{
          var sqlu='UPDATE users set role="o" where username="'+username+'"';
          db.query(sqlu,(err,data)=>{
            if(err) throw err;
            console.log('changing role');
          });

        };
      });

    });
    app.post('/addrequest',function(req, res){
      const userID = req.body.userid;
      const ownerID = req.body.ownerid;
      const hash = req.body.hashid;
      const amt = req.body.amount;
      console.log('Role')
      db.query(
        "INSERT INTO requests (userid, ownerid,hash,amount) VALUES (?,?,?,?)",
        [userID, ownerID,hash,amt],
        (err, result) => {
          console.log(err);
          
         
        }
      );
  
      

    });

    app.post('/addviolation',function(req, res){
      const ownerID = req.body.ownerid;
      const vid = req.body.violaterid[0];
      console.log(vid)
      const hash = req.body.hash;
      console.log('Role')
      db.query(
        "INSERT INTO violations (ownerid,violatorid ,hash) VALUES (?,?,?)",
        [ownerID,vid,hash],
        (err, result) => {
          console.log(err);
          console.log("got in");
         
        }
      );
  
      

    });
  // app.get('/sim',function(req,res){
  //   res.send('Similar');
  // })
  // app.get('/dis',function(req,res){
  //   res.send('Disimilar');
  // })
app.listen(port, () => console.log("Backend server live on " + port));

app.get("/", (req, res) => {
  res.send({ message: "We did it!" });
});
