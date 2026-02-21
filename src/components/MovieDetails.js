import { useState, useRef, useEffect } from 'react';
import { useKey } from '../hooks/useKey';
import StarRating from './StarRating';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
const apiKey = process.env.REACT_APP_API_KEY;
export default function MovieDetails({
	selectedId,
	onCloseDetails,
	watched,
	onSetWatched,
}) {
	//* Updating a state with setter function is a async process E162
	const [movie, setMovie] = useState({});
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [userRating, setUserRating] = useState('');
	const [isWatched, setIsWatched] = useState(false);
	const countRef = useRef(0);
	const {
		Title: title,
		Poster: poster,
		Runtime: runtime,
		imdbRating,
		Plot: plot,
		Released: released,
		Actors: actors,
		Director: director,
		Genre: genre,
	} = movie;

	function handleAdd() {
		const newWatchedMovie = {
			imdbID: selectedId,
			poster,
			title,
			imdbRating: Number(imdbRating),
			userRating: Number(userRating),
			runtime: Number(runtime.split(' ').at(0)),
			rateDecisionCount: countRef.current,
		};
		onSetWatched(newWatchedMovie);
		onCloseDetails();
	}

	//! NOT WORKS CORRECTLY!
	useEffect(
		function () {
			if (userRating) countRef.current += 1;
		},
		[userRating],
	);

	useEffect(
		function () {
			async function getMovieDetails() {
				try {
					setIsLoading(true);
					const res = await fetch(
						`https://www.omdbapi.com/?apikey=${apiKey}&i=${selectedId}`,
					);
					if (!res.ok) {
						throw new Error('Network Error!');
					}
					const data = await res.json();
					if (data.Response === 'False') {
						throw new Error('Details NOT found!');
					}
					setMovie(data);
					setUserRating('0');
				} catch (err) {
					setError(err.message);
				} finally {
					setIsLoading(false);
				}
			}
			getMovieDetails();
		},
		[selectedId],
	);

	useEffect(
		function () {
			const isMovieWatched = watched.some(
				movie => movie.imdbID === selectedId,
			);
			setIsWatched(isMovieWatched);
			if (isMovieWatched) {
				const rate = watched.find(
					movie => movie.imdbID === selectedId,
				).userRating;
				setUserRating(`${rate}`);
			}
		},
		[selectedId, watched, userRating],
	);

	useEffect(
		function () {
			if (!title) return;
			document.title = `Movie | ${title}`;
			return function () {
				document.title = 'usePopcorn';

				//! We can access the title after component unmount because of a MOTHER FOCKER called closures :>
				// console.log(`Cleanup the Movie ${title}`);
			};
		},
		[title],
	);

	//* This is a custom hook for pressing a key
	useKey('Escape', onCloseDetails);

	return (
		<>
			{!error && !isLoading && (
				<div className="details">
					<header>
						<button className="btn-back" onClick={onCloseDetails}>
							&larr;
						</button>
						<img src={poster} alt={`Movie ${title} Poster`} />
						<div className="details-overview">
							<h2>{title}</h2>
							<p>
								{released} &bull; {runtime}
							</p>
							<p>{genre}</p>
							<p>
								<span>⭐</span>
								{imdbRating} IMBD rating
							</p>
						</div>
					</header>
					<section>
						<div className="rating">
							{isWatched ? (
								<div className="watched-alert">
									<p>Watched ✅ </p>
									<p>You rated this movie🌟{userRating}</p>
								</div>
							) : (
								<>
									<StarRating
										size={24}
										maxStars={10}
										onMovieRating={setUserRating}
									/>

									{userRating > 0 && (
										<button
											className="btn-add"
											onClick={handleAdd}
										>
											+ Add to Wached List
										</button>
									)}
								</>
							)}
						</div>

						<p>
							<em>{plot}</em>
						</p>
						<p>Starring {actors}</p>
						<p>Directed by {director}</p>
					</section>
				</div>
			)}
			{error && <ErrorMessage message={error} />}
			{isLoading && <Loader />}
		</>
	);
}
