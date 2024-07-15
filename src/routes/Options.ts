import { Router } from "express";
import { deleteOption, deleteOptions, getOption, getOptions, getProductOptions, postOption, updateOption } from "../controllers/Options";
const router = Router();

router.get('/', getOptions);
router.get('/:id', getOption);
router.get('/product/:productID', getProductOptions);
router.delete('/:id', deleteOption);
router.delete('/:', deleteOptions);
router.post('/', postOption);
router.patch('/:id', updateOption);

export default router;