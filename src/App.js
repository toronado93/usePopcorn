import { useEffect, useRef, useState } from "react";
import Star from "./Star";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKeyCustomizedHook } from "./useKey";

const NavBar = (props) => {
  return (
    <nav className="nav-bar">
      <Logo></Logo>
      {props.children}
    </nav>
  );
};

const NumResults = (props) => {
  return (
    <p className="num-results">
      Found{" "}
      <strong>{props.movies === undefined ? "" : props.movies.length}</strong>{" "}
      results
    </p>
  );
};

const Logo = () => {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
};

const Search = (props) => {
  const inputEl = useRef(null);

  useEffect(() => {
    inputEl.current.focus();
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        // Refresh the search bar
        props.EnterHandle("");
        // focus the search bar
        inputEl.current.focus();
      }
    });

    // Cleaning Up Function

    document.removeEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        // Refresh the search bar
        props.EnterHandle("");
        // focus the search bar
        inputEl.current.focus();
      }
    });
  }, [props, props.query]);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={props.queryValue}
      onChange={(e) => props.searchHandler(e.target.value)}
      ref={inputEl}
    />
  );
};

const Main = (props) => {
  return (
    <>
      <main className="main">{props.children}</main>
    </>
  );
};

const Box = (props) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && props.children}
    </div>
  );
};

const MovieList = (props) => {
  return (
    <ul className="list">
      {props.movies?.map((movie) => (
        <Movie
          key={movie.imdbID}
          idHandler={props.idHandler}
          imdbID={movie.imdbID}
          Poster={movie.Poster}
          Title={movie.Title}
          Year={movie.Year}
        ></Movie>
      ))}
    </ul>
  );
};

const Movie = (props) => {
  return (
    <li
      onClick={() => {
        props.idHandler(props.imdbID);
      }}
      className="list-hover"
      key={props.imdbID}
    >
      <img src={props.Poster} alt={`${props.Title} poster`} />
      <h3>{props.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{props.Year}</span>
        </p>
      </div>
    </li>
  );
};

const WatchSummary = (props) => {
  const avgImdbRating = average(props.watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(props.watched.map((movie) => movie.userRating));
  const avgRuntime = average(props.watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{props.watched.length} movies</span>
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
};

const WatchedMoviesList = (props) => {
  return (
    <ul className="list">
      {props.watched.map((movie) => (
        <WatchedMovie
          DeleteHandler={props.DeleteHandler}
          movie={movie}
        ></WatchedMovie>
      ))}
    </ul>
  );
};

const WatchedMovie = (props) => {
  return (
    <li key={props.movie.imdbID}>
      <img src={props.movie.poster} alt={`${props.movie.title} poster`} />
      <h3>{props.movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{props.movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{props.movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{props.movie.runtime} min</span>
        </p>
        <button
          onClick={() => {
            props.DeleteHandler(props.movie.imdbID);
          }}
          className="btn-delete"
        >
          X
        </button>
      </div>
    </li>
  );
};

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const apikey = "30e81d30";

function Loader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {" "}
      <p style={{ fontSize: "52px" }}>Loading ...</p>
    </div>
  );
}

function Error(props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {" "}
      <p style={{ fontSize: "52px" }}>{props.error}</p>
    </div>
  );
}

function MovieDetails(props) {
  const [selectedmovie, setSelectedMovie] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [userRating, setUserRating] = useState(null);

  const watchedUserRating = props.watched.find((movie) => {
    return movie.imdbID === props.selectedId;
  })?.userRating;

  const isWatched = props.watched
    .map((movies) => {
      return movies.imdbID;
    })
    .includes(props.selectedId);

  const countRef = useRef(0);

  useEffect(() => {
    if (userRating) countRef.current = countRef.current + 1;
  }, [userRating]);

  // Destructure
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: realeased,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = selectedmovie;

  // Handler
  function LocalAddWatchedMovieHandler() {
    const newSelectedMovie = {
      imdbID: selectedmovie.imdbID,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ")[0]),
      userRating,
      countRatingDecision: countRef.current,
    };

    console.log(newSelectedMovie);
    props.AddWatchedMovieHandler(newSelectedMovie);
    props.onCloseMovie();
  }

  // Keypress Effect
  useKeyCustomizedHook("Escape", props);

  // Example of how to change document title
  useEffect(() => {
    document.title = `Movie:${title}`;

    // Cleanup function
    return () => {
      document.title = "usePopcorn";
    };
  }, [title]);

  useEffect(() => {
    async function fetchMovieDetails() {
      setIsOpen(true);
      try {
        const result = await fetch(
          `http://www.omdbapi.com/?apikey=${apikey}&i=${props.selectedId}`
        );
        const data = await result.json();
        setSelectedMovie(data);
        setIsOpen(false);
      } catch (error) {
        console.log(error);
      }
    }

    fetchMovieDetails();
  }, [props.selectedId]);

  return (
    <div className="details">
      {isOpen ? (
        <Loader></Loader>
      ) : (
        <>
          {" "}
          <header>
            <button
              className="btn-back"
              onClick={() => {
                props.onCloseMovie();
              }}
            >
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${selectedmovie}`}></img>
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {realeased} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {isWatched ? (
                <p>You've already rated this movie. {watchedUserRating}</p>
              ) : (
                <>
                  <Star onSetRating={setUserRating} size={32}></Star>
                  {userRating ? (
                    <button
                      className="btn-add"
                      onClick={LocalAddWatchedMovieHandler}
                    >
                      + Add on WatchedList
                    </button>
                  ) : (
                    ""
                  )}
                </>
              )}
            </div>
            <p>
              <em>{plot !== "N/A" ? plot : ""}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");

  // States are able to initialized by function as well.
  // const [watched, setWatched] = useState([]);

  const [watched, setWatched] = useLocalStorageState([], "watched");

  // Imported useEffect
  const { movies, isLoading, error } = useMovies(
    query,
    apikey,
    CloseMovieIdHandler
  );

  const [selectedId, setSelectedId] = useState(0);

  // Handler
  function SearchHandler(query) {
    setQuery(query);
  }
  function MovieIdHandler(id) {
    setSelectedId((crr) => {
      return id === crr ? null : id;
    });
  }
  function CloseMovieIdHandler() {
    setSelectedId(null);
  }

  function AddWatchedMovieHandler(movie) {
    setWatched((crr) => [...crr, movie]);
  }

  // Storage watched movie in local storage
  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);

  // By Me
  function DeleteWatchedMovie(selectedmoviewId) {
    setWatched((crr) => crr.filter((m) => m.imdbID !== selectedmoviewId));
  }

  return (
    <>
      <NavBar>
        <Search
          EnterHandle={setQuery}
          queryValue={query}
          searchHandler={SearchHandler}
        ></Search>
        <NumResults movies={movies}></NumResults>
      </NavBar>
      <Main>
        <Box movies={movies}>
          {isLoading && <Loader></Loader>}
          {!isLoading && !error && (
            <MovieList
              onCloseMovie={CloseMovieIdHandler}
              idHandler={MovieIdHandler}
              movies={movies}
            ></MovieList>
          )}
          {error && <Error error={error}></Error>}
        </Box>
        <Box movies={movies}>
          {selectedId ? (
            <MovieDetails
              watched={watched}
              onCloseMovie={CloseMovieIdHandler}
              selectedId={selectedId}
              AddWatchedMovieHandler={AddWatchedMovieHandler}
            ></MovieDetails>
          ) : (
            <>
              <WatchSummary watched={watched}></WatchSummary>
              <WatchedMoviesList
                DeleteHandler={DeleteWatchedMovie}
                watched={watched}
              ></WatchedMoviesList>
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
