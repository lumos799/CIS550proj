// src/App.jsx
import React from 'react';
import RecommendBusiness from '../components/recommendBusiness';
import TopCategories from '../components/topCategories';
import CityReviewCounts from '../components/cityreviewcounts';

// import Useractivebuscomplex3 from './components/useractivebuscomplex3';

const App = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">Business Directory</h1>
        </div>
      </nav>

      {/* Main Content */}
      <TopCategories />
      <RecommendBusiness/>
      <CityReviewCounts/>
      {/* <Useractivebuscomplex3/> */}
    </div>
  );
};

export default App;

