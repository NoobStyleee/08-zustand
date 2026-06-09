'use client';

import "modern-normalize";
import Loader from "../../../../components/Loader/Loader";
import ErrorMessage from "../../../../components/ErrorMessage/ErrorMessage";
import Pagination from "../../../../components/Pagination/Pagination";
import SearchBox from "../../../../components/SearchBox/SearchBox";
import Modal from "../../../../components/Modal/Modal";
import NoteForm from "../../../../components/NoteForm/NoteForm";
import { useState, useEffect } from "react";
import { fetchNotes } from "../../../../lib/api";
import NoteList from "../../../../components/NoteList/NoteList";
import { useDebouncedCallback } from "use-debounce";
import { Toaster } from "react-hot-toast";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { notifyNoNote } from "../../../../lib/toast";
import css from "./Notes.client.module.css"; 

interface NotesClientProps {
  initialTag?: string;
}

function NotesClient({ initialTag }: NotesClientProps) {
  const [createNoteThis, setCreateNoteThis] = useState(false);
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["notes", page, query, initialTag],
    queryFn: () =>
      fetchNotes({
        page,
        search: query || undefined,
        perPage: 12,
        tag: initialTag,
      }),
    placeholderData: keepPreviousData,
  });

  const debouncedSetQuery = useDebouncedCallback((value: string) => {
    setQuery(value);
  }, 500);

  const openModal = () => {
    setCreateNoteThis(true);
  };

  const closeModal = () => {
    setCreateNoteThis(false);
  };

  useEffect(() => {
    if (data?.notes && data.notes.length === 0) {
      notifyNoNote();
    }
  }, [data]);

  useEffect(() => {
    setPage(1);
  }, [query, initialTag]);

  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={input}
          onChange={(val) => {
            setInput(val);
            debouncedSetQuery(val);
          }}
        />

        {isSuccess && totalPages > 1 && (
          <Pagination totalPages={totalPages} page={page} setPage={setPage} />
        )}

        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {isSuccess && data && data.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}

      <Toaster position="top-center" reverseOrder={false} />

      {createNoteThis && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}

export default NotesClient;