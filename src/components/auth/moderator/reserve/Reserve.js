import React, { Component } from 'react';
import SchedulerOpenReserves from './SchedulerComponent/SchedulerOpenReserves'
import OpenReserveTableComp from './OpenReservesTable/OpenReserveTableComp'

export default class ReserveBoard extends Component {
    constructor(props) {
        super(props);
        this.saveOpenReserves = this.saveOpenReserves.bind(this);
        this.state = {
            component: "#reserves",
            allOpenReserves: undefined
        };
    }

    saveOpenReserves(reserves) {
        this.setState({
            allOpenReserves: reserves
        });
    }
    render() {
        return (
            <div className="center" id="reserve-content" >
                <h1 >Reserve</h1>
               <SchedulerOpenReserves saveOpenReserves={this.saveOpenReserves} />
               <OpenReserveTableComp/>
            </div>

        )
    }
}