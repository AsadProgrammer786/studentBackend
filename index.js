// Importing required modules

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const schemas = require("./Schema");
const cors = require('cors');

// Declaring Constants

const DB = "mongodb://localhost:27017/schoolProject";
const jwtKey = "yesecretha";
const AUTHTOKEN = "ultraprotoken";
app = express();
const port = process.env.PORT || 8080;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(express.static("public"));

// Connecting to Database

mongoose.connect(DB).then(() => {
	console.log("Connected to Database");
}).catch(err => console.log("Error while connecting - "+err));

mongoose.connection.on("error", err => console.log("Runtime Connection Error - "+err));

// Creating Models

const Admin = new mongoose.model("Admin", schemas.adminSchema);
const Message = new mongoose.model("Message", schemas.messageSchema);
const Notice = new mongoose.model("Notice", schemas.noticeSchema);
const Student = new mongoose.model("Student", schemas.studentSchema);


// Parameters validation function

function validateParams(a){
	var valid = true;
	a.forEach(function(item){
		if(item==""||item==null){
			valid = false;
		}
	});
	return valid;
}



// Endpoints


// 0 - Normal Endpoint
app.get("/", (req,res) => {
	res.sendFile(__dirname+"/public/index.html");
});

// 1 - Admin Creation Endpoint

app.get("/api/createAdsfsfgsgmin", async(req,res) => {
	var name = req.query.name;
	var password = req.query.password;
	if(req.query.token!=AUTHTOKEN){
		res.json({
			message:"Invalid Authtoken"
		});
	}else{
		var hashedPassword = bcrypt.hashSync(password, 10);
		const newAdmin = new Admin({
			name,
			password:hashedPassword,
			createdOn : `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`
		});
		try{
			var result = await newAdmin.save();
			console.log("Admin Creation - "+result);
			res.json({
				message:"Admin Created",
				data:result
			});
		}catch(err){
			console.log("Admin Creation Error - "+err);
			res.json({
				messgae:"Admin Not Created",
				error:err
			});
		}
	}
});

// 2 - Admin Login Endpoint

app.get("/api/loginAdmin", async(req,res) => {
	var name = req.query.name;
	var password = req.query.password;
	var p = [name,password];
	if(req.query.token!=AUTHTOKEN){
		res.json({
			message:"Invalid Authtoken"
		});
	}else{
		var Admins = await Admin.find({name});
		if(!Admins.length>0){
			res.json({
				message:"Account not found"
			});
		}else if(!bcrypt.compareSync(password, Admins[0].password)){
			res.json({
				message:"Wrong Password"
			});
		}else{
			var data = {
				name,
				role:"admin"
			};
			var token = jwt.sign(data, jwtKey);
			res.json({
				message:"Login Successful",
				token
			});
		}
	}
});

// 3 - Verify Session Endpoint

app.post("/api/verifySession", async(req,res) => {
	var email = req.body.email;
	var token = req.body.token;
	var p = [email,token];
	if(req.query.token!=AUTHTOKEN){
		res.json({
			message:"Invalid Authtoken"
		});
	}else if(!validateParams(p)){
		res.json({
			message:"Invalid Parameters"
		});
	}else{
		try{
			var td = jwt.verify(token, jwtKey);
			if(td.email==email){
				res.json({
					message:"Token Valid"
				});
			}else{
				res.json({
					message:"Token Invalid"
				});
			}
		}catch(err){
			res.json({
				message:"Token Invalid"
			});
		}
	}
});

// 4 - Contact Message Endpoint

app.get("/api/addMessage", async(req,res) => {
	var name = req.query.name;
	var email = req.query.email;
	var phone = req.query.phone;
	var msg = req.query.msg;
	var p = [name,email,phone, msg];
	console.log(p)
	if(req.query.token!=AUTHTOKEN){
		res.json({
			message:"Invalid Authtoken"
		});
	}else if(!validateParams(p)){
		res.json({
			message:"Invalid Parameters"
		});
	}else{
		var newMsg = new Message({
			name : name,
			email : email,
			phone : phone,
			msg : msg,
			date : (new Date().getDate())+"/"+(new Date().getMonth())+"/"+(new Date().getFullYear()),
			time : (new Date().getHours())+":"+(new Date().getMinutes()),
		});
		try{
			await newMsg.save();
			res.json({
				message:"Message Added"
			});
		}catch(err){
			res.json({
				message:"Error Occured",
				error:err
			});
		}
	}
});

// 5 - Get Messages Endpoint

app.get("/api/getMessage", async(req,res) => {
	var date = req.query.date;
	if(req.query.token!=AUTHTOKEN){
		res.json({
			message:"Invalid Authtoken"
		});
	}else if(date!=null){
		try{
			var data = await Message.find({addedOn:date});
			res.json({
				message:"Success",
				total:data.length,
				data
			});
		}catch(err){
			res.json({
				message:"Error Occured",
				error:err
			});
		}
	}else{
		try{
			var data = await Message.find();
			res.json({
				message:"Success",
				total:data.length,
				data
			});
		}catch(err){
			res.json({
				message:"Error Occured",
				error:err
			});
		}
	}
});

// 6 - Add Notice Endpoint

app.get("/api/addNotice", async(req,res) => {
	var notice = req.query.notice;
	var p = [notice];
	if(req.query.token!=AUTHTOKEN){
		res.json({
			message:"Invalid Authtoken"
		});
	}else if(!validateParams(p)){
		res.json({
			message:"Invalid Parameters"
		});
	}else{
		var newNotice = new Notice({
			date : (new Date().getDate())+"/"+(new Date().getMonth())+"/"+(new Date().getFullYear()),
			time : (new Date().getHours())+":"+(new Date().getMinutes()),
			notice : notice
		});
		try{
			await newNotice.save();
			res.json({
				message:"Notice Added"
			});
		}catch(err){
			res.json({
				message:"Error Occured",
				error:err
			});
		}
	}
});

// 7 - Get Notice Endpoint

app.get("/api/getNotice", async(req,res) => {
	if(req.query.token!=AUTHTOKEN){
		res.json({
			message:"Invalid Authtoken"
		});
	}else{
		try{
			var data = await Notice.find();
			res.json(
				data
			);
		}catch(err){
			res.json({
				message:"Error Occured",
				error:err
			});
		}
	}
});

// 8 - Delete Notice Endpoint

app.get("/api/deleteNotice", async(req,res) => {
	var id = req.query.id;
	var p = [id];
	if(req.query.token!=AUTHTOKEN){
		res.json({
			message:"Invalid Authtoken"
		});
	}else if(!validateParams(p)){
		res.json({
			message:"Invalid Parameters"
		});
	}else{
		try{
			var result = await Notice.deleteOne({_id:id});
			res.json({
				result
			});
		}catch(err){
			res.json({
				message:"Error Occured",
				error:err
			});
		}
	}
});

// 9 - Edit Notice Endpoint

app.get("/api/editNotice", async(req,res) => {
	var notice = req.query.notice;
	var id = req.query.id;
	var p = [notice,id];
	if(req.query.token!=AUTHTOKEN){
		res.json({
			message:"Invalid Authtoken"
		});
	}else if(!validateParams(p)){
		res.json({
			message:"Invalid Parameters"
		});
	}else{
		try{
			var result = await Notice.updateOne({_id:id}, {
				$set:{
					notice : notice
				}
			});
			res.json({
				result
			});
		}catch(err){
			res.json({
				message:"Error Occured",
				error:err
			});
		}
	}
});

// 10 - Get Students Data

app.get("/api/getStudent", async(req,res) => {
	var admNo = req.query.admNo;
	// var admNo = "";
	var cls = req.query.cls;
	cls = cls==""?cls="X":cls;
	var section = req.query.sec;
	var house = req.query.house;
	var egl = req.query.egl;
	var halfPer = req.query.halfPercentage;
	var annualfPer = req.query.annualPercentage;
	var halfAtt = req.query.halfAtt;
	var annualAtt = req.query.annualAtt;
	var dob = req.query.dob;
	var doa = req.query.doa;
	var feee = req.query.fee;
	var newArr = new Array();
	Student.find({admNo:{$regex : admNo}, sec:{$regex : section},egl: {$regex:egl}, cls : cls, halfpercentage: {$gte: halfPer}, house:{$regex : house}, annualpercentage: {$gte : annualfPer}
		, halfattendence: {$gte: halfAtt}, annualattendence: {$gte: annualAtt}, dob : {$regex : dob}, doa : {$regex : doa}
	}, (err, data) => {
		if(data.length>=200) {
			data = data.slice(0, 200);
			res.send(data);
		}
		else {
			res.send(data);
		}
	})
});
// 11 - Add Student Endpoint

app.post("/api/addStudent", async(req,res) => {
	var name = req.query.name;
	var admNo = req.query.admNo;
	var cls = req.query.cls;
	var section = req.query.section;
	var dob = req.query.dob;
	var doa = req.query.doa;
	var house = req.query.house;
	var address = req.query.address;
	var phoneOne = req.query.phoneOne;
	var phoneTwo = req.query.phoneTwo;
	var fatherName = req.query.fName;
	var motherName = req.query.mName;

	if(req.query.token!=AUTHTOKEN){
		res.json({
			message:"Invalid Authtoken"
		});
	}else if(!validateParams(p)){
		res.json({
			message:"Invalid Parameters"
		});
	}else{
		var newStudent = new Student({
			admNo,cls,section,details:{
				name,fatherName,motherName,dob,doa,house,address,phoneOne,phoneTwo
			}
		});
		try{
			await newStudent.save();
			res.json({
				message:"Student Added"
			});
		}catch(err){
			res.json({
				message:"Error Occured",
				error:err
			});
		}
	}
});

// 12 - Edit Student Data


// 13 - Delete Student

app.get("/api/deleteStudent", async(req,res) => {
	var admNo = req.query.admNo;
	var p = [admNo];
	if(req.query.token!=AUTHTOKEN){
		res.json({
			message:"Invalid Authtoken"
		});
	}else if(!validateParams(p)){
		res.json({
			message:"Invalid Parameters"
		});
	}else{
		try{
			var result = await Student.deleteOne({admNo});
			res.json({
				result
			});
		}catch(err){
			res.json({
				message:"Error Occured",
				error:err
			});
		}
	}
});

// Starting the server

app.listen(port, function(){
        console.log(`Server running on port ${port}`);
});