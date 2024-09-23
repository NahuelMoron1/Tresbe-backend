import { Router } from "express";
import { deleteUser, deleteUsers, getUser, getUserByEmail, getUserByName, getUsers, getUsersBySeller, login, postUser, temporalLogin, updateUser } from "../controllers/Users";
import { sendEmail } from "../controllers/Email";
const router = Router();

router.get('/:email', getUsers);
router.get('/:id/:email', getUser);
router.get('/email/:email/:loggedEmail', getUserByEmail);
router.get('/seller/:seller/:email', getUsersBySeller);
router.get('/username/:username/:email', getUserByName);
router.delete('/:id', deleteUser);
router.delete('/', deleteUsers);
router.post('/', postUser);
router.post('/login', login);
router.post('/tempLogin', temporalLogin);
router.post('/email', sendEmail);
router.patch('/:id', updateUser);

export default router;