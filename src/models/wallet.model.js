import { poolPromise } from "../config/db.config.js";
import sql from 'mssql';


export const getWalletByUser = async (service_provider_id) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("service_provider_id", service_provider_id)
        
        .query("SELECT * FROM Wallet WHERE service_provider_id= @service_provider_id");
    return result.recordset[0];
}

export const getWalletMinus = async (service_provider_id, medcapsky_cost) => {
  const pool = await poolPromise;

  // 🔹 Update balance
  await pool.request()
    .input("service_provider_id", sql.UniqueIdentifier, service_provider_id)
    .input("medcapsky_cost", sql.Decimal(18, 2), medcapsky_cost)
    .query(`
      UPDATE Wallet
      SET balance = balance - @medcapsky_cost
      WHERE service_provider_id = @service_provider_id;
    `);

  // 🔹 Return updated wallet row
  const result = await pool.request()
    .input("service_provider_id", sql.UniqueIdentifier, service_provider_id)
    .query(`
      SELECT * FROM Wallet WHERE service_provider_id = @service_provider_id;
    `);

  return result.recordset[0] || null;
};


export const createWallet = async (service_provider_id, balance) => {
  console.log("service_provider_id Wallet model", service_provider_id);
  console.log("amount model", balance);

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("service_provider_id", sql.UniqueIdentifier, service_provider_id)
      .input("balance", sql.Decimal(18,2), balance) // fixed name + added type
      .query(`INSERT INTO Wallet (service_provider_id, balance) 
              VALUES (@service_provider_id, @balance)`);

    return result.recordset;
  } catch (error) {
    console.error("DB Error (createWallet):", error);
    throw error;
  }
};


export const updateWalletBalance = async (wallet_id, newBalance) => {
    const pool = await poolPromise;
     const result = await pool.request()
        .input("wallet_id", wallet_id)
        .input("newBalance", newBalance)
        .query("UPDATE Wallet SET balance = @newBalance WHERE id = @wallet_id");
        return result.recordset;
};
