import { poolPromise } from "../config/db.config.js";

export const addTransaction = async (wallet_id, type, amount) => {
    const pool = await poolPromise;
    await pool.request()
        .input("wallet_id", wallet_id)
        .input("type", type)
        .input("amount", amount)
        .query("INSERT INTO Transactions (wallet_id, type, amount) VALUES (@wallet_id, @type, @amount)");
};

export const getTransactions = async (wallet_id) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("wallet_id", wallet_id)
        .query("SELECT * FROM Transactions WHERE wallet_id = @wallet_id ORDER BY created_at DESC");
    return result.recordset;
};
