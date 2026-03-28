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

        el.innerHTML = '';

        reviews.forEach(review => {
            const item = document.createElement('div');
            item.className = 'review-item';

            const header = document.createElement('div');
            header.className = 'review-header';

            const reviewerName = document.createElement('span');
            reviewerName.className = 'reviewer-name';
            reviewerName.textContent = `${review.user?.firstName || ''} ${review.user?.lastName || ''}`;
            header.appendChild(reviewerName);

            const rating = document.createElement('span');
            rating.className = 'review-rating';
            rating.textContent = '⭐'.repeat(review.rating || 0);
            header.appendChild(rating);

            item.appendChild(header);

            const title = document.createElement('h4');
            title.textContent = review.title || '';
            item.appendChild(title);

            const comment = document.createElement('p');
            comment.className = 'review-text';
            comment.textContent = review.comment || '';
            item.appendChild(comment);

            const date = document.createElement('p');
            date.className = 'review-date';
            date.textContent = new Date(review.createdAt).toLocaleDateString();
            item.appendChild(date);

            const likeButton = document.createElement('button');
            likeButton.className = 'btn btn-sm btn-secondary';
            likeButton.type = 'button';
            likeButton.textContent = `👍 Like (${review.likes || 0})`;
            likeButton.addEventListener('click', () => this.likeReview(review._id));
            item.appendChild(likeButton);

            el.appendChild(item);
        });
    }

    showReviewForm(eventId, container = 'reviewFormContainer') {
        const el = document.getElementById(container);
        if (!el) return;

        el.innerHTML = '';

        const form = document.createElement('div');
        form.className = 'review-form';

        const heading = document.createElement('h3');
        heading.textContent = 'Leave a Review';
        form.appendChild(heading);

        const ratingGroup = document.createElement('div');
        ratingGroup.className = 'form-group';
        ratingGroup.innerHTML = `
            <label>Rating</label>
            <select id="reviewRating">
                <option value="">Select rating</option>
                <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                <option value="4">⭐⭐⭐⭐ Good</option>
                <option value="3">⭐⭐⭐ Average</option>
                <option value="2">⭐⭐ Poor</option>
                <option value="1">⭐ Very Poor</option>
            </select>
        `;
        form.appendChild(ratingGroup);

        const titleGroup = document.createElement('div');
        titleGroup.className = 'form-group';
        titleGroup.innerHTML = `
            <label>Title</label>
            <input type="text" id="reviewTitle" placeholder="Review title" maxlength="100">
        `;
        form.appendChild(titleGroup);

        const commentGroup = document.createElement('div');
        commentGroup.className = 'form-group';
        commentGroup.innerHTML = `
            <label>Comment</label>
            <textarea id="reviewComment" placeholder="Share your experience..." minlength="10" maxlength="1000"></textarea>
        `;
        form.appendChild(commentGroup);

        const submitButton = document.createElement('button');
        submitButton.className = 'btn btn-primary';
        submitButton.type = 'button';
        submitButton.textContent = 'Submit Review';
        submitButton.addEventListener('click', () => this.submitReview(eventId));
        form.appendChild(submitButton);

        el.appendChild(form);
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
