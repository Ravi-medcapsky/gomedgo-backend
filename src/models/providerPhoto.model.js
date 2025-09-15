import { poolPromise } from '../config/db.config.js';
import sql from 'mssql';


export const providerPhotoModel = {

  async createPhoto(data) {
    const {service_provider_id, fileBuffer} = data;
    console.log('provider_id',service_provider_id)
    console.log('file',fileBuffer)
    const pool = await poolPromise;
    const result = await pool.request()
      .input('service_provider_id', sql.UniqueIdentifier,service_provider_id)
      .input('file_name', sql.VarBinary(sql.MAX), fileBuffer)
      .query(`BEGIN TRANSACTION;
        INSERT INTO ProviderPhoto (service_provider_id, file_name)
        VALUES (@service_provider_id, @file_name);

        UPDATE ServiceProvider
        SET current_status = 1
        WHERE id = @service_provider_id;
        COMMIT;

       `);
      
    return result;
  },

  async getPhotoByProviderId(service_provider_id) {
   
    
    const pool = await poolPromise;
    const result = await pool.request()
      .input('service_provider_id',sql.UniqueIdentifier, service_provider_id)
      .query(`SELECT * FROM ProviderPhoto WHERE service_provider_id = @service_provider_id`);
    return result.recordset[0];
  },


  async upadatePhoto(data ) {
     const {service_provider_id, fileBuffer} = data;
    console.log('provider_id',service_provider_id)
    console.log('file',fileBuffer)

    const pool = await poolPromise;
    const result = await pool.request()
      .input('service_provider_id',sql.UniqueIdentifier,service_provider_id  )
      .input('file_name',sql.VarBinary(sql.MAX), fileBuffer)
      .query(`UPDATE ProviderPhoto
              SET file_name = @file_name, 
              updated_at = GETDATE()
              WHERE service_provider_id = @service_provider_id; `);
    return result.recordset;
  },

    async deletePhoto(data) {
    const {service_provider_id} = data;
    
    const pool = await poolPromise;
    const result = await pool.request()
      .input('service_provider_id',sql.UniqueIdentifier, service_provider_id)
      .query(`DELETE FROM ProviderPhoto WHERE service_provider_id = @service_provider_id`);
    return result.recordset;
  },
};
