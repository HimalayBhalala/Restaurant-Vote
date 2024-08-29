import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './storage';
import Layout from './hoc/Layout';
import Home from './containers/Home';
import SignUp from './containers/SignUp';
import Login from './containers/Login';
import AddEmail from './containers/AddEmail';
import ForgetPassword from './containers/ForgetPassword';
import SelectRole from './containers/SelectRole';
import NotFound from './containers/NotFound';
import ShowRestaurant from './containers/ShowRestaurant';
import AddNewRestaurent from './containers/AddNewRestaurent';
import EditRestaurant from './containers/EditRestaurant';
import AdminShowRestaurant from './containers/AdminShowRestaurant';
import ShowWinner from './containers/ShowWinner';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add/email" element={<AddEmail />} />
            <Route path="/forget/password" element={<ForgetPassword />} />
            <Route path="/select/role" element={<SelectRole />} />  
            <Route path="/show/restaurants" element={<ShowRestaurant />} />  
            <Route path="/admin/show/restaurants" element={<AdminShowRestaurant />} />
            <Route path="/add/new/restuarant/:boss_id" element={<AddNewRestaurent />} />                   
            <Route path="/edit/restuarant/:boss_id/:restaurant_id" element={<EditRestaurant />} />        
            <Route path="/today/winner" element={<ShowWinner />} />           
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
