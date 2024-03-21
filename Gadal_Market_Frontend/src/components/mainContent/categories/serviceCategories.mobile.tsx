import {Box,Typography,Stack,Chip} from '@mui/material'
interface mobileServiceCategoryProps {
    serviceName:string;
    activeTransaction?:'rent'|'sale';
    activeService?:'property'|'machinery'|'vehicle'|'others';
    handleTransactionChange?:(t:'rent'|'sale',s:'property'|'machinery'|'vehicle'|'others')=>void
}
export default function MobileServiceCategory(props:mobileServiceCategoryProps){
    const {serviceName,activeTransaction,activeService,handleTransactionChange} = props
    const isRentActive = (serviceName.toLowerCase() === activeService) && (activeTransaction === 'rent') 
    const isSaleActive =  (serviceName.toLowerCase() === activeService) && (activeTransaction === 'sale')
     return(
        <div>
        <Box
        
        sx={{
            display:'flex',alignItems:'center',
            // justifyContent:'space-between',
            gap:1,
            background:'rgb(239 239 239)',
            borderRadius:'32px',
            mt:1,
            mb:1,
            pl:1,
            pr:1,
            
        }}
        >
             <Box>
          <img width={40} src={`/images/${serviceName.toLowerCase()}.svg`}/>
          </Box>
            <Box>
            <Typography sx={{textTransform:'capitalize'}} >
                {serviceName}
            </Typography>
            </Box>
            
                <Stack direction={'row'} spacing={1}>
                <Chip
                   sx={{p:1,color:isRentActive?'white':'',fontWeight:'bold'}}
                   color={isRentActive?'primary':'default'} label="Rent" 
                   onClick={()=>{
                    handleTransactionChange!('rent',serviceName.toLowerCase() as 'property'|'machinery'|'vehicle'|'others' )
                   }}
                   />
                  <Chip 
                   sx={{p:1,color:isSaleActive?'white':'',fontWeight:'bold'}}
                   color={isSaleActive?'primary':'default'} label="Sale"
                   onClick={()=>{
                    handleTransactionChange!('sale',serviceName.toLowerCase() as 'property'|'machinery'|'vehicle'|'others')
                }}
                   />
                </Stack>
                </Box>
        
        </div>
    )
}