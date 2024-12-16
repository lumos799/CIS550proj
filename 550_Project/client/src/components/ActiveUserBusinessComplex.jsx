import React, { useState } from 'react';
import axios from 'axios';

const ActiveUserBusinessComplex = () => {
  const [city, setCity] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // 用于控制页码分组的变量
  const [currentPageGroup, setCurrentPageGroup] = useState(0); 
  // 例如：第0组显示 1-5页, 第1组显示6-10页, 以此类推

  const handleSearch = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      setData([]);
      setHasSearched(false);
      return;
    }

    setError(null);
    setHasSearched(true);
    setCurrentPage(1);
    setCurrentPageGroup(0);

    try {
      const response = await axios.get(
        `http://localhost:8080/api/homepage/getactiveUserBusiComplex3?city=${encodeURIComponent(city.trim())}`
      );
      setData(response.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred while fetching data.');
      }
      setData([]);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(data.length / rowsPerPage); // total page

  // the page number button range based on the current pageGroup
  const pagesPerGroup = 5;
  const startPage = currentPageGroup * pagesPerGroup + 1; 
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevGroup = () => {
    if (startPage > 1) {
      setCurrentPageGroup(currentPageGroup - 1);
      setCurrentPage((currentPageGroup - 1) * pagesPerGroup + 1); // update page
    }
  };

  const handleNextGroup = () => {
    if (endPage < totalPages) {
      setCurrentPageGroup(currentPageGroup + 1);
      setCurrentPage((currentPageGroup + 1) * pagesPerGroup + 1); // update page group
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-semibold mb-4">Active Users and Reviewed Businesses</h2>

      <div className="flex flex-col md:flex-row items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="text"
          placeholder="Enter City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full md:w-64 focus:outline-none focus:border-blue-400"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors font-medium"
        >
          Search
        </button>
      </div>

      {error && (
        <div className="mb-4 text-red-500 font-medium">
          <p>{error}</p>
        </div>
      )}

      {!error && data.length > 0 && (
        <>
          {/* display */}
          <div className="mb-4 text-gray-700">
            Showing <span className="font-semibold">{indexOfFirstRow + 1}</span> to{' '}
            <span className="font-semibold">
              {indexOfLastRow > data.length ? data.length : indexOfLastRow}
            </span>{' '}
            of <span className="font-semibold">{data.length}</span> entries
          </div>

          {/* create table */}
          <div className="overflow-auto rounded-lg shadow border border-gray-200">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200 text-gray-700">
                  <th className="px-4 py-3 text-left font-medium">User ID</th>
                  <th className="px-4 py-3 text-left font-medium">Business Name</th>
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Review Count</th>
                  <th className="px-4 py-3 text-left font-medium">Avg Stars</th>
                  <th className="px-4 py-3 text-left font-medium">Review Star</th>
                  <th className="px-4 py-3 text-left font-medium">Review Date</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {currentRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`border-b hover:bg-gray-50 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3">{row.user_id}</td>
                    <td className="px-4 py-3">{row.business_id}</td>
                    <td className="px-4 py-3">{row.name}</td>
                    <td className="px-4 py-3">{row.review_count}</td>
                    <td className="px-4 py-3">{parseFloat(row.average_stars).toFixed(2)}</td>
                    <td className="px-4 py-3">{row.review_star}</td>
                    <td className="px-4 py-3">{row.review_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* page */}
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              onClick={handlePrevGroup}
              disabled={startPage === 1}
              className={`px-3 py-1 rounded font-medium ${
                startPage === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              &lt;
            </button>
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => handlePageChange(number)}
                className={`px-3 py-1 rounded font-medium ${
                  currentPage === number
                    ? 'bg-blue-800 text-white'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {number}
              </button>
            ))}
            <button
              onClick={handleNextGroup}
              disabled={endPage === totalPages}
              className={`px-3 py-1 rounded font-medium ${
                endPage === totalPages
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              &gt;
            </button>
          </div>
        </>
      )}

      {!error && hasSearched && data.length === 0 && (
        <div className="text-gray-700 mt-4 font-medium">
          No data found.
        </div>
      )}
    </div>
  );
};

export default ActiveUserBusinessComplex;
