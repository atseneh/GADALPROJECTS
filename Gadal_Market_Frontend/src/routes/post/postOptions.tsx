import { Button, Card, CardContent, Divider, Grid, Stack, Typography,IconButton, Skeleton } from '@mui/material'
import Box from '@mui/material/Box'
import CheckIcon from '@mui/icons-material/Check';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import getPostTypeDefinitions from '../../api/postTypes/getPostTypeDefinitions';

interface PostOptionProps {
 handleClose:()=>void,
 handleProductPost:(postType:number)=>void,
 postLoading:boolean,
 selected:number
}
export default function PostOptions(props:PostOptionProps){
    const {handleClose,handleProductPost,postLoading,selected} = props
    const {data:postTypeDefinitions,isLoading} = useQuery({
        queryKey:['postTypeDefinition'],
        queryFn:getPostTypeDefinitions
    })
    return (
        <>
        <Box sx={{mt:2,ml:4}}>
            <Button
            onClick={handleClose}
            variant='text' sx={{display:'flex',alignItems:'center',gap:1}}>
            <KeyboardBackspaceIcon color='primary'/>
            <Typography>
                Back
            </Typography>
            </Button>
        </Box>
        <Box
        sx={{display:'flex',flexDirection:'column',ml:'8%',mr:'8%',mt:3}}
        >
            <Box
        sx={{display:'flex',flexDirection:'column',alignSelf:'center',mb:3}}
        >
        <Typography variant='h4' fontWeight={'bold'} sx={{alignSelf:'center'}}>
            Post Options
        </Typography>
        <Typography fontWeight={'bold'}>
            Choose an Option that Works for you!
        </Typography>
        </Box>
        <Grid container spacing={2}>
            {
              isLoading?
              (
                <>
                {
                    [1,2,3].map((item)=>(
                        <Grid
                        item 
                        xs={12}
                        sm={6}
                        md={4}
                        key={item}
                        >
                            <Skeleton
                             variant='rectangular'
                             animation='wave'
                             width={300}
                             height={300}
                            />
                        </Grid>
                    ))
                }
                </>
              ):
              (
                postTypeDefinitions?.map((postTypeDef:any)=>(
                    <Grid
                     item 
                     xs={12}
                     sm={6}
                     md={4}
                     key={postTypeDef.description}
                     >
                        <PostCard
                        postType = {postTypeDef}
                        />
                    </Grid>
                ))
              )
            }
           
        </Grid>
        </Box>
        </>
    )
}
interface PostCardProps {
 postType:any
}
function PostCard(props:PostCardProps){
    const {postType} = props
    const theme = useTheme()
    const navigate = useNavigate()
 return (
    <Card
    sx={{
        borderRadius:'8px',
        // mt:active?0:3,
        // background:active?theme.palette.primary.main:''
    }}
    >
        <CardContent>
            <Box
            sx={{
                display:'flex',
                flexDirection:'column',
                gap:1,
                height:300,
                position:'relative',
                // pt:active?4:1,
                // pb:active?3:1,
            }}
            >
             <Stack
             spacing={.5}
             sx={{
                alignSelf:'center',
             }}
             >
             <Typography
              variant='h6'
              style={{
                fontWeight:'bold',
                color:'#2E87CC'
                }}>
                
                {
                    postType?.name
                }
            </Typography>
            
            <Typography 
            sx={{
            fontWeight:'bold'
            }}
            variant='h6'
            >
                   ETB {postType?.price}
            </Typography>
             </Stack>
            <Divider/>
            <Stack spacing={1} sx={{mt:1}}>
            <Box sx={{display:'flex',gap:1}}>
                <Typography fontWeight={'bold'}>
                    <CheckIcon fontSize='inherit'/>
                </Typography>
                <Typography 
                variant='body2'
                fontWeight={'bold'}
                >
                List your add on gadal market for {postType?.no_day_on_Gadal} days
            </Typography>
                </Box>
                <Box sx={{display:'flex',gap:1}}>
                <Typography fontWeight={'bold'}>
                    <CheckIcon fontSize='inherit'/>
                </Typography>
                <Typography 
                variant='body2'
                fontWeight={'bold'}
                >
                List on top of its category page for {postType?.no_day_onTop_cat} days
            </Typography>
                </Box>
                <Box sx={{display:'flex',gap:1}}>
                <Typography fontWeight={'bold'}>
                    <CheckIcon fontSize='inherit'/>
                </Typography>
                <Typography 
                variant='body2'
                fontWeight={'bold'}
                >
                List on top of gadal market home page for {postType?.no_day_onTop_home} days
            </Typography>
                </Box>
            </Stack>
             <Button
                type="submit"
                 onClick={
                    // ()=>handlePost(enumCode)
                    ()=>{
                        navigate(`/payment?paymentType=post&typeId=${postType?._id}`)
                    }
                }
                 fullWidth 
                 sx={{
                    position:'absolute',
                    bottom:1,
                    // color:active?theme.palette.primary.main:'white',
                    borderRadius:'4px',
                    p:1,
                    mt:2,
                    // background:!active?theme.palette.primary.main:'white'
                }}
                 variant="contained"
                 >
                    <Typography variant='body2' fontWeight={'bold'}>
                        {/* {
                         (postLoading&&selected===enumCode)?'Posting...':'Continue'   
                        } */}
                        Continue
                    </Typography>
                        </Button>
            </Box>
        </CardContent>
    </Card>
    )
}