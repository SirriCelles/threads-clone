import { CommunitiesDTO } from "./community.dto";
import { ThreadDTO } from "./threads.dto";

export interface UserDTO {
  _id: string;
  id: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  onboarded: boolean;
  threads?: Array<ThreadDTO>
  communities?: Array<CommunitiesDTO>

}

export interface AuthUserDTO {

}
