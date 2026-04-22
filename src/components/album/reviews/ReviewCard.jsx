import RenderStars from './RenderStars';
import LikeButton from './LikeButton';
import { useNavigate } from 'react-router-dom';

const ReviewCard = ({ review }) => {
    const navigate = useNavigate();

    // Reutilizamos tu misma lógica de FollowedReviews
    const getAvatarUrl = (user) => {
        if (user?.avatarUrl) {
            return user.avatarUrl;
        }
        return `https://ui-avatars.com/api/?name=${user?.username}&size=200&background=FF6B35&color=fff`;
    };

    return (
        <div className="ap-review-card">
            <div className="ap-review-top">
                <div className="ap-user-info" 
                     onClick={() => navigate(`/profile/${review.user.username}`)}
                     style={{ cursor: 'pointer' }}>
                    
                    <img 
                        src={getAvatarUrl(review.user)} 
                        alt={review.user.username} 
                        className="ap-user-avatar"
                    />
                    <span className="ap-username">{review.user.username}</span>
                </div>
                
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
