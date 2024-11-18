import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setPageTitle, setPageDescription } from './pageSlice';

const Page: React.FC = () => {
  const dispatch = useAppDispatch();
  const page = useAppSelector((state) => state.page);
  const [localTitle, setLocalTitle] = useState(page.title);
  const [localDescription, setLocalDescription] = useState(page.description);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setLocalTitle(newTitle);
    dispatch(setPageTitle(newTitle));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setLocalDescription(newDescription);
    dispatch(setPageDescription(newDescription));
  };

  // Define other handlers here

  return (
    <div>
      <input type="text" value={localTitle} onChange={handleTitleChange} />
      <textarea value={localDescription} onChange={handleDescriptionChange} />
      {/* Render other page elements here */}
    </div>
  );
};

export default Page;