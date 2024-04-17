import {Box,IconButton,Badge,Card, Stack, Button, Typography, InputBase, Divider} from '@mui/material'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SearchIcon from '@mui/icons-material/Search'
import TextField from '@mui/material/TextField';
import { useContext, useEffect, useState } from 'react';
import Link from '@mui/material/Link';
import AccountMenu from '../common/accountMenu';
import CartMenu from '../common/cartMenu';
import { useNavigate } from 'react-router-dom';
import useSmallScreen from '../../utils/hooks/useSmallScreen';

export default function TopNavMobile(){
    const [showSearch,setShowSearch] = useState(false)
    const [searchTerm,setSearchTerm] = useState('')
    const navigate = useNavigate();
    const loggedIn = localStorage.getItem('token')
    const handleSearchClick = ()=>{
        setShowSearch(!showSearch)
    }
    let deferredPrompt: any;
    useEffect(()=>{    
        const handleBeforeInstallPrompt = (event: any) => {
          event.preventDefault();
          deferredPrompt = event;
        };
    
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => {
          window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    },[])
    const handleClick = () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('App installed');
            } else {
              console.log('App installation dismissed');
            }
            deferredPrompt = null;
          });
        }
      };
    return (
     <Stack
     spacing={1}
     >
       <Card sx={{p:1}}>
          <Box
        sx={{display:'flex',alignItems:'center'}}
        >
         <Box
          sx={{flexGrow:1}}
         >
        <Link href="/">
                <img width={120} src='/images/Group 1180 (2).png'/>
        </Link>
         </Box>
         {
          loggedIn ? (
            <Box 
            sx={{display:'flex',gap:.5,alignItems:'center'}}
           >
            
              <IconButton
              onClick={handleClick}
              >
                  <Badge badgeContent={4} color='primary'>
                  <NotificationsNoneOutlinedIcon fontSize='large'/>
                  </Badge>
              </IconButton>
             <CartMenu/>
              <IconButton >
                  <AccountMenu/>
              </IconButton>
           </Box>
          ):
          (
            <Stack
                direction={'row'}
                alignItems={'center'}
                // spacing={1}
                >
                  <Button
                  size='large'
                  onClick={()=>{
                    navigate('/login')
                  }}
                  >
                    Login
                  </Button>
                   <Typography>
                    |
                   </Typography>
                  <Button
                  size='large'
                  onClick={()=>{
                    navigate('/register')
                  }}
                  >
                    Registration
                  </Button>
                </Stack>
          )
         }
        </Box>
      </Card>
      {/* <Divider/> */}
        <Box
         component={'form'}
         onSubmit={(e)=>{
          e.preventDefault()
          if(!searchTerm){
            return;
          }
          navigate(`/search?searchQuery=${searchTerm}`)
        }}
            sx={{
              p: '2px 4px', 
              display: 'flex',
              alignItems: 'center',
              border:`1px solid #A5A5A5`,
              borderRadius:"20px",
              // background:'#EFEFEF',
            }}
         >
            <SearchIcon fontSize="small" sx={{ml:1}}/>
             <InputBase
            sx={{ ml: 1, flex: 1 }}
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}     
            placeholder="Search Gadal Market"
            inputProps={{ 'aria-label': 'search gadal market' }}
            
      />
      
         </Box>
     </Stack>
    )
}