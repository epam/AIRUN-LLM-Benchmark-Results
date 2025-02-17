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
// tests/pageCtrl.spec.js
describe('pageCtrl', function() {
    var $controller, $rootScope, $scope, $location, $q, $routeParams, $translate, REST, Page, Users, $upload;
    var fakeLocalStorage = {};

    beforeEach(module('cosmo'));

    beforeEach(module(function($provide) {
        // Fake REST service
        REST = {
            blocks: {},
            blocksRequirements: {},
            comments: {},
            content: {
                delete: jasmine.createSpy('content.delete').and.callFake(function(params, successCallback) {
                    successCallback({ id: params.contentID });
                }),
                update: jasmine.createSpy('content.update').and.callFake(function(params, successCallback, errorCallback) {
                    successCallback({ id: params.contentID });
                }),
                save: jasmine.createSpy('content.save').and.callFake(function(data, successCallback, errorCallback) {
                    successCallback({ id: 123 });
                })
            },
            contentRevisions: {
                delete: jasmine.createSpy('contentRevisions.delete'),
                save: jasmine.createSpy('contentRevisions.save').and.callFake(function(data, successCallback) {
                    successCallback({ id: 456 });
                })
            },
            contentRevisionsExtras: {
                delete: jasmine.createSpy('contentRevisionsExtras.delete'),
                save: jasmine.createSpy('contentRevisionsExtras.save')
            },
            contentExtras: {
                delete: jasmine.createSpy('contentExtras.delete'),
                save: jasmine.createSpy('contentExtras.save').and.callFake(function(data, successCallback) {
                    successCallback();
                })
            },
            contentTags: {
                delete: jasmine.createSpy('contentTags.delete'),
                save: jasmine.createSpy('contentTags.save'),
                query: jasmine.createSpy('contentTags.query').and.callFake(function(params, successCallback, errorCallback) {
                    if(params.tag === 'exist') {
                        successCallback(['exist', 'existing']);
                    } else {
                        if (errorCallback) { errorCallback(); }
                    }
                })
            },
            menus: {},
            modules: {},
            sitemaps: {},
            themes: {},
            settings: {},
            users: {}
        };
        $provide.factory('REST', function() {
            return REST;
        });
        // Fake Page service
        Page = {
            id: 1,
            title: '',
            description: '',
            header: 'header text',
            subheader: '',
            body: '',
            url: '',
            type: '',
            publish: '',
            scheduleDate: '',
            tags: [],
            themePages: ['default', 'alternative'],
            extras: {},
            misc: {}
        };
        $provide.factory('Page', function() {
            return Page;
        });
        // Fake Users service
        Users = {
            id: 'user1',
            username: 'tester',
            name: 'Test User',
            bio: '',
            email: 'test@example.com',
            facebook: '',
            twitter: '',
            photo: '',
            role: 'admin'
        };
        $provide.factory('Users', function() {
            return Users;
        });
        // Fake $upload (not used in tests)
        $upload = {};
        $provide.value('$upload', $upload);
        // Fake $translate
        $translate = jasmine.createSpy('$translate').and.callFake(function(key) {
            var deferred;
            inject(function($q) {
                deferred = $q.defer();
            });
            deferred.resolve(key);
            return deferred.promise;
        });
        $provide.value('$translate', $translate);
    }));

    beforeEach(inject(function(_$controller_, _$rootScope_, _$location_, _$q_, _$routeParams_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $location = _$location_;
        $q = _$q_;
        $routeParams = _$routeParams_;
        $routeParams.url = "testUrl";
        // Reset fake localStorage
        fakeLocalStorage = {};
        spyOn(window.localStorage, "getItem").and.callFake(function(key) {
            return fakeLocalStorage[key] || null;
        });
        spyOn(window.localStorage, "setItem").and.callFake(function(key, value) {
            fakeLocalStorage[key] = value;
        });
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
        it('should initialize scheduleDate for new pages', function() {
            // When path is '/new', scheduleDate should be set to current date.
            spyOn($location, 'path').and.returnValue('/new');
            // Reinitialize controller to test the if block.
            Page.scheduleDate = '';
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

        it('should set the page type from Page or default to themePages[0]', function() {
            Page.type = '';
            $scope.page.themePages = ['default', 'alt'];
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
            expect($scope.page.type).toBe('default');
            Page.type = 'custom';
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
            expect($scope.page.type).toBe('custom');
        });
    });

    describe('localVersion and deleteNewerVersion', function() {
        var elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
        beforeEach(function() {
            // Set some localStorage items to simulate unsaved changes
            elements.forEach(function(key) {
                fakeLocalStorage[$routeParams.url + key] = 'stored_' + key;
            });
            // Set Page values different from localStorage values
            elements.forEach(function(key) {
                Page[key] = 'original_' + key;
            });
            // Mark that there is a newer version
            $scope.newerVersion = true;
        });
        it('localVersion should restore values and clear storage', function() {
            spyOn($rootScope, '$broadcast');
            $scope.localVersion();
            elements.forEach(function(key) {
                expect(Page[key]).toBe('stored_' + key);
                expect(fakeLocalStorage[$routeParams.url + key]).toBe('null');
            });
            expect($scope.newerVersion).toBe(false);
            expect($rootScope.$broadcast).toHaveBeenCalledWith('contentGet');
        });
        it('deleteNewerVersion should clear storage and reset newerVersion flag', function() {
            $scope.newerVersion = true;
            $scope.deleteNewerVersion();
            elements.forEach(function(key) {
                expect(fakeLocalStorage[$routeParams.url + key]).toBe('null');
            });
            expect($scope.newerVersion).toBe(false);
        });
    });

    describe('deletePage', function() {
        it('should call REST.content.delete and other delete methods then redirect', function() {
            spyOn($rootScope, '$broadcast');
            spyOn($location, 'path');
            $scope.page.id = 99;
            $scope.deletePage();
            expect(REST.content.delete).toHaveBeenCalledWith({ contentID: 99 }, jasmine.any(Function));
            expect(REST.contentRevisions.delete).toHaveBeenCalledWith({ contentID: 99 });
            expect(REST.contentRevisionsExtras.delete).toHaveBeenCalledWith({ contentID: 99 });
            expect(REST.contentExtras.delete).toHaveBeenCalledWith({ contentID: 99 });
            expect(REST.contentTags.delete).toHaveBeenCalledWith({ contentID: 99 });
            expect($location.path).toHaveBeenCalledWith('new');
        });
    });

    describe('updatePageType', function() {
        it('should update Page.type and broadcast settingsGet', function() {
            spyOn($rootScope, '$broadcast');
            $scope.page.type = 'alt';
            $scope.updatePageType();
            expect(Page.type).toBe('alt');
            expect($rootScope.$broadcast).toHaveBeenCalledWith('settingsGet');
        });
    });

    describe('titleChange, descriptionChange, urlChange', function() {
        it('titleChange should set Page.title and auto generate URL if conditions met', function() {
            $scope.page.url = 'new';
            $scope.page.title = 'Test Title!';
            $scope.autoURL = true;
            $scope.titleChange();
            expect(Page.title).toBe('Test Title!');
            expect($scope.page.url).toBe('test-title');
            expect(Page.url).toBe('test-title');
        });
        it('descriptionChange should update Page.description', function() {
            $scope.page.description = 'New description';
            $scope.descriptionChange();
            expect(Page.description).toBe('New description');
        });
        it('urlChange should update Page.url', function() {
            $scope.page.url = 'custom-url';
            $scope.urlChange();
            expect(Page.url).toBe('custom-url');
        });
    });

    describe('saveLocal', function() {
        it('should update Page properties and save them to localStorage', function() {
            $scope.page.title = 'Local Title';
            $scope.page.description = 'Local Desc';
            $scope.page.url = 'local-url';
            $scope.page.type = 'local-type';
            Page.publish = 'Y';
            Page.scheduleDate = '2020-01-01';
            $scope.saveLocal();
            expect(Page.title).toBe('Local Title');
            expect(fakeLocalStorage[$routeParams.url + 'title']).toBe('Local Title');
            expect(fakeLocalStorage[$routeParams.url + 'description']).toBe('Local Desc');
            expect(fakeLocalStorage[$routeParams.url + 'url']).toBe('local-url');
            expect(fakeLocalStorage[$routeParams.url + 'publish']).toBe('Y');
            expect(fakeLocalStorage[$routeParams.url + 'scheduleDate']).toBe('2020-01-01');
            expect(fakeLocalStorage[$routeParams.url + 'type']).toBe('local-type');
        });
    });

    describe('autocompleteTags and selectSuggestion', function() {
        it('autocompleteTags should query REST if last tag exists and update suggestions', function() {
            // Test case for existing tag suggestion
            $scope.page.tags = ['exist'];
            $scope.autocompleteTags();
            expect(REST.contentTags.query).toHaveBeenCalled();
            // Simulate callback has already been invoked by callFake in REST
            expect($scope.page.suggestions).toEqual(['exist', 'existing']);
        });
        it('autocompleteTags should clear suggestions if tag is empty', function() {
            $scope.page.tags = [''];
            $scope.autocompleteTags();
            expect($scope.page.suggestions).toEqual([]);
        });
        it('selectSuggestion should update tags correctly', function() {
            $scope.page.tags = ['partial'];
            $scope.page.suggestions = ['complete'];
            $scope.selectSuggestion('complete');
            expect($scope.page.tags).toEqual(['complete', '']);
            expect($scope.page.suggestions).toEqual([]);
        });
    });

    describe('savePage', function() {
        beforeEach(function() {
            spyOn($rootScope, '$broadcast');
            spyOn($location, 'path');
            // Reset Page and scope state
            Page.id = 1;
            Page.publish = 'N';
            Page.scheduleDate = Math.round(+new Date()/1000);
            Page.extras = {};
            Page.header = 'header text';
            Page.subheader = 'subheader text';
            Page.body = 'body text';
            $scope.page = {
                id: 1,
                title: 'My Page',
                description: 'A description',
                url: 'mypage',
                publish: 'Y',
                scheduleDate: new Date().toISOString(),
                tags: ['tag1'],
                type: 'default',
                themePages: ['default']
            };
        });
        it('should notify error if duplicate URL found on duplicate saving', function() {
            spyOn($translate, 'and').and.callThrough(); // to ensure promise
            $location.path.and.returnValue('mypage');
            $scope.savePage(true);
            // Broadcast error should be triggered.
            expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', {message: 'page_different_url', classes: 'alert-error'});
        });
        it('should notify error if no page type is selected', function() {
            $scope.page.type = '';
            $scope.savePage();
            expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', {message: 'page_no_type_selected', classes: 'alert-error'});
        });
        it('should notify error if url is empty or new', function() {
            $scope.page.url = '';
            $scope.savePage();
            expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', {message: 'page_no_url', classes: 'alert-error'});
            $scope.page.url = 'new';
            $scope.savePage();
            expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', {message: 'page_no_url', classes: 'alert-error'});
        });
        it('should create a new page when on /new path', function() {
            spyOn($location, 'path').and.returnValue('/new');
            $scope.page.url = 'newpage';
            $scope.page.publish = 'Y';
            $scope.savePage();
            expect(REST.content.save).toHaveBeenCalled();
            // Simulate newPagePromise callback
            // REST.content.save already calls success callback in fake implementation
            // REST.contentRevisions.save should be called after new page is saved.
            expect(REST.contentRevisions.save).toHaveBeenCalled();
        });
        it('should update an existing page when not on /new path', function() {
            spyOn($location, 'path').and.returnValue('/existing');
            $scope.page.url = 'existingpage';
            $scope.page.publish = 'N';
            $scope.savePage();
            expect(REST.content.update).toHaveBeenCalled();
            // After update, revisions and tags deletion should be triggered
            expect(REST.contentTags.delete).toHaveBeenCalledWith({ contentID: 1 }, jasmine.any(Function));
        });
    });
});


// tests for page.html (Directive/template) could be done with ng-html2js precompiled templates if needed.
// In this test suite we focus on the controller and factories which cover the legacy code.
  
// tests/rest.spec.js (Example test for REST factory)
describe('REST Factory', function() {
    var REST, $httpBackend;
    beforeEach(module('cosmo'));
    beforeEach(inject(function(_REST_, _$httpBackend_) {
        REST = _REST_;
        $httpBackend = _$httpBackend_;
    }));
    it('should provide blocks resource with update method', function() {
        $httpBackend.expectPUT('api/blocks/5').respond(200);
        REST.blocks.update({ blockID: 5 }, {});
        $httpBackend.flush();
    });
    it('should provide contentRevisionsExtras resource', function() {
        $httpBackend.expectGET('api/content/10/revisions/20/extras/30').respond(200);
        REST.contentRevisionsExtras.get({ contentID: 10, revisionID: 20, extraID: 30 });
        $httpBackend.flush();
    });
});

// tests for Page factory
describe('Page Factory', function() {
    var Page;
    beforeEach(module('cosmo'));
    beforeEach(inject(function(_Page_) {
        Page = _Page_;
    }));
    it('should provide page properties', function() {
        expect(Page).toEqual(jasmine.objectContaining({
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
        }));
    });
});

// tests for Users factory
describe('Users Factory', function() {
    var Users;
    beforeEach(module('cosmo'));
    beforeEach(inject(function(_Users_) {
        Users = _Users_;
    }));
    it('should provide user properties', function() {
        expect(Users).toEqual(jasmine.objectContaining({
            id: '',
            username: '',
            name: '',
            bio: '',
            email: '',
            facebook: '',
            twitter: '',
            photo: '',
            role: ''
        }));
    });
});

### Tokens: {'input_tokens': 5388, 'output_tokens': 5130, 'reasoning_tokens': 1408}
### Execution time: 40.83902072906494
