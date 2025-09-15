import fs from 'fs';
import sql from 'mssql';
import { poolPromise } from '../config/db.config.js';
 
// Insert document
export const insertProviderDocument = async (service_provider_id,data, files) => {
  const {
    
    service_category_id,
    nurse_type,
    hospital_information,
    experience,
    your_self
  } = data;
 
  const aadharBuffer = files?.aadhar_card?.[0]?.buffer || null;
  const nurseRegBuffer = files?.nurse_registration_card?.[0]?.buffer || null;
  const empIdBuffer = files?.employee_id_card?.[0]?.buffer || null;
 
  const pool = await poolPromise;
 
  return pool.request()
    .input('service_provider_id', sql.UniqueIdentifier, service_provider_id)
    .input('service_category_id', sql.UniqueIdentifier, service_category_id)
    .input('nurse_type', sql.VarChar(100), nurse_type)
    .input('aadhar_card', sql.VarBinary(sql.MAX), aadharBuffer)
    .input('nurse_registration_card', sql.VarBinary(sql.MAX), nurseRegBuffer)
    .input('employee_id_card', sql.VarBinary(sql.MAX), empIdBuffer)
    .input('hospital_information', sql.VarChar(255), hospital_information)
    .input('experience', sql.VarChar(255), experience)
    .input('your_self', sql.VarChar(sql.MAX), your_self)
    .query(`BEGIN TRANSACTION;
      INSERT INTO ProviderDocuments (
        service_provider_id,service_category_id , nurse_type,
        aadhar_card,nurse_registration_card, employee_id_card,
        hospital_information, experience, your_self,
        created_at, updated_at
      )
      VALUES (
        @service_provider_id,@service_category_id,@nurse_type,
        @aadhar_card,@nurse_registration_card,@employee_id_card,
        @hospital_information, @experience, @your_self,
        GETDATE(), GETDATE()
      )
         UPDATE ServiceProvider
        SET current_status = 4
        WHERE id = @service_provider_id;
        COMMIT;
    `);
};
 
// Similarly create functions for fetch, update, delete
 
export const fetchProviderDocumentsByServiceProviderId = async (service_provider_id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('service_provider_id', sql.UniqueIdentifier, service_provider_id)
    .query(`
      SELECT
        id, service_provider_id, service_category_id, nurse_type,
        hospital_information, experience, your_self,
        CASE WHEN aadhar_card IS NOT NULL THEN 1 ELSE 0 END AS has_aadhar_card,
        CASE WHEN nurse_registration_card IS NOT NULL THEN 1 ELSE 0 END AS has_nurse_registration_card,
        CASE WHEN employee_id_card IS NOT NULL THEN 1 ELSE 0 END AS has_employee_id_card,
        created_at, updated_at
      FROM ProviderDocuments
      WHERE service_provider_id = @service_provider_id
    `);
 
  return result.recordset[0];
};
 
export const updateProviderDocumentById = async (service_provider_id,data,files) => {
  const {
    
    service_category_id,
    nurse_type,
    hospital_information,
    experience,
    your_self
  } = data;

  const aadharBuffer = files?.aadhar_card?.[0]?.buffer || null;
  const nurseRegBuffer = files?.nurse_registration_card?.[0]?.buffer || null;
  const empIdBuffer = files?.employee_id_card?.[0]?.buffer || null;
 
  const pool = await poolPromise;
  const request = pool.request()
    .input('service_provider_id', sql.UniqueIdentifier, service_provider_id)
    .input('service_category_id', sql.VarChar(100), service_category_id)
    .input('nurse_type', sql.VarChar(100), nurse_type)
    .input('hospital_information', sql.VarChar(200), hospital_information)
    .input('experience', sql.VarChar(200), experience)
    .input('your_self', sql.VarChar(sql.MAX), your_self)
    .input('updated_at', sql.DateTime, new Date());

  if (aadharBuffer) request.input('aadhar_card', sql.VarBinary(sql.MAX), aadharBuffer);
  if (nurseRegBuffer) request.input('nurse_registration_card', sql.VarBinary(sql.MAX), nurseRegBuffer);
  if (empIdBuffer) request.input('employee_id_card', sql.VarBinary(sql.MAX), empIdBuffer);

  // Build dynamic SQL update query
  let query = `
    UPDATE ProviderDocuments SET
      service_category_id = @service_category_id,
      nurse_type = @nurse_type,
      hospital_information = @hospital_information,
      experience = @experience,
      your_self = @your_self,
      updated_at = @updated_at
  `;

  if (aadharBuffer) query += `, aadhar_card = @aadhar_card`;
  if (nurseRegBuffer) query += `, nurse_registration_card = @nurse_registration_card`;
  if (empIdBuffer) query += `, employee_id_card = @employee_id_card`;

  query += ` WHERE service_provider_id = @service_provider_id`;

  return request.query(query);
};
 
export const deleteProviderDocumentById = async (id) => {
  const pool = await poolPromise;
  return pool.request()
    .input('id', sql.UniqueIdentifier, id)
    .query(`DELETE FROM ProviderDocuments WHERE id = @id`);
};


export const fetchProviderDocumentByMobileNo = async (mobile_no) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('mobile_no', sql.NVarChar(12), mobile_no)
    .query(`
      SELECT * FROM ProviderDocuments WHERE mobile_no = @mobile_no
    `);
  return result.recordset;
};
