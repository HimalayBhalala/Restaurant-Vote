import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function ShowRestaurant({ isAuthenticated }) {
    const [restaurantData, setRestaurantData] = useState([]);
    const [voteStatus, setVoteStatus] = useState({});
    const [loading, setLoading] = useState(false);
    const customerId = localStorage.getItem('customer_id');
    const accessToken = localStorage.getItem('access_token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchRestaurantData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/restaurant/all/`);
                if (response.status === 200) {
                    const restaurants = response.data;

                    const statusPromises = restaurants.map(async (restaurant) => {
                        const voteStatusResponse = await axios.get(
                            `${process.env.REACT_APP_API_URL}/restaurant/customer/vote-status/${restaurant.id}/`,
                            {
                                headers: {
                                    'Authorization': `Bearer ${accessToken}`,
                                },
                            }
                        );
                        return { restaurantId: restaurant.id, hasVoted: voteStatusResponse.data.has_voted };
                    });

                    const statuses = await Promise.all(statusPromises);
                    const statusMap = statuses.reduce((acc, { restaurantId, hasVoted }) => {
                        acc[restaurantId] = hasVoted;
                        return acc;
                    }, {});

                    setVoteStatus(statusMap);
                    setRestaurantData(restaurants);
                }
            } catch (error) {
                console.error('Error fetching restaurant data:', error);
                alert('An error occurred while fetching restaurant data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantData();
    }, [isAuthenticated, navigate, accessToken]);

    const handleVote = async (restaurantId) => {
        if (!customerId || !accessToken) {
            alert('Authentication error. Please log in again.');
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/restaurant/vote/${restaurantId}/${customerId}/`,{},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                }
            );
            if (response.status === 200) {
                setRestaurantData((prevData) =>
                    prevData.map((restaurant) =>
                        restaurant.id === restaurantId
                            ? { ...restaurant, vote_total: response.data.vote_total }
                            : restaurant
                    )
                );
                setVoteStatus((prevStatus) => ({
                    ...prevStatus,
                    [restaurantId]: true,
                }));
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert(error.response.data.message);
            } else {
                console.error('Error during voting:', error);
                alert('An error occurred while processing your vote. Please try again later.');
            }
        }
    };

    return (
        <div className="container">
            <h1 className="title">Restaurant List</h1>
            <hr />
            {loading ? (
                <p className="text-center">Loading...</p>
            ) : restaurantData.length === 0 ? (
                <p className="text-center">No restaurants found.</p>
            ) : (
                <table className="restaurant-table">
                    <thead>
                        <tr>
                            <th className="text-center">Index</th>
                            <th className="text-center">Restaurant Name</th>
                            <th className="text-center">Votes</th>
                            <th>Vote Status</th>
                            <th className="text-center">Vote Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {restaurantData.map((restaurant, index) => (
                            <tr key={restaurant.id}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">{restaurant.name}</td>
                                <td className="text-center">{restaurant.vote_total.total_vote}</td>
                                <td className="text-center">
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        {voteStatus[restaurant.id] ? (
                                            <div style={{ width: '80px', color: 'green' }}>Voted</div>
                                        ) : (
                                            <div style={{ width: '80px', color: 'red' }}>Not Voted</div>
                                        )}
                                    </div>
                                </td>
                                <td className="text-center">
                                    <button
                                        className="action-btn"
                                        onClick={() => handleVote(restaurant.id)}
                                    >
                                        {loading ? 'Voting...' : 'Vote'}
                                    </button>
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

export default connect(mapStateToProps)(ShowRestaurant);