import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EditRestaurant() {
    const [formData, setFormData] = useState({});
    const { boss_id, restaurant_id } = useParams();
    const navigate = useNavigate();
    const [getUpdateStaus,setUpdateStatus] = useState(false);


    useEffect(() => {
        if(getUpdateStaus){
            navigate("/admin/show/restaurants")
        }
    },[getUpdateStaus,navigate])
    
    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/restaurant/crud/${boss_id}/`, {
                    params: { restaurant_id }
                });
                setFormData(response.data.data);
            } catch (error) {
                console.log("Error occure during fetching an api",String(error))
            }
        };

        fetchRestaurant();
    }, [getUpdateStaus, restaurant_id,navigate,boss_id]);

    const onChange = (e) => setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });

    const handleSubmit = async (e) => {
        setUpdateStatus(true)
        e.preventDefault();

        const config = {
            headers: {
                "Content-Type": "application/json"
            },
            params : {restaurant_id}
        };

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/restaurant/crud/${boss_id}/`,formData, config);
            if (response.status === 200) {
                console.log("Restaurant is updated");
            } else {
                console.error("Error occurred during updating restaurant");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className='container'>
            <h1 className='text-center'>Edit Restaurant</h1>
            <hr />
            <form onSubmit={handleSubmit} className='form-control'>
                <div className='mt-3'>
                    <TextField
                        label="Restaurant Name"
                        className='form-control'
                        type='text'
                        name='name'
                        value={formData.name || ''}
                        onChange={onChange}
                    />
                </div>
                <div className='text-center'>
                    <button type='submit' className='mt-4 btn btn-primary'>
                        Update
                    </button>
                </div>
            </form>
        </div>
    );
}
