import mongoose from "mongoose";


interface userData {
    firstName: string;
    lastName: string;
    stack: string;
    phoneNum: string;
    profile: any[];
    project: any[];
    email: string;
    studentID: string;
    studentLearning: any[];
    _doc:any
}

interface iUserData extends userData, mongoose.Document{ }

const userModel = new mongoose.Schema({
    
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    stack: {
        type: String
    },
    email: {
        type: String 
    },
    studentID: {
        type: String 
    },
    profile: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"profiles"
    }],
    project: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"projects"
    }],

    studentLearning: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"learnings"
    }]
},
     {
    timestamps:true,
    }

)

export default mongoose.model<iUserData>("users",  userModel )