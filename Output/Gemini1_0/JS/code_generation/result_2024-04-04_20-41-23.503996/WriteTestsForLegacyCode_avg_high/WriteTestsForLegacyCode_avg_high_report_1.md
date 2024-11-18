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
```ts
import { Page } from './page.js';
import { REST } from './rest.js';
import { Users } from './users.js';
import { PageCtrl } from './pageCtrl.js';

describe('PageCtrl', () => {
  let scope, location, Page, REST, Users, $rootScope, $routeParams, $upload, $translate;

  beforeEach(() => {
    scope = {
      page: {
        id: 0,
        title: '',
        description: '',
        url: '',
        publish: 'Y',
        scheduleDate: new Date(),
        tags: [],
        type: '',
        themePages: []
      },
      newerVersion: false,
      autoURL: false
    };
    location = {
      path: jest.fn()
    };
    Page = {
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
    REST = {
      content: {
        delete: jest.fn(),
        save: jest.fn(),
        update: jest.fn()
      },
      contentRevisions: {
        delete: jest.fn(),
        save: jest.fn()
      },
      contentRevisionsExtras: {
        delete: jest.fn(),
        save: jest.fn()
      },
      contentExtras: {
        delete: jest.fn(),
        save: jest.fn()
      },
      contentTags: {
        delete: jest.fn(),
        save: jest.fn(),
        query: jest.fn()
      }
    };
    Users = {
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
    $rootScope = {
      $broadcast: jest.fn()
    };
    $routeParams = {
      url: 'new'
    };
    $upload = {
      upload: jest.fn()
    };
    $translate = {
      then: jest.fn()
    };
  });

  describe('Initialization', () => {
    it('should initialize the page object', () => {
      const pageCtrl = new PageCtrl($scope, REST, location, Page, $rootScope, $routeParams, $upload, Users, $translate);
      expect(pageCtrl.scope.page).toEqual({
        id: 0,
        title: '',
        description: '',
        url: '',
        publish: 'Y',
        scheduleDate: new Date(),
        tags: [],
        type: '',
        themePages: []
      });
    });

    it('should set the date to today if no date was set', () => {
      const pageCtrl = new PageCtrl($scope, REST, location, Page, $rootScope, $routeParams, $upload, Users, $translate);
      expect(pageCtrl.scope.page.scheduleDate).toEqual(new Date());
    });

    it('should get the pages available to this theme', () => {
      const pageCtrl = new PageCtrl($scope, REST, location, Page, $rootScope, $routeParams, $upload, Users, $translate);
      expect(pageCtrl.scope.page.themePages).toEqual([]);
    });

    it('should initialize the page type', () => {
      const pageCtrl = new PageCtrl($scope, REST, location, Page, $rootScope, $routeParams, $upload, Users, $translate);
      expect(pageCtrl.scope.page.type).toEqual('');
    });

    it('should check if there is an unsaved version from a previous session', () => {
      const pageCtrl = new PageCtrl($scope, REST, location, Page, $rootScope, $routeParams, $upload, Users, $translate);
      expect(pageCtrl.scope.newerVersion).toBe(false);
    });
  });

  describe('Methods', () => {
    let pageCtrl;

    beforeEach(() => {
      pageCtrl = new PageCtrl($scope, REST, location, Page, $rootScope, $routeParams, $upload, Users, $translate);
    });

    describe('localVersion', () => {
      it('should revert to the previously saved version', () => {
        const elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
        angular.forEach(elements, (value) => {
          localStorage.setItem($routeParams.url + value, 'test');
        });
        pageCtrl.localVersion();
        expect(Page.title).toEqual('test');
        expect(Page.description).toEqual('test');
        expect(Page.publish).toEqual('test');
        expect(Page.scheduleDate).toEqual('test');
        expect(Page.header).toEqual('test');
        expect(Page.subheader).toEqual('test');
        expect(Page.body).toEqual('test');
        expect(Page.url).toEqual('test');
        expect(pageCtrl.scope.newerVersion).toBe(false);
      });
    });

    describe('deleteNewerVersion', () => {
      it('should delete the newer version', () => {
        const elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
        angular.forEach(elements, (value) => {
          localStorage.setItem($routeParams.url + value, 'test');
        });
        pageCtrl.deleteNewerVersion();
        expect(localStorage.getItem($routeParams.url + 'title')).toBe(null);
        expect(localStorage.getItem($routeParams.url + 'description')).toBe(null);
        expect(localStorage.getItem($routeParams.url + 'publish')).toBe(null);
        expect(localStorage.getItem($routeParams.url + 'scheduleDate')).toBe(null);
        expect(localStorage.getItem($routeParams.url + 'header')).toBe(null);
        expect(localStorage.getItem($routeParams.url + 'subheader')).toBe(null);
        expect(localStorage.getItem($routeParams.url + 'body')).toBe(null);
        expect(localStorage.getItem($routeParams.url + 'url')).toBe(null);
        expect(pageCtrl.scope.newerVersion).toBe(false);
      });
    });

    describe('deletePage', () => {
      it('should delete the page', () => {
        pageCtrl.scope.page.id = 1;
        pageCtrl.deletePage();
        expect(REST.content.delete).toHaveBeenCalledWith({ contentID: 1 }, expect.any(Function));
        expect(REST.contentRevisions.delete).toHaveBeenCalledWith({ contentID: 1 });
        expect(REST.contentRevisionsExtras.delete).toHaveBeenCalledWith({ contentID: 1 });
        expect(REST.contentExtras.delete).toHaveBeenCalledWith({ contentID: 1 });
        expect(REST.contentTags.delete).toHaveBeenCalledWith({ contentID: 1 });
        expect(location.path).toHaveBeenCalledWith('new');
      });
    });

    describe('updatePage', () => {
      it('should update the page variables when they are changed', () => {
        pageCtrl.updatePage();
        expect(pageCtrl.scope.page.title).toEqual(Page.title);
        expect(pageCtrl.scope.page.description).toEqual(Page.description);
        expect(pageCtrl.scope.page.url).toEqual(Page.url);
        expect(pageCtrl.scope.page.type).toEqual(Page.type);
        expect(pageCtrl.scope.page.tags).toEqual(Page.tags);
      });
    });

    describe('updatePageType', () => {
      it('should update the page type', () => {
        pageCtrl.scope.page.type = 'test';
        pageCtrl.updatePageType();
        expect(Page.type).toEqual('test');
        expect($rootScope.$broadcast).toHaveBeenCalledWith('settingsGet');
      });
    });

    describe('titleChange', () => {
      it('should auto-generate the url from the title', () => {
        pageCtrl.scope.page.url = 'new';
        pageCtrl.scope.page.title = 'test title';
        pageCtrl.titleChange();
        expect(pageCtrl.scope.page.url).toEqual('test-title');
        expect(Page.url).toEqual('test-title');
      });

      it('should only auto-generate urls for new pages', () => {
        pageCtrl.scope.page.url = 'test';
        pageCtrl.scope.page.title = 'test title';
        pageCtrl.titleChange();
        expect(pageCtrl.scope.page.url).toEqual('test');
        expect(Page.url).toEqual('test');
      });
    });

    describe('descriptionChange', () => {
      it('should save changes to the description', () => {
        pageCtrl.scope.page.description = 'test description';
        pageCtrl.descriptionChange();
        expect(Page.description).toEqual('test description');
      });
    });

    describe('urlChange', () => {
      it('should save changes to the url', () => {
        pageCtrl.scope.page.url = 'test url';
        pageCtrl.urlChange();
        expect(Page.url).toEqual('test url');
      });
    });

    describe('saveLocal', () => {
      it('should update page variables when they are changed', () => {
        pageCtrl.scope.page.title = 'test title';
        pageCtrl.scope.page.description = 'test description';
        pageCtrl.scope.page.url = 'test url';
        pageCtrl.scope.page.type = 'test type';
        pageCtrl.saveLocal();
        expect(Page.title).toEqual('test title');
        expect(Page.description).toEqual('test description');
        expect(Page.url).toEqual('test url');
        expect(Page.type).toEqual('test type');
        expect(localStorage.getItem($routeParams.url + 'title')).toEqual('test title');
        expect(localStorage.getItem($routeParams.url + 'description')).toEqual('test description');
        expect(localStorage.getItem($routeParams.url + 'url')).toEqual('test url');
        expect(localStorage.getItem($routeParams.url + 'publish')).toEqual('Y');
        expect(localStorage.getItem($routeParams.url + 'scheduleDate')).toEqual(expect.any(String));
        expect(localStorage.getItem($routeParams.url + 'type')).toEqual('test type');
      });
    });

    describe('autocompleteTags', () => {
      it('should autocomplete tags', () => {
        pageCtrl.scope.page.tags = ['test'];
        REST.contentTags.query = jest.fn().mockImplementation(() => {
          return {
            then: (callback) => {
              callback([{ tag: 'test tag' }]);
            }
          };
        });
        pageCtrl.autocompleteTags();
        expect(pageCtrl.scope.page.suggestions).toEqual([{ tag: 'test tag' }]);
      });

      it('should not autocomplete tags if there is no tag', () => {
        pageCtrl.scope.page.tags = [];
        pageCtrl.autocompleteTags();
        expect(pageCtrl.scope.page.suggestions).toEqual([]);
      });
    });

    describe('selectSuggestion', () => {
      it('should select a tag from autocomplete', () => {
        pageCtrl.scope.page.tags = ['test'];
        pageCtrl.selectSuggestion('test tag');
        expect(pageCtrl.scope.page.tags).toEqual(['test', 'test tag', '']);
        expect(pageCtrl.scope.page.suggestions).toEqual([]);
      });
    });

    describe('savePage', () => {
      it('should check for duplicate URL', () => {
        pageCtrl.scope.page.url = 'test';
        location.path = jest.fn().mockReturnValue('test');
        pageCtrl.savePage();
        expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'Page URL must be different', classes: 'alert-error' });
      });

      it('should check for no page type', () => {
        pageCtrl.scope.page.type = null;
        pageCtrl.savePage();
        expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'Please select a page type', classes: 'alert-error' });
      });

      it('should check for no url', () => {
        pageCtrl.scope.page.url = '';
        pageCtrl.savePage();
        expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'Page URL cannot be empty', classes: 'alert-error' });
      });

      it('should save a new page', () => {
        location.path = jest.fn().mockReturnValue('new');
        pageCtrl.scope.page.title = 'test title';
        pageCtrl.scope.page.description = 'test description';
        pageCtrl.scope.page.header = 'test header';
        pageCtrl.scope.page.subheader = 'test subheader';
        pageCtrl.scope.page.body = 'test body';
        pageCtrl.scope.page.url = 'test url';
        pageCtrl.scope.page.type = 'test type';
        pageCtrl.scope.page.publish = 'Y';
        pageCtrl.scope.page.scheduleDate = new Date();
        pageCtrl.savePage();
        expect(REST.content.save).toHaveBeenCalledWith({
          title: 'test title',
          description: 'test description',
          header: 'test header',
          subheader: 'test subheader',
          featured: null,
          body: 'test body',
          url: 'test url',
          type: 'test type',
          published: 'Y',
          published_date: Math.round(+new Date().getTime() / 1000),
          author: Users.id
        }, expect.any(Function), expect.any(Function));
      });

      it('should update an existing page', () => {
        location.path = jest.fn().mockReturnValue('test');
        pageCtrl.scope.page.id = 1;
        pageCtrl.scope.page.title = 'test title';
        pageCtrl.scope.page.description = 'test description';
        pageCtrl.scope.page.header = 'test header';
        pageCtrl.scope.page.subheader = 'test subheader';
        pageCtrl.scope.page.body = 'test body';
        pageCtrl.scope.page.url = 'test url';
        pageCtrl.scope.page.type = 'test type';
        pageCtrl.scope.page.publish = 'Y';
        pageCtrl.scope.page.scheduleDate = new Date();
        pageCtrl.savePage();
        expect(REST.content.update).toHaveBeenCalledWith({
          contentID: 1,
          title: 'test title',
          description: 'test description',
          header: 'test header',
          subheader: 'test subheader',
          featured: null,
          body: 'test body',
          url: 'test url',
          type: 'test type',
          published: 'Y',
          published_date: Math.round(+new Date().getTime() / 1000),
          author: Users.id
        }, expect.any(Function), expect.any(Function));
      });
    });
  });
});
```
### Tokens: {'prompt_tokens': 6308, 'completion_tokens': 3642, 'total_tokens': 9950}
### Execution time: 21.913779973983765
