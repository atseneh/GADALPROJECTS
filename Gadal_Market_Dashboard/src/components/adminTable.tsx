import { Grid, Paper, Stack, Typography,IconButton, Box, Divider, TextField, Select, MenuItem, SelectChangeEvent, Popover, Button } from "@mui/material"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Checkbox from '@mui/material/Checkbox';
import React, { useEffect, useState } from "react";
import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getUsers from "../api/getUsers";
import { previlages } from "./createMainAdmin";
import updateUser from "../api/updateUser";
import CustomAlert from "./customAlert";
import CircleIcon from '@mui/icons-material/Circle';

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
    const [notificationSnackbarOpen,setNotificationSnackbarOpen] = React.useState(false)
    const [notificationSeverity,setNotificationSeverity] = useState<'success'|'error'>()
    const handleNotificationSnackbarClose = ()=>{
      setNotificationSnackbarOpen(false)
    }
    const [deleteAnchorEl, setDeleteAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setDeleteAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setDeleteAnchorEl(null);
    };
  
    const openDelete = Boolean(deleteAnchorEl);
    const id = openDelete ? 'delete-popover' : undefined;

    const queryClient = useQueryClient();
    const {mutate:update,isPending,error} = useMutation({
        mutationKey:['update_user'],
        mutationFn:updateUser,
        onSuccess:()=>{
        setNotificationSeverity('success')
        queryClient.invalidateQueries({queryKey:['admins']})
        },
        onError:(error)=>{
            setNotificationSeverity('error')
        },
        onSettled:()=>{
            setNotificationSnackbarOpen(true)
        }
    })
    const [selectedAdmins,setSelectedAdmins] = useState<any[]>([])
    const [firstName,setFristName] = useState('')
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
    const [selectedPrevilage,setSelectedPrevilage] = React.useState('')
    const handleChange = (event: SelectChangeEvent) => {
      setSelectedPrevilage(event.target.value );
    };

    const handleSingleSelection = (id:number)=>{
    const selectedIndex =  selectedAdmins.findIndex((selected:any)=>selected === id)
    if(selectedIndex !== -1){
    setSelectedAdmins(selectedAdmins.filter((selected:any)=>selected !== id))
    }
    else {
        setSelectedAdmins([...selectedAdmins,id])
    }
    }
    const handleAdminUpdate = ()=>{
        const payload:any = {userId:onEditMode}
        if(firstName){
            payload.firstName = firstName
        }
        if(selectedPrevilage){
            payload.adminAcessLevel = Number(selectedPrevilage)
        }
        if(!(firstName || selectedPrevilage)){
            return;
        }
       if(isPending){
        return
       }
       update(payload)
    }
    const handleDelete = ()=>{
        if(isPending){
            return;
        }
        update({
            userId:onEditMode,
            recordStatus:3
        })
    }
    useEffect(()=>{
        if(Array.isArray(admins)&&admins?.length > 0){
        const adminDetail = admins?.find((admin:any)=>admin?._id === onEditMode)
        setFristName(adminDetail?.firstName)
        setSelectedPrevilage(String(adminDetail?.adminAcessLevel))
        }
    },[admins,onEditMode])
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
                    Status
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
                        size="small" 
                        value={firstName}
                        onChange={(e)=>setFristName(e.target.value)}
                        />
                    ):
                    (
                        <Typography 
                        variant="body2" 
                        fontWeight={'bold'}
                        >
                        {`${admin?.firstName}`}
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
                        size="small" 
                        defaultValue={admin?.phoneNumber}
                        readOnly
                        />
                    ):
                    (
                        <Typography variant="body2" fontWeight={'bold'}>
                        { admin?.phoneNumber}
                    </Typography>
                    )
                 }
              
                </Grid>
                <Grid item lg={3}>
                <Typography variant="body2" fontWeight={"bold"} sx={{display:'flex',alignItems:'center',gap:.5}}>
                <CircleIcon
                sx={{
                    fontSize:'.8rem'
                }}
                fontSize="small"
                color={
                admin?.recordStatus === 1 ?'success':admin?.recordStatus===2?'warning':admin?.recordStatus===3?'error':'inherit'} 
                />
               {
                    admin?.recordStatus === 1 ? 'Active' : admin?.recordStatus === 2 ? 'Inactive' :'Deleted'
                }

               </Typography>
                </Grid>
                <Grid item lg={2}>
                  {
                    onEditMode === admin?._id ?  (
                        <Select
                        labelId="previlage-selector"
                        id="previlage-select"
                        value={selectedPrevilage}
                        label="Previlage"
                        onChange={handleChange}
                        size="small"
                      >
                        {
                          previlages?.map((previlage)=>(
                            <MenuItem value={previlage.value} key = {previlage.value}>
                              {previlage.description}
                            </MenuItem>
                          ))
                        }
                      </Select>
                    ):
                    (
                       <Typography>
                        {
                          admin?.adminAcessLevel === 0 ? "Super Admin" : previlages?.find((prev)=>prev.value === admin?.adminAcessLevel)?.description || ''
                        }
                       </Typography>
                    )
                  }
                </Grid>
                <Grid item lg={1}>
                 {
                    onEditMode === admin?._id ?
                    (
                    <>
                     <IconButton
                     onClick={handleClick}
                     >
                            <DeleteIcon color="error"/>
                        </IconButton>
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
                               handleDelete();
                               handleClose();
                             }}
                             >
                               Yes
                             </Button>
                            </Stack>
                         </Stack>
                               </Popover>
                    </>
                    ):
                    (
                        <IconButton
                        onClick={()=>setOnEditMode(admin?._id)}
                        sx={{
                           borderRadius: '50%',
                           backgroundColor: '#EDFDEC',
                        }}
                        disabled={admin?.adminAcessLevel === 0}
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
                        <IconButton
                        onClick={handleAdminUpdate}
                        >
                            <CheckIcon color="success"/>
                        </IconButton>
                     </Stack>
                    )
                }
                </Paper>
            ))
         }
        </Box>
        {
           notificationSnackbarOpen&&(
            <CustomAlert
            open={notificationSnackbarOpen}
            handleSnackBarClose = {handleNotificationSnackbarClose}
            severity={notificationSeverity}
            successMessage="Admin Successfully updated"
            errorMessage={error?.message}
            />
           )
          }
        </Stack>
    )
}