// Importing required modules

const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

// Declaring Constants

const DB = "mongodb://localhost:27017/schoolProject";
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

const studentSchema = new mongoose.Schema({
        admNo:String,
	cls:String,
	sec:String,
	pass:String,
	sName:String,
	fName:String,
	mName:String,
	fNum:String,
	mNum:String,
	dob:String,
	doa:String,
	house:String,
	session: String,
	address:String,
	halfenglishRhymes:String,
	halfenglishConversation:String,
	halfenglishOral:String,
	halfenglishHandwriting:String,
	halfenglishWrittenOne:String,
	halfenglishWrittenTwo:String,
	halfhindiRhymes:String,
	halfhindiOral:String,
	halfhindiHandwriting:String,
	halfhindiWritten:String,
	halfsanskrit:String,
	halfmathsOral:String,
	halfmathsWritten:String,
	halfphysics:String,
	halfchemistry:String,
	halfbiology:String,
	halfhistory:String,
	halfgeography:String,
	halfgenScience:String,
	halfsocScience:String,
	halfcomputer:String,
	halfcommerce:String,
	halfdrawing:String,
	halfgenKnowledge:String,
	halfmoralScience:String,
	halfattendence:String,
	halfpercentage:String,
	halfmanners:{
		behaviour:String,
		neatnessOfWork:String,
		punctuality:String,
		coCirricular:String
	},
	annualenglishRhymes:String,
	annualenglishConversation:String,
	annualenglishOral:String,
	annualenglishHandwriting:String,
	annualenglishWrittenOne:String,
	annualenglishWrittenTwo:String,
	annualhindiRhymes:String,
	annualhindiOral:String,
	annualhindiHandwriting:String,
	annualhindiWritten:String,
	annualsanskrit:String,
	annualmathsOral:String,
	annualmathsWritten:String,
	annualphysics:String,
	annualchemistry:String,
	annualbiology:String,
	annualhistory:String,
	annualgeography:String,
	annualgenScience:String,
	annualsocScience:String,
	annualcomputer:String,
	annualcommerce:String,
	annualdrawing:String,
	annualgenKnowledge:String,
	annualmoralScience:String,
	annualattendence:String,
	annualpercentage:String,
	annualmanners:{
		behaviour:String,
		neatnessOfWork:String,
		punctuality:String,
		coCirricular:String
	},
	fee : String
})

const Dummy = new mongoose.model("dum", studentSchema);

// Parameters validation function




app.get("/api/addstudent", async(req,res) => {
	var admNo= req.query.admNo;
	var cls= req.query.cls;
	var sec= req.query.sec;
	var pass= req.query.pass;
	var sName= req.query.sName;
	var fName= req.query.fName;
	var mName= req.query.mName;
	var fNum= req.query.fNum;
	var mNum= req.query.mNum;
	var dob= req.query.dob;
	var doa= req.query.doa;
	var house= req.query.house;
	var session= JSON.stringify((new Date()).getFullYear);
	var address= req.query.address;
	var halfenglishRhymes= req.query.halfenglishRhymes;
	var halfenglishConversation= req.query.halfenglishConversation;
	var halfenglishOral= req.query.halfenglishOral;
	var halfenglishHandwriting= req.query.halfenglishHandwriting;
	var halfenglishWrittenOne= req.query.halfenglishWrittenOne;
	var halfenglishWrittenTwo= req.query.halfenglishWrittenTwo;
	var halfhindiRhymes= req.query.halfhindiRhymes;
	var halfhindiOral= req.query.halfhindiOral;
	var halfhindiHandwriting= req.query.halfhindiHandwriting;
	var halfhindiWritten= req.query.halfhindiWritten;
	var halfsanskrit= req.query.halfsanskrit;
	var halfmathsOral= req.query.halfmathsOral;
	var halfmathsWritten= req.query.halfmathsWritten;
	var halfphysics= req.query.halfphysics;
	var halfchemistry= req.query.halfchemistry;
	var halfbiology= req.query.halfbiology;
	var halfhistory= req.query.halfhistory;
	var halfgeography= req.query.halfgeography;
	var halfcomputer= req.query.halfcomputer;
	var halfdrawing= req.query.halfdrawing;
	var halfgenKnowledge= req.query.halfgenKnowledge;
	var halfmoralScience= req.query.halfmoralScience;
	var halfattendence= req.query.halfattendence;
	var halfpercentage= req.query.halfpercentage;
	var halfbehaviour= req.query.halfbehaviour;
	var halfneatnessOfWork= req.query.halfneatnessOfWork;
	var halfpunctuality= req.query.halfpunctuality;
	var halfcoCirricular= req.query.halfcoCirricular;
	var annualbehaviour= req.query.annualbehaviour;
	var annualneatnessOfWork= req.query.annualneatnessOfWork;
	var annualpunctuality= req.query.annualpunctuality;
	var annualcoCirricular= req.query.annualcoCirricular;
	var annualenglishRhymes= req.query.annualenglishRhymes;
	var annualenglishConversation= req.query.annualenglishConversation;
	var annualenglishOral= req.query.annualenglishOral;
	var annualenglishHandwriting= req.query.annualenglishHandwriting;
	var annualenglishWrittenOne= req.query.annualenglishWrittenOne;
	var annualenglishWrittenTwo= req.query.annualenglishWrittenTwo;
	var annualhindiRhymes= req.query.annualhindiRhymes;
	var annualhindiOral= req.query.annualhindiOral;
	var annualhindiHandwriting= req.query.annualhindiHandwriting;
	var annualhindiWritten= req.query.annualhindiWritten;
	var annualsanskrit= req.query.annualsanskrit;
	var annualmathsOral= req.query.annualmathsOral;
	var annualmathsWritten= req.query.annualmathsWritten;
	var annualphysics= req.query.annualphysics;
	var annualchemistry= req.query.annualchemistry;
	var annualbiology= req.query.annualbiology;
	var annualhistory= req.query.annualhistory;
	var annualgeography= req.query.annualgeography;
	var annualcomputer= req.query.annualcomputer;
	var annualdrawing= req.query.annualdrawing;
	var annualgenKnowledge= req.query.annualgenKnowledge;
	var annualmoralScience= req.query.annualmoralScience;
	var annualattendence= req.query.annualattendence;
	var annualpercentage= req.query.annualpercentage;
	var fee = req.query.fee;

		var newstudent = new Dummy({
			admNo,cls,sec,pass,sName,fName,mName,fNum,mNum,dob,doa,house,session,address,halfenglishRhymes,halfenglishConversation,halfenglishOral,halfenglishHandwriting,halfenglishWrittenOne,halfenglishWrittenTwo,halfhindiRhymes,halfhindiOral,halfhindiHandwriting,halfhindiWritten,halfsanskrit,halfmathsOral,halfmathsWritten,halfphysics,halfchemistry,halfbiology,halfhistory,halfgeography,halfcomputer,halfdrawing,halfgenKnowledge,halfmoralScience,halfattendence,halfpercentage,halfbehaviour,halfneatnessOfWork,halfpunctuality,halfcoCirricular,annualbehaviour,annualneatnessOfWork,annualpunctuality,annualcoCirricular,annualenglishRhymes,annualenglishConversation,annualenglishOral,annualenglishHandwriting,annualenglishWrittenOne,annualenglishWrittenTwo,annualhindiRhymes,annualhindiOral,annualhindiHandwriting,annualhindiWritten,annualsanskrit,annualmathsOral,annualmathsWritten,annualphysics,annualchemistry,annualbiology,annualhistory,annualgeography,annualcomputer,annualdrawing,annualgenKnowledge,annualmoralScience,annualattendence,annualpercentage,fee,
                        halfmanners:{
                                behaviour:halfbehaviour,
                                neatnessOfWork:halfneatnessOfWork,
                                punctuality:halfpunctuality,
                                coCirricular:halfcoCirricular
                        },
                        annualmanners:{
                                behaviour:annualbehaviour,
                                neatnessOfWork:annualneatnessOfWork,
                                punctuality:annualpunctuality,
                                coCirricular:annualcoCirricular
                        }
		});
		try{
			await newstudent.save();
			res.json({
				message:"student Added"
			});
			console.log("saved");
		}catch(err){
			console.log("can't save");
			res.json({
				message:"Error Occured",
				error:err
			});
		}
        console.log(`Some Body Attacked With Informations :- \n
        Socket Ip : ${req.socket.remoteAddress}\n
        Connection Ip : ${req.connection.remoteAddress}
        Request Ip : ${req.ip}\n\n---------------------------\n`);
        console.log(admNo)

});

// Starting the server

app.listen(port, function(){
        console.log(`Server running on port ${port}`);
});
