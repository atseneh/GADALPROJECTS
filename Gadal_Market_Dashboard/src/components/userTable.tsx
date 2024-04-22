import { Grid, Paper, Stack, Typography,IconButton, Box, Divider, Avatar, Button, TextField, Switch, Collapse } from "@mui/material"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Checkbox from '@mui/material/Checkbox';
import React, { useEffect, useState } from "react";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDeleteDialog from "./confirmDelete";
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getUsers from "../api/getUsers";
import { IMAGE_URL } from "../api/apiConfig";
import { TextFieldProps } from "@mui/material/TextField";
import updateUser from "../api/updateUser";
import CustomAlert from "./customAlert";
import CircleIcon from '@mui/icons-material/Circle';
function ProfileTextField (props:TextFieldProps){
    return (
        <TextField
        sx={{
            background:'#F7F7F7'
        }}
        variant="standard"
        // InputProps={{readOnly:true}}
        {...props}
        />
    )
}
function compareArrays(arr1:any,arr2:any){
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  if (set1.size !== set2.size) {
    return false;
  }

  for (const element of set1) {
    if (!set2.has(element)) {
      return false;
    }
  }

  return true;

}
export default function UserTable(){
    const {data:users,isLoading:usersLoading} = useQuery({
        queryKey:['users'],
        queryFn:()=>getUsers(false)
    })
    const [firstName,setFristName] = useState('')
    const [lastName,setLastName] = useState('')
    const [email,setEmail] = useState('')
    const [phoneNumber,setPhoneNumber] = useState('')
    const [city,setCity] = useState('')
    const [subCity,setSubCity] = useState('')
    const [region,setRegion] = useState('')
    const [selectedUsers,setSelectedUsers] = useState<any[]>([])
    const userIds = users?.map((user:any)=>user?._id)
    const allAreSelected = compareArrays(selectedUsers,userIds)
    const [expandUser,setExpandUser] = useState<{id:string,name:string}>({id:'',name:''})
    const [openDeleteConfirmation,setOpenDeleteConfirmation] = useState(false)
    const queryClient = useQueryClient();
    const [notificationSnackbarOpen,setNotificationSnackbarOpen] = React.useState(false)
    const [notificationSeverity,setNotificationSeverity] = useState<'success'|'error'>()
    const handleNotificationSnackbarClose = ()=>{
      setNotificationSnackbarOpen(false)
    }

    const handleAllSelection = ()=>{
    if(allAreSelected){
    setSelectedUsers([])
    return;
    }
     setSelectedUsers([])
     setSelectedUsers(users?.map((user:any)=>user?._id))
    }
    const handleSingleSelection = (id:number)=>{
    const selectedIndex =  selectedUsers.findIndex((selected:any)=>selected === id)
    if(selectedIndex !== -1){
    setSelectedUsers(selectedUsers.filter((selected:any)=>selected !== id))
    }
    else {
        setSelectedUsers([...selectedUsers,id])
    }
    }
   
    const {mutate:update,isPending,error} = useMutation({
        mutationKey:['update_user'],
        mutationFn:updateUser,
        onSuccess:()=>{
        setNotificationSeverity('success')
        queryClient.invalidateQueries({queryKey:['users']})
        setOpenDeleteConfirmation(false)
        },
        onError:(error)=>{
            setNotificationSeverity('error')
        },
        onSettled:()=>{
            setNotificationSnackbarOpen(true)
        }
    })
    const handleSubmit = ()=>{
        const payload = {
            firstName,
            lastName,
            region,
            email,
            city,
            subCity,
            userId:expandUser.id
        }
       if(isPending){
        return
       }
       update(payload)
    }
    const handleBlockClick = ()=>{
        const payload = {
            recordStatus:2,
            userId:expandUser.id
        }
        if(isPending){
            return;
        }
        update(payload)
    }
    const handleActiveClik = ()=>{
        const payload = {
            recordStatus:1,
            userId:expandUser.id
        } 
        if(isPending){
            return;
        }
        update(payload)
    }
    const handleDeleteClick = ()=>{
        const payload = {
            recordStatus:3,
            userId:expandUser.id
        } 
        if(isPending){
            return;
        }
        update(payload)
    }
    const handleVerifyClick = ()=>{
        const payload = {
            isVerified:1,
            userId:expandUser.id
        } 
        if(isPending){
            return;
        }
        update(payload)
    }
    useEffect(()=>{
        if(Array.isArray(users) && users?.length > 0 && expandUser?.id) {
        const profileDetail = users?.find((user:any)=>user?._id === expandUser?.id)
         setFristName(profileDetail?.firstName||'')
         setLastName(profileDetail?.lastName||'')
         setPhoneNumber(profileDetail?.phoneNumber||'')
         setEmail(profileDetail?.email||'')
         setRegion(profileDetail?.region||'')
         setSubCity(profileDetail?.subCity||'')
         setCity(profileDetail?.city||'')
        }
        },[expandUser,users])
    return (
        <Stack spacing={0}>
        <Paper
        sx={{
            borderRadius:'8px',
            p:1
        }}
        >
            <Grid container spacing={1} alignItems={'center'}>
            <Grid item lg={3}>
                <Box 
                sx={{display:'flex',alignItems:'center',}}
                >
                <Checkbox
                checked={allAreSelected}
                indeterminate={selectedUsers?.length>0 && selectedUsers?.length<users?.length}
                onChange={handleAllSelection}
                size="small"/>
                <Typography fontWeight={'bold'}>
                    {`User Name (${users?.length||0})`}
                </Typography>
                <IconButton 
                size="small">
                    <ArrowDropDownIcon/>
                </IconButton>
                </Box>
            </Grid>
            <Grid item lg={2}>
            <Box 
                sx={{display:'flex',alignItems:'center',}}
                >
                <Typography fontWeight={'bold'}>
                    Phone Number
                </Typography>
                <IconButton size="small">
                    <ArrowDropDownIcon/>
                </IconButton>
                </Box>
            </Grid>
            <Grid item lg={3}>
            <Box 
                sx={{display:'flex',alignItems:'center',}}
                >
                <Typography fontWeight={'bold'}>
                    E-mail
                </Typography>
                <IconButton size="small">
                    <ArrowDropDownIcon/>
                </IconButton>
                </Box>
            </Grid>
            <Grid item lg={2}>
            <Box 
                sx={{display:'flex',alignItems:'center',}}
                >
                <Typography fontWeight={'bold'}>
                    Status
                </Typography>
                <IconButton size="small">
                    <ArrowDropDownIcon/>
                </IconButton>
                </Box>
            </Grid>
            <Grid item lg={1}>
            <Box 
                sx={{display:'flex',alignItems:'center',}}
                >
                <Typography fontWeight={'bold'}>
                    Posted
                </Typography>
                {/* <IconButton size="small">
                    <ArrowDropDownIcon/>
                </IconButton> */}
                </Box>
            </Grid>
            <Grid item lg={1}>
                <Typography fontWeight={'bold'}>
                    Edit
                </Typography>
            </Grid>
            </Grid>
        </Paper>
        {
         usersLoading?
         (
            <Typography variant="caption">
                Loading...
            </Typography>
         ):
         (
            <Box
            sx={{
               borderRadius:'8px',
               
           }}
           >
            {
               users?.map((user:any)=>(
                  <React.Fragment>
                    <Paper
                   key={user?._id}
                   sx={{
                       p:.5,
                       borderRadius:'8px',
                       mt:1,mb:1,
                   }}
                   >
                   <Grid container spacing={1} alignItems={'center'} sx={{p:1}}>
                   <Grid item lg={3}>
                   <Box
                   sx={{display:'flex',gap:.5,alignItems:'center'}}
                   >
                   <Checkbox
                   checked={selectedUsers.includes(user?._id)}
                   onChange={()=>{
                       handleSingleSelection(user?._id)
                   }}
                   size="small"/>
                   <Avatar
                   // component={'img'}
                   alt={user?.firstName} 
                   src={`${IMAGE_URL}/${user?.profilePic}`}
                   // onError={(e)=>e.currentTarget.src = '/icons/femaleSkin.svg'}
                   />
                   <Typography variant="body2" fontWeight={'bold'}>
                       {
                       `${user?.firstName} ${user?.lastName}`
                       }
                   </Typography>
                   </Box>
                  
                   </Grid>
                   <Grid item lg={2}>
                  <Typography variant="body2" fontWeight={"bold"}>
                  {
                       user.phoneNumber
                   }
                  </Typography>
                   </Grid>
                   <Grid item lg={3}>
                  <Typography variant="body2" fontWeight={"bold"}>
                  {
                       user.email
                   }
                  </Typography>
                   </Grid>
                   <Grid item lg={2}>
                   <Typography variant="body2" fontWeight={"bold"} sx={{display:'flex',alignItems:'center',gap:.5}}>
                <CircleIcon
                sx={{
                    fontSize:'.8rem'
                }}
                fontSize="small"
                color={
                user?.recordStatus === 1 ?'success':user?.recordStatus===2?'warning':user?.recordStatus===3?'error':'inherit'} 
                />
               {
                    user?.recordStatus === 1 ? 'Active' : user?.recordStatus === 2 ? 'Inactive' :'Deleted'
                }

               </Typography>
                   </Grid>
                   <Grid item lg={1}>
                  <Typography variant="body2" fontWeight={"bold"}>
                  {
                       // user.posted
                       12
                   }
                  </Typography>
                   </Grid>
                   <Grid item lg={1}>
                    <IconButton
                    onClick={()=>setExpandUser({id:user?._id,name:`${user?.firstName} ${user?.lastName}`})}
                    sx={{
                       borderRadius: '50%',
                       backgroundColor: '#EDFDEC',
                    }}
                    >
                       <img width={15} src="/icons/edit.svg"/>
                    </IconButton>
                   </Grid>
                   </Grid>
                   </Paper>
                   <Collapse in={user?._id===expandUser?.id} timeout="auto" unmountOnExit>
                    {
                       false?
                       (
                           <Typography variant="caption">
                               Loading...
                           </Typography>
                       ):
                       (
                           <Box
                            sx={{
                                p:1,
                                mb:1,mt:1,
                                backgroundColor:'#F7F7F7',
                                borderRadius:'10px',
                                display:'flex',
                                flexDirection:'column',
                                gap:1,
                            }}
                            component={'form'}
                            onSubmit={(e)=>{
                                e.preventDefault()
                                handleSubmit();
                            }}
                        >
                       <Box 
                       sx={{
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'space-between'
                    }}>
              <Box sx={{display:'flex',gap:3,alignItems:'center'}}>
              <Stack
              alignItems={'center'}
              spacing={.5}
              >
              <img 
                style={{objectFit:'contain'}} 
                width={120} 
                src={user?.profilePic ? `${IMAGE_URL}/${user?.profilePic}` : "/icons/femaleSkin.svg"}
                />
                <Typography
                sx={{
                    color:user?.isVerified ? 'green' : 'red'
                }}
                >
                  {
                    user?.isVerified ? 'Verified' : 'Unverified'
                  }
                </Typography>
              </Stack>
               <Stack sx={{mt:1}}>
               <Typography variant="h5" fontWeight={"bold"} sx={{mb:1,}}>
                   {
                    `${user?.firstName} ${user?.lastName}`
                   }
               </Typography>
                <Box sx={{display:'flex',alignItems:'center',gap:2}}>
                <img  src="/icons/icons8_phone_1.svg"/>
                <Typography variant="body2" >
                       Phone: {user?.phoneNumber}
                   </Typography>
                </Box>
                <Box sx={{display:'flex',alignItems:'center',gap:2}}>
                <img  src="/icons/icons8_paper_plane.svg"/>
                <Typography variant="body2" >
                       Email: {user?.email}
                   </Typography>
                </Box>
                <Box sx={{display:'flex',alignItems:'center',gap:2}}>
                <BusinessCenterIcon fontSize="small" sx={{color:'rgb(232 201 207)'}}/>
                   <Typography variant="body2">
                       12 Products posted
                   </Typography>
                </Box>
                <Box sx={{display:'flex',alignItems:'center',gap:2}}>
                <CloseIcon fontSize="small" color="error"/>
                   <Typography variant="body2">
                       0 Blocked products
                   </Typography>
                </Box>
               </Stack>
               </Box> 
              
             
                       <Box sx={{display:'flex',flexDirection:'column',gap:1}}>
                    <IconButton
                    onClick={()=>setOpenDeleteConfirmation(true)}
                    size="small"
                    sx={{
                       alignSelf:'flex-end'
                    }}
                    >
                       <DeleteIcon color="error" />
                    </IconButton>
                       <Box sx={{display:'flex',gap:2,}}>
                           <ProfileTextField
                            fullWidth 
                            label="First Name" 
                            value={firstName}
                            onChange={(e)=>setFristName(e.target.value)}
                            required
                            />
                           <ProfileTextField 
                           fullWidth
                           label="Phone Number" 
                           defaultValue={user?.phoneNumber} 
                           disabled
                            />
                            <ProfileTextField 
                           fullWidth
                           label="Email" 
                           value={email}
                           onChange={(e)=>setEmail(e.target.value)} 
                           
                            />
                           </Box>
                           <Box sx={{display:'flex',gap:2,}}>
                           
                           <ProfileTextField 
                            label="Last Name" 
                            value={lastName}
                            onChange={(e)=>setLastName(e.target.value)}
                            />
                           <ProfileTextField  
                           label="City"
                           value={city}
                           onChange={(e)=>setCity(e.target.value)}
                           required

                            />
                           <ProfileTextField 
                            label="Sub City" 
                            value={subCity}
                            onChange={(e)=>setSubCity(e.target.value)}
                            required
                            />
                           </Box>
                           <Box sx={{display:'flex',gap:2}}>
                           <ProfileTextField
                            label="Region" 
                            value={region}
                            onChange={(e)=>setRegion(e.target.value)}
                            required
                            />
                          
                           </Box>
                       </Box>
                 
               </Box>
                 <Box
                 sx={{
                   display:'flex',alignItems:'center',gap:1,
                   alignSelf:'flex-end'
               }}
                 >
               <Button
               size="small"
               variant="contained"
               sx={{
                   color:'white',
                   background:'green',
                //    border:'1px solid tomato',
               }}
               onClick={handleVerifyClick}
               >

                   Verify
               </Button>
               <Button
               size="small"
               variant="contained"
               sx={{
                   color:'tomato',
                   background:'#F7F7F7',
                   border:'1px solid tomato',
               }}
               onClick={handleBlockClick}
               >
                   Block
               </Button>
               <Button
               size="small"
               variant="contained"
               sx={{
                   color:'green',
                   background:'#F7F7F7',
                   border:'1px solid green',
               }}
               onClick={handleActiveClik}
               >
                Activate
               </Button>
                <Button 
                   type="submit"
                    sx={{color:'white'}} 
                    size="small" 
                    variant="contained"
                    disabled={isPending}
                    >
                    Save
                </Button>
                <IconButton
               onClick={()=>setExpandUser({id:'',name:''})}
                >
                   <KeyboardArrowUpIcon/>
                </IconButton>
                 </Box>
                           </Box>
                       )
                    }
                  </Collapse>
                  </React.Fragment>
                   
               ))
            }
           </Box>
         )
        }
        <ConfirmDeleteDialog 
            open={openDeleteConfirmation} 
            handleClose={()=>setOpenDeleteConfirmation(false)} 
            title={expandUser.name}
            handleDelete={handleDeleteClick}
            />
        {
           notificationSnackbarOpen&&(
            <CustomAlert
            open={notificationSnackbarOpen}
            handleSnackBarClose = {handleNotificationSnackbarClose}
            severity={notificationSeverity}
            successMessage="User Successfully updated"
            errorMessage={error?.message}
            />
           )
          }
        </Stack>
    )
}