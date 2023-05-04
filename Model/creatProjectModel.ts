import mongoose from "mongoose";


interface projectData {
    title: string;
    decs: string;
    projectType: string;
    url: string;
    tools: [];
    user:  {};
    _doc:any
}

interface iProjectData extends projectData, mongoose.Document{ }

const learningModel = new mongoose.Schema({
    
    title: {
        type: String
    },
    decs: {
        type: String
    },
    projectType: {
        type: String
    },
    tools: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"tools"
    }],
    url: {
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

export default mongoose.model<iProjectData>("projects",  learningModel )