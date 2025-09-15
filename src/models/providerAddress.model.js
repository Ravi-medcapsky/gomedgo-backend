import { poolPromise } from '../config/db.config.js';
import sql from 'mssql';

export const insertProviderAddress = async (data) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('service_provider_id', sql.UniqueIdentifier, data.service_provider_id)
    .input('street', sql.VarChar, data.street)
    .input('city', sql.VarChar, data.city)
    .input('state', sql.VarChar, data.state)
    .input('postal_code', sql.Int, data.postal_code)
    .input('country', sql.VarChar, data.country)
    .input('latitude', sql.Decimal, data.latitude)
    .input('longitude', sql.Decimal, data.longitude)
    .query(`BEGIN TRANSACTION;
      INSERT INTO ProviderAddress (
        service_provider_id, street, city, state,
        postal_code, country, latitude, longitude
      ) VALUES (
        @service_provider_id, @street, @city, @state,
        @postal_code, @country, @latitude, @longitude
     );
      UPDATE ServiceProvider
        SET current_status = 3
        WHERE id = @service_provider_id;
        COMMIT;
    `);

 return result.recordset;
};

export const updateProviderAddress = async (data) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('service_provider_id', sql.UniqueIdentifier, data.service_provider_id)
    .input('street', sql.VarChar, data.street)
    .input('city', sql.VarChar, data.city)
    .input('state', sql.VarChar, data.state)
    .input('postal_code', sql.Int, data.postal_code)
    .input('country', sql.VarChar, data.country)
    .input('latitude', sql.Decimal, data.latitude)
    .input('longitude', sql.Decimal, data.longitude)
    .query(`
      UPDATE ProviderAddress 
        SET 
        street = @street,
         city = @city,
        state =@state,
        postal_code = @postal_code,
         country = @country,
         latitude = @latitude,
          longitude = @longitude
          WHERE service_provider_id = @service_provider_id;
    `);

  return result.recordset;
};


 export const   getProviderAddress = async (service_provider_id) => {
  
      console.log('db',service_provider_id)
      const pool = await poolPromise;
      const result = await pool.request()
        .input('service_provider_id',sql.UniqueIdentifier, service_provider_id)
        .query(`SELECT * FROM ProviderAddress where service_provider_id = @service_provider_id`);
      return result.recordset[0];
    };
  
 

export const deleteProviderAddress = async (service_provider_id) => {
  console.log("db", service_provider_id);
  const pool = await poolPromise;

  const result = await pool.request()
    .input("service_provider_id", sql.UniqueIdentifier, service_provider_id)
    .query(`
      DELETE FROM ProviderAddress 
      OUTPUT DELETED.* 
      WHERE service_provider_id = @service_provider_id
    `);

  return result.recordset[0]; // return deleted row (if any)
};
