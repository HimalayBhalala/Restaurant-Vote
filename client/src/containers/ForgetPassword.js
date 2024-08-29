import React, { useEffect, useState } from 'react'
import { TextField,Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { forget_password } from '../actions/auth';
import { connect } from 'react-redux';

const ForgetPassword = ({user,forget_password}) => {
  const role = JSON.parse(localStorage.getItem('role'));
  const user_id = localStorage.getItem('user_id');

  const [formData,setFormData] = useState({
    new_password : '',
    confirm_new_password : ''
  });

  const [passwordStatus,setPasswordStatus] = useState(false);


  const navigate = useNavigate();

  const {new_password,confirm_new_password} = formData;

  useEffect(() => {

    if(role === '' || role === null){
      navigate("/select/role")
    }

    if(!user){
      navigate('/add/email')
    }
    if(passwordStatus){
        navigate('/login')
    }
  },[user,passwordStatus,navigate,role])

  const onChange = (e) => setFormData({
    ...formData,
    [e.target.name] : e.target.value
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
      
    try{
        setPasswordStatus(true)
        await forget_password(new_password,confirm_new_password,user_id);
    }catch(error){
      console.log("Error During fetching an api",String(error))
    }
};

  return (
    <div className="container mt-5" style={{marginBottom:"15.66rem"}}>
            <div>
                <div style={{border:"2px solid black",background:"white"}}>
                    <form style={{margin:"2rem"}} onSubmit={handleSubmit}>
                        <TextField
                            label="New Password"
                            type='password'
                            variant="outlined"
                            fullWidth
                            name = "new_password"
                            margin='normal'
                            value = {new_password}
                            onChange={onChange}
                        />
                        <TextField
                          label="Confirm New Password"
                          variant='outlined'
                          type='password'
                          fullWidth
                          name='confirm_new_password'
                          margin='normal'
                          value={confirm_new_password}
                          onChange={onChange}
                        />
                        <Button className='mt-3' style={{textAlign:"center"}}
                          type='submit'
                          variant='contained'
                          color='primary'
                        >Change Password</Button>
                    </form>
                </div>
            </div>
        </div>
  )
};

const mapStateToProps = (state) => ({
    user : state.auth.user
  })
  
export default connect(mapStateToProps,{forget_password})(ForgetPassword);
  
