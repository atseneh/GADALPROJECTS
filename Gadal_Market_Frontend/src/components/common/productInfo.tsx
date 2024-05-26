import { Avatar, Button, Divider, Grid, IconButton, Rating, Skeleton, Snackbar, Stack, TextField, Typography } from "@mui/material";
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
import { NavLink, useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { useMutation,QueryClient, useQueryClient} from "@tanstack/react-query";
import addProductToFav from "../../api/products/addProductToFav";
import { context } from "./cartContext";
import CustomAlert from "./customAlert";
import getTransactionTypeDescription from "../../utils/helpers/getTransactionTypeDescription";
import createMessage from "../../api/messages/startChat";
import { IMAGE_URL } from "../../api/apiConfig";
import followUser from "../../api/user/follow";
import RemoveIcon from "@mui/icons-material/Remove";
import unfollowUser from "../../api/user/unfollow";
import CloseIcon from '@mui/icons-material/Close'
export default function ProductInfo(props:{data:any,loading:boolean}){
    const smallScreen = useSmallScreen()
    const {data,loading} = props
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {id} = useParams()
    const isMyProduct = localStorage.getItem('userId') === data?.consignee?._id
    const loggedInUserId = localStorage.getItem('userId') as string
    const loggedIn = localStorage.getItem('token')
    const [showPhone,setShowPhone] = React.useState(false)
    const [startChat,setStartChat] = useState(false)
    const [offerPirce,setOfferPirce] = useState(false)
    const [message,setMessage] = useState('')
    const [priceToOffer,setPriceToOffer] = useState('')
    const token = localStorage.getItem('token')
    const [messageNotification,setMessageNotification] = React.useState(false)
    const [favNotification,setFavNotification] = React.useState(false)
    const {mutate:follow,isPending:followPending} = useMutation({
        mutationFn:followUser,
        mutationKey:['follow_user'],
        onSuccess:()=>{
        queryClient.invalidateQueries({queryKey:['getSingleProduct']})
        }
    })
    const messageMuation = useMutation({
        mutationFn:createMessage,
        mutationKey:['create_message'],
        onSuccess:()=>{
        setMessageNotification(true)
        setStartChat(false)
        setOfferPirce(false)
        }
    })
    const handleChatStart = ()=>{
         if(!token){
            navigate('/login')
            return;
         }
         setStartChat(true)
    }
    const handlePriceOffering = ()=>{
        if(!token){
           navigate('/login')
           return;
        }
        setOfferPirce(true)
   }
    const handleMessageSent = (mes:string)=>{
        if(!mes || messageMuation.isPending){
            return;
        }
        const payload = {
            product:data?._id,
            owner:data?.consignee?._id,
            buyer:localStorage.getItem('userId') as string,
            message:{
                message:mes,
                messageType:'text'
            }
        }
        messageMuation.mutate(payload)
        setMessage('')
        setPriceToOffer('')
    }
    const {addToCart,products} = useContext(context)
    const favMutation = useMutation({
        mutationFn:addProductToFav,
        mutationKey:['addToFav2'],
        onSuccess:()=>{
        setFavNotification(true)
        queryClient.invalidateQueries({queryKey:['getSingleProduct']})
        }
    })
    const [notificationSnackbarOpen,setNotificationSnackbarOpen] = React.useState(false)
    const handleNotificationSnackbarClose = ()=>{
        setNotificationSnackbarOpen(false)
    }
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
const handleSnackBarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false);
  };
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleSnackBarClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
    const handleFollow = (userToFollow:string)=>{
        if(followPending){
            return;
        }
        follow({
            user:loggedInUserId as string,
            userToFollow,
        })
    }
    const {mutate:unFollow,isPending: unfollowPending} = useMutation({
        mutationFn:unfollowUser,
        mutationKey:['unfollow_user'],
        onSuccess:()=>{
        queryClient.invalidateQueries({queryKey:['getSingleProduct']})
        }
    })
    const handleUnfollow = (userToUnfollow:string)=>{
        if(unfollowPending){
            return;
        }
        unFollow({
            user:loggedInUserId,
            userToUnfollow,
        })
    }
    const copyProductLink = ()=>{
        const text = `gadalmarket.com/products/${id}`
        navigator.clipboard.writeText(text)
              .then(() => {
                    setOpenSnackBar(true)
                })
              .catch(err => {
                console.error('Failed to copy text:', err);
                // Handle error, show a message to the user, etc.
              });
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
                    <Rating readOnly value={data?.averageRating||0} />
                    <Typography  sx={{ml:.5,color:'rgb(143 143 143)'}}> | {`${data?.totalReviews||0} Reviews`}</Typography>
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
                <Box sx={{display:'flex',alignItems:offerPirce?'flex-start':'center',justifyContent:'space-between',mt:1}}>
                     <Box sx={{display:'flex',gap:.5,color:theme.palette.primary.main,}}>
                        <Typography variant={smallScreen?'h6':"h4"} fontWeight={'bold'}>
                        {
                        `${new Intl.NumberFormat().format(data?.currentPrice)}`
                        }
                        </Typography>
                        <Typography fontWeight={'bold'}>
                            {
                                data?.currency?.sign
                            }
                        </Typography>
                     </Box>
                      <Box>
                      <Stack
                     spacing={1}
                     alignItems={'center'}
                     direction={'row'}
                     >
                     <Typography variant={smallScreen?'h6':"h5"}>
                      
                      {
                          data?.isFixed?'Fixed Price':'Negotiable'
                      }
                     
               </Typography>
                {
                    !isMyProduct && !data?.isFixed && (
                        <Button
                        color="inherit"  
                        sx={{
                            display:'flex',
                            alignItems:'center',
                            gap:.5,
                            color:'black',fontSize:'0.75rem',
                            background:'white',border:'1px solid #EFEFEF',
                            ':hover':{
                                background:'white'
                            }

                        }}
                         variant="contained"
                         onClick={handlePriceOffering}
                         size="small"
                         >
                        <img
                        src="/images/icons8_sell_1.svg"
                        width={'14px'}
                        />
                        Offer Price
                            </Button>
                    )
                }
                     </Stack>
                     {
                    offerPirce && (
                   <Box
                   sx={{
                    p:1,
                    display:'flex',
                    flexDirection:'column',
                    gap:1,
                    alignSelf:'flex-end'
                   }}
                   component={'form'}
                   onSubmit={(e)=>{
                    e.preventDefault();
                    handleMessageSent(`I'll offer you ${new Intl.NumberFormat().format(Number(priceToOffer))}`)
                   }}
                   >
                    <TextField
                    label="Offer a price"
                    sx={{
                        background:'white'
                    }}
                    value={priceToOffer}
                    onChange={(e)=>setPriceToOffer(e.target.value)}
                    size="small"
                    type="number"
                    inputProps={{
                        min:1
                    }}
                    required
                    />
                    <Stack
                    direction={'row'}
                    spacing={1}
                    alignItems={'center'}
                    >
                    <Button
                    type="submit"
                    size="small"
                    variant="contained"
                    sx={{
                        color:'white'
                    }}
                    disabled={messageMuation.isPending}
                    >
                     Send
                    </Button> 
                    <Button
                    color="inherit"
                    onClick={()=>{
                        setOfferPirce(false)
                    }}
                    >
                        Cancel
                    </Button>
                    </Stack>
                    </Box>
                    )
                  }
                      </Box>
                </Box>
              
                <Divider/>
                <Box sx={{display:'flex',alignItems:'center',gap:2,justifyContent:smallScreen?'space-between':""}}>
                  <NavLink
                  to={`/viewProfile/${data?.consignee?._id}`}
                  style={({isTransitioning }) => {
                    return {
                      color:'black',
                      textDecoration:'none',
                      viewTransitionName: isTransitioning ? "slide" : "",
                      alignSelf:'center'
                    };
                  }}
                  >
                  <Box sx={{display:'flex',alignItems:'center',gap:1,}}>
                <Avatar 
                alt="User profile pic" 
                src={data?.consignee?.proflePic ? `${IMAGE_URL}/${data?.consignee?.proflePic}` : "/images/maleUser.svg"}
                sx={{ width:smallScreen ? 24 :46, height: smallScreen?24: 46 }}
                />
                <Typography fontSize={smallScreen?'1rem':'1.5rem'}>
                    {
                        `${data?.consignee?.firstName} ${data?.consignee?.lastName}`
                    }
                </Typography>
                 </Box>
                  </NavLink>
                    {
                    !isMyProduct && loggedIn && (
                        <>
                         {
                            data?.consignee?.followers?.includes(loggedInUserId) ?
                            (
                            // <Typography
                            // sx={{
                            //     color:'green',
                                
                            // }}
                            // >
                            //     following
                            // </Typography>
                            <Button
                            size="small" 
                            sx={{color:'black',background:'rgb(254 222 161)'}}
                            variant="outlined"
                            onClick={()=>{
                                handleUnfollow(data?.consignee?._id)
                            }}
                            disabled={unfollowPending}
                            >
                           <RemoveIcon sx={{fontSize:'1rem'}} fontSize="small"/>
                           Unfollow
                           </Button>
                            ):
                            <Button
                            size="small" 
                            sx={{color:'black',background:'rgb(254 222 161)'}}
                            variant="outlined"
                            onClick={()=>{
                                handleFollow(data?.consignee?._id)
                            }}
                            disabled={followPending}
                            >
                           <AddIcon sx={{fontSize:'1rem'}} fontSize="small"/>
                           Follow
                           </Button>
                         }
                        </>
                    )
                    }
                </Box>
                  {
                    (!isMyProduct && loggedIn) && (
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
                         disabled = {products?.findIndex((p:any)=>p?._id === data?._id) !== -1}
                         >
                        <ShoppingCartOutlinedIcon sx={{fontSize:'1rem',mr:.5}} fontSize="small"/>
                        Add to Cart</Button>
                        <Button
                        color="inherit"  
                        disabled={data?.likedBy?.includes(localStorage.getItem('userId'))}
                        onClick={(e)=>{
                            e.preventDefault()
                            if(favMutation.isPending || data?.likedBy?.includes(localStorage.getItem('userId'))){
                                return;
                            }
        
                            favMutation.mutate({
                                productId:data?._id,
                                userId:localStorage.getItem('userId') as string
                            })
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
                            color:data?.likedBy?.includes(data?.likedBy?.includes(localStorage.getItem('userId')))?'green':'black',
                            
                            // background:data?.likedBy?.includes('653f2561c250b545217d192b')?'white':'black'
                            }} fontSize="small"/>
                        Add to Favorite
                        </Button>
                                <Button
                                onClick={()=>{
                                    if(!showPhone) {
                                        setShowPhone(true)
                                        return;
                                    }
                                    window.location.href = `tel:${data?.consignee?.phoneNumber}`
                                }}
                                sx={{color:'white',fontSize:'0.75rem',fontWeight:''}}
                               variant="contained"
                               >
                              <PhoneIcon sx={{fontSize:'1rem',mr:.5}} fontSize="small"/>
                                {
                                    showPhone ? data?.consignee?.phoneNumber : 'Show Phone'
                                }
                              </Button>
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
                         onClick={handleChatStart}
                         >
                        <ChatIcon 
                        sx={{
                            fontSize:'1rem',
                            mr:.5,
                            
                        }} 
                        fontSize="small"
                        />
                        Chat With Seller
                            </Button>
                        </Stack>
                    )
                  }
                  {
                    startChat && (
                   <Box
                   sx={{
                    p:1,
                    display:'flex',
                    flexDirection:'column',
                    gap:1
                   }}
                   component={'form'}
                   onSubmit={(e)=>{
                    e.preventDefault();
                    handleMessageSent(message)
                   }}
                   >
                    <TextField
                    label="Type a message"
                    sx={{
                        background:'white'
                    }}
                    value={message}
                    onChange={(e)=>setMessage(e.target.value)}
                    />
                    <Stack
                    direction={'row'}
                    spacing={1}
                    alignItems={'center'}
                    >
                    <Button
                    type="submit"
                    size="small"
                    variant="contained"
                    sx={{
                        color:'white'
                    }}
                    disabled={messageMuation.isPending}
                    >
                     Send
                    </Button> 
                    <Button
                    color="inherit"
                    onClick={()=>{
                        setStartChat(false)
                    }}
                    >
                        Cancel
                    </Button>
                    </Stack>
                    </Box>
                    )
                  }
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
                  sx={{
                    color:'black',
                    fontSize:'0.75rem',
                    background:'white',
                    border:'1px solid #EFEFEF'
                }}
                onClick={copyProductLink}
                 >
                <ShareIcon 
                sx={{
                    fontSize:'1rem',
                    mr:.5,
                    }} 
                fontSize="small"
                    />
                Copy Link
                </Button>
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
            />
           )
          }
           {
           messageNotification&&(
            <CustomAlert
            open={messageNotification}
            handleSnackBarClose = {()=>setMessageNotification(false)}
            severity={'success'}
            successMessage="Successfully Sent"
            />
           )
          }
           {
           favNotification&&(
            <CustomAlert
            open={favNotification}
            handleSnackBarClose = {()=>setFavNotification(false)}
            severity={'success'}
            successMessage="Successfuly Added to favourites"
            />
           )
          }
           <Snackbar
        open={openSnackBar}
        autoHideDuration={3000}
        onClose={handleSnackBarClose}
        message="Product link copied to clipboard"
        action={action}
      />
       </>
    )
}

