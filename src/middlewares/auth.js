import jwt  from "jsonwebtoken";
import User from "../models/user.js";

export const isLoggedIn = async(req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(401).json({success: false, message: "No token provided"});
    }
    
    // Extract the token
    const token = authHeader.split(" ")[1];

    // verify the token
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
            if(err){
                res.status(403).json({success: false, message: "Invalid token"})
            }else{
                req.user = decoded
                console.log({decoded});
                next();
            }
        })
    }else{
        res.status(401).json({success: false, message: "You're are not authenticated"}) 
    }
}

export const isAdmin = async (req, res, next) => {
    try {
      const userId = req.user._id;
      const user = await User.findById({ _id: userId });
      console.log(user);
  
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
  
    //   check user's role
      if (user.role === 1) {
          next();
      } else {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized User" });
      }
    } catch (err) {
      console.log(err);
      res.json({ success: false, message: "Error checking admin" });
    }
  };