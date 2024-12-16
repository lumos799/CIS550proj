import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BusinessCard from '../components/BusinessCard';

const RecommendBusiness = () => {
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [availability, setAvailability] = useState('');
  const [minReviews, setMinReviews] = useState('');
  const [maxReviews, setMaxReviews] = useState('');
  const [business, setBusiness] = useState([]);
  const [error, setError] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null); // State for selected business ID

  // Fetch available categories
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/business/distinct-categories')
      .then((response) => setAvailableCategories(response.data))
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  // Search function
  const handleSearch = async () => {
    if (!city.trim()) {
      setError('Enter a city name');
      setBusiness([]);
      return;
    }
    setError(null);
    setHasSearched(true);
    try {
      const params = new URLSearchParams();
      params.append('city', city.trim());
      if (category.trim()) params.append('category', category.trim());
      if (availability.trim()) params.append('availability', availability.trim());
      if (minReviews.trim()) params.append('min_reviews', minReviews.trim());
      if (maxReviews.trim()) params.append('max_reviews', maxReviews.trim());
      const response = await axios.get(
        `http://localhost:8080/api/business/recommend?${params.toString()}`
      );
      setBusiness(response.data);
    } catch (err) {
      console.error('Error fetching business:', err);
      setError('An error occurred during fetching data.');
      setBusiness([]);
    }
  };

  // Handle click on business name to open the modal
  const handleBusinessClick = (businessId) => {
    console.log('Selected business_id:', businessId); // Log the selected business ID
    setSelectedBusinessId(businessId); // Set the selected business ID
  };

  // Close the modal
  const handleClose = () => {
    setSelectedBusinessId(null); // Reset the selected business ID
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-semibold mb-4">
        Filter Businesses by City, Category, Availability, and Reviews
      </h2>
      <div className="flex flex-col md:flex-row items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex flex-col w-full md:w-auto">
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">--Select a Category--</option>
          {availableCategories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">--Availability--</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
        <input
          type="number"
          placeholder="Min Reviews"
          value={minReviews}
          onChange={(e) => setMinReviews(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          placeholder="Max Reviews"
          value={maxReviews}
          onChange={(e) => setMaxReviews(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Search
        </button>
      </div>

      {/* Display search results */}
      {!error && business.length > 0 && (
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b text-left">Name</th>
              <th className="px-4 py-2 border-b text-left">City</th>
              <th className="px-4 py-2 border-b text-left">Category</th>
              <th className="px-4 py-2 border-b text-left">Address</th>
              <th className="px-4 py-2 border-b text-left">Availability</th>
              <th className="px-4 py-2 border-b text-left">Reviews</th>
              <th className="px-4 py-2 border-b text-left">Stars</th>
            </tr>
          </thead>
          <tbody>
            {business.map((biz, idx) => (
              <tr key={idx}>
                <td
                  className="px-4 py-2 border-b text-blue-500 cursor-pointer underline"
                  onClick={() => handleBusinessClick(biz.business_id)} // Open modal on click
                >
                  {biz.name}
                </td>
                <td className="px-4 py-2 border-b">{biz.city}</td>
                <td className="px-4 py-2 border-b">{biz.category}</td>
                <td className="px-4 py-2 border-b">{biz.address}</td>
                <td className="px-4 py-2 border-b">{biz.availability}</td>
                <td className="px-4 py-2 border-b text-center">{biz.reviews}</td>
                <td className="px-4 py-2 border-b text-center">{biz.stars}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* No data found */}
      {!error && hasSearched && business.length === 0 && (
        <div className="text-gray-700 mt-4">No data found.</div>
      )}

      {/* Modal for BusinessCard */}
      {selectedBusinessId && (
        <BusinessCard business_id={selectedBusinessId} handleClose={handleClose} />
      )}
    </div>
  );
};

export default RecommendBusiness;
