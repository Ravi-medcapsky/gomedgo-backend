import { poolPromise } from "../config/db.config.js";
import sql from 'mssql';

export const appointmenModel = {
async get(service_provider_id) {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('service_provider_id', sql.UniqueIdentifier, service_provider_id)
      .query(`
        SELECT *
        FROM Appointment
        WHERE service_provider_id = @service_provider_id
        AND status IN ('pending', 'confirmed', 'waiting')
      `);

    // return all matching appointments
    return result.recordset || [];

  } catch (error) {
    console.error("Error fetching Appointment:", error.message);
    throw error;
  }
},
async updateConfirmed(service_provider_id, booking_id) {
  try {
    const pool = await poolPromise;

    console.log('service_provider_id model:', service_provider_id);
    console.log('booking_id model:', booking_id);

    const result = await pool.request()
      .input('service_provider_id', sql.UniqueIdentifier, service_provider_id)
      .input('booking_id', sql.UniqueIdentifier, booking_id)
      .query(`
        UPDATE Appointment
        SET status = 'confirmed'
        WHERE booking_id = @booking_id 
          AND service_provider_id = @service_provider_id;
      `);

    // Return number of rows updated
    return result.rowsAffected[0] || 0;

  } catch (error) {
    console.error("Error updating Appointment:", error.message);
    throw error;
  }
},

async updateDone(service_provider_id, booking_id) {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('service_provider_id', sql.UniqueIdentifier, service_provider_id)
      .input('booking_id', sql.UniqueIdentifier, booking_id)
      .query(`
        UPDATE Appointment
        SET status = 'done'
        WHERE booking_id = @booking_id 
          AND service_provider_id = @service_provider_id;
      `);

    // Return number of rows updated
    return result.rowsAffected[0] || 0;

  } catch (error) {
    console.error("Error updating Appointment:", error.message);
    throw error;
  }
},
async updateWaiting(service_provider_id, booking_id) {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('service_provider_id', sql.UniqueIdentifier, service_provider_id)
      .input('booking_id', sql.UniqueIdentifier, booking_id)
      .query(`
        UPDATE Appointment
        SET status = 'waiting'
        WHERE booking_id = @booking_id 
          AND service_provider_id <> @service_provider_id;
      `);

    // Return number of rows updated
    return result.rowsAffected[0] || 0;

  } catch (error) {
    console.error("Error updating Appointment:", error.message);
    throw error;
  }
},

async updateWaitngDelete(booking_id) {
  console.log('booking_id model',booking_id)
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('booking_id', sql.UniqueIdentifier, booking_id)
      .query(`
        DELETE FROM Appointment
        WHERE booking_id = @booking_id AND status = 'waiting';
      `);

    // Return number of rows deleted
    return result.rowsAffected[0] || 0;

  } catch (error) {
    console.error("Error deleting Appointment:", error.message);
    throw error;
  }
},

  
  async create( booking_id, service_provider_id, total_cost, status ) {
    try {
      console.log('db_total_cost:', total_cost);

      const pool = await poolPromise;
      const result = await pool.request()
        .input('booking_id', sql.UniqueIdentifier, booking_id)
        .input('service_provider_id', sql.UniqueIdentifier, service_provider_id)
        .input('total_cost', sql.Decimal(10, 2), total_cost)
        .input('status', sql.NVarChar, status)
        .query(`
          INSERT INTO Appointment (
            booking_id,
            service_provider_id,
            total_cost,
            status
          )
          OUTPUT INSERTED.*
          VALUES (
            @booking_id,
            @service_provider_id,
            @total_cost,
            @status
          )
        `);

      return result.recordset[0]; // return the inserted row (first record)

    } catch (error) {
      console.error("Error inserting into Appointment:", error.message);
      throw error;
    }
  },

  async getConfirmedAppointments( booking_id, service_provider_id ) {
    try {
     

      const pool = await poolPromise;
      const result = await pool.request()
        .input('booking_id', sql.UniqueIdentifier, booking_id)
        .input('service_provider_id', sql.UniqueIdentifier, service_provider_id)
        
        .query(`
         SELECT * FROM Appointment where status = 'confirmed' AND booking_id = @booking_id
        `);

      return result.recordset[0]; // return the inserted row (first record)

    } catch (error) {
      console.error("Error fetching confirmend  Appointment:", error.message);
      throw error;
    }
  },

};
