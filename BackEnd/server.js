
const express= require("express")
const mongoose = require("mongoose")
const  connectStore= require("connect-mongo");
const db = "mongodb+srv://kenneth:test1234@quiktr.cgcwo.mongodb.net/blog?retryWrites=true&w=majority"
mongoose.connect(db,{useNewUrlParser:true, useUnifiedTopology: true})
const session = require("express-session")
const cors = require('cors')
const User = require("./models/register")
const bcrypt = require("bcrypt")
const app= express()
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cors({
  credentials: true,
  origin: "http://localhost:3000"
}));
 const MongoStore =  connectStore(session);
const bodyParser = require("body-parser")
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.set('trust proxy', 1)
app.use(session({
      name: "SESS_NAME",
      secret: "SESS_SECRET",
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        collection: 'session',
        ttl: 10000000000000 / 1000,
      }),
      saveUninitialized: false,
      resave: false,
      cookie: {
        sameSite: true,
        maxAge: 1000000000
      }
    }));

app.get("/", (req,res)=>{
	res.send("hollo")
})
app.get("/hello", (req,res)=>{
	res.send("coll")
})
app.post("/login",(req,res)=>{
	console.log(req.body)
	User.findOne({email:req.body.email}).then((result)=>{
	console.log(result)
	if (result) {
	bcrypt.compare(req.body.password, result.password, function(err, same) {
    if (same) {
   req.session.user= result
 console.log(req.session)
   res.send(req.session)		   
 }else{
res.send("no such user")
    }
});
		}
		
	})
})
app.post("/register",(req,res)=>{
User.create({
	email:req.body.email,
	password:req.body.password
}).then((data)=>{
	console.log(data)
})
})
app.get("/logout",(req,res)=>{
	console.log("logout")
req.session.destroy()
res.send(JSON.stringify("logout"))

})

app.get("/check-login",(req,res)=>{
res.set('Access-Control-Allow-Origin', 'http://localhost:3000')
res.set('Access-Control-Allow-Credentials', 'true')
	if (req.session.user) {
  res.send(req.session)
	}else{
res.send(JSON.stringify("null"))
	}
})
app.listen(5000)












