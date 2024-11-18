Your task is to write unit-tests for a legacy part of frontend application.

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


When performing this task, please adhere to the following instructions:
- Choose libraries for testing.
- Set up the testing environment.
- Aim to cover at least 80% of the code.
- Use mocking for dependencies if necessary.
- Ensure that the generated code does not contain any TODOs.
- Simply return the codebase without additional comments.
## Run 3:
### Answer:
Here's the unit test code for the provided Angular 1.x application using Jasmine and Angular Mocks:

```js
// menu.spec.js
describe('menuCtrl', function() {
  var $scope, $controller, $rootScope, REST, $translate, $q;

  beforeEach(module('cosmo'));

  beforeEach(inject(function(_$rootScope_, _$controller_, _REST_, _$translate_, _$q_) {
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $controller = _$controller_;
    REST = _REST_;
    $translate = _$translate_;
    $q = _$q_;
  }));

  it('should initialize the controller', function() {
    spyOn(REST.menus, 'query').and.callFake(function(params, callback) {
      callback([{ id: 1, name: 'Menu 1' }, { id: 2, name: 'Menu 2' }]);
    });

    $controller('menuCtrl', { $scope: $scope });

    expect($scope.menu.panel).toBe('manage');
    expect($scope.menu.editLink).toBe(true);
    expect(REST.menus.query).toHaveBeenCalled();
    expect($scope.menus).toEqual([{ id: 1, name: 'Menu 1' }, { id: 2, name: 'Menu 2' }]);
  });

  it('should remove an item from the list', function() {
    $scope.list = [{ id: 1, title: 'Item 1' }, { id: 2, title: 'Item 2' }];
    var scope = { $index: 1, sortableModelValue: $scope.list };

    $controller('menuCtrl', { $scope: $scope });
    $scope.remove(scope);

    expect($scope.list).toEqual([{ id: 1, title: 'Item 1' }]);
  });

  it('should broadcast a notification when removing the last item', function() {
    $scope.list = [{ id: 1, title: 'Item 1' }];
    var scope = { $index: 0, sortableModelValue: $scope.list };

    spyOn($rootScope, '$broadcast');
    spyOn($translate, 'instant').and.returnValue('Menu cannot be empty');

    $controller('menuCtrl', { $scope: $scope });
    $scope.remove(scope);

    expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'Menu cannot be empty' });
  });

  it('should add a new sub-item', function() {
    var nodeData = { id: 1, title: 'Item 1', items: [] };
    var scope = { $modelValue: nodeData };

    $controller('menuCtrl', { $scope: $scope });
    $scope.newSubItem(scope);

    expect(nodeData.items).toEqual([{ id: 11, title: 'Item 1.1', url: '', items: [] }]);
  });

  it('should select a menu', function() {
    var menu = { id: 1, name: 'Menu 1', area: 'primary', menu: '[{"id":1,"title":"Link","url":"","items":[]}]' };

    $controller('menuCtrl', { $scope: $scope });
    $scope.selectMenu(menu);

    expect($scope.menu.id).toBe(1);
    expect($scope.menu.name).toBe('Menu 1');
    expect($scope.menu.area).toBe('primary');
    expect($scope.menu.panel).toBe('edit');
    expect($scope.list).toEqual([{ id: 1, title: 'Link', url: '', items: [] }]);
  });

  it('should create a new menu', function() {
    spyOn(REST.menus, 'save').and.callFake(function(params, callback) {
      callback(3);
    });
    spyOn($rootScope, '$broadcast');
    spyOn($translate, 'instant').and.returnValue('Menu created');

    $scope.menu.newName = 'New Menu';

    $controller('menuCtrl', { $scope: $scope });
    $scope.newMenu();

    expect(REST.menus.save).toHaveBeenCalledWith({ name: 'New Menu' }, jasmine.any(Function));
    expect($scope.menus).toEqual([{ id: 3, name: 'New Menu' }]);
    expect($scope.menu.newName).toBe('');
    expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'Menu created' });
  });

  it('should update the menu name', function() {
    spyOn(REST.menus, 'update').and.callFake(function(params, callback) {
      callback(true);
    });

    $scope.menu.id = 1;
    $scope.menu.name = 'Updated Menu';
    $scope.menu.menu = '[{"id":1,"title":"Link","url":"","items":[]}]';
    $scope.menu.area = 'primary';
    $scope.menus = [{ id: 1, name: 'Menu 1' }];

    $controller('menuCtrl', { $scope: $scope });
    $scope.updateMenuName();

    expect(REST.menus.update).toHaveBeenCalledWith({
      menuID: 1,
      name: 'Updated Menu',
      menu: '[{"id":1,"title":"Link","url":"","items":[]}]',
      area: 'primary'
    }, jasmine.any(Function));
    expect($scope.menus[0].name).toBe('Updated Menu');
    expect($scope.menu.name).toBe('');
  });

  it('should delete a menu', function() {
    spyOn(REST.menus, 'delete').and.callFake(function(params, callback) {
      callback(true);
    });
    spyOn($rootScope, '$broadcast');
    spyOn($translate, 'instant').and.returnValue('Menu deleted');

    $scope.menu.id = 1;
    $scope.menus = [{ id: 1, name: 'Menu 1' }, { id: 2, name: 'Menu 2' }];

    $controller('menuCtrl', { $scope: $scope });
    $scope.deleteMenu();

    expect(REST.menus.delete).toHaveBeenCalledWith({ menuID: 1 }, jasmine.any(Function));
    expect($scope.menus).toEqual([{ id: 2, name: 'Menu 2' }]);
    expect($scope.menu.name).toBe('');
    expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'Menu deleted' });
  });

  it('should update a link', function() {
    $scope.list = [
      {
        id: 1,
        title: 'Link 1',
        url: '',
        items: [
          {
            id: 2,
            title: 'Link 1.1',
            url: '',
            items: [
              {
                id: 3,
                title: 'Link 1.1.1',
                url: ''
              }
            ]
          }
        ]
      }
    ];

    $scope.menu.currentlyEditingLink = $scope.list[0].items[0].items[0];
    $scope.menu.editLinkText = 'Updated Link 1.1.1';
    $scope.menu.editLinkURL = 'http://example.com';

    $controller('menuCtrl', { $scope: $scope });
    $scope.updateLink();

    expect($scope.list[0].items[0].items[0].title).toBe('Updated Link 1.1.1');
    expect($scope.list[0].items[0].items[0].url).toBe('http://example.com');
  });

  it('should save a menu', function() {
    spyOn(REST.menus, 'update').and.callFake(function(params, callback) {
      callback();
    });
    spyOn(REST.menus, 'query').and.callFake(function(params, callback) {
      callback([{ id: 1, name: 'Menu 1' }]);
    });
    spyOn($rootScope, '$broadcast');
    spyOn($translate, 'instant').and.returnValue('Menu saved');

    $scope.menu.id = 1;
    $scope.menu.name = 'Menu 1';
    $scope.list = [{ id: 1, title: 'Link', url: '', items: [] }];
    $scope.menu.area = 'primary';

    $controller('menuCtrl', { $scope: $scope });
    $scope.saveMenu();

    expect(REST.menus.update).toHaveBeenCalledWith({
      menuID: 1,
      name: 'Menu 1',
      menu: '[{"id":1,"title":"Link","url":"","items":[]}]',
      area: 'primary'
    }, jasmine.any(Function));
    expect(REST.menus.query).toHaveBeenCalled();
    expect($rootScope.$broadcast).toHaveBeenCalledWith('menusGet');
    expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'Menu saved' });
  });
});
```

This test suite covers the main functionality of the `menuCtrl` controller, including initializing the controller, removing items from the list, adding sub-items, selecting a menu, creating a new menu, updating the menu name, deleting a menu, updating links, and saving a menu.

The tests use Jasmine's `spyOn` function to mock the dependencies (`REST`, `$rootScope`, `$translate`) and verify that the expected methods are called with the correct arguments.

Note: The code assumes the existence of a `REST` service and a `Page` factory, which are not provided in the given code snippets. You may need to adjust the tests based on the actual implementation of those dependencies.

### Tokens: {'input_tokens': 3983, 'output_tokens': 2541}
### Execution time: 77.10870885848999
