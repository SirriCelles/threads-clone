'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from 'next/navigation';
import { CommentValidation } from '@/lib/validations/comment';
import Image from 'next/image';




interface Props {
  threadId: string;
  currentUserId: string;
  currentUserImage: string;
}

const Comment = ({ threadId, currentUserImage, currentUserId} : Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    // Setting some validation using the ts zod resolver
    resolver: zodResolver(CommentValidation),
    defaultValues: {
     thread: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    // const threadData: ThreadDTO = {
    //   text: values.thread,
    //   author: userId,
    //   path: pathname,
    //   communityId: null
    // }
    // await createThread(threadData);

    // router.push('/');
  }

  return (
    <Form
      {...form}
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='comment-form'>

        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3 w-full">
              <FormLabel>
                <Image
                  src={currentUserImage}
                  alt='profile image'
                  width={48}
                  height={48}
                  className='rounded-full'
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type='text'
                  placeholder='Comment...'
                  className='no-focus text-light-1 outline-none'
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className='comment-form_btn'>Reply</Button>
      </form>
    </Form>
  )
}

export default Comment;