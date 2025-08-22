import { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, onRatingChange, readonly = false, size = 20 }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (starIndex) => {
    if (!readonly) {
      setHoverRating(starIndex);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const handleClick = (starIndex) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starIndex);
    }
  };

  const displayRating = readonly ? rating : hoverRating || rating;

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((starIndex) => (
        <button
          key={starIndex}
          type="button"
          className={`transition-colors duration-200 ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          }`}
          onMouseEnter={() => handleMouseEnter(starIndex)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(starIndex)}
          disabled={readonly}
        >
          <Star
            size={size}
            className={`${
              starIndex <= displayRating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
  