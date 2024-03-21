import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Enums from '../utils/constants/serviceEnums'
import { Typography,IconButton, Grid, Collapse } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useQuery } from "@tanstack/react-query";
import getAllCategories from "../api/categories/getAllCategories";
import { useNavigate } from "react-router-dom";
export default function Categories(){
    const [rent,setRent] = useState(true)
    const {ServiceEnums} = Enums
    const navigate = useNavigate()
    const services =  Object.entries(ServiceEnums).map(([key, value]) => ({ name: key, value: value }));
    const [expand,setExpand] = useState<{[key:string]:any}>(
      services?.map((service)=>(
         {
            [service.name]:false
         }
      ))
    )
    const handleExpand = (name:string) => {
      setExpand(()=>({...expand,[name]:!expand[name]}));
    };
    const {data:allCategoires} = useQuery({
      queryKey:['allCategories'],
      queryFn:getAllCategories
    })
    
    return(
        <Box sx={{display:'flex',flexDirection:'column',m:1,gap:1}}> 
        <Box sx={{alignSelf:'center'}}>
        <Stack direction={'row'} spacing={1}>
                  <Chip

                   sx={{p:1,color:rent?'white':'',fontWeight:'bold',}}
                   color={rent?'primary':'default'} label="For Rent" 
                   onClick={()=>{
                   setRent(true)
                  }}
                   icon={rent?<CheckCircleOutlineIcon fontSize='small' color='inherit'/>:undefined}/>

                  <Chip 
                   sx={{p:1,color:!rent?'white':'',fontWeight:'bold'}}
                   color={!rent?'primary':'default'} label="For Sale"
                   onClick={()=>{
                    setRent(false)
                    }}
                   icon={!rent?<CheckCircleOutlineIcon fontSize='small' color='inherit'/>:undefined}/>
                   
                </Stack>
        </Box>
        <Box sx={{ml:2,mr:2}}>
         {
            services?.map((service)=>(
            <Box>
         <Box sx={{display:'flex',alignItems:'center',mt:2,background:'#EFEFEF',p:.5,borderRadius:'8px',pl:2,justifyContent:'space-between'}}>
            <Stack spacing={1} direction={'row'}>
            <img width={32} height={30} src={`images/${service?.name.toLowerCase()}.svg`}/>
             <Typography sx={{textTransform:'capitalize'}} variant="h6" fontWeight={'bold'}>
                {service.name}
             </Typography>
            </Stack>
             <IconButton
             onClick={()=>handleExpand(service?.name)}
             sx={{alignSelf:'flex-end'}}>
                <ArrowDropDownIcon/>
             </IconButton>
            </Box>
            <Collapse in={expand[service.name]} timeout="auto" unmountOnExit>
              <Grid container spacing={1} sx={{background:'white'}}>
                  {
                  allCategoires?.filter((cat:any)=>cat?.serviceId === service.value)?.map((subCat:any)=>(
                  <Grid item xs={4} sm={4}>
                      <Box 
                     sx={{
                       display:'flex',
                       flexDirection:'column',
                       gap:.5,
                       cursor:'pointer',
                       p:1,
                       borderRadius:'10px',
                       boxShadow: `1px 1px 8px #ABABAB`,
                       width:80,
                       height:50
                     }}
                     onClick={()=>{
                        navigate(`/${service.name.toLowerCase()}/${subCat?.name}?cat=${subCat?._id}&transaction=${rent?'rent':'sale'}`)
                     }}
                     >
                         <Typography sx={{textOverflow:'ellipsis',maxHeight:'50%'}} variant="caption" fontWeight={'bold'}>
                         {subCat.name}
                       </Typography>
                       <img style={{alignSelf:'flex-end'}} width={30} height={30} src={subCat?.icon}/>
                     </Box>
                  </Grid>
                  ))
                  }
               </Grid>
              </Collapse>
            </Box>
            ))
         }
        </Box>
        </Box>
    )
}