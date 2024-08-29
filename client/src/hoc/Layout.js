import React, { useEffect } from 'react';
import Navbar from '../componenets/Navbar';
import { customer_checkAuthenticated, boss_checkAuthenticated } from '../actions/auth';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';

const Layout = (props) => {
  let location = useLocation();
  const {customer_checkAuthenticated,boss_checkAuthenticated} = props
  const role = JSON.parse(localStorage.getItem('role'));
  const navigate = useNavigate();


  useEffect(() => {
    const values = queryString.parse(location.search);
    const state = values.state || null;
    const code = values.code || null;

    console.log('Location:', location);
    console.log('Query String:', location.search);
    console.log('Parsed Values:', values);
    console.log('State:', state);
    console.log('Code:', code);
    console.log('Role:', role);

    if (state && code) {
      return;
    }else{
      if (!role) {
        navigate('/select/role');
      } else if (role === 'customer') {
        customer_checkAuthenticated();
      } else if (role === 'boss') {
        boss_checkAuthenticated();
      } else {
        navigate('/select/role');
      }
    }

  }, [location, role, navigate, customer_checkAuthenticated, boss_checkAuthenticated]);

  return (
    <>
      <Navbar />
      {props.children}
    </>
  );
};

export default connect(null, {customer_checkAuthenticated,boss_checkAuthenticated})(Layout);
