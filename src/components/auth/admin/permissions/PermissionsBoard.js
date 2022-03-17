import React, { Component } from 'react';

import { Table, Dropdown, Button } from 'react-bootstrap';

import AuthService from "../../../../services/auth.service";
import ApiAdminService from "../../../../services/api.admin";


import { PermissionsOptions } from '../../../../Constants'



export default class PermissionsBoard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usersContent: {
                count: 0,
                rows: [undefined]
            },
            toSave: false
        }
    }


    componentDidMount() {
        const user = AuthService.getCurrentUser();
        if (user) {
            this.setState({
                currentUser: user
            });

            ApiAdminService.getUsersContent().then(
                response => {
                    console.log("response.data ", response.data)

                    this.setState({
                        usersContent: response.data
                    });
                },
                error => {
                    if (error.response) {
                        // Request made and server responded
                        console.log(error.response);
                        // console.log(error.response.status);
                        // console.log(error.response.headers);
                        if (error.response.status === 401 || error.response.status === 403) {
                            AuthService.logout();
                        }
                    } else if (error.request) {
                        // The request was made but no response was received
                        console.log(error.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', error.message);
                    }

                }
            );
        }
    }


    render() {

        const { usersContent } = this.state;

        return (
            <div className="center"  >
                <h1 >Permissions</h1>
                <Table responsive style={{ minWidth: '100%' }}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Email</th>
                            <th>Subscribe Date </th>
                            <th>Last Change</th>
                            <th>Permission</th>
                            <th></th>

                        </tr>
                    </thead>
                    <tbody>

                        {
                            usersContent.rows.map((obj) => (

                                obj !== undefined ?

                                    obj.user !== undefined ?

                                        <tr>
                                            <td>{obj.user.id}</td>
                                            <td >{obj.user.username}</td>
                                            <td >{obj.user.email}</td>
                                            <td >{obj.user.createdAt}</td>
                                            <td >{obj.user.updatedAt}</td>
                                            <td>
                                                <Dropdown className="center" >
                                                    <Dropdown.Toggle style={{ width: '75%' }} variant="success" id="dropdown-basic">
                                                        {obj.roleId !== undefined ? Object.keys(PermissionsOptions)[obj.roleId] : Object.keys(PermissionsOptions)[0]}
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        {
                                                            Object.keys(PermissionsOptions).map((P) => <Dropdown.Item onClick={() => this.setState({ toSave: true })} > {P}</Dropdown.Item>)
                                                        }

                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                            <td key={obj.user.id}>

                                                <Button enable={!this.state.toSave}>Save</Button></td>
                                        </tr>
                                        //    console.log("OBJ",obj.id)
                                        : null
                                    : null
                            ))
                        }

                    </tbody>
                </Table>


                </div>
        )
    }
}