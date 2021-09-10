import axios from "axios";
import authHeader from "./auth-header";
const API_URL = "http://localhost:9090/admin/";


class AdminService {
getAllUsers = () => {
    return axios
        .get(API_URL + "users", { headers: authHeader() }
        )
        .then((response) => {
            return response.data;
        });
};

    deleteUser = (userId) => {
        return axios
            .delete(API_URL + "users/"+userId, { headers: authHeader() }
            )
            .then((response) => {
                return response.data;
            });
    };

    updateUser = (id,name,surname,username,email,role) => {
        return axios.put(API_URL + "users/"+id,{
id,name,surname,username,email,role,
        },{ headers: authHeader()}).then((response)=>{return response.data});
    };

    addUser = (name,surname,username,email,role,password) => {
        return axios.post(API_URL + "users",{
            name,surname,username,email,role,password,
        },{ headers: authHeader()}).then((response)=>{return response.data});
    };

    getAllStocks = () => {
        return axios
            .get(API_URL + "stocks", { headers: authHeader() }
            )
            .then((response) => {
                return response.data;
            });
    };

    deleteStock = (userId) => {
        return axios
            .delete(API_URL + "stocks/"+userId, { headers: authHeader() }
            )
            .then((response) => {
                return response.data;
            });
    };

    updateStock = (id,name,code) => {
        return axios.put(API_URL + "stocks/"+id,{
            id,name,code,
        },{ headers: authHeader()}).then((response)=>{return response.data});
    };

    addStock = (name,code) => {
        return axios.post(API_URL + "stocks",{
            name,code,
        },{ headers: authHeader()}).then((response)=>{return response.data});
    };

}

export default new AdminService();