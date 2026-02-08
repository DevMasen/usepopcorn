import Movie from './Movie';
export default function MoviesList({ movies, onMovieDetails }) {
	return (
		<ul className="list list-movies">
			{movies.map(movie => (
				<Movie
					movie={movie}
					key={movie.imdbID}
					onMovieDetails={onMovieDetails}
				/>
			))}
		</ul>
	);
}
