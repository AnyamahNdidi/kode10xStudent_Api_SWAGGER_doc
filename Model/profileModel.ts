import mongoose from "mongoose";


interface userData {
    bio: string;
    avatar: string;
    avatarID: string;
    phoneNum: string;
    gitHubLink: string;
    linkedinLink: string;
    facebookLink: string;
    twitterLink: string;
    user: {};
    _doc:any
}

interface iUserData extends userData, mongoose.Document{ 
}

const profileModel = new mongoose.Schema({
    
    bio: {
        type: String
    },
    phoneNum: {
        type: String
    },
    avatarID: {
        type:String
    },
    avatar: {
        type: String,
        default:"https://res.cloudinary.com/ndtech/image/upload/v1683028487/24-248253_user-profile-default-image-png-clipart-png-download_b7feyx.png"
    },
    gitHubLink: {
        type: String
    },
    linkedinLink: {
        type: String 
    },
    facebookLink: {
        type: String 
    },
    twitterLink: {
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

export default mongoose.model<iUserData>("profiles",  profileModel )