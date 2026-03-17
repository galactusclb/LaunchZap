import { Router } from 'express';
import {getAllProducts} from './product.controller.ts'

const router = Router();

router.get('/', getAllProducts);

export default router;
