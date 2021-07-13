import React, { Component } from 'react'
// import Row from 'react-bootstrap/Row';

import "./Footer.css"

export default class Footer extends Component {
  render() {
    return (

      <footer className="fixed-bottom site-footer ">


        <p>
          Site developed by LuisPontes &copy;{" "}
          {new Date().getFullYear().toString()}{" "}
        </p>

      </footer>

    )
  }
}
