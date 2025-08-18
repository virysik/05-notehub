import { useQuery } from "@tanstack/react-query";
import NoteList from "../NoteList/NoteList";
import css from "./App.module.css";
import { fetchNotes } from "../../services/noteService";

function App() {
  const { data, isSuccess } = useQuery({
    queryKey: [],
    queryFn: () => fetchNotes(""),
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>Header</header>
      {isSuccess && data.notes.length > 0 && <NoteList notes={data.notes} />}
    </div>
  );
}

export default App;
