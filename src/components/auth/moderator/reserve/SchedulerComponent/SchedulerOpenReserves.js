import React, { Component } from 'react'

import Scheduler, { SchedulerData, ViewTypes, DATE_FORMAT } from 'react-big-scheduler'
import 'react-big-scheduler/lib/css/style.css'
// import './SchedulerBasic.css'
import moment from 'moment'

import AuthService from "../../../../../services/auth.service";
import ApiPetSiterService from "../../../../../services/api.petsiter";

import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

//set resources here or later
let resources = [

];
//set events here or later,
//the event array should be sorted in ascending order by event.start property, otherwise there will be some rendering errors
let events = [

];


export default class SchedulerOpenReserves extends Component {
    constructor(props) {
        super(props);

        this.prevClick = this.prevClick.bind(this);
        this.nextClick = this.nextClick.bind(this);
        this.onSelectDate = this.onSelectDate.bind(this);
        this.onViewChange = this.onViewChange.bind(this);
        this.eventClicked = this.eventClicked.bind(this);


        //2. create the view model, put it in the props obj
        let schedulerData = new SchedulerData(new moment().format(DATE_FORMAT), ViewTypes.Week);
        //set locale moment to the schedulerData, if your locale isn't English. By default, Scheduler comes with English(en, United States).
        moment.locale('zh-cn');
        schedulerData.setLocaleMoment(moment);
        schedulerData.setResources(resources);
        schedulerData.setEvents(events);


        let width = (window.screen.width > 400 ? ((80 * window.screen.width) / 100) : window.screen.width);

        schedulerData.config.schedulerWidth = width;

        this.state = {
            viewModel: schedulerData,
            allOpenReserves: [undefined]
        
        }
    }

    componentDidMount() {

        const user = AuthService.getCurrentUser();
        if (user) {

            this.setState({
                currentUser: user
            });

            ApiPetSiterService.getAdminOpenReserves().then(
                response => {
                    console.log("getOpenReserves response.data ", response.data)

                    this.props.saveOpenReserves(response.data);

                    this.setState({
                        allOpenReserves: response.data
                    });

                    let schedulerData = this.state.viewModel;
                    schedulerData.setEvents([]);
                    this.setState({
                        viewModel: schedulerData
                    })
                    if ( this.state.allOpenReserves !== undefined) {
                        this.state.allOpenReserves.map((R) => {
                            console.log(R);
                            this.addResource(R.pet);
                            this.addEvent(R);
                           
                        });
                    }
                },
                error => {
                  
                    if (error.response) {
                        // Request made and server responded
                        // console.log(error.response.data);
                        // console.log(error.response.status);
                        // console.log(error.response.headers);
                        if (error.response.status === 401 || error.response.status === 403) {
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
        return (
            <div >


                <DragDropContextProvider backend={HTML5Backend}>
                    <Scheduler schedulerData={viewModel}
                        prevClick={this.prevClick}
                        nextClick={this.nextClick}
                        onSelectDate={this.onSelectDate}
                        onViewChange={this.onViewChange}
                        eventItemClick={this.eventClicked}
                        viewEventClick={this.ops1}
                        viewEventText="Ops 1"
                        viewEvent2Text="Ops 2"
                        viewEvent2Click={this.ops2}
                        updateEventStart={this.updateEventStart}
                        updateEventEnd={this.updateEventEnd}
                        moveEvent={this.moveEvent}
                        newEvent={this.newEvent}
                        onScrollLeft={this.onScrollLeft}
                        onScrollRight={this.onScrollRight}
                        onScrollTop={this.onScrollTop}
                        onScrollBottom={this.onScrollBottom}
                        toggleExpandFunc={this.toggleExpandFunc}
                    />
                </DragDropContextProvider>

             
            </div>
        )
    }


    addResource = (resource) => {
        console.log(resource);
        let schedulerData = this.state.viewModel;
        let newFreshId = resource.id;//schedulerData.resources.length + 1;
        let newFreshName = resource.name+"["+resource.user.username+"]";
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
        alert(`You just clicked an event: {id: ${event.id}, title: ${event.title}}`);
    };

    ops1 = (schedulerData, event) => {
        alert(`You just executed ops1 to event: {id: ${event.id}, title: ${event.title}}`);
    };

    ops2 = (schedulerData, event) => {
        alert(`You just executed ops2 to event: {id: ${event.id}, title: ${event.title}}`);
    };

    newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
        if (window.confirm(`Do you want to create a new event? {slotId: ${slotId}, slotName: ${slotName}, start: ${start}, end: ${end}, type: ${type}, item: ${item}}`)) {

            let newFreshId = 0;
            schedulerData.events.forEach((item) => {
                if (item.id >= newFreshId)
                    newFreshId = item.id + 1;
            });

            let newEvent = {
                id: newFreshId,
                title: 'New event you just created',
                start: start,
                end: end,
                resourceId: slotId,
                bgColor: 'purple'
            }
            schedulerData.addEvent(newEvent);
            this.setState({
                viewModel: schedulerData
            })
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

}

