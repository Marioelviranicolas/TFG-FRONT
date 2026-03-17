import RenderStars from './RenderStars';
import LikeButton from './LikeButton';

const ReviewCard = ({ review }) => {
    return (
        <div className="ap-review-card">
            <div className="ap-review-top">
                <span className="ap-username">{review.user.username}</span>
                <RenderStars rating={review.rating} />
            </div>
            {review.comment && <p className="ap-comment">{review.comment}</p>}
            <div className='ap-review-bottom'>
                <span className="ap-date">
                    {new Date(review.createdAt).toLocaleDateString('es-ES')}
                </span>
                <LikeButton reviewId={review.id} />
            </div>
        </div>
    );
};

export default ReviewCard;