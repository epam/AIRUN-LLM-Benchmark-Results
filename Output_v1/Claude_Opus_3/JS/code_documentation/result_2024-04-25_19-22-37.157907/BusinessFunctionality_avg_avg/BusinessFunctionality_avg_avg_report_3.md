I have the following application code:

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


Analyze the provided code and outline the business requirements it addresses by following these instructions:
- Functionality: Summarize the main functionality and features of the code.
- User Interaction: Describe expected user interactions with these features.
- Business Objectives: Infer the business objectives met by this code.
- Constraints & Assumptions: Note any constraints or assumptions evident in the code.
- Performance & Scalability: Mention any performance optimizations or scalability considerations.
## Run 3:
### Answer:
Functionality:
- Provides a REST API service for managing various resources like blocks, comments, content, files, menus, modules, sitemaps, themes, settings, and users.
- Implements CRUD operations (create, read, update, delete) for these resources.
- Allows creating and managing menus with a hierarchical structure.
- Supports editing menu items, adding sub-items, and removing items.
- Enables saving and deleting menus.

User Interaction:
- Users can view a list of existing menus and select a menu to edit.
- Users can create a new menu by providing a name.
- In the menu editing panel, users can modify the menu name and area (primary, secondary, footer).
- Users can add, edit, and remove menu items and sub-items using a nested sortable interface.
- Users can edit the text and URL of individual menu items.
- Users can save the changes made to a menu or delete a menu.

Business Objectives:
- Provide a user-friendly interface for managing and organizing website menus.
- Allow flexibility in creating hierarchical menu structures to accommodate different website layouts and navigation requirements.
- Enable efficient management of menu items, including editing and removing items.
- Facilitate consistent data management through a REST API for various website resources.
- Support internationalization by using translated text for user interface elements.

Constraints & Assumptions:
- The code assumes the presence of an AngularJS application module named 'cosmo'.
- The REST API endpoints are assumed to be relative to the current domain.
- The code relies on the AngularJS $resource service for making API requests.
- The menu data is expected to be stored in a specific format (e.g., JSON) on the server.
- The code assumes the availability of certain AngularJS dependencies ($scope, $rootScope, $translate).

Performance & Scalability:
- The code utilizes AngularJS's $resource service for efficient communication with the REST API.
- The menu data is fetched from the server and cached in the application, reducing unnecessary API calls.
- The code employs AngularJS's data binding and scoping mechanisms to efficiently update the user interface based on data changes.
- The hierarchical menu structure is managed using a nested sortable interface, which allows for efficient rendering and manipulation of menu items.
- The code does not include any specific performance optimizations or scalability considerations beyond the use of AngularJS's built-in features.

Overall, the provided code implements a menu management system with a user-friendly interface and a REST API backend. It allows users to create, edit, and delete menus, as well as manage menu items in a hierarchical structure. The code aims to meet the business objectives of providing flexible menu organization and efficient data management for a website. However, it relies on certain assumptions and constraints, such as the presence of specific AngularJS dependencies and the structure of the REST API endpoints.

### Tokens: {'input_tokens': 3977, 'output_tokens': 651}
### Execution time: 32.55970215797424
