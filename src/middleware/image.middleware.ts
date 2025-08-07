import multer from "multer";
import fs from "fs";
import path from "path";
import { Request } from "express";

const uploadFolder = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        console.error("Invalid file type:", file.mimetype);
        cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
    }
};
export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter,

});

export const getFileUrl = (req: Request, fileName: string): string => {
    const host = req.protocol + '://' + req.get('host');
    return `${host}/uploads/${fileName}`;
}