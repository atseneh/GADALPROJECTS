import { Grid, Paper, Stack, Typography,IconButton, Box, Divider, TextField } from "@mui/material"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Checkbox from '@mui/material/Checkbox';
import React, { useState } from "react";
import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery } from "@tanstack/react-query";
import getUsers from "../api/getUsers";
const TableTextField = styled(InputBase)(({ theme }) => ({
    'label + &': {
      marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
      borderRadius: 4,
      width:150,
      position: 'relative',
      backgroundColor: theme.palette.mode === 'light' ? '#F3F6F9' : '#1A2027',
      border: '1px solid',
      borderColor: theme.palette.mode === 'light' ? '#E0E3E7' : '#2D3843',
      fontSize: 16,
      padding: '10px 12px',
      transition: theme.transitions.create([
        'border-color',
        'background-color',
        'box-shadow',
      ]),
      // Use the system font instead of the default Roboto font.
     
      '&:focus': {
        borderColor: 'white',
      },
    },
  }));
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

export default function AdminTable(){
    const {data:admins,isLoading:adminsLoading} = useQuery({
        queryKey:['admins'],
        queryFn:()=>getUsers(true)
    })
    const [selectedAdmins,setSelectedAdmins] = useState<any[]>([])
    const adminIds = admins?.map((admin:any)=>admin?._id)
    const allAreSelected = compareArrays(selectedAdmins,adminIds)
    const [onEditMode,setOnEditMode] = useState('')
    const handleAllSelection = ()=>{
    if(allAreSelected){
    setSelectedAdmins([])
    return;
    }
     setSelectedAdmins([])
     setSelectedAdmins(admins?.map((admin:any)=>admin?._id))
    }
    const handleSingleSelection = (id:number)=>{
    const selectedIndex =  selectedAdmins.findIndex((selected:any)=>selected === id)
    if(selectedIndex !== -1){
    setSelectedAdmins(selectedAdmins.filter((selected:any)=>selected !== id))
    }
    else {
        setSelectedAdmins([...selectedAdmins,id])
    }
    }
    return (
        <Stack spacing={1}>
        <Paper
        sx={{
            borderRadius:'8px',
            p:1.3
        }}
        >
            <Grid container spacing={1} alignItems={'center'}>
            <Grid item lg={3}>
                <Box 
                sx={{display:'flex',alignItems:'center',}}
                >
                <Checkbox
                checked={allAreSelected}
                indeterminate={selectedAdmins?.length>0 && selectedAdmins?.length<admins?.length}
                onChange={handleAllSelection}
                size="small"/>
                <Typography fontWeight={'bold'}>
                    {`Admin Name(${admins?.length || 0})`}
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
                    Email
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
                    Previlage
                </Typography>
                <IconButton size="small">
                    <ArrowDropDownIcon/>
                </IconButton>
                </Box>
            </Grid>
            <Grid item lg={1}>
                <Typography fontWeight={'bold'}>
                    Edit
                </Typography>
            </Grid>
            </Grid>
        </Paper>
        <Box
         sx={{
            borderRadius:'8px',
            
        }}
        >
         {
            admins?.map((admin:any,index:number)=>(
                <Paper key={index} sx={{p:1,mb:1,display:'flex',flexDirection:'column',gap:1,}}>
                <Grid container spacing={1} alignItems={'center'}>
                <Grid item lg={3}>
                <Box
                sx={{display:'flex',gap:1,alignItems:'center'}}
                >
                <Checkbox
                checked={selectedAdmins.includes(admin?._id)}
                onChange={()=>{
                    handleSingleSelection(admin?._id)
                }}
                size="small"/>
                <img  width={24}  src={'/icons/property.svg'}/>
                 {
                    onEditMode === admin?._id ? 
                    (
                        <TableTextField
                        size="small" defaultValue={`${admin?.firstName} ${admin?.lastName}`}/>
                    ):
                    (
                        <Typography variant="body2" fontWeight={'bold'}>
                        {`${admin?.firstName} ${admin?.lastName}`}
                    </Typography>
                    )
                 }
                </Box>
               
                </Grid>
                <Grid item lg={3}>
                {
                    onEditMode === admin?._id ? 
                    (
                        <TableTextField
                        size="small" defaultValue={admin?.phoneNumber}/>
                    ):
                    (
                        <Typography variant="body2" fontWeight={'bold'}>
                        { admin?.phoneNumber}
                    </Typography>
                    )
                 }
              
                </Grid>
                <Grid item lg={3}>
                {
                    onEditMode === admin?.id ? 
                    (
                        <TableTextField
                        size="small" defaultValue={admin?.email}/>
                    ):
                    (
                        <Typography variant="body2" fontWeight={'bold'}>
                        { admin?.email}
                    </Typography>
                    )
                 }
                </Grid>
                <Grid item lg={2}>
               <Typography variant="body2" fontWeight={"bold"}>
               {
                    'admin.previlage'
                }
               </Typography>
                </Grid>
                <Grid item lg={1}>
                 {
                    onEditMode === admin?._id ?
                    (
                        <IconButton>
                            <DeleteIcon color="error"/>
                        </IconButton>
                    ):
                    (
                        <IconButton
                        onClick={()=>setOnEditMode(admin?._id)}
                        sx={{
                           borderRadius: '50%',
                           backgroundColor: '#EDFDEC',
                        }}
                        >
                           <img width={15} src="/icons/edit.svg"/>
                        </IconButton>
                    )
                 }
                </Grid>
                </Grid>
                {
                    onEditMode === admin?._id&&(
                        <Stack direction={'row'} alignItems={'center'} spacing={1} sx={{alignSelf:'flex-end',mr:6,}}>
                        <IconButton
                        onClick={()=>setOnEditMode('')}
                        >
                            <CloseIcon color="error"/>
                        </IconButton>
                        <IconButton>
                            <CheckIcon color="success"/>
                        </IconButton>
                     </Stack>
                    )
                }
                </Paper>
            ))
         }
        </Box>
        </Stack>
    )
}