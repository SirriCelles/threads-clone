export interface ThreadDTO {
  text: string,
  author: string,
  communityId: string | null,
  path?: string
}