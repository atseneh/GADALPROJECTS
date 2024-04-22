import { Box, Paper,Typography,InputBase,Button,MenuItem, TextField, IconButton, FormControl, InputLabel, Select, SelectChangeEvent } from "@mui/material";
import * as React from 'react'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useMutation } from "@tanstack/react-query";
import createAdmin from "../api/createAdmin";
import CustomAlert from "./customAlert";
import registerAdmin from "../api/auth/registerAdmin";
export const previlages = [
  {
    description :'Propery Admin',
    value:1,
  },
  {
    description :'Machinery Admin',
    value:2,
  },
  {
    description :'Veichel Admin',
    value:3,
  },
  {
    description :'Others Admin',
    value:4,
  },

]
export default function CreateMainAdmin(){
    const [firstName,setFirstName] = React.useState('')
    const [lastName,setLastName] = React.useState('')
    const [phoneNumber,setPhoneNumber] = React.useState('')
    const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
  // Regular expression to check if the input is only + and numbers
  // Allows '+' only at the beginning and numbers afterwards
  if (/^\+?[0-9]*$/.test(value)) {
    setPhoneNumber(value);
  }
    };
    const [password,setPassword] = React.useState('')
    const [showPassword,setShowPassword] = React.useState(false)
    const [selectedPrevilage,setSelectedPrevilage] = React.useState('1')
    const handleChange = (event: SelectChangeEvent) => {
      setSelectedPrevilage(event.target.value );
    };
    const [notificationSnackbarOpen,setNotificationSnackbarOpen] = React.useState(false)
    const [notificationSeverity,setNotficationSeverity] = React.useState<'error'|'success'|undefined>()
    const handleNotificationSnackbarClose = ()=>{
      setNotificationSnackbarOpen(false)
    }

    const mutaion = useMutation({
      mutationKey:['create_admin'],
      mutationFn:registerAdmin,
      onSuccess:()=>{
        setNotficationSeverity('success')
      },
      onError:()=>{
        setNotficationSeverity('error')
      },
      onSettled:()=>{
        setNotificationSnackbarOpen(true)
      }
    })
    const handleAdminCreation = ()=>{
      const payload = {
        phoneNumber,
        password,
        adminAcessLevel:Number(selectedPrevilage),
        lastName,
        firstName,
      }
      if(mutaion.isPending){
        return;
      }
      mutaion.mutate(payload)
    }
    return (
        <Paper sx={{borderRadius:'8x',alignSelf:'center',p:2,mt:'5%'}}>
       <Box
        sx={{p:2}}
        >
            <Box 
            sx={{
              display:'flex',
              justifyContent:'center',
              flexDirection:'column',
              gap:2
              }}
              component={'form'}
              onSubmit={(e)=>{
                e.preventDefault();
                handleAdminCreation();
              }}
              >
            <Typography fontWeight={'bold'} variant={"h4"} textAlign={'center'}>
                {
                    'Create Admin'
                }
            </Typography>
            <Box
         sx={{width:380,p: '2px 4px', display: 'flex',  
         background:'#EFEFEF',
         alignItems: 'center',borderRadius:"10px",height:45}}
         >
        <img width={16} src="/icons/icons8_Email_1.svg" style={{marginLeft:'6px'}}/>
       <InputBase
        sx={{ ml: 1, flex: 1,fontWeight:'bold',}}
        placeholder="First Name"
        value={firstName}
        onChange={(e)=>setFirstName(e.target.value)}
        required
      />
      
         </Box>
         <Box
  
         sx={{width:380,p: '2px 4px', display: 'flex',  
         background:'#EFEFEF',
         alignItems: 'center',borderRadius:"10px",height:45}}
         >
        <img width={16} src="/icons/icons8_Email_1.svg" style={{marginLeft:'6px'}}/>
       <InputBase
        sx={{ ml: 1, flex: 1,fontWeight:'bold',}}
        placeholder="Last Name"
        value={lastName}
        onChange={(e)=>setLastName(e.target.value)}
      />
      
         </Box>
            <Box
         
         sx={{width:380,p: '2px 4px', display: 'flex',  
         background:'#EFEFEF',
         alignItems: 'center',borderRadius:"10px",height:45}}
         >
        <img width={16} src="/icons/icons8_Email_1.svg" style={{marginLeft:'6px'}}/>
       <InputBase
        sx={{ ml: 1, flex: 1,fontWeight:'bold',}}
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        required
      />
      
         </Box>
         <Box
         sx={{width:380,p: '2px 4px', display: 'flex',
         background:'#EFEFEF',
         alignItems: 'center',borderRadius:"10px",height:45}}
         >
         <img width={16} src="/icons/icons8_password.svg" style={{marginLeft:'6px'}}/>
        <InputBase
        sx={{ ml: 1, flex: 1,fontWeight:'bold' }}
        placeholder="Password"
        type={showPassword?"text":"password"}
        value={password}
        onChange={(e)=>setPassword(e.target.value)} 
        required
      />
         <IconButton
         onClick={()=>setShowPassword(!showPassword)}
         >
            {
                showPassword?(<VisibilityOffIcon/>):(<VisibilityIcon/>)
            }
         </IconButton>
         </Box>
      
         <FormControl 
         fullWidth
         required
         >
  <InputLabel id="previlage-selector">Previlage</InputLabel>
  <Select
    labelId="previlage-selector"
    id="previlage-select"
    value={selectedPrevilage}
    label="Previlage"
    onChange={handleChange}
  >
    {
      previlages?.map((previlage)=>(
        <MenuItem value={previlage.value} key = {previlage.value}>
          {previlage.description}
        </MenuItem>
      ))
    }
  </Select>
</FormControl>
      
                <Button 
                disabled = {mutaion.isPending}
                type="submit"                  
                 sx={{color:'white',borderRadius:'30px',p:1,alignSelf:'center'}}
                 variant="contained"
                 size="small"
                 >
                    <Typography variant="body2">
                        Create admin
                    </Typography>
                        </Button>
            </Box>
        </Box>
        {
           notificationSnackbarOpen&&(
            <CustomAlert
            open={notificationSnackbarOpen}
            handleSnackBarClose = {handleNotificationSnackbarClose}
            severity={notificationSeverity}
            errorMessage={mutaion.error?.message}
            successMessage="Admin Successfully created"
            />
           )
          }
       </Paper>
    )
}