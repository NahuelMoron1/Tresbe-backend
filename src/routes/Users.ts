import { Router } from "express";
import { deleteUser, deleteUsers, getUser, getUserByEmail, getUsers, postUser, updateUser } from "../controllers/Users";
const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.get('/email/:email', getUserByEmail);
router.delete('/:id', deleteUser);
router.delete('/:', deleteUsers);
router.post('/', postUser);
router.patch('/:id', updateUser);

export default router;