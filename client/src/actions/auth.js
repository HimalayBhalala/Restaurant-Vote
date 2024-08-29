import axios from 'axios';
import {
    CUSTOMER_SIGNUP_SUCCESS,
    CUSTOMER_SIGUP_FAIL,
    CUSTOMER_LOGIN_SUCCESS,
    CUSTOMER_LOGIN_FAIL,
    CUSTOMER_AUTHENTICATED_SUCCESS,
    CUSTOMER_AUTHENTICATED_FAILED,

    BOSS_SIGNUP_SUCCESS,
    BOSS_SIGUP_FAIL,
    BOSS_LOGIN_SUCCESS,
    BOSS_LOGIN_FAIL,
    BOSS_AUTHENTICATED_SUCCESS,
    BOSS_AUTHENTICATED_FAILED,

    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAILED,
    EMAIL_VERIFY_SUCCESS,
    EMAIL_VERIFY_FAILED,
    LOGOUT
} from './types';


export const change_password = (new_password,confirm_new_password,user_id) => async dispatch => {
    const token = localStorage.getItem('access_token');
    
    const config = {
        headers : {
            "Content-Type":"application/json",
            "Authorization":`Bearer ${token}`
        }
    }

    const body = JSON.stringify({new_password,confirm_new_password})

    try{
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/auth/change/password/${user_id}/`,body,config)
        if(res.status === 202){
            dispatch({
                type:CHANGE_PASSWORD_SUCCESS
            })
        }else{
            dispatch({
                type:CHANGE_PASSWORD_FAILED
            })
        }
    }catch(error){
        console.log("Api is not fetching successfully",String(error));
        dispatch({
            type : CHANGE_PASSWORD_FAILED
        })
    }
}

export const forget_password = (new_password,confirm_new_password,user_id) => async dispatch => {
    
    const config = {
        headers : {
            "Content-Type":"application/json",
        }
    }

    const body = JSON.stringify({new_password,confirm_new_password})

    try{
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/auth/forget/password/${user_id}/`,body,config)
        if(res.status === 202){
            dispatch({
                type:CHANGE_PASSWORD_SUCCESS
            })
        }else{
            dispatch({
                type:CHANGE_PASSWORD_FAILED
            })
        }
    }catch(error){
        console.log("Api is not fetching successfully",String(error));
        dispatch({
            type : CHANGE_PASSWORD_FAILED
        })
    }
}

export const email_confirmation = (email,role) => async dispatch => {
    const config = {
        headers : {
            "Content-Type":"application/json",
        }
    }
    const body = JSON.stringify({email})

    if(role === 'customer'){
        try{
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/customer/add/email/`,body,config)
            if (res.status === 200){
                dispatch({
                    type:EMAIL_VERIFY_SUCCESS,
                    payload:res.data
                })
                return {success:true,status:res.status}
            }else{
                dispatch({
                    type : EMAIL_VERIFY_FAILED
                })
                return {success:false,status:res.status}            
            }
        }catch(error){
            console.log("Error occure during fetching an backend api",String(error));
            dispatch({
                type : EMAIL_VERIFY_FAILED
            })
            return {success:false}
        }   
    }else if (role === 'boss'){
        try{
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/boss/add/email/`,body,config)
            if (res.status === 200){
                dispatch({
                    type:EMAIL_VERIFY_SUCCESS,
                    payload:res.data
                })
                return {success:true,status:res.status}
            }else{
                dispatch({
                    type : EMAIL_VERIFY_FAILED
                })
                return {success:false,status:res.status}            
            }
        }catch(error){
            console.log("Error occure during fetching an backend api",String(error));
            dispatch({
                type : EMAIL_VERIFY_FAILED
            })
            return {success:false}
        }   
    }
}

export const customer_checkAuthenticated = () => async dispatch => {
    const token = localStorage.getItem('access_token');
    if (token) {
        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        };

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/customer/`, config);
            if (res.status === 200) {
                dispatch({
                    type: CUSTOMER_AUTHENTICATED_SUCCESS,
                    payload : res
                });
            } else {
                dispatch({
                    type: CUSTOMER_AUTHENTICATED_FAILED
                });
            }
        } catch (error) {
            console.error('Authentication error:', error);
            dispatch({
                type: CUSTOMER_AUTHENTICATED_FAILED
            });
        }
    } else {
        dispatch({
            type: CUSTOMER_AUTHENTICATED_FAILED
        });
    }
};

export const customer_register = (email, first_name, last_name,password, confirm_password) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    const body = JSON.stringify({ email, first_name, last_name,password, confirm_password});

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/customer/register/`, body, config);
        if (res.status === 201) {
            dispatch({
                type: CUSTOMER_SIGNUP_SUCCESS,
                payload:res.data
            });
        } else {
            dispatch({
                type: CUSTOMER_SIGUP_FAIL
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        dispatch({
            type: CUSTOMER_SIGUP_FAIL
        });
    }
};

export const customer_login = (email, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/customer/login/`, body, config);
        if (res.status === 200) {
            dispatch({
                type: CUSTOMER_LOGIN_SUCCESS,
                payload: res.data 
            });
            dispatch(customer_checkAuthenticated())
        } else {
            dispatch({
                type: CUSTOMER_LOGIN_FAIL
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        dispatch({
            type: CUSTOMER_LOGIN_FAIL
        });
    }
};


export const boss_checkAuthenticated = () => async dispatch => {
    const token = localStorage.getItem('access_token');
    if (token) {
        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        };

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/boss/`, config);
            if (res.status === 200) {
                dispatch({
                    type: BOSS_AUTHENTICATED_SUCCESS,
                    payload : res
                });
            } else {
                dispatch({
                    type: BOSS_AUTHENTICATED_FAILED
                });
            }
        } catch (error) {
            console.error('Authentication error:', error);
            dispatch({
                type: BOSS_AUTHENTICATED_FAILED
            });
        }
    } else {
        dispatch({
            type: BOSS_AUTHENTICATED_FAILED
        });
    }
};

export const boss_register = (email, first_name, last_name,password, confirm_password) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    const body = JSON.stringify({ email, first_name, last_name,password, confirm_password});

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/boss/register/`, body, config);
        if (res.status === 201) {
            dispatch({
                type: BOSS_SIGNUP_SUCCESS,
                payload:res.data
            });
        } else {
            dispatch({
                type: BOSS_SIGUP_FAIL
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        dispatch({
            type: BOSS_SIGUP_FAIL
        });
    }
};

export const boss_login = (email, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/boss/login/`, body, config);
        if (res.status === 200) {
            dispatch({
                type: BOSS_LOGIN_SUCCESS,
                payload: res.data 
            });
            dispatch(boss_checkAuthenticated())
        } else {
            dispatch({
                type: BOSS_LOGIN_FAIL
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        dispatch({
            type: BOSS_LOGIN_FAIL
        });
    }
};


export const logout = () => async dispatch =>{
    dispatch({
        type:LOGOUT
    })
};


