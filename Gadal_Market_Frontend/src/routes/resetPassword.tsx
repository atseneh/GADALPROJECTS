import {InputBase, Typography,Button, Stack, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import capitalizeFirstLetter from "../utils/helpers/capitalizeFirstLetter";
import {useLocation, useNavigate } from "react-router-dom";
import useSmallScreen from "../utils/hooks/useSmallScreen";
import { useMutation } from "@tanstack/react-query";
import signIn from "../api/auth/signin";
import { useEffect, useState } from "react";
import Alert from '@mui/material/Alert';
import { socket } from "../api/socket";
import getOtp from "../api/auth/getOtp";
import changePassword from "../api/auth/changePassword";
import CustomAlert from "../components/common/customAlert";
import resetPass from "../api/auth/resetPassword";
export default function ResetPassword(){
    const navigate = useNavigate()
    const location = useLocation()
    const verificationDetail = location?.state?.data
    const smallScreen = useSmallScreen()
    const [newPassword,setNewPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('')
    const [passwordsDontMatchError,setPasswordsDontMatchError] = useState(false)
    const [changePassError,setChnagePassError] = useState(false)
    const [notificationSnackbarOpen,setNotificationSnackbarOpen] = useState(false)
    const handleNotificationSnackbarClose = ()=>{
      setNotificationSnackbarOpen(false)
    }
    const {mutate:reset,isPending,error} = useMutation({
        mutationKey:['change_password'],
        mutationFn:resetPass,
        onSuccess:(data)=>{
        setChnagePassError(false)
        setNotificationSnackbarOpen(true)
        navigate('/login');
        },
        onError:()=>{
        setChnagePassError(true)
        },
        onSettled:()=>{

        }
    })
    const handlePasswordChange = ()=> {
     const payload = {
        password:confirmPassword,
        phoneNumber:verificationDetail?.phoneNumber
     }
     if(isPending){
        return;
     }
     reset(payload)
    }
        useEffect(()=>{
            if(newPassword && confirmPassword){
                if(newPassword !== confirmPassword){
                 setPasswordsDontMatchError(true);
                 return;   
                }
                setPasswordsDontMatchError(false)
            }
            },[newPassword,confirmPassword])
    return (
        <>
       <Box
       sx={{
        display:'flex',
        alignItems:'flex-start',
        
        justifyContent:'center',
        mt:2,
       }}
       >
       <Paper sx={{borderRadius:0}}>
       <Box
        sx={{
            p:smallScreen?3:7.9,
            pt:2,
            height:'80vh',
            display:'flex',
            flexDirection:'column',
            justifyContent:'center'
        }}
        component={'form'}
        onSubmit={(e)=>{
            e.preventDefault();
            handlePasswordChange();
        }}
        >
              {
        changePassError&& (
            <Alert sx={{m:1,alignItems:'center'}} severity="error">
                {
                    error?.message
                }
            </Alert>
        )
       }
            <Box sx={{display:'flex',justifyContent:'center',flexDirection:'column',gap:2}}>
            <Typography fontWeight={'bold'} variant={'h6'}  sx={{textTransform:'capitalize',mb:smallScreen?1:2,textAlign:'center'}}>
                {
                    'Reset Your Password'
                }
            </Typography>
       
         <Box
         sx={{
            width:smallScreen?270:400,
            p: '2px 4px',
            display: 'flex',
            background:'#EFEFEF',
            alignItems: 'center',
            borderRadius:"10px",
            height:smallScreen?40:50
        }}
         >
         <img 
          width={16} 
          src="/images/icons8_password.svg" 
          style={{marginLeft:'6px'}}
          />
        <InputBase
        sx={{
             ml: 1,
             flex: 1,
             fontWeight:'bold' 
            }}
            placeholder="New Password"
        type="password"
        inputProps={{ 'aria-label': 'password' }}
        required
        name="password"
        value={newPassword}
        onChange={(e)=>setNewPassword(e.target.value)}
      />
      
         </Box>
         <Box
         sx={{
            width:smallScreen?270:400,
            p: '2px 4px',
            display: 'flex',
            background:'#EFEFEF',
            alignItems: 'center',
            borderRadius:"10px",
            height:smallScreen?40:50
        }}
         >
         <img 
          width={16} 
          src="/images/icons8_password.svg" 
          style={{marginLeft:'6px'}}
          />
        <InputBase
        sx={{
             ml: 1,
             flex: 1,
             fontWeight:'bold' 
            }}
            placeholder="Confirm Password"
        type="password"
        inputProps={{ 'aria-label': 'password' }}
        required
        name="password"
        value={confirmPassword}
        onChange={(e)=>setConfirmPassword(e.target.value)}
      />
      
         </Box>
        {
            passwordsDontMatchError && (
                <Typography
                variant="body2"
                color={'error'}
                sx={{
                    alignSelf:'center'
                }}
                >
                   Passwords do not match 
                </Typography>
            )
        }
        <Box sx={{alignSelf:'center'}}>
         <Button
                variant='contained'
                type="submit"
                disabled={isPending}
                sx={{
                    mt:smallScreen?2:3,
                    display:'flex',
                    alignItems:'center',
                    color:'white',
                    width:150,
                    p:1,
                    borderRadius:'20px'
                }}
                >
                    <Typography>
                        Reset
                    </Typography>
                </Button>
             
                 
        </Box>
            </Box>
        </Box>
       </Paper>
        
       </Box>
       {
         
            notificationSnackbarOpen&&(
             <CustomAlert
             open={notificationSnackbarOpen}
             handleSnackBarClose = {handleNotificationSnackbarClose}
             severity={'success'}
             successMessage="Password Changed successfully"
             // errorMessage={postMutation.error as string}
             />
            )
           
       }
        </>
    )
}