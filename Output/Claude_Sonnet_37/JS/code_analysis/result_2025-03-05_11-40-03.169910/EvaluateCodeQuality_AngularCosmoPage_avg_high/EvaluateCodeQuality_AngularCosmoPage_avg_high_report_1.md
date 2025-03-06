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
# Code Review and Improvement Suggestions

## Maintainability

### 1. REST Factory Lacks Organization
The REST factory contains a large number of endpoints without any logical grouping, making it difficult to maintain as the application grows.

Example
```js
angular.module('cosmo').factory('REST', ['$resource', 'Page', function($resource, Page) {
    return {
        'blocks': $resource('api/blocks/:blockID', { blockID: '@blockID'},{ update: { method: 'PUT' } }),
        'blocksRequirements': $resource('api/blocks/:blockID/requirements/:requirementID', { blockID: '@blockID', requirementID: '@requirementID'},{ update: { method: 'PUT' } }),
        // many more endpoints...
    };
}]);
```

Example of fixed issue
```js
angular.module('cosmo').factory('REST', ['$resource', 'Page', function($resource, Page) {
    // Base API configuration
    const baseConfig = {
        update: { method: 'PUT' }
    };
    
    // Group by resource type
    return {
        content: {
            main: $resource('api/content/:contentID', { contentID: '@contentID'}, baseConfig),
            extras: $resource('api/content/:contentID/extras/', { contentID: '@contentID'}),
            revisions: $resource('api/content/:contentID/revisions/:revisionID', 
                { contentID: '@contentID', revisionID: '@revisionID'}, baseConfig),
            revisionsExtras: $resource('api/content/:contentID/revisions/:revisionID/extras/:extraID', 
                { revisionID: '@revisionID', contentID: '@contentID', extraID: '@extraID'}),
            tags: $resource('api/content/:contentID/tags/', { contentID: '@contentID'})
        },
        blocks: {
            main: $resource('api/blocks/:blockID', { blockID: '@blockID'}, baseConfig),
            requirements: $resource('api/blocks/:blockID/requirements/:requirementID', 
                { blockID: '@blockID', requirementID: '@requirementID'}, baseConfig)
        },
        // Other resource groups...
    };
}]);
```

### 2. Page Controller is Too Large
The pageCtrl.js file contains a massive controller with too many responsibilities, making it difficult to maintain and test.

Example
```js
angular.module('cosmo').controller('pageCtrl', ['$scope', 'REST', '$location', 'Page', '$rootScope', '$routeParams', '$upload', 'Users', '$translate', function($scope, REST, $location, Page, $rootScope, $routeParams, $upload, Users, $translate){
    // Over 400 lines of code with multiple responsibilities
}]);
```

Example of fixed issue
```js
// Split into multiple services and smaller controllers

// pageService.js
angular.module('cosmo').service('PageService', ['REST', 'Users', function(REST, Users) {
    return {
        savePage: function(pageData, isNew) {
            // Logic for saving page
        },
        deletePage: function(pageId) {
            // Logic for deleting page
        },
        // Other page-related operations
    };
}]);

// localStorageService.js
angular.module('cosmo').service('LocalStorageService', [function() {
    return {
        savePageToLocalStorage: function(routeParam, pageData) {
            // Logic for saving to localStorage
        },
        getPageFromLocalStorage: function(routeParam) {
            // Logic for retrieving from localStorage
        },
        clearLocalStorage: function(routeParam) {
            // Logic for clearing localStorage
        }
    };
}]);

// pageCtrl.js - now much smaller
angular.module('cosmo').controller('pageCtrl', ['$scope', 'PageService', 'LocalStorageService', 'Page', '$rootScope', '$routeParams', '$translate', 
function($scope, PageService, LocalStorageService, Page, $rootScope, $routeParams, $translate){
    // Initialize controller with much less code
    // Delegate to services for complex operations
}]);
```

## Performance

### 1. Inefficient Data Handling in savePage Function
The savePage function makes multiple API calls sequentially and has nested callbacks, which is inefficient and can lead to performance issues.

Example
```js
$scope.savePage = function(duplicate) {
    // ... code ...
    
    // Create a new page or a duplicate
    if($location.path() === '/new' || duplicate){
        // Save content
        REST.content.save({
            // ... data ...
        }, newPagePromise, function(){ 
            // Error handling
        });
    } else { 
        // Update existing page
        REST.content.update({
            // ... data ...
        }, updatePagePromise, function(data){ 
            // Error handling
        });
    }
    
    // Multiple nested callbacks: newPagePromise, saveRevisionPromise, etc.
}
```

Example of fixed issue
```js
$scope.savePage = function(duplicate) {
    // Validate inputs first
    if (!validatePageData()) {
        return Promise.reject('Validation failed');
    }
    
    // Prepare data once
    const pageData = preparePageData();
    
    // Use promises for better flow control
    return (duplicate || $location.path() === '/new' ? 
        createNewPage(pageData) : 
        updateExistingPage(pageData))
        .then(savePageTags)
        .then(savePageRevision)
        .then(savePageExtras)
        .then(() => {
            $translate('saved').then(translatedText => {
                $rootScope.$broadcast('notify', {message: translatedText});
            });
            $location.path($scope.page.url);
        })
        .catch(error => {
            $translate('page_error_saving').then(translatedText => {
                $rootScope.$broadcast('notify', {message: translatedText, classes: 'alert-error'});
            });
        });
};

// Helper functions
function validatePageData() {
    // Validation logic
}

function preparePageData() {
    // Prepare data for saving
}

function createNewPage(pageData) {
    return REST.content.save(pageData).$promise;
}

// Other helper functions for each step
```

### 2. Inefficient DOM Manipulation
The controller directly manipulates the DOM and updates the view, which can be inefficient in Angular.

Example
```js
// Inefficient DOM updates through direct model changes
$scope.titleChange = function(){
    Page.title = $scope.page.title;
    if($scope.autoURL){
        $scope.page.url = $scope.page.title.toLowerCase().replace(/ /g, '-').replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
        Page.url = $scope.page.url;
    }
};
```

Example of fixed issue
```js
// Use a debounce function to limit updates
$scope.titleChange = _.debounce(function(){
    Page.title = $scope.page.title;
    if($scope.autoURL){
        $scope.page.url = generateUrlFromTitle($scope.page.title);
        Page.url = $scope.page.url;
    }
}, 300);

function generateUrlFromTitle(title) {
    return title.toLowerCase()
        .replace(/ /g, '-')
        .replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
}
```

## Readability

### 1. Complex Conditional Logic
The code contains complex conditional logic that is difficult to understand at a glance.

Example
```js
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
```

Example of fixed issue
```js
// Extract to a function with clear variable names and comments
function determineScheduleDate() {
    const now = Math.round(new Date().getTime()/1000);
    const isAlreadyPublished = $scope.page.publish === 'Y' && Page.publish === 'Y';
    const isPublishingNow = $scope.page.publish === 'Y' && !isAlreadyPublished;
    const isScheduled = $scope.page.publish === 'schedule';
    
    if (isAlreadyPublished) {
        // If already published, keep the original date
        return Page.scheduleDate;
    } else if (isPublishingNow) {
        // If publishing now, use current time
        return now;
    } else if (isScheduled) {
        // If scheduling for future, parse the date
        const scheduledTime = Date.parse($scope.page.scheduleDate).getTime()/1000;
        
        // Update publish status based on whether date is in past or future
        $scope.page.publish = (scheduledTime < now) ? 'Y' : 'N';
        
        return scheduledTime;
    }
    
    // Default case
    return null;
}

// Usage
const scheduleDate = determineScheduleDate();
```

### 2. Unclear Variable Names and Comments
Some variable names and comments are unclear or misleading.

Example
```js
// Initialize schedule date - Depreciate?
var date = new Date($scope.page.scheduleDate * 1000);
var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
var ampm = date.getHours() > 12 ? 'PM' : 'AM';
var formattedDate = date.getMonth() + 1 +'/'+ date.getDate() +'/'+ date.getFullYear() +' '+ hours +':'+ date.getMinutes() +' '+ ampm;
// $scope.page.scheduleDate = formattedDate;
```

Example of fixed issue
```js
/**
 * Formats a timestamp into a human-readable date string
 * Note: This function is currently not used but kept for reference
 * @param {number} timestamp - Unix timestamp in seconds
 * @return {string} Formatted date string (MM/DD/YYYY HH:MM AM/PM)
 */
function formatDateForDisplay(timestamp) {
    const date = new Date(timestamp * 1000);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours() % 12 || 12; // Convert 0 to 12 for 12 AM
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    
    return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
}

// Example usage (commented out as it's not currently used)
// const formattedScheduleDate = formatDateForDisplay($scope.page.scheduleDate);
```

## Accessibility

### 1. Missing ARIA Attributes
The HTML lacks proper ARIA attributes for accessibility.

Example
```html
<div class="cos-select">
    <select value="type" ng-change="updatePageType()" ng-model="page.type" ng-options="(themePage | themeFiles ) for themePage in page.themePages" required></select>
</div>
```

Example of fixed issue
```html
<div class="cos-select">
    <label for="pageType" class="sr-only" translate="type"></label>
    <select 
        id="pageType"
        name="pageType"
        aria-label="{{ 'type' | translate }}"
        ng-change="updatePageType()" 
        ng-model="page.type" 
        ng-options="(themePage | themeFiles ) for themePage in page.themePages" 
        required>
    </select>
</div>
```

### 2. Form Controls Without Proper Labels
Some form controls lack proper labels or associations.

Example
```html
<span class="num-count">{{page.title.length}}</span>
<label translate="title"></label>
<input type='text' ng-model="page.title" ng-keyup="titleChange()" placeholder="about us, contact us">
```

Example of fixed issue
```html
<div class="form-group">
    <label for="pageTitle" translate="title"></label>
    <span class="num-count" aria-live="polite" aria-label="{{ 'character_count' | translate }}">{{page.title.length}}</span>
    <input 
        type='text' 
        id="pageTitle"
        name="pageTitle"
        ng-model="page.title" 
        ng-keyup="titleChange()" 
        placeholder="about us, contact us"
        aria-describedby="titleHelpText">
    <small id="titleHelpText" class="form-text text-muted" translate="title_help_text"></small>
</div>
```

## Best Practices

### 1. Not Using Angular's $q Service for Promises
The code uses callbacks instead of Angular's $q service for handling asynchronous operations.

Example
```js
REST.content.save({
    // data
}, newPagePromise, function(){ // Error
    $translate('page_error_saving').then(function(translatedText){
        $rootScope.$broadcast('notify', {message: translatedText, classes: 'alert-error'});
    });
});
```

Example of fixed issue
```js
// Inject $q service
angular.module('cosmo').controller('pageCtrl', ['$scope', 'REST', '$location', 'Page', '$rootScope', '$routeParams', '$upload', 'Users', '$translate', '$q',
function($scope, REST, $location, Page, $rootScope, $routeParams, $upload, Users, $translate, $q){
    
    // Use promises
    function saveContent(contentData) {
        var deferred = $q.defer();
        
        REST.content.save(contentData, 
            function success(response) {
                deferred.resolve(response);
            },
            function error(response) {
                deferred.reject(response);
            }
        );
        
        return deferred.promise;
    }
    
    // Usage
    saveContent(contentData)
        .then(function(response) {
            // Handle success
            return saveRevision(response.id);
        })
        .catch(function(error) {
            // Handle error
            return $translate('page_error_saving')
                .then(function(translatedText) {
                    $rootScope.$broadcast('notify', {
                        message: translatedText, 
                        classes: 'alert-error'
                    });
                });
        });
}]);
```

### 2. Direct DOM Manipulation in Controller
The controller directly manipulates the DOM, which violates Angular's separation of concerns.

Example
```js
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
```

Example of fixed issue
```js
// Move DOM manipulation logic to a directive
angular.module('cosmo').directive('autoUrl', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            // Watch for changes to the source field
            scope.$watch(attrs.autoUrl, function(newValue) {
                if (!newValue) return;
                
                // Only auto-generate if enabled and target is empty
                if (scope.autoURL && (!ngModel.$viewValue || 
                    ngModel.$viewValue === 'new' || 
                    ngModel.$viewValue === '/new')) {
                    
                    // Generate URL from title
                    const url = newValue.toLowerCase()
                        .replace(/ /g, '-')
                        .replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
                    
                    // Update model
                    ngModel.$setViewValue(url);
                    ngModel.$render();
                }
            });
        }
    };
});

// Usage in HTML
<input type="text" ng-model="page.title" ng-change="titleChange()">
<input type="text" ng-model="page.url" auto-url="page.title">
```

## Testing

### 1. Lack of Testability
The controller has many dependencies and complex logic, making it difficult to test.

Example
```js
angular.module('cosmo').controller('pageCtrl', ['$scope', 'REST', '$location', 'Page', '$rootScope', '$routeParams', '$upload', 'Users', '$translate', 
function($scope, REST, $location, Page, $rootScope, $routeParams, $upload, Users, $translate){
    // Complex logic with many dependencies
}]);
```

Example of fixed issue
```js
// Create a service for business logic
angular.module('cosmo').service('PageService', ['REST', '$q', function(REST, $q) {
    return {
        savePage: function(pageData) {
            // Business logic for saving a page
            return $q.when(/* promise */);
        },
        // Other methods
    };
}]);

// Simplified controller
angular.module('cosmo').controller('pageCtrl', ['$scope', 'PageService', '$location', 
function($scope, PageService, $location){
    // Much simpler controller with fewer dependencies
    
    $scope.savePage = function() {
        return PageService.savePage($scope.page)
            .then(function(result) {
                // Handle success
            })
            .catch(function(error) {
                // Handle error
            });
    };
}]);

// Example test
describe('PageCtrl', function() {
    var $controller, $rootScope, $scope, PageService, $location;
    
    beforeEach(module('cosmo'));
    
    beforeEach(inject(function(_$controller_, _$rootScope_, _PageService_, _$location_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        PageService = _PageService_;
        $location = _$location_;
        
        $scope = $rootScope.$new();
        
        // Mock PageService
        spyOn(PageService, 'savePage').and.returnValue({
            then: function(callback) {
                callback({id: 123});
                return this;
            },
            catch: function() {
                return this;
            }
        });
        
        $controller('pageCtrl', {
            $scope: $scope,
            PageService: PageService,
            $location: $location
        });
    }));
    
    it('should call PageService.savePage when savePage is called', function() {
        $scope.page = {title: 'Test'};
        $scope.savePage();
        expect(PageService.savePage).toHaveBeenCalledWith($scope.page);
    });
});
```

### 2. No Unit Tests
There are no unit tests visible in the provided code.

Example of fixed issue
```js
// Example unit test for the PageService
describe('PageService', function() {
    var PageService, REST, $q, $rootScope;
    
    beforeEach(module('cosmo'));
    
    beforeEach(inject(function(_PageService_, _REST_, _$q_, _$rootScope_) {
        PageService = _PageService_;
        REST = _REST_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        
        // Mock REST service
        spyOn(REST.content, 'save').and.callFake(function(data, success) {
            success({id: 123});
            return {$promise: $q.when({id: 123})};
        });
    }));
    
    it('should save a page and return the result', function() {
        var pageData = {title: 'Test Page'};
        var result;
        
        PageService.savePage(pageData)
            .then(function(response) {
                result = response;
            });
        
        $rootScope.$digest(); // Resolve promises
        
        expect(REST.content.save).toHaveBeenCalledWith(pageData, jasmine.any(Function), jasmine.any(Function));
        expect(result.id).toBe(123);
    });
});
```

## Documentation

### 1. Inconsistent or Missing Documentation
The code has inconsistent or missing documentation, making it difficult to understand.

Example
```js
/**************************************************
 *                 REST Factory                   *
 *       Communicate with RESTful backend         *
 **************************************************/

angular.module('cosmo').factory('REST', ['$resource', 'Page', function($resource, Page) {
    // No documentation for individual endpoints
}]);
```

Example of fixed issue
```js
/**
 * REST Factory
 * Provides RESTful API communication services for the application
 * @module cosmo
 * @requires $resource
 * @requires Page
 */
angular.module('cosmo').factory('REST', ['$resource', 'Page', function($resource, Page) {
    // Base configuration for all resources
    const baseConfig = {
        update: { method: 'PUT' }
    };
    
    return {
        /**
         * Content resources
         * @namespace content
         */
        content: {
            /**
             * Main content endpoint
             * @method content.main
             * @param {Object} params - URL parameters
             * @param {number} params.contentID - ID of the content
             * @returns {$resource} Angular $resource object
             */
            main: $resource('api/content/:contentID', { contentID: '@contentID'}, baseConfig),
            
            /**
             * Content extras endpoint
             * @method content.extras
             * @param {Object} params - URL parameters
             * @param {number} params.contentID - ID of the content
             * @returns {$resource} Angular $resource object
             */
            extras: $resource('api/content/:contentID/extras/', { contentID: '@contentID'})
            
            // Additional endpoints with documentation
        },
        
        // Other resource groups with documentation
    };
}]);
```

### 2. Unclear Function Purpose
Some functions lack clear documentation about their purpose and parameters.

Example
```js
$scope.savePage = function(duplicate){
    // Complex function with no clear documentation
};
```

Example of fixed issue
```js
/**
 * Saves the current page to the database
 * 
 * This function handles both creating new pages and updating existing ones.
 * It also manages saving related data like tags, revisions, and extras.
 * 
 * @param {boolean} [duplicate=false] - If true, creates a duplicate of the current page
 * @returns {Promise} A promise that resolves when the page is saved
 */
$scope.savePage = function(duplicate = false) {
    // Implementation with clear comments for each section
    
    // 1. Validate input data
    if (!validatePageData()) {
        return $q.reject('Invalid page data');
    }
    
    // 2. Prepare page data for saving
    const pageData = preparePageData();
    
    // 3. Save or update the page based on whether it's new or existing
    // ...and so on
};
```

### Tokens: {'input_tokens': 6878, 'output_tokens': 6170}
### Execution time: 83.75812292098999
