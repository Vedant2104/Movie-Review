import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.collectapi.com/imdb/imdbSearchById?movieId=${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: "apikey 7Lns3oudyBAHwT1ZmeVdBf:1E9bAZpA23z4WxKgTG8LFS",
            },
          }
        );
        setMovie(response.data.result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
          <p className="text-red-500 text-center">{error}</p>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{movie.Title}</h1>
              <p className="text-gray-500 mt-2">{movie.Year} • {movie.Rated} • {movie.Runtime}</p>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-bold">{movie.imdbRating}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Poster Column */}
            <div className="md:col-span-1">
              <img
                src={movie.Poster}
                alt={movie.Title}
                className="w-full rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.src = "/api/placeholder/300/450";
                }}
              />
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{movie.Runtime}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{movie.BoxOffice}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span className="text-sm">{movie.Awards}</span>
                </div>
              </div>
            </div>
            
            {/* Details Column */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Plot</h3>
                <p className="text-gray-600">{movie.Plot}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Director</h3>
                  <p className="text-gray-600">{movie.Director}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Writer</h3>
                  <p className="text-gray-600">{movie.Writer}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Genre</h3>
                  <p className="text-gray-600">{movie.Genre}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Released</h3>
                  <p className="text-gray-600">{movie.Released}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Cast</h3>
                <p className="text-gray-600">{movie.Actors}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Ratings</h3>
                <div className="grid grid-cols-3 gap-4">
                  {movie.Ratings?.map((rating) => (
                    <div key={rating.Source} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">{rating.Source}</p>
                      <p className="font-semibold">{rating.Value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;