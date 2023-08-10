// Creating server actions
'use server'

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDatabase } from "../mongoose"

export async function updateUser(
  userId: string,
  username: string,
  name: string,
  image: string,
  bio: string,
  path: string
  ): Promise<void> {
  connectToDatabase();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true
      },
      {
        upsert: true, //both update for existing users and insert for new users if the record doesn't exists
      }
    );
  
    if(path === '/profile/edit') {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }

}