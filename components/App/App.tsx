import "modern-normalize";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import css from "./App.module.css";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import { useState, useEffect } from "react";
import { fetchNotes } from "../../lib/api";
import NoteList from "../NoteList/NoteList";
import { useDebouncedCallback } from "use-debounce";
import { Toaster } from "react-hot-toast";
import { notifyNoNote } from "../../lib/toast";

function App() {
  const [createNoteThis, setCreateNoteThis] = useState(false);
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isSuccess, isFetching } = useQuery({
    queryKey: ["notes", page, query],
    queryFn: () =>
      fetchNotes({
        page,
        search: query || undefined,
        perPage: 12,
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
  }, [query]);

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

      {(isLoading || isFetching) && <Loader />}
      {isError && <ErrorMessage />}

      {!isLoading && !isFetching && isSuccess && data.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}

      <Toaster position="top-center" reverseOrder={false} />

     {createNoteThis && (
  <Modal onClose={closeModal}>
    <NoteForm /> 
  </Modal>
)}
    </div>
  );
}

export default App;