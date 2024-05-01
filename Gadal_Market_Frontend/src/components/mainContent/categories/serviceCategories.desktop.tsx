import {Box,Typography,Stack,Chip,useTheme} from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import capitalizeFirstLetter from '../../../utils/helpers/capitalizeFirstLetter';
import {useQuery} from '@tanstack/react-query'
import getCategoriesByService from '../../../api/categories/getCategoryByService';
import Enums from '../../../utils/constants/serviceEnums';
import Skeleton from '@mui/material/Skeleton'
interface serviceCategoryProps {
    serviceName:string;
    isLink:boolean;
    localTransactionType?:'rent'|'sale'|null,
    setLocalTransactionType?:(t:'rent'|'sale'|null)=>void;
    activeTransaction?:'rent'|'sale'|null;
    activeService?:'property'|'machinery'|'vehicle'|'others'|null;
    handleTransactionChange?:(t:'rent'|'sale'|null,s:'property'|'machinery'|'vehicle'|'others')=>void
}
export default function ServiceCategory(props:serviceCategoryProps){
    const theme = useTheme()
    const {ServiceEnums} = Enums
   const {serviceName,activeTransaction,handleTransactionChange,activeService,isLink,localTransactionType,setLocalTransactionType} = props;
   const serviceId = ServiceEnums[capitalizeFirstLetter(serviceName)]
   const isRentActive = (serviceName.toLowerCase() === activeService) && (activeTransaction === 'rent') || (localTransactionType==='rent' && !handleTransactionChange)
   const isSaleActive =  (serviceName.toLowerCase() === activeService) && (activeTransaction === 'sale') || (localTransactionType==='sale' && !handleTransactionChange)
   const {category:activeCat} = useParams()
   const navigate = useNavigate()
   const {data:categories,isLoading} = useQuery({
    queryKey:['categoriesByService',serviceId],
    queryFn:()=>getCategoriesByService(serviceId)
   })
    return (
        <Box 
          sx={{
            display:'flex',
            flexDirection:'column',
            gap:1,
            mb:1
            }}>
            <Box sx={{background:'rgb(239 239 239)',borderRadius:'32px',display:'flex',alignItems:'center',pr:1}}>
          <Box sx={{flexGrow:1,ml:1}}>
          <img width={40} src={`/images/${serviceName.toLowerCase()}.svg`}/>
          </Box>
            <Box>
            <Typography sx={{fontWeight:''}} variant='h6'>
                {capitalizeFirstLetter(serviceName)}
            </Typography>
            </Box>
            </Box>
                <Stack direction={'row'} spacing={1}>
                  <Chip
                   sx={{p:1,color:isRentActive?'white':'',fontWeight:'bold'}}
                   color={isRentActive?'primary':'default'} label="Rent" 
                   onClick={()=>{
                   if(handleTransactionChange){
                    if(isRentActive){
                      handleTransactionChange(null,serviceName.toLowerCase() as 'property'|'machinery'|'vehicle'|'others' )
                      return;
                    }
                    handleTransactionChange('rent',serviceName.toLowerCase() as 'property'|'machinery'|'vehicle'|'others' )
                    return
                   }
                   if(isRentActive){
                    setLocalTransactionType!(null)
                    return;
                   }
                   setLocalTransactionType!('rent')
                  }}
                   icon={isRentActive?<CheckCircleOutlineIcon fontSize='small' color='inherit'/>:undefined}/>
                  <Chip 
                   sx={{p:1,color:isSaleActive?'white':'',fontWeight:'bold'}}
                   color={isSaleActive?'primary':'default'} label="Sale"
                   onClick={()=>{
                    if(handleTransactionChange){
                      if(isSaleActive){
                        handleTransactionChange(null,serviceName.toLowerCase() as 'property'|'machinery'|'vehicle'|'others')
                        return;
                      }
                     handleTransactionChange('sale',serviceName.toLowerCase() as 'property'|'machinery'|'vehicle'|'others')
                     return
                    }
                    if(isSaleActive){
                      setLocalTransactionType!(null)
                      return;
                    }
                    setLocalTransactionType!('sale')
                    }}
                   icon={isSaleActive?<CheckCircleOutlineIcon fontSize='small' color='inherit'/>:undefined}/>
                   
                </Stack>
          
                <Stack spacing={1} sx={{}}>
                {
                  isLoading?(
                    <Stack spacing={1}>
                      {
                        [0,1,2,3].map((item)=>(
                          <Skeleton animation="wave" key={item} width={180} height={25} variant='rectangular'/>
                        ))
                      }
                    </Stack>
                  ):
                  (
                    <>
                    {
                      categories?.map((category:any)=>(
                        <>
                        {
                           isLink?
                           (
                               <NavLink 
                         key={category?._id}
                        to={`${serviceName.toLowerCase()}/${category?.name}?cat=${category?._id}&transaction=${activeTransaction}`}
                        style={({ isActive, isTransitioning }) => {
                           return {
                             fontWeight: isActive ? "bold" : "",
                           //   color: isPending ? "red" : "black",
                             color:isActive?theme.palette.primary.main:'black',
                             // color:'black',
                             textDecoration:'none',
                             viewTransitionName: isTransitioning ? "slide" : "",
                           };
                         }}
                        >
                        <Box key={category} sx={{display:'flex',alignItems:'center',gap:1,}}>
                        <img width={24} src={category?.icon}/>
                        <Typography sx={{mt:1}}>
                         {
                         category?.name
                         }
                        </Typography>
        
                        </Box>
                        </NavLink>
                           )
                           :
                           (
                               <Box 
                               key={category?._id} 
                               sx={{
                                 display:'flex',alignItems:'center',
                                 gap:1,cursor:"pointer",pr:.5,pl:.5,pb:.5, 
                                 background:activeCat===category?.name?'#D9D9D9':'',
                                 ':hover':{
                                   background:'#D9D9D9',
                                   
                                 }
                               }}
                               onClick = {()=>navigate(`/${serviceName.toLowerCase()}/${category?.name}?cat=${category?._id}&transaction=${localTransactionType}`)}
                               >
                               <img width={24} src={category?.icon}/>
                               <Typography sx={{mt:1}}>
                                 {category?.name}
                               </Typography>
               
                               </Box>   
                           )
                        }
                        </>
                    ))
                    }
                    </>
                  )
                 
                }
             </Stack>
           
        </Box>
    )
}