import UserCard from "@/components/cards/UserCard";
import { fetchAllUsers, fetchUser } from "@/lib/actions/user.actions";
import { SearchParamsDTO } from "@/lib/dtos/searchParams.dto";
import { UserDTO } from "@/lib/dtos/user.dto";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";


const Page = async () => {
  const user = await currentUser();

  if (!user) return null;
  const userData: SearchParamsDTO = {
    userId: user.id,
    searchString: '',
    pageNumber: 1,
    pageSize: 25

  }
  const result  = await fetchAllUsers(userData);

  return (
    <section>\
      <h1 className="head-text mb-10">Search</h1>

      {/* render a search bar */}
      <div className="mt-14 flex flex-col gap-9">
        {
          result.users.length === 0 ? (
            <p className="no-result">No Users</p>
          ): (
            <>
              {
                result.users.map((person) => (
                  <UserCard
                    key={person.id}
                    id={person.id}
                    name={person.name}
                    username={person.username}
                    image={person.image}
                    personType='User'
                  />
                ))
              }
            </>
          )
        }
      </div>
    </section>
  )
}

export default Page;