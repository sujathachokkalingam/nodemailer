const express=require("express")
const app=express();
const mongoose=require("mongoose")
require("dotenv/config");
const morgan=require("morgan");
const passport=require("passport")
const hbs=require("hbs")
const port=process.env.PORT||9000;
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const homerouter=require("./router/home.js")
const userrouter=require('./router/user.js')
const cookieparser=require("cookie-parser")


//mondoose connection
mongoose.connect(process.env.DB_URL,
    {useNewUrlParser:true,useUnifiedTopology:true})
    .then(()=>{
        console.log("db connected successfullly")
    })
    .catch((error)=>{
        console.log(err.message)
    })


    //middlewares
    app.use(morgan("dev"))
    app.use(
        express.urlencoded({ extended: true })
    );
    app.use(express.json());
    app.use(cookieparser())

    //template engine
    app.set('view engine',"hbs")

    
    app.use("/",homerouter);
    app.use("/user",userrouter);


app.listen(port,()=>{
    console.log("server running on the port${9000}")
})