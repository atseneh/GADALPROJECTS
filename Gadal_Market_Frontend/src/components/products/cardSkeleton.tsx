import Stack from '@mui/material/Stack'
import Skeleton from '@mui/material/Skeleton'
export default function CardSkeleton(){
    return(
        <Stack spacing={1}>
          <Skeleton animation="wave" variant="rounded" width={'100%'} height={200} />
         <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
         <Skeleton variant="text" sx={{ fontSize: '.5rem' }} width={80} />
         <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
         <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
        </Stack>
    )
}