import React, { useState, useEffect } from "react";
import { Redirect, Switch, Route,BrowserRouter as Router, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import UserOperations from "./components/admin/UserOperations";
import EventBus from "./common/EventBus";
import StockOperations from "./components/admin/StockOperations";
import BuyAndSell from "./components/user/BuyAndSell";
import Portfolio from "./components/user/Portfolio";
import logoNav from "./icons/2x/baseline_paid_white_36dp.png"

const App = () => {
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setShowAdminBoard(false);
    setCurrentUser(undefined);
  };

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/"} className="navbar-brand">
          <img  alt={"/"} src={logoNav} />
          Stock Exchange
        </Link>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/home"} className="nav-link">
              Home
            </Link>
          </li>


          {showAdminBoard ? (
              <div className="navbar-nav mr-auto">
            <li className="nav-item">
            <Link to={"/users"} className="nav-link">
            Users
            </Link>
            </li>
            <li className="nav-item">
            <Link to={"/stocks"} className="nav-link">
            Stocks
            </Link>
            </li>
            </div>
          ):currentUser  &&
              <div className="navbar-nav mr-auto">

                <li className="nav-item">
                  <Link to={"/buyandsell"} className="nav-link">
                    Buy And Sell Stocks
                  </Link>
                </li>


            <li className="nav-item">
            <Link to={"/portfolio"} className="nav-link">
            Portfolio
            </Link>
            </li>

              </div>

          }

        </div>

        {currentUser ? (

          <div className="navbar-nav collapse navbar-collapse justify-content-end">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">
                {currentUser.username}
              </Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                LogOut
              </a>
            </li>
          </div>

        ) : (
            <div className="navbar-nav collapse navbar-collapse justify-content-end">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Sign Up
              </Link>
            </li>
          </div>
        )}
      </nav>
<div className="container-fluid">
        <Switch>
          <Switch>
          <Route exact path={["/", "/home"]} component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          {currentUser &&
              <Switch>
          <Route exact path="/profile" component={Profile} />
          {showAdminBoard ? <Switch>
              <Route path="/users" component={UserOperations} />
              <Route path="/stocks" component={StockOperations} />
          </Switch>
              :
              <Switch>
            <Route path="/buyandsell" component={BuyAndSell}/>
            <Route path="/portfolio" component={Portfolio}/>
          </Switch>
          }
              </Switch>
          }
          </Switch>
          <Redirect to="/home" />
        </Switch>
</div>
      {/* <AuthVerify logOut={logOut}/> */}
    </div>
  );
};

export default App;
