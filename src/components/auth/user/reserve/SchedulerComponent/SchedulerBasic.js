import React, { Component } from 'react'

import Scheduler, { SchedulerData, ViewTypes, DATE_FORMAT } from 'react-big-scheduler'
//include `react-big-scheduler/lib/css/style.css` for styles, link it in html or import it here
import 'react-big-scheduler/lib/css/style.css'
// import './SchedulerBasic.css'
import moment from 'moment'

import EventModal from './EventModal'

import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import AuthService from "../../../../../services/auth.service";
import ApiUserService from "../../../../../services/api.user";



let events = [
        // {
        //     id: 1,
        //     start: '2021-7-4 09:30:00',
        //     end: '2022-12-19 23:30:00',
        //     resourceId: 'r1',
        //     title: 'I am finished',
        //     bgColor: '#D9D9D9'
        // },
    //     {
    //         id: 2,
    //         start: '2017-12-18 12:30:00',
    //         end: '2017-12-26 23:30:00',
    //         resourceId: 'r2',
    //         title: 'I am not resizable',
    //         resizable: false
    //     },
    //     {
    //         id: 3,
    //         start: '2017-12-19 12:30:00',
    //         end: '2017-12-20 23:30:00',
    //         resourceId: 'r3',
    //         title: 'I am not movable',
    //         movable: false
    //     },
    //     {
    //         id: 4,
    //         start: '2017-12-19 14:30:00',
    //         end: '2017-12-20 23:30:00',
    //         resourceId: 'r1',
    //         title: 'I am not start-resizable',
    //         startResizable: false
    //     },
    //     {
    //         id: 5,
    //         start: '2017-12-19 15:30:00',
    //         end: '2017-12-20 23:30:00',
    //         resourceId: 'r2',
    //         title: 'R2 has recurring tasks every week on Tuesday, Friday',
    //         rrule: 'FREQ=WEEKLY;DTSTART=20171219T013000Z;BYDAY=TU,FR',
    //         bgColor: '#f759ab'
    //     }
];

let resources = [];

export default class SchedulerBasic extends Component {
    constructor(props) {
        super(props);



        this.prevClick = this.prevClick.bind(this);
        this.nextClick = this.nextClick.bind(this);
        this.onSelectDate = this.onSelectDate.bind(this);
        this.onViewChange = this.onViewChange.bind(this);
        this.eventClicked = this.eventClicked.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.addEvent = this.addEvent.bind(this);
        this.newEventByButton = this.newEventByButton.bind(this);

        //2. create the view model, put it in the props obj
        let schedulerData = new SchedulerData(new moment().format(DATE_FORMAT), ViewTypes.Week);
        //set locale moment to the schedulerData, if your locale isn't English. By default, Scheduler comes with English(en, United States).
        moment.locale('zh-cn');
        schedulerData.setLocaleMoment(moment);
        schedulerData.setResources(resources);
        schedulerData.setEvents(events);
        schedulerData.config.resourceName = "My Pets Name";

        let width = (window.screen.width > 400 ? ((80 * window.screen.width) / 100) : window.screen.width);

        schedulerData.config.schedulerWidth = width;
       
        this.state = {
            viewModel: schedulerData,
            allMyPetsData: {
                count: 0,
                rows: [undefined]
            },
            allReserves: {
                count: 0,
                rows: [undefined]
            },
            modal: {
                title: 'Reserve',
                show: false
            },
        }
        


    }

    componentDidMount() {

        const user = AuthService.getCurrentUser();
        if (user) {

            this.setState({
                currentUser: user
            });

            const { allMyPetsData } = this.props;
            if (allMyPetsData && allMyPetsData.count > 0) {

                allMyPetsData.rows.map((pet) => {
                    return this.addResource(pet)
                });
            }

            ApiUserService.getMyReserves().then(
                response => {
                    console.log("getMyReserves response.data ", response.data)
                    this.props.saveMyReserves(response.data);
                    this.setState({
                        allReserves: response.data
                    });
                    let schedulerData = this.state.viewModel;
                    schedulerData.setEvents([]);
                    this.setState({
                        viewModel: schedulerData
                    })
                    this.state.allReserves.rows.map((event)=>{
                        if(event !== undefined )
                        this.addEvent(event)
                    });
            

                },
                error => {
                    if (error.response) {
                        // Request made and server responded
                        // console.log(error.response.data);
                        // console.log(error.response.status);
                        // console.log(error.response.headers);
                        if (error.response.status === 401) {
                            AuthService.logout();
                        }
                    } else if (error.request) {
                        // The request was made but no response was received
                        // console.log(error.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        // console.log('Error', error.message);
                    }
                }
            );
           
        }
    }


    render() {

        const { viewModel } = this.state;
        let leftCustomHeader = (
            <div>
                <span style={{ fontWeight: 'bold' }}><a href="#" onClick={() => this.newEventByButton()}>Add a reserve</a></span>
            </div>
        );


        return (
            <div   >

                <EventModal
                    title={this.state.modal.title}
                    show={this.state.modal.show}
                    type={this.state.modal.type}
                    onClose={this.closeModal}
                    event={this.state.newEvent}
                    addEvent={this.addEvent}
                />


                <DragDropContextProvider backend={HTML5Backend}>
                    <Scheduler schedulerData={viewModel}
                        prevClick={this.prevClick}
                        nextClick={this.nextClick}
                        onSelectDate={this.onSelectDate}
                        onViewChange={this.onViewChange}
                        eventItemClick={this.eventClicked}
                        viewEventClick={this.view}
                        viewEventText="View"
                        viewEvent2Text="Remove"
                        viewEvent2Click={this.Remove}
                        updateEventStart={this.updateEventStart}
                        updateEventEnd={this.updateEventEnd}
                        moveEvent={this.moveEvent}
                        newEvent={this.newEvent}
                        onScrollLeft={this.onScrollLeft}
                        onScrollRight={this.onScrollRight}
                        onScrollTop={this.onScrollTop}
                        onScrollBottom={this.onScrollBottom}
                        toggleExpandFunc={this.toggleExpandFunc}
                        slotClickedFunc={this.slotClickedFunc}
                        leftCustomHeader={leftCustomHeader}
                    />
                </DragDropContextProvider>
            </div>
        )
    }

    newEventByButton = () => {

        let newFreshId = 0;
        this.state.viewModel.events.forEach((item) => {
            if (item.id >= newFreshId)
                newFreshId = item.id + 1;
        });
        let newEvent = {
            id: newFreshId,
            title: '',
            start: new Date(),
            end: new Date(),
            resourceId: [undefined],
            bgColor: 'purple',
            pets: this.props.allMyPetsData
        }
        console.log("newEventByButton", newEvent);
        this.setState(prevState => (
            {
                modal: {
                    ...prevState.modal,
                    show: true
                },
                newEvent: newEvent
            }));
    }
    newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {

        let newFreshId = 0;
        schedulerData.events.forEach((item) => {
            if (item.id >= newFreshId)
                newFreshId = item.id + 1;
        });
        let newEvent = {
            id: newFreshId,
            title: 'Reserved',
            start: start,
            end: end,
            resourceId: [slotId],
            bgColor: 'purple',
            pets: this.props.allMyPetsData
        }


        this.setState(prevState => (
            {
                modal: {
                    ...prevState.modal,
                    show: true
                },
                newEvent: newEvent
            }));


        // if (window.confirm(`Do you want to create a new event? {slotId: ${slotId}, slotName: ${slotName}, start: ${start}, end: ${end}, type: ${type}, item: ${item}}`)) {

        //     let newFreshId = 0;
        //     schedulerData.events.forEach((item) => {
        //         if (item.id >= newFreshId)
        //             newFreshId = item.id + 1;
        //     });

        //     let newEvent = {
        //         id: newFreshId,
        //         title: 'New event you just created',
        //         start: start,
        //         end: end,
        //         resourceId: slotId,
        //         bgColor: 'purple'
        //     }
        //     schedulerData.addEvent(newEvent);
        //     this.setState({
        //         viewModel: schedulerData
        //     })
        // }
    }

    addResource = (resource) => {
        let schedulerData = this.state.viewModel;
        let newFreshId = resource.id;//schedulerData.resources.length + 1;
        let newFreshName = resource.name;
        schedulerData.addResource({ id: newFreshId, name: newFreshName, groupOnly: false });
        this.setState({
            viewModel: schedulerData
        })
    }

    addEvent = (event) => {
        let schedulerData = this.state.viewModel;
        schedulerData.addEvent(
            {
                id: event.id,
                title: event.title,
                start: event.start,
                end: event.end,
                resourceId: event.resourceId,
                bgColor: '#D9D9D9'
            }
        );
        this.setState({
            viewModel: schedulerData
        })
        events = schedulerData.events;
    }

    prevClick = (schedulerData) => {
        schedulerData.prev();
        schedulerData.setEvents(events);
        this.setState({
            viewModel: schedulerData
        })
    }

    nextClick = (schedulerData) => {
        schedulerData.next();
        schedulerData.setEvents(events);
        this.setState({
            viewModel: schedulerData
        })
    }

    onViewChange = (schedulerData, view) => {
        schedulerData.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);
        schedulerData.setEvents(events);
        this.setState({
            viewModel: schedulerData
        })
    }

    onSelectDate = (schedulerData, date) => {
        schedulerData.setDate(date);
        schedulerData.setEvents(events);
        this.setState({
            viewModel: schedulerData
        })
    }

    eventClicked = (schedulerData, event) => {
        // alert(`You just clicked an event: {id: ${event.id}, title: ${event.title}}`);
    };

    view = (schedulerData, event) => {
        alert(`You just executed ops1 to event: {id: ${event.id}, title: ${event.title}}`);
    };

    Remove = (schedulerData, event) => {
        alert(`You just executed ops2 to event: {id: ${event.id}, title: ${event.title}}`);
        if (window.confirm(`Do you want to remove this event? {slotId: ${event.title},start: ${event.start}, end: ${event.end}, type: ${event.type}, item: ${event.item}}`)) {
            ApiUserService.deleteReserve(event.id).then(
                response => {
                    // console.log("response.data ", response.data)
                    this.props.saveMyReserves(response.data);
                    this.setState({
                        allReserves: response.data
                    });
                    this.removeEvent(event);
                    this.state.allReserves.rows.map((event)=>{
                        if(event !== undefined )
                        this.addEvent(event)
                    });
                },
                error => {
                    if (error.response) {
                        // Request made and server responded
                        // console.log(error.response.data);
                        // console.log(error.response.status);
                        // console.log(error.response.headers);
                        if (error.response.status === 401) {
                            AuthService.logout();
                        }
                    } else if (error.request) {
                        // The request was made but no response was received
                        // console.log(error.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        // console.log('Error', error.message);
                    }
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
    };

    removeEvent(event) {
        let schedulerData = this.state.viewModel;
        let index = schedulerData.events.indexOf(event);
        if(index !== -1) {
            schedulerData.events.splice(index, 1);
            schedulerData._createRenderData();
        }
        this.setState({
            viewModel: schedulerData
        })
    }

    removeEventById(eventId) {
        let index = -1;
        this.events.forEach((item, idx) => {
            if(item.id === eventId)
                index = idx;
        })
        if(index !== -1) {
            this.events.splice(index, 1);
            this._createRenderData();
        }
    }

   

    updateEventStart = (schedulerData, event, newStart) => {
        if (window.confirm(`Do you want to adjust the start of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newStart: ${newStart}}`)) {
            schedulerData.updateEventStart(event, newStart);
        }
        this.setState({
            viewModel: schedulerData
        })
    }

    updateEventEnd = (schedulerData, event, newEnd) => {
        if (window.confirm(`Do you want to adjust the end of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newEnd: ${newEnd}}`)) {
            schedulerData.updateEventEnd(event, newEnd);
        }
        this.setState({
            viewModel: schedulerData
        })
    }

    moveEvent = (schedulerData, event, slotId, slotName, start, end) => {
        if (window.confirm(`Do you want to move the event? {eventId: ${event.id}, eventTitle: ${event.title}, newSlotId: ${slotId}, newSlotName: ${slotName}, newStart: ${start}, newEnd: ${end}`)) {
            schedulerData.moveEvent(event, slotId, slotName, start, end);
            this.setState({
                viewModel: schedulerData
            })
        }
    }

    onScrollRight = (schedulerData, schedulerContent, maxScrollLeft) => {
        if (schedulerData.ViewTypes === ViewTypes.Day) {
            schedulerData.next();
            schedulerData.setEvents(events);
            this.setState({
                viewModel: schedulerData
            });

            schedulerContent.scrollLeft = maxScrollLeft - 10;
        }
    }

    onScrollLeft = (schedulerData, schedulerContent, maxScrollLeft) => {
        if (schedulerData.ViewTypes === ViewTypes.Day) {
            schedulerData.prev();
            schedulerData.setEvents(events);
            this.setState({
                viewModel: schedulerData
            });

            schedulerContent.scrollLeft = 10;
        }
    }

    onScrollTop = (schedulerData, schedulerContent, maxScrollTop) => {
        console.log('onScrollTop');
    }

    onScrollBottom = (schedulerData, schedulerContent, maxScrollTop) => {
        console.log('onScrollBottom');
    }

    toggleExpandFunc = (schedulerData, slotId) => {
        schedulerData.toggleExpandStatus(slotId);
        this.setState({
            viewModel: schedulerData
        });
    }
    slotClickedFunc = (schedulerData, slot) => {
        alert(`You just clicked a ${schedulerData.isEventPerspective ? 'task' : 'resource'}.{id: ${slot.slotId}, name: ${slot.slotName}}`);
    }

    closeModal() {
        this.setState(prevState => {
            let modal = Object.assign({}, prevState.modal);  // creating copy of state variable jasper
            modal.show = false;                     // update the name property, assign a new value                 
            return { modal };                                 // return new object jasper object
        })
    }

}

