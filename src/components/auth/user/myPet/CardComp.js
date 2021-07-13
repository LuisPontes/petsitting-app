import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import { BiPlusCircle, BiEraser, BiShow } from "react-icons/bi";


export default class CardComp extends Component {

//     <img
//     src={mypet ? mypet.photo : this.state.file}
//     alt="profile-img"
//     className="profile-img-card"
//     style={{ width: '25%', height: '15%' }}
//     roundedCircle
// />

    render() {
        // console.log(this.props);
        return (
            <Card className="cardPet"  >
                {
                    this.props.mypet.type ?
                        <Card.Img variant="top" src="//ssl.gstatic.com/accounts/ui/avatar_1x.png" />
                        :
                        this.props.mypet.photo ?
                            <Card.Img variant="top" src={this.props.mypet.photo} />
                            :
                            <Card.Img variant="top" src="//ssl.gstatic.com/accounts/ui/avatar_1x.png" />
                }

                <Card.Body>
                    <Card.Title>{this.props.mypet.name}</Card.Title>
                    {
                        this.props.mypet.type ?
                            null
                            : 
                            <Card.Text>
                                BitehDay: {this.props.mypet.age}
                            </Card.Text>
                    }
                    {
                        this.props.mypet.type ?
                            <Button variant="primary" onClick={this.props.openAddPetModal} style={{ margin: '5%' }} ><BiPlusCircle />  </Button>
                            :
                            <div>
                                <Button variant="primary" onClick={() => this.props.showEditPet(this.props.mypet)}  ><BiShow />  </Button>
                                <Button variant="danger" onClick={() => this.props.deletePetModal(this.props.mypet)}  ><BiEraser />  </Button>
                            </div>
                    }

                </Card.Body>
            </Card>

        )
    }
}
