import { Box, Button, Divider, Grid, InputBase, Paper, Stack, Typography } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save'
import Enums from "../utils/constants/serviceEnums";
const {ServiceEnums} = Enums
export default function EngagmentPrice(){
    const services =  Object.entries(ServiceEnums).map(([key, value]) => ({ name: key, value: value }));
    return (
     <Paper
     sx={{
        p:2,
        display:'flex',
        flexDirection:'column',
        gap:1,
     }}
     >
        <Box
        sx={{display:'flex',alignItems:'center',justifyContent:'space-between'}}
        >
        <Typography variant="h5" fontWeight={'bold'}>
            {'Engagment Price'}
        </Typography>
        <Button
        variant="contained"
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
        <Grid container spacing={2}>
              {
                services?.map((service)=>(
                    <Grid item xs={12} sm={6}>
                         <Stack direction={'row'} spacing={2} alignItems={'center'}>
                    <Typography variant="h6" fontWeight={'bold'}>
                        {service.name}
                    </Typography>
                    <Box
         sx={{p: '2px 4px', display: 'flex',
         background:'#EFEFEF',
         alignItems: 'center',borderRadius:"10px",height:45}}
         >
                 <InputBase
        sx={{ ml: 1, flex: 1,fontWeight:'bold' }}
        placeholder="Enter Price"
        inputProps={{ 'aria-label': 'search gadal market' }}
      />
       
         </Box>
                </Stack>

                    </Grid>
                ))
              }
            </Grid>
     </Paper>
    )
}