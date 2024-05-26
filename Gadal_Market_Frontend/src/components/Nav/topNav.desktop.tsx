import {Box,IconButton, Typography,useTheme,InputBase,Badge,Stack, Button,Card, Popover} from '@mui/material'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close';
import Link from '@mui/material/Link';
import { useLocation, useNavigate } from 'react-router-dom';
import AccountMenu from '../common/accountMenu';
import CartMenu from '../common/cartMenu';
import { useContext, useEffect, useState } from 'react';
import { SocketCon } from '../context/socketContext';
import NotificationContent from '../common/notificationContent';
export default function TopNavDesktop(){
    const loggedIn = localStorage.getItem('token')
    const theme =  useTheme()
    const navigate = useNavigate()
    const [searchTerm,setSearchTerm] = useState('')
    const {unreadCount,unreadNotifications} = useContext(SocketCon)
    const {pathname} = useLocation()
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'notification-popover' : undefined
    useEffect(()=>{
      handleClose();
    },[pathname])
    return (
      <Card sx={{p:2}}>
          <Box
        sx={{display:'flex',alignItems:'center',justifyContent:"space-between"}}
        >
        <Link href="/">
        <Box
          sx={{display:'flex',alignItems:'center',gap:2}}
         >
            <img 
            width={300} 
            // src='/images/logo.png' 
            // src='/newLogoDesktop.svg' 
            src='/Asset 7.png'
            alt='Gadal Logo'
            />
         </Box>
        </Link>
      
          <Stack direction={'row'} component={'form'}
          onSubmit={(e)=>{
            e.preventDefault()
            if(!searchTerm){
              return;
            }
            navigate(`/search?searchQuery=${searchTerm}`)
          }}
          >
         <Box
        //  component={'form'}
         sx={{width:400,p: '2px 4px', display: 'flex', alignItems: 'center',border:`2px solid ${theme.palette.primary.main}`,borderRadius:"20px 0 0 20px "}}
         >
             <InputBase
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}     
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Gadal Market"
            inputProps={{ 'aria-label': 'search gadal market' }}
      />
      <IconButton 
      onClick={()=>setSearchTerm('')}
      type="button" sx={{ p: '10px' }} aria-label="clear">
        <CloseIcon />
      </IconButton>
         </Box>
         <Box sx={{backgroundColor:`${theme.palette.primary.main}`,border:`2px solid ${theme.palette.primary.main}`,borderLeft:0,background:'',display:'flex',alignItems:'center',borderTopRightRadius:"24px",borderBottomRightRadius:'24px'}}>
            <IconButton
            type='submit'
            sx={{p:'10px',}}>
                <SearchIcon fontSize='large'/>
            </IconButton>
            
         </Box>
         </Stack>
          
         <Box 
          sx={{display:'flex',gap:1,alignItems:'center'}}
         >
             {/* {
              loggedIn ? ( */}
                <>
                 <IconButton 
                 onClick={(e)=>{
                  if(loggedIn){
                    handleClick(e);
                    return;
                  }
                  navigate('/login')
                 }}
                 >
                <Badge 
                  badgeContent={unreadNotifications} 
                  color='primary'
                  sx={{
                    '& .MuiBadge-badge':{
                      color:'white'
                    }
                  }}
                  >
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
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            slotProps={{
              paper:{
                sx:{
                  mt:1,
                  // boxShadow:'none',
                  borderRadius:'8px',
                  height:'calc(100vh - 100px)',
                  width:320,  
                  // maxHeight:500
                }
              }
            }}
          >
        <NotificationContent/>
          </Popover>
            <Badge
            badgeContent={unreadCount}
            color='primary'
            sx={{
              '& .MuiBadge-badge':{
                color:'white'
              }
            }}
            >
            <IconButton 
            onClick={()=>{
              if(loggedIn){
                navigate('/messages')
                return;
              }
              navigate('/login')
            }}
            >
                <ChatBubbleOutlineOutlinedIcon fontSize='large'/>
            </IconButton>
            </Badge>
            <IconButton 
            onClick={()=>{
              if(loggedIn){
                navigate('/yourFavs')
                return;
              }
              navigate('/login')
            }}
            >
                <FavoriteBorderOutlinedIcon fontSize='large'/>
            </IconButton>
           <CartMenu/>
                </>
              {/* ):
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
             } */}
                <Button
                variant='contained'
                sx={{
                    display:'flex',
                    alignItems:'center',
                    color:'white',
                    width:100,
                    borderRadius:'8px'
                }}
                onClick={()=>{
                  if(loggedIn) {
                    navigate('/post')
                    return;
                  }
                  navigate('/login')
                }}
                >
                    <AddIcon/>
                    <Typography>Post</Typography>
                </Button>
            {/* {
                loggedIn?( */}
                  <AccountMenu/>
                {/* ):
                (
                  null
                )
            } */}
         </Box>
        </Box>
        
      </Card>
    )
}