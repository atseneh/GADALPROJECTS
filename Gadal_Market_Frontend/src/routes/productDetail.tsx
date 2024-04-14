import Box from "@mui/material/Box"
import BreadCrums from "../components/common/breadCrums"
import { Grid, Link, Skeleton, Stack, Typography } from "@mui/material"
import useSmallScreen from "../utils/hooks/useSmallScreen"
import "yet-another-react-lightbox/styles.css";
import ProductImageGallery from "../components/common/productImageGallery"
import ProductInfo from "../components/common/productInfo"
import DescriptionAndReview from "../components/common/productDescriptionAndReview"
import RelatedProducts from "../components/common/relatedProducts"
import { useMutation, useQuery } from "@tanstack/react-query"
import getProductById from "../api/products/getProductById"
import { useParams } from "react-router-dom"
import { IMAGE_URL } from "../api/apiConfig"
import { useEffect } from "react";
import updateViewCount from "../api/products/updateViewCount";
import getServiceTypeDescription from "../utils/helpers/getServiceTypeDescription";
import getTransactionTypeDescription from "../utils/helpers/getTransactionTypeDescription";
export default function ProductDetail(){
    const smallScreen = useSmallScreen()
    const variant = smallScreen?'caption':'body1'
    const {id} = useParams()
    const {data:product,isLoading:productLoading} = useQuery({
      queryKey:['getSingleProduct',id],
      queryFn:()=>getProductById(id as string)
    })
    const productUpdateMutation = useMutation({
      mutationFn:updateViewCount,
      mutationKey:['updateViewCount'],
    })
   
    const breadcrumbs = [
        <Link underline="hover" key="1" color="inherit" href="/" >
        Home
      </Link>,
        <Typography variant={variant} sx={{textTransform:'capitalize',fontWeight:'lighter'}} key="2" color="text.primary">
        {
        productLoading?<Skeleton/>:
        getTransactionTypeDescription(product?.transactionType)
        }
      </Typography>,
       <Link underline="hover" key="1" color="inherit" href={`/${getServiceTypeDescription(product?.productType)}/${product?.category?.name}?cat=${product?.category?._id}&transaction=${getTransactionTypeDescription(product?.transactionType)}`} >
       {
       productLoading?<Skeleton/>:
       product?.category?.name
       }
     </Link>,
      <Typography variant={variant} sx={{textTransform:'capitalize',fontWeight:'lighter'}} key="2" color="text.primary">
      {
        productLoading?<Skeleton/>:
         `${getServiceTypeDescription(product?.productType)}`
      }
    </Typography>,
     ] 
   useEffect(()=>{
    const currentViewCount = product?.viewCount||0
    productUpdateMutation.mutate({
      id:id as string,
      count:(currentViewCount + 1)
    })
   },[id,product])
    return (
        <Box sx={{mr:smallScreen?0:2}}>
            <Box sx={{mt:1,ml:smallScreen?1:5,}}>
            <BreadCrums breadcrumbs={breadcrumbs}/>
            </Box>
        <Box sx={{m:smallScreen?1:2}}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={5.5}>
                  <ProductImageGallery loading={productLoading} images={product?.productImages?.map((imagPath:string,index:number)=>({id:`${index}`,path:`${IMAGE_URL}/${imagPath}`}))}/>
                </Grid>
                <Grid item xs={12} sm={6.5}>
                    <ProductInfo data={product} loading = {productLoading}/>
                </Grid>
            </Grid>
        </Box>
        <Stack sx={{ml:smallScreen?1:18,mr:smallScreen?4:0}} spacing={3}>
        <DescriptionAndReview data={product} loading={productLoading}/>
        <RelatedProducts/>
        </Stack>
        </Box>
    )
}