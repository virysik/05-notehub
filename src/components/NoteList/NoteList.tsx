import type { UseMutateFunction } from "@tanstack/react-query";
import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
  onRemove: UseMutateFunction<Note, Error, string, unknown>;
}
export default function NoteList({ notes, onRemove }: NoteListProps) {
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li className={css.listItem} key={note.id}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button className={css.button} onClick={() => onRemove(note.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
