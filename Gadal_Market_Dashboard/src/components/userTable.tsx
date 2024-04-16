import { Grid, Paper, Stack, Typography,IconButton, Box, Divider, Avatar, Button, TextField, Switch, Collapse } from "@mui/material"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Checkbox from '@mui/material/Checkbox';
import React, { useState } from "react";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDeleteDialog from "./confirmDelete";
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CloseIcon from '@mui/icons-material/Close';
import { useQuery } from "@tanstack/react-query";
import getUsers from "../api/getUsers";
import { IMAGE_URL } from "../api/apiConfig";
import getUserById from "../api/getUserById";
import { TextFieldProps } from "@mui/material/TextField";
function ProfileTextField (props:TextFieldProps){
    return (
        <TextField
        sx={{
            background:'#F7F7F7'
        }}
        variant="standard"
        InputProps={{readOnly:true}}
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
    const [selectedUsers,setSelectedUsers] = useState<any[]>([])
    const userIds = users?.map((user:any)=>user?._id)
    const allAreSelected = compareArrays(selectedUsers,userIds)
    const [expandUser,setExpandUser] = useState('')
    const [openDeleteConfirmation,setOpenDeleteConfirmation] = useState(false)
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
    const {data:user,isLoading:userLoading} = useQuery({
        queryKey:['user',expandUser],
        queryFn:()=>getUserById(expandUser),
        enabled:Boolean(expandUser)
    })
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
                  <Typography variant="body2" fontWeight={"bold"}>
                  {
                       user.status
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
                    onClick={()=>setExpandUser(user?._id)}
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
                   <Collapse in={user?._id===expandUser} timeout="auto" unmountOnExit>
                    {
                       userLoading?
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
                   >
                       <Box sx={{
               display:'flex',
               alignItems:'center',
               justifyContent:'space-between'
   
           }}>
              <Box sx={{display:'flex',gap:3,alignItems:'center'}}>
               <img style={{}} width={120} src="/icons/femaleSkin.svg"/>
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
                            defaultValue={user?.firstName}
                            />
                           <ProfileTextField 
                           fullWidth
                           label="Email Or Phone Number" 
                           defaultValue={user?.phoneNumber} 
                            />
                           
                           </Box>
                           <Box sx={{display:'flex',gap:2,}}>
                           
                           <ProfileTextField 
                            label="Last Name" 
                            defaultValue={user?.lastName}
                            />
                           <ProfileTextField  
                           label="City"
                           defaultValue={user?.location?.discripton} 
                            />
                           <ProfileTextField 
                            label="Sub City" 
                            defaultValue={user?.subCity?.discripton} 
                            />
                           </Box>
                           <Box sx={{display:'flex',gap:2}}>
                           <ProfileTextField
                            label="Region" />
                           <ProfileTextField  
                           label="Woreda" 
                           
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
               {/* <Stack  direction={'row'} alignItems={'center'}>
                   <Typography>
                       Admin
                   </Typography>
                   <Switch/>
               </Stack> */}
               <Button
               size="small"
               variant="contained"
               sx={{
                   color:'tomato',
                   background:'#F7F7F7',
                   border:'1px solid tomato',
               }}
               >
                   Blocked
               </Button>
               <Button
               size="small"
               variant="contained"
               sx={{
                   color:'green',
                   background:'#F7F7F7',
                   border:'1px solid green',
               }}
               >
                   Activate
               </Button>
                <Button sx={{color:'white'}} size="small" variant="contained">
                               Save
                           </Button>
                <IconButton
               onClick={()=>setExpandUser('')}
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
        <ConfirmDeleteDialog open={openDeleteConfirmation} handleClose={()=>setOpenDeleteConfirmation(false)} itemToDeleteId="someId" title="User Name"/>
        </Stack>
    )
}