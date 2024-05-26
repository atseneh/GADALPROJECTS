import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MultipleStopIcon from '@mui/icons-material/MultipleStop';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useReactRouterQuery from '../../utils/hooks/useQuery';
const sortCriterion = [
  {
    label:'Latest',
    value:'latest'
  },
  {
    label:'Lowest Prie',
    value:'lowPrice'
  },
  {
    label:'Highest Price',
    value:'highPrice'
  },
  {
    label:'Default',
    value:'default'
  }
]
export default function ListSort(){
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const [searchParams,setSearchParams] = useSearchParams();
    const params = new URLSearchParams(searchParams.toString());
    let query = useReactRouterQuery()
    const sortCriteria = sortCriterion?.find((c)=>c.value === query.get('sortCriteria'))?.label
    const addSearchParam = (criteria:string) => {
      params.set('sortCriteria', criteria);
      setSearchParams(params);
    };
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
  const handleSort = (criterion:string)=>{
    if(criterion === 'default'){
      searchParams.delete('sortCriteria')
      navigate(`?${searchParams.toString()}`);
      return;
    }
    addSearchParam(criterion)
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
   {
    sortCriterion.map((criteria)=>(
      <MenuItem onClick={()=>{
        handleSort(criteria.value)
        handleClose()
       }}>
       <Typography variant='caption'>
            {
              criteria.label
            }
        </Typography>
       </MenuItem>
    ))
   }
 </Menu>
 </div>
 )
}