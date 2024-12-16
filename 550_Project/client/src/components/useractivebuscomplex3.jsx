import React, { useState, useEffect } from 'react';
import axios from 'axios';

const useractivebuscomplex3 = () => {
  const [city, setCity] = useState('');
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!city.trim()) {
      setError('Please enter a city name.');
      setData([]);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:8080/api/homepage/getactiveUserBusiComplex3?city=${encodeURIComponent(city.trim())}`
      );
      setData(response.data);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error fetching data:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('An error occurred while fetching data.');
      }
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">User Page</h1>

      <div className="flex flex-col md:flex-row items-center mb-6">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full md:w-1/2 mb-4 md:mb-0 mr-0 md:mr-4 p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleSearch}
          className="w-full md:w-auto bg-blue-500 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Search'}
        </button>
      </div>

      {error && (
        <div className="mb-4 text-red-500">
          <p>{error}</p>
        </div>
      )}

      {!error && currentData.length > 0 && (
        <div>
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">User ID</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Review Count</th>
                <th className="border border-gray-300 px-4 py-2">Average Stars</th>
                <th className="border border-gray-300 px-4 py-2">Region Reviews</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((user, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{user.user_id}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.review_count}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.average_stars.toFixed(2)}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.region_reviews}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-6">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`mx-1 px-4 py-2 rounded ${
                  currentPage === index + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-black'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="mt-4">
          <p>No data available for the selected city.</p>
        </div>
      )}
    </div>
  );
};

export default useractivebuscomplex3;
