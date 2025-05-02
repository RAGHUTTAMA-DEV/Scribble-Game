import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    stats: {
      gamesPlayed: number;
      gamesWon: number;
      totalPoints: number;
      correctGuesses: number;
      wordsDrawn: number;
    };
    profile: {
      avatar?: string;
      bio?: string;
      displayName?: string;
    };
    friends: Schema.Types.ObjectId[];
    status: 'online' | 'offline' | 'in-game' | 'away';
    currentGameId?: Schema.Types.ObjectId;
    comparePassword(candidatePassword: string): Promise<boolean>;
  }

const UserSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    stats: {
        gamesPlayed: { type: Number, default: 0 },
        gamesWon: { type: Number, default: 0 },
        totalPoints: { type: Number, default: 0 },
        correctGuesses: { type: Number, default: 0 },
        wordsDrawn: { type: Number, default: 0 }
    },
    profile: {
        avatar: String,
        bio: String,
        displayName: String
    },
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['online', 'offline', 'in-game', 'away'],
        default: 'offline'
    },
    currentGameId: {
        type: Schema.Types.ObjectId,
        ref: 'Game'
    }
}, { timestamps: true });



// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error:any) {
         console.log("Error internal issuse",error);
        next(error);
    }
});

UserSchema.methods.comparePassword = async function(candidatePassword:any) {
    return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.GetUserId=function(){
    return this._id;
}

export default mongoose.model('User', UserSchema);