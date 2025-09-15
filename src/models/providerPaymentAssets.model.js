import { poolPromise } from '../config/db.config.js';
import sql from 'mssql';


export const  create = async (data ) =>
  {
    const {service_provider_id,bank_holder_name,account_number ,bank_name, ifsc_code} = data;
    const pool = await poolPromise;
     const result = await pool.request()
      .input('service_provider_id',sql.UniqueIdentifier,service_provider_id)
      .input('bank_holder_name', bank_holder_name)
      .input('account_number', account_number)
      .input('bank_name', bank_name)
      .input('ifsc_code',ifsc_code)
     
      .query(`BEGIN TRANSACTION;
        INSERT INTO ProviderPaymentAssets (service_provider_id,bank_holder_name,account_number,bank_name,ifsc_code)
        VALUES (@service_provider_id,@bank_holder_name, @account_number,@bank_name,@ifsc_code)

          UPDATE ServiceProvider
        SET current_status = 5
        WHERE id = @service_provider_id;
        COMMIT;
      `);
       return result.recordset;
  }

  export const  createUPI = async (data ) =>
  {
    const {service_provider_id,upi_id} = data;
    const pool = await poolPromise;
     const result = await pool.request()
      .input('service_provider_id',sql.UniqueIdentifier,service_provider_id)
      .input('upi_id', upi_id)
      
      .query(`BEGIN TRANSACTION;
        INSERT INTO ProviderPaymentAssets (service_provider_id,upi_id)
        VALUES (@service_provider_id, @upi_id)

          UPDATE ServiceProvider
        SET current_status = 5
        WHERE id = @service_provider_id;
        COMMIT;
      `);
       return result.recordset;
  }

    



 export const  getProviderPaymentAssets = async (service_provider_id) => {
   
    
      const pool = await poolPromise;
      const result = await pool.request()
        .input('service_provider_id',sql.UniqueIdentifier,service_provider_id)
        .query(`SELECT * FROM ProviderPaymentAssets WHERE service_provider_id = @service_provider_id`);
      return result.recordset[0];
    }

  export const  updatePayment = async ({service_provider_id,upi_id,bank_holder_name,account_number ,bank_name, ifsc_code}) => {
    
   {
    const pool = await poolPromise;
    const result= await pool.request()
      .input('service_provider_id',service_provider_id)
      .input('upi_id', upi_id)
      .input('bank_holder_name', bank_holder_name)
      .input('account_number', account_number)
      .input('bank_name', bank_name)
      .input('ifsc_code',ifsc_code)
     
      .query(`
        UPDATE ProviderPaymentAssets 
        SET
        service_provider_id = @service_provider_id,
        upi_id =@upi_id,
        bank_holder_name = @bank_holder_name,
        account_number = @account_number,
        bank_name = @bank_name,
        ifsc_code =@ifsc_code
        WHERE 
        service_provider_id = @service_provider_id; 
       
      `);
   return result.recordset;


}

  }


 


