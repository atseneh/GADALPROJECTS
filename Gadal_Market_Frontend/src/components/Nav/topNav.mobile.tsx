import {Box,IconButton,Badge,Card} from '@mui/material'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import SearchIcon from '@mui/icons-material/Search'
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import Link from '@mui/material/Link';
import AccountMenu from '../common/accountMenu';
import CartMenu from '../common/cartMenu';
export default function TopNavMobile(){
    const [showSearch,setShowSearch] = useState(false)
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
      <Card sx={{p:1}}>
          <Box
        sx={{display:'flex',alignItems:'center'}}
        >
         <Box
          sx={{flexGrow:1,alignSelf:showSearch?'flex-start':"center"}}
         >
         {
            showSearch?
            (<TextField variant='standard'/>):(
                <Link href="/">
                <img width={100} src='/images/Group 1180 (2).png'/>
                </Link>
            )
         }
         </Box>
         <Box 
          sx={{display:'flex',gap:.5,alignItems:'center'}}
         >
             <IconButton
             onClick={handleSearchClick}
             >
                <SearchIcon fontSize='large'/>
            </IconButton>
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
        </Box>
      </Card>
    )
}