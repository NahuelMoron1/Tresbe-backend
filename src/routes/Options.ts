import { Router } from "express";
import { deleteOption, deleteOptionByProduct, deleteOptions, getOption, getOptions, getProductOptions, getProductOptionsByName, getProductOptionsByTwo, postOption, updateOption } from "../controllers/Options";
const router = Router();

router.get('/', getOptions);
router.get('/:id', getOption);
router.get('/product/:productID', getProductOptions);
router.get('/product/option/:productID/:optionName', getProductOptionsByTwo);
router.get('/name/:name', getProductOptionsByName);
router.delete('/:id', deleteOption);
router.delete('/deleteProduct/:id', deleteOptionByProduct);
router.delete('/:', deleteOptions);
router.post('/', postOption);
router.patch('/:oldID', updateOption);

export default router;