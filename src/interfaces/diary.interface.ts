export interface Diary {
  id?: string;
  title: string;
  type: "private" | "public";
  createAt?: string;
  updateAt?: string;
  userId?: string;
  entryIds: string[] | null;
}
