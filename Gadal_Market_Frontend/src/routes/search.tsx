import { Box, Button, Chip, Divider, Grid, Stack, Typography,useTheme } from "@mui/material";
import ProductCard2 from "../components/products/productCard2";
import useSmallScreen from "../utils/hooks/useSmallScreen";
import PriceRange from "../components/filters/priceRange";
import { useQuery } from "@tanstack/react-query";
import getPriceRangeByCategory from "../api/categories/getPriceRangeByCategory";
import getAttributesForFilter from "../api/products/getAttributesForFilter";
import AttributeFilter from "../components/filters/attributeFilter";
import Enums from '../utils/constants/serviceEnums'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useState } from "react";
import getCategoriesByService from "../api/categories/getCategoryByService";
import { useSearchParams} from "react-router-dom";
import useReactRouterQuery from '../utils/hooks/useQuery'
import search from "../api/products/searchProducts";
import CardSkeleton from "../components/products/cardSkeleton";

export default function Search(){
const smallScreen = useSmallScreen()
const [rent,setRent] = useState(true)
const [searchParams, setSearchParams] = useSearchParams();
const params = new URLSearchParams(searchParams.toString());
const addSearchParam = (cat:string) => {
    params.set('cat',cat);
    setSearchParams(params);
  };
let query = useReactRouterQuery()
const cat = query.get('cat')
const searchTerm = query.get('searchQuery')
const theme = useTheme()
const [selectedService,setSelectedService] = useState(0)
const {ServiceEnums} = Enums
const services =  Object.entries(ServiceEnums).map(([key, value]) => ({ name: key, value: value }));
const {data:priceRange} = useQuery({
    queryKey:['priceRange',cat],
    queryFn:()=>getPriceRangeByCategory(cat as string),
    enabled:Boolean(cat)
  })
  const {data:attributesForFilter,isLoading:attributesLoading} = useQuery({
    queryKey:['attributesForFilter',cat],
    queryFn:()=>getAttributesForFilter(cat as string),
    enabled:Boolean(cat)
  })
  const {data:categories,isLoading} = useQuery({
    queryKey:['categoriesByService',selectedService],
    queryFn:()=>getCategoriesByService(selectedService),
    enabled:Boolean(selectedService)
   })
  const {data:searchedProducts,isLoading:searching} = useQuery({
    queryKey:['search',searchTerm],
    queryFn:()=>search(searchTerm!)
  })
    return (
        <Box sx={{display:'flex',flexDirection:'column',gap:1,}}>
           <Box
        sx={{
            width:'100%',
            height:85,
            display:'flex',
            // mt:2,
            gap:1,
            alignItems:'center',
             background:'url(/images/Background.svg)',
             backgroundSize:'cover',                   
             backgroundRepeat:'no-repeat',
             backgroundPosition: 'center center',
            }}
        >
              <img width={80} src="/images/searchImage.svg" style={{marginLeft:smallScreen?'8px':'100px'}}/>
         <Box>
            <Typography sx={{color:'white',fontStyle:'italic',fontWeight:'bold',textTransform:'capitalize'}} variant={smallScreen?"h6":'h4'}>
              Search Results for : {searchTerm}
            </Typography>
         </Box>
        </Box>
        <Grid container spacing={2} sx={{ml:1}} justifyContent={'center'}>
            {
              cat&&((Array.isArray(priceRange)&&priceRange?.length>0) || (Array.isArray(attributesForFilter)&&attributesForFilter?.length>0))&&(
                <Grid item xs={12} sm={2.5} >
            <Stack spacing={1} sx={{mt:3}}>
        <Box>
          {
            ((Array.isArray(priceRange)&&priceRange?.length>0) || (Array.isArray(attributesForFilter)&&attributesForFilter?.length>0))&&(
              <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',pl:.5}} >
            <Typography variant="body2">
                Filter:
            </Typography>
            <Button variant="text" size="small">
                Clear all
            </Button>
            </Box>
            )
          }
            <Divider/>
        </Box>
        <PriceRange range={priceRange}/>
        {
          attributesLoading?
          (<p>loading...</p>):(
            attributesForFilter?.map((attribute:any)=>(
              <AttributeFilter key={attribute?.name} attribute = {attribute}/>
            ))
          )
        }
    </Stack>
            </Grid>
              )
            }
            <Grid item xs={12} sm={9.5}>
            <Stack className='hideScrollBar' direction={'row'} spacing={1} sx={{overflowX:'auto',mr:4}}>
        <Chip
                   sx={{p:1,color:rent?'white':'',fontWeight:'bold'}}
                   color={rent?'primary':'default'} label="Rent" 
                   onClick={()=>{
                   setRent(true)
                  }}
                   icon={rent?<CheckCircleOutlineIcon fontSize='small' color='inherit'/>:undefined}/>
                  <Chip 
                   sx={{p:1,color:!rent?'white':'',fontWeight:'bold'}}
                   color={!rent?'primary':'default'} label="Sale"
                   onClick={()=>{
                    setRent(false)
                    }}
                   icon={!rent?<CheckCircleOutlineIcon fontSize='small' color='inherit'/>:undefined}/>
                  
            {
            services.map((service)=>(
                <Box 
                key={service.name}
                onClick={()=>setSelectedService(service.value)}
                sx={{display:'flex',alignItems:'center',gap:1,
                borderRadius:'16px',
                cursor:'pointer',
                background:selectedService===service.value?theme.palette.primary.main:'#EFEFEF',color:'black',
                pt:.7,pb:.7,pl:2,pr:2    
            }}>
             <Typography >
                {service.name}
             </Typography>
            </Box>
            ))
            }
        </Stack>
          {
            isLoading?<p>loading...</p>:(
                <Box
                className='hideScrollBar'
                 sx={{mt:1,display:'flex',alignItems:'center',gap:1,overflowX:'auto',p:1}}>
                {
                    categories?.map((category:any)=>(
                        <>
                       <Box 
                     sx={{
                       display:'flex',
                       flexDirection:'column',
                       gap:.5,
                       cursor:'pointer',
                       p:1,
                       borderRadius:'10px',
                       boxShadow: `1px 1px 8px ${cat===category?._id?'#FFAA00':'#ABABAB'}`,
                       width:80,
                       height:50,
                       background:cat === category?._id ?'#EFEFEF':'white',
                       border:cat === category?._id?'1px solid #FFAA00':'',
                     }}
                     onClick={()=>addSearchParam(category?._id as string)}
                     >
                         <Typography sx={{textOverflow:'ellipsis',maxHeight:'50%'}} variant="caption" fontWeight={'bold'}>
                         {category.name}
                       </Typography>
                       <img style={{alignSelf:'flex-end'}} width={22} height={20} src={category?.icon}/>
                     </Box>
                      </>
                    ))
                }
                </Box>
            )
          }
            {
              searching?(
                <>
                {
                  [1,2].map(item=>(
                    <CardSkeleton key={item}/>
                  ))
                }
                </>
              ):
              (
                <>
                  {
                  Array.isArray(searchedProducts)&&searchedProducts?.length>0?(
                    <>
                    {
                       searchedProducts?.map((data:any)=>(
                        <ProductCard2 key={data?._id} data={data}/>
                    ))
                    }
                    </>
                  )
                  :(
                    <Typography variant="body2" sx={{m:1}}>
                      No items found
                    </Typography>
                  )
                   
                }
                </>
              )
            }
              
            </Grid>
        </Grid>
        </Box>
    )
}