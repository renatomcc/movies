const movieURL = "https://api.themoviedb.org/3/movie/";
const moviePoster = "https://image.tmdb.org/t/p/w500";
const api_Key = "68b07a02408ab09b5040edfc0843b811";
const removeButton = document.getElementById("remove-button");
const addMovie = document.getElementById("add-movie");
const editModal = document.getElementById("edit-modal");
const searchMovie = document.getElementById("search-movie");

var movies = [];
var moviesStorage = JSON.parse(localStorage.getItem("Movies")) || [];
var movies_Amount = 20;

function callAddNewMovieModal() {
  document.getElementById("add-new-movie-wrap").style.display = "flex";
  document.body.style.overflow = "hidden";
}

function addNewMovie() {
  let ableToAddMovie = true;
  const imageInput = document.getElementById("image-input").value;
  const nameInput = document.getElementById("name-input").value;
  const genresInput = document.getElementById("genre-input").value.split(" ");
  const rateInput = document.getElementById("rate-input").value;
  const overviewInput = document.getElementById("overview-input").value;
  const releaseYearDateInput = Number(
    document.getElementById("release-date-year-input").value
  );
  const releaseMonthDateInput = Number(
    document.getElementById("release-date-month-input").value
  );
  const releaseDayDateInput = Number(
    document.getElementById("release-date-day-input").value
  );

  if (!imageInput) {
    throwErrorOnInputValue("image-input");
    ableToAddMovie = false;
  }

  if (!nameInput) {
    throwErrorOnInputValue("name-input");
    ableToAddMovie = false;
  }

  if (!genresInput) {
    throwErrorOnInputValue("genre-input");
    ableToAddMovie = false;
  }

  genresInput.map((genre) => {
    if (!genre.match("^[A-Za-z]+$")) {
      throwErrorOnInputValue("genre-input");
      ableToAddMovie = false;
    }
  });

  if (!rateInput || isNaN(rateInput) || rateInput > 10 || rateInput < 0) {
    throwErrorOnInputValue("rate-input");
    ableToAddMovie = false;
  }

  if (!overviewInput) {
    throwErrorOnInputValue("overview-input");
    ableToAddMovie = false;
  }

  if (
    !releaseYearDateInput ||
    Number(releaseYearDateInput) > 2023 ||
    Number(releaseYearDateInput) < 1888
  ) {
    throwErrorOnInputValue("release-date-year-input");
  }

  if (
    !releaseMonthDateInput ||
    Number(releaseMonthDateInput) > 12 ||
    Number(releaseMonthDateInput) < 1
  ) {
    throwErrorOnInputValue("release-date-month-input");
  }

  if (
    !releaseDayDateInput ||
    Number(releaseDayDateInput) > 31 ||
    Number(releaseDayDateInput) < 1
  ) {
    throwErrorOnInputValue("release-date-day-input");
  }

  if (ableToAddMovie == true) {
    movies_Amount += 1;
    const newMovie = {
      id: movies_Amount,
      name: nameInput,
      poster: imageInput,
      genres: genresInput,
      rate: Number(rateInput),
      overview: overviewInput,
      releaseDate:
        releaseYearDateInput +
        "-" +
        releaseMonthDateInput +
        "-" +
        releaseDayDateInput,
    };
    moviesStorage.push(newMovie);
    movies.push(newMovie);
    localStorage.setItem("Movies", movies);
    displayMovies();
    document.getElementById("add-new-movie-wrap").style.display = "none";
    document.body.style.overflow = "inherit";
  }
}

function throwErrorOnInputValue(inputID) {
  document.getElementById(`${inputID}`).style.border = "1px solid red";
  document.getElementById(`${inputID}`).style.padding = "1px";
  document.getElementById(`${inputID}`).placeholder = "Enter a valid value";
}

function removeMovie(movieID) {
  movies = movies.filter((movie) => movie.id != movieID);
  displayMovies();
}

function editMovie(movieID) {
  document.body.style.overflow = "hidden";
  editModal.style.display = "flex";
  editModal.innerHTML = `
    <div class="movie-edit">
      <button type="button" class="close-button" onclick="closeModal()">
            X
      </button>
      <div class="input-box"> 
        <label>Poster img link: </label>
        <input id="edit-image-input" />
      </div>

      <div class="input-box">
        <label>Name: </label>
        <input id="edit-name-input" />
      </div>
        
      <div class="input-box">
        <label>Genres: </label>
        <input id="edit-genres-input" />
      </div>
       
      <div class="input-box">
        <label>Rate: </label>
        <input id="edit-rate-input" />
      </div>

      <div class="input-box">
        <label>Overview: </label>
        <input id="edit-overview-input" />
      </div>
      <div class="input-box">
        <label> Relase date: </label>
        <div class="release-date-box">
          <input id="edit-release-year-date-input" placeholder="YYYY"/>
          <input id="edit-release-month-date-input" placeholder="MM"/>
          <input id="edit-release-day-date-input" placeholder="DD"/>
        </div>
      </div>
      <button type="submit" onclick="(submitEdit(${movieID}))" > Edit </button>  
    </div>
  `;
}

function submitEdit(movieID) {
  let ableToEditMovie = true;
  const imageEditInput = document.getElementById("edit-image-input").value;
  const nameEditInput = document.getElementById("edit-name-input").value;
  const genresEditInput = document
    .getElementById("edit-genres-input")
    .value.split(" ");
  const rateEditInput = document.getElementById("edit-rate-input").value;
  const overviewEditInput = document.getElementById(
    "edit-overview-input"
  ).value;
  const releaseYearDateEditInput = document.getElementById(
    "edit-release-year-date-input"
  ).value;
  const releaseMonthDateEditInput = document.getElementById(
    "edit-release-month-date-input"
  ).value;
  const releaseDayDateEditInput = document.getElementById(
    "edit-release-day-date-input"
  ).value;

  if (genresEditInput != "") {
    genresEditInput.map((genre) => {
      if (genre.toLowerCase() == genre.toUpperCase()) {
        throwErrorOnInputValue("edit-genres-input");
        ableToEditMovie = false;
      }
    });
  }

  if (
    rateEditInput &&
    (isNaN(rateEditInput) || rateEditInput > 10 || rateEditInput < 0)
  ) {
    throwErrorOnInputValue("edit-rate-input");
    ableToEditMovie = false;
  }

  if (
    releaseYearDateEditInput &&
    (Number(releaseYearDateEditInput) > 2023 ||
      Number(releaseYearDateEditInput) < 1888)
  ) {
    throwErrorOnInputValue("edit-release-year-date-input");
    ableToEditMovie = false;
  }

  if (
    releaseMonthDateEditInput &&
    (Number(releaseMonthDateEditInput) > 12 ||
      Number(releaseMonthDateEditInput) < 1)
  ) {
    throwErrorOnInputValue("edit-release-month-date-input");
    ableToEditMovie = false;
  }

  if (
    releaseDayDateEditInput &&
    (Number(releaseDayDateEditInput) > 31 ||
      Number(releaseDayDateEditInput) < 1)
  ) {
    throwErrorOnInputValue("edit-release-day-date-input");
    ableToEditMovie = false;
  }

  if (ableToEditMovie == true) {
    movies.map((movie) => {
      if (movie.id == movieID) {
        if (imageEditInput) movie.poster = imageEditInput;
        if (nameEditInput) movie.name = nameEditInput;
        if (genresEditInput != "") movie.genres = genresEditInput;
        if (rateEditInput) movie.rate = Number(rateEditInput);
        if (overviewEditInput) movie.overview = overviewEditInput;
        if (releaseYearDateEditInput) {
          movie.releaseDate =
            releaseYearDateEditInput +
            "-" +
            movie.releaseDate.split("-")[1] +
            "-" +
            movie.releaseDate.split("-")[2];
        }
        if (releaseMonthDateEditInput) {
          movie.releaseDate =
            movie.releaseDate.split("-")[0] +
            "-" +
            releaseMonthDateEditInput +
            "-" +
            movie.releaseDate.split("-")[2];
        }
        if (releaseDayDateEditInput) {
          movie.releaseDate =
            movie.releaseDate.split("-")[0] +
            "-" +
            movie.releaseDate.split("-")[1] +
            "-" +
            releaseDayDateEditInput;
        }
      }
    });
    displayMovies();
    editModal.style.display = "none";
    document.body.style.overflow = "inherit";
  }
}

const getMoviesData = () => {
  const promises = [];

  for (let i = 1; i <= 20; i++) {
    const url = `${movieURL}${i}?api_key=${api_Key}`;
    promises.push(fetch(url).then((res) => res.json()));
  }

  Promise.all(promises).then((results) => {
    if (!JSON.parse(localStorage.getItem("Movies"))) {
      results.map((data) => {
        if (data.title) {
          var genres = [];
          data.genres.map((genre) => genres.push(genre.name));
          const movie = {
            id: data.id,
            name: data.title,
            poster: moviePoster + data.poster_path,
            overview: data.overview,
            releaseDate: data.release_date,
            genres: genres,
            rate: data.vote_average,
          };
          movies.push(movie);
        }
      });
      moviesStorage = movies;
      localStorage.setItem("Movies", moviesStorage);
      displayMovies();
    } else {
      movies = JSON.parse(localStorage.getItem("Movies"));
      moviesStorage = JSON.parse(localStorage.getItem("Movies"));
      displayMovies();
    }
  });
};

getMoviesData();

const displayMovies = () => {
  const output = movies
    .map(
      (movie) => `
          <div class="movie-card">
              <div class="card-buttons">
                <button 
                  type="button"
                  onclick="editMovie(${movie.id})"
                > ✏️ </button>
                <button 
                  type="button"
                  onclick="removeMovie(${movie.id})"
                > 🗑️ </button>
              </div>
              <div class="movie-rate">
                  &#11088                    
                      ${movie.rate.toFixed(1)} 
                  </div>
              <img 
                  src="${movie.poster}" 
                  alt="${movie.name}" 
                  onerror="this.onerror=null; this.src='https://i.ibb.co/sWvQf4D/error.png'"
              >
              <div class="movie-infos">
                  <p class="movie-title"> ${movie.name} </p>
                  <span> ${movie.releaseDate} </span>
                  <ul class="movie-genres">
                      ${movie.genres
                        .map(
                          (genre) => `
                      <li class="movie-genre"> ${genre} </li>
                      `
                        )
                        .join("")}
                  </ul>
                  <span class="movie-overview"> ${movie.overview} </div>
              </div>
          </div>
      `
    )
    .join("");
  document.getElementById("movies").innerHTML = output;
  localStorage.setItem("Movies", JSON.stringify(movies));
};

const filterMoviesByGenre = (e) => {
  if (e == "All") movies = moviesStorage;
  else movies = moviesStorage.filter((movie) => movie.genres.includes(e));
  displayMovies();
};

searchMovie.addEventListener("keyup", (e) => {
  const searchOption = e.target.value.toLowerCase();
  movies = moviesStorage.filter((movie) =>
    movie.name.toLowerCase().includes(searchOption)
  );
  displayMovies();
});

function closeModal() {
  document.getElementById("add-new-movie-wrap").style.display = "none";
  document.body.style.overflow = "inherit";
  document.body.style.overflowX = "hidden";
  editModal.style.display = "none";
}
