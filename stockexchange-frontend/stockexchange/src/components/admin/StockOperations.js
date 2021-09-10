import React, {useState, useEffect} from "react";
import CheckButton from "react-validation/build/button";

import  AdminService from "../../services/admin.service";
import EventBus from "../../common/EventBus";
import {isEmail} from "validator";
import Input from "react-validation/build/input";


const StockOperations = () => {
    const [stocks, setStocks] = useState([]);
    const [errors, setErrors] = useState("");
    const [updatePage, setUpdatePage] = useState(false);
    const [addPage,setAddPage] = useState(false);
    const stockTmp ={
        id:null,
        name:null,
        code:null,
    };
    const [stockForm, setStockForm] = useState(stockTmp);
    useEffect(() => {
        AdminService.getAllStocks().then(
            (data) => {
                setStocks(data);
                console.log(data);
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

                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }
            }
        );
    }, [updatePage,addPage]);

    const onDelete = (stockId) => {
        AdminService.deleteStock(stockId).then(
            () => {
                window.location.reload();
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

                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }
            }
        );
    };
    const onChangeName = event => {
        setStockForm({ ...stockForm,name:event.target.value})
    }
    const onChangeCode = event => {
        setStockForm({ ...stockForm,code:event.target.value})
    }



    const addStock = () => {
        var data = {

            name:stockForm.name,
            code:stockForm.code,

        };

        AdminService.addStock(stockForm.name,stockForm.code)
            .then(data => {
                setStockForm(stockTmp);
                setAddPage(false);
                console.log(data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const updateStock = () => {
        var data = {
            id:stockForm.id,
            name:stockForm.name,
            code:stockForm.code,
        };

        AdminService.updateStock(stockForm.id,stockForm.name,stockForm.code)
            .then(data => {
                setStockForm(stockTmp);
                setUpdatePage(false);
                console.log(data);
            })
            .catch(e => {
                console.log(e);
            });
    };
    const newUpdateForm = (stock) => {
        setStockForm(stockTmp);
        setStockForm({ ...stockForm,
            id:stock.id,
            name:stock.name,
            code:stock.code,
        });
        setUpdatePage(true);
    };

    const newAddForm = () => {
        setStockForm(stockTmp);
        setAddPage(true);
    };

    return (
        <div className="container">

            {!updatePage ? (
                    <div className="card">
                        <h3 className="card-header text-center">Stocks</h3>
                        <div className="list-group-flush">
                            {errors}
                            <div className="text-right">
                                <button onClick={newAddForm} className="btn btn-success" >
                                    Add Stock
                                </button>
                            </div>
                            {addPage &&
                            <div className="card">
                                <div className="list-group-flush">
                                    <form>
                                        <table className="table">
                                            <thead>
                                            <tr>
                                                <th>NAME</th>
                                                <th>CODE</th>
                                                <th>ADD</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td><input className="form-control input-sm" value={stockForm.name} onChange={onChangeName}/></td>
                                                <td><input className="form-control input-sm" value={stockForm.code} onChange={onChangeCode}/></td>
                                                <td><button className="btn btn-success" onClick={() => addStock()}>SAVE</button></td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </form>
                                </div>
                            </div>
                            }

                            <table className="table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>NAME</th>
                                    <th>CODE</th>
                                    <th>DELETE</th>
                                    <th>UPDATE</th>
                                </tr>
                                </thead>
                                <tbody>
                                {stocks.map(stock => (
                                    <tr key={stock.id}>
                                        <td>{stock.id}</td>
                                        <td>{stock.name}</td>
                                        <td>{stock.code}</td>
                                        <td><button className="btn btn-danger" onClick={() => onDelete(stock.id)}>DELETE</button></td>
                                        <td><button className="btn btn-primary" onClick={() => newUpdateForm(stock)}>UPDATE</button></td>
                                    </tr>
                                ))}

                                </tbody>
                            </table>



                        </div>
                    </div>
                ):
                (
                    <div className="submit-form">
                        <div className="form-group">
                            <label htmlFor="id">ID</label>
                            <h1 id="id">{stockForm.id}</h1>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                required
                                value={stockForm.name}
                                onChange={onChangeName}
                                name="name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="code">Code</label>
                            <input
                                type="text"
                                className="form-control"
                                id="code"
                                required
                                value={stockForm.code}
                                onChange={onChangeCode}
                                name="code"
                            />
                        </div>

                        <button onClick={updateStock} className="btn btn-success">
                            Save
                        </button>
                    </div>
                )}

        </div>

    );
};
export default StockOperations;

