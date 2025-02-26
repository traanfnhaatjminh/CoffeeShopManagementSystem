const multer = require("multer");
const path = require("path");

//multer config
module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) =>{
        let ext = path.extname(file.originalname);
        if(ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" ){
            cb(new Error("File type is not supported"), false);
            return;
        }
        cb(null, true);
    },
});



// const storage = multer.memoryStorage(); // Lưu file vào RAM

// const upload = multer({
//     storage: storage,
//     fileFilter: (req, file, cb) => {
//         let ext = path.extname(file.originalname).toLowerCase();
//         if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
//             return cb(new Error("File type is not supported"), false);
//         }
//         cb(null, true);
//     },
//     limits: { fileSize: 5 * 1024 * 1024 }
// });

// module.exports = upload;
