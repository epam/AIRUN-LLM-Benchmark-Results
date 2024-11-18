import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

export interface PageState {
  id: string;
  title: string;
  description: string;
  header: string;
  subheader: string;
  featured: string | null;
  body: string;
  url: string;
  type: string;
  published: string;
  published_date: number;
  author: string;
  tags: string[];
  extras: { [key: string]: any };
  misc: {};
  newerVersion: boolean;
  autoURL: boolean;
  suggestions: string[];
  confirm: boolean;
  scheduleDate: string;
}

const initialState: PageState = {
  id: nanoid(),
  title: '',
  description: '',
  header: '',
  subheader: '',
  featured: null,
  body: '',
  url: '',
  type: '',
  published: 'Y',
  published_date: Math.round(+new Date().getTime() / 1000),
  author: '',
  tags: [],
  extras: {},
  misc: {},
  newerVersion: false,
  autoURL: false,
  suggestions: [],
  confirm: false,
  scheduleDate: new Date().toISOString(),
};

export const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    updatePage: (state, action: PayloadAction<PageState>) => {
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.url = action.payload.url;
      state.type = action.payload.type;
      state.tags = action.payload.tags;
    },
    updatePageType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
    titleChange: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
      if (state.url === '/new' || state.url === 'new' || !state.url) {
        state.autoURL = true;
      }
      if (state.autoURL) {
        state.url = state.title
          .toLowerCase()
          .replace(/ /g, '-')
          .replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
      }
    },
    descriptionChange: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    urlChange: (state, action: PayloadAction<string>) => {
      state.url = action.payload;
    },
    saveLocal: (state) => {
      state.title = state.title;
      state.description = state.description;
      state.url = state.url;
      state.type = state.type;
    },
    autocompleteTags: (state, action: PayloadAction<string>) => {
      const tag = state.tags[state.tags.length - 1];
      if (tag) {
        // TODO: Implement autocomplete logic
      } else {
        state.suggestions = [];
      }
    },
    selectSuggestion: (state, action: PayloadAction<string>) => {
      const tags = [...state.tags];
      tags[tags.length - 1] = action.payload;
      tags[tags.length] = '';
      state.tags = tags;
      state.suggestions = [];
    },
    savePage: (state) => {
      // TODO: Implement save page logic
    },
    deletePage: (state) => {
      // TODO: Implement delete page logic
    },
    localVersion: (state) => {
      // TODO: Implement local version logic
    },
    deleteNewerVersion: (state) => {
      // TODO: Implement delete newer version logic
    },
  },
});

export const {
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
} = pageSlice.actions;

export default pageSlice.reducer;