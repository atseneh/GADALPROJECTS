import {InputBase, Typography,Button, Stack, Paper, TextField,useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import {useLocation, useNavigate } from "react-router-dom";
import useSmallScreen from "../utils/hooks/useSmallScreen";
import { useMutation } from "@tanstack/react-query";
import signIn from "../api/auth/signin";
import { useState } from "react";
import Alert from '@mui/material/Alert';
import RemoveIcon from '@mui/icons-material/Remove';
import OtpInput from 'react-otp-input';
import verifyPhone from "../api/auth/verifyPhone";
import confirmOtp from "../api/auth/confirmOtp";
export default function EnterOtp(){
    const theme = useTheme();
    const navigate = useNavigate()
    const [otp, setOtp] = useState('');
    const location = useLocation()
    const verificationDetail = location?.state?.verificationDetail
    const [verifyError,setVerifyError] = useState(false)
    const confirmOtpMutaion = useMutation({
        mutationKey:['verify_phone'],
        mutationFn:confirmOtp,
        onError:()=>{
            setVerifyError(true)
        },
        onSuccess:(data)=>{
            setVerifyError(false)
            navigate('/resetPass',{state:{data:{phoneNumber:verificationDetail?.phoneNumber,}}})
        }
    })
    const handleVerification = ()=> {
     const payload = {
        phoneNumber:verificationDetail?.phoneNumber,
        verificationId:verificationDetail?.verificationId,
        code:otp,
     }
     if(confirmOtpMutaion.isPending || otp.length<4){
        return;
     }
     confirmOtpMutaion.mutate(payload)
    // navigate('/resetPass')
    }
    
    return (
        <div
        style={{
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            height:'100vh',
            background:'#f2f2f3'
        }}
        >
        <Paper
        sx={{
            p:2,
            borderRadius:'0px',
        }}
        >
        <Stack
        spacing={3}
        >
             {
        verifyError&& (
            <Alert sx={{m:1,}} severity="error">
                {
                    confirmOtpMutaion.error?.message
                }
            </Alert>
        )
       }
            <Typography
            sx={{
                alignSelf:'center'
            }}
            variant="h5"
            >
            Enter Verification Code
            </Typography>
            <OtpInput
      value={otp}
      onChange={setOtp}
      numInputs={4}
      renderSeparator={<RemoveIcon fontSize="small" sx={{fontSize:'.7rem'}}/>}
      renderInput={(props) => <input {...props} type="number"/>}
      inputStyle={{
        margin:'8px',
        width:40,
        height:30,
        border:`1px solid ${theme.palette.primary.main}`
      }}
    />
        <Stack
        direction={'row'}
        alignItems={'center'}
        spacing={1}
        alignSelf={'center'}
        >
        <Button
        variant="text"
        onClick={()=>setOtp('')}
        >
            Clear
        </Button>
        <Button
        variant="contained"
        size="small"
        sx={{
            color:'white'
        }}
        onClick={handleVerification}
        disabled={confirmOtpMutaion.isPending}
        >
            Send
        </Button>
        </Stack>
        </Stack>
        </Paper>
        </div>
    )
}