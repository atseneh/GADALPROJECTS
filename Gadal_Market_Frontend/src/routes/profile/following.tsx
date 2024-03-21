import { CardContent, Typography,Card, Divider, Stack, IconButton, Tooltip, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
export default function Following(){
    return (
    <Card>
        <CardContent>
        <Box sx={{display:'flex',flexDirection:'column',gap:1}}>
        <Typography variant='h6' fontWeight={'bold'}>
            Your Followings
        </Typography>
       
        <Divider sx={{fontWeight:'bold',mb:1}}/>
        <Grid container spacing={1}>
                {
                    [1,2,3,4].map((item)=>(
                        <Grid xs={12} sm={6} md={3} key={item} sx={{mt:1}}>
          <Box 
                sx={{
                    display:'flex',flexDirection:'column',ml:2,position:'relative',alignSelf:'flex-start',
                    boxShadow: `1px 1px 8px #ABABAB`,
                    p:1,
                    }}>
                <Tooltip title="Unfollow">
                <IconButton 
                    sx={{position:'absolute',right:0,top:0}}
                    >
                        <PersonRemoveIcon fontSize="small"/>
                    </IconButton>
                </Tooltip>
                <Box sx={{alignSelf:'center'}}>
                <Stack sx={{ml:2}}>
            <img  width={100} src="/images/maleUser.svg"/>
                <Typography variant="body2">
                    Dawit Fissha
                </Typography>
                <Typography variant="body2">
                    0927784322 
                </Typography>
            </Stack>
                <Typography variant="caption">
                    dawitfissha1@gmailcom
                </Typography>
                </Box>
    </Box>    
                        </Grid>
                    ))
                }
                </Grid>
        </Box>
        
        </CardContent>
    </Card>
    )
}