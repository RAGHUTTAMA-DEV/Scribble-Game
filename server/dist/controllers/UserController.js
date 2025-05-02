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
exports.SignUp = SignUp;
exports.SignIn = SignIn;
exports.UpdateUser = UpdateUser;
exports.DeleteUser = DeleteUser;
exports.GetUser = GetUser;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function SignUp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username, password, email } = req.body;
            const doesExist = yield UserModel_1.default.findOne({
                $or: [
                    { username },
                    { email }
                ]
            });
            if (doesExist) {
                return res.status(400).json({ message: "User already exists" });
            }
            else {
                const user = yield UserModel_1.default.create({
                    username,
                    password,
                    email
                });
                return res.status(201).json({ user, message: "User created successfully" });
            }
        }
        catch (error) {
            console.log("Error internal issuse", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });
}
function SignIn(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username, password } = req.body;
            const user = yield UserModel_1.default.findOne({ username });
            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }
            const isCorrect = yield user.comparePassword(password);
            if (!isCorrect) {
                return res.status(400).json({ message: "Incorrect password" });
            }
            const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
            return res.status(200).json({ token, message: "User logged in successfully" });
        }
        catch (error) {
            console.log("Error internal issuse", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });
}
function UpdateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedata = req.body;
            const username = req.query.username;
            const user = yield UserModel_1.default.findOne({ username });
            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }
            const updatedUser = yield UserModel_1.default.findOneAndUpdate({ username }, { $set: Object.assign({}, updatedata) }, { new: true });
            return res.status(200).json({ updatedUser, message: "User updated successfully" });
        }
        catch (error) {
            console.log("Error internal issuse", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });
}
function DeleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const username = req.query.username;
            const user = yield UserModel_1.default.findOneAndDelete({ username });
            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }
            return res.status(200).json({ message: "User deleted successfully" });
        }
        catch (error) {
            console.log("Error internal issuse", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });
}
function GetUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const username = req.query.username;
            const isuser = yield UserModel_1.default.findOne({ username });
            if (!isuser) {
                return res.status(400).json({ message: "User not found" });
            }
            const user = yield UserModel_1.default.findOne({ username }).select("-password -__v -createdAt -updatedAt");
            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }
            return res.status(200).json({ user, message: "User fetched successfully" });
        }
        catch (error) {
            console.log("Error internal issuse", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });
}
