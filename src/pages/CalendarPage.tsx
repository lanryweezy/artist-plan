import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const CalendarPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Calendar
      </Typography>
      <Typography paragraph>
        View your schedule, deadlines, and events.
      </Typography>
      {/* Placeholder for FullCalendar or similar calendar component */}
    </Container>
  );
};

export default CalendarPage;
