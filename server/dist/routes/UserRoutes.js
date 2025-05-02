"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../controllers/UserController");
const router = express_1.default.Router();
router.post('/signup', UserController_1.SignUp);
router.post('/signin', UserController_1.SignIn);
router.put('/update', UserController_1.UpdateUser);
router.delete('/delete/:username', UserController_1.DeleteUser);
router.get('/get/:username', UserController_1.GetUser);
exports.default = router;
