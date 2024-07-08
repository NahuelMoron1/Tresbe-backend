import multer from 'multer';
import Voucher from '../models/mysql/Voucher';
import fs from 'fs';
import path from 'path';
const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, 'uploads');
    },
    filename:(req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})
const upload = multer({storage: storage});
export const uploads = upload.single('file');

export const uploadFile = (req: any, res: any) => {
    res.send({data: req.file.filename}); 
}

export const getFiles = (req: any, res: any) => {
    const directoryPath = 'uploads';    
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan files');
        }
        console.log(files);
        
        res.json(files);
    });
}

export const getFileMysql = async (req: any, res: any) => {
    const { orderID } = req.params;
    const fileAux = await Voucher.findOne({where: {orderID: orderID}});    
    if(fileAux){
        res.json(fileAux);
    } else {
        res.status(404).json({message: 'Error, File not found'})
    }
}