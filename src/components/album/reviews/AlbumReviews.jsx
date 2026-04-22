// src/components/album/reviews/AlbumReviews.jsx
import MyReview from './MyReview';
import ReviewCard from './ReviewCard';

const AlbumReviews = ({ spotifyAlbumId, currentUser, reviews, myReview, setMyReview, setReviews, setAverage }) => (
    <div className="ap-reviews-section fade-in-section delay-5 ">
        <span className="ap-section-title">Reviews</span>

        {currentUser && (
            <MyReview
                currentUser={currentUser}
                spotifyAlbumId={spotifyAlbumId}
                myReview={myReview}
                setMyReview={setMyReview}
                setAverage={setAverage}
            />
        )}

        {reviews.length === 0 && !myReview ? (
            <p className="ap-no-reviews">Este álbum no tiene reviews aún.</p>
        ) : (
            reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
            ))
        )}
    </div>
);

export default AlbumReviews;
