import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Collapse from '@mui/material/Collapse';
import Checkbox from '@mui/material/Checkbox';
import { useState} from "react";
import { useSearchParams,useNavigate} from "react-router-dom";
export default function AttributeFilter(props:{attribute:any}){
  const {attribute} = props 
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate()
  const params = new URLSearchParams(searchParams.toString());
  const addSearchParam = (attribute:any) => {
    params.set(attribute.key, attribute.value);
    setSearchParams(params);
  };
  const handleAttributeFilterSelection = (name:string,value:string)=>{
    if(params.get(name) === String(value)) {
        searchParams.delete(name)
        navigate(`?${searchParams.toString()}`);
        return
    }
    addSearchParam({key:name,value:value})
}
    const [expandFilter,setExpandFileter] = useState(true)
    const handleExpand = ()=>{
        setExpandFileter(!expandFilter)
    }
    return (
        <>
         {
            (Array.isArray(attribute?.values)||attribute?.values?.length>0)&&(
             <>
              <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'#D9D9D9',pr:.5,pl:1.5}} >
        <Typography variant="body1" fontWeight={'bold'}>
                {attribute?.name}
            </Typography>
            <IconButton
             size="small"
             onClick={handleExpand}
             >
                <ArrowDropDownIcon fontSize="small" />
            </IconButton>
        </Box>
                <Collapse in={expandFilter}>
                <Stack>
             {
                attribute?.values?.map((value:any)=>(
                 <Box key={value}
                  sx={{display:'flex',alignItems:'center',cursor:'pointer'}}
                  onClick = {()=>{
                    handleAttributeFilterSelection(`attr_${attribute?.name}`,value)
                  }}
                  >
                    <Checkbox
                        // disabled
                        sx={{
                            '&disabled':{
                                color:'red'
                            }
                        }}
                        checked={params.get(`attr_${attribute.name}`) === String(value)}
                        size="small"/>
                    <Typography variant="body2">
                        {value}
                    </Typography>
                 </Box>
                ))
             }
        </Stack>
        {/* <Box sx={{display:'flex',alignItems:'center',mt:1}}>
            <Box sx={{flexGrow:1,display:'flex',alignItems:'center',gap:1}}>
            <TextField
            value={customMinPrice}
            onChange={(e)=>setCustomMinPrice(e.target.value)}
             size="small" label="Min"
             variant="outlined" name="minPrice"
             type="number"
              />
             <HorizontalRuleIcon fontSize="small" sx={{fontSize:'0.8rem'}}/>
             <TextField 
             value={customMaxPrice}
             onChange={(e)=>setCustomMaxPrice(e.target.value)}
             size="small" label="Max" 
             variant="outlined" name="maxPrice"
             type="number"
             />
            </Box>
             <IconButton 
             onClick={()=>{
                if(customMaxPrice && customMinPrice){
                    handlePriceRangeSelection(customMinPrice,customMaxPrice)
                }
             }}
             >
                <KeyboardArrowRightIcon/>
             </IconButton>
        </Box> */}
                </Collapse>
             </>
            )
         }
        </>
    )
}