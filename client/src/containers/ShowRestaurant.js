import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RestaurantContext } from "../context/RestaurantContext";

function ShowRestaurant({ isAuthenticated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const customerId = localStorage.getItem("customer_id");
  const accessToken = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const { restaurantData, refetchRestaurantData } = useContext(RestaurantContext);
  const [remainingVotes, setRemainingVotes] = useState(3);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const updateRestaurantVotes = () => {
      if (restaurantData.length > 0) {
        const today = new Date().toISOString().split("T")[0];
        let votesToday = 0;

        const updatedData = restaurantData.map((restaurant) => {
          const todayVotes = restaurant.resturant_vote.filter(
            (vote) =>
              vote.customer === parseInt(customerId, 10) &&
              vote.date.startsWith(today)
          );
          votesToday += todayVotes.length;

          return {
            ...restaurant,
            resturant_vote: todayVotes,
            remaining_votes: todayVotes.length >= 3 ? 0 : 3 - todayVotes.length,
          };
        });

        setRemainingVotes(Math.max(3 - votesToday, 0));
      }
    };

    updateRestaurantVotes();
  }, [customerId, restaurantData]);

  const handleVote = async (restaurantId) => {
    if (!customerId || !accessToken) {
      alert("Authentication error. Please log in again.");
      return;
    }

    if (remainingVotes <= 0) {
      alert("You have reached the maximum number of votes for today.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/restaurant/vote/${restaurantId}/${customerId}/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 201) {
        refetchRestaurantData();
        setRemainingVotes((prevCount) => Math.max(prevCount - 1, 0));
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.message);
      } else {
        console.error("Error during voting:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Restaurant List</h1>
      <hr />
      <h3 className="text-center">Remaining Votes: {remainingVotes}</h3>
      <hr />
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-danger">{error}</p>
      ) : restaurantData.length === 0 ? (
        <p className="text-center">No restaurants found.</p>
      ) : (
        <table className="restaurant-table">
          <thead>
            <tr>
              <th className="text-center">Index</th>
              <th className="text-center">Restaurant Name</th>
              <th className="text-center">Total Votes</th>
              <th className="text-center">Vote Details</th>
              <th className="text-center">Vote Action</th>
            </tr>
          </thead>
          <tbody>
            {restaurantData.map((restaurant, index) => (
              <tr key={restaurant.id}>
                <td className="text-center">{index + 1}</td>
                <td className="text-center">{restaurant?.name}</td>
                <td className="text-center">
                  {restaurant.vote_total?.total_vote}
                </td>
                <td className="text-center">
                  <div>
                    {restaurant.resturant_vote
                      .filter((vote) => vote.customer === parseInt(customerId, 10))
                      .map((vote, idx) => (
                        <div key={idx}>
                          {`Vote: ${vote?.vote}, Customer: ${
                            vote?.customer_name
                          }, Date: ${new Date(vote.date).toLocaleDateString()}`}
                        </div>
                      ))}
                  </div>
                </td>
                <td className="text-center">
                  <button
                    className="action-btn"
                    onClick={() => handleVote(restaurant.id)}
                  >
                    Vote
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-5" style={{ color: "orange" }}>
        <span>
          <b style={{ color: "black" }}>Note:</b> If you have given a vote the
          first time in any restaurant, it is valued at 1. If you give a vote
          the second time in the same restaurant, it is valued at 0.5. If you
          vote for the third time in the same restaurant, the value is 0.25.
        </span>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(ShowRestaurant);
