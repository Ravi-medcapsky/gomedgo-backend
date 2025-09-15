import { poolPromise } from "../config/db.config.js";
import sql from 'mssql';



export const fetchBookingDetails = async (booking_id) =>{

  

  const pool = await poolPromise;

  const result = await pool
  .request()
  .input("booking_id",sql.UniqueIdentifier,booking_id)
  
   
   .query(`SELECT * FROM Booking where id = @booking_id
    `)

      return {
      success: true,
      data: result.recordset[0]
    };
  };

export const create = async (data) => {
  try {
    const {
      user_id,
      service_id,
      start_date,
      end_date,
      time,
      gender,
      first_language,
      second_language,
      address,
      patient_name,
      patient_phone,
      patient_age,
      total_cost,
      status,
      latitude,
      longitude
    } = data;

    
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("user_id", sql.UniqueIdentifier, user_id)
      .input("service_id", sql.UniqueIdentifier, service_id)
      .input("start_date", sql.Date, start_date)
      .input("end_date", sql.Date, end_date)
      .input("time", sql.NVarChar, time)
      .input("gender", sql.NVarChar, gender)
      .input("first_language", sql.NVarChar, first_language)
      .input("second_language", sql.NVarChar, second_language)
      .input("address", sql.NVarChar, address)
      .input("patient_name", sql.NVarChar, patient_name)
      .input("patient_phone", sql.NVarChar, patient_phone)
      .input("patient_age", sql.Int, patient_age)
      .input("total_cost", sql.Decimal(10, 2), total_cost)
      .input("status", sql.NVarChar, status)
      .input('latitude', sql.Decimal,latitude)
      .input('longitude', sql.Decimal,longitude)
      .query(`
        INSERT INTO Booking (
          user_id, service_id, start_date, end_date, time, gender, first_language, second_language, address, patient_name, patient_phone, patient_age, total_cost, status,latitude,longitude
        )
        OUTPUT INSERTED.*
        VALUES (
          @user_id, @service_id, @start_date, @end_date, @time, @gender, @first_language, @second_language, @address, @patient_name, @patient_phone, @patient_age, @total_cost, @status,@latitude,@longitude
        )
      `);

    if (result.recordset.length === 0) {
      return null;
    }

    // Return the full inserted row
    return {
      success: true,
      data: result.recordset[0]
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const cancellation = async (data) =>{

  const {booking_id,user_id,cancle_reason} = data;

  const pool = await poolPromise;

  const result = await pool
  .request()
  .input("booking_id",sql.UniqueIdentifier,booking_id)
  .input("user_id",sql.UniqueIdentifier,user_id)
   .input("cancle_reason",sql.NVarChar,cancle_reason)
   .query(`BEGIN TRANSACTION;
    INSERT INTO CancleBooking (
         booking_id, user_id,cancle_reason
        )
        OUTPUT INSERTED.*
        VALUES (
          @booking_id,@user_id,@cancle_reason
        )

         UPDATE Booking
        SET status = 'cancelled'
        WHERE id = @booking_id;
        COMMIT;
    `)

      return {
      success: true,
      data: result.recordset[0]
    };

};

export const complete = async (appointment_id) => {
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id", sql.UniqueIdentifier, appointment_id)
      .query(`SELECT * FROM Appointment WHERE id = @id`);

    if (result.recordset.length === 0) {
      return {
        success: false,
        message: "No appointment found with the given ID",
        data: null,
      };
    }

    return {
      success: true,
      data: result.recordset[0], // ✅ return single row, not array
    };
  } catch (error) {
    console.error("Database error (complete):", error);
    return {
      success: false,
      message: "Database error",
      error,
    };
  }
};




export const getBooking = async (data) =>{

  const {booking_id,user_id} = data;

  const pool = await poolPromise;

  const result = await pool
  .request()
  .input("booking_id",sql.UniqueIdentifier,booking_id)
  .input("user_id",sql.UniqueIdentifier,user_id)
   
   .query(`SELECT * FROM Booking where user_id = @user_id
    `)

      return {
      success: true,
      data: result.recordset[0]
    }
  }
  
