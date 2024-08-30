import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
    const [restaurantData, setRestaurantData] = useState([]);

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/restaurant/all/`);
                if (response.status === 200) {
                    setRestaurantData(response.data);
                }
            } catch (error) {
                console.log('Error fetching restaurant data:', error);
            }
        };

        fetchRestaurantData();
    }, []);

    return (
        <RestaurantContext.Provider value={{ restaurantData, setRestaurantData }}>
            {children}
        </RestaurantContext.Provider>
    );
};
