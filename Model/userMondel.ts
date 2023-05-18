import mongoose from "mongoose";
import bcrypt from "bcrypt";


interface userData {
    firstName: string;
    lastName: string;
    stack: string;
    cohort: string;
    phoneNum: string;
    role: 'user' | 'admin' | 'super-admin'; 
    profile: any[];
    project: any[];
    email: string;
    password: string;
    matricNumber: string;
    studentLearning: any[];
    weeklyratingcourse: any[];
    matchPassword(enterpassword: string): Promise<boolean>;
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
    password: {
        type: String 
    },
    cohort: {
        type: String 
    },
     role: {
      type: String,
      enum: ["user", "admin", "super-admin"],
      default: "user",
    },
    matricNumber: {
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
    weeklyratingcourse: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"courseratings"
    }],

    // studentrating: [{
	// 		    course: { type: String, required: true },
	// 			rate: { type: Number, required: true },
	// 			// portion: { type: Number, default: 1 },
	// 		}],

    studentLearning: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"learnings"
    }]
},
     {
    timestamps:true,
    }

)

userModel.methods.matchPassword = async function (enterpassword: any) {
     return await bcrypt.compare(enterpassword, this.password)
}
    


userModel.pre('save', async function (this:iUserData, next:any) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt: string = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


export default mongoose.model<iUserData>("users",  userModel )