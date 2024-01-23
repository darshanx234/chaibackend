import mongoose , {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema(
    {
        videoFile : {
            type : String , // cloudinary url
            required : true
        },
        thumbnail : {
            type : String , // cloudinary url
            required : true
        },
        title : {
            type : String , 
            required : true
        },
        description  : {
            type : String,
            required : true
        },
        description  : {
            type : String,
            required : true
        },
        duration : {
            type : Number ,
            required : true
        },
        views: {
            type : Number,
            default : 0
        },
        isPublished : {
            type : Boolean,
            default : true
        },
        owner : {
            type : Schema.Types.ObjectId ,
            ref : "user"
        }


        
    },
    {
        timestamps : true
    }
)
 // mongoose allows to add plugins 
 //this will take your project to next lvlnpm
videoSchema.plugin(mongooseAggregatePaginate) // now use can write an aggrigate quaries in mongodb
export const video = mongoose.model("video" , videoSchema)