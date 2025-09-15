import { poolPromise } from "../config/db.config.js";
import sql from 'mssql';

const mapUser = (row) => ({
  id: row.u_id,
  identifier: row.identifier,
  fullName: row.full_name,
  email: row.email,
  address: row.address,
  avatarUrl: row.avatar_url,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

export const findByIdentifier = async (identifier) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("identifier", sql.NVarChar, identifier)
      .query("SELECT * FROM users WHERE identifier = @identifier");
    
    if (!result.recordset.length) return null;
    return mapUser(result.recordset[0]);
  } catch (error) {
    console.error('Error finding user by identifier:', error);
    throw error;
  }
};

export const findById = async (userId) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("userId", sql.UniqueIdentifier, userId)
      .query("SELECT * FROM users WHERE u_id = @userId");
    
    if (!result.recordset.length) return null;
    return mapUser(result.recordset[0]);
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw error;
  }
};

export const findByEmail = async (email) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .query("SELECT * FROM users WHERE email = @email");
    
    if (!result.recordset.length) return null;
    return mapUser(result.recordset[0]);
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
};

export const updateUser = async (userId, updateData) => {
  try {
    const { fullName, email, address, avatarUrl } = updateData;
    const pool = await poolPromise;
    const request = pool.request();

    // Build dynamic update query
    const updateFields = [];
    const params = {};

    if (fullName !== undefined) {
      updateFields.push("full_name = @fullName");
      params.fullName = fullName;
      request.input("fullName", sql.NVarChar, fullName);
    }

    if (email !== undefined) {
      updateFields.push("email = @email");
      params.email = email;
      request.input("email", sql.NVarChar, email);
    }

    if (address !== undefined) {
      updateFields.push("address = @address");
      params.address = address;
      request.input("address", sql.NVarChar, address);
    }

    if (avatarUrl !== undefined) {
      updateFields.push("avatar_url = @avatarUrl");
      params.avatarUrl = avatarUrl;
      request.input("avatarUrl", sql.NVarChar, avatarUrl);
    }

    if (updateFields.length === 0) {
      throw new Error('No fields to update');
    }

    // Always update the updated_at field
    updateFields.push("updated_at = GETDATE()");

    request.input("userId", sql.UniqueIdentifier, userId);

    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE u_id = @userId
    `;

    await request.query(query);

    // Return updated user
    return await findById(userId);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const createUser = async (userData) => {
  const { identifier, full_name, email, address, avatarUrl } = userData;

  try {
    const pool = await poolPromise;
    const request = pool.request();

    request.input("identifier", sql.NVarChar, identifier);
    request.input("full_name", sql.NVarChar, full_name || null);
    request.input("email", sql.NVarChar, email || null);
    request.input("address", sql.NVarChar, address || null);
    request.input("avatar_url", sql.NVarChar, avatarUrl || null);

    const query = `
      INSERT INTO users (identifier, full_name, email, address, avatar_url)
      VALUES (@identifier, @full_name, @email, @address, @avatar_url)
    `;

    await request.query(query);
    return await findByIdentifier(identifier);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// export const create = createUser;

