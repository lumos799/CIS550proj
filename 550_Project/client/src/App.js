import React from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar'; // 确保路径正确
import RecommendBusiness from './components/recommendBusiness';
import TopCategories from './components/topCategories';
import RestaurantInsights from './components/RestaurantInsights';
import ActiveUserBusinessComplex from './components/ActiveUserBusinessComplex';
import CityReviewCounts from './components/cityreviewcounts';
import BusinessHighStars from './components/topStars';
import TrafficBarChart from './components/trafficComplex1';
import GoodBusinesses from './components/increasingBusiness';
import CategoryPage from './components/Category';
import BusinessByCategoryPage from './components/CategoryBusiness';

// 定义主题
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // 主色
    },
    secondary: {
      main: '#dc004e', // 次色
    },
  },

});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter> {/* 只保留一个 BrowserRouter */}
        <NavBar />
        <Routes>
          <Route
            path="/business"
            element={
              <div>
                <TopCategories />
                <RecommendBusiness />
                <BusinessHighStars />
              </div>
            }
          />
          <Route
            path="/restaurant"
            element={
              <div>
                <CityReviewCounts />
                <RestaurantInsights />
                <GoodBusinesses />
              </div>
            }
          />
          <Route
            path="/complex3"
            element={
              <div>
                <ActiveUserBusinessComplex />
                <TrafficBarChart />
              </div>
            }
          />
          <Route path="/business-category" element={<BusinessByCategoryPage />} />
          <Route path="/" element={<CategoryPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
