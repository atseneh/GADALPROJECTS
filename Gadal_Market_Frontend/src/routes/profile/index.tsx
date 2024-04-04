import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useSmallScreen from "../../utils/hooks/useSmallScreen";
import Collapse from '@mui/material/Collapse';
import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PeopleIcon from '@mui/icons-material/People';
import CampaignIcon from '@mui/icons-material/Campaign';
import {Grid, Skeleton, useTheme} from '@mui/material'
import Favourites from "./favourites";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import Ads from "./ads";
import Following from "./following";
import useReactRouterQuery from "../../utils/hooks/useQuery";
import { useLocation, useNavigate } from "react-router-dom";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import Packages from "./packages";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import getUserProfileDetail from "../../api/user/getUserProfileDetail";
import updateUser from "../../api/user/updateUser";
import CustomAlert from "../../components/common/customAlert";
export default function Profile(){
const smallScreen = useSmallScreen()
const navigate = useNavigate()
let query = useReactRouterQuery()
const selectedTab = query.get('selected')
const [firstName,setFristName] = useState('')
const [lastName,setLastName] = useState('')
const [email,setEmail] = useState('')
const [phoneNumber,setPhoneNumber] = useState('')
const [city,setCity] = useState('')
const [subCity,setSubCity] = useState('')
const [region,setRegion] = useState('')
const variant = smallScreen?'caption':'body1'
const theme = useTheme()
const queryClient = new QueryClient();
const [notificationSnackbarOpen,setNotificationSnackbarOpen] = React.useState(false)
const [notificationSeverity,setNotificationSeverity] = useState<'success'|'error'>()
    const handleNotificationSnackbarClose = ()=>{
      setNotificationSnackbarOpen(false)
    }
const {data:profileDetail,isLoading} = useQuery({
    queryKey:['profile_detail'],
    queryFn:getUserProfileDetail,
})
const userMutation = useMutation({
    mutationKey:['update_user'],
    mutationFn:updateUser,
    onSuccess:()=>{
    setNotificationSeverity('success')
    queryClient.invalidateQueries({queryKey:['profile_detail']})
    },
    onError:(error)=>{
        setNotificationSeverity('error')
    },
    onSettled:()=>{
        setNotificationSnackbarOpen(true)
    }
})
const handleProfileUpdate = ()=> {
    const payload = {
        firstName,
        lastName,
        phoneNumber,
        email,
        region,
        city,
        subCity,
    }
  userMutation.mutate(payload)
}
useEffect(()=>{
if(profileDetail) {
 setFristName(profileDetail?.firstName||'')
 setLastName(profileDetail?.lastName||'')
 setPhoneNumber(profileDetail?.phoneNumber||'')
 setEmail(profileDetail?.email||'')
 setRegion(profileDetail?.region||'')
 setSubCity(profileDetail?.subCity||'')
 setCity(profileDetail?.city||'')
}
},[profileDetail])
    return (    
    <>
    <Card
    sx={{borderRadius:'20px',mt:3}}
    >
    <CardContent>
        <Grid
        container
        spacing={2}
        >
        <Grid
        item
        sm={12}
        md={4.5}
        >
        <Box 
            sx={{
                display:'flex',
                gap:smallScreen?1:3,
                flexDirection:smallScreen?'column':'row',
                justifyContent:smallScreen?"center":'flex-start'
                }}>
            <img style={{marginLeft:smallScreen?'25%':0,}} width={100} src="/images/maleUser.svg"/>
            <Stack>
            <Typography variant="h6" fontWeight={"bold"} sx={{marginLeft:smallScreen?'20%':0,}}>
                {
                    isLoading?<Skeleton/>:
                    `${profileDetail?.firstName} ${profileDetail?.lastName}`
                }
            </Typography>
             <Box sx={{display:'flex',alignItems:'center',gap:1}}>
             <img  src="/images/icons8_phone_1.svg"/>
             <Typography variant="body2" fontWeight={'bold'}>
                    {
                        isLoading?<Skeleton/>:
                        `Phone: ${profileDetail?.phoneNumber}`
                    }
                </Typography>
             </Box>
             <Box sx={{display:'flex',alignItems:'center',gap:1}}>
             <img  src="/images/icons8_paper_plane.svg"/>
             <Typography variant="body2" fontWeight={'bold'}>
                    {
                        isLoading?<Skeleton/>:
                        `Email: ${profileDetail?.email}`
                    }
                </Typography>
             </Box>
             <Box sx={{display:'flex',alignItems:'center',gap:1}}>
             <BusinessCenterIcon fontSize="small" sx={{color:'rgb(232 201 207)'}}/>
                <Typography variant="body2" fontWeight={'bold'}>
                    12 Products posted
                </Typography>
             </Box>
             <Box sx={{display:'flex',alignItems:'center',gap:1}}>
             <PeopleAltIcon fontSize="small" sx={{color:'rgb(232 201 207)'}}/>
                <Typography variant="body2" fontWeight={'bold'}>
                    12 Followers
                </Typography>
             </Box>
             <Box sx={{display:'flex',gap:smallScreen?4:2,mt:smallScreen?2:1}}>
             <Button sx={{background:'white',fontWeight:'bolder'}} size="small" variant="contained" color="inherit">
             <img width={15}  src="/images/Icon ionic-ios-share-alt.svg" style={{marginRight:'4px'}}/>
                Share
                </Button>
             <Button 
               sx={{background:'white',fontWeight:'bolder'}} 
               size="small" 
               variant="contained" 
               color="inherit"
               onClick={()=>{
                localStorage.clear();
                navigate('/')
               }}
               >
                Logout
                </Button>
             </Box>
            </Stack>
            </Box> 
        </Grid>
        <Grid
          item
          sm={12}
          md={7.5}
        >
        <Stack
        spacing={2}
        component={'form'}
        onSubmit={(e)=>{
            e.preventDefault();
            handleProfileUpdate();
        }}
        >
              <Grid
        container
        spacing={2}
        >
             <Grid
            item
            xs={12}
            md={4}
            >
            <TextField 
            sx={{background:'white'}} 
            fullWidth  
            label="First Name" 
            variant="standard"
            name="firstName" 
            value={firstName}
            onChange={(e)=>setFristName(e.target.value)}
            required
            />
            </Grid>
            <Grid
            item
            xs={12}
            md={4}
            >
            <TextField 
            sx={{background:'white'}} 
            fullWidth  
            label="Last Name" 
            variant="standard" 
            value={lastName}
            onChange={(e)=>setLastName(e.target.value)}
            required
            />
            </Grid>
            <Grid
             item
             xs={12}
             md={4}
            >
            <TextField 
                        autoComplete="off" 
                        sx={{background:'white'}}  
                        label="Phone Number" 
                        variant="standard"
                        value={phoneNumber}
                        onChange={(e)=>setPhoneNumber(e.target.value)}
                        fullWidth
                        required
                         />
            </Grid>
            <Grid
             item
             xs={12}
             md={4}
            >
            <TextField 
                        autoComplete="off" 
                        sx={{background:'white'}}  
                        label="Email" 
                        variant="standard"
                        value={email}
                        type="email"
                        onChange={(e)=>setEmail(e.target.value)}
                        fullWidth
                        
                         />
            </Grid>
            <Grid
            item
            xs={12}
            md={4}
            >
                 <TextField 
                        sx={{background:'white'}}  
                        label="Region" 
                        variant="standard"
                        value={region}
                        onChange={(e)=>setRegion(e.target.value)}
                        fullWidth
                        />
                       
            </Grid>
            <Grid
            item
            xs={12}
            md={4}
            >
                 <TextField 
                        sx={{background:'white'}}  
                        label="City" 
                        variant="standard"
                        value={city}
                        onChange={(e)=>setCity(e.target.value)}
                        fullWidth
                        />
                       
            </Grid>
            <Grid
            item
            xs={12}
            md={4}
            >
                 <TextField 
                        sx={{background:'white'}}  
                        label="Sub City" 
                        variant="standard" 
                        value={subCity}
                        onChange={(e)=>setSubCity(e.target.value)}
                        fullWidth
                        />

            </Grid>
        </Grid>
        <Button 
            sx={{
                alignSelf:smallScreen?'center':'flex-end',
                color:'white',mt:smallScreen?1:0
                }} 
                size="small" 
                variant="contained"
                disabled={userMutation.isPending}
                type="submit"
                >
         Save Changes
        </Button>
        </Stack>
      
            
        </Grid>
            
        </Grid>
     
    </CardContent>
    </Card>
   {/* {
    smallScreen&&(
        <Card
        sx={{borderRadius:'20px',mt:1,border:'1px solid black',}}
        >
        <CardContent>
        <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'#fff',p:1,borderBottom:'1px solid black'}} >
        <Typography variant="body1" fontWeight={'bold'}>
                Profile Detail
            </Typography>
            <IconButton
             size="small"
             onClick={handleExpand}
             >
                <ArrowDropDownIcon fontSize="large" />
            </IconButton>
        </Box>
        <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{display:'flex',flexDirection:'column',gap:1}}>
                   
            <Box sx={{display:'flex',gap:2,flexDirection:smallScreen?'column':'row'}}>
                <TextField 
                sx={{background:'white'}} 
                fullWidth  
                label="First Name" 
                variant="standard" 
                defaultValue={profileDetail?.firstName}
                />
                <TextField  
                sx={{background:'white'}}
                fullWidth  
                label="Email Or Phone Number" 
                variant="standard" 
                defaultValue={profileDetail?.phoneNumber?profileDetail?.phoneNumber:profileDetail?.email}
                />
                
                </Box>
                <Box sx={{display:'flex',gap:2,flexDirection:smallScreen?'column':'row'}}>
                
                <TextField 
                autoComplete="off" 
                sx={{background:'white'}}  
                label="Last Name"
                variant="standard" 
                defaultValue={profileDetail?.lastName}
                />
                <TextField 
                sx={{background:'white'}}  
                label="City" 
                variant="standard" 
                defaultValue={profileDetail?.city}
                />
                <TextField 
                sx={{background:'white'}}  
                label="Sub City" 
                variant="standard" 
                defaultValue={profileDetail?.subCity}
                />
                </Box>
                <Box sx={{display:'flex',gap:2,flexDirection:smallScreen?'column':'row'}}>
                <TextField 
                sx={{background:'white'}}  
                label="Password" 
                variant="standard" 
                type="password" 
                />
                <TextField 
                sx={{background:'white'}}
                label="Region" 
                variant="standard" 
                defaultValue={profileDetail?.region}
                />
                <TextField 
                sx={{background:'white'}}  
                label="Wereda" 
                variant="standard" 
                defaultValue={profileDetail?.wereda}
                />
                </Box>
                <Button sx={{alignSelf:smallScreen?'center':'flex-end',color:'white',mt:smallScreen?1:0}} size="small" variant="contained">
                    Save Changes
                </Button>
            </Box>
                    </Collapse>
        </CardContent>
    </Card>
    )
   } */}
   <Box sx={{display:'flex',alignItems:'center',gap:smallScreen?1:3,m:smallScreen?0:2,mt:smallScreen?2:5}}>
    <Box 
    onClick={
        ()=>navigate(`?selected=yourFavs`)
    }
    sx={{
        display:'flex',
        alignItems:'center',
        gap:1,
        borderRadius:'8px',
        background:'white',
        color:selectedTab==='yourFavs'?theme.palette.primary.main:'black',
        cursor:'pointer',
        pt:.7,
        pb:.7,
        pl:1,
        pr:1.5
    }}>
     <FavoriteBorderIcon fontSize={smallScreen?'small':'medium'}/>
     <Typography  fontWeight={'bold'} variant={variant}>
        {
            smallScreen?'Favourites':'My Favorites'
        }
     </Typography>
    </Box>
    <Box 
        onClick={()=>navigate(`?selected=yourAds`)}
        sx={{
            display:'flex',
            alignItems:'center',
            gap:1,
            borderRadius:'8px',
            cursor:'pointer',
            background:'white',
            color:selectedTab==='yourAds'?theme.palette.primary.main:'black',
            pt:.7,
            pb:.7,
            pl:1,
            pr:1.5    
    }}>
    <CampaignIcon/>
     <Typography variant={variant} fontSize={'1rem'} fontWeight={smallScreen?'light':'bold'}>
        {
            smallScreen?'Ads':'My Ads (Post)'
        }
     </Typography>
    </Box>
    <Box 
        onClick={()=>navigate(`?selected=following`)}
        sx={{
            display:'flex',
            alignItems:'center',
            gap:1,
            borderRadius:'8px',
            cursor:'pointer',
            background:'white',color:selectedTab==='following'?theme.palette.primary.main:'black',
            pt:.7,
            pb:.7,
            pl:1,
            pr:1.5    
    }}>
    <PeopleIcon/>
     <Typography variant={variant} fontWeight={'bold'}>
        Following
     </Typography>
    </Box>
    <Box 
        onClick={()=>navigate(`?selected=packages`)}
        sx={{
            display:'flex',
            alignItems:'center',
            gap:1,
            borderRadius:'8px',
            cursor:'pointer',
            background:'white',color:selectedTab==='packages'?theme.palette.primary.main:'black',
            pt:.7,
            pb:.7,
            pl:1,
            pr:1.5    
    }}>
    <LocalOfferIcon/>
     <Typography variant={variant} fontWeight={'bold'}>
        Packages
     </Typography>
    </Box>
   </Box>
        {
         !selectedTab || selectedTab==='yourFavs'&&(
            <Favourites hideTitle={false}/>
         )
        }
        {
            selectedTab === 'yourAds'&&(
                <Ads/>
            )
        }
        {
            selectedTab === 'following' &&(
            <Following/>
            )
        }
        {
            selectedTab === 'packages' &&(
            <Packages/>
            )
        }
        {
           notificationSnackbarOpen&&(
            <CustomAlert
            open={notificationSnackbarOpen}
            handleSnackBarClose = {handleNotificationSnackbarClose}
            severity={'success'}
            successMessage="Profile Successfully updated"
            errorMessage={userMutation.error?.message}
            />
           )
          }
    </>
    )
}