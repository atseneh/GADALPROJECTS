import { Button, FormControl, Grid, InputLabel, MenuItem, Select, Stack, Typography,IconButton, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import PrintIcon from '@mui/icons-material/Print';
import { useContext, useRef, useState } from "react";
import { context } from "../../components/common/cartContext";
import useSmallScreen from "../../utils/hooks/useSmallScreen";
import EnagementPriceInfo from "./engagmentPriceInfo";
import useReactRouterQuery from "../../utils/hooks/useQuery";
import PostPriceInfo from "./postPriceInfo";
import PackagePriceInfo from "./pcakgeSubscriptionPriceInfo";
import { useMutation, useQuery } from "@tanstack/react-query";
import createPackage from "../../api/package/createPackageForUser";
import getPackageDefinitionById from "../../api/package/getPackageDefinitionById";
import { useReactToPrint } from "react-to-print";
import PaymentAttachment from "./paymentAttachment";
function addDaysToNow(daysToAdd:number) {
    const currentDate = new Date(); // Get the current date
    const newDate = new Date(currentDate); // Create a new date object to avoid mutating the original date

    // Add the specified number of days to the new date
    newDate.setDate(newDate.getDate() + daysToAdd);

    return newDate; // Return the new date
}

export default function Payment(){
 const [totalAmount,setTotalAmount] = useState(0)
 const handleTotalAmountChange = (total:number)=>{
    setTotalAmount(total)
 }
 const printRef = useRef(null)
 const handlePrint = useReactToPrint({
    content:() => printRef.current,
 })
 const query = useReactRouterQuery()
 const paymentType = query.get('paymentType')
 const packageId = query.get('packageId')
 const {data:selectedPackage} = useQuery({
    queryKey:['packageDef'],
    queryFn:()=>getPackageDefinitionById(packageId!)
 })
 const packageMutation = useMutation({
    mutationKey:['create_package'],
    mutationFn:createPackage,
    onSuccess:()=>{
        console.log(
          'successfully created'  
        )
    },
    onError:()=>{

    },
    onSettled:()=>{

    }
 })
 // process payment 
 const handlePayment = ()=>{
   const packagePayload = {
        description:selectedPackage?.name,
        startDate:new Date().toISOString(),
        endDate:addDaysToNow(20).toISOString(),
        user:localStorage.getItem('userId'),
        remainingGoldPosts:selectedPackage?.numberOfGoldPosts,
        remainingPremiumPosts:selectedPackage?.numberOfPremiumPosts,
        remainingBasicPosts:selectedPackage?.numberOfBasicPosts,
        remainingFreeEstimationPosts:selectedPackage?.numberOfFreeEstimations,
        packageDefinition:packageId
   }
   if(packageMutation.isPending) {
    return;
   }
   if(paymentType === 'package' && packageId){
    packageMutation.mutate(packagePayload)
    return;
   }
 }
 const renderPriceInfo = ()=>{
    if(paymentType==='engagement'){
        return <EnagementPriceInfo setTotal={handleTotalAmountChange}/>
    }
    if(paymentType==='post'){
        return <PostPriceInfo setTotal={handleTotalAmountChange}/>
    }
    if(paymentType === 'package'){
        return <PackagePriceInfo setTotal={handleTotalAmountChange}/>
    }
 }
    return (
       <>
        <Grid container spacing={2} sx={{m:2,}}>
        <Grid xs={12} sm={4}>
        <Stack spacing={3} sx={{pr:4}}>
                  <Box sx={{display:'flex',flexDirection:'column',gap:1}}>
                 <Typography fontWeight={'bold'} variant="h6">
                         Bank Payment Options
                 </Typography>
                 <FormControl fullWidth>
                  <InputLabel id="category">Category</InputLabel>
                     <Select
                        labelId="category"
                        id="category-select"
                        label="Category"
                        // onChange={handleChange}
                    >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
                    </Box>
                    <Box sx={{display:'flex',flexDirection:'column',gap:1}}>
                   <Typography fontWeight={'bold'} variant="h6">
                        Mobile Money Options
                    </Typography>
                    <FormControl fullWidth>
                    <InputLabel id="category">Category</InputLabel>
                    <Select
                        labelId="category"
                        id="category-select"
                        label="Category"
                        // onChange={handleChange}
                    >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
                   </Box>
                </Stack>
        </Grid>
        <Grid xs={12} sm={4}>

        </Grid>
        <Grid xs={12} sm={4}>
        <Box>
            <Box sx={{
                    background:'white',
                    pr:6,
                    display:'flex',
                    flexDirection:'column',
                    gap:1
                }}>
                   <Tooltip title="Print">
                   <IconButton
                     sx={{
                        alignSelf:'flex-end'
                    }}
                    onClick={handlePrint}
                     >
                   <PrintIcon fontSize="large"/>
                        </IconButton>
                   </Tooltip>
                      {
                        renderPriceInfo()
                      }
                       
                       {/* payment information */}
                       <Stack
                       spacing={1}
                       sx={{
                        mt:2
                       }}
                       >
                        <Box sx={{background:'#ABABAB',p:2,pt:1,pb:1}}>
                        <Typography>
                            Payment Info
                        </Typography>
                    
                     </Box>
                    <Grid container columnSpacing={2}>
                        <Grid item xs={6} sm={6}>
                        <Typography>
                            Payment Option
                        </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                        <Typography>
                            CBE
                        </Typography>
                        </Grid>
                    </Grid>
                    <Grid container columnSpacing={2}>
                        <Grid item xs={6} sm={6}>
                        <Typography>
                            Account Number
                        </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                        <Typography>
                            10004334343
                        </Typography>
                        </Grid>
                    </Grid>
                    <Grid container columnSpacing={2} sx={{mb:2}}>
                        <Grid item xs={6} sm={6}>
                        <Typography>
                            Date
                        </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                        <Typography>
                            {new Date().toLocaleDateString()}
                        </Typography>
                        </Grid>
                    </Grid>
                       </Stack>
                    <Box sx={{background:'#ABABAB',p:2,pt:1,pb:1}}>
                <Grid container columnSpacing={2}>
                        <Grid item xs={6} sm={6}>
                        <Typography>
                            Total
                        </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                        <Typography>
                            {totalAmount} birr
                        </Typography>
                        </Grid>
                    </Grid>
                    
                </Box>
                <Button 
                 size="small"
                 sx={{
                    color:'white',
                    borderRadius:'15px',
                    p:1,
                    alignSelf:'flex-end'
                }}
                 variant="contained"
                 onClick={handlePayment}
                 >
                    <Typography>
                        Pay Now
                    </Typography>
                        </Button>
                </Box>
               
            </Box>
        </Grid>
        
        </Grid>
       <div
        style={{
            display:'none'  // display only on print window
        }}
       >
       <div 
        ref={printRef}
       
        >
         <PaymentAttachment/>
        </div>
       </div>
       </>
    )
}