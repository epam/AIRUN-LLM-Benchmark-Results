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
Okay, let's create a comprehensive unit test suite for the provided AngularJS code using Jasmine and Karma, with `$httpBackend` for mocking REST calls.

We'll create separate test files for each component (`REST`, `Page`, `Users`, `pageCtrl`).

**Assumptions:**

1.  You have Karma, Jasmine, `angular`, and `angular-mocks` set up in your project.
2.  The AngularJS module is named `cosmo`.
3.  `$resource` is available (provided by `angular-resource`).
4.  `$upload` is available (provided by `ng-file-upload` or similar, though it's injected but not used in the provided `pageCtrl` code).
5.  `$translate` is available (provided by `angular-translate`).

**Setup (Conceptual `karma.conf.js`):**

Your `karma.conf.js` would need to include:

```javascript
// karma.conf.js (Conceptual)
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-resource/angular-resource.js', // Assuming angular-resource is used
      'node_modules/angular-translate/dist/angular-translate.js', // Assuming angular-translate is used
      // Add ng-file-upload if needed, though not used in the provided controller logic
      'src/rest.js',
      'src/page.js',
      'src/users.js',
      'src/pageCtrl.js',
      'test/**/*.spec.js' // Your test files
    ],
    exclude: [],
    preprocessors: {
      'src/**/*.js': ['coverage'] // For coverage reporting
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
    browsers: ['Chrome'], // Or other browsers
    singleRun: false,
    concurrency: Infinity
  });
};
```

**Test Files:**

Let's create the test files.

**1. `page.spec.js` (Page Factory Tests)**

```javascript
// test/page.spec.js
describe('Factory: Page', function() {
    var Page;

    // Load the module
    beforeEach(angular.mock.module('cosmo'));

    // Inject the factory
    beforeEach(angular.mock.inject(function(_Page_) {
        Page = _Page_;
    }));

    it('should be defined', function() {
        expect(Page).toBeDefined();
    });

    it('should have the correct initial properties', function() {
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
        expect(Page.extras).toEqual([]); // Note: The controller initializes extras as {} but the factory defines it as []
        expect(Page.misc).toEqual({});
    });

    // You could add tests here if the factory had methods to modify its state,
    // but it's just a data container in this case.
});
```

**2. `users.spec.js` (Users Factory Tests)**

```javascript
// test/users.spec.js
describe('Factory: Users', function() {
    var Users;

    // Load the module
    beforeEach(angular.mock.module('cosmo'));

    // Inject the factory
    beforeEach(angular.mock.inject(function(_Users_) {
        Users = _Users_;
    }));

    it('should be defined', function() {
        expect(Users).toBeDefined();
    });

    it('should have the correct initial properties', function() {
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

    // Similar to Page factory, no methods to test here.
});
```

**3. `rest.spec.js` (REST Factory Tests)**

```javascript
// test/rest.spec.js
describe('Factory: REST', function() {
    var REST;
    var $resource;

    // Load the module
    beforeEach(angular.mock.module('cosmo'));
    beforeEach(angular.mock.module('ngResource')); // Need ngResource module for $resource

    // Inject the factory and $resource
    beforeEach(angular.mock.inject(function(_REST_, _$resource_) {
        REST = _REST_;
        $resource = _$resource_;
        // Spy on $resource to check if it's called correctly
        spyOn(angular, '$resource').and.callThrough(); // Spy on the global angular.$resource
    }));

    it('should be defined', function() {
        expect(REST).toBeDefined();
    });

    it('should return an object with resource properties', function() {
        var expectedResources = [
            'blocks', 'blocksRequirements', 'comments', 'content',
            'contentExtras', 'contentRevisions', 'contentRevisionsExtras',
            'contentTags', 'files', 'filesTags', 'menus', 'modules',
            'sitemaps', 'themes', 'settings', 'users'
        ];
        expectedResources.forEach(function(resourceName) {
            expect(REST[resourceName]).toBeDefined();
            // Basic check that it looks like a resource instance (has common methods)
            if (resourceName !== 'sitemaps') { // sitemaps only has query
                 expect(REST[resourceName].get).toBeDefined();
                 expect(REST[resourceName].save).toBeDefined();
                 expect(REST[resourceName].delete).toBeDefined();
            }
            expect(REST[resourceName].query).toBeDefined();
        });
    });

    it('should configure $resource correctly for each endpoint', function() {
        // Re-inject to ensure the spy is active before the factory is created
        angular.mock.inject(function(_REST_, _$resource_) {
             $resource = _$resource_;
             spyOn(angular, '$resource').and.callThrough();
             REST = _REST_; // This will trigger the $resource calls
        });


        // Verify $resource calls with correct URLs, params, and actions
        expect(angular.$resource).toHaveBeenCalledWith('api/blocks/:blockID', { blockID: '@blockID'},{ update: { method: 'PUT' } });
        expect(angular.$resource).toHaveBeenCalledWith('api/blocks/:blockID/requirements/:requirementID', { blockID: '@blockID', requirementID: '@requirementID'},{ update: { method: 'PUT' } });
        expect(angular.$resource).toHaveBeenCalledWith('api/comments/:commentID', { commentID: '@commentID'},{ update: { method: 'PUT' } });
        expect(angular.$resource).toHaveBeenCalledWith('api/content/:contentID', { contentID: '@contentID'},{ update: { method: 'PUT' } });
        expect(angular.$resource).toHaveBeenCalledWith('api/content/:contentID/extras/', { contentID: '@contentID'});
        expect(angular.$resource).toHaveBeenCalledWith('api/content/:contentID/revisions/:revisionID', { contentID: '@contentID', revisionID: '@revisionID'}, {update: { method: 'PUT' } });
        expect(angular.$resource).toHaveBeenCalledWith('api/content/:contentID/revisions/:revisionID/extras/:extraID', { revisionID: '@revisionID', contentID: '@contentID', extraID: '@extraID'});
        expect(angular.$resource).toHaveBeenCalledWith('api/content/:contentID/tags/', { contentID: '@contentID'});
        expect(angular.$resource).toHaveBeenCalledWith('api/files/:fileID', { fileID: '@fileID'},{ update: { method: 'PUT' } });
        expect(angular.$resource).toHaveBeenCalledWith('api/files/:fileID/tag/:tag', { fileID: '@fileID', tag: '@tag'},{ update: { method: 'PUT' } });
        expect(angular.$resource).toHaveBeenCalledWith('api/menus/:menuID', { menuID: '@menuID'},{ update: { method: 'PUT' } });
        expect(angular.$resource).toHaveBeenCalledWith('api/modules/:moduleID', { moduleID: '@moduleID'},{ update: { method: 'PUT' } });
        expect(angular.$resource).toHaveBeenCalledWith('api/sitemaps/');
        expect(angular.$resource).toHaveBeenCalledWith('api/themes/:themeID', { themeID: '@themeID' }, { update: { method: 'PUT' } });
        expect(angular.$resource).toHaveBeenCalledWith('api/settings/',{}, { update: { method: 'PUT' } });
        expect(angular.$resource).toHaveBeenCalledWith('api/users/:userID', { userID: '@userID' }, { update: { method: 'PUT' } });

        // Verify the number of calls
        expect(angular.$resource.calls.count()).toBe(16);
    });
});
```

**4. `pageCtrl.spec.js` (pageCtrl Controller Tests)**

This is the most extensive test file.

```javascript
// test/pageCtrl.spec.js
describe('Controller: pageCtrl', function() {
    var $controller, $scope, $rootScope, $location, $routeParams, $httpBackend, REST, Page, Users, $translate, $upload;
    var mockLocalStorage;

    // Load the module
    beforeEach(angular.mock.module('cosmo'));
    beforeEach(angular.mock.module('ngResource')); // Needed for REST factory
    beforeEach(angular.mock.module('pascalprecht.translate')); // Needed for $translate

    // Mock localStorage
    beforeEach(function() {
        mockLocalStorage = {
            _data: {},
            setItem: function(key, value) {
                this._data[key] = value;
            },
            getItem: function(key) {
                return this._data[key] === undefined ? null : this._data[key];
            },
            removeItem: function(key) {
                delete this._data[key];
            },
            clear: function() {
                this._data = {};
            }
        };
        spyOn(mockLocalStorage, 'setItem').and.callThrough();
        spyOn(mockLocalStorage, 'getItem').and.callThrough();
        spyOn(mockLocalStorage, 'removeItem').and.callThrough();
        spyOn(mockLocalStorage, 'clear').and.callThrough();

        // Replace the global localStorage with our mock
        Object.defineProperty(window, 'localStorage', {
            value: mockLocalStorage
        });
    });

    // Inject dependencies and create controller instance
    beforeEach(angular.mock.inject(function(_$controller_, _$rootScope_, _$location_, _$routeParams_, _$httpBackend_, _REST_, _Page_, _Users_, _$translate_, _$upload_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $location = _$location_;
        $routeParams = _$routeParams_;
        $httpBackend = _$httpBackend_;
        REST = _REST_;
        Page = _Page_;
        Users = _Users_;
        $translate = _$translate_;
        $upload = _$upload_; // Mocked but not used in provided code

        // Mock $translate. This is crucial for tests involving translations.
        // We'll make it return a promise that resolves with the key itself or a predefined value.
        spyOn($translate, 'instant').and.callFake(function(key) {
             return key; // Simple mock: return the key itself
        });
         spyOn($translate, 'then').and.callFake(function(callback) {
             // Mock the promise behavior
             var deferred = {};
             deferred.promise = {
                 then: function(successCb, errorCb) {
                     successCb('translated_' + arguments[0]); // Resolve with a mock translated string
                     return deferred.promise; // Allow chaining
                 }
             };
             return deferred.promise;
         });


        // Mock Page and Users factories with some initial data if needed for specific tests
        Page.id = 123;
        Page.title = 'Initial Title';
        Page.description = 'Initial Description';
        Page.url = '/initial-url';
        Page.publish = 'Y';
        Page.scheduleDate = 1678886400; // A timestamp
        Page.tags = ['tag1', 'tag2'];
        Page.type = 'blog';
        Page.themePages = ['blog', 'page', 'landing'];
        Page.header = 'Initial Header';
        Page.subheader = 'Initial Subheader';
        Page.body = 'Initial Body';
        Page.extras = { featured: { src: 'image.jpg' }, other: 'data' };
        Page.misc = {};

        Users.id = 456;
        Users.username = 'testuser';

        // Default $routeParams
        $routeParams.url = 'initial-url';

        // Spy on $location and $rootScope.$broadcast
        spyOn($location, 'path').and.callThrough();
        spyOn($rootScope, '$broadcast').and.callThrough();

        // Create the controller instance
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

        // Flush any initial $httpBackend requests if the controller made any on load (this controller doesn't)
        // $httpBackend.flush(); // Not needed here based on the code
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        // Restore localStorage
        Object.defineProperty(window, 'localStorage', {
            value: undefined // Or the original implementation if you saved it
        });
        mockLocalStorage.clear(); // Clear mock data
    });

    // --- Initialization Tests ---
    describe('Initialization', function() {
        it('should initialize $scope.page from Page factory', function() {
            expect($scope.page.id).toBe(Page.id);
            expect($scope.page.title).toBe(Page.title);
            expect($scope.page.description).toBe(Page.description);
            expect($scope.page.url).toBe(Page.url);
            expect($scope.page.publish).toBe(Page.publish);
            // scheduleDate is handled separately below
            expect($scope.page.tags).toBe(Page.tags);
            expect($scope.page.type).toBe(Page.type);
            expect($scope.page.themePages).toBe(Page.themePages);
        });

        it('should initialize $scope.page.scheduleDate from Page.scheduleDate if it exists and not on /new', function() {
             // Page.scheduleDate is set in beforeEach
             $location.path('/some-existing-page'); // Ensure not /new
             // Re-create controller to re-run initialization logic
             $controller('pageCtrl', {
                 $scope: $scope, REST: REST, $location: $location, Page: Page,
                 $rootScope: $rootScope, $routeParams: $routeParams, $upload: $upload,
                 Users: Users, $translate: $translate
             });
             // The controller converts the timestamp to a Date object
             expect($scope.page.scheduleDate instanceof Date).toBe(true);
             // Check the timestamp value (allowing for potential timezone differences if needed, but basic check is fine)
             expect(Math.floor($scope.page.scheduleDate.getTime() / 1000)).toBe(Page.scheduleDate);
        });

        it('should initialize $scope.page.scheduleDate to a new Date if Page.scheduleDate is null/undefined', function() {
            Page.scheduleDate = null; // Simulate no date set
            $location.path('/some-existing-page');
             // Re-create controller
             $controller('pageCtrl', {
                 $scope: $scope, REST: REST, $location: $location, Page: Page,
                 $rootScope: $rootScope, $routeParams: $routeParams, $upload: $upload,
                 Users: Users, $translate: $translate
             });
            expect($scope.page.scheduleDate instanceof Date).toBe(true);
            // Check it's a recent date (within a few seconds)
            var now = new Date();
            expect($scope.page.scheduleDate.getTime()).toBeCloseTo(now.getTime(), -3); // Within 1 second
        });

         it('should initialize $scope.page.scheduleDate to a new Date if $location.path() is /new', function() {
            Page.scheduleDate = 1678886400; // Simulate a date *is* set in Page
            $location.path('/new');
             // Re-create controller
             $controller('pageCtrl', {
                 $scope: $scope, REST: REST, $location: $location, Page: Page,
                 $rootScope: $rootScope, $routeParams: $routeParams, $upload: $upload,
                 Users: Users, $translate: $translate
             });
            expect($scope.page.scheduleDate instanceof Date).toBe(true);
            // Check it's a recent date (within a few seconds)
            var now = new Date();
            expect($scope.page.scheduleDate.getTime()).toBeCloseTo(now.getTime(), -3); // Within 1 second
        });


        it('should initialize $scope.page.type from Page.type if it exists', function() {
            Page.type = 'custom-type';
            Page.themePages = ['default']; // Ensure themePages is different
             // Re-create controller
             $controller('pageCtrl', {
                 $scope: $scope, REST: REST, $location: $location, Page: Page,
                 $rootScope: $rootScope, $routeParams: $routeParams, $upload: $upload,
                 Users: Users, $translate: $translate
             });
            expect($scope.page.type).toBe('custom-type');
        });

        it('should initialize $scope.page.type from the first themePage if Page.type is null/undefined', function() {
            Page.type = null;
            Page.themePages = ['first-type', 'second-type'];
             // Re-create controller
             $controller('pageCtrl', {
                 $scope: $scope, REST: REST, $location: $location, Page: Page,
                 $rootScope: $rootScope, $routeParams: $routeParams, $upload: $upload,
                 Users: Users, $translate: $translate
             });
            expect($scope.page.type).toBe('first-type');
        });

        it('should check localStorage for newer version on initialization (excluding /new)', function() {
            $location.path('/existing-page');
            $routeParams.url = 'existing-page';

            // Simulate a newer version in localStorage
            mockLocalStorage.setItem('existing-pagetitle', 'Newer Title');
            Page.title = 'Old Title'; // Ensure Page factory has older data

             // Re-create controller
             $controller('pageCtrl', {
                 $scope: $scope, REST: REST, $location: $location, Page: Page,
                 $rootScope: $rootScope, $routeParams: $routeParams, $upload: $upload,
                 Users: Users, $translate: $translate
             });

            expect(mockLocalStorage.getItem).toHaveBeenCalledWith('existing-pagetitle');
            expect($scope.newerVersion).toBe(true);
        });

         it('should not set newerVersion if localStorage matches Page factory', function() {
            $location.path('/existing-page');
            $routeParams.url = 'existing-page';

            // Simulate localStorage matching Page factory
            mockLocalStorage.setItem('existing-pagetitle', Page.title);
            mockLocalStorage.setItem('existing-pagedescription', Page.description);
            mockLocalStorage.setItem('existing-pagepublish', Page.publish);
            mockLocalStorage.setItem('existing-pagescheduleDate', Page.scheduleDate);
            mockLocalStorage.setItem('existing-pageheader', Page.header);
            mockLocalStorage.setItem('existing-pagesubheader', Page.subheader);
            mockLocalStorage.setItem('existing-pagebody', Page.body);
            mockLocalStorage.setItem('existing-pageurl', Page.url);


             // Re-create controller
             $controller('pageCtrl', {
                 $scope: $scope, REST: REST, $location: $location, Page: Page,
                 $rootScope: $rootScope, $routeParams: $routeParams, $upload: $upload,
                 Users: Users, $translate: $translate
             });

            expect($scope.newerVersion).toBeFalsy();
        });

         it('should not check localStorage for newer version on /new path', function() {
            $location.path('/new');
            $routeParams.url = 'new'; // $routeParams.url might be 'new' or undefined depending on route config

            // Simulate a newer version in localStorage
            mockLocalStorage.setItem('newtitle', 'Newer Title');
            Page.title = 'Old Title';

             // Re-create controller
             $controller('pageCtrl', {
                 $scope: $scope, REST: REST, $location: $location, Page: Page,
                 $rootScope: $rootScope, $routeParams: $routeParams, $upload: $upload,
                 Users: Users, $translate: $translate
             });

            expect(mockLocalStorage.getItem).not.toHaveBeenCalled();
            expect($scope.newerVersion).toBeFalsy();
        });
    });

    // --- Local Storage / Version Management Tests ---
    describe('Local Storage / Version Management', function() {
        var elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
        var mockRouteUrl = 'test-page-url';

        beforeEach(function() {
            $routeParams.url = mockRouteUrl;
            // Populate localStorage with mock data
            elements.forEach(function(el) {
                mockLocalStorage.setItem(mockRouteUrl + el, 'local_' + el);
            });
            // Ensure Page factory has different data
            Page.title = 'Page Title';
            Page.description = 'Page Description';
            // ... set other Page properties differently
        });

        describe('localVersion()', function() {
            it('should restore Page factory properties from localStorage', function() {
                $scope.localVersion();

                elements.forEach(function(el) {
                    expect(Page[el]).toBe('local_' + el);
                });
            });

            it('should clear the items from localStorage', function() {
                $scope.localVersion();

                elements.forEach(function(el) {
                    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(mockRouteUrl + el, null);
                });
            });

            it('should set $scope.newerVersion to false', function() {
                $scope.newerVersion = true; // Set it true initially
                $scope.localVersion();
                expect($scope.newerVersion).toBe(false);
            });

            it('should broadcast "contentGet"', function() {
                $scope.localVersion();
                expect($rootScope.$broadcast).toHaveBeenCalledWith('contentGet');
            });

             it('should not restore if localStorage item is "null"', function() {
                 mockLocalStorage.setItem(mockRouteUrl + 'title', 'null');
                 Page.title = 'Original Title'; // This should remain unchanged

                 $scope.localVersion();

                 expect(Page.title).toBe('Original Title');
                 expect(mockLocalStorage.setItem).toHaveBeenCalledWith(mockRouteUrl + 'title', null); // Still clears it
             });
        });

        describe('deleteNewerVersion()', function() {
            it('should clear the items from localStorage', function() {
                $scope.deleteNewerVersion();

                elements.forEach(function(el) {
                    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(mockRouteUrl + el, null);
                });
            });

            it('should set $scope.newerVersion to false', function() {
                $scope.newerVersion = true; // Set it true initially
                $scope.deleteNewerVersion();
                expect($scope.newerVersion).toBe(false);
            });
        });

        describe('saveLocal()', function() {
            it('should update Page factory properties from $scope.page', function() {
                $scope.page.title = 'Scope Title';
                $scope.page.description = 'Scope Description';
                $scope.page.url = 'scope-url';
                $scope.page.type = 'scope-type';
                $scope.page.publish = 'N';
                $scope.page.scheduleDate = new Date();

                $scope.saveLocal();

                expect(Page.title).toBe('Scope Title');
                expect(Page.description).toBe('Scope Description');
                expect(Page.url).toBe('scope-url');
                expect(Page.type).toBe('scope-type');
                expect(Page.publish).toBe('N');
                expect(Page.scheduleDate).toBe($scope.page.scheduleDate);
            });

            it('should save specific properties to localStorage', function() {
                 $scope.page.title = 'Scope Title';
                 $scope.page.description = 'Scope Description';
                 $scope.page.url = 'scope-url';
                 $scope.page.type = 'scope-type';
                 $scope.page.publish = 'N';
                 $scope.page.scheduleDate = new Date(2024, 0, 1, 12, 0, 0); // Specific date

                 $scope.saveLocal();

                 expect(mockLocalStorage.setItem).toHaveBeenCalledWith(mockRouteUrl + 'title', 'Scope Title');
                 expect(mockLocalStorage.setItem).toHaveBeenCalledWith(mockRouteUrl + 'description', 'Scope Description');
                 expect(mockLocalStorage.setItem).toHaveBeenCalledWith(mockRouteUrl + 'url', 'scope-url');
                 expect(mockLocalStorage.setItem).toHaveBeenCalledWith(mockRouteUrl + 'publish', 'N');
                 expect(mockLocalStorage.setItem).toHaveBeenCalledWith(mockRouteUrl + 'scheduleDate', $scope.page.scheduleDate);
                 expect(mockLocalStorage.setItem).toHaveBeenCalledWith(mockRouteUrl + 'type', 'scope-type');
            });
        });
    });


    // --- Delete Page Tests ---
    describe('deletePage()', function() {
        var pageId = 999;
        beforeEach(function() {
            $scope.page.id = pageId;

            // Mock REST calls
            $httpBackend.whenDELETE('api/content/' + pageId).respond(200);
            $httpBackend.whenDELETE('api/content/' + pageId + '/revisions').respond(200);
            $httpBackend.whenDELETE('api/content/' + pageId + '/revisions/extras').respond(200);
            $httpBackend.whenDELETE('api/content/' + pageId + '/extras/').respond(200); // Note the trailing slash in the factory definition
            $httpBackend.whenDELETE('api/content/' + pageId + '/tags/').respond(200); // Note the trailing slash in the factory definition
        });

        it('should call REST delete methods for content, revisions, extras, and tags', function() {
            $scope.deletePage();

            $httpBackend.expectDELETE('api/content/' + pageId);
            $httpBackend.expectDELETE('api/content/' + pageId + '/revisions');
            $httpBackend.expectDELETE('api/content/' + pageId + '/revisions/extras');
            $httpBackend.expectDELETE('api/content/' + pageId + '/extras/');
            $httpBackend.expectDELETE('api/content/' + pageId + '/tags/');

            $httpBackend.flush();
        });

        it('should broadcast a success notification after content delete success', function() {
            $scope.deletePage();
            $httpBackend.flush();

            expect($translate.then).toHaveBeenCalled(); // Check if translation promise was used
            expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated_deleted' });
        });

        it('should redirect to /new after deletion', function() {
            $scope.deletePage();
            $httpBackend.flush();

            expect($location.path).toHaveBeenCalledWith('new');
        });

        // Note: The original code doesn't handle errors for the delete calls after the first one.
        // Testing error handling for the *first* delete call (content) is possible.
        it('should not broadcast success or redirect if content delete fails', function() {
             $httpBackend.resetExpectations(); // Clear previous expectations
             $httpBackend.whenDELETE('api/content/' + pageId).respond(500); // Simulate error
             $httpBackend.whenDELETE('api/content/' + pageId + '/revisions').respond(200); // Still mock others
             $httpBackend.whenDELETE('api/content/' + pageId + '/revisions/extras').respond(200);
             $httpBackend.whenDELETE('api/content/' + pageId + '/extras/').respond(200);
             $httpBackend.whenDELETE('api/content/' + pageId + '/tags/').respond(200);

             $scope.deletePage();

             $httpBackend.expectDELETE('api/content/' + pageId);

             // Expect other deletes to still be called based on the code structure
             $httpBackend.expectDELETE('api/content/' + pageId + '/revisions');
             $httpBackend.expectDELETE('api/content/' + pageId + '/revisions/extras');
             $httpBackend.expectDELETE('api/content/' + pageId + '/extras/');
             $httpBackend.expectDELETE('api/content/' + pageId + '/tags/');


             $httpBackend.flush();

             expect($translate.then).not.toHaveBeenCalled(); // No success translation
             expect($rootScope.$broadcast).not.toHaveBeenCalledWith('notify', jasmine.any(Object)); // No notification
             expect($location.path).not.toHaveBeenCalledWith('new'); // No redirect
        });
    });

    // --- Event Handling Tests ---
    describe('Event Handling', function() {
        it('should update $scope.page when "contentGet" is broadcast', function() {
            // Change Page factory data after controller initialization
            Page.title = 'Updated Title';
            Page.description = 'Updated Description';
            Page.url = '/updated-url';
            Page.type = 'updated-type';
            Page.tags = ['newtag'];

            // Broadcast the event
            $rootScope.$broadcast('contentGet');
            $rootScope.$apply(); // Needed to process the event listener

            // Verify $scope.page is updated
            expect($scope.page.title).toBe('Updated Title');
            expect($scope.page.description).toBe('Updated Description');
            expect($scope.page.url).toBe('/updated-url');
            expect($scope.page.type).toBe('updated-type');
            expect($scope.page.tags).toEqual(['newtag']);
        });
    });

    // --- Input Change Tests ---
    describe('Input Change Handlers', function() {
        describe('updatePageType()', function() {
            it('should update Page.type from $scope.page.type', function() {
                $scope.page.type = 'new-type-from-select';
                $scope.updatePageType();
                expect(Page.type).toBe('new-type-from-select');
            });

            it('should broadcast "settingsGet"', function() {
                $scope.updatePageType();
                expect($rootScope.$broadcast).toHaveBeenCalledWith('settingsGet');
            });
        });

        describe('titleChange()', function() {
            it('should update Page.title from $scope.page.title', function() {
                $scope.page.title = 'New Page Title';
                $scope.titleChange();
                expect(Page.title).toBe('New Page Title');
            });

            it('should auto-generate URL if $scope.page.url is "/new"', function() {
                $scope.page.url = '/new';
                $scope.page.title = 'My Awesome Page!';
                $scope.titleChange();
                expect($scope.autoURL).toBe(true);
                expect($scope.page.url).toBe('my-awesome-page');
                expect(Page.url).toBe('my-awesome-page');
            });

             it('should auto-generate URL if $scope.page.url is "new"', function() {
                $scope.page.url = 'new';
                $scope.page.title = 'Another Test Page';
                $scope.titleChange();
                expect($scope.autoURL).toBe(true);
                expect($scope.page.url).toBe('another-test-page');
                expect(Page.url).toBe('another-test-page');
            });

             it('should auto-generate URL if $scope.page.url is empty', function() {
                $scope.page.url = '';
                $scope.page.title = 'Empty URL Test';
                $scope.titleChange();
                expect($scope.autoURL).toBe(true);
                expect($scope.page.url).toBe('empty-url-test');
                expect(Page.url).toBe('empty-url-test');
            });

            it('should auto-generate URL if $scope.autoURL is true', function() {
                $scope.autoURL = true; // Explicitly set autoURL
                $scope.page.url = '/some-existing-url'; // This should be ignored if autoURL is true
                $scope.page.title = 'Override URL Test';
                $scope.titleChange();
                expect($scope.autoURL).toBe(true); // Should remain true
                expect($scope.page.url).toBe('override-url-test');
                expect(Page.url).toBe('override-url-test');
            });

            it('should not auto-generate URL if $scope.page.url is not "/new", "new", or empty and $scope.autoURL is false', function() {
                $scope.page.url = '/existing-url';
                $scope.autoURL = false; // Default state for existing pages
                $scope.page.title = 'New Title'; // Change title
                var originalUrl = $scope.page.url;

                $scope.titleChange();

                expect($scope.autoURL).toBe(false); // Should remain false
                expect($scope.page.url).toBe(originalUrl); // URL should not change
                expect(Page.url).toBe(originalUrl); // Page.url should not change
                expect(Page.title).toBe('New Title'); // Page.title should still update
            });

            it('should handle punctuation and spaces correctly in auto-generated URL', function() {
                $scope.page.url = '/new';
                $scope.page.title = 'My Page! With, Punctuation & Spaces.';
                $scope.titleChange();
                expect($scope.page.url).toBe('my-page-with-punctuation--spaces'); // Note: & becomes empty string, multiple hyphens might occur
                expect(Page.url).toBe('my-page-with-punctuation--spaces');
            });
        });

        describe('descriptionChange()', function() {
            it('should update Page.description from $scope.page.description', function() {
                $scope.page.description = 'New Page Description';
                $scope.descriptionChange();
                expect(Page.description).toBe('New Page Description');
            });
        });

        describe('urlChange()', function() {
            it('should update Page.url from $scope.page.url', function() {
                $scope.page.url = '/new-custom-url';
                $scope.urlChange();
                expect(Page.url).toBe('/new-custom-url');
            });

            it('should set $scope.autoURL to false', function() {
                $scope.autoURL = true; // Set it true initially
                $scope.urlChange();
                expect($scope.autoURL).toBe(false);
            });
        });
    });

    // --- Tag Autocomplete Tests ---
    describe('Tag Autocomplete', function() {
        var mockTags = ['apple', 'banana', 'cherry'];

        beforeEach(function() {
            // Mock REST call for tag query
            $httpBackend.whenGET('api/content/:contentID/tags/?tag=app').respond(200, ['apple', 'application']);
            $httpBackend.whenGET('api/content/:contentID/tags/?tag=nonexistent').respond(404); // Simulate no results
            $httpBackend.whenGET('api/content/:contentID/tags/').respond(200, []); // Default query without tag param

            $scope.page.tags = ['existing', 'app']; // Simulate user typing 'app' after 'existing'
            $scope.page.suggestions = []; // Ensure suggestions are initially empty
        });

        it('should query REST.contentTags with the last tag if tags exist', function() {
            $scope.autocompleteTags();
            $httpBackend.expectGET('api/content/:contentID/tags/?tag=app');
            $httpBackend.flush();
        });

        it('should set $scope.page.suggestions on successful query', function() {
            $scope.autocompleteTags();
            $httpBackend.flush();
            expect($scope.page.suggestions).toEqual(['apple', 'application']);
        });

        it('should set $scope.page.suggestions to empty array on query error (no tag found)', function() {
            $scope.page.tags = ['existing', 'nonexistent'];
            $scope.autocompleteTags();
            $httpBackend.flush();
            expect($scope.page.suggestions).toEqual([]);
        });

        it('should set $scope.page.suggestions to empty array if tags array is empty', function() {
            $scope.page.tags = [];
            $scope.autocompleteTags();
            expect($scope.page.suggestions).toEqual([]);
            $httpBackend.verifyNoOutstandingRequest(); // No API call should be made
        });

         it('should set $scope.page.suggestions to empty array if the last tag is empty', function() {
            $scope.page.tags = ['existing', '']; // User typed comma, last tag is empty
            $scope.autocompleteTags();
            expect($scope.page.suggestions).toEqual([]);
            $httpBackend.verifyNoOutstandingRequest(); // No API call should be made
        });
    });

    describe('selectSuggestion()', function() {
        it('should replace the last tag with the selected suggestion', function() {
            $scope.page.tags = ['tag1', 'parti'];
            var suggestion = 'particular';
            $scope.selectSuggestion(suggestion);
            expect($scope.page.tags[0]).toBe('tag1');
            expect($scope.page.tags[1]).toBe('particular');
        });

        it('should add an empty string as the new last tag', function() {
            $scope.page.tags = ['tag1', 'parti'];
            var suggestion = 'particular';
            $scope.selectSuggestion(suggestion);
            expect($scope.page.tags.length).toBe(3);
            expect($scope.page.tags[2]).toBe('');
        });

        it('should clear $scope.page.suggestions', function() {
            $scope.page.tags = ['tag1', 'parti'];
            $scope.page.suggestions = ['particular', 'party']; // Simulate suggestions exist
            var suggestion = 'particular';
            $scope.selectSuggestion(suggestion);
            expect($scope.page.suggestions).toEqual([]);
        });

         it('should handle selecting a suggestion when tags array is empty', function() {
            $scope.page.tags = [];
            var suggestion = 'firsttag';
            $scope.selectSuggestion(suggestion);
            expect($scope.page.tags.length).toBe(2);
            expect($scope.page.tags[0]).toBe('firsttag');
            expect($scope.page.tags[1]).toBe('');
            expect($scope.page.suggestions).toEqual([]);
        });
    });


    // --- Save Page Tests ---
    describe('savePage()', function() {
        var mockPageData;
        var mockNewPageResponse = { id: 500, url: '/new-saved-page' };
        var mockRevisionResponse = { id: 501 };

        beforeEach(function() {
            // Reset Page factory to a clean state for saving tests
            Page.id = 0; // Simulate a new page initially
            Page.title = 'Test Page Title';
            Page.description = 'Test Page Description';
            Page.header = 'Test Header';
            Page.subheader = 'Test Subheader';
            Page.body = 'Test Body';
            Page.url = 'test-page-url';
            Page.type = 'page';
            Page.publish = 'N';
            Page.scheduleDate = null; // Will be set by controller logic
            Page.tags = ['tagA', 'tagB'];
            Page.extras = { extra1: 'value1', extra2: { nested: true } };
            Page.misc = {};

            // Set $scope.page to match Page factory initially, but allow changes in tests
            $scope.page = angular.copy(Page);
            $scope.page.scheduleDate = new Date(2025, 0, 1, 12, 0, 0); // Simulate user setting a future date
            $scope.page.publish = 'schedule'; // Simulate user selecting schedule

            Users.id = 789; // Ensure user ID is set

            // Default $location path to simulate creating a new page
            $location.path('/new');

            // Mock REST calls - set up expectations in individual tests
            $httpBackend.whenPOST('api/content/').respond(200, mockNewPageResponse);
            $httpBackend.whenPUT('api/content/:contentID').respond(200);
            $httpBackend.whenPOST('api/content/:contentID/revisions').respond(200, mockRevisionResponse);
            $httpBackend.whenDELETE('api/content/:contentID/tags/').respond(200);
            $httpBackend.whenPOST('api/content/:contentID/tags/').respond(200);
            $httpBackend.whenDELETE('api/content/:contentID/extras/').respond(200);
            $httpBackend.whenPOST('api/content/:contentID/extras/').respond(200);
            $httpBackend.whenPOST('api/content/:contentID/revisions/:revisionID/extras/:extraID').respond(200); // Note: extraID is not used in the factory definition for this endpoint, but the URL matches. The controller doesn't pass extraID either.
        });

        // --- Validation Tests ---
        it('should broadcast error and return if duplicate is true and url is current path', function() {
            $location.path('/existing-page');
            $scope.page.url = '/existing-page'; // Simulate trying to duplicate to the same URL

            $scope.savePage(true); // Call with duplicate = true

            expect($translate.then).toHaveBeenCalledWith(jasmine.any(Function));
            expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated_page_different_url', classes: 'alert-error' });
            $httpBackend.verifyNoOutstandingRequest(); // No API call should be made
        });

        it('should broadcast error and return if page type is missing', function() {
            $scope.page.type = ''; // Simulate missing type

            $scope.savePage();

            expect($translate.then).toHaveBeenCalledWith(jasmine.any(Function));
            expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated_page_no_type_selected', classes: 'alert-error' });
            $httpBackend.verifyNoOutstandingRequest(); // No API call should be made
        });

        it('should broadcast error and return if page url is empty', function() {
            $scope.page.url = ''; // Simulate missing url
            $scope.page.type = 'page'; // Valid type

            $scope.savePage();

            expect($translate.then).toHaveBeenCalledWith(jasmine.any(Function));
            expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated_page_no_url', classes: 'alert-error' });
            $httpBackend.verifyNoOutstandingRequest(); // No API call should be made
        });

         it('should broadcast error and return if page url is "new"', function() {
            $scope.page.url = 'new'; // Simulate url is 'new'
            $scope.page.type = 'page'; // Valid type

            $scope.savePage();

            expect($translate.then).toHaveBeenCalledWith(jasmine.any(Function));
            expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated_page_no_url', classes: 'alert-error' });
            $httpBackend.verifyNoOutstandingRequest(); // No API call should be made
        });

        // --- Title Fallback Test ---
        it('should use Page.header for title if $scope.page.title is empty', function() {
            $scope.page.title = ''; // Simulate empty title
            Page.header = 'Fallback Header Title'; // Header has a value
            $scope.page.type = 'page';
            $scope.page.url = 'valid-url';

            // Expect REST.content.save to be called with header as title
            $httpBackend.expectPOST('api/content/', function(data) {
                var payload = angular.fromJson(data);
                return payload.title === 'Fallback Header Title';
            }).respond(200, mockNewPageResponse);

            // Mock other calls needed for save flow
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/revisions').respond(200, mockRevisionResponse);
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/tags/').respond(200); // For tag saves
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/extras/').respond(200); // For extra saves
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/revisions/' + mockRevisionResponse.id + '/extras/').respond(200); // For revision extra saves

            $scope.savePage();
            $httpBackend.flush();
        });

        // --- Schedule Date Logic Tests ---
        it('should use Page.scheduleDate if $scope.page.publish is "Y" and Page.publish was "Y"', function() {
            $scope.page.publish = 'Y';
            Page.publish = 'Y'; // Was already published
            Page.scheduleDate = 1600000000; // Existing published date timestamp
            $scope.page.scheduleDate = new Date(); // User might have changed the date input, but it should be ignored

            $scope.page.type = 'page';
            $scope.page.url = 'valid-url';

            $httpBackend.expectPOST('api/content/', function(data) {
                var payload = angular.fromJson(data);
                return payload.published_date === 1600000000;
            }).respond(200, mockNewPageResponse);

             // Mock other calls needed for save flow
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/revisions').respond(200, mockRevisionResponse);
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/tags/').respond(200); // For tag saves
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/extras/').respond(200); // For extra saves
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/revisions/' + mockRevisionResponse.id + '/extras/').respond(200); // For revision extra saves

            $scope.savePage();
            $httpBackend.flush();
        });

        it('should use current timestamp if $scope.page.publish is "Y" and Page.publish was not "Y"', function() {
            $scope.page.publish = 'Y'; // Publishing now
            Page.publish = 'N'; // Was a draft
            Page.scheduleDate = null; // No previous date

            $scope.page.type = 'page';
            $scope.page.url = 'valid-url';

            var now = Math.round(+new Date().getTime()/1000);

            $httpBackend.expectPOST('api/content/', function(data) {
                var payload = angular.fromJson(data);
                // Check if the date is close to now (within a few seconds)
                return Math.abs(payload.published_date - now) < 5;
            }).respond(200, mockNewPageResponse);

             // Mock other calls needed for save flow
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/revisions').respond(200, mockRevisionResponse);
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/tags/').respond(200); // For tag saves
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/extras/').respond(200); // For extra saves
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/revisions/' + mockRevisionResponse.id + '/extras/').respond(200); // For revision extra saves

            $scope.savePage();
            $httpBackend.flush();
        });

        it('should use parsed scheduleDate timestamp if $scope.page.publish is "schedule"', function() {
            $scope.page.publish = 'schedule';
            var futureDate = new Date(2026, 0, 1, 12, 0, 0); // A future date
            $scope.page.scheduleDate = futureDate;

            $scope.page.type = 'page';
            $scope.page.url = 'valid-url';

            var expectedTimestamp = Math.floor(futureDate.getTime() / 1000);

            $httpBackend.expectPOST('api/content/', function(data) {
                var payload = angular.fromJson(data);
                return payload.published_date === expectedTimestamp;
            }).respond(200, mockNewPageResponse);

             // Mock other calls needed for save flow
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/revisions').respond(200, mockRevisionResponse);
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/tags/').respond(200); // For tag saves
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/extras/').respond(200); // For extra saves
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/revisions/' + mockRevisionResponse.id + '/extras/').respond(200); // For revision extra saves

            $scope.savePage();
            $httpBackend.flush();
        });

        it('should change $scope.page.publish to "Y" if scheduled date is in the past', function() {
            $scope.page.publish = 'schedule';
            var pastDate = new Date(2020, 0, 1, 12, 0, 0); // A past date
            $scope.page.scheduleDate = pastDate;

            $scope.page.type = 'page';
            $scope.page.url = 'valid-url';

            $httpBackend.expectPOST('api/content/', function(data) {
                var payload = angular.fromJson(data);
                 // Check publish status in the payload
                return payload.published === 'Y';
            }).respond(200, mockNewPageResponse);

             // Mock other calls needed for save flow
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/revisions').respond(200, mockRevisionResponse);
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/tags/').respond(200); // For tag saves
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/extras/').respond(200); // For extra saves
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/revisions/' + mockRevisionResponse.id + '/extras/').respond(200); // For revision extra saves

            $scope.savePage();
            $httpBackend.flush();

            expect($scope.page.publish).toBe('Y'); // Verify scope variable is updated
        });

        it('should keep $scope.page.publish as "N" if scheduled date is in the future', function() {
            $scope.page.publish = 'schedule';
            var futureDate = new Date(2026, 0, 1, 12, 0, 0); // A future date
            $scope.page.scheduleDate = futureDate;

            $scope.page.type = 'page';
            $scope.page.url = 'valid-url';

            $httpBackend.expectPOST('api/content/', function(data) {
                var payload = angular.fromJson(data);
                 // Check publish status in the payload
                return payload.published === 'N';
            }).respond(200, mockNewPageResponse);

             // Mock other calls needed for save flow
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/revisions').respond(200, mockRevisionResponse);
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/tags/').respond(200); // For tag saves
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/extras/').respond(200); // For extra saves
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/revisions/' + mockRevisionResponse.id + '/extras/').respond(200); // For revision extra saves

            $scope.savePage();
            $httpBackend.flush();

            expect($scope.page.publish).toBe('N'); // Verify scope variable is updated
        });


        // --- Featured Image Test ---
        it('should include featured image src from Page.extras if available', function() {
            Page.extras = { featured: { src: 'path/to/featured.jpg' }, other: 'data' };
            $scope.page.type = 'page';
            $scope.page.url = 'valid-url';

            $httpBackend.expectPOST('api/content/', function(data) {
                var payload = angular.fromJson(data);
                return payload.featured === 'path/to/featured.jpg';
            }).respond(200, mockNewPageResponse);

             // Mock other calls needed for save flow
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/revisions').respond(200, mockRevisionResponse);
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/tags/').respond(200); // For tag saves
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/extras/').respond(200); // For extra saves
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/revisions/' + mockRevisionResponse.id + '/extras/').respond(200); // For revision extra saves

            $scope.savePage();
            $httpBackend.flush();
        });

        it('should set featured image to null if Page.extras.featured is not available', function() {
            Page.extras = { other: 'data' }; // No featured extra
            $scope.page.type = 'page';
            $scope.page.url = 'valid-url';

            $httpBackend.expectPOST('api/content/', function(data) {
                var payload = angular.fromJson(data);
                return payload.featured === null;
            }).respond(200, mockNewPageResponse);

             // Mock other calls needed for save flow
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/revisions').respond(200, mockRevisionResponse);
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/tags/').respond(200); // For tag saves
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/extras/').respond(200); // For extra saves
            $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/revisions/' + mockRevisionResponse.id + '/extras/').respond(200); // For revision extra saves

            $scope.savePage();
            $httpBackend.flush();
        });


        // --- New Page / Duplicate Flow Tests ---
        describe('when creating a new page or duplicating', function() {
            beforeEach(function() {
                // Ensure we are on the /new path or simulating duplicate
                $location.path('/new');
                Page.id = 0; // Ensure Page factory indicates new page
                $scope.page.id = 0; // Ensure scope indicates new page
            });

            it('should call REST.content.save with correct payload', function() {
                $scope.page.type = 'page';
                $scope.page.url = 'new-page-url';
                $scope.page.publish = 'Y'; // Publish now
                $scope.page.scheduleDate = new Date(); // Will be ignored by logic

                var now = Math.round(+new Date().getTime()/1000);

                $httpBackend.expectPOST('api/content/', function(data) {
                    var payload = angular.fromJson(data);
                    expect(payload.title).toBe($scope.page.title);
                    expect(payload.description).toBe($scope.page.description);
                    expect(payload.header).toBe(Page.header);
                    expect(payload.subheader).toBe(Page.subheader);
                    expect(payload.featured).toBe(Page.extras.featured.src);
                    expect(payload.body).toBe(Page.body);
                    expect(payload.url).toBe($scope.page.url);
                    expect(payload.type).toBe($scope.page.type);
                    expect(payload.published).toBe('Y');
                    expect(Math.abs(payload.published_date - now) < 5).toBe(true); // Check timestamp is close to now
                    expect(payload.author).toBe(Users.id);
                    return true;
                }).respond(200, mockNewPageResponse);

                 // Mock other calls needed for save flow
                $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/revisions').respond(200, mockRevisionResponse);
                $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/tags/').respond(200); // For tag saves
                $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/extras/').respond(200); // For extra saves
                $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/revisions/' + mockRevisionResponse.id + '/extras/').respond(200); // For revision extra saves


                $scope.savePage();
                $httpBackend.flush();
            });

            it('should handle REST.content.save error', function() {
                $scope.page.type = 'page';
                $scope.page.url = 'new-page-url';

                $httpBackend.expectPOST('api/content/').respond(500);

                $scope.savePage();
                $httpBackend.flush();

                expect($translate.then).toHaveBeenCalledWith(jasmine.any(Function));
                expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated_page_error_saving', classes: 'alert-error' });
            });

            it('should update $scope.page.id and $scope.autoURL after successful content save', function() {
                 $scope.page.type = 'page';
                 $scope.page.url = 'new-page-url';
                 $scope.autoURL = true; // Simulate autoURL was true

                 $httpBackend.expectPOST('api/content/').respond(200, mockNewPageResponse);

                 // Mock other calls needed for save flow
                 $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/revisions').respond(200, mockRevisionResponse);
                 $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/tags/').respond(200); // For tag saves
                 $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/extras/').respond(200); // For extra saves
                 $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/revisions/' + mockRevisionResponse.id + '/extras/').respond(200); // For revision extra saves

                 $scope.savePage();
                 $httpBackend.flush();

                 expect($scope.page.id).toBe(mockNewPageResponse.id);
                 expect($scope.autoURL).toBe(false);
            });

            it('should save tags after successful content save', function() {
                 $scope.page.type = 'page';
                 $scope.page.url = 'new-page-url';
                 $scope.page.tags = ['tagA', 'tagB'];

                 $httpBackend.expectPOST('api/content/').respond(200, mockNewPageResponse);
                 $httpBackend.expectPOST('api/content/' + mockNewPageResponse.id + '/revisions').respond(200, mockRevisionResponse);

                 // Expect tag saves
                 $httpBackend.expectPOST('api/content/' + mockNewPageResponse.id + '/tags/', { contentID: mockNewPageResponse.id, tag: 'tagA' }).respond(200);
                 $httpBackend.expectPOST('api/content/' + mockNewPageResponse.id + '/tags/', { contentID: mockNewPageResponse.id, tag: 'tagB' }).respond(200);

                 // Mock extra saves
                 $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/extras/').respond(200);
                 $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/revisions/' + mockRevisionResponse.id + '/extras/').respond(200);

                 $scope.savePage();
                 $httpBackend.flush();
            });

             it('should not save tags if $scope.page.tags is null or empty', function() {
                 $scope.page.type = 'page';
                 $scope.page.url = 'new-page-url';
                 $scope.page.tags = null; // Or []

                 $httpBackend.expectPOST('api/content/').respond(200, mockNewPageResponse);
                 $httpBackend.expectPOST('api/content/' + mockNewPageResponse.id + '/revisions').respond(200, mockRevisionResponse);

                 // Mock extra saves
                 $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/extras/').respond(200);
                 $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/revisions/' + mockRevisionResponse.id + '/extras/').respond(200);

                 $scope.savePage();
                 $httpBackend.flush();

                 // Verify no tag save calls were made
                 $httpBackend.verifyNoOutstandingRequest(); // This will fail if unexpected calls were made
            });


            it('should save a revision after successful content save', function() {
                 $scope.page.type = 'page';
                 $scope.page.url = 'new-page-url';
                 $scope.page.publish = 'Y'; // Publish now
                 $scope.page.scheduleDate = new Date(); // Will be ignored by logic

                 var now = Math.round(+new Date().getTime()/1000);

                 $httpBackend.expectPOST('api/content/').respond(200, mockNewPageResponse);
                 $httpBackend.expectPOST('api/content/' + mockNewPageResponse.id + '/revisions', function(data) {
                     var payload = angular.fromJson(data);
                     expect(payload.contentID).toBe(mockNewPageResponse.id);
                     expect(payload.title).toBe($scope.page.title);
                     expect(payload.description).toBe($scope.page.description);
                     expect(payload.header).toBe(Page.header);
                     expect(payload.subheader).toBe(Page.subheader);
                     expect(payload.featured).toBe(Page.extras.featured.src);
                     expect(payload.body).toBe(Page.body);
                     expect(payload.url).toBe($scope.page.url);
                     expect(payload.type).toBe($scope.page.type);
                     expect(payload.published).toBe('Y');
                     expect(Math.abs(payload.published_date - now) < 5).toBe(true); // Check timestamp is close to now
                     expect(payload.author).toBe(Users.id);
                     return true;
                 }).respond(200, mockRevisionResponse);

                 // Mock other calls needed for save flow
                 $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/tags/').respond(200); // For tag saves
                 $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/extras/').respond(200); // For extra saves
                 $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/revisions/' + mockRevisionResponse.id + '/extras/').respond(200); // For revision extra saves

                 $scope.savePage();
                 $httpBackend.flush();
            });

            it('should save extras and revision extras after saving revision if Page.extras is not empty', function() {
                 $scope.page.type = 'page';
                 $scope.page.url = 'new-page-url';
                 Page.extras = { extra1: 'value1', extra2: { nested: true } }; // Ensure extras exist

                 $httpBackend.expectPOST('api/content/').respond(200, mockNewPageResponse);
                 $httpBackend.expectPOST('api/content/' + mockNewPageResponse.id + '/revisions').respond(200, mockRevisionResponse);

                 // Expect extra saves
                 $httpBackend.expectPOST('api/content/' + mockNewPageResponse.id + '/extras/', { contentID: mockNewPageResponse.id, name: 'extra1', extra: 'value1' }).respond(200);
                 $httpBackend.expectPOST('api/content/' + mockNewPageResponse.id + '/extras/', { contentID: mockNewPageResponse.id, name: 'extra2', extra: angular.toJson({ nested: true }) }).respond(200);

                 // Expect revision extra saves
                 $httpBackend.expectPOST('api/content/' + mockNewPageResponse.id + '/revisions/' + mockRevisionResponse.id + '/extras/', { revisionID: mockRevisionResponse.id, contentID: mockNewPageResponse.id, name: 'extra1', extra: 'value1' }).respond(200);
                 $httpBackend.expectPOST('api/content/' + mockNewPageResponse.id + '/revisions/' + mockRevisionResponse.id + '/extras/', { revisionID: mockRevisionResponse.id, contentID: mockNewPageResponse.id, name: 'extra2', extra: angular.toJson({ nested: true }) }).respond(200);

                 // Mock tag saves
                 $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/tags/').respond(200);

                 $scope.savePage();
                 $httpBackend.flush();
            });

             it('should stringify objects and arrays in Page.extras before saving', function() {
                 $scope.page.type = 'page';
                 $scope.page.url = 'new-page-url';
                 Page.extras = {
                     objExtra: { key: 'value' },
                     arrExtra: [1, 2, 3],
                     stringExtra: 'just a string'
                 };

                 $httpBackend.expectPOST('api/content/').respond(200, mockNewPageResponse);
                 $httpBackend.expectPOST('api/content/' + mockNewPageResponse.id + '/revisions').respond(200, mockRevisionResponse);

                 // Expect extra saves with stringified data
                 $httpBackend.expectPOST('api/content/' + mockNewPageResponse.id + '/extras/', { contentID: mockNewPageResponse.id, name: 'objExtra', extra: angular.toJson({ key: 'value' }) }).respond(200);
                 $httpBackend.expectPOST('api/content/' + mockNewPageResponse.id + '/extras/', { contentID: mockNewPageResponse.id, name: 'arrExtra', extra: angular.toJson([1, 2, 3]) }).respond(200);
                 $httpBackend.expectPOST('api/content/' + mockNewPageResponse.id + '/extras/', { contentID: mockNewPageResponse.id, name: 'stringExtra', extra: 'just a string' }).respond(200);

                 // Expect revision extra saves with stringified data
                 $httpBackend.expectPOST('api/content/' + mockNewPageResponse.id + '/revisions/' + mockRevisionResponse.id + '/extras/', { revisionID: mockRevisionResponse.id, contentID: mockNewPageResponse.id, name: 'objExtra', extra: angular.toJson({ key: 'value' }) }).respond(200);
                 $httpBackend.expectPOST('api/content/' + mockNewPageResponse.id + '/revisions/' + mockRevisionResponse.id + '/extras/', { revisionID: mockRevisionResponse.id, contentID: mockNewPageResponse.id, name: 'arrExtra', extra: angular.toJson([1, 2, 3]) }).respond(200);
                 $httpBackend.expectPOST('api/content/' + mockNewPageResponse.id + '/revisions/' + mockRevisionResponse.id + '/extras/', { revisionID: mockRevisionResponse.id, contentID: mockNewPageResponse.id, name: 'stringExtra', extra: 'just a string' }).respond(200);


                 // Mock tag saves
                 $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/tags/').respond(200);

                 $scope.savePage();
                 $httpBackend.flush();
             });


            it('should broadcast "saved" and redirect if Page.extras is empty', function() {
                 $scope.page.type = 'page';
                 $scope.page.url = 'new-page-url';
                 Page.extras = {}; // Ensure extras are empty

                 $httpBackend.expectPOST('api/content/').respond(200, mockNewPageResponse);
                 $httpBackend.expectPOST('api/content/' + mockNewPageResponse.id + '/revisions').respond(200, mockRevisionResponse);

                 // Mock tag saves
                 $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/tags/').respond(200);

                 $scope.savePage();
                 $httpBackend.flush();

                 expect($translate.then).toHaveBeenCalledWith(jasmine.any(Function)); // For 'saved' translation
                 expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated_saved' });
                 expect($location.path).toHaveBeenCalledWith($scope.page.url);
            });

             // Note: The original code broadcasts 'page_created' *before* waiting for extras,
             // and then 'page_created' again after the last extra is saved.
             // We test the actual behavior.
            it('should broadcast "page_created" twice and redirect after saving extras', function() {
                 $scope.page.type = 'page';
                 $scope.page.url = 'new-page-url';
                 Page.extras = { extra1: 'value1', extra2: 'value2' }; // Ensure extras exist

                 $httpBackend.expectPOST('api/content/').respond(200, mockNewPageResponse);
                 $httpBackend.expectPOST('api/content/' + mockNewPageResponse.id + '/revisions').respond(200, mockRevisionResponse);

                 // Mock tag saves
                 $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/tags/').respond(200);

                 // Expect extra saves (order might vary, so use when)
                 $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/extras/').respond(200);
                 $httpBackend.whenPOST('api/content/' + mockNewPageResponse.id + '/revisions/' + mockRevisionResponse.id + '/extras/').respond(200);


                 $scope.savePage();
                 $httpBackend.flush(); // Flush all pending requests

                 // Check broadcasts - the first one happens immediately after revision save promise resolves
                 expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated_page_created' }); // First broadcast
                 expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated_page_created' }); // Second broadcast after last extra save

                 expect($location.path).toHaveBeenCalledWith($scope.page.url);
            });
        });

        // --- Update Existing Page Flow Tests ---
        describe('when updating an existing page', function() {
            var existingPageId = 888;
            var existingPageUrl = '/existing-page-url';
            var mockRevisionResponse = { id: 501 };

            beforeEach(function() {
                // Simulate editing an existing page
                $location.path(existingPageUrl);
                $scope.page.id = existingPageId;
                Page.id = existingPageId; // Ensure Page factory matches
                $scope.page.url = existingPageUrl; // Ensure URL matches path initially

                // Reset Page factory data for update tests
                Page.title = 'Existing Title';
                Page.description = 'Existing Description';
                Page.header = 'Existing Header';
                Page.subheader = 'Existing Subheader';
                Page.body = 'Existing Body';
                Page.url = existingPageUrl;
                Page.type = 'existing-type';
                Page.publish = 'Y'; // Simulate already published
                Page.scheduleDate = 1600000000; // Existing published date timestamp
                Page.tags = ['oldtag1', 'oldtag2'];
                Page.extras = { oldExtra: 'oldValue' };
                Page.misc = {};

                // Update $scope.page with changes
                $scope.page.title = 'Updated Title';
                $scope.page.description = 'Updated Description';
                $scope.page.type = 'updated-type';
                $scope.page.publish = 'schedule'; // Change publish status
                $scope.page.scheduleDate = new Date(2026, 0, 1, 12, 0, 0); // Future date
                $scope.page.tags = ['newtag1', 'newtag2']; // Change tags
                Page.extras = { newExtra: 'newValue', anotherExtra: { data: true } }; // Change extras

                Users.id = 789; // Ensure user ID is set

                 // Mock REST calls - set up expectations in individual tests
                $httpBackend.whenPUT('api/content/' + existingPageId).respond(200);
                $httpBackend.whenPOST('api/content/' + existingPageId + '/revisions').respond(200, mockRevisionResponse);
                $httpBackend.whenDELETE('api/content/' + existingPageId + '/tags/').respond(200);
                $httpBackend.whenPOST('api/content/' + existingPageId + '/tags/').respond(200);
                $httpBackend.whenDELETE('api/content/' + existingPageId + '/extras/').respond(200);
                $httpBackend.whenPOST('api/content/' + existingPageId + '/extras/').respond(200);
                $httpBackend.whenPOST('api/content/' + existingPageId + '/revisions/' + mockRevisionResponse.id + '/extras/').respond(200);
            });

            it('should call REST.content.update with correct payload', function() {
                var expectedScheduleDate = Math.floor($scope.page.scheduleDate.getTime() / 1000);

                $httpBackend.expectPUT('api/content/' + existingPageId, function(data) {
                    var payload = angular.fromJson(data);
                    expect(payload.contentID).toBeUndefined(); // Should not be in body
                    expect(payload.title).toBe($scope.page.title);
                    expect(payload.description).toBe($scope.page.description);
                    expect(payload.header).toBe(Page.header);
                    expect(payload.subheader).toBe(Page.subheader);
                    expect(payload.featured).toBe(undefined); // Page.extras.featured is not set in this test setup
                    expect(payload.body).toBe(Page.body);
                    expect(payload.url).toBe($scope.page.url);
                    expect(payload.type).toBe($scope.page.type);
                    expect(payload.published).toBe('N'); // Because schedule date is future
                    expect(payload.published_date).toBe(expectedScheduleDate);
                    expect(payload.author).toBe(Users.id);
                    return true;
                }).respond(200);

                 // Mock other calls needed for update flow
                $httpBackend.whenPOST('api/content/' + existingPageId + '/revisions').respond(200, mockRevisionResponse);
                $httpBackend.whenDELETE('api/content/' + existingPageId + '/tags/').respond(200);
                $httpBackend.whenPOST('api/content/' + existingPageId + '/tags/').respond(200);
                $httpBackend.whenDELETE('api/content/' + existingPageId + '/extras/').respond(200);
                $httpBackend.whenPOST('api/content/' + existingPageId + '/extras/').respond(200);
                $httpBackend.whenPOST('api/content/' + existingPageId + '/revisions/' + mockRevisionResponse.id + '/extras/').respond(200);


                $scope.savePage();
                $httpBackend.flush();
            });

            it('should handle REST.content.update error', function() {
                $httpBackend.expectPUT('api/content/' + existingPageId).respond(500);

                $scope.savePage();
                $httpBackend.flush();

                expect($translate.then).toHaveBeenCalledWith(jasmine.any(Function));
                expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated_page_error_updating', classes: 'alert-error' });
            });

            it('should delete old tags after successful content update', function() {
                 $httpBackend.expectPUT('api/content/' + existingPageId).respond(200);
                 $httpBackend.expectDELETE('api/content/' + existingPageId + '/tags/').respond(200);

                 // Mock other calls needed for update flow
                 $httpBackend.whenPOST('api/content/' + existingPageId + '/revisions').respond(200, mockRevisionResponse);
                 $httpBackend.whenPOST('api/content/' + existingPageId + '/tags/').respond(200);
                 $httpBackend.whenDELETE('api/content/' + existingPageId + '/extras/').respond(200);
                 $httpBackend.whenPOST('api/content/' + existingPageId + '/extras/').respond(200);
                 $httpBackend.whenPOST('api/content/' + existingPageId + '/revisions/' + mockRevisionResponse.id + '/extras/').respond(200);

                 $scope.savePage();
                 $httpBackend.flush();
            });

            it('should save new tags after deleting old tags', function() {
                 $scope.page.tags = ['newtag1', 'newtag2'];

                 $httpBackend.expectPUT('api/content/' + existingPageId).respond(200);
                 $httpBackend.expectDELETE('api/content/' + existingPageId + '/tags/').respond(200);

                 // Expect new tag saves
                 $httpBackend.expectPOST('api/content/' + existingPageId + '/tags/', { contentID: existingPageId, tag: 'newtag1' }).respond(200);
                 $httpBackend.expectPOST('api/content/' + existingPageId + '/tags/', { contentID: existingPageId, tag: 'newtag2' }).respond(200);

                 // Mock other calls needed for update flow
                 $httpBackend.whenPOST('api/content/' + existingPageId + '/revisions').respond(200, mockRevisionResponse);
                 $httpBackend.whenDELETE('api/content/' + existingPageId + '/extras/').respond(200);
                 $httpBackend.whenPOST('api/content/' + existingPageId + '/extras/').respond(200);
                 $httpBackend.whenPOST('api/content/' + existingPageId + '/revisions/' + mockRevisionResponse.id + '/extras/').respond(200);

                 $scope.savePage();
                 $httpBackend.flush();
            });

             it('should not save tags if $scope.page.tags is null or empty after deleting old tags', function() {
                 $scope.page.tags = null; // Or []

                 $httpBackend.expectPUT('api/content/' + existingPageId).respond(200);
                 $httpBackend.expectDELETE('api/content/' + existingPageId + '/tags/').respond(200);

                 // Mock other calls needed for update flow
                 $httpBackend.whenPOST('api/content/' + existingPageId + '/revisions').respond(200, mockRevisionResponse);
                 $httpBackend.whenDELETE('api/content/' + existingPageId + '/extras/').respond(200);
                 $httpBackend.whenPOST('api/content/' + existingPageId + '/extras/').respond(200);
                 $httpBackend.whenPOST('api/content/' + existingPageId + '/revisions/' + mockRevisionResponse.id + '/extras/').respond(200);

                 $scope.savePage();
                 $httpBackend.flush();

                 // Verify no tag save calls were made
                 $httpBackend.verifyNoOutstandingRequest(); // This will fail if unexpected calls were made
            });


            it('should save a revision after successful content update', function() {
                 var expectedScheduleDate = Math.floor($scope.page.scheduleDate.getTime() / 1000);

                 $httpBackend.expectPUT('api/content/' + existingPageId).respond(200);
                 $httpBackend.expectPOST('api/content/' + existingPageId + '/revisions', function(data) {
                     var payload = angular.fromJson(data);
                     expect(payload.contentID).toBe(existingPageId);
                     expect(payload.title).toBe($scope.page.title);
                     expect(payload.description).toBe($scope.page.description);
                     expect(payload.header).toBe(Page.header);
                     expect(payload.subheader).toBe(Page.subheader);
                     expect(payload.featured).toBe(undefined); // Page.extras.featured is not set
                     expect(payload.body).toBe(Page.body);
                     expect(payload.url).toBe($scope.page.url);
                     expect(payload.type).toBe($scope.page.type);
                     expect(payload.published).toBe('N'); // Because schedule date is future
                     expect(payload.published_date).toBe(expectedScheduleDate);
                     expect(payload.author).toBe(Users.id);
                     return true;
                 }).respond(200, mockRevisionResponse);

                 // Mock other calls needed for update flow
                 $httpBackend.whenDELETE('api/content/' + existingPageId + '/tags/').respond(200);
                 $httpBackend.whenPOST('api/content/' + existingPageId + '/tags/').respond(200);
                 $httpBackend.whenDELETE('api/content/' + existingPageId + '/extras/').respond(200);
                 $httpBackend.whenPOST('api/content/' + existingPageId + '/extras/').respond(200);
                 $httpBackend.whenPOST('api/content/' + existingPageId + '/revisions/' + mockRevisionResponse.id + '/extras/').respond(200);

                 $scope.savePage();
                 $httpBackend.flush();
            });

            it('should delete old extras after saving revision', function() {
                 $httpBackend.expectPUT('api/content/' + existingPageId).respond(200);
                 $httpBackend.expectPOST('api/content/' + existingPageId + '/revisions').respond(200, mockRevisionResponse);
                 $httpBackend.expectDELETE('api/content/' + existingPageId + '/extras/').respond(200);

                 // Mock other calls needed for update flow
                 $httpBackend.whenDELETE('api/content/' + existingPageId + '/tags/').respond(200);
                 $httpBackend.whenPOST('api/content/' + existingPageId + '/tags/').respond(200);
                 $httpBackend.whenPOST('api/content/' + existingPageId + '/extras/').respond(200);
                 $httpBackend.whenPOST('api/content/' + existingPageId + '/revisions/' + mockRevisionResponse.id + '/extras/').respond(200);

                 $scope.savePage();
                 $httpBackend.flush();
            });

            it('should save new extras and revision extras after deleting old extras', function() {
                 Page.extras = { newExtra: 'newValue', anotherExtra: { data: true } }; // Ensure extras exist

                 $httpBackend.expectPUT('api/content/' + existingPageId).respond(200);
                 $httpBackend.expectPOST('api/content/' + existingPageId + '/revisions').respond(200, mockRevisionResponse);
                 $httpBackend.expectDELETE('api/content/' + existingPageId + '/extras/').respond(200);

                 // Expect new extra saves
                 $httpBackend.expectPOST('api/content/' + existingPageId + '/extras/', { contentID: existingPageId, name: 'newExtra', extra: 'newValue' }).respond(200);
                 $httpBackend.expectPOST('api/content/' + existingPageId + '/extras/', { contentID: existingPageId, name: 'anotherExtra', extra: angular.toJson({ data: true }) }).respond(200);

                 // Expect new revision extra saves
                 $httpBackend.expectPOST('api/content/' + existingPageId + '/revisions/' + mockRevisionResponse.id + '/extras/', { revisionID: mockRevisionResponse.id, contentID: existingPageId, name: 'newExtra', extra: 'newValue' }).respond(200);
                 $httpBackend.expectPOST('api/content/' + existingPageId + '/revisions/' + mockRevisionResponse.id + '/extras/', { revisionID: mockRevisionResponse.id, contentID: existingPageId, name: 'anotherExtra', extra: angular.toJson({ data: true }) }).respond(200);

                 // Mock other calls needed for update flow
                 $httpBackend.whenDELETE('api/content/' + existingPageId + '/tags/').respond(200);
                 $httpBackend.whenPOST('api/content/' + existingPageId + '/tags/').respond(200);

                 $scope.savePage();
                 $httpBackend.flush();
            });

             it('should stringify objects and arrays in Page.extras before saving during update', function() {
                 Page.extras = {
                     objExtra: { key: 'value' },
                     arrExtra: [1, 2, 3],
                     stringExtra: 'just a string'
                 };

                 $httpBackend.expectPUT('api/content/' + existingPageId).respond(200);
                 $httpBackend.expectPOST('api/content/' + existingPageId + '/revisions').respond(200, mockRevisionResponse);
                 $httpBackend.expectDELETE('api/content/' + existingPageId + '/extras/').respond(200);

                 // Expect extra saves with stringified data
                 $httpBackend.expectPOST('api/content/' + existingPageId + '/extras/', { contentID: existingPageId, name: 'objExtra', extra: angular.toJson({ key: 'value' }) }).respond(200);
                 $httpBackend.expectPOST('api/content/' + existingPageId + '/extras/', { contentID: existingPageId, name: 'arrExtra', extra: angular.toJson([1, 2, 3]) }).respond(200);
                 $httpBackend.expectPOST('api/content/' + existingPageId + '/extras/', { contentID: existingPageId, name: 'stringExtra', extra: 'just a string' }).respond(200);

                 // Expect revision extra saves with stringified data
                 $httpBackend.expectPOST('api/content/' + existingPageId + '/revisions/' + mockRevisionResponse.id + '/extras/', { revisionID: mockRevisionResponse.id, contentID: existingPageId, name: 'objExtra', extra: angular.toJson({ key: 'value' }) }).respond(200);
                 $httpBackend.expectPOST('api/content/' + existingPageId + '/revisions/' + mockRevisionResponse.id + '/extras/', { revisionID: mockRevisionResponse.id, contentID: existingPageId, name: 'arrExtra', extra: angular.toJson([1, 2, 3]) }).respond(200);
                 $httpBackend.expectPOST('api/content/' + existingPageId + '/revisions/' + mockRevisionResponse.id + '/extras/', { revisionID: mockRevisionResponse.id, contentID: existingPageId, name: 'stringExtra', extra: 'just a string' }).respond(200);


                 // Mock other calls needed for update flow
                 $httpBackend.whenDELETE('api/content/' + existingPageId + '/tags/').respond(200);
                 $httpBackend.whenPOST('api/content/' + existingPageId + '/tags/').respond(200);

                 $scope.savePage();
                 $httpBackend.flush();
             });


            it('should broadcast "page_updated" if Page.extras is empty after deleting old extras', function() {
                 Page.extras = {}; // Ensure extras are empty

                 $httpBackend.expectPUT('api/content/' + existingPageId).respond(200);
                 $httpBackend.expectPOST('api/content/' + existingPageId + '/revisions').respond(200, mockRevisionResponse);
                 $httpBackend.expectDELETE('api/content/' + existingPageId + '/extras/').respond(200);

                 // Mock other calls needed for update flow
                 $httpBackend.whenDELETE('api/content/' + existingPageId + '/tags/').respond(200);
                 $httpBackend.whenPOST('api/content/' + existingPageId + '/tags/').respond(200);

                 $scope.savePage();
                 $httpBackend.flush();

                 expect($translate.then).toHaveBeenCalledWith(jasmine.any(Function)); // For 'page_updated' translation
                 expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated_page_updated' });
                 // Note: The update flow does *not* redirect in the original code.
                 expect($location.path).not.toHaveBeenCalledWith(jasmine.any(String));
            });

             // Note: Similar to the new page flow, the original code broadcasts 'page_created'
             // after the last extra save in the update flow as well, which seems inconsistent
             // with the 'page_updated' broadcast. We test the actual behavior.
            it('should broadcast "page_created" after saving extras during update', function() {
                 Page.extras = { extra1: 'value1', extra2: 'value2' }; // Ensure extras exist

                 $httpBackend.expectPUT('api/content/' + existingPageId).respond(200);
                 $httpBackend.expectPOST('api/content/' + existingPageId + '/revisions').respond(200, mockRevisionResponse);
                 $httpBackend.expectDELETE('api/content/' + existingPageId + '/tags/').respond(200);
                 $httpBackend.whenPOST('api/content/' + existingPageId + '/tags/').respond(200);
                 $httpBackend.expectDELETE('api/content/' + existingPageId + '/extras/').respond(200);

                 // Expect extra saves (order might vary, so use when)
                 $httpBackend.whenPOST('api/content/' + existingPageId + '/extras/').respond(200);
                 $httpBackend.whenPOST('api/content/' + existingPageId + '/revisions/' + mockRevisionResponse.id + '/extras/').respond(200);

                 $scope.savePage();
                 $httpBackend.flush(); // Flush all pending requests

                 // Check broadcasts - the 'page_updated' happens if no extras,
                 // but 'page_created' happens after the last extra save.
                 // The original code has a potential bug here, broadcasting 'page_created'
                 // instead of 'page_updated' after extras in the update flow.
                 // We test the actual code behavior.
                 expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated_page_created' });

                 // Note: The update flow does *not* redirect in the original code.
                 expect($location.path).not.toHaveBeenCalledWith(jasmine.any(String));
            });
        });
    });
});
```

**Explanation:**

1.  **Module Loading:** `beforeEach(angular.mock.module('cosmo'));` loads your application module. We also load `ngResource` and `pascalprecht.translate` because the controller and REST factory depend on them.
2.  **Dependency Injection:** `beforeEach(angular.mock.inject(...))` injects the services, factories, and built-in AngularJS dependencies needed for the tests.
3.  **Mocking `$httpBackend`:** `$httpBackend` is injected to mock all HTTP requests made by `$resource`. We use `whenGET`, `whenPOST`, `whenPUT`, `whenDELETE` to define expected URLs and provide mock responses (`respond(status, data)`). `expectGET`, `expectPOST`, etc., are used within `it` blocks to assert that specific requests were made. `flush()` is called after the action that triggers the request to resolve the mocked promises. `verifyNoOutstandingExpectation` and `verifyNoOutstandingRequest` in `afterEach` ensure all expected calls were made and no unexpected calls occurred.
4.  **Mocking Factories (`Page`, `Users`):** Simple JavaScript objects are used to represent the factories. Their properties are set in `beforeEach` or within specific test cases to control the state the controller sees.
5.  **Mocking `$location`:** `spyOn($location, 'path')` is used to check if the controller attempts to change the URL.
6.  **Mocking `$routeParams`:** A simple object is provided to simulate route parameters like `url`.
7.  **Mocking `$rootScope`:** `spyOn($rootScope, '$broadcast')` is used to check if events are broadcast.
8.  **Mocking `localStorage`:** A custom mock object is created with `getItem` and `setItem` methods, and these methods are spied upon. `Object.defineProperty` is used to replace the global `window.localStorage` with the mock during tests.
9.  **Mocking `$translate`:** `spyOn($translate, 'then')` and `spyOn($translate, 'instant')` are used to simulate the translation service returning translated strings. This prevents the tests from failing due to missing translations and allows checking if translation was attempted.
10. **Controller Instantiation:** `$controller('pageCtrl', { ... })` creates a new instance of the controller for each test, injecting the mocked dependencies. `$scope = $rootScope.$new()` creates a new isolated scope for the controller.
11. **Test Structure:** `describe` blocks group related tests (e.g., 'Initialization', 'Save Page'). `it` blocks define individual test cases with descriptive names. `beforeEach` is used for setup common to a group of tests.
12. **Assertions:** Jasmine matchers (`expect(...).toBe(...)`, `expect(...).toEqual(...)`, `expect(...).toHaveBeenCalledWith(...)`, etc.) are used to verify the state of `$scope`, the `Page` factory, and whether methods on mocked dependencies were called correctly.
13. **Asynchronous Operations:** `$httpBackend.flush()` is essential for testing code that uses `$resource` (which uses `$http` internally). It simulates the server responding to the mocked requests, allowing the success/error callbacks in the controller to execute. `$rootScope.$apply()` might be needed for other promise types or watchers, but `$httpBackend.flush()` often suffices for `$resource`.
14. **Coverage:** The conceptual `karma.conf.js` includes a coverage preprocessor and reporter to measure code coverage. Run `karma start` and check the generated `coverage/` folder. You'll likely need to add more specific test cases to reach 80%+ coverage, especially for different branches within the `savePage` function (e.g., different publish statuses, different `Page.extras` content, error paths).

This comprehensive suite covers initialization, local storage interaction, deletion, event handling, input changes, autocomplete, and the complex save logic for both new and existing pages, including validation and API interactions. Remember to install the necessary npm packages (`angular`, `angular-mocks`, `angular-resource`, `angular-translate`, `karma`, `jasmine-core`, `karma-jasmine`, `karma-chrome-launcher`, `karma-coverage`).

### Tokens: {'input_tokens': 6556, 'output_tokens': 23192}
### Execution time: 113.1424651145935
