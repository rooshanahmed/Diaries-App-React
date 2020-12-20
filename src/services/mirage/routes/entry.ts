import { Request, Response } from "miragejs";
import { Diary } from "../../../interfaces/diary.interface";
import { Entry } from "../../../interfaces/entry.interface";
import dayjs from "dayjs";
import { handleErrors } from "../server";

export interface EntryResponse {
  entry: Entry;
  diary: Diary;
}

export const createEntry = (
  schema: any,
  req: Request
): EntryResponse | Response => {
  try {
    const { title, content, diaryId } = JSON.parse(
      req.requestBody
    ) as Partial<Entry>;
    const diary = schema.diaries.find({ id: diaryId });
    const now = dayjs().format();
    const entry = diary.createEntry({
      title,
      content,
      createdAt: now,
      updatedAt: now,
    });
    diary.update({
      ...diary.attrs,
      updatedAt: now,
    });
    return {
      diary: diary.attrs,
      entry: entry.attrs,
    };
  } catch (error) {
    return handleErrors(null, "Failed to create entry");
  }
};

export const getEntriesByDiaries = (
  schema: any,
  req: Request
): { entries: Entry[] } | Response => {
  try {
    const diary = schema.diaries.find(req.params.id);
    return diary.entry;
  } catch (error) {
    return handleErrors(error, "Failed to get diaries entries");
  }
};

export const updateEntry = (schema: any, req: Request): Entry | Response => {
  try {
    const entry = schema.entries.find(req.params.id);
    const data = JSON.parse(req.requestBody) as Partial<Entry>;
    const now = dayjs().format();
    entry.update({
      ...data,
      updatedAt: now,
    });
    return entry.attrs as Entry;
  } catch (error) {
    return handleErrors(error, "Failed to update entry");
  }
};
