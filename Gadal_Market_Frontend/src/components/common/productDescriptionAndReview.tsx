import { Button, Rating, Skeleton, Stack, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState } from "react";

export default function DescriptionAndReview(props:{data:any,loading:boolean}){
    const {data,loading} = props
    const [activeTab,setActiveTab] = useState(1)
    const handleTabChange = (tab:number)=>{
        setActiveTab(tab)
    }
    return (
       <>
        <Box sx={{display:'flex',alignItems:'center',justifyContent:'center',gap:2}}>
        <Typography
        onClick={()=>handleTabChange(1)}
         sx={{cursor:'pointer',color:activeTab!==1?'#ABABAB':''}}
        variant="h5" fontWeight={'bold'}>
           Description
        </Typography>
        <Typography
        onClick={()=>handleTabChange(2)}
        sx={{cursor:'pointer',color:activeTab!==2?'#ABABAB':''}}
        variant="h5" fontWeight={'bold'}>
           {'Review(3)'}
        </Typography>
   </Box>
           {
            activeTab===1?
            (
                <Box sx={{
                    
                    borderTop:'3px solid #EFEFEF',borderLeft:'2px solid #EFEFEF',
                    borderRight:'2px solid #EFEFEF',
                    mt:1,p:.5,
                }}
                    >
                    <Typography sx={{color:'#535252'}}>
                      {
                        loading
                        ?
                        (
                            <Skeleton width={'100%'}/>
                        ):
                        (
                            <>
                            {data?.description}
                            </>
                        )
                      }
                    </Typography>
                </Box>
            ):
            (
                <Typography>
                    <Reviews/>
                </Typography>
            )
           }
       </>
    )
}

function Reviews(){
    return (
        <Box
        sx={{
        boxShadow: `1px 1px 8px #ABABAB`,
        p:1,
        display:'flex',
        flexDirection:'column',
        gap:2
        }}
        >
       {
        [1,2,3].map((item)=>(
            <Stack spacing={1} sx={{ml:1}} key={item}>
            <Box sx={{display:'flex',gap:1}}>
            <Typography>
                Dawit Fissha
            </Typography>
            <Typography variant="body2" sx={{mt:.2}}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </Typography>
            </Box>
            <Rating size="small" readOnly value={4}/>
            <Typography>
                2 months ago
            </Typography>
            {/* <Divider/> */}
            </Stack>
        ))
       }
       <Stack spacing={1}>
       <Typography fontWeight={'bold'}>
            Add A Review
        </Typography>
        <form>
          <Box sx={{display:'flex',alignItems:'center',gap:1}}>
            <Typography variant="body2">
                Your Rating
            </Typography>
            <Rating size="small"/>
          </Box>
          <TextField
           fullWidth
           required multiline placeholder="Comment"
           rows={4}
           sx={{background:"white",mt:1}}
           />
           <Button
           type="submit"
           variant="contained"
           sx={{color:'white',mt:1}}
           >
            Submit
           </Button>
        </form>
       </Stack>
        </Box>
    )
}