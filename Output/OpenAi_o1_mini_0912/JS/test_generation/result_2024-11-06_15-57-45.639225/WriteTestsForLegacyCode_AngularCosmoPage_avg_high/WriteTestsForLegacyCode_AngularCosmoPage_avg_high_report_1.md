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
```json
// package.json
{
  "name": "cosmo-frontend-tests",
  "version": "1.0.0",
  "description": "Unit tests for Cosmo frontend application",
  "scripts": {
    "test": "karma start karma.conf.js"
  },
  "devDependencies": {
    "angular": "^1.8.2",
    "angular-mocks": "^1.8.2",
    "jasmine-core": "^3.8.0",
    "karma": "^6.3.4",
    "karma-chrome-launcher": "^3.1.0",
    "karma-jasmine": "^4.0.1",
    "karma-coverage": "^2.0.3"
  }
}
```

```javascript
// karma.conf.js
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-translate/dist/angular-translate.js',
      'path/to/your/app/**/*.js',
      'path/to/your/tests/**/*.spec.js'
    ],
    exclude: [],
    preprocessors: {
      'path/to/your/app/**/*.js': ['coverage']
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },
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

```javascript
// tests/pageFactory.spec.js
describe('Page Factory', function() {
  var Page;

  beforeEach(module('cosmo'));

  beforeEach(inject(function(_Page_) {
    Page = _Page_;
  }));

  it('should have default values', function() {
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
    expect(Page.themePages).toEqual([]);
    expect(Page.timestamp).toBe('');
    expect(Page.extras).toEqual([]);
    expect(Page.misc).toEqual({});
  });
});
```

```javascript
// tests/users.spec.js
describe('Users Factory', function() {
  var Users;

  beforeEach(module('cosmo'));

  beforeEach(inject(function(_Users_) {
    Users = _Users_;
  }));

  it('should have default values', function() {
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
});
```

```javascript
// tests/pageCtrl.spec.js
describe('pageCtrl', function() {
  var $controller, $rootScope, $scope, REST, Page, $location, $routeParams, $translate, Users, createController, deferredContentDelete, deferredContentRevisionsDelete, deferredContentRevisionsExtrasDelete, deferredContentExtrasDelete, deferredContentTagsDelete, deferredContentSave, deferredContentUpdate, deferredContentRevisionsSave, deferredContentTagsSave, deferredContentRevisionsExtrasSave, deferredContentExtrasSave;
  
  beforeEach(module('cosmo'));

  beforeEach(inject(function(_$controller_, _$rootScope_, _REST_, _Page_, _$location_, _$routeParams_, _$translate_, _Users_, $q) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    REST = _REST_;
    Page = _Page_;
    $location = _$location_;
    $routeParams = _$routeParams_;
    $translate = _$translate_;
    Users = _Users_;

    deferredContentDelete = $q.defer();
    deferredContentRevisionsDelete = $q.defer();
    deferredContentRevisionsExtrasDelete = $q.defer();
    deferredContentExtrasDelete = $q.defer();
    deferredContentTagsDelete = $q.defer();
    deferredContentSave = $q.defer();
    deferredContentUpdate = $q.defer();
    deferredContentRevisionsSave = $q.defer();
    deferredContentTagsSave = $q.defer();
    deferredContentRevisionsExtrasSave = $q.defer();
    deferredContentExtrasSave = $q.defer();

    spyOn(REST.content, 'delete').and.returnValue(deferredContentDelete.promise);
    spyOn(REST.contentRevisions, 'delete').and.returnValue(deferredContentRevisionsDelete.promise);
    spyOn(REST.contentRevisionsExtras, 'delete').and.returnValue(deferredContentRevisionsExtrasDelete.promise);
    spyOn(REST.contentExtras, 'delete').and.returnValue(deferredContentExtrasDelete.promise);
    spyOn(REST.contentTags, 'delete').and.returnValue(deferredContentTagsDelete.promise);
    spyOn(REST.content, 'save').and.returnValue(deferredContentSave.promise);
    spyOn(REST.content, 'update').and.returnValue(deferredContentUpdate.promise);
    spyOn(REST.contentRevisions, 'save').and.returnValue(deferredContentRevisionsSave.promise);
    spyOn(REST.contentTags, 'save').and.returnValue(deferredContentTagsSave.promise);
    spyOn(REST.contentRevisionsExtras, 'save').and.returnValue(deferredContentRevisionsExtrasSave.promise);
    spyOn(REST.contentExtras, 'save').and.returnValue(deferredContentExtrasSave.promise);
    spyOn($translate, 'then').and.callThrough();

    createController = function() {
      return $controller('pageCtrl', {
        '$scope': $scope,
        'REST': REST,
        '$location': $location,
        'Page': Page,
        '$routeParams': $routeParams,
        '$translate': $translate,
        'Users': Users,
        '$rootScope': $rootScope
      });
    };
  }));

  it('should initialize page variables', function() {
    Page.title = 'Test Title';
    Page.description = 'Test Description';
    Page.url = 'test-url';
    Page.type = 'test-type';
    Page.publish = 'Y';
    Page.scheduleDate = 1633072800;
    Page.tags = ['test'];
    Page.themePages = ['theme1', 'theme2'];
    
    var controller = createController();
    expect($scope.page.title).toBe('Test Title');
    expect($scope.page.description).toBe('Test Description');
    expect($scope.page.url).toBe('test-url');
    expect($scope.page.type).toBe('test-type');
    expect($scope.page.publish).toBe('Y');
    expect($scope.page.scheduleDate).toEqual(new Date(Page.scheduleDate * 1000));
    expect($scope.page.tags).toEqual(['test']);
    expect($scope.page.themePages).toEqual(['theme1', 'theme2']);
  });

  it('should set scheduleDate to today if not set and path is not /new', function() {
    Page.scheduleDate = null;
    spyOn($location, 'path').and.returnValue('/edit');
    var controller = createController();
    expect($scope.page.scheduleDate).toEqual(new Date());
  });

  it('should set page.type to first themePage if Page.type is not set', function() {
    Page.type = '';
    Page.themePages = ['theme1', 'theme2'];
    var controller = createController();
    expect($scope.page.type).toBe('theme1');
  });

  it('should detect newerVersion if localStorage has different values', function() {
    spyOn(localStorage, 'getItem').and.callFake(function(key) {
      if(key === 'testurltitle') return 'Different Title';
      return null;
    });
    $routeParams.url = 'testurl';
    var controller = createController();
    expect($scope.newerVersion).toBe(true);
  });

  it('should revert to local version', function() {
    spyOn(localStorage, 'getItem').and.returnValue('Local Title');
    spyOn(localStorage, 'setItem');
    $routeParams.url = 'testurl';
    var controller = createController();
    $scope.localVersion();
    expect(Page.title).toBe('Local Title');
    expect(localStorage.setItem).toHaveBeenCalledWith('testurltitle', null);
    expect($scope.newerVersion).toBe(false);
  });

  it('should delete newer version', function() {
    spyOn(localStorage, 'setItem');
    $routeParams.url = 'testurl';
    var controller = createController();
    $scope.deleteNewerVersion();
    expect(localStorage.setItem).toHaveBeenCalledWith('testurltitle', null);
    expect($scope.newerVersion).toBe(false);
  });

  it('should delete page and related data', function() {
    var controller = createController();
    $scope.page.id = 1;
    $scope.deletePage();
    deferredContentDelete.resolve({});
    deferredContentRevisionsDelete.resolve({});
    deferredContentRevisionsExtrasDelete.resolve({});
    deferredContentExtrasDelete.resolve({});
    deferredContentTagsDelete.resolve({});
    $rootScope.$apply();
    expect(REST.content.delete).toHaveBeenCalledWith({ contentID: 1 }, jasmine.any(Function));
    expect($location.path).toHaveBeenCalledWith('new');
  });

  it('should save local changes', function() {
    $scope.page.title = 'New Title';
    $scope.page.description = 'New Description';
    $scope.page.url = 'new-url';
    $scope.page.type = 'new-type';
    $scope.saveLocal();
    expect(Page.title).toBe('New Title');
    expect(Page.description).toBe('New Description');
    expect(Page.url).toBe('new-url');
    expect(Page.type).toBe('new-type');
    expect(localStorage.setItem).toHaveBeenCalledWith($routeParams.url + 'title', 'New Title');
    expect(localStorage.setItem).toHaveBeenCalledWith($routeParams.url + 'description', 'New Description');
    expect(localStorage.setItem).toHaveBeenCalledWith($routeParams.url + 'url', 'new-url');
    expect(localStorage.setItem).toHaveBeenCalledWith($routeParams.url + 'publish', Page.publish);
    expect(localStorage.setItem).toHaveBeenCalledWith($routeParams.url + 'scheduleDate', Page.scheduleDate);
    expect(localStorage.setItem).toHaveBeenCalledWith($routeParams.url + 'type', 'new-type');
  });

  it('should autocomplete tags', function() {
    $scope.page.tags = ['tag1', 'tag2'];
    REST.contentTags.query = jasmine.createSpy().and.callFake(function(params, success, error) {
      success(['suggestion1', 'suggestion2']);
    });
    var controller = createController();
    $scope.autocompleteTags();
    $rootScope.$apply();
    expect($scope.page.suggestions).toEqual(['suggestion1', 'suggestion2']);
  });

  it('should select tag suggestion', function() {
    $scope.page.tags = ['tag1'];
    $scope.page.suggestions = ['suggestion1', 'suggestion2'];
    $scope.selectSuggestion('suggestion1');
    expect($scope.page.tags).toEqual(['suggestion1', '']);
    expect($scope.page.suggestions).toEqual([]);
  });

  it('should save new page', function() {
    spyOn($location, 'path');
    Users.id = 123;
    $scope.page = {
      title: 'Test Page',
      description: 'Test Description',
      url: 'test-page',
      type: 'test-type',
      publish: 'Y',
      scheduleDate: Math.floor(Date.now() / 1000),
      tags: ['tag1', 'tag2']
    };
    var controller = createController();
    $scope.savePage(false);
    deferredContentSave.resolve({id: 1});
    deferredContentRevisionsSave.resolve({id: 10});
    deferredContentTagsSave.resolve({});
    $rootScope.$apply();
    expect(REST.content.save).toHaveBeenCalled();
    expect(REST.contentRevisions.save).toHaveBeenCalled();
    expect(REST.contentTags.save).toHaveBeenCalledTimes(2);
    expect($location.path).toHaveBeenCalledWith('test-page');
  });

  it('should update existing page', function() {
    spyOn($location, 'path');
    Users.id = 123;
    Page.id = 1;
    $scope.page = {
      title: 'Updated Page',
      description: 'Updated Description',
      url: 'updated-page',
      type: 'updated-type',
      publish: 'N',
      scheduleDate: Math.floor(Date.now() / 1000),
      tags: ['tag3']
    };
    var controller = createController();
    $scope.savePage(false);
    deferredContentUpdate.resolve({});
    deferredContentRevisionsSave.resolve({id: 20});
    deferredContentExtrasDelete.resolve({});
    deferredContentTagsDelete.resolve({});
    deferredContentTagsSave.resolve({});
    deferredContentExtrasSave.resolve({});
    $rootScope.$apply();
    expect(REST.content.update).toHaveBeenCalled();
    expect(REST.contentRevisions.save).toHaveBeenCalled();
    expect(REST.contentExtras.delete).toHaveBeenCalled();
    expect(REST.contentTags.delete).toHaveBeenCalled();
    expect(REST.contentTags.save).toHaveBeenCalledWith({ contentID: 1, tag: 'tag3' });
    expect($location.path).toHaveBeenCalledWith('updated-page');
  });

  it('should not save duplicate URL when duplicating', function() {
    spyOn($rootScope, '$broadcast');
    $scope.page.url = '/current-url';
    spyOn($location, 'path').and.returnValue('/current-url');
    var controller = createController();
    $scope.savePage(true);
    $rootScope.$apply();
    expect($rootScope.$broadcast).toHaveBeenCalled();
    expect(REST.content.save).not.toHaveBeenCalled();
  });

  it('should show error if no page type is selected', function() {
    spyOn($rootScope, '$broadcast');
    $scope.page.type = '';
    var controller = createController();
    $scope.savePage(false);
    $rootScope.$apply();
    expect($rootScope.$broadcast).toHaveBeenCalled();
    expect(REST.content.save).not.toHaveBeenCalled();
  });

  it('should show error if no URL is provided', function() {
    spyOn($rootScope, '$broadcast');
    $scope.page.url = 'new';
    var controller = createController();
    $scope.savePage(false);
    $rootScope.$apply();
    expect($rootScope.$broadcast).toHaveBeenCalled();
    expect(REST.content.save).not.toHaveBeenCalled();
  });

  it('should generate URL from title if autoURL is true', function() {
    var controller = createController();
    $scope.page.title = 'New Page Title';
    $scope.page.url = '';
    $scope.titleChange();
    expect($scope.page.url).toBe('new-page-title');
    expect(Page.url).toBe('new-page-title');
  });

  it('should update page type', function() {
    spyOn($rootScope, '$broadcast');
    var controller = createController();
    $scope.page.type = 'updated-type';
    $scope.updatePageType();
    expect(Page.type).toBe('updated-type');
    expect($rootScope.$broadcast).toHaveBeenCalledWith('settingsGet');
  });
});
```

```javascript
// tests/rest.spec.js
describe('REST Factory', function() {
  var REST, $httpBackend;

  beforeEach(module('cosmo'));

  beforeEach(inject(function(_REST_, _$httpBackend_) {
    REST = _REST_;
    $httpBackend = _$httpBackend_;
  }));

  it('should have all REST resources defined', function() {
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

  it('should make GET request for content', function() {
    $httpBackend.expectGET('api/content/1').respond(200, {id:1, title:'Test'});
    REST.content.get({ contentID: 1 }, function(data) {
      expect(data.title).toBe('Test');
    });
    $httpBackend.flush();
  });

  it('should make POST request to save content', function() {
    $httpBackend.expectPOST('api/content/').respond(201, {id:2});
    REST.content.save({}, {title:'New Content'}, function(data) {
      expect(data.id).toBe(2);
    });
    $httpBackend.flush();
  });

  it('should make PUT request to update content', function() {
    $httpBackend.expectPUT('api/content/1').respond(200, {id:1, title:'Updated'});
    REST.content.update({ contentID:1 }, {title:'Updated'}, function(data) {
      expect(data.title).toBe('Updated');
    });
    $httpBackend.flush();
  });
});
```

```javascript
// tests/users.spec.js
describe('Users Factory', function() {
  var Users;

  beforeEach(module('cosmo'));

  beforeEach(inject(function(_Users_) {
    Users = _Users_;
  }));

  it('should have default user properties', function() {
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

  it('should allow updating user properties', function() {
    Users.id = '1';
    Users.username = 'testuser';
    Users.name = 'Test User';
    Users.bio = 'Bio';
    Users.email = 'test@example.com';
    Users.facebook = 'fb.com/test';
    Users.twitter = '@test';
    Users.photo = 'photo.jpg';
    Users.role = 'admin';

    expect(Users.id).toBe('1');
    expect(Users.username).toBe('testuser');
    expect(Users.name).toBe('Test User');
    expect(Users.bio).toBe('Bio');
    expect(Users.email).toBe('test@example.com');
    expect(Users.facebook).toBe('fb.com/test');
    expect(Users.twitter).toBe('@test');
    expect(Users.photo).toBe('photo.jpg');
    expect(Users.role).toBe('admin');
  });
});
```

```javascript
// tests/page.html.spec.js
describe('page.html', function() {
  var $compile, $rootScope, element, scope;

  beforeEach(module('cosmo'));
  beforeEach(module('path/to/page.html'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    element = $compile('<div ng-controller="pageCtrl"></div>')(scope);
    scope.$digest();
  }));

  it('should render new-version section when newerVersion is true', function() {
    scope.newerVersion = true;
    scope.$digest();
    var newVersionSection = element[0].querySelector('.new-version');
    expect(newVersionSection).not.toBeNull();
    expect(newVersionSection.style.display).not.toBe('none');
  });

  it('should hide new-version section when newerVersion is false', function() {
    scope.newerVersion = false;
    scope.$digest();
    var newVersionSection = element[0].querySelector('.new-version');
    expect(newVersionSection).not.toBeNull();
    expect(newVersionSection.style.display).toBe('none');
  });

  it('should show confirm buttons when page.confirm is true', function() {
    scope.page.confirm = true;
    scope.$digest();
    var confirmButtons = element[0].querySelector('.bar--actions button.btn-error[translate="yes"]');
    expect(confirmButtons).not.toBeNull();
  });

  it('should hide confirm buttons when page.confirm is false', function() {
    scope.page.confirm = false;
    scope.$digest();
    var confirmButtons = element[0].querySelector('.bar--actions button.btn-error[translate="yes"]');
    expect(confirmButtons).toBeNull();
  });

  it('should display schedule date input when publish is schedule', function() {
    scope.page.publish = 'schedule';
    scope.$digest();
    var scheduleInput = element[0].querySelector('input[type="datetime-local"]');
    expect(scheduleInput).not.toBeNull();
  });

  it('should hide schedule date input when publish is not schedule', function() {
    scope.page.publish = 'Y';
    scope.$digest();
    var scheduleInput = element[0].querySelector('input[type="datetime-local"]');
    expect(scheduleInput).toBeNull();
  });

  it('should call deletePage on delete button click', function() {
    spyOn(scope, 'deletePage');
    var deleteButton = element[0].querySelector('.bar--actions button.btn-error[translate="delete"]');
    angular.element(deleteButton).triggerHandler('click');
    expect(scope.deletePage).toHaveBeenCalled();
  });

  it('should call savePage on save button click', function() {
    spyOn(scope, 'savePage');
    var saveButton = element[0].querySelector('.bar--actions button.btn-success[translate="save"]');
    angular.element(saveButton).triggerHandler('click');
    expect(scope.savePage).toHaveBeenCalled();
  });
});
```

```javascript
// tests/coverage.config.js
module.exports = {
  exclude: [
    'path/to/excluded/files/**/*.js'
  ],
  report: {
    type: 'html',
    dir: 'coverage/'
  }
}
```

### Tokens: {'input_tokens': 5469, 'output_tokens': 5476, 'reasoning_tokens': 576}
### Execution time: 30.9730806350708
