import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addEvent, removeEvent, changeView } from "./features/calendarSlice";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { nanoid } from "nanoid";

const App = () => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.calendar.events);
  const view = useSelector((state) => state.calendar.view);

  useEffect(() => {
    const initialEvents = [
      {
        id: nanoid(),
        title: "All Day Event",
        start: new Date().toISOString().slice(0, 10),
      },
      {
        id: nanoid(),
        title: "Long Event",
        start: new Date().toISOString().slice(0, 10),
        end: new Date(new Date().getTime() + 86400000).toISOString().slice(0, 10),
      },
      {
        id: nanoid(),
        title: "Repeating Event",
        start: new Date().toISOString().slice(0, 10),
        allDay: false,
      },
      {
        id: nanoid(),
        title: "Birthday Party",
        start: new Date().toISOString().slice(0, 10),
        end: new Date(new Date().getTime() + 86400000).toISOString().slice(0, 10),
        allDay: false,
      },
      {
        id: nanoid(),
        title: "Click for Google",
        start: new Date().toISOString().slice(0, 10),
        url: "https://google.com/",
      },
    ];

    dispatch(addEvent(initialEvents));
  }, [dispatch]);

  const handleEventClick = (event) => {
    alert(event.event.title + " was clicked");
  };

  const handleEventDrop = (event) => {
    const delta = event.delta;
    const updatedEvent = {
      ...event.event,
      start: new Date(event.event.start).getTime() + delta,
      end: new Date(event.event.end).getTime() + delta,
    };

    dispatch(removeEvent(event.event.id));
    dispatch(addEvent([updatedEvent]));
  };

  const handleEventResize = (event) => {
    const delta = event.delta;
    const updatedEvent = {
      ...event.event,
      end: new Date(event.event.end).getTime() + delta,
    };

    dispatch(removeEvent(event.event.id));
    dispatch(addEvent([updatedEvent]));
  };

  const handleViewChange = (newView) => {
    dispatch(changeView(newView));
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView={view}
            events={events}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            views={{
              dayGrid: {
                buttonText: "Day",
              },
              agendaDay: {
                buttonText: "Agenda Day",
              },
              agendaWeek: {
                buttonText: "Agenda Week",
              },
              month: {
                buttonText: "Month",
              },
            }}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,agendaDay,agendaWeek,month",
            }}
            navLinks={true}
            editable={true}
            selectable={true}
            droppable={true}
            eventLimit={true}
            viewDidMount={handleViewChange}
          />
        </div>
      </div>
    </div>
  );
};

export default App;