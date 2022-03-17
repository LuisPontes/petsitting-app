import React, { Component } from 'react';
import { Table, Dropdown, Button } from 'react-bootstrap';

export default class OpenReserveTableComp extends Component {
    render() {
        return (
            <div className="center"  >
                <h1 >Open Reserve Table </h1>

                <Table striped bordered hover size="sm" responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Owner</th>
                            <th>Pet</th>
                            <th>Check-In</th>
                            <th>Check-Out</th>
                            <th>Check-In</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td colSpan="2">Larry the Bird</td>
                            <td>@twitter</td>
                        </tr>
                    </tbody>
                </Table>

            </div>

        )
    }
}