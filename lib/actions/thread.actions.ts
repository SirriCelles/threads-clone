// use server is important here because we cannot directly create database actions
// via the browser . therefor we have to use a special server decorator
'use server';

import { revalidatePath } from "next/cache";
import { ThreadDTO } from "../dtos/threads.dto";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDatabase } from "../mongoose";
import { CommentDTO } from "../dtos/comment.dto";

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

export const fetchThreads = async (pageNumber: number = 1, pageSize: number = 20) => {
  try {
    connectToDatabase();

    // caculate the number of threads to skip, depending on the amount
    const skipAmount = (pageNumber - 1) * pageSize;

    // Fetch the posts that have no parents( top-level threads)
    const threadsQuery = Thread.find({
      parentId: {$in: [null, undefined]}})
      .sort({ createdAt: 'desc'})
      .skip(skipAmount)
      .limit(pageSize)
      .populate({path: 'author', model: User})
      .populate({
        path: 'children',
        populate: {
          path: 'author',
          model: User,
          select: "_id name parentId, image"
        }
      })

      const  totalThreads = await Thread.countDocuments({ parentId: {$in: [null, undefined]}});

      const threads = await threadsQuery.exec();

      // Checkin if we have a next page
      const isNext = totalThreads > skipAmount + threads.length;

      return { threads, isNext}


  } catch (error: any) {
    throw new Error(`Failed to fetch threads: ${error.message}`)
  }
}

export const fetchThreadById = async (id: string) => {
  try {
    connectToDatabase();

    //TODO: Populate Community
    const threadsQuery = Thread.findById(id)
      .populate({
        path: 'author',
        model: User,
        select: '_id id name image'
      })
      .populate({
        path: 'children',
        populate: [
          {
            path: 'author',
            model: User,
            select: '_id id name parentId image'
          },
          {
            path: 'children',
            model: Thread,
            populate: {
              path: 'author',
              model: User,
              select: '_id id name parentId image'
            }
          }
        ]
      });

    const thread = await threadsQuery.exec();
    return thread;
  } catch (error: any) {
    throw new Error(`Failed to fetch thread: ${error.message}`)
  }
}



export const addCommentToThread = async (
  { threadId, commentText, userId, path} : CommentDTO
) => {
  try {
    connectToDatabase();
    // Find original thread by ID
    const originalThread = await Thread.findById(threadId);

    if(!originalThread) {
      throw new Error("Thread Not Found");
    }

    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parent: threadId,
    })

    // Save the comment as new thread
    const savedCommentThread = await commentThread.save();

    // Update the original thread to include new comment
    originalThread.children.push(savedCommentThread);

    // Save the original thread
    await originalThread.save();

    revalidatePath(path);

  } catch (error: any) {
    throw new Error(`Error adding comment to thread: ${error.message}`)
  }
}