import * as userbookingModel from "../models/userBooking.model.js";
import  {providerModel} from "../models/provider.model.js";
import {appointmenModel} from "../models/appointment.model.js";
import  * as userModel from "../models/user.model.js"


export const bookingCreate = async (data) => {
  try {
    const {user_id,service_id,start_date,end_date,time,gender,first_language,second_language,address,patient_name, patient_phone, patient_age,total_cost,status,latitude,longitude} =data;
    
    return await userbookingModel.create({user_id,service_id,start_date,end_date,time,gender,first_language,second_language,address,patient_name, patient_phone, patient_age,total_cost,status,latitude,longitude});
  } catch (error) {
    console.error("Error getting booking create:", error);
    throw error;
  }
};

export const getbooking = async (booking_id) => {
  try {
    
    return await userbookingModel.fetchBookingDetails(booking_id);
  } catch (error) {
    console.error("Error getting booking data:", error);
    throw error;
  }
};

export const createAvaibleProvidersAppointment = async (booking_id,service_category_id,booking_total_cost) => {

  try {
    // Fetch experienced providers
    const providerExperienceDetails =
      await providerModel.providerListWithExperiance(service_category_id);

    console.log("providerExperienceDetails:", providerExperienceDetails);

    if (!providerExperienceDetails || providerExperienceDetails.length === 0) {
      throw new Error("No experienced providers found for the service category.");
    }

    const appointments = [];

    // 🔹 Assign providers
    for (const provider of providerExperienceDetails) {
      const service_provider_id =
        provider.provider_id || provider.service_provider_id;
      const total_cost = (booking_total_cost * 70) / 100; // 70% payout
      const status = "pending";

      // Insert appointment
      const appointment = await appointmenModel.create(
        booking_id,
        service_provider_id,
        total_cost,
        status
      );

      console.log("Appointment created for provider:", service_provider_id);

      appointments.push(appointment);
    }

    // ✅ Return all created appointments
    return appointments;
  } catch (error) {
    console.error("Error creating Appointments:", error.message || error);
    throw error;
  }
};

// ✅ Fetch Available Providers & Assign One to the Booking
export const fetchAvaibleProviders = async (booking_id, service_category_id) => {
  try {
    console.log('booking_id:', booking_id);
    console.log('service_category_id:', service_category_id);
  

    // Fetch booking details
    const bookingDetails = await userbookingModel.fetchBookingDetails(booking_id);
    console.log('bookingDetails', bookingDetails);

    // Fetch user details
    const userDetails = await userModel.findById(bookingDetails.data.user_id);
    console.log('userDetails', userDetails);

    // ✅ Check for confirmed appointments
let confirmedAppointments = await appointmenModel.getConfirmedAppointments(booking_id);

    if (!confirmedAppointments || confirmedAppointments.length === 0) {
      console.log('No confirmed appointments yet. Waiting 10 seconds...');
      await new Promise(resolve => setTimeout(resolve, 10000)); // wait 10 seconds

      confirmedAppointments = await appointmenModel.getConfirmedAppointments(booking_id);
      console.log('confirmedAppointments after wait:', confirmedAppointments);
    }

    // ✅ Always return after check (first or after wait)
    if (confirmedAppointments) {
      return {
        message: 'Appointments confirmed successfully.',
        confirmedAppointments,
      };
    } else {
      return {
        message: 'No provider confirmed the appointment yet. Please try again later.',
        confirmedAppointments: [],
      };
    }

  } catch (error) {
    console.error("Error fetching available provider:", error.message);
    throw error;
  }
};






// ✅ Cancel a Booking
export const cancel = async (data) => {
  try {
    const { booking_id, user_id, cancel_reason } = data;

    if (!booking_id || !user_id || !cancel_reason) {
      throw new Error("Missing required fields for cancellation.");
    }

    return await userbookingModel.cancellation({ booking_id, user_id, cancel_reason });

  } catch (error) {
    console.error("Error in cancellation:", error.message);
    throw error;
  }
};


//service done


export const servicecomplete = async (appointment_id) => {
  try {
 

    if (!appointment_id ) {
      throw new Error("Missing required fields for fetching complete service.");
    }

    const serviceCompleted =  await userbookingModel.complete( appointment_id );
    return serviceCompleted;

  } catch (error) {
    console.error("Error in complete service:", error.message);
    throw error;
  }
};