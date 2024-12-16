import { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import { NavLink } from 'react-router-dom';

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories data from the backend
    fetch(`http://localhost:8080/api/business/category-pics`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch categories');
        }
        return res.json();
      })
      .then((resJson) => {
        console.log(resJson); // Debugging
        setCategories(
          Array.isArray(resJson) ? resJson : [] // Ensure data is an array
        );
      })
      .catch((err) => {
        console.error('Error fetching categories:', err);
        setCategories([]); // Set to empty array in case of error
      });
  }, []);

  const gridFormat = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    justifyContent: 'center',
    padding: '20px',
  };

  return (
    <Container style={gridFormat}>
      {categories.length > 0 ? (
        categories
          .filter((category) => category.category && category.url) // Filter out invalid data
          .map((category) => (
            <Box
              key={category.category}
              p={3}
              style={{
                background: '#f5f5f5',
                borderRadius: '16px',
                border: '2px solid #e0e0e0',
                textAlign: 'center',
              }}
            >
              <img
                src={category.url}
                alt={`${category.category}`}
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                }}
              />
              <h4>
                <NavLink to={`/business-category?category=${encodeURIComponent(category.category)}`}>
                  {category.category}
                </NavLink>
              </h4>
            </Box>
          ))
      ) : (
        <div>Loading categories...</div> // Display loading or fallback message
      )}
    </Container>
  );
}
