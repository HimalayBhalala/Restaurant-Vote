import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const VoteContext = createContext();

export const VoteProvider = ({ children }) => {
    const [getVote, setVote] = useState([]);
    const customer_id = localStorage.getItem('customer_id');

    useEffect(() => {
        const fetchVotetData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/restaurant/customer/${customer_id}`);
                if (response.status === 200) {
                    setVote(response.data);
                }
            } catch (error) {
                console.log('Error fetching vote data:', error);
            }
        };
        fetchVotetData();
    }, [customer_id]);

    return (
        <VoteContext.Provider value={{ getVote, setVote}}>
            {children}
        </VoteContext.Provider>
    );
};
