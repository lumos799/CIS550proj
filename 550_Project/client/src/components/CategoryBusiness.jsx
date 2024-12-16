import React, { useEffect, useState } from 'react';
import { Container, Grid, Box, Typography, Pagination } from '@mui/material';
import { useLocation } from 'react-router-dom';
import BusinessCard from './BusinessCard'; // 引入 BusinessCard 组件

export default function BusinessByCategoryPage() {
  const [businesses, setBusinesses] = useState([]);
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null); // 新增状态管理选中的商家
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');

  
  useEffect(() => {
    if (categoryParam) {
      fetch(`http://localhost:8080/api/business/category-business?category=${encodeURIComponent(categoryParam)}`)
        .then((res) => res.json())
        .then((resJson) => {
          setBusinesses(Array.isArray(resJson) ? resJson : []);
        })
        .catch((err) => {
          console.error('Error fetching businesses:', err);
          setBusinesses([]);
        });

      fetch(`http://localhost:8080/api/business/category-pics?category=${encodeURIComponent(categoryParam)}`)
        .then((res) => res.json())
        .then((resJson) => {
          setBackgroundUrl(resJson[0]?.url || '');
        })
        .catch((err) => {
          console.error('Error fetching category pic:', err);
          setBackgroundUrl('');
        });
    }
  }, [categoryParam]);

  const totalPages = Math.max(1, Math.ceil(businesses.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBusinesses = businesses.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleBusinessClick = (businessId) => {
    console.log("Selected business_id:", businessId); // 输出选中的 business_id
    setSelectedBusinessId(businessId); // 设置选中的商家 ID
  };

  const handleClose = () => {
    setSelectedBusinessId(null); // 重置选中的商家 ID
  };

  const pageStyle = {
    backgroundImage: `url(${backgroundUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    padding: '20px',
    color: '#fff',
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '16px',
    padding: '16px',
    margin: '10px 0',
    textAlign: 'left',
    color: '#333',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  };

  const contentStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <div style={pageStyle}>
      <Container>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          style={{ color: '#fff', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}
        >
          Category: {categoryParam || 'Unknown'}
        </Typography>
        <Grid container spacing={3}>
          {currentBusinesses.length > 0 ? (
            currentBusinesses.map((business) => (
              <Grid item xs={12} md={6} key={business.business_id}>
                <Box style={cardStyle}>
                  <div style={contentStyle}>
                    <Box>
                      <Typography
                        variant="h5"
                        style={{ fontWeight: 'bold', cursor: 'pointer', color: '#007BFF' }}
                        onClick={() => handleBusinessClick(business.business_id)} // 点击触发弹窗
                      >
                        {business.name}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Address:</strong> {business.address || 'N/A'}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Avg Star:</strong> {business.stars || 'N/A'}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Postal Code:</strong> {business.postal_code || 'N/A'}
                      </Typography>
                      <Typography variant="body1">
                        <strong>City:</strong> {business.city || 'N/A'}
                      </Typography>
                    </Box>
                  </div>
                </Box>
              </Grid>
            ))
          ) : (
            <Typography variant="h5" align="center" style={{ color: '#fff' }}>
              No businesses found for this category.
            </Typography>
          )}
        </Grid>
        <Box display="flex" justifyContent="center" marginTop="20px">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
        {/* 弹窗部分 */}
        {selectedBusinessId && (
          <BusinessCard business_id={selectedBusinessId} handleClose={handleClose} />
        )}
      </Container>
    </div>
  );
}
