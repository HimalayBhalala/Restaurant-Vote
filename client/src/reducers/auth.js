import {
    CUSTOMER_SIGNUP_SUCCESS,
    CUSTOMER_SIGUP_FAIL,
    CUSTOMER_LOGIN_SUCCESS,
    CUSTOMER_AUTHENTICATED_SUCCESS,
    CUSTOMER_AUTHENTICATED_FAILED,
    CUSTOMER_LOGIN_FAIL,

    BOSS_SIGNUP_SUCCESS,
    BOSS_SIGUP_FAIL,
    BOSS_LOGIN_SUCCESS,
    BOSS_AUTHENTICATED_SUCCESS,
    BOSS_AUTHENTICATED_FAILED,
    BOSS_LOGIN_FAIL,

    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAILED,
    EMAIL_VERIFY_SUCCESS,
    EMAIL_VERIFY_FAILED,
    LOGOUT
} from '../actions/types';

const initialState = {
    access_token: null,
    refresh_token: null,
    isAuthenticated: false,
    user: null,
    customer: null,
    boss:null,
    message: null,
    username:null
};

const authReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case CUSTOMER_SIGNUP_SUCCESS:
            localStorage.setItem('access_token', payload.token.access_token);
            localStorage.setItem('refresh_token', payload.token.refresh_token);
            localStorage.setItem('customer_id', payload.customer.id);
            localStorage.setItem('user_id', payload.user.id);
            localStorage.setItem('username', payload.user.first_name);
            localStorage.setItem('username',payload.user.first_name);
            return {
                ...state,
                access_token: payload.token.access_token,
                refresh_token: payload.token.refresh_token,
                isAuthenticated: true,
                user: payload.user,
                customer: payload.customer,
                username:payload.user.username,
                message: "Customer Register Successfully"
            };

        case BOSS_SIGNUP_SUCCESS:
            localStorage.setItem('access_token', payload.token.access_token);
            localStorage.setItem('refresh_token', payload.token.refresh_token);
            localStorage.setItem('boss_id', payload.boss.id);
            localStorage.setItem('user_id', payload.user.id);
            localStorage.setItem('username', payload.user.first_name);
            return {
                ...state,
                access_token: payload.token.access_token,
                refresh_token: payload.token.refresh_token,
                isAuthenticated: true,
                user: payload.user,
                boss: payload.boss,
                username:payload.user.username,
                message: "Boss Register Successfully"
            };

        case CUSTOMER_AUTHENTICATED_SUCCESS:
                return {
                ...state,
                access_token:localStorage.getItem('access_token'),
                refresh_token:localStorage.getItem('refresh_token'),
                username:localStorage.getItem('username'),
                isAuthenticated: true,
                customer:payload,
                user: payload,
                message: "Customer Authentication success"
            };

        case BOSS_AUTHENTICATED_SUCCESS:
            return {
            ...state,
            access_token:localStorage.getItem('access_token'),
            refresh_token:localStorage.getItem('refresh_token'),
            username:localStorage.getItem('username'),
            isAuthenticated: true,
            user: payload,
            boss : payload.data,
            message: "Boss Authentication success"
        };

        case CHANGE_PASSWORD_SUCCESS:
            return {
                ...state,
                message: "Password changed successfully!"
            };

        case CHANGE_PASSWORD_FAILED:
            return {
                ...state,
                message: "Failed to change password"
            };

        case EMAIL_VERIFY_SUCCESS:
            localStorage.setItem('user_id', payload.user.id);
            return {
                ...state,
                user : payload.user,
                message : "User has been exists."
            }

        case CUSTOMER_LOGIN_SUCCESS:
            localStorage.setItem('access_token', payload.access_token);
            localStorage.setItem('refresh_token', payload.refresh_token);
            localStorage.setItem('customer_id', payload.customer.id);
            localStorage.setItem('user_id', payload.user.id);
            localStorage.setItem('username', payload.user.first_name);
            return {
                ...state,
                access_token: payload.access_token,
                refresh_token: payload.refresh_token,
                isAuthenticated: true,
                user: payload.user,
                customer: payload.customer,
                username:payload.user.first_name,
                message: "Customer Login Successfully"
            };

        case BOSS_LOGIN_SUCCESS:
            localStorage.setItem('access_token', payload.access_token);
            localStorage.setItem('refresh_token', payload.refresh_token);
            localStorage.setItem('boss_id', payload.boss.id);
            localStorage.setItem('user_id', payload.user.id);
            localStorage.setItem('username', payload.user.first_name);
            return {
                ...state,
                access_token: payload.access_token,
                refresh_token: payload.refresh_token,
                isAuthenticated: true,
                user: payload.user,
                boss: payload.boss,
                username:payload.user.first_name,
                message: "Boss Login Successfully"
            };
    
        case CUSTOMER_SIGUP_FAIL:
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem('customer_id');
            localStorage.removeItem('user_id');
            localStorage.removeItem('username');
            localStorage.removeItem('username');
            return {
                ...state,
                access_token: null,
                refresh_token: null,
                isAuthenticated: false,
                user: null,
                customer: null,
                username:null,
                message: "Customer Signup failed"
            };

        case BOSS_SIGUP_FAIL:
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("boss_id");
            localStorage.removeItem('user_id');
            localStorage.removeItem('username');
            localStorage.removeItem('username');
            return {
                ...state,
                access_token: null,
                refresh_token: null,
                isAuthenticated: false,
                user: null,
                boss: null,
                username:null,
                message: "Boss Signup failed"
            };

        case CUSTOMER_AUTHENTICATED_FAILED:
            return {
                ...state,
                isAuthenticated: false,
                message: "Customer Authentication failed"
            };

        case BOSS_AUTHENTICATED_FAILED:
            return {
                ...state,
                isAuthenticated: false,
                message: "Boss Authentication failed"
            };
        
        case EMAIL_VERIFY_FAILED:
            localStorage.removeItem('user_id')
            return {
                    ...state,
                    user : null,
                    message : "User has not found"
                }

        case CUSTOMER_LOGIN_FAIL:
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem('customer_id');
            localStorage.removeItem('user_id');
            localStorage.removeItem('username');
            localStorage.removeItem('username');
            return {
                ...state,
                access_token: null,
                refresh_token: null,
                isAuthenticated: false,
                user: null,
                customer: null,
                username:null,
                message: "Customer Login failed"
            }

        case BOSS_LOGIN_FAIL:
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem('boss_id');
            localStorage.removeItem('user_id');
            localStorage.removeItem('username');
            localStorage.removeItem('username');
            return {
                ...state,
                access_token: null,
                refresh_token: null,
                isAuthenticated: false,
                user: null,
                boss: null,
                username:null,
                message: "Boss Login failed"
        }

        case LOGOUT:
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem('customer_id');
            localStorage.removeItem('boss_id');
            localStorage.removeItem('user_id');
            localStorage.removeItem('username');
            localStorage.removeItem('username');
            return {
                ...state,
                access_token: null,
                refresh_token: null,
                isAuthenticated: false,
                user: null,
                customer: null,
                boss:null,
                profile_image:null,
                username:null,
                message: "Logout successful"
            };

        default:
            return state;
    }
};

export default authReducer;
