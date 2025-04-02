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
```javascript
// rest.test.js
describe('REST Factory', function() {
    var REST, $resource;

    beforeEach(module('cosmo'));

    beforeEach(inject(function(_REST_, _$resource_) {
        REST = _REST_;
        $resource = _$resource_;
        spyOn($resource, 'call').and.callThrough(); // Spy on $resource constructor
    }));

    it('should define all REST endpoints using $resource', function() {
        expect(REST).toBeDefined();
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

    it('should call $resource for each endpoint with correct parameters', function() {
        expect($resource.call).toHaveBeenCalledWith('api/blocks/:blockID', { blockID: '@blockID'}, { update: { method: 'PUT' } });
        expect($resource.call).toHaveBeenCalledWith('api/blocks/:blockID/requirements/:requirementID', { blockID: '@blockID', requirementID: '@requirementID'}, { update: { method: 'PUT' } });
        expect($resource.call).toHaveBeenCalledWith('api/comments/:commentID', { commentID: '@commentID'}, { update: { method: 'PUT' } });
        expect($resource.call).toHaveBeenCalledWith('api/content/:contentID', { contentID: '@contentID'}, { update: { method: 'PUT' } });
        expect($resource.call).toHaveBeenCalledWith('api/content/:contentID/extras/', { contentID: '@contentID'});
        expect($resource.call).toHaveBeenCalledWith('api/content/:contentID/revisions/:revisionID', { contentID: '@contentID', revisionID: '@revisionID'}, {update: { method: 'PUT' } });
        expect($resource.call).toHaveBeenCalledWith('api/content/:contentID/revisions/:revisionID/extras/:extraID', { revisionID: '@revisionID', contentID: '@contentID', extraID: '@extraID'});
        expect($resource.call).toHaveBeenCalledWith('api/content/:contentID/tags/', { contentID: '@contentID'});
        expect($resource.call).toHaveBeenCalledWith('api/files/:fileID', { fileID: '@fileID'}, { update: { method: 'PUT' } });
        expect($resource.call).toHaveBeenCalledWith('api/files/:fileID/tag/:tag', { fileID: '@fileID', tag: '@tag'}, { update: { method: 'PUT' } });
        expect($resource.call).toHaveBeenCalledWith('api/menus/:menuID', { menuID: '@menuID'}, { update: { method: 'PUT' } });
        expect($resource.call).toHaveBeenCalledWith('api/modules/:moduleID', { moduleID: '@moduleID'}, { update: { method: 'PUT' } });
        expect($resource.call).toHaveBeenCalledWith('api/sitemaps/');
        expect($resource.call).toHaveBeenCalledWith('api/themes/:themeID', { themeID: '@themeID' }, { update: { method: 'PUT' } });
        expect($resource.call).toHaveBeenCalledWith('api/settings/', {}, { update: { method: 'PUT' } });
        expect($resource.call).toHaveBeenCalledWith('api/users/:userID', { userID: '@userID' }, { update: { method: 'PUT' } });
    });
});
```

```javascript
// page.test.js
describe('Page Factory', function() {
    var Page;

    beforeEach(module('cosmo'));

    beforeEach(inject(function(_Page_) {
        Page = _Page_;
    }));

    it('should return an object', function() {
        expect(typeof Page).toEqual('object');
    });

    it('should have default properties', function() {
        expect(Page.id).toEqual(0);
        expect(Page.title).toEqual('');
        expect(Page.description).toEqual('');
        expect(Page.header).toEqual('');
        expect(Page.subheader).toEqual('');
        expect(Page.body).toEqual('');
        expect(Page.url).toEqual('');
        expect(Page.type).toEqual('');
        expect(Page.published).toEqual('');
        expect(Page.published_date).toEqual('');
        expect(Page.themePages).toEqual([]);
        expect(Page.timestamp).toEqual('');
        expect(Page.extras).toEqual([]);
        expect(Page.misc).toEqual({});
    });
});
```

```javascript
// users.test.js
describe('Users Factory', function() {
    var Users;

    beforeEach(module('cosmo'));

    beforeEach(inject(function(_Users_) {
        Users = _Users_;
    }));

    it('should return an object', function() {
        expect(typeof Users).toEqual('object');
    });

    it('should have default properties', function() {
        expect(Users.id).toEqual('');
        expect(Users.username).toEqual('');
        expect(Users.name).toEqual('');
        expect(Users.bio).toEqual('');
        expect(Users.email).toEqual('');
        expect(Users.facebook).toEqual('');
        expect(Users.twitter).toEqual('');
        expect(Users.photo).toEqual('');
        expect(Users.role).toEqual('');
    });
});
```

```javascript
// pageCtrl.test.js
describe('pageCtrl', function() {
    var $scope, controller, REST, Page, $location, $rootScope, $routeParams, $upload, Users, $translate, localStorage;

    beforeEach(module('cosmo'));

    beforeEach(inject(function(_$rootScope_, _$controller_, _REST_, _Page_, _$location_, _$routeParams_, _$upload_, _Users_, _$translate_) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        REST = _REST_;
        Page = _Page_;
        $location = _$location_;
        $routeParams = _$routeParams_;
        $upload = _$upload_;
        Users = _Users_;
        $translate = _$translate_;
        localStorage = jasmine.createSpyObj('localStorage', ['getItem', 'setItem', 'removeItem', 'clear']);

        // Mock REST service
        spyOn(REST.content, '$save').and.returnValue({$promise: Promise.resolve({id: 1})});
        spyOn(REST.content, '$update').and.returnValue({$promise: Promise.resolve({})});
        spyOn(REST.content, '$delete').and.returnValue({$promise: Promise.resolve({})});
        spyOn(REST.contentRevisions, '$save').and.returnValue({$promise: Promise.resolve({id: 1})});
        spyOn(REST.contentRevisions, '$delete').and.returnValue({$promise: Promise.resolve({})});
        spyOn(REST.contentExtras, '$save').and.returnValue({$promise: Promise.resolve({})});
        spyOn(REST.contentExtras, '$delete').and.returnValue({$promise: Promise.resolve({})});
        spyOn(REST.contentRevisionsExtras, '$save').and.returnValue({$promise: Promise.resolve({})});
        spyOn(REST.contentRevisionsExtras, '$delete').and.returnValue({$promise: Promise.resolve({})});
        spyOn(REST.contentTags, '$query').and.returnValue({$promise: Promise.resolve([])});
        spyOn(REST.contentTags, '$save').and.returnValue({$promise: Promise.resolve({})});
        spyOn(REST.contentTags, '$delete').and.returnValue({$promise: Promise.resolve({})});

        // Mock Page factory
        Page.id = 1;
        Page.title = 'Initial Title';
        Page.description = 'Initial Description';
        Page.url = 'initial-url';
        Page.publish = 'N';
        Page.scheduleDate = new Date(2024, 0, 1);
        Page.tags = ['initial', 'tags'];
        Page.type = 'default';
        Page.themePages = ['default', 'custom'];
        Page.extras = {};

        // Mock Users factory
        Users.id = 'user123';

        // Mock $location
        spyOn($location, 'path').and.returnValue('/edit/initial-url');

        // Mock $routeParams
        $routeParams.url = 'initial-url';

        // Mock $translate
        spyOn($translate, 'then').and.callFake(function(callback) {
            var deferred = Promise.resolve({message: 'translated text'});
            deferred.then(callback);
            return deferred;
        });
        spyOn($translate, 'instant').and.returnValue('translated text');

        // Mock $rootScope.$broadcast
        spyOn($rootScope, '$broadcast').and.callThrough();

        controller = _$controller_('pageCtrl', {
            $scope: $scope,
            REST: REST,
            Page: Page,
            $location: $location,
            $rootScope: $rootScope,
            $routeParams: $routeParams,
            $upload: $upload,
            Users: Users,
            $translate: $translate
        });

        // Mock localStorage
        spyOn(window, 'localStorage', 'get').and.returnValue(localStorage);
    }));

    describe('Initialization', function() {
        it('should initialize $scope.page from Page factory', function() {
            expect($scope.page.id).toEqual(Page.id);
            expect($scope.page.title).toEqual(Page.title);
            expect($scope.page.description).toEqual(Page.description);
            expect($scope.page.url).toEqual(Page.url);
            expect($scope.page.publish).toEqual(Page.publish);
            expect($scope.page.scheduleDate).toEqual(Page.scheduleDate);
            expect($scope.page.tags).toEqual(Page.tags);
            expect($scope.page.type).toEqual(Page.type);
            expect($scope.page.themePages).toEqual(Page.themePages);
        });

        it('should set scheduleDate to today if path is /new', inject(function(_$location_) {
            _$location_.path.and.returnValue('/new');
            controller = _$controller_('pageCtrl', {
                $scope: $scope,
                REST: REST,
                Page: Page,
                $location: _$location_,
                $rootScope: $rootScope,
                $routeParams: $routeParams,
                $upload: $upload,
                Users: Users,
                $translate: $translate
            });
            expect($scope.page.scheduleDate).toEqual(jasmine.any(Date));
        }));

        it('should initialize page type from Page factory or themePages[0]', function() {
            expect($scope.page.type).toEqual(Page.type);
            Page.type = null;
            controller = _$controller_('pageCtrl', {
                $scope: $scope,
                REST: REST,
                Page: Page,
                $location: $location,
                $rootScope: $rootScope,
                $routeParams: $routeParams,
                $upload: $upload,
                Users: Users,
                $translate: $translate
            });
            expect($scope.page.type).toEqual($scope.page.themePages[0]);
        });

        it('should check for newer version from localStorage if not a new page', function() {
            localStorage.getItem.and.returnValue('different value');
            controller = _$controller_('pageCtrl', {
                $scope: $scope,
                REST: REST,
                Page: Page,
                $location: $location,
                $rootScope: $rootScope,
                $routeParams: $routeParams,
                $upload: $upload,
                Users: Users,
                $translate: $translate
            });
            expect($scope.newerVersion).toBe(true);
        });

        it('should not check for newer version from localStorage if it is a new page', inject(function(_$location_){
            _$location_.path.and.returnValue('/new');
            localStorage.getItem.and.returnValue('different value');
            controller = _$controller_('pageCtrl', {
                $scope: $scope,
                REST: REST,
                Page: Page,
                $location: _$location_,
                $rootScope: $rootScope,
                $routeParams: $routeParams,
                $upload: $upload,
                Users: Users,
                $translate: $translate
            });
            expect($scope.newerVersion).toBeUndefined();
        }));
    });

    describe('localVersion', function() {
        it('should revert to local storage version and clear local storage', function() {
            localStorage.getItem.and.returnValue('localStorageValue');
            $scope.localVersion();
            expect(Page.title).toEqual('localStorageValue');
            expect(localStorage.setItem).toHaveBeenCalledWith('initial-urltitle', null);
            expect($scope.newerVersion).toBe(false);
            expect($rootScope.$broadcast).toHaveBeenCalledWith('contentGet');
        });
    });

    describe('deleteNewerVersion', function() {
        it('should delete newer version from local storage', function() {
            $scope.deleteNewerVersion();
            expect(localStorage.setItem).toHaveBeenCalledWith('initial-urltitle', null);
            expect(localStorage.setItem).toHaveBeenCalledWith('initial-urldescription', null);
            expect(localStorage.setItem).toHaveBeenCalledWith('initial-urlpublish', null);
            expect(localStorage.setItem).toHaveBeenCalledWith('initial-urlscheduleDate', null);
            expect(localStorage.setItem).toHaveBeenCalledWith('initial-urlheader', null);
            expect(localStorage.setItem).toHaveBeenCalledWith('initial-urlsubheader', null);
            expect(localStorage.setItem).toHaveBeenCalledWith('initial-urlbody', null);
            expect(localStorage.setItem).toHaveBeenCalledWith('initial-urlurl', null);
            expect($scope.newerVersion).toBe(false);
        });
    });

    describe('deletePage', function() {
        it('should delete the page and related data using REST service and redirect to new page', function() {
            $scope.page.id = 1;
            $scope.deletePage();
            expect(REST.content.$delete).toHaveBeenCalledWith({ contentID: 1 }, jasmine.any(Function));
            expect(REST.contentRevisions.$delete).toHaveBeenCalledWith({ contentID: 1 });
            expect(REST.contentRevisionsExtras.$delete).toHaveBeenCalledWith({ contentID: 1 });
            expect(REST.contentExtras.$delete).toHaveBeenCalledWith({ contentID: 1 });
            expect(REST.contentTags.$delete).toHaveBeenCalledWith({ contentID: 1 });
            expect($location.path).toHaveBeenCalledWith('new');
            expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated text' });
        });
    });

    describe('updatePage', function() {
        it('should update $scope.page properties from Page factory', function() {
            Page.title = 'Updated Title';
            Page.description = 'Updated Description';
            Page.url = 'updated-url';
            Page.type = 'custom';
            Page.tags = ['updated', 'tags'];
            $rootScope.$broadcast('contentGet');
            expect($scope.page.title).toEqual('Updated Title');
            expect($scope.page.description).toEqual('Updated Description');
            expect($scope.page.url).toEqual('updated-url');
            expect($scope.page.type).toEqual('custom');
            expect($scope.page.tags).toEqual(['updated', 'tags']);
        });
    });

    describe('updatePageType', function() {
        it('should update Page.type and broadcast settingsGet event', function() {
            $scope.page.type = 'newType';
            $scope.updatePageType();
            expect(Page.type).toEqual('newType');
            expect($rootScope.$broadcast).toHaveBeenCalledWith('settingsGet');
        });
    });

    describe('titleChange', function() {
        it('should update Page.title and auto-generate URL for new pages', function() {
            $scope.page.title = 'New Page Title';
            $scope.page.url = 'new';
            $scope.titleChange();
            expect(Page.title).toEqual('New Page Title');
            expect($scope.page.url).toEqual('new-page-title');
            expect(Page.url).toEqual('new-page-title');
        });

        it('should not auto-generate URL if autoURL is false', function() {
            $scope.page.title = 'Another Title';
            $scope.page.url = 'custom-url';
            $scope.autoURL = false;
            $scope.titleChange();
            expect($scope.page.url).toEqual('custom-url');
        });
    });

    describe('descriptionChange', function() {
        it('should update Page.description', function() {
            $scope.page.description = 'New Description Text';
            $scope.descriptionChange();
            expect(Page.description).toEqual('New Description Text');
        });
    });

    describe('urlChange', function() {
        it('should update Page.url', function() {
            $scope.page.url = 'new-custom-url';
            $scope.urlChange();
            expect(Page.url).toEqual('new-custom-url');
        });
    });

    describe('saveLocal', function() {
        it('should save page properties to Page factory and localStorage', function() {
            $scope.page.title = 'Local Title';
            $scope.page.description = 'Local Description';
            $scope.page.url = 'local-url';
            $scope.page.type = 'localType';
            $scope.page.publish = 'Y';
            $scope.page.scheduleDate = new Date(2024, 1, 1);
            $scope.saveLocal();
            expect(Page.title).toEqual('Local Title');
            expect(Page.description).toEqual('Local Description');
            expect(Page.url).toEqual('local-url');
            expect(Page.type).toEqual('localType');
            expect(localStorage.setItem).toHaveBeenCalledWith('initial-urltitle', 'Local Title');
            expect(localStorage.setItem).toHaveBeenCalledWith('initial-urldescription', 'Local Description');
            expect(localStorage.setItem).toHaveBeenCalledWith('initial-urlurl', 'local-url');
            expect(localStorage.setItem).toHaveBeenCalledWith('initial-urlpublish', 'Y');
            expect(localStorage.setItem).toHaveBeenCalledWith('initial-urlscheduleDate', jasmine.any(Date));
            expect(localStorage.setItem).toHaveBeenCalledWith('initial-urltype', 'localType');
        });
    });

    describe('autocompleteTags', function() {
        it('should query REST.contentTags for tag suggestions', function() {
            $scope.page.tags = ['te'];
            $scope.autocompleteTags();
            expect(REST.contentTags.$query).toHaveBeenCalled();
        });

        it('should set suggestions to empty array if no tag is provided', function() {
            $scope.page.tags = [];
            $scope.autocompleteTags();
            expect($scope.page.suggestions).toEqual([]);
        });
    });

    describe('selectSuggestion', function() {
        it('should select a tag suggestion and clear suggestions', function() {
            $scope.page.tags = ['te'];
            $scope.page.suggestions = ['testTag'];
            $scope.selectSuggestion('testTag');
            expect($scope.page.tags).toEqual(['testTag', '']);
            expect($scope.page.suggestions).toEqual([]);
        });
    });

    describe('savePage', function() {
        it('should show error if duplicate URL on duplicate save', function() {
            $location.path.and.returnValue('/edit/initial-url');
            $scope.savePage(true);
            expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated text', classes: 'alert-error' });
        });

        it('should show error if no page type selected', function() {
            $scope.page.type = null;
            $scope.savePage();
            expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated text', classes: 'alert-error' });
        });

        it('should show error if no URL provided', function() {
            $scope.page.url = '';
            $scope.savePage();
            expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated text', classes: 'alert-error' });
        });

        it('should save new page using REST.content.save and redirect to new page URL', function() {
            $location.path.and.returnValue('/new');
            $scope.page.url = 'new-page-url';
            $scope.page.tags = ['tag1', 'tag2'];
            Page.extras = { featured: { src: 'image.jpg' }, customData: { value: 'test' } };
            $scope.savePage();
            expect(REST.content.$save).toHaveBeenCalled();
            expect(REST.contentRevisions.$save).toHaveBeenCalled();
            expect(REST.contentTags.$save).toHaveBeenCalledTimes(2);
            expect(REST.contentExtras.$save).toHaveBeenCalledTimes(2);
            expect($location.path).toHaveBeenCalledWith('new-page-url');
            expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated text' });
        });

        it('should update existing page using REST.content.update and redirect to page URL', function() {
            $location.path.and.returnValue('/edit/initial-url');
            $scope.page.id = 1;
            $scope.page.url = 'updated-page-url';
            $scope.page.tags = ['tag3', 'tag4'];
            Page.extras = { featured: { src: 'image2.jpg' }, customData: { value: 'test2' } };
            $scope.savePage();
            expect(REST.content.$update).toHaveBeenCalled();
            expect(REST.contentRevisions.$save).toHaveBeenCalled();
            expect(REST.contentTags.$delete).toHaveBeenCalled();
            expect(REST.contentTags.$save).toHaveBeenCalledTimes(2);
            expect(REST.contentExtras.$delete).toHaveBeenCalled();
            expect(REST.contentExtras.$save).toHaveBeenCalledTimes(2);
            expect($location.path).toHaveBeenCalledWith('updated-page-url');
            expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated text' });
        });

        it('should handle error during save and show error notification', function() {
            REST.content.$save.and.returnValue({$promise: Promise.reject('error')});
            $location.path.and.returnValue('/new');
            $scope.savePage();
            $rootScope.$digest(); // Resolve promises
            expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated text', classes: 'alert-error' });
        });

        it('should handle error during update and show error notification', function() {
            REST.content.$update.and.returnValue({$promise: Promise.reject('error')});
            $location.path.and.returnValue('/edit/initial-url');
            $scope.savePage();
            $rootScope.$digest(); // Resolve promises
            expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated text', classes: 'alert-error' });
        });

        it('should set published_date to current time if publishing now', function() {
            $location.path.and.returnValue('/new');
            $scope.page.publish = 'Y';
            Page.publish = 'N'; // Previous publish state
            $scope.savePage();
            expect(REST.content.$save).toHaveBeenCalled();
            const saveCall = REST.content.$save.calls.mostRecent();
            const publishedDateArg = saveCall.args[0].published_date;
            expect(publishedDateArg).toBeGreaterThan(Math.round(Date.now() / 1000) - 5); // Allow for slight time difference
            expect(publishedDateArg).toBeLessThanOrEqual(Math.round(Date.now() / 1000));
        });

         it('should use existing published_date if already published and saving again', function() {
            $location.path.and.returnValue('/edit/initial-url');
            $scope.page.publish = 'Y';
            Page.publish = 'Y'; // Previous publish state was also published
            const existingDate = 1672531200; // Example timestamp
            Page.scheduleDate = existingDate;
            $scope.savePage();
            expect(REST.content.$update).toHaveBeenCalled();
            const updateCall = REST.content.$update.calls.mostRecent();
            const publishedDateArg = updateCall.args[1].published_date; // Args[1] for update, Args[0] for save
            expect(publishedDateArg).toEqual(existingDate);
        });

        it('should set published_date from scheduleDate if scheduling publish', function() {
            $location.path.and.returnValue('/new');
            $scope.page.publish = 'schedule';
            const scheduleDate = new Date(2024, 2, 1);
            $scope.page.scheduleDate = scheduleDate;
            $scope.savePage();
            expect(REST.content.$save).toHaveBeenCalled();
            const saveCall = REST.content.$save.calls.mostRecent();
            const publishedDateArg = saveCall.args[0].published_date;
            expect(publishedDateArg).toEqual(Math.round(scheduleDate.getTime() / 1000));
        });

        it('should set publish to "Y" if scheduled date is in the past', function() {
            $location.path.and.returnValue('/new');
            $scope.page.publish = 'schedule';
            const pastScheduleDate = new Date(2023, 0, 1);
            $scope.page.scheduleDate = pastScheduleDate;
            $scope.savePage();
            expect($scope.page.publish).toEqual('Y');
        });
    });
});
```

**Configuration Files:**

**1. `package.json` (for npm dependencies):**

```json
{
  "name": "cosmo-test",
  "version": "1.0.0",
  "description": "Unit tests for Cosmo AngularJS app",
  "devDependencies": {
    "angular": "1.8.2",
    "angular-mocks": "1.8.2",
    "angular-resource": "1.8.2",
    "angular-translate": "2.18.1",
    "jasmine-core": "4.5.0",
    "karma": "6.4.1",
    "karma-jasmine": "5.1.0",
    "karma-chrome-launcher": "3.1.1",
    "karma-coverage": "2.2.0"
  },
  "scripts": {
    "test": "karma start karma.conf.js"
  }
}
```

**2. `karma.conf.js` (Karma configuration file):**

```javascript
// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-resource/angular-resource.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-translate/angular-translate.js',
      '*.js', // Include your application source files
      '*.test.js' // Include your test files
    ],
    exclude: [],
    preprocessors: {
      '*.js': ['coverage'] // Apply coverage instrumentation to source files
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
    browsers: ['ChromeHeadlessCI'], // Use Chrome Headless for CI, Chrome for local development
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'] // Needed for some CI environments
      }
    },
    singleRun: true, // Set to false for development to keep browser open and re-run tests on file changes
    concurrency: Infinity
  })
}
```

**3. Install Dependencies:**

Run `npm install` in your project directory to install all the necessary dependencies listed in `package.json`.

**To Run the Tests:**

1.  Make sure you have Node.js and npm installed.
2.  Navigate to your project directory in the terminal.
3.  Run `npm install` to install dependencies.
4.  Run `npm test` to execute the test suite using Karma.

This setup provides a comprehensive unit test suite for your AngularJS application, covering the factories and controller with mocks and spies for isolation and focused testing. The configuration files and instructions ensure a production-ready test suite that can be easily executed and integrated into a CI/CD pipeline. Remember to adjust file paths in `karma.conf.js` if your source and test files are in different directories.

### Tokens: {'input_tokens': 6587, 'output_tokens': 6900}
### Execution time: 30.237955808639526
