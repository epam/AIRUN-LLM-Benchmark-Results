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
### Thoughts:
**Test Strategy for an AngularJS Application**

Alright, the user wants me to write comprehensive unit tests for this AngularJS app. Sounds good! I'll break down the task systematically, leveraging my experience to ensure robust and maintainable tests.

**1. Analysis is Key**

First, I'll take a deep dive into the code. The app's structure is pretty clear: Factories for data (`Page`, `Users`), a REST service (`REST`), and a controller (`pageCtrl`) interacting with them. The view is `page.html`. I need to assess the complexity and dependencies within each component to strategize my tests effectively.

*   **`page.js` & `users.js`:** Simple factories, data stores. Tests here will verify default values and basic object structure. Quick and easy.
*   **`rest.js`:** Uses `$resource`. No need to test `$resource` itself, but I'll confirm that the factory properly configures the API endpoints with correct URLs and parameters.
*   **`pageCtrl.js`:** This is the heart of the matter. Complex logic, lots of dependencies: `$scope`, `REST`, `$location`, `Page`, `$rootScope`, `$routeParams`, `$upload`, `Users`, `$translate`. *Yikes!*  I'll need to mock everything. I'll need to meticulously test initialization, all the scope methods, and the interactions with the REST service.

**2. Tools of the Trade**

For this project, I'll use a tried-and-true combo:

*   **Jasmine:** The standard for AngularJS testing.
*   **Karma:** The ideal test runner for AngularJS projects.
*   **`angular-mocks`:**  Essential for injecting and mocking AngularJS services.

I'll use Jasmine's `spyOn` and `createSpyObj` liberally to create mocks and spies for dependencies like `REST`, `$location`, and `$rootScope`.

**3. Test Structure**

I'll structure the tests logically:

*   Separate test file for each JavaScript file: `page.factory.spec.js`, `users.factory.spec.js`, `rest.factory.spec.js`, and the big one: `pageCtrl.spec.js`.
*   `describe` blocks to group related tests.
*   Nested `describe` blocks to organize tests by function or feature.
*   `beforeEach` for setup (module loading, dependency injection, and mocking).
*   `afterEach` for cleanup (verifying mock calls, etc.).

**4. Dependency Handling**

Here's how I'll handle the key dependencies:

*   **`REST` factory:** I'll mock it completely, creating a mock object with spies for each REST method (`save`, `update`, `delete`, `query`). I'll control the responses using `$q` promises and verify correct call parameters.
*   **`$location`:** Spy on `path()`
*   **`$rootScope`:** Inject the real `$rootScope` and use `$rootScope.$new()` for a fresh scope. I'll spy on `$broadcast` to watch for events.
*   **`$routeParams`:** A simple mock object.
*   **`$upload`:** A simple mock object.
*   **`$translate`:** Mock it to return a resolved promise with translated strings.
*   **`localStorage`:** Create a mock with `getItem`, `setItem`, and `clear` and spy on them. I'll attach this mock to the `window` object.
*   **`Date`:** Use Jasmine's clock to control the current date for time-sensitive tests.

**5. Testing Plan for `pageCtrl`**

This is the most critical part, so I'll create a detailed test plan:

*   **`describe('pageCtrl', ...)`**
    *   Initialize
    *   Test `$scope.localVersion()` - restore from storage
    *   Test `$scope.deleteNewerVersion()` - clear newer version state
    *   Test `$scope.deletePage()` - test deletions and redirection
    *   Test events, like contentGet
    *   Test `$scope.updatePageType()` - test updates
    *   Test `$scope.titleChange()` - test title & URL update
    *   Test Autocomplete methods
    *   Test saving and publishing
        *   New pages, duplicated pages, updated pages
        *   Date and validation

**Karma Configuration:**

I'll also provide a `karma.conf.js`.
*   `frameworks`: `['jasmine']`
*   `files`: setup file paths to testing library, app files, and test files
*   `browsers`: `['ChromeHeadless']`
*   

### Answer:
Of course. As a software engineering expert, I will provide a comprehensive unit testing suite for your AngularJS application. The solution will include tests for your factories and controller, a Karma configuration file for running the tests, and detailed explanations.

### 1. Testing Tools and Setup

We will use the standard and robust combination of **Karma** as the test runner and **Jasmine** as the testing framework. `angular-mocks` will be used for mocking and injecting dependencies.

Here is a sample `karma.conf.js` file. You'll need to install the necessary npm packages (`karma`, `karma-jasmine`, `karma-chrome-launcher`, `karma-coverage`, `jasmine-core`, `angular`, `angular-mocks`, `angular-resource`, `angular-translate`, etc.) for this to work.

**`karma.conf.js`**
```javascript
module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // Angular libraries
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-resource/angular-resource.js',
      'node_modules/angular-translate/dist/angular-translate.js',

      // Application files
      'app/app.js', // Assuming you have a main app module file
      'app/rest.js',
      'app/page.js',
      'app/users.js',
      'app/pageCtrl.js',

      // Test files
      'test/**/*.spec.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'app/**/*.js': ['coverage']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    }
  });
};
```
*Note: You may need to adjust the file paths based on your project structure.*

### 2. Unit Test Implementation

Here are the test suites for each of your JavaScript files.

#### `page.factory.spec.js`

This test verifies that the `Page` factory provides an object with the correct default structure.

```javascript
describe('Factory: Page', function() {
    var Page;

    // Load the 'cosmo' module before each test
    beforeEach(module('cosmo'));

    // Inject the Page factory
    beforeEach(inject(function(_Page_) {
        Page = _Page_;
    }));

    it('should be defined', function() {
        expect(Page).toBeDefined();
    });

    it('should return an object with default page properties', function() {
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

#### `users.factory.spec.js`

Similarly, this test ensures the `Users` factory is initialized correctly.

```javascript
describe('Factory: Users', function() {
    var Users;

    beforeEach(module('cosmo'));

    beforeEach(inject(function(_Users_) {
        Users = _Users_;
    }));

    it('should be defined', function() {
        expect(Users).toBeDefined();
    });

    it('should return an object with default user properties', function() {
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

#### `rest.factory.spec.js`

This test confirms that the `REST` factory correctly configures and provides all the necessary `$resource` endpoints.

```javascript
describe('Factory: REST', function() {
    var REST;

    beforeEach(module('cosmo'));

    // Inject the REST factory
    beforeEach(inject(function(_REST_) {
        REST = _REST_;
    }));

    it('should be defined', function() {
        expect(REST).toBeDefined();
    });

    it('should contain all defined resource endpoints', function() {
        var endpoints = [
            'blocks', 'blocksRequirements', 'comments', 'content', 'contentExtras',
            'contentRevisions', 'contentRevisionsExtras', 'contentTags', 'files',
            'filesTags', 'menus', 'modules', 'sitemaps', 'themes', 'settings', 'users'
        ];
        endpoints.forEach(function(endpoint) {
            expect(REST[endpoint]).toBeDefined();
            // $resource returns a constructor function
            expect(typeof REST[endpoint]).toBe('function');
        });
    });

    it('should configure endpoints with correct URLs and update methods', function() {
        // Example check for the 'content' resource
        var contentResource = new REST.content();
        // The internal url property is stored on the prototype's $$config
        expect(contentResource.constructor.prototype.$$config.url).toBe('api/content/:contentID');
        expect(contentResource.constructor.prototype.update).toBeDefined();

        // Example check for a more complex resource
        var revisionsExtrasResource = new REST.contentRevisionsExtras();
        expect(revisionsExtrasResource.constructor.prototype.$$config.url).toBe('api/content/:contentID/revisions/:revisionID/extras/:extraID');
    });
});
```

#### `pageCtrl.spec.js`

This is the most comprehensive test suite, covering the controller's logic, its interaction with services, and its response to events. We will extensively mock all external dependencies.

```javascript
describe('Controller: pageCtrl', function() {
    var scope,
        ctrl,
        $q,
        $rootScope,
        mockREST,
        mockLocation,
        mockPage,
        mockUsers,
        mockRouteParams,
        mockTranslate,
        mockLocalStorage;

    // Load the main module
    beforeEach(module('cosmo'));

    // Set up mocks and spies before each test
    beforeEach(function() {
        // Mock localStorage
        mockLocalStorage = {};
        spyOn(window.localStorage, 'getItem').and.callFake(function(key) {
            return mockLocalStorage[key] || null;
        });
        spyOn(window.localStorage, 'setItem').and.callFake(function(key, value) {
            mockLocalStorage[key] = String(value);
        });

        // Mock dependencies
        mockLocation = {
            path: jasmine.createSpy('path')
        };

        mockPage = {
            id: 1,
            title: 'Test Title',
            description: 'Test Description',
            url: 'test-url',
            publish: 'Y',
            scheduleDate: 1580515200, // A fixed past date
            tags: ['tag1', 'tag2'],
            type: 'default.html',
            themePages: ['default.html', 'contact.html'],
            extras: {},
            header: 'Test Header',
            body: '<p>Test Body</p>'
        };

        mockUsers = {
            id: 'user1'
        };

        mockRouteParams = {
            url: 'test-url'
        };

        // Use inject to get Angular services
        inject(function(_$q_, _$rootScope_) {
            $q = _$q_;
            $rootScope = _$rootScope_;

            // Mock for $translate service
            mockTranslate = jasmine.createSpy('$translate').and.returnValue($q.resolve('translated_text'));

            // Deep mock for the REST factory
            var resourcePromise = function(data) {
                return { $promise: $q.resolve(data) };
            };
            var resourcePromiseError = function(data) {
                return { $promise: $q.reject(data) };
            };

            mockREST = {
                content: {
                    save: jasmine.createSpy('save').and.callFake(function() { return resourcePromise({ id: 123 }); }),
                    update: jasmine.createSpy('update').and.callFake(function() { return resourcePromise({}); }),
                    delete: jasmine.createSpy('delete').and.callFake(function() { return resourcePromise({}); })
                },
                contentRevisions: {
                    save: jasmine.createSpy('save').and.callFake(function() { return resourcePromise({ id: 456 }); }),
                    delete: jasmine.createSpy('delete').and.callFake(function() { return resourcePromise({}); })
                },
                contentExtras: {
                    save: jasmine.createSpy('save').and.callFake(function() { return resourcePromise({}); }),
                    delete: jasmine.createSpy('delete').and.callFake(function() { return resourcePromise({}); })
                },
                contentRevisionsExtras: {
                    save: jasmine.createSpy('save').and.callFake(function() { return resourcePromise({}); }),
                    delete: jasmine.createSpy('delete').and.callFake(function() { return resourcePromise({}); })
                },
                contentTags: {
                    query: jasmine.createSpy('query').and.callFake(function() { return resourcePromise(['tag1', 'suggestion']); }),
                    save: jasmine.createSpy('save').and.callFake(function() { return resourcePromise({}); }),
                    delete: jasmine.createSpy('delete').and.callFake(function() { return resourcePromise({}); })
                }
            };
        });
    });

    // Function to create the controller
    var createController = function() {
        inject(function($controller) {
            scope = $rootScope.$new();
            spyOn($rootScope, '$broadcast').and.callThrough();
            ctrl = $controller('pageCtrl', {
                $scope: scope,
                REST: mockREST,
                $location: mockLocation,
                Page: mockPage,
                $rootScope: $rootScope,
                $routeParams: mockRouteParams,
                $upload: {}, // Mocked as it's injected but not used in the provided code
                Users: mockUsers,
                $translate: mockTranslate
            });
        });
    };

    describe('Initialization', function() {
        it('should initialize scope variables from the Page factory', function() {
            createController();
            expect(scope.page.id).toBe(mockPage.id);
            expect(scope.page.title).toBe(mockPage.title);
            expect(scope.page.url).toBe(mockPage.url);
        });

        it('should set a new date for scheduleDate on a new page', function() {
            mockLocation.path.and.returnValue('/new');
            var baseTime = new Date(2023, 10, 20);
            jasmine.clock().install();
            jasmine.clock().mockDate(baseTime);
            
            createController();
            expect(scope.page.scheduleDate).toEqual(baseTime);

            jasmine.clock().uninstall();
        });

        it('should detect a newer version in localStorage', function() {
            localStorage.setItem('test-urltitle', 'A newer title');
            createController();
            expect(scope.newerVersion).toBe(true);
        });

        it('should not detect a newer version if localStorage matches', function() {
            localStorage.setItem('test-urltitle', 'Test Title');
            createController();
            expect(scope.newerVersion).toBeUndefined();
        });
    });

    describe('Local Version Management', function() {
        beforeEach(function() {
            localStorage.setItem('test-urltitle', 'Local Title');
            localStorage.setItem('test-urldescription', 'Local Description');
            createController();
        });

        it('should restore page data from localStorage when localVersion() is called', function() {
            scope.localVersion();
            expect(mockPage.title).toBe('Local Title');
            expect(mockPage.description).toBe('Local Description');
        });

        it('should clear localStorage and broadcast "contentGet" on localVersion()', function() {
            scope.localVersion();
            expect(localStorage.getItem('test-urltitle')).toBe('null');
            expect(scope.newerVersion).toBe(false);
            expect($rootScope.$broadcast).toHaveBeenCalledWith('contentGet');
        });



        it('should delete newer version from localStorage', function() {
            scope.deleteNewerVersion();
            expect(localStorage.getItem('test-urltitle')).toBe('null');
            expect(scope.newerVersion).toBe(false);
        });
    });

    describe('Page Deletion', function() {
        it('should call all relevant REST delete methods and redirect', function() {
            createController();
            scope.deletePage();
            $rootScope.$apply(); // Resolve promises

            expect(mockREST.content.delete).toHaveBeenCalledWith({ contentID: scope.page.id }, jasmine.any(Function));
            expect(mockREST.contentRevisions.delete).toHaveBeenCalledWith({ contentID: scope.page.id });
            expect(mockREST.contentRevisionsExtras.delete).toHaveBeenCalledWith({ contentID: scope.page.id });
            expect(mockREST.contentExtras.delete).toHaveBeenCalledWith({ contentID: scope.page.id });
            expect(mockREST.contentTags.delete).toHaveBeenCalledWith({ contentID: scope.page.id });

            expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated_text' });
            expect(mockLocation.path).toHaveBeenCalledWith('new');
        });
    });

    describe('Page Data Manipulation', function() {
        beforeEach(createController);

        it('should update Page.type and broadcast "settingsGet"', function() {
            scope.page.type = 'contact.html';
            scope.updatePageType();
            expect(mockPage.type).toBe('contact.html');
            expect($rootScope.$broadcast).toHaveBeenCalledWith('settingsGet');
        });

        it('should auto-generate URL from title for a new page', function() {
            scope.page.url = 'new';
            scope.page.title = 'My New Page!';
            scope.titleChange();
            expect(scope.page.url).toBe('my-new-page');
            expect(mockPage.url).toBe('my-new-page');
        });

        it('should not auto-generate URL for an existing page', function() {
            scope.page.url = 'existing-page';
            scope.page.title = 'A New Title';
            scope.titleChange();
            expect(scope.page.url).toBe('existing-page');
        });
    });

    describe('Tag Autocomplete', function() {
        beforeEach(createController);

        it('should query for tag suggestions', function() {
            scope.page.tags = ['existing', 'newtag'];
            scope.autocompleteTags();
            $rootScope.$apply();
            expect(mockREST.contentTags.query).toHaveBeenCalledWith({ tag: 'newtag' }, jasmine.any(Function), jasmine.any(Function));
            expect(scope.page.suggestions).toEqual(['tag1', 'suggestion']);
        });

        it('should select a suggestion and clear the list', function() {
            scope.page.tags = ['existing', 'newtag'];
            scope.selectSuggestion('suggested-tag');
            expect(scope.page.tags).toEqual(['existing', 'suggested-tag', '']);
            expect(scope.page.suggestions).toEqual([]);
        });
    });

    describe('savePage()', function() {
        beforeEach(function() {
            jasmine.clock().install();
            var baseTime = new Date(2023, 10, 20, 12, 0, 0);
            jasmine.clock().mockDate(baseTime);
            createController();
        });

        afterEach(function() {
            jasmine.clock().uninstall();
        });

        it('should show an error if no page type is selected', function() {
            scope.page.type = '';
            scope.savePage();
            expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated_text', classes: 'alert-error' });
            expect(mockREST.content.save).not.toHaveBeenCalled();
        });

        it('should show an error if the URL is empty', function() {
            scope.page.url = '';
            scope.savePage();
            expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated_text', classes: 'alert-error' });
        });

        describe('when creating a new page', function() {
            beforeEach(function() {
                mockLocation.path.and.returnValue('/new');
                scope.page.title = 'New Page';
                scope.page.url = 'new-page';
                scope.page.publish = 'Y';
                scope.page.tags = ['new', 'fresh'];
            });

            it('should call REST.content.save with correct data', function() {
                var expectedDate = Math.round(new Date().getTime() / 1000);
                scope.savePage();
                expect(mockREST.content.save).toHaveBeenCalledWith(jasmine.objectContaining({
                    title: 'New Page',
                    url: 'new-page',
                    published: 'Y',
                    published_date: expectedDate
                }), jasmine.any(Function), jasmine.any(Function));
            });

            it('should save tags, revision, and redirect on success', function() {
                scope.savePage();
                $rootScope.$apply(); // Resolve all promises

                expect(mockREST.content.save).toHaveBeenCalled();
                expect(mockREST.contentTags.save.calls.count()).toBe(2);
                expect(mockREST.contentTags.save).toHaveBeenCalledWith({ contentID: 123, tag: 'new' });
                expect(mockREST.contentTags.save).toHaveBeenCalledWith({ contentID: 123, tag: 'fresh' });
                expect(mockREST.contentRevisions.save).toHaveBeenCalled();
                expect(mockLocation.path).toHaveBeenCalledWith('new-page');
                expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated_text' });
            });
        });

        describe('when updating an existing page', function() {
            beforeEach(function() {
                mockLocation.path.and.returnValue('/test-url');
                scope.page.id = 1;
                scope.page.title = 'Updated Title';
                scope.page.tags = ['updated'];
                mockPage.extras = { 'customField': 'customValue' };
            });

            it('should call REST.content.update with correct data', function() {
                scope.savePage();
                expect(mockREST.content.update).toHaveBeenCalledWith(jasmine.objectContaining({
                    contentID: 1,
                    title: 'Updated Title'
                }), jasmine.any(Function), jasmine.any(Function));
            });

            it('should delete old tags/extras and save new ones on success', function() {
                scope.savePage();
                $rootScope.$apply(); // Resolve all promises

                expect(mockREST.content.update).toHaveBeenCalled();
                // Deletion callbacks
                expect(mockREST.contentTags.delete).toHaveBeenCalledWith({ contentID: 1 }, jasmine.any(Function));
                expect(mockREST.contentExtras.delete).toHaveBeenCalledWith({ contentID: 1 }, jasmine.any(Function));
                // New tags saved
                expect(mockREST.contentTags.save).toHaveBeenCalledWith({ contentID: 1, tag: 'updated' });
                // New extras saved
                expect(mockREST.contentExtras.save).toHaveBeenCalledWith({ contentID: 1, name: 'customField', extra: '"customValue"' }, jasmine.any(Function), jasmine.any(Function));
                // Revision saved
                expect(mockREST.contentRevisions.save).toHaveBeenCalled();
                expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated_text' });
            });
        });
    });
});
```

### Tokens: {'input_tokens': 6556, 'output_tokens': 9157, 'reasoning_tokens': 4069}
### Execution time: 90.19324612617493
