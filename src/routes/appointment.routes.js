import express from 'express';
import * as appointmentController from '../controllers/appointmentController.js';



const router = express.Router();


router.get('/fetch-appointment',appointmentController.fetchAppoitnment)
router.put('/confirmed-appointment',appointmentController.confirmed)
router.put('/done-appointment',appointmentController.done)




export default router;