import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const role = JSON.parse(localStorage.getItem('role'));  
  return (
    <div>
      <div className="container mt-5">
        <div className="jumbotron jumbotron-fluid">
          <h1 className="display-4">Welcome to Restaurant Site</h1>
          <p className="lead">This application shows very good restaurants....</p>
          <p>Click below to show all restaurants</p>
          {
            role === "customer" ? (
              <Link className="btn btn-primary" to="/show/restaurants">Show all Restaurants</Link>
            ) : (
              <Link className="btn btn-primary" to="/admin/show/restaurants">Show all Restaurants</Link>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Home;
