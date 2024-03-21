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
import { useState } from 'react';
export default function TopNavDesktop(){
    const loggedIn = true
    const theme =  useTheme()
    const navigate = useNavigate()
    const [searchTerm,setSearchTerm] = useState('')
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
            <IconButton >
                <Badge badgeContent={4} color='primary'>
                <NotificationsNoneOutlinedIcon fontSize='large'/>
                </Badge>
            </IconButton>
            <IconButton 
            onClick={()=>navigate('/messages')}
            >
                <ChatBubbleOutlineOutlinedIcon fontSize='large'/>
            </IconButton>
            <IconButton 
            onClick={()=>navigate('/yourFavs')}
            >
                <FavoriteBorderOutlinedIcon fontSize='large'/>
            </IconButton>
           <CartMenu/>
                <Button
                variant='contained'
                sx={{
                    display:'flex',
                    alignItems:'center',
                    color:'white',
                    width:100,
                    borderRadius:'8px'
                }}
                onClick={()=>navigate('/post')}
                >
                    <AddIcon/>
                    <Typography>Post</Typography>
                </Button>
            {
                loggedIn?(
                  <AccountMenu/>
                ):
                (
                    <Button onClick={()=>navigate('/login')}  variant='text'>Sign in</Button>
                )
            }
         </Box>
        </Box>
        
      </Card>
    )
}