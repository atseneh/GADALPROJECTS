import * as React from 'react'
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Snackbar } from '@mui/material';
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  interface alertProps {
    handleSnackBarClose:()=>void,
    open:boolean;
    severity:'error'|'success'|undefined;
    errorMessage?:string;
    successMessage?:string;
  }
  export default function CustomAlert(props:alertProps){
    const {
      open,severity,handleSnackBarClose,
      errorMessage="Something went wrong",
      successMessage="Saved Successfully"
        } = props
  return (
    <Snackbar anchorOrigin={{
        vertical:'top',
        horizontal:'right'
      }} open={open} autoHideDuration={2000} onClose={handleSnackBarClose}>
      <Alert onClose={handleSnackBarClose} severity={severity} sx={{ width: '100%' }}>
        {
         severity==="error" ?errorMessage.toString():successMessage
        }
      </Alert>
    </Snackbar>
  )
  }