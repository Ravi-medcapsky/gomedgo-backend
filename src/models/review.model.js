import { poolPromise } from "../config/db.config.js";
import sql from 'mssql';
export const reviewModel = {
  async create(reviewData) {
    const { review_from_id, review_from_role, review_to_id, review_to_role,booking_id, service_category_id, review_text, rating } = reviewData;
    const pool = await poolPromise;
    const result = await pool.request()
      .input("review_from_id", sql.UniqueIdentifier, review_from_id)
      .input("review_from_role", sql.NVarChar, review_from_role)
      .input("review_to_id", sql.UniqueIdentifier,review_to_id)
      .input("review_to_role", sql.NVarChar, review_to_role)
      .input("booking_id",sql.UniqueIdentifier,booking_id)
      .input("service_category_id", sql.UniqueIdentifier, service_category_id)
      .input("review_text", sql.NVarChar, review_text)
      .input("rating", sql.Int, rating)
      .query(`
        INSERT INTO Reviews (review_from_id, review_from_role, review_to_id, review_to_role,booking_id, service_category_id, review_text, rating) 
        OUTPUT INSERTED.* 
        VALUES (NEWID(), @review_from_id, @review_from_role, @reviewee_id, @booking_id, @service_category_id, @review_text, @rating
        )
      `);
    return result.recordset[0];
  },

  async findById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("review_id", sql.UniqueIdentifier, review_id)
      .query("SELECT * FROM Reviews WHERE review_id = @review_id");
    return result.recordset[0];
  },

  async update(review_id, reviewData) {
    const { review_text, rating } = reviewData;
    const pool = await poolPromise;
    const result = await pool.request()
      .input("review_id", sql.Int, id)
      .input("review_text", sql.NVarChar, review_text)
      .input("rating", sql.Int, rating)
      .query(
        `UPDATE Reviews 
         SET review_text = @review_text, rating = @rating, updated_at = GETDATE() 
         OUTPUT INSERTED.* 
         WHERE review_id = @review_id`
      );
    return result.recordset[0];
  },

  async remove(review_id) {
    const pool = await poolPromise;
    await pool.request()
      .input("review_id", sql.Int, id)
      .query("DELETE FROM Reviews WHERE review_id = @review_id");
    return true;
  }
};
