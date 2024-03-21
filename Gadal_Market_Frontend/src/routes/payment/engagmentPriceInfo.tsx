import { Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useContext, useEffect } from "react";
import { context } from "../../components/common/cartContext";

export default function EnagementPriceInfo({setTotal}:{setTotal:(total:number)=>void}){
    const {products} = useContext(context)
    const subTotal = products?.reduce((accumulator:number,currentValue:any)=>accumulator + currentValue?.engagmentFee,0)
    const taxAmount = (15/100)*subTotal
    const totalAmount = subTotal + taxAmount
    useEffect(()=>{
    if(typeof totalAmount === 'number'){
        setTotal(totalAmount)
    }
    },[totalAmount])
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
                            Items
                        </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                        <Typography>
                            {products?.length}
                        </Typography>
                        </Grid>
                    </Grid>
                    <Grid container columnSpacing={2}>
                        <Grid item xs={6} sm={6}>
                        <Typography>
                            Engagement Fee
                        </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                        <Typography>
                            {subTotal}
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
                            {taxAmount}
                        </Typography>
                        </Grid>
                    </Grid>
            
        </Stack>
    )
}