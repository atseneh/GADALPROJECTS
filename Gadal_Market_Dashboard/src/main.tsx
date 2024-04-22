import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from './routes/root.tsx'
import theme from './theme.tsx'
import { ThemeProvider } from '@mui/material'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Index from './routes/index.tsx'
import Products from './routes/products.tsx'
import  {QueryClient,QueryClientProvider}from '@tanstack/react-query'
import Usercontrol from './routes/userControl.tsx'
import GetEstimation from './routes/getEstimation.tsx'
import AdminControl from './routes/adminControl.tsx'
import Campaign from './routes/capmpaign.tsx'
import UiUpdate from './routes/uiUpdate.tsx'
import PriceUpdate from './routes/priceUpdate.tsx'
import Customize from './routes/customize.tsx'
import Checkout from './routes/checkout.tsx'
import Login from './routes/auth/login.tsx'
const queryClient = new QueryClient()
const router = createBrowserRouter([
  {
    path:'/',
    element:<Root/>,
    children:[
      {
        index:true,
        element:<Index/>
      },
      {
        path:'/product/:title/:serviceId',
        element:<Products/>
      },
      {
        path:'/user/:title',
        element:<Usercontrol/>
      },
      {
        path:'/esitmation/:title',
        element:<GetEstimation/>
      },
      {
        path:'/admin/:title',
        element:<AdminControl/>
      },
      {
        path:'/campaign/:title',
        element:<Campaign/>
      },
      {
        path:'/ui/:title',
        element:<UiUpdate/>
      },
      {
        path:'/price/:title',
        element:<PriceUpdate/>
      },
      {
        path:'/customize/:title',
        element:<Customize/>
      },
      {
        path:'/checkout/:title',
        element:<Checkout/>
      }
    ]
  },
  {
    path:'/login',
    element:<Login/>
  }
])
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
    <RouterProvider router={router}/>
    </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
