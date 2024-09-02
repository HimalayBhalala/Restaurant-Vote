import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const [restaurantData, setRestaurantData] = useState([]);
  const [filteredRestaurantData, setFilteredRestaurantData] = useState([]);

  const fetchRestaurantData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/restaurant/all/`
      );
      if (response.status === 200) {
        const data = response.data;
        setRestaurantData(data);
        filterDataForToday(data);
      } else {
        console.error("Failed to fetch data: ", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
    }
  };

  const filterDataForToday = (data) => {
    const today = new Date().toISOString().split("T")[0];
    const filteredData = data.map((restaurant) => ({
      ...restaurant,
      resturant_vote: restaurant.resturant_vote.filter(
        (vote) => vote.date.startsWith(today)
      ),
    }));
    setFilteredRestaurantData(filteredData);
  };

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const refetchRestaurantData = async () => {
    await fetchRestaurantData();
  };

  return (
    <RestaurantContext.Provider
      value={{ restaurantData: filteredRestaurantData, refetchRestaurantData }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};
