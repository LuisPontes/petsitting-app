import React, { Component } from 'react';


import { Table, Dropdown, Button } from 'react-bootstrap';

import ApiUserService from "../../../services/api.user";

export default class TaxTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceTax: undefined,

        }
    }

    componentDidMount() {

        ApiUserService.getServiceTaxContent().then(
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

    getPaseoIndTax() {
        if (this.state.serviceTax) {
            let taxStr = "Individual        ";
            this.state.serviceTax.map((tax) => {
                if (tax.type === "Paseo_ind") {
                    taxStr = taxStr.concat(tax.hours + "H   -   " + tax.priceHour + "€ ")
                }
            })
            return taxStr;
        } return null;
    }
    getPaseoGroupTax() {
        if (this.state.serviceTax) {
            let taxStr = "Grupo        ";
            this.state.serviceTax.map((tax) => {
                if (tax.type === "Paseo_group") {
                    taxStr = taxStr.concat(tax.hours + "H   -   " + tax.priceHour + "€ ")
                }
            })
            return taxStr;
        } return null;
    }
    render() {

        const { serviceTax } = this.state;
        return (
            <div className="center maxSize"  >
                <h1 >Tarifas</h1>

                <Table bordered hover size="sm" responsive>

                    <tbody>
                        <tr >
                            <td>PASEO</td>
                        </tr>
                        <tr>
                            <td>{this.getPaseoIndTax()}</td>
                        </tr>
                        <tr >
                            <td>{this.getPaseoGroupTax()}</td>
                        </tr>

                    </tbody>
                </Table>

                <Table bordered hover size="sm" responsive>

                    <tbody>
                        <tr >
                            <td>ALOJAMIENTO</td>
                        </tr>

                        {
                            serviceTax && (
                                serviceTax.map((tax) =>

                                    tax.type === "aloj" ? (
                                        <tr> <td>Hasta 1 - {tax.hours}H    -    {tax.priceHour} € </td> </tr>
                                    )
                                    : tax.type === "aloj_extra" &&(
                                        <tr> <td>Extra {tax.hours}H    -    {tax.priceHour} € </td> </tr>
                                    )
                                ))
                        }

                    </tbody>
                </Table>
                <Table  bordered hover size="sm" responsive>

                    <tbody>
                       
                        <tr >
                            <td>GUARDARIA</td>
                        </tr>

                        {
                            serviceTax && (
                                serviceTax.map((tax) =>

                                    tax.type === "gua"? (
                                        <tr> <td>Hasta 1 - {tax.hours}H    -    {tax.priceHour} € </td> </tr>
                                    ):
                                    tax.type === "gua_extra" && (
                                        <tr> <td>Extra {tax.hours}H    -    {tax.priceHour} € </td> </tr>
                                    )
                                ))
                        }

                    </tbody>
                </Table>

            </div>

        )
    }
}