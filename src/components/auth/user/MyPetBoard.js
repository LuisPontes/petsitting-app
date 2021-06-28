import React, { Component } from 'react';

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import CardPet from './CardComp';

import AuthService from "../../../services/auth.service";
import ApiUserService from "../../../services/api.user";


const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

export default class MyPerBoard extends Component {

    constructor(props) {
        super(props);
        this.createNewPet = this.createNewPet.bind(this);
        this.handleNewPet = this.handleNewPet.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.handleDateSelect = this.handleDateSelect.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.onChangeBreed = this.onChangeBreed.bind(this);
        this.onChangePatholoy = this.onChangePatholoy.bind(this);
        this.onChangeTypePathology = this.onChangeTypePathology.bind(this);
        this.onChangeMedication = this.onChangeMedication.bind(this);
        this.onChangeTypeMedication = this.onChangeTypeMedication.bind(this);

        this.state = {
            currentUser: undefined,
            mypet: {
                name: "Add your pet",
                des: "Click where ...",
                buttonName: "+"
            },
            newPet: {
                name: undefined,
                age: new Date(),
                breed: undefined,
                health: {
                    pathology: undefined,
                    typePathology: undefined,
                    medication: undefined,
                    castrated: undefined
                },
                habits: {
                    feedingTime: undefined,
                    typeFood: undefined,
                    amountFood: undefined,
                    hoursActivity: undefined
                },
                socialization: {
                    dog: undefined,
                    femaleDog: undefined,
                    cat: undefined,
                    kids: undefined
                },
                ride: {
                    pullOnTheLeash: undefined,
                    anxiety: undefined,
                    urbanEnvironment: undefined,
                    greenSpace: undefined,
                    dogSpace: undefined,
                    problemsWithObjects: undefined,
                    WalkInGroup: undefined
                },
                atHome: {
                    canBeAlone: undefined,
                    howManyHours: undefined,
                    itQuiet: undefined,
                    separationAnxiety: undefined,
                    sleeps: undefined,
                }
            },
            addNewPet: undefined

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
                    this.setState({
                        myPetContent: response.data
                    });
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

    createNewPet() {
        //create form to add pet
        this.setState({
            addNewPet: true
        });
    }




    handleNewPet(e) {
        e.preventDefault();

        this.setState({
            message: "",
            loading: true,
            myPetContent: this.state.mypet
        });

        this.form.validateAll();



    }

    onChangeName(e) {
        this.setState({
            newPet: {
                name: e.target.value
            }
        });
    }

    handleDateSelect = (date) => {
        console.log("handleDateSelect data: ", date)
        this.setState({
            newPet: {
                age: date
            }
        });
    }
    handleDateChange = (date) => {
        console.log("handleDateChange data: ", date)
        this.setState({
            newPet: {
                age: date
            }
        });
    }
    onChangeBreed(e) {
        this.setState({
            newPet: {
                breed: e.target.value
            }
        });
    }
    onChangePatholoy(e) {
        console.log("e.target.value : ",e.target.value )
        this.setState({
            newPet: {
                health: {
                    pathology: e.target.value
                }
            }
        });
        console.log("pathology",this.state.newPet.health.pathology)
    }
    onChangeTypePathology(e) {
        this.setState({
            newPet: {
                health: {
                    typePathology: e.target.value
                }
            }
        });
    }
    onChangeMedication(e) {
        console.log("e.target.value : ",e.target.value )
        this.setState({
            newPet: {
                health: {
                    medication: e.target.value
                }
            }
        });
        console.log("medication",this.state.newPet.health.medication)
    }
    onChangeTypeMedication(e) {
        this.setState({
            newPet: {
                health: {
                    typeMedication: e.target.value
                }
            }
        });
    }

    render() {
        const { myPetContent, addNewPet } = this.state;
        return (
            <div className=" center">
                {addNewPet && (
                    <div className="center card card-container" style={{ width: '75%' }}>
                        <h1>New Pet!</h1>
                        <Form
                            onSubmit={this.handleNewPet}
                            ref={c => {
                                this.form = c;
                            }}
                        >
                            <div className="form-group">
                                <label htmlFor="username">Name</label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={this.state.newPet.name}
                                    onChange={this.onChangeName}
                                    validations={[required]}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="username">Age</label>
                                <DatePicker
                                    selected={this.state.newPet.age}
                                    onSelect={this.handleDateSelect} //when day is clicked
                                    onChange={this.handleDateChange} //only when value has changed
                                />

                            </div>
                            <div className="form-group">
                                <label htmlFor="username">Breed</label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="breed"
                                    value={this.state.newPet.breed}
                                    onChange={this.onChangeBreed}
                                    validations={[required]}
                                />
                            </div>

                            {/* 
                            health: {
                    pathology: undefined,
                    medication: undefined,
                    castrated: undefined
                }, */}
                            <div className="form-group">
                                <label htmlFor="username">Pathology</label>
                               
                                <Input
                                    type="checkbox"
                                    className="form-control"
                                    name="pathology"
                                    value={this.state.newPet.health.pathology}
                                    onChange={this.onChangePatholoy}

                                />
                                {this.state.newPet.health.pathology !== undefined ?
                                    <div className="form-group">
                                        <label htmlFor="username">Type pathology</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="typePathology"
                                            value={this.state.newPet.health.typePathology}
                                            onChange={this.onChangeTypePathology}
                                            validations={[required]}

                                        />
                                    </div>
                                    : null
                                }
                            </div>

                            <div className="form-group">
                                <label htmlFor="username">Medication</label>
                                <Input
                                    type="checkbox"
                                    className="form-control"
                                    name="medication"
                                    value={this.state.newPet.medication}
                                    onChange={this.onChangeMedication}

                                />
                                {this.state.newPet.health.medication !== undefined ?
                                    <div className="form-group">
                                      
                                        <label htmlFor="username">Type medication</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="typePathology"
                                            value={this.state.newPet.health.typeMedication}
                                            onChange={this.onChangeTypeMedication}
                                            validations={[required]}

                                        />
                                    </div>
                                    : null
                                }
                            </div>
                            <div className="form-group">
                                <label htmlFor="username">Breed</label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="username"
                                    value={this.state.newPet.breed}
                                    onChange={this.onChangeBreed}
                                    validations={[required]}
                                />
                            </div>

                            <div className="form-group">
                                <button
                                    className="btn btn-success btn-block center"
                                    disabled={this.state.loading}
                                    style={{ width: '50%' }}
                                >
                                    {this.state.loading && (
                                        <span className="spinner-border spinner-border-sm"></span>
                                    )}
                                    <span>Add</span>
                                </button>
                            </div>

                            {this.state.message && (
                                <div className="form-group">
                                    <div className="alert alert-danger" role="alert">
                                        {this.state.message}
                                    </div>
                                </div>
                            )}
                            <CheckButton
                                style={{ display: "none" }}
                                ref={c => {
                                    this.checkBtn = c;
                                }}
                            />
                        </Form>
                    </div>
                )
                }
                <div className=" card card-container" style={{ marginTop: '1%' }}>

                    {
                        myPetContent && (

                            <CardPet mypet={this.state.mypet} createNewPet={this.createNewPet} />
                        )
                    }
                    <CardPet mypet={this.state.mypet} createNewPet={this.createNewPet} />
                </div>
            </div >


        )
    }
}


