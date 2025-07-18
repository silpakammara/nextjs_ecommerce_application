
import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

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
        const{id, first_name, last_name, email_addresses,Image_Url}=event.data
        const userData={
            _id:id,
            name:`${first_name} ${last_name}`,
            email:email_addresses[0].email_address,
            imageUrl:Image_Url
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
        const{id, first_name, last_name, email_addresses,Image_Url}=event.data
        const userData={
            name:`${first_name} ${last_name}`,
            email:email_addresses[0].email_address,
            imageUrl:Image_Url
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