import { useState } from 'react';
import { useMovies } from './useMovies';
import { useLocalStorageState } from './useLocalStorageState';
import NavBar from './NavBar';
import SearchBar from './SearchBar';
import NumResults from './NumResults';
import Main from './Main';
import Box from './Box';
import MoviesList from './MoviesList';
import MovieDetails from './MovieDetails';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import Summary from './Summary';
import WatchedMoviesList from './WatchedMoviesList';

export default function App() {
	const [query, setQuery] = useState('');
	const [selectedId, setSelectedId] = useState(null);
	//* This is a custom hook for fetching movie list
	const { movies, isLoading, error } = useMovies(query);
	//* This is a custom hook for store data in localstorage
	const [watched, setWatched] = useLocalStorageState([], 'watched');

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

		//* Save user watchlist in browser local storage : option 1
		// localStorage.setItem('watched', JSON.stringify([...watched, movie]));
	}
	function handleDeleteWatched(id) {
		setWatched(watchedList =>
			watchedList.filter(movie => movie.imdbID !== id),
		);
	}

	return (
		<>
			<NavBar>
				<SearchBar query={query} setQuery={setQuery} />
				<NumResults movies={movies} />
			</NavBar>

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

/* //!using Component Composition with normal props */
/*
	<Box element={<MoviesList movies={movies} />} />
	<Box
		element={
			<>
				<Summary watched={watched} />
				<WatchedMoviesList watched={watched} />
			</>
		}
	/> 
*/

//* Just use the react hooks in top levet code!
//! This is wrong!
// if (imdbRating > 8) {
// 	const [isTop, setIsTop] = useState(true);
// }

//! This is wrong
// if (imdbRating > 8) return <div>Top Rating</div>;
