import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { Link } from "react-router-dom";


import { AiOutlineSchedule, AiOutlineHistory } from "react-icons/ai";
import { RiAccountCircleFill } from "react-icons/ri";
import { GiJumpingDog } from "react-icons/gi";

import ReportsBoard from './reports/ReportsBoard'
import ReserveBoard from './reserve/Reserve'
import HistoricBoard from './historic/Historic'

export default class ModeratorBoard extends Component {

    constructor(props) {
        super(props);
        this.changeComponent = this.changeComponent.bind(this);
      
        this.state = {
            component: "#reserves"
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

                <Navbar className=" " expand="lg" style={{ width: '75%', backgroundColor: '#99e699', margin: 'auto', fontSize: '120%' }}>
                    <Navbar.Brand >
                        <Link to={"#reserves"} onClick={this.changeComponent} className="navbar-brand">
                            <AiOutlineHistory /> Reserves
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav2" />
                    <Navbar.Collapse id="basic-navbar-nav2">

                        <Nav className="mr-auto">

                            <Link to={"#reports"} onClick={this.changeComponent} className="navbar-brand">
                                <GiJumpingDog /> Reports
                            </Link>



                            <Link to={"#historic"} onClick={this.changeComponent} className="navbar-brand">
                                <AiOutlineSchedule /> History
                                </Link>
                        </Nav>


                    </Navbar.Collapse>
                </Navbar>



                {
                    this.state.component === "#reserves" ?
                        <ReserveBoard />
                        : this.state.component === "#reports" ?
                            <ReportsBoard />
                            : this.state.component === "#historic" ?
                                <HistoricBoard />
                                : null

                }



            </div>
        )
    }
}