import { Grid, Skeleton, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import useReactRouterQuery from "../../utils/hooks/useQuery";
import { useQuery } from "@tanstack/react-query";
import getPostTypeById from "../../api/postTypes/getPostTypeById";
import { useEffect } from "react";
export default function PostPriceInfo({setTotal}:{setTotal:(total:number)=>void}){
    const query = useReactRouterQuery()
    const postTypeId = query.get('typeId')
    const {data:postType,isLoading} = useQuery({
        queryKey:['postType'],
        queryFn:()=>getPostTypeById(postTypeId!)
    })
    const total = postType?.price + 0.15*postType?.price
    useEffect(()=>{
    if(typeof total === 'number'){
        setTotal(total)
    }
    },[total])
    return (
        <Stack
        spacing={1}
        >
              <Box sx={{background:'#ABABAB',p:2,pt:1,pb:1}}>
                        <Typography>
                            Price Info
                        </Typography>
                    
                </Box>
                    <Grid container columnSpacing={2}>
                        <Grid item xs={6} sm={6}>
                        <Typography>
                            Post Type
                        </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                        <Typography>
                          {
                            isLoading?<Skeleton/>:postType?.name
                          }
                        </Typography>
                        </Grid>
                    </Grid>
                    <Grid container columnSpacing={2}>
                        <Grid item xs={6} sm={6}>
                        <Typography>
                            Price
                        </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                        <Typography>
                            {
                                isLoading?<Skeleton/>:postType?.price
                            }
                        </Typography>
                        </Grid>
                    </Grid>
                    <Grid container columnSpacing={2} sx={{mb:2}}>
                        <Grid item xs={6} sm={6}>
                        <Typography>
                            Vat(15%)
                        </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                        <Typography>
                            {
                              isLoading ? 
                              <Skeleton/>
                              :
                              new Intl.NumberFormat('en-Us',{maximumFractionDigits:3}).format(postType?.price*0.15)
                            }
                        </Typography>
                        </Grid>
                    </Grid>
            
        </Stack>
    )
}