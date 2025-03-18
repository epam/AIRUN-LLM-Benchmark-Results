I have the following application code that needs to describe in a form of technical documentation

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


The documentation should cover the following aspects:
- Overview: A brief introduction to the component, including its purpose and key features.
- Features: A detailed list of the component's features. This should include:
- Props: A table or list describing each prop the component accepts, including the prop's name, type, description, and whether it is optional or required.
- Usage: An example of how to use the component in frontend application, including a sample code snippet.
- Accessibility: A detailed explanation of the accessibility features of the component, including any ARIA roles and attributes used. Explain how these features make the component accessible to users with assistive technologies.
- Conclusion: A brief closing statement summarizing the component's benefits and its contribution to creating a user-friendly, accessible UI.
## Run 1:
### Answer:
## Menu Management Component Documentation

### Overview

This documentation details a menu management component within an AngularJS application. This component allows administrators to create, edit, and delete menus, as well as manage the individual links within each menu. It utilizes various AngularJS features and interacts with a RESTful API for data persistence.

### Features

* **Menu Creation:** Administrators can create new menus by providing a name.
* **Menu Editing:** Existing menus can be renamed and their link structure modified.
* **Menu Deletion:** Menus can be deleted entirely.
* **Link Management:** Within each menu, administrators can:
    * Add new links with titles and URLs.
    * Edit existing link titles and URLs.
    * Delete links.
    * Structure links hierarchically with nested sub-menus.
* **Drag-and-Drop Interface:** The link management interface utilizes drag-and-drop functionality for intuitive reordering and nesting of links.
* **Localization:** The component supports localization through the use of the `$translate` service, allowing for menus and interface elements to be displayed in different languages.

### Technical Breakdown

* **rest.js:** This file defines an AngularJS factory named `REST` which provides access to various RESTful API endpoints using the `$resource` service. These endpoints handle operations related to blocks, comments, content, files, menus, modules, sitemaps, themes, settings, and users.
* **page.js:** This file defines an AngularJS factory named `Page` which represents a basic page structure with properties like id, title, description, content, URL, type, publication status, and associated theme pages.
* **menu.html:** This file contains the HTML template for the menu management interface. It utilizes AngularJS directives like `ng-controller`, `ng-show`, `ng-repeat`, and `ng-click` to dynamically display and manage menus and links. It also uses the `ui-tree` directive for drag-and-drop functionality.
* **menu.js:** This file defines the AngularJS controller `menuCtrl` which handles the logic for the menu management component. It interacts with the `REST` factory to retrieve, update, and delete menus, and manages the state of the interface based on user interactions.

### Usage Example

The menu management component is typically accessed within an administration panel. The user interface provides options to create, edit, and delete menus. When editing a menu, the interface displays a list of links that can be reordered, edited, or deleted. New links can be added, and existing links can be nested to create sub-menus.

### Accessibility

While the provided code snippets do not explicitly demonstrate ARIA attributes or other accessibility features, the component's structure and functionality suggest potential areas for improvement:

* **ARIA Roles and Attributes:** Implementing appropriate ARIA roles (e.g., `role="menu"`, `role="menuitem"`) and attributes (e.g., `aria-expanded`, `aria-haspopup`) would enhance the navigation and interaction experience for users of assistive technologies.
* **Keyboard Navigation:** Ensuring that all interactive elements are accessible and operable using keyboard navigation is crucial for users who cannot rely on a mouse.
* **Focus Management:** Proper focus management is essential to guide users through the interface and indicate the currently active element.
* **Screen Reader Compatibility:** Providing clear and descriptive labels and instructions would improve the experience for users relying on screen readers.

### Conclusion

The menu management component provides a comprehensive solution for managing website menus within an AngularJS application. Its features enable administrators to easily create, edit, and organize menus and their links. By incorporating accessibility best practices, the component can be further enhanced to ensure a user-friendly experience for all users, including those with disabilities. 


### Tokens: {'input_tokens': 3790, 'output_tokens': 785}
### Execution time: 24.369585275650024
