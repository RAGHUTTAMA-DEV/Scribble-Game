import mongoose, { Schema } from "mongoose";

const GameSchema = new Schema({
    roomId: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
        index: true
    },
    players: [{
        userId: {
            type: Schema.Types.ObjectId,
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
            type: Schema.Types.ObjectId,
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
            type: Schema.Types.Mixed, // Store drawing data history
            select: false // Don't include by default (can be large)
        },
        guesses: [{
            userId: {
                type: Schema.Types.ObjectId,
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
GameSchema.methods.getCurrentRound = function() {
    if (this.currentRound < this.rounds.length) {
        return this.rounds[this.currentRound];
    }
    return null;
};

// Check if a user is the current drawer
GameSchema.methods.isDrawer = function(userId:Schema.Types.ObjectId) {
    const currentRound = this.getCurrentRound();
    return currentRound && 
           currentRound.drawer.toString() === userId.toString();
};

// Add a guess to the current round
GameSchema.methods.addGuess = function(userId:Schema.Types.ObjectId, guessText:string) {
    if (this.status !== 'playing') return false;
    
    const round = this.getCurrentRound();
    if (!round) return false;
    
    // Don't allow drawer to guess
    if (this.isDrawer(userId)) return false;
    
    // Check if word matches (case insensitive)
    const isCorrect = guessText.toLowerCase() === round.word.toLowerCase();
    
    // Calculate points based on time elapsed since round started
    let pointsEarned = 0;
    if (isCorrect) {
        const now:any = new Date();
        const elapsedSeconds = (now - round.startTime) / 1000;
        // Points decrease as time passes (max 100 points)
        pointsEarned = Math.max(10, Math.floor(100 - (elapsedSeconds / round.duration) * 90));
        
        // Update player score
        //@ts-ignore
        const playerIndex = this.players.findIndex(p => 
            p.userId.toString() === userId.toString());
        
        if (playerIndex >= 0) {
            this.players[playerIndex].score += pointsEarned;
        }
        
        // Add points for drawer too
        //@ts-ignore
        const drawerIndex = this.players.findIndex(p => 
            p.userId.toString() === round.drawer.toString());
        
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


GameSchema.methods.startNextRound = function(word:String, drawerId:Schema.Types.ObjectId) {
    this.currentRound++;
    
    if (this.currentRound >= this.rounds.length) {
        this.status = 'finished';
        this.endTime = new Date();
        
        // Calculate final rankings
        this.players.sort((a:any, b:any) => b.score - a.score);
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

export default mongoose.model('Game', GameSchema);