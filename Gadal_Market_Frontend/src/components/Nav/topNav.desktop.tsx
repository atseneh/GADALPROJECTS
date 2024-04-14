import {Box,IconButton, Typography,useTheme,InputBase,Badge,Stack, Button,Card} from '@mui/material'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';
import AccountMenu from '../common/accountMenu';
import CartMenu from '../common/cartMenu';
import { useContext, useState } from 'react';
import { SocketCon } from '../context/socketContext';
export default function TopNavDesktop(){
    const loggedIn = localStorage.getItem('token')
    const theme =  useTheme()
    const navigate = useNavigate()
    const [searchTerm,setSearchTerm] = useState('')
    const {unreadCount} = useContext(SocketCon)
    return (
      <Card sx={{p:2}}>
          <Box
        sx={{display:'flex',alignItems:'center',justifyContent:"space-between"}}
        >
        <Link href="/">
        <Box
          sx={{display:'flex',alignItems:'center',gap:2}}
         >
            <img width={300} src='/images/logo.png' alt='Gadal Logo'/>
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
             {
              loggedIn ? (
                <>
                 <IconButton >
                <Badge 
                  badgeContent={4} 
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
            onClick={()=>navigate('/messages')}
            >
                <ChatBubbleOutlineOutlinedIcon fontSize='large'/>
            </IconButton>
            </Badge>
            <IconButton 
            onClick={()=>navigate('/yourFavs')}
            >
                <FavoriteBorderOutlinedIcon fontSize='large'/>
            </IconButton>
           <CartMenu/>
                </>
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
            {
                loggedIn?(
                  <AccountMenu/>
                ):
                (
                  null
                )
            }
         </Box>
        </Box>
        
      </Card>
    )
}