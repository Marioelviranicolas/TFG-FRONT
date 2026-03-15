// src/components/album/reviews/ReviewCard.jsx
import RenderStars from './RenderStars';

const ReviewCard = ({ review }) => (
    <div className="ap-review-card">
        <div className="ap-review-top">
            <span className="ap-username">{review.user.username}</span>
            <RenderStars rating={review.rating} />
        </div>
        {review.comment && <p className="ap-comment">{review.comment}</p>}
        <span className="ap-date">
            {new Date(review.createdAt).toLocaleDateString('es-ES')}
        </span>
    </div>
);

export default ReviewCard;
