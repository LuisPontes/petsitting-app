import React, { Component } from 'react';

import TaxTableInfo from "./TaxTable"

export default class Home extends Component {
    render() {
        return (
            <div className="center maxSize"  >
                <h1>HOME</h1>
                <TaxTableInfo/>
            </div>

        )
    }
}


