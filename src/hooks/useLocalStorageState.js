import { useState, useEffect } from 'react';
export function useLocalStorageState(initialState = [], key = '') {
	//* Initial render the watchlist
	const [value, setValue] = useState(function () {
		const storedItem = localStorage.getItem(key);
		return storedItem ? JSON.parse(storedItem) : initialState;
	});

	//* Save user watchlist in browser local storage : option 2
	useEffect(
		function () {
			localStorage.setItem(key, JSON.stringify(value));
		},
		[value, key],
	);
	return [value, setValue];
}
