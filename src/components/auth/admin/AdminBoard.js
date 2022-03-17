import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { Link } from "react-router-dom";


import { AiOutlineSchedule, AiOutlineHistory } from "react-icons/ai";
import { RiAccountCircleFill } from "react-icons/ri";
import { GiJumpingDog } from "react-icons/gi";


//COmponents
import ReportBoard from './reports/ReportBoard';
import BusinessBoard from './business/BusinessBoard';
import PermissionsBoard from './permissions/PermissionsBoard';



export default class AdminBoard extends Component {

    constructor(props) {
        super(props);
        this.changeComponent = this.changeComponent.bind(this);
        this.state = {
            component: "#permissions",
        }
    }

    changeComponent(e) {
        console.log("changeComponent : ", e.target.hash);
        this.setState({
            component: e.target.hash
        });
    }



    render() {



        return (


            <div className=" maxSize">

                <Navbar className=" " expand="lg" style={{ width: '75%', backgroundColor: '#99e699', margin: 'auto', fontSize: '120%' }}>
                    <Navbar.Brand >
                        <Link to={"#reports"} onClick={this.changeComponent} className="navbar-brand">
                            <GiJumpingDog /> Reports
                            </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav2" />
                    <Navbar.Collapse id="basic-navbar-nav2">

                        <Nav className="mr-auto">

                            <Link to={"#business"} onClick={this.changeComponent} className="nav-link">
                                <AiOutlineHistory /> Business
                                </Link>

                            <Link to={"#permissions"} onClick={this.changeComponent} className="nav-link">
                                <AiOutlineSchedule /> Permissions
                                </Link>
                        </Nav>


                    </Navbar.Collapse>
                </Navbar>

                {
                    this.state.component === "#reports" ?
                        <ReportBoard />
                        : this.state.component === "#business" ?
                            <BusinessBoard />
                            : this.state.component === "#permissions" ?
                                <PermissionsBoard />

                                : null
                }



            </div>



        )
    }
}