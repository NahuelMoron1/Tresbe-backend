import { Router } from "express";
import { deletePriceXproduct, deletePriceXproducts, getPriceXproduct, getPriceXproducts, getTableByProduct, postPriceXproduct, updateOptionID, updatePriceXproduct } from "../controllers/PriceXproducts";
const router = Router();

router.get('/', getPriceXproducts);
router.get('/:id', getPriceXproduct);
router.get('/product/:optionID', getTableByProduct);
router.delete('/:id', deletePriceXproduct);
router.delete('/:', deletePriceXproducts);
router.post('/', postPriceXproduct);
router.patch('/:id', updatePriceXproduct);
router.patch('/update/option/:id', updateOptionID);

export default router;