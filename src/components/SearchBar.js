import { useRef } from 'react';
import { useKey } from '../hooks/useKey';
export default function SearchBar({ query, setQuery }) {
	//* Focus on search bar with DOM manipulation (NOT Good!)
	// useEffect(function () {
	// 	const el = document.querySelector('.search');
	// 	el.focus();
	// }, []);

	//* Access DOM elements with REF
	const inputEl = useRef(null);

	//* This is a custom hook for pressing a key
	useKey('Enter', function () {
		if (document.activeElement === inputEl.current) return;
		inputEl.current.focus();
		setQuery('');
	});

	return (
		<input
			className="search"
			type="text"
			placeholder="Search movies..."
			value={query}
			onChange={e => setQuery(e.target.value)}
			ref={inputEl}
		/>
	);
}
