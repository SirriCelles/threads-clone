import PostThread from "@/components/forms/PostThread";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUser } from "@/lib/actions/user.actions";
import { UserDTO } from "@/lib/dtos/user.dto";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

const Page = async ({ params }: {params: { id: string}}) => {
  const user = await currentUser();

  if (!user) return null;
  const userInfo: UserDTO  = await fetchUser(params.id);

  if(!userInfo?.onboarded) redirect('/onboarding');

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUser={user.id}
        name={userInfo.name}
        username={userInfo.username}
        image={userInfo.image}
        bio={userInfo.bio}

      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {
              profileTabs.map((tab: any) => (
                <TabsTrigger
                  key={tab.label}
                  value={tab.value}
                  className="tab"
                >
                  <Image
                    src={tab.icon}
                    alt={tab.label}
                    width={24}
                    height={24}
                  />
                  <p className="max-sm:hidden">{tab.label}</p>
                </TabsTrigger>
              ))
            }
          </TabsList>
        </Tabs>
      </div>
    </section>
  )
}

export default Page;