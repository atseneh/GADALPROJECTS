import { Avatar, Box, Paper, Stack, Typography,IconButton, Grid, Divider, Collapse } from "@mui/material";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SampleProduct from '../utils/product.json'
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useState } from "react";
import { IMAGE_URL } from "../api/apiConfig";
import { useQuery } from "@tanstack/react-query";
import getEstimationById from "../api/getEstimationById";
import { services } from "../utils/constants/serviceEnums";
interface EstimationProps {
    data:any,
    estimationsLoading:boolean,
}
export default function Estimations(props:EstimationProps){
    const {data:estimations,estimationsLoading} = props
    const [openLightBox,setOpenLightBox] = useState(false)
    const [activeImaeIndex,setActiveImageIndex] = useState(0)
    const [expand,setExpand] = useState('')
    const handleActiveImageChange = (image:string)=>{
      const imageIndex = SampleProduct.productImages?.findIndex((i)=>i === image)
       if(imageIndex !== -1) {
        setActiveImageIndex(imageIndex)
       }
    }
 const {data:expandedEstimation} = useQuery({
    queryKey:['estimation',expand],
    queryFn:()=>getEstimationById(expand),
    enabled:Boolean(expand)
 })
    return (
        <>
        {
              estimationsLoading?
              (
                  <Typography variant="caption">
                      Loading...
                  </Typography>
              ):
              (
              <>
              {
                estimations?.map((estimation:any)=>(
                    <Paper
                    sx={{p:1,display:'flex',flexDirection:'column',gap:1,pl:2}}
                    >
                   
                                <Box
                                sx={{
                                 display:'flex',alignItems:'center',justifyContent:'space-between'
                                }}
                                >
                                <Stack spacing={1}>
                                 <Box
                                         sx={{display:'flex',gap:2,alignItems:'center'}}
                                         >
                                        
                                         <Avatar alt={`${estimation?.user?.firstName}`} 
                                         src={`${IMAGE_URL}/${estimation?.user?.profilePic}`}
                                         />
                                         <Stack spacing={.5}>
                                         <Typography variant="body2" fontWeight={'bold'}>
                                             {
                                                `${estimation?.user?.firstName} ${estimation?.user?.lastName}`
                                             }
                                         </Typography>
                                         <Typography variant="body2" fontWeight={'bold'}>
                                             {
                                                `${estimation?.user?.email} , ${estimation?.user?.phoneNumber}`
                                             }
                                         </Typography>
                                         </Stack>
                                         </Box>
                                     <Stack spacing={2} direction={'row'} alignItems={'center'} >
                                         <Typography>
                                             Title
                                         </Typography>
                                         <Typography fontWeight={'bold'}>
                                             {estimation?.title}
                                         </Typography>
                                     </Stack>
                                 </Stack>
                                 {
                                     !(expand===estimation?._id)&&(
                                         <IconButton
                                     onClick={()=>setExpand(estimation?._id)}
                                         
                                         >
                                         <KeyboardArrowDownIcon/>
                                     </IconButton>
                                     )
                                 }
                                </Box>
                          
                       
                   {expand === estimation?._id &&(<Divider/>)}
                   <Collapse in={expand === estimation?._id} unmountOnExit >
                     <Box sx={{display:'flex',gap:1,flexDirection:'column'}}>
                     <Stack gap={1}>
                    <Typography>
                        Description
                    </Typography>
                    <Typography fontWeight={'bold'} >
                       {
                        expandedEstimation?.description
                       }
                    </Typography>
                    </Stack>
                    <Grid container columnSpacing={2} rowSpacing={1}>
                      <Grid item sm={4}>
                        <Box sx={{display:'flex',alignItems:'center',gap:2}}>
                            <Typography>
                                Category
                            </Typography>
                            <Typography fontWeight={'bold'}>
                                {
                                    services[expandedEstimation?.service as 1||2||3||4]
                                }
                            </Typography>
                        </Box>
                      </Grid>
                      <Grid item sm={4}>
                        <Box sx={{display:'flex',alignItems:'center',gap:2}}>
                            <Typography>
                                Sub Categories
                            </Typography>
                            <Typography fontWeight={'bold'}>
                                {
                                    expandedEstimation?.category?.name
                                }
                            </Typography>
                        </Box>
                      </Grid>
                      <Grid item sm={4}>
                        <Box sx={{display:'flex',alignItems:'center',gap:2}}>
                            <Typography>
                                Type
                            </Typography>
                            <Typography fontWeight={'bold'}>
                                {
                                    expandedEstimation?.transactionType === 1 ? 'Rent':'Sale'
                                }
                            </Typography>
                        </Box>
                      </Grid>
                      {
                        expandedEstimation?.model&&(
                            <Grid item sm={4}>
                        <Box sx={{display:'flex',alignItems:'center',gap:2}}>
                            <Typography>
                                Model
                            </Typography>
                            <Typography fontWeight={'bold'}>
                                {
                                    expandedEstimation?.model?.name
                                }
                            </Typography>
                        </Box>
                      </Grid>
                        )
                      }
                      <Grid item sm={4}>
                        <Box sx={{display:'flex',alignItems:'center',gap:2}}>
                            <Typography>
                                Location
                            </Typography>
                            <Typography fontWeight={'bold'}>
                                {
                                    estimation?.location?.descripton
                                }
                            </Typography>
                        </Box>
                      </Grid>
                      <Grid item sm={4}>
                        <Box sx={{display:'flex',alignItems:'center',gap:2}}>
                            <Typography>
                                Sub city
                            </Typography>
                            <Typography fontWeight={'bold'}>
                            {
                                    estimation?.subCity?.descripton
                                }
                            </Typography>
                        </Box>
                      </Grid>
                      <Grid item sm={4}>
                        <Box sx={{display:'flex',alignItems:'center',gap:2}}>
                            <Typography>
                                Wereda
                            </Typography>
                            <Typography fontWeight={'bold'}>
                            {
                                    estimation?.wereda?.descripton
                                }
                            </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Divider/>
                    {
                      estimation?.images?.length>0&&(
                       <>
                       <Typography variant="h6" fontWeight={'bold'}>
                        Images
                       </Typography>
                        <Stack direction={'row'} sx={{overflowX:'auto',cursor:'pointer'}} spacing={1}>
                        {
                          estimation.images?.map((selecteImage:any,index:number)=>(
                            <Box
                        sx={{
                          position:'relative',
                          border:'1px solid black',
                          borderRadius:1,
                          p:.5,
                        }}
                        onClick={()=>{
                          handleActiveImageChange(selecteImage)
                          setOpenLightBox(true)
                        }}
                        >
                          <img src={`http://127.0.0.1:8000/images/${selecteImage}`} width={60} height={40} style={{objectFit:'contain'}}/>
                        </Box>
                          ))
                        }
                        </Stack>
                       </>
                      )
                     }
                     </Box>
                   </Collapse>
                   {
                    expand===estimation?._id&&(
                        <IconButton 
                        sx={{alignSelf:'flex-end'}}
                        onClick={()=>setExpand('')}
                        >
                        <KeyboardArrowUpIcon/>
                    </IconButton>
                    )
                   }
                    </Paper>
                ))
              }
              </>
              )
        }
       
        {
            <Lightbox
            index={activeImaeIndex}
            open={openLightBox}
            close={() => setOpenLightBox(false)}
            slides={
              SampleProduct.productImages?.map((image)=>({src:`http://127.0.0.1:8000/images/${image}`}))
            }
          />
          }
        </>
    )
}