import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import NoteList from "../NoteList/NoteList";
import css from "./App.module.css";
import { createNote, deleteNote, fetchNotes } from "../../services/noteService";
import { useState } from "react";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import { useDebounce } from "use-debounce";

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [search] = useDebounce(query, 1000);
  const [openCreate, setOpenCreate] = useState(false);
  const { data, isSuccess } = useQuery({
    queryKey: ["notes", currentPage, search],
    queryFn: () => fetchNotes(search, currentPage, 12),
    placeholderData: keepPreviousData,
  });

  const queryClient = useQueryClient();
  const { mutate: addNote } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", currentPage] });
    },
  });

  const { mutate: removeNote } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", currentPage] });
    },
  });

  const openNoteCreate = () => setOpenCreate(true);
  const closeNoteCreate = () => setOpenCreate(false);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox query={query} setQuery={setQuery} />
        {isSuccess && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={openNoteCreate}>
          Create note +
        </button>
      </header>
      {isSuccess && data.notes.length > 0 && (
        <NoteList notes={data.notes} onRemove={removeNote} />
      )}
      {openCreate && (
        <Modal
          onClose={closeNoteCreate}
          children={<NoteForm onClose={closeNoteCreate} onSubmit={addNote} />}
        />
      )}
    </div>
  );
}

export default App;
