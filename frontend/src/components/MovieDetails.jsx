import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Download } from 'lucide-react';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [movieResponse, reviewsResponse] = await Promise.all([
          axios.get(
            `https://api.collectapi.com/imdb/imdbSearchById?movieId=${id}`,
            {
              headers: {
                "Content-Type": "application/json",
                authorization: "apikey 7Lns3oudyBAHwT1ZmeVdBf:1E9bAZpA23z4WxKgTG8LFS",
              },
            }
          ),
          axios.post('http://127.0.0.1:5000//dataset-analysis', {
            ImdbId: id,
            limit: 20
          })
        ]);
        
        setMovie(movieResponse.data.result);
        setReviews(reviewsResponse.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const downloadCSV = () => {
    // Create CSV content
    const csvContent = [
      ['Review', 'Sentiment'], // Header row
      ...reviews.map(review => [
        `"${review.reviews.replace(/"/g, '""')}"`, // Escape quotes in reviews
        review.sentiment
      ])
    ].map(row => row.join(',')).join('\n');

    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Set up download
    link.setAttribute('href', url);
    link.setAttribute('download', `${movie.Title.replace(/\s+/g, '_')}_reviews.csv`);
    link.style.visibility = 'hidden';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
        {/* Movie Details Header */}
        <div className="p-6 border-b dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold dark:text-white">{movie.Title}</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">{movie.Year} • {movie.Rated} • {movie.Runtime}</p>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-bold dark:text-white">{movie.imdbRating}</span>
            </div>
          </div>
        </div>

        {/* Movie Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* ... Poster Column remains the same ... */}
            
            {/* Details Column */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Plot</h3>
                <p className="text-gray-600 dark:text-gray-300">{movie.Plot}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold dark:text-white">Director</h3>
                  <p className="text-gray-600 dark:text-gray-300">{movie.Director}</p>
                </div>
                {/* ... Similar updates for Writer, Genre, Released sections ... */}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="md:col-span-3 mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold dark:text-white">User Reviews</h2>
                <button
                  onClick={downloadCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-400 transition-colors"
                >
                  <Download size={16} />
                  Download Reviews
                </button>
              </div>
              <div className="grid gap-6">
                {reviews.map((review, index) => (
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
                          ? 'bg-green-200 text-green-800' 
                          : 'bg-red-200 text-red-800'
                      }`}>
                        {review.sentiment}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;