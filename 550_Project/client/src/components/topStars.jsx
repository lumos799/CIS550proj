import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BusinessCard from '../components/BusinessCard';

const BusinessHighStars = () => {
  const [starBiggerthan, setStarBiggerthan] = useState('');
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // 每页显示的条目数
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null); // 选中的商家 ID

  // **搜索功能**
  const handleSearch = async () => {
    if (!starBiggerthan.trim()) {
      setError('Please enter a number.');
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await axios.get('http://localhost:8080/api/homepage/getopendayAvgstarComplex2', {
        params: { starBiggerthan: starBiggerthan.trim() },
      });
      setData(response.data);
      setCurrentPage(1); // 重置到第一页
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('An error occurred while fetching data.');
      setLoading(false);
    }
  };

  // **分页逻辑**
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) => {
      if (direction === 'prev' && prevPage > 1) {
        return prevPage - 1;
      } else if (direction === 'next' && prevPage < totalPages) {
        return prevPage + 1;
      }
      return prevPage;
    });
  };

  // **点击商家名称触发弹窗**
  const handleBusinessClick = (businessId) => {
    console.log('Selected business_id:', businessId); // 输出日志确认
    setSelectedBusinessId(businessId); // 设置选中的商家 ID
  };

  // **关闭弹窗**
  const handleClose = () => {
    setSelectedBusinessId(null); // 重置选中的商家 ID
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-semibold mb-4 text-left">
        Select Businesses by Stars
      </h2>

      {/* 搜索栏 */}
      <div className="flex flex-col md:flex-row items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="number"
          placeholder="Enter a star"
          value={starBiggerthan}
          onChange={(e) => setStarBiggerthan(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full md:w-auto"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Search
        </button>
      </div>

      {/* 加载状态 */}
      {loading && <div className="text-center mt-4">Loading data...</div>}

      {/* 错误提示 */}
      {error && <div className="text-center mt-4 text-red-500">{error}</div>}

      {/* 搜索后无数据 */}
      {!loading && !error && hasSearched && data.length === 0 && (
        <div className="text-gray-700 mt-4 text-center">No data found.</div>
      )}

      {/* 数据表格 */}
      
      {!loading && !error && data.length > 0 && (
        <div>
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-left">Business Name</th>
                <th className="px-4 py-2 border-b text-left">City</th>
                <th className="px-4 py-2 border-b text-center">Open Days</th>
                <th className="px-4 py-2 border-b text-center">Positive Feedback</th>
                <th className="px-4 py-2 border-b text-center">Avg Total Stars</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((biz, idx) => (
                <tr key={idx}>
                  <td
                    className="px-4 py-2 border-b text-blue-500 cursor-pointer underline"
                    onClick={() => handleBusinessClick(biz.business_id)} // 点击触发弹窗
                  >
                    {biz.business_name}
                  </td>
                  <td className="px-4 py-2 border-b">{biz.city}</td>
                  <td className="px-4 py-2 border-b text-center">{biz.open_day}</td>
                  <td className="px-4 py-2 border-b text-center">{biz.total_positive_feedback}</td>
                  <td className="px-4 py-2 border-b text-center">
                    {parseFloat(biz.avg_total_stars).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
     

          {/* 分页组件 */}
          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={() => handlePageChange('prev')}
              className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700'}`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="px-3 py-1">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePageChange('next')}
              className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700'}`}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* 弹窗组件 */}
      {selectedBusinessId && (
        <BusinessCard business_id={selectedBusinessId} handleClose={handleClose} />
      )}
    </div>
  );
};

export default BusinessHighStars;
