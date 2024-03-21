import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { context } from "./cartContext";
export default function OrderSummary(){
 const {products} = useContext(context)
 const subTotal = products?.reduce((accumulator:number,currentValue:any)=>accumulator + currentValue?.engagmentFee,0)
 const taxAmount = (15/100)*subTotal
 const totalAmount = subTotal + taxAmount
    return (
        <>
         <Box sx={{
                    background:'#EFEFEF',
                    p:2,
                    display:'flex',
                    flexDirection:'column',
                    gap:1
                }}>
                    <Typography variant="h6" fontWeight={'bold'}>
                        Order Summary
                    </Typography>
                    <Grid container spacing={4}>
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
                    <Grid container spacing={4}>
                        <Grid item xs={6} sm={6}>
                        <Typography>
                            Engagement Fee
                        </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                        <Typography>
                            {subTotal} brr
                        </Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={4} sx={{mb:2}}>
                        <Grid item xs={6} sm={6}>
                        <Typography>
                            Vat(15%)
                        </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                        <Typography>
                          {taxAmount} brr
                        </Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{background:'#ABABAB',p:2,pt:1,pb:1}}>
                <Grid container spacing={4}>
                        <Grid item xs={6} sm={6}>
                        <Typography>
                            Total
                        </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                        <Typography>
                       {totalAmount} brr
                        </Typography>
                        </Grid>
                    </Grid>
                    
                </Box>
        </>
    )
}