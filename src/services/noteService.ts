import axios from "axios";
import type { Note, NoteTag } from "../types/note";

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

type SortBy = "created" | "updated";

axios.defaults.baseURL = import.meta.env.VITE_NOTEHUB_URL;
axios.defaults.headers.common["Authorization"] = `Bearer ${
  import.meta.env.VITE_NOTEHUB_TOKEN
}`;

export const fetchNotes = async (
  search: string,
  tag?: NoteTag,
  page?: number,
  perPage?: number,
  sortBy?: SortBy
): Promise<FetchNotesResponse> => {
  const response = await axios.get<FetchNotesResponse>("notes", {
    params: {
      search,
      tag,
      page,
      perPage,
      sortBy,
    },
  });
  return response.data;
};

export const createNote = async (
  title: string,
  tag: NoteTag,
  content?: string
): Promise<Note> => {
  const response = await axios.post<Note>("notes", { title, content, tag });
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`notes/${id}`);
  return response.data;
};
