import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

export interface AdminPanelState {
  admin: {
    username: string;
    roleNum: number;
    isUserAdmin: boolean;
    showAdminPanel: boolean;
    active: boolean;
    sidebar: string;
  };
  officialMessage: {
    id: string;
    message: string;
    displayMessage: boolean;
  };
  userInfo: {
    id: string;
    username: string;
    name: string;
    bio: string;
    email: string;
    facebook: string;
    twitter: string;
    photo: string;
    role: string;
  };
}

const initialState: AdminPanelState = {
  admin: {
    username: '',
    roleNum: 0,
    isUserAdmin: false,
    showAdminPanel: false,
    active: false,
    sidebar: 'core/html/sidebar.html',
  },
  officialMessage: {
    id: '',
    message: '',
    displayMessage: false,
  },
  userInfo: {
    id: '',
    username: '',
    name: '',
    bio: '',
    email: '',
    facebook: '',
    twitter: '',
    photo: '',
    role: '',
  },
};

export const adminPanelSlice = createSlice({
  name: 'adminPanel',
  initialState,
  reducers: {
    setAdminInfo: (state, action: PayloadAction<{ username: string; roleNum: number; isUserAdmin: boolean }>) => {
      state.admin.username = action.payload.username;
      state.admin.roleNum = action.payload.roleNum;
      state.admin.isUserAdmin = action.payload.isUserAdmin;
    },
    setOfficialMessage: (state, action: PayloadAction<{ id: string; message: string; displayMessage: boolean }>) => {
      state.officialMessage.id = action.payload.id;
      state.officialMessage.message = action.payload.message;
      state.officialMessage.displayMessage = action.payload.displayMessage;
    },
    setUserInfo: (state, action: PayloadAction<{ id: string; username: string; name: string; bio: string; email: string; facebook: string; twitter: string; photo: string; role: string }>) => {
      state.userInfo.id = action.payload.id;
      state.userInfo.username = action.payload.username;
      state.userInfo.name = action.payload.name;
      state.userInfo.bio = action.payload.bio;
      state.userInfo.email = action.payload.email;
      state.userInfo.facebook = action.payload.facebook;
      state.userInfo.twitter = action.payload.twitter;
      state.userInfo.photo = action.payload.photo;
      state.userInfo.role = action.payload.role;
    },
  },
});

export const { setAdminInfo, setOfficialMessage, setUserInfo } = adminPanelSlice.actions;

export default adminPanelSlice.reducer;