import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';

//components
import Header from './layout/Header'
import Content from './layout/Content'
import Footer from './layout/Footer'



ReactDOM.render(
  // <React.StrictMode>
<React.Fragment>
    <Container>

      <Header />

      <Content >

      </Content>
      
      <Footer />

    </Container>


 
  </React.Fragment>,
  document.getElementById('root')
);
