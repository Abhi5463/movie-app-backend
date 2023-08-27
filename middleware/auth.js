const jwt = require('jsonwebtoken');
const User = require('../models/User')

exports.verifyToken=async (req, res, next)=>{
  console.log('verifyToken', req.headers);
if(req.headers && req.headers.authorization){
try {
const token = (req.headers.authorization).split(' ')[1];
  const decoded = jwt.verify(token, "secret")
  console.log(decoded);
  const user = await User.findById(decoded.userId);
  if(!user) return res.json({success: false, message:"Unauthorized error"});

  req.user = user;
  next();
} catch (error) {
    if(error.name === "JsonWebTokenError")return res.json({success: false, message:"Unauthorized error: " + error.message});
    if(error.name === "TokenExpiredError")return res.json({success: false, message:"Session expired, please sign in: " + error.message});

    res.json({success: false, message:"Internal server error"});
}
}else{
 res.json({success: false, message:"Unauthorized error"});
}
}