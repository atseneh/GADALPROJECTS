import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import ListSort from '../../components/common/listSort'
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid, Typography } from '@mui/material'
import ProductCard from '../../components/products/productCard';
import { useQuery } from '@tanstack/react-query';
import getFavourites from '../../api/user/getUserFavouriteItems';
interface Props {
    hideTitle:boolean
}
export default function Favourites(props:Props){
    const {hideTitle} = props
    const {data:favourites,isLoading} = useQuery({
        queryKey:['favouritesProducts'],
        queryFn:()=>getFavourites()
       })
    console.log(favourites)
    return (
        <Card
        sx={{borderRadius:'20px',mt:2}}
        >
            <CardContent>
            <Box sx={{display:'flex',flexDirection:'column',gap:1}}>
        {
            !hideTitle&&(
                <Typography variant='h6' fontWeight={'bold'}>
                Your Favorites
            </Typography>
            )
        }
        <Box sx={{alignSelf:'flex-end'}}>
            <ListSort/>
        </Box>
        <Divider sx={{fontWeight:'bold'}}/>
        </Box>
        {
            isLoading?<p>loading...</p>:
            (
                <Grid container spacing={2} sx={{mt:2}}>
         {
            favourites?.favourites.map((fav:any)=>(
                <Grid item xs={12} sm={3} key={fav?._id}>
                <ProductCard data={fav}/>
                </Grid>

            ))
         }
        </Grid>
            )
        }
            </CardContent>
        </Card>
    )
}


