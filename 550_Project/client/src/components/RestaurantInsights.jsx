import React, { useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

const RestaurantInsights = () => {
  const [city, setCity] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      setData([]);
      return;
    }

    setError(null);
    setHasSearched(true);

    try {
      const response = await axios.get(`http://localhost:8080/api/restaurant/getRestInsights?city=${encodeURIComponent(city.trim())}`);
      setData(response.data);
    } catch (err) {
      console.error('Error fetching insights:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred while fetching data.');
      }
      setData([]);
    }
  };

  // 准备图表数据：这里示例用avg_review_count作为图表显示
  const chartData = data.map((item) => ({
    star_group: item.star_group,
    avg_review_count: parseFloat(item.avg_review_count),
  }));

  const formatYAxis = (value) => {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    } else if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`;
    }
    return value.toString();
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-semibold mb-4">Restaurant Insights by City</h2>

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

        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Search
        </button>
      </div>

      {error && (
        <div className="mb-4 text-red-500">
          <p>{error}</p>
        </div>
      )}

      {/* 显示图表 */}
      {!error && data.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Average Review Count by Star Group</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 50,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="star_group" angle={-45} textAnchor="end" interval={0} height={80} />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip />
              <Legend />
              <Bar dataKey="avg_review_count" fill="#34D399" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Displaying Tabular data */}
      {!error && data.length > 0 && (
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b text-left">City</th>
              <th className="px-4 py-2 border-b text-left">Category</th>
              <th className="px-4 py-2 border-b text-left">Avg Review Count</th>
              <th className="px-4 py-2 border-b text-left">Number of Businesses</th>
              <th className="px-4 py-2 border-b text-left">Total Useful Tips</th>
              <th className="px-4 py-2 border-b text-left">Total Funny Tips</th>
              <th className="px-4 py-2 border-b text-left">Total Cool Tips</th>
              <th className="px-4 py-2 border-b text-left">Star Group</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2 border-b">{row.city}</td>
                <td className="px-4 py-2 border-b">{row.category}</td>
                <td className="px-4 py-2 border-b">{parseFloat(row.avg_review_count).toFixed(2)}</td>
                <td className="px-4 py-2 border-b">{row.num_of_businesses}</td>
                <td className="px-4 py-2 border-b">{row.total_useful_tips}</td>
                <td className="px-4 py-2 border-b">{row.total_funny_tips}</td>
                <td className="px-4 py-2 border-b">{row.total_cool_tips}</td>
                <td className="px-4 py-2 border-b">{row.star_group}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!error && hasSearched && data.length === 0 && (
        <div className="text-gray-700 mt-4">
          No data found.
        </div>
      )}
    </div>
  );
};

export default RestaurantInsights;
