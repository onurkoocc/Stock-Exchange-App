import axios from "axios";
import authHeader from "./auth-header";
const API_URL = "http://localhost:9090/stocks";

class StockService {


    getAllStocks = () => {
        return axios
            .get(API_URL + "", {headers: authHeader()}
            )
            .then((response) => {
                return response.data;
            });
    };

    getAssetsDetails = (stockCodes) => {
        return axios
            .post(API_URL + "/getAssetsDetails",stockCodes,{headers: authHeader()}
            )
            .then((response) => {
                console.log(response.data);
                return response.data;
            });
    };

    getChartData = (code) => {
        return axios
            .get(API_URL + "/chart/"+code,{headers: authHeader()}
            )
            .then((response) => {
                console.log(response.data);
                return response.data;
            });
    };





}
export default new StockService();
