import {useTheme,Typography, Checkbox, Button, Stack, Paper, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import { LoginWithButton } from "./login";
import { useNavigate } from "react-router-dom";
import useSmallScreen from "../utils/hooks/useSmallScreen";
import { useMutation } from "@tanstack/react-query";
import signUp from "../api/auth/signup";
import { useEffect, useState } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, {Dayjs} from 'dayjs'
import CustomAlert from "../components/common/customAlert";
export default function Register(){
const navigate = useNavigate()
const theme = useTheme()
const smallScreen = useSmallScreen()
const [firstName,setFirstName] = useState('')
const [lastName,setLastName] = useState('')
const [phoneNumber,setPhoneNumber] = useState('')
const [email,setEmail] = useState('')
const [city,setCity] = useState('')
const [subCity,setSubCity] = useState('')
const [region,setRegion] = useState('')
const [wereda,setWereda] = useState('')
const [password,setPassword] = useState('')
const [confirmPassword,setConfirmPassword] = useState('')
const [birthDate, setBirthDate] = useState<Dayjs | null>(null);
const [acceptTerms,setAccetpTerms] = useState(false);
const [passwordsDontMatchError,setPasswordsDontMatchError] = useState(false)
const [birthDateError,setBirthDateError] = useState(false)
const [notificationSnackbarOpen,setNotificationSnackbarOpen] = useState(false)
    const handleNotificationSnackbarClose = ()=>{
      setNotificationSnackbarOpen(false)
    }
const registerMutation = useMutation({
    mutationKey:['registerUser'],
    mutationFn:signUp,
    onSuccess:()=>{
        navigate('/login')
    },
    onError:(error)=>{
      console.log(error)
      setNotificationSnackbarOpen(true)
    }
})
const handleRegistration = ()=>{
  let userPayload = {
    firstName,
    lastName,
    phoneNumber, 
    email,
    subCity,
    wereda,
    city,
    region,
    password:confirmPassword,
    birthDate:dayjs(birthDate).format('DD/MM/YYYY')
  }
  if(birthDateError || passwordsDontMatchError || !acceptTerms){
    return;
  }
  registerMutation.mutate(userPayload)
}
useEffect(()=>{
if(password && confirmPassword){
    if(password !== confirmPassword){
     setPasswordsDontMatchError(true);
     return;   
    }
    setPasswordsDontMatchError(false)
}
},[password,confirmPassword])
useEffect(()=>{
if(birthDate){
const today = dayjs();
const age = today.diff(birthDate,'year')
setBirthDateError(age < 18)
}
},[birthDate])
    return (
        <Box
       sx={{
        display:'flex',
        alignItems:'flex-start',
        height:'75vh',
        justifyContent:'center',
        mt:2,
        flexDirection:'row-reverse'
       }}
       >
       <Paper sx={{borderRadius:0}}>
       <Box
        sx={{p:smallScreen?0:7,pt:0,pb:0.7}}
        component={'form'}
        onSubmit={(e)=>{
            e.preventDefault();
            handleRegistration();
        }}
        >
            <Box sx={{display:'flex',justifyContent:'center',flexDirection:'column',gap:1}}>
            <Typography fontWeight={'bold'} variant={smallScreen?'h6':"h4"}  sx={{textTransform:'capitalize',mb:1,textAlign:smallScreen?'center':''}}>
                {
                    smallScreen ? 
                    ("Register")
                    :
                    
                        (
                           <>
                             <span>Register to</span>
                             <span style={{color:theme.palette.primary.main,marginLeft:theme.spacing(1)}}>Gadal market</span>
                           </>
                        )
                    
                    
                }

            </Typography>
            <Box
            sx={{display:'flex',alignItems:'center',gap:1}}
            >
                
         <TextField 
           value={firstName} 
           onChange={(e)=>setFirstName(e.target.value)}  
           id="first-name" label="First Name"  
           required 
           fullWidth
           />
         <TextField 
         value={lastName} 
         onChange={(e)=>setLastName(e.target.value)} 
         id="last-name" 
         label="Last Name" 
         required
         fullWidth
         />
        
            </Box>
            <TextField 
            autoComplete="off" 
            id="user-emailOrphone" 
            name="phoneNumber" 
            value={phoneNumber} 
            onChange={(e)=>setPhoneNumber(e.target.value)} 
            label={"Phone Number"} 
            required 
            />
            <TextField 
            autoComplete="off" 
            id="user-emailOrphone" 
            name="email" 
            value={email} 
            onChange={(e)=>setEmail(e.target.value)} 
            label={"Email"} 
            type="email"
            />
            <Box
            sx={{display:'flex',alignItems:'center',gap:1}}
            >
                
         <TextField 
           value={city} 
           onChange={(e)=>setCity(e.target.value)}  
           id="city" 
           label="City"  
           fullWidth
           required
            />
         <TextField 
           value={subCity} 
           onChange={(e)=>setSubCity(e.target.value)} 
           id="subCity" 
           label="Sub City" 
           required
           fullWidth
           />
        
            </Box>
            <Box
            sx={{display:'flex',alignItems:'center',gap:1}}
            >
                
         <TextField 
           value={region} 
           onChange={(e)=>setRegion(e.target.value)}  
           id="region" 
           label="Region"   
           required
           fullWidth
           />
         <DatePicker 
          value={birthDate} 
          onChange={(newValue) => setBirthDate(newValue)}
          sx={{
            width:'100%'
          }}
          label="Birth Date"
          slotProps={{
            textField:{
              helperText:birthDateError ? 'Your age should be above 18' : '' ,
              error:birthDateError
            }
          }}
          />
            </Box>
            <TextField 
             type="password" 
             value={password} 
             onChange={(e)=>setPassword(e.target.value)} 
             id="newPass" 
             label="Password" 
             required/>
            <TextField 
            type="password" 
            value={confirmPassword} 
            onChange={(e)=>setConfirmPassword(e.target.value)} 
            id="confirmPass" 
            label="Confirm Password" 
            required
            error={passwordsDontMatchError}
            helperText={passwordsDontMatchError ? "Passwords do not match" :''}
            />
       
        
       <Box sx={{ml:smallScreen?0:3,display:'flex',alignItems:'center',gap:.3}}>
        <Checkbox 
        size="small"
        onChange={(e)=>setAccetpTerms(e.target.checked)}
        />
       <Typography variant="caption" sx={{fontSize:smallScreen?'0.7rem':''}}>
            I Accept Terms And Conditions Policy Agreement
         </Typography>
       </Box>
         <Box sx={{alignSelf:'center'}}>
         <Button
                type="submit"
                disabled={!acceptTerms || registerMutation.isPending}
                variant='contained'
                sx={{
                    mt:1,
                    display:'flex',
                    alignItems:'center',
                    color:'white',
                    width:300,
                    p:1,
                }}
                >
                    <Typography>CREATE</Typography>
                </Button>
                <Typography variant="h6" sx={{mt:1,ml:15,color:'#535252',fontWeight:'bold'}}>
                    OR
                </Typography>
                 
        </Box>
        <Stack spacing={1} sx={{ml:smallScreen?4:11}}>
            <LoginWithButton type="google"/>
            <LoginWithButton type="facebook"/>  
        </Stack>
            </Box>
        </Box>
       </Paper>
       {
        !smallScreen&&(
            <Box
            sx={{
                display:'flex',
                flexDirection:'column',
                gap:1,
                height:'100%',
                background:'url(/images/Background.svg)',
                backgroundSize:'cover',                   
                backgroundRepeat:'no-repeat',
                backgroundPosition: 'center center',
                p:8,
                width:400,
            }}
            >
             <Box sx={{alignSelf:'center',display:'flex',flexDirection:'column',gap:2,mt:4}}>
             <Typography sx={{color:'white',fontWeight:'bold'}} variant="h3">
              Welcome, Back
              </Typography>
              <Typography variant="h6" sx={{maxWidth:350,color:'white',fontWeight:'lighter'}}>
                To Keep Continued With Us Please Login With Your Personal Info
              </Typography>
              <Button
                    
                    variant='contained'
                    onClick={()=>navigate('/login')}
                    sx={{
                        mt:4,
                        alignSelf:'center',
                        display:'flex',
                        alignItems:'center',
                        color:'black',
                        width:160,
                        background:'white',
                        p:1,
                        borderRadius:'20px'
                    }}
                    >
                        <Typography fontSize={'1rem'} variant="h6" fontWeight={'bold'}>Login</Typography>
                        </Button>
                      
             </Box>
            </Box>
        )
       }
        {
           notificationSnackbarOpen&&(
            <CustomAlert
            open={notificationSnackbarOpen}
            handleSnackBarClose = {handleNotificationSnackbarClose}
            severity={'error'}
            errorMessage={registerMutation.error?.message}
            />
           )
          }
       </Box>
    )
}