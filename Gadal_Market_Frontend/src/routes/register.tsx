import {useTheme,Typography, Checkbox, Button, Stack, Paper, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import { LoginWithButton } from "./login";
import { useNavigate } from "react-router-dom";
import useSmallScreen from "../utils/hooks/useSmallScreen";
import { useMutation } from "@tanstack/react-query";
import registerUser from "../api/user/registerUser";
import { useState } from "react";
export default function Register(){
const navigate = useNavigate()
const theme = useTheme()
const smallScreen = useSmallScreen()
const [firstName,setFirstName] = useState('')
const [lastName,setLastName] = useState('')
const [emailOrPhone,setEmailOrPhone] = useState('')
const [city,setCity] = useState('')
const [subCity,setSubCity] = useState('')
const [region,setRegion] = useState('')
const [wereda,setWereda] = useState('')
const [password,setPassword] = useState('')
const [confirmPassword,setConfirmPassword] = useState('')
const registerMutation = useMutation({
    mutationKey:['registerUser'],
    mutationFn:registerUser,
    onSuccess:()=>{
        navigate('/login')
    }
})
const handleRegistration = ()=>{
  let userPayload = {
    firstName,
    lastName,
    phoneNumber:emailOrPhone,
    email:emailOrPhone,
    subCity,
    wereda,
    isAdmin:false,
    city,
    region,
    password:confirmPassword
  }
  registerMutation.mutate(userPayload)
}
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
                
         <TextField value={firstName} onChange={(e)=>setFirstName(e.target.value)}  id="first-name" label="First Name"  required />
         <TextField value={lastName} onChange={(e)=>setLastName(e.target.value)} id="last-name" label="Last Name" required  />
        
            </Box>
            <TextField autoComplete="off" id="user-emailOrphone" name="emailOrPhone" value={emailOrPhone} onChange={(e)=>setEmailOrPhone(e.target.value)} label="Email Or Phone Number" required />
            <Box
            sx={{display:'flex',alignItems:'center',gap:1}}
            >
                
         <TextField value={city} onChange={(e)=>setCity(e.target.value)}  id="city" label="City"   />
         <TextField value={subCity} onChange={(e)=>setSubCity(e.target.value)} id="subCity" label="Sub City"   />
        
            </Box>
            <Box
            sx={{display:'flex',alignItems:'center',gap:1}}
            >
                
         <TextField value={region} onChange={(e)=>setRegion(e.target.value)}  id="region" label="Region"   />
         <TextField value={wereda} onChange={(e)=>setWereda(e.target.value)} id="wereda" label="Woreda"   />
            </Box>
            <TextField type="password" value={password} onChange={(e)=>setPassword(e.target.value)} id="newPass" label="Password" required/>
            <TextField type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} id="confirmPass" label="Confirm Password" required/>
       
        
       <Box sx={{ml:smallScreen?0:3,display:'flex',alignItems:'center',gap:.3}}>
        <Checkbox size="small"/>
       <Typography variant="caption" sx={{fontSize:smallScreen?'0.7rem':''}}>
            I Accept Terms And Conditions Policy Agreement
         </Typography>
       </Box>
         <Box sx={{alignSelf:'center'}}>
         <Button
                onClick={handleRegistration}
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
        
       </Box>
    )
}