import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema({
   adminId : {
    type : String,
    required : true,
    unique : true
   },
   name : {
    type : String,
    required : true,
    trim : true,
    lowercase : true
   },
   username : {
    type : String,
    required : true,
    unique : true,
    trim : true,
    lowercase : true
   },
   email : {
    type : String,
    required : true,
    unique : true,
    trim : true
   }, 
   password : {
    type : String,
    required : true,
    trim : true
   },
   role : {
    type : String,
    required : true,
    trim : true,
    lowercase : true
   },
   refreshToken : {
      type : String
   }
}, {timestamps : true});

adminSchema.pre("save", async function (next) {
   if(!this.isModified("password")) return next();

   this.password = await bcrypt.hash(this.password, 10);

   console.log(this.password);
   next();
});

adminSchema.methods.checkPassword = async function (password) {
   return await bcrypt.compare(password, this.password)
}

adminSchema.methods.generateAccessToken = function () {
   return jwt.sign({
      _id : this._id,
      adminId : this.adminId,
      name : this.name,
      username : this.username,
      email : this.email,
      role : this.role
   }, process.env.ACCESS_TOKEN_SECRET, {expiresIn : process.env.ACCESS_TOKEN_EXPIRY});
}

adminSchema.methods.generateRefreshToken = function () {
   return jwt.sign({_id : this._id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn : process.env.REFRESH_TOKEN_EXPIRY});
}

export const Admin = mongoose.model("Admin", adminSchema);