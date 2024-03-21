import { Grid, Skeleton, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import useReactRouterQuery from "../../utils/hooks/useQuery";
import { useQuery } from "@tanstack/react-query";
import getPackageDefinitionById from "../../api/package/getPackageDefinitionById";
import getPostTypeDefinitions from "../../api/postTypes/getPostTypeDefinitions";
import { useEffect } from "react";
export default function PackagePriceInfo({setTotal}:{setTotal:(total:number)=>void}){
    const query = useReactRouterQuery()
    const packageId = query.get('packageId')
    const {data:pacakageDef,isLoading} = useQuery({
        queryKey:['packageDef'],
        queryFn:()=>getPackageDefinitionById(packageId!)
    })
    const {data:postTypeDefinitions,isLoading:postTypeLoading} = useQuery({
        queryKey:['postTypeDefinition'],
        queryFn:getPostTypeDefinitions
    })
    const basicPostPrice = postTypeDefinitions?.find((postType:any)=>postType?.name === 'Basic')?.price
    const goldPostPrice = postTypeDefinitions?.find((postType:any)=>postType?.name === 'Gold')?.price
    const premiumPostPrice = postTypeDefinitions?.find((postType:any)=>postType?.name === 'Premium')?.price
    // calculate price
    const packagePrice =   (pacakageDef?.numberOfBasicPosts * basicPostPrice) + 
                           (pacakageDef?.numberOfGoldPosts * goldPostPrice) +
                            (pacakageDef?.numberOfPremiumPosts * premiumPostPrice)
    useEffect(()=>{
    if(typeof packagePrice === 'number'){
        setTotal(packagePrice + 0.15*packagePrice)
    }
    },[packagePrice])
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
                            isLoading || postTypeLoading
                            ?
                            <Skeleton/>
                            :
                            pacakageDef?.name
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
                                isLoading || postTypeLoading
                                ? 
                                <Skeleton/> 
                                :
                                new Intl.NumberFormat('en-Us',{maximumFractionDigits:3})
                                .format(
                                  packagePrice
                                )
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
                              isLoading || postTypeLoading ? 
                              <Skeleton/>
                              :
                              new Intl.NumberFormat('en-Us',{maximumFractionDigits:3})
                              .format(
                              0.15*packagePrice
                              )
                            }
                        </Typography>
                        </Grid>
                    </Grid>
            
        </Stack>
    )
}