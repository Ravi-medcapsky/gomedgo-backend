import express from 'express';
import * as providerPaymentAssetsController from '../controllers/providerPaymentAssetsController.js';



const router = express.Router();

router.post('/assets', providerPaymentAssetsController.providerPayment);
router.get('/fetch-assets',providerPaymentAssetsController.getProviderPaymentAssets)
router.put('/update-assets',providerPaymentAssetsController.updateProviderPaymentAssets)






export default router;