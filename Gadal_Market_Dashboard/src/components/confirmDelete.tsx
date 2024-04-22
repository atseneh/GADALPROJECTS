import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Stack, TextField, Typography } from '@mui/material';
interface ConfirmeDeleteProps {
    open:boolean,
    handleClose:()=>void,
    title:string; 
    handleDelete:()=>void,
}
export default function ConfirmDeleteDialog(props:ConfirmeDeleteProps) {
  const {open,handleClose,handleDelete,title} = props
return (
    <React.Fragment>
   
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delte-dialog-title"
        aria-describedby="delte-dialog-description"
        PaperProps={{
            sx:{width:'100%'}
        }}
      >
        {/* <DialogTitle id="delte-dialog-title">
          {"Delete"}
        </DialogTitle> */}
        <DialogContent>
         <Stack direction={'row'} spacing={1} alignItems={'center'}>
            <WarningAmberIcon fontSize='large' color='warning'/>
            <Typography variant='h6' fontWeight={'bold'}>
                Are you sure you want to delete {title}
            </Typography>
         </Stack>
        </DialogContent>
        <DialogActions>
          <Button
          sx={{color:'black',border:'1px solid black'}} size='small'
          onClick={handleClose}>cancel</Button>
          <Button color='error' size='small' variant='contained' onClick={handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}