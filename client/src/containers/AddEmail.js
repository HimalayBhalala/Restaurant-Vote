import { TextField,Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { email_confirmation } from '../actions/auth';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function AddEmail({user,email_confirmation}) {
    const role = JSON.parse(localStorage.getItem('role'));
    const [formData,setFormData] = useState({
        email:''
    })

    const navigate = useNavigate();

    useEffect(() => {
        if(role === '' || role === null){
            navigate("/select/role")
        }
        if(user){
            navigate('/forget/password')
        }
    },[user,navigate,role])


    const {email} = formData;

    const onChange = (e) => setFormData({
        ...formData,
        [e.target.name] : e.target.value  
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await email_confirmation(email,role)
            if (!(res.success)){
                navigate('/register')
            }
        }catch(error){
            console.log("Error Ocuure during fetching an api",String(error))
        }
    }
    return (
    <div className='container mt-2'>
        <header>
            <h1 className='text-center mt-5'>
                Confirm Email 
            </h1>
        </header>
        <form className='form-control' onSubmit={handleSubmit}>
            <TextField
                label="Add Email"
                variant='outlined'
                margin='normal'
                value={email}
                fullWidth
                name="email"
                onChange={onChange}
            />
            <div className='text-center'>
                <Button type='submit' color='primary' variant='contained' style={{marginTop:"1rem",textAlign:"center"}}>
                    Next
                </Button>
            </div>
        </form>
    </div>
  )
}

const mapStateToProps = (state) => ({
    user : state.auth.user
  })
  
export default connect(mapStateToProps,{email_confirmation})(AddEmail);
  

