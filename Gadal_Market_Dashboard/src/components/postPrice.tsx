import { Box, Button, Divider, Grid, InputBase, Paper, Stack, Typography } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save'
import { useMutation, useQuery } from "@tanstack/react-query";
import getPostTypes from "../api/postTypeLists";
import { useEffect, useState } from "react";
import updatePostPrices from "../api/updatePostPrices";
import CustomAlert from "./customAlert";
export default function PostPrice(){
    const [postPriceData,setPostPriceData] = useState<{[key:string]:number}>()
    const [notificationSnackbarOpen,setNotificationSnackbarOpen] = useState(false)
    const [notificationSeverity,setNotficationSeverity] = useState<'error'|'success'|undefined>()
    const handleNotificationSnackbarClose = ()=>{
      setNotificationSnackbarOpen(false)
    }
    const {mutate,isPending} = useMutation({
        mutationKey:['update_post_price'],
        mutationFn:updatePostPrices,
        onSuccess:()=>{
            setNotficationSeverity('success')
        },
        onError:()=>{
            setNotficationSeverity('error')
        },
        onSettled:()=>{
            setNotificationSnackbarOpen(true)
        }
    })
    const handlePriceUpdate = ()=>{
        if(!postPriceData){
            return;
        }
        mutate(postPriceData)
    }
    const {data:postTypes,isLoading} = useQuery({
        queryKey:['postType'],
        queryFn:getPostTypes
    })
    const handlePriceChanges = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
        const {name,value} = e.target
        setPostPriceData({
            ...postPriceData,
            [name]:Number(value)
        })
    }
    useEffect(()=>{
        if(Array.isArray(postTypes) && postTypes?.length > 0){
         const value = postTypes.reduce((acc,cv)=>({
        ...acc,
        [cv?._id]:cv?.price
         }),{})
         setPostPriceData(value)
        }
    
    },[postTypes])
    return (
     <Paper
     sx={{
        p:2,
        display:'flex',
        flexDirection:'column',
        gap:1,
     }}
     >
       {
        isLoading ? (
            <Typography>
                Loading...
            </Typography>
        ):
        (
            <>
             <Box
        sx={{display:'flex',alignItems:'center',justifyContent:'space-between'}}
        >
        <Typography variant="h5" fontWeight={'bold'}>
            {'Post Price'}
        </Typography>
        <Button
        variant="contained"
        disabled={isPending}
        onClick={handlePriceUpdate}
        sx={{
            display:'flex',
            alignItems:'center',
            gap:.5,
            color:'white'
        }}
        >
        <SaveIcon/>
        <Typography>
            Save
        </Typography>
        </Button>
        </Box>
        <Divider/>
            <Grid
            container
            spacing={1}
            >
            {
                postTypes?.map((postType:any)=>(
                    <Grid item xs={12} sm={4} key={postType?._id}>
                    <Stack direction={'row'} spacing={2} alignItems={'center'}>
                    <Typography variant="h6" fontWeight={'bold'}>
                            {postType.name}
                        </Typography>
                        <Box
             sx={{p: '2px 4px', display: 'flex',
             background:'#EFEFEF',
             alignItems: 'center',borderRadius:"10px",height:45}}
             >
                     <InputBase
            sx={{ ml: 1, flex: 1,fontWeight:'bold' }}
            placeholder="Enter price"
            inputProps={{ 'aria-label': 'search gadal market',min:0}}
            name={postType?._id}
            value={postPriceData ? postPriceData![postType?._id] : ''}
            onChange={handlePriceChanges}
            type="number"
            
          />
             <img width={32} src="/icons/bestSeller.svg" />
           
             </Box>
                    </Stack>
                    </Grid>   
                ))
            }
            </Grid>
            </>
        )
       }
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
     </Paper>
    )
}