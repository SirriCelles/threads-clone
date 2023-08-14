import { SortOrder } from "mongoose";

export interface SearchParamsDTO {
  userId: string;
  searchString: string;
  pageNumber: number;
  pageSize: number;
  sortBy?: SortOrder
}