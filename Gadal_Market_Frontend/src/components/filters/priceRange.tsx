import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Collapse from '@mui/material/Collapse';
import Checkbox from '@mui/material/Checkbox';
import { useState} from "react";
import TextField from '@mui/material/TextField';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import formatNumbers from "../../utils/helpers/formatNumbers";
import { useSearchParams,useNavigate} from "react-router-dom";
export default function PriceRange(props:{range:any}){
  const {range} = props 
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate()
  const params = new URLSearchParams(searchParams.toString());
  const [customMinPrice,setCustomMinPrice] = useState('')
  const [customMaxPrice,setCustomMaxPrice] = useState('')
  const addSearchParam = (min:any,max:any) => {
    params.set(min.key, min.value);
    params.set(max.key, max.value);
    setSearchParams(params);
  };
    const [expandFilter,setExpandFileter] = useState(true)
    const handleExpand = ()=>{
        setExpandFileter(!expandFilter)
    }
    const handlePriceRangeSelection = (min:string,max:string)=>{
        if(params.get('minPrice') === String(min) && params.get('maxPrice')=== String(max)) {
            searchParams.delete('minPrice')
            searchParams.delete('maxPrice')
            navigate(`?${searchParams.toString()}`);
            return;
        }
        addSearchParam({key:'minPrice',value:min},{key:'maxPrice',value:max})
    }

    return (
        <>
         {
            (Array.isArray(range)||range?.length>0)&&(
             <>
              <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'#D9D9D9',pr:.5,pl:1.5}} >
        <Typography variant="body1" fontWeight={'bold'}>
                Price
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
                range?.map((range:any)=>(
                 <Box key={range?.min}
                  sx={{display:'flex',alignItems:'center',cursor:'pointer'}}
                  onClick = {()=>{
                    handlePriceRangeSelection(range?.min,range?.max)
                  }}
                  >
                    <Checkbox
                        // disabled
                        sx={{
                            '&disabled':{
                                color:'red'
                            }
                        }}
                        checked={Number(params.get('minPrice')) === range?.min && Number(params.get('maxPrice')) === range?.max}
                        size="small"/>
                    <Typography variant="body2">
                        {
                         `
                         ${formatNumbers(range?.min)} - ${formatNumbers(range?.max)}
                         `
                        }
                    </Typography>
                 </Box>
                ))
             }
        </Stack>
        <Box sx={{display:'flex',alignItems:'center',mt:1}}>
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
        </Box>
                </Collapse>
             </>
            )
         }
        </>
    )
}