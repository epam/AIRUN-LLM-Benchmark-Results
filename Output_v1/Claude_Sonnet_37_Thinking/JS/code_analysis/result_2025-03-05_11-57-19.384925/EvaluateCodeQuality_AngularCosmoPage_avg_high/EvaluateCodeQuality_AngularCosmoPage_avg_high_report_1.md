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
### Thoughts:
Let me analyze the code based on the specified aspects and identify issues that need to be addressed.

## Readability

### 1. Long Controller Functions
The `pageCtrl.js` has several long, complex functions that are difficult to read and understand at a glance. The `savePage` function, for example, is quite lengthy and has nested callback functions. This makes the code hard to follow.

### 2. Mixed Concerns in Controllers
The controller handles too many responsibilities - from UI state management to API calls and data transformation. This violates the Single Responsibility Principle.

### 3. Hardcoded Strings
There are many hardcoded strings in the code, including error messages and API endpoints.

## Maintainability

### 1. Angular Factory Pattern
The code uses Angular 1.x factories which are outdated. More modern Angular applications use services and classes.

### 2. Callback Hell
The code uses numerous nested callbacks instead of promises or observables, leading to "callback hell" that makes the code hard to maintain.

### 3. Lack of Separation of Concerns
The REST factory mixes all API endpoints into a single factory. This could be better organized into domain-specific services.

## Performance

### 1. Excessive DOM Updates
The controller makes frequent DOM updates which could cause performance issues.

### 2. Inefficient Data Handling
The code repeatedly processes the same data (e.g., in the `saveLocal` function).

## Accessibility

### 1. Missing ARIA Attributes
The form elements in `page.html` lack proper ARIA attributes, which can make them inaccessible to screen readers.

### 2. Color Contrast Issues
Without seeing the CSS, I can't be certain, but classes like "btn-error" and "btn-success" suggest color-based indicators, which might need additional cues for colorblind users.

## Best Practices

### 1. Outdated Angular Version
The code is using AngularJS (1.x), which is no longer the recommended approach for new projects. Angular 2+ or a more modern framework like React would be more appropriate.

### 2. Direct DOM Manipulation
The controller directly manipulates the DOM, which is against Angular's principles. Angular provides directives and data binding for this purpose.

### 3. LocalStorage Usage
The code uses localStorage directly without abstractions or error handling.

## Testing

### 1. Difficult to Test
The code is not structured in a way that makes it easy to test. Dependencies are not easily mockable, and the code tightly couples various concerns.

## Documentation

### 1. Incomplete Comments
While there are some high-level comments at the top of each file, there is little to no documentation of the functions and their parameters or return values.

Now let's provide specific examples and fixes for these issues:

### Answer:
# Code Review and Enhancement Suggestions

## Readability
### 1. Complex Controller Functions
The `savePage` function in pageCtrl.js is too long and complex with multiple nested callbacks, making it difficult to follow.

Example:
```js
// Current implementation - overly complex
$scope.savePage = function(duplicate){
    // Over 100 lines of code with nested callbacks and complex logic
    // ...
    function newPagePromise(data){
        // ...
        function saveRevisionPromise(data){
            // ...
        }
    }
    // ...
};
```

Fixed example:
```js
// Break down the function into smaller, focused functions
$scope.savePage = function(duplicate) {
    if (!isPageValid()) return;
    
    const pageData = preparePageData();
    
    if (isNewPage() || duplicate) {
        saveNewPage(pageData);
    } else {
        updateExistingPage(pageData);
    }
};

function isPageValid() {
    // Validation logic
    if (!$scope.page.type) {
        showError('page_no_type_selected');
        return false;
    }
    // More validation...
    return true;
}

function preparePageData() {
    return {
        title: $scope.page.title,
        description: $scope.page.description,
        // Other properties...
    };
}

function saveNewPage(pageData) {
    REST.content.save(pageData)
        .$promise.then(handleNewPageSuccess)
        .catch(handleError);
}
```

### 2. Unclear Variable Names
Some variable names aren't descriptive enough to understand their purpose.

Example:
```js
var date = new Date($scope.page.scheduleDate * 1000);
var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
var ampm = date.getHours() > 12 ? 'PM' : 'AM';
var formattedDate = date.getMonth() + 1 +'/'+ date.getDate() +'/'+ date.getFullYear() +' '+ hours +':'+ date.getMinutes() +' '+ ampm;
// $scope.page.scheduleDate = formattedDate; // Commented out
```

Fixed example:
```js
function formatScheduleDateForDisplay(timestampInSeconds) {
    const date = new Date(timestampInSeconds * 1000);
    const hours = date.getHours() % 12 || 12; // Convert 0 to 12
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${hours}:${minutes} ${ampm}`;
}

// Usage:
const displayDate = formatScheduleDateForDisplay($scope.page.scheduleDate);
```

## Maintainability
### 1. Outdated Angular 1.x Factory Pattern
The code uses outdated AngularJS factories which make maintenance difficult.

Example:
```js
angular.module('cosmo').factory('REST', ['$resource', 'Page', function($resource, Page) {
    return {
        'blocks': $resource('api/blocks/:blockID', { blockID: '@blockID'},{ update: { method: 'PUT' } }),
        // Many more endpoints...
    };
}]);
```

Fixed example (modern Angular approach):
```typescript
// rest.service.ts
@Injectable({
  providedIn: 'root'
})
export class RestService {
  constructor(private http: HttpClient) {}
  
  // Blocks API
  getBlocks() {
    return this.http.get<Block[]>('api/blocks');
  }
  
  getBlock(id: number) {
    return this.http.get<Block>(`api/blocks/${id}`);
  }
  
  updateBlock(block: Block) {
    return this.http.put<Block>(`api/blocks/${block.id}`, block);
  }
  
  // Other APIs organized by domain...
}
```

### 2. Callback Hell in API Handling
The code uses nested callbacks for handling API responses, making it difficult to maintain.

Example:
```js
REST.content.save({
    // data...
}, newPagePromise, function(){ // Error
    $translate('page_error_saving').then(function(translatedText){
        $rootScope.$broadcast('notify', {message: translatedText, classes: 'alert-error'});
    });
});

function newPagePromise(data){
    // More nested callbacks...
}
```

Fixed example:
```js
// Using promises/async-await for cleaner code
async function saveContent(contentData) {
    try {
        const result = await REST.content.save(contentData).$promise;
        return result;
    } catch (error) {
        const message = await $translate('page_error_saving').toPromise();
        $rootScope.$broadcast('notify', {message, classes: 'alert-error'});
        throw error;
    }
}

async function savePage() {
    try {
        const contentResult = await saveContent(pageData);
        const tagsResult = await saveTags(contentResult.id);
        const revisionResult = await saveRevision(contentResult.id);
        
        notifySuccess('page_created');
        $location.path($scope.page.url);
    } catch (error) {
        console.error('Error saving page:', error);
    }
}
```

## Performance
### 1. Inefficient LocalStorage Usage
LocalStorage is repeatedly accessed in a loop, which is inefficient.

Example:
```js
var elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
angular.forEach(elements, function(value){
    localStorage.setItem($routeParams.url + value, null);
});
```

Fixed example:
```js
function clearLocalStorage(pageUrl, elements) {
    const batch = elements.reduce((acc, element) => {
        acc[$routeParams.url + element] = null;
        return acc;
    }, {});
    
    // Set all at once if using a storage library, or minimize DOM reflows
    Object.keys(batch).forEach(key => localStorage.setItem(key, null));
}

// Usage
clearLocalStorage($routeParams.url, ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url']);
```

### 2. Multiple DOM Updates
The code updates the DOM in multiple places, which can cause performance issues.

Example:
```js
$scope.titleChange = function(){
    Page.title = $scope.page.title;
    
    if($scope.autoURL){
        $scope.page.url = $scope.page.title.toLowerCase().replace(/ /g, '-').replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
        Page.url = $scope.page.url;
    }
};
```

Fixed example:
```js
$scope.titleChange = function(){
    Page.title = $scope.page.title;
    
    if($scope.autoURL){
        const newUrl = generateUrlFromTitle($scope.page.title);
        $scope.page.url = newUrl;
        Page.url = newUrl;
    }
};

function generateUrlFromTitle(title) {
    return title.toLowerCase()
        .replace(/ /g, '-')
        .replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
}
```

## Accessibility
### 1. Missing ARIA Attributes
Form elements lack proper ARIA attributes for screen readers.

Example:
```html
<label class="type" for="type" translate="type"></label>
<div class="cos-select">
    <select value="type" ng-change="updatePageType()" ng-model="page.type" ng-options="(themePage | themeFiles ) for themePage in page.themePages" required></select>
</div>
```

Fixed example:
```html
<label class="type" id="typeLabel" for="typeSelect" translate="type"></label>
<div class="cos-select">
    <select 
        id="typeSelect"
        name="typeSelect"
        aria-labelledby="typeLabel"
        aria-required="true"
        value="type" 
        ng-change="updatePageType()" 
        ng-model="page.type" 
        ng-options="(themePage | themeFiles ) for themePage in page.themePages" 
        required>
    </select>
</div>
```

### 2. Improved Form Feedback
The form lacks clear feedback mechanisms for errors.

Example:
```html
<input value="url" type='text' ng-model='page.url' ng-keyup="autoURL=false;urlChange()">
```

Fixed example:
```html
<div class="form-group">
    <label for="urlInput" id="urlLabel" translate="url"></label>
    <input 
        id="urlInput"
        name="urlInput"
        type="text" 
        ng-model="page.url" 
        ng-keyup="autoURL=false;urlChange()"
        aria-labelledby="urlLabel"
        aria-describedby="urlHint urlError"
        aria-invalid="{{urlHasError}}">
    <span id="urlHint" class="hint" translate="url_hint"></span>
    <span id="urlError" class="error" ng-if="urlHasError" translate="url_error"></span>
</div>
```

## Best Practices
### 1. Outdated AngularJS Patterns
The code uses outdated AngularJS 1.x patterns instead of modern Angular practices.

Example:
```js
angular.module('cosmo').controller('pageCtrl', ['$scope', 'REST', '$location', 'Page', '$rootScope', '$routeParams', '$upload', 'Users', '$translate', function($scope, REST, $location, Page, $rootScope, $routeParams, $upload, Users, $translate){
    // Controller code...
}]);
```

Fixed example (modern Angular):
```typescript
// page.component.ts
@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  page: Page;
  newerVersion = false;
  
  constructor(
    private restService: RestService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private notificationService: NotificationService
  ) { }
  
  ngOnInit() {
    this.initializePage();
    this.checkForUnsavedVersion();
  }
  
  savePage(duplicate: boolean = false) {
    // Implementation...
  }
  
  // Other methods...
}
```

### 2. Direct DOM Manipulation
The code directly manipulates DOM instead of using Angular data binding.

Example:
```js
$translate('page_error_saving').then(function(translatedText){
    $rootScope.$broadcast('notify', {message: translatedText, classes: 'alert-error'});
});
```

Fixed example:
```typescript
// notification.service.ts
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications = new Subject<Notification>();
  
  showNotification(message: string, type: 'success' | 'error' | 'info') {
    this.notifications.next({ message, type });
  }
}

// Component
this.translate.get('page_error_saving').subscribe(message => {
  this.notificationService.showNotification(message, 'error');
});
```

## Testing
### 1. Difficult to Test Controller
The current structure makes unit testing very difficult.

Example (how it would be tested now):
```js
describe('pageCtrl', function() {
  // Complex setup with many dependencies to mock
  beforeEach(module('cosmo'));
  beforeEach(inject(function($controller, $rootScope, _REST_, _$location_, _Page_, _$routeParams_, _$upload_, _Users_, _$translate_) {
    // Lots of mocking...
  }));
  
  it('should save a page', function() {
    // Complex test with many mocks and side effects to verify
  });
});
```

Fixed example (more testable structure):
```typescript
// page.service.ts - easier to test
@Injectable()
export class PageService {
  constructor(private http: HttpClient) {}
  
  savePage(pageData: PageData): Observable<SaveResult> {
    return this.http.post<SaveResult>('/api/content', pageData);
  }
  
  generateUrlFromTitle(title: string): string {
    return title.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
  }
}

// Test
describe('PageService', () => {
  let service: PageService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PageService]
    });
    
    service = TestBed.inject(PageService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  it('should generate URL from title', () => {
    expect(service.generateUrlFromTitle('Hello World!')).toBe('hello-world');
  });
  
  it('should save page data', () => {
    const mockData = { title: 'Test' };
    const mockResponse = { id: 1, success: true };
    
    service.savePage(mockData).subscribe(result => {
      expect(result).toEqual(mockResponse);
    });
    
    const req = httpMock.expectOne('/api/content');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});
```

## Documentation
### 1. Insufficient Function Documentation
Many functions lack proper documentation explaining their purpose, parameters, and return values.

Example:
```js
$scope.titleChange = function(){
    // Undocumented function
    Page.title = $scope.page.title;
    // ...
};
```

Fixed example:
```js
/**
 * Updates the Page title and potentially generates a URL slug from the title.
 * This function is called whenever the title input field changes.
 * 
 * If autoURL is enabled, it will automatically generate a URL-friendly
 * slug from the title by converting to lowercase, replacing spaces with
 * hyphens, and removing special characters.
 */
$scope.titleChange = function(){
    Page.title = $scope.page.title;
    
    if($scope.autoURL){
        $scope.page.url = generateUrlFromTitle($scope.page.title);
        Page.url = $scope.page.url;
    }
};

/**
 * Generates a URL-friendly slug from a given title string.
 * 
 * @param {string} title - The title to convert to a URL slug
 * @returns {string} A lowercase, hyphenated string with special characters removed
 */
function generateUrlFromTitle(title) {
    return title.toLowerCase()
        .replace(/ /g, '-')
        .replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
}
```

### 2. Missing API Documentation
The REST factory lacks documentation about the API endpoints.

Example:
```js
angular.module('cosmo').factory('REST', ['$resource', 'Page', function($resource, Page) {
    return {
        'blocks': $resource('api/blocks/:blockID', { blockID: '@blockID'},{ update: { method: 'PUT' } }),
        // ...more endpoints
    };
}]);
```

Fixed example:
```js
/**
 * REST API Service Factory
 * 
 * This factory provides access to all RESTful API endpoints used by the CMS.
 * Each endpoint is configured with the appropriate URL and HTTP methods.
 */
angular.module('cosmo').factory('REST', ['$resource', 'Page', function($resource, Page) {
    return {
        /**
         * Content Blocks API
         * 
         * GET    /api/blocks          - Get all blocks
         * GET    /api/blocks/:blockID - Get a specific block
         * POST   /api/blocks          - Create a new block
         * PUT    /api/blocks/:blockID - Update a block
         * DELETE /api/blocks/:blockID - Delete a block
         */
        'blocks': $resource('api/blocks/:blockID', 
            { blockID: '@blockID' },
            { update: { method: 'PUT' } }
        ),
        
        // Other endpoints with similar documentation...
    };
}]);
```

### Tokens: {'input_tokens': 6907, 'output_tokens': 4950}
### Execution time: 68.93518781661987
