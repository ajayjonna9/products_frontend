import React from 'react';
import { Snackbar, Alert } from '@mui/material';


const NotificationSnackbar = ({ message, severity, onClose }) => {
  return (
    <Snackbar
      open={!!message} 
      autoHideDuration={5000}
      onClose={onClose}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
export default NotificationSnackbar