import mongoose from "mongoose";


interface voteData {
    voters: number;
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
    
    voters: {
        type: Number
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
    gitHubLink: {
        type: String
    },
    image: {
        type:String,
       
    },
    imageID: {
        type: String 
    },

    user: [{
      type: String
    }]
},
 {
    timestamps:true,
    }
)

export default mongoose.model<iVotetData>("voteStudents",  studentVoteModel )
