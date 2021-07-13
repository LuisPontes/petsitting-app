import React from 'react';
import { Modal, Dropdown, Button } from 'react-bootstrap';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



// import { BiPlusCircle } from "react-icons/bi";

import ApiUserService from "../../../../../services/api.user";
// import AuthService from "../../../../services/auth.service";


const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

export default class EventModal extends React.Component {

    /**
     * @param props
     * @param context
     */
    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleCreateEvent = this.handleCreateEvent.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleSetState = this.handleSetState.bind(this);
        this.getPet = this.getPet.bind(this);
        this.formatYmd = this.formatYmd.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.state = {
            dataPicker: {
                start: new Date(),
                end: new Date(),
            },
            successful: false,
            message: "",
            newEvent: {
                id: undefined,
                title: undefined,
                start: undefined,
                end: undefined,
                resourceId: undefined,
                bgColor: "purple"
            }

        };
    }


    handleCreateEvent(e) {
        e.preventDefault();

        let resourceId = undefined;
        if (this.props.type === "NEW_BY_BUTTON") {
            this.props.event.pets.map((pet, index) => {
                if (pet.name === this.state.petChoose.name) {
                    resourceId = index;
                }
            })
        }
        if (resourceId === undefined) {
            resourceId = this.props.event.resourceId;
        }
        //set id
        this.state.newEvent.id = this.props.event.id;
        // set recurse id
        this.state.newEvent.resourceId = resourceId;

        if (this.state.newEvent.start === undefined) {
            this.state.newEvent.start = this.formatYmd(this.state.dataPicker.start);
        }
        if (this.state.newEvent.end === undefined) {
            this.state.newEvent.end = this.formatYmd(this.state.dataPicker.end);
        }

        this.setState({
            successful: false,
            message: "",
            loading: true
        });

        this.form.validateAll();

        // if (this.checkBtn.context._errors.length === 0) {
        // send to server
        ApiUserService.registerReserve(this.state.newEvent).then(
            response => {
                console.log("handleNewEvent : ", response.data);
                this.setState({
                    message: "Your reserve added with Sussecc!",
                    successful: true
                });
                this.props.addEvent(this.state.newEvent);
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





        // } else {
        //     this.setState({
        //         loading: false
        //     });
        // }
    }

    handleShow() {
        this.props.show = true;
    }

    handleStartDateChange = (date) => {

        let dateNow = new Date();
        if (date.getTime() < dateNow.getTime()) {
            this.setState({
                successful: false,
                message: "Date Start is not valide"
            });
        } else {
            let dateFormated = this.formatYmd(date);
            this.setState(prevState => ({
                dataPicker: {
                    ...prevState.dataPicker,
                    start: date
                },
                newEvent: {
                    ...prevState.newEvent,
                    start: dateFormated
                }
            }))
        }
    }
    handleEndDateChange = (date) => {
        let dateFormated = this.formatYmd(date);
        this.setState(prevState => ({
            dataPicker: {
                ...prevState.dataPicker,
                end: date
            },
            newEvent: {                   // object that we want to update
                ...prevState.newEvent,    // keep all other key-value pairs
                end: dateFormated       // update the value of specific key
            }
        }))
    }

    formatYmd(date_ob) {
        // adjust 0 before single digit date
        let date = ("0" + date_ob.getDate()).slice(-2);
        // current month
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        // current year
        let year = date_ob.getFullYear();
        // current hours
        let hours = date_ob.getHours();
        // current minutes
        let minutes = date_ob.getMinutes();
        // current seconds
        let seconds = date_ob.getSeconds();
        // prints date & time in YYYY-MM-DD HH:MM:SS format
        // console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
        return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
    }
    handleSetState(e) {
        var value = e.target.value;
        var propName = e.target.name;
        console.log("propName : ", propName);
        console.log("value : ", value);
        this.setState(prevState => ({
            newEvent: {
                ...prevState.newEvent,
                [e.target.name]: value
            }
        }));
    }

    getPet() {
        if (this.props.event !== undefined) {
            return this.props.event.pets.map((pet) => {
                if (pet.id === this.props.event.resourceId) {
                    this.state.petChoose = pet;
                    return <label id="resourceId" htmlFor="username">{pet.name}</label>

                }
            }
            )
        }

    }

    closeModal() {
        this.setState({
            successful: false,
            message: "",
            loading: false
        });
        this.props.onClose()
    }

    render() {
        const { show, title, type, event } = this.props;
        // { console.log("this.props ", this.props) }
        // { console.log("type ", type) }
        // { console.log("Event ", event) }

        return (
            <div>
                <Modal show={show} onHide={() => this.props.onClose()}>
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form
                            onSubmit={this.handleCreateEvent}
                            ref={c => {
                                this.form = c;
                            }}
                        >
                            {/* bgColor: "purple"
                                end: "2021-07-04 23:59:59"
                                id: 0
                                resourceId: 1
                                start: "2021-07-04 00:00:00"
                                title: "New event you just created" */}

                            {!this.state.successful && (
                                <div>
                                    {
                                        type === "NEW_BY_BUTTON" ?
                                            <div className="form-group hide">
                                                <Dropdown className="center" >
                                                    <Dropdown.Toggle style={{ width: '75%' }} variant="success" id="dropdown-basic">
                                                        {this.state.petChoose !== undefined ? this.state.petChoose.name : "Choose one pet"}
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        {
                                                            event.pets.map((pet, index) =>
                                                                <Dropdown.Item onClick={() =>
                                                                    this.setState(
                                                                        prevState => ({
                                                                            petChoose: pet,
                                                                            newEvent: {
                                                                                ...prevState.newEvent,
                                                                                title: " Reserved"
                                                                            }
                                                                        })
                                                                    )
                                                                } >{pet.name}</Dropdown.Item>)
                                                        }

                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                            :
                                            <div className="form-group hide">
                                                <label htmlFor="username">Pet Name : </label>
                                                {
                                                    this.getPet()


                                                }
                                            </div>
                                    }

                                    <div className="form-group">
                                        <label htmlFor="username">Title</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="title"
                                            value={type === "NEW" ? this.state.newEvent.title : event ? event.title : this.state.newEvent.title}
                                            onChange={this.handleSetState}
                                            validations={[required]}
                                        />
                                    </div>
                                    <div className="form-group center">
                                        <label htmlFor="username" style={{ width: '50%' }}>Reserve start  </label>
                                        <DatePicker
                                            dateFormat="yyyy/MM/dd"
                                            selected={this.state.dataPicker.start}
                                            onChange={this.handleStartDateChange}
                                            showTimeSelect
                                            dateFormat="Pp"
                                            minDate={new Date()}
                                            // maxDate={addMonths(new Date(), 5)}
                                            withPortal

                                        />
                                    </div>
                                    <div className="form-group center">
                                        <label htmlFor="username" style={{ width: '50%' }}>Reserve end  </label>
                                        <DatePicker
                                            dateFormat="yyyy/MM/dd"
                                            selected={this.state.dataPicker.end}
                                            onChange={this.handleEndDateChange}
                                            showTimeSelect
                                            dateFormat="Pp"
                                            minDate={new Date()}
                                            // maxDate={addMonths(new Date(), 5)}
                                            withPortal

                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="username">Color Event</label>

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
                                            <span>{"Create"}</span>
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

                        <Button type="button" variant="primary" onClick={() => this.closeModal()}>Close</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        );
    }
}


