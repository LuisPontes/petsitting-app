import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import AuthService from "../services/auth.service";

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
            < Nav.Link href="/profile">Profile</Nav.Link>
        </Nav>
    }

    getMenu() {
        return <Nav className="mr-auto">
            <Nav.Link href="about">About us</Nav.Link>
        </Nav>

    }
    render() {
        const { currentUser, showModeratorBoard, showAdminBoard } = this.state;
        return (


            <Navbar className="center maxSize" bg="light" expand="lg">
                <Navbar.Brand href="/home">HOME</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">


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

                            <Nav.Link href="logout" onClick={this.logOut} >Logout</Nav.Link>

                        </Nav>



                    ) : (

                            < Nav className="mr-auto">
                                {this.getMenu()}

                                <Nav.Link href="login" >Login</Nav.Link>

                            </Nav>
                        )}

                </Navbar.Collapse>
            </Navbar >

        )
    }
}


