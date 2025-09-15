import session from 'express-session';
import { poolPromise } from '../config/db.config.js';
import sql from 'mssql';

export const providerModel = {
   
  async create({ service_provider_id, first_name, last_name, email, age, gender, first_language, second_language }) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.UniqueIdentifier, service_provider_id)
    .input('first_name', sql.VarChar, first_name)
    .input('last_name', sql.VarChar, last_name)
    .input('email', sql.VarChar, email)
    .input('age', sql.Int, age)
    .input('gender', sql.VarChar, gender)
    .input('first_language', sql.VarChar, first_language)
    .input('second_language', sql.VarChar, second_language)
    .query(`
      UPDATE ServiceProvider
      SET 
        first_name = @first_name,
        last_name = @last_name,
        email = @email,
        age = @age,
        gender = @gender,
        first_language = @first_language,
        second_language = @second_language,
        current_status = 2
      WHERE id = @id
    `);
  
  return result.recordset; // Now this will work
},


  async update({service_provider_id,first_name,last_name,email,age, gender,first_language,second_language}) {
   
    
    const pool = await poolPromise;
    const result = await pool.request()
    await pool.request()
      .input('id',sql.UniqueIdentifier,service_provider_id)
      .input('first_name', first_name)
      .input('last_name', last_name)
      .input('email', email)
      .input('age', age)
      .input('gender', gender)
      .input('first_language', first_language)
        .input('second_language', second_language)
      .query(`
     UPDATE ServiceProvider
     SET 
    first_name = @first_name,
    last_name = @last_name,
    email = @email,
    age = @age,
    gender = @gender,
    first_language = @first_language,
    second_language = @second_language,
      current_status = 2
     WHERE id = @id;
      `);
      return result.recordset;
  },

  
  async updateVeryfied({service_provider_id,first_name,last_name,email,mobile_no}) {
   
    
    const pool = await poolPromise;
    const result = await pool.request()
    await pool.request()
      .input('id',sql.UniqueIdentifier,service_provider_id)
      .input('first_name', first_name)
      .input('last_name', last_name)
      .input('email', email)
      .input('mobile_no', mobile_no)
      
      .query(`
     UPDATE ServiceProvider
     SET 
    first_name = @first_name,
    last_name = @last_name,
    email = @email,
    mobile_no = @mobile_no
     WHERE id = @id;
      `);
      return result.recordset;
  },

 async getByProviderId(data) {
  const {service_provider_id} = data;
  try {
    console.log("db service_provider_id:", service_provider_id);

    const pool = await poolPromise;
    const result = await pool.request()
      .input("service_provider_id",sql.UniqueIdentifier, service_provider_id)
      .query(`SELECT * FROM ServiceProvider WHERE id = @service_provider_id`);

    return result.recordset;
  } catch (error) {
    console.error("Error fetching ServiceProvider:", error.message);
    throw error;
  }
},

 async getByProviderIdConfirmed(service_provider_id) {

  try {
    console.log("db service_provider_id:", service_provider_id);

    const pool = await poolPromise;
    const result = await pool.request()
      .input("service_provider_id",sql.UniqueIdentifier, service_provider_id)
      .query(`SELECT * FROM ServiceProvider WHERE id = @service_provider_id`);

    return result.recordset;
  } catch (error) {
    console.error("Error fetching ServiceProvider:", error.message);
    throw error;
  }
},


    async checkStatus(service_provider_id ) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('service_provider_id ', service_provider_id )
      
      .query(`
        SELECT current_status FROM ServiceProvider
        WHERE id = @service_provider_id 
         
      `);
    return result.recordset;
  },

      async providerId(mobile_no) {
       
    const pool = await poolPromise;
    const result = await pool.request()
      .input('mobile_no', mobile_no)
      
      .query(`
        SELECT id,current_status FROM ServiceProvider
        WHERE mobile_no = @mobile_no
         
      `);
    return result.recordset[0];
  },

        async fetchServiceProviderIdByMobile(mobile_no) {
       
        const pool = await poolPromise;
        const result = await pool.request()
      .input('mobile_no',sql.NVarChar, mobile_no)
      
      .query(`
        SELECT id FROM ServiceProvider
        WHERE mobile_no = @mobile_no;
         
      `);
    return result.recordset[0];
  },
     async fetchRegisteredServiceProviderIdByMobile(mobile_no) {
       
        const pool = await poolPromise;
        const result = await pool.request()
      .input('mobile_no',sql.NVarChar, mobile_no)
      
      .query(`
        SELECT id FROM ServiceProvider
        WHERE mobile_no = @mobile_no AND current_status =5;
         
      `);
    return result.recordset[0];
  },
    async fetchServiceProviderIdByEmail(email) {
        
        console.log('db_email',email)
        const pool = await poolPromise;
        const result = await pool.request()
      .input('email',sql.NVarChar, email)
      
      .query(`
        SELECT id FROM ServiceProvider
        WHERE email = @email;
         
      `);
    return result.recordset[0];
  },

async providerListWithExperiance(service_category_id) {
  console.log('db_service_category_id', service_category_id);

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('service_category_id', sql.UniqueIdentifier, service_category_id)
      .query(`
        SELECT DISTINCT
          pd.id,
          pd.service_provider_id,
          pd.service_category_id,
          pd.experience,
          pa.street,
          pa.city,
          pa.state,
          pa.postal_code,
          pa.country,
          pa.latitude,
          pa.longitude,
          -- ✅ Calculate distance in km
          (6371 * acos(
              cos(radians(b.latitude)) 
              * cos(radians(pa.latitude)) 
              * cos(radians(pa.longitude) - radians(b.longitude)) 
              + sin(radians(b.latitude)) 
              * sin(radians(pa.latitude))
          )) AS distance_km
        FROM ProviderDocuments pd
        INNER JOIN ProviderAddress pa
          ON pd.service_provider_id = pa.service_provider_id
        INNER JOIN Booking b
          ON b.service_id = pd.service_category_id  -- ✅ Match booking's service category
        WHERE pd.service_category_id = @service_category_id
        AND (6371 * acos(
              cos(radians(b.latitude)) 
              * cos(radians(pa.latitude)) 
              * cos(radians(pa.longitude) - radians(b.longitude)) 
              + sin(radians(b.latitude)) 
              * sin(radians(pa.latitude))
        )) <= 10  -- ✅ within 10 km radius
        ORDER BY distance_km ASC;
      `);

    return result.recordset;
  } catch (err) {
    console.error("Error fetching provider list:", err);
    throw err;
  }
}

}

