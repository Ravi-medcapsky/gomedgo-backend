import {appointmenModel} from "../models/appointment.model.js";



export const getAppointment = async (service_provider_id) =>{
try{
    
     console.log('provider id',service_provider_id)
      const fetchProviderAppointment =  await appointmenModel.get(service_provider_id);
     console.log('fetched Provider Appointment exist',fetchProviderAppointment)
     return fetchProviderAppointment;
 
   }catch (error) {
    console.error('Error fetch  provider Appointmnet data:', error);
    throw error;
   }

};

export const confirmedAppointment = async (service_provider_id,booking_id) =>{
try{
    
     console.log('provider id',service_provider_id)
          console.log('booking id',booking_id)

      const confirmed =  await appointmenModel.updateConfirmed(service_provider_id,booking_id);
     console.log('fetched Provider Appointment confired exist',confirmed)
     return confirmed;
 
   }catch (error) {
    console.error('Error fetch  provider Appointmnet data:', error);
    throw error;
   }

};
export const doneAppointment = async (service_provider_id,booking_id) =>{
try{
    
     console.log('provider id',service_provider_id)
          console.log('booking id',booking_id)

      const done =  await appointmenModel.updateDone(service_provider_id,booking_id);
     console.log('fetched Provider Appointment confired exist', done)
     return  done;
 
   }catch (error) {
    console.error('Error fetch  provider Appointmnet data done:', error);
    throw error;
   }

};

export const waitingAppointment = async (service_provider_id,booking_id) =>{
try{
    
     console.log('provider id',service_provider_id)
          console.log('booking id',booking_id)

      const waiting =  await appointmenModel.updateWaiting(service_provider_id,booking_id);
     console.log('fetched Provider Appointment confired exist',waiting)
     return waiting;
 
   }catch (error) {
    console.error('Error fetch  provider Appointmnet data:', error);
    throw error;
   }

};


export const waitingAppointmentDelete = async (service_provider_id,booking_id) =>{
try{
    
     console.log('provider id',service_provider_id)
          console.log('booking id model',booking_id)

      const waitingDelete =  await appointmenModel.updateWaitngDelete(booking_id);
     console.log('fetched Provider Appointment confired exist',waitingDelete)
     return waitingDelete;
 
   }catch (error) {
    console.error('Error fetch  provider Appointmnet data delete:', error);
    throw error;
   }

};