import React, { Component } from 'react';

import AddPetModel from './AddPetModal';
import CardPet from './CardComp';
import './MyPetBoard.css';

import AuthService from "../../../../services/auth.service";
import ApiUserService from "../../../../services/api.user";



export default class MyPetBoard extends Component {

    constructor(props) {
        super(props);
        this.openAddPetModal = this.openAddPetModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.deletePetModal = this.deletePetModal.bind(this);
        this.addPetModal = this.addPetModal.bind(this);
        this.showEditPet = this.showEditPet.bind(this);

        this.state = {
            currentUser: undefined,
            myPetContent: {
                count: 0,
                rows: [undefined]
            },
            mypet: {
                name: "Add your pet",
                des: "Click where ...",
                type: "apdpet"
            },
           
            modal: {
                title: 'My Pet!',
                show: false,
                showEditPet: { undefined }
            },
        };

    }


    componentDidMount() {
        const user = AuthService.getCurrentUser();
        if (user) {

            this.setState({
                currentUser: user,

            });

            ApiUserService.getMyPets().then(
                response => {
                    console.log("response.data ", response.data)
                    this.props.saveAllMyPetsData(response.data);
                    this.setState({
                        myPetContent: response.data
                    });
                },
                error => {
                    if (error.response) {
                        // Request made and server responded
                        console.log(error.response);
                        // console.log(error.response.status);
                        // console.log(error.response.headers);
                        if(error.response.status === 401){
                            AuthService.logout();
                        }
                      } else if (error.request) {
                        // The request was made but no response was received
                        console.log(error.request);
                      } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', error.message);
                      }
                  
                }
            ) ;
        }
    }


    closeModal() {
        this.setState(prevState => {
            let modal = Object.assign({}, prevState.modal);  // creating copy of state variable jasper
            modal.show = false;                     // update the name property, assign a new value                 
            return { modal };                                 // return new object jasper object
        })
    }

    openAddPetModal() {
        this.setState(prevState => {
            let modal = Object.assign({}, prevState.modal);  // creating copy of state variable jasper
            modal.show = true;
            modal.showEditPet = undefined;                  // update the name property, assign a new value                 
            return { modal };                                 // return new object jasper object
        })
    }

    addPetModal(allPetContent) {
        this.setState({
            myPetContent: allPetContent
        });
        window.location.reload(false);
    }
    deletePetModal(pet) {

        // console.log("delete:", pet);
        if (window.confirm(`Do you want to delete this Pet? {Name: ${pet.name}, Breed: ${pet.breed}}`)) {

            ApiUserService.deletePet(pet.id).then(
                response => {
                    console.log("response.data ", response.data)
                    this.setState({
                        myPetContent: response.data
                    });
                    window.location.reload(false);
                },
                error => {
                    this.setState({
                        content:
                            (error.response &&
                                error.response.data &&
                                error.response.data.message) ||
                            error.message ||
                            error.toString()
                    });
                }
            );
        }
    }

    showEditPet(mypet) {

        this.setState(prevState => ({
            modal: {
                ...prevState.modal,
                show: true,
                showEditPet: {
                    id: mypet.id,
                    owner: mypet.owner,
                    name: mypet.name,
                    age: mypet.age,
                    photo: mypet.photo,
                    breed: mypet.breed
                }
            }
        }))


    }
    componentWillUnmount() {
        this.props.saveAllMyPetsData(this.state.myPetContent)
    }

    render() {
        const { allMyPetsData } = this.props;
        return (
            <div className=" center">

                <AddPetModel
                    title={this.state.modal.title}
                    show={this.state.modal.show}
                    onClose={this.closeModal}
                    mypet={this.state.modal.showEditPet}
                    addPetModal={this.addPetModal}
                    deletePetModal={this.deletePetModal}
                />

                <div className=" card card-container container-myPets cardsPetsContainer" >

                    {(allMyPetsData && allMyPetsData.count > 0) ? (

                        allMyPetsData.rows.map((objt) =>

                            <CardPet mypet={objt} openAddPetModal={this.openAddPetModal} showEditPet={this.showEditPet} deletePetModal={this.deletePetModal} />
                        )
                    ) : null
                    }
                    <CardPet mypet={this.state.mypet} openAddPetModal={this.openAddPetModal} deletePetModal={this.deletePetModal} />


                </div>



            </div >


        )
    }
}


