Your task is to write unit-tests for a legacy part of frontend application.

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


When performing this task, please adhere to the following instructions:
- Choose libraries for testing.
- Set up the testing environment.
- Aim to cover at least 80% of the code.
- Use mocking for dependencies if necessary.
- Ensure that the generated code does not contain any TODOs.
- Simply return the codebase without additional comments.
## Run 1:
### Answer:
```javascript
// karma.conf.js
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular.min.js',
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-mocks.js',
      'app/**/*.js',
      'test/**/*.spec.js'
    ],
    exclude: [],
    preprocessors: {},
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: false,
    concurrency: Infinity
  })
}
```

```json
// package.json
{
  "name": "legacy-frontend-tests",
  "version": "1.0.0",
  "description": "Unit tests for legacy frontend application",
  "main": "index.js",
  "scripts": {
    "test": "karma start karma.conf.js"
  },
  "devDependencies": {
    "jasmine-core": "^3.10.1",
    "karma": "^6.3.4",
    "karma-chrome-launcher": "^3.1.0",
    "karma-jasmine": "^4.0.1",
    "karma-coverage": "^2.0.3",
    "angular-mocks": "^1.7.9"
  }
}
```

```javascript
// test/pageCtrl.spec.js
describe('pageCtrl Controller', function() {
  var $controller, $rootScope, $scope, $q;
  var mockREST, mockPage, mockUsers, mockTranslate, mockLocation, mockUpload;
  var deferredContentDelete, deferredContentRevisionsDelete, deferredContentRevisionsExtrasDelete, deferredContentExtrasDelete, deferredContentTagsDelete;
  var deferredContentSave, deferredContentUpdate, deferredContentRevisionsSave, deferredContentExtrasSave, deferredContentRevisionsExtrasSave;
  var deferredContentTagsSave, deferredNotify, deferredTranslate;

  beforeEach(module('cosmo'));

  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;

    mockREST = {
      content: {
        delete: jasmine.createSpy('delete').and.callFake(function() {
          deferredContentDelete = $q.defer();
          return deferredContentDelete.promise;
        }),
        save: jasmine.createSpy('save').and.callFake(function() {
          deferredContentSave = $q.defer();
          return deferredContentSave.promise;
        }),
        update: jasmine.createSpy('update').and.callFake(function() {
          deferredContentUpdate = $q.defer();
          return deferredContentUpdate.promise;
        })
      },
      contentRevisions: {
        delete: jasmine.createSpy('contentRevisions.delete').and.callFake(function() {
          deferredContentRevisionsDelete = $q.defer();
          return deferredContentRevisionsDelete.promise;
        }),
        save: jasmine.createSpy('contentRevisions.save').and.callFake(function() {
          deferredContentRevisionsSave = $q.defer();
          return deferredContentRevisionsSave.promise;
        })
      },
      contentRevisionsExtras: {
        delete: jasmine.createSpy('contentRevisionsExtras.delete').and.callFake(function() {
          deferredContentRevisionsExtrasDelete = $q.defer();
          return deferredContentRevisionsExtrasDelete.promise;
        }),
        save: jasmine.createSpy('contentRevisionsExtras.save').and.callFake(function() {
          deferredContentRevisionsExtrasSave = $q.defer();
          return deferredContentRevisionsExtrasSave.promise;
        })
      },
      contentExtras: {
        delete: jasmine.createSpy('contentExtras.delete').and.callFake(function() {
          deferredContentExtrasDelete = $q.defer();
          return deferredContentExtrasDelete.promise;
        }),
        save: jasmine.createSpy('contentExtras.save').and.callFake(function() {
          deferredContentExtrasSave = $q.defer();
          return deferredContentExtrasSave.promise;
        })
      },
      contentTags: {
        delete: jasmine.createSpy('contentTags.delete').and.callFake(function() {
          deferredContentTagsDelete = $q.defer();
          return deferredContentTagsDelete.promise;
        }),
        save: jasmine.createSpy('contentTags.save').and.callFake(function() {
          deferredContentTagsSave = $q.defer();
          return deferredContentTagsSave.promise;
        }),
        query: jasmine.createSpy('contentTags.query').and.callFake(function() {
          var deferred = $q.defer();
          return deferred.promise;
        })
      }
    };

    mockPage = {
      id: 1,
      title: 'Test Title',
      description: 'Test Description',
      url: 'test-url',
      publish: 'Y',
      scheduleDate: 1609459200,
      tags: ['test'],
      type: 'default',
      themePages: ['home', 'about'],
      extras: {}
    };

    mockUsers = {
      id: 2
    };

    mockTranslate = function(key) {
      var deferred = $q.defer();
      deferred.resolve(key);
      return deferred.promise;
    };

    mockLocation = {
      path: jasmine.createSpy('path').and.returnValue('/edit'),
      pathChange: jasmine.createSpy('pathChange')
    };

    mockUpload = {};

    $scope = $rootScope.$new();

    $controller('pageCtrl', {
      $scope: $scope,
      REST: mockREST,
      Page: mockPage,
      Users: mockUsers,
      $location: mockLocation,
      $translate: mockTranslate,
      $upload: mockUpload,
      $rootScope: $rootScope
    });
  }));

  it('should initialize page correctly', function() {
    expect($scope.page.title).toBe(mockPage.title);
    expect($scope.page.description).toBe(mockPage.description);
    expect($scope.page.url).toBe(mockPage.url);
    expect($scope.page.type).toBe(mockPage.type);
    expect($scope.page.tags).toEqual(mockPage.tags);
    expect($scope.page.themePages).toEqual(mockPage.themePages);
  });

  it('should set scheduleDate to today if not set or new page', function() {
    var newPage = angular.copy(mockPage);
    newPage.scheduleDate = null;
    newPage.id = 0;
    $controller('pageCtrl', {
      $scope: $scope,
      REST: mockREST,
      Page: newPage,
      Users: mockUsers,
      $location: mockLocation,
      $translate: mockTranslate,
      $upload: mockUpload,
      $rootScope: $rootScope
    });
    expect($scope.page.scheduleDate).toEqual(jasmine.any(Date));
  });

  it('should call deleteNewerVersion and clear localStorage', function() {
    spyOn(localStorage, 'setItem');
    $scope.deleteNewerVersion();
    expect(localStorage.setItem).toHaveBeenCalled();
    expect($scope.newerVersion).toBe(false);
  });

  it('should call localVersion and restore Page values', function() {
    spyOn(localStorage, 'getItem').and.returnValue('restored');
    spyOn(localStorage, 'setItem');
    spyOn($rootScope, '$broadcast');

    $scope.localVersion();
    expect(localStorage.getItem).toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalledWith(jasmine.any(String), null);
    expect($scope.newerVersion).toBe(false);
    expect($rootScope.$broadcast).toHaveBeenCalledWith('contentGet');
  });

  it('should delete the page and related data', function() {
    spyOn($rootScope, '$broadcast');
    spyOn($translate, 'call').and.returnValue($q.resolve('deleted'));
    $scope.deletePage();
    deferredContentDelete.resolve();
    deferredContentRevisionsDelete.resolve();
    deferredContentRevisionsExtrasDelete.resolve();
    deferredContentExtrasDelete.resolve();
    deferredContentTagsDelete.resolve();
    $rootScope.$apply();

    expect(mockREST.content.delete).toHaveBeenCalledWith({ contentID: mockPage.id });
    expect(mockREST.contentRevisions.delete).toHaveBeenCalledWith({ contentID: mockPage.id });
    expect(mockREST.contentRevisionsExtras.delete).toHaveBeenCalledWith({ contentID: mockPage.id });
    expect(mockREST.contentExtras.delete).toHaveBeenCalledWith({ contentID: mockPage.id });
    expect(mockREST.contentTags.delete).toHaveBeenCalledWith({ contentID: mockPage.id });
    expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'deleted' });
    expect(mockLocation.path).toHaveBeenCalledWith('new');
  });

  it('should update page type', function() {
    spyOn($rootScope, '$broadcast');
    $scope.page.type = 'newType';
    $scope.updatePageType();
    expect(mockPage.type).toBe('newType');
    expect($rootScope.$broadcast).toHaveBeenCalledWith('settingsGet');
  });

  it('should auto-generate URL on title change', function() {
    $scope.page.title = 'New Title';
    $scope.page.url = '';
    $scope.autoURL = true;
    $scope.titleChange();
    expect($scope.page.url).toBe('new-title');
    expect(mockPage.url).toBe('new-title');
  });

  it('should not auto-generate URL if autoURL is false', function() {
    $scope.page.title = 'Another Title';
    $scope.page.url = 'custom-url';
    $scope.autoURL = false;
    $scope.titleChange();
    expect($scope.page.url).toBe('custom-url');
    expect(mockPage.url).toBe('custom-url');
  });

  it('should handle description change', function() {
    $scope.page.description = 'Updated Description';
    $scope.descriptionChange();
    expect(mockPage.description).toBe('Updated Description');
  });

  it('should handle URL change', function() {
    $scope.page.url = 'updated-url';
    $scope.urlChange();
    expect(mockPage.url).toBe('updated-url');
  });

  it('should save local changes', function() {
    spyOn(localStorage, 'setItem');
    $scope.saveLocal();
    expect(mockPage.title).toBe($scope.page.title);
    expect(mockPage.description).toBe($scope.page.description);
    expect(mockPage.url).toBe($scope.page.url);
    expect(mockPage.type).toBe($scope.page.type);
    expect(localStorage.setItem).toHaveBeenCalledWith(jasmine.any(String), mockPage.title);
    expect(localStorage.setItem).toHaveBeenCalledWith(jasmine.any(String), mockPage.description);
    expect(localStorage.setItem).toHaveBeenCalledWith(jasmine.any(String), mockPage.url);
    expect(localStorage.setItem).toHaveBeenCalledWith(jasmine.any(String), mockPage.publish);
    expect(localStorage.setItem).toHaveBeenCalledWith(jasmine.any(String), mockPage.scheduleDate);
    expect(localStorage.setItem).toHaveBeenCalledWith(jasmine.any(String), mockPage.type);
  });

  it('should autocomplete tags', function() {
    mockREST.contentTags.query.and.callFake(function(params, success, error) {
      success(['tag1', 'tag2']);
    });
    $scope.page.tags = ['test', 'ta'];
    $scope.autocompleteTags();
    $rootScope.$apply();
    expect(mockREST.contentTags.query).toHaveBeenCalledWith({ tag: 'ta' }, jasmine.any(Function), jasmine.any(Function));
    expect($scope.page.suggestions).toEqual(['tag1', 'tag2']);
  });

  it('should select a tag suggestion', function() {
    $scope.page.tags = ['test'];
    $scope.page.suggestions = ['suggest1', 'suggest2'];
    $scope.selectSuggestion('suggest1');
    expect($scope.page.tags).toEqual(['suggest1', '']);
    expect($scope.page.suggestions).toEqual([]);
  });

  describe('savePage function', function() {
    beforeEach(function() {
      spyOn($translate, 'call').and.callFake(function(key) {
        var deferred = $q.defer();
        deferred.resolve(key);
        return deferred.promise;
      });
    });

    it('should show error if duplicate URL', function() {
      $scope.page.url = '/edit';
      spyOn($rootScope, '$broadcast');
      $scope.savePage(true);
      deferredTranslate.resolve('page_different_url');
      $rootScope.$apply();
      expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', {message: 'page_different_url', classes: 'alert-error'});
      expect(mockREST.content.save).not.toHaveBeenCalled();
    });

    it('should show error if no page type selected', function() {
      $scope.page.type = '';
      spyOn($rootScope, '$broadcast');
      $scope.savePage();
      deferredTranslate.resolve('page_no_type_selected');
      $rootScope.$apply();
      expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', {message: 'page_no_type_selected', classes: 'alert-error'});
      expect(mockREST.content.save).not.toHaveBeenCalled();
    });

    it('should show error if no URL provided', function() {
      $scope.page.url = '';
      spyOn($rootScope, '$broadcast');
      $scope.savePage();
      deferredTranslate.resolve('page_no_url');
      $rootScope.$apply();
      expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'page_no_url', classes: 'alert-error' });
      expect(mockREST.content.save).not.toHaveBeenCalled();
    });

    it('should save new page successfully', function() {
      spyOn($rootScope, '$broadcast');
      $scope.savePage();
      expect(mockREST.content.save).toHaveBeenCalled();

      deferredContentSave.resolve({id: 3});
      deferredContentRevisionsSave.resolve({id: 4});
      $rootScope.$apply();

      expect(mockREST.contentTags.save).toHaveBeenCalledWith({ contentID: 3, tag: 'test' });
      expect(mockREST.contentRevisions.save).toHaveBeenCalled();
      expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', {message: 'page_created'});
      expect(mockLocation.path).toHaveBeenCalledWith('test-url');
    });

    it('should handle error on saving new page', function() {
      spyOn($rootScope, '$broadcast');
      $scope.savePage();
      deferredContentSave.reject();
      $rootScope.$apply();
      expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', {message: 'page_error_saving', classes: 'alert-error'});
    });

    it('should update existing page successfully', function() {
      mockLocation.path.and.returnValue('/edit');
      spyOn($rootScope, '$broadcast');
      $scope.savePage();
      expect(mockREST.content.update).toHaveBeenCalled();

      deferredContentUpdate.resolve();
      deferredContentRevisionsSave.resolve({id: 5});
      deferredContentExtrasDelete.resolve();
      deferredContentTagsDelete.resolve();
      mockREST.contentTags.save.and.callFake(function() {
        return;
      });
      deferredContentExtrasSave.resolve();
      $rootScope.$apply();

      expect(mockREST.contentRevisions.save).toHaveBeenCalled();
      expect(mockREST.contentExtras.delete).toHaveBeenCalled();
      expect(mockREST.contentTags.delete).toHaveBeenCalled();
      expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', {message: 'page_updated'});
      expect(mockLocation.path).toHaveBeenCalledWith('test-url');
    });

    it('should handle error on updating existing page', function() {
      spyOn($rootScope, '$broadcast');
      $scope.savePage();
      deferredContentUpdate.reject();
      $rootScope.$apply();
      expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', {message: 'page_error_updating', classes: 'alert-error'});
    });
  });
});
```

```html
<!-- test/index.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Legacy Frontend Tests</title>
</head>
<body>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-mocks.js"></script>
  <script src="../app/page.js"></script>
  <script src="../app/rest.js"></script>
  <script src="../app/users.js"></script>
  <script src="../app/pageCtrl.js"></script>
  <script src="pageCtrl.spec.js"></script>
</body>
</html>
```

### Tokens: {'input_tokens': 5469, 'output_tokens': 4276, 'reasoning_tokens': 704}
### Execution time: 51.23035907745361