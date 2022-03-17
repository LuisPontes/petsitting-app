import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './userBoardStyle.css'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import MyPetBoard from './myPet/MyPetBoard';
import HistoricBoard from './historic/Historic';
import ReserveBoard from './reserve/Reserve';
import SettingsBoard from './account/Settings';

import { AiOutlineSchedule, AiOutlineHistory } from "react-icons/ai";
import { RiAccountCircleFill } from "react-icons/ri";
import { GiJumpingDog } from "react-icons/gi";



export default class Profile extends Component {

    constructor(props) {
        super(props);
        this.changeComponent = this.changeComponent.bind(this);
        this.saveAllMyPetsData = this.saveAllMyPetsData.bind(this);
        this.saveMyReserves = this.saveMyReserves.bind(this);

        this.state = {
            component: "#mypet",
            allMyPetsData: {
                count: 0,
                rows: [undefined]
            },
            allReserves: undefined
        };
    }

    componentDidMount() {

    }


    changeComponent(e) {
        console.log("changeComponent : ", e.target.hash);
        this.setState({
            component: e.target.hash
        });
    }
    saveAllMyPetsData(allPets) {
        this.setState({
            allMyPetsData: allPets
        });
    }
    saveMyReserves(reserves) {
        this.setState({
            allReserves: reserves
        });
    }
    render() {
        return (
            <div className=" maxSize">

                <Navbar className=" " expand="lg" style={{ width: '75%', backgroundColor: '#99e699', margin: 'auto', fontSize: '120%' }}>
                    <Navbar.Brand >
                        <Link to={"#mypet"} onClick={this.changeComponent} className="navbar-brand">
                            <GiJumpingDog /> Profile
                    </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav2" />
                    <Navbar.Collapse id="basic-navbar-nav2">

                        <Nav className="mr-auto">
                            <Link to={"#reserve"} onClick={this.changeComponent} className="nav-link">
                                <AiOutlineSchedule /> Reserves
                            </Link>

                            <Link to={"#history"} onClick={this.changeComponent} className="nav-link">
                                <AiOutlineHistory /> History
                                </Link>
                        </Nav>
                        <Nav className="ml-auto">
                            <Link to={"#settings"} onClick={this.changeComponent} className="nav-link">
                                <RiAccountCircleFill /> Account
                            </Link>
                        </Nav>

                    </Navbar.Collapse>
                </Navbar>

                {
                    this.state.component === "#mypet" ?
                        <MyPetBoard saveAllMyPetsData={this.saveAllMyPetsData} allMyPetsData={this.state.allMyPetsData} />
                        : this.state.component === "#reserve" ?
                            <ReserveBoard saveMyReserves={this.saveMyReserves} allMyPetsData={this.state.allMyPetsData} />
                            : this.state.component === "#history" ?
                                <HistoricBoard />
                                : this.state.component === "#settings" ?
                                    <SettingsBoard />
                                    : null
                }



            </div>

        )
    }
}


