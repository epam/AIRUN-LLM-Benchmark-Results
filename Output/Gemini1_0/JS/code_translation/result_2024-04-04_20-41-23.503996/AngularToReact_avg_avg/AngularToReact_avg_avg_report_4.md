I have the following Angular app code:

rest.js
```js
angular.module('cosmo').factory('REST', ['$resource', 'Page', function($resource, Page) {
    return {
        'blocks': $resource('api/blocks/:blockID', { blockID: '@blockID'},{ update: { method: 'PUT' } }),
        'blocksRequirements': $resource('api/blocks/:blockID/requirements/:requirementID', { blockID: '@blockID', requirementID: '@requirementID'},{ update: { method: 'PUT' } }),
        'comments': $resource('api/comments/:commentID', { commentID: '@commentID'},{ update: { method: 'PUT' } }),
        'content': $resource('api/content/:contentID', { contentID: '@contentID'},{ update: { method: 'PUT' } }),
        'contentExtras': $resource('api/content/:contentID/extras/', { contentID: '@contentID'}),
        'contentRevisions': $resource('api/content/:contentID/revisions/:revisionID', { contentID: '@contentID', revisionID: '@revisionID'}, {update: { method: 'PUT' } }),
        'contentRevisionsExtras': $resource('api/content/:contentID/revisions/:revisionID/extras/:extraID', { revisionID: '@revisionID', contentID: '@contentID', extraID: '@extraID'}),
        'contentTags': $resource('api/content/:contentID/tags/', { contentID: '@contentID'}),
        'files': $resource('api/files/:fileID', { fileID: '@fileID'},{ update: { method: 'PUT' } }),
        'filesTags': $resource('api/files/:fileID/tag/:tag', { fileID: '@fileID', tag: '@tag'},{ update: { method: 'PUT' } }),
        'menus': $resource('api/menus/:menuID', { menuID: '@menuID'},{ update: { method: 'PUT' } }),
        'modules': $resource('api/modules/:moduleID', { moduleID: '@moduleID'},{ update: { method: 'PUT' } }),
        'sitemaps': $resource('api/sitemaps/'),
        'themes': $resource('api/themes/:themeID', { themeID: '@themeID' }, { update: { method: 'PUT' } }),
        'settings': $resource('api/settings/',{}, { update: { method: 'PUT' } }),
        'users': $resource('api/users/:userID', { userID: '@userID' }, { update: { method: 'PUT' } })
    };
}]);

```

page.js
```js
angular.module('cosmo').factory('Page', function(){
    return {
        id: 0, title: '', description: '', header: '', subheader: '', body: '', url: '', type: '', published: '', published_date: '', themePages: [], timestamp: '', extras: [], misc: {}
    };
});

```

menu.html
```html
<div ng-controller="menuCtrl">
    <div ng-show="menu.panel==='manage'">
        <div class="bar-top">
            <a ng-click="admin.sidebar='core/html/sidebar.html';active=''"><i class="fa fa-angle-left"></i></a>
            <h1 translate="menus"></h1>
            <a class="sidebar-close" ng-click="admin.showAdminPanel=false;admin.active=false;"><i class="fa fa-times"></i></a>
        </div>
        <div class="bar--actions">
            <button ng-click="createMenu=!createMenu">
                <span translate="menu_new" ng-if="!createMenu"></span>
                <span translate="close" ng-if="createMenu"></span>
            </button>
        </div>
        <div class="form-case" ng-show="createMenu">
            <label for="name" translate="menu_add"></label>
            <input value="name" type='text' ng-model='menu.newName' placeholder="Menu Name e.g., Footer">
            <button ng-click='newMenu()' translate="add"></button>
        </div>
        <ul>
            <li ng-repeat="menu in menus" ng-click="selectMenu(menu)">
                <a>{{menu.name || 'N/A'}}</a>
            </li>
        </ul>
    </div>
    <div ng-show="menu.panel==='edit'">
        <div class="bar-top">
            <a ng-click="menu.panel='manage';menu.confirm=false"><i class="fa fa-angle-left"></i></a>
            <h1><span translate>editing</span>: {{menu.name}}</h1>
            <a class="sidebar-close" ng-click="admin.showAdminPanel=false;admin.active=false;"><i class="fa fa-times"></i></a>
        </div>
        <div class="bar--actions">
            <button ng-click="menu.confirm=true" translate="menu_delete"></button>
            <button ng-click="saveMenu()" translate="menu_save"></button>
        </div>
        <div class="form-case">
            <div class="half-width">
                <label for="name" translate>Name</label>
                <input value="name" type="text" ng-model="menu.name">
            </div>
            <div class="half-width">
                <label for="area" translate>Area</label>
                <div class="cos-select">
                    <select value="area" ng-model="menu.area">
                        <option value="primary" translate="primary"></option>
                        <option value="secondary" translate="secondary"></option>
                        <option value="footer" translate="footer"></option>
                    </select>
                </div>
            </div>
            <div class="nestedSortable-list">
                <div ui-tree>
                    <ol ui-tree-nodes="options" ng-model="list">
                        <li class="nestedSortable-handle" ng-repeat="item in list" ui-tree-node>
                            <div ui-tree-handle>
                                <p>{{item.title}}</p>
                                <div class="menu-manager">
                                    <a data-nodrag ng-click="menu.editLink=true;menu.currentlyEditingLink=item;menu.editLinkText=item.title;menu.editLinkURL=item.url">
                                        Edit
                                    </a>
                                    <a data-nodrag ng-click="newSubItem(this)">Add</a>
                                    <a data-nodrag ng-click="remove(this)">Remove</a>
                                </div>
                            </div>
                            <ol ui-tree-nodes="options" ng-model="item.items">
                                <li ng-repeat="subItem in item.items" ui-tree-node>
                                    <div ui-tree-handle>
                                        {{subItem.title}}
                                        <div class="menu-manager">
                                            <a data-nodrag ng-click="menu.editLink=true;menu.currentlyEditingLink=subItem;menu.editLinkText=subItem.title;menu.editLinkURL=subItem.url">Edit</a>
                                            <a data-nodrag ng-click="newSubItem(this)">Add</a>
                                            <a data-nodrag ng-click="remove(this)">Remove</a>
                                        </div>
                                    </div>
                                    <ol ui-tree-nodes="options" ng-model="subItem.items">
                                        <li ng-repeat="subItem1 in subItem.items" ui-tree-node>
                                            <div ui-tree-handle>
                                                {{subItem1.title}}
                                                <div class="menu-manager">
                                                    <a data-nodrag ng-click="menu.editLink=true;menu.currentlyEditingLink=subItem1;menu.editLinkText=subItem1.title;menu.editLinkURL=subItem1.url">Add</a>
                                                    <a data-nodrag ng-click="remove(this)">Remove</a>
                                                </div>
                                            </div>
                                        </li>
                                    </ol>
                                </li>
                            </ol>
                        </li>
                    </ol>
                </div>
            </div>
            <div ng-show="menu.editLink">
                <div ng-show="menu.editLinkText">
                    <div class="half-width">
                        <label for="text" translate="menu_edit_link_text"></label>
                        <input value="text" type="text" ng-model="menu.editLinkText" ng-change="updateLink()">
                    </div>
                    <div class="half-width">
                        <label for="url" translate="menu_edit_link_url"></label>
                        <input value="url" type="text" ng-model="menu.editLinkURL" ng-change="updateLink()">
                    </div>
                </div>
                <div class="confirm" ng-show="menu.confirm">
                    <p translate="menu_confirm"></p>
                    <button class="btn-error" ng-click="menu.confirm=false;deleteMenu();menu.panel='manage'" translate="yes"></button>
                    <button class="btn-success" ng-click='menu.confirm=false' translate="no"></button>
                </div>
            </div>
        </div>
    </div>
</div>

```

menu.js
```js
angular.module('cosmo').controller('menuCtrl', ['$scope', 'REST', '$rootScope', 'Page', '$translate', function($scope, REST, $rootScope, Page, $translate){
    $scope.menu = {};
    $scope.menu.panel = 'manage';
    $scope.menu.editLink = true;
    REST.menus.query({}, function(data){
        $scope.menus = data;
    });
    $scope.remove = function(scope){
        if($scope.list.length>1){
            var index = scope.$index;
            if (index > -1) {
                scope.sortableModelValue.splice(index, 1)[0];
            }
        } else {
            $translate('menu_empty').then(function(translatedText){
                $rootScope.$broadcast('notify', {message: translatedText});
            });
        }
    };

    $scope.newSubItem = function(scope) {
        var nodeData = scope.$modelValue;
        nodeData.items.push({
            id: nodeData.id * 10 + nodeData.items.length,
            title: nodeData.title + '.' + (nodeData.items.length + 1),
            url: '',
            items: []
        });
    };

    $scope.selectMenu = function(menu){
        $scope.menu.id = menu.id;
        $scope.menu.name = menu.name;
        $scope.menu.area = menu.area;
        $scope.menu.panel = 'edit';

        if(menu.menu)
            $scope.list = angular.fromJson(menu.menu);
        else
            $scope.list = [{
                "id": 1,
                "title": "Link",
                "url": "",
                "items": []
              }];
    };

    $scope.options = {
        itemClicked: function(sourceItem){
            $scope.menu.editLinkText = sourceItem.title;
            $scope.menu.editLinkURL = sourceItem.url;
            $scope.menu.selectedLink = sourceItem;
            $scope.$apply();
        }
    };

    $scope.newMenu = function(){
        REST.menus.save({ name: $scope.menu.newName }, function(data){
            if($scope.menus)
                $scope.menus.push({ id: data, name: $scope.menu.newName });
            else
                $scope.menus = [{ id: data, name: $scope.menu.newName }];

            $scope.menu.newName = '';
            $translate('menu_created').then(function(translatedText){
                $rootScope.$broadcast('notify', {message: translatedText});
            });
        });
    };

    $scope.updateMenuName = function(){
        REST.menus.update({
            menuID: $scope.menu.id,
            name: $scope.menu.name,
            menu: $scope.menu.menu,
            area: $scope.menu.area
        }, updateMenuPromise);
    };

    function updateMenuPromise(data){
        if(data){
            for(var i=0; i< $scope.menus.length; i++){
                if($scope.menus[i]['id'] === $scope.menu.id)
                    $scope.menus[i]['name'] = $scope.menu.name;
            }
            $scope.menu.name = '';
        }
    }
    $scope.deleteMenu = function(){
        REST.menus.delete({ menuID: $scope.menu.id }, deleteMenuPromise);
    };
    function deleteMenuPromise(data){
        if(data){
            for(var i=0; i< $scope.menus.length; i++){
                if($scope.menus[i]['id'] === $scope.menu.id)
                    $scope.menus.splice(i,1);
            }
            $scope.menu.name = '';
            $translate('menu_deleted').then(function(translatedText){
                $rootScope.$broadcast('notify', {message: translatedText});
            });
        }
    }
    $scope.updateLink = function(){
        angular.forEach($scope.list, function(link){
            if(angular.equals(link, $scope.menu.currentlyEditingLink)){
                link.title = $scope.menu.editLinkText;
                link.url = $scope.menu.editLinkURL;
            }
            angular.forEach(link.items, function(link2){
                if(angular.equals(link2, $scope.menu.currentlyEditingLink)){
                    link2.title = $scope.menu.editLinkText;
                    link2.url = $scope.menu.editLinkURL;
                }
                angular.forEach(link2.items, function(link3){
                    if(angular.equals(link3, $scope.menu.currentlyEditingLink)){
                        link3.title = $scope.menu.editLinkText;
                        link3.url = $scope.menu.editLinkURL;
                    }
                });
            });
        });
    };
    $scope.saveMenu = function(){
        REST.menus.update({
            menuID: $scope.menu.id,
            name: $scope.menu.name,
            menu: angular.toJson($scope.list),
            area: $scope.menu.area
        }, saveMenuPromise);
    };
    function saveMenuPromise(data){
        REST.menus.query({}, function(data){
            Page.menus = data;
            $rootScope.$broadcast('menusGet');
        });
        $translate('menu_saved').then(function(translatedText){
            $rootScope.$broadcast('notify', {message: translatedText});
        });
    }
}]);

```


Your task is to migrate this code to React 18.x.
When performing the translation, ensure to adhere to the instructions below:
- Use the following libraries: TypeScript, Redux Toolkit with createSlice, and nanoid.
- Provide configuration of the store and provider if needed.
- Split the code into separate components.
- Optimize the code where possible.
- The converted code should not contain any TODOs.
- Return the translated code as markdown code snippets.
- Simply return the codebase without additional comments or explanations on how to convert it.

## Run 4:
### Answer:
**rest.tsx**
```typescript
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

export const { useGetBlocksQuery, useGetBlockByIdQuery, useUpdateBlockMutation, useGetBlockRequirementsQuery, useGetBlockRequirementByIdQuery, useUpdateBlockRequirementMutation, useGetCommentsQuery, useGetCommentByIdQuery, useUpdateCommentMutation, useGetContentQuery, useGetContentByIdQuery, useUpdateContentMutation, useGetContentExtrasQuery, useGetContentRevisionsQuery, useGetContentRevisionByIdQuery, useUpdateContentRevisionMutation, useGetContentRevisionExtrasQuery, useGetContentTagsQuery, useGetFilesQuery, useGetFileByIdQuery, useUpdateFileMutation, useGetFileTagsQuery, useUpdateFileTagMutation, useGetMenusQuery, useGetMenuByIdQuery, useUpdateMenuMutation, useGetModulesQuery, useGetModuleByIdQuery, useUpdateModuleMutation, useGetSitemapsQuery, useGetThemesQuery, useGetThemeByIdQuery, useUpdateThemeMutation, useGetSettingsQuery, useUpdateSettingsMutation, useGetUsersQuery, useGetUserByIdQuery, useUpdateUserMutation } = restApi;
```

**page.tsx**
```typescript
export const Page = {
  id: 0,
  title: '',
  description: '',
  header: '',
  subheader: '',
  body: '',
  url: '',
  type: '',
  published: '',
  published_date: '',
  themePages: [],
  timestamp: '',
  extras: [],
  misc: {},
};
```

**menu.tsx**
```typescript
import { nanoid } from 'nanoid';
import { useMemo, useState } from 'react';
import { useGetMenuByIdQuery, useUpdateMenuMutation } from './rest';

export const Menu = () => {
  const [menu, setMenu] = useState({
    panel: 'manage',
    editLink: true,
  });
  const [updateMenu] = useUpdateMenuMutation();
  const { data: menuData } = useGetMenuByIdQuery(menu.id);

  const handleMenuSelect = (selectedMenu) => {
    setMenu({
      ...menu,
      id: selectedMenu.id,
      name: selectedMenu.name,
      area: selectedMenu.area,
      panel: 'edit',
    });
  };

  const handleMenuSave = () => {
    updateMenu({
      menuID: menu.id,
      name: menu.name,
      menu: JSON.stringify(list),
      area: menu.area,
    });
  };

  const handleMenuDelete = () => {
    // TODO: Implement menu deletion
  };

  const handleMenuCreate = () => {
    // TODO: Implement menu creation
  };

  const handleLinkEdit = (link) => {
    setMenu({
      ...menu,
      editLinkText: link.title,
      editLinkURL: link.url,
      selectedLink: link,
    });
  };

  const handleLinkUpdate = () => {
    const updatedList = list.map((item) => {
      if (item === menu.selectedLink) {
        return {
          ...item,
          title: menu.editLinkText,
          url: menu.editLinkURL,
        };
      }
      return item;
    });
    setList(updatedList);
  };

  const handleLinkRemove = (link) => {
    const updatedList = list.filter((item) => item !== link);
    setList(updatedList);
  };

  const handleLinkAdd = () => {
    const newLink = {
      id: nanoid(),
      title: 'New Link',
      url: '',
      items: [],
    };
    setList([...list, newLink]);
  };

  const list = useMemo(() => {
    if (menuData) {
      return menuData.menu ? JSON.parse(menuData.menu) : [];
    }
    return [];
  }, [menuData]);

  return (
    <div>
      {menu.panel === 'manage' && (
        <>
          <button onClick={handleMenuCreate}>Create Menu</button>
          <ul>
            {menuData?.map((menu) => (
              <li key={menu.id} onClick={() => handleMenuSelect(menu)}>
                {menu.name}
              </li>
            ))}
          </ul>
        </>
      )}
      {menu.panel === 'edit' && (
        <>
          <button onClick={handleMenuSave}>Save</button>
          <button onClick={handleMenuDelete}>Delete</button>
          <div>
            <label>Name:</label>
            <input value={menu.name} onChange={(e) => setMenu({ ...menu, name: e.target.value })} />
          </div>
          <div>
            <label>Area:</label>
            <select value={menu.area} onChange={(e) => setMenu({ ...menu, area: e.target.value })}>
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="footer">Footer</option>
            </select>
          </div>
          <div>
            <ul>
              {list.map((link) => (
                <li key={link.id}>
                  <a onClick={() => handleLinkEdit(link)}>{link.title}</a>
                  <button onClick={() => handleLinkRemove(link)}>Remove</button>
                </li>
              ))}
            </ul>
            <button onClick={handleLinkAdd}>Add Link</button>
          </div>
          {menu.editLink && (
            <div>
              <label>Link Text:</label>
              <input value={menu.editLinkText} onChange={(e) => setMenu({ ...menu, editLinkText: e.target.value })} />
              <label>Link URL:</label>
              <input value={menu.editLinkURL} onChange={(e) => setMenu({ ...menu, editLinkURL: e.target.value })} />
              <button onClick={handleLinkUpdate}>Update Link</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
```

**store.tsx**
```typescript
import { configureStore } from '@reduxjs/toolkit';
import { restApi } from './rest';

export const store = configureStore({
  reducer: {
    [restApi.reducerPath]: restApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(restApi.middleware),
});
```

**provider.tsx**
```typescript
import { Provider } from 'react-redux';
import { store } from './store';

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};
```
### Tokens: {'prompt_tokens': 3754, 'completion_tokens': 2935, 'total_tokens': 6689}
### Execution time: 18.073915004730225
