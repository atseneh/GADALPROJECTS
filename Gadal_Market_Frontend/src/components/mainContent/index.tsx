import {Grid,Box,Button, Typography} from '@mui/material'
import useSmallScreen from '../../utils/hooks/useSmallScreen'
import MainBanner from '../siteBanners/mainBanner'
import RentFeatured from './featuredProducts/rentFeatured'
import SaleFeatured from './featuredProducts/saleFeatured'
import ProductCard from '../products/productCard'
import ServiceCategory from './categories/serviceCategories.desktop'
import MobileServiceCategory from './categories/serviceCategories.mobile'
import '../../index.css'
import { useState } from 'react'
import EstimationButton from '../common/estimationButotn'
import { useQuery } from '@tanstack/react-query'
import getProducts from '../../api/products/getProducts'
import CardSkeleton from '../products/cardSkeleton'
import Enums from '../../utils/constants/serviceEnums'
import capitalizeFirstLetter from '../../utils/helpers/capitalizeFirstLetter'
import PhoneIcon from '@mui/icons-material/Phone';
import Fab from '@mui/material/Fab';
import { useNavigate } from 'react-router-dom'
export default function MainContent(){
    const hotline = '9830'
    const smallScreen = useSmallScreen()
    const fabStyle = {
        position: 'fixed',
        bottom: smallScreen ? 120:20,
        right: smallScreen ? 10 :100,
        '&:hover':{
            background:'orange'
        }
      };
    const navigate = useNavigate();
    const [activeService,setActiveService] = useState<
    'property'|'machinery'|'vehicle'|'others'|null
    >(null)
    const {transactionTypeEnums,ServiceEnums} = Enums
    const [activeTransactionType,setActiveTransactionType] = useState<'rent'|'sale'|null>(null)
    const handleTransactionChange = (transactionType:typeof activeTransactionType,service:typeof activeService) => {
      setActiveService(service);
      setActiveTransactionType(transactionType)
    };
    const {data:newProducts,isLoading:productsLoading} = useQuery({
     queryKey:['newProducts',activeTransactionType,activeService],
     queryFn:()=>getProducts({
        transactionType:activeTransactionType?transactionTypeEnums[activeTransactionType]:undefined,
        productType:activeService ? ServiceEnums[capitalizeFirstLetter(activeService)] : undefined,
        pageNumber:1,
        pageSize:12,
     })
    })
    const handleCallClick = () => {
        window.location.href = `tel:${hotline}`;
      };
    return (
        <Box
        sx={{
            position:'relative'
        }}
        >
        <Fab 
            color="primary" 
            aria-label="call"
            sx={fabStyle}
            onClick={handleCallClick}
            >
        <PhoneIcon
        sx={{
            color:'white'
        }}
        />
      </Fab>
                <Grid container spacing={2} sx={{mt:smallScreen?0:1,ml:smallScreen?0:'1px'}}>
                {
                    !smallScreen&&(
                        <Grid item xs={12} sm={smallScreen?0:2} gap={1}>
                
                        <>
                        <ServiceCategory
                        isLink
                        serviceName='Property'
                        activeTransaction={activeTransactionType}
                        activeService={activeService}
                        handleTransactionChange={handleTransactionChange}
                        />
                         <ServiceCategory
                         isLink
                        serviceName='Machinery'
                        activeTransaction={activeTransactionType}
                        activeService={activeService}
                        handleTransactionChange={handleTransactionChange}
                        />
                         <ServiceCategory
                         isLink
                        serviceName='Vehicle'
                        activeTransaction={activeTransactionType}
                        activeService={activeService}
                        handleTransactionChange={handleTransactionChange}
                        />
                         <ServiceCategory
                         isLink
                        serviceName='Constructions'
                        activeTransaction={activeTransactionType}
                        activeService={activeService}
                        handleTransactionChange={handleTransactionChange}
                        />
                            <EstimationButton/>
                        </>
                    
                 
                </Grid>
                    )
                }
                <Grid item xs={12} sm={smallScreen?12:10}>
                   <>
                   <MainBanner/>
                   {
                    smallScreen&&(
                        <div 
                        className='hideScrollBar'
                        style={{
                                display:'flex',alignItems:'center',
                                overflow:'auto',
                                gap:'8px',
                                marginRight:'18px'
                                }}>
                                <MobileServiceCategory
                                 serviceName='Property'
                                 activeTransaction={activeTransactionType}
                                 activeService={activeService}
                                 handleTransactionChange={handleTransactionChange}
                                />
                                <MobileServiceCategory
                                 serviceName='Machinery'
                                 activeTransaction={activeTransactionType}
                                 activeService={activeService}
                                 handleTransactionChange={handleTransactionChange}
                                />
                                <MobileServiceCategory
                                serviceName='Vehicle'
                                activeTransaction={activeTransactionType}
                                activeService={activeService}
                                handleTransactionChange={handleTransactionChange}
                                />
                                <MobileServiceCategory
                                serviceName='Constructions'
                                activeTransaction={activeTransactionType}
                                activeService={activeService}
                                handleTransactionChange={handleTransactionChange}
                                />
                            </div>
                    )
                   }
                   <Box sx={{ml:smallScreen?0:2,mr:smallScreen?0:2,display:'flex',flexDirection:'column',gap:1}}>
                   <Box sx={{background:'rgb(244 243 241)',p:2,display:'flex',flexDirection:smallScreen?'row':'column',gap:1}}>
                       <Box sx={{overflow:'auto'}}>
                       
                        <RentFeatured 
                        serviceName='Property'
                        serviceType={2}
                        />
                           
                        <RentFeatured 
                        serviceName='Vehicle'
                        serviceType={3}
                        />
                        <RentFeatured 
                        serviceName='Machinery'
                        serviceType={1}
                        />
                        <Box className="hideScrollBar" sx={{display:'flex',alignItems:'center',gap:3,overflow:'auto',mt:1}}>
                             <SaleFeatured 
                             serviceName='Property'
                             serviceType={2}
                             />
                             <SaleFeatured 
                             serviceName='Vehicle'
                             serviceType={3}
                             />
                             <SaleFeatured 
                             serviceName='Machinery'
                             serviceType={1}
                             />
                        </Box>
                       </Box>
                       
                    </Box>
                    <Typography variant='h6'>
                        New Items
                    </Typography>
                    <Box sx={{mr:3,}}>
                         <Grid container spacing={2}>
                        {
                         productsLoading?
                           (
                            <>
                            {
                           [1,2,3,4].map((item)=>(
                            <Grid item xs={12} sm={3} key={item}>
                            <CardSkeleton key={item}/>
                            </Grid>
                            
                           ))
                            }
                            </>
                           ):

                           (
                            <>
                            {
                                 newProducts?.products?.map((product:any)=>(
                                    <Grid item xs={12} sm={3} key={product?._id}>
                                    <ProductCard data={product}/>
                                   </Grid>
                                ))
                            }
                            {/* <Pagination sx={{mt:4}}/> */}
                            </>
                           )
                        }
                    </Grid>
                     {
                        newProducts?.products?.length>0&&(
                            <Box 
                            sx={{
                                display:'flex',
                                justifyContent:'center',
                                m:3,
                                }}
                                >
                            <Button 
                                variant='contained' 
                                sx={{
                                    height:30,
                                    pt:2,
                                    pb:2,
                                    pl:4,
                                    pr:4,
                                    borderRadius:'16px',
                                    color:'white',
                                    fontSize:'.8rem'
                                    }}
                                    onClick={()=>{navigate('/allItems')}}
                                    >
                                See More Items
                            </Button>
                          </Box>
                        )
                     }
                    </Box>
                   </Box>
                   
                   </>
                </Grid>
            </Grid>
         
        </Box>
    )
}