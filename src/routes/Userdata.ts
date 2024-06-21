import { Router } from "express";
import { deleteUserdata, deleteUsersdata, getUserdata, getUserdataByUserID, getUsersdata, postUserdata, updateUserdata } from "../controllers/Userdata";
const router = Router();

router.get('/', getUsersdata);
router.get('/:id', getUserdata);
router.get('/userid/:userid', getUserdataByUserID);
router.delete('/:id', deleteUserdata);
router.delete('/:', deleteUsersdata);
router.post('/', postUserdata);
router.patch('/:id', updateUserdata);

export default router;