var USE_DB = false;
var mongojs = USE_DB ? require("mongojs") : null;
var db = USE_DB ? mongojs('localhost:27017/odieTD', ['account','progress']) : null;

//account:  {username:string, password:string}
//progress:  {username:string, items:[{id:string,amount:number}]}

Database = {};
Database.isValidPassword = function(data,cb){
    if(!USE_DB)
        return cb(true);
	db.account.findOne({username:data.username,password:data.password},function(err,res){
		if(res)
			cb(true);
		else
			cb(false);
	});
}
Database.isUsernameTaken = function(data,cb){
    if(!USE_DB)
        return cb(false);
	db.account.findOne({username:data.username},function(err,res){
		if(res)
			cb(true);
		else
			cb(false);
	});
}
Database.addUser = function(data,cb){
    if(!USE_DB)
        return cb();
	db.account.insert({username:data.username,password:data.password,exp:0,score:1},function(err){
        Database.savePlayerProgress({
        	username:data.username,
        	score:1,
			exp:0,
        },function(){
            cb();
        })
	});
}
Database.getPlayerProgress = function(username,cb){
    if(!USE_DB)
        return cb({items:[]});
	db.account.findOne({username:username},function(err,res){
		cb({
			score:res.score,
			exp:res.exp,
			});
	});
}
Database.savePlayerProgress = function(data,cb){
	if(USE_DB == false) return;
	console.log("WE GON SAVE");
	console.log(data);
	db.account.findAndModify({
		query: { username: data.username },
		update: { $set: { score: data.score, exp: data.exp} },
		new: true
	}, function (err, doc, lastErrorObject) {
		console.log(doc);
	});
}
