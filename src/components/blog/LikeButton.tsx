import React, { useState, useEffect } from 'react';
import { likeArticle, checkArticleLike } from '../../api/blog';

interface LikeButtonProps {
    articleId: string;
    initialLikes?: number;
    userId?: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({
    articleId,
    initialLikes = 0,
    userId
}) => {
    const [likes, setLikes] = useState<number>(initialLikes);
    const [liked, setLiked] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    // Check if the user has already liked this article
    useEffect(() => {
        const checkLikeStatus = async () => {
            try {
                setLoading(true);
                const { likes, liked } = await checkArticleLike(articleId, userId);

                setLikes(likes);
                setLiked(liked);
                setLoading(false);
            } catch (error) {
                console.error('Error checking like status:', error);
                setLoading(false);
            }
        };

        checkLikeStatus();
    }, [articleId, userId]);

    const handleLike = async () => {
        try {
            setLoading(true);
            const { likes: newLikes, liked: newLiked } = await likeArticle(articleId, userId);

            setLikes(newLikes);
            setLiked(newLiked);
            setLoading(false);
        } catch (error) {
            console.error('Error liking article:', error);
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleLike}
                disabled={loading}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${liked
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } transition-colors`}
                aria-label={liked ? "Unlike" : "Like"}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={liked ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`${liked ? 'text-red-600' : 'text-gray-600'}`}
                >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>

                <span>
                    {liked ? 'Liked' : 'Like'} {likes > 0 && `(${likes})`}
                </span>
            </button>
        </div>
    );
};

export default LikeButton;