import { CommunityDTO } from "./community.dto"

export interface ThreadDTO {
  text: string;
  author: string;
  communityId: string | null;
  path?: string;
}

export interface AuthorDTO {
  name: string;
  image: string;
  id: string;
}
export interface ThreadPropsDTO {
  id: string;
  currentUserId?: string;
  parentId: string | null;
  content: string;
  author: AuthorDTO;
  path?: string;
  createdAt?: string;
  community?: CommunityDTO | null;
  comments: {
    author: {
      image: string
    }
  }[],
  isComment?: boolean
}