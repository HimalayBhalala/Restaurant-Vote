import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function ShowWinner({isAuthenticated}) {
    const [getWinner,setWinner] = useState([]);
    const [getDataStatus,setDataStatus] = useState(true)
    const [getShowMore,setShowMore] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        if(!isAuthenticated){
            navigate("/login")
        }
        if(getDataStatus){
            axios.get(`${process.env.REACT_APP_API_URL}/restaurant/winners/`)
                .then((response) => {
                    setWinner(response.data.data)
                    setDataStatus(false)
                })
                .catch((error) => {
                    console.log("Error Ocuure during fetching an api",String(error))
                })
        }
    },[getDataStatus,isAuthenticated,navigate])

    const ShowMoreWinner = () => {
        setShowMore(true)
    }
  
    return (
    <div className='container'>
        {console.log("winner",getWinner)}
        <h1 className='text-center'>Today's Winner</h1>
        <hr />
        <table className='restaurant-table'>
            <thead>
                <tr>
                    <th>Restaurant Name</th>
                    <th>Total Votes</th>
                    <th>Date</th>
                </tr>    
            </thead>    
            <tbody>
                <tr>
                    <td>{getWinner.restaurant?.name}</td>
                    <td>{getWinner.vote_total?.total_vote}</td>
                    <td>{getWinner?.date}</td>   
                </tr>    
            </tbody>        
        </table>

        <div style={{marginTop:"2rem"}} className='text-center'>
            <button className='btn btn-primary' onClick={ShowMoreWinner}> 
                Show More
            </button>
        </div>
        
        {
            getShowMore ? (
                <div style={{marginTop:"5rem"}}>
                     <table className='restaurant-table'>
                        <thead>
                            <tr>
                                <th>Restaurant Name</th>
                                <th>Total Votes</th>
                                <th>Date</th>
                            </tr>    
                        </thead>    
                        <tbody>
                            <tr>
                                <td>{getWinner.restaurant?.name}</td>
                                <td>{getWinner.vote_total?.total_vote}</td>
                                <td>{getWinner?.date}</td>   
                            </tr>    
                        </tbody>        
                    </table>
                </div>
            ) : (
                null
            )
        }
    </div>
  )
}

const mapStateToProps = (state) => ({
    isAuthenticated : state.auth.isAuthenticated
})

export default connect(mapStateToProps)(ShowWinner)