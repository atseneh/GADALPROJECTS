interface sideNavItem  {
    description:string
    iconPath:string
    path:string
}
const  sideNavItems:sideNavItem[]= [
    {
        description:'Dashboard',
        iconPath:'/icons/uiUpdate.svg',
        path:'/',
    },
    {
        description:'Machinery',
        iconPath:'/icons/machinery.svg',
        path:'/product/Machinery/1?active=table',
    },
    {
        description:'Vehicles',
        iconPath:'/icons/vehicle.svg',
        path:'/product/Vehicles/3?active=table',
    },
    {
        description:'Property',
        iconPath:'/icons/property.svg',
        path:'/product/Property/2?active=table',
    },
    {
        description:'Others',
        iconPath:'/icons/others.svg',
        path:'/product/Others/4?active=table',
    },
    {
        description:'User Control',
        iconPath:'/icons/users.svg',
        path:'/user/user-control',
    },
    {
        description:'Get Estimation',
        iconPath:'/icons/pricing.svg',
        path:'esitmation/get-estimation',
    },
    {
        description:'Admin Control',
        iconPath:'/icons/admin.svg',
        path:'admin/admin-control?active=table',
    }, 
    {
        description:'Campaign',
        iconPath:'/icons/campaign.svg',
        path:'/campaign/Campaign',
    },
    {
        description:'Ui Update',
        iconPath:'/icons/uiUpdate.svg',
        path:'ui/ui-Update',
    },
    {
        description:'Price Update',
        iconPath:'/icons/priceUpdate.svg',
        path:'price/price-Update',
    },
    {
        description:'Customize',
        iconPath:'/icons/customize.svg',
        path:'customize/customize',
    },
    {
        description:'Checkout',
        iconPath:'/icons/checkout.svg',
        path:'checkout/checkout',
    },
]
export default sideNavItems