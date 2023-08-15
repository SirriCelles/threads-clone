//app/page.tsx
import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();
  const  result  = await fetchThreads(1, 30);

  return (
    <>
      {/* <UserButton afterSignOutUrl="/"/> */}
      <h1 className="head-text text-left">Home</h1>\

      <section className="mt-9 flex flex-col gap-9">
        {
          result.threads?.length === 0 ? (
            <p className="no-result">No Threads found</p>
          ): (
            <>
              {
                result.threads.map((thread: any) => (
                  <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={user?.id}
                    content={thread.text}
                    parentId={thread.parentId}
                    author={thread.author}
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                  />
                ))
              }
            </>
          )
        }
      </section>
    </>
  )
}