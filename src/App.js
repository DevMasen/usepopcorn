import { useEffect, useState } from 'react';
import StarRating from './StarRating';

const average = arr =>
	arr.reduce((acc, cur, __, arr) => acc + cur / arr.length, 0);
const apiKey = process.env.REACT_APP_API_KEY;

export default function App() {
	const [movies, setMovies] = useState([]);
	const [watched, setWatched] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [query, setQuery] = useState('');
	const [selectedId, setSelectedId] = useState(null);

	function handleMovieDetails(id) {
		setSelectedId(curId => {
			//! reset documet title (first solotion NOT GOOD!)
			// if (curId === id) document.title = 'usePopcorn';
			return curId === id ? null : id;
		});
	}

	function handleCloseDetails() {
		setSelectedId(null);

		//! reset documet title (first solotion NOT GOOD!)
		// document.title = 'usePopcorn';
	}

	function handleSetWatched(movie) {
		setWatched(watchedList => [...watchedList, movie]);
	}

	function handleDeleteWatched(id) {
		setWatched(watchedList =>
			watchedList.filter(movie => movie.imdbID !== id),
		);
	}

	// !Fetching Data with async await and useEffect
	useEffect(
		function () {
			const controller = new AbortController();
			async function fetchMovie() {
				try {
					setIsLoading(true);
					setError('');
					const res = await fetch(
						`http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`,
						{ signal: controller.signal },
					);
					if (!res.ok) {
						throw new Error('Network Error!');
					}

					const data = await res.json();
					if (!data.Search) {
						throw new Error('Movie NOT Found!');
					}
					setMovies(data.Search);
					setError('');
				} catch (err) {
					if (err.name !== 'AbortError') setError(err.message);
				} finally {
					setIsLoading(false);
				}
			}

			if (query.length < 3) {
				setMovies([]);
				setError('');
				return;
			}

			handleCloseDetails();
			fetchMovie();

			return function () {
				controller.abort();
			};
		},
		[query],
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
							watched={watched}
							onSetWatched={handleSetWatched}
						/>
					) : (
						<>
							<Summary watched={watched} />
							<WatchedMoviesList
								watched={watched}
								onDeleteWatched={handleDeleteWatched}
							/>
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

function MovieDetails({ selectedId, onCloseDetails, watched, onSetWatched }) {
	const [movie, setMovie] = useState({});
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [userRating, setUserRating] = useState('');
	const [isWatched, setIsWatched] = useState(false);
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
		};
		onSetWatched(newWatchedMovie);
		onCloseDetails();
	}

	useEffect(
		function () {
			async function getMovieDetails() {
				try {
					setIsLoading(true);
					const res = await fetch(
						`http://www.omdbapi.com/?apikey=${apiKey}&i=${selectedId}`,
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

	useEffect(function () {
		function callBack(e) {
			if (e.code === 'Escape') {
				onCloseDetails();
			}
		}
		document.addEventListener('keydown', callBack);
		return function () {
			document.removeEventListener('keydown', callBack);
		};
	});

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
					<span>{avgImdbRating.toFixed(1)}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{avgUserRating.toFixed(1)}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{Math.round(avgRuntime)} min</span>
				</p>
			</div>
		</div>
	);
}

function WatchedMoviesList({ watched, onDeleteWatched }) {
	return (
		<ul className="list">
			{watched.map(movie => (
				<WatchedMovie
					movie={movie}
					onDeleteWatched={onDeleteWatched}
					key={movie.imdbID}
				/>
			))}
		</ul>
	);
}

function WatchedMovie({ movie, onDeleteWatched }) {
	return (
		<li>
			<img src={movie.poster} alt={`${movie.title} poster`} />
			<h3>{movie.title}</h3>
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
			<button
				className="btn-delete"
				onClick={() => onDeleteWatched(movie.imdbID)}
			>
				{' '}
				&times;{' '}
			</button>
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
10: Cleanup
11: Effect
12: Unmount
13: Cleanup
*/

/* //! Use Effect Dependency Array: 
1: useEffect(fn,[stateA, propA, stateB]) => Effect executes after initial render and these state and prop change
2: useEffect(fn,[]) => Effect executes just ones at initial render
3: useEffect(fn) => Effect executes during initial render and every re-render
*/
