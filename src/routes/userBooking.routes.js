import express from 'express';
import * as userBookingController from '../controllers/userBookingController.js';


const router = express.Router();



router.post('/create', userBookingController.raiseBooking); 
router.post('/cancle',userBookingController.cancleBooking);
router.get('/fetch-booking',userBookingController.fetchBooking)

router.get("/ok",userBookingController.ok)



export default router;