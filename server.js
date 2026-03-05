require('dotenv').config();

const express = require("express");
const app = express();
const cors= require('cors');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path =require('path');


// //middlewares
app.use(cors())
app.use(express.json())

//static files access
app.use(express.static(path.join(__dirname,'./client/build')))


function sendMail(name,email,message){
    console.log(process.env.EMAILID)
    var transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.EMAILID,
            pass:process.env.PASSWORD
        }
    })   
    const subject = 'Mail Regarding Feedback'
    const to = email;
    const from = process.env.EMAILID
    const template = handlebars.compile(fs.readFileSync(path.join(__dirname,'templates/','feedback.hbs'),'utf8'));
    const html = template({name:name,message:message})
 
    const mailOptions = {
        from,
        to, subject,
        html
    }
    
    transporter.sendMail(mailOptions,(error)=>{
        if(error){
            console.log(error);
        }
        else{
            console.log('mail sent');
        }
    })
}

app.post("/",(req,res)=>{
    const {name,email,message} = req.body;
    sendMail(name,email,message);
    res.json('mail sent');
});

app.get('*',function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'));
});

//listen
app.listen(8080,()=>{
    console.log("server Running on Port 8080");
});



