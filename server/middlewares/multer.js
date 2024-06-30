import multer from "multer";
import {v4 as uuid} from 'uuid';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Directory where files will be saved
    },
    filename: (req, file, cb) => {

        const id=uuid();
        const extName=file.originalname.split('.').pop();
        const fileName = `${id}.${extName}`;
        cb(null, fileName); // Rename the file to include a timestamp
    }
});

 export const uploadFiles = multer({
    storage
}).single('file');