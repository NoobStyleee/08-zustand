'use client';

import { useState, useEffect } from "react";
// 👍 ПРАВИЛЬНИЙ ІМПОРТ ДЛЯ LINK
import Link from "next/link"; 
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { Toaster } from "react-hot-toast";

import Loader from "../../../../components/Loader/Loader";
import ErrorMessage from "../../../../components/ErrorMessage/ErrorMessage";
import Pagination from "../../../../components/Pagination/Pagination";
import SearchBox from "../../../../components/SearchBox/SearchBox";
import NoteList from "../../../../components/NoteList/NoteList";

import { fetchNotes } from "../../../../lib/api";
import { notifyNoNote } from "../../../../lib/toast";
import css from "./Notes.client.module.css"; 

interface NotesClientProps {
  tag?: string; // Вимога ментора: замість initialTag використовуємо просто tag
}

function NotesClient({ tag }: NotesClientProps) {
  // Вимога ментора: зрозумілі назви для стейтів пошуку
  const [searchInput, setSearchInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["notes", page, debouncedQuery, tag],
    queryFn: () =>
      fetchNotes({
        page,
        search: debouncedQuery || undefined,
        perPage: 12,
        tag: tag,
      }),
    placeholderData: keepPreviousData,
  });

  // 👍 ВИПРАВЛЕНО: тепер викликається правильна функція setDebouncedQuery
  const debouncedSetQuery = useDebouncedCallback((value: string) => {
    setDebouncedQuery(value);
  }, 500);

  useEffect(() => {
    if (data?.notes && data.notes.length === 0) {
      notifyNoNote();
    }
  }, [data]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, tag]);

  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={searchInput}
          onChange={(val) => {
            setSearchInput(val);
            debouncedSetQuery(val);
          }}
        />

        {isSuccess && totalPages > 1 && (
          <Pagination totalPages={totalPages} page={page} setPage={setPage} />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {isSuccess && data && data.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default NotesClient;