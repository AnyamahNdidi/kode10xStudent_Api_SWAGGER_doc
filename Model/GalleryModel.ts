import mongoose from "mongoose";


interface galleryData {
    title: string;
    image: string;
    imageID: string;
}


interface iGalleryData extends galleryData, mongoose.Document{ }

const galleryModel = new mongoose.Schema({
    
    title: {
        type: String
    },
    inage: {
        type: String
    },
    imageID: {
        type: String
    },

},
 {
    timestamps:true,
    }
)

export default mongoose.model<iGalleryData>("gallerys",  galleryModel )