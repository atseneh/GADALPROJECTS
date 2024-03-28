import { Box, Button, Card,Autocomplete,IconButton,useTheme, CardContent, Chip, Divider, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField, Typography, SelectChangeEvent } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import CloseIcon from '@mui/icons-material/Close'
import { useState } from "react";
import DraftDialog from "./draftDialog";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useMutation, useQuery,useQueryClient} from "@tanstack/react-query";
import getProductById from "../api/getProductById";
import { PostTypes } from "../utils/constants/postTypeEnums";
import updateProduct from "../api/updateProduct";
import * as React from 'react'
import CustomAlert from "./customAlert";

interface ProductFormProps {
    goBack:()=>void,
    productId:string
}
export default function ProductEditForm(props:ProductFormProps){
    const {goBack,productId} = props
    const queryClient = useQueryClient()
    const {data:product,isLoading:prodcutLoading} = useQuery({
      queryKey:['product',productId],
      queryFn:()=>getProductById(productId)
    })
    const rent = product?.transactionType ===1
    const fixed = product?.isFixed
    const theme = useTheme()
    const [openDraft,setOpenDraft] = useState(false)
    const handleDraftClose = ()=>{
      setOpenDraft(false)
    }
    const [openLightBox,setOpenLightBox] = useState(false)
    const [activeImaeIndex,setActiveImageIndex] = useState(0)
    const handleActiveImageChange = (image:string)=>{
      const imageIndex = product?.productImages?.findIndex((i:string)=>i === image)
       if(imageIndex !== -1) {
        setActiveImageIndex(imageIndex)
       }
    }
    const [notificationSnackbarOpen,setNotificationSnackbarOpen] = React.useState(false)
    const [notificationSeverity,setNotficationSeverity] = React.useState<'error'|'success'|undefined>()
    const handleNotificationSnackbarClose = ()=>{
      setNotificationSnackbarOpen(false)
    }
    const productUpdateMutation = useMutation({
      mutationKey:['product-update',productId],
      mutationFn:updateProduct,
      onSuccess:()=>{
        setNotficationSeverity('success')
        queryClient.invalidateQueries({queryKey:['products']})
      },
      onError:()=>{
        setNotficationSeverity('error')
      },
      onSettled:()=>{
        setNotificationSnackbarOpen(true)
      }

    })
    const handleProductUpdate = (data:any)=>{
      if(productUpdateMutation.isPending) {
        return;
      }
    productUpdateMutation.mutate(data)
    }
    const handleDraft = (reason:string,productId:string)=>{
      const payload = {
        productId,
        remark:reason,
        state:2
      }
    handleProductUpdate(payload)
    }
    return (
        <>
        <Card sx={{borderRadius:'20px',mt:2,p:1,}}>
            <Stack spacing={1}>
           <Box
           sx={{
            display:'flex',
            justifyContent:'space-between'
           }}
           >
             <Typography variant="h4" fontWeight={'bold'} >
                    {
                      `Item for ${rent?'Rent':'Sale'}`
                    }
                </Typography>
                <Stack direction={'row'} spacing={1}>
                <Button
              disabled={productUpdateMutation.isPending}
               size="small"
               variant="contained"
               onClick={()=>handleProductUpdate({productId,state:1})}
               sx={{
                   color:'green',
                   background:'#F7F7F7',
                   border:'1px solid green',
               }}
               >
                   Activate
               </Button>
                <Button
                variant="contained"
                size="small"
                sx={{
                    display:'flex',
                    alignItems:'center',
                    gap:.5,
                    background:'white',
                    border:`1px solid ${theme.palette.primary.main}`,
                    color:theme.palette.primary.main,
                    pl:3,pr:3,pb:.5,pt:.5
                }}
        >
        <img width={24} src="/icons/switch.svg"/>
        <Typography variant="body2" fontWeight={'bold'}>
            Switch
        </Typography>
               </Button>
               <Button
                
                variant="contained"
                size="small"
                onClick={()=>{
                  if(product?.state === 2){
                    return;
                  }
                  setOpenDraft(true)
                }}
                sx={{
                    display:'flex',
                    alignItems:'center',
                    gap:.5,
                    background:'white',
                    border:`1px solid tomato`,
                    color:'tomato',
                    pl:3,pr:3,pb:.5,pt:.5
                }}
        >
                <Typography variant="body2" fontWeight={'bold'}>
                    {
                      product?.state === 2 ? 'Drafted':'Draft'
                    }
                </Typography>
               </Button>
               <Button
                variant="contained"
                size="small"
                sx={{
                    display:'flex',
                    alignItems:'center',
                    gap:.5,
                    background:theme.palette.primary.main,
                    color:'white',
                    pl:3,pr:3,pb:.5,pt:.5
                }}
        >
        <Typography variant="body2" fontWeight={'bold'}>
            Sold Out
        </Typography>
               </Button>
               <Button
                variant="contained"
                size="small"
                sx={{
                    display:'flex',
                    alignItems:'center',
                    gap:.5,
                    background:theme.palette.action.disabled,
                    color:'#464141',
                    pl:3,pr:3,pb:.5,pt:.5
                }}
        >
        <Typography variant="body2" fontWeight={'bold'}>
            Disable Ad
        </Typography>
               </Button>
               <Button
                // variant="contained"
                size="small"
                sx={{
                    
                    background:theme.palette.action.disabled,
                    color:'tomato',
                    // pl:1,pr:1,
                }}
        >
                <img width={20} src="/icons/trash.svg"/>
               </Button>
               <IconButton
               onClick={goBack}
               >
                <CloseIcon/>
               </IconButton>
                </Stack>
           </Box>
                <Divider/>
            </Stack>
           {
            prodcutLoading?
            (
              <Typography variant="caption">
                Loading...
              </Typography>
            ):
            (
              <CardContent sx={{p:2}}>
              <Grid container columnSpacing={10}>
               <Grid item xs={12} sm={6.5}>
               <form>
               <Stack spacing={1} sx={{mt:1}}>
               <Stack direction={'row'} spacing={1}>
                 <Chip
                  sx={{p:1,color:rent?'white':'',fontWeight:'bold'}}
                  color={rent?'primary':'default'} label="Rent" 
                  icon={rent?<CheckCircleOutlineIcon fontSize='small' color='inherit'/>:undefined}/>
                 <Chip 
                  sx={{p:1,color:!rent?'white':'',fontWeight:'bold'}}
                  color={!rent?'primary':'default'} label="Sale"
                  
                  icon={!rent?<CheckCircleOutlineIcon fontSize='small' color='inherit'/>:undefined}/>
                  
               </Stack>
               <TextField 
               defaultValue={product?.title}
               required id="title" label="Title" variant="outlined" size="medium" sx={{background:'white'}} />
               <TextField
                defaultValue={product?.description}
                id="description"
                required
                label="Description" variant="outlined"
                minRows={2}
                multiline size="medium" sx={{background:'white'}} />
                <TextField 
                  defaultValue={product?.currentPrice}
                  type="number" id="pirce" label="Price" variant="outlined" size="medium" sx={{background:'white'}} />
                <Stack direction={'row'} spacing={1} sx={{mb:1}}>
                 <Chip
                  sx={{p:1,color:fixed?'white':'',fontWeight:'bold'}}
                  color={fixed?'primary':'default'} label="Fixed" 
                  icon={fixed?<CheckCircleOutlineIcon fontSize='small' color='inherit'/>:undefined}/>
                 <Chip 
                  sx={{p:1,color:!fixed?'white':'',fontWeight:'bold'}}
                  color={!fixed?'primary':'default'} label="Negotiable"
                  icon={!fixed?<CheckCircleOutlineIcon fontSize='small' color='inherit'/>:undefined}/>
                  
               </Stack>
               <FormControl required fullWidth>
              <TextField
              defaultValue={product?.category?.name}
              />
               </FormControl>
               {
                 product?.attributes&&(
                   <>
                   {
                   product?.attributes?.map((attribute:any)=>(
                     <TextField
                     defaultValue={attribute.value}
                     />               
                     
                   ))
                   }
                   </>
                 )
               }
              <TextField
              name="location"
              defaultValue={product?.location?.descripton}
              />
              
       <Box sx={{alignItems:'center',display:'flex',gap:1,flexDirectin:'row'}}>
       <TextField
              
              name="subCity"
              defaultValue={product?.subCity?.descripton}
              />
       <TextField
               
              defaultValue={product?.wereda?.descripton}
              name="wereda"
              />
       </Box>
       <Box sx={{display:'flex',flexDirection:'column', gap:1, border:'1.5px solid #8F8F8F',p:2,borderRadius:'8px',cursor:'pointer'}}>
       
       <Box
       sx={{
         display:'flex',gap:2,
         ml:5
       }}
       >
         <img width={60} src="/icons/icons8_Photo_Gallery.svg"/>
         <Stack>
           <Typography fontWeight={'bold'}>Add Photos</Typography>
           <Typography fontWeight={'bold'} color={'#8F8F8F'}>Drop Or Select Files</Typography>
         </Stack>
       </Box>
       <Divider/>
        {
         product?.productImages?.length>0&&(
           <Stack direction={'row'} sx={{overflowX:'auto'}} spacing={1}>
           {
             product?.productImages?.map((selecteImage:any,index:number)=>(
               <Box
           sx={{
             position:'relative',
             border:'1px solid black',
             borderRadius:1,
             p:.5,
           }}
           onClick={()=>{
             handleActiveImageChange(selecteImage)
             setOpenLightBox(true)
           }}
           >
             <img
              src={`http://127.0.0.1:8000/images/${selecteImage}`} 
              width={60} height={40} 
              style={{objectFit:'contain'}}
              onError={(e)=>e.currentTarget.src = '/icons/icons8_Photo_Gallery.svg'}
              />
           </Box>
             ))
           }
           </Stack>
         )
        }
       
     
     </Box>
       <TextField
       disabled
       defaultValue={product?.youtubeLink}
       id="videoLink" placeholder="Paste Your Video Link Here"
        variant="outlined" size="medium" 
        sx={{background:'white'}} 
        InputProps={{
           endAdornment: (
             <InputAdornment position="end">
               <ContentPasteIcon />
             </InputAdornment>
           ),
         }}
        />
        <Button type="submit"
                fullWidth 
               //  disabled={postMutation.isPending}
                sx={{color:'white',borderRadius:'30px',p:1}}
                variant="contained"
                >
                   <Typography fontWeight={'bold'}>
                       Save
                   </Typography>
                       </Button>
               </Stack>
               </form>
               </Grid>
               <Grid item xs={12} sm={5.5}>
                   <Stack spacing={1}>
                   <Box
                   sx={{
                       display:'flex',
                       alignItems:'center',
                       borderRadius:'8px',
                       border:'1px solid black',
                       p:1,
                       gap:2,
                   }}
                   >
                   <img
                   src="/icons/femaleSkin.svg"
                   width={70}
                   />
                   <Stack>
                   <Typography variant="h6" fontWeight={"bold"}>
               {
               `${product?.consignee?.firstName} ${product?.consignee?.lastName}`
               }
           </Typography>
            <Box sx={{display:'flex',alignItems:'center',gap:1}}>
            <img  src="/icons/icons8_phone_1.svg"/>
            <Typography variant="caption" fontWeight={'bold'}>
                   Phone: {product?.consignee?.phoneNumber}
               </Typography>
            </Box>
            <Box sx={{display:'flex',alignItems:'center',gap:1}}>
            <img  src="/icons/icons8_paper_plane.svg"/>
            <Typography variant="caption" fontWeight={'bold'}>
                   Email: {product?.consignee?.email}
               </Typography>
            </Box>
                   </Stack>
                   </Box>
                  <Box>
                    <Box
                     sx={{
                       display:'flex',
                       borderRadius:'8px',
                       border:'1px solid gold',
                       pb:2,
                       pt:.5,
                       flexDirection:'column'
                       
                   }}
                   >
                   <img
                   style={{alignSelf:'flex-end'}}
                   width={50}
                   height={35}
                   src="/icons/bestSeller.svg"
               />
                   <Box
                   sx={{
                       display:'flex',
                       gap:1,
                       alignItems:'center',
                       alignSelf:'center'
                   }}
                   >
                   {
                    product?.postType === 1 || product?.postType === 2 && (
                      <img src="/icons/gadalgold.svg"/>
                    )
                   }
                       <Typography variant="h4">
                           {/* Gadal <span style={{color:product?.postType===2?'gold':'',fontWeight:'bold'}}>Gold</span> */}
                           {
                            PostTypes[product?.postType as 1||2||3]
                           }
                       </Typography>
                   </Box>
                   </Box>
                  </Box>
                   </Stack>
               </Grid>
              </Grid>
           </CardContent>
            )
           }
        </Card>
          {
            openDraft&&(
              <DraftDialog 
              handleDraft={handleDraft}
              productId={product?._id} open={openDraft} handleClose={handleDraftClose}
              isSubmiting={productUpdateMutation.isPending}
              />
            )
          }
          {
            <Lightbox
            index={activeImaeIndex}
            open={openLightBox}
            close={() => setOpenLightBox(false)}
            slides={
              product?.productImages?.map((image:string)=>({src:`http://127.0.0.1:8000/images/${image}`}))
            }
          />
          }
           {
           notificationSnackbarOpen&&(
            <CustomAlert
            open={notificationSnackbarOpen}
            handleSnackBarClose = {handleNotificationSnackbarClose}
            severity={notificationSeverity}
            errorMessage={productUpdateMutation.error?.message}
            successMessage="Product Updated Successfully"
            />
           )
          }
        </>
    )
}