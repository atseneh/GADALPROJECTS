import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import Estimations from "../components/estimations";
import { useState } from "react";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Enums from '../utils/constants/serviceEnums'
import { useQuery } from "@tanstack/react-query";
import getEstimations from "../api/getEstimations";
export default function GetEstimation(){
    const [rent,setRent] = useState(true)
    const {ServiceEnums} = Enums
    const services =  Object.entries(ServiceEnums).map(([key, value]) => ({ name: key, value: value }));
    const [selectedService,setSelectedService] = useState(2)
    const {data:estimations,isLoading:estimationsLoading} = useQuery({
      queryKey:['estimations',rent,selectedService],
      queryFn:()=>getEstimations(
        {
          transactionType:rent?1:2,
          service:selectedService
        }
      )
  })
    return (
       <Stack spacing={1}>
        <Box
        sx={{
            display:'flex',
            alignItems:'center',
            gap:2,
        }}
        >
        <Paper
        sx={{pl:1,pr:1,p:.5,borderRadius:'4px'}}
        >
         <Typography fontWeight={'bold'}>
         {
          `Requested (${estimations?.length||0})`
         }   
         </Typography>
        </Paper>
        <Stack direction={'row'} spacing={2} alignItems={'center'}>
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
                   {
                    services.map((service)=>(
                        <Box 
                        sx={{
                          display:'flex',
                          flexDirection:'row',
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
                          <img width={16} height={14} src={`/icons/${service?.name.toLowerCase()}.svg`}/>
                          <Typography variant="caption" fontWeight={'bold'}>
                            {service.name}
                          </Typography>
                        </Box>
                    ))
                   }
                </Stack>
        </Box>
        <Estimations
        estimationsLoading={estimationsLoading}
        data={estimations}
        />
       </Stack>
    )
}