import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';


export default class CardComp extends Component {
    constructor(props){
        super(props);
       console.log(props)
    }

   
    
    render() {
        return (
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src="//ssl.gstatic.com/accounts/ui/avatar_1x.png" />
                <Card.Body>
                    <Card.Title>{this.props.mypet.name}</Card.Title>
                    <Card.Text>
                    {this.props.mypet.des}
                    </Card.Text>
                    <Button variant="primary" onClick={this.props.createNewPet}  >{this.props.mypet.buttonName} </Button>
                </Card.Body>
            </Card>

        )
    }
}
