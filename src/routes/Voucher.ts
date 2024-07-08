import { Router } from "express";
import { getFiles, uploadFile, uploads } from "../controllers/Voucher";
const router = Router();

router.post('/',
    uploads,
    uploadFile
)
router.get('/', getFiles);
export default router;