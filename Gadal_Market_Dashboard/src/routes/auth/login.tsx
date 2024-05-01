import {InputBase, Typography,Button, Stack, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import {NavLink, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import signIn from "../../api/auth/signin";
import { forwardRef, useState } from "react";
import Alert from '@mui/material/Alert';
import { IMaskInput } from 'react-imask';
interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
  }
  const TextMaskCustom = forwardRef<HTMLInputElement, CustomProps>(
    function TextMaskCustom(props, ref) {
      const { onChange, ...other } = props;
      return (
        <IMaskInput
          {...other}
          mask="+{#}0*" // + followed by any number of digits
          definitions={{
            '#': /[0-9]/,
          }}          
          inputRef={ref}
          onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
          overwrite
        />
      );
    },
  );
export default function Login(){
    const navigate = useNavigate()
    const [phoneNumber,setPhoneNumber] = useState('')
      const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
    // Regular expression to check if the input is only + and numbers
    // Allows '+' only at the beginning and numbers afterwards
    if (/^\+?[0-9]*$/.test(value)) {
      setPhoneNumber(value);
    }
      };
    const [password,setPassword] = useState('');
    const [signinError,setSigninError] = useState(false)
    const signInMutation = useMutation({
        mutationKey:['signin'],
        mutationFn:signIn,
        onError:()=>{
            setSigninError(true)
        },
        onSuccess:(data)=>{
            setSigninError(false)
            localStorage.setItem('token',data?.token)
            localStorage.setItem('userId',data?.id)
            localStorage.setItem('fullName',data?.name)
            
            if(typeof data?.level === 'number'){
                localStorage.setItem('plx',data?.level)
            }
            
            // socket.auth = { userID:data?._id};
            // socket.connect();
            navigate('/')
            window.location.reload();
        }
    })
    const handleSignin = ()=> {
     const payload = {
        emailOrPhone:phoneNumber,
        password,
     }
     if(signInMutation.isPending){
        return;
     }
     signInMutation.mutate(payload)
    }
    console.log(signInMutation.error)
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
       <Paper sx={{borderRadius:0,}}>
        
       {
        signinError&& (
            <Alert sx={{m:1,alignItems:'center'}} severity="error">
                {
                    signInMutation.error?.message
                }
             
            </Alert>
        )
       }
       <Box
        sx={{
            p:2,
            height:'80vh',
            display:'flex',
            flexDirection:'column',
            justifyContent:'center',
            gap:1,
        }}
        component={'form'}
        onSubmit={(e)=>{
            e.preventDefault();
            handleSignin();
        }}
        >
            <Box sx={{display:'flex',justifyContent:'center',flexDirection:'column',gap:2}}>
            <Typography fontWeight={'bold'} variant={"h4"}  sx={{textTransform:'capitalize',textAlign:'center'}}>
                {
                    'Sign in'
                }
            </Typography>
        <Box
         sx={{
         width:400,
         p: '2px 4px', 
         display: 'flex',  
         background:'#EFEFEF',
         alignItems: 'center',
         borderRadius:"10px",
         height:50
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
        placeholder="Phone Number"
        inputProps={{ 'aria-label': 'email or phone number' }}
        name="phoneNumber"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        required
        // inputComponent={TextMaskCustom as any}
      />
      
         </Box>
         <Box
         sx={{
            width:400,
            p: '2px 4px',
            display: 'flex',
            background:'#EFEFEF',
            alignItems: 'center',
            borderRadius:"10px",
            height:50
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
        placeholder="Password"
        type="password"
        inputProps={{ 'aria-label': 'password' }}
        required
        name="password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
      />
      
         </Box>
        <Box 
        sx={{
            alignSelf:'center',
            display:'flex',
            flexDirection:'column',
            gap:1,
            }}>
        <NavLink
        to={'/forgot_password'}
        >
        <Typography>
            Forgot Password?
         </Typography>
        </NavLink>
         <Button
                variant='contained'
                type="submit"
                disabled={signInMutation.isPending}
                sx={{
                    display:'flex',
                    alignItems:'center',
                    color:'white',
                    width:150,
                    p:1,
                    borderRadius:'20px'
                }}
                >
                    <Typography>Sign in</Typography>
                </Button>             
        </Box>
            </Box>
        </Box>
       </Paper>    
       </Box>
        </>
    )
}