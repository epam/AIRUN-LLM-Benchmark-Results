I have the following application code that needs review and improvement:

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


Your task is to analyze the code and suggest enhancements focusing on the following aspects:
- Readability: Identify unclear parts and suggest clearer alternatives with code examples.
- Maintainability: Point out non-modular or hard-to-maintain structures and provide modular, maintainable code examples.
- Performance: Highlight performance issues and offer optimized code snippets.
- Accessibility: Suggest improvements for better accessibility with example code.
- Best Practices: Indicate deviations from best practices in the used tech stack (e.g., React, TypeScript) and correct them with code examples.
- Testing: Comment on testability and suggest testable code structures with example tests.
- Documentation: If documentation/comments are lacking or unclear, suggest better documentation with examples.

Provide answer in the next format:
## {Aspect 1}
### 1. {Name of the Issue}
{description}
Example
```<Code snippet or part of code with issue>```
Example of fixed issue - if applicable
```<Code snippet with fixed issue>``` - if applicable
## Run 1:
### Answer:
Below is a multi-aspect review of your AngularJS (1.x) code. Each section lists specific suggestions for improving readability, maintainability, performance, accessibility, best practices, testing, and documentation, with code examples illustrating possible fixes and patterns.

--------------------------------------------------------------------------------

## 1. Readability

### 1.1 Use Controller-As Syntax Instead of $scope
Using the “controller as” syntax (or binding methods directly to this) can improve clarity and reduce the “magic” of $scope. This also makes it clearer to see which controller members are being used.

Example of the issue:
```js
angular.module('cosmo').controller('pageCtrl', function($scope) {
    $scope.page = {
        title: '',
        description: ''
        // ...
    };

    $scope.savePage = function() {
        // ...
    };
});
```

Example of a fix:
```js
angular.module('cosmo').controller('PageCtrl', function(Page, REST) {
    const vm = this; 
    vm.page = {
        title: '',
        description: ''
        // ...
    };

    vm.savePage = function() {
        // ...
    };
});
```
Then in your template:
```html
<div ng-controller="PageCtrl as pageCtrl">
  <input type="text" ng-model="pageCtrl.page.title" />
</div>
```
This approach moves toward more modern Angular patterns and makes your code more readable.

--------------------------------------------------------------------------------

### 1.2 Prefer Named Functions Over Inline Anonymous Functions
Named functions help with readability and debugging (stack traces) as well as reusability.

Example of the issue:
```js
$scope.deleteNewerVersion = function(){
    angular.forEach(elements, function(value){
        localStorage.setItem($routeParams.url + value, null);
    });
    $scope.newerVersion = false;
};
```

Example of a fix (still in AngularJS style):
```js
function clearLocalStorage(elements, routeParamsUrl) {
    angular.forEach(elements, function(value) {
        localStorage.setItem(routeParamsUrl + value, null);
    });
}

$scope.deleteNewerVersion = function(){
    clearLocalStorage(elements, $routeParams.url);
    $scope.newerVersion = false;
};
```
This approach makes the code more readable and clearer to test.

--------------------------------------------------------------------------------

## 2. Maintainability

### 2.1 Separate Responsibilities into Smaller Services
Currently, the controller handles storage, data retrieval, form logic, and so on. You could move localStorage logic into a dedicated service. This keeps controllers focused on view logic and helps keep your code modular.

Example of a fix (localStorage service extraction):
```js
// localStorageService.js
angular.module('cosmo')
  .service('LocalStorageService', function() {
    this.saveItems = function(prefix, items) {
      items.forEach((item) => {
        localStorage.setItem(prefix + item.key, item.value);
      });
    };

    this.getItem = function(prefix, key) {
      return localStorage.getItem(prefix + key);
    };

    // Add more methods if needed
  });

// pageCtrl.js
angular.module('cosmo')
  .controller('pageCtrl', function(LocalStorageService) {
    // ...
    $scope.deleteNewerVersion = function(){
      const elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
      elements.forEach((elem) => LocalStorageService.saveItems($routeParams.url, [{key: elem, value: null}]));
      $scope.newerVersion = false;
    };
});
```
This design enables greater maintainability should your storage mechanism change in the future.

--------------------------------------------------------------------------------

### 2.2 Avoid Hard-Coding Multiple Resource Calls in One Controller
Multiple, separate $resource endpoints (e.g., 'content', 'contentTags', 'contentExtras', etc.) can be grouped in dedicated services. Each service then handles its own data domain. This simplifies controllers.

Example of a fix:
```js
// contentService.js
angular.module('cosmo')
  .service('ContentService', function(REST, $translate, $rootScope) {
    this.deleteContent = function(contentID) {
      // Perform multiple calls inside
      return REST.content.delete({ contentID }).$promise
        .then(() => REST.contentRevisions.delete({ contentID }).$promise)
        .then(() => REST.contentRevisionsExtras.delete({ contentID }).$promise)
        .then(() => REST.contentExtras.delete({ contentID }).$promise)
        .then(() => REST.contentTags.delete({ contentID }).$promise)
        .catch((err) => {
          $rootScope.$broadcast('notify', {message: err.message, classes: 'alert-error'});
        });
    };
  });

// pageCtrl.js
$scope.deletePage = function() {
    ContentService.deleteContent($scope.page.id)
      .then(() => $location.path('new'));
};
```
By grouping related calls into a service, your controller remains clean and maintainable.

--------------------------------------------------------------------------------

## 3. Performance

### 3.1 Reduce Watchers by Using “Bind Once” Syntax
AngularJS watchers can degrade performance when used extensively. Use one-time bindings ( :: ) where the data will not change again.

Example of improvement:
```html
<!-- Instead of {{ page.title }} -->
<h1 class="title">{{ ::page.title }}</h1>
```
If the title does not change after initial load, the one-time binding will reduce watchers.

--------------------------------------------------------------------------------

### 3.2 Bundle Resource Calls and Use Promises to Coordinate
When multiple consecutive $resource calls occur, chain them or group them in a single promise-based call or single service method, rather than having many separate watchers or calls. This reduces overhead and ensures your code only returns to the digest cycle once after the final call.

Example:
```js
// Combine multiple deletions in a single function in a service:
function deleteAllContentResources(contentID) {
  return REST.content.delete({ contentID }).$promise
    .then(() => REST.contentRevisions.delete({ contentID }).$promise)
    .then(() => REST.contentRevisionsExtras.delete({ contentID }).$promise)
    .then(() => REST.contentExtras.delete({ contentID }).$promise)
    .then(() => REST.contentTags.delete({ contentID }).$promise);
}
```
This approach keeps the digest cycle from firing repeatedly for each call.

--------------------------------------------------------------------------------

## 4. Accessibility

### 4.1 Add ARIA Labels and Attributes
For form elements and important buttons, add aria-label, aria-describedby, or roles to ensure accessibility for screen readers.

Example:
```html
<!-- Original button -->
<button class="btn-error" type="button" ng-click="deleteNewerVersion()"></button>

<!-- Improved for accessibility -->
<button 
  class="btn-error" 
  type="button" 
  ng-click="deleteNewerVersion()" 
  aria-label="Discard changes for newer version">
  Discard
</button>
```
This ensures screen readers can announce the button’s purpose clearly.

--------------------------------------------------------------------------------

### 4.2 Use Meaningful Text for Links and Buttons
Ensure that links (anchor tags) have descriptive text (or aria-label) rather than relying solely on icons.

Example:
```html
<!-- Possibly unclear for screen readers -->
<a ng-click="admin.active=false"><i class="fa fa-angle-left"></i></a>

<!-- Improved -->
<a ng-click="admin.active=false" aria-label="Go Back">
  <i class="fa fa-angle-left" aria-hidden="true"></i> 
  <span class="sr-only">Go Back</span>
</a>
```
The screen reader can announce “Go Back” instead of “left arrow icon.”

--------------------------------------------------------------------------------

## 5. Best Practices

### 5.1 Use Consistent Naming Conventions
Use consistent file naming, controller naming, and variable naming. For instance, “pageCtrl.js” should define “PageCtrl.” Mixed naming can create confusion.

Example:
```js
// In pageCtrl.js
angular.module('cosmo').controller('PageCtrl', ...
```
Keep naming consistent across files. Also, prefer PascalCase for controllers in AngularJS 1.x: “PageCtrl,” “UserCtrl,” etc.

--------------------------------------------------------------------------------

### 5.2 Use Modules Wisely (Avoid Overstuffed Modules)
It’s good practice to break distinct functionalities into different modules. For example, a “page” module for page functionality, a “user” module for user functionality, etc. This is especially helpful if the application grows.

--------------------------------------------------------------------------------

### 5.3 Migrate Toward Component-Based Architecture
Although AngularJS 1.x is older, you can still benefit from a component-based approach using .component() with isolates scopes, which leads to more organized code. This is particularly helpful if you plan to migrate later to modern Angular or another framework.

Example:
```js
angular
  .module('cosmo')
  .component('pageEditor', {
    bindings: { pageId: '<' },
    templateUrl: 'pageEditor.html',
    controller: 'PageEditorController'
  });
```

--------------------------------------------------------------------------------

## 6. Testing

### 6.1 Use Dependency Injection Properly for Easier Testing
By injecting services (e.g., LocalStorageService, ContentService) into the controller constructor, you can mock them easily in unit tests.

Example (Jasmine/Karma test for PageCtrl in AngularJS 1.x):
```js
describe('PageCtrl', function() {
  let $controller, $rootScope, PageCtrl, mockContentService, mockLocalStorageService;

  beforeEach(module('cosmo'));

  beforeEach(inject(function(_$controller_, _$rootScope_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;

    mockContentService = {
      deleteContent: jasmine.createSpy('deleteContent').and.returnValue(Promise.resolve())
    };
    mockLocalStorageService = {
      saveItems: jasmine.createSpy('saveItems')
    };

    PageCtrl = $controller('pageCtrl', {
      ContentService: mockContentService,
      LocalStorageService: mockLocalStorageService
    });
  }));

  it('should call ContentService.deleteContent on deletePage()', function() {
    PageCtrl.deletePage();
    expect(mockContentService.deleteContent).toHaveBeenCalled();
  });
});
```
Ensuring your controller logic is separated from external services makes your codebase more testable.

--------------------------------------------------------------------------------

### 6.2 Extract Complex Logic into Testable Functions
If you have logic that processes data in the controller, extracting it into a separate utility or service function helps unit test it thoroughly without spinning up the entire controller scope.

--------------------------------------------------------------------------------

## 7. Documentation

### 7.1 Provide JSDoc-Style Comments for Functions
Add more descriptive function-level comments that explain the method’s purpose, parameters, and return value. This is especially helpful for large functions.

Example:
```js
/**
 * Deletes the currently edited page and all its associated data.
 * @function deletePage
 * @param {Number} pageId - The ID of the page to delete.
 * @returns {Promise} - Resolves when all deletes complete.
 */
$scope.deletePage = function(pageId){
    // function body
};
```

### 7.2 Document Module and Factory Responsibilities
At the top of each AngularJS factory or service file, describe what that module or service is for, how it is intended to be used, and example usage. The initial comments in your code are good but can be more detailed about edge cases or expected parameters.

--------------------------------------------------------------------------------

By implementing these suggestions for readability, maintainability, performance, accessibility, best practices, testing, and documentation, your AngularJS code will be more robust, easier to navigate, and simpler to extend or refactor in the future.

### Tokens: {'input_tokens': 5505, 'output_tokens': 3040, 'reasoning_tokens': 576}
### Execution time: 29.234159231185913
