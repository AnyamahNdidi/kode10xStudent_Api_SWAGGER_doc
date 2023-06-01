import mongoose from "mongoose";


interface rateData {
    date: string;
    properDate:string;
    allweeklyrating: any[];
    phase: string;
    _doc:any
}


const ratindModel = new mongoose.Schema({
    
    date: {
        type: String,
        default: new Date()
    },

    properDate: {
       type: String, 
    },
    phase: {
        type:String,
    },

    allweeklyrating: [{
		    course: { type: String, required: true },
            rate: { type: Number, required: true },
    
		}],
},
     {
    timestamps:true,
    }

)

export default mongoose.model<rateData>("courseratings",  ratindModel )