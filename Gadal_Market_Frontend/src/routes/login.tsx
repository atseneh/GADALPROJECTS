import {useTheme, InputBase, Typography, alpha, styled, Button, Stack, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import capitalizeFirstLetter from "../utils/helpers/capitalizeFirstLetter";
import { Navigate, useNavigate } from "react-router-dom";
import useSmallScreen from "../utils/hooks/useSmallScreen";
export function LoginWithButton(props:{type:string}){
  const {type} = props
  return (
    <Box
                sx={{
                  display:'flex',alignItems:'center',gap:1,
                  background:'white',
                  border:'1px solid #8F8F8F',
                  borderRadius:'8px',p:.7,pr:1,
                  width:230,
                  color:'#8F8F8F'
                }}
                >
                  <img width={24} src={`/images/${type}Logo.svg`}/>
                  <Typography
                  fontWeight={'bolder'}
                  
                  >{`Continue With ${capitalizeFirstLetter(type)}`}</Typography>
                </Box>
  )
}

export default function Login(){
    const navigate = useNavigate()
    const smallScreen = useSmallScreen()

    return (
        <>
       <Box
       sx={{
        display:'flex',
        alignItems:'flex-start',
        height:'71vh',
        justifyContent:'center',
        mt:2,
       }}
       >
       <Paper sx={{borderRadius:0}}>
       <Box
        sx={{p:smallScreen?3:7.9,pt:5,}}
        >
            <Box sx={{display:'flex',justifyContent:'center',flexDirection:'column',gap:2}}>
            <Typography fontWeight={'bold'} variant={smallScreen?'h6':"h4"}  sx={{textTransform:'capitalize',mb:smallScreen?1:2,textAlign:'center'}}>
                {
                    smallScreen?'Singin':'sign in to gadal market'
                }
            </Typography>
            <Box
         component={'form'}
         sx={{width:smallScreen?270:400,p: '2px 4px', display: 'flex',  
         background:'#EFEFEF',
         alignItems: 'center',borderRadius:"10px",height:smallScreen?40:50}}
         >
        <img width={16} src="/images/icons8_Email_1.svg" style={{marginLeft:'6px'}}/>
                 <InputBase
        sx={{ ml: 1, flex: 1,fontWeight:'bold' }}
        placeholder="Email Or Phone Number"
        inputProps={{ 'aria-label': 'search gadal market' }}
      />
      
         </Box>
         <Box
         component={'form'}
         sx={{width:smallScreen?270:400,p: '2px 4px', display: 'flex',
         background:'#EFEFEF',
         alignItems: 'center',borderRadius:"10px",height:smallScreen?40:50}}
         >
         <img width={16} src="/images/icons8_password.svg" style={{marginLeft:'6px'}}/>
                 <InputBase
        sx={{ ml: 1, flex: 1,fontWeight:'bold' }}
        placeholder="Password"
        type="password"
        inputProps={{ 'aria-label': 'search gadal market' }}
      />
      
         </Box>
        <Box sx={{alignSelf:'center'}}>
        <Typography>
            Forgot Password?
         </Typography>
         <Button
                variant='contained'
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
                    <Typography>Sign in</Typography>
                </Button>
                <Typography variant="h6" sx={{mt:smallScreen?1:2,ml:8,color:'#535252',fontWeight:'bold'}}>
                    OR
                </Typography>
                 
        </Box>
        <Stack spacing={1} sx={{ml:smallScreen?2:11}}>
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
          Hello, Friends
          </Typography>
          <Typography variant="h6" sx={{maxWidth:300,color:'white',fontWeight:'lighter'}}>
            Enter Your Personal Detail And Continue Your Journey with Us
          </Typography>
          <Button
                variant='contained'
                onClick={()=>navigate('/register')}
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
                    <Typography fontSize={'1rem'} variant="h6" fontWeight={'bold'}>REGISTER</Typography>
                    </Button>
                  
         </Box>
        </Box>
            )
        }
        
       </Box>
        </>
    )
}