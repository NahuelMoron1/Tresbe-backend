import { Router } from "express";
import { deleteCoupon, deleteCoupons, getCoupon, getCoupons, postCoupon, searchCouponByName, updateCoupon } from "../controllers/Coupon";
const router = Router();

router.get('/', getCoupons);
router.get('/:id', getCoupon);
router.get('/search/:name', searchCouponByName);
router.delete('/:id', deleteCoupon);
router.delete('/:', deleteCoupons);
router.post('/', postCoupon);
router.patch('/:id', updateCoupon);

export default router;