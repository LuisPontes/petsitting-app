import React, { Component } from 'react';


import { Table, Dropdown, Button } from 'react-bootstrap';

import AuthService from "../../../../services/auth.service";
import ApiAdminService from "../../../../services/api.admin";

export default class BusinessBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceTax: undefined,

        }
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();
        if (user) {
            this.setState({
                currentUser: user
            });

            ApiAdminService.getServiceTaxContent().then(
                response => {
                    console.log("ServiceTax response.data ", response.data)

                    this.setState({
                        serviceTax: response.data
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

        const { serviceTax } = this.state;
        return (
            <div className="center"  >
                <h1 >Business Board </h1>

                <Table bordered hover size="sm" responsive>
                    <thead>
                        <tr>
                            <th>  </th>

                            {
                                serviceTax && (
                                    serviceTax.map((tax) =>
                                        tax.type === "Paseo_ind" && (
                                            <th> {tax.hours} Hora </th>
                                        )
                                    )

                                )
                            }
                           
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Paseo Individual</td>
                            {
                                serviceTax && (
                                    serviceTax.map((tax) =>
                                        tax.type === "Paseo_ind" && (
                                            <td>
                                                <input
                                                    type="text"
                                                    value={tax.priceHour}
                                                />
                                        €
                                            </td>


                                        )
                                    )

                                )
                            }

                        </tr>
                        <tr>
                            <td>Paseo Grupo</td>
                            {
                                serviceTax && (
                                    serviceTax.map((tax) =>
                                        tax.type === "Paseo_group" && (
                                            <td>
                                                <input
                                                    type="text"
                                                    value={tax.priceHour}
                                                />€
                                            </td>)
                                    )

                                )
                            }
                        </tr>

                        <tr>
                            <Button>Save</Button>
                        </tr>
                    </tbody>
                </Table>

                <Table striped bordered hover size="sm" responsive>
                    <thead>
                        <tr>
                            <th>  </th>
                            {
                            serviceTax && (
                                serviceTax.map((tax) =>

                                    tax.type === "aloj" ? (
                                        <th>1 - {tax.hours} Hora(s) </th> 
                                        
                                    )
                                    : tax.type === "aloj_extra" &&(
                                        <th>1 - {tax.hours} Hora(s) </th> 
                                    )
                                ))
                        }
                        </tr>

                       

                    </thead>
                    <tbody>
                        <tr>
                            <td>Alojamiento</td>
                            <td>alo_tax_1</td>
                            <td>alo_tax_2</td>
                            <td>alo_tax_extra</td>
                        </tr>

                    </tbody>
                </Table>
                <Table striped bordered hover size="sm" responsive>
                    <thead>
                        <tr>
                            <th>  </th>
                            <th>1-24 Hora(s)</th>
                            <th> 1 Hora extra</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Guardiria</td>
                            <td>gua_tax_1</td>
                            <td>gua_tax_extra</td>
                        </tr>

                    </tbody>
                </Table>

            </div>

        )
    }
}