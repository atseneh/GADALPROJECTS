import { Box, IconButton, InputBase, Paper, Typography,Badge, Avatar, Stack, Menu, MenuItem } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
interface topNavProps {
    title:string
}
export default function TopNav(props:topNavProps){
    const {title} = props
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate()
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
      };
      const handleClose = () => {
        setAnchorEl(null);
      };
      const handleLogout = ()=>{
        localStorage.clear();
        navigate('/login')
      }
    return (
        <Paper
        sx={{
            p:1.5,
            display:'flex',
            borderRadius:'8px',
            alignItems:'center'
        }}
        >
        <Typography variant="h5" fontWeight={'bold'} sx={{flexGrow:1,textTransform:'capitalize'}}>
            {title}
        </Typography>
        <Box 
        sx={{display:'flex',alignItems:'center',gap:10}}
        >
         <Box
         component={'form'}
         sx={{p: '2px 4px', display: 'flex',  
         background:'#EFEFEF',
         alignItems: 'center',borderRadius:"20px",height:35,width:400}}
         >
          <SearchIcon fontSize="small" sx={{ml:2}}/>
                 <InputBase
        sx={{ ml: 1, flex: 1,}}
        placeholder="Search Gadal Market ..."
        inputProps={{ 'aria-label': 'search gadal market' }}
      />
      <IconButton>
      <CloseIcon fontSize="small"/>
      </IconButton>
      
         </Box>
         <Box
         sx={{display:'flex',alignItems:'center',gap:2}}
         >
            <Badge  badgeContent={0} color="primary">
            <NotificationsNoneIcon  color="action" />
            </Badge>
            <Box sx={{display:'flex',alignItems:'center',gap:1,background:'#FAF8FF',p:.5}}>
            <Avatar sx={{width:30,height:30}} alt="Admin Profile" src="/icons/profile2.svg" />
            <Stack
            sx={{
                cursor:'pointer'
            }}
            onClick = {(e)=>{handleClick(e)}}
            >
                <Typography variant="body2">
                  {localStorage.getItem('fullName')}
                </Typography>
                <Typography variant="caption">
                    Admin
                </Typography>
            </Stack>
            <Menu
   id="basic-menu"
   anchorEl={anchorEl}
   open={open}
   onClose={handleClose}
   MenuListProps={{
     'aria-labelledby': 'basic-button',
   }}
 >
  <MenuItem onClick={()=>{
    handleClose()
    // handleLogout();
   }}>
   <Box sx={{display:'flex',alignItems:'center',gap:1}}>
    <img width={16} src='/images/icons8_password.svg'/>
   <Typography variant='caption' fontWeight={'bolder'}>
        Change password
    </Typography>
   </Box>
   </MenuItem>
   <MenuItem onClick={()=>{
    handleClose()
    handleLogout();
   }}>
   <Box sx={{display:'flex',alignItems:'center',gap:1}}>
    <img width={16} src='/images/login.svg'/>
   <Typography variant='caption' fontWeight={'bolder'}>
        Logout
    </Typography>
   </Box>
   </MenuItem>
    </Menu>
            </Box>
         </Box>
        </Box>
        </Paper>
    )
}