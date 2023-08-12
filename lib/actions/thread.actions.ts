// use server is important here because we cannot directly create database actions
// via the browser . therefor we have to use a special server decorator
'use server';

import { revalidatePath } from "next/cache";
import { ThreadDTO } from "../dtos/threads.dto";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDatabase } from "../mongoose";

export async function createThread(
  { text, author, communityId, path }: ThreadDTO) {
    try {
      connectToDatabase();

      const createdThread = await Thread.create({
        text, author, community: null, path
      });

      // update User Model
      await User.findByIdAndUpdate(author, {
        $push: {threads: createdThread._id}
      });

      // this ensures that chane happens immediately on our next app
      revalidatePath(path!);
    } catch (error: any) {
      throw new Error(`Failed to creating thread: ${error.message}`);
    }

}


