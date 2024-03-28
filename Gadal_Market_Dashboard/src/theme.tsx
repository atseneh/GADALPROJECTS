import { createTheme } from '@mui/material/styles';
const theme = createTheme({
    palette:{
        primary:{
            main:'rgb(255 170 1)',
            light:'#42a5f5'
        },
        error:{
            main:'#F23F4B'
        }
    },
    typography:{
        fontFamily:'Poppins'
    },

   components:{
        MuiButton:{
            styleOverrides:{
                root:{
                    textTransform:'none'
                }
            }
        },
        MuiChip:{
            styleOverrides:{
                root:{
                    ':hover':{
                        background:'rgb(255 170 1)'
                    }
                }
            }
        },
        MuiTextField:{
            defaultProps:{
                size:'small',
                variant:'outlined',
                autoComplete:'off',
            },
            styleOverrides:{
                root:{
                    background:'#EFEFEF',
                }
            }
        },
        MuiInputBase:{
            styleOverrides:{
                root:{
                    '&::placeholder':{
                        ml:1,
                    }
                }
            }
        }
   }
    // shadows:['none']
})
export default theme