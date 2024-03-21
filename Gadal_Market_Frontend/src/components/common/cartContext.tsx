import * as React from 'react'
export const context = React.createContext({
    products:[],
    addToCart:(product:any)=>{},
    clearCart:()=>{},
    removeFromCart:(productId:string)=>{}
})
export default function CartContext({children}:{children:React.ReactNode}){
const [products,setProducts] = React.useState<any>(localStorage.getItem('products')?JSON.parse(localStorage.getItem('products')!):[])
let existingProducts = JSON.parse(localStorage.getItem('products')||'[]')
const addToCart = (product:any)=>{
//sync localsorage with react state
existingProducts.push(product)
localStorage.setItem('products',JSON.stringify(existingProducts))
setProducts([...products,product])
}
const removeFromCart = (productId:string)=>{
const notRemovedItems = existingProducts.filter((prodcut:any)=>prodcut?._id !== productId)
localStorage.setItem('products',JSON.stringify(notRemovedItems))
setProducts(products?.filter((product:any)=>product?._id !== productId))
}
const clearCart = ()=>{
localStorage.removeItem('products')
setProducts([])
}

    return (
        <context.Provider
         value={
            {
                products,
                addToCart,
                clearCart,
                removeFromCart,
               }
         }>
        {
            children
        }
        </context.Provider>
    )
}