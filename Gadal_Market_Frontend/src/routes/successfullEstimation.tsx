import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useLocation } from "react-router-dom";
import getServiceTypeDescription from "../utils/helpers/getServiceTypeDescription";
import getTransactionTypeDescription from "../utils/helpers/getTransactionTypeDescription";
import { IMAGE_URL } from "../api/apiConfig";
export default function SuccessFullEstimation(){
    const location = useLocation()
    const data = location.state?.data
    return (
       <Stack spacing={1} sx={{mt:2}}>
         <Box
         sx={{background:'#08B714',color:'white',p:2,}}
         >
        <Typography sx={{textAlign:'center'}} variant="h4">
             Request Successfully Sent !
        </Typography>
        </Box>
        <Grid container columnSpacing={3}  >
            <Grid item xs={12} sm={2}>
            <Typography sx={{textAlign:'right'}}>
                    Title
                </Typography>
            </Grid>
            <Grid item xs={12} sm={10} >
                <Typography sx={{maxWidth:'70%',fontWeight:'bold'}}>
                   {data?.title}
                </Typography>
            </Grid>
        </Grid>
        <Grid container columnSpacing={3}  >
            <Grid item xs={12} sm={2}>
                <Typography sx={{textAlign:'right'}}>
                    Description
                </Typography>
            </Grid>
            <Grid item xs={12} sm={10} >
            <Typography sx={{maxWidth:'70%',fontWeight:'bold'}}>
                 {data?.description}
                </Typography>
            </Grid>
        </Grid>
        <Grid container columnSpacing={3}  >
            <Grid item xs={12} sm={2}>
                <Typography sx={{textAlign:'right'}}>
                    Category
                </Typography>
            </Grid>
            <Grid item xs={12} sm={10} >
            <Typography sx={{maxWidth:'70%',fontWeight:'bold'}}>
                   {getServiceTypeDescription(data?.service)}
                </Typography>
            </Grid>
        </Grid>
        <Grid container columnSpacing={3}>
            <Grid item xs={12} sm={2}>
                <Typography sx={{textAlign:'right'}}>
                    Sub Category
                </Typography>
            </Grid>
            <Grid item xs={12} sm={10}>
            <Typography sx={{maxWidth:'70%',fontWeight:'bold'}}>
                  {data?.category?.name}
                </Typography>
            </Grid>
        </Grid>
         {
            data?.attributes?.map((attribute:any)=>(
                <Grid container columnSpacing={3} key={attribute?.name}>
            <Grid item xs={12} sm={2}>
                <Typography sx={{textAlign:'right'}}>
                    {attribute?.name}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={10}>
            <Typography sx={{maxWidth:'70%',fontWeight:'bold'}}>
                  {attribute?.value}
                </Typography>
            </Grid>
        </Grid>
            ))
         }
        <Grid container columnSpacing={4}>
            <Grid item xs={12} sm={2}>
                <Typography sx={{textAlign:'right'}}>
                    Type
                </Typography>
            </Grid>
            <Grid item xs={12} sm={10} >
            <Typography sx={{maxWidth:'70%',fontWeight:'bold'}}>
                 {getTransactionTypeDescription(data?.transactionType)}
                </Typography>
            </Grid>
        </Grid>
        {
            data?.model&&(
                <Grid container columnSpacing={3}  >
            <Grid item xs={12} sm={2}>
                <Typography sx={{textAlign:'right'}}>
                    Model
                </Typography>
            </Grid>
            <Grid item xs={12} sm={10} >
            <Typography sx={{maxWidth:'70%',fontWeight:'bold'}}>
                  Toyota
                </Typography>
            </Grid>
        </Grid>
            )
        }
        <Grid container columnSpacing={3}  >
            <Grid item xs={12} sm={2}>
                <Typography sx={{textAlign:'right'}}>
                    Location
                </Typography>
            </Grid>
            <Grid item xs={12} sm={10} >
            <Typography sx={{maxWidth:'70%',fontWeight:'bold'}}>
                   {data?.location?.descripton}
                </Typography>
            </Grid>
        </Grid>
        <Grid container columnSpacing={3}  >
            <Grid item xs={12} sm={2}>
                <Typography sx={{textAlign:'right'}}>
                    Sub City
                </Typography>
            </Grid>
            <Grid item xs={12} sm={10} >
            <Typography sx={{maxWidth:'70%',fontWeight:'bold'}}>
               {data?.subCity?.descripton}
                </Typography>
            </Grid>
        </Grid>
        <Grid container columnSpacing={3}  >
            <Grid item xs={12} sm={2}>
                <Typography sx={{textAlign:'right'}}>
                    Wereda
                </Typography>
            </Grid>
            <Grid item xs={12} sm={10} >
            <Typography sx={{maxWidth:'70%',fontWeight:'bold'}}>
                  {data?.wereda?.descripton}
                </Typography>
            </Grid>
        </Grid>
        <Grid container columnSpacing={3} alignItems={'center'}>
            <Grid item xs={12} sm={2}>
                <Typography sx={{textAlign:'right'}}>
                    Photos
                </Typography>
            </Grid>
            <Grid item xs={12} sm={10} >
             <Stack direction={'row'} spacing={1}>
              {
                data?.images?.map((image:string)=>(
                   <Box
                   key={image}
                   sx={{
                    // position:'relative',
                    border:'1px solid black',
                    borderRadius:1,
                    p:.5,
                   }}
                   >
                     <img 
                    
                    src={`${IMAGE_URL}/${image}`} 
                    width={80} height={60} style={{objectFit:'contain'}}/>
                   </Box>
                ))
              }
             </Stack>
            </Grid>
        </Grid>
        <Typography variant="h6" fontWeight={'bold'} sx={{textAlign:'center',mt:1}}>
            We Will Contact You Soon!
        </Typography>
              
       </Stack>
    )
}