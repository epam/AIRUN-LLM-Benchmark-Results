import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const restApi = createApi({
  reducerPath: 'restApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'api/' }),
  endpoints: (builder) => ({
    getBlocks: builder.query({
      query: () => 'blocks',
    }),
    getBlockById: builder.query({
      query: (blockID) => `blocks/${blockID}`,
    }),
    updateBlock: builder.mutation({
      query: ({ blockID, data }) => ({
        url: `blocks/${blockID}`,
        method: 'PUT',
        body: data,
      }),
    }),
    getBlockRequirements: builder.query({
      query: (blockID) => `blocks/${blockID}/requirements`,
    }),
    getBlockRequirementById: builder.query({
      query: ({ blockID, requirementID }) => `blocks/${blockID}/requirements/${requirementID}`,
    }),
    updateBlockRequirement: builder.mutation({
      query: ({ blockID, requirementID, data }) => ({
        url: `blocks/${blockID}/requirements/${requirementID}`,
        method: 'PUT',
        body: data,
      }),
    }),
    getComments: builder.query({
      query: () => 'comments',
    }),
    getCommentById: builder.query({
      query: (commentID) => `comments/${commentID}`,
    }),
    updateComment: builder.mutation({
      query: ({ commentID, data }) => ({
        url: `comments/${commentID}`,
        method: 'PUT',
        body: data,
      }),
    }),
    getContent: builder.query({
      query: () => 'content',
    }),
    getContentById: builder.query({
      query: (contentID) => `content/${contentID}`,
    }),
    updateContent: builder.mutation({
      query: ({ contentID, data }) => ({
        url: `content/${contentID}`,
        method: 'PUT',
        body: data,
      }),
    }),
    getContentExtras: builder.query({
      query: (contentID) => `content/${contentID}/extras`,
    }),
    getContentRevisions: builder.query({
      query: (contentID) => `content/${contentID}/revisions`,
    }),
    getContentRevisionById: builder.query({
      query: ({ contentID, revisionID }) => `content/${contentID}/revisions/${revisionID}`,
    }),
    updateContentRevision: builder.mutation({
      query: ({ contentID, revisionID, data }) => ({
        url: `content/${contentID}/revisions/${revisionID}`,
        method: 'PUT',
        body: data,
      }),
    }),
    getContentRevisionExtras: builder.query({
      query: ({ contentID, revisionID }) => `content/${contentID}/revisions/${revisionID}/extras`,
    }),
    getContentTags: builder.query({
      query: (contentID) => `content/${contentID}/tags`,
    }),
    getFiles: builder.query({
      query: () => 'files',
    }),
    getFileById: builder.query({
      query: (fileID) => `files/${fileID}`,
    }),
    updateFile: builder.mutation({
      query: ({ fileID, data }) => ({
        url: `files/${fileID}`,
        method: 'PUT',
        body: data,
      }),
    }),
    getFileTags: builder.query({
      query: (fileID) => `files/${fileID}/tag`,
    }),
    updateFileTag: builder.mutation({
      query: ({ fileID, tag, data }) => ({
        url: `files/${fileID}/tag/${tag}`,
        method: 'PUT',
        body: data,
      }),
    }),
    getMenus: builder.query({
      query: () => 'menus',
    }),
    getMenuById: builder.query({
      query: (menuID) => `menus/${menuID}`,
    }),
    updateMenu: builder.mutation({
      query: ({ menuID, data }) => ({
        url: `menus/${menuID}`,
        method: 'PUT',
        body: data,
      }),
    }),
    getModules: builder.query({
      query: () => 'modules',
    }),
    getModuleById: builder.query({
      query: (moduleID) => `modules/${moduleID}`,
    }),
    updateModule: builder.mutation({
      query: ({ moduleID, data }) => ({
        url: `modules/${moduleID}`,
        method: 'PUT',
        body: data,
      }),
    }),
    getSitemaps: builder.query({
      query: () => 'sitemaps',
    }),
    getThemes: builder.query({
      query: () => 'themes',
    }),
    getThemeById: builder.query({
      query: (themeID) => `themes/${themeID}`,
    }),
    updateTheme: builder.mutation({
      query: ({ themeID, data }) => ({
        url: `themes/${themeID}`,
        method: 'PUT',
        body: data,
      }),
    }),
    getSettings: builder.query({
      query: () => 'settings',
    }),
    updateSettings: builder.mutation({
      query: (data) => ({
        url: 'settings',
        method: 'PUT',
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: () => 'users',
    }),
    getUserById: builder.query({
      query: (userID) => `users/${userID}`,
    }),
    updateUser: builder.mutation({
      query: ({ userID, data }) => ({
        url: `users/${userID}`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetBlocksQuery,
  useGetBlockByIdQuery,
  useUpdateBlockMutation,
  useGetBlockRequirementsQuery,
  useGetBlockRequirementByIdQuery,
  useUpdateBlockRequirementMutation,
  useGetCommentsQuery,
  useGetCommentByIdQuery,
  useUpdateCommentMutation,
  useGetContentQuery,
  useGetContentByIdQuery,
  useUpdateContentMutation,
  useGetContentExtrasQuery,
  useGetContentRevisionsQuery,
  useGetContentRevisionByIdQuery,
  useUpdateContentRevisionMutation,
  useGetContentRevisionExtrasQuery,
  useGetContentTagsQuery,
  useGetFilesQuery,
  useGetFileByIdQuery,
  useUpdateFileMutation,
  useGetFileTagsQuery,
  useUpdateFileTagMutation,
  useGetMenusQuery,
  useGetMenuByIdQuery,
  useUpdateMenuMutation,
  useGetModulesQuery,
  useGetModuleByIdQuery,
  useUpdateModuleMutation,
  useGetSitemapsQuery,
  useGetThemesQuery,
  useGetThemeByIdQuery,
  useUpdateThemeMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} = restApi;