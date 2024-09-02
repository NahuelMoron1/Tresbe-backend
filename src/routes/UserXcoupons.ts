import { Router } from "express";
import { deleteUser, deleteUsers, getUserXcoupon, postUser, updateUser } from "../controllers/UserXcoupons";
const router = Router();

router.get('/:userID/:couponID', getUserXcoupon);
router.delete('/:id', deleteUser);
router.delete('/:', deleteUsers);
router.post('/', postUser);
router.patch('/:id', updateUser);

export default router;