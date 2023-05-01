import mongoose from "mongoose";


interface learningData {
    title: string;
    decs: string;
    course: string;
    user:  {};
    _doc:any
}

interface iLearnData extends learningData, mongoose.Document{ }

const learningModel = new mongoose.Schema({
    
    title: {
        type: String
    },
    decs: {
        type: String
    },
    course: {
        type: String 
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
        ref:"users"
    }
},
 {
    timestamps:true,
    }
)

export default mongoose.model<iLearnData>("learnings",  learningModel )