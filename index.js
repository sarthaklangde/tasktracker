const express = require('express');


//Set up express app
const app = express();

const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');


app.use(express.static('app'));
app.use(bodyParser.json());

require('./app/config/passport')(passport);

app.use(session({
    secret: 'shhsecret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


//mongoose.connect('mongodb://localhost/todo');
mongoose.connect('mongodb://ngtasktrackeruser:ngtasktrackerpassword@ds135812.mlab.com:35812/ngtasktracker');
mongoose.Promise = global.Promise;
//Model
const TodoSchema = new mongoose.Schema({
	text:{
		type: String,
		required: [true,"Text required"]
	},
	start:{
		type: String,
		required: [true,"Start time required"]
	},
	end:{
		type: String,
		required: [true,"End time required"]
	},
	date:{
		type: String,
		required: [true,"Date required"]
	},
	user_id:{
		type:mongoose.Schema.ObjectId,
	}
});

const TodoModel = mongoose.model('todo',TodoSchema);

//Routes
app.post('/api/user/',function(req,res){
	//console.log(req.body._id);
	/*TodoModel.findById({user_id:req.body._id},function(err,tasks){
		console.log(tasks);
	});*/
	TodoModel.find({user_id:req.body._id},function(err,tasks){
		if(err) res.send({});
		else{
			res.send(tasks);
		}
	});
	
});
app.get('/api', function (req, res) {
	//req.flash('info',"got it!");
	console.log(req.user);
	TodoModel.find(function(err,tasks){
		if(err) res.send({});
		else{
			res.send(tasks);
		}
	});
	
	
});


app.post('/api', function (req, res) {
	TodoModel.create(req.body);
	res.end();
});
app.put('/api/:id', function (req, res) {
	//console.log(req.body);
	//console.log(req.params.id);
	
	TodoModel.findOneAndUpdate({_id:req.params.id},{
		text: req.body.text,
		start: req.body.start,
		end:req.body.end,
		date:req.body.date,
		user_id:req.body.user_id,
	},function(){
		console.log("Successfully Edited");
	});
	res.end();
});

app.delete('/api/:id', function (req, res) {
	TodoModel.findByIdAndRemove(req.params.id).exec();
	console.log("HJAHSJKAHJSK");
	//TodoModel.findById(req.params.id).remove().exec();
	res.end();
});

app.get('/', function (req, res) {
	res.sendFile(__dirname + 'index.html');
});

app.get('/tasks', isLoggedIn, function(req,res){
	//	console.log(req.user);
	res.sendFile(__dirname +'/app/tasks.html',{userid: req.user});
});

app.get('/identity', isLoggedIn, function(req,res){
	//	console.log(req.user);
	res.send(req.user);
});


app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));
//app.get('/connect/facebook', passport.authorize('facebook', { scope : ['email'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { 
  successRedirect: '/tasks',
  failureRedirect: '/',
}));

app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	})
//listen for requests
app.listen(process.env.PORT || 3000, function () {
	console.log("Listening on port 3000...");
});

function isLoggedIn(req, res, next) {  
  if (req.isAuthenticated())
      return next();
  
  res.redirect('/');
}