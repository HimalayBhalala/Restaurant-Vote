import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { customer_login,boss_login } from '../actions/auth';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Login = ({ customer_login,isAuthenticated,boss_login}) => {
  const role = JSON.parse(localStorage.getItem('role'));
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const navigate = useNavigate();

  const onChange = (e) => setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });

  useEffect(() => {
    if(role === '' || role === null){
      navigate("/select/role")
    }

    if(isAuthenticated){
      navigate("/")
    }
  },[isAuthenticated,navigate,role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (role === 'customer'){
        await customer_login(email, password);
      }else if(role === 'boss'){
        await boss_login(email,password);
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div className='container mt-5'>
      <div>
      <div className='form-control mt-5 text-center'>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          variant="outlined"
          margin="normal"
          fullWidth
          value={email}
          name='email'
          onChange={onChange}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          fullWidth
          value={password}
          name='password'
          onChange={onChange}
        />
        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
      </form>
      <div className='mt-2'>
        If not Register ! Please First Register <a href='/register'>SignUp</a>
      </div>
      </div>
    </div>
  </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated : state.auth.isAuthenticated
});

export default connect(mapStateToProps, { customer_login,boss_login})(Login);
