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
package.json
```json
{
  "name": "cosmo-tests",
  "version": "1.0.0",
  "description": "Tests for Cosmo AngularJS application",
  "devDependencies": {
    "jasmine-core": "^3.10.1",
    "karma": "^6.3.17",
    "karma-chrome-launcher": "^3.1.0",
    "karma-jasmine": "^4.0.2",
    "karma-coverage": "^2.2.0",
    "angular": "^1.8.2",
    "angular-mocks": "^1.8.2"
  },
  "scripts": {
    "test": "karma start karma.conf.js"
  }
}
```

karma.conf.js
```js
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'path/to/your/js/files/*.js',
      'path/to/your/test/files/*.spec.js'
    ],
    exclude: [],
    preprocessors: {
      'path/to/your/js/files/*.js': ['coverage']
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },
    port: 9876,
    colors: true,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity
  })
}
```

tests/page.spec.js
```js
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

tests/pageCtrl.spec.js
```js
describe('pageCtrl', function() {
  var $controller, $rootScope, $scope, $location, Page, REST, Users, $routeParams, $q, $translate;
  
  beforeEach(module('cosmo'));

  beforeEach(inject(function(_$controller_, _$rootScope_, _$location_, _Page_, _REST_, _Users_, _$routeParams_, _$q_, _$translate_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $location = _$location_;
    Page = _Page_;
    REST = _REST_;
    Users = _Users_;
    $routeParams = _$routeParams_;
    $q = _$q_;
    $translate = _$translate_;

    spyOn(REST.content, 'save').and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve({ id: 123 });
      return { $promise: deferred.promise };
    });

    spyOn(REST.content, 'update').and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve();
      return { $promise: deferred.promise };
    });

    spyOn(REST.contentTags, 'save').and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve();
      return { $promise: deferred.promise };
    });

    spyOn($translate, 'then').and.callThrough();

    $controller('pageCtrl', {
      $scope: $scope,
      $location: $location,
      Page: Page,
      $rootScope: $rootScope,
      $routeParams: $routeParams,
      REST: REST,
      Users: Users,
      $translate: $translate
    });
  }));

  it('should initialize page with default Page values', function() {
    expect($scope.page.id).toBe(Page.id);
    expect($scope.page.title).toBe(Page.title);
    expect($scope.page.description).toBe(Page.description);
    expect($scope.page.url).toBe(Page.url);
    expect($scope.page.publish).toBe(Page.publish);
    expect($scope.page.scheduleDate).toBe(Page.scheduleDate);
    expect($scope.page.tags).toBe(Page.tags);
    expect($scope.page.type).toBe(Page.type);
    expect($scope.page.themePages).toEqual([]);
  });

  it('should default scheduleDate to today if not set', function() {
    if(!$scope.page.scheduleDate || $location.path() === '/new') {
      var today = new Date();
      expect($scope.page.scheduleDate.toDateString()).toBe(today.toDateString());
    }
  });

  it('should check for unsaved versions', function() {
    $location.path('/edit');
    $routeParams.url = 'test-url';
    localStorage.setItem('test-urltitle', 'New Title');
    Page.title = 'Old Title';
    $scope.newerVersion = false;
    $scope.$apply();
    expect($scope.newerVersion).toBe(true);
  });

  it('should save local version', function() {
    $routeParams.url = 'test-url';
    localStorage.setItem('test-urltitle', 'New Title');
    Page.title = 'Old Title';
    $scope.localVersion();
    expect(Page.title).toBe('New Title');
    expect(localStorage.getItem('test-urltitle')).toBe('null');
    expect($scope.newerVersion).toBe(false);
  });

  it('should delete newer version', function() {
    $routeParams.url = 'test-url';
    localStorage.setItem('test-urltitle', 'New Title');
    $scope.newerVersion = true;
    $scope.deleteNewerVersion();
    expect(localStorage.getItem('test-urltitle')).toBe('null');
    expect($scope.newerVersion).toBe(false);
  });

  it('should update Page title on titleChange', function() {
    $scope.page.title = 'New Page Title';
    $scope.autoURL = true;
    $scope.page.url = '/new';
    $scope.titleChange();
    expect(Page.title).toBe('New Page Title');
    expect($scope.page.url).toBe('new-page-title');
    expect(Page.url).toBe('new-page-title');
  });

  it('should update Page description on descriptionChange', function() {
    $scope.page.description = 'New Description';
    $scope.descriptionChange();
    expect(Page.description).toBe('New Description');
  });

  it('should update Page url on urlChange', function() {
    $scope.page.url = 'new-url';
    $scope.urlChange();
    expect(Page.url).toBe('new-url');
  });

  it('should save page data locally', function() {
    $routeParams.url = 'test-url';
    $scope.page.title = 'Local Title';
    $scope.page.description = 'Local Description';
    $scope.page.url = 'local-url';
    $scope.page.type = 'local-type';

    $scope.saveLocal();

    expect(Page.title).toBe('Local Title');
    expect(Page.description).toBe('Local Description');
    expect(Page.url).toBe('local-url');
    expect(Page.type).toBe('local-type');

    expect(localStorage.getItem('test-urltitle')).toBe('Local Title');
    expect(localStorage.getItem('test-urldescription')).toBe('Local Description');
    expect(localStorage.getItem('test-urlurl')).toBe('local-url');
    expect(localStorage.getItem('test-urltype')).toBe('local-type');
  });

  it('should update Page type on updatePageType', function() {
    $scope.page.type = 'new-type';
    $scope.updatePageType();
    expect(Page.type).toBe('new-type');
  });

  it('should autocomplete tags', function() {
    $scope.page.tags = ['tag1'];
    var deferred = $q.defer();
    deferred.resolve(['tag1', 'tag2', 'tag3']);
    spyOn(REST.contentTags, 'query').and.returnValue({ $promise: deferred.promise });

    $scope.autocompleteTags();
    $scope.$apply();

    expect($scope.page.suggestions).toEqual(['tag1', 'tag2', 'tag3']);
  });

  it('should select tag from suggestions', function() {
    $scope.page.tags = ['ta'];
    $scope.page.suggestions = ['tag'];
    $scope.selectSuggestion('tag');
    expect($scope.page.tags).toEqual(['tag', '']);
    expect($scope.page.suggestions).toEqual([]);
  });

  it('should deletePage and redirect to /new', function() {
    spyOn(REST.content, 'delete').and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve();
      return { $promise: deferred.promise };
    });
    spyOn(REST.contentRevisions, 'delete').and.returnValue({ $promise: $q.defer().resolve().promise });
    spyOn(REST.contentRevisionsExtras, 'delete').and.returnValue({ $promise: $q.defer().resolve().promise });
    spyOn(REST.contentExtras, 'delete').and.returnValue({ $promise: $q.defer().resolve().promise });
    spyOn(REST.contentTags, 'delete').and.returnValue({ $promise: $q.defer().resolve().promise });

    $scope.page.id = 123;
    $scope.deletePage();
    $scope.$apply();

    expect(REST.content.delete).toHaveBeenCalledWith({ contentID: 123 }, jasmine.any(Function));
    expect($location.path()).toBe('new');
  });

  it('should savePage for new content', function() {
    $location.path('/new');
    $scope.page.title = 'Test Page';
    $scope.page.description = 'Test Description';
    $scope.page.url = 'test-page';
    $scope.page.publish = 'Y';
    $scope.page.tags = ['tag1', 'tag2'];
    Page.header = '';
    Page.subheader = '';
    Page.body = '';
    Page.type = 'test-type';
    Page.extras = {};
    Users.id = 1;

    $scope.savePage();

    expect(REST.content.save).toHaveBeenCalled();
    $scope.$apply();

    expect($location.path()).toBe('/test-page');
  });

  it('should update an existing page on savePage', function() {
    $location.path('/edit-page');
    $scope.page.title = 'Updated Page';
    $scope.page.description = 'Updated Description';
    $scope.page.url = 'updated-page';
    $scope.page.publish = 'Y';
    $scope.page.tags = ['tag1', 'tag2'];
    Page.header = '';
    Page.subheader = '';
    Page.body = '';
    Page.type = 'test-type';
    Page.extras = {};
    Users.id = 1;
    $scope.page.id = 123;
    spyOn(REST.content, 'update').and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve();
      return { $promise: deferred.promise };
    });

    spyOn(REST.contentTags, 'delete').and.returnValue({ $promise: $q.defer().resolve().promise });
    spyOn(REST.contentTags, 'save').and.returnValue({ $promise: $q.defer().resolve().promise });
    spyOn(REST.contentRevisions, 'save').and.returnValue({ $promise: $q.defer().resolve().promise });
    spyOn(REST.contentExtras, 'delete').and.returnValue({ $promise: $q.defer().resolve().promise });

    $scope.savePage();

    expect(REST.content.update).toHaveBeenCalled();
  });

});
```

tests/rest.spec.js
```js
describe('REST Factory', function() {
  var REST, $resource;

  beforeEach(module('cosmo'));

  beforeEach(inject(function(_REST_, _$resource_) {
    REST = _REST_;
    $resource = _$resource_;
  }));

  it('should define all REST endpoints', function() {
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
});
```

tests/users.spec.js
```js
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

### Tokens: {'input_tokens': 5469, 'output_tokens': 7367, 'reasoning_tokens': 4416}
### Execution time: 62.529380321502686
