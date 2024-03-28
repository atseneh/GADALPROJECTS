import { Grid, Paper, Stack, Typography,IconButton, Box, Divider } from "@mui/material"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import productSample from '../utils/sample/product.json'
import Checkbox from '@mui/material/Checkbox';
import React, { useState } from "react";
import { compareArrays } from "../components/productTable";
import CheckoutSample from '../utils/sample/checkout.json'
export default function Checkout(){
    const [selectedCheckouts,setSelectedCheckouts] = useState<any[]>([])
    const checkoutIds = CheckoutSample.map((sample:any)=>sample.id)
    const allAreSelected = compareArrays(selectedCheckouts,checkoutIds)
    const handleAllSelection = ()=>{
    if(allAreSelected){
    setSelectedCheckouts([])
    return;
    }
     setSelectedCheckouts([])
     setSelectedCheckouts(CheckoutSample?.map((sample:any)=>sample.id))
    }
    const handleSingleSelection = (id:number)=>{
    const selectedIndex =  selectedCheckouts.findIndex((selected:any)=>selected === id)
    if(selectedIndex !== -1){
    setSelectedCheckouts(selectedCheckouts.filter((selected:any)=>selected !== id))
    }
    else {
        setSelectedCheckouts([...selectedCheckouts,id])
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
                indeterminate={selectedCheckouts?.length>0 && selectedCheckouts?.length<productSample.length}
                onChange={handleAllSelection}
                size="small"/>
                <Typography fontWeight={'bold'}>
                    {`Products(${productSample?.length})`}
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
                    Price
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
                    Location
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
                    User
                </Typography>
                <IconButton size="small">
                    <ArrowDropDownIcon/>
                </IconButton>
                </Box>
            </Grid>
            <Grid item lg={2}>
                <Typography fontWeight={'bold'}>
                    Phone
                </Typography>
            </Grid>
            <Grid item lg={2}>
                <Typography fontWeight={'bold'}>
                    Email
                </Typography>
            </Grid>
            </Grid>
        </Paper>
        <Paper
         sx={{
            borderRadius:'8px',
            p:1.3
        }}
        >
         {
            CheckoutSample?.map((sample:any,index:number)=>(
                <React.Fragment key={index}>
                <Grid container spacing={1} alignItems={'center'}>
                <Grid item lg={3}>
                <Box
                sx={{display:'flex',gap:1,alignItems:'center'}}
                >
                <Checkbox
                checked={selectedCheckouts.includes(sample.id)}
                onChange={()=>{
                    handleSingleSelection(sample.id)
                }}
                size="small"/>
                <img style={{objectFit:'contain',borderRadius:'8px'}} width={60} height={60} src={sample.image}/>
                <Typography>
                    {sample.title}
                </Typography>
                </Box>
               
                </Grid>
                <Grid item lg={1}>
               <Typography variant="body2" >
               {
                    new Intl.NumberFormat('en-Us',{maximumFractionDigits:3}).format(sample.Price)
                }
               </Typography>
                </Grid>
                <Grid item lg={2}>
               <Typography variant="body2">
               {
                    sample.location
                }
               </Typography>
                </Grid>
                <Grid item lg={2}>
               <Typography variant="body2">
               {
                    sample.user
                }
               </Typography>
                </Grid>
                <Grid item lg={2}>
                <Typography variant="body2">
                    {sample.phone}
                </Typography>
                </Grid>
                <Grid item lg={2}>
                <Typography variant="body2">
                    {sample.email}
                </Typography>
                </Grid>
                </Grid>
                <Divider/>
                </React.Fragment>
            ))
         }
        </Paper>
        </Stack>
    )
}