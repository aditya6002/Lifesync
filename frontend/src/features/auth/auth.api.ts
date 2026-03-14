import axios from "axios";


const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

const login = async (email: string, password: string) => {
    try {
        
        const response = await api.post("/auth/login", { email, password });
        return response.data;

    } catch (error) {
        if(axios.isAxiosError(error) && error.response) {
            if(error.response.status === 401) {
                throw new Error("Invalid email or password");
            }
            if(error.response.status === 429) {
                throw new Error("Too many login attempts. Please try again later.");
            }
            if(error.response.status === 500) {
                throw new Error("Server error. Please try again later.");
            }
            if(error.response.status === 400) {
                throw new Error("Bad request. Please check your input.");
            }
            if(error.response.status === 403) {
                throw new Error("Access denied. Please contact support.");
            }
            if(error.response.status === 503) {
                throw new Error("Service unavailable. Please try again later.");
            }
            if(error.response.status === 504) {
                throw new Error("Gateway timeout. Please try again later.");
            }if(error.response.status === 422) {
                throw new Error("Unprocessable entity. Please check your input.");
            }
        }
        throw new Error("Login failed");
    }
}



const signup = async (email: string, password: string,username: string) => {
    try {
        const response = await api.post("/auth/signup", { email, password, username });
        return response.data;
    } catch (error) {
        if(axios.isAxiosError(error) && error.response) {
            if(error.response.status === 400) {
                throw new Error("Bad request. Please check your input.");
            }
            if(error.response.status === 409) {
                throw new Error("Email already in use. Please use a different email.");
            }
            if(error.response.status === 500) {
                throw new Error("Server error. Please try again later.");
            }
            if(error.response.status === 503) {
                throw new Error("Service unavailable. Please try again later.");
            }
            if(error.response.status === 504) {
                throw new Error("Gateway timeout. Please try again later.");
            }
            if(error.response.status === 422) {
                throw new Error("Unprocessable entity. Please check your input.");
            }
        }
        throw new Error("Signup failed");
    }
}

const logout = async () => {
    try {
        await api.post("/auth/logout");
    } catch (error) {
        console.log(error)
        if(axios.isAxiosError(error) && error.response) {
            if(error.response.status === 500) {
                throw new Error("Server error. Please try again later.");
            }
            if(error.response.status === 503) {
                throw new Error("Service unavailable. Please try again later.");
            }
            if(error.response.status === 504) {
                throw new Error("Gateway timeout. Please try again later.");
            }
        }
        throw new Error("Logout failed");
    }
}

const refreshToken = async () => {
    try {
        const response = await api.post("/auth/refresh");
        return response.data;
    } catch (error) {
        console.log(error)
        throw new Error("Token refresh failed");
    }
}

const getMe = async()=>{
    try {
        const res =  await api.get('/auth/me')
        
        return res.data;
    } catch (error) {
        console.dir(error)
        console.log(error)
    }
}

export const authApi = {
    login,
    signup,
    logout,
    refreshToken,
    getMe
};