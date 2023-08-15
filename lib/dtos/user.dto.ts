import { CommunityDTO } from "./community.dto";
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
  communities?: Array<CommunityDTO>

}

export interface AuthUserDTO {

}

export interface UserDataDTO {
  userId?: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path?: string;
  accountId?: string;
  authUser?: string;
  type?: 'User' | 'Community'
}