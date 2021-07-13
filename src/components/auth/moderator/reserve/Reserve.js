import React, { Component } from 'react';
import SchedulerBasic from './SchedulerComponent/SchedulerBasic'

export default class ReserveBoard extends Component {
    render() {
        return (
            <div className="center" id="reserve-content" >
                <h1 >Reserve</h1>
               <SchedulerBasic/>
            </div>

        )
    }
}