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

## Run 3:
### Answer:
## store.ts

```typescript
import { configureStore } from '@reduxjs/toolkit';
import menuReducer from './features/menu/menuSlice';

export const store = configureStore({
  reducer: {
    menu: menuReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

```

## App.tsx

```typescript
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import MenuManager from './features/menu/MenuManager';

function App() {
  return (
    <Provider store={store}>
      <MenuManager />
    </Provider>
  );
}

export default App;

```

## MenuManager.tsx

```typescript
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectMenus,
  selectCurrentMenu,
  selectMenuPanel,
  createMenu,
  selectMenu,
  updateMenu,
  deleteMenu,
} from './menuSlice';
import MenuList from './MenuList';
import MenuEditor from './MenuEditor';

const MenuManager = () => {
  const dispatch = useDispatch();
  const menus = useSelector(selectMenus);
  const currentMenu = useSelector(selectCurrentMenu);
  const panel = useSelector(selectMenuPanel);
  const [newName, setNewName] = useState('');

  const handleCreateMenu = () => {
    if (newName) {
      dispatch(createMenu(newName));
      setNewName('');
    }
  };

  const handleSelectMenu = (menu) => {
    dispatch(selectMenu(menu));
  };

  const handleSaveMenu = (updatedMenu) => {
    dispatch(updateMenu(updatedMenu));
  };

  const handleDeleteMenu = () => {
    dispatch(deleteMenu(currentMenu.id));
  };

  return (
    <div>
      {panel === 'manage' && (
        <div>
          <h2>Menus</h2>
          <button onClick={() => setNewName('')}>
            {newName ? 'Close' : 'New Menu'}
          </button>
          {newName && (
            <div>
              <label htmlFor="name">Menu Name:</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <button onClick={handleCreateMenu}>Add</button>
            </div>
          )}
          <MenuList menus={menus} onSelectMenu={handleSelectMenu} />
        </div>
      )}
      {panel === 'edit' && (
        <MenuEditor
          menu={currentMenu}
          onSave={handleSaveMenu}
          onDelete={handleDeleteMenu}
        />
      )}
    </div>
  );
};

export default MenuManager;

```

## MenuList.tsx

```typescript
import React from 'react';

interface MenuListProps {
  menus: { id: number; name: string }[];
  onSelectMenu: (menu: { id: number; name: string }) => void;
}

const MenuList: React.FC<MenuListProps> = ({ menus, onSelectMenu }) => {
  return (
    <ul>
      {menus.map((menu) => (
        <li key={menu.id} onClick={() => onSelectMenu(menu)}>
          {menu.name || 'N/A'}
        </li>
      ))}
    </ul>
  );
};

export default MenuList;

```

## MenuEditor.tsx

```typescript
import React, { useState } from 'react';
import { nanoid } from 'nanoid';

interface MenuItem {
  id: string;
  title: string;
  url: string;
  items: MenuItem[];
}

interface MenuEditorProps {
  menu: {
    id: number;
    name: string;
    area: string;
    menu: string;
  };
  onSave: (menu: MenuEditorProps['menu']) => void;
  onDelete: () => void;
}

const MenuEditor: React.FC<MenuEditorProps> = ({ menu, onSave, onDelete }) => {
  const [name, setName] = useState(menu.name);
  const [area, setArea] = useState(menu.area);
  const [list, setList] = useState<MenuItem[]>(JSON.parse(menu.menu || '[]'));
  const [editLink, setEditLink] = useState(false);
  const [editLinkText, setEditLinkText] = useState('');
  const [editLinkURL, setEditLinkURL] = useState('');
  const [currentlyEditingLink, setCurrentlyEditingLink] = useState<MenuItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleRemove = (index: number, parent?: MenuItem) => {
    if (parent) {
      parent.items.splice(index, 1);
      setList([...list]);
    } else {
      list.splice(index, 1);
      setList([...list]);
    }
  };

  const handleNewSubItem = (parent: MenuItem) => {
    parent.items.push({
      id: nanoid(),
      title: `${parent.title}.${parent.items.length + 1}`,
      url: '',
      items: [],
    });
    setList([...list]);
  };

  const handleEditLink = (item: MenuItem) => {
    setEditLink(true);
    setCurrentlyEditingLink(item);
    setEditLinkText(item.title);
    setEditLinkURL(item.url);
  };

  const handleUpdateLink = () => {
    if (currentlyEditingLink) {
      currentlyEditingLink.title = editLinkText;
      currentlyEditingLink.url = editLinkURL;
      setList([...list]);
    }
  };

  const handleSave = () => {
    onSave({
      ...menu,
      name,
      area,
      menu: JSON.stringify(list),
    });
  };

  return (
    <div>
      <h2>Editing: {name}</h2>
      <button onClick={() => setConfirmDelete(true)}>Delete Menu</button>
      <button onClick={handleSave}>Save Menu</button>
      <div>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="area">Area:</label>
          <select value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="footer">Footer</option>
          </select>
        </div>
        <ul>
          {list.map((item, index) => (
            <li key={item.id}>
              <div>
                {item.title}
                <div>
                  <a onClick={() => handleEditLink(item)}>Edit</a>
                  <a onClick={() => handleNewSubItem(item)}>Add</a>
                  <a onClick={() => handleRemove(index)}>Remove</a>
                </div>
              </div>
              {item.items.length > 0 && (
                <ul>
                  {item.items.map((subItem, subIndex) => (
                    <li key={subItem.id}>
                      <div>
                        {subItem.title}
                        <div>
                          <a onClick={() => handleEditLink(subItem)}>Edit</a>
                          <a onClick={() => handleNewSubItem(subItem)}>Add</a>
                          <a onClick={() => handleRemove(subIndex, item)}>Remove</a>
                        </div>
                      </div>
                      {subItem.items.length > 0 && (
                        <ul>
                          {subItem.items.map((subItem1, subIndex1) => (
                            <li key={subItem1.id}>
                              <div>
                                {subItem1.title}
                                <div>
                                  <a onClick={() => handleEditLink(subItem1)}>Edit</a>
                                  <a onClick={() => handleRemove(subIndex1, subItem)}>Remove</a>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        {editLink && (
          <div>
            <div>
              <label htmlFor="text">Link Text:</label>
              <input
                type="text"
                value={editLinkText}
                onChange={(e) => setEditLinkText(e.target.value)}
                onBlur={handleUpdateLink}
              />
            </div>
            <div>
              <label htmlFor="url">Link URL:</label>
              <input
                type="text"
                value={editLinkURL}
                onChange={(e) => setEditLinkURL(e.target.value)}
                onBlur={handleUpdateLink}
              />
            </div>
          </div>
        )}
        {confirmDelete && (
          <div>
            <p>Are you sure you want to delete this menu?</p>
            <button onClick={() => { setConfirmDelete(false); onDelete(); }}>Yes</button>
            <button onClick={() => setConfirmDelete(false)}>No</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuEditor;

```

## menuSlice.ts

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface MenuItem {
  id: string;
  title: string;
  url: string;
  items: MenuItem[];
}

interface MenuState {
  menus: { id: number; name: string }[];
  currentMenu: {
    id: number;
    name: string;
    area: string;
    menu: string;
  } | null;
  panel: 'manage' | 'edit';
}

const initialState: MenuState = {
  menus: [],
  currentMenu: null,
  panel: 'manage',
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    getMenus: (state, action: PayloadAction<{ id: number; name: string }[]>) => {
      state.menus = action.payload;
    },
    createMenu: (state, action: PayloadAction<string>) => {
      const newMenu = {
        id: state.menus.length + 1,
        name: action.payload,
      };
      state.menus.push(newMenu);
    },
    selectMenu: (state, action: PayloadAction<{ id: number; name: string }>) => {
      state.currentMenu = {
        ...action.payload,
        area: 'primary',
        menu: JSON.stringify([{ id: nanoid(), title: 'Link', url: '', items: [] }]),
      };
      state.panel = 'edit';
    },
    updateMenu: (state, action: PayloadAction<MenuState['currentMenu']>) => {
      if (state.currentMenu) {
        state.currentMenu = action.payload;
        const menuIndex = state.menus.findIndex((menu) => menu.id === action.payload.id);
        if (menuIndex !== -1) {
          state.menus[menuIndex].name = action.payload.name;
        }
      }
    },
    deleteMenu: (state, action: PayloadAction<number>) => {
      state.menus = state.menus.filter((menu) => menu.id !== action.payload);
      state.currentMenu = null;
      state.panel = 'manage';
    },
  },
});

export const { getMenus, createMenu, selectMenu, updateMenu, deleteMenu } = menuSlice.actions;

export const selectMenus = (state: RootState) => state.menu.menus;
export const selectCurrentMenu = (state: RootState) => state.menu.currentMenu;
export const selectMenuPanel = (state: RootState) => state.menu.panel;

export default menuSlice.reducer;

``` 


### Tokens: {'input_tokens': 3754, 'output_tokens': 2901}
### Execution time: 77.00712609291077
