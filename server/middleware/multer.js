import multer from 'multer';
import path from 'path';

export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '../public/uploads/'); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); 
    },
  });


  const upload = multer({ storage: storage });

  export default upload