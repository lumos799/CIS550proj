import React, { useState } from 'react';
import axios from 'axios';
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

const CityReviewCounts = () => {
  const [cities, setCities] = useState([]);
  const [error, setError] = useState(null);

  const formatYAxis = (value) => {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    } else if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const fetchTopCities = async () => {
    setError(null);
    try {
      const response = await axios.get('http://localhost:8080/api/business/top-review');
      setCities(response.data);
    } catch (err) {
      console.error('Error fetching top cities by review count:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('An error occurred while fetching data.');
      }
      setCities([]);
    }
  };

  const chartData = cities.map((city) => ({
    city: city.city,
    reviewCount: city.all_review_count,
  }));

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-semibold mb-4">Top Cities by Review Count</h2>

      <div className="flex justify-start mb-6">
        <button
          onClick={fetchTopCities}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Result
        </button>
      </div>

      {error && (
        <div className="mb-4 text-red-500">
          <p>{error}</p>
        </div>
      )}

      {!error && cities.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Review Counts by City</h3>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 100,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="city"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={100}
              />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip />
              <Legend />
              <Bar dataKey="reviewCount" fill="#34D399" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default CityReviewCounts;