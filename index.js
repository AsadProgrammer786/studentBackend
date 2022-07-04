// Importing required modules

const express = require("express");
const jwt = require("jsonwebtoken");
const notif = require("./notif.js");
const mongoose = require("mongoose");
const fs = require("fs");
const decode = require("node-base64-image").decode;
const Schemas = require("./Schema.js");
require('dotenv').config();
const cors = require("cors");
var bodyParser = require('body-parser');
const jwtKey = process.env.SASTA_JWT;


// Declaring Constants

const DB = "mongodb+srv://snips:snips@cluster0.hscsw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const DB = 'mongodb://localhost:27017/schoolProject';
app = express();
const port = process.env.PORT || 8080;
app.use(cors());
app.use(bodyParser.urlencoded({
    limit: '10mb',
    parameterLimit: 100000,
    extended: false 
}));

app.use(bodyParser.json({
    limit: '10mb'
}));
// Connecting to Database

mongoose.connect(DB).then(() => {
	console.log("Connected to Database");
}).catch(err => console.log("Error while connecting - "+err));

mongoose.connection.on("error", err => console.log("Runtime Connection Error - "+err));

// const TimeTable = new mongoose.model("TimeTable", schemas.timeTableSchema);
// const Syllabus = new mongoose.model("Syllabus", schemas.syllabusSchema);
const Students = new mongoose.model("student", Schemas.studentSchema);
const Teacher = new mongoose.model("teachers", Schemas.teacherSchema);
const Notice = new mongoose.model("notices", Schemas.noticeSchema);
const HW = new mongoose.model("assignments", Schemas.assignSchema);
const Chat = new mongoose.model("chattings", Schemas.chatSchema);
const TeacherChat = new mongoose.model("adminchat", Schemas.teacherIssueSchema);
const notification = new mongoose.model("notification", Schemas.notifSchema);

// Verify Session Endpoint - New One this one will be used for both student and admin.
// We can check the account type via role in the token, three roles 1-student,2-teacher,3-admin

// Student Login Endpoint

app.get("/api/loginStudent", async(req,res) => {
	var admNo = req.query.admNo;
	var phone = req.query.phone;
	var token = req.query.token;
	var p = [admNo,phone];
	// Token Validation Here
	var Student = await Students.find({admNo : admNo, fNum : phone});
	var teach = await Teacher.find({adhar : admNo, phone : phone});
	if(Student.length>0) {
		var data = {
			admNo,
			phone,
			role:"student",
			expiry : new Date().getTime() + 432000000
		};
		var token = jwt.sign(data, jwtKey);
		res.json({
			message:"Login Successful",
			Student,
			token,
			role: "student",
			expiry : new Date().getTime() + 432000000
		});
	}
	else if(teach.length > 0) {
		var data = {
			admNo,
			phone,
			role:"teacher",
			expiry : new Date().getTime() + 432000000
		};
		var token = jwt.sign(data, jwtKey);
		res.json({
			message:"Login Successful",
			teach,
			role: "teacher",
			token,
			expiry : new Date().getTime() + 432000000
		});
	}
	else{
		res.json({
			message:"Student not found"
		});
	}
});

app.get("/api/verifySession", async(req,res) => {
	var token = req.query.token;


	try{
		var data = jwt.verify(token, jwtKey);
		res.json({
			message:"Token Valid",
			data
		});
	}catch(err){
		console.log(err)
		res.json({
			message:"Token Invalid"
		});
	}
});
	
app.get("/api/verifyRole", async(req, res) => {
	var token = req.query.token;
	var role = req.query.role;
	
	
		try{
			var data = jwt.verify(token, jwtKey);
			// console.log(role)
			if(data.role == role) {
			res.json({
				message:"Token Valid",
				data
			});
		} else {
			res.json({
				message:"Token Invalid"
			});
		}
		}catch(err){
			console.log(err)
			res.json({
				message:"Token Invalid"
			});
		}
})
// Starting the server

app.get("/api/getTimeTable", async(req, res) => {
	var token = req.query.token;
	var calass = req.query.class;
	var tokenValid = true;
	
		try{
			var data = jwt.verify(token, jwtKey);
			res.json({
				link: 'https://studentbackendpelese.herokuapp.com/Time-Table/'+calass+".jpg",
				message: 'success'
			})
		}catch(err){
			console.log(err)
			res.json({
				message:"Token Invalid"
			});
		}
});

app.get("/Time-Table/:id", async(req, res) => {
	var id = req.path;
	id = id.replace("/Time-Table/:");
	console.log(id)
	res.sendFile(__dirname+"/"+id);
});

app.get("/api/getNotice", async(req, res) => {
	var token = req.query.token;
	
	
		try{
			var data = jwt.verify(token, jwtKey);
			var notice = await Notice.find({});
			notice = notice.length>40?notice.split(0, 40):notice;
			res.json({
				message: 'yes',
				data : notice.reverse()
			})
		}catch(err){
			console.log(err)
			res.json({
				message: 'no'
			});
		}
});

app.get("/api/getSyllabus", async(req, res) => {
	var token = req.query.token;
	var cls = req.query.cls;
	
	
		try{
			var data = jwt.verify(token, jwtKey);
			console.log("Done")
			res.download(__dirname+'/Syllabus/'+cls+'.jpg');
		}catch(err){
			res.json({
				message: 'no'
			});
		}
});

app.get("/api/getClassStudents", async(req, res) => {
	var token = req.query.token;
	var cls = req.query.cls;
	var sec = req.query.sec;
	

	try{
		var data = jwt.verify(token, jwtKey);
		if(cls!=""&&sec!="") {
			var st = await Students.find({cls : cls, sec : sec});
			res.json({
				message : 'yes',
				data : st
			});
		}
		else {
			res.json({
				message : 'ncls'
			})
		}
	}catch(err){
		res.json({
			message: 'no'
		});
	}
});


app.get("/api/getPrev", async(req, res) => {
	var token = req.query.token;
	var cls = req.query.cls;
	var sub = req.query.sub;
	
	
	try{
		sub = sub.split("-");
		cls = cls.split("-");
		var data = jwt.verify(token, jwtKey);
		if(cls!=""&&sub!="") {
			var ab = await HW.find({});
			var h = await ab.filter((e) => {
				var aa = e['subject'];
				var bb = e['cls'];
				if(cls.includes(bb)&&sub.includes(aa)) {
					return e;
				}
			});

			h = h.reverse();
			res.json({
				message : 'yes',
				data : h
			});
		}
		else {
			res.json({
				message : 'ncls'
			})
		}
	}catch(err){
		console.log(err)
		res.json({
			message: 'no'
		});
	}
});

app.get("/api/deleteAssign", async(req, res) => {
	var token = req.query.token;
	var id = req.query.id;
	console.log(id);
	

	try{
		var data = jwt.verify(token, jwtKey);
		var d = await HW.deleteOne({_id : id});
		console.log(d);
		res.json({
			message:"yes",
			data
		});
	}catch(err){
		console.log(err)
		res.json({
			message:"er"
		});
	}
});

app.get("/api/getPrevSt", async(req, res) => {
	var token = req.query.token;
	var cls = req.query.cls;
	console.log(cls);
	

	try{
		var data = jwt.verify(token, jwtKey);
		var d = await HW.find({cls : cls});
		res.json({
			message:"yes",
			data : d.reverse()
		});
	}catch(err){
		console.log(err)
		res.json({
			message:"er"
		});
	}
});

app.get("/api/verifySt", async(req, res) => {
	var token = req.query.token;
	var cls = req.query.cls;
	var admNo = req.query.admNo;
	var sec = req.query.sec;
	var id = req.query.id;
	var fNum = req.query.fNum;
	var fee = req.query.fee;
	var mName = req.query.mName;
	var tokenValid = true;
	try{
		var data = jwt.verify(token, jwtKey);
		var d = await Students.find({_id : id,admNo : admNo, cls : cls, sec : sec, fNum : fNum, mName : mName, fee : fee});
		if(d.length == 1) {
			res.json({
				message:"verified",
			});
		}
		else {
			res.json({
				message: "invalid",
			});
		}
	}catch(err){
		console.log(err)
		res.json({
			message:"er"
		});
	}
});

app.get("/api/getTeachers", async(req, res) => {
	var token = req.query.token;
	try{
		var data = jwt.verify(token, jwtKey);
		var r = await Teacher.find({});

		res.json({
			message:"done",
			data : r
		});
	}catch(err){
		console.log(err)
		res.json({
			message:"er"
		});
	}
});

app.post("/api/uploadAssignment", async(req, res) => {
	var token = req.body.token;
	var cls = req.body.cls;
	var desc = req.body.desc;
	var subject = req.body.subject;
	var topic = req.body.topic;
	var imgs = req.body.img;
	var imgArr;
	try {
	if(imgs.length!=0) {
		await convertToImg(imgs).then(res => imgArr = res);
	}
	else {
		imgArr = imgs.split("");
	}
} catch(err) {
	console.log("Error Hai\n", err);
}
	var date = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()} - ${new Date().getHours()}:${new Date().getMinutes()<10?"0"+new Date().getMinutes():new Date().getMinutes()}`;

	

	try{
		var data = jwt.verify(token, jwtKey);
		var arr = {
			date : date,
			cls : cls,
			topic : topic,
			desc : desc,
			img : imgArr,
			subject : subject
		}
		var data = new HW(arr);
		console.log(data);
		await data.save();
		res.json({
			message : "done"
		});
		publishNotif("New "+subject+" Assignment", "click to see new assignment", {cls : cls});
	}catch(err){
		console.log(err);
		res.json({
			message: 'no'
		});
	}
});
async function convertToImg(imgs) {
	try {
	var n = new Date().getTime();
	var arr = [];
	var  i = 0;
	for(x in imgs) {
		const base64Data = imgs[x].split('base64,')[1];
		await decode(base64Data, { fname: "./homeworksImg/"+(n + i), ext: 'png' });
		arr.push("https://studentbackendpelese.herokuapp.com/homeworksImg/"+(n+i)+".png");
		i++;
	}
} catch(err) {

	console.log(err);
}
return arr;
}

app.get("/homeworksImg/:id", (req, res) => {
	var d = req.query.down;
	if(d=="yes") {
		res.download(__dirname+req.path);
	}
	else {
		res.sendFile(__dirname+req.path);
	}
});


app.get("/api/submitTeacherQuery", async(req,res) => {
	console.log("Hi Dude");
	var token = req.query.token;
	var subject = req.query.subject;
	var f = req.query.from;
	var prob = req.query.problem;
	var d = new Date();
	var date = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()} - ${new Date().getHours()}:${new Date().getMinutes()<10?"0"+new Date().getMinutes():new Date().getMinutes()}`;
	try{
		var data = jwt.verify(token, jwtKey);
		var data = {
			date : date,
			from : f,
			topic : subject,
			message : prob
		};
		var r = await new TeacherChat(data).save();
		res.json({
			message:"yes",
			r
		});
	}catch(err){
		console.log(err)
		res.json({
			message:"no"
		});
	}
});


app.get("/api/updatenId", async(req, res) => {
	var token = req.query.token;
	var nId = req.query.nId;
	var uId = req.query.uId;
	var role = req.query.role;
	var name = req.query.name;
	var cls = req.query.cls;
	var d = new Date();
	var date = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()} - ${new Date().getHours()}:${new Date().getMinutes()<10?"0"+new Date().getMinutes():new Date().getMinutes()}`;
	try{
		var data = jwt.verify(token, jwtKey);
		var a = await notification.find({nId : nId});
		if(a.length == 0) {
			var arr = {
				nId : nId,
				uId : uId,
				role : role,
				name : name,
				cls : cls,
				updateDate : date
			};
			var x = await new notification(arr).save();
			console.log(x);
			res.json({
				message: "saved",
				data : x
			});
		}
		else {
			var arr = {
				nId : nId,
				uId : uId,
				role : role,
				name : name,
				cls : cls,
				updateDate : date
			};
			// var x = await new notification(arr).save();
			var x = await notification.updateOne({nId:nId}, {
				$set:{
					nId : nId,
					uId : uId,
					role : role,
					name : name,
					cls : cls,
					updateDate : date
				}
			});
			console.log(x);
			res.json({
				message:"updated",
				data : x
			});
		}
	}catch(err){
		console.log(err)
		res.json({
			message:"no"
		});
	}
});


const publishNotif = async(title, body, to) => {
	try {
		if(!to['cls']==undefined) {
			var d = await notification.find({cls : to['cls']});
			var arr = [];
			await d.forEach((e) => {
				arr.push(e['nId']);
			});
			notif.fetchNow(title, body, arr);
		}
	} catch(err) {
		// Eat Five Star Do Nothing
	}
}


app.listen(port, function(){
	console.log(`Server running on port ${port}`);
});
