import React, { Component } from 'react';
import SchedulerBasic from './SchedulerComponent/SchedulerBasic'

export default class ReserveBoard extends Component {
    render() {
        const { allMyPetsData } = this.props;
       
        return (
            <div className="center"  >
                <h1 >Reserve</h1>
               <SchedulerBasic allMyPetsData={allMyPetsData} saveMyReserves={this.props.saveMyReserves} />
            </div>

        )
    }
}