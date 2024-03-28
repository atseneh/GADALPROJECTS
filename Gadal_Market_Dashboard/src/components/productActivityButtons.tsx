import { Button, ButtonOwnProps, Checkbox, Stack, Typography,useTheme} from "@mui/material";
import Box from "@mui/material/Box";
import AddIcon from '@mui/icons-material/Add';
import CampaignIcon from '@mui/icons-material/Campaign';
import ChatIcon from '@mui/icons-material/Chat';
import TuneIcon from '@mui/icons-material/Tune';
import Popover from '@mui/material/Popover';
import * as React from 'react'
import { useLocation, useNavigate, useParams } from "react-router-dom";
import getCategoriesByService from "../api/getCategoryByService";
import { useQuery } from "@tanstack/react-query";
interface ButtonProps {
    selecteCategory:(categoryId:string)=>void;
    selectedCategory:string;
}
export default function ProductActivityButtons(props:ButtonProps){
const {selecteCategory,selectedCategory} = props
const theme = useTheme()
const navigate = useNavigate()
const {pathname} = useLocation()
const {serviceId} = useParams()
const {data:categories,isLoading:categoriesLoding} = useQuery({
    queryKey:['categories',serviceId],
    queryFn:()=>getCategoriesByService(Number(serviceId as string)),
    enabled:Boolean(serviceId)
   })
const [categoryAnchorEl, setCategoryAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleCatgoryClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setCategoryAnchorEl(event.currentTarget);
    };
  
    const handleCategoryClose = () => {
      setCategoryAnchorEl(null);
    };
  
    const openCategory = Boolean(categoryAnchorEl);
    const categoryId = openCategory ? 'category-popover' : undefined;
    return (
    <Box
    sx={{
    display:'flex',
    gap:1,
    alignItems:'center'
    }}
    >
      <Box
      sx={{flexGrow:1,display:'flex',gap:1}}
      >
      <Button
        size="small"
        onClick={()=>{
            navigate(`${pathname}?active=addProduct`)
        }}
        sx={{
            display:'flex',
            alignItems:'center',
            gap:.5,
            color:'white',
            background:theme.palette.primary.main,
            pl:1,pr:3,pb:.8,pt:.8
        }}
        >
        <AddIcon fontSize="small"/>
        <Typography variant="body2" fontWeight={'bold'}>
            Add
        </Typography>
        </Button>
        <Button
        size="small"
        sx={{
            display:'flex',
            alignItems:'center',
            gap:.5,
            color:'white',
            background:'#08B714',
            pl:1,pr:3,pb:.8,pt:.8
        }}
        >
        <CampaignIcon fontSize="small"/>
        <Typography variant="body2" fontWeight={'bold'}>
            Campaign
        </Typography>
        </Button>
        <Button
        size="small"
        sx={{
            display:'flex',
            alignItems:'center',
            gap:.5,
            color:'white',
            background:'#1FB6E2',
            pl:1,pr:3,pb:.8,pt:.8
        }}
        >
        <ChatIcon fontSize="small"/>
        <Typography variant="body2" fontWeight={'bold'}>
            Chat
        </Typography>
        </Button>
        <Button
        onClick={()=>{
            navigate(`${pathname}?active=subAdmin`)
        }}
        size="small"
        sx={{
            display:'flex',
            alignItems:'center',
            gap:.5,
            color:'white',
            background:'#767B7C',
            pl:1,pr:3,pb:.8,pt:.8
        }}
        >
        <img width={18} src="/icons/checkLock.svg"/>
        <Typography variant="body2" fontWeight={'bold'}>
            Create Sub Admin
        </Typography>
        </Button>
        <Button
        size="small"
        sx={{
            display:'flex',
            alignItems:'center',
            gap:.5,
            color:'white',
            background:'#FC646B',
            pl:1,pr:3,pb:.8,pt:.8
        }}
        >
        <img width={18} src="/icons/checkLock.svg"/>
        <Typography variant="body2" fontWeight={'bold'}>
            Archive
        </Typography>
        </Button>
        <Button
        size="small"
        sx={{
            display:'flex',
            alignItems:'center',
            gap:.5,
            color:'white',
            background:theme.palette.primary.main,
            pl:1,pr:3,pb:.8,pt:.8
        }}
        >
        <Typography variant="body2" fontWeight={'bold'}>
            My Ads
        </Typography>
        </Button>
      </Box>
      <Button
       aria-describedby={categoryId} variant="contained" onClick={handleCatgoryClick}
        size="small"
        sx={{
            display:'flex',
            alignItems:'center',
            gap:.5,
            color:'white',
            background:theme.palette.primary.main,
            pl:1,pr:3,pb:.8,pt:.8
        }}
        >
        <TuneIcon fontSize="small"/>
        <Typography variant="body2" fontWeight={'bold'}>
            Category
        </Typography>
        </Button>
        <Popover
        id={categoryId}
        open={openCategory}
        anchorEl={categoryAnchorEl}
        onClose={handleCategoryClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
       {
        categoriesLoding?
        (
            <Typography variant="caption">
                Loading...
            </Typography>
        ):
        (
            <Stack spacing={0} sx={{p:1}}>
            {
               categories.map((category:any)=>(
                   <Box key={category?._id} sx={{display:'flex',alignItems:'center',gap:.5}}>
               <Checkbox
                onChange={(e)=>selecteCategory(selectedCategory === category?._id?'':category?._id)}
                size="small"
                checked={selectedCategory === category?._id}
                />
               <img 
               width={14}
               src={category?.icon}
               />
               <Typography variant="body2">
                {
                    category?.name
                }
               </Typography>
            </Box>
               ))
            }
           </Stack>
        )
       }
      </Popover>
    </Box>
    )
}
