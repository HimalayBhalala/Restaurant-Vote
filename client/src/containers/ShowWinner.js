import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

function ShowWinner({ isAuthenticated }) {
  const [getWinnerData, setWinnerData] = useState([]);
  const [getHistoryData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const WinnerData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/restaurant/winners/`
        );
        console.log(response.data.data);

        setWinnerData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error occurred during fetching the API:", {
          message: error.message,
          response: error.response ? error.response.data : null,
        });
        setError("Error occurred during fetching the API.");
        setLoading(false);
      }
    };

    const HisoryData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/restaurant/history/`
        );
        setHistoryData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error is occurred during fetching the API:", {
          message: error.message,
          response: error.response ? error.response.data : null,
        });
        setLoading(false);
      }
    };
    WinnerData();
    if (showMore) {
      HisoryData();
    }
  }, [isAuthenticated, navigate, showMore]);

  const handleShowMore = () => {
    setShowMore(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      {console.log("length is", getHistoryData.length)}
      <h1 className="text-center">Today's Winner</h1>
      <hr />
      <table className="restaurant-table">
        <thead>
          <tr>
            <th>Restaurant Name</th>
            <th>Total Votes</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{getWinnerData.restaurant?.name || "N/A"}</td>
            <td>{getWinnerData.vote_total?.total_vote || "N/A"}</td>
            <td>{getWinnerData.date || "N/A"}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: "2rem" }} className="text-center">
        <button className="btn btn-primary" onClick={handleShowMore}>
          Show More
        </button>
      </div>

      {showMore && (
        <div style={{ marginTop: "5rem" }}>
          <table className="restaurant-table">
            <thead>
              <tr>
                <th>Restaurant Name</th>
                <th>Total Votes</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{getHistoryData.winner?.restaurant.name || "N/A"}</td>
                <td>{getHistoryData?.vote_total || "N/A"}</td>
                <td>{getHistoryData?.date || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(ShowWinner);