"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const RoomController_1 = require("../controllers/RoomController");
const router = express_1.default.Router();
router.post('/create-room/', RoomController_1.createRoom);
router.post('join-room/:roomName', RoomController_1.joinRoom);
router.post('/leave-room/:roomName', RoomController_1.leaveRoom);
router.post('/start-game/:roomName', RoomController_1.startGame);
exports.default = router;
