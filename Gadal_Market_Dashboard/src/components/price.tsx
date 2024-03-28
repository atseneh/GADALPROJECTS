import { Box, Button, Divider, Grid, InputBase, Paper, Stack, Typography } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save'
import Enums from "../utils/constants/serviceEnums";
const {ServiceEnums} = Enums
interface PriceProps {
    mainTitle:string;
    priceType:number;
}
export default function Price(props:PriceProps){
    const {mainTitle,priceType} = props
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
            {mainTitle}
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
        {
            priceType === 1 ?
            (
            <Grid
            container
            spacing={1}
            >
            <Grid item xs={12} sm={6}>
                <Stack direction={'row'} spacing={2} alignItems={'center'}>
                <Typography variant="h6" fontWeight={'bold'}>
                        Premium
                    </Typography>
                    <Box
         sx={{p: '2px 4px', display: 'flex',
         background:'#EFEFEF',
         alignItems: 'center',borderRadius:"10px",height:45}}
         >
                 <InputBase
        sx={{ ml: 1, flex: 1,fontWeight:'bold' }}
        placeholder="Enter price"
        inputProps={{ 'aria-label': 'search gadal market' }}
      />
         <img width={32} src="/icons/bestSeller.svg" />
       
         </Box>
                </Stack>
                </Grid>   
                <Grid item xs={12} sm={6}>
                <Stack direction={'row'} spacing={2} alignItems={'center'}>
                    <Typography variant="h6" fontWeight={'bold'}>
                        Gold
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
         <img width={32} src="/icons/bestSeller.svg" />
       
         </Box>
                </Stack>
                </Grid>   
            </Grid>
            ):
            (
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
            )
        }
     </Paper>
    )
}