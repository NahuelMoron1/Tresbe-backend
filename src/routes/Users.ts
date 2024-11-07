import { Router } from "express";
import { deleteUser, deleteUsers, getUser, getUserByEmail, getUserByName, getUsers, getUsersBySeller, login, logout, postUser, updatePassword, updateUser } from "../controllers/Users";
import { sendEmail } from "../controllers/Email";
const router = Router();

router.get('/', getUsers);
router.get('/search/:param/:name', getUsers);
router.get('/:id', getUser);
router.get('/email/:email/:loggedEmail', getUserByEmail);
router.get('/seller/:seller/:email', getUsersBySeller);
router.get('/username/:username', getUserByName);
router.delete('/:id', deleteUser);
router.delete('/', deleteUsers);
router.post('/', postUser);
router.post('/validate/logout/user/logged', logout);
router.post('/login', login);
router.post('/email', sendEmail);
router.patch('/:id', updateUser);
router.patch('/password/:id', updatePassword);

export default router;