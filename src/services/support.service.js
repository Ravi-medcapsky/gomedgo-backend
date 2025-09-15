import sql from "mssql";
import { supportModel } from "../models/support.model.js";
import { dbConfig } from "../config/db.js";

export const createSupportTicket = async (data) => {
  try {
    let pool = await sql.connect(dbConfig);
    let result = await pool
      .request()
      .input("userId", sql.UniqueIdentifier, data.userId)
      .input("subject", sql.NVarChar(255), data.subject)
      .input("message", sql.NVarChar(sql.MAX), data.message || null)
      .input("attachment", sql.NVarChar(500), data.attachment || null)
      .query(supportModel.createTicket);

    return { status: 200, success: true, data: result.recordset[0] };
  } catch (error) {
    return { status: 500, success: false, message: error.message };
  }
};

export const getSupportHistory = async (userId) => {
  try {
    let pool = await sql.connect(dbConfig);
    let result = await pool
      .request()
      .input("userId", sql.UniqueIdentifier, userId)
      .query(supportModel.getHistoryByUserId);

    return { status: 200, success: true, data: result.recordset };
  } catch (error) {
    return { status: 500, success: false, message: error.message };
  }
};
