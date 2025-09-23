const starRatingContainer = {
	display: 'flex',
	alignItems: 'center',
	gap: '16px',
};

const starsContainer = {
	display: 'flex',
	gap: '4px',
};

export default function StarRating({ maxStars = 5 }) {
	return (
		<div style={starRatingContainer}>
			<div style={starsContainer}>
				{Array.from({ length: maxStars }, (_, i) => (
					<span>S{i + 1}</span>
				))}
			</div>
			<p>10</p>
		</div>
	);
}
