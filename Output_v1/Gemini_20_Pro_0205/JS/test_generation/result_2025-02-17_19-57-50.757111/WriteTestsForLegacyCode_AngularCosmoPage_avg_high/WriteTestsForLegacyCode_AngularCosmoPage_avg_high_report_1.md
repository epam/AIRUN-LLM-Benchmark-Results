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
```javascript
import angular from 'angular';
import 'angular-mocks';
import { IControllerService, IRootScopeService, IController, IScope } from 'angular';
import { of } from 'rxjs';

describe('pageCtrl', () => {
    let $controller: IControllerService;
    let $rootScope: IRootScopeService;
    let $scope: IScope;
    let REST: any;
    let $location: any;
    let Page: any;
    let $routeParams: any;
    let $upload: any;
    let Users: any;
    let $translate: any;
    let ctrl: IController;

    beforeEach(() => {
        angular.mock.module('cosmo');

        REST = {
            content: {
                delete: jasmine.createSpy('delete'),
                save: jasmine.createSpy('save'),
                update: jasmine.createSpy('update')
            },
            contentRevisions: {
                delete: jasmine.createSpy('delete'),
                save: jasmine.createSpy('save')
            },
            contentRevisionsExtras: {
                delete: jasmine.createSpy('delete'),
                save: jasmine.createSpy('save')
            },
            contentExtras: {
                delete: jasmine.createSpy('delete'),
                save: jasmine.createSpy('save')
            },
            contentTags: {
                delete: jasmine.createSpy('delete'),
                save: jasmine.createSpy('save'),
                query: jasmine.createSpy('query')
            }
        };

        $location = {
            path: jasmine.createSpy('path')
        };

        Page = {
            id: 0,
            title: '',
            description: '',
            header: '',
            subheader: '',
            body: '',
            url: '',
            type: '',
            publish: '',
            scheduleDate: null,
            themePages: ['page1', 'page2'],
            tags: [],
            extras: {}
        };

        $routeParams = { url: 'test-url' };

        $upload = {};

        Users = { id: '123' };

        $translate = jasmine.createSpy('$translate').and.returnValue({
            then: jasmine.createSpy('then').and.callFake((callback: (arg0: string) => any) => {
                callback('translatedText');
            })
        });

        angular.mock.inject((_$controller_: IControllerService, _$rootScope_: IRootScopeService) => {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();

            ctrl = $controller('pageCtrl', {
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
        });
    });

    it('should initialize correctly', () => {
        expect($scope.page.themePages).toEqual(['page1', 'page2']);
        expect($scope.page.type).toEqual('page1');
    });

    it('should set scheduleDate to today if no date was set', () => {
        $location.path.and.returnValue('/new');
        ctrl = $controller('pageCtrl', {
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
        expect($scope.page.scheduleDate).toBeInstanceOf(Date);
    });

    it('should revert to the previously saved version', () => {
        localStorage.setItem('test-urltitle', 'Old Title');
        localStorage.setItem('test-urldescription', 'Old Description');
        Page.title = 'New Title';
        Page.description = 'New Description';

        $scope.localVersion();

        expect(Page.title).toBe('Old Title');
        expect(Page.description).toBe('Old Description');
        expect(localStorage.getItem('test-urltitle')).toBe('null');
        expect(localStorage.getItem('test-urldescription')).toBe('null');
        expect($scope.newerVersion).toBe(false);
    });

    it('should delete newer version', () => {
        localStorage.setItem('test-urltitle', 'Old Title');
        $scope.deleteNewerVersion();
        expect(localStorage.getItem('test-urltitle')).toBe('null');
        expect($scope.newerVersion).toBe(false);
    });

    it('should delete the page', () => {
        $scope.page.id = 1;
        REST.content.delete.and.callFake((params: any, success: () => void) => success());
        REST.contentRevisions.delete.and.callFake((params: any) => { });
        REST.contentRevisionsExtras.delete.and.callFake((params: any) => { });
        REST.contentExtras.delete.and.callFake((params: any) => { });
        REST.contentTags.delete.and.callFake((params: any) => { });

        $scope.deletePage();

        expect(REST.content.delete).toHaveBeenCalledWith({ contentID: 1 }, jasmine.any(Function));
        expect(REST.contentRevisions.delete).toHaveBeenCalledWith({ contentID: 1 });
        expect(REST.contentRevisionsExtras.delete).toHaveBeenCalledWith({ contentID: 1 });
        expect(REST.contentExtras.delete).toHaveBeenCalledWith({ contentID: 1 });
        expect(REST.contentTags.delete).toHaveBeenCalledWith({ contentID: 1 });
        expect($location.path).toHaveBeenCalledWith('new');
    });

    it('should update page type', () => {
        $scope.page.type = 'page2';
        $scope.updatePageType();
        expect(Page.type).toBe('page2');
    });

    it('should auto-generate the url from the title', () => {
        $scope.page.title = 'About Us';
        $scope.page.url = '/new';
        $scope.autoURL = true;
        $scope.titleChange();
        expect($scope.page.url).toBe('about-us');
        expect(Page.url).toBe('about-us');
    });

    it('should not auto-generate url if url is not /new', () => {
        $scope.page.title = 'About Us';
        $scope.page.url = 'about';
        $scope.autoURL = true;
        $scope.titleChange();
        expect($scope.page.url).toBe('about');
        expect(Page.url).toBe('about');
    });

    it('should save changes to the description', () => {
        $scope.page.description = 'New Description';
        $scope.descriptionChange();
        expect(Page.description).toBe('New Description');
    });

    it('should save changes to the url', () => {
        $scope.page.url = 'new-url';
        $scope.urlChange();
        expect(Page.url).toBe('new-url');
    });

    it('should save page locally', () => {
        $scope.page.title = 'Local Title';
        $scope.page.description = 'Local Description';
        $scope.page.url = 'local-url';
        $scope.page.type = 'local-type';
        $scope.page.publish = 'Y';
        $scope.page.scheduleDate = new Date();

        $scope.saveLocal();

        expect(localStorage.getItem('test-urltitle')).toBe('Local Title');
        expect(localStorage.getItem('test-urldescription')).toBe('Local Description');
        expect(localStorage.getItem('test-urlurl')).toBe('local-url');
    });

    it('should autocomplete tags', () => {
        $scope.page.tags = ['tag1', 'ta'];
        REST.contentTags.query.and.callFake((params: any, success: (arg0: string[]) => void) => success(['tag2', 'tag3']));
        $scope.autocompleteTags();
        expect($scope.page.suggestions).toEqual(['tag2', 'tag3']);

        $scope.page.tags = [];
        $scope.autocompleteTags();
        expect($scope.page.suggestions).toEqual([]);
    });

    it('should select suggestion', () => {
        $scope.page.tags = ['tag1', ''];
        $scope.selectSuggestion('tag2');
        expect($scope.page.tags).toEqual(['tag1', 'tag2', '']);
        expect($scope.page.suggestions).toEqual([]);
    });

    it('should save the page - duplicate', () => {
        $location.path.and.returnValue('/new');
        $scope.page.url = 'test-url';
        $scope.page.type = 'page1';
        $scope.page.publish = 'Y';
        $scope.page.title = 'Test Title';
        Page.header = 'Test Header';
        Page.extras = { featured: { src: 'image.jpg' } };
        $scope.page.tags = ['tag1'];

        REST.content.save.and.callFake((params: any, success: (arg0: { id: number; }) => void) => success({ id: 2 }));
        REST.contentRevisions.save.and.callFake((params: any, success: (arg0: { id: number; }) => void) => success({ id: 3 }));
        REST.contentExtras.save.and.callFake((params: any, success: () => void) => success());
        REST.contentRevisionsExtras.save.and.callFake((params: any) => { });

        $scope.savePage(true);

        expect(REST.content.save).toHaveBeenCalled();
        expect($location.path).toHaveBeenCalledWith('test-url');
    });

    it('should save the page - update', () => {
        $location.path.and.returnValue('/edit');
        $scope.page.id = 1;
        $scope.page.url = 'test-url';
        $scope.page.type = 'page1';
        $scope.page.publish = 'Y';
        $scope.page.title = 'Test Title';
        Page.header = 'Test Header';
        Page.extras = {};
        $scope.page.tags = ['tag1'];

        REST.content.update.and.callFake((params: any, success: (arg0: any) => void) => success({}));
        REST.contentRevisions.save.and.callFake((params: any, success: (arg0: { id: number; }) => void) => success({ id: 3 }));
        REST.contentTags.delete.and.callFake((params: any, success: () => void) => success());
        REST.contentExtras.delete.and.callFake((params: any, success: () => void) => success());
        REST.contentRevisionsExtras.save.and.callFake((params: any) => { });

        $scope.savePage(false);

        expect(REST.content.update).toHaveBeenCalled();
        expect($translate).toHaveBeenCalledWith('page_updated');
    });

    it('should handle error when saving page', () => {
        $location.path.and.returnValue('/new');
        $scope.page.type = 'page1';
        $scope.page.publish = 'Y';
        $scope.page.title = 'Test Title';
        Page.header = 'Test Header';

        REST.content.save.and.callFake((params: any, success: any, error: () => void) => error());

        $scope.savePage(true);

        expect(REST.content.save).toHaveBeenCalled();
        expect($translate).toHaveBeenCalledWith('page_error_saving');
    });

    it('should handle error when updating page', () => {
        $location.path.and.returnValue('/edit');
        $scope.page.id = 1;
        $scope.page.type = 'page1';
        $scope.page.publish = 'Y';
        $scope.page.title = 'Test Title';
        Page.header = 'Test Header';

        REST.content.update.and.callFake((params: any, success: any, error: () => void) => error());

        $scope.savePage(false);

        expect(REST.content.update).toHaveBeenCalled();
        expect($translate).toHaveBeenCalledWith('page_error_updating');
    });

    it('should show error if trying to duplicate with same URL', () => {
        $location.path.and.returnValue('test-url');
        $scope.page.url = 'test-url';
        $scope.savePage(true);
        expect($translate).toHaveBeenCalledWith('page_different_url');
    });

    it('should show error if no page type is selected', () => {
        $scope.page.type = null;
        $scope.savePage(false);
        expect($translate).toHaveBeenCalledWith('page_no_type_selected');
    });

    it('should show error if no custom url', () => {
        $scope.page.type = 'page1';
        $scope.page.url = 'new';
        $scope.savePage(false);
        expect($translate).toHaveBeenCalledWith('page_no_url');
    });

    it('should updatePage on contentGet event', () => {
        Page.title = 'Updated Title';
        Page.description = 'Updated Description';
        Page.url = 'updated-url';
        Page.type = 'page2';
        Page.tags = ['newTag'];

        $rootScope.$broadcast('contentGet');
        $scope.$digest();

        expect($scope.page.title).toBe('Updated Title');
        expect($scope.page.description).toBe('Updated Description');
        expect($scope.page.url).toBe('updated-url');
        expect($scope.page.type).toBe('page2');
        expect($scope.page.tags).toEqual(['newTag']);
    });
});
```

### Tokens: {'input_tokens': 6309, 'output_tokens': 3327}
### Execution time: 35.97951602935791
