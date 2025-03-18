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
## Readability

### 1.  Inconsistent Date Handling in `pageCtrl.js`

The `pageCtrl.js` has inconsistent and potentially confusing date handling. It initializes `scheduleDate` to a JavaScript `Date` object, then has commented-out code that attempts to convert it to a Unix timestamp and back to a formatted string. This creates confusion about the expected format of `scheduleDate`.

```javascript
// Initialize variables
$scope.page = {
    // ...
    scheduleDate: Page.scheduleDate,
    // ...
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
```

**Improved Code:**

Consistently use JavaScript `Date` objects until you need to send the date to the backend, then convert it to a Unix timestamp (seconds since epoch) *just before* sending.  This improves readability and reduces the chance of errors.

```javascript
// Initialize variables
$scope.page = {
    // ...
    scheduleDate: Page.scheduleDate ? new Date(Page.scheduleDate) : new Date(), // Ensure Date object
    // ...
};

// ... (other parts of the controller)

// When saving the page:
let scheduleDateTimestamp;
if ($scope.page.publish === 'Y' && Page.publish === 'Y') {
    scheduleDateTimestamp = Page.scheduleDate instanceof Date ? Math.floor(Page.scheduleDate.getTime() / 1000) : Page.scheduleDate; // handle both cases
} else if ($scope.page.publish === 'Y') {
    scheduleDateTimestamp = Math.floor(Date.now() / 1000);
} else if ($scope.page.publish === 'schedule') {
    scheduleDateTimestamp = Math.floor($scope.page.scheduleDate.getTime() / 1000);
    // ... (rest of your logic)
}

// ... (use scheduleDateTimestamp in your REST calls)
REST.content.save({
    // ...
    published_date: scheduleDateTimestamp,
    // ...
});

```

### 2.  Deeply Nested Callbacks in `savePage`

The `savePage` function in `pageCtrl.js` has deeply nested callbacks (e.g., `newPagePromise`, `saveRevisionPromise`, `saveExtrasPromise`, `updatePagePromise`, etc.). This makes the code very difficult to follow and debug.

```javascript
// Save the page
$scope.savePage = function(duplicate){
    // ... a lot of code ...
    if($location.path() === '/new' || duplicate){
        REST.content.save({ /* ... */ }, newPagePromise, function(){ /* Error */ });
    } else {
        REST.content.update({ /* ... */ }, updatePagePromise, function(data){ /* Error */ });
    }

    function newPagePromise(data){
        // ...
        REST.contentRevisions.save({ /* ... */ }, saveRevisionPromise);
    }

    function saveRevisionPromise(data){
        // ...
        for(var key in Page.extras){
            REST.contentExtras.save({ /* ... */ }, saveExtrasPromise, saveExtrasPromise);
            REST.contentRevisionsExtras.save({ /* ... */ });
        }
        // ...
    }
    // ... more nested functions ...
};
```

**Improved Code:**

Use `async/await` to dramatically improve the readability and structure of the `savePage` function. This eliminates the need for nested callbacks and makes the code flow linearly.

```javascript
$scope.savePage = async function(duplicate) {
    // ... (input validation and other setup code) ...

    try {
        let scheduleDateTimestamp;
        if ($scope.page.publish === 'Y' && Page.publish === 'Y') {
            scheduleDateTimestamp = Page.scheduleDate instanceof Date ? Math.floor(Page.scheduleDate.getTime() / 1000) : Page.scheduleDate;
        } else if ($scope.page.publish === 'Y') {
            scheduleDateTimestamp = Math.floor(Date.now() / 1000);
        } else if ($scope.page.publish === 'schedule') {
            scheduleDateTimestamp = Math.floor($scope.page.scheduleDate.getTime() / 1000);
            // ... (rest of your logic)
        }

        let featured = Page.extras.featured ? Page.extras.featured.src : null;

        if ($location.path() === '/new' || duplicate) {
            const newData = await REST.content.save({
                title: $scope.page.title,
                // ... other fields ...
                published_date: scheduleDateTimestamp,
                author: Users.id
            }).$promise;

            $scope.page.id = newData.id;
            $scope.autoURL = false;

            if ($scope.page.tags) {
                for (const tag of $scope.page.tags) {
                    await REST.contentTags.save({ contentID: newData.id, tag }).$promise;
                }
            }

            const revisionData = await REST.contentRevisions.save({
                contentID: newData.id,
                // ... other fields ...
                published_date: scheduleDateTimestamp,
                author: Users.id
            }).$promise;

            if (Object.keys(Page.extras).length > 0) {
                for (const key in Page.extras) {
                    let extraValue = typeof Page.extras[key] === 'object' ? angular.toJson(Page.extras[key]) : Page.extras[key];
                    await REST.contentExtras.save({ contentID: $scope.page.id, name: key, extra: extraValue }).$promise;
                    await REST.contentRevisionsExtras.save({ revisionID: revisionData.id, contentID: $scope.page.id, name: key, extra: extraValue }).$promise;
                }
            }

        } else {
            await REST.content.update({
                contentID: Page.id,
                // ... other fields ...
                published_date: scheduleDateTimestamp,
                author: Users.id
            }).$promise;

            await REST.contentTags.delete({ contentID: $scope.page.id }).$promise;

            if ($scope.page.tags) {
                for (const tag of $scope.page.tags) {
                    await REST.contentTags.save({ contentID: $scope.page.id, tag }).$promise;
                }
            }

            const revisionData = await REST.contentRevisions.save({
                contentID: $scope.page.id,
                // ... other fields ...
                published_date: scheduleDateTimestamp,
                author: Users.id
            }).$promise;

            await REST.contentExtras.delete({ contentID: $scope.page.id }).$promise;

            if (Object.keys(Page.extras).length > 0) {
                for (const key in Page.extras) {
                    if (Page.extras.hasOwnProperty(key)) {
                        let extraValue = typeof Page.extras[key] === 'object' ? angular.toJson(Page.extras[key]) : Page.extras[key];
                        await REST.contentExtras.save({ contentID: $scope.page.id, name: key, extra: extraValue }).$promise;
                        await REST.contentRevisionsExtras.save({ revisionID: revisionData.id, contentID: $scope.page.id, name: key, extra: extraValue }).$promise;
                    }
                }
            }
        }

        $translate($location.path() === '/new' || duplicate ? 'page_created' : 'page_updated').then(function(translatedText){
            $rootScope.$broadcast('notify', { message: translatedText });
        });
        $location.path($scope.page.url);

    } catch (error) {
        $translate('page_error_saving').then(function(translatedText){
            $rootScope.$broadcast('notify', { message: translatedText, classes: 'alert-error' });
        });
        console.error("Error saving page:", error); // Log the actual error
    }
};
```

### 3. Magic Strings in `pageCtrl.js` and `page.html`

There are many "magic strings" (hardcoded string literals) used throughout the code, especially in `pageCtrl.js` and `page.html`.  Examples include `'Y'`, `'N'`, `'schedule'`, `'title'`, `'description'`, etc.  These make the code harder to read and maintain, and prone to errors if a string needs to be changed.

```javascript
// Example from pageCtrl.js
if($scope.page.publish === 'Y' && Page.publish === 'Y')
    scheduleDate = Page.scheduleDate;
else if($scope.page.publish === 'Y')
    scheduleDate = Math.round(+new Date().getTime()/1000);
else if($scope.page.publish === 'schedule'){
    // ...
}

// Example from page.html
<input  type="radio" ng-class="{active: page.publish=='Y'}" name="publish" id="Y" value="Y" ng-modal="page.publish">
```

**Improved Code:**

Define constants for these strings in a central location (e.g., a `constants.js` file or within the relevant factory/controller).

```javascript
// constants.js
angular.module('cosmo').constant('APP_CONSTANTS', {
    PUBLISH_STATUS: {
        PUBLISHED: 'Y',
        DRAFT: 'N',
        SCHEDULED: 'schedule'
    },
    STORAGE_KEYS: {
        TITLE: 'title',
        DESCRIPTION: 'description',
        // ... other keys ...
    }
});

// pageCtrl.js (inject APP_CONSTANTS)
angular.module('cosmo').controller('pageCtrl', ['$scope', 'REST', '$location', 'Page', '$rootScope', '$routeParams', '$upload', 'Users', '$translate', 'APP_CONSTANTS',
    function($scope, REST, $location, Page, $rootScope, $routeParams, $upload, Users, $translate, APP_CONSTANTS){

        // ...
        if ($scope.page.publish === APP_CONSTANTS.PUBLISH_STATUS.PUBLISHED && Page.publish === APP_CONSTANTS.PUBLISH_STATUS.PUBLISHED)
            scheduleDate = Page.scheduleDate;
        else if ($scope.page.publish === APP_CONSTANTS.PUBLISH_STATUS.PUBLISHED)
            scheduleDate = Math.round(+new Date().getTime()/1000);
        else if ($scope.page.publish === APP_CONSTANTS.PUBLISH_STATUS.SCHEDULED){
            // ...
        }

        // ...
        // Accessing local storage
        localStorage.setItem($routeParams.url + APP_CONSTANTS.STORAGE_KEYS.TITLE, Page.title);
        // ...
}]);

// page.html
<input type="radio" ng-class="{active: page.publish==APP_CONSTANTS.PUBLISH_STATUS.PUBLISHED}" name="publish" id="Y" value="{{APP_CONSTANTS.PUBLISH_STATUS.PUBLISHED}}" ng-modal="page.publish">

```

### 4.  Unclear Logic in `autocompleteTags`

The `autocompleteTags` function in `pageCtrl.js` is slightly unclear. It's not immediately obvious what it's doing.

```javascript
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
```

**Improved Code:**

Add comments and rename the function to be more descriptive.  Also, use `$promise` and `async/await` for better readability.

```javascript
// Renamed function to be more descriptive
$scope.fetchTagSuggestions = async function() {
    // Get the last tag entered by the user
    const lastTag = $scope.page.tags[$scope.page.tags.length - 1];

    if (lastTag) {
        try {
            const suggestions = await REST.contentTags.query({ tag: lastTag }).$promise;
            $scope.page.suggestions = suggestions;
        } catch (error) {
            // Handle the case where no tags are found or there's an error
            $scope.page.suggestions = [];
            console.error("Error fetching tag suggestions:", error); // Log the error
        }
    } else {
        // If there's no last tag, clear the suggestions
        $scope.page.suggestions = [];
    }
};
```

## Maintainability

### 1.  `Page` Factory is a Data Dump

The `Page` factory is essentially a global data store for page-related information. This makes it difficult to track where data is being modified and can lead to unexpected side effects.

```javascript
// page.js
angular.module('cosmo').factory('Page', function(){
    return {
        id: 0,
        title: '',
        // ... lots of other properties ...
        misc: {} // A catch-all for miscellaneous data
    };
});
```

**Improved Code:**

Instead of a global data store, the `Page` factory should be responsible for *managing* page data, not just *storing* it.  It should provide methods for getting, setting, and updating page data.  The actual data should be scoped to the controller where it's used.  This makes the data flow much clearer and easier to debug.

```javascript
// page.js
angular.module('cosmo').factory('Page', ['APP_CONSTANTS', function(APP_CONSTANTS) {
    // Private function to create a new page object with default values
    function createEmptyPage() {
        return {
            id: 0,
            title: '',
            description: '',
            header: '',
            subheader: '',
            body: '',
            url: '',
            type: '',
            published: APP_CONSTANTS.PUBLISH_STATUS.DRAFT, // Use constant
            published_date: null,
            themePages: [],
            timestamp: null,
            extras: {},
            tags: [] // Initialize tags
        };
    }

    return {
        createEmptyPage: createEmptyPage, // Expose the function

        // Example method to set page data (you can add more specific methods)
        setPageData: function(page, newData) {
            angular.extend(page, newData);
        },
        // Method to clear page data
        clearPageData: function(page){
            angular.copy(createEmptyPage(), page);
        }
    };
}]);

// pageCtrl.js
angular.module('cosmo').controller('pageCtrl', ['$scope', 'REST', '$location', 'Page', '$rootScope', '$routeParams', '$upload', 'Users', '$translate', 'APP_CONSTANTS',
    function($scope, REST, $location, Page, $rootScope, $routeParams, $upload, Users, $translate, APP_CONSTANTS){

    // Initialize page data using the factory method
    $scope.page = Page.createEmptyPage();

    // ... (rest of your controller logic) ...

    // Example of using setPageData
    // Instead of directly modifying Page.title, etc.
    $scope.titleChange = function() {
        Page.setPageData($scope.page, { title: $scope.page.title });
        // ... (rest of your logic) ...
    };

    // Example of using setPageData with multiple properties
    $scope.saveLocal = function() {
        Page.setPageData($scope.page, {
            title: $scope.page.title,
            description: $scope.page.description,
            url: $scope.page.url,
            type: $scope.page.type
        });
        // ... (rest of your logic) ...
    };

    // Clear page data when navigating away
    $scope.$on('$destroy', function() {
        Page.clearPageData($scope.page);
    });
}]);
```

### 2.  `Users` Factory is Also a Data Dump

Similar to the `Page` factory, the `Users` factory is a global data store.

```javascript
// users.js
angular.module('cosmo').factory('Users', function() {
    return {
        id: '',
        // ... other user properties ...
    };
});
```

**Improved Code:**

The `Users` factory should manage user data, potentially fetching it from a backend service.  The actual user data should be stored in the controller or a service that requires it.

```javascript
// users.js
angular.module('cosmo').factory('Users', ['$http', '$q', function($http, $q) { // Inject $http and $q
    let currentUser = null; // Store user data privately

    return {
        getCurrentUser: function() {
            if (currentUser) {
                return $q.resolve(currentUser); // Return a promise for consistency
            } else {
                // Example: Fetch user data from an API
                return $http.get('/api/user') // Replace with your actual API endpoint
                    .then(function(response) {
                        currentUser = response.data;
                        return currentUser;
                    })
                    .catch(function(error) {
                        console.error("Error fetching user:", error);
                        throw error; // Re-throw the error for handling in the controller
                    });
            }
        },
        clearCurrentUser: function(){
            currentUser = null;
        },
        // You could add methods to update user data, etc.
        updateUser: function(userData) {
            // Example: Send a PUT request to update user data
            return $http.put('/api/user', userData)
                .then(function(response) {
                    currentUser = response.data; // Update the local user data
                    return currentUser;
                });
        }
    };
}]);

// pageCtrl.js (or any other controller needing user data)
angular.module('cosmo').controller('pageCtrl', ['$scope', 'REST', '$location', 'Page', '$rootScope', '$routeParams', 'Users', '$translate', 'APP_CONSTANTS',
    function($scope, REST, $location, Page, $rootScope, $routeParams, Users, $translate, APP_CONSTANTS){

    // ...
    $scope.user = null;

    // Fetch the current user when the controller loads
    Users.getCurrentUser()
        .then(function(user) {
            $scope.user = user;
        })
        .catch(function(error) {
            // Handle error (e.g., user not logged in)
            console.error("Failed to get current user:", error);
        });

    // ... (rest of your controller logic, using $scope.user) ...

    // Example of using the user data when saving a page:
    $scope.savePage = async function(duplicate) {
        // ...
        if ($location.path() === '/new' || duplicate) {
            const newData = await REST.content.save({
                // ...
                author: $scope.user.id // Use $scope.user.id
            }).$promise;
            // ...
        }
        // ...
    };
}]);
```

### 3.  Tight Coupling with `$rootScope`

The `pageCtrl` heavily relies on `$rootScope` for broadcasting events (`$rootScope.$broadcast`).  This creates tight coupling between the controller and other parts of the application, making it harder to test and maintain.

```javascript
// Example from pageCtrl.js
$translate('deleted').then(function(translatedText){
    $rootScope.$broadcast('notify', {message: translatedText});
});
```

**Improved Code:**

Use a dedicated service for application-wide events or notifications. This decouples the controller from `$rootScope` and makes the code more testable.

```javascript
// notificationService.js
angular.module('cosmo').factory('NotificationService', ['$rootScope', function($rootScope) {
    return {
        notify: function(message, type) {
            $rootScope.$broadcast('notification', { message: message, type: type });
        }
    };
}]);

// pageCtrl.js (inject NotificationService)
angular.module('cosmo').controller('pageCtrl', ['$scope', 'REST', '$location', 'Page', '$rootScope', '$routeParams', 'Users', '$translate', 'APP_CONSTANTS', 'NotificationService',
    function($scope, REST, $location, Page, $rootScope, $routeParams, Users, $translate, APP_CONSTANTS, NotificationService){

    // ...
    $scope.deletePage = function(){
        // ...
        REST.content.delete({ contentID: $scope.page.id }, function(data){
            // Success message
            $translate('deleted').then(function(translatedText){
                NotificationService.notify(translatedText); // Use the service
            });
        });
        // ...
    };
}]);

// In any other component that needs to listen for notifications:
angular.module('cosmo').controller('SomeOtherController', ['$scope', function($scope) {
    $scope.$on('notification', function(event, data) {
        // Handle the notification (e.g., display it to the user)
        console.log('Notification:', data.message, data.type);
    });
}]);
```

### 4.  Direct DOM Manipulation

The `page.html` uses `ng-show` and `ng-class` extensively, which can lead to performance issues and makes the template harder to reason about.

```html
<div class="new-version form-case" ng-show="newerVersion">
    </div>
<input  type="radio" ng-class="{active: page.publish=='Y'}" name="publish" id="Y" value="Y" ng-modal="page.publish">
```

**Improved Code:**

While `ng-show` and `ng-class` are valid Angular directives, try to keep the logic within them as simple as possible. For more complex conditional rendering or styling, consider using computed properties or helper functions within your controller.

```html
<div class="new-version form-case" ng-show="showNewVersion"> </div>

<input type="radio" ng-class="getPublishClass(page.publish)" name="publish" id="Y"
    value="{{APP_CONSTANTS.PUBLISH_STATUS.PUBLISHED}}" ng-modal="page.publish">
```

```javascript
//In pageCtrl.js
$scope.showNewVersion = $scope.newerVersion; // simple case

$scope.getPublishClass = function(publishStatus) {
    return {
        active: publishStatus === APP_CONSTANTS.PUBLISH_STATUS.PUBLISHED
    };
};
```

## Performance

### 1.  Excessive `$watch` Implicitly Created

AngularJS's two-way data binding can create many watchers, which can impact performance, especially in complex forms or lists.  The `page.html` template has many bindings that will create watchers.

```html
<input type='text' ng-model="page.title" ng-keyup="titleChange()" placeholder="about us, contact us">
<textarea value="description" ng-model="page.description" ng-keyup="descriptionChange()" placeholder="..."></textarea>
```

**Improved Code:**

*   **Use one-time binding where appropriate:** If a value is only displayed and not edited, use one-time binding (`{{::page.title}}`) to reduce the number of watchers.
*   **Use `ng-model-options` with `debounce`:**  This delays the update of the model until the user stops typing for a specified duration, reducing the number of updates and improving performance.
* **Use track by with ng-repeat:** When using `ng-repeat` make sure to use `track by` to improve performance.

```html
<input type='text' ng-model="page.title" ng-keyup="titleChange()" placeholder="about us, contact us" ng-model-options="{ debounce: 300 }">

<textarea ng-model="page.description" ng-keyup="descriptionChange()" placeholder="..." ng-model-options="{ debounce: 300 }"></textarea>

<!-- Example of one-time binding -->
<p>{{::page.initialDescription}}</p>

<!-- Example with ng-repeat and track by -->
<div class="tag-suggestions" ng-show="page.suggestions.length">
    <a ng-repeat="tag in page.suggestions | limitTo:10 track by $index" ng-click="selectSuggestion(tag)">{{tag | titlecase}}</a>
</div>
```

### 2.  Unnecessary API Calls in `deletePage`

The `deletePage` function in `pageCtrl.js` makes multiple API calls to delete related data (revisions, extras, tags).  While this is necessary, it could be optimized.

```javascript
$scope.deletePage = function(){
    // Delete the page
    REST.content.delete({ contentID: $scope.page.id }, function(data){ /* ... */ });

    // Delete all revisions of this page
    REST.contentRevisions.delete({ contentID: $scope.page.id });

    // Delte all extra revisions
    REST.contentRevisionsExtras.delete({ contentID: $scope.page.id });

    // Delete all extras from this page
    REST.contentExtras.delete({ contentID: $scope.page.id });

    // Delete all tags for this page
    REST.contentTags.delete({ contentID: $scope.page.id });

    // ...
};
```

**Improved Code:**

Ideally, the backend API should handle cascading deletes.  If you delete a page, the server should automatically delete related revisions, extras, and tags.  If this is not possible, you can at least use `$q.all` (or `Promise.all` with `async/await`) to execute the delete requests in parallel, rather than sequentially.

```javascript
$scope.deletePage = async function() {
    try {
        // Ideally, this should be handled by the backend with cascading deletes
        await REST.content.delete({ contentID: $scope.page.id }).$promise;

        // If cascading deletes are not supported by the backend, run in parallel
        await $q.all([
            REST.contentRevisions.delete({ contentID: $scope.page.id }).$promise,
            REST.contentRevisionsExtras.delete({ contentID: $scope.page.id }).$promise,
            REST.contentExtras.delete({ contentID: $scope.page.id }).$promise,
            REST.contentTags.delete({ contentID: $scope.page.id }).$promise
        ]);

        $translate('deleted').then(function(translatedText){
            NotificationService.notify(translatedText);
        });
        $location.path('new');

    } catch (error) {
        $translate('page_error_deleting').then(function(translatedText){
            $rootScope.$broadcast('notify', { message: translatedText, classes: 'alert-error' });
        });
        console.error("Error deleting page:", error);
    }
};
```

## Accessibility

### 1.  Missing ARIA Attributes and Semantic HTML

The `page.html` template lacks sufficient ARIA attributes and semantic HTML elements, which are crucial for screen readers and other assistive technologies.

```html
<div class="bar-top">
    <a ng-click="admin.sidebar='core/html/sidebar.html';active=''"><i class="fa fa-angle-left"></i></a>
    <h1 class="title" translate="page_details"></h1>
    <a class="sidebar-close" ng-click="admin.showAdminPanel=false;admin.active=false;" ><i class="fa fa-times"></i></a>
</div>
```

**Improved Code:**

*   Use semantic HTML elements like `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`, etc., to structure the page content logically.
*   Add ARIA attributes (e.g., `role`, `aria-label`, `aria-labelledby`, `aria-hidden`, etc.) to provide additional context for assistive technologies.
*   Ensure proper heading structure (h1-h6) for navigation.
*   Use `<label>` elements with `for` attributes to associate labels with form controls explicitly.
*   Provide alternative text for images using the `alt` attribute. (This isn't present in the provided code, but it's a general accessibility best practice).

```html
<header class="bar-top" role="banner">
    <nav role="navigation">
        <a ng-click="admin.sidebar='core/html/sidebar.html';active=''" aria-label="Open Sidebar">
            <i class="fa fa-angle-left" aria-hidden="true"></i>
        </a>
    </nav>
    <h1 class="title" id="page-title" translate="page_details"></h1>
    <button class="sidebar-close" ng-click="admin.showAdminPanel=false;admin.active=false;" aria-label="Close Admin Panel">
        <i class="fa fa-times" aria-hidden="true"></i>
    </button>
</header>

<main role="main">
    <div class="pg-editor form-case">
        <label class="type" for="pageType" translate="type"></label>
        <div class="cos-select">
            <select id="pageType" value="type" ng-change="updatePageType()" ng-model="page.type" ng-options="(themePage | themeFiles ) for themePage in page.themePages" required aria-describedby="pageTypeDescription"></select>
            <span id="pageTypeDescription" class="sr-only">Select the page type.</span>
        </div>

        <label for="pageTitle" translate="title"></label>
        <span class="num-count">{{page.title.length}}</span>
        <input type='text' id="pageTitle" ng-model="page.title" ng-keyup="titleChange()" placeholder="about us, contact us">

        <label for="description" translate="description"></label>
        <span class="num-count">{{page.description.length}}</span>
        <textarea id="description" value="description" ng-model="page.description" ng-keyup="descriptionChange()" placeholder="Tom's Restaurant..."></textarea>

        <label for="tags" translate="tags"></label>
        <input id="tags" value="tags" type="text" ng-list ng-model="page.tags" ng-change="autocompleteTags()" placeholder="about, restaurant, food, nyc">
        <div class="tag-suggestions" ng-show="page.suggestions.length" role="listbox">
            <a ng-repeat="tag in page.suggestions | limitTo:10 track by $index" ng-click="selectSuggestion(tag)" role="option">{{tag | titlecase}}</a>
        </div>

        <label for="url" translate="url"></label>
        <input id="url" value="url" type='text' ng-model='page.url' ng-keyup="autoURL=false;urlChange()">

        <fieldset>
            <legend translate="Publish Options"></legend>
            <input type="radio" ng-class="{active: page.publish==APP_CONSTANTS.PUBLISH_STATUS.PUBLISHED}" name="publish" id="publishYes" value="{{APP_CONSTANTS.PUBLISH_STATUS.PUBLISHED}}" ng-modal="page.publish">
            <label for="publishYes" ng-click="page.publish=APP_CONSTANTS.PUBLISH_STATUS.PUBLISHED" translate="publish"></label>

            <input type="radio" ng-class="{active: page.publish==APP_CONSTANTS.PUBLISH_STATUS.DRAFT}" name="publish" id="publishNo" value="{{APP_CONSTANTS.PUBLISH_STATUS.DRAFT}}" ng-modal="page.publish">
            <label for="publishNo" ng-click="page.publish=APP_CONSTANTS.PUBLISH_STATUS.DRAFT" translate="draft"></label>

            <input type="radio" ng-class="{active: page.publish==APP_CONSTANTS.PUBLISH_STATUS.SCHEDULED}" name="publish" id="publishSchedule" value="{{APP_CONSTANTS.PUBLISH_STATUS.SCHEDULED}}" ng-modal="page.publish">
            <label for="publishSchedule" ng-click="page.publish=APP_CONSTANTS.PUBLISH_STATUS.SCHEDULED" translate="schedule"></label>

            <div class="schedule-triangle" ng-show="page.publish==APP_CONSTANTS.PUBLISH_STATUS.SCHEDULED"></div>
            <input type="datetime-local" class="schedule radio-inline" id="scheduleDate" ng-model="page.scheduleDate" ng-show="page.publish==APP_CONSTANTS.PUBLISH_STATUS.SCHEDULED">
        </fieldset>
    </div>
</main>

<div class="bar--actions" role="toolbar" aria-labelledby="page-title">
    <button type="button" class="btn-error" ng-click="page.confirm=true" translate="delete" ng-show="!page.confirm" aria-label="Delete Page"></button>
    <button type="button" class="btn-options" ng-click="savePage(true)" translate="duplicate" ng-show="!page.confirm" aria-label="Duplicate Page"></button>
    <button type="button" class="btn-success" ng-click="savePage()" translate="save" ng-show="!page.confirm" aria-label="Save Page"></button>

    <p translate="page_delete" ng-show="page.confirm" id="deleteConfirmMessage"></p>
    <button type="button" class="btn-error" ng-click="deletePage()" translate="yes" ng-show="page.confirm" aria-describedby="deleteConfirmMessage"></button>
    <button type="button" class="btn-success" ng-click="page.confirm=false" translate="no" ng-show="page.confirm" aria-describedby="deleteConfirmMessage"></button>
</div>

<div class="new-version form-case" ng-show="newerVersion" role="alertdialog" aria-labelledby="newVersionHeading">
    <h2 id="newVersionHeading" translate="page_newer"></h2>
    <button type="button" class="btn-error" ng-click="deleteNewerVersion()" translate="discard" aria-label="Discard newer version"></button>
    <button type="button" class="btn-options" ng-click='localVersion()' translate="compare" aria-label="Compare to local version"></button>
    <button type="button" class="btn-success" ng-click='localVersion()' translate="use" aria-label="Use

### Tokens: {'input_tokens': 6432, 'output_tokens': 8192}
### Execution time: 77.01517415046692
