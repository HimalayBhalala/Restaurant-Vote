import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function AddNewRestaurant() {
    const [formData, setFormData] = useState({});
    const { boss_id } = useParams();
    const [getCreateStaus,setCreateStatus] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if(getCreateStaus){
            navigate("/admin/show/restaurants")
        }
    },[getCreateStaus,navigate])

    const onChange = (e) => setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/restaurant/crud/${boss_id}/`, formData, config);
            if (response.status === 201) {
                console.log("Restaurant is added");
                setCreateStatus(true)
            } else {
                console.error("Error occurred during adding restaurant");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className='container'>
            <h1 className='text-center'>Add New Restaurant</h1>
            <hr />
            <form onSubmit={handleSubmit} className='form-control'>
                <div className='mt-3'>
                    <TextField
                        label="Restaurant Name"
                        className='form-control'
                        type='text'
                        name='name'
                        onChange={onChange}
                    />
                </div>
                <div className='text-center'>
                    <button type='submit' className='mt-4 btn btn-primary'>
                        Add
                    </button>
                </div>
            </form>
        </div>
    );
}
