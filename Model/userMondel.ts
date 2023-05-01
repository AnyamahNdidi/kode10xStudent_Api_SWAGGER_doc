import mongoose from "mongoose";


interface userData {
    firstName: string;
    lastName: string;
    stack: string;
    phoneNum: string;
    
    email: string;
    studenID: string;
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
    phoneNum: {
        type: String 
    },
    studentID: {
        type: String 
    },
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