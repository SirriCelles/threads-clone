import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { UserDTO } from "@/lib/dtos/user.dto";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page() {
  const user = await currentUser();

  if (!user) return null;
  const userInfo: UserDTO  = await fetchUser(user.id);

  if(!userInfo?.onboarded) redirect('/onboarding');
  return (
    <>
      <h1 className="head-text">Create Thread</h1>

      <PostThread userId={userInfo._id} />
    </>
  )
}

export default Page;