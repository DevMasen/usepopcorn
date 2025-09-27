import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import StarRating from './StarRating';
// import './test.css';

// function Test() {
// 	const [movieRating, setMovieRating] = useState(0);
// 	return (
// 		<div>
// 			<StarRating color="#ccc" onMovieRating={setMovieRating} />
// 			<p>The movie rating is : {movieRating}</p>
// 		</div>
// 	);
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<App />
		{/* <StarRating />
		<StarRating maxStars={10} />
		<StarRating maxStars={15} color="red" />
		<StarRating maxStars={5} color="purple" size={22} />
		<StarRating
			maxStars={5}
			color="white"
			size={22}
			className="black-background border-radius-1rem width-fitcontent padding-1rem"
		/>
		<StarRating
			maxStars={5}
			messages={['Terrible', 'OK', 'Good', 'Nice', 'Amazing']}
			defaultRating={1}
		/>
		<Test /> */}
	</React.StrictMode>
);
