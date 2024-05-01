import {Card,Stack,Typography,Box,useTheme,IconButton} from '@mui/material'
import '../../../index.css'
import { useEffect, useRef, useState } from 'react'
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useQuery } from '@tanstack/react-query';
import getFetauredProducts from '../../../api/products/getfeaturedProducts';
import { IMAGE_URL } from '../../../api/apiConfig';
import { NavLink } from 'react-router-dom';
interface featuredRentProps {
    serviceName:string,
    serviceType:number
}
export default function RentFeatured(props:featuredRentProps){
    const {serviceName,serviceType} = props
    const {data:featuredProducts,isLoading} = useQuery({
      queryKey:['get_featured_products',serviceType],
      queryFn:()=>getFetauredProducts(serviceType,1)
    })
    const theme = useTheme()
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true); // Initially assume there's always space to scroll right
    const handleScrollRight = () => {
        if(containerRef.current){
            const container = containerRef.current;
            const scrollAmount = container.offsetWidth / 2; // Scroll by half of the container width
            container.scrollTo({
              left: container.scrollLeft + scrollAmount,
              behavior: 'smooth',
            });
        }
      };
      const handleScrollLeft = () => {
        if(containerRef.current){
            const container = containerRef.current;
            const scrollAmount = container.offsetWidth / 2; // Scroll by half of the container width
            container.scrollTo({
              left: container.scrollLeft - scrollAmount,
              behavior: 'smooth',
            });
        }
      };
useEffect(()=>{
    if(containerRef.current){
        const container = containerRef.current;
        const handleScroll = () => {
          // Check if there's room to scroll to the left
          setCanScrollLeft(container.scrollLeft > 0);
          // Check if there's room to scroll to the right
          setCanScrollRight(container.scrollLeft < (container.scrollWidth - container.clientWidth));
        };
    
        // Add event listener for scroll events
        container.addEventListener('scroll', handleScroll);
    
        // Cleanup
        return () => {
          container.removeEventListener('scroll', handleScroll);
        };
    }
},[])
    return (
      <>
        {
          isLoading ? (
            <Typography
            variant='body2'
            >
              Loading...
            </Typography>
          ):
          (
            <>
            {
              Array.isArray(featuredProducts?.products) && featuredProducts?.products?.length>0 && (
                <Box 
                sx={{overflow:'auto'}}
                >
                <Typography fontWeight={'bold'} variant='h6' color={theme.palette.primary.main}>
                 {serviceName}
                </Typography>
                  <Box
                  sx={{
                    display:'flex',
                    gap:2,
                    alignItems:'center'
                  }}
                  >
                <IconButton
                // size='large'
                 disabled={!canScrollLeft}
                 onClick={handleScrollLeft}
                 >
                   <ChevronLeftIcon
                   fontSize='large'
                   />
                    </IconButton>
                  <Box 
                 className="hideScrollBar"
                 ref={containerRef}
                 sx={{overflow:'auto',display:'flex',gap:2}}>
                 {
                  featuredProducts?.products?.map((featuredProduct:any)=>(
                        <Box key={featuredProduct?._id}>
                        <FeaturedCard 
                        data={featuredProduct}
                        />
                        </Box>
                    ))
                 }
                 </Box>
                 <IconButton
                 disabled={!canScrollRight}
                 onClick={handleScrollRight}
                 >
                    <ChevronRightIcon
                    fontSize='large'
                    />
                    </IconButton>
                  </Box>
                </Box>
              )
            }
            </>
          )
        }  
      </>
    )
}
interface cardProps {
  data:any
}
function FeaturedCard(props:cardProps){
  const {data} = props
    return (
       <NavLink
       to={`/products/${data?._id}`}
       style={({isTransitioning }) => {
           return {
             color:'black',
             textDecoration:'none',
             viewTransitionName: isTransitioning ? "slide" : "",
           };
         }}
       >
         <Card
        sx={{
          mt:.7,
          // pl:1,
          // pr:1,
          position:'relative'
        }}
        >
         <Stack spacing={1}>
         <Box>
                <Box
                 sx={{
                    width:250,
                    height:200,
                    //  borderRadius:'8px',
                     background:`url(${IMAGE_URL}/${data?.productImages?.at(0)})`,
                     backgroundSize:'contain',                   
                     backgroundRepeat:'no-repeat',
                     backgroundPosition: 'center center',
                    //  mt:2
                    }}
                >
                  
                </Box>
                    <Stack
                    direction={'row'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    sx={{
                      p:.5
                    }}
                    >
                    <Typography
                    sx={{
                      maxWidth:110,
                      textTransform:'capitalize'
                    }}
                    variant='caption'
                    >
                      {
                        data?.title
                      }
                    </Typography>
                    <Box sx={{display:'flex',gap:0.5}}>
                 <Typography>
                  {
                    new Intl.NumberFormat('en-Us',{maximumFractionDigits:3}).format(data?.currentPrice)
                  }
                 </Typography>
                 <small>birr</small>
                </Box>
                    </Stack>
                </Box>
         </Stack>
                    <Box
                        style={{
                            position:'absolute',
                            left:0,
                            top:0,
                            background:'rgb(5 184 21)',
                            color:'white',
                            // borderBottomRightRadius:'20px',
                            paddingLeft:8,
                            paddingRight:10,
                            paddingTop:1,
                            paddingBottom:1,
                            // borderTopLeftRadius:'20px',
                        }}
                        >
                        
                            <Typography sx={{fontWeight:'bold'}}>
                           Promoted
                        </Typography>
                         
                        
                        </Box>
        </Card>
       </NavLink>
    )
}