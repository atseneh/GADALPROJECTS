import { Button, FormControl, Grid, InputLabel, MenuItem, Select, Stack, Typography,IconButton, Tooltip, useTheme } from "@mui/material";
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
import { useLocation, useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import postProduct from "../../api/products/postProduct";
import deserializeFormData from "../../utils/helpers/deserializeFormData";
import { useFormData } from "../../components/common/productPostContext";
const paymentOptions = [
    {
        id:1,
        description:'Chapa',
        logoUrl:'/chapa1.jpg'
    },
    {
        id:2,
        description:'Telebirr',
        logoUrl:'/telebirr1.png'
    }
]
function objectToFormData(data: Record<string, any>): FormData {
    const formData = new FormData();
    Object.keys(data)?.forEach((key)=>{
      const value = data[key]
      if(key==='images'){
        formData.append('images',value)
        return;
      }
      if(Array.isArray(value)){
        formData.append(key,JSON.stringify(value))
        return
      }
      formData.append(key,value)
    })
    return formData;
}
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
 const navigate = useNavigate();
 const theme = useTheme()
 const printRef = useRef(null)
 const handlePrint = useReactToPrint({
    content:() => printRef.current,
 })
 const [selectedPaymentMethod,setSelectedPaymentMethod] = useState(1)
 const {formData,setFormData} = useFormData();  // don't forget to add postType when the product is posted
 const query = useReactRouterQuery()
 const paymentType = query.get('paymentType')
 const packageId = query.get('packageId')
 const postTypeId = query.get('typeId')
 const {data:selectedPackage} = useQuery({
    queryKey:['packageDef'],
    queryFn:()=>getPackageDefinitionById(packageId!),
    enabled:Boolean(packageId)
 })
 const packageMutation = useMutation({
    mutationKey:['create_package'],
    mutationFn:createPackage,
    onSuccess:(data)=>{
        
       const checkoutUrl = data?.transaction?.checkout_url;
       window.location.href = checkoutUrl
    },
    onError:()=>{

    },
    onSettled:()=>{

    }
 })
 const {mutate:post,isPending:postPending} = useMutation({
    mutationFn:postProduct,
    mutationKey:['post_product'],
    onSuccess:(data)=>{
        setFormData(null)
        const checkoutUrl = data?.transaction?.checkout_url;
        window.location.href = checkoutUrl
     },
 })
 // process payment 
 const handlePackagePayment = ()=>{
   const packagePayload = {
        amount:"1", // replace with total
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
 const handleProductPostPayment = ()=>{
     if(!(postTypeId && paymentType==='post')){
        return;
     }
    const payload = formData as FormData
    payload.delete('postType')
    payload.delete('paymentAmount')
    payload.append('postType',postTypeId)
    payload.append('paymentAmount','1')
    if(postPending){
        return;
    }
    post(payload)
 }
 const processPayment = ()=>{
    if(paymentType === 'package'){
        handlePackagePayment();
        return;
    }
    if(paymentType==='post'){
        handleProductPostPayment();
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
        <Stack spacing={3} sx={{mt:4}}>
                  {/* <Box sx={{display:'flex',flexDirection:'column',gap:1}}>
                 <Typography fontWeight={'bold'} variant="h6">
                         Payment Options
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
                   </Box> */}
                <Typography fontWeight={'bold'} variant="h6">
                         Payment Options
                 </Typography>
            <Stack
            direction={'row'}
            alignItems={'center'}
            spacing={4}
            >
             {
                paymentOptions?.map((option)=>(
                    <Box
                    key={option.id}
                    sx={{
                       background:'white',
                       border:selectedPaymentMethod === option.id ? `2px solid ${theme.palette.primary.main}`:'1px solid black',
                       p:1,
                       borderRadius:'8px',
                       cursor:'pointer',
                       position:'relative'
                    }}
                    onClick = {()=>{
                        setSelectedPaymentMethod(option.id)
                    }}
                    >
                    {
                        selectedPaymentMethod === option.id && (
                            <CheckCircleOutlineIcon
                            color={selectedPaymentMethod === option.id ? 'primary':'inherit'}
                            sx={{
                                position:'absolute',
                                top:1,
                                left:1,
                            }}
                            />
                        )
                    }
                   <img
                   alt={option.description}
                   src={option.logoUrl}
                   style={{
                       width:90,
                       height:90,
                       objectFit:'contain'
                   }}
                   />
                    </Box>
                ))
             }
            </Stack>
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
                 onClick={processPayment}
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