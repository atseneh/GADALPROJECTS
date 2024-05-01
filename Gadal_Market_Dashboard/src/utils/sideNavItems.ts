interface sideNavItem  {
    description:string
    iconPath:string
    path:string,
    hidden:boolean
}
const accessLevel = localStorage.getItem('plx')
const superAdmin = Number(accessLevel) === 0
const  sideNavItems:sideNavItem[]= [
    {
        description:'Dashboard',
        iconPath:'/icons/uiUpdate.svg',
        path:'/',
        hidden:false
    },
    {
        description:'Machinery',
        iconPath:'/icons/machinery.svg',
        path:'/product/Machinery/1?active=table',
        hidden:!superAdmin && Number(accessLevel) !== 2
    },
    {
        description:'Vehicles',
        iconPath:'/icons/vehicle.svg',
        path:'/product/Vehicles/3?active=table',
        hidden:!superAdmin && Number(accessLevel) !== 3
    },
    {
        description:'Property',
        iconPath:'/icons/property.svg',
        path:'/product/Property/2?active=table',
        hidden:!superAdmin && Number(accessLevel) !== 1
    },
    {
        description:'Constructions',
        iconPath:'/icons/others.svg',
        path:'/product/Others/4?active=table',
        hidden:!superAdmin && Number(accessLevel) !== 4
    },
    {
        description:'User Control',
        iconPath:'/icons/users.svg',
        path:'/user/user-control',
        hidden:false
    },
    {
        description:'Get Estimation',
        iconPath:'/icons/pricing.svg',
        path:'esitmation/get-estimation',
        hidden:false
    },
    {
        description:'Admin Control',
        iconPath:'/icons/admin.svg',
        path:'admin/admin-control?active=table',
        // hidden:Number(accessLevel) !== 0
        hidden:false
    }, 
    {
        description:'Campaign',
        iconPath:'/icons/campaign.svg',
        path:'/campaign/Campaign',
        hidden:false
    },
    {
        description:'Ui Update',
        iconPath:'/icons/uiUpdate.svg',
        path:'ui/ui-Update',
        hidden:false
    },
    {
        description:'Price Update',
        iconPath:'/icons/priceUpdate.svg',
        path:'price/price-Update',
        hidden:false
    },
    {
        description:'Customize',
        iconPath:'/icons/customize.svg',
        path:'customize/customize',
        hidden:false
    },
    {
        description:'Checkout',
        iconPath:'/icons/checkout.svg',
        path:'checkout/checkout',
        hidden:false
    },
]
export default sideNavItems