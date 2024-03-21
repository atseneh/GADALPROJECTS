import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
export default function useSmallScreen(){
const theme = useTheme()
const smallScreen = useMediaQuery(theme.breakpoints.down('md'))
return smallScreen
}