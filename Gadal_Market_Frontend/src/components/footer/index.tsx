import {
    Box,
    Typography,
    useTheme
    } from '@mui/material'
import TelegramIcon from '@mui/icons-material/Telegram';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import XIcon from '@mui/icons-material/X';
import LinkedinIcon from '@mui/icons-material/LinkedIn';
import {NavLink } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
export default function Footer(){
 const theme = useTheme()
    return (
        <Box>
            <Box
        sx={{
            width:'100%',
            display:'flex',
            alignItems:'center',
            justifyContent:'space-between',
            background:'rgb(82 82 82)',
            p: 3, 
            mt:1,
            
        }}
        >
        <Box sx={{display:'flex',flexDirection:'column',gap:1}}>
         <Typography sx={{fontWeight:'bolder'}} variant='h6' color={theme.palette.primary.main}>
            Company
         </Typography>
         <NavLink
          to='/'
          style={{textDecoration:'none'}}
          >
          <NavLink
           to={`/`}
           style={({isTransitioning }) => {
               return {
                 color:'black',
                 textDecoration:'none',
                 viewTransitionName: isTransitioning ? "slide" : "",
               };
             }}
          >
          <Typography variant='h6' color={'white'}>
            Home
         </Typography>
          </NavLink>
         </NavLink>
          <NavLink
           to={`https://gadaltechnologies.com/#about`}
           style={({isTransitioning }) => {
               return {
                 color:'black',
                 textDecoration:'none',
                 viewTransitionName: isTransitioning ? "slide" : "",
               };
             }}
          >
          <Typography variant='h6' color={'white'}>
            About
         </Typography>
          </NavLink>
          <NavLink
           to={`https://gadaltechnologies.com/#about`}
           style={({isTransitioning }) => {
               return {
                 color:'black',
                 textDecoration:'none',
                 viewTransitionName: isTransitioning ? "slide" : "",
               };
             }}
          >
          <Typography variant='h6' color={'white'}>
            Contact
         </Typography>
          </NavLink>
        </Box>
        {/* -------------------------------------- */}
        <Box sx={{display:'flex',flexDirection:'column',gap:1}}>
         <Typography sx={{fontWeight:'bolder'}} variant='h6' color={theme.palette.primary.main}>
            Account
         </Typography>
           <NavLink
            style={({isTransitioning }) => {
               return {
                 color:'black',
                 textDecoration:'none',
                 viewTransitionName: isTransitioning ? "slide" : "",
               };
             }}
           to="/pirvacy_policy"
           target='_blank'
           >
           <Typography variant='h6' color={'white'}>
            Privacy Policy
         </Typography>
           </NavLink>
         <NavLink
         to="/terms_and_conditions"
         target='_blank'
         style={({isTransitioning }) => {
            return {
              color:'black',
              textDecoration:'none',
              viewTransitionName: isTransitioning ? "slide" : "",
            };
          }}
         >
         <Typography variant='h6' color={'white'}>
            Terms & Conditions
         </Typography>
         </NavLink>
         <NavLink
         to="/saftey_tips"
         target='_blank'
         style={({isTransitioning }) => {
            return {
              color:'black',
              textDecoration:'none',
              viewTransitionName: isTransitioning ? "slide" : "",
            };
          }}
         >
         <Typography variant='h6' color={'white'}>
            Safety Tips
         </Typography>
         </NavLink>
        </Box>
        {/* ------------------------------------------------ */}
        <Box sx={{display:'flex',flexDirection:'column',gap:1}}>
         <Typography sx={{fontWeight:'bolder'}} variant='h6' color={theme.palette.primary.main}>
            Contact Us
         </Typography>
         <Typography variant='h6' color={'white'}>
            Phone : +2519 11 22 93 61
         </Typography>
         <Typography variant='h6' color={'white'}>
            Email : info@gadaltechnologies.com
         </Typography>
         <Typography variant='h6' color={'white'}>
            Address,Town : Addis Ababa
         </Typography>
        </Box>
        {/* --------------------------------------------------- */}
         <Box sx={{display:'flex',flexDirection:'column',gap:1,mr:8,overflowX:'hidden'}}>
            <img width={210} src='/Asset 7.png' alt="footer logo"/>
            <Box sx={{display:'flex',alignItems:'center',gap:.5}}>
             <NavLink
             to={'https://t.me/gadalmarket'}
             target="_blank"
             rel="noopener noreferrer"
             >
             <TelegramIcon color='primary'/>
             </NavLink>
             <NavLink
             to={'https://www.facebook.com/gadalmarket?mibextid=ZbWKwL'}
             target="_blank"
             rel="noopener noreferrer"
             >
             <FacebookOutlinedIcon color='primary'/>
             </NavLink>
             <NavLink
             to={'https://www.instagram.com/gadal_market?igsh=MWdyNzU5aGFibmhvYw=='}
             target="_blank"
             rel="noopener noreferrer"
             >
             <InstagramIcon color='primary'/>
             </NavLink>
            <NavLink
            to={'https://www.tiktok.com/@gadaltech?_t=8iS9yON5QO6&_r=1'}
            target='_blank'
            rel="noopener noreferrer"
            >
            <img 
             src='/images/icons8_tiktok.svg'
             width={20}
             />
            </NavLink>
             <NavLink
             to={'https://youtube.com/@gadaltech?si'}
             target='_blank'
             rel="noopener noreferrer" 
             >
             <YouTubeIcon color='primary'/>
             </NavLink>
             <NavLink
             to={'https://x.com/Samson_Belda?t=aMx0NIngzWYY_41aHTb_3Q&s=09'}
             target='_blank'
             rel="noopener noreferrer" 
             >
             <XIcon color='primary'/>
             </NavLink>
             <NavLink
             to={'https://www.linkedin.com/company/gadal-market/'}
             target='_blank'
             rel="noopener noreferrer" 
             >
             <LinkedinIcon color='primary'/>
             </NavLink>
             <NavLink
               to={'https://www.linkedin.com/company/gadal-market/'}
               target='_blank'
               rel="noopener noreferrer" 
             >
               <GoogleIcon
                  color='primary'
               />
             </NavLink>
            </Box>

         </Box>
        </Box>
        <Box
       sx={{
        background:theme.palette.primary.main,
        textAlign:'center',
        p:1,
    }}
       >
        <Typography
        >
        Copyright <span>&copy;</span> Gadal Market {new Date().getFullYear()}. all right reserved powered by&nbsp;
         <NavLink 
         to="https://gadaltechnologies.com/"
         target="_blank"
         rel="noopener noreferrer"
         style={({isTransitioning }) => {
            return {
              color:'blue',
              textDecoration:'none',
              viewTransitionName: isTransitioning ? "slide" : "",
            };
          }}
        >
         Gadal Technologies
         </NavLink>
        </Typography>
       </Box>
        </Box>
    )
}