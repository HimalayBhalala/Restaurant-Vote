import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RestaurantContext } from '../context/RestaurantContext';

function AdminShowRestaurant({isAuthenticated}) {
    const boss_id = localStorage.getItem('boss_id')
    const { restaurantData, setRestaurantData } = useContext(RestaurantContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isAuthenticated){
            navigate("/login")
        }
    },[isAuthenticated,navigate])

    const deleteRestaurant = async (bossId,restaurant_id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/restaurant/crud/${bossId}/`,{params:{restaurant_id}});
            setRestaurantData(restaurantData.filter((restaurant) => (restaurant.id !== restaurant_id)))
            console.log("Deleted Successfully.....")
        } catch (error) {
            console.error("Error occurred during fetching the API. Please check the network or API URL.", error);
        }
    }

    return (
        <div className="container">
            {console.log("check",boss_id)}
            <h1 className="title">Restaurant List</h1>
            <hr />
            <div className="text-end mb-4">
                <Link className="btn btn-success" to={`/add/new/restaurant/${boss_id}/`}>
                    Add New Restaurant
                </Link>
            </div>
            {restaurantData.length === 0 ? (
                <p className="text-center">No restaurants found.</p>
            ) : (
                <table className="restaurant-table">
                    <thead>
                        <tr>
                            <th className="text-center">Index</th>
                            <th className="text-center">Restaurant Name</th>
                            <th className="text-center">Votes</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {restaurantData.map((restaurant, index) => (
                            <tr key={restaurant.id}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">{restaurant.name}</td>
                                <td className="text-center">{restaurant.vote_total.total_vote}</td>
                                <td className="text-center">
                                    <Link className="btn btn-primary ms-2" to={`/edit/restaurant/${boss_id}/${restaurant?.id}`}>Edit</Link>
                                    <button className="btn btn-danger ms-2" onClick={() => deleteRestaurant(boss_id, restaurant.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(AdminShowRestaurant);