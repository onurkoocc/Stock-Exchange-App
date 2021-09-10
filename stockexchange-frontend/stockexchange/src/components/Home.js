import React, { useState, useEffect } from "react";
import StockService from "../services/stock.service";
import NewsService from "../services/news.service";
import Chart from "react-apexcharts";
import {Nav} from "react-bootstrap";
import Carousel from 'react-bootstrap/Carousel'

const Home = () => {
    const [stockCodes,setStockCodes] = useState({codes:["GSAT","AAPL","AMC","T","EDU","F","NIO","CHPT","BAC","AMD"]});
    const [indexCodes,setIndexCodes] = useState({codes:["^GSPC","^DJI","^IXIC","^RUT","CL=F","GC=F","SI=F","EURUSD=X","^TNX","^VIX","GBPUSD=X","JPY=X"]});
    const [cryptoCodes,setCryptoCodes] = useState({codes:["BTC-USD","ETH-USD","ADA-USD","BNB-USD","XRP-USD","HEX-USD","SOL1-USD","DOT1-USD","UNI3-USD","LINK-USD","TRX-USD","MATIC-USD"]});
    const [stockDetails, setStockDetails] = useState([]);
    const [indexDetails, setIndexDetails] = useState( []);
    const [cryptoDetails, setCryptoDetails] = useState([]);
    const [indexSelected,setIndexSelected] = useState(false);
    const [stockSelected,setStockSelected] = useState(false);
    const [cryptoSelected,setCryptoSelected] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(undefined);
    const [loadFailure, setLoadFailure] = useState(false);
    const [news,setNews] = useState([]);

    const [pendingApiCall,setPendingApiCall] = useState(false);

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
                    borderColor: '#00E396',
                    label: {
                        borderColor: '#00E396',
                        style: {
                            fontSize: '12px',
                            color: '#fff',
                            background: '#00E396'
                        },
                        orientation: 'horizontal',
                        offsetY: 7,
                        text: 'Annotation Test'
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
                offsetX: 10
            }
        },
        yaxis: {
            tooltip: {
                enabled: true
            }
        }
    });

    useEffect(async ()  => {
        setLoadFailure(false);
            try {
                const data = await StockService.getAssetsDetails(stockCodes.codes);
                setStockDetails(data);
            } catch (error) {
                setLoadFailure(true);
            }
        try {
            const data = await StockService.getAssetsDetails(indexCodes.codes);
            setIndexDetails(data);
        } catch (error) {
            setLoadFailure(true);
        }
        try {
            const data = await StockService.getAssetsDetails(cryptoCodes.codes);
            setCryptoDetails(data);
        } catch (error) {
            setLoadFailure(true);
        }

        try {
            const thisdata = await NewsService.getDailyNews();
            console.log(thisdata);
            for (let i=0;i<thisdata.articles.length-1;i++){
                await setNews(news =>[...news,{
                    author: thisdata.articles[i].author,
                    content: thisdata.articles[i].content,
                    description: thisdata.articles[i].description,
                    publishedAt:thisdata.articles[i].publishedAt,
                    source:{id:thisdata.articles[i].source.id,name:thisdata.articles[i].source.name},
                    title:thisdata.articles[i].title,
                    url:thisdata.articles[i].url,
                    urlToImage:thisdata.articles[i].urlToImage
                }])

            }

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

    const onClickHistoricalData = async (code) =>{
        await setSeries(initialState);
        await setSelectedIndex(code);
        getHistoricalData(code);
    }

    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }


  return (
    <div className="card w-125 bg-light border-primary mb-3">
        <div className="row no-gutters">
            <div className="col-md-4" style={{content:{position:"center"}}}>
                <Nav variant="pills"  className="justify-content-center" defaultActiveKey="crypto"  >
                    <Nav.Item>
                        <Nav.Link eventKey="crypto" onSelect={() => {setIndexSelected(false); setStockSelected(false);setCryptoSelected(true);}}>Crypto</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="Index" onSelect={() => {setIndexSelected(true); setStockSelected(false); setCryptoSelected(false);}}>Index</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="stock" onSelect={() => {setIndexSelected(false); setStockSelected(true);setCryptoSelected(false);}}>Stock</Nav.Link>
                    </Nav.Item>
                </Nav>
                {stockSelected &&
                <div className="list-group">
                    {stockDetails.map((value, index) => (
                        <button className="btn btn-outline-primary btn-lg btn-block btn-lg" disabled={pendingApiCall} role="button" aria-pressed="true" onClick={(preventDefault) =>onClickHistoricalData(value.code)}>

                            <div className="container">
                                <div className="row">
                                    <div className="col-4" style={{fontWeight: "bold" ,fontSize:12}}>
                                        <div className="row align-items-start">
                                            <div className="col">
                                                {pendingApiCall && (<span className="spinner-border spinner-border-sm"></span>)}
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
                                                <small style={{fontSize:14}}>{value.price}</small>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-8">
                                        <div className="row align-items-start">
                                            <div className="col">
                                                <small style={{fontSize:14}}>{value.name}</small>
                                            </div>
                                        </div>
                                        <div className="row align-items-end">
                                            <div className="col">
                                                <small style={{color:colorPicker(parseFloat(value.priceChange)),fontWeight: "bold" ,fontSize:14}}>{value.priceChange}</small>
                                            </div>
                                            <div className="col">
                                                <small style={{color:colorPicker(parseFloat(value.changePercentage)),fontWeight: "bold" ,fontSize:14}}>%{value.changePercentage}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
                    }

                {indexSelected &&
                <div className="list-group">
                    {indexDetails.map((value, index) => (

                        <button className="btn btn-outline-primary btn-lg btn-block btn-lg"
                                disabled={pendingApiCall} role="button"
                                onClick={(preventDefault) =>onClickHistoricalData(value.code)}>
                            <div className="container">
                                <div className="row">
                                    <div className="col-4" style={{fontWeight: "bold" ,fontSize:12}}>
                                        <div className="row align-items-start">
                                            <div className="col">
                                                {pendingApiCall && (<span className="spinner-border spinner-border-sm"></span>)}
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
                                                <small style={{fontSize:14}}>{value.price}</small>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-8">
                                        <div className="row align-items-start">
                                            <div className="col">
                                                <small style={{fontSize:14}}>{value.name}</small>
                                            </div>
                                        </div>
                                        <div className="row align-items-end">
                                            <div className="col">
                                                <small style={{color:colorPicker(parseFloat(value.priceChange)),fontWeight: "bold" ,fontSize:14}}>{value.priceChange}</small>
                                            </div>
                                            <div className="col">
                                                <small style={{color:colorPicker(parseFloat(value.changePercentage)),fontWeight: "bold" ,fontSize:14}}>%{value.changePercentage}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
                }

                {cryptoSelected &&
                <div className="list-group">
                    {cryptoDetails.map((value, index) => (

                        <button className="btn btn-outline-primary btn-lg btn-block btn-lg" disabled={pendingApiCall} role="button" aria-pressed="true" onClick={(preventDefault) =>onClickHistoricalData(value.code)}>

                            <div className="container">
                                <div className="row">
                                    <div className="col-4" style={{fontWeight: "bold" ,fontSize:12}}>
                                        <div className="row align-items-start">
                                            <div className="col">
                                        {pendingApiCall && (<span className="spinner-border spinner-border-sm"></span>)}
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
                                                <small style={{fontSize:14}}>{value.price}</small>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-8">
                                        <div className="row align-items-start">
                                            <div className="col">
                                                <small style={{fontSize:14}}>{value.name}</small>
                                            </div>
                                        </div>
                                        <div className="row align-items-end">
                                            <div className="col">
                                                <small style={{color:colorPicker(parseFloat(value.priceChange)),fontWeight: "bold" ,fontSize:14}}>{value.priceChange}</small>
                                            </div>
                                            <div className="col">
                                                <small style={{color:colorPicker(parseFloat(value.changePercentage)),fontWeight: "bold" ,fontSize:14}}>%{value.changePercentage}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
                }
            </div>
            <div className="col-md-8">
                <div className="card-body">
                    <div id="chart">
                        <Chart options={options} series={series} type="candlestick" height={350} />
                    </div>

                    <div className="text-center">
                    <button className="btn btn-outline-dark btn-lg btn-block btn-lg" style={{width:"775px"}} role="button" aria-pressed="true" >
                    <p style={{
                            fontStyle: 'italic',
                            fontSize:30,
                        }}>NEWS</p>
                    </button>
                    </div>
                        <div className="card-body">
                    {news.length > 0 &&
                    <Carousel variant="dark" wrap={true} interval={7000}>
                        {news.map((value, index) => (
                        <Carousel.Item>
                            <img
                                className="d-block w-10"
                                src={value.urlToImage}
                                alt={index+"slide"}
                                style={{height:"400px",width:"800px"}}
                            />
                            <Carousel.Caption style={{backgroundColor: 'rgba(52, 52, 52, 0.8)'}}>

                                <h6 style={{color:"white"}}>{value.title}</h6>
                                <h3 style={{color:"white"}}>{value.content}</h3>
                                <a className="btn btn-light" onClick={() => openInNewTab(value.url)}>Read More</a>
                                <div className="text-right">
                                <h7 style={{color:"white"}}>Author: {value.author}</h7>
                                <br/>
                                <h7 style={{color:"white"}}>Publish Date: {value.publishedAt}</h7>
                                </div>
                            </Carousel.Caption>
                        </Carousel.Item>
                        ))}

                    </Carousel>
                    }
                        </div>

                </div>
            </div>
        </div>
    </div>

  );
};

export default Home;
