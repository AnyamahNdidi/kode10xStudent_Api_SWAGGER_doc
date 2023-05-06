import mongoose from "mongoose";


interface voteData {
    voter: string;
    firstName: string;
    lastName: string;
    fullName: string;
    role: string;
    image: string;
    imageID: string;
    user:  any[];
    _doc:any
}


interface iVotetData extends voteData, mongoose.Document{ }

const studentVoteModel = new mongoose.Schema({
    
    voter: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    fullName: {
        type: String
    },
    role: {
        type: String
    },
    image: {
        type:String,
       
    },
    imageID: {
        type: String 
    },

    user: [{
      type: mongoose.Schema.Types.ObjectId,
        ref:"users"
    }]
},
 {
    timestamps:true,
    }
)

export default mongoose.model<iVotetData>("voteStudents",  studentVoteModel )
