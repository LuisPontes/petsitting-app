import React, { Component } from 'react'
import Menu from './Menu';

export default class Header extends Component {
  render() {
    return (
      <div>
        {/* <Row md={4}>
          <h1 className="center" style={{minWidth:'100%',margin:'2%'}}>COLAS FELICES</h1>
        </Row> */}
        {/* <Row md={4}> */}
          <Menu />
        {/* </Row> */}
      </div>


    )
  }
}