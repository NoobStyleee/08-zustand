'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNoteStore } from '../../lib/store/noteStore';
import { createNote } from '../../lib/api'; 
import css from './NoteForm.module.css';

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const { draft, setDraft, clearDraft } = useNoteStore();

  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDraft({ [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!draft.title.trim() || !draft.content.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      await createNote(draft); 
      
      toast.success('Note successfully created!');
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      
      router.push('/notes/filter/all');
    } catch (error) {
      toast.error('Failed to create note. Please try again.');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={css.fieldGroup}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={draft.title}
          onChange={handleInputChange}
          className={css.input}
        />
      </div>

      <div className={css.fieldGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          defaultValue={draft.tag}
          onChange={handleInputChange}
          className={css.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Ideas">Ideas</option>
        </select>
      </div>

      <div className={css.fieldGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          defaultValue={draft.content}
          onChange={handleInputChange}
          className={css.textarea}
        />
      </div>

      <div className={css.actions}>
        <button type="button" onClick={handleCancel} className={css.cancelBtn}>
          Cancel
        </button>
        <button type="submit" className={css.submitBtn}>
          Create
        </button>
      </div>
    </form>
  );
}