import { useId } from "react";
import css from "./NoteForm.module.css";
import { Form, Formik, Field, type FormikHelpers } from "formik";
import type { CreateNoteData, Note } from "../../types/note";
import type { UseMutateFunction } from "@tanstack/react-query";
import * as Yup from "yup";

const options = ["Work", "Personal", "Meeting", "Shopping", "Todo"];

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title is too short")
    .max(50, "Title is too long")
    .required("Title is required field"),
  content: Yup.string().max(500, "Content is too long"),
  tag: Yup.string().oneOf(options),
});

interface NoteFormProps {
  pending: boolean;
  onClose: () => void;
  onSubmit: UseMutateFunction<Note, Error, CreateNoteData, unknown>;
}
export default function NoteForm({
  pending,
  onClose,
  onSubmit,
}: NoteFormProps) {
  const fieldId = useId();
  const initValues: CreateNoteData = { title: "", tag: "Todo", content: "" };
  const handleSubmit = (
    values: CreateNoteData,
    actions: FormikHelpers<CreateNoteData>
  ) => {
    onSubmit(values);
    actions.resetForm();
    onClose();
  };
  return (
    <Formik
      initialValues={initValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor={`${fieldId}-title`}>Title</label>
            <Field
              type="text"
              name="title"
              id={`${fieldId}-title`}
              className={css.input}
            />
            {errors.title && touched.title ? (
              <span className={css.error}>{errors.title}</span>
            ) : null}
          </div>
          <div className={css.formGroup}>
            <label htmlFor={`${fieldId}-content`}>Content</label>
            <Field
              as="textarea"
              name="content"
              id={`${fieldId}-content`}
              rows={8}
              className={css.textarea}
            />
            {errors.content && touched.content ? (
              <span className={css.error}>{errors.content}</span>
            ) : null}
          </div>
          <div className={css.formGroup}>
            <label htmlFor={`${fieldId}-tag`}>Tag</label>
            <Field
              as="select"
              name="tag"
              id={`${fieldId}-tag`}
              className={css.select}
            >
              {options.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </Field>
            {errors.tag && touched.tag ? (
              <span className={css.error}>{errors.tag}</span>
            ) : null}
          </div>
          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={
                Boolean(errors.content || errors.tag || errors.title) || pending
              }
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
