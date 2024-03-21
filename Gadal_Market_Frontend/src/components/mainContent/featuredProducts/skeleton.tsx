import { Skeleton } from "@mui/material";

export default function FeaturedCardSkeleton(){
    return (
        <Skeleton sx={{mr:2}} animation="wave" variant='rectangular' height={110} width={300}/>
    )
}