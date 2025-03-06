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
### Thoughts:
Alright, I need to write unit tests for a legacy AngularJS application. Let's break down the components:

1. `rest.js` - A factory service that uses `$resource` to communicate with a RESTful backend
2. `page.js` - A factory service that stores page variables globally
3. `users.js` - A factory service that stores user data
4. `pageCtrl.js` - A controller that handles page creation and editing

First, let's choose testing libraries that are appropriate for AngularJS:

1. **Jasmine**: A behavior-driven development framework for testing JavaScript code
2. **Karma**: A test runner for JavaScript that works well with Jasmine
3. **angular-mocks**: Angular's built-in mocking framework for injecting and testing Angular services

Now, let's set up the testing environment. I'll create test files for each component, focusing on comprehensive coverage.

Let's start by testing the factories, then move on to the controller which has more complex logic.

### Page Factory Test

```javascript
describe('Page Factory', function() {
  var Page;
  
  // Load the module
  beforeEach(module('cosmo'));
  
  // Inject the factory
  beforeEach(inject(function(_Page_) {
    Page = _Page_;
  }));
  
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
});
```

### Users Factory Test

```javascript
describe('Users Factory', function() {
  var Users;
  
  // Load the module
  beforeEach(module('cosmo'));
  
  // Inject the factory
  beforeEach(inject(function(_Users_) {
    Users = _Users_;
  }));
  
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
});
```

### REST Factory Test

This is more complex as it depends on `$resource` and needs mocking.

```javascript
describe('REST Factory', function() {
  var REST, $httpBackend;
  
  // Load the module
  beforeEach(module('cosmo'));
  
  // Inject dependencies
  beforeEach(inject(function(_REST_, _$httpBackend_) {
    REST = _REST_;
    $httpBackend = _$httpBackend_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  it('should have all resource endpoints defined', function() {
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
  
  // Test a few resource methods to ensure they work correctly
  it('should make GET requests to content endpoint', function() {
    $httpBackend.expectGET('api/content/123').respond(200, {id: 123, title: 'Test'});
    
    var result;
    REST.content.get({contentID: 123}, function(data) {
      result = data;
    });
    
    $httpBackend.flush();
    expect(result.id).toBe(123);
    expect(result.title).toBe('Test');
  });
  
  it('should make POST requests to content endpoint', function() {
    $httpBackend.expectPOST('api/content', {title: 'New Page'}).respond(201, {id: 999, title: 'New Page'});
    
    var result;
    REST.content.save({title: 'New Page'}, function(data) {
      result = data;
    });
    
    $httpBackend.flush();
    expect(result.id).toBe(999);
    expect(result.title).toBe('New Page');
  });
  
  it('should make PUT requests to content endpoint', function() {
    $httpBackend.expectPUT('api/content/123', {contentID: 123, title: 'Updated'}).respond(200, {id: 123, title: 'Updated'});
    
    var result;
    REST.content.update({contentID: 123, title: 'Updated'}, function(data) {
      result = data;
    });
    
    $httpBackend.flush();
    expect(result.id).toBe(123);
    expect(result.title).toBe('Updated');
  });
  
  it('should make DELETE requests to content endpoint', function() {
    $httpBackend.expectDELETE('api/content/123').respond(204);
    
    var success = false;
    REST.content.delete({contentID: 123}, function() {
      success = true;
    });
    
    $httpBackend.flush();
    expect(success).toBe(true);
  });
});
```

### PageCtrl Test

This is the most complex test as it has lots of logic and dependencies.

```javascript
describe('pageCtrl', function() {
  var $controller, $scope, $rootScope, $location, $routeParams, REST, Page, Users, $translate;
  var mockRESTService, mockUploadService;
  
  // Load the module
  beforeEach(module('cosmo'));
  
  // Set up mock services and dependencies
  beforeEach(function() {
    // Mock REST service
    mockRESTService = {
      content: jasmine.createSpyObj('content', ['save', 'update', 'delete']),
      contentRevisions: jasmine.createSpyObj('contentRevisions', ['save', 'delete']),
      contentRevisionsExtras: jasmine.createSpyObj('contentRevisionsExtras', ['save', 'delete']),
      contentExtras: jasmine.createSpyObj('contentExtras', ['save', 'delete']),
      contentTags: jasmine.createSpyObj('contentTags', ['save', 'delete', 'query'])
    };
    
    // Configure mock responses
    mockRESTService.content.save.and.callFake(function(data, success, error) {
      success({id: 999, title: data.title});
    });
    
    mockRESTService.content.update.and.callFake(function(data, success, error) {
      success({id: data.contentID, title: data.title});
    });
    
    mockRESTService.contentRevisions.save.and.callFake(function(data, success) {
      success({id: 888});
    });
    
    mockRESTService.contentTags.query.and.callFake(function(data, success, error) {
      if (data.tag === 'test') {
        success(['test', 'testing', 'tester']);
      } else {
        error();
      }
    });
    
    // Mock upload service
    mockUploadService = {};
  });
  
  // Inject dependencies
  beforeEach(inject(function(_$controller_, _$rootScope_, _$location_, _Page_, _Users_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $location = _$location_;
    Page = _Page_;
    Users = _Users_;
    
    // Set up default values for Page
    Page.id = 0;
    Page.title = 'Test Page';
    Page.description = 'Test Description';
    Page.url = 'test-page';
    Page.type = 'page';
    Page.publish = 'N';
    Page.themePages = ['page', 'post', 'article'];
    Page.header = 'Test Header';
    Page.subheader = 'Test Subheader';
    Page.body = 'Test Body';
    Page.extras = {};
    
    // Set up default values for Users
    Users.id = 1;
    Users.username = 'testuser';
    
    // Set up scope
    $scope = $rootScope.$new();
    
    // Set up translate service mock
    $translate = jasmine.createSpy('$translate').and.returnValue({
      then: function(callback) {
        callback('Translated Text');
      }
    });
    
    // Set up route params
    $routeParams = { url: 'test-page' };
  }));
  
  // Create controller before each test
  beforeEach(function() {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    
    // Create the controller with mocked dependencies
    $controller('pageCtrl', {
      $scope: $scope,
      REST: mockRESTService,
      $location: $location,
      Page: Page,
      $rootScope: $rootScope,
      $routeParams: $routeParams,
      $upload: mockUploadService,
      Users: Users,
      $translate: $translate
    });
  });
  
  // Tests start here
  
  it('should initialize the page object with values from Page factory', function() {
    expect($scope.page.title).toBe('Test Page');
    expect($scope.page.description).toBe('Test Description');
    expect($scope.page.url).toBe('test-page');
    expect($scope.page.type).toBe('page');
    expect($scope.page.publish).toBe('N');
    expect($scope.page.themePages).toEqual(['page', 'post', 'article']);
  });
  
  it('should set scheduleDate to current date for new pages', function() {
    spyOn($location, 'path').and.returnValue('/new');
    
    $controller('pageCtrl', {
      $scope: $scope,
      REST: mockRESTService,
      $location: $location,
      Page: Page,
      $rootScope: $rootScope,
      $routeParams: $routeParams,
      $upload: mockUploadService,
      Users: Users,
      $translate: $translate
    });
    
    expect($scope.page.scheduleDate instanceof Date).toBe(true);
  });
  
  it('should update Page.title and generate URL when titleChange is called', function() {
    $scope.page.title = 'New Test Title';
    $scope.autoURL = true;
    $scope.titleChange();
    
    expect(Page.title).toBe('New Test Title');
    expect($scope.page.url).toBe('new-test-title');
    expect(Page.url).toBe('new-test-title');
  });
  
  it('should update Page.description when descriptionChange is called', function() {
    $scope.page.description = 'New test description';
    $scope.descriptionChange();
    
    expect(Page.description).toBe('New test description');
  });
  
  it('should update Page.url when urlChange is called', function() {
    $scope.page.url = 'new-test-url';
    $scope.urlChange();
    
    expect(Page.url).toBe('new-test-url');
  });
  
  it('should save to localStorage when saveLocal is called', function() {
    $scope.page.title = 'Local Title';
    $scope.page.description = 'Local Description';
    $scope.page.url = 'local-url';
    $scope.page.type = 'local-type';
    
    $scope.saveLocal();
    
    expect(localStorage.setItem).toHaveBeenCalledWith('test-pagetitle', 'Local Title');
    expect(localStorage.setItem).toHaveBeenCalledWith('test-pagedescription', 'Local Description');
    expect(localStorage.setItem).toHaveBeenCalledWith('test-pageurl', 'local-url');
    expect(localStorage.setItem).toHaveBeenCalledWith('test-pagetype', 'local-type');
  });
  
  it('should fetch tag suggestions on autocompleteTags', function() {
    $scope.page.tags = ['test'];
    $scope.autocompleteTags();
    
    expect(mockRESTService.contentTags.query).toHaveBeenCalledWith({tag: 'test'}, jasmine.any(Function), jasmine.any(Function));
  });
  
  it('should not fetch suggestions when tags array is empty', function() {
    $scope.page.tags = [];
    $scope.autocompleteTags();
    
    expect($scope.page.suggestions).toEqual([]);
    expect(mockRESTService.contentTags.query).not.toHaveBeenCalled();
  });
  
  it('should add selected tag to tags array on selectSuggestion', function() {
    $scope.page.tags = ['test', ''];
    $scope.selectSuggestion('testing');
    
    expect($scope.page.tags).toEqual(['test', 'testing', '']);
    expect($scope.page.suggestions).toEqual([]);
  });
  
  it('should broadcast an error when trying to save a page with no URL', function() {
    spyOn($rootScope, '$broadcast');
    $scope.page.url = '';
    
    $scope.savePage();
    
    expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', {
      message: 'Translated Text',
      classes: 'alert-error'
    });
  });
  
  it('should broadcast an error when trying to save a page with no type selected', function() {
    spyOn($rootScope, '$broadcast');
    $scope.page.type = '';
    $scope.page.url = 'valid-url';
    
    $scope.savePage();
    
    expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', {
      message: 'Translated Text',
      classes: 'alert-error'
    });
  });
  
  it('should save a new page when location path is /new', function() {
    spyOn($rootScope, '$broadcast');
    spyOn($location, 'path').and.returnValue('/new');
    
    $scope.page.url = 'valid-url';
    $scope.page.type = 'page';
    $scope.page.title = 'Valid Title';
    $scope.page.publish = 'Y';
    $scope.page.tags = ['tag1', 'tag2'];
    
    $scope.savePage();
    
    expect(mockRESTService.content.save).toHaveBeenCalled();
    expect(mockRESTService.contentRevisions.save).toHaveBeenCalled();
  });
  
  it('should update an existing page when location path is not /new', function() {
    spyOn($rootScope, '$broadcast');
    spyOn($location, 'path').and.returnValue('/test-page');
    
    $scope.page.id = 123;
    $scope.page.url = 'valid-url';
    $scope.page.type = 'page';
    $scope.page.title = 'Valid Title';
    $scope.page.publish = 'Y';
    $scope.page.tags = ['tag1', 'tag2'];
    
    $scope.savePage();
    
    expect(mockRESTService.content.update).toHaveBeenCalled();
    expect(mockRESTService.contentTags.delete).toHaveBeenCalled();
  });
  
  it('should delete a page when deletePage is called', function() {
    spyOn($rootScope, '$broadcast');
    spyOn($location, 'path');
    
    $scope.page.id = 123;
    $scope.deletePage();
    
    expect(mockRESTService.content.delete).toHaveBeenCalledWith({contentID: 123}, jasmine.any(Function));
    expect(mockRESTService.contentRevisions.delete).toHaveBeenCalledWith({contentID: 123});
    expect(mockRESTService.contentRevisionsExtras.delete).toHaveBeenCalledWith({contentID: 123});
    expect(mockRESTService.contentExtras.delete).toHaveBeenCalledWith({contentID: 123});
    expect(mockRESTService.contentTags.delete).toHaveBeenCalledWith({contentID: 123});
    expect($location.path).toHaveBeenCalledWith('new');
  });
  
  it('should check for and handle newer versions from localStorage', function() {
    localStorage.getItem.and.callFake(function(key) {
      if (key === 'test-pagetitle') return 'Newer Title';
      if (key === 'test-pagedescription') return 'Newer Description';
      return null;
    });
    
    $controller('pageCtrl', {
      $scope: $scope,
      REST: mockRESTService,
      $location: $location,
      Page: Page,
      $rootScope: $rootScope,
      $routeParams: $routeParams,
      $upload: mockUploadService,
      Users: Users,
      $translate: $translate
    });
    
    expect($scope.newerVersion).toBe(true);
  });
  
  it('should restore values from localStorage when localVersion is called', function() {
    localStorage.getItem.and.callFake(function(key) {
      if (key === 'test-pagetitle') return 'Stored Title';
      if (key === 'test-pagedescription') return 'Stored Description';
      return null;
    });
    
    spyOn($rootScope, '$broadcast');
    $scope.newerVersion = true;
    $scope.localVersion();
    
    expect(Page.title).toBe('Stored Title');
    expect(Page.description).toBe('Stored Description');
    expect($scope.newerVersion).toBe(false);
    expect($rootScope.$broadcast).toHaveBeenCalledWith('contentGet');
  });
  
  it('should clear localStorage when deleteNewerVersion is called', function() {
    $scope.newerVersion = true;
    $scope.deleteNewerVersion();
    
    expect(localStorage.setItem).toHaveBeenCalledWith('test-pagetitle', null);
    expect(localStorage.setItem).toHaveBeenCalledWith('test-pagedescription', null);
    expect($scope.newerVersion).toBe(false);
  });
});
```

These tests cover the main functionality of the provided code. I've focused on testing the core functionality:

1. For the factories, I'm testing that they have the expected default values
2. For the REST service, I'm testing that it correctly interacts with the backend
3. For the pageCtrl, I'm testing the major functionality like initialization, saving pages, and handling user interactions

Let me collect these into final test files:

1. page.spec.js - Tests for the Page factory
2. users.spec.js - Tests for the Users factory
3. rest.spec.js - Tests for the REST factory
4. pageCtrl.spec.js - Tests for the pageCtrl controller

This should provide at least 80% code coverage for the provided components.

### Answer:
# Test Files for the Angular Application

## page.spec.js
```javascript
describe('Page Factory', function() {
  var Page;
  
  beforeEach(module('cosmo'));
  
  beforeEach(inject(function(_Page_) {
    Page = _Page_;
  }));
  
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
});
```

## users.spec.js
```javascript
describe('Users Factory', function() {
  var Users;
  
  beforeEach(module('cosmo'));
  
  beforeEach(inject(function(_Users_) {
    Users = _Users_;
  }));
  
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
});
```

## rest.spec.js
```javascript
describe('REST Factory', function() {
  var REST, $httpBackend;
  
  beforeEach(module('cosmo'));
  
  beforeEach(inject(function(_REST_, _$httpBackend_) {
    REST = _REST_;
    $httpBackend = _$httpBackend_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  it('should have all resource endpoints defined', function() {
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
  
  it('should make GET requests to content endpoint', function() {
    $httpBackend.expectGET('api/content/123').respond(200, {id: 123, title: 'Test'});
    
    var result;
    REST.content.get({contentID: 123}, function(data) {
      result = data;
    });
    
    $httpBackend.flush();
    expect(result.id).toBe(123);
    expect(result.title).toBe('Test');
  });
  
  it('should make POST requests to content endpoint', function() {
    $httpBackend.expectPOST('api/content', {title: 'New Page'}).respond(201, {id: 999, title: 'New Page'});
    
    var result;
    REST.content.save({title: 'New Page'}, function(data) {
      result = data;
    });
    
    $httpBackend.flush();
    expect(result.id).toBe(999);
    expect(result.title).toBe('New Page');
  });
  
  it('should make PUT requests to content endpoint', function() {
    $httpBackend.expectPUT('api/content/123', {contentID: 123, title: 'Updated'}).respond(200, {id: 123, title: 'Updated'});
    
    var result;
    REST.content.update({contentID: 123, title: 'Updated'}, function(data) {
      result = data;
    });
    
    $httpBackend.flush();
    expect(result.id).toBe(123);
    expect(result.title).toBe('Updated');
  });
  
  it('should make DELETE requests to content endpoint', function() {
    $httpBackend.expectDELETE('api/content/123').respond(204);
    
    var success = false;
    REST.content.delete({contentID: 123}, function() {
      success = true;
    });
    
    $httpBackend.flush();
    expect(success).toBe(true);
  });
  
  it('should handle errors in GET requests', function() {
    $httpBackend.expectGET('api/content/404').respond(404, 'Not Found');
    
    var success = false;
    var error = false;
    
    REST.content.get({contentID: 404}, 
      function() { success = true; }, 
      function() { error = true; }
    );
    
    $httpBackend.flush();
    expect(success).toBe(false);
    expect(error).toBe(true);
  });
});
```

## pageCtrl.spec.js
```javascript
describe('pageCtrl', function() {
  var $controller, $scope, $rootScope, $location, $routeParams, REST, Page, Users, $translate;
  var mockRESTService, mockUploadService;
  
  beforeEach(module('cosmo'));
  
  beforeEach(function() {
    mockRESTService = {
      content: jasmine.createSpyObj('content', ['save', 'update', 'delete']),
      contentRevisions: jasmine.createSpyObj('contentRevisions', ['save', 'delete']),
      contentRevisionsExtras: jasmine.createSpyObj('contentRevisionsExtras', ['save', 'delete']),
      contentExtras: jasmine.createSpyObj('contentExtras', ['save', 'delete']),
      contentTags: jasmine.createSpyObj('contentTags', ['save', 'delete', 'query'])
    };
    
    mockRESTService.content.save.and.callFake(function(data, success) {
      success({id: 999, title: data.title});
    });
    
    mockRESTService.content.update.and.callFake(function(data, success) {
      success({id: data.contentID, title: data.title});
    });
    
    mockRESTService.contentRevisions.save.and.callFake(function(data, success) {
      success({id: 888});
    });
    
    mockRESTService.contentTags.query.and.callFake(function(data, success, error) {
      if (data.tag === 'test') {
        success(['test', 'testing', 'tester']);
      } else {
        error();
      }
    });
    
    mockUploadService = {};
  });
  
  beforeEach(inject(function(_$controller_, _$rootScope_, _$location_, _Page_, _Users_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $location = _$location_;
    Page = _Page_;
    Users = _Users_;
    
    Page.id = 0;
    Page.title = 'Test Page';
    Page.description = 'Test Description';
    Page.url = 'test-page';
    Page.type = 'page';
    Page.publish = 'N';
    Page.themePages = ['page', 'post', 'article'];
    Page.header = 'Test Header';
    Page.subheader = 'Test Subheader';
    Page.body = 'Test Body';
    Page.extras = {};
    
    Users.id = 1;
    Users.username = 'testuser';
    
    $scope = $rootScope.$new();
    
    $translate = jasmine.createSpy('$translate').and.returnValue({
      then: function(callback) {
        callback('Translated Text');
      }
    });
    
    $routeParams = { url: 'test-page' };
  }));
  
  beforeEach(function() {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    spyOn(Date, 'parse').and.returnValue({
      getTime: function() { return 1500000000000; }
    });
    
    $controller('pageCtrl', {
      $scope: $scope,
      REST: mockRESTService,
      $location: $location,
      Page: Page,
      $rootScope: $rootScope,
      $routeParams: $routeParams,
      $upload: mockUploadService,
      Users: Users,
      $translate: $translate
    });
  });
  
  it('should initialize the page object with values from Page factory', function() {
    expect($scope.page.title).toBe('Test Page');
    expect($scope.page.description).toBe('Test Description');
    expect($scope.page.url).toBe('test-page');
    expect($scope.page.type).toBe('page');
    expect($scope.page.publish).toBe('N');
    expect($scope.page.themePages).toEqual(['page', 'post', 'article']);
  });
  
  it('should set scheduleDate to current date for new pages', function() {
    spyOn($location, 'path').and.returnValue('/new');
    
    $controller('pageCtrl', {
      $scope: $scope,
      REST: mockRESTService,
      $location: $location,
      Page: Page,
      $rootScope: $rootScope,
      $routeParams: $routeParams,
      $upload: mockUploadService,
      Users: Users,
      $translate: $translate
    });
    
    expect($scope.page.scheduleDate instanceof Date).toBe(true);
  });
  
  it('should update Page.title and generate URL when titleChange is called', function() {
    $scope.page.title = 'New Test Title';
    $scope.autoURL = true;
    $scope.titleChange();
    
    expect(Page.title).toBe('New Test Title');
    expect($scope.page.url).toBe('new-test-title');
    expect(Page.url).toBe('new-test-title');
  });
  
  it('should update Page.description when descriptionChange is called', function() {
    $scope.page.description = 'New test description';
    $scope.descriptionChange();
    
    expect(Page.description).toBe('New test description');
  });
  
  it('should update Page.url when urlChange is called', function() {
    $scope.page.url = 'new-test-url';
    $scope.urlChange();
    
    expect(Page.url).toBe('new-test-url');
  });
  
  it('should save to localStorage when saveLocal is called', function() {
    $scope.page.title = 'Local Title';
    $scope.page.description = 'Local Description';
    $scope.page.url = 'local-url';
    $scope.page.type = 'local-type';
    
    $scope.saveLocal();
    
    expect(localStorage.setItem).toHaveBeenCalledWith('test-pagetitle', 'Local Title');
    expect(localStorage.setItem).toHaveBeenCalledWith('test-pagedescription', 'Local Description');
    expect(localStorage.setItem).toHaveBeenCalledWith('test-pageurl', 'local-url');
    expect(localStorage.setItem).toHaveBeenCalledWith('test-pagetype', 'local-type');
  });
  
  it('should fetch tag suggestions on autocompleteTags', function() {
    $scope.page.tags = ['test'];
    $scope.autocompleteTags();
    
    expect(mockRESTService.contentTags.query).toHaveBeenCalledWith({tag: 'test'}, jasmine.any(Function), jasmine.any(Function));
  });
  
  it('should not fetch suggestions when tags array is empty', function() {
    $scope.page.tags = [];
    $scope.autocompleteTags();
    
    expect($scope.page.suggestions).toEqual([]);
    expect(mockRESTService.contentTags.query).not.toHaveBeenCalled();
  });
  
  it('should add selected tag to tags array on selectSuggestion', function() {
    $scope.page.tags = ['test', ''];
    $scope.selectSuggestion('testing');
    
    expect($scope.page.tags).toEqual(['test', 'testing', '']);
    expect($scope.page.suggestions).toEqual([]);
  });
  
  it('should broadcast an error when trying to save a page with no URL', function() {
    spyOn($rootScope, '$broadcast');
    $scope.page.url = '';
    
    $scope.savePage();
    
    expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', {
      message: 'Translated Text',
      classes: 'alert-error'
    });
  });
  
  it('should broadcast an error when trying to save a page with no type selected', function() {
    spyOn($rootScope, '$broadcast');
    $scope.page.type = '';
    $scope.page.url = 'valid-url';
    
    $scope.savePage();
    
    expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', {
      message: 'Translated Text',
      classes: 'alert-error'
    });
  });
  
  it('should save a new page when location path is /new', function() {
    spyOn($rootScope, '$broadcast');
    spyOn($location, 'path').and.returnValue('/new');
    
    $scope.page.url = 'valid-url';
    $scope.page.type = 'page';
    $scope.page.title = 'Valid Title';
    $scope.page.publish = 'Y';
    $scope.page.tags = ['tag1', 'tag2'];
    
    $scope.savePage();
    
    expect(mockRESTService.content.save).toHaveBeenCalled();
    expect(mockRESTService.contentRevisions.save).toHaveBeenCalled();
  });
  
  it('should update an existing page when location path is not /new', function() {
    spyOn($rootScope, '$broadcast');
    spyOn($location, 'path').and.returnValue('/test-page');
    
    $scope.page.id = 123;
    $scope.page.url = 'valid-url';
    $scope.page.type = 'page';
    $scope.page.title = 'Valid Title';
    $scope.page.publish = 'Y';
    $scope.page.tags = ['tag1', 'tag2'];
    
    $scope.savePage();
    
    expect(mockRESTService.content.update).toHaveBeenCalled();
    expect(mockRESTService.contentTags.delete).toHaveBeenCalled();
  });
  
  it('should handle scheduled publishing', function() {
    spyOn($rootScope, '$broadcast');
    spyOn($location, 'path').and.returnValue('/test-page');
    
    $scope.page.id = 123;
    $scope.page.url = 'valid-url';
    $scope.page.type = 'page';
    $scope.page.title = 'Valid Title';
    $scope.page.publish = 'schedule';
    $scope.page.scheduleDate = new Date();
    
    $scope.savePage();
    
    expect(mockRESTService.content.update).toHaveBeenCalled();
    expect(Date.parse).toHaveBeenCalled();
  });
  
  it('should delete a page when deletePage is called', function() {
    spyOn($rootScope, '$broadcast');
    spyOn($location, 'path');
    
    $scope.page.id = 123;
    $scope.deletePage();
    
    expect(mockRESTService.content.delete).toHaveBeenCalledWith({contentID: 123}, jasmine.any(Function));
    expect(mockRESTService.contentRevisions.delete).toHaveBeenCalledWith({contentID: 123});
    expect(mockRESTService.contentRevisionsExtras.delete).toHaveBeenCalledWith({contentID: 123});
    expect(mockRESTService.contentExtras.delete).toHaveBeenCalledWith({contentID: 123});
    expect(mockRESTService.contentTags.delete).toHaveBeenCalledWith({contentID: 123});
    expect($location.path).toHaveBeenCalledWith('new');
  });
  
  it('should check for and handle newer versions from localStorage', function() {
    localStorage.getItem.and.callFake(function(key) {
      if (key === 'test-pagetitle') return 'Newer Title';
      if (key === 'test-pagedescription') return 'Newer Description';
      return null;
    });
    
    $controller('pageCtrl', {
      $scope: $scope,
      REST: mockRESTService,
      $location: $location,
      Page: Page,
      $rootScope: $rootScope,
      $routeParams: $routeParams,
      $upload: mockUploadService,
      Users: Users,
      $translate: $translate
    });
    
    expect($scope.newerVersion).toBe(true);
  });
  
  it('should restore values from localStorage when localVersion is called', function() {
    localStorage.getItem.and.callFake(function(key) {
      if (key === 'test-pagetitle') return 'Stored Title';
      if (key === 'test-pagedescription') return 'Stored Description';
      return null;
    });
    
    spyOn($rootScope, '$broadcast');
    $scope.newerVersion = true;
    $scope.localVersion();
    
    expect(Page.title).toBe('Stored Title');
    expect(Page.description).toBe('Stored Description');
    expect($scope.newerVersion).toBe(false);
    expect($rootScope.$broadcast).toHaveBeenCalledWith('contentGet');
  });
  
  it('should clear localStorage when deleteNewerVersion is called', function() {
    $scope.newerVersion = true;
    $scope.deleteNewerVersion();
    
    expect(localStorage.setItem).toHaveBeenCalledWith('test-pagetitle', null);
    expect(localStorage.setItem).toHaveBeenCalledWith('test-pagedescription', null);
    expect($scope.newerVersion).toBe(false);
  });
  
  it('should react to contentGet event', function() {
    Page.title = 'Updated Title';
    Page.description = 'Updated Description';
    Page.url = 'updated-url';
    Page.type = 'updated-type';
    
    $rootScope.$broadcast('contentGet');
    
    expect($scope.page.title).toBe('Updated Title');
    expect($scope.page.description).toBe('Updated Description');
    expect($scope.page.url).toBe('updated-url');
    expect($scope.page.type).toBe('updated-type');
  });
});
```

## karma.conf.js
```javascript
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-resource/angular-resource.js',
      'app/**/*.js',
      'test/**/*.spec.js'
    ],
    exclude: [],
    preprocessors: {
      'app/**/*.js': ['coverage']
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
```

## package.json additions
```json
{
  "devDependencies": {
    "angular": "1.8.3",
    "angular-mocks": "1.8.3",
    "angular-resource": "1.8.3",
    "jasmine-core": "^4.3.0",
    "karma": "^6.4.1",
    "karma-chrome-launcher": "^3.1.1",
    "karma-coverage": "^2.2.0",
    "karma-jasmine": "^5.1.0"
  },
  "scripts": {
    "test": "karma start"
  }
}
```

### Tokens: {'input_tokens': 6768, 'output_tokens': 10732}
### Execution time: 122.91002106666565
