
var express = require('express');
var router = express.Router();
var hdb = require('hdb');
var Rserve = require("rserve-js");
var client = hdb.createClient({
	host:'zeus.hana.validation.eu-central-1.whitney.dbaas.ondemand.com',
	port: 20242,
	databaseName : 'H00',
	user: 'SYSTEM',
	ca: undefined,
	ssl: true,
	password: 'Initial12345678'
});

var response;

exports.index = function(req, res){
	res.render('index');
}

router.get('/test', function(req,res, next){
	res.send('It just works fine');
});

exports.index1 = function(req, res){
	response = res;
	var Rclient = Rserve.connect("10.14.27.185", 8081, function(){
	//	res.render('index', {title: 'Connected to RServ successfully' });
	});
	
	client.on('error', function (err) {
		res.render('index', { title: 'Network error : ' + err });
		});
	client.connect(function (err) {
	    if (err) {
	  	 res.render('index', {title: 'Connection error : '+err})
	    }
		client.exec('DROP TABLE "SYSTEM"."SPAM", "SYSTEM"."SPAMTRAINING", "SYSTEM"."SPAMEVAL"', function (err, result){
			if (!err)
				{
				 createProcedures(res);
				}
			else
				{
				 createProcedures(res);
				}
			client.end();
		});
		
	});
};

function executeSQL(res){
  client.exec('CREATE COLUMN TABLE "SYSTEM"."SPAM"("make" DOUBLE, "address" DOUBLE, "all" DOUBLE, "num3d" DOUBLE, "our" DOUBLE,"over" DOUBLE, "remove" DOUBLE, "internet" DOUBLE, "order" DOUBLE, "mail" DOUBLE, "receive" DOUBLE, "will" DOUBLE, "people" DOUBLE, "report" DOUBLE,"addresses" DOUBLE, "free" DOUBLE, "business" DOUBLE, "email" DOUBLE, "you" DOUBLE, "credit" DOUBLE, "your" DOUBLE, "font" DOUBLE, "num000" DOUBLE, "money" DOUBLE, "hp" DOUBLE, "hpl" DOUBLE, "george" DOUBLE, "num650" DOUBLE, "lab" DOUBLE,"labs" DOUBLE, "telnet" DOUBLE, "num857" DOUBLE, "data" DOUBLE, "num415" DOUBLE,"num85" DOUBLE, "technology" DOUBLE, "num1999" DOUBLE, "parts" DOUBLE,"pm" DOUBLE, "direct" DOUBLE, "cs" DOUBLE,"meeting" DOUBLE, "original" DOUBLE, "project" DOUBLE, "re" DOUBLE, "edu" DOUBLE, "table" DOUBLE, "conference" DOUBLE, "charSemicolon" DOUBLE, "charRoundbracket" DOUBLE, "charSquarebracket" DOUBLE, "charExclamation" DOUBLE, "charDollar" DOUBLE, "charHash" DOUBLE,"capitalAve" DOUBLE, "capitalLong" DOUBLE, "capitalTotal" DOUBLE,"type" VARCHAR(5000), "group" INTEGER);', function (errCreate, resultCreate){
	  client.exec('CREATE COLUMN TABLE "SYSTEM"."SPAMEVAL" LIKE "SYSTEM"."SPAM";', function(spamtrainerr, spamtresult){
		  client.exec('CALL DIVIDE_SPAMDATA();', function (aftertrainerr, aftertrainresult){
			  client.exec('CREATE COLUMN TABLE "SYSTEM"."SPAMTRAINING" LIKE "SYSTEM"."SPAM"', function(strainerr, stresult){
				  client.exec('SELECT COUNT(*) FROM "SYSTEM"."SPAM"', function(counterr, countresult){
					  response.render('index', { title: "Table creation :" + counterr + " Resut :" + countresult });
				  });
			  });
		  });  
	  });
  });	
};


function createProcedures(res){
  client.exec('DROP PROCEDURE "SYSTEM".LOAD_SPAMDATA;', function(res, err){
	client.exec('CREATE PROCEDURE "SYSTEM".LOAD_SPAMDATA(OUT spam "SYSTEM"."SPAM")\nLANGUAGE RLANG AS\nBEGIN\nlibrary(kernlab)\ndata(spam)\nind <- sample(1:dim(spam)[1],2500)\ngroup <- as.integer(c(1:dim(spam)[1]) %in% ind)\nspam <- cbind(spam, group)\nEND;', function (err, result){
	  client.exec('DROP PROCEDURE "SYSTEM".DIVIDE_SPAMDATA;', function(res, err){	
		client.exec('CREATE PROCEDURE "SYSTEM".DIVIDE_SPAMDATA()\nAS BEGIN\nCALL LOAD_SPAMDATA(SPAM);\nInsert into "SYSTEM"."SPAM" select * from :SPAM;\nInsert into "SPAMTRAINING" select * from :SPAM where "group"=1;\nInsert into "SPAMEVAL" select * from :SPAM where "group"=0;\nEND;', function (err, result){
			executeSQL(res);
		});
	  });
	});
  });
}
