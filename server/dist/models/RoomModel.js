"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// Define the schema
const RoomSchema = new mongoose_1.Schema({
    roomName: {
        type: String,
        required: true,
        trim: true,
    },
    hostId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    players: [
        {
            userId: {
                type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { timestamps: true });
// Index for finding rooms
RoomSchema.index({ roomName: 1 });
RoomSchema.index({ "players.userId": 1 });
RoomSchema.index({ status: 1 });
// Check if room has space
RoomSchema.methods.hasSpace = function () {
    return this.players.length < this.settings.maxPlayers;
};
// Add player to room
RoomSchema.methods.addPlayer = function (userId) {
    if (this.players.some((player) => player.userId.equals(userId))) {
        return false; // Player already in room
    }
    if (!this.hasSpace()) {
        return false; // Room is full
    }
    this.players.push({ userId, isReady: false, score: 0, isActive: true });
    return true;
};
// Check if password is correct
RoomSchema.methods.checkPassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.settings.isPrivate)
            return true;
        if (!this.settings.password)
            return false;
        return yield bcrypt_1.default.compare(candidatePassword, this.settings.password);
    });
};
// Hash password before saving if it's changed
RoomSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.settings.isPrivate &&
            this.settings.password &&
            (this.isModified("settings.password") || this.isNew)) {
            try {
                const salt = yield bcrypt_1.default.genSalt(10);
                this.settings.password = yield bcrypt_1.default.hash(this.settings.password, salt);
            }
            catch (error) {
                return next(error);
            }
        }
        next();
    });
});
const Room = mongoose_1.default.model("Room", RoomSchema);
exports.default = Room;
