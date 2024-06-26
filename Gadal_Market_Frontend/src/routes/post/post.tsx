import { Box, Button, Card,Autocomplete,IconButton, CardContent, Chip, Divider, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField, Typography, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import Enums from '../../utils/constants/serviceEnums'
import useSmallScreen from "../../utils/hooks/useSmallScreen";
import { useQuery,useMutation } from "@tanstack/react-query";
import getCategoriesByService from "../../api/categories/getCategoryByService";
import getLocations from "../../api/location/getLocations";
import getCategoryAttributes from "../../api/categories/getCategoryAttributes";
import * as React from 'react'
import getSubcities from "../../api/location/getSubCity";
import getWeredas from "../../api/location/getWereda";
import { useDropzone } from "react-dropzone";
import CloseIcon from '@mui/icons-material/Close';
import postProduct from "../../api/products/postProduct";
import CustomAlert from "../../components/common/customAlert";
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Dialog from '@mui/material/Dialog';
import PostOptions from "./postOptions";
import { useNavigate } from "react-router-dom";
import getBrandByCategory from "../../api/categories/getBrandbyCategory";
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import getCurrencies from "../../api/currency/getCurrencies";
import serializeFormData from "../../utils/helpers/serializeFormdata";
import { useFormData } from "../../components/common/productPostContext";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        valueIsNumericString
        // prefix={'ETB'}
      />
    );
  },
);

export default function Post(){
   const navigate = useNavigate()
   const [selectedPostType,setSelectedPostType] = useState('')
    const [fixed,setFixed] = useState(true)
    const [rent,setRent] = useState(true)
    const [title,setTitle] = useState('')
    const [description,setDescription] = useState('')
    const {setFormData} = useFormData()
    // const [price,setPrice] = useState('')
    const [values, setValues] = React.useState({
      price: '',
    });
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({
        ...values,
        [event.target.name]: event.target.value,
      });
    };
    const [videoLink,setVideoLink] = useState('')
    const [selectedService,setSelectedService] = useState(2)
    const [category,setCategory] = useState<any>(null)
    const [categoryInputValue,setCategoryInputValue] = useState('')
    const [brand,setBrand] = useState<any>(null)
    const [brandInputValue,setBrandInputVale] = useState('')
    const [currency,setCurrency] = useState<any>(null)
    const [currencyInputValue,setCurrencyInputValue] = useState('')
    const [location,setLocation] = useState<any>(null)
    const [locationInputValue,setLocationInputValue] = useState('')
    const [subCity,setSubCity] = useState<any>(null)
    const [subCityInputValue,setSubCityInputValue] = useState('')
    const [wereda,setWereda] = useState<any>(null)
    const [weredaInputValue,setWeredaInputValue] = useState('')
    const [attributeValues,setAttributeValues] = React.useState<{[key:string]:any}|any>()
    // console.log(attributeValues)
    const {ServiceEnums} = Enums
    const services =  Object.entries(ServiceEnums).map(([key, value]) => ({ name: key, value: value }));
    const smallScreen = useSmallScreen()
    const [selectedImages, setSelectedImages] = useState<any>([]);
    const [notificationSnackbarOpen,setNotificationSnackbarOpen] = React.useState(false)
    const [imagesError,setImagesError] = useState(false)
    const [notificationSeverity,setNotficationSeverity] = React.useState<'error'|'success'|undefined>()
    const handleNotificationSnackbarClose = ()=>{
      setNotificationSnackbarOpen(false)
    }
    const [openPostOptions, setOpenPostOPtions] = React.useState(false);

  const handleClickOpen = () => {
    setOpenPostOPtions(true);
  };

  const handleClose = () => {
    setOpenPostOPtions(false);
  };
    const openImages = (acceptedImages:any) => {
      const newFiles = acceptedImages.map((file:any) => {
        return {
          file,
          preview: URL.createObjectURL(file),
        };
      });
      setSelectedImages((prevFiles:any) => [...prevFiles, ...newFiles]);
    };
    // remove selected images
    const removeImage = (index:number) => {
      const updatedFiles = [...selectedImages];
      updatedFiles.splice(index, 1);
      setSelectedImages(updatedFiles);
    };
    
    const {data:categories,isLoading:categoriesLoding} = useQuery({
      queryKey:['categoriesByService',selectedService],
      queryFn:()=>getCategoriesByService(selectedService)
     })
     const {data:locations,isLoading:locationsLoading} = useQuery({
      queryKey:['locations'],
      queryFn:getLocations
     })
     const {data:currencies,isLoading:curencyLoading} = useQuery({
      queryKey:['currencies'],
      queryFn:getCurrencies
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
     //preview images on Drop
     const onDrop = (acceptedFiles:any) => {
      openImages(acceptedFiles);
    };
     //image dropzone initialization
     const { getRootProps, getInputProps} = useDropzone({ 
      onDrop,
      accept:{
        'image/png':['.png'],
        'image/jpg':['.jpg'],
        'image/jpeg':['.jpeg'],
      },
    })
     // api call to post a product
     const postMutation = useMutation({
      mutationKey:['postProduct'],
      mutationFn:postProduct,
      onSuccess:()=>{
        navigate('/post/success')
      },
      onError:()=>{
        setNotificationSnackbarOpen(true)

        setNotficationSeverity('error')
      },
     })
     // handle attribute selection
     const handleAttributeChange = (e:React.ChangeEvent<HTMLInputElement> | SelectChangeEvent)=>{
      const value = e.target.value;
      const name = e.target.name;
      setAttributeValues({
        ...attributeValues,
        [name]:value
      })
    } 
    // function to initialte api call when post button is clicked
    const handlePost = (postType:string,hasPackage:boolean)=>{
      setSelectedPostType(postType)
      let formData = new FormData()
      let productAttributes:any = []
      if(selectedImages?.length>0){
        selectedImages?.forEach((image:any)=>{
          formData.append('images',image?.file)
        })
      }
      if(attributeValues){
        productAttributes = Object.keys(attributeValues)?.map((key)=>({name:key,value:`${attributeValues[key]}`}))
      }
      // console.log(productAttributes)
      if(productAttributes?.length > 0){
        formData.append('attributes',JSON.stringify(productAttributes))  
      }
      if(brand){
        formData.append('brand',brand?._id)
      }
      formData.append('title',title)
      formData.append('description',description)
      formData.append('currentPrice',values?.price)
      formData.append('previousPrice',values?.price)
      formData.append('currency',currency?._id)
      formData.append('category',category?._id)
      formData.append('isFixed',`${fixed}`)
      formData.append('consignee',localStorage.getItem('userId') as string)
      formData.append('location',location?._id)
      formData.append('subCity',subCity?._id)
      formData.append('wereda',wereda?._id)
      formData.append('transactionType',rent?'1':'2')
      formData.append('youtubeLink',videoLink)
      formData.append('productType',`${selectedService}`)
      formData.append('postType',`${postType}`)
      formData.append('paymentAmount','0')
      // const object = Object.fromEntries(formData.entries())
  // formData.forEach((value, key) => {
  //   // Check if the key already exists in the object
  //   if (Object.prototype.hasOwnProperty.call(object, key)) {
  //     // If it exists, convert the value to an array
  //     // This is necessary to handle cases where there are multiple values for the same key
  //     if (!Array.isArray(object[key])) {
  //       object[key] = [object[key]];
  //     }
  //     object[key].push(value);
  //   } else {
  //     // If the key does not exist, simply set the value

  //      object[key] = value
  //   }
  // });
      if(!hasPackage) {
        setFormData(formData)
        navigate(`/payment?paymentType=post&typeId=${postType}`)
        return;
      }
      if(postMutation.isPending){
        return;
      }
      postMutation.mutate(formData)
    }
  React.useEffect(()=>{
  if(Array.isArray(categoryAttributes)&&categoryAttributes?.length>0){
    setAttributeValues(
      categoryAttributes?.reduce((acc:any,attr:any)=>({
        ...acc, [attr?.name]:""
      }),{})
    )
    return;
  }
  setAttributeValues(null)
  },[categoryAttributes])
  React.useEffect(()=>{
    setCategory(null)
  },[selectedService])
  React.useEffect(()=>{
    setSubCity(null)
  },[location])
  React.useEffect(()=>{
    setWereda(null)
  },[subCity])
  React.useEffect(()=>{
      setBrand(null)
      setBrandInputVale('')
  },[category])
    return (
        <>
        <Box sx={{display:'flex',flexDirection:'column',}}>
        <Card sx={{borderRadius:'20px',mt:2,alignSelf:smallScreen?'flex-start':'center',width:smallScreen?'100%':'40%',p:1,}}>
            <Stack spacing={1}>
            <Typography variant="h5" fontWeight={'bold'} sx={{textAlign:'center'}}>
                    {
                      `Item for ${rent?'Rent':'Sale'}`
                    }
                </Typography>
                <Divider/>
            </Stack>
            <CardContent sx={{p:5}}>
              {/* <Box sx={{display:'flex',gap:3,mb:2,flexDirection:smallScreen?'column':'row'}}> */}
              <Grid container spacing={2} sx={{mb:2}}>
              {
                  services?.map((service)=>(
                    <Grid item xs={6} sm={6} md={3}>
                      <Box 
                    sx={{
                      display:'flex',
                      flexDirection:'column',
                      alignItems:'center',
                      gap:.5,
                      cursor:'pointer',
                      background:selectedService === service?.value ?'#FFDFA1':'',
                      border:selectedService === service.value?'1px solid #FFAA00':'',
                      p:1,
                      // width:smallScreen?'30%':'15%',
                      borderRadius:'10px',
                      boxShadow: `1px 1px 8px ${selectedService===service.value?'#FFAA00':'#ABABAB'}`,
                    }}
                    onClick={()=>setSelectedService(service?.value)}
                    >
                      <img width={22} height={20} src={`images/${service?.name.toLowerCase()}.svg`}/>
                      <Typography variant="caption" fontWeight={'bold'}>
                        {service.name}
                      </Typography>
                    </Box>
                    </Grid>
                  ))
                }
                </Grid>
              {/* </Box> */}
                <form
                onSubmit={(e)=>{
                  e.preventDefault()
                  if(selectedImages?.length<2){
                    setImagesError(true);
                    return;
                  }
                  handleClickOpen()
                  // handlePost(3)
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
                <TextField value={title} onChange={(e)=>setTitle(e.target.value)} required id="title" label="Title" variant="outlined" size="medium" sx={{background:'white'}} />
                <TextField
                 id="description"
                 value={description}
                 onChange={(e)=>setDescription(e.target.value)}
                 required
                 label="Description" variant="outlined"
                 minRows={2}
                 multiline size="medium" sx={{background:'white'}} 
                 />
                 <Autocomplete
                value={currency}
                inputValue={currencyInputValue}
                onChange={(_,newValue:any)=>setCurrency(newValue)}
                onInputChange={(_,newValue)=>setCurrencyInputValue(newValue)}
                loading={curencyLoading}
                options={currencies?currencies:[]}
                getOptionLabel={(option:any)=>option?.description}
                renderInput={(params) => <TextField required {...params} label="Currency" size="medium" sx={{background:'white'}}/>}
                />
                 <TextField 
                  value={values.price}
                  onChange={handleChange}
                  required 
                  // type="number" 
                  id="price" 
                  label="Price" 
                  variant="outlined" 
                  size="medium" 
                  sx={{background:'white'}} 
                  InputProps={{
                    inputComponent: NumericFormatCustom as any,
                  }}
                  name="price"
                  />
                
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
                <FormControl required fullWidth>
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

                </FormControl>
               
        <Box sx={{alignItems:'center',display:'flex',gap:1,flexDirection:smallScreen?'column':'row'}}>
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
        <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        
        <Box
        sx={{
          display:'flex',gap:2,
          ml:5
        }}
        >
          <img width={60} src="/images/icons8_Photo_Gallery.svg"/>
          <Stack>
            <Typography fontWeight={'bold'}>Add Photos</Typography>
            <Typography fontWeight={'bold'} color={'#8F8F8F'}>Drop Or Select Files</Typography>
          </Stack>
        </Box>
        </div>
        <Divider/>
         {
          selectedImages?.length>0&&(
            <Stack direction={'row'} sx={{overflowX:'auto'}} spacing={1}>
            {
              selectedImages?.map((selecteImage:any,index:number)=>(
                <Box
            sx={{
              
              position:'relative',
              // background:`url(${selecteImage.preview})`,
              border:'1px solid black',
              borderRadius:1,
              p:.5,
              // backgroundSize:'contain',                   
              // backgroundRepeat:'no-repeat',
              // backgroundPosition: 'center center',
              // width:60,height:40,
            }}
            >
              <IconButton
              sx={{position:'absolute',right:0,top:0,fontSize:'.7rem'}}
              onClick={()=>removeImage(index)}
              >
                <CloseIcon fontSize="inherit"/>
              </IconButton>
              <img src={selecteImage.preview} width={60} height={40} style={{objectFit:'contain'}}/>
            </Box>
              ))
            }
            </Stack>
          )
         }
        
      
      </Box>
        <TextField id="videoLink" placeholder="Paste Your Video Link Here"
         variant="outlined" size="medium" 
         value={videoLink}
         onChange={(e)=>setVideoLink(e.target.value)}
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
                 disabled={postMutation.isPending}
                 sx={{color:'white',borderRadius:'30px',p:1}}
                 variant="contained"
                 >
                    <Typography fontWeight={'bold'}>
                        Post
                    </Typography>
                        </Button>
                </Stack>
                </form>
            </CardContent>
        </Card>
        </Box>
        {
           notificationSnackbarOpen&&(
            <CustomAlert
            open={notificationSnackbarOpen}
            handleSnackBarClose = {handleNotificationSnackbarClose}
            severity={notificationSeverity}
            // errorMessage={postMutation.error as string}
            />
           )
          }
          {
           imagesError&&(
            <CustomAlert
            open={imagesError}
            handleSnackBarClose = {()=>setImagesError(false)}
            severity={'error'}
            errorMessage={'At least 2 images are required'}
            />
           )
          }
          {
            openPostOptions&&(
              <Dialog
              fullScreen
              open={openPostOptions}
              onClose={handleClose}
              TransitionComponent={Transition}
              >
                <PostOptions 
                  selected={selectedPostType} 
                  handleProductPost={handlePost} 
                  postLoading = {postMutation.isPending} 
                  handleClose={handleClose}
                  />
              </Dialog>
            )
          }
        </>
    )
}
