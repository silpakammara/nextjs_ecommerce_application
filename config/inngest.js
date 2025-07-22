
import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";
import Order from "@/models/Order";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "nextjs-site" });

//inngest function to save user data to db

export const syncUserCreation=inngest.createFunction(
    {
        id: "sync-user-from-clerk",
    },
    {
       event:"clerk/user.created"
    },
    async ({event})=>{
        const{id, first_name, last_name, email_addresses,image_url}=event.data
        const userData={
            _id:id,
            name:`${first_name} ${last_name}`,
            email:email_addresses[0].email_address,
            imageUrl:image_url
        }
      await connectDB()
      await User.create(userData)
    }
)

//inngest function to update user data in db
export const syncUserUpdation=inngest.createFunction(
    {
        id: "update-user-from-clerk",
    },
    {
       event:"clerk/user.updated"
    },
    async ({event})=>{
        const{id, first_name, last_name, email_addresses,image_url}=event.data
        const userData={
            name:`${first_name} ${last_name}`,
            email:email_addresses[0].email_address,
            imageUrl:image_url
        }
      await connectDB()
      await User.findByIdAndUpdate(id, userData)
    }
);
//inngest function to delete user data from db
export const syncUserDeletion=inngest.createFunction(
    {
        id: "delete-user-with-clerk",
    },
    {
       event:"clerk/user.deleted"
    },
    async ({event})=>{
        const{id}=event.data
      await connectDB()
      await User.findByIdAndDelete(id)
    }
);

//function to create user order in db 

export const createUserOrder= inngest.createFunction(
    {
        id:'create-user-order',
        batchEvents:{
            maxSize:5,
            timeout:'5s'
        }
    },
    {event:'order/created'},
    async({events})=>{
        const orders=events.map((each)=>{
            return {
                userId:each.data.userId,
                items:each.data.items,
                amount:each.data.amount,
                address:each.data.address,
                date:each.data.date
            }
        })
        await connectDB()
        await Order.insertMany(orders)
  
        return {success:true, processes:orders.length}
    }
)