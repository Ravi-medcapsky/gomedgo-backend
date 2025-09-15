import { reviewService } from "../services/review.service.js";
import { sendResponse } from "../utils/responseHelper.js";

export const reviewController = {
  async create(req, res, next) {
    try {
      const {
        review_to_id,
        review_to_role,
        booking_id,
        service_category_id,
        review_text,
        rating
      } = req.body;

      // IDs from session
      const review_from_id =
        req.session.user_id || req.session.service_provider_id || null;
      const review_from_role = req.session.user_id
        ? "user"
        : req.session.service_provider_id
        ? "provider"
        : null;

      if (!review_from_id || !review_from_role) {
        return sendResponse(res, 401, false, "Unauthorized: No reviewer in session");
      }

      const data = await reviewService.createOrUpdate({
        review_from_id,
        review_from_role,
        review_to_id,
        review_to_role,
        booking_id,
        service_category_id,
        review_text,
        rating
      });

      return sendResponse(res, 201, true, "Review created/updated successfully", data);
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const data = await reviewService.getById(req.params.id);
      return sendResponse(res, 200, true, "Review fetched", data);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { review_text, rating } = req.body;
      const data = await reviewService.update(req.params.id, { review_text, rating });
      return sendResponse(res, 200, true, "Review updated", data);
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await reviewService.delete(req.params.id);
      return sendResponse(res, 200, true, "Review deleted");
    } catch (err) {
      next(err);
    }
  }
};
