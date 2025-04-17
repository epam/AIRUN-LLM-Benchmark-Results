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
Below is an example of a full Jasmine + Karma–based test suite that exercises your REST factory, your Page/Users factories, and the pageCtrl controller. It uses angular‑mocks to stub $httpBackend, $translate, localStorage, etc., and covers both happy and error paths. Feel free to adapt paths and versions to match your project’s structure.

———————  
package.json  
———————  
```json
{
  "name": "cosmo-app",
  "version": "1.0.0",
  "scripts": {
    "test": "karma start --single-run"
  },
  "devDependencies": {
    "angular": "1.5.8",
    "angular-mocks": "1.5.8",
    "angular-resource": "1.5.8",
    "angular-route": "1.5.8",
    "angular-translate": "2.15.2",
    "jasmine-core": "^3.5.0",
    "karma": "^4.0.0",
    "karma-chrome-launcher": "^2.2.0",
    "karma-jasmine": "^2.0.1",
    "karma-coverage": "^2.0.1"
  }
}
```

———————  
karma.conf.js  
———————  
```js
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      // Angular & libs
      'node_modules/angular/angular.js',
      'node_modules/angular-resource/angular-resource.js',
      'node_modules/angular-route/angular-route.js',
      'node_modules/angular-translate/dist/angular-translate.js',
      'node_modules/angular-mocks/angular-mocks.js',

      // Your app source
      'src/**/*.js',

      // Your tests
      'test/**/*.spec.js'
    ],
    preprocessors: {
      'src/**/*.js': ['coverage']
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },
    browsers: ['ChromeHeadless']
  });
};
```

———————  
test/rest.factory.spec.js  
———————  
```js
describe('REST Factory', function() {
  var REST, $httpBackend;

  beforeEach(module('cosmo'));
  beforeEach(inject(function(_REST_, _$httpBackend_) {
    REST = _REST_;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function() {
    // verify we flushed all requests
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  }));

  it('should define blocks resource and GET a block by ID', function() {
    var mock = { id: 5, name: 'Block 5' };
    $httpBackend.expectGET('api/blocks/5').respond(200, mock);

    var result;
    REST.blocks.get({ blockID: 5 }, function(data) {
      result = data;
    });
    $httpBackend.flush();
    expect(result.id).toBe(5);
    expect(result.name).toBe('Block 5');
  });

  it('should PUT to update a block', function() {
    $httpBackend.expectPUT('api/blocks/42', { id:42, foo:'bar' }).respond(200);
    REST.blocks.update({ blockID: 42 }, { id:42, foo:'bar' });
    $httpBackend.flush();
  });

  it('should define contentTags resource and query tags', function() {
    var tags = ['a','b'];
    $httpBackend.expectGET('api/content/7/tags/?tag=x').respond(200, tags);

    var out;
    REST.contentTags.query({ contentID:7, tag:'x' }, function(data){
      out = data;
    });
    $httpBackend.flush();
    expect(out).toEqual(tags);
  });
});
```

———————  
test/page.factory.spec.js  
———————  
```js
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
    expect(Array.isArray(Page.themePages)).toBe(true);
    expect(typeof Page.misc).toBe('object');
  });
});
```

———————  
test/users.factory.spec.js  
———————  
```js
describe('Users Factory', function() {
  var Users;
  beforeEach(module('cosmo'));
  beforeEach(inject(function(_Users_) {
    Users = _Users_;
  }));

  it('should have default empty user fields', function() {
    expect(Users.id).toBe('');
    expect(Users.username).toBe('');
    expect(Users.email).toBe('');
  });
});
```

———————  
test/page.controller.spec.js  
———————  
```js
describe('pageCtrl', function() {
  var $scope, $rootScope, $controller, $q,
      REST, Page, Users, $location, $routeParams, $translate, $upload;

  // Create a fake localStorage
  var store = {};
  beforeAll(function() {
    spyOn(window.localStorage, 'getItem').and.callFake(function(k){
      return store[k] || null;
    });
    spyOn(window.localStorage, 'setItem').and.callFake(function(k,v){
      store[k] = v;
    });
  });
  beforeEach(function(){ store = {}; });

  beforeEach(module('cosmo'));

  beforeEach(module(function($provide) {
    // Stubbed REST methods
    REST = {
      content:         { delete: jasmine.createSpy(), save: jasmine.createSpy(), update: jasmine.createSpy() },
      contentRevisions:{ delete: jasmine.createSpy(), save: jasmine.createSpy() },
      contentRevisionsExtras: { delete: jasmine.createSpy(), save: jasmine.createSpy() },
      contentExtras:   { delete: jasmine.createSpy(), save: jasmine.createSpy() },
      contentTags:     { delete: jasmine.createSpy(), save: jasmine.createSpy(), query: jasmine.createSpy() }
    };
    Page = {
      id: 0, title:'', description:'', url:'', publish:'', scheduleDate: null,
      header:'H', subheader:'SH', body:'B', type:'', themePages:['p1','p2'], tags:[], extras:{}
    };
    Users = { id: 99 };

    $location = { path: jasmine.createSpy().and.returnValue('/new') };
    $routeParams = { url: 'XYZ' };
    $upload = {};

    $provide.value('REST', REST);
    $provide.value('Page', Page);
    $provide.value('Users', Users);
    $provide.value('$location', $location);
    $provide.value('$routeParams', $routeParams);
    $provide.value('$upload', $upload);
  }));

  beforeEach(inject(function(_$rootScope_, _$controller_, _$q_) {
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $controller = _$controller_;
    $q = _$q_;

    // Fake $translate that returns promise resolved to key+"_translated"
    $translate = jasmine.createSpy('$translate').and.callFake(function(key) {
      var d = $q.defer();
      d.resolve(key + '_translated');
      return d.promise;
    });

    // override $translate
    module(function($provide){ $provide.value('$translate',$translate); });

    // instantiate controller
    $controller('pageCtrl', {
      $scope:       $scope,
      $rootScope:   $rootScope,
      REST:         REST,
      Page:         Page,
      Users:        Users,
      $location:    $location,
      $routeParams: $routeParams,
      $upload:      $upload,
      $translate:   $translate
    });
  }));

  it('should initialize $scope.page from Page and themePages', function() {
    expect($scope.page.themePages).toEqual(Page.themePages);
    // On "/new", scheduleDate should be a Date
    expect($scope.page.scheduleDate instanceof Date).toBe(true);
    // initial type: first themePage
    expect($scope.page.type).toBe('p1');
  });

  it('should detect newerVersion when localStorage has unsaved edits', function() {
    // Simulate edit page (not '/new')
    $location.path.and.returnValue('/edit');
    store['XYZ'+'title'] = 'foo';
    // re-bootstrap controller to re-run detection
    var c2 = $controller('pageCtrl', {
      $scope: $scope, $rootScope: $rootScope, REST: REST,
      Page: Page, Users: Users, $location:$location,
      $routeParams:$routeParams, $upload:$upload,
      $translate:$translate
    });
    expect($scope.newerVersion).toBe(true);
  });

  it('localVersion() should restore Page from localStorage and clear flags', function() {
    store['XYZ'+'title'] = 'bar';
    spyOn($rootScope,'$broadcast');
    $scope.newerVersion = true;
    $scope.localVersion();
    expect(Page.title).toBe('bar');
    expect(store['XYZ'+'title']).toBeNull();
    expect($scope.newerVersion).toBe(false);
    expect($rootScope.$broadcast).toHaveBeenCalledWith('contentGet');
  });

  it('deleteNewerVersion() should clear storage and flag', function() {
    store['XYZ'+'title'] = 'x'; store['XYZ'+'url']='y';
    $scope.newerVersion = true;
    $scope.deleteNewerVersion();
    expect(store['XYZ'+'title']).toBeNull();
    expect(store['XYZ'+'url']).toBeNull();
    expect($scope.newerVersion).toBe(false);
  });

  it('deletePage() should invoke REST deletes and navigate to new', function() {
    spyOn($rootScope,'$broadcast');
    $scope.page.id = 123;
    $scope.deletePage();
    expect(REST.content.delete).toHaveBeenCalledWith({contentID:123}, jasmine.any(Function));
    expect(REST.contentRevisions.delete).toHaveBeenCalledWith({contentID:123});
    expect(REST.contentRevisionsExtras.delete).toHaveBeenCalledWith({contentID:123});
    expect(REST.contentExtras.delete).toHaveBeenCalledWith({contentID:123});
    expect(REST.contentTags.delete).toHaveBeenCalledWith({contentID:123});
    expect($location.path).toHaveBeenCalledWith('new');
    // resolve the translate promise
    $rootScope.$apply();
    expect($rootScope.$broadcast).toHaveBeenCalledWith(
      'notify', { message: 'deleted_translated' }
    );
  });

  it('updatePageType() should set Page.type and broadcast settingsGet', function() {
    spyOn($rootScope,'$broadcast');
    $scope.page.type = 'T';
    $scope.updatePageType();
    expect(Page.type).toBe('T');
    expect($rootScope.$broadcast).toHaveBeenCalledWith('settingsGet');
  });

  it('titleChange() should slugify title when url empty', function() {
    $scope.page.title = 'Hello World!';
    $scope.page.url = '';
    $scope.titleChange();
    expect(Page.title).toBe('Hello World!');
    expect($scope.page.url).toBe('hello-world');
    expect(Page.url).toBe('hello-world');
  });

  it('descriptionChange() updates Page.description', function() {
    $scope.page.description = 'desc';
    $scope.descriptionChange();
    expect(Page.description).toBe('desc');
  });

  it('urlChange() updates Page.url', function() {
    $scope.page.url = 'foo';
    $scope.urlChange();
    expect(Page.url).toBe('foo');
  });

  it('saveLocal() writes Page and localStorage', function() {
    $scope.page.title = 't'; $scope.page.description = 'd';
    $scope.page.url = 'u'; $scope.page.type = 'tp';
    $scope.page.publish = 'P'; $scope.page.scheduleDate = 'SD';
    $routeParams.url = 'XYZ';
    $scope.saveLocal();
    expect(Page.title).toBe('t');
    expect(store['XYZ'+'title']).toBe('t');
    expect(store['XYZ'+'scheduleDate']).toBe('SD');
  });

  it('autocompleteTags() on success fills suggestions', function() {
    REST.contentTags.query.and.callFake(function(p, success, fail) {
      success(['foo','bar']);
    });
    $scope.page.tags = ['foo'];
    $scope.autocompleteTags();
    expect($scope.page.suggestions).toEqual(['foo','bar']);
  });

  it('autocompleteTags() on error clears suggestions', function() {
    REST.contentTags.query.and.callFake(function(p, success, fail) {
      fail();
    });
    $scope.page.tags = ['x'];
    $scope.autocompleteTags();
    expect($scope.page.suggestions).toEqual([]);
  });

  it('selectSuggestion() replaces last tag and appends empty', function() {
    $scope.page.tags = ['a',''];
    $scope.selectSuggestion('NEW');
    expect($scope.page.tags).toEqual(['a','NEW','']);
  });

  describe('savePage error branches', function() {
    beforeEach(function() {
      spyOn($rootScope,'$broadcast');
    });

    it('should error on duplicate when urls match', function() {
      $location.path.and.returnValue('/p');
      $scope.page.url = '/p';
      $scope.page.type = 't';
      $scope.savePage(true);
      $rootScope.$apply();
      expect($rootScope.$broadcast)
        .toHaveBeenCalledWith('notify',{message:'page_different_url_translated',classes:'alert-error'});
      expect(REST.content.save).not.toHaveBeenCalled();
    });

    it('should error when no type selected', function() {
      $scope.page.url = '/x'; $scope.page.type = '';
      $scope.savePage(false);
      $rootScope.$apply();
      expect($rootScope.$broadcast)
        .toHaveBeenCalledWith('notify',{message:'page_no_type_selected_translated',classes:'alert-error'});
    });

    it('should error when no url provided', function() {
      $scope.page.type = 't'; $scope.page.url = '';
      $scope.savePage(false);
      $rootScope.$apply();
      expect($rootScope.$broadcast)
        .toHaveBeenCalledWith('notify',{message:'page_no_url_translated',classes:'alert-error'});
    });
  });

  it('savePage() creates a new page when duplicate and urls differ', function() {
    // set up new‐page flow
    $location.path.and.returnValue('/x');
    $scope.page.url = '/y';
    $scope.page.type = 'tp';
    Page.publish = 'N';
    // stub content.save to invoke newPagePromise immediately
    REST.content.save.and.callFake(function(params, success) {
      success({ id: 55 });
    });
    $scope.page.tags = ['a','b'];
    $scope.savePage(true);

    // content.save must have been called
    expect(REST.content.save).toHaveBeenCalled();
    // newPagePromise should have triggered contentRevisions.save
    expect(REST.contentRevisions.save).toHaveBeenCalled();
  });

  it('savePage() updates existing page when path ≠ /new and not duplicate', function() {
    $location.path.and.returnValue('/edit');
    Page.id = 321;
    $scope.page.type = 't';
    $scope.page.url = '/edit';
    // stub update to call updatePagePromise
    REST.content.update.and.callFake(function(params, success) {
      success({ id:321 });
    });
    $scope.savePage(false);

    expect(REST.content.update).toHaveBeenCalledWith(
      jasmine.objectContaining({ contentID:321 }), jasmine.any(Function), jasmine.any(Function)
    );
    // updatePagePromise should call delete tags and save a revision
    expect(REST.contentTags.delete).toHaveBeenCalledWith({ contentID:321 }, jasmine.any(Function));
    expect(REST.contentRevisions.save).toHaveBeenCalled();
  });
});
```

Explanation of key points:

1. We use `angular-mocks` to load your module and inject services.  
2. We stub out `$httpBackend` for all REST tests and verify URL and method.  
3. We create a fake in-memory `localStorage` for testing the `saveLocal`, `localVersion`, and `deleteNewerVersion` flows.  
4. We stub `$translate` with a simple promise that resolves immediately so that `.then(...)` handlers execute in tests after a `$rootScope.$apply()`.  
5. We cover all public controller methods: initialization, version management, CRUD operations, type/tags methods, and both error and happy paths for `savePage`.  
6. We organize tests with `describe`/`it` blocks and shared `beforeEach` setups for clean isolation.  

With this setup you can run:

    npm install
    npm test

Which will produce a coverage report in `coverage/`. Adjust any paths if your source files live in different directories.

### Tokens: {'input_tokens': 5662, 'output_tokens': 9507, 'reasoning_tokens': 5760}
### Execution time: 63.19489574432373
