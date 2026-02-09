import { useState } from 'react';
import PropTypes from 'prop-types';

const starRatingContainerStyle = {
	display: 'flex',
	alignItems: 'center',
	gap: '16px',
};

const starsContainerStyle = {
	display: 'flex',
};

//! Using PropTypes for type checking
StarRating.propTypes = {
	// maxStars: PropTypes.number.isRequired,
	maxStars: PropTypes.number,
	color: PropTypes.string,
	size: PropTypes.number,
	className: PropTypes.string,
	messages: PropTypes.array,
	defaultRating: PropTypes.number,
	onMovieRating: PropTypes.func,
};

export default function StarRating({
	maxStars = 5,
	color = '#fcc419',
	size = 48,
	className = '',
	messages = [],
	defaultRating = 0,
	onMovieRating = function (index = 0) {},
}) {
	const textStyle = {
		lineHeight: '1',
		margin: '0',
		fontSize: `${size / 1.5}px`,
		fontFamily:
			"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
		fontWeight: '500',
		color,
	};

	const [rating, setRating] = useState(defaultRating);
	const [tempRating, setTempRating] = useState(0);
	function handleRating(index) {
		setRating(index);
		onMovieRating(index);
	}
	function handleMouseEnter(index) {
		setTempRating(index);
	}
	function handleMouseLeave() {
		setTempRating(0);
	}
	return (
		<div style={starRatingContainerStyle} className={className}>
			<div style={starsContainerStyle}>
				{Array.from({ length: maxStars }, (_, i) => (
					<Star
						key={i}
						full={
							tempRating ? tempRating >= i + 1 : rating >= i + 1
						}
						color={color}
						size={size}
						onRate={() => handleRating(i + 1)}
						onMouseEnter={() => handleMouseEnter(i + 1)}
						onMouseLeave={handleMouseLeave}
					/>
				))}
			</div>
			<p style={textStyle}>
				{messages.length === maxStars
					? messages[tempRating ? tempRating - 1 : rating - 1]
					: tempRating || rating || ''}
			</p>
		</div>
	);
}

function Star({ full, onRate, onMouseEnter, onMouseLeave, color, size }) {
	const starStyle = {
		width: `${size}px`,
		height: `${size}px`,
		cursor: 'pointer',
		display: 'block',
	};

	return (
		<span
			role="button"
			style={starStyle}
			onClick={onRate}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			{full ? (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill={color}
					stroke={color}
				>
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
				</svg>
			) : (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke={color}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="{2}"
						d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
					/>
				</svg>
			)}
		</span>
	);
}
