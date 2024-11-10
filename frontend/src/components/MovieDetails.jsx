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
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg font-medium text-gray-900 dark:text-white">Loading Movie Details...</p>
      </div>
    );
  }

  if (movieError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <p className="text-red-500 text-center">{movieError}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="p-6 border-b dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{movie.Title}</h1>
              <p className="text-gray-500 dark:text-gray-300">{movie.Year} • {movie.Rated}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-gray-900 dark:text-white">{movie.imdbRating}</span>
            </div>
          </div>
        </div>

        {/* Movie Details Section */}
        <div className="p-6 grid md:grid-cols-3 gap-6 dark:text-white">
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

        {/* Reviews Section */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">User Reviews</h2>
          <button
            onClick={downloadCSV}
            className="flex items-center px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-500"
          >
            <Download size={16} className="mr-2" />
            Download Reviews
          </button>

          {loadingReviews ? (
            <p className="text-gray-900 dark:text-white">Loading Reviews...</p>
          ) : reviewsError ? (
            <p className="text-red-500">Error loading reviews: {reviewsError}</p>
          ) : (
            reviews.map((review, index) => (
              <div key={index} className="border p-4 mt-2 bg-white dark:bg-gray-800">
                <p>{review.reviews}</p>
                <span className="block mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Sentiment: {review.sentiment}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
