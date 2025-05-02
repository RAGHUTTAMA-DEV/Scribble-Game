import mongoose from "mongoose";

const schema = mongoose.Schema;

const Room=new schema({
    roomName:{
        type:String,
        required:true,
        trim:true,
    },
    hostId:{
        type:schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    players:[{
        userId:{
            type:schema.Types.ObjectId,
            ref:'User'
        },
        isReady:{
            type:Boolean,
            default:false
        },
        score:{
            type:Number,
            default:0
        },
        isActive:{
            type:Boolean,
            default:false
        }
    }],
    staus:{
        type:String,
        enum:['waiting','playing','finished'],
        default:'waiting'
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    },
    settings:{
        maxPlayers:{
            type:Number,
            default:8,
            min:2,
            max:12
        },
        isPrivate:{
            type:Boolean,
            default:false
        },
        password:{
            type:String,
            select:false,
        },
        rounds:{
            type:Number,
            default:3,
            min:1,
            max:10
        },
        drawTime:{
            type: Number,
            default: 60,
            min: 30,
            max: 180
        },
        hintsEnabled:{
            type:Boolean,
            default:true
        },
        customWords:{
            type:Boolean,
            default:false
        },
        wordCount:{
            type: Number,
            default: 5,
            min: 3,
            max: 10
        }
    }

},{timestamps:true});

Room.index({roomName:1});
Room.index({"players.userId":1});
Room.index({status:1}); 

Room.methods.hasSpace=function(){
    return this.players.length < this.settings.maxPlayers;
}

Room.methods.addPlayer = function(userId:any) {
    if (this.players.some(player => player.userId.equals(userId))) {
        return false; // Player already in room
    }
    
    if (!this.hasSpace()) {
        return false; // Room is full
    }
    
    this.players.push({ userId });
    return true;
};

export default mongoose.model('Room',Room);
