import express from 'express';
import * as providerStatusTrackingController from '../controllers/providerStatusTrackingController.js';



const router = express.Router();

router.post('/tracking', providerStatusTrackingController.statusTracking );


export default router;
