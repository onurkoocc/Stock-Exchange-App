import axios from "axios";
import authHeader from "./auth-header";
const API_URL = "http://localhost:9090/user/";

class UserService {


    buy = (userId,code,stockCount,price,date) => {
        return axios.post(API_URL + "buyStock",{
            userId,code,stockCount,price,date,
        },{ headers: authHeader()}).then((response)=>{return response.data});
    };

    sell = (userId,code,stockCount,price,date) => {
        return axios.post(API_URL + "sellStock",{
            userId,code,stockCount,price,date,
        },{ headers: authHeader()}).then((response)=>{return response.data});
    };
    portfolio = (userId) => {
        return axios.post(API_URL + "portfolio",{
            userId,
        },{ headers: authHeader()}).then((response)=>{return response.data});
    };





}
export default new UserService();
