import React, { Component } from 'react';
import { Link } from "react-router-dom";

import MyPerBoard from '../auth/user/MyPetBoard';
import HistoricBoard from '../auth/user/Historic';
import ReserveBoard from '../auth/user/Reserve';
import SettingsBoard from '../auth/user/Settings';



export default class Profile extends Component {

    constructor(props) {
        super(props);
        this.changeComponent = this.changeComponent.bind(this);

        this.state = {
            component: "#mypet"
        };
    }

    changeComponent(e) {
        console.log("changeComponent : ",e.target.hash);
        this.setState({
            component: e.target.hash
        });
    }
    render() {
        return (
            <div className="center maxSize">

            {/* {localStorage.getItem("user")}  */}
                <nav className=" navbar navbar-expand-lg navbar-light bg-light">
                    <Link to={"#mypet"} onClick={this.changeComponent} className="navbar-brand">
                        My pet(s)!
                    </Link>
                    <div className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to={"#reserve"} onClick={this.changeComponent} className="nav-link">
                                Reverses
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={"#historic"} onClick={this.changeComponent} className="nav-link">
                                Historic
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={"#settings"} onClick={this.changeComponent} className="nav-link">
                                Account
                            </Link>
                        </li>
                    </div>
                </nav>

{
    this.state.component === "#mypet" ?
    <MyPerBoard />
    : this.state.component === "#reserve" ?
    <ReserveBoard />
    : this.state.component === "#historic" ?
    <HistoricBoard />
    : this.state.component === "#settings" ?
    <SettingsBoard />
    : null 
}
               


            </div>

        )
    }
}


