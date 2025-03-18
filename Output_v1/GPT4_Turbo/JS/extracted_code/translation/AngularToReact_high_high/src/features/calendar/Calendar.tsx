import React, { useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { addEvent, removeEvent, setEventSources } from './calendarSlice';

export const Calendar: React.FC = () => {
  const dispatch = useDispatch();
  const { events, eventSources } = useSelector((state: RootState) => state.calendar);

  useEffect(() => {
    // Example of setting event sources
    dispatch(setEventSources([
      // Define your event sources here
    ]));
  }, [dispatch]);

  const handleDateClick = (arg: any) => {
    // Example of adding an event
    const newEvent = {
      title: 'New Event',
      start: arg.dateStr,
      end: moment(arg.dateStr).add(1, 'days').toISOString(),
    };
    dispatch(addEvent(newEvent));
  };

  const handleEventClick = (clickInfo: any) => {
    // Example of removing an event
    dispatch(removeEvent(clickInfo.event.id));
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      eventSources={eventSources}
      dateClick={handleDateClick}
      eventClick={handleEventClick}
    />
  );
};