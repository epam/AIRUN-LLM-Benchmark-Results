import axios from 'axios';

const API_BASE_URL = 'api/';

const apiService = {
  getBlocks: async (blockID) => {
    const response = await axios.get(`${API_BASE_URL}blocks/${blockID}`);
    return response.data;
  },

  updateBlock: async (blockID, data) => {
    const response = await axios.put(`${API_BASE_URL}blocks/${blockID}`, data);
    return response.data;
  },

  getComments: async (commentID) => {
    const response = await axios.get(`${API_BASE_URL}comments/${commentID}`);
    return response.data;
  },

  updateComment: async (commentID, data) => {
    const response = await axios.put(`${API_BASE_URL}comments/${commentID}`, data);
    return response.data;
  },

  getContent: async (contentID) => {
    const response = await axios.get(`${API_BASE_URL}content/${contentID}`);
    return response.data;
  },

  createContent: async (data) => {
    const response = await axios.post(`${API_BASE_URL}content/`, data);
    return response.data;
  },

  updateContent: async (contentID, data) => {
    const response = await axios.put(`${API_BASE_URL}content/${contentID}`, data);
    return response.data;
  },

  deleteContent: async (contentID) => {
    const response = await axios.delete(`${API_BASE_URL}content/${contentID}`);
    return response.data;
  },

  getContentExtras: async (contentID) => {
    const response = await axios.get(`${API_BASE_URL}content/${contentID}/extras/`);
    return response.data;
  },

  getContentRevisions: async (contentID, revisionID) => {
    const response = await axios.get(`${API_BASE_URL}content/${contentID}/revisions/${revisionID}`);
    return response.data;
  },

  updateContentRevision: async (contentID, revisionID, data) => {
    const response = await axios.put(`${API_BASE_URL}content/${contentID}/revisions/${revisionID}`, data);
    return response.data;
  },

  getContentTags: async (contentID) => {
    const response = await axios.get(`${API_BASE_URL}content/${contentID}/tags/`);
    return response.data;
  },

  getFiles: async (fileID) => {
    const response = await axios.get(`${API_BASE_URL}files/${fileID}`);
    return response.data;
  },

  updateFile: async (fileID, data) => {
    const response = await axios.put(`${API_BASE_URL}files/${fileID}`, data);
    return response.data;
  },

  getMenus: async (menuID) => {
    const response = await axios.get(`${API_BASE_URL}menus/${menuID}`);
    return response.data;
  },

  updateMenu: async (menuID, data) => {
    const response = await axios.put(`${API_BASE_URL}menus/${menuID}`, data);
    return response.data;
  },

  getModules: async (moduleID) => {
    const response = await axios.get(`${API_BASE_URL}modules/${moduleID}`);
    return response.data;
  },

  updateModule: async (moduleID, data) => {
    const response = await axios.put(`${API_BASE_URL}modules/${moduleID}`, data);
    return response.data;
  },

  getSitemaps: async () => {
    const response = await axios.get(`${API_BASE_URL}sitemaps/`);
    return response.data;
  },

  getThemes: async (themeID) => {
    const response = await axios.get(`${API_BASE_URL}themes/${themeID}`);
    return response.data;
  },

  updateTheme: async (themeID, data) => {
    const response = await axios.put(`${API_BASE_URL}themes/${themeID}`, data);
    return response.data;
  },

  getSettings: async () => {
    const response = await axios.get(`${API_BASE_URL}settings/`);
    return response.data;
  },

  updateSettings: async (data) => {
    const response = await axios.put(`${API_BASE_URL}settings/`, data);
    return response.data;
  },

  getUsers: async (userID) => {
    const response = await axios.get(`${API_BASE_URL}users/${userID}`);
    return response.data;
  },

  updateUser: async (userID, data) => {
    const response = await axios.put(`${API_BASE_URL}users/${userID}`, data);
    return response.data;
  }
};

export default apiService;