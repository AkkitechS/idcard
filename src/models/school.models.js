import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { generateID } from "../utils/id_generator";
import jwt from "jsonwebtoken";

const schoolSchema = new mongoose.Schema({
    schoolId : {
        type : String,
        required : true,
        unique : true,
        trim : true
    },
    schoolName : {
        type : String,
        required : true,
        trim : true,
        lowercase : true
    },
    schoolUsername : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true
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
    students : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Student"
        }
    ],
    refreshToken : {
        type : String
    }
}, {timestamps : true});

schoolSchema.pre("save", async function (next) {
    if(!this.isModified()) return next();

    this.schoolId = generateID(this.schoolUsername.trim().toUpperCase().split(" ").join(""));
    this.password = await bcrypt.hash(this.password, 10);
});

schoolSchema.methods.checkPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

schoolSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id : this._id,
        schoolId : this.schoolId,
        schoolName : this.schoolName,
        schoolUsername : this.schoolUsername,
        role : this.role
    }, process.env.ACCESS_TOKEN_SECRET, {expiresIn : process.env.ACCESS_TOKEN_EXPIRY});
};

schoolSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id : this._id
    }, process.env.REFRESH_TOKEN_SECRET, {expiresIn : process.env.REFRESH_TOKEN_EXPIRY});
};

export const School = mongoose.model("School", schoolSchema);