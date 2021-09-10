import React, { useState, useEffect } from "react";

import UserService from "../../services/user.service";
import StockService from "../../services/stock.service";
import auth from "../../services/auth.service";
import Chart from "react-apexcharts";
import shop from "../../icons/2x/baseline_shopping_cart_black_36dp.png"

const BuyAndSell = () => {
    const [stockDetails, setStockDetails] = useState([]);
    const [stockCodes,setStockCodes] = useState([]);
    const [stocksTmp,setStocksTmp] = useState([]);
    const [selectedStock, setSelectedStock] = useState(
        {
            userId:auth.getCurrentUser().id,
            code:"           ",
            stockCount:null,
            price:"          ",
            date:null
        });
    const [errors,setErrors] = useState("");
    const [loadFailure, setLoadFailure] = useState(false);

    const [pendingApiCall,setPendingApiCall] = useState(false);
    const [message,setMessage] = useState("");

    const initialState = [{
        name: 'candle',
        data: []
    }];

    const [series,setSeries] = useState([{
        name: 'candle',
        data: []
    }]);
    const [options,setOptions] = useState({
        chart: {
            height: 350,
            type: 'candlestick',
        },
        annotations: {
            xaxis: [
                {
                    x: 'Oct 06 14:00',
                    borderColor: '#1b47bf',
                    label: {
                        borderColor: '#1b47bf',
                        style: {
                            fontSize: '12px',
                            color: '#fff',
                            background: '#00E396'
                        },
                        orientation: 'horizontal',
                        offsetY: 7,
                    }
                }
            ]
        },
        tooltip: {
            enabled: true,
        },
        xaxis: {
            type: 'datetime',
            axisBorder: {
                offsetX: 12
            }
        },
        yaxis: {
            tooltip: {
                enabled: true
            }
        }
    });
    useEffect(async  ()=>{
        for(let i=0;i<stocksTmp.length;i++){
            await setStockCodes(stockCodes => [...stockCodes, stocksTmp[i].code]);
        }
    },[stocksTmp]);

    useEffect(async  ()=>{
        setLoadFailure(false);
        try{
            const dataFromYF = await StockService.getAssetsDetails(stockCodes);
            await setStockDetails(dataFromYF);
        }catch (error){
            setLoadFailure(true);
        }

    },[stockCodes])



    useEffect(async ()  => {
        setLoadFailure(false);
        setStocksTmp([]);
        setStockDetails([]);
        try {
            const data = await StockService.getAllStocks();
            await setStocksTmp(data);
        } catch (error) {
            setLoadFailure(true);
        }
    }, []);

    const colorPicker = (number) => {
        if(number>0){
            return (`#008000`);
        }
        if(number<0){
            return `#ff0000`;
        }
        if(number===0){
            return `#79817D`;
        }
    }


    const getHistoricalData = async (code) => {

        setPendingApiCall(true);
        await setSeries(initialState);
        try {
            const thisdata = await StockService.getChartData(code);
            let data = [];
            for (let i=0;i<thisdata.length-1;i++){
                await data.push({
                    x:thisdata[i].date,
                    y:[thisdata[i].open,thisdata[i].high,thisdata[i].low,thisdata[i].close]
                })
            }
            await setSeries(series =>[...series,{
                data:data,
            }])

        } catch (error) {

        }
        setPendingApiCall(false);
    }

    const onClickChartData = async (value) =>{
        setSelectedStock(
            {
                ...selectedStock,
                price: value.price,
                code: value.code,
                date: value.date
            }
    )
        await setSeries(initialState);
        getHistoricalData(value.code);
    }


    const onBuy = () => {
        const {userId, code, stockCount, price, date} = selectedStock;
        UserService.buy(userId, code, stockCount, price, date).then(
            () => {
                setMessage("Succes");
            },
            (error) => {
                const errors =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                setErrors(errors);
            }
        );

    }

    const onSell = () => {
        const {userId, code, stockCount, price, date} = selectedStock;
        UserService.sell(userId, code, stockCount, price, date).then(
            () => {
                setMessage("Succes");
            },
            (error) => {
                const errors =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setErrors(errors);
            }
        );

    }
    const onChangeCount = event => {
        setSelectedStock({...selectedStock, stockCount: event.target.value})
    }


    return (

        <div className="card w-125 bg-light border-primary mb-4">
            <div className="row no-gutters">
                <div className="col-md-4">
                    <div className="list-group">
                        {stockDetails.map((value, index) => (
                            <button className="btn btn-outline-primary btn-lg btn-block btn-lg"
                                    disabled={pendingApiCall} role="button" aria-pressed="true"
                                    onClick={(preventDefault) =>
                                        onClickChartData(value)
                                    }>

                                <div className="container">
                                    <div className="row">
                                        <div className="col-4" style={{fontWeight: "bold", fontSize: 12}}>
                                            <div className="row align-items-start">
                                                <div className="col">
                                                    {pendingApiCall && (
                                                        <span className="spinner-border spinner-border-sm"></span>)}
                                                    <smail>{value.code}</smail>
                                                </div>
                                            </div>
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <br/>
                                                </div>
                                            </div>
                                            <div className="row align-items-end">
                                                <div className="col">
                                                    <small style={{fontSize: 14}}>{value.price}</small>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-8">
                                            <div className="row align-items-start">
                                                <div className="col">
                                                    <small style={{fontSize: 14}}>{value.name}</small>
                                                </div>
                                            </div>
                                            <div className="row align-items-end">
                                                <div className="col">
                                                    <small style={{
                                                        color: colorPicker(parseFloat(value.priceChange)),
                                                        fontWeight: "bold",
                                                        fontSize: 14
                                                    }}>{value.priceChange}</small>
                                                </div>
                                                <div className="col">
                                                    <small style={{
                                                        color: colorPicker(parseFloat(value.changePercentage)),
                                                        fontWeight: "bold",
                                                        fontSize: 14
                                                    }}>%{value.changePercentage}</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            <div className="col-md-8">
                <div className="row align-items-start">
                    <div id="chart">
                        <Chart options={options} series={series} type="candlestick" height={350}/>
                    </div>
                </div>
                <div className="container-fluid" style={{width:"850px"}}>
                    <div className="row align-items-start">
                        <div className="card">
                        <table>
                            <thead>
                            <tr>
                                <th style={{textAlign:"center"}}><img src={shop} width={35} height={35}/></th>
                                <th>DATE</th>
                                <th>CODE</th>
                                <th>PRICE</th>
                                <th>COUNT</th>
                                <th>BUY</th>
                                <th>SELL</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th  style={{textAlign:"center"}}>BUY AND SELL</th>
                                <th>{selectedStock.date && new Intl.DateTimeFormat("en-GB", {
                                    year: "numeric",
                                    month: "long",
                                    day: "2-digit"
                                }).format(selectedStock.date.toLocaleDateString)}</th>
                                <th>{selectedStock.code}</th>
                                <th>{selectedStock.price}</th>
                                <th><input className="small" type="number" min={0} onChange={onChangeCount}/> </th>
                                <th><button className="btn btn-success" onClick={onBuy}>BUY</button></th>
                                <th><button className="btn btn-danger" onClick={onSell}>SELL</button></th>

                            </tr>
                            </tbody>

                        </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}


export default BuyAndSell;
