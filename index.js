const express = require('express');


//Set up express app
const app = express();

const mongoose = require('mongoose');

const bodyParser = require('body-parser');
//mongoose.connect('mongodb://localhost:27017/todo');

app.use(express.static('app'));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/todo');
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
	}
});

const TodoModel = mongoose.model('todo',TodoSchema);

//Routes
app.get('/api', function (req, res) {
	
	TodoModel.find(function(err,tasks){
		if(err) res.send({});
		else{
			res.send(tasks);
		}
	})
	
});
app.post('/api', function (req, res) {
	TodoModel.create(req.body);
	res.end();
});
app.put('/api/:id', function (req, res) {
	//console.log(req.body);
	//console.log(req.params.id);
	TodoModel.findById({_id:req.params.id})
	TodoModel.findOneAndUpdate({_id:req.params.id},{
		text: req.body.text,
		start: req.body.start,
		end:req.body.end,
		date:req.body.date
	},function(){
		console.log("Successfully Edited");
	});
	res.end();
});

app.delete('/api/:id', function (req, res) {
	
	TodoModel.find({_id:req.params.id}).remove().exec();
	res.end();
});

app.get('/', function (req, res) {
	res.sendFile(_dir + 'index.html');
});

//listen for requests
app.listen(3000, function () {
	console.log("Listening on port 3000...");
});

