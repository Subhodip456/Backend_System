const db = require("../model/db");
const store_data_model= require("../model/store-data-model");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dotenv = require("dotenv");

dotenv.config({path:'config.env'});
const jwtSecret = process.env.ACCESS_TOKEN_SECRET;


exports.createUser = async(req,res,next) => {
	try {
    const { username, email, password, full_name, age, gender } = req.body;

    if (!username || !email || !password || !full_name) {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_REQUEST',
        message: 'Invalid request. Please provide all required fields: username, email, password, full_name.',
      });
    }

    // Check if username or email already exists in the database
    const existingUser = await db.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      const errorCode = existingUser.username === username ? 'USERNAME_EXISTS' : 'EMAIL_EXISTS';
      return res.status(400).json({
        status: 'error',
        code: errorCode,
        message: `The provided ${errorCode === 'USERNAME_EXISTS' ? 'username' : 'email'} is already taken. Please choose a different one.`,
      });
    }

    // Additional password validation
    if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_PASSWORD',
        message: 'The provided password does not meet the requirements. Password must be at least 8 characters long and contain a mix of uppercase and lowercase letters, numbers, and special characters.',
      });
    }

    // Additional age validation
    if (!Number.isInteger(age) || age <= 0) {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_AGE',
        message: 'Invalid age value. Age must be a positive integer.',
      });
    }

    // Check if gender is provided
    if (!gender) {
      return res.status(400).json({
        status: 'error',
        code: 'GENDER_REQUIRED',
        message: 'Gender field is required. Please specify the gender (e.g., male, female, non-binary).',
      });
    }

    // Save the user to the database
    const newUser = new db({ username, email, password, full_name, age, gender });
    await newUser.save();

    return res.status(200).json({
      status: 'success',
      message: 'User successfully registered!',
      data: {
        user_id: newUser._id,
        username,
        email,
        full_name,
        age,
        gender,
      },
    });
  } catch (err) {
    next(err);
  }	
}


exports.generateTokens = async (req,res,next) => {
  try{
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: 'error',
        code: 'MISSING_FIELDS',
        message: 'Missing fields. Please provide both username and password.',
      });
    }

    // Find the user in the database
    const user = await db.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials. The provided username or password is incorrect.',
      });
    }

    // Generate an access token with a 1-hour expiration time
    const token = jwt.sign({ username: user.username }, jwtSecret, { expiresIn: '1h' });

    return res.status(200).json({
      status: 'success',
      message: 'Access token generated successfully.',
      data: {
        access_token: token,
        expires_in: 3600,
      },
    });
  }
  catch(err){
    next(err);
  }
}

exports.storeData = async (req,res,next) => {
	try{
		const {key,value} = req.body;
		if (!key || !value) {
		return res.status(400).json({
        status: 'error',
        code: 'MISSING_FIELDS',
        message: 'Missing fields. Please provide both key and value.',
      });
    }
	
	//Check if provided key is valid or Missing
	if (!key) {
		return res.status(400).json({
        status: 'error',
        code: 'INVALID_KEY',
        message: 'The provided key is not valid or missing.',
      });
    }
	
	//Check if provided value is valid or Missing
	if (!value) {
		return res.status(400).json({
        status: 'error',
        code: 'INVALID_VALUE',
        message: 'The provided value is not valid or missing.',
      });
    }
	
	// Find the key in the database
    const user = await store_data_model.findOne({key});
	console.log("user =",user);
	
	// Store the key-value pair in the database if does'nt exists
    if (!user) {
    const newUser = new store_data_model({key,value});
    await newUser.save();

    return res.status(200).json({
      status: 'success',
      message: 'Data stored successfully.',
    });
    }
	// Check if the key already exists
	else{
	return res.status(400).json({
        status: 'error',
        code: 'KEY_EXISTS',
        message: 'The provided key already exists in the database. To update an existing key, use the update API.',
      });
	}
	 }
	catch(err){
		next(err);
	}
}

exports.retrieveData = async(req,res,next) => {
	try{
		const fetchKey = req.params.key;
		const data = await store_data_model.find({key:fetchKey});
		if(!data[0].key){
		return res.status(400).json({
			status:'error',
			code:'KEY_NOT_FOUND',
			message:'The provided key does not exist in the database.',
		})
		}
		else{
		return res.status(200).json({
		  "status": "success",
		  "data": {
			"key": data[0].key,
			"value":data[0].value
		  }
		});
		}
	}
	catch(err){
		next(err);
	}
}


exports.updateData = async(req,res,next) => {
	try{
		const fetchKey = req.params.key;
		const data = await store_data_model.findOneAndUpdate({key:fetchKey},{
			$set:{
			   value:req.body.value
			}
		},{new:true});
		console.log("data",data)
		if(!data.key){
		return res.status(400).json({
			status:'error',
			code:'KEY_NOT_FOUND',
			message:'The provided key does not exist in the database.',
		})
		}
		else{
		return res.status(200).json({
		  "status": "success",
		  "message": "Data updated successfully."
		});
		}
	}
	catch(err){
		next(err);
	}
}

exports.deleteData = async(req,res,next) => {
	try{
		const fetchKey = req.params.key;
		const data = await store_data_model.deleteOne({key:fetchKey});
		console.log("data",data)
		if(data.acknowledged==false){
		return res.status(400).json({
			status:'error',
			code:'KEY_NOT_FOUND',
			message:'The provided key does not exist in the database.',
		})
		}
		else{
		return res.status(200).json({
		  "status": "success",
		  "message": "Data deleted successfully."
		});
		}
	}
	catch(err){
		next(err);
	}
}