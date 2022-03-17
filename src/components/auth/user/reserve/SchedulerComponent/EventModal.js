import React from 'react';
import { Modal, Dropdown, Button, } from 'react-bootstrap';
// import { Form, Input, CheckButton ,Textarea} from 'react-validation';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";

import { ReserveStatus, ServiceType, PaymentStatus } from '../../../../../Constants'

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

        Date.prototype.addHours = function (h) {
            this.setHours(this.getHours() + h);
            return this;
        }

        this.handleShow = this.handleShow.bind(this);
        this.handleCreateEvent = this.handleCreateEvent.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleSetState = this.handleSetState.bind(this);
        this.getPet = this.getPet.bind(this);
        this.formatYmd = this.formatYmd.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.addPetInreserve = this.addPetInreserve.bind(this);
        this.checkInWalk = this.checkInWalk.bind(this);
        this.handleWalkEndDateChange = this.handleWalkEndDateChange.bind(this);
        this.calculationInvoice = this.calculationInvoice.bind(this);

        this.state = {
            petChoose: [undefined],
            dataPicker: {
                start: new Date(),
                end: new Date().addHours(1),
            },
            successful: false,
            message: "",
            // newEvent: {
            //     id: undefined,
            //     title: "RESERVE",
            //     start: undefined,
            //     end: undefined,
            //     resourceId: undefined,
            //     bgColor: "purple",
            //     status: ReserveStatus.OPEN,
            //     price: undefined,
            //     comments: undefined,
            //     numHours: undefined,
            //     petSiter: undefined,
            //     reportId: undefined,
            //     discount: undefined,
            //     serviceType: undefined,
            //     stayOverAllNight: true,
            //     stayOverSomeNight: false,
            //     walkTime: 1

            // },

            newEvent: {
                id: undefined,
                resourceId: undefined,
                title: "RESERVE",
                comments: undefined,
                start: undefined,
                end: undefined,
                bgColor: "purple",
                status: ReserveStatus.OPEN,
                petSiter: undefined,
                reportId: undefined,
                invoice: {
                    priceTotal: undefined,
                    priceReserve: undefined,
                    numHours: undefined,
                    discount: undefined,
                    paymentStatus: PaymentStatus.RESERVE_PAYMENT_ON_HOLD
                },
                service: {
                    type: undefined,
                    stayOverAllNight: true,
                    stayOverSomeNight: false,
                    datesOfNights: [undefined],
                    numOfNight: 0,
                    walkTime: 1,
                }

            },
            repeatEvent: {
                repeat: false,
                dates: []
            }

        };




    }
    componentDidMount() {
        this.calculationInvoice();
    }

    handleCreateEvent(e) {
        e.preventDefault();
        // console.log("before ", this.state.newEvent);
        if (this.state.newEvent.numHours === undefined
            || this.props.event.resourceId.length < 1
            || this.state.newEvent.start === undefined
            || this.state.newEvent.end === undefined

        ) {
            if (window.confirm('Please complete all fiels to continue the reserve ...')) {

            }
        } else {
            let indexResource = this.props.event.id;
            indexResource--;
            this.props.event.resourceId.map((petId) => {

                //title
                this.state.newEvent.title = " Reserved ";
                // set id
                this.state.newEvent.id = ++indexResource;
                // set recurse id
                this.state.newEvent.resourceId = petId;


                this.setState({
                    successful: false,
                    message: "",
                    loading: true
                });

                this.form.validateAll();

                console.log(this.state.newEvent);
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

            })



        }



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

            this.handleWalkEndDateChange(date);
            this.forceUpdate();
        }
    }


    handleEndDateChange = (date) => {
        let dateFormated = this.formatYmd(date);

        // var hours = Math.ceil(Math.abs(this.state.dataPicker.start - date) / 36e5);
        // var totalPrice = hours * 5;
        this.setState(prevState => ({
            dataPicker: {
                ...prevState.dataPicker,
                end: date
            },
            newEvent: {
                ...prevState.newEvent,
                end: dateFormated
            }
        }))

        this.calculationInvoice();
    }

    handleWalkEndDateChange = (date) => {
        if (this.state.newEvent.service.type === ServiceType.WALK) {
            let endDate = new Date(date).addHours(this.state.newEvent.service.walkTime);
            if (endDate) {
                this.setState(prevState => ({
                    dataPicker: {
                        ...prevState.dataPicker,
                        end: endDate
                    },
                    newEvent: {
                        ...prevState.newEvent,
                        service: {
                            ...prevState.newEvent.service,
                            end: endDate
                        }
                    }
                }))
                this.calculationInvoice();
            }

        }
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
        // console.log("propName : ", propName);
        // console.log("value : ", value);
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

    addPetInreserve(e) {

        if (this.props.event !== undefined) {
            if (e.target.checked) {
                //add
                let resourceIdArray = this.props.event.resourceId;
                resourceIdArray.push(parseInt(e.target.value));
                this.props.event.resourceId = resourceIdArray;
                // console.log("add ",this.props.event.resourceId);
            } else {
                //remove
                let array = this.props.event.resourceId;
                var index = array.indexOf(parseInt(e.target.value));
                // console.log("index",index,this.props.event.resourceId,e.target.value);
                if (index !== -1) {
                    array.splice(index, 1);
                    this.props.event.resourceId = array;
                    // console.log("remove",this.props.event.resourceId);
                }
            }
            this.forceUpdate();
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

    checkInWalk() {
        if (this.state.newEvent.start !== undefined) {
            let hours = new Date(this.state.newEvent.start).getHours();
            // console.log("hours :", hours);
            if (hours => 20) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }

    }
    async durationWalk(time) {
        if (this.state.dataPicker.start) {
            await this.setState(
                prevState => ({
                    newEvent: {
                        ...prevState.newEvent,
                        service: {
                            ...prevState.newEvent.service,
                            walkTime: time
                        }
                    }
                })
            )
            this.handleWalkEndDateChange(this.state.dataPicker.start);
            this.forceUpdate();

        }
    }

    calculationInvoice() {
        var hours = Math.ceil(Math.abs(this.state.dataPicker.start - this.state.dataPicker.end) / 36e5);
        var totalPrice = hours * 5;
        var reservePrice = totalPrice * 0.1;
        this.setState(prevState => ({
            newEvent: {
                ...prevState.newEvent,
                invoice: {
                    ...prevState.newEvent.invoice,
                    numHours: hours,
                    priceTotal: totalPrice,
                    priceReserve: reservePrice
                }

            }
        }))
    }

    render() {
        const { show, title, type, event } = this.props;
        // { console.log("this.props ", this.props) }
        // { console.log("type ", type) }
        { console.log("State ", this.state) }

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


                            {!this.state.successful && (
                                <div>
                                    <div className="form-group" style={{ border: '1px solid #eee' }}>
                                        {/* Pets of this reserve */}
                                        <label style={{ border: '1px solid #eee', width: '100%', textAlign: 'center' }} >Pets[{this.props.event ? this.props.event.resourceId.length : 0}]</label>
                                        {event && (
                                            event.pets && (
                                                <div className="form-group" style={{ marginLeft: '10%' }}>

                                                    {event.pets.rows.map((pet) =>
                                                        <label style={{ width: '50%' }}>
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                name="checkboxPetReserve"
                                                                checked={
                                                                    this.props.event.resourceId.some(id => pet.id === id) ? true : false}
                                                                onChange={this.addPetInreserve}
                                                                value={pet.id}
                                                            />
                                                            {pet.name}
                                                        </label>
                                                    )}
                                                </div>
                                            )
                                        )
                                        }
                                    </div>
                                    {/* Choose service type */}
                                    <label style={{ border: '1px solid #eee', width: '100%', marginBottom: '0px', textAlign: 'center' }}>Tipo de servicio</label>
                                    <div className="form-group center"
                                        style={{ border: '1px solid #eee', display: '-webkit-box', width: '100%', marginTop: '0px' }} >

                                        <div className="form-group" style={{ marginTop: '2%', width: '45%' }}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="serviceTypePaseo"
                                                    checked={
                                                        this.state.newEvent.service.type === ServiceType.WALK ? true
                                                            : null
                                                    }
                                                    onChange={() => this.setState(
                                                        prevState => ({
                                                            newEvent: {
                                                                ...prevState.newEvent,
                                                                service: {
                                                                    ...prevState.newEvent.service,
                                                                    type: ServiceType.WALK
                                                                }
                                                            }
                                                        })
                                                    )}
                                                />
                                          Paseo
                                        </label>
                                        </div>
                                        <div className="form-group" style={{ marginTop: '2%', width: '45%' }}>
                                            <label >
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="serviceTypePLAY&RES"
                                                    checked={
                                                        this.state.newEvent.service.type === ServiceType.RESIDENCE ? true
                                                            : this.state.newEvent.service.type === ServiceType.PLAYGROUNG ? true
                                                                : null
                                                    }
                                                    onChange={() => this.setState(
                                                        prevState => ({
                                                            newEvent: {
                                                                ...prevState.newEvent,
                                                                service: {
                                                                    ...prevState.newEvent.service,
                                                                    type: ServiceType.RESIDENCE
                                                                }
                                                            }
                                                        })
                                                    )}
                                                />
                                          Guardería / Residencia
                                        </label>
                                        </div>
                                    </div>

                                    {/* 
                                    Service type = WALK 
                                     ->Day- Hour to start
                                     ->Number of hour [min = 1, max = 2]
                                     ->repeat this reserve to more days
                                    */}
                                    {
                                        this.state.newEvent.service.type === ServiceType.WALK && (
                                            <div className="form-group" style={{ border: '1px solid #eee', textAlign: 'center' }}>
                                                <label style={{ border: '1px solid #eee', width: '100%' }}>Paseo</label>
                                                <div className="form-group center" >

                                                    <div className="form-group center" style={{ border: '1px solid #eee', width: '100%' }} >
                                                        <label style={{ border: '1px solid #eee', width: '100%', marginBottom: '0px' }}>Check-In</label>
                                                        <DatePicker
                                                            // dateFormat="yyyy/MM/dd"
                                                            dateFormat="MMMM d, yyyy h:mm aa"
                                                            selected={this.state.dataPicker.start}
                                                            onChange={this.handleStartDateChange}
                                                            showTimeSelect
                                                            dateFormat="Pp"
                                                            minDate={new Date()}
                                                            // maxDate={addMonths(new Date(), 5)}
                                                            minTime={setHours(setMinutes(new Date(), 0), 8)}
                                                            maxTime={setHours(setMinutes(new Date(), 0), 20)}
                                                            withPortal
                                                        />

                                                    </div>
                                                    <div className="form-group center" style={{ border: '1px solid #eee', width: '100%' }} >
                                                        <label style={{ border: '1px solid #eee', width: '100%', marginBottom: '0px' }}>Check-out</label>
                                                        <DatePicker
                                                            // dateFormat="yyyy/MM/dd"
                                                            dateFormat="MMMM d, yyyy h:mm aa"
                                                            selected={this.state.dataPicker.end}
                                                            onChange={this.handleEndDateChange}
                                                            showTimeSelect
                                                            dateFormat="Pp"
                                                            minDate={new Date()}
                                                            // maxDate={addMonths(new Date(), 5)}
                                                            withPortal
                                                            disabled
                                                        />

                                                    </div>

                                                    <label style={{ border: '1px solid #eee', width: '100%', marginBottom: '0px' }}>Duración</label>
                                                    <div className="form-group" style={{ border: '1px solid #eee', display: '-webkit-box', width: '100%' }} >
                                                        <div className="form-group" style={{ width: '45%' }}  >
                                                            <label >
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    name="serviceTypeWalkDuration1"
                                                                    checked={
                                                                        this.state.newEvent.service.walkTime === 1 ? true
                                                                            : this.state.newEvent.service.type === undefined ? false
                                                                                : false
                                                                    }
                                                                    onChange={() => this.durationWalk(1)}
                                                                />
                                                        1 Hora
                                                        </label>
                                                        </div>
                                                        <div className="form-group" style={{ width: '45%' }}  >
                                                            <label >
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    name="serviceTypeWalkDuration2"
                                                                    checked={
                                                                        this.state.newEvent.service.walkTime === 2 ? true
                                                                            : this.state.newEvent.service.type === undefined ? false
                                                                                : false
                                                                    }
                                                                    onChange={() => this.durationWalk(2)}

                                                                    disabled={
                                                                        this.checkInWalk()
                                                                    }
                                                                />
                                                            2 Horas
                                                            </label>
                                                        </div>
                                                    </div>

                                                    <div className="form-group center" style={{ width: '100%' }}  >
                                                        <label >
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                name="repeatEvent"
                                                                checked={
                                                                    this.state.repeatEvent.repeat
                                                                }
                                                                onChange={() => this.setState(
                                                                    prevState => ({
                                                                        repeatEvent: {
                                                                            ...prevState.repeatEvent,
                                                                            repeat: !this.state.repeatEvent.repeat
                                                                        }
                                                                    })
                                                                )}

                                                            />
                                                            ¿Quieres hacer una reserva similar para otros días?
                                                            </label>

                                                        {this.state.repeatEvent.repeat && (
                                                            <div className="form-group center" style={{ border: '1px solid #eee', width: '100%' }} >
                                                                <label style={{ border: '1px solid #eee', width: '100%', marginBottom: '0px' }}>Copy reserve</label>
                                                                <DatePicker
                                                                    // dateFormat="yyyy/MM/dd"
                                                                    dateFormat="MMMM d, yyyy h:mm aa"
                                                                    selected={this.state.dataPicker.start}
                                                                    onChange={this.handleStartDateChange}
                                                                    
                                                                    dateFormat="Pp"
                                                                    minDate={new Date()}
                                                                    // maxDate={addMonths(new Date(), 5)}
                                                                    minTime={setHours(setMinutes(new Date(), 0), 8)}
                                                                    maxTime={setHours(setMinutes(new Date(), 0), 20)}
                                                                    withPortal
                                                                />

                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="form-group center" style={{ border: '1px solid #eee', borderColor: '#92a8d1', width: '80%' }} >
                                                        <div className="form-group center" style={{ margin: '0px' }} >
                                                            <label style={{ float: 'left', width: '35%' }}>Horas</label>
                                                            <label style={{ float: 'center', width: '30%' }}>...</label>
                                                            <label style={{ float: 'right', width: '35%' }}>{this.state.newEvent.invoice.numHours === undefined ? 0 : this.state.newEvent.invoice.numHours}</label>
                                                        </div>
                                                        <div className="form-group center" style={{ margin: '0px' }} >
                                                            <label style={{ float: 'left', width: '35%' }}>Discount</label>
                                                            <label style={{ float: 'center', width: '30%' }}>...</label>
                                                            <label style={{ float: 'right', width: '35%' }}>{this.state.newEvent.invoice.discount === undefined ? 0 : this.state.newEvent.invoice.discount}</label>
                                                        </div>

                                                        <div className="form-group center" style={{ margin: '0px' }} >
                                                            <label style={{ float: 'left', width: '35%' }}>Pets</label>
                                                            <label style={{ float: 'center', width: '30%' }}>...</label>
                                                            <label style={{ float: 'right', width: '35%' }}>{this.props.event.resourceId === undefined ? 0 : this.props.event.resourceId.length}</label>
                                                        </div>
                                                        <div className="form-group center" style={{ margin: '0px' }} >
                                                            <label style={{ float: 'left', width: '35%' }}>Total</label>
                                                            <label style={{ float: 'center', width: '30%' }}>...</label>
                                                            <label style={{ float: 'right', width: '35%' }}>{this.state.newEvent.invoice.priceTotal === undefined ? 0 : this.state.newEvent.invoice.priceTotal}€</label>
                                                        </div>
                                                        <div className="form-group center" style={{ margin: '0px' }} >
                                                            <label style={{ float: 'left', width: '35%' }}>To Reserve</label>
                                                            <label style={{ float: 'center', width: '30%' }}>...</label>
                                                            <label style={{ float: 'right', width: '35%' }}>{this.state.newEvent.invoice.priceReserve === undefined ? 0 : this.state.newEvent.invoice.priceReserve}€</label>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        )
                                    }

                                    {/* 
                                    Service type != WALK 
                                     ->start date
                                     ->End date
                                     -> stay all night?
                                        -> stay some Nitghts?
                                            -> which nitghts?
                                    */}
                                    {
                                        this.state.newEvent.service.type !== ServiceType.WALK && this.state.newEvent.service.type !== undefined && (
                                            <div style={{ border: '1px solid #eee', textAlign: 'center' }}>
                                                <label style={{ border: '1px solid #eee', width: '100%' }}> Guardería / Residencia</label>
                                                <div className="form-group" >

                                                </div>
                                            </div>
                                        )
                                    }


                                    <div className="form-group">
                                        <button
                                            className="btn btn-success btn-block center"
                                            disabled={this.state.loading}
                                            style={{ width: '50%' }}
                                        >
                                            {this.state.loading && (
                                                <span className="spinner-border spinner-border-sm"></span>
                                            )}
                                            <span>{"Reserve"}</span>
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
                            <Button type="button" variant="primary" className="center" onClick={() => this.closeModal()}>Cancel</Button>
                        </Form>
                    </Modal.Body>

                </Modal>

            </div>
        );
    }
}



// {/* <div>{
//     type === "NEW_BY_BUTTON" ?
//         <div className="form-group hide">
//             <Dropdown className="center" >
//                 <Dropdown.Toggle style={{ width: '75%' }} variant="success" id="dropdown-basic">
//                     {this.state.petChoose.size() >0 ? this.state.petChoose.name : "Choose one pet"}
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu>
//                     {
//                         event.pets.map((pet, index) =>
//                             <Dropdown.Item onClick={() =>
//                                 this.setState(
//                                     prevState => ({
//                                         petChoose: pet,
//                                         newEvent: {
//                                             ...prevState.newEvent,
//                                             title: " Reserved"
//                                         }
//                                     })
//                                 )
//                             } >{pet.name}</Dropdown.Item>)
//                     }

//                 </Dropdown.Menu>
//             </Dropdown>
//         </div>
//         :
//         <div className="form-group hide">
//             <label htmlFor="username">Pet Name : </label>
//             {
//                 this.getPet()


//             }
//         </div>
// } */}

// <div className="form-group">
//     <label htmlFor="title">Title</label>
//     <Input
//         type="text"
//         className="form-control"
//         name="title"
//         value={type === "NEW" ? this.state.newEvent.title : event ? event.title : this.state.newEvent.title}
//         onChange={this.handleSetState}
//         validations={[required]}
//     />
// </div>


// <div className="form-group center">
//     <div className="form-group center" style={{ display: '-webkit-box' }}>
//         <div className="form-group center">
//             <label htmlFor="checkin" style={{ width: '50%' }}>Check-In </label>
//             <DatePicker
//                 dateFormat="yyyy/MM/dd"
//                 selected={this.state.dataPicker.start}
//                 onChange={this.handleStartDateChange}
//                 showTimeSelect
//                 dateFormat="Pp"
//                 minDate={new Date()}
//                 // maxDate={addMonths(new Date(), 5)}
//                 withPortal

//             />
//         </div>
//         <div className="form-group center">
//             <label htmlFor="checkout" style={{ width: '50%' }}>Check-Out </label>
//             <DatePicker
//                 dateFormat="yyyy/MM/dd"
//                 selected={this.state.dataPicker.end}
//                 onChange={this.handleEndDateChange}
//                 showTimeSelect
//                 dateFormat="Pp"
//                 minDate={new Date()}
//                 // maxDate={addMonths(new Date(), 5)}
//                 withPortal
//                 disabled={this.state.newEvent.start === undefined ? true : false}

//             />
//         </div>
//     </div>
//     <div className="form-group center" style={{ display: '-webkit-box' }}>
//         <div className="form-group center">
//             <label style={{ width: '100%' }}>
//                 <input
//                     type="checkbox"
//                     class="form-check-input"
//                     name="checkboxStayNight"
//                     checked={this.state.newEvent.stayOverAllNight}
//                     onChange={()=>this.setState(
//                         prevState => ({
//                             newEvent: {
//                                 ...prevState.newEvent,
//                                 stayOverAllNight: !this.state.newEvent.stayOverAllNight
//                             }
//                         })
//                     )}


//                 />
//             Pasar todas las noches?
//         </label>
//         </div>
//         <div className="form-group center">
//             {!this.state.newEvent.stayOverAllNight && (<label style={{ width: '100%' }}>
//                 <input
//                     type="checkbox"
//                     class="form-check-input"
//                     name="checkboxStayNight"
//                     checked={this.state.newEvent.stayOverAllNight}
//                     onChange={this.addPetInreserve}


//                 />
//            Algunas noches?
//             </label>)}
//         </div>
//     </div>
// </div>

// {/* <div className="form-group">
//     <label htmlFor="username">Color Event</label>

// </div> */}



// <div className="form-group center" style={{ display: '-webkit-box' }}>

//     <textarea
//         placeholder={"Write here, if exist something that we need know about " +
//             (this.state.petChoose !== undefined ? this.state.petChoose.name : "") + " ..."}
//         multiple={true}
//         className="form-control"
//         name="title"
//         value={this.state.newEvent.comments} // Optional.[String].Default: "".

//     />

// </div>
{/* <div className="form-group center" style={{ borderColor: '#92a8d1', width: '80%' }} >
    <div className="form-group center" style={{ margin: '0px' }} >
        <label style={{ float: 'left', width: '35%' }}>Horas</label>
        <label style={{ float: 'center', width: '30%' }}>...</label>
        <label style={{ float: 'right', width: '35%' }}>{this.state.newEvent.numHours === undefined ? 0 : this.state.newEvent.numHours}</label>
    </div>
    <div className="form-group center" style={{ margin: '0px' }} >
        <label style={{ float: 'left', width: '35%' }}>Discount</label>
        <label style={{ float: 'center', width: '30%' }}>...</label>
        <label style={{ float: 'right', width: '35%' }}>0</label>
    </div>
    <div className="form-group center" style={{ margin: '0px' }} >
        <label style={{ float: 'left', width: '35%' }}>Total</label>
        <label style={{ float: 'center', width: '30%' }}>...</label>
        <label style={{ float: 'right', width: '35%' }}>{this.state.newEvent.price === undefined ? 0 : this.state.newEvent.price}€</label>
    </div>
</div> */}
