import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';
interface DraftDialogProps {
    open:boolean,
    handleClose:()=>void,
    productId:string;
    handleDraft:(reason:string,productId:string)=>void,
    isSubmiting:boolean
}
export default function DraftDialog(props:DraftDialogProps) {
  const {open,handleClose,productId,handleDraft,isSubmiting} = props
  const [reason,setReason] = React.useState('')
return (
    <React.Fragment>
   
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="draft-dialog-title"
        aria-describedby="draft-dialog-description"
        PaperProps={{
            sx:{width:500}
        }}
      >
        <DialogTitle id="draft-dialog-title">
          {"Draft"}
        </DialogTitle>
        <DialogContent>
        <TextField
         fullWidth
         sx={{
            background:'#F7F7F7',
            '& ::placeholder':{
                fontWeight:'bolder',
                color:'black'
            },
        }}
         size='medium'
         placeholder='Type your reason'
         value={reason}
         onChange={(e)=>setReason(e.target.value)}
         />
        </DialogContent>
        <DialogActions>
          <Button
          sx={{color:'black',border:'1px solid black'}} size='small'
          onClick={handleClose}>cancel</Button>
          <Button 
          disabled={isSubmiting}
          sx={{color:'white'}} size='small' variant='contained' 
          onClick={()=>{
            handleDraft(
              reason,
              productId
            )
            handleClose()
          }} 
          autoFocus
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}