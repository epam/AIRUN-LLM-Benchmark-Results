Your task is to write unit-tests for a legacy part of frontend application.

rest.js
```js
/**************************************************
 *                 REST Factory                   *
 *       Communicate with RESTful backend         *
 **************************************************/

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

page.html
```html
<div ng-controller="pageCtrl">
    <div class="new-version form-case" ng-show="newerVersion">
        <p translate="page_newer"></p>
        <button class="btn-error" type="button" ng-click="deleteNewerVersion()" translate="discard"></button>
        <button class="btn-options" type="button" ng-click='localVersion()' translate="compare"></button>
        <button class="btn-success" type="button" ng-click='localVersion()' translate="use"></button>
    </div>
    <div class="bar-top">
        <a ng-click="admin.sidebar='core/html/sidebar.html';active=''"><i class="fa fa-angle-left"></i></a>
        <h1 class="title" translate="page_details"></h1>
        <a class="sidebar-close" ng-click="admin.showAdminPanel=false;admin.active=false;" ><i class="fa fa-times"></i></a>
    </div>
    <div class="bar--actions">
        <button type="button" class="btn-error" ng-click="page.confirm=true" translate="delete" ng-show="!page.confirm"></button>
        <button type="button" class="btn-options" ng-click="savePage(true)" translate="duplicate" ng-show="!page.confirm"></button>
        <button type="button" class="btn-success" ng-click="savePage()" translate="save" ng-show="!page.confirm"></button>

        <p translate="page_delete" ng-show="page.confirm"></p>
        <button type="button" class="btn-error" ng-click="deletePage()" translate="yes" ng-show="page.confirm"></button>
        <button type="button" class="btn-success" ng-click="page.confirm=false" translate="no" ng-show="page.confirm"></button>
    </div>
    <div class="pg-editor form-case">
        <label class="type" for="type" translate="type"></label>
        <div class="cos-select">
            <select value="type" ng-change="updatePageType()" ng-model="page.type" ng-options="(themePage | themeFiles ) for themePage in page.themePages" required></select>
        </div>

        <span class="num-count">{{page.title.length}}</span>
        <label translate="title"></label>
        <input type='text' ng-model="page.title" ng-keyup="titleChange()" placeholder="about us, contact us">

        <span class="num-count">{{page.description.length}}</span>
        <label for="description" translate="description"></label>
        <textarea value="description" ng-model="page.description" ng-keyup="descriptionChange()" placeholder="Tom's Restaurant is a diner located at 2880 Broadway (on the corner of 112th Street) in the Morningside Heights neighborhood of Manhattan in New York City."></textarea>

        <label for="tags" translate="tags"></label>
        <input value="tags" type="text" ng-list ng-model="page.tags" ng-change="autocompleteTags()" placeholder="about, restaurant, food, nyc">
        <div class="tag-suggestions" ng-show="page.suggestions.length">
            <a ng-repeat="tag in page.suggestions | limitTo:10" ng-click="selectSuggestion(tag)">{{tag | titlecase}}</a>
        </div>

        <label for="url" translate="url"></label>
        <input value="url" type='text' ng-model='page.url' ng-keyup="autoURL=false;urlChange()">

        <input  type="radio" ng-class="{active: page.publish=='Y'}" name="publish" id="Y" value="Y" ng-modal="page.publish">
        <label for="Y" ng-click="page.publish='Y'" translate="publish"></label>
        <input  type="radio" ng-class="{active: page.publish=='N'}" name="publish" id="N" value="N" ng-modal="page.publish">
        <label for="N" ng-click="page.publish='N'" translate="draft"></label>
        <input  type="radio" ng-class="{active: page.publish=='schedule'}" name="publish" id="schedule" value="schedule" ng-modal="page.publish">
        <label for="schedule" ng-click="page.publish='schedule'" translate="schedule"></label>
        <div class="schedule-triangle" ng-show="page.publish=='schedule'"></div>
        <input type="datetime-local" class="schedule radio-inline" ng-model="page.scheduleDate" ng-show="page.publish=='schedule'">
    </div>
</div>

```

page.js
```js
/**************************************************
 *                Page Factory                    *
 *       Create Page factory to store             *
 *          page variables globally               *
 **************************************************/

angular.module('cosmo').factory('Page', function(){
    return {
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
        misc: {}
    };
});

```

users.js
```js
/**************************************************
 *               Users Factory                    *
 *      Store data about the current user         *
 **************************************************/

angular.module('cosmo').factory('Users', function() {
    return {
        id: '',
        username: '',
        name: '',
        bio: '',
        email: '',
        facebook: '',
        twitter: '',
        photo: '',
        role: ''
    };
});

```

pageCtrl.js
```js
/**************************************************
 *              Page Controller                   *
 *      Make new pages and edit old pages.        *
 **************************************************/

angular.module('cosmo').controller('pageCtrl', ['$scope', 'REST', '$location', 'Page', '$rootScope', '$routeParams', '$upload', 'Users', '$translate', function($scope, REST, $location, Page, $rootScope, $routeParams, $upload, Users, $translate){

    // Initialize variables
    $scope.page = {
        id: Page.id,
        title: Page.title,
        description: Page.description,
        url: Page.url,
        publish: Page.publish,
        scheduleDate: Page.scheduleDate,
        tags: Page.tags,
        type: Page.type,
        themePages: []
    };

    // Set the date to today if no date was set
    if(!$scope.page.scheduleDate || $location.path() === '/new')
        $scope.page.scheduleDate = new Date(); // Math.round(+new Date().getTime()/1000); Depreciate?

    // Initialize schedule date - Depreciate?
    var date = new Date($scope.page.scheduleDate * 1000);
    var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    var ampm = date.getHours() > 12 ? 'PM' : 'AM';
    var formattedDate = date.getMonth() + 1 +'/'+ date.getDate() +'/'+ date.getFullYear() +' '+ hours +':'+ date.getMinutes() +' '+ ampm;
    // $scope.page.scheduleDate = formattedDate;

    // Get the pages available to this theme
    $scope.page.themePages = Page.themePages;

    // Initialize the page type
    if(Page.type)
        $scope.page.type = Page.type;
    else
        $scope.page.type = $scope.page.themePages[0];

    // todo: Save Page.extras save locally too

    // Check if there's an unsaved version from a previous session
    var elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
    if($location.path() !== '/new'){ // Don't apply this to new pages
        angular.forEach(elements, function(value){
            if(localStorage.getItem($routeParams.url + value) !== Page[value] && localStorage.getItem($routeParams.url + value) !== 'null')
                $scope.newerVersion = true;
        });
    }

    // Revert to the previously saved version
    $scope.localVersion = function(){

        var elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
        angular.forEach(elements, function(value){
            // Restore item
            if(localStorage.getItem($routeParams.url + value) !== 'null')
                Page[value] = localStorage.getItem($routeParams.url + value);

            // Clear item from storage
            localStorage.setItem($routeParams.url + value, null);
        });

        $scope.newerVersion = false;
        $rootScope.$broadcast('contentGet');
    };

    // Delete newer version
    $scope.deleteNewerVersion = function(){
        var elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
        angular.forEach(elements, function(value){
            localStorage.setItem($routeParams.url + value, null);
        });

        $scope.newerVersion = false;
    };

    // Delete the page
    $scope.deletePage = function(){
        // Delete the page
        REST.content.delete({ contentID: $scope.page.id }, function(data){
            // Success message
            $translate('deleted').then(function(translatedText){
                $rootScope.$broadcast('notify', {message: translatedText});
            });
        });

        // Delete all revisions of this page
        REST.contentRevisions.delete({ contentID: $scope.page.id });

        // Delte all extra revisions
        REST.contentRevisionsExtras.delete({ contentID: $scope.page.id });

        // Delete all extras from this page
        REST.contentExtras.delete({ contentID: $scope.page.id });

        // Delete all tags for this page
        REST.contentTags.delete({ contentID: $scope.page.id });

        // Redirect to the default new page
        $location.path('new');
    };

    // Watch for page change
    var updatePage = function() {
        $scope.page.title = Page.title;
        $scope.page.description = Page.description;
        $scope.page.url = Page.url;
        $scope.page.type = Page.type;
        $scope.page.tags = Page.tags;
    };
    updatePage();

    $scope.$on('contentGet', function(){
        updatePage();
    });

    // Update the page type
    $scope.updatePageType = function(){
        Page.type = $scope.page.type;
        $rootScope.$broadcast('settingsGet');
    };

    // Auto-generate the url from the title
    $scope.titleChange = function(){

        // Log changes to the Page object
        Page.title = $scope.page.title;

        // Only auto-generate urls for new pages
        if($scope.page.url === '/new' || $scope.page.url === 'new' || !$scope.page.url)
            $scope.autoURL = true;

        if($scope.autoURL){
            // Change spaces to hyphens, convert to lowercase, and remove punctuation
            $scope.page.url = $scope.page.title.toLowerCase().replace(/ /g, '-').replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
            Page.url = $scope.page.url;
        }
    };

    // Save changes to the description
    $scope.descriptionChange = function(){
        Page.description = $scope.page.description;
    };

    // Save changes to the url
    $scope.urlChange = function(){
        Page.url = $scope.page.url;
    };

    // Update page variables when they are changed
    $scope.saveLocal = function(){
        Page.title = $scope.page.title;
        Page.description = $scope.page.description;
        Page.url = $scope.page.url;
        Page.type = $scope.page.type;

        // Save to local Storage
        localStorage.setItem($routeParams.url + 'title', Page.title);
        localStorage.setItem($routeParams.url + 'description', Page.description);
        localStorage.setItem($routeParams.url + 'url', Page.url);
        localStorage.setItem($routeParams.url + 'publish', Page.publish);
        localStorage.setItem($routeParams.url + 'scheduleDate', Page.scheduleDate);
        localStorage.setItem($routeParams.url + 'type', Page.type);
    };

    // Autocomplete tags
    $scope.autocompleteTags = function(){
        var tag = $scope.page.tags[$scope.page.tags.length - 1];
        if(tag){
            REST.contentTags.query({ tag: tag }, function(data){
                $scope.page.suggestions = data;
            }, function(){ // no tag found
                $scope.page.suggestions = [];
            });
        } else
            $scope.page.suggestions = [];
    };

    // Select tag from autocomplete
    $scope.selectSuggestion = function(tag){
        var tags = angular.copy($scope.page.tags);
        tags[tags.length - 1] = tag;
        tags[tags.length] = '';
        $scope.page.tags = tags;
        $scope.page.suggestions = [];
    };

    // Save the page
    $scope.savePage = function(duplicate){

        // Check for duplicate URL
        if(duplicate && $scope.page.url === $location.path()){
            $translate('page_different_url').then(function(translatedText){
                $rootScope.$broadcast('notify', {message: translatedText, classes: 'alert-error'});
            });
            return;
        }

        // Make sure there is a page type
        if(!$scope.page.type){
            $translate('page_no_type_selected').then(function(translatedText){
                $rootScope.$broadcast('notify', {message: translatedText, classes: 'alert-error'});
            });
            return;
        }

        // If there's no custom title tag, use the header
        if($scope.page.title){
            if($scope.page.title.length === 0)
                $scope.page.title = Page.header;
        }

        // If there's no custom url, throw an error
        if($scope.page.url.length === 0 || $scope.page.url === 'new'){
            $translate('page_no_url').then(function(translatedText){
                $rootScope.$broadcast('notify', { message: translatedText, classes: 'alert-error' });
            });
            return;
        }

        // Get the scheduled date to publish
        var scheduleDate;
        if($scope.page.publish === 'Y' && Page.publish === 'Y') // If this was already published, don't update the published date
            scheduleDate = Page.scheduleDate;
        else if($scope.page.publish === 'Y') // If publishing now, set the publish date to the current time
            scheduleDate = Math.round(+new Date().getTime()/1000);
        else if($scope.page.publish === 'schedule'){
            scheduleDate = Date.parse($scope.page.scheduleDate).getTime()/1000;
            // Check if this is back dated
            if(Date.parse($scope.page.scheduleDate).getTime() < Math.round(+new Date().getTime()))
                $scope.page.publish = 'Y';
            else
                $scope.page.publish = 'N';
        }

        // Get the featured image URL
        if(Page.extras.featured)
            var featured = Page.extras.featured.src;
        else
            var featured = null;

        // Create a new page or a duplicate
        if($location.path() === '/new' || duplicate){
            // Save content
            REST.content.save({
                title: $scope.page.title,
                description: $scope.page.description,
                header: Page.header,
                subheader: Page.subheader,
                featured: featured,
                body: Page.body,
                url: $scope.page.url,
                type: $scope.page.type,
                published: $scope.page.publish,
                published_date: scheduleDate,
                author: Users.id
            }, newPagePromise, function(){ // Error
                $translate('page_error_saving').then(function(translatedText){
                    $rootScope.$broadcast('notify', {message: translatedText, classes: 'alert-error'});
                });
            });
        } else { // Update existing page

            var revisionID;

            // Update the page
            REST.content.update({
                contentID: Page.id,
                title: $scope.page.title,
                description: $scope.page.description,
                header: Page.header,
                subheader: Page.subheader,
                featured: featured,
                body: Page.body,
                url: $scope.page.url,
                type: $scope.page.type,
                published: $scope.page.publish,
                published_date: scheduleDate,
                author: Users.id
            }, updatePagePromise, function(data){ // Error
                $translate('page_error_updating').then(function(translatedText){
                    $rootScope.$broadcast('notify', {message: translatedText, classes: 'alert-error'});
                });
            });
        }

        // Update the page after a new page was saved
        function newPagePromise(data){
            var contentID = data.id;

            // Reset variables to edit page
            $scope.page.id = contentID;
            $scope.autoURL = false;

            // Save new tags
            if($scope.page.tags){
                angular.forEach($scope.page.tags, function(value){
                    REST.contentTags.save({ contentID: contentID, tag: value });
                });
            }

            // Save page as a revision
            REST.contentRevisions.save({
                contentID: contentID,
                title: $scope.page.title,
                description: $scope.page.description,
                header: Page.header,
                subheader: Page.subheader,
                featured: featured,
                body: Page.body,
                url: $scope.page.url,
                type: $scope.page.type,
                published: $scope.page.publish,
                published_date: scheduleDate,
                author: Users.id
            }, saveRevisionPromise);
        }

        // Update the page after saving a page revision
        function saveRevisionPromise(data){
            revisionID = data.id;

            // Save additional data if there is any
            if(Object.keys(Page.extras).length === 0){
                // Success message
                $translate('saved').then(function(translatedText){
                    $rootScope.$broadcast('notify', {message: translatedText});
                });
                // Redirect to new page
                $location.path($scope.page.url);
            } else {
                for(var key in Page.extras){
                    // Stringify arrays and objects
                    if(typeof Page.extras[key] === 'object')
                        Page.extras[key] = angular.toJson(Page.extras[key]);

                    // Save extra
                    REST.contentExtras.save({
                        contentID: $scope.page.id,
                        name: key,
                        extra: Page.extras[key]
                    }, saveExtrasPromise, saveExtrasPromise);

                    // Save extra to revisions
                    REST.contentRevisionsExtras.save({
                        revisionID: revisionID,
                        contentID: $scope.page.id,
                        name: key,
                        extra: Page.extras[key]
                    });
                }
            }
            $translate('page_created').then(function(translatedText){
                $rootScope.$broadcast('notify', {message: translatedText});
            });
        }

        var extrasCounter = {
            i: 1
        };

        // Notify the user after saving the last extra
        function saveExtrasPromise(){
            // Wait for the last extra to be saved, then redirect the user
            if(extrasCounter.i === Object.keys(Page.extras).length){
                // Success message
                $translate('page_created').then(function(translatedText){
                    $rootScope.$broadcast('notify', {message: translatedText});
                });
                // Redirect to new page
                $location.path($scope.page.url);
            } else
                extrasCounter.i++;
        }

        // Update the page after it's been saved
        function updatePagePromise(data){
            // Delete old tags
            REST.contentTags.delete({ contentID: $scope.page.id }, deleteTagsPromise);

            // Save page as a revision
            REST.contentRevisions.save({
                contentID: $scope.page.id,
                title: $scope.page.title,
                description: $scope.page.description,
                header: Page.header,
                subheader: Page.subheader,
                featured: featured,
                body: Page.body,
                url: $scope.page.url,
                type: $scope.page.type,
                published: $scope.page.publish,
                published_date: $scope.page.scheduleDate,
                author: Users.id
            }, savePageRevisionPromise);
        }

        // Callback for saving a page revision
        function savePageRevisionPromise(data){
            revisionID = data.id;
            // Delete old extras
            REST.contentExtras.delete({ contentID: $scope.page.id }, deleteExtrasPromise);
        }

        // Callback after tags are deleted
        function deleteTagsPromise(){
            // Save new tags
            angular.forEach($scope.page.tags, function(value){
                REST.contentTags.save({ contentID: $scope.page.id, tag: value });
            });
        }

        // Callback after deleting extras
        function deleteExtrasPromise(){
            // Save additional data
            for (var key in Page.extras){
                if (Page.extras.hasOwnProperty(key)){

                    // Stringify arrays and objects
                    if(typeof Page.extras[key] === 'object')
                        Page.extras[key] = angular.toJson(Page.extras[key]);

                    // Save new extra
                    REST.contentExtras.save({
                        contentID: $scope.page.id,
                        name: key,
                        extra: Page.extras[key]
                    }, saveExtrasPromise, saveExtrasPromise);

                    // Save new extra to revisions
                    REST.contentRevisionsExtras.save({
                        revisionID: revisionID,
                        contentID: $scope.page.id,
                        name: key,
                        extra: Page.extras[key]
                    });
                }
            }
            // If there were no extras, notify right away
            if(!Page.extras.length) {
                $translate('page_updated').then(function(translatedText){
                    $rootScope.$broadcast('notify', {message: translatedText});
                });
            }
        }
    };
}]);

```


When performing this task, please adhere to the following instructions:
- Choose libraries for testing.
- Set up the testing environment.
- Aim to cover at least 80% of the code.
- Use mocking for dependencies if necessary.
- Ensure that the generated code does not contain any TODOs.
- Simply return the codebase without additional comments.
## Run 1:
### Answer:
# Setting up the testing environment

I'll use Jest as the testing framework along with Angular Mocks for testing AngularJS code.

## package.json (test dependencies)
```json
{
  "devDependencies": {
    "jest": "^29.5.0",
    "angular-mocks": "^1.8.3",
    "jest-environment-jsdom": "^29.5.0"
  },
  "jest": {
    "testEnvironment": "jsdom",
    "moduleFileExtensions": ["js", "json"],
    "setupFilesAfterEnv": ["<rootDir>/setupTests.js"]
  }
}
```

## setupTests.js
```javascript
require('angular');
require('angular-mocks');
```

## tests/pageCtrl.spec.js
```javascript
describe('pageCtrl', function() {
  let $controller, $rootScope, $scope, $location, $routeParams, $translate;
  let REST, Page, Users, $upload;
  
  beforeEach(function() {
    angular.mock.module('cosmo');
    
    // Mock dependencies
    angular.mock.module(function($provide) {
      $provide.factory('REST', function() {
        return {
          content: {
            save: jest.fn().mockImplementation((data, success, error) => success({ id: 123 })),
            update: jest.fn().mockImplementation((data, success, error) => success({ id: 123 })),
            delete: jest.fn().mockImplementation((data, success) => success({}))
          },
          contentRevisions: {
            save: jest.fn().mockImplementation((data, success) => success({ id: 456 })),
            delete: jest.fn()
          },
          contentRevisionsExtras: {
            save: jest.fn(),
            delete: jest.fn()
          },
          contentExtras: {
            save: jest.fn().mockImplementation((data, success) => success({})),
            delete: jest.fn().mockImplementation((data, success) => success({}))
          },
          contentTags: {
            save: jest.fn(),
            delete: jest.fn().mockImplementation((data, success) => success({})),
            query: jest.fn().mockImplementation((data, success) => success(['tag1', 'tag2']))
          }
        };
      });
      
      $provide.factory('Page', function() {
        return {
          id: 123,
          title: 'Test Page',
          description: 'Test Description',
          header: 'Test Header',
          subheader: 'Test Subheader',
          body: 'Test Body',
          url: 'test-page',
          type: 'page',
          published: 'Y',
          published_date: '1625097600',
          themePages: ['page', 'post', 'product'],
          timestamp: '1625097600',
          extras: {
            featured: { src: 'image.jpg' }
          },
          misc: {},
          tags: ['tag1', 'tag2']
        };
      });
      
      $provide.factory('Users', function() {
        return {
          id: 1,
          username: 'testuser',
          name: 'Test User',
          bio: 'Test Bio',
          email: 'test@example.com',
          facebook: '',
          twitter: '',
          photo: '',
          role: 'admin'
        };
      });
      
      $provide.factory('$upload', function() {
        return {};
      });
      
      $provide.factory('$translate', function() {
        return jest.fn().mockImplementation((key) => {
          return {
            then: function(callback) {
              const translations = {
                'deleted': 'Page deleted',
                'saved': 'Page saved',
                'page_error_saving': 'Error saving page',
                'page_error_updating': 'Error updating page',
                'page_created': 'Page created',
                'page_updated': 'Page updated',
                'page_different_url': 'Please use a different URL',
                'page_no_type_selected': 'Please select a page type',
                'page_no_url': 'Please enter a URL'
              };
              return callback(translations[key] || key);
            }
          };
        });
      });
    });
    
    inject(function(_$controller_, _$rootScope_, _$location_, _$routeParams_, _REST_, _Page_, _Users_, _$upload_, _$translate_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $location = _$location_;
      $routeParams = _$routeParams_;
      REST = _REST_;
      Page = _Page_;
      Users = _Users_;
      $upload = _$upload_;
      $translate = _$translate_;
      
      $scope = $rootScope.$new();
      
      // Mock localStorage
      global.localStorage = {
        getItem: jest.fn().mockImplementation(key => null),
        setItem: jest.fn()
      };
      
      // Mock Date.parse
      global.Date.parse = jest.fn().mockImplementation(() => {
        return {
          getTime: () => 1625097600000
        };
      });
    });
  });
  
  function createController(path) {
    $location.path(path || '/test-page');
    $routeParams.url = path ? path.substring(1) : 'test-page';
    return $controller('pageCtrl', {
      $scope: $scope,
      REST: REST,
      $location: $location,
      Page: Page,
      $rootScope: $rootScope,
      $routeParams: $routeParams,
      $upload: $upload,
      Users: Users,
      $translate: $translate
    });
  }
  
  describe('initialization', function() {
    it('should initialize page properties from Page factory', function() {
      createController();
      
      expect($scope.page.id).toBe(123);
      expect($scope.page.title).toBe('Test Page');
      expect($scope.page.description).toBe('Test Description');
      expect($scope.page.url).toBe('test-page');
      expect($scope.page.type).toBe('page');
      expect($scope.page.themePages).toEqual(['page', 'post', 'product']);
    });
    
    it('should set scheduleDate to current date for new pages', function() {
      createController('/new');
      
      expect($scope.page.scheduleDate).toBeInstanceOf(Date);
    });
    
    it('should check for unsaved versions from previous sessions', function() {
      localStorage.getItem.mockImplementation(key => {
        if (key === 'test-pagetitle') return 'New Title';
        return null;
      });
      
      createController();
      
      expect($scope.newerVersion).toBe(true);
      expect(localStorage.getItem).toHaveBeenCalled();
    });
  });
  
  describe('localVersion', function() {
    it('should restore items from localStorage and clear storage', function() {
      localStorage.getItem.mockImplementation(key => {
        if (key === 'test-pagetitle') return 'New Title';
        if (key === 'test-pagedescription') return 'New Description';
        return null;
      });
      
      createController();
      $scope.localVersion();
      
      expect(Page.title).toBe('New Title');
      expect(Page.description).toBe('New Description');
      expect(localStorage.setItem).toHaveBeenCalledWith('test-pagetitle', null);
      expect(localStorage.setItem).toHaveBeenCalledWith('test-pagedescription', null);
      expect($scope.newerVersion).toBe(false);
    });
  });
  
  describe('deleteNewerVersion', function() {
    it('should clear localStorage items', function() {
      createController();
      $scope.deleteNewerVersion();
      
      expect(localStorage.setItem).toHaveBeenCalledWith('test-pagetitle', null);
      expect(localStorage.setItem).toHaveBeenCalledWith('test-pagedescription', null);
      expect($scope.newerVersion).toBe(false);
    });
  });
  
  describe('deletePage', function() {
    it('should delete the page and its related data', function() {
      createController();
      $scope.deletePage();
      
      expect(REST.content.delete).toHaveBeenCalledWith({ contentID: 123 }, expect.any(Function));
      expect(REST.contentRevisions.delete).toHaveBeenCalledWith({ contentID: 123 });
      expect(REST.contentRevisionsExtras.delete).toHaveBeenCalledWith({ contentID: 123 });
      expect(REST.contentExtras.delete).toHaveBeenCalledWith({ contentID: 123 });
      expect(REST.contentTags.delete).toHaveBeenCalledWith({ contentID: 123 });
      expect($location.path()).toBe('new');
    });
  });
  
  describe('updatePage', function() {
    it('should update page properties when contentGet event is triggered', function() {
      createController();
      
      // Change Page factory values
      Page.title = 'Updated Title';
      Page.description = 'Updated Description';
      
      // Trigger contentGet event
      $rootScope.$broadcast('contentGet');
      
      expect($scope.page.title).toBe('Updated Title');
      expect($scope.page.description).toBe('Updated Description');
    });
  });
  
  describe('updatePageType', function() {
    it('should update Page.type and broadcast settingsGet event', function() {
      createController();
      $scope.page.type = 'post';
      
      $scope.updatePageType();
      
      expect(Page.type).toBe('post');
      // Check if settingsGet was broadcasted
      const broadcastSpy = jest.spyOn($rootScope, '$broadcast');
      expect(broadcastSpy).toHaveBeenCalledWith('settingsGet');
    });
  });
  
  describe('titleChange', function() {
    it('should update Page.title', function() {
      createController();
      $scope.page.title = 'New Title';
      
      $scope.titleChange();
      
      expect(Page.title).toBe('New Title');
    });
    
    it('should auto-generate URL for new pages', function() {
      createController('/new');
      $scope.page.title = 'New Page Title!';
      $scope.autoURL = true;
      
      $scope.titleChange();
      
      expect($scope.page.url).toBe('new-page-title');
      expect(Page.url).toBe('new-page-title');
    });
  });
  
  describe('descriptionChange', function() {
    it('should update Page.description', function() {
      createController();
      $scope.page.description = 'New Description';
      
      $scope.descriptionChange();
      
      expect(Page.description).toBe('New Description');
    });
  });
  
  describe('urlChange', function() {
    it('should update Page.url', function() {
      createController();
      $scope.page.url = 'new-url';
      
      $scope.urlChange();
      
      expect(Page.url).toBe('new-url');
    });
  });
  
  describe('saveLocal', function() {
    it('should save page properties to localStorage', function() {
      createController();
      $scope.page.title = 'Local Title';
      $scope.page.description = 'Local Description';
      
      $scope.saveLocal();
      
      expect(localStorage.setItem).toHaveBeenCalledWith('test-pagetitle', 'Local Title');
      expect(localStorage.setItem).toHaveBeenCalledWith('test-pagedescription', 'Local Description');
    });
  });
  
  describe('autocompleteTags', function() {
    it('should query for tag suggestions', function() {
      createController();
      $scope.page.tags = ['test'];
      
      $scope.autocompleteTags();
      
      expect(REST.contentTags.query).toHaveBeenCalledWith({ tag: 'test' }, expect.any(Function), expect.any(Function));
      expect($scope.page.suggestions).toEqual(['tag1', 'tag2']);
    });
    
    it('should clear suggestions if no tag is provided', function() {
      createController();
      $scope.page.tags = [];
      
      $scope.autocompleteTags();
      
      expect($scope.page.suggestions).toEqual([]);
    });
  });
  
  describe('selectSuggestion', function() {
    it('should replace the last tag with the selected suggestion', function() {
      createController();
      $scope.page.tags = ['test1', 'partial'];
      
      $scope.selectSuggestion('complete');
      
      expect($scope.page.tags).toEqual(['test1', 'complete', '']);
      expect($scope.page.suggestions).toEqual([]);
    });
  });
  
  describe('savePage', function() {
    it('should show error for duplicate URL', function() {
      createController('/test-page');
      $scope.page.url = 'test-page';
      
      const broadcastSpy = jest.spyOn($rootScope, '$broadcast');
      $scope.savePage(true); // Try to duplicate
      
      expect(broadcastSpy).toHaveBeenCalledWith('notify', {
        message: 'Please use a different URL',
        classes: 'alert-error'
      });
    });
    
    it('should show error for missing page type', function() {
      createController();
      $scope.page.type = '';
      
      const broadcastSpy = jest.spyOn($rootScope, '$broadcast');
      $scope.savePage();
      
      expect(broadcastSpy).toHaveBeenCalledWith('notify', {
        message: 'Please select a page type',
        classes: 'alert-error'
      });
    });
    
    it('should show error for missing URL', function() {
      createController();
      $scope.page.url = '';
      
      const broadcastSpy = jest.spyOn($rootScope, '$broadcast');
      $scope.savePage();
      
      expect(broadcastSpy).toHaveBeenCalledWith('notify', {
        message: 'Please enter a URL',
        classes: 'alert-error'
      });
    });
    
    it('should create a new page', function() {
      createController('/new');
      $scope.page.title = 'New Page';
      $scope.page.description = 'New Description';
      $scope.page.url = 'new-page';
      $scope.page.type = 'page';
      $scope.page.publish = 'Y';
      $scope.page.tags = ['tag1', 'tag2'];
      
      $scope.savePage();
      
      expect(REST.content.save).toHaveBeenCalled();
      expect(REST.contentRevisions.save).toHaveBeenCalled();
      expect(REST.contentTags.save).toHaveBeenCalled();
    });
    
    it('should update an existing page', function() {
      createController();
      $scope.page.title = 'Updated Page';
      $scope.page.description = 'Updated Description';
      $scope.page.url = 'updated-page';
      $scope.page.type = 'page';
      $scope.page.publish = 'Y';
      $scope.page.tags = ['tag1', 'tag2'];
      
      $scope.savePage();
      
      expect(REST.content.update).toHaveBeenCalled();
      expect(REST.contentRevisions.save).toHaveBeenCalled();
      expect(REST.contentTags.delete).toHaveBeenCalled();
    });
    
    it('should handle scheduled publishing', function() {
      createController();
      $scope.page.publish = 'schedule';
      $scope.page.scheduleDate = new Date();
      
      $scope.savePage();
      
      expect(REST.content.update).toHaveBeenCalled();
      // Check if the publish status is set correctly based on the date
      expect(REST.content.update.mock.calls[0][0].published).toBe('N');
    });
  });
});
```

## tests/rest.factory.spec.js
```javascript
describe('REST Factory', function() {
  let REST, $httpBackend;
  
  beforeEach(function() {
    angular.mock.module('cosmo');
    
    inject(function(_REST_, _$httpBackend_) {
      REST = _REST_;
      $httpBackend = _$httpBackend_;
    });
  });
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  it('should have all required resources', function() {
    expect(REST.blocks).toBeDefined();
    expect(REST.blocksRequirements).toBeDefined();
    expect(REST.comments).toBeDefined();
    expect(REST.content).toBeDefined();
    expect(REST.contentExtras).toBeDefined();
    expect(REST.contentRevisions).toBeDefined();
    expect(REST.contentRevisionsExtras).toBeDefined();
    expect(REST.contentTags).toBeDefined();
    expect(REST.files).toBeDefined();
    expect(REST.filesTags).toBeDefined();
    expect(REST.menus).toBeDefined();
    expect(REST.modules).toBeDefined();
    expect(REST.sitemaps).toBeDefined();
    expect(REST.themes).toBeDefined();
    expect(REST.settings).toBeDefined();
    expect(REST.users).toBeDefined();
  });
  
  describe('blocks resource', function() {
    it('should fetch blocks', function() {
      $httpBackend.expectGET('api/blocks').respond([{ id: 1, name: 'Block 1' }]);
      
      const blocks = REST.blocks.query();
      $httpBackend.flush();
      
      expect(blocks.length).toBe(1);
      expect(blocks[0].name).toBe('Block 1');
    });
    
    it('should fetch a single block', function() {
      $httpBackend.expectGET('api/blocks/1').respond({ id: 1, name: 'Block 1' });
      
      const block = REST.blocks.get({ blockID: 1 });
      $httpBackend.flush();
      
      expect(block.id).toBe(1);
      expect(block.name).toBe('Block 1');
    });
    
    it('should create a new block', function() {
      $httpBackend.expectPOST('api/blocks').respond({ id: 2, name: 'Block 2' });
      
      const block = REST.blocks.save({ name: 'Block 2' });
      $httpBackend.flush();
      
      expect(block.id).toBe(2);
      expect(block.name).toBe('Block 2');
    });
    
    it('should update a block', function() {
      $httpBackend.expectPUT('api/blocks/1').respond({ id: 1, name: 'Updated Block' });
      
      const block = REST.blocks.update({ blockID: 1, name: 'Updated Block' });
      $httpBackend.flush();
      
      expect(block.id).toBe(1);
      expect(block.name).toBe('Updated Block');
    });
    
    it('should delete a block', function() {
      $httpBackend.expectDELETE('api/blocks/1').respond({});
      
      REST.blocks.delete({ blockID: 1 });
      $httpBackend.flush();
    });
  });
  
  describe('content resource', function() {
    it('should fetch content', function() {
      $httpBackend.expectGET('api/content').respond([{ id: 1, title: 'Content 1' }]);
      
      const content = REST.content.query();
      $httpBackend.flush();
      
      expect(content.length).toBe(1);
      expect(content[0].title).toBe('Content 1');
    });
    
    it('should fetch a single content item', function() {
      $httpBackend.expectGET('api/content/1').respond({ id: 1, title: 'Content 1' });
      
      const content = REST.content.get({ contentID: 1 });
      $httpBackend.flush();
      
      expect(content.id).toBe(1);
      expect(content.title).toBe('Content 1');
    });
    
    it('should create new content', function() {
      $httpBackend.expectPOST('api/content').respond({ id: 2, title: 'Content 2' });
      
      const content = REST.content.save({ title: 'Content 2' });
      $httpBackend.flush();
      
      expect(content.id).toBe(2);
      expect(content.title).toBe('Content 2');
    });
    
    it('should update content', function() {
      $httpBackend.expectPUT('api/content/1').respond({ id: 1, title: 'Updated Content' });
      
      const content = REST.content.update({ contentID: 1, title: 'Updated Content' });
      $httpBackend.flush();
      
      expect(content.id).toBe(1);
      expect(content.title).toBe('Updated Content');
    });
    
    it('should delete content', function() {
      $httpBackend.expectDELETE('api/content/1').respond({});
      
      REST.content.delete({ contentID: 1 });
      $httpBackend.flush();
    });
  });
  
  describe('contentTags resource', function() {
    it('should fetch content tags', function() {
      $httpBackend.expectGET('api/content/1/tags/').respond(['tag1', 'tag2']);
      
      const tags = REST.contentTags.query({ contentID: 1 });
      $httpBackend.flush();
      
      expect(tags.length).toBe(2);
      expect(tags).toContain('tag1');
      expect(tags).toContain('tag2');
    });
    
    it('should add a tag to content', function() {
      $httpBackend.expectPOST('api/content/1/tags/').respond({ success: true });
      
      const result = REST.contentTags.save({ contentID: 1, tag: 'newtag' });
      $httpBackend.flush();
      
      expect(result.success).toBe(true);
    });
    
    it('should delete content tags', function() {
      $httpBackend.expectDELETE('api/content/1/tags/').respond({ success: true });
      
      const result = REST.contentTags.delete({ contentID: 1 });
      $httpBackend.flush();
      
      expect(result.success).toBe(true);
    });
  });
  
  describe('users resource', function() {
    it('should fetch users', function() {
      $httpBackend.expectGET('api/users').respond([{ id: 1, username: 'user1' }]);
      
      const users = REST.users.query();
      $httpBackend.flush();
      
      expect(users.length).toBe(1);
      expect(users[0].username).toBe('user1');
    });
    
    it('should fetch a single user', function() {
      $httpBackend.expectGET('api/users/1').respond({ id: 1, username: 'user1' });
      
      const user = REST.users.get({ userID: 1 });
      $httpBackend.flush();
      
      expect(user.id).toBe(1);
      expect(user.username).toBe('user1');
    });
    
    it('should create a new user', function() {
      $httpBackend.expectPOST('api/users').respond({ id: 2, username: 'user2' });
      
      const user = REST.users.save({ username: 'user2' });
      $httpBackend.flush();
      
      expect(user.id).toBe(2);
      expect(user.username).toBe('user2');
    });
    
    it('should update a user', function() {
      $httpBackend.expectPUT('api/users/1').respond({ id: 1, username: 'updated_user' });
      
      const user = REST.users.update({ userID: 1, username: 'updated_user' });
      $httpBackend.flush();
      
      expect(user.id).toBe(1);
      expect(user.username).toBe('updated_user');
    });
    
    it('should delete a user', function() {
      $httpBackend.expectDELETE('api/users/1').respond({});
      
      REST.users.delete({ userID: 1 });
      $httpBackend.flush();
    });
  });
});
```

## tests/page.factory.spec.js
```javascript
describe('Page Factory', function() {
  let Page;
  
  beforeEach(function() {
    angular.mock.module('cosmo');
    
    inject(function(_Page_) {
      Page = _Page_;
    });
  });
  
  it('should have default properties', function() {
    expect(Page.id).toBe(0);
    expect(Page.title).toBe('');
    expect(Page.description).toBe('');
    expect(Page.header).toBe('');
    expect(Page.subheader).toBe('');
    expect(Page.body).toBe('');
    expect(Page.url).toBe('');
    expect(Page.type).toBe('');
    expect(Page.published).toBe('');
    expect(Page.published_date).toBe('');
    expect(Array.isArray(Page.themePages)).toBe(true);
    expect(Page.timestamp).toBe('');
    expect(Array.isArray(Page.extras)).toBe(true);
    expect(typeof Page.misc).toBe('object');
  });
  
  it('should allow setting properties', function() {
    Page.id = 123;
    Page.title = 'Test Page';
    Page.description = 'Test Description';
    Page.url = 'test-page';
    
    expect(Page.id).toBe(123);
    expect(Page.title).toBe('Test Page');
    expect(Page.description).toBe('Test Description');
    expect(Page.url).toBe('test-page');
  });
  
  it('should allow adding theme pages', function() {
    Page.themePages.push('page');
    Page.themePages.push('post');
    
    expect(Page.themePages.length).toBe(2);
    expect(Page.themePages).toContain('page');
    expect(Page.themePages).toContain('post');
  });
  
  it('should allow adding extras', function() {
    Page.extras = { featured: { src: 'image.jpg' } };
    
    expect(Page.extras.featured).toBeDefined();
    expect(Page.extras.featured.src).toBe('image.jpg');
  });
});
```

## tests/users.factory.spec.js
```javascript
describe('Users Factory', function() {
  let Users;
  
  beforeEach(function() {
    angular.mock.module('cosmo');
    
    inject(function(_Users_) {
      Users = _Users_;
    });
  });
  
  it('should have default properties', function() {
    expect(Users.id).toBe('');
    expect(Users.username).toBe('');
    expect(Users.name).toBe('');
    expect(Users.bio).toBe('');
    expect(Users.email).toBe('');
    expect(Users.facebook).toBe('');
    expect(Users.twitter).toBe('');
    expect(Users.photo).toBe('');
    expect(Users.role).toBe('');
  });
  
  it('should allow setting properties', function() {
    Users.id = 123;
    Users.username = 'testuser';
    Users.name = 'Test User';
    Users.email = 'test@example.com';
    Users.role = 'admin';
    
    expect(Users.id).toBe(123);
    expect(Users.username).toBe('testuser');
    expect(Users.name).toBe('Test User');
    expect(Users.email).toBe('test@example.com');
    expect(Users.role).toBe('admin');
  });
  
  it('should allow setting social media properties', function() {
    Users.facebook = 'facebook.com/testuser';
    Users.twitter = 'twitter.com/testuser';
    Users.photo = 'profile.jpg';
    
    expect(Users.facebook).toBe('facebook.com/testuser');
    expect(Users.twitter).toBe('twitter.com/testuser');
    expect(Users.photo).toBe('profile.jpg');
  });
});
```

### Tokens: {'input_tokens': 6739, 'output_tokens': 7476}
### Execution time: 87.16581082344055
