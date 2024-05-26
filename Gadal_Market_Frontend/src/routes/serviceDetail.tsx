import {useNavigate, useParams,useSearchParams } from "react-router-dom"
import DetailBanner from "../components/common/detailBanner"
import  Grid  from "@mui/material/Grid"
import useSmallScreen from "../utils/hooks/useSmallScreen"
import ServiceCategory from "../components/mainContent/categories/serviceCategories.desktop"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Link from '@mui/material/Link';
import { useState } from "react"
import ProductCard from "../components/products/productCard"
import Stack from "@mui/material/Stack"
import Pagination from "@mui/material/Pagination"
import PaginationItem from "@mui/material/PaginationItem"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import EstimationButton from "../components/common/estimationButotn"
import ListSort from "../components/common/listSort"
import BreadCrums from "../components/common/breadCrums"
import IconButton from '@mui/material/IconButton'
import TuneIcon from '@mui/icons-material/Tune';
import Drawer from '@mui/material/Drawer';
import useReactRouterQuery from '../utils/hooks/useQuery'
import { useQuery } from "@tanstack/react-query"
import getPriceRangeByCategory from "../api/categories/getPriceRangeByCategory"
import PriceRange from "../components/filters/priceRange"
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import getProducts from "../api/products/getProducts"
import Enums from '../utils/constants/serviceEnums'
import capitalizeFirstLetter from "../utils/helpers/capitalizeFirstLetter"
import CardSkeleton from "../components/products/cardSkeleton"
import getAttributesForFilter from "../api/products/getAttributesForFilter"
import AttributeFilter from "../components/filters/attributeFilter"
import BrandFilters from "../components/common/brandFilters"
function PaginationNav(props:{direction:'prev'|'next'}){
    const {direction} = props
    return(
        <Box sx={{display:'flex',alignItems:'center',flexDirection:direction==='prev'?'row':'row-reverse'}}>
        {
            direction==='prev'?(<ArrowBackIosIcon sx={{fontSize:'0.8rem'}} fontSize="small"/>):(<ArrowForwardIosIcon sx={{fontSize:'0.8rem'}} fontSize="small"/>)
        }
         <Typography variant="caption" sx={{fontSize:'0.8rem'}} >
            {
                direction==='prev'?"Previous":'Next'
            }
         </Typography>
        </Box>
    )
}
export default function ServiceDetail(){
  const  [openDrawer,setOpenDrawer] = useState(false)
  const {transactionTypeEnums,ServiceEnums} = Enums
  let query = useReactRouterQuery()
  const navigate = useNavigate()
  const categoryId = query.get('cat')
  const minPrice = query.get('minPrice')
  const maxPrice = query.get('maxPrice')
  const transaction = query.get('transaction')
  const sortCriteria =  query.get('sortCriteria')
  const brand = query.get('brand')
  const smallScreen = useSmallScreen()
  const {category,service} = useParams()
  const [searchParams] = useSearchParams();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNumber(value);
  };
  let selcetedAttributes:any = []
  searchParams.forEach((value,key)=>{
    if(key.startsWith('attr')){
      const attributeName=key.split('_')[1]
      selcetedAttributes.push(
        {
          attributes:attributeName,
          attributeValues:value
        }
      )
    }
  })
  const [localTransactionType,setLocalTransactionType] = useState<'rent'|'sale'|null>(transaction as 'sale'|'rent'|null)
  const {data:products,isLoading:productsLoading} = useQuery({
    queryKey:['products',service,localTransactionType,categoryId,maxPrice,minPrice,selcetedAttributes,pageSize,pageNumber,sortCriteria,brand],
    queryFn:()=>getProducts({
       transactionType:localTransactionType ? transactionTypeEnums[localTransactionType]:undefined,
       productType:ServiceEnums[capitalizeFirstLetter(service as string)],
       category:categoryId as string,
       minPrice,
       maxPrice,
       attributes:selcetedAttributes,
       pageSize,
       pageNumber,
       sortCriteria:sortCriteria as string,
       brand
    })
   })
  const {data:priceRange} = useQuery({
    queryKey:['priceRange',categoryId],
    queryFn:()=>getPriceRangeByCategory(categoryId as string)
  })
  const {data:attributesForFilter,isLoading:attributesLoading} = useQuery({
    queryKey:['attributesForFilter',categoryId],
    queryFn:()=>getAttributesForFilter(categoryId as string)
  })
  const handleFilterClear = ()=>{
   navigate(`?cat=${categoryId}&transaction=${transaction}`)
  }
    const breadcrumbs = [
        <Link underline="hover" key="1" color="inherit" href="/" >
        Home
      </Link>,
        <Typography variant="body2" sx={{textTransform:'capitalize',fontWeight:'lighter'}} key="2" color="text.primary">
        {localTransactionType}
      </Typography>,
       <Typography variant="body2" sx={{textTransform:'capitalize',fontWeight:'lighter'}} key="2" color="text.primary">
       {service}
     </Typography>,
      <Typography variant="body2" sx={{textTransform:'capitalize',fontWeight:'lighter'}} key="2" color="text.primary">
      {
         `${category} ${service}`
      }
    </Typography>,
     ]
    return (
       <Box sx={{mt:1,ml:smallScreen?1:1,mr:1}}>
        {
          openDrawer&&(
            <Drawer
            anchor="left"
            open={openDrawer}
            onClose={()=>setOpenDrawer(false)}
            >
                <Box sx={{m:1,width:250}}>
                <ServiceCategory localTransactionType={localTransactionType} setLocalTransactionType={setLocalTransactionType} serviceName={service as string} isLink={false}/>
                 {/* mobile filter panel */}
                 <Stack spacing={1} sx={{mt:3}}>
        <Box>
        <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',pl:.5}} >
            <Typography variant="body2">
                Filter:
            </Typography>
            <Button
             variant="text" size="small"
             onClick={handleFilterClear}
             >
                Clear all
            </Button>
            </Box>
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
              <Box sx={{ml:4,mt:4}}>
                <EstimationButton/>
                </Box>
                </Box>
            </Drawer>
          )
        }
         <Grid container spacing={2} >
            {
                !smallScreen&&(
                    <Grid item xs={12} sm={smallScreen?0:2.5} gap={1}>
                <ServiceCategory 
                  localTransactionType={localTransactionType}
                  setLocalTransactionType={setLocalTransactionType} 
                  serviceName={service as string} 
                  isLink={false}
                  />
                {/* desktop filter pannerl */}
                <Stack spacing={1} sx={{mt:3}}>
        <Box>
        <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',pl:.5}} >
            <Typography variant="body2">
                Filter:
            </Typography>
            <Button
            onClick={handleFilterClear}
            variant="text" size="small">
                Clear all
            </Button>
            </Box>
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
                <Box sx={{ml:2,mt:4}}>
                <EstimationButton/>
                </Box>
            </Grid>
                )
            }
            <Grid item xs={12} sm={smallScreen?12:9.5}>
                    <DetailBanner category={category as string}  service={service as string} transactionType={localTransactionType}/>
                   <BreadCrums breadcrumbs={breadcrumbs}/>
                   {
                    !productsLoading && (
                      <BrandFilters/>
                    )
                   }
            <Box sx={{display:'flex',justifyContent:smallScreen?'space-between':'flex-end',mb:1,mt:smallScreen?1:0,alignItems:"center"}}>
            {
             smallScreen&&(
              <IconButton
              onClick={()=>setOpenDrawer(true)}
              >
              <TuneIcon/>
            </IconButton>
             )
            }
            <ListSort/>
            </Box>
            <Grid container spacing={2}>
                  {
                   productsLoading?
                   (
                    <>
                    {
                      [1,2,3,4].map((item)=>(
                        <Grid item xs={12} sm={3} key={item}>
                          <CardSkeleton/>
                        </Grid>
                      ))
                    }
                    </>
                   ):
                   (
                    <>
                    {
                    products?.products?.length>0 ? (
                    <>
                    {
                       products?.products?.map((product:any)=>(
                        <Grid item xs={12} sm={3} key={product?._id}>
                           <ProductCard data={product}/>
                          </Grid>
                      ))
                    }
                   
                    </>
                    ):
                    (
                      <Typography variant="body2" sx={{ml:4,mt:2}}>No Items Matching Your selection</Typography>
                    )
                    }
                    </>
                   )
                  }
                    </Grid>
               {
                true&&(
                    <Box
                    sx={{
                    mt:3,
                    display:'flex',
                    justifyContent:'center',
                   
                }}
                    >
                         <Stack
                         sx={{
                            borderRadius:'8px',
                            background:'rgb(248 248 248)',
                            p:1,
                            width:'fit-content'
                         }}
                         spacing={2}>
                {
                  products?.products?.length>0&&(
                    <Pagination
                    count={Math.ceil(products?.metadata?.totalProducts/pageSize)}
                    page={pageNumber}
                    onChange={handlePaginationChange}
                    renderItem={(item) => (
                      <PaginationItem
                        slots={{
                             previous:()=>(<PaginationNav direction="prev"/>),
                            next:()=>(<PaginationNav direction="next"/>),
                            }}
                        {...item}
                      />
                    )}
                  />
                  )
                }
        </Stack>
    
                    </Box>
                )
               }
        </Grid>
        </Grid>
        
       </Box>
    )
}