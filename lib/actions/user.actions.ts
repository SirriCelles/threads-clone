// Creating server actions
"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDatabase } from "../mongoose";
import { UserDataDTO } from "../dtos/user.dto";
import Thread from "../models/thread.model";

// Automatically create endpoint to create and update a new user
export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: UserDataDTO): Promise<void> {
  connectToDatabase();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      {
        upsert: true, //both update for existing users and insert for new users if the record doesn't exists
      }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDatabase();

    return await User
      .findOne({ id: userId })
    //  .populate({
    //   path: 'communities',
    //   model: Community
    // });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`)
  }
}

export const fetchUserPosts = async (userId: string) => {
  try {
    connectToDatabase();

    // TODO: Populate the community
    // Find all threads by user ID
    const threads = await User.findOne({id: userId})
    .populate({
      path: 'threads',
      model: Thread,
      populate: {
        path: 'children',
        model: Thread,
        populate: {
          path: 'author',
          model: User,
          select: 'id name image',
        }
      }
    });

    return threads;

  } catch (error: any) {
    throw new Error(`Failed to fetch posts: ${error.messae}`)
  }
}