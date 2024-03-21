import Grid from "@mui/material/Grid";
import ProductCard from "../products/productCard";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useQuery } from "@tanstack/react-query";
import getSimilarItems from "../../api/products/getSimilarItems";
import { useParams } from "react-router-dom";
export default function RelatedProducts(){
  const {id} = useParams()
  const {data:relatedProducts,isLoading:productsLoading} = useQuery({
    queryKey:['relaedProducts',id],
    queryFn:()=>getSimilarItems(id as string)
   })
    return (
      <Stack spacing={1}>
      <Typography variant="h5" fontWeight={'bold'}>
        Related Products
      </Typography>
        <Grid container spacing={2}>
            {
            relatedProducts?.map((product:any)=>(
              <Grid key={product?._id} item xs={12} sm={3}>
              <ProductCard data={product}/>
          </Grid>
            ))
            }
        </Grid>
      </Stack>
    )
}