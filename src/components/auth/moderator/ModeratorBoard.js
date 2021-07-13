import React, { Component } from 'react';
import { Link } from "react-router-dom";

import PetSiterBoard from './petsiter/PetSiterComponent'
import ReserveBoard from './reserve/Reserve'
import HistoricBoard from './historic/Historic'

export default class ModeratorBoard extends Component {

    constructor(props) {
        super(props);
        this.changeComponent = this.changeComponent.bind(this);

        this.state = {
            component: "#petsiter"
        };
    }

    changeComponent(e) {
        console.log("changeComponent : ", e.target.hash);
        this.setState({
            component: e.target.hash
        });
    }
    render() {
        return (

            <div className="center maxSize">
                <nav className=" center navbar navbar-expand-lg navbar-light bg-light" style={{ width: '75%' }}>
                    <Link to={"#petsiter"} onClick={this.changeComponent} className="navbar-brand">
                        PetSiter
                    </Link>
                    <div className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to={"#reserve"} onClick={this.changeComponent} className="nav-link">
                                Reserves
                        </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={"#historic"} onClick={this.changeComponent} className="nav-link">
                                Historic
                        </Link>
                        </li>
                        
                    </div>
                </nav>

                {
                    this.state.component === "#petsiter" ?
                        <PetSiterBoard />
                        : this.state.component === "#reserve" ?
                            <ReserveBoard />
                            : this.state.component === "#historic" ?
                                <HistoricBoard />
                                :null
                               
                }



            </div>
        )
    }
}