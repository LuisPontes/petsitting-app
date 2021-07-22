import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';

import AuthService from "../../../services/auth.service";
import ApiAdminService from "../../../services/api.admin";

export default class AdminBoard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usersContent: {
                count: 0,
                rows: [undefined]
            },
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
            <div className="center maxSize"  >
                <h1 >Admin board.</h1>

                <Table responsive style={{ minWidth: '100%' }}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Email</th>
                            <th>Subscribe Date </th>
                            <th>Last Change</th>
                            <th>Permission</th>
                            <th>Active</th>

                        </tr>
                    </thead>
                    <tbody>

                        {
                            usersContent.rows.map((obj) => (
                                obj !== undefined ?

                                    <tr>
                                        <td>{obj.id}</td>
                                        <td >{obj.username}</td>
                                        <td >{obj.email}</td>
                                        <td >{obj.createdAt}</td>
                                        <td >{obj.updatedAt}</td>


                                    </tr>
                                    //    console.log("OBJ",obj.id)
                                    : null
                            ))
                        }

                    </tbody>
                </Table>


            </div>

        )
    }
}