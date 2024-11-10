import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export default function MainMenu() {
  const navigate = useNavigate();
  const [movie, setMovie] = useState("");
  const [movieData, setData] = useState([
    {
      Title: "The Shawshank Redemption",
      Year: "1994",
      imdbID: "tt0111161",
      Type: "movie",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_SX300.jpg",
    },
    {
      Title: "The Godfather",
      Year: "1972",
      imdbID: "tt0068646",
      Type: "movie",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BYTJkNGQyZDgtZDQ0NC00MDM0LWEzZWQtYzUzZDEwMDljZWNjXkEyXkFqcGc@._V1_SX300.jpg",
    },
    {
      Title: "The Dark Knight",
      Year: "2008",
      imdbID: "tt0468569",
      Type: "movie",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
    },{
      "Title": "The Lord of the Rings: The Fellowship of the Ring",
      "Year": "2001",
      "imdbID": "tt0120737",
      "Type": "movie",
      "Poster": "https://m.media-amazon.com/images/M/MV5BNzIxMDQ2YTctNDY4MC00ZTRhLTk4ODQtMTVlOWY4NTdiYmMwXkEyXkFqcGc@._V1_SX300.jpg"
    },{
      "Title": "Pulp Fiction",
      "Year": "1994",
      "imdbID": "tt0110912",
      "Type": "movie",
      "Poster": "https://m.media-amazon.com/images/M/MV5BYTViYTE3ZGQtNDBlMC00ZTAyLTkyODMtZGRiZDg0MjA2YThkXkEyXkFqcGc@._V1_SX300.jpg"
    }
  ]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `https://api.collectapi.com/imdb/imdbSearchByName?query=${movie}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization:
              "apikey 7Lns3oudyBAHwT1ZmeVdBf:1E9bAZpA23z4WxKgTG8LFS",
          },
        }
        
      );
      
      setData(response.data.result);
      console.log(response.data.result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMovieClick = (imdbID) => {
    navigate(`/movie/${imdbID}`);
  };

  return (
    <div>
      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="mt-10 mx-auto sticky top-24 z-10 max-w-xl py-2 px-6 rounded-full bg-gray-50 border flex focus-within:border-gray-300"
      >
        <input
          type="text"
          value={movie}
          placeholder="Search for movies"
          className="bg-transparent w-full focus:outline-none pr-4 font-semibold border-0 focus:ring-0 px-0 py-0"
          onChange={(e) => setMovie(e.target.value)}
          required
        />
        <button
          type="submit"
          className="flex flex-row items-center justify-center min-w-[130px] px-4 rounded-full font-medium tracking-wide border disabled:cursor-not-allowed disabled:opacity-50 transition ease-in-out duration-150 text-base bg-black text-white border-transparent py-1.5 h-[38px] -mr-3"
        >
          Search
        </button>
      </form>

      {/* Movie Cards with Glass Effect */}
      <div className="p-1 flex flex-wrap items-center justify-center">
        {movieData.length > 0 ? (
          movieData.map((movie) => (
            <div
              key={movie.imdbID}
              className="m-6 relative rounded-lg shadow-lg group bg-cyan-200 bg-opacity-15 cursor-pointer hover:shadow-xl transition-shadow"
              style={{
                width: "250px",
                height: "350px",
                // background: "rgba(255, 255, 255, 0.5)", // Light translucent background
                backdropFilter: "blur(15px)", // Blur for glass effect
                WebkitBackdropFilter: "blur(15px)", // Safari support
                border: "1px solid rgba(255, 255, 255, 0.3)", // Subtle border for better look
                borderRadius: "15px",
                overflow: "hidden",
              }}
              onClick={() => handleMovieClick(movie.imdbID)}
            >
              <div className="relative pt-10 px-10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <img
                  className="relative w-36 h-52 object-cover rounded-md"
                  src={movie.Poster}
                  alt={movie.Title}
                />
              </div>
              <div className="relative text-black px-6 pb-2 mt-6">
                <span className="block opacity-75 -mb-1">
                  Year: {movie.Year}
                </span>
                <div className="flex justify-between items-center">
                  <span className="block font-semibold text-xl truncate">
                    {movie.Title}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-10">No movies found. Try searching!</p>
        )}
      </div>
    </div>
  );
}
