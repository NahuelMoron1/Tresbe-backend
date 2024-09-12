import { Router } from "express";
import { deleteUser, deleteUsers, getUser, getUserByEmail, getUserByName, getUsers, postUser, updateUser } from "../controllers/Users";
import { sendEmail } from "../controllers/Email";
const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.get('/email/:email', getUserByEmail);
router.get('/username/:username', getUserByName);
router.delete('/:id', deleteUser);
router.delete('/:', deleteUsers);
router.post('/', postUser);
router.post('/email', sendEmail);
router.patch('/:id', updateUser);

export default router;