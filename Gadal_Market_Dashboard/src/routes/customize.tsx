import { Paper,Box,Typography,Stack,useTheme, InputBase, Button,Grid, FormControlLabel, Checkbox, Chip } from "@mui/material";
import Enums from '../utils/constants/serviceEnums'
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getCategoriesByService from "../api/getCategoryByService";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import getCategoryAttributes from "../api/getCategoryAttributes";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import getLocations from "../api/getLocations";
import getSubcities from "../api/getSubCity";
import getWeredas from "../api/getWereda";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import createAttributes from "../api/createAttributeForCategory";
import addAttributeValue from "../api/addAttributeValue";
export default function Customize(){
    const {ServiceEnums} = Enums
    const services =  Object.entries(ServiceEnums).map(([key, value]) => ({ name: key, value: value }));
    const [selectedService,setSelectedService] = useState<number|'location'>(2)
    const [selectedSubCategory,setSelectedSubCategory] = useState('')
    const [location,setLocation] = useState('')
    const [subCity,setSubCity] = useState('')
    const [description,setDescription] = useState('')
    const [newAttributeValue,setNewAttributeValue]  = useState<{[key:string]:string}>()
    const handleNewAttributeValueChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
        const {name,value} = e.target
        setNewAttributeValue({
            ...newAttributeValue,
            [name]:value
        })
    }
    const theme = useTheme()
    const queryClient = useQueryClient();
    const {data:categories,isLoading:categoriesLoding} = useQuery({
        queryKey:['categoriesByService',selectedService],
        queryFn:()=>getCategoriesByService(selectedService as number),
        enabled:selectedService !== 'location'
       })
       const {data:categoryAttributes,isLoading:attributesLading} = useQuery({
        queryKey:['categoryAttributes',selectedSubCategory],
        queryFn:()=>getCategoryAttributes(selectedSubCategory),
        enabled:Boolean(selectedSubCategory)
       })
       const {data:locations,isLoading:locationsLoading} = useQuery({
        queryKey:['locations'],
        queryFn:getLocations
       })
       const {data:subCities,isLoading:subCitiesLoading} = useQuery({
        queryKey:['subCities',location],
        queryFn:()=>getSubcities(location),
        enabled:Boolean(location)
       })
       const {data:weredas,isLoading:weredasLoading} = useQuery({
        queryKey:['weredas',subCity],
        queryFn:()=>getWeredas(subCity),
        enabled:Boolean(subCity)
       })
       const [open, setOpen] = useState(false);
       const [isInsertion,setIsInsertion] = useState(false)
       const handleIsInsertion = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setIsInsertion(e.target.checked)
        if(e.target.checked === true){
            setAttributeValues([])
        }
       }
       const handleClickOpen = () => {
         setOpen(true);
       };
     
       const handleClose = () => {
         setOpen(false);
       };
       const [attributeValues, setAttributeValues] = useState<string[]>([]);
       const [inputValue, setInputValue] = useState('');
     
       const handleInputChange = (event:any) => {
         setInputValue(event.target.value);
       };
       const handleInputKeyDown = (event:any) => {
        if (event.key === 'Enter' && inputValue.trim() !== '') {
          setAttributeValues([...attributeValues, inputValue.trim()]);
          setInputValue('');
        }
      };
      const {mutate:saveAttribute,isPending:savePending} = useMutation({
        mutationFn:createAttributes,
        mutationKey:['create_attributes'],
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:['categoryAttributes']})
            setDescription('')
            setAttributeValues([])
            setIsInsertion(false)
            handleClose();
        }
      })
      const {mutate:addAttribute,isPending:addPending} = useMutation({
        mutationFn:addAttributeValue,
        mutationKey:['add_attribute_value'],
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:['categoryAttributes']})
            setNewAttributeValue(
                categoryAttributes?.filter((ca:any)=>!ca?.isInsertion)?.reduce((acc:any,cv:any)=>({
                    ...acc,
                    [cv?._id]:''
                     }),{})
            )
        }
      })
      const handleAttributeSave = ()=>{
        const payload = {
            name:description,
            isInsertion,
            values:attributeValues,
            category:selectedSubCategory
        }
        if(!description){
            return;
        }
        saveAttribute(payload)
      }
const handleAddAttributeValue = (id:string)=>{
    if(!newAttributeValue){
        return;
    }
    const payload = {
        id,
        value:newAttributeValue[id]
    }
    addAttribute(payload)
}
useEffect(()=>{
if(Array.isArray(categoryAttributes)&&categoryAttributes?.length>0){
    const value = categoryAttributes?.filter((ca:any)=>!ca?.isInsertion)?.reduce((acc,cv)=>({
        ...acc,
        [cv?._id]:''
         }),{})
setNewAttributeValue(value)
}
},[categoryAttributes])   

return (
        <Stack spacing={1}>
         <Paper
    sx={{
        p:1.5,
        borderRadius:'8px'
    }}
    >
        <Stack
        direction={'row'}
        spacing={2}
        alignItems={'center'}
        >
        { 
         services.map((service)=>(
                        <Box 
                        sx={{
                          display:'flex',
                          flexDirection:'row',
                          alignItems:'center',
                          gap:1,
                          cursor:'pointer',
                          background:selectedService === service?.value ? theme.palette.primary.main:'',
                          border:selectedService === service.value?'1px solid #FFAA00':'',
                          p:1,
                          color:selectedService === service.value ? 'white':'',
                          borderRadius:'10px',
                        }}
                        onClick={()=>setSelectedService(service?.value)}
                        >
                          <img width={24} height={20} src={`/icons/${service?.name.toLowerCase()}.svg`}/>
                          <Typography fontWeight={'bold'}>
                            {service.name}
                          </Typography>
                        </Box>
                    ))
                   }
             <Box 
                        sx={{
                          display:'flex',
                          flexDirection:'row',
                          alignItems:'center',
                          gap:1,
                          cursor:'pointer',
                          background:selectedService === 'location' ? theme.palette.primary.main:'',
                          border:selectedService === 'location'?'1px solid #FFAA00':'',
                          p:1,
                          color:selectedService === 'location' ? 'white':'',
                          borderRadius:'10px',
                        }}
                        onClick={()=>setSelectedService('location')}
                        >
                          <LocationOnOutlinedIcon/>
                          <Typography fontWeight={'bold'}>
                            Location
                          </Typography>
                        </Box>
        </Stack>
    </Paper>
    <Paper
     sx={{
        p:2,
        borderRadius:'8px'
     }}
    >
    {
        selectedService === 'location'?
        (
            <Grid
            container
            columnSpacing={2}
            >
            <Grid item xs={12} sm={4}>
            <Stack
            spacing={.5}
            >
            <Typography variant="h6" fontWeight={'bold'}>
                Location
            </Typography>
             {
                locationsLoading?
                (
                    <Typography variant="caption">
                        Loading...
                    </Typography>
                ):
                (
                    <Box
                    sx={{
                       display:'flex',
                       flexDirection:'column',
                       gap:2,
                       border:"1px solid #535252",
                       p:2,
                       borderRadius:'8px'
                    }}
                    >
                    {
                       locations?.map((loc:any)=>(
                          
                           <Box
                           sx={{
                            cursor:'pointer',
                            p:location === loc?._id?1:0,
                            background:location === loc?._id?theme.palette.primary.main:'',
                            color:location === loc?._id?'white':'',
                            '&:hover':{
                                p:1,
                                background:theme.palette.primary.main,
                                color:'white'
                            }
                            
                        }}
                        onClick={()=>setLocation(loc?._id)}
                           >
                             <Typography fontWeight={'bold'} >
                               {
                                   loc?.descripton
                               }
                           </Typography>
                           </Box>
                          
                           
                         
                       ))
                    }
                    <Stack
                    spacing={1}
                    >
                    <InputBase
                       sx={{ ml: 1, flex: 1,background:'#EFEFEF',alignSelf:'center',}}
                       placeholder="Type location"
                       
                     />
                     
                       <Button
                       sx={{
                           height:25,width:30,color:'white',alignSelf:'center'
                       }}
                       size="small"
                       variant="contained"
                       >
                           Add
                       </Button>
                    </Stack>
                    </Box>
                )
             }
            </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
            <Stack
            spacing={.5}
            >
            <Typography variant="h6" fontWeight={'bold'}>
                Sub City
            </Typography>
              {
                subCitiesLoading ? (
                    <Typography variant="caption">
                        Loading...
                    </Typography>
                ):
                (
                    <Box
                    sx={{
                       display:'flex',
                       flexDirection:'column',
                       gap:2,
                       border:"1px solid #535252",
                       p:2,
                       borderRadius:'8px'
                    }}
                    >
                    {
                       subCities?.map((sub:any)=>(
                          
                           <Box
                           sx={{
                            cursor:'pointer',
                            p:subCity === sub?._id?1:0,
                            background:subCity === sub?._id?theme.palette.primary.main:'',
                            color:subCity === sub?._id?'white':'',
                            '&:hover':{
                                p:1,
                                background:theme.palette.primary.main,
                                color:'white'
                            }
                            
                        }}
                        onClick={()=>setSubCity(sub?._id)}
                           >
                             <Typography fontWeight={'bold'} >
                               {
                                   sub?.descripton
                               }
                           </Typography>
                           </Box>
                          
                           
                         
                       ))
                    }
                    <Stack
                    spacing={1}
                    >
                    <InputBase
                       sx={{ ml: 1, flex: 1,background:'#EFEFEF',alignSelf:'center',}}
                       placeholder="Type Sub city"
                       
                     />
                     
                       <Button
                       sx={{
                           height:25,width:30,color:'white',alignSelf:'center'
                       }}
                       size="small"
                       variant="contained"
                       >
                           Add
                       </Button>
                    </Stack>
                    </Box>
                )
              }
            </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
            <Stack
            spacing={.5}
            >
            <Typography variant="h6" fontWeight={'bold'}>
                Wereda
            </Typography>
            {
                weredasLoading ? (
                    <Typography variant="caption">
                        Loading...
                    </Typography>
                ):
                (
                    <Box
                    sx={{
                       display:'flex',
                       flexDirection:'column',
                       gap:2,
                       border:"1px solid #535252",
                       p:2,
                       borderRadius:'8px'
                    }}
                    >
                    {
                       weredas?.map((wereda:any)=>(
                          
                         
                             <Typography fontWeight={'bold'} >
                               {
                                   wereda?.descripton
                               }
                           </Typography>
                          
                           
                         
                       ))
                    }
                    <Stack
                    spacing={1}
                    >
                    <InputBase
                       sx={{ ml: 1, flex: 1,background:'#EFEFEF',alignSelf:'center',}}
                       placeholder="Type Wereda"
                       
                     />
                     
                       <Button
                       sx={{
                           height:25,width:30,color:'white',alignSelf:'center'
                       }}
                       size="small"
                       variant="contained"
                       >
                           Add
                       </Button>
                    </Stack>
                    </Box>
                )
              }
            </Stack>
            </Grid>
            </Grid>
        ):
        (
            <Box
     sx={{
        display:'flex',
        gap:4,
        alignItems:'flex-start'
     }}
     >
    <Stack spacing={.5}>
     <Typography variant="h6" fontWeight={'bold'}>
        Sub Categories
     </Typography>
     {
        categoriesLoding?(
            <Typography variant="caption">
                Loading...
            </Typography>
            ):
            (
                <Box
                sx={{
                   display:'flex',
                   flexDirection:'column',
                   gap:2,
                   border:"1px solid #535252",
                   p:2,
                   borderRadius:'8px'
                }}
                >
                {
                   categories?.map((category:any)=>(
                       <Stack
                       sx={{
                           cursor:'pointer',
                           p:selectedSubCategory === category?._id?1:0,
                           background:selectedSubCategory === category?._id?theme.palette.primary.main:'',
                           color:selectedSubCategory === category?._id?'white':'',
                           '&:hover':{
                               p:1,
                               background:theme.palette.primary.main,
                               color:'white'
                           }
                           
                       }}
                       onClick={()=>setSelectedSubCategory(category?._id)}
                       spacing={1.5} direction={'row'} alignItems={'center'}>
                       <img width={25} src={category?.icon}/>
                       <Typography fontWeight={'bold'} >
                           {
                               category?.name
                           }
                       </Typography>
                       </Stack>
                     
                   ))
                }
                <Stack
                spacing={1}
                >
                <InputBase
                   sx={{ ml: 1, flex: 1,background:'#EFEFEF',alignSelf:'center',}}
                   placeholder="Type Sub Category"
                   
                 />
                 <Stack direction={'row'} spacing={.5} alignItems={'center'}>
                   <Button
                   size="small"
                   sx={{
                       display:'flex',gap:.5,alignItems:'center',color:'black',border:'1px solid black',height:25,
                   }}
                   >
                   <Typography variant="body2">
                   Icon
                   </Typography>
                   <AddCircleOutlineOutlinedIcon color="inherit" fontSize="small"/>
                   </Button>
                   <Button
                   sx={{
                       height:25,width:30,color:'white'
                   }}
                   size="small"
                   variant="contained"
                   >
                       Add
                   </Button>
                 </Stack>
                </Stack>
                </Box>
            )
     }
    </Stack>
     {
        <>
        {
        attributesLading ? (
            <Typography variant="caption">
            Loading ...
        </Typography>
        ):
        (
        <Stack
        spacing={1}
        alignItems={'flex-start'}
        >
            <Button
            disabled={!selectedSubCategory}
            onClick={handleClickOpen}
            variant="contained"
            >Add</Button>
            <Grid
         container
         columnSpacing={2}
         >
            <>
            {
                categoryAttributes?.filter((attr:any)=>!attr?.isInsertion)?.map((attribute:any)=>(
                    <Grid item xs={12} sm={6}>
                          <Box
         sx={{
            display:'flex',
            gap:1,
         }}
         >
        <Stack spacing={.5}>
         <Typography variant="h6" fontWeight={'bold'}>
            {attribute?.name}
         </Typography>
         
           
                    <Box
                    sx={{
                       display:'flex',
                       flexDirection:'column',
                       gap:2,
                       border:"1px solid #535252",
                       p:2,
                       borderRadius:'8px'
                    }}
                    >
                    {
                       attribute.values?.map((value:any)=>(
                         
                           <Typography >
                               {
                                value
                               }
                           </Typography>
                         
                       ))
                    }
                    <Stack
                    spacing={.5}
                    >
                    <InputBase
                       sx={{ 
                        ml: 1, flex: 1,background:'#EFEFEF',
                        alignSelf:'center',
                        '&:placeholder':{
                            ml:2
                        }
                    }}
                       placeholder={`Add ${attribute?.name}`}
                       name={attribute?._id}
                       value={newAttributeValue ? newAttributeValue[attribute?._id]:''}
                       onChange={handleNewAttributeValueChange}
                     />
                       <Button
                       sx={{
                           height:25,width:30,color:'white',alignSelf:'center'
                       }}
                       size="small"
                       variant="contained"
                       onClick={()=>{
                        handleAddAttributeValue(attribute?._id)
                       }}
                       disabled={addPending}
                       >
                           Add
                       </Button>
                    </Stack>
                    </Box>
            
        </Stack>
         </Box>
                    </Grid>
                ))
            }
            </>
        
         </Grid>
        </Stack>
        )
        }
        </>
     }
     </Box>
        )
    }
    </Paper>
    <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>New Attribute</DialogTitle>
        <DialogContent>
        <Stack
        spacing={.5}
        sx={{width:300}}
        >
              <TextField
            required
            margin="dense"
            id="description"
            name="description"
            label="Description"
            fullWidth
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
          />
           <FormControlLabel 
            control={<Checkbox value={isInsertion} 
            onChange={handleIsInsertion}
            />
        }
            label="Is Insertion ?" 
            />
           <TextField
        label="Values"
        variant="outlined"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        fullWidth
        disabled={isInsertion}
        InputProps={{
          // Disable browser's auto-complete for the input field
          autoComplete: 'off'
        }}
      />
      <Stack
      direction={'row'}
      spacing={1}
      >
         {attributeValues.map((tag, index) => (
            <Chip 
            // size="small"
            label={tag}
            onDelete={()=>{
            setAttributeValues(attributeValues.filter(value=>value !== tag))
            }}
            />
          ))}
      </Stack>
        </Stack>   
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            disabled={savePending}
            onClick={handleAttributeSave}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
        </Stack>
    )
}