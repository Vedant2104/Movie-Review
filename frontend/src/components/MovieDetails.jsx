import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Download } from 'lucide-react';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [movieError, setMovieError] = useState(null);
  const [reviewsError, setReviewsError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoadingMovie(true);
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
        setMovieError(err.message);
      } finally {
        setLoadingMovie(false);
      }
    };

    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        const reviewsResponse = await axios.post(
          'http://127.0.0.1:5000/dataset-analysis',
          { ImdbId: id, limit: 20 }
        );
        setReviews(reviewsResponse.data);
      } catch (err) {
        setReviewsError(err.message);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchMovieDetails();
    fetchReviews();
  }, [id]);

  const downloadCSV = () => {
    const csvContent = [
      ['Review', 'Sentiment'],
      ...reviews.map(review => [
        `"${review.reviews.replace(/"/g, '""')}"`,
        review.sentiment,
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${movie.Title.replace(/\s+/g, '_')}_reviews.csv`;
    link.click();
  };

  if (loadingMovie) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg font-medium">Loading Movie Details...</p>
      </div>
    );
  }

  if (movieError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-center">{movieError}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900 dark:text-white">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="p-6 border-b dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{movie.Title}</h1>
              <p className="text-gray-500 mt-2 dark:text-gray-400">
                {movie.Year} • {movie.Rated} • {movie.Runtime}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-bold">{movie.imdbRating}</span>
            </div>
          </div>
        </div>

        {/* Movie Details Section */}
        <div className="p-6 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="rounded-lg"
              onError={(e) => (e.target.src = "/api/placeholder/300/450")}
            />
            <div className="mt-4 space-y-2">
              <p><strong>Runtime:</strong> {movie.Runtime}</p>
              <p><strong>BoxOffice:</strong> {movie.BoxOffice}</p>
              <p><strong>Awards:</strong> {movie.Awards}</p>
            </div>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold mb-2">Plot</h3>
            <p>{movie.Plot}</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <p><strong>Director:</strong> {movie.Director}</p>
              <p><strong>Writer:</strong> {movie.Writer}</p>
              <p><strong>Genre:</strong> {movie.Genre}</p>
              <p><strong>Released:</strong> {movie.Released}</p>
            </div>
            <h3 className="font-semibold mt-4">Cast</h3>
            <p>{movie.Actors}</p>
          </div>
        </div>

        {/* Ratings Section */}
        <div className="p-6">
          <h3 className="font-semibold mb-2">Ratings</h3>
          <div className="grid grid-cols-3 gap-4">
            {movie.Ratings?.map((rating) => (
              <div key={rating.Source} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-300">{rating.Source}</p>
                <p className="font-semibold">{rating.Value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">User Reviews</h2>
          <button
            onClick={downloadCSV}
            className="flex items-center px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-500"
          >
            <Download size={16} className="mr-2" />
            Download Reviews
          </button>

          {loadingReviews ? (
            <p>Loading Reviews...</p>
          ) : reviewsError ? (
            <p className="text-red-500">Error loading reviews: {reviewsError}</p>
          ) : (
            reviews.map((review, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg shadow-md ${
                  review.sentiment === 'positive' 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <p className="text-gray-800 text-lg">{review.reviews}</p>
                <div className="mt-4 flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    review.sentiment === 'positive' 
                      ? 'bg-green-200 dark:bg-green-900 dark:text-green-200 text-green-800' 
                      : 'bg-red-200 dark:bg-red-900 dark:text-red-200 text-red-800'
                  }`}>
                    {review.sentiment}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
