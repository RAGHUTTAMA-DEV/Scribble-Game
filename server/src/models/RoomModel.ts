import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

// Define interfaces for the schema
interface Player {
  userId: mongoose.Types.ObjectId;
  isReady: boolean;
  score: number;
  isActive: boolean;
}

interface Settings {
  maxPlayers: number;
  isPrivate: boolean;
  password?: string;
  rounds: number;
  drawTime: number;
  hintsEnabled: boolean;
  customWords: boolean;
  wordCount: number;
}

export interface Room extends Document {
  roomName: string;
  hostId: mongoose.Types.ObjectId;
  players: Player[];
  status: "waiting" | "playing" | "finished";
  currentGameId?: mongoose.Types.ObjectId;
  settings: Settings;

  hasSpace(): boolean;
  addPlayer(userId: mongoose.Types.ObjectId): boolean;
  checkPassword(candidatePassword: string): Promise<boolean>;
}

// Define the schema
const RoomSchema = new Schema<Room>(
  {
    roomName: {
      type: String,
      required: true,
      trim: true,
    },
    hostId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    players: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        isReady: {
          type: Boolean,
          default: false,
        },
        score: {
          type: Number,
          default: 0,
        },
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ["waiting", "playing", "finished"],
      default: "waiting",
    },
    currentGameId: {
      type: Schema.Types.ObjectId,
      ref: "Game",
    },
    settings: {
      maxPlayers: {
        type: Number,
        default: 8,
        min: 2,
        max: 12,
      },
      isPrivate: {
        type: Boolean,
        default: false,
      },
      password: {
        type: String,
        select: false, // Don't include in query results by default
      },
      rounds: {
        type: Number,
        default: 3,
        min: 1,
        max: 10,
      },
      drawTime: {
        type: Number,
        default: 60,
        min: 30,
        max: 180,
      },
      hintsEnabled: {
        type: Boolean,
        default: true,
      },
      customWords: {
        type: Boolean,
        default: false,
      },
      wordCount: {
        type: Number,
        default: 5,
        min: 3,
        max: 10,
      },
    },
  },
  { timestamps: true }
);

// Index for finding rooms
RoomSchema.index({ roomName: 1 });
RoomSchema.index({ "players.userId": 1 });
RoomSchema.index({ status: 1 });

// Check if room has space
RoomSchema.methods.hasSpace = function (): boolean {
  return this.players.length < this.settings.maxPlayers;
};

// Add player to room
RoomSchema.methods.addPlayer = function (userId: mongoose.Types.ObjectId): boolean {
  if (this.players.some((player:any) => player.userId.equals(userId))) {
    return false; // Player already in room
  }

  if (!this.hasSpace()) {
    return false; // Room is full
  }

  this.players.push({ userId, isReady: false, score: 0, isActive: true });
  return true;
};

// Check if password is correct
RoomSchema.methods.checkPassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.settings.isPrivate) return true;
  if (!this.settings.password) return false;

  return await bcrypt.compare(candidatePassword, this.settings.password);
};

// Hash password before saving if it's changed
RoomSchema.pre<Room>("save", async function (next) {
  if (
    this.settings.isPrivate &&
    this.settings.password &&
    (this.isModified("settings.password") || this.isNew)
  ) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.settings.password = await bcrypt.hash(this.settings.password, salt);
    } catch (error:any) {
      return next(error);
    }
  }
  next();
});

const Room: Model<Room> = mongoose.model<Room>("Room", RoomSchema);

export default Room;