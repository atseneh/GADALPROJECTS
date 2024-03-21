import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ServiceAssurance from "../common/serviceAssurance";
import { useEffect } from "react";
export default function AppCta(){

    return (
        <Box 
            sx={{
                width:'100%',
                height:500,
                display:'flex',
                flexDirection:'column',
                gap:1,
                position:'relative',
                borderRadius:'20px',
                 background:'url(/images/cta.png)',
                 backgroundSize:'cover',                   
                 backgroundRepeat:'no-repeat',
                 backgroundPosition: 'center center',
                }}
            >
             
                    <Box sx={{
                        position:'absolute',
                        top:170,
                        left:100,
                    }}>
                    <Typography sx={{color:'white',fontWeight:'bold',fontSize:'2.5rem'}} variant = 'h3'>
                        Download our free 
                    </Typography>
                    <Typography variant = 'h4' sx={{color:'white',fontWeight:'bold',fontSize:'2.5rem'}}>
                        Gadal Market App
                    </Typography>
                    <Box sx={{display:'flex',alignItems:'center',gap:1,mt:1.5,ml:2,}}>
                        <Button>
                         <img width={120} src="/images/googlePlay.svg"/>
                        </Button>
                        <Button>
                         <img width={120} src="/images/Appstore.svg"/>
                        </Button>
                    </Box>
                    </Box>
                    <Box
                    sx={{
                        position:'absolute',
                        top:430,
                    }}
                    >
                        <ServiceAssurance/>
                    </Box>
                
        </Box>
    )
}