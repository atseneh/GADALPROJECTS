import {Box,IconButton,Badge,Card, Stack, Button, Typography, InputBase, Divider, Popover} from '@mui/material'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SearchIcon from '@mui/icons-material/Search'
import { useContext, useEffect, useState } from 'react';
import Link from '@mui/material/Link';
import AccountMenu from '../common/accountMenu';
import CartMenu from '../common/cartMenu';
import { useLocation, useNavigate } from 'react-router-dom';
import NotificationContent from '../common/notificationContent';
import { SocketCon } from '../context/socketContext';
export default function TopNavMobile(){
    const [searchTerm,setSearchTerm] = useState('')
    const navigate = useNavigate();
    const {pathname} = useLocation()
    const loggedIn = localStorage.getItem('token')
    const {unreadNotifications} = useContext(SocketCon)
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
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const handleNotificationClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'mobile-notification-popover' : undefined
    useEffect(()=>{
      handleClose();
    },[pathname])
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
                <img 
                width={120} 
                // src='/images/Group 1180 (2).png'
                // src='/newLogoMobile.svg'
                src='/Asset 5.png'
                />
        </Link>
         </Box>
         {
          true ? (
            <Box 
            sx={{display:'flex',gap:.5,alignItems:'center'}}
           >
            
              <IconButton
              onClick={(e)=>{
                if(loggedIn){
                  handleNotificationClick(e)
                  return;
                }
                navigate('/login')
              }}
              >
                  <Badge badgeContent={unreadNotifications} color='primary'>
                  <NotificationsNoneOutlinedIcon fontSize='large'/>
                  </Badge>
              </IconButton>
              <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            slotProps={{
              paper:{
                sx:{
                  mt:1,
                  // boxShadow:'none',
                  borderRadius:'8px',
                  height:'calc(100vh - 140px)',
                  width:220,  
                  // maxHeight:500
                }
              }
            }}
          >
        <NotificationContent/>
          </Popover>
             <CartMenu/>
             
                  <IconButton >
                  <AccountMenu/>
              </IconButton>
                
           </Box>
          ):
          (
            // <Stack
            //     direction={'row'}
            //     alignItems={'center'}
            //     // spacing={1}
            //     >
            //       <Button
            //       size='large'
            //       onClick={()=>{
            //         navigate('/login')
            //       }}
            //       >
            //         Login
            //       </Button>
            //        <Typography>
            //         |
            //        </Typography>
            //       <Button
            //       size='large'
            //       onClick={()=>{
            //         navigate('/register')
            //       }}
            //       >
            //         Registration
            //       </Button>
            //     </Stack>
            null
          )
         }
        </Box>
      </Card>
        {
          pathname !== '/messages' && (
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
          )
        }
     </Stack>
    )
}