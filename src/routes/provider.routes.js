import express from 'express';
import * as providerController from '../controllers/providerController.js';



const router = express.Router();

router.post('/register/serviceProvider', providerController.serviceProvider);
router.get('/fetch-provider',providerController.getProvider)
router.put('/update-provider',providerController.updateProviderVerified)

export default router;