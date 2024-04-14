import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme.tsx';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ServiceDetail from './routes/serviceDetail.tsx';
import Root from './routes/root.tsx';
import ErrorPage from './error-page.tsx';
import Index  from './routes/index.tsx';
import ProductDetail from './routes/productDetail.tsx';
import Login from './routes/login.tsx';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Register from './routes/register.tsx';
import Profile from './routes/profile/index.tsx';
import  {QueryClient,QueryClientProvider}from '@tanstack/react-query'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import Cart from './routes/cart.tsx';
import Post from './routes/post/post.tsx';
import GetEstimation from './routes/getEstimation.tsx';
import Payment from './routes/payment/index.tsx';
import Search from './routes/search.tsx';
import SuccessFullEstimation from './routes/successfullEstimation.tsx';
import PostSuccess from './routes/post/postSuccessfull.tsx';
import CartContext from './components/common/cartContext.tsx';
import YourFav from './routes/yourFavorites.tsx';
import Categories from './routes/categories.tsx';
import Messages from './routes/messages/index.tsx';
import PackageSubscription from './routes/packageSubscription.tsx';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import SocketContext from './components/context/socketContext.tsx';
import VerifyPhone from './routes/verifyPhone.tsx';
TimeAgo.addDefaultLocale(en)
const queryClient = new QueryClient()
const router = createBrowserRouter([
  {
    path:'/',
    element:<Root/>,
    errorElement:<ErrorPage/>,
    children:[
      {
        index:true,
        element:<Index/>
      },
      {
        path:'/:service/:category',
        element:<ServiceDetail/>
      },
      {
        path:'/products/:id',
        element:<ProductDetail/>
      },
      {
        path:'/profile',
        element:<Profile/>
      },
      {
        path:'/cart',
        element:<Cart/>
      },
      {
        path:'/post',
        element:<Post/>,
      },
      {
        path:'post/success',
        element:<PostSuccess/>
      },
      {
        path:'/estimation',
        element:<GetEstimation/>
      },
      {
        path:'/payment',
        element:<Payment/>
      },
      {
        path:'/search',
        element:<Search/>
      },
      {
        path:'/yourFavs',
        element:<YourFav/>
      },
      {
        path:'/categories',
        element:<Categories/>
      },
      {
        path:'/estimation_successfull',
        element:<SuccessFullEstimation/>
      },
      {
        path:'/messages',
        element:<Messages/>
      },
      {
        path:'/get_packages',
        element:<PackageSubscription/>
      },
      
    ],
    
  },
  {
    path:'/login',
    element:<Login/>
  },
  {
    path:'/verifyPhone',
    element:<VerifyPhone/>
  },
  {
    path:'/register',
    element:<Register/>
  },
 
])
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <CartContext>
     <ThemeProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
     <SocketContext>
     <RouterProvider router={router}/>
     </SocketContext>
    </LocalizationProvider>
    </QueryClientProvider>
  </ThemeProvider>
     </CartContext>
  </React.StrictMode>,
)
