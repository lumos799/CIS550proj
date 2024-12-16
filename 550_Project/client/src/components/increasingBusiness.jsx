import React, { useState } from "react";
import axios from "axios";
import BusinessCard from "../components/BusinessCard";

const GoodBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [city, setCity] = useState("Philadelphia"); // Default city
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState("asc"); 
  const [orderBy, setOrderBy] = useState("total_traffic"); 
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); 
  const [selectedBusinessId, setSelectedBusinessId] = useState(null); 
  const [hasSearched, setHasSearched] = useState(false); 

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `http://localhost:8080/api/homepage/gettrafficBusiComplex4`,
        { params: { city } }
      );
      setBusinesses(response.data);
      setHasSearched(true);
    } catch (err) {
      console.error("Error fetching businesses:", err);
      setError("Failed to load businesses.");
      setBusinesses([]);
      setHasSearched(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event) => {
    setPage(parseInt(event.target.value, 10));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (businessId) => {
    console.log("Selected business_id:", businessId); 
    setSelectedBusinessId(businessId); 
  };

  const handleClose = () => {
    setSelectedBusinessId(null); // Reset the selected business ID
  };

  const sortedBusinesses = [...businesses].sort((a, b) => {
    if (order === "asc") {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    }
    return a[orderBy] > b[orderBy] ? -1 : 1;
  });

  // Pagination logic
  const paginatedBusinesses = sortedBusinesses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-semibold mb-4">
        Top Growing Businesses in {city}
      </h2>


      <div className="flex flex-col md:flex-row md:items-center mb-5">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full md:w-1/3 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchBusinesses}
          className="mt-3 md:mt-0 md:ml-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
        >
          Search
        </button>
      </div>

      {/* Loading or Error */}
      {loading && <p className="text-gray-700">Loading businesses...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Table (Graph) */}
      {!loading && !error && hasSearched && businesses.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Name
                    {orderBy === "name" && (
                      <svg
                        className={`w-4 h-4 ml-1 transform ${
                          order === "asc" ? "rotate-0" : "rotate-180"
                        } transition-transform duration-200`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-4 py-2">Address</th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSort("total_traffic")}
                >
                  <div className="flex items-center">
                    Total Traffic
                    {orderBy === "total_traffic" && (
                      <svg
                        className={`w-4 h-4 ml-1 transform ${
                          order === "asc" ? "rotate-0" : "rotate-180"
                        } transition-transform duration-200`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSort("consecutive_years")}
                >
                  <div className="flex items-center">
                    Consecutive Years
                    {orderBy === "consecutive_years" && (
                      <svg
                        className={`w-4 h-4 ml-1 transform ${
                          order === "asc" ? "rotate-0" : "rotate-180"
                        } transition-transform duration-200`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-4 py-2">Stars</th>
                <th className="px-4 py-2">Reviews</th>
                <th className="px-4 py-2">Top 3 Categories</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBusinesses.map((business, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(business.business_id)}
                >
                  <td className="px-4 py-2 border-t">{business.name}</td>
                  <td className="px-4 py-2 border-t">{business.address}</td>
                  <td className="px-4 py-2 border-t">{business.traffic}</td>
                  <td className="px-4 py-2 border-t">
                    {business.consecutive_years}
                  </td>
                  <td className="px-4 py-2 border-t">{business.stars}</td>
                  <td className="px-4 py-2 border-t">{business.review_count}</td>
                  <td className="px-4 py-2 border-t">
                    {business.categories
                      .split(",")
                      .slice(0, 3)
                      .map((category, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1"
                        >
                          {category.trim()}
                        </span>
                      ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-4">
            <div className="flex items-center mb-3 md:mb-0">
              <label className="mr-2">Rows per page:</label>
              <select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                className="border border-gray-300 rounded-md p-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
                className={`px-3 py-1 border rounded-md mr-2 ${
                  page === 0
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {page + 1} of {Math.ceil(businesses.length / rowsPerPage)}
              </span>
              <button
                onClick={() =>
                  setPage((prev) =>
                    prev + 1 < Math.ceil(businesses.length / rowsPerPage)
                      ? prev + 1
                      : prev
                  )
                }
                disabled={page + 1 >= Math.ceil(businesses.length / rowsPerPage)}
                className={`px-3 py-1 border rounded-md ml-2 ${
                  page + 1 >= Math.ceil(businesses.length / rowsPerPage)
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* No Data */}
      {!loading && !error && hasSearched && businesses.length === 0 && (
        <p className="text-gray-700">No businesses found for {city}.</p>
      )}

      {/* BusinessCard Modal */}
      {selectedBusinessId && (
        <BusinessCard business_id={selectedBusinessId} handleClose={handleClose} />
      )}
    </div>
  );
};

export default GoodBusinesses;
