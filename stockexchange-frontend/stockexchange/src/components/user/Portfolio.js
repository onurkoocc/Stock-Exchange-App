import {useEffect, useState} from "react";
import UserService from "../../services/user.service";
import AuthService from "../../services/auth.service";

const Portfolio = () => {
    const [portfolio,setPortfolio] = useState([]);
    const [errors, setErrors] = useState("");
    const currentUser = AuthService.getCurrentUser();
    useEffect(() => {
        UserService.portfolio(currentUser.id).then(
            (data) => {
                setPortfolio(data);
            },
            (error) => {
                console.log(error);
                const errors =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setErrors(errors);

            }
        );

    }, []);

    return (
        <div>
            <table className="table">
                <thead>
                <tr>
                    <th>STOCK CODE</th>
                    <th>AMOUNT</th>
                    <th>COUNT</th>
                </tr>
                </thead>
                <tbody>
                {portfolio.map(item => (
                <tr key={item.id}>
                    <td>{item.stock.code}</td>
                    <td>{item.price}</td>
                    <td>{item.count}</td>
                </tr>
                ))}
                </tbody>
            </table>

        </div>


    )
}
export default Portfolio;