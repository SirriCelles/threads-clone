// Creating server actions
"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDatabase } from "../mongoose";
import { UserDataDTO } from "../dtos/user.dto";
import Thread from "../models/thread.model";
import { FilterQuery } from "mongoose";
import { SearchParamsDTO } from "../dtos/searchParams.dto";

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



export const fetchAllUsers = async ({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc"

}: SearchParamsDTO ) => {
  try {
    connectToDatabase();

    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    }

    if(searchString.trim() !== '') {
      query.$or = [
        {username: {$regex: regex}},
        {name: {$regex: regex}}
      ]
    }

    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const users = await usersQuery.exec();

    const totalUsersCount = await User.countDocuments(query);


    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error: any) {
     throw new Error(`Failed to get users: ${error.message}`);
  }
}

