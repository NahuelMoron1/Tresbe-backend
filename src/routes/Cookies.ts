import { Router } from "express";
import { getToken, superAdminCheck, tokenExist } from "../controllers/Cookies";

const router = Router();

router.get('/check/:cookieName', tokenExist);
router.get('/get/:cookieName', getToken);
router.get('/superadmin/:admin', superAdminCheck);
export default router;