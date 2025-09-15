import { poolPromise } from '../config/db.config.js';
import sql from 'mssql';

export const messageModel = {
  async create( message, message_sender_id, role ) {
    console.log('db_message:', message);
    console.log('db_sender_id:', message_sender_id, 'role:', role);

    const status = 'New Message';
    const pool = await poolPromise;

    const result = await pool.request()
      .input('message', sql.NVarChar, message)
      .input('message_sender_id', sql.UniqueIdentifier, message_sender_id)
      .input('role', sql.NVarChar, role)
      .input('status', sql.NVarChar, status)
      .query(`
        INSERT INTO AdminMessage (message, message_sender_id, role, status)
        VALUES (@message, @message_sender_id, @role, @status)
      `);

    return result.rowsAffected; // returns how many rows were inserted
  },
};
