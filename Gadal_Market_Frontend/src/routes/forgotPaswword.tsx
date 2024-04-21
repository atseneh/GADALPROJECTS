import {InputBase, Typography,Button, Paper, Alert } from "@mui/material";
import Box from "@mui/material/Box";
import {useNavigate } from "react-router-dom";
import useSmallScreen from "../utils/hooks/useSmallScreen";
import { useMutation } from "@tanstack/react-query";
import {useState } from "react";
import getOtp from "../api/auth/getOtp";
export default function ForgotPassword(){
    const navigate = useNavigate()
    const smallScreen = useSmallScreen()
    const [phoneNumber,setPhoneNUmber] = useState('')
    const getOtpMutation = useMutation({
        mutationKey:['get_otp'],
        mutationFn:getOtp,
        onSuccess:(data)=>{
        navigate('/is_it_you',{state:{verificationDetail:{verificationId:data?.verificationId,phoneNumber:phoneNumber}}})
        },
        onError:()=>{

        }
    })
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
       <Paper 
       sx={{
        borderRadius:0,
        }}>
         
       <Box
        sx={{
            p:smallScreen?3:7.9,
            // pt:2,
            height:'80vh',
            justifyContent:'center',
            display:'flex',
            flexDirection:'column',
        }}
        component={'form'}
        onSubmit={(e)=>{
            e.preventDefault();
            if(getOtpMutation.isPending){
                return
            }
            getOtpMutation.mutate(phoneNumber)
        }}
        >
             {
        getOtpMutation.error&& (
            <Alert sx={{m:1,alignItems:'center'}} severity="error">
                {
                    getOtpMutation.error.message
                }
               
            </Alert>
        )
       }
            <Box sx={{display:'flex',justifyContent:'center',flexDirection:'column',gap:2}}>
            <Typography fontWeight={'bold'} variant={'h6'}  sx={{textTransform:'capitalize',mb:smallScreen?1:2,textAlign:'center'}}>
                {
                    'Enter Phone number'
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
         src="/images/icons8_Email_1.svg" 
         style={{marginLeft:'6px'}}
         />
        <InputBase
        sx={{
             ml: 1,
             flex: 1,
             fontWeight:'bold' 
            }}
            placeholder="Your phone number here please"
        type="number"
        inputProps={{ 'aria-label': 'phoneNumber' }}
        required
        name="phoneNumber"
        value={phoneNumber}
        onChange={(e)=>setPhoneNUmber(e.target.value)}
      />
      
         </Box>
        <Box sx={{alignSelf:'center'}}>
         <Button
                variant='contained'
                type="submit"
                disabled={getOtpMutation.isPending}
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
                         Next   
                    </Typography>
                </Button>
             
                 
        </Box>
            </Box>
        </Box>
       </Paper>
        
       </Box>
    
        </>
    )
}