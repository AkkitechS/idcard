import mongoose from "mongoose";
import { generateID } from "../utils/id_generator";

const studentSchema = new mongoose.Schema({
    studentId : {
        type : String,
        required : true,
        unique : true,
        trim : true
    },
    studentName : {
        type : String,
        required : true,
        trim : true,
        lowercase : true
    },
    studentRollNo : {
        type : String,
        required : true,
        trim : true
    },
    studentClass : {
        type : String,
        required : true,
        trim : true
    },
    section : {
        type : String,
        required : true,
        trim : true,
        lowercase : true
    },
    dob : {
        type : Date,
        required : true
    },
    address : {
        type : String,
        required : true,
        trim : true,
        lowercase : true
    },
    bloodGroup : {
        type : String,
        required : true,
        trim : true,
        lowercase : true
    },
    admissionNo : {
        type : true,
        required : true,
        trim : true
    },
    schoolName : {
        type : String,
        required : true,
        trim : true,
        lowercase : true
    },
    schoolId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "School"
    },
    contactNo : {
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
    passportLink : {
        type : String,
        required : true,
        trim : true
    }
}, {timestamps : true});

studentSchema.pre("save", async function (next) {
    if(!this.isModified()) return next();

    this.studentId = generateID("STU");
});


export const Student = mongoose.model("Student", studentSchema);