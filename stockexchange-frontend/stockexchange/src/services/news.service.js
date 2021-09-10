import axios from "axios";
const  urlString = "https://newsapi.org/v2/everything?q=stock%20OR%20coin%20OR%20crypto%20OR%20financial%20OR%20finance%20OR%20economics%20OR%20economy&language=en&sortBy=relevancy,publishedAt&domains=cnbc.com,ft.com,finance.yahoo.com,fnlondon.com,reuters.com,marketwatch.com,theguardian.com,wjs.com&apiKey=866529ff971640cf9639685e44cf9fee";



class NewsService{
    getDailyNews = () => {
        return axios
            .get(urlString)
            .then((response) => {
                return response.data;
            });
    };
}
export default new NewsService();