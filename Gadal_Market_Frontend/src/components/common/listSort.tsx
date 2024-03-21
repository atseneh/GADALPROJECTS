import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MultipleStopIcon from '@mui/icons-material/MultipleStop';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import React from 'react';
export default function ListSort(){
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const [sortCriteria,setSortCriteria] = React.useState('latest')
    const handleSortSelection = (sortCriterion:string)=>{
     setSortCriteria(sortCriterion)
    }
 return (
 <div>
      <Button
   aria-controls={open ? 'sort-menu' : undefined}
   aria-haspopup="true"
   aria-expanded={open ? 'true' : undefined}
   onClick={handleClick}
   color="inherit"
   sx={{
    display:'flex',alignItems:'center',
    background:'#EFEFEF',
    borderRadius:'8px',
    p:.3,
    width:'fit-content',
}}
   >
    <MultipleStopIcon
    sx={{transform:'rotate(90deg)',fontSize:'0.9rem'}}
     fontSize="small"/>
    <Typography variant="caption" sx={{textTransform:'capitalize'}}>
        <span style={{fontWeight:'bold'}}>SortBy</span> : {sortCriteria}
    </Typography>
    <ArrowDropDownIcon
    fontSize="small"/>
   </Button>
   <Menu
   id="basic-menu"
   anchorEl={anchorEl}
   open={open}
   anchorOrigin={{
    vertical: 'top',
    horizontal: 'center',
  }}
   onClose={handleClose}
   MenuListProps={{
     'aria-labelledby': 'basic-button',
   }}
 >
   <MenuItem onClick={()=>{
    handleSortSelection('latest')
    handleClose()
   }}>
   <Typography variant='caption'>
        Latest
    </Typography>
   </MenuItem>
   <MenuItem onClick={()=>{
    handleSortSelection('highestPrice')
    handleClose()
   }}>
    <Typography variant='caption'>
        Highest Price
    </Typography>
   </MenuItem>
   <MenuItem onClick={()=>{
    handleSortSelection('lowestPrice')
    handleClose()
   }}>
    <Typography variant='caption'>
        Lowest Price
    </Typography>
   </MenuItem>
   <MenuItem onClick={()=>{
    handleSortSelection('highly rated')
    handleClose()
   }}>
   <Typography variant='caption'>
        Highly Rated
    </Typography>
   </MenuItem>
 </Menu>
 </div>
 )
}