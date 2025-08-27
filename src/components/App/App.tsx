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
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Skeleton/Skeleton";

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [search] = useDebounce(query, 1000);
  const [openCreate, setOpenCreate] = useState(false);
  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ["notes", currentPage, search],
    queryFn: () => fetchNotes(search, currentPage, 12),
    placeholderData: keepPreviousData,
  });

  const queryClient = useQueryClient();
  const { mutate: addNote, isPending: isPendingAdd } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", currentPage] });
      toast.success("Note added");
    },
    onError: () => {
      toast.error("Error adding note");
    },
  });

  const { mutate: removeNote, isPending: isPendingRemove } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", currentPage] });
      toast.success("Note deleted");
    },
    onError: () => {
      toast.error("Error deleting note");
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
      {isError && <p>Whoops, something went wrong! Please try again!</p>}
      {isLoading && <Loader />}
      {isSuccess && data.notes.length > 0 && (
        <NoteList
          notes={data.notes}
          onRemove={removeNote}
          pending={isPendingRemove}
        />
      )}
      {openCreate && (
        <Modal
          onClose={closeNoteCreate}
          children={
            <NoteForm
              pending={isPendingAdd}
              onClose={closeNoteCreate}
              onSubmit={addNote}
            />
          }
        />
      )}
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
