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
## Run 4:
### Answer:
```ts
import { Page } from './page.js';
import { REST } from './rest.js';
import { Users } from './users.js';
import { PageCtrl } from './pageCtrl.js';

describe('PageCtrl', () => {
  let scope, location, rootScope, routeParams, upload, users, translate;

  beforeEach(() => {
    scope = {
      page: {
        id: 0,
        title: '',
        description: '',
        url: '',
        publish: 'Y',
        scheduleDate: new Date(),
        tags: [],
        type: '',
        themePages: []
      },
      newerVersion: false,
      autoURL: false
    };
    location = {
      path: jest.fn()
    };
    rootScope = {
      $broadcast: jest.fn()
    };
    routeParams = {
      url: 'new'
    };
    upload = {
      upload: jest.fn()
    };
    users = {
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
    translate = {
      then: jest.fn()
    };
  });

  describe('Initialization', () => {
    it('should initialize variables', () => {
      const pageCtrl = new PageCtrl(scope, REST, location, Page, rootScope, routeParams, upload, users, translate);
      expect(scope.page).toEqual({
        id: 0,
        title: '',
        description: '',
        url: '',
        publish: 'Y',
        scheduleDate: new Date(),
        tags: [],
        type: '',
        themePages: []
      });
      expect(scope.newerVersion).toBeFalsy();
      expect(scope.autoURL).toBeFalsy();
    });

    it('should set the date to today if no date was set', () => {
      routeParams.url = '/new';
      const pageCtrl = new PageCtrl(scope, REST, location, Page, rootScope, routeParams, upload, users, translate);
      expect(scope.page.scheduleDate).toEqual(new Date());
    });

    it('should not set the date to today if a date was set', () => {
      routeParams.url = '/not-new';
      const pageCtrl = new PageCtrl(scope, REST, location, Page, rootScope, routeParams, upload, users, translate);
      expect(scope.page.scheduleDate).not.toEqual(new Date());
    });

    it('should get the pages available to this theme', () => {
      const pageCtrl = new PageCtrl(scope, REST, location, Page, rootScope, routeParams, upload, users, translate);
      expect(scope.page.themePages).toEqual(Page.themePages);
    });

    it('should initialize the page type', () => {
      const pageCtrl = new PageCtrl(scope, REST, location, Page, rootScope, routeParams, upload, users, translate);
      expect(scope.page.type).toEqual(Page.type);
    });

    it('should set the page type to the first theme page if no type was set', () => {
      Page.type = null;
      const pageCtrl = new PageCtrl(scope, REST, location, Page, rootScope, routeParams, upload, users, translate);
      expect(scope.page.type).toEqual(Page.themePages[0]);
    });

    it('should check if there is an unsaved version from a previous session', () => {
      localStorage.setItem('newtitle', 'new title');
      const pageCtrl = new PageCtrl(scope, REST, location, Page, rootScope, routeParams, upload, users, translate);
      expect(scope.newerVersion).toBeTruthy();
    });

    it('should not check if there is an unsaved version from a previous session if the location is /new', () => {
      routeParams.url = '/new';
      localStorage.setItem('newtitle', 'new title');
      const pageCtrl = new PageCtrl(scope, REST, location, Page, rootScope, routeParams, upload, users, translate);
      expect(scope.newerVersion).toBeFalsy();
    });
  });

  describe('Methods', () => {
    let pageCtrl;

    beforeEach(() => {
      pageCtrl = new PageCtrl(scope, REST, location, Page, rootScope, routeParams, upload, users, translate);
    });

    describe('localVersion', () => {
      it('should revert to the previously saved version', () => {
        localStorage.setItem('newtitle', 'new title');
        localStorage.setItem('newdescription', 'new description');
        localStorage.setItem('newpublish', 'N');
        localStorage.setItem('newscheduleDate', '2023-03-08T16:30:00.000Z');
        localStorage.setItem('newheader', 'new header');
        localStorage.setItem('newsubheader', 'new subheader');
        localStorage.setItem('newbody', 'new body');
        localStorage.setItem('newurl', 'new url');
        pageCtrl.localVersion();
        expect(scope.page.title).toEqual('new title');
        expect(scope.page.description).toEqual('new description');
        expect(scope.page.publish).toEqual('N');
        expect(scope.page.scheduleDate).toEqual(new Date('2023-03-08T16:30:00.000Z'));
        expect(Page.header).toEqual('new header');
        expect(Page.subheader).toEqual('new subheader');
        expect(Page.body).toEqual('new body');
        expect(scope.page.url).toEqual('new url');
        expect(scope.newerVersion).toBeFalsy();
      });

      it('should clear the local storage items', () => {
        localStorage.setItem('newtitle', 'new title');
        localStorage.setItem('newdescription', 'new description');
        localStorage.setItem('newpublish', 'N');
        localStorage.setItem('newscheduleDate', '2023-03-08T16:30:00.000Z');
        localStorage.setItem('newheader', 'new header');
        localStorage.setItem('newsubheader', 'new subheader');
        localStorage.setItem('newbody', 'new body');
        localStorage.setItem('newurl', 'new url');
        pageCtrl.localVersion();
        expect(localStorage.getItem('newtitle')).toBeNull();
        expect(localStorage.getItem('newdescription')).toBeNull();
        expect(localStorage.getItem('newpublish')).toBeNull();
        expect(localStorage.getItem('newscheduleDate')).toBeNull();
        expect(localStorage.getItem('newheader')).toBeNull();
        expect(localStorage.getItem('newsubheader')).toBeNull();
        expect(localStorage.getItem('newbody')).toBeNull();
        expect(localStorage.getItem('newurl')).toBeNull();
      });
    });

    describe('deleteNewerVersion', () => {
      it('should delete the newer version', () => {
        localStorage.setItem('newtitle', 'new title');
        localStorage.setItem('newdescription', 'new description');
        localStorage.setItem('newpublish', 'N');
        localStorage.setItem('newscheduleDate', '2023-03-08T16:30:00.000Z');
        localStorage.setItem('newheader', 'new header');
        localStorage.setItem('newsubheader', 'new subheader');
        localStorage.setItem('newbody', 'new body');
        localStorage.setItem('newurl', 'new url');
        pageCtrl.deleteNewerVersion();
        expect(localStorage.getItem('newtitle')).toBeNull();
        expect(localStorage.getItem('newdescription')).toBeNull();
        expect(localStorage.getItem('newpublish')).toBeNull();
        expect(localStorage.getItem('newscheduleDate')).toBeNull();
        expect(localStorage.getItem('newheader')).toBeNull();
        expect(localStorage.getItem('newsubheader')).toBeNull();
        expect(localStorage.getItem('newbody')).toBeNull();
        expect(localStorage.getItem('newurl')).toBeNull();
        expect(scope.newerVersion).toBeFalsy();
      });
    });

    describe('deletePage', () => {
      it('should delete the page', () => {
        REST.content.delete = jest.fn().mockImplementation((data, callback) => {
          callback();
        });
        REST.contentRevisions.delete = jest.fn();
        REST.contentRevisionsExtras.delete = jest.fn();
        REST.contentExtras.delete = jest.fn();
        REST.contentTags.delete = jest.fn();
        pageCtrl.deletePage();
        expect(REST.content.delete).toHaveBeenCalledWith({ contentID: scope.page.id }, expect.any(Function));
        expect(REST.contentRevisions.delete).toHaveBeenCalledWith({ contentID: scope.page.id });
        expect(REST.contentRevisionsExtras.delete).toHaveBeenCalledWith({ contentID: scope.page.id });
        expect(REST.contentExtras.delete).toHaveBeenCalledWith({ contentID: scope.page.id });
        expect(REST.contentTags.delete).toHaveBeenCalledWith({ contentID: scope.page.id });
        expect(location.path).toHaveBeenCalledWith('new');
      });

      it('should display a success message', () => {
        translate.then = jest.fn().mockImplementation((translatedText) => {
          return translatedText;
        });
        pageCtrl.deletePage();
        expect(rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'deleted' });
      });
    });

    describe('updatePage', () => {
      it('should update the page variables', () => {
        Page.title = 'new title';
        Page.description = 'new description';
        Page.url = 'new url';
        Page.type = 'new type';
        Page.tags = ['new tag'];
        pageCtrl.updatePage();
        expect(scope.page.title).toEqual('new title');
        expect(scope.page.description).toEqual('new description');
        expect(scope.page.url).toEqual('new url');
        expect(scope.page.type).toEqual('new type');
        expect(scope.page.tags).toEqual(['new tag']);
      });
    });

    describe('updatePageType', () => {
      it('should update the page type', () => {
        scope.page.type = 'new type';
        pageCtrl.updatePageType();
        expect(Page.type).toEqual('new type');
        expect(rootScope.$broadcast).toHaveBeenCalledWith('settingsGet');
      });
    });

    describe('titleChange', () => {
      it('should log changes to the Page object', () => {
        scope.page.title = 'new title';
        pageCtrl.titleChange();
        expect(Page.title).toEqual('new title');
      });

      it('should only auto-generate urls for new pages', () => {
        routeParams.url = '/new';
        scope.page.url = '/new';
        pageCtrl.titleChange();
        expect(scope.autoURL).toBeTruthy();
      });

      it('should not auto-generate urls for existing pages', () => {
        routeParams.url = '/not-new';
        scope.page.url = '/not-new';
        pageCtrl.titleChange();
        expect(scope.autoURL).toBeFalsy();
      });

      it('should auto-generate the url from the title', () => {
        routeParams.url = '/new';
        scope.page.title = 'new title';
        pageCtrl.titleChange();
        expect(scope.page.url).toEqual('new-title');
        expect(Page.url).toEqual('new-title');
      });

      it('should remove spaces, convert to lowercase, and remove punctuation from the url', () => {
        routeParams.url = '/new';
        scope.page.title = 'new title with spaces and punctuation';
        pageCtrl.titleChange();
        expect(scope.page.url).toEqual('newtitlewithspacesandpunctuation');
        expect(Page.url).toEqual('newtitlewithspacesandpunctuation');
      });
    });

    describe('descriptionChange', () => {
      it('should save changes to the description', () => {
        scope.page.description = 'new description';
        pageCtrl.descriptionChange();
        expect(Page.description).toEqual('new description');
      });
    });

    describe('urlChange', () => {
      it('should save changes to the url', () => {
        scope.page.url = 'new url';
        pageCtrl.urlChange();
        expect(Page.url).toEqual('new url');
      });
    });

    describe('saveLocal', () => {
      it('should update page variables when they are changed', () => {
        scope.page.title = 'new title';
        scope.page.description = 'new description';
        scope.page.url = 'new url';
        scope.page.type = 'new type';
        pageCtrl.saveLocal();
        expect(Page.title).toEqual('new title');
        expect(Page.description).toEqual('new description');
        expect(Page.url).toEqual('new url');
        expect(Page.type).toEqual('new type');
      });

      it('should save to local storage', () => {
        scope.page.title = 'new title';
        scope.page.description = 'new description';
        scope.page.url = 'new url';
        scope.page.type = 'new type';
        pageCtrl.saveLocal();
        expect(localStorage.getItem('newtitle')).toEqual('new title');
        expect(localStorage.getItem('newdescription')).toEqual('new description');
        expect(localStorage.getItem('newurl')).toEqual('new url');
        expect(localStorage.getItem('newtype')).toEqual('new type');
      });
    });

    describe('autocompleteTags', () => {
      it('should autocomplete tags', () => {
        REST.contentTags.query = jest.fn().mockImplementation((data, callback) => {
          callback(['new tag']);
        });
        scope.page.tags = ['new tag'];
        pageCtrl.autocompleteTags();
        expect(REST.contentTags.query).toHaveBeenCalledWith({ tag: 'new tag' }, expect.any(Function));
        expect(scope.page.suggestions).toEqual(['new tag']);
      });

      it('should not autocomplete tags if there is no tag', () => {
        scope.page.tags = [];
        pageCtrl.autocompleteTags();
        expect(REST.contentTags.query).not.toHaveBeenCalled();
        expect(scope.page.suggestions).toEqual([]);
      });
    });

    describe('selectSuggestion', () => {
      it('should select a tag from autocomplete', () => {
        scope.page.tags = ['new tag'];
        pageCtrl.selectSuggestion('new tag 2');
        expect(scope.page.tags).toEqual(['new tag', 'new tag 2', '']);
        expect(scope.page.suggestions).toEqual([]);
      });
    });

    describe('savePage', () => {
      let newPagePromise, updatePagePromise, saveRevisionPromise, saveExtrasPromise;

      beforeEach(() => {
        newPagePromise = jest.fn();
        updatePagePromise = jest.fn();
        saveRevisionPromise = jest.fn();
        saveExtrasPromise = jest.fn();
        REST.content.save = jest.fn().mockImplementation((data, callback) => {
          callback(data);
        });
        REST.content.update = jest.fn().mockImplementation((data, callback) => {
          callback(data);
        });
        REST.contentRevisions.save = jest.fn().mockImplementation((data, callback) => {
          callback(data);
        });
        REST.contentRevisionsExtras.save = jest.fn().mockImplementation((data, callback) => {
          callback(data);
        });
        REST.contentExtras.save = jest.fn().mockImplementation((data, callback) => {
          callback(data);
        });
        REST.contentTags.save = jest.fn();
        translate.then = jest.fn().mockImplementation((translatedText) => {
          return translatedText;
        });
      });

      it('should check for duplicate URL', () => {
        location.path = jest.fn().mockReturnValue('/new');
        scope.page.url = '/new';
        pageCtrl.savePage();
        expect(rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'page_different_url', classes: 'alert-error' });
      });

      it('should check for missing page type', () => {
        scope.page.type = null;
        pageCtrl.savePage();
        expect(rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'page_no_type_selected', classes: 'alert-error' });
      });

      it('should set the header to the title if there is no custom header', () => {
        scope.page.title = 'new title';
        Page.header = null;
        pageCtrl.savePage();
        expect(Page.header).toEqual('new title');
      });

      it('should check for missing url', () => {
        scope.page.url = '';
        pageCtrl.savePage();
        expect(rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'page_no_url', classes: 'alert-error' });
      });

      it('should get the scheduled date to publish', () => {
        scope.page.publish = 'Y';
        Page.publish = 'Y';
        pageCtrl.savePage();
        expect(scheduleDate).toEqual(Page.scheduleDate);
      });

      it('should set the publish date to the current time if publishing now', () => {
        scope.page.publish = 'Y';
        Page.publish = 'N';
        pageCtrl.savePage();
        expect(scheduleDate).toEqual(Math.round(+new Date().getTime()/1000));
      });

      it('should set the publish date to the scheduled date if scheduling', () => {
        scope.page.publish = 'schedule';
        scope.page.scheduleDate = '2023-03-08T16:30:00.000Z';
        pageCtrl.savePage();
        expect(scheduleDate).toEqual(Date.parse('2023-03-08T16:30:00.000Z').getTime()/1000);
      });

      it('should check if the scheduled date is back dated', () => {
        scope.page.publish = 'schedule';
        scope.page.scheduleDate = '2022-03-08T16:30:00.000Z';
        pageCtrl.savePage();
        expect(scope.page.publish).toEqual('Y');
      });

      it('should get the featured image URL', () => {
        Page.extras.featured = { src: 'new src' };
        pageCtrl.savePage();
        expect(featured).toEqual('new src');
      });

      it('should create a new page or a duplicate', () => {
        location.path = jest.fn().mockReturnValue('/new');
        pageCtrl.savePage();
        expect(REST.content.save).toHaveBeenCalledWith({
          title: scope.page.title,
          description: scope.page.description,
          header: Page.header,
          subheader: Page.subheader,
          featured: featured,
          body: Page.body,
          url: scope.page.url,
          type: scope.page.type,
          published: scope.page.publish,
          published_date: scheduleDate,
          author: Users.id
        }, newPagePromise, expect.any(Function));
      });

      it('should update the page after a new page was saved', () => {
        location.path = jest.fn().mockReturnValue('/new');
        REST.content.save = jest.fn().mockImplementation((data, callback) => {
          callback({ id: 1 });
        });
        pageCtrl.savePage();
        expect(scope.page.id).toEqual(1);
        expect(scope.autoURL).toBeFalsy();
      });

      it('should save new tags', () => {
        scope.page.tags = ['new tag'];
        pageCtrl.savePage();
        expect(REST.contentTags.save).toHaveBeenCalledWith({ contentID: 1, tag: 'new tag' });
      });

      it('should save page as a revision', () => {
        location.path = jest.fn().mockReturnValue('/new');
        REST.content.save = jest.fn().mockImplementation((data, callback) => {
          callback({ id: 1 });
        });
        pageCtrl.savePage();
        expect(REST.contentRevisions.save).toHaveBeenCalledWith({
          contentID: 1,
          title: scope.page.title,
          description: scope.page.description,
          header: Page.header,
          subheader: Page.subheader,
          featured: featured,
          body: Page.body,
          url: scope.page.url,
          type: scope.page.type,
          published: scope.page.publish,
          published_date: scheduleDate,
          author: Users.id
        }, saveRevisionPromise);
      });

      it('should update the page after saving a page revision', () => {
        location.path = jest.fn().mockReturnValue('/new');
        REST.content.save = jest.fn().mockImplementation((data, callback) => {
          callback({ id: 1 });
        });
        REST.contentRevisions.save = jest.fn().mockImplementation((data, callback) => {
          callback({ id: 2 });
        });
        pageCtrl.savePage();
        expect(revisionID).toEqual(2);
      });

      it('should delete old tags', () => {
        location.path = jest.fn().mockReturnValue('/not-new');
        REST.content.update = jest.fn().mockImplementation((data, callback) => {
          callback({ id: 1 });
        });
        REST.contentRevisions.save = jest.fn().mockImplementation((data, callback) => {
          callback({ id: 2 });
        });
        pageCtrl.savePage();
        expect(REST.contentTags.delete).toHaveBeenCalledWith({ contentID: 1 }, expect.any(Function));
      });

      it('should save new tags', () => {
        location.path = jest.fn().mockReturnValue('/not-new');
        REST.content.update = jest.fn().mockImplementation((data, callback) => {
          callback({ id: 1 });
        });
        REST.contentRevisions.save = jest.fn().mockImplementation((data, callback) => {
          callback({ id: 2 });
        });
        scope.page.tags = ['new tag'];
        pageCtrl.savePage();
        expect(REST.contentTags.save).toHaveBeenCalledWith({ contentID: 1, tag: 'new tag' });
      });

      it('should save page as a revision', () => {
        location.path = jest.fn().mockReturnValue('/not-new');
        REST.content.update = jest.fn().mockImplementation((data, callback) => {
          callback({ id: 1 });
        });
        pageCtrl.savePage();
        expect(REST.contentRevisions.save).toHaveBeenCalledWith({
          contentID: 1,
          title: scope.page.title,
          description: scope.page.description,
          header: Page.header,
          subheader: Page.subheader,
          featured: featured,
          body: Page.body,
          url: scope.page.url,
          type: scope.page.type,
          published: scope.page.publish,
          published_date: scope.page.scheduleDate,
          author: Users.id
        }, savePageRevisionPromise);
      });

      it('should delete old extras', () => {
        location.path = jest.fn().mockReturnValue('/not-new');
        REST.content.update = jest.fn().mockImplementation((data, callback) => {
          callback({ id: 1 });
        });
        REST.contentRevisions.save = jest.fn().mockImplementation((data, callback) => {
          callback({ id: 2 });
        });
        pageCtrl.savePage();
        expect(REST.contentExtras.delete).toHaveBeenCalledWith({ contentID: 1 }, expect.any(Function));
      });

      it('should save additional data', () => {
        location.path = jest.fn().mockReturnValue('/not-new');
        REST.content.update = jest.fn().mockImplementation((data, callback) => {
          callback({ id: 1 });
        });
        REST.contentRevisions.save = jest.fn().mockImplementation((data, callback) => {
          callback({ id: 2 });
        });
        Page.extras = {
          newExtra: 'new value'
        };
        pageCtrl.savePage();
        expect(REST.contentExtras.save).toHaveBeenCalledWith({
          contentID: 1,
          name: 'newExtra',
          extra: 'new value'
        }, saveExtrasPromise, saveExtrasPromise);
      });

      it('should save additional data to revisions', () => {
        location.path = jest.fn().mockReturnValue('/not-new');
        REST.content.update = jest.fn().mockImplementation((data, callback) => {
          callback({ id: 1 });
        });
        REST.contentRevisions.save = jest.fn().mockImplementation((data, callback) => {
          callback({ id: 2 });
        });
        Page.extras = {
          newExtra: 'new value'
        };
        pageCtrl.savePage();
        expect(REST.contentRevisionsExtras.save).toHaveBeenCalledWith({
          revisionID: 2,
          contentID: 1,
          name: 'newExtra',
          extra: 'new value'
        });
      });

      it('should notify the user after saving the last extra', () => {
        location.path = jest.fn().mockReturnValue('/not-new');
        REST.content.update = jest.fn().mockImplementation((data, callback) => {
          callback({ id: 1 });
        });
        REST.contentRevisions.save = jest.fn().mockImplementation((data, callback) => {
          callback({ id: 2 });
        });
        Page.extras = {
          newExtra1: 'new value 1',
          newExtra2: 'new value 2'
        };
        pageCtrl.savePage();
        expect(rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'page_updated' });
      });

      it('should notify the user after saving a new page', () => {
        location.path = jest.fn().mockReturnValue('/new');
        REST.content.save = jest.fn().mockImplementation((data, callback) => {
          callback({ id: 1 });
        });
        REST.contentRevisions.save = jest.fn().mockImplementation((data, callback) => {
          callback({ id: 2 });
        });
        pageCtrl.savePage();
        expect(rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'page_created' });
      });

      it('should notify the user after updating a page', () => {
        location.path = jest.fn().mockReturnValue('/not-new');
        REST.content.update = jest.fn().mockImplementation((data, callback) => {
          callback({ id: 1 });
        });
        REST.contentRevisions.save = jest.fn().mockImplementation((data, callback) => {
          callback({ id: 2 });
        });
        pageCtrl.savePage();
        expect(rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'page_updated' });
      });
    });
  });
});
```
### Tokens: {'prompt_tokens': 6308, 'completion_tokens': 6575, 'total_tokens': 12883}
### Execution time: 62.31085181236267
