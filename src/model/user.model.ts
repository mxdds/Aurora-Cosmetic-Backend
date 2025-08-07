import  mongoose, { Schema} from "mongoose";
import { v4 as uuidv4 } from "uuid";

const UserModel = new mongoose.Schema({
    "id": {
        required: true,
        type: String,
        default: uuidv4,
        unique: true,
        index: true
},
    "username": {
        required: true,
        type: String,
        unique: true,
        trim: true
    },
    "password": {
        required: true,
        type: String
    },
    "role": {
        required: true,
        type: String,
        enum: ["admin", "customer"],
        default: "customer"
    },
    "email": {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        sparse: true
    },
    "image": {
        type: String,
        trim: true
    },
    "status": {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    "otp": {
        type: String
    },
    "otpExpiry": {
        type: Number
    }
});

const User = mongoose.model('User', UserModel);
export default User;