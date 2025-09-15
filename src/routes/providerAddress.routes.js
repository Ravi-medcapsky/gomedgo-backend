import express from 'express';
import *  as providerAddressController from '../controllers/providerAddressController.js';

const router = express.Router();

router.post('/create', providerAddressController.createProviderAddress);
router.get('/fetch-address', providerAddressController.getProviderAddress);
router.put('/update-address', providerAddressController.updateAddress);
router.delete('/delete-address', providerAddressController.deleteAddress);

export default router;
