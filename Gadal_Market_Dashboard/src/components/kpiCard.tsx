import { Stack, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
interface kpiProps {
    title:string
    icon?:string
    kpiNumber:number
    growth:number
}
export default function KpiCard(props:kpiProps){
    const {title,icon,kpiNumber,growth} = props
    return (
        <Paper
        sx={{
            borderRadius:'8px',
            p:1,
            display:'flex',
            flexDirection:'column',
            gap:2.5
        }}
        >
            <Stack>
                <Typography variant="body2" sx={{textTransform:'capitalize',ml:1,color:'#3A3A3A'}} fontWeight={'bold'}>
                    {title}
                </Typography>
                {
                    icon&&(
                        <img style={{alignSelf:'flex-end'}} width={35} height={35} src={icon}/>
                    )
                }
            </Stack>
            <Stack spacing={1} sx={{ml:1}}>
                <Typography variant="h5" fontWeight={'bold'}>
                    {
                        new Intl.NumberFormat('en-US',{maximumFractionDigits:3}).format(kpiNumber)
                    }
                </Typography>
                <Typography
                variant="body2"
                sx={{display:'flex',alignItems:'center',gap:1,}}
                >
                <img width={20} src="/icons/arrow-growth.svg"/>
                <span style={{color:'green'}}>{`${growth}%`}</span> {' Since Last Week'}
                </Typography>
            </Stack>
        </Paper>
    )
}