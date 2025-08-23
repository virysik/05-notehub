import axios from "axios";
import type { CreateNoteData, Note } from "../types/note";

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

axios.defaults.baseURL = import.meta.env.VITE_NOTEHUB_URL;
axios.defaults.headers.common["Authorization"] = `Bearer ${
  import.meta.env.VITE_NOTEHUB_TOKEN
}`;

export const fetchNotes = async (
  search: string,
  page: number,
  perPage: number
): Promise<FetchNotesResponse> => {
  const response = await axios.get<FetchNotesResponse>("notes", {
    params: { search, page, perPage },
  });
  return response.data;
};

export const createNote = async (data: CreateNoteData): Promise<Note> => {
  const response = await axios.post<Note>("notes", data);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`notes/${id}`);
  return response.data;
};
