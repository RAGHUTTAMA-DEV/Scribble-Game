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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const GameSchema = new mongoose_1.Schema({
    roomId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
        index: true
    },
    players: [{
            userId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            score: {
                type: Number,
                default: 0
            },
            ranking: {
                type: Number,
                default: 0
            },
            isActive: {
                type: Boolean,
                default: true
            }
        }],
    rounds: [{
            word: {
                type: String,
                required: true
            },
            drawer: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            drawerPoints: {
                type: Number,
                default: 0
            },
            startTime: {
                type: Date
            },
            endTime: {
                type: Date
            },
            drawingData: {
                type: mongoose_1.Schema.Types.Mixed, // Store drawing data history
                select: false // Don't include by default (can be large)
            },
            guesses: [{
                    userId: {
                        type: mongoose_1.Schema.Types.ObjectId,
                        ref: 'User',
                        required: true
                    },
                    guess: {
                        type: String,
                        required: true
                    },
                    correct: {
                        type: Boolean,
                        default: false
                    },
                    timestamp: {
                        type: Date,
                        default: Date.now
                    },
                    pointsEarned: {
                        type: Number,
                        default: 0
                    }
                }]
        }],
    currentRound: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['waiting', 'playing', 'finished'],
        default: 'waiting'
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    }
}, { timestamps: true });
// Indexes for performance
GameSchema.index({ status: 1 });
GameSchema.index({ "players.userId": 1 });
// Get current round data
GameSchema.methods.getCurrentRound = function () {
    if (this.currentRound < this.rounds.length) {
        return this.rounds[this.currentRound];
    }
    return null;
};
// Check if a user is the current drawer
GameSchema.methods.isDrawer = function (userId) {
    const currentRound = this.getCurrentRound();
    return currentRound &&
        currentRound.drawer.toString() === userId.toString();
};
// Add a guess to the current round
GameSchema.methods.addGuess = function (userId, guessText) {
    if (this.status !== 'playing')
        return false;
    const round = this.getCurrentRound();
    if (!round)
        return false;
    // Don't allow drawer to guess
    if (this.isDrawer(userId))
        return false;
    // Check if word matches (case insensitive)
    const isCorrect = guessText.toLowerCase() === round.word.toLowerCase();
    // Calculate points based on time elapsed since round started
    let pointsEarned = 0;
    if (isCorrect) {
        const now = new Date();
        const elapsedSeconds = (now - round.startTime) / 1000;
        // Points decrease as time passes (max 100 points)
        pointsEarned = Math.max(10, Math.floor(100 - (elapsedSeconds / round.duration) * 90));
        // Update player score
        //@ts-ignore
        const playerIndex = this.players.findIndex(p => p.userId.toString() === userId.toString());
        if (playerIndex >= 0) {
            this.players[playerIndex].score += pointsEarned;
        }
        // Add points for drawer too
        //@ts-ignore
        const drawerIndex = this.players.findIndex(p => p.userId.toString() === round.drawer.toString());
        if (drawerIndex >= 0) {
            this.players[drawerIndex].score += Math.floor(pointsEarned / 2);
            round.drawerPoints += Math.floor(pointsEarned / 2);
        }
    }
    // Add the guess to the current round
    round.guesses.push({
        userId,
        guess: guessText,
        correct: isCorrect,
        timestamp: new Date(),
        pointsEarned
    });
    return {
        isCorrect,
        pointsEarned
    };
};
GameSchema.methods.startNextRound = function (word, drawerId) {
    this.currentRound++;
    if (this.currentRound >= this.rounds.length) {
        this.status = 'finished';
        this.endTime = new Date();
        // Calculate final rankings
        this.players.sort((a, b) => b.score - a.score);
        //@ts-ignore
        this.players.forEach((player, index) => {
            player.ranking = index + 1;
        });
        return false;
    }
    // Set up next round
    this.rounds[this.currentRound] = {
        word,
        drawer: drawerId,
        startTime: new Date(),
        guesses: []
    };
    return true;
};
exports.default = mongoose_1.default.model('Game', GameSchema);
