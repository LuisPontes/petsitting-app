import React, { Component } from 'react';

export default class SettingsBoard extends Component {
    render() {
        return (
            <div className="center"  >

                <h1 >Settings</h1>
                { localStorage.getItem("user")} 
            </div> 

        )
    }
}