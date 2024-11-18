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
## Run 2:
### Answer:
Here's the unit test code for the provided codebase using Jasmine and Angular's ngMock module:

```typescript
// rest.spec.js
describe('REST Factory', () => {
  let REST: any;
  let $resource: any;

  beforeEach(() => {
    angular.mock.module('cosmo');
    angular.mock.inject((_REST_, _$resource_) => {
      REST = _REST_;
      $resource = _$resource_;
    });
  });

  it('should define the expected resources', () => {
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

  it('should configure the resources with the correct URLs and methods', () => {
    expect($resource).toHaveBeenCalledWith('api/blocks/:blockID', { blockID: '@blockID' }, { update: { method: 'PUT' } });
    expect($resource).toHaveBeenCalledWith('api/blocks/:blockID/requirements/:requirementID', { blockID: '@blockID', requirementID: '@requirementID' }, { update: { method: 'PUT' } });
    expect($resource).toHaveBeenCalledWith('api/comments/:commentID', { commentID: '@commentID' }, { update: { method: 'PUT' } });
    expect($resource).toHaveBeenCalledWith('api/content/:contentID', { contentID: '@contentID' }, { update: { method: 'PUT' } });
    expect($resource).toHaveBeenCalledWith('api/content/:contentID/extras/', { contentID: '@contentID' });
    expect($resource).toHaveBeenCalledWith('api/content/:contentID/revisions/:revisionID', { contentID: '@contentID', revisionID: '@revisionID' }, { update: { method: 'PUT' } });
    expect($resource).toHaveBeenCalledWith('api/content/:contentID/revisions/:revisionID/extras/:extraID', { revisionID: '@revisionID', contentID: '@contentID', extraID: '@extraID' });
    expect($resource).toHaveBeenCalledWith('api/content/:contentID/tags/', { contentID: '@contentID' });
    expect($resource).toHaveBeenCalledWith('api/files/:fileID', { fileID: '@fileID' }, { update: { method: 'PUT' } });
    expect($resource).toHaveBeenCalledWith('api/files/:fileID/tag/:tag', { fileID: '@fileID', tag: '@tag' }, { update: { method: 'PUT' } });
    expect($resource).toHaveBeenCalledWith('api/menus/:menuID', { menuID: '@menuID' }, { update: { method: 'PUT' } });
    expect($resource).toHaveBeenCalledWith('api/modules/:moduleID', { moduleID: '@moduleID' }, { update: { method: 'PUT' } });
    expect($resource).toHaveBeenCalledWith('api/sitemaps/');
    expect($resource).toHaveBeenCalledWith('api/themes/:themeID', { themeID: '@themeID' }, { update: { method: 'PUT' } });
    expect($resource).toHaveBeenCalledWith('api/settings/', {}, { update: { method: 'PUT' } });
    expect($resource).toHaveBeenCalledWith('api/users/:userID', { userID: '@userID' }, { update: { method: 'PUT' } });
  });
});

// page.spec.js
describe('Page Factory', () => {
  let Page: any;

  beforeEach(() => {
    angular.mock.module('cosmo');
    angular.mock.inject((_Page_) => {
      Page = _Page_;
    });
  });

  it('should initialize the Page object with default values', () => {
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

// users.spec.js
describe('Users Factory', () => {
  let Users: any;

  beforeEach(() => {
    angular.mock.module('cosmo');
    angular.mock.inject((_Users_) => {
      Users = _Users_;
    });
  });

  it('should initialize the Users object with default values', () => {
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

// pageCtrl.spec.js
describe('pageCtrl', () => {
  let $scope: any;
  let $controller: any;
  let $location: any;
  let $rootScope: any;
  let $routeParams: any;
  let $translate: any;
  let REST: any;
  let Page: any;
  let Users: any;

  beforeEach(() => {
    angular.mock.module('cosmo');
    angular.mock.inject((_$controller_, _$rootScope_, _$location_, _$routeParams_, _$translate_, _REST_, _Page_, _Users_) => {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $location = _$location_;
      $routeParams = _$routeParams_;
      $translate = _$translate_;
      REST = _REST_;
      Page = _Page_;
      Users = _Users_;
    });
  });

  it('should initialize the page object with default values', () => {
    $controller('pageCtrl', { $scope });
    expect($scope.page.id).toBe(Page.id);
    expect($scope.page.title).toBe(Page.title);
    expect($scope.page.description).toBe(Page.description);
    expect($scope.page.url).toBe(Page.url);
    expect($scope.page.publish).toBe(Page.publish);
    expect($scope.page.scheduleDate).toBeDefined();
    expect($scope.page.tags).toBe(Page.tags);
    expect($scope.page.type).toBe(Page.type);
    expect($scope.page.themePages).toEqual([]);
  });

  it('should set the page type to the first theme page if not set', () => {
    Page.type = null;
    Page.themePages = ['page1', 'page2'];
    $controller('pageCtrl', { $scope });
    expect($scope.page.type).toBe('page1');
  });

  it('should check for an unsaved version from a previous session', () => {
    spyOn(localStorage, 'getItem').and.returnValue('unsaved value');
    $routeParams.url = 'test-url';
    $controller('pageCtrl', { $scope });
    expect($scope.newerVersion).toBe(true);
  });

  it('should revert to the previously saved version', () => {
    spyOn(localStorage, 'getItem').and.returnValue('saved value');
    spyOn(localStorage, 'setItem');
    $routeParams.url = 'test-url';
    $controller('pageCtrl', { $scope });
    $scope.localVersion();
    expect(Page.title).toBe('saved value');
    expect(Page.description).toBe('saved value');
    expect(Page.publish).toBe('saved value');
    expect(Page.scheduleDate).toBe('saved value');
    expect(Page.header).toBe('saved value');
    expect(Page.subheader).toBe('saved value');
    expect(Page.body).toBe('saved value');
    expect(Page.url).toBe('saved value');
    expect($scope.newerVersion).toBe(false);
    expect($rootScope.$broadcast).toHaveBeenCalledWith('contentGet');
  });

  it('should delete the newer version', () => {
    spyOn(localStorage, 'setItem');
    $controller('pageCtrl', { $scope });
    $scope.deleteNewerVersion();
    expect(localStorage.setItem).toHaveBeenCalledTimes(8);
    expect($scope.newerVersion).toBe(false);
  });

  it('should delete the page', () => {
    $scope.page.id = 1;
    spyOn(REST.content, 'delete').and.callFake((params, success) => {
      success();
    });
    spyOn(REST.contentRevisions, 'delete');
    spyOn(REST.contentRevisionsExtras, 'delete');
    spyOn(REST.contentExtras, 'delete');
    spyOn(REST.contentTags, 'delete');
    spyOn($location, 'path');
    $controller('pageCtrl', { $scope });
    $scope.deletePage();
    expect(REST.content.delete).toHaveBeenCalledWith({ contentID: 1 }, jasmine.any(Function));
    expect($translate).toHaveBeenCalledWith('deleted');
    expect(REST.contentRevisions.delete).toHaveBeenCalledWith({ contentID: 1 });
    expect(REST.contentRevisionsExtras.delete).toHaveBeenCalledWith({ contentID: 1 });
    expect(REST.contentExtras.delete).toHaveBeenCalledWith({ contentID: 1 });
    expect(REST.contentTags.delete).toHaveBeenCalledWith({ contentID: 1 });
    expect($location.path).toHaveBeenCalledWith('new');
  });

  it('should update the page type', () => {
    $controller('pageCtrl', { $scope });
    $scope.page.type = 'new-type';
    $scope.updatePageType();
    expect(Page.type).toBe('new-type');
    expect($rootScope.$broadcast).toHaveBeenCalledWith('settingsGet');
  });

  it('should auto-generate the URL from the title for new pages', () => {
    $scope.page.url = '/new';
    $scope.page.title = 'Test Title!';
    $controller('pageCtrl', { $scope });
    $scope.titleChange();
    expect($scope.autoURL).toBe(true);
    expect($scope.page.url).toBe('test-title');
    expect(Page.url).toBe('test-title');
  });

  it('should save changes to the description', () => {
    $controller('pageCtrl', { $scope });
    $scope.page.description = 'New description';
    $scope.descriptionChange();
    expect(Page.description).toBe('New description');
  });

  it('should save changes to the URL', () => {
    $controller('pageCtrl', { $scope });
    $scope.page.url = 'new-url';
    $scope.urlChange();
    expect(Page.url).toBe('new-url');
  });

  it('should save page variables locally', () => {
    spyOn(localStorage, 'setItem');
    $routeParams.url = 'test-url';
    $controller('pageCtrl', { $scope });
    $scope.page.title = 'Test Title';
    $scope.page.description = 'Test Description';
    $scope.page.url = 'test-url';
    $scope.page.type = 'test-type';
    $scope.saveLocal();
    expect(Page.title).toBe('Test Title');
    expect(Page.description).toBe('Test Description');
    expect(Page.url).toBe('test-url');
    expect(Page.type).toBe('test-type');
    expect(localStorage.setItem).toHaveBeenCalledWith('test-urltitle', 'Test Title');
    expect(localStorage.setItem).toHaveBeenCalledWith('test-urldescription', 'Test Description');
    expect(localStorage.setItem).toHaveBeenCalledWith('test-urlurl', 'test-url');
    expect(localStorage.setItem).toHaveBeenCalledWith('test-urlpublish', Page.publish);
    expect(localStorage.setItem).toHaveBeenCalledWith('test-urlscheduleDate', Page.scheduleDate);
    expect(localStorage.setItem).toHaveBeenCalledWith('test-urltype', 'test-type');
  });

  it('should autocomplete tags', () => {
    spyOn(REST.contentTags, 'query').and.callFake((params, success) => {
      success(['tag1', 'tag2']);
    });
    $controller('pageCtrl', { $scope });
    $scope.page.tags = ['tag'];
    $scope.autocompleteTags();
    expect(REST.contentTags.query).toHaveBeenCalledWith({ tag: 'tag' }, jasmine.any(Function), jasmine.any(Function));
    expect($scope.page.suggestions).toEqual(['tag1', 'tag2']);
  });

  it('should select a tag from autocomplete', () => {
    $controller('pageCtrl', { $scope });
    $scope.page.tags = ['tag1', 'tag2', ''];
    $scope.selectSuggestion('tag3');
    expect($scope.page.tags).toEqual(['tag1', 'tag2', 'tag3', '']);
    expect($scope.page.suggestions).toEqual([]);
  });

  it('should save a new page', () => {
    spyOn(REST.content, 'save').and.callFake((params, success) => {
      success({ id: 1 });
    });
    spyOn(REST.contentTags, 'save');
    spyOn(REST.contentRevisions, 'save').and.callFake((params, success) => {
      success({ id: 1 });
    });
    spyOn(REST.contentExtras, 'save').and.callFake((params, success) => {
      success();
    });
    spyOn(REST.contentRevisionsExtras, 'save');
    spyOn($location, 'path').and.returnValue('/new');
    $controller('pageCtrl', { $scope });
    $scope.page.title = 'Test Title';
    $scope.page.description = 'Test Description';
    $scope.page.url = 'test-url';
    $scope.page.type = 'test-type';
    $scope.page.tags = ['tag1', 'tag2'];
    $scope.savePage();
    expect(REST.content.save).toHaveBeenCalledWith({
      title: 'Test Title',
      description: 'Test Description',
      header: Page.header,
      subheader: Page.subheader,
      featured:

### Tokens: {'input_tokens': 6739, 'output_tokens': 4096}
### Execution time: 124.8641049861908
