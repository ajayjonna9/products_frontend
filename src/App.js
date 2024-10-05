import React from 'react';
import ProductsList from './components/Products';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductsList/>} />
      </Routes>
    </Router>
  );
}

export default App;
