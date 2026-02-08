import { useState, useEffect } from 'react';
// !Fetching Data with async await and useEffect
//! Making some hooks into a custom hook
const apiKey = process.env.REACT_APP_API_KEY;
export function useMovies(query = '') {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
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

			// handleCloseDetails();
			fetchMovie();

			return function () {
				controller.abort();
			};
		},
		[query],
	);
	return { movies, isLoading, error };
}
