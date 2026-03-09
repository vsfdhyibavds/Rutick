// Review management utilities

class ReviewManager {
    async getEventReviews(eventId, page = 1) {
        const result = await reviewAPI.getEventReviews(eventId, page);
        if (result.success) {
            return result.data.reviews;
        }
        return [];
    }

    async createReview(eventId, reviewData) {
        const result = await reviewAPI.create(eventId, reviewData);
        return result;
    }

    async updateReview(reviewId, reviewData) {
        const result = await reviewAPI.update(reviewId, reviewData);
        return result;
    }

    async deleteReview(reviewId) {
        const result = await reviewAPI.delete(reviewId);
        return result;
    }

    async likeReview(reviewId) {
        const result = await reviewAPI.like(reviewId);
        return result;
    }

    displayReviews(reviews, container = 'reviewsContainer') {
        const el = document.getElementById(container);
        if (!el) return;

        if (reviews.length === 0) {
            el.innerHTML = '<p>No reviews yet. Be the first to review!</p>';
            return;
        }

        let html = '';
        reviews.forEach(review => {
            html += `
                <div class="review-item">
                    <div class="review-header">
                        <span class="reviewer-name">${review.user?.firstName} ${review.user?.lastName}</span>
                        <span class="review-rating">${'⭐'.repeat(review.rating)}</span>
                    </div>
                    <h4>${review.title}</h4>
                    <p class="review-text">${review.comment}</p>
                    <p class="review-date">${new Date(review.createdAt).toLocaleDateString()}</p>
                    <button class="btn btn-sm btn-secondary" onclick="reviewManager.likeReview('${review._id}')">
                        👍 Like (${review.likes})
                    </button>
                </div>
            `;
        });

        el.innerHTML = html;
    }

    showReviewForm(eventId, container = 'reviewFormContainer') {
        const el = document.getElementById(container);
        if (!el) return;

        el.innerHTML = `
            <div class="review-form">
                <h3>Leave a Review</h3>
                <div class="form-group">
                    <label>Rating</label>
                    <select id="reviewRating">
                        <option value="">Select rating</option>
                        <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                        <option value="4">⭐⭐⭐⭐ Good</option>
                        <option value="3">⭐⭐⭐ Average</option>
                        <option value="2">⭐⭐ Poor</option>
                        <option value="1">⭐ Very Poor</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" id="reviewTitle" placeholder="Review title" maxlength="100">
                </div>
                <div class="form-group">
                    <label>Comment</label>
                    <textarea id="reviewComment" placeholder="Share your experience..." minlength="10" maxlength="1000"></textarea>
                </div>
                <button class="btn btn-primary" onclick="reviewManager.submitReview('${eventId}')">Submit Review</button>
            </div>
        `;
    }

    async submitReview(eventId) {
        const rating = parseInt(document.getElementById('reviewRating')?.value);
        const title = document.getElementById('reviewTitle')?.value;
        const comment = document.getElementById('reviewComment')?.value;

        if (!rating || !title || !comment) {
            showNotification('Error', 'Please fill all fields', 'error');
            return;
        }

        const result = await this.createReview(eventId, { rating, title, comment });
        if (result.success) {
            showNotification('Success', 'Review submitted!', 'success');
            // Reload reviews
            const reviews = await this.getEventReviews(eventId);
            this.displayReviews(reviews);
            document.querySelector('.review-form').remove();
        } else {
            showNotification('Error', result.error, 'error');
        }
    }
}

const reviewManager = new ReviewManager();
