I have the following application code that needs comprehensive unit testing:

<source_code>
```js
// rest.js
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

```html
// page.html
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

```js
// page.js
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

```js
// users.js
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

```js
// pageCtrl.js
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

</source_code>

Please follow these steps:

1. Create comprehensive unit tests for the AngularJS application:
   - Focus on testing controllers, factories, and services
   - Test all public methods and functions
   - Verify component interactions and data flow
   - Include both positive and negative test cases
   - Test edge cases and error handling

2. Select and implement appropriate testing tools:
   - Choose a testing framework (such as Jasmine, Jest, or Karma)
   - Set up the necessary testing environment configuration
   - Configure mocks and spies for dependency isolation
   - Implement test runners for automated execution

3. Implement proper test structure:
   - Organize tests hierarchically (describe/it pattern)
   - Use beforeEach/afterEach for proper test isolation
   - Group related tests into logical test suites
   - Provide clear, descriptive test names

4. Handle external dependencies:
   - Mock all HTTP requests and API calls
   - Create appropriate stubs for external services
   - Simulate user interactions where needed
   - Mock browser functionality as required

5. Ensure comprehensive test coverage:
   - Achieve minimum 80% code coverage
   - Focus on critical business logic paths
   - Test all conditional branches
   - Verify error handling and edge cases

6. Deliver production-ready test suite:
   - Include necessary configuration files
   - Ensure all tests can run independently
   - No TODO comments or placeholders in final code
   - Optimize test execution performance

7. Validate test effectiveness:
   - Verify tests catch actual defects
   - Ensure tests fail when implementation breaks
   - Check for false positives/negatives
## Run 1:
### Answer:
# Comprehensive Unit Tests for AngularJS Application

I'll create a complete test suite for the provided AngularJS application using Jasmine as the testing framework and Karma as the test runner. This approach is well-suited for AngularJS applications.

## 1. Test Configuration Files

### karma.conf.js
```javascript
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      // Angular and dependencies
      'node_modules/angular/angular.js',
      'node_modules/angular-resource/angular-resource.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-route/angular-route.js',
      'node_modules/angular-translate/dist/angular-translate.js',
      
      // Application files
      'app/app.js',
      'app/factories/*.js',
      'app/controllers/*.js',
      
      // Test files
      'tests/**/*.spec.js'
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
    singleRun: false,
    concurrency: Infinity
  });
};
```

### package.json (test-related parts)
```json
{
  "scripts": {
    "test": "karma start karma.conf.js --single-run",
    "test:watch": "karma start karma.conf.js"
  },
  "devDependencies": {
    "angular": "^1.8.2",
    "angular-mocks": "^1.8.2",
    "angular-resource": "^1.8.2",
    "angular-route": "^1.8.2",
    "angular-translate": "^2.18.4",
    "jasmine-core": "^3.99.0",
    "karma": "^6.3.20",
    "karma-chrome-launcher": "^3.1.1",
    "karma-coverage": "^2.2.0",
    "karma-jasmine": "^4.0.2"
  }
}
```

## 2. Factory Tests

### tests/factories/rest.factory.spec.js
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
  
  it('should have all required API endpoints defined', function() {
    var expectedEndpoints = [
      'blocks', 'blocksRequirements', 'comments', 'content', 'contentExtras',
      'contentRevisions', 'contentRevisionsExtras', 'contentTags', 'files',
      'filesTags', 'menus', 'modules', 'sitemaps', 'themes', 'settings', 'users'
    ];
    
    expectedEndpoints.forEach(function(endpoint) {
      expect(REST[endpoint]).toBeDefined();
    });
  });
  
  it('should make a GET request to the correct endpoint for content', function() {
    $httpBackend.expectGET('api/content/123').respond(200, {id: 123, title: 'Test'});
    
    var result;
    REST.content.get({contentID: 123}).$promise.then(function(data) {
      result = data;
    });
    
    $httpBackend.flush();
    expect(result.id).toBe(123);
    expect(result.title).toBe('Test');
  });
  
  it('should make a POST request to create content', function() {
    var newContent = {title: 'New Page', body: 'Content'};
    $httpBackend.expectPOST('api/content', newContent).respond(201, {id: 999, title: 'New Page'});
    
    var result;
    REST.content.save(newContent).$promise.then(function(data) {
      result = data;
    });
    
    $httpBackend.flush();
    expect(result.id).toBe(999);
  });
  
  it('should make a PUT request to update content', function() {
    var updatedContent = {contentID: 123, title: 'Updated Title'};
    $httpBackend.expectPUT('api/content/123', updatedContent).respond(200, {id: 123, title: 'Updated Title'});
    
    var result;
    REST.content.update(updatedContent).$promise.then(function(data) {
      result = data;
    });
    
    $httpBackend.flush();
    expect(result.title).toBe('Updated Title');
  });
  
  it('should make a DELETE request to remove content', function() {
    $httpBackend.expectDELETE('api/content/123').respond(204);
    
    var success = false;
    REST.content.delete({contentID: 123}).$promise.then(function() {
      success = true;
    });
    
    $httpBackend.flush();
    expect(success).toBe(true);
  });
});
```

### tests/factories/page.factory.spec.js
```javascript
describe('Page Factory', function() {
  var Page;
  
  beforeEach(module('cosmo'));
  
  beforeEach(inject(function(_Page_) {
    Page = _Page_;
  }));
  
  it('should have default properties initialized', function() {
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
  
  it('should allow properties to be updated', function() {
    Page.id = 123;
    Page.title = 'Test Page';
    Page.url = 'test-page';
    
    expect(Page.id).toBe(123);
    expect(Page.title).toBe('Test Page');
    expect(Page.url).toBe('test-page');
  });
  
  it('should maintain state between injections', inject(function(Page) {
    // This test verifies the singleton nature of the factory
    expect(Page.id).toBe(123); // From previous test
    expect(Page.title).toBe('Test Page');
  }));
});
```

### tests/factories/users.factory.spec.js
```javascript
describe('Users Factory', function() {
  var Users;
  
  beforeEach(module('cosmo'));
  
  beforeEach(inject(function(_Users_) {
    Users = _Users_;
  }));
  
  it('should have default properties initialized', function() {
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
  
  it('should allow properties to be updated', function() {
    Users.id = '123';
    Users.username = 'testuser';
    Users.name = 'Test User';
    Users.role = 'admin';
    
    expect(Users.id).toBe('123');
    expect(Users.username).toBe('testuser');
    expect(Users.name).toBe('Test User');
    expect(Users.role).toBe('admin');
  });
  
  it('should maintain state between injections', inject(function(Users) {
    // This test verifies the singleton nature of the factory
    expect(Users.id).toBe('123'); // From previous test
    expect(Users.username).toBe('testuser');
  }));
});
```

## 3. Controller Tests

### tests/controllers/pageCtrl.spec.js
```javascript
describe('Page Controller', function() {
  var $controller, $rootScope, $scope, $location, $routeParams, $translate;
  var REST, Page, Users, $upload;
  var mockPromise;
  
  beforeEach(module('cosmo'));
  
  beforeEach(inject(function(_$controller_, _$rootScope_, _$location_, _$q_, _REST_, _Page_, _Users_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $location = _$location_;
    REST = _REST_;
    Page = _Page_;
    Users = _Users_;
    
    // Reset Page factory to default state
    Page.id = 0;
    Page.title = '';
    Page.description = '';
    Page.url = '';
    Page.type = '';
    Page.publish = '';
    Page.scheduleDate = '';
    Page.tags = [];
    Page.themePages = ['page.html', 'post.html'];
    Page.extras = {};
    Page.header = '';
    Page.subheader = '';
    Page.body = '';
    
    // Reset Users factory
    Users.id = '123';
    Users.username = 'testuser';
    
    // Mock $routeParams
    $routeParams = {url: 'test-page'};
    
    // Mock $upload service
    $upload = jasmine.createSpyObj('$upload', ['upload']);
    
    // Mock $translate service
    $translate = jasmine.createSpy('$translate').and.callFake(function(key) {
      var deferred = _$q_.defer();
      var translations = {
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
      deferred.resolve(translations[key] || key);
      return deferred.promise;
    });
    
    // Create a new scope
    $scope = $rootScope.$new();
    
    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    
    // Create controller
    $controller('pageCtrl', {
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
  }));
  
  describe('Initialization', function() {
    it('should initialize page properties from Page factory', function() {
      expect($scope.page.id).toBe(0);
      expect($scope.page.title).toBe('');
      expect($scope.page.description).toBe('');
      expect($scope.page.url).toBe('');
      expect($scope.page.themePages).toEqual(['page.html', 'post.html']);
    });
    
    it('should set default page type if not provided', function() {
      expect($scope.page.type).toBe('page.html');
    });
    
    it('should initialize scheduleDate to current date for new pages', function() {
      spyOn($location, 'path').and.returnValue('/new');
      $controller('pageCtrl', {
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
      
      expect($scope.page.scheduleDate instanceof Date).toBe(true);
    });
    
    it('should check for unsaved versions from localStorage', function() {
      localStorage.getItem.and.callFake(function(key) {
        if (key === 'test-pagetitle') return 'Saved Title';
        return null;
      });
      
      $controller('pageCtrl', {
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
      
      expect($scope.newerVersion).toBe(true);
    });
  });
  
  describe('Title Change', function() {
    it('should update Page.title when title changes', function() {
      $scope.page.title = 'New Title';
      $scope.titleChange();
      
      expect(Page.title).toBe('New Title');
    });
    
    it('should auto-generate URL from title for new pages', function() {
      $scope.page.url = 'new';
      $scope.page.title = 'This is a Test Page!';
      $scope.titleChange();
      
      expect($scope.page.url).toBe('this-is-a-test-page');
      expect(Page.url).toBe('this-is-a-test-page');
    });
    
    it('should not auto-generate URL if autoURL is false', function() {
      $scope.page.url = 'custom-url';
      $scope.autoURL = false;
      $scope.page.title = 'New Title';
      $scope.titleChange();
      
      expect($scope.page.url).toBe('custom-url');
    });
  });
  
  describe('Description Change', function() {
    it('should update Page.description when description changes', function() {
      $scope.page.description = 'New description text';
      $scope.descriptionChange();
      
      expect(Page.description).toBe('New description text');
    });
  });
  
  describe('URL Change', function() {
    it('should update Page.url when URL changes', function() {
      $scope.page.url = 'new-url';
      $scope.urlChange();
      
      expect(Page.url).toBe('new-url');
      expect($scope.autoURL).toBe(false);
    });
  });
  
  describe('Local Version Management', function() {
    it('should restore local version from localStorage', function() {
      localStorage.getItem.and.callFake(function(key) {
        if (key === 'test-pagetitle') return 'Saved Title';
        if (key === 'test-pagedescription') return 'Saved Description';
        return null;
      });
      
      $scope.localVersion();
      
      expect(Page.title).toBe('Saved Title');
      expect(Page.description).toBe('Saved Description');
      expect($scope.newerVersion).toBe(false);
      expect(localStorage.setItem).toHaveBeenCalledWith('test-pagetitle', null);
    });
    
    it('should delete newer version from localStorage', function() {
      $scope.deleteNewerVersion();
      
      expect(localStorage.setItem).toHaveBeenCalledWith('test-pagetitle', null);
      expect(localStorage.setItem).toHaveBeenCalledWith('test-pagedescription', null);
      expect($scope.newerVersion).toBe(false);
    });
    
    it('should save local changes to localStorage', function() {
      $scope.page.title = 'New Title';
      $scope.page.description = 'New Description';
      $scope.page.url = 'new-url';
      
      $scope.saveLocal();
      
      expect(localStorage.setItem).toHaveBeenCalledWith('test-pagetitle', 'New Title');
      expect(localStorage.setItem).toHaveBeenCalledWith('test-pagedescription', 'New Description');
      expect(localStorage.setItem).toHaveBeenCalledWith('test-pageurl', 'new-url');
    });
  });
  
  describe('Tag Management', function() {
    it('should autocomplete tags', function() {
      spyOn(REST.contentTags, 'query').and.callFake(function(params, success) {
        success(['tag1', 'tag2']);
      });
      
      $scope.page.tags = ['test', 'new'];
      $scope.autocompleteTags();
      
      expect(REST.contentTags.query).toHaveBeenCalledWith({tag: 'new'}, jasmine.any(Function), jasmine.any(Function));
      expect($scope.page.suggestions).toEqual(['tag1', 'tag2']);
    });
    
    it('should handle empty tag suggestions', function() {
      $scope.page.tags = [];
      $scope.autocompleteTags();
      
      expect($scope.page.suggestions).toEqual([]);
    });
    
    it('should select a tag from suggestions', function() {
      $scope.page.tags = ['test', 'par'];
      $scope.page.suggestions = ['party', 'partial', 'partner'];
      
      $scope.selectSuggestion('party');
      
      expect($scope.page.tags).toEqual(['test', 'party', '']);
      expect($scope.page.suggestions).toEqual([]);
    });
  });
  
  describe('Page Type Management', function() {
    it('should update page type and broadcast settings update', function() {
      spyOn($rootScope, '$broadcast');
      
      $scope.page.type = 'post.html';
      $scope.updatePageType();
      
      expect(Page.type).toBe('post.html');
      expect($rootScope.$broadcast).toHaveBeenCalledWith('settingsGet');
    });
  });
  
  describe('Delete Page', function() {
    it('should delete page and related data', function() {
      spyOn(REST.content, 'delete').and.callFake(function(params, success) {
        success({});
      });
      spyOn(REST.contentRevisions, 'delete');
      spyOn(REST.contentRevisionsExtras, 'delete');
      spyOn(REST.contentExtras, 'delete');
      spyOn(REST.contentTags, 'delete');
      spyOn($location, 'path');
      spyOn($rootScope, '$broadcast');
      
      $scope.page.id = 123;
      $scope.deletePage();
      
      expect(REST.content.delete).toHaveBeenCalledWith({contentID: 123}, jasmine.any(Function));
      expect(REST.contentRevisions.delete).toHaveBeenCalledWith({contentID: 123});
      expect(REST.contentRevisionsExtras.delete).toHaveBeenCalledWith({contentID: 123});
      expect(REST.contentExtras.delete).toHaveBeenCalledWith({contentID: 123});
      expect(REST.contentTags.delete).toHaveBeenCalledWith({contentID: 123});
      expect($location.path).toHaveBeenCalledWith('new');
      expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', {message: 'Page deleted'});
    });
  });
  
  describe('Save Page', function() {
    beforeEach(function() {
      spyOn(REST.content, 'save').and.callFake(function(params, success) {
        success({id: 999});
      });
      spyOn(REST.content, 'update').and.callFake(function(params, success) {
        success({id: 123});
      });
      spyOn(REST.contentTags, 'save');
      spyOn(REST.contentTags, 'delete').and.callFake(function(params, success) {
        success({});
      });
      spyOn(REST.contentRevisions, 'save').and.callFake(function(params, success) {
        success({id: 888});
      });
      spyOn(REST.contentExtras, 'save');
      spyOn(REST.contentExtras, 'delete').and.callFake(function(params, success) {
        success({});
      });
      spyOn(REST.contentRevisionsExtras, 'save');
      spyOn($rootScope, '$broadcast');
      spyOn($location, 'path');
    });
    
    it('should validate required fields before saving', function() {
      $scope.page.url = '';
      $scope.savePage();
      
      expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', {
        message: 'Please enter a URL', 
        classes: 'alert-error'
      });
      expect(REST.content.save).not.toHaveBeenCalled();
    });
    
    it('should validate page type before saving', function() {
      $scope.page.url = 'test-page';
      $scope.page.type = '';
      $scope.savePage();
      
      expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', {
        message: 'Please select a page type', 
        classes: 'alert-error'
      });
      expect(REST.content.save).not.toHaveBeenCalled();
    });
    
    it('should prevent duplicate URLs when duplicating', function() {
      $location.path.and.returnValue('test-page');
      $scope.page.url = 'test-page';
      $scope.savePage(true);
      
      expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', {
        message: 'Please use a different URL', 
        classes: 'alert-error'
      });
      expect(REST.content.save).not.toHaveBeenCalled();
    });
    
    it('should create a new page successfully', function() {
      $location.path.and.returnValue('/new');
      $scope.page.url = 'new-page';
      $scope.page.title = 'New Page';
      $scope.page.description = 'Description';
      $scope.page.type = 'page.html';
      $scope.page.publish = 'Y';
      $scope.page.tags = ['tag1', 'tag2'];
      
      Page.header = 'Header';
      Page.body = 'Body content';
      
      $scope.savePage();
      
      expect(REST.content.save).toHaveBeenCalledWith(jasmine.objectContaining({
        title: 'New Page',
        description: 'Description',
        header: 'Header',
        body: 'Body content',
        url: 'new-page',
        type: 'page.html',
        published: 'Y',
        author: '123'
      }), jasmine.any(Function), jasmine.any(Function));
      
      expect(REST.contentTags.save).toHaveBeenCalledWith({contentID: 999, tag: 'tag1'});
      expect(REST.contentTags.save).toHaveBeenCalledWith({contentID: 999, tag: 'tag2'});
      expect(REST.contentRevisions.save).toHaveBeenCalled();
      expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', {message: 'Page created'});
      expect($location.path).toHaveBeenCalledWith('new-page');
    });
    
    it('should update an existing page successfully', function() {
      $location.path.and.returnValue('/test-page');
      $scope.page.id = 123;
      $scope.page.url = 'test-page';
      $scope.page.title = 'Updated Page';
      $scope.page.description = 'Updated Description';
      $scope.page.type = 'page.html';
      $scope.page.publish = 'Y';
      $scope.page.tags = ['tag1', 'tag2'];
      
      Page.header = 'Updated Header';
      Page.body = 'Updated Body content';
      
      $scope.savePage();
      
      expect(REST.content.update).toHaveBeenCalledWith(jasmine.objectContaining({
        contentID: 123,
        title: 'Updated Page',
        description: 'Updated Description',
        header: 'Updated Header',
        body: 'Updated Body content',
        url: 'test-page',
        type: 'page.html',
        published: 'Y',
        author: '123'
      }), jasmine.any(Function), jasmine.any(Function));
      
      expect(REST.contentTags.delete).toHaveBeenCalledWith({contentID: 123}, jasmine.any(Function));
      expect(REST.contentTags.save).toHaveBeenCalledWith({contentID: 123, tag: 'tag1'});
      expect(REST.contentTags.save).toHaveBeenCalledWith({contentID: 123, tag: 'tag2'});
      expect(REST.contentRevisions.save).toHaveBeenCalled();
      expect(REST.contentExtras.delete).toHaveBeenCalledWith({contentID: 123}, jasmine.any(Function));
    });
    
    it('should save extras with page', function() {
      $location.path.and.returnValue('/new');
      $scope.page.url = 'new-page';
      $scope.page.title = 'New Page';
      $scope.page.type = 'page.html';
      
      Page.extras = {
        featured: {src: 'image.jpg'},
        meta: 'Some meta data'
      };
      
      $scope.savePage();
      
      // After the page is saved, extras should be saved
      expect(REST.contentExtras.save).toHaveBeenCalledWith({
        contentID: 999,
        name: 'featured',
        extra: '{"src":"image.jpg"}'
      }, jasmine.any(Function), jasmine.any(Function));
      
      expect(REST.contentExtras.save).toHaveBeenCalledWith({
        contentID: 999,
        name: 'meta',
        extra: 'Some meta data'
      }, jasmine.any(Function), jasmine.any(Function));
      
      expect(REST.contentRevisionsExtras.save).toHaveBeenCalledWith({
        revisionID: 888,
        contentID: 999,
        name: 'featured',
        extra: '{"src":"image.jpg"}'
      });
    });
    
    it('should handle scheduled publishing', function() {
      $location.path.and.returnValue('/new');
      $scope.page.url = 'new-page';
      $scope.page.title = 'New Page';
      $scope.page.type = 'page.html';
      $scope.page.publish = 'schedule';
      
      // Set a future date
      var futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      $scope.page.scheduleDate = futureDate;
      
      $scope.savePage();
      
      expect(REST.content.save.calls.mostRecent().args[0].published).toBe('N');
      
      // Now test with a past date (should publish immediately)
      var pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      $scope.page.scheduleDate = pastDate;
      
      $scope.savePage();
      
      expect(REST.content.save.calls.mostRecent().args[0].published).toBe('Y');
    });
  });
  
  describe('Event Handling', function() {
    it('should update page when contentGet event is broadcast', function() {
      Page.title = 'Updated Title';
      Page.description = 'Updated Description';
      
      $rootScope.$broadcast('contentGet');
      
      expect($scope.page.title).toBe('Updated Title');
      expect($scope.page.description).toBe('Updated Description');
    });
  });
});
```

## 4. Integration Tests

### tests/integration/page-workflow.spec.js
```javascript
describe('Page Workflow Integration', function() {
  var $controller, $rootScope, $scope, $location, $routeParams;
  var REST, Page, Users, $translate;
  
  beforeEach(module('cosmo'));
  
  beforeEach(inject(function(_$controller_, _$rootScope_, _$location_, _$q_, _REST_, _Page_, _Users_, $httpBackend) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $location = _$location_;
    REST = _REST_;
    Page = _Page_;
    Users = _Users_;
    
    // Mock HTTP backend
    $httpBackend.whenGET(/api\/themes/).respond(200, ['page.html', 'post.html']);
    $httpBackend.whenPOST(/api\/content/).respond(201, {id: 999, title: 'New Page'});
    $httpBackend.whenPOST(/api\/content\/\d+\/revisions/).respond(201, {id: 888});
    $httpBackend.whenPOST(/api\/content\/\d+\/tags/).respond(201);
    $httpBackend.whenPOST(/api\/content\/\d+\/extras/).respond(201);
    $httpBackend.whenPUT(/api\/content\/\d+/).respond(200, {id: 123, title: 'Updated Page'});
    $httpBackend.whenDELETE(/api\/content\/\d+/).respond(204);
    $httpBackend.whenDELETE(/api\/content\/\d+\/tags/).respond(204);
    $httpBackend.whenDELETE(/api\/content\/\d+\/extras/).respond(204);
    
    // Reset Page factory
    Page.id = 0;
    Page.title = '';
    Page.description = '';
    Page.url = '';
    Page.type = '';
    Page.publish = '';
    Page.scheduleDate = '';
    Page.tags = [];
    Page.themePages = ['page.html', 'post.html'];
    Page.extras = {};
    Page.header = '';
    Page.subheader = '';
    Page.body = '';
    
    // Set Users factory
    Users.id = '123';
    Users.username = 'testuser';
    
    // Mock $routeParams
    $routeParams = {url: 'test-page'};
    
    // Mock $translate service
    $translate = jasmine.createSpy('$translate').and.callFake(function(key) {
      var deferred = _$q_.defer();
      var translations = {
        'deleted': 'Page deleted',
        'saved': 'Page saved',
        'page_created': 'Page created',
        'page_updated': 'Page updated'
      };
      deferred.resolve(translations[key] || key);
      return deferred.promise;
    });
    
    // Create a new scope
    $scope = $rootScope.$new();
    
    // Mock localStorage
    spyOn(

### Tokens: {'input_tokens': 7040, 'output_tokens': 8192}
### Execution time: 98.39932489395142
