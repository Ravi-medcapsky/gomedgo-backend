import { sql, poolPromise } from "../config/db.js";

export default class ProviderSupportModel {
  static async createSupportTicket({ ProviderId, subject, message, attachment }) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("ProviderId", sql.UniqueIdentifier, ProviderId)
      .input("subject", sql.NVarChar(255), subject)
      .input("message", sql.NVarChar(sql.MAX), message)
      .input("attachment", sql.NVarChar(500), attachment)
      .query(`
        INSERT INTO ProviderHelpAndSupport (ProviderId, subject, message, attachment) 
        OUTPUT INSERTED.* 
        VALUES (@ProviderId, @subject, @message, @attachment)
      `);

    return result.recordset[0];
  }

  static async getSupportHistory(ProviderId) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("ProviderId", sql.UniqueIdentifier, ProviderId)
      .query(`
        SELECT * FROM ProviderHelpAndSupport
        WHERE ProviderId = @ProviderId
        ORDER BY createdAt DESC
      `);

    return result.recordset;
  }
}
