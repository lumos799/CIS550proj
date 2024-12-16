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

const TopCategories = () => {
    const [city, setCity] = useState('');
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);

    const formatYAxis = (value) => {
        if (value >= 1_000_000) {
          return `${(value / 1_000_000).toFixed(1)}M`;
        } else if (value >= 1_000) {
          return `${(value / 1_000).toFixed(1)}K`;
        }
        return value.toString();
      };
  
    const handleSearch = async () => {
      if (!city.trim()) {
        setError('Enter a city name');
        setCategories([]);
        return;
      }
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/business/top15-categories?city=${encodeURIComponent(
            city.trim()
          )}`
        );
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('An error occurred while fetching data.');
        }
        setCategories([]);
      }
    };
  
    const chartData = categories.map((category) => ({
      category: category.category,
      totalReviews: category.score,
    }));
  
    return (
      <div className="max-w-6xl mx-auto mt-10 p-4">
        <h2 className="text-2xl font-semibold mb-4">
          Top 15 Business Categories in a City
        </h2>
  
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
          >
            Search
          </button>
        </div>
  
        {error && (
          <div className="mb-4 text-red-500">
            <p>{error}</p>
          </div>
        )}
  
        {!error && categories.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Popularity</h3>
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
                  dataKey="category"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={100}
                />
                <YAxis tickFormatter={formatYAxis}/>
                <Tooltip />
                <Legend />
                <Bar dataKey="totalReviews" fill="#34D399" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  };
  
  export default TopCategories;