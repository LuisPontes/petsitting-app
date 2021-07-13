import React from 'react';
import { Modal, Accordion, Card, Button } from 'react-bootstrap';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from 'react-bootstrap/Image'



import { BiPlusCircle } from "react-icons/bi";

import ApiUserService from "../../../../services/api.user";
import AuthService from "../../../../services/auth.service";


const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

export default class AddPetModal extends React.Component {

    /**
     * @param props
     * @param context
     */
    constructor(props, context) {
        super(props, context);


        // console.log("Props : ", props);

        this.handleShow = this.handleShow.bind(this);

        this.handleNewPet = this.handleNewPet.bind(this);

        this.handleSetState = this.handleSetState.bind(this);

        this.handleDateChange = this.handleDateChange.bind(this);

        this.onFileChange = this.onFileChange.bind(this);

        this.closeModal = this.closeModal.bind(this);

        this.state = {

            successful: false,
            message: "",
            file: undefined,
            newPet: {
                owner: undefined,
                name: undefined,
                age: new Date(),
                photo: undefined,
                breed: "",
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
            }
        };
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();

        if (user) {
            this.setState(prevState => ({
                newPet: {                   // object that we want to update
                    ...prevState.newPet,    // keep all other key-value pairs
                    owner: user.id        // update the value of specific key
                }
            }))
        }
    }

    handleNewPet(e) {
        e.preventDefault();

        this.setState({
            successful: false,
            message: "",
            loading: true
        });

        this.form.validateAll();

        // if (this.checkBtn.context._errors.length === 0) {
        ApiUserService.registerPet(this.state.newPet).then(
            response => {
                console.log("handleNewPet : ", response.data);
                this.setState({
                    message: "Your pet added with Sussecc!",
                    successful: true
                });
                this.props.addPetModal(response.data)
            },
            error => {
                console.log("handleNewPet Error: ", error);
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                this.setState({
                    successful: false,
                    message: resMessage
                });
            }
        );
       

    }

    handleShow() {
        this.props.show = true;
    }

    handleSetState(e) {
        // console.log("e : ", e);
        var value;
        if (e.target.attributes[0].value === "checkbox") {
            value = e.target.checked;
        } else {
            value = e.target.value;
        }
        if (e.target.name.includes(".")) {
            var res = e.target.name.split(".");
            var objtName = res[0];
            var propName = res[1];

            if (objtName.includes("health")) {
                this.setState(prevState => (
                    {
                        newPet: {
                            ...prevState.newPet,
                            health: {                   // object that we want to update
                                ...prevState.newPet.health,    // keep all other key-value pairs
                                [propName]: value        // update the value of specific key
                            }
                        }
                    }));

            } else if (objtName.includes("habits")) {
                this.setState(prevState => (
                    {
                        newPet: {
                            ...prevState.newPet,
                            habits: {                   // object that we want to update
                                ...prevState.newPet.habits,    // keep all other key-value pairs
                                [propName]: value        // update the value of specific key
                            }
                        }
                    }));

            }

        } else {
            // this.setState({ [e.target.name]: e.target.value })
            this.setState(prevState => ({
                newPet: {                   // object that we want to update
                    ...prevState.newPet,    // keep all other key-value pairs
                    [e.target.name]: value        // update the value of specific key
                }
            }))
        }

    }


    handleDateChange = (date) => {
        this.setState(prevState => ({
            newPet: {                   // object that we want to update
                ...prevState.newPet,    // keep all other key-value pairs
                age: date       // update the value of specific key
            }
        }))
    }

    // On file upload (click the upload button)
    onFileChange = (event) => {

        // Create an object of formData
        const formData = new FormData();

        // Update the formData object
        formData.append(
            "photo",
            event.target.files[0],
            event.target.files[0].name
        );

        // console.log("Photo formData : ",formData);
        // console.log("Photo FILE : ",this.state.file);


        // Details of the uploaded file
        // console.log(this.state.selectedFile);

        // Request made to the backend api
        // Send formData object
        // axios.post("api/uploadfile", formData);
        this.setState({
            file: URL.createObjectURL(event.target.files[0])
        })
        this.setState(prevState => ({
            newPet: {                   // object that we want to update
                ...prevState.newPet,    // keep all other key-value pairs
                photo: formData       // update the value of specific key
            }
        }))
    };

    closeModal() {
        this.setState({
            successful: false,
            message: "",
            loading: false
        });
        this.props.onClose()
    }

    render() {
        const { show, title, mypet } = this.props;

        return (
            <div>
                <Modal show={show} onHide={() => this.props.onClose()}>
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* {console.log("mypet", mypet)} */}
                        <Form
                            onSubmit={this.handleNewPet}
                            ref={c => {
                                this.form = c;
                            }}
                        >

                            {!this.state.successful && (
                                <div>
                                    <Accordion defaultActiveKey="0">
                                        <Card>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                                    <span><BiPlusCircle /> Personal</span>
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="0">
                                                <Card.Body>


                                                    <div className="form-group">
                                                        <label htmlFor="username">Name</label>
                                                        <Input
                                                            type="text"
                                                            className="form-control"
                                                            name="name"
                                                            value={mypet ? mypet.name : this.state.newPet.name}
                                                            onChange={this.handleSetState}
                                                            validations={[required]}

                                                        />
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="username">Birthday : </label>
                                                        <DatePicker
                                                            selected={mypet ? new Date(mypet.age) : this.state.newPet.age}
                                                            onSelect={this.handleDateChange} //when day is clicked
                                                            onChange={this.handleDateChange} //only when value has changed
                                                            withPortal
                                                        />
                                                    </div>

                                                    <div className="form-group">

                                                        <input type="file" onChange={this.onFileChange} />

                                                        <div className="center">
                                                            {
                                                                this.state.file ?
                                                                    <Image
                                                                        src={mypet ? mypet.photo ? mypet.photo : this.state.file : this.state.file}
                                                                        alt="profile-img"
                                                                        className="profile-img-card"
                                                                        style={{ width: '25%', height: '15%' }}
                                                                        roundedCircle
                                                                    />
                                                                    : null
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="username">Breed</label>
                                                        <Input
                                                            type="text"
                                                            className="form-control"
                                                            name="breed"
                                                            value={mypet ? mypet.breed : this.state.newPet.breed}
                                                            onChange={this.handleSetState}
                                                            validations={[required]}
                                                        />
                                                    </div>

                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                        <Card>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                                    <span><BiPlusCircle /> Pathology</span>
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="1">
                                                <Card.Body>
                                                    <div className="form-group">
                                                        <label htmlFor="username">Have Pathology ?</label>
                                                        <Input
                                                            type="checkbox"
                                                            className="form-control"
                                                            name="health.pathology"
                                                            value={this.state.newPet.health.pathology}
                                                            onChange={this.handleSetState}

                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="username">Type pathology</label>
                                                        <Input
                                                            type="text"
                                                            className="form-control"
                                                            name="health.typePathology"
                                                            value={this.state.newPet.health.typePathology}
                                                            onChange={this.handleSetState}
                                                            validations={[required]}

                                                        />
                                                    </div>


                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>

                                        <Card>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                                    <span><BiPlusCircle /> Medication</span>
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="2">
                                                <Card.Body>
                                                    <div className="form-group">
                                                        <label htmlFor="username">Take Medication?</label>
                                                        <Input
                                                            type="checkbox"
                                                            className="form-control"
                                                            name="health.medication"
                                                            value={this.state.newPet.health.medication}
                                                            onChange={this.handleSetState}

                                                        />
                                                    </div>
                                                    <div className="form-group">

                                                        <label htmlFor="username">Type medication</label>
                                                        <Input
                                                            type="text"
                                                            className="form-control"
                                                            name="health.typeMedication"
                                                            value={this.state.newPet.health.typeMedication}
                                                            onChange={this.handleSetState}
                                                            validations={[required]}

                                                        />
                                                    </div>


                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>

                                        <Card>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="3">
                                                    <span><BiPlusCircle /> Habits</span>
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="3">
                                                <Card.Body>

                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>

                                        <Card>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="4">
                                                    <span><BiPlusCircle /> Socialization</span>
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="4">
                                                <Card.Body>

                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>

                                        <Card>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="5">
                                                    <span><BiPlusCircle /> On Ride</span>
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="5">
                                                <Card.Body>

                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>

                                        <Card>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="6">
                                                    <span><BiPlusCircle /> At Home</span>
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="6">
                                                <Card.Body>

                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>

                                        {/* <Card>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                                    <span><BiPlusCircle /> Medication</span>
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="2">
                                                <Card.Body> 
                                                    
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card> */}
                                    </Accordion>



                                    {/* <div className="form-group">
                                        <label htmlFor="username">Breed</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="username"
                                            value={this.state.newPet.breed}
                                            onChange={this.onChangeBreed}
                                            validations={[required]}
                                        />
                                    </div> */}

                                    <div className="form-group">
                                        <button
                                            className="btn btn-success btn-block center"
                                            disabled={this.state.loading}
                                            style={{ width: '50%' }}
                                        >
                                            {this.state.loading && (
                                                <span className="spinner-border spinner-border-sm"></span>
                                            )}
                                            <span>{mypet ? "Edit" : "Add"}</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {this.state.message && (
                                <div className="form-group">
                                    {this.state.successful ?
                                        <div className="alert alert-success" role="alert">
                                            {this.state.message}
                                        </div>
                                        :
                                        <div className="alert alert-danger" role="alert">
                                            {this.state.message}
                                        </div>}
                                </div>
                            )}
                            <CheckButton
                                style={{ display: "none" }}
                                ref={c => {
                                    this.checkBtn = c;
                                }}
                            />
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        {
                            mypet ?
                                <Button variant="danger" onClick={() => this.props.deletePetModal(mypet)}>Delete</Button>
                                : null
                        }
                        <Button type="button" variant="primary" onClick={() => this.closeModal()}>Close</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        );
    }
}


