import { Box, Button, Card,Autocomplete,IconButton,useTheme, CardContent, Chip, Divider, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField, Typography, SelectChangeEvent, Popover } from "@mui/material";
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
import getCategoriesByService from "../api/getCategoryByService";
import getCategoryAttributes from "../api/getCategoryAttributes";
import getSubcities from "../api/getSubCity";
import getWeredas from "../api/getWereda";
import getLocations from "../api/getLocations";
import { IMAGE_URL } from "../api/apiConfig";
import getBrandByCategory from "../api/getBrandCategory";
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
    const [fixed,setFixed] = useState(true)
    const [rent,setRent] = useState(true)
    const [title,setTitle] = useState('')
    const [description,setDescription] = useState('')
    const [price,setPrice] = useState('')
    const [videoLink,setVideoLink] = useState('')
    const [selectedService,setSelectedService] = useState(2)
    const [category,setCategory] = useState<any>(null)
    const [categoryInputValue,setCategoryInputValue] = useState('')
    const [brand,setBrand] = useState<any>(null)
    const [brandInputValue,setBrandInputVale] = useState('')
    const [location,setLocation] = useState<any>(null)
    const [locationInputValue,setLocationInputValue] = useState('')
    const [subCity,setSubCity] = useState<any>(null)
    const [subCityInputValue,setSubCityInputValue] = useState('')
    const [wereda,setWereda] = useState<any>(null)
    const [weredaInputValue,setWeredaInputValue] = useState('')
    const [attributeValues,setAttributeValues] = React.useState<{[key:string]:any}|any>()
    const [deleteAnchorEl, setDeleteAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setDeleteAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setDeleteAnchorEl(null);
    };
  
    const openDelete = Boolean(deleteAnchorEl);
    const id = openDelete ? 'delete-popover' : undefined;
  
    const handleAttributeChange = (e:React.ChangeEvent<HTMLInputElement> | SelectChangeEvent)=>{
      const value = e.target.value;
      const name = e.target.name;
      setAttributeValues({
        ...attributeValues,
        [name]:value
      })
    }
    const {data:categories,isLoading:categoriesLoding} = useQuery({
      queryKey:['categoriesByService',selectedService],
      queryFn:()=>getCategoriesByService(selectedService)
     })
     const {data:locations,isLoading:locationsLoading} = useQuery({
      queryKey:['locations'],
      queryFn:getLocations
     })
     const {data:categoryAttributes,isLoading:attributesLading} = useQuery({
      queryKey:['categoryAttributes',category],
      queryFn:()=>getCategoryAttributes(category?._id),
      enabled:Boolean(category)
     })

     const {data:brands,isLoading:brandsLoading} = useQuery({
      queryKey:['brand_filters',category],
      queryFn:()=>getBrandByCategory(category?._id),
      enabled:Boolean(category)
     })

     const {data:subCities,isLoading:subCitiesLoading} = useQuery({
      queryKey:['subCities',location],
      queryFn:()=>getSubcities(location?._id),
      enabled:Boolean(location)
     })
     const {data:weredas,isLoading:weredasLoading} = useQuery({
      queryKey:['weredas',subCity],
      queryFn:()=>getWeredas(subCity?._id),
      enabled:Boolean(subCity)
     })

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
      mutationKey:['product-update'],
      mutationFn:updateProduct,
      onSuccess:()=>{
        setNotficationSeverity('success')
        queryClient.invalidateQueries({queryKey:['products']})
        queryClient.invalidateQueries({queryKey:['product',productId]})
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
    const handleProductEdit = ()=>{
      let dataToUpdate:any = {
        title,
        description,
        currentPrice:price,
        previousPrice:price,
        category:category?._id,
        isFixed:fixed,
        location:location?._id,
        subCity:subCity?._id,
        wereda:wereda?._id,
        transactionType:rent?'1':'2',
        youtubeLink:videoLink,
        productType:selectedService,
        productId
      }
      let productAttributes:any = []
      if(attributeValues){
        productAttributes = Object.keys(attributeValues)?.map((key)=>({name:key,value:`${attributeValues[key]}`}))
      }
      if(productAttributes?.length > 0){
        dataToUpdate.attributes = productAttributes
      }
      if(brand){
        dataToUpdate.brand = brand?._id

      }
      if(productUpdateMutation.isPending){
        return;
      }
      productUpdateMutation.mutate(dataToUpdate)
     
    }
   React.useEffect(()=>{
    if(product?._id){
      setSelectedService(product?.productType)
      setFixed(product?.isFixed)
      setRent(product?.transactionType === 1 || product?.transactionType === '1' )
      setTitle(product?.title)
      setDescription(product?.description)
      setPrice(product?.currentPrice)
      setVideoLink(product?.youtubeLink)
      setCategory(product?.category)
      setLocation(product?.location)
      setSubCity(product?.subCity)
      setWereda(product?.wereda)
      setBrand(product?.brand)
      if(Array.isArray(product?.attributes) && product?.attributes?.length>0){
        setAttributeValues(
          product?.attributes?.reduce((acc:any,attr:any)=>({
            ...acc, [attr?.name]:attr?.value
          }),{})
        )
      }
    }
   },[product])

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
                onClick={()=>handleProductUpdate({productId,derivedState:5})}
                disabled={productUpdateMutation.isPending}
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
                onClick={()=>handleProductUpdate({productId,state:4})}
                disabled={productUpdateMutation.isPending}
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
                onClick={handleClick}
                disabled={productUpdateMutation.isPending}
              >
                <img width={20} src="/icons/trash.svg"/>
               </Button>
               <Popover
        id={id}
        open={openDelete}
        anchorEl={deleteAnchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Stack
        >
           <Typography sx={{ p: 2 }}>Are You sure?</Typography>
           <Stack
           direction={'row'}
           >
            <Button
            onClick={handleClose}
            >
              No
            </Button>
            <Button
            color="error"
            onClick={()=>{
              handleProductUpdate({productId,recordStatus:3})
              handleClose();
            }}
            >
              Yes
            </Button>
           </Stack>
        </Stack>
              </Popover>
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
               <form
               onSubmit={(e)=>{
                e.preventDefault();
                handleProductEdit()
               }}
               >
               <Stack spacing={1} sx={{mt:1}}>
               <Stack direction={'row'} spacing={1}>
                  <Chip
                   sx={{p:1,color:rent?'white':'',fontWeight:'bold'}}
                   color={rent?'primary':'default'} label="Rent" 
                   onClick={()=>{
                   setRent(true)
                  }}
                   icon={rent?<CheckCircleOutlineIcon fontSize='small' color='inherit'/>:undefined}/>
                  <Chip 
                   sx={{p:1,color:!rent?'white':'',fontWeight:'bold'}}
                   color={!rent?'primary':'default'} label="Sale"
                   onClick={()=>{
                    setRent(false)
                    }}
                   icon={!rent?<CheckCircleOutlineIcon fontSize='small' color='inherit'/>:undefined}/>
                   
                </Stack>
               <TextField 
               value={title}
               onChange={(e)=>setTitle(e.target.value)}
               required id="title" label="Title" variant="outlined" size="medium" sx={{background:'white'}} />
               <TextField
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
                id="description"
                required
                label="Description" variant="outlined"
                minRows={2}
                multiline size="medium" sx={{background:'white'}} />
                <TextField 
                  value={price}
                  onChange={(e)=>setPrice(e.target.value)}
                  type="number" id="pirce" label="Price" variant="outlined" size="medium" sx={{background:'white'}} />
                <Stack direction={'row'} spacing={1} sx={{mb:1}}>
                  <Chip
                   sx={{p:1,color:fixed?'white':'',fontWeight:'bold'}}
                   color={fixed?'primary':'default'} label="Fixed" 
                   onClick={()=>{
                   setFixed(true)
                  }}
                   icon={fixed?<CheckCircleOutlineIcon fontSize='small' color='inherit'/>:undefined}/>
                  <Chip 
                   sx={{p:1,color:!fixed?'white':'',fontWeight:'bold'}}
                   color={!fixed?'primary':'default'} label="Negotiable"
                   onClick={()=>{
                    setFixed(false)
                    }}
                   icon={!fixed?<CheckCircleOutlineIcon fontSize='small' color='inherit'/>:undefined}/>
                   
                </Stack>
               <FormControl required fullWidth>
               <Autocomplete
                value={category}
                inputValue={categoryInputValue}
                onChange={(_,newValue:any)=>setCategory(newValue)}
                onInputChange={(_,newValue)=>setCategoryInputValue(newValue)}
                loading={categoriesLoding}
                options={categories?categories:[]}
                getOptionLabel={(option:any)=>option?.name}
                renderInput={(params) => <TextField required {...params} label="Category" size="medium" sx={{background:'white'}}/>}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <img
                      loading="lazy"
                      width="20"
                      src={`${option?.icon}`}
                      alt=""
                    />
                    {option?.name} 
                  </Box>
                )}
                />
               </FormControl>
               {
                  Array.isArray(brands) && brands?.length>0 &&(
                    <FormControl required fullWidth>
                    <Autocomplete
                    value={brand}
                    inputValue={brandInputValue}
                    onChange={(_,newValue:any)=>setBrand(newValue)}
                    onInputChange={(_,newValue)=>setBrandInputVale(newValue)}
                    loading={brandsLoading}
                    options={brands?brands:[]}
                    getOptionLabel={(option:any)=>option?.description}
                    renderInput={(params) => <TextField {...params} label="Brand" size="medium" sx={{background:'white'}}/>}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <img
                          loading="lazy"
                          width="20"
                          src={`${option?.icon}`}
                          alt=""
                        />
                        {option?.description} 
                      </Box>
                    )}
                    />
                    </FormControl>
                  )
                }
              {
                  categoryAttributes&&(
                    <>
                    {
                    categoryAttributes?.map((attribute:any)=>(
                      <React.Fragment key={attribute?._id}>
                      {
                        attribute?.isInsertion?
                        (
                        <TextField 
                         required
                         size="medium" label={attribute?.name} sx={{background:'white'}}
                         onChange={handleAttributeChange} 
                         value={attributeValues?attributeValues[`${attribute.name}`]:undefined}
                         name={attribute?.name}
                         />
                        ):
                        (
                        <FormControl fullWidth required>
                          <InputLabel id={`${attribute?.name}-label`}>{attribute?.name}</InputLabel>
                          <Select
                           id={attribute?.name}
                           labelId={`${attribute?.name}-label`}
                           label={attribute?.name}
                           onChange={handleAttributeChange} 
                           value={attributeValues?attributeValues[`${attribute.name}`]:undefined}
                           name={attribute?.name}
                           >
                            {
                              attribute?.values?.map((value:any)=>(
                                <MenuItem key={value} value={value}>{value}</MenuItem>
                              ))
                            }
                          </Select>
                        </FormControl>
                        )
                      }
                      </React.Fragment>
                    ))
                    }
                    </>
                  )
                }
            <Autocomplete
                value={location}
                inputValue={locationInputValue}
                onChange={(_,newValue:any)=>setLocation(newValue)}
                onInputChange={(_,newValue)=>setLocationInputValue(newValue)}
                loading={locationsLoading}
                options={locations?locations:[]}
                getOptionLabel={(option:any)=>option?.descripton}
                renderInput={(params) => <TextField required {...params} label="Location" size="medium" sx={{background:'white'}}/>}
                />
             
                
       <Box sx={{alignItems:'center',display:'flex',gap:1,flexDirectin:'row'}}>
       <Autocomplete
                value={subCity}
                inputValue={subCityInputValue}
                onChange={(_,newValue:any)=>setSubCity(newValue)}
                onInputChange={(_,newValue)=>setSubCityInputValue(newValue)}
                fullWidth
                loading={subCitiesLoading}
                options={subCities?subCities:[]}
                getOptionLabel={(option:any)=>option?.descripton}
                renderInput={(params) => <TextField required {...params} label="Sub City" size="medium" sx={{background:'white'}}/>}
                />
             <Autocomplete
                value={wereda}
                inputValue={weredaInputValue}
                onChange={(_,newValue:any)=>setWereda(newValue)}
                onInputChange={(_,newValue)=>setWeredaInputValue(newValue)}
                fullWidth
                loading={weredasLoading}
                options={weredas?weredas:[]}
                getOptionLabel={(option:any)=>option?.descripton}
                renderInput={(params) => <TextField required {...params} label="Wereda" size="medium" sx={{background:'white'}}/>}
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
              src={`${IMAGE_URL}/${selecteImage}`} 
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
        <Button 
                type="submit"
                fullWidth 
                disabled={productUpdateMutation.isPending}
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
              product?.productImages?.map((image:string)=>({src:`${IMAGE_URL}/${image}`}))
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