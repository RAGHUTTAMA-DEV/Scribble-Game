import express from 'express';
import {createRoom,joinRoom,leaveRoom,startGame} from '../controllers/RoomController';

const router=express.Router();


router.post('/create-room/',createRoom);
router.post('join-room/:roomName',joinRoom);
router.post('/leave-room/:roomName',leaveRoom);
router.post('/start-game/:roomName',startGame);



export default router;