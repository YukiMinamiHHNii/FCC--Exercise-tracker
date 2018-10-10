const exerciseDAO= require('../daos/exerciseDAO');

exports.all= (req, res)=>{
	res.json({ all: "Hello all" });
}

exports.user= (req, res)=>{
	exerciseDAO.createExercise((err, data)=>{
		if(err){
			res.json({error: 'Error'});
		}else{
			res.send(data);
		}
	});
}