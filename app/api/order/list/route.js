import connectDB from "@/config/db"
import Address from "@/models/address"
import Order from "@/models/Order"
import Product from "@/models/Product"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"


export async function GET(response){
    try{
        const {userId}=getAuth(response)
         await connectDB()

         Address.length
         Product.length

         const orders=await Order.find({userId}).populate('address items.product')
  
         return NextResponse.json({Success:true, orders})
    }
    catch(error){
        return NextResponse.json({Success:false, message:error.message})
    }
}