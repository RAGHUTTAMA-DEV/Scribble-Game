"use strict";
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
exports.createRoom = createRoom;
exports.joinRoom = joinRoom;
exports.leaveRoom = leaveRoom;
exports.startGame = startGame;
const RoomModel_1 = __importDefault(require("../models/RoomModel"));
const GameModel_1 = __importDefault(require("../models/GameModel"));
function createRoom(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { roomName, settings } = req.body;
            const user = yield GameModel_1.default.findOne({ roomName });
            const GameId = user === null || user === void 0 ? void 0 : user._id;
            yield RoomModel_1.default.create({
                roomName, settings,
            });
            //socket call
        }
        catch (error) {
            console.error("Internal serer issuse");
        }
    });
}
function joinRoom(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
function leaveRoom(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
function startGame(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
        }
        catch (error) {
            console.log("Error internal issuse", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });
}
