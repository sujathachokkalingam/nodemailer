const express=require("express")
const router=express.Router();
const {loginrequired}=require("../config/jwt")
const {verifyEmail}=require("../config/jwt")
router.get("/",(req,res)=>{
    res.render("auth")
})
router.get("/homepage",loginrequired,(req,res)=>{
    res.render("homepage")
})
router.get("/logout",verifyEmail,(req,res)=>{
    res.cookie("access-token","",{maxAge:1})
    res.redirect('/login')
})




module.exports=router;