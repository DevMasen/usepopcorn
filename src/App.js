import { use, useEffect, useState } from 'react';
import StarRating from './StarRating';
/*
const tempMovieData = [
	{
		imdbID: 'tt1375666',
		Title: 'Inception',
		Year: '2010',
		Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
	},
	{
		imdbID: 'tt0133093',
		Title: 'The Matrix',
		Year: '1999',
		Poster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
	},
	{
		imdbID: 'tt6751668',
		Title: 'Parasite',
		Year: '2019',
		Poster: 'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg',
	},
];

const tempWatchedData = [
	{
		imdbID: 'tt1375666',
		Title: 'Inception',
		Year: '2010',
		Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
		runtime: 148,
		imdbRating: 8.8,
		userRating: 10,
	},
	{
		imdbID: 'tt0088763',
		Title: 'Back to the Future',
		Year: '1985',
		Poster: 'https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
		runtime: 116,
		imdbRating: 8.5,
		userRating: 9,
	},
];
*/
const average = arr =>
	arr.reduce((acc, cur, __, arr) => acc + cur / arr.length, 0);
const apiKey = process.env.REACT_APP_API_KEY;

export default function App() {
	const [movies, setMovies] = useState([]);
	const [watched] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [query, setQuery] = useState('');
	const [selectedId, setSelectedId] = useState(null);

	function handleMovieDetails(id) {
		setSelectedId(curId => (curId === id ? null : id));
	}

	function handleCloseDetails() {
		setSelectedId(null);
	}
	// !Fetching Data with async await and useEffect
	useEffect(
		function () {
			async function fetchMovie() {
				try {
					setIsLoading(true);
					setError('');
					const res = await fetch(
						`http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`
					);
					if (!res.ok) {
						throw new Error('Network Error!');
					}

					const data = await res.json();
					if (!data.Search) {
						throw new Error('Movie NOT Found!');
					}
					setMovies(data.Search);
				} catch (err) {
					setError(err.message);
				} finally {
					setIsLoading(false);
				}
			}

			if (query.length < 3) {
				setMovies([]);
				setError('');
				return;
			}
			fetchMovie();
		},
		[query]
	);

	useEffect(
		function () {
			console.log(movies);
		},
		[movies]
	);

	//! Effects(useEffect) actually used to synchronize component data with an external system(movie API in example above).

	// !The wrong way to use the fetch API in react
	/*
	fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=interstellar`)
		.then(res => res.json())
		.then(data => console.log(data));
    */

	// !Use Effect hook for handle the fetch Effect
	// !This Effect function executes just once at initial render
	/*
	useEffect(function () {
		fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`)
			.then(res => res.json())
			.then(data => {
				setMovies(data.Search);
				console.log(data);
			});

		// an effect should return a cleanup function
		return () => console.log('Clean Up!');
	}, []);
	*/

	//! Test useEffect Dependency Array
	/*
	useEffect(function () {
		console.log('I run after every RENDER');
	});
	useEffect(function () {
		console.log('I run just at Initial RENDER');
	}, []);
	useEffect(
		function () {
			console.log('I run just when query is changed');
		},
		[query]
	);
	console.log('I run during RENDER');
	*/
	return (
		<>
			<NavBar>
				<SearchBar query={query} setQuery={setQuery} />
				<NumResults movies={movies} />
			</NavBar>

			{/* //!using Component Composition with normal props */}
			{/*
				<Box element={<MoviesList movies={movies} />} />
				<Box
					element={
						<>
							<Summary watched={watched} />
							<WatchedMoviesList watched={watched} />
						</>
					}
				/> */}

			<Main>
				<Box>
					{/* //! Handling Errors on fetching movie data */}
					{/* {isLoading ? <Loader /> : <MoviesList movies={movies} />} */}
					{isLoading && <Loader />}
					{!isLoading && !error && (
						<MoviesList
							movies={movies}
							onMovieDetails={handleMovieDetails}
						/>
					)}
					{error && <ErrorMessage message={error} />}
				</Box>
				<Box>
					{selectedId ? (
						<MovieDetails
							selectedId={selectedId}
							onCloseDetails={handleCloseDetails}
						/>
					) : (
						<>
							<Summary watched={watched} />
							<WatchedMoviesList watched={watched} />
						</>
					)}
				</Box>
			</Main>
		</>
	);
}

function NavBar({ children }) {
	return (
		<nav className="nav-bar">
			<Logo />
			{children}
		</nav>
	);
}

function Logo() {
	return (
		<div className="logo">
			<span role="img">🍿</span>
			<h1>usePopcorn</h1>
		</div>
	);
}

function SearchBar({ query, setQuery }) {
	return (
		<input
			className="search"
			type="text"
			placeholder="Search movies..."
			value={query}
			onChange={e => setQuery(e.target.value)}
		/>
	);
}

function NumResults({ movies }) {
	return (
		<p className="num-results">
			Found <strong>{movies.length}</strong> results
		</p>
	);
}

function Main({ children }) {
	return <main className="main">{children}</main>;
}

function Box({ children }) {
	const [isOpen, setIsOpen] = useState(true);
	return (
		<div className="box">
			<Button isOpen={isOpen} onIsOpen={setIsOpen} />
			{isOpen && children}
		</div>
	);
}

function Button({ isOpen, onIsOpen }) {
	return (
		<button className="btn-toggle" onClick={() => onIsOpen(open => !open)}>
			{isOpen ? '–' : '+'}
		</button>
	);
}

function MoviesList({ movies, onMovieDetails }) {
	return (
		<ul className="list list-movies">
			{movies?.map(movie => (
				<Movie
					movie={movie}
					key={movie.imdbID}
					onMovieDetails={onMovieDetails}
				/>
			))}
		</ul>
	);
}
function Movie({ movie, onMovieDetails }) {
	return (
		<li onClick={() => onMovieDetails(movie.imdbID)}>
			<img src={movie.Poster} alt={`${movie.Title} poster`} />
			<h3>{movie.Title}</h3>
			<div>
				<p>
					<span>🗓</span>
					<span>{movie.Year}</span>
				</p>
			</div>
		</li>
	);
}

function MovieDetails({ selectedId, onCloseDetails }) {
	const [movie, setMovie] = useState({});
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
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

	useEffect(
		function () {
			async function getMovieDetails() {
				try {
					setIsLoading(true);
					const res = await fetch(
						`http://www.omdbapi.com/?apikey=${apiKey}&i=${selectedId}`
					);
					if (!res.ok) {
						throw new Error('Network Error!');
					}
					const data = await res.json();
					if (data.Response === 'False') {
						throw new Error('Details NOT found!');
					}
					setMovie(data);
				} catch (err) {
					setError(err.message);
					console.log(err);
				} finally {
					setIsLoading(false);
				}
			}
			getMovieDetails();
		},
		[selectedId]
	);

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
							<StarRating size={24} maxStars={10} />
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

function Loader() {
	return (
		<div className="loader-container">
			<div className="loader"></div>
		</div>
	);
}

function ErrorMessage({ message }) {
	return <p className="error">⚠️{message}</p>;
}

function Summary({ watched }) {
	const avgImdbRating = average(watched.map(movie => movie.imdbRating));
	const avgUserRating = average(watched.map(movie => movie.userRating));
	const avgRuntime = average(watched.map(movie => movie.runtime));
	return (
		<div className="summary">
			<h2>Movies you watched</h2>
			<div>
				<p>
					<span>#️⃣</span>
					<span>{watched.length} movies</span>
				</p>
				<p>
					<span>⭐️</span>
					<span>{avgImdbRating}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{avgUserRating}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{avgRuntime} min</span>
				</p>
			</div>
		</div>
	);
}

function WatchedMoviesList({ watched }) {
	return (
		<ul className="list">
			{watched.map(movie => (
				<WatchedMovie movie={movie} key={movie.imdbID} />
			))}
		</ul>
	);
}

function WatchedMovie({ movie }) {
	return (
		<li>
			<img src={movie.Poster} alt={`${movie.Title} poster`} />
			<h3>{movie.Title}</h3>
			<div>
				<p>
					<span>⭐️</span>
					<span>{movie.imdbRating}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{movie.userRating}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{movie.runtime} min</span>
				</p>
			</div>
		</li>
	);
}

//! Documents

/* //! Component Instance lifecycle:
1:  Mount (initial render)
2:  Commit 
3:  Browser Paint
4:  Effect
5:  Prop/State change
6:  Re-render
7:  Commit 
8:  Layout Effect
9:  Browser Paint
10: ---
11: Effect
12: Unmount
13: ---
*/

/* //! Use Effect Dependency Array: 
1: useEffect(fn,[stateA, propA, stateB]) => Effect executes after initial render and these state and prop change
2: useEffect(fn,[]) => Effect executes just ones at initial render
3: useEffect(fn) => Effect executes during initial render and every re-render
*/
