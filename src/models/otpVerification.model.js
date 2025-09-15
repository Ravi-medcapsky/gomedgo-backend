import { poolPromise } from '../config/db.config.js';

export const otpVerificationModel = {
  async create({ identifier, otp, expiresAt, type }) {
    const pool = await poolPromise;
    await pool.request()
      .input('identifier', identifier)
      .input('otp', otp)
      .input('expiresAt', expiresAt)
      .input('type', type)
      .query(`
        INSERT INTO OtpVerifications (identifier, otp, expires_at, type)
        VALUES (@identifier, @otp, @expiresAt, @type)
      `);
  },

  async verifyOtp(identifier, otp) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('identifier', identifier)
      .input('otp', otp)
      .query(`
        SELECT * FROM OtpVerifications
        WHERE identifier = @identifier
          AND otp = @otp
          AND verified = 0
          AND expires_at > GETDATE()
      `);
    return result.recordset[0];
  },

  async markVerified(id) {
    const pool = await poolPromise;
    await pool.request()
      .input('id', id)
      .query(`
        UPDATE OtpVerifications
        SET verified = 1, updated_at = GETDATE()
        WHERE id = @id
      `);
  }
};

export const verifyOrRegisterServiceProvider = async (data) => {
   console.log('data',data);
   const {identifier,type} =data;
   
  const pool = await poolPromise;
 
  if (!['mobile', 'email'].includes(type)) {
    throw new Error("Invalid type. Allowed: 'mobile' or 'email'");
  }

  let columnName = type === 'mobile' ? 'mobile_no' : 'email';
  console.log('columnName',columnName)
 console.log('identfier',identifier)
  // Check if ServiceProvider exists
  const checkUser = await pool.request()
    .input(columnName, identifier)
    .query(`
      SELECT * 
      FROM ServiceProvider 
      WHERE ${columnName} = @${columnName}
      AND current_status IN (0, 1, 2, 3, 4);
    `);

  if (checkUser.recordset.length > 0) {
    return {
      newprovider: checkUser.recordset[0],
      isRegistered: true, // ✅ true means already in DB but not registered completly
      DBmessage : "user not Register Completly"
    };
  }

  // Register new user
  const current_status = 0;
  const insertUser = await pool.request()
    .input(columnName, identifier)
    .input('current_status', current_status)
    .query(`
      INSERT INTO ServiceProvider (${columnName}, current_status)
      OUTPUT INSERTED.*
      VALUES (@${columnName}, @current_status);
    `);

  return {
    newprovider: insertUser.recordset[0],
    isRegistered: false, // ✅ false means newly registered
     DBmessage: 'User not registered, please sign up',
  };
};
