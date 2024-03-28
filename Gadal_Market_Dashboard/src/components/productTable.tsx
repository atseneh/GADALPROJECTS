import { Grid, Paper, Stack, Typography,IconButton, Box, Divider } from "@mui/material"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Checkbox from '@mui/material/Checkbox';
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import getProducts from "../api/getProducts";
import { IMAGE_URL } from "../api/apiConfig";
import CircleIcon from '@mui/icons-material/Circle';
import { ProductStateEnums } from "../utils/constants/productState";
import Pagination from '@mui/material/Pagination';
export function compareArrays(arr1:any,arr2:any){
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  if (set1.size !== set2.size) {
    return false;
  }

  for (const element of set1) {
    if (!set2.has(element)) {
      return false;
    }
  }

  return true;

}
interface ProductTableProps {
    onEdit:(id:string)=>void;
    selectedCategory:string;
}
export default function ProductTable(props:ProductTableProps){
    const {onEdit,selectedCategory} = props
    const [page, setPage] = React.useState(1);
    const [pageCount,setPageCount] = useState(5)
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
    };
    const {serviceId} = useParams()
    const {data:products,isLoading:productsLoading} = useQuery({
        queryKey:['products',serviceId,selectedCategory,page,pageCount],
        queryFn:()=>getProducts({
            productType:Number(serviceId),
            category:selectedCategory,
            pageNum:page,
            pageSize:pageCount,
        })
    })
    const [selectedProducts,setSelectedProducts] = useState<any[]>([])
    // const productIds = products?.map((prodcut:any)=>prodcut?._id)
    const productIds = Array.isArray(products) ? products.map((product:any) => product?._id) : [];

    const allAreSelected = compareArrays(selectedProducts,productIds)
    const handleAllSelection = ()=>{
    if(allAreSelected){
    setSelectedProducts([])
    return;
    }
     setSelectedProducts([])
    
     setSelectedProducts(Array.isArray(products) ? products.map((product:any) => product?._id) : []);

    }
    const handleSingleSelection = (id:number)=>{
    const selectedIndex =  selectedProducts.findIndex((selected:any)=>selected === id)
    if(selectedIndex !== -1){
    setSelectedProducts(selectedProducts.filter((selected:any)=>selected !== id))
    }
    else {
        setSelectedProducts([...selectedProducts,id])
    }
    }
  useEffect(()=>{
    if(Array.isArray(products) && products?.length>0){
        setPageCount(products?.length)
    }
  },[products])
    return (
        <Stack spacing={1}>
        <Paper
        sx={{
            borderRadius:'8px',
            p:1.3
        }}
        >
            <Grid container spacing={1} alignItems={'center'}>
            <Grid item lg={5}>
                <Box 
                sx={{display:'flex',alignItems:'center',}}
                >
                <Checkbox
                checked={allAreSelected}
                indeterminate={selectedProducts?.length>0 && selectedProducts?.length<products?.length}
                onChange={handleAllSelection}
                size="small"/>
                <Typography fontWeight={'bold'}>
                    {`Products(${products?.length||0})`}
                </Typography>
                <IconButton size="small">
                    <ArrowDropDownIcon/>
                </IconButton>
                </Box>
            </Grid>
            <Grid item lg={2}>
            <Box 
                sx={{display:'flex',alignItems:'center',}}
                >
                <Typography fontWeight={'bold'}>
                    Price
                </Typography>
                <IconButton size="small">
                    <ArrowDropDownIcon/>
                </IconButton>
                </Box>
            </Grid>
            <Grid item lg={2}>
            <Box 
                sx={{display:'flex',alignItems:'center',}}
                >
                <Typography fontWeight={'bold'}>
                    Location
                </Typography>
                <IconButton size="small">
                    <ArrowDropDownIcon/>
                </IconButton>
                </Box>
            </Grid>
            <Grid item lg={2}>
            <Box 
                sx={{display:'flex',alignItems:'center',}}
                >
                <Typography fontWeight={'bold'}>
                    Status
                </Typography>
                <IconButton size="small">
                    <ArrowDropDownIcon/>
                </IconButton>
                </Box>
            </Grid>
            <Grid item lg={1}>
                <Typography fontWeight={'bold'}>
                    Edit
                </Typography>
            </Grid>
            </Grid>
        </Paper>
        <Paper
         sx={{
            borderRadius:'8px',
            p:1.3
        }}
        >
         {
         productsLoading?(
            <Typography variant="caption">
                Loading...
            </Typography>
         )
         :
         (
            
            products?.map((product:any,index:number)=>(
                <React.Fragment key={index}>
                <Grid container spacing={1} alignItems={'center'}>
                <Grid item lg={5}>
                <Box
                sx={{display:'flex',gap:1,alignItems:'center'}}
                >
                <Checkbox
                checked={selectedProducts.includes(product?._id)}
                onChange={()=>{
                    handleSingleSelection(product?._id)
                }}
                size="small"/>
                <img 
                style={{objectFit:'contain',borderRadius:'8px'}}
                width={70} height={70} src={`${IMAGE_URL}/${product?.productImages?.at(0)}`}
                onError={(e)=>{
                    e.currentTarget.src = '/icons/icons8_Photo_Gallery.svg'
                }} 
                 />
                <Typography variant="body2" fontWeight={'bold'}>
                    {product.title}
                </Typography>
                </Box>
               
                </Grid>
                <Grid item lg={2}>
               <Typography variant="body2" fontWeight={"bold"}>
               {
                    new Intl.NumberFormat('en-Us',{maximumFractionDigits:3}).format(product?.currentPrice)
                }
               </Typography>
                </Grid>
                <Grid item lg={2}>
               <Typography variant="body2" fontWeight={"bold"}>
               {
                    product?.location?.descripton
                }
               </Typography>
                </Grid>
                <Grid item lg={2}>
               <Typography variant="body2" fontWeight={"bold"} sx={{display:'flex',alignItems:'center',gap:.5}}>
                <CircleIcon
                sx={{
                    fontSize:'.8rem'
                }}
                fontSize="small"
                color={
                product?.state === 1 ?'success':product?.state===2?'error':product?.state===3?'warning':'inherit'} 
                />
               {
                    ProductStateEnums[product?.state as 1||2||3||4||5]
                }

               </Typography>
                </Grid>
                <Grid item lg={1}>
                 <IconButton
                 onClick={()=>{
                    onEdit(product?._id)
                 }}
                 sx={{
                    borderRadius: '50%',
                    backgroundColor: '#EDFDEC',
                    // boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
                 }}
                 >
                    <img width={15} src="/icons/edit.svg"/>
                 </IconButton>
                </Grid>
                </Grid>
                <Divider/>
                </React.Fragment>
            ))
         )
         }
        </Paper>
        <Paper
        sx={{
            display:'flex',
            flexDirection:'column',
            p:1,
        }}
        >
        <Pagination sx={{alignSelf:'center'}} count={pageCount} page={page} onChange={handleChange} />
        </Paper>
        </Stack>
    )
}