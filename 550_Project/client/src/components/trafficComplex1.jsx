import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// convert to day name
const TrafficBarChart = () => {
  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString());

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [city, setCity] = useState('Philadelphia');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedHour, setSelectedHour] = useState('');

  const [hasSearched, setHasSearched] = useState(false);

  const getDayName = (dayNumber) => {
    return dayNames[dayNumber % 7];
  };

  const fetchData = async () => {
    setError(false);
    setLoading(true);
    setHasSearched(true);

    try {
      const response = await axios.get('http://localhost:8080/api/homepage/gettrafficComplex1', {
        params: { city: city.trim() },
      });

      const fetchedData = response.data;
      const aggregatedData = {};
      fetchedData.forEach((item) => {
        const { dayofweek, hour, star_group, traffic } = item;
        const dayName = getDayName(dayofweek);
        const key = `${dayName}-${hour}`;

        if (!aggregatedData[key]) {
          aggregatedData[key] = {
            name: key,
            '1 star': 0,
            '2-3 stars': 0,
            '4-5 stars': 0,
          };
        }

        aggregatedData[key][star_group] += parseInt(traffic, 10);
      });

      const chartData = Object.values(aggregatedData).sort((a, b) => {
        const [dayA, hourA] = a.name.split('-');
        const [dayB, hourB] = b.name.split('-');

        if (dayNames.indexOf(dayA) !== dayNames.indexOf(dayB)) {
          return dayNames.indexOf(dayA) - dayNames.indexOf(dayB);
        }

        return parseInt(hourA, 10) - parseInt(hourB, 10);
      });

      setData(chartData);
      setFilteredData(applyFilters(chartData, selectedDay, selectedHour));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching traffic data:', err);
      setError(true);
      setLoading(false);
    }
  };

  const applyFilters = (d, day, hour) => {
    if (!d || d.length === 0) return [];

    if (day === '' && hour === '') {
      return d;
    }

    return d.filter((item) => {
      const [itemDay, itemHour] = item.name.split('-');
      const dayMatch = day === '' || itemDay === day;
      const hourMatch = hour === '' || itemHour === hour;
      return dayMatch && hourMatch;
    });
  };

  useEffect(() => {
    if (data.length > 0) {
      setFilteredData(applyFilters(data, selectedDay, selectedHour));
    }
  }, [selectedDay, selectedHour]);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-semibold mb-4">
        Number of Checkins 
      </h2>

      <div className="flex flex-col md:flex-row items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full md:w-auto"
        />

        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full md:w-auto"
        >
          <option value="">All Days</option>
          {dayNames.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        <select
          value={selectedHour}
          onChange={(e) => setSelectedHour(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full md:w-auto"
        >
          <option value="">All Hours</option>
          {hourOptions.map((hour) => (
            <option key={hour} value={hour}>
              {hour}:00
            </option>
          ))}
        </select>

        <button
          onClick={fetchData}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Search
        </button>
      </div>

      {loading && (
        <div className="text-center mt-4">Loading traffic data...</div>
      )}

      {error && (
        <div className="text-center mt-4 text-red-500">Error loading traffic data.</div>
      )}

      {!loading && !error && hasSearched && filteredData.length === 0 && (
        <div className="text-gray-700 mt-4">
          No data found.
        </div>
      )}

      {!loading && !error && filteredData.length > 0 && (
        <ResponsiveContainer width="100%" height={600}>
          <BarChart
            data={filteredData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 100,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              interval={0}
              height={150}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="1 star" fill="#8884d8" />
            <Bar dataKey="2-3 stars" fill="#82ca9d" />
            <Bar dataKey="4-5 stars" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TrafficBarChart;
