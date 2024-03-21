import { Button, Divider, Grid, Rating, Skeleton, Stack, Typography } from "@mui/material";
import  Box  from "@mui/material/Box";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import theme from "../../theme";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ChatIcon from '@mui/icons-material/Chat';
import AddIcon from "@mui/icons-material/Add";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PhoneIcon from '@mui/icons-material/Phone';
import ShareIcon from '@mui/icons-material/Share';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import useSmallScreen from "../../utils/hooks/useSmallScreen";
import formatNumbers from "../../utils/helpers/formatNumbers";
import ReactTimeAgo from "react-time-ago";
import getServiceTypeDescription from "../../utils/helpers/getServiceTypeDescription";
import ProductInfoSkeleton from "./productInfoSkeleton";
import { NavLink } from "react-router-dom";
import React, { useContext, useEffect } from "react";
import { useMutation,QueryClient} from "@tanstack/react-query";
import addProductToFav from "../../api/products/addProductToFav";
import { context } from "./cartContext";
import CustomAlert from "./customAlert";
import getTransactionTypeDescription from "../../utils/helpers/getTransactionTypeDescription";
export default function ProductInfo(props:{data:any,loading:boolean}){
    const smallScreen = useSmallScreen()
    const {data,loading} = props
    const [showPhone,setShowPhone] = React.useState(false)
    const {addToCart} = useContext(context)
    const favMutation = useMutation({
        mutationFn:addProductToFav,
        mutationKey:['addToFav2'],
        onSuccess:()=>{
        // queryClient.invalidateQueries(['getSingleProduct'])
        }
    })
    const [notificationSnackbarOpen,setNotificationSnackbarOpen] = React.useState(false)
    const handleNotificationSnackbarClose = ()=>{
      setNotificationSnackbarOpen(false)
    }
    return (
       <>
       {
        loading?(
            <ProductInfoSkeleton/>
        )
        :
        (
            <Box
            sx={{display:'flex',gap:1,flexDirection:'column',ml:2}}
            >
            <Typography variant="body2">
                Categories: {`${getServiceTypeDescription(data?.productType)}`} / <NavLink 
                to = {`/${getServiceTypeDescription(data?.productType)}/${data?.category?.name}?cat=${data?.category?._id}&transaction=${getTransactionTypeDescription(data?.transactionType)}`}
                style={({})=>({
                    textDecoration:'none',
                    color:'blue'
                })}
                >
                    {
                        data?.category?.name
                    }
                </NavLink >
            </Typography>
            <Typography fontSize={smallScreen?'1.45rem':'2.8rem'} variant={"h3"} fontWeight={'bolder'}>
                {data?.title}
            </Typography>
             <Box sx={{display:'flex',gap:.5,alignItems:'center'}}>
                
                <Box sx={{display:'flex',alignItems:smallScreen?'flex-start':'center',gap:smallScreen?1:2,flexDirection:smallScreen?'column':"row"}}> 
               <Box sx={{display:'flex',alignItems:'center',gap:.5}}>
               <LocationOnIcon color="primary" fontSize="small"/>
                <Typography>
                    <span style={{fontWeight:'lighter',color:'rgb(143 143 143)'}}>Location</span>: <span style={{fontWeight:'bold'}}>
                        {
                            data?.location?.descripton
                        }
                    </span>
                </Typography>
               </Box>
                <Typography>
                    <span style={{fontWeight:'lighter',color:'rgb(143 143 143)'}}>Subcity</span>: <span style={{fontWeight:'bold'}}>
                    {
                            data?.subCity?.descripton
                        }
                    </span>
                </Typography>
                <Typography>
                    <span style={{fontWeight:'lighter',color:'rgb(143 143 143)'}}>Wereda</span>: <span style={{fontWeight:'bold'}}>
                        
                            {
                                data?.wereda?.descripton
                            }
                        
                    </span>
                </Typography>
                </Box>
             </Box>
             <Box sx={{display:'flex',alignItems:'center'}}>
                    <Rating readOnly value={data?.reviews?.stars||0} />
                    <Typography  sx={{ml:.5,color:'rgb(143 143 143)'}}> | {`${data?.reviews?.stars||0} Reviews`}</Typography>
                    </Box>
                    {
                        data?.attributes && Array.isArray(data?.attributes)&&data?.attributes?.length>0 && (
                            <Grid container spacing={1} columnSpacing={6}>
                     {
                        data?.attributes?.map((attr:any)=>(
                            <Grid key={attr?._id} item xs={12} sm={6}>
                                 <Box sx={{
                    display:'flex',alignItems:'center',
                    justifyContent:'space-between',
                    p:.5,
                    background:'rgb(249 249 249)' 
                    }}>
                <Typography fontSize={'1.2rem'}>
                    {attr?.name}
                </Typography>
                <Typography fontSize={'1.2rem'} fontWeight={'bold'}>
                    {attr?.value}
                </Typography>
            </Box>
                                </Grid>
                        ))
                     }
                    </Grid>
                        ) 
                    }
                {/* Price section */}
                <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',mt:1}}>
                     <Box sx={{display:'flex',gap:.5,color:theme.palette.primary.main,}}>
                        <Typography variant={smallScreen?'h6':"h4"} fontWeight={'bold'}>
                           
                            {new Intl.NumberFormat().format(data?.currentPrice)}
                            
                        </Typography>
                        <Typography fontWeight={'bold'}>
                            {
                                data?.currency?.sign
                            }
                        </Typography>
                     </Box>
                     <Typography variant={smallScreen?'h6':"h5"}>
                      
                            {
                                data?.isFixed?'Fixed Price':'Negotiable'
                            }
                           
                     </Typography>
                </Box>
                <Divider/>
                <Box sx={{display:'flex',alignItems:'center',gap:2,justifyContent:smallScreen?'space-between':""}}>
                <Box sx={{display:'flex',alignItems:'center',gap:1,}}>
                <AccountCircleIcon sx={{fontSize:smallScreen?'2rem':'3rem'}} fontSize={smallScreen?'small':"large"}/>
                <Typography fontSize={smallScreen?'1rem':'1.5rem'}>
                    {
                        `${data?.consignee?.firstName} ${data?.consignee?.lastName}`
                    }
                </Typography>
                 </Box>
                 <Button
                 size="small" 
                 sx={{color:'black',background:'rgb(254 222 161)'}}
                 variant="outlined"
                 >
                <AddIcon sx={{fontSize:'1rem'}} fontSize="small"/>
                Follow</Button>
                </Box>
                <Stack spacing={2} direction={smallScreen?'column':'row'} sx={{ml:smallScreen?4:0,mr:smallScreen?4:0}}>
                <Button
                 onClick={()=>{
                    addToCart({...data,engagmentFee:500})
                    setNotificationSnackbarOpen(true)
                 }}
                  sx={{
                    color:'white',fontSize:'0.75rem',
                    fontWeight:'',
                   
                }}
                 variant="contained"
                 >
                <ShoppingCartOutlinedIcon sx={{fontSize:'1rem',mr:.5}} fontSize="small"/>
                Add to Cart</Button>
                <Button
                color="inherit"  
                onClick={(e)=>{
                    e.preventDefault()
                    if(favMutation.isPending || data?.likedBy?.includes('653f2561c250b545217d192b')){
                        return;
                    }

                    favMutation.mutate(data?._id)
                }}      
                sx={{
                    color:'black',fontSize:'0.75rem',
                    background:'white',border:'1px solid #EFEFEF',
                    ':hover':{
                        background:'white'
                    }
                }}
                 variant="contained"
                 >
                <FavoriteBorderOutlinedIcon  sx={{
                    fontSize:'1rem',mr:.5,
                    color:data?.likedBy?.includes('653f2561c250b545217d192b')?'green':'black',
                    
                    // background:data?.likedBy?.includes('653f2561c250b545217d192b')?'white':'black'
                    }} fontSize="small"/>
                Add to Favorite</Button>
                <Button
                color="inherit"  
                sx={{
                    color:'black',fontSize:'0.75rem',
                    background:'white',border:'1px solid #EFEFEF',
                    ':hover':{
                        background:'white'
                    }
                }}
                 variant="contained"
                 >
                <ChatIcon 
                sx={{
                    fontSize:'1rem',
                    mr:.5,
                    
                }} 
                fontSize="small"
                />
                Chat With Seller</Button>
                {
                    showPhone
                    ?
                    (
                        <Typography sx={{color:theme.palette.primary.main,alignSelf:'center'}}>
                            {
                                data?.consignee?.phoneNumber
                            }
                        </Typography>
                    ):
                    (
                        <Button
                        onClick={()=>setShowPhone(true)}
                        sx={{color:'white',fontSize:'0.75rem',fontWeight:''}}
                       variant="contained"
                       >
                      <PhoneIcon sx={{fontSize:'1rem',mr:.5}} fontSize="small"/>
                      Show Phone</Button>
                    )
                }
                
                </Stack>
                <Box sx={{mt:1,display:'flex',alignItems:'center',gap:2}}>
                    <Typography fontSize={smallScreen?'0.7rem':'1.1rem'} sx={{color:'#3A3A3A'}} fontWeight={'bold'}>
                       {
                         `${formatNumbers(data?.viewCount||0)} Views`
                        }
                    </Typography>
                   <Box sx={{display:'flex',alignItems:'center',gap:.5}}>
                        <AccessTimeIcon fontSize="small" color="primary"/>
                        <Typography fontSize={smallScreen?'0.7rem':'1.1rem'} sx={{color:'#3A3A3A'}} fontWeight={'bold'}>
                        Posted <ReactTimeAgo date={data?.date}/>
                    </Typography>
                   </Box>
                    <Button
                  size="small"
                  sx={{color:'black',fontSize:'0.75rem',background:'white',border:'1px solid #EFEFEF'}}
                 >
                <ShareIcon sx={{fontSize:'1rem',mr:.5,}} fontSize="small"/>
                Share</Button>
                </Box>
                {
                    data?.youtubeLink&&(
                        <Box>
                    <Typography >
                        <span  style={{fontWeight:'bold',color:'#3A3A3A'}}>Video Link:</span> <a target="_blank" href={data?.youtubeLink}>{data?.youtubeLink}</a>
                    </Typography>
                </Box>
                    )
                }
               
            </Box>
        )
       }
        {
           notificationSnackbarOpen&&(
            <CustomAlert
            open={notificationSnackbarOpen}
            handleSnackBarClose = {handleNotificationSnackbarClose}
            severity={'success'}
            successMessage="Item Successfully Added To Cart"
            // errorMessage={postMutation.error as string}
            />
           )
          }
       </>
    )
}

