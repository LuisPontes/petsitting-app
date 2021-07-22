import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import AuthService from "../../services/auth.service";

import { BiLogIn,BiLogOut } from "react-icons/bi";

import {MdPets}  from "react-icons/md"; 

import { GiDogHouse, GiJumpingDog} from "react-icons/gi";

export default class Menu extends Component {

    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);
        this.getMenuUser = this.getMenuUser.bind(this);
        this.getMenu = this.getMenu.bind(this);
        this.getMenuAdmin = this.getMenuAdmin.bind(this);
        this.getMenuMod = this.getMenuMod.bind(this);

        this.state = {
            showModeratorBoard: false,
            showAdminBoard: false,
            currentUser: undefined,
        };
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();

        if (user) {
            this.setState({
                currentUser: user,
                showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
                showAdminBoard: user.roles.includes("ROLE_ADMIN"),
            });
        }
    }

    logOut() {
        AuthService.logout();
        window.location.href = '/';
    }

    getMenuMod() {
        return <Nav className="mr-auto">
            <Nav.Link href="mod"  >Petsiter</Nav.Link>
        </Nav >
    }
    getMenuAdmin() {
        return <Nav className="mr-auto">
            <Nav.Link href="admin"  >Administrater</Nav.Link>
        </Nav >
    }
    getMenuUser() {
        return <Nav className="mr-auto">
            < Nav.Link href="/profile"><GiJumpingDog/>Profile</Nav.Link>
        </Nav>
    }

    getMenu() {
        return <Nav className="mr-auto">
            <Nav.Link href="about"><GiDogHouse/>About us</Nav.Link>
        </Nav>

    }
    render() {
        const { currentUser, showModeratorBoard, showAdminBoard } = this.state;

        return (


            <Navbar className=" maxSize" fixed="top" expand="lg" style={{ backgroundColor: '#70db70' }}>
                <Navbar.Brand href="/home"><MdPets/> COLAS FELICES <MdPets/></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" >

                    {currentUser ? (
                        < Nav className="mr-auto">
                            {this.getMenu()}
                            {this.getMenuUser()}
                            {showModeratorBoard && (
                                this.getMenuMod()
                            )}
                            {showAdminBoard && (
                                this.getMenuMod()
                            )}
                            {showAdminBoard && (
                                this.getMenuAdmin()
                            )}

                        </Nav>
                    ) : (
                            <Nav className="mr-auto">

                                {this.getMenu()}

                            </Nav>
                        )}

                    {currentUser ? (
                        <Nav.Link href="logout" onClick={this.logOut} className="ml-auto" >
                            <BiLogOut/>Logout <b>[{currentUser.username}]</b>
                        </Nav.Link>

                    ) : (
                            <Nav className="ml-auto">
                                <Nav.Link href="login" ><BiLogIn/>Login</Nav.Link>
                            </Nav>
                        )}
                </Navbar.Collapse>


            </Navbar >

        )
    }
}


