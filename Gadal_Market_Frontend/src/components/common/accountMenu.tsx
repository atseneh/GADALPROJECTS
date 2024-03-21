import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
export default function AccountMenu(){
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate()
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
      };
      const handleClose = () => {
        setAnchorEl(null);
      };
    return(
        <>
        <IconButton
                    onClick={handleClick}
                    >
                        <AccountCircleIcon fontSize='large'/>
                    </IconButton>
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
  navigate('/profile')
  handleClose()
}}>
   <Box sx={{display:'flex',alignItems:'center',gap:1}}>
    <img width={20} src='/images/profile.svg'/>
   <Typography variant='body2' fontWeight={'bolder'}>
        View Profile
    </Typography>
   </Box>
   </MenuItem>
   <MenuItem onClick={()=>{
    navigate('/yourFavs')
    handleClose()
   }}>
    <Box sx={{display:'flex',alignItems:'center',gap:1}}>
    <img width={20} src='/images/fav.svg'/>
   <Typography variant='body2' fontWeight={'bolder'}>
        My Favourites
    </Typography>
   </Box>
   </MenuItem>
   <MenuItem onClick={()=>{
    navigate('/profile?selected=yourAds')
    handleClose()
   }}>
    <Box sx={{display:'flex',alignItems:'center',gap:1}}>
    <img width={20} src='/images/myads.svg'/>
   <Typography variant='body2' fontWeight={'bolder'}>
        MY Ads
    </Typography>
   </Box>
   </MenuItem>
   <MenuItem onClick={()=>{
    navigate('/profile?selected=packages')
    handleClose()
   }}>
    <Box sx={{display:'flex',alignItems:'center',gap:1}}>
    <LocalOfferIcon fontSize='small' color='inherit'/>
   <Typography variant='body2' fontWeight={'bolder'}>
        My Packages
    </Typography>
   </Box>
   </MenuItem>
   <MenuItem onClick={()=>{
    handleClose()
   }}>
   <Box sx={{display:'flex',alignItems:'center',gap:1}}>
    <img width={20} src='/images/login.svg'/>
   <Typography variant='body2' fontWeight={'bolder'}>
        Logout
    </Typography>
   </Box>
   </MenuItem>
 </Menu>
        </>
    )
}