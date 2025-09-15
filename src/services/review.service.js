import { reviewModel } from "../models/review.model.js";

export const reviewService = {
  async createOrUpdate({
    review_from_id,
    review_from_role,
    review_to_id,
    review_to_role,
    booking_id,
    service_category_id,
    review_text,
    rating,
    id // optional for update
  }) {
    if (rating < 1 || rating > 10) {
      throw new Error("Rating must be between 1 and 10");
    }

    const reviewData = {
      review_from_id,
      review_from_role,
      review_to_id,
      review_to_role,
      booking_id,
      service_category_id,
      review_text,
      rating
    };

    if (id) {
      const existing = await reviewModel.findById(id);
      if (existing) {
        return reviewModel.update(id, reviewData);
      }
    }

    return reviewModel.create(reviewData);
  },

  async getById(id) {
    return reviewModel.findById(id);
  },

  async update(id, reviewData) {
    if (
      reviewData.rating &&
      (reviewData.rating < 1 || reviewData.rating > 10)
    ) {
      throw new Error("Rating must be between 1 and 10");
    }
    return reviewModel.update(id, reviewData);
  },

  async delete(id) {
    return reviewModel.remove(id);
  },

  async findByReviewerAndReviewee(review_from_id, review_to_id, service_category_id) {
    // Better to move this logic inside reviewModel for efficiency
    const all = await reviewModel.findAll();
    return all.find(
      rv =>
        rv.review_from_id === review_from_id &&
        rv.review_to_id === review_to_id &&
        rv.service_category_id === service_category_id
    );
  }
};

