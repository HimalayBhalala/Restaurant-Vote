import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../actions/auth';

const Navbar = ({ logout, isAuthenticated }) => {
  const role = JSON.parse(localStorage.getItem('role')) || null;
  const username = localStorage.getItem('username');

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid" style={{ marginLeft: "6em", marginRight: "2em" }}>
          <Link className="navbar-brand" to="/">Restaurant</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav ms-auto">

              <Link className="nav-link" style={{color:"white"}} aria-current="page" to="/">Home</Link>
              {isAuthenticated ? (
                role === 'customer' ? (
                  <div style={{display:"flex"}} className="mt-2">
                    <li>
                      <Link className='text-center ms-5' style={{color:"white",textDecoration:"none"}} to="/">Welcome {username}</Link>   
                    </li>
                    <li>
                      <Link className='text-center ms-5' style={{color:"white",textDecoration:"none"}} to="/today/winner">Winner</Link>   
                    </li>
                  </div>
                ) : role === 'boss' && (
                  <div style={{display:"flex"}} className="mt-2">
                    <li>
                      <Link className='text-center ms-5' style={{color:"white",textDecoration:"none"}} to="/">Welcome Admin</Link>   
                    </li>
                    <li>
                      <Link className='text-center ms-5' style={{color:"white",textDecoration:"none"}} to="/today/winner">Winner</Link>   
                    </li>
                  </div>
                )
              ) : (
                <div style={{display:"flex"}} className="mt-2">
                  <li>
                    <Link className='text-center ms-2' style={{color:"white",textDecoration:"none"}} to="/register">Register</Link>   
                  </li>
                  <li>                  
                    <Link className='text-center ms-3' style={{color:"white",textDecoration:"none"}} to="/login">Login</Link>
                  </li>
                  <li>
                    <Link className='text-center ms-3' style={{color:"white",textDecoration:"none"}} to="/forget/password">Forget Password</Link>
                  </li>
                  </div>
              )
              }

              {isAuthenticated && (
                <Link to='/login' className='nav-link ms-5' onClick={(e) => { e.preventDefault(); logout(); }}>Logout</Link>
              )}

            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};


const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
