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
import AllItems from './routes/allItems.tsx';
import ChangePassword from './routes/changePassword.tsx';
import ForgotPassword from './routes/forgotPaswword.tsx';
import EnterOtp from './routes/enterOtp.tsx';
import ResetPassword from './routes/resetPassword.tsx';
import EditPost from './routes/post/editPost.tsx';
import PublicProfile from './routes/profile/publicProfile.tsx';
import PrivacyPolicy from './routes/privacyPolicy.tsx';
import TermsAndConditions from './routes/termsAndConditions.tsx';
import SafteyTips from './routes/safteyTips.tsx';
import PaymentSuccessful from './routes/payment/paymentSuccessfull.tsx';
import { FormProvider } from './components/common/productPostContext.tsx';
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
        path:'/allItems',
        element:<AllItems/>
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
        path:'/editPost/:id',
        element:<EditPost/>,
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
      {
        path:'/change_password',
        element:<ChangePassword/>
      },
      {
        path:'/viewProfile/:userId',
        element:<PublicProfile/>
      },
      {
        path:'/verifyPayment/paymentSuccessfull/:txRef',
        element:<PaymentSuccessful/>
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
  {
    path:'/forgot_password',
    element:<ForgotPassword/>
  },
  {
    path:'/is_it_you',
    element:<EnterOtp/>
  },
  {
    path:'/resetPass',
    element:<ResetPassword/>
  },
  {
  path:'/pirvacy_policy',
    element:<PrivacyPolicy/>
  },
  {
    path:'/terms_and_conditions',
    element:<TermsAndConditions/>
    },
    {
      path:'/saftey_tips',
      element:<SafteyTips/>
      },
])
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <CartContext>
      <FormProvider>
      <ThemeProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
     <SocketContext>
     <RouterProvider router={router}/>
     </SocketContext>
    </LocalizationProvider>
    </QueryClientProvider>
  </ThemeProvider>
      </FormProvider>
     </CartContext>
  </React.StrictMode>,
)
