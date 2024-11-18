import { connect, useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  updatePage,
  updatePageType,
  titleChange,
  descriptionChange,
  urlChange,
  saveLocal,
  autocompleteTags,
  selectSuggestion,
  savePage,
  deletePage,
  localVersion,
  deleteNewerVersion,
} from './pageSlice';

const Page = () => {
  const dispatch = useDispatch();
  const page = useSelector((state) => state.page);

  useEffect(() => {
    // TODO: Implement useEffect logic
  }, []);

  const handleUpdatePage = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updatePage({ ...page, [e.target.name]: e.target.value }));
  };

  const handleUpdatePageType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(updatePageType(e.target.value));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(titleChange(e.target.value));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(descriptionChange(e.target.value));
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(urlChange(e.target.value));
  };

  const handleSaveLocal = () => {
    dispatch(saveLocal());
  };

  const handleAutocompleteTags = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(autocompleteTags(e.target.value));
  };

  const handleSelectSuggestion = (tag: string) => {
    dispatch(selectSuggestion(tag));
  };

  const handleSavePage = () => {
    dispatch(savePage());
  };

  const handleDeletePage = () => {
    dispatch(deletePage());
  };

  const handleLocalVersion = () => {
    dispatch(localVersion());
  };

  const handleDeleteNewerVersion = () => {
    dispatch(deleteNewerVersion());
  };

  return (
    <div>
      {/* TODO: Implement Page component */}
    </div>
  );
};

export default Page;