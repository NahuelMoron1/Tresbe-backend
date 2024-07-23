import { Router } from "express";
import { deletePriceXproduct, deletePriceXproducts, getPriceXproduct, getPriceXproducts, getTableByProduct, postPriceXproduct, updatePriceXproduct } from "../controllers/PriceXproducts";
const router = Router();

router.get('/', getPriceXproducts);
router.get('/:id', getPriceXproduct);
router.get('/product/:optionID', getTableByProduct);
router.delete('/:id', deletePriceXproduct);
router.delete('/:', deletePriceXproducts);
router.post('/', postPriceXproduct);
router.patch('/:id', updatePriceXproduct);

export default router;