import mongoose,{ConnectOptions,Mongoose} from "mongoose"



const MONGODB_URI = process.env.DATABASE_URL || "mongodb://0.0.0.0:27017/studenPortal";
const ONLINE_URL = "mongodb+srv://user:NigeriaSecurity240$@cluster0.zc4mc02.mongodb.net/studentPortal"

const connectMongoose = async (): Promise<Mongoose>  => {
    try
    {
        const conn = await mongoose.connect(ONLINE_URL)
        console.log(`MongoDB connected: ${conn.connection.host}`);
        return conn
    } catch (error)
    {
        console.log(`error ${error}`)
        process.exit()
        
    }
}


export default connectMongoose;