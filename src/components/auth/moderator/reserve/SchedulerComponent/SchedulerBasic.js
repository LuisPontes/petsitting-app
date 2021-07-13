import React, { Component } from 'react'

import Scheduler, { SchedulerData, ViewTypes, DATE_FORMAT } from 'react-big-scheduler'
//include `react-big-scheduler/lib/css/style.css` for styles, link it in html or import it here
import 'react-big-scheduler/lib/css/style.css'
// import './SchedulerBasic.css'
import moment from 'moment'

import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

//set resources here or later
let resources = [
    {
        id: 'r0',
        name: 'Resource0',
        groupOnly: true
    },
    {
        id: 'r1',
        name: 'Resource1'
    },
    {
        id: 'r2',
        name: 'Resource2',
        parentId: 'r0'
    },
    {
        id: 'r3',
        name: 'Resource3',
        parentId: 'r4'
    },
    {
        id: 'r4',
        name: 'Resource4',
        parentId: 'r2'
    },
];
//set events here or later,
//the event array should be sorted in ascending order by event.start property, otherwise there will be some rendering errors
let events = [
    {
        id: 1,
        start: '2017-12-18 09:30:00',
        end: '2017-12-19 23:30:00',
        resourceId: 'r1',
        title: 'I am finished',
        bgColor: '#D9D9D9'
    },
    {
        id: 2,
        start: '2017-12-18 12:30:00',
        end: '2017-12-26 23:30:00',
        resourceId: 'r2',
        title: 'I am not resizable',
        resizable: false
    },
    {
        id: 3,
        start: '2017-12-19 12:30:00',
        end: '2017-12-20 23:30:00',
        resourceId: 'r3',
        title: 'I am not movable',
        movable: false
    },
    {
        id: 4,
        start: '2017-12-19 14:30:00',
        end: '2017-12-20 23:30:00',
        resourceId: 'r1',
        title: 'I am not start-resizable',
        startResizable: false
    },
    {
        id: 5,
        start: '2017-12-19 15:30:00',
        end: '2017-12-20 23:30:00',
        resourceId: 'r2',
        title: 'R2 has recurring tasks every week on Tuesday, Friday',
        rrule: 'FREQ=WEEKLY;DTSTART=20171219T013000Z;BYDAY=TU,FR',
        bgColor: '#f759ab'
    }
];


export default class SchedulerBasic extends Component {
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

       
        var width = document.getElementById("reserve-content")!=null ? 
        document.getElementById("reserve-content").clientWidth
        : 1140;
        
        // window.innerWidth && document.documentElement.clientWidth?
        // Math.min(window.innerWidth, document.documentElement.clientWidth) :
        // window.innerWidth ||
        // document.documentElement.clientWidth ||
        // document.getElementById('reserve-content')[0].clientWidth; 
      
        // console.log("document.getElementById('reserve-content').clientWidth : ",document.getElementById("reserve-content").clientWidth);
    //    console.log(" Math.min(window.innerWidth, document.documentElement.clientWidth) : ", Math.min(window.innerWidth, document.documentElement.clientWidth));
    //    console.log("window.innerWidth : ",window.innerWidth );
    //    console.log("document.documentElement.clientWidth  : ",document.documentElement.clientWidth  );

        schedulerData.config.schedulerWidth=width;
        this.state = {
            viewModel: schedulerData
        }
    }
  

    render() {
        const {viewModel} = this.state;
        return (
            <div >

           
            <DragDropContextProvider backend={HTML5Backend}>
                <Scheduler  schedulerData={viewModel}
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

    prevClick = (schedulerData)=> {
        schedulerData.prev();
        schedulerData.setEvents(events);
        this.setState({
            viewModel: schedulerData
        })
    }

    nextClick = (schedulerData)=> {
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
        if(window.confirm(`Do you want to create a new event? {slotId: ${slotId}, slotName: ${slotName}, start: ${start}, end: ${end}, type: ${type}, item: ${item}}`)){

            let newFreshId = 0;
            schedulerData.events.forEach((item) => {
                if(item.id >= newFreshId)
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
        if(window.confirm(`Do you want to adjust the start of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newStart: ${newStart}}`)) {
            schedulerData.updateEventStart(event, newStart);
        }
        this.setState({
            viewModel: schedulerData
        })
    }

    updateEventEnd = (schedulerData, event, newEnd) => {
        if(window.confirm(`Do you want to adjust the end of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newEnd: ${newEnd}}`)) {
            schedulerData.updateEventEnd(event, newEnd);
        }
        this.setState({
            viewModel: schedulerData
        })
    }

    moveEvent = (schedulerData, event, slotId, slotName, start, end) => {
        if(window.confirm(`Do you want to move the event? {eventId: ${event.id}, eventTitle: ${event.title}, newSlotId: ${slotId}, newSlotName: ${slotName}, newStart: ${start}, newEnd: ${end}`)) {
            schedulerData.moveEvent(event, slotId, slotName, start, end);
            this.setState({
                viewModel: schedulerData
            })
        }
    }

    onScrollRight = (schedulerData, schedulerContent, maxScrollLeft) => {
        if(schedulerData.ViewTypes === ViewTypes.Day) {
            schedulerData.next();
            schedulerData.setEvents(events);
            this.setState({
                viewModel: schedulerData
            });
    
            schedulerContent.scrollLeft = maxScrollLeft - 10;
        }
    }

    onScrollLeft = (schedulerData, schedulerContent, maxScrollLeft) => {
        if(schedulerData.ViewTypes === ViewTypes.Day) {
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

