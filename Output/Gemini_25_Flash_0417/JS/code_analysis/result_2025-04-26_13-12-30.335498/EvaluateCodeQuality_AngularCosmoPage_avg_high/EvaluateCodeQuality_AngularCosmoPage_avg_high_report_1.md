I have the following application code that needs to evaluate:

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

1. Analyze the provided Angular.js application code:
   - Identify issues across multiple technical dimensions
   - Provide specific recommendations with code examples

2. Readability Assessment:
   - Identify unclear variable names, functions, or code blocks
   - Suggest clearer alternatives with specific code examples
   - Highlight complex logic that could be simplified

3. Maintainability Evaluation:
   - Identify non-modular or tightly coupled components
   - Suggest architectural improvements for better separation of concerns
   - Provide examples of more maintainable code structures

4. Performance Optimization:
   - Identify inefficient data handling or processing
   - Highlight potential memory leaks or unnecessary operations
   - Suggest optimized alternatives with code examples

5. Accessibility Improvements:
   - Review UI components for accessibility compliance
   - Suggest ARIA attributes, keyboard navigation, or focus management enhancements
   - Provide code examples demonstrating accessibility best practices

6. Angular.js Best Practices:
   - Identify outdated patterns or anti-patterns
   - Suggest modern Angular.js approaches where applicable
   - Provide examples aligning with current framework recommendations

7. Documentation Enhancement:
   - Evaluate existing comments and documentation
   - Suggest improvements for function, component, and service documentation
   - Provide examples of clear, comprehensive documentation

8. Response Format Requirements:
   - Organize findings by aspect (Readability, Maintainability, etc.)
   - For each issue identified:
     - Provide a descriptive name
     - Include a clear explanation
     - Show the problematic code snippet
     - Provide a corrected code example where applicable
## Run 1:
### Answer:
Okay, let's analyze this AngularJS application code snippet covering REST interaction, shared state factories, an HTML template, and a controller.

This code appears to be from an older AngularJS application (version 1.x), which is important context as best practices and common patterns differ significantly from modern Angular (2+).

Here is the evaluation based on your requested dimensions:

### 1. Readability Assessment

**Issue 1: Complex and Nested Logic in `savePage` Function**

*   **Explanation:** The `savePage` function in `pageCtrl.js` is overly long and contains deeply nested callback functions (`newPagePromise`, `saveRevisionPromise`, etc.). This "callback hell" makes the control flow difficult to follow, understand, and debug. It mixes validation, API calls, data transformation, state updates, and notification logic.
*   **Problematic Code:** The entire `savePage` function (lines 140-308 in `pageCtrl.js`).
    ```js
    // pageCtrl.js - snippet from savePage
    REST.content.save({ /* ... */ }, newPagePromise, function(){ /* Error */ });

    function newPagePromise(data){
        // ... logic ...
        REST.contentRevisions.save({ /* ... */ }, saveRevisionPromise);
    }

    function saveRevisionPromise(data){
        // ... logic ...
        REST.contentExtras.save({ /* ... */ }, saveExtrasPromise, saveExtrasPromise); // Note: Error callback is the same as success
        REST.contentRevisionsExtras.save({ /* ... */ });
    }

    function saveExtrasPromise(){
        // ... logic with manual counter ...
    }
    // ... similar nesting for update path ...
    ```
*   **Recommendation:** Refactor the `savePage` function to use promises (`$q` service or the promises returned by `$resource`) and chain them using `.then()`. This flattens the structure and makes the sequence of asynchronous operations much clearer. Extract smaller, single-purpose functions for specific tasks like "saveTags", "saveExtras", "createRevision", etc.
*   **Corrected Code Example (Conceptual Promise Structure):**
    ```js
    // pageCtrl.js - Conceptual refactor using promises
    $scope.savePage = function(duplicate) {
        // ... validation and initial data setup ...

        var contentPromise;
        if ($location.path() === '/new' || duplicate) {
            contentPromise = REST.content.save({ /* ... data ... */ }).$promise;
        } else {
            contentPromise = REST.content.update({ contentID: Page.id, /* ... data ... */ }).$promise;
        }

        contentPromise
            .then(function(contentData) {
                var contentID = contentData.id || Page.id; // Handle new vs update
                // Update Page factory or local scope if needed after save/update
                Page.id = contentID; // For new pages
                $scope.page.id = contentID; // For new pages
                $scope.autoURL = false; // For new pages

                // Chain promises for subsequent operations
                var tagPromises = [];
                if ($scope.page.tags) {
                    // Delete old tags first for update scenario (needs to be sequential or handled server-side)
                    if (!duplicate && $location.path() !== '/new') {
                         tagPromises.push(REST.contentTags.delete({ contentID: contentID }).$promise);
                    }
                    // Save new tags (can be parallel)
                    angular.forEach($scope.page.tags, function(value) {
                        tagPromises.push(REST.contentTags.save({ contentID: contentID, tag: value }).$promise);
                    });
                }

                var extraPromises = [];
                 // Delete old extras first for update scenario
                if (!duplicate && $location.path() !== '/new') {
                     extraPromises.push(REST.contentExtras.delete({ contentID: contentID }).$promise);
                }
                // Save new extras (can be parallel)
                for (var key in Page.extras) {
                    if (Page.extras.hasOwnProperty(key)) {
                        var extraValue = typeof Page.extras[key] === 'object' ? angular.toJson(Page.extras[key]) : Page.extras[key];
                        extraPromises.push(REST.contentExtras.save({ contentID: contentID, name: key, extra: extraValue }).$promise);
                    }
                }

                // Save revision (can happen in parallel with tags/extras saves)
                var revisionPromise = REST.contentRevisions.save({ contentID: contentID, /* ... revision data ... */ }).$promise
                    .then(function(revisionData) {
                        var revisionID = revisionData.id;
                        var revisionExtraPromises = [];
                        for (var key in Page.extras) {
                            if (Page.extras.hasOwnProperty(key)) {
                                var extraValue = typeof Page.extras[key] === 'object' ? angular.toJson(Page.extras[key]) : Page.extras[key];
                                revisionExtraPromises.push(REST.contentRevisionsExtras.save({ revisionID: revisionID, contentID: contentID, name: key, extra: extraValue }).$promise);
                            }
                        }
                        return $q.all(revisionExtraPromises); // Wait for all revision extras
                    });


                // Wait for all parallel operations (tags, extras, revision + revision extras)
                return $q.all(tagPromises.concat(extraPromises).concat([revisionPromise]));
            })
            .then(function() {
                // All saves/updates/deletes successful
                $translate('saved').then(function(translatedText) { // Use 'saved' or 'page_created'/'page_updated' based on scenario
                    $rootScope.$broadcast('notify', { message: translatedText });
                });
                // Redirect only after successful save
                if ($location.path() === '/new' || duplicate) {
                     $location.path($scope.page.url); // Redirect only for new/duplicate
                }
            })
            .catch(function(error) {
                // Handle any error in the chain
                console.error("Save failed:", error); // Log the actual error
                var errorMessageKey = ($location.path() === '/new' || duplicate) ? 'page_error_saving' : 'page_error_updating';
                 $translate(errorMessageKey).then(function(translatedText) {
                    $rootScope.$broadcast('notify', { message: translatedText, classes: 'alert-error' });
                });
            });
    };
    ```
    *(Note: This is a simplified conceptual example. A real refactor would involve extracting logic into a service.)*

**Issue 2: Dead Code**

*   **Explanation:** There are sections of code that are commented out or functions that are defined but never called. This adds clutter and potential confusion.
*   **Problematic Code:**
    *   Commented out date formatting logic (lines 30-33 in `pageCtrl.js`).
    *   The `saveLocal` function (lines 109-121 in `pageCtrl.js`) is defined but never called.
*   **Recommendation:** Remove dead code. If the commented code represents a discarded idea, delete it. If `saveLocal` was intended for a feature, either implement its usage or remove it.
*   **Corrected Code Example:**
    ```js
    // pageCtrl.js - Remove commented code
    // Initialize schedule date - Depreciate? // <-- Remove this comment and the following lines
    // var date = new Date($scope.page.scheduleDate * 1000);
    // var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    // var ampm = date.getHours() > 12 ? 'PM' : 'AM';
    // var formattedDate = date.getMonth() + 1 +'/'+ date.getDate() +'/'+ date.getFullYear() +' '+ hours +':'+ date.getMinutes() +' '+ ampm;
    // $scope.page.scheduleDate = formattedDate; // <-- Remove these lines

    // pageCtrl.js - Remove unused function
    // $scope.saveLocal = function(){ /* ... */ }; // <-- Remove this entire function
    ```

**Issue 3: Repetitive Local Storage Logic**

*   **Explanation:** The logic for interacting with `localStorage` (checking for newer versions, restoring, deleting) is repeated in `localVersion` and `deleteNewerVersion` functions, using the same `elements` array and `angular.forEach` loop.
*   **Problematic Code:** Lines 48-60 and 63-70 in `pageCtrl.js`.
    ```js
    // pageCtrl.js - snippet from localVersion
    var elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
    angular.forEach(elements, function(value){
        // Restore item
        if(localStorage.getItem($routeParams.url + value) !== 'null')
            Page[value] = localStorage.getItem($routeParams.url + value);

        // Clear item from storage
        localStorage.setItem($routeParams.url + value, null);
    });

    // pageCtrl.js - snippet from deleteNewerVersion
    var elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
    angular.forEach(elements, function(value){
        localStorage.setItem($routeParams.url + value, null);
    });
    ```
*   **Recommendation:** Extract the local storage operations into a dedicated service or helper functions to avoid repetition and make the code cleaner.
*   **Corrected Code Example (Conceptual Helper):**
    ```js
    // pageCtrl.js - Conceptual helper function
    function getLocalStorageKey(key) {
        return $routeParams.url + key;
    }

    function clearPageLocalStorage() {
        var elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
        angular.forEach(elements, function(value) {
            localStorage.setItem(getLocalStorageKey(value), null);
        });
    }

    $scope.localVersion = function() {
        var elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
        angular.forEach(elements, function(value) {
            var storedValue = localStorage.getItem(getLocalStorageKey(value));
            if (storedValue !== 'null') {
                Page[value] = storedValue;
            }
        });
        clearPageLocalStorage();
        $scope.newerVersion = false;
        $rootScope.$broadcast('contentGet');
    };

    $scope.deleteNewerVersion = function() {
        clearPageLocalStorage();
        $scope.newerVersion = false;
    };
    ```

### 2. Maintainability Evaluation

**Issue 1: Fat Controller / Skinny Service Violation**

*   **Explanation:** The `pageCtrl` is responsible for a wide range of tasks: initializing scope variables, handling user input events (`ng-click`, `ng-change`, `ng-keyup`), interacting with `localStorage`, performing complex validation, orchestrating multiple API calls (`REST` service), managing shared state (`Page`, `Users` factories), and broadcasting events (`$rootScope.$broadcast`). This violates the principle of keeping controllers lean and moving business logic into services.
*   **Problematic Code:** The entire `pageCtrl.js` file, particularly the `savePage` function.
*   **Recommendation:** Create a dedicated service (e.g., `PageService`) to handle data fetching, saving, deleting, validation, and interaction with the `REST` service and `localStorage`. The controller should then delegate these tasks to the service, only handling view-specific logic and data binding.
*   **Corrected Code Example (Conceptual Service):**
    ```js
    // pageService.js
    angular.module('cosmo').service('PageService', ['$q', 'REST', 'Page', 'Users', '$translate', '$rootScope', '$location', '$routeParams', function($q, REST, Page, Users, $translate, $rootScope, $location, $routeParams) {

        var service = {
            // Method to load page data
            loadPage: function(pageId) { /* ... fetch from REST ... */ },
            // Method to save/update page
            savePage: function(pageData, duplicate) {
                // ... move validation, API orchestration (using promises/ $q.all),
                // tag/extra/revision saving logic here ...
                // Interact with REST service
                // Update Page factory state internally or return updated data
                // Handle notifications via $rootScope.$broadcast or a notification service
                // Return a promise
            },
            // Method to delete page
            deletePage: function(pageId) { /* ... orchestrate REST deletes, return promise ... */ },
            // Method to handle local storage
            checkNewerVersion: function(pageUrl, pageData) { /* ... */ },
            localVersion: function(pageUrl) { /* ... */ },
            deleteNewerVersion: function(pageUrl) { /* ... */ },
            // Method for tag autocomplete
            autocompleteTags: function(tag) { /* ... call REST, return promise ... */ }
            // ... other page-related logic ...
        };

        return service;
    }]);

    // pageCtrl.js - Refactored controller
    angular.module('cosmo').controller('pageCtrl', ['$scope', 'PageService', 'Page', '$location', '$rootScope', '$routeParams', 'Users', '$translate', function($scope, PageService, Page, $location, $rootScope, $routeParams, Users, $translate){

        // Initialize scope from Page factory (which might be populated by PageService)
        $scope.page = angular.copy(Page); // Use copy to avoid direct mutation if needed

        // Check for newer version using service
        $scope.newerVersion = PageService.checkNewerVersion($routeParams.url, Page);

        // Delegate actions to service
        $scope.localVersion = function() {
            PageService.localVersion($routeParams.url).then(function() {
                 $scope.newerVersion = false;
                 $rootScope.$broadcast('contentGet'); // Still broadcast if needed for other components
            });
        };

        $scope.deleteNewerVersion = function() {
            PageService.deleteNewerVersion($routeParams.url);
            $scope.newerVersion = false;
        };

        $scope.deletePage = function() {
            $scope.page.confirm = false; // Reset confirmation state
            PageService.deletePage($scope.page.id)
                .then(function() {
                    $translate('deleted').then(function(translatedText) {
                        $rootScope.$broadcast('notify', { message: translatedText });
                    });
                    $location.path('new');
                })
                .catch(function(error) {
                     console.error("Delete failed:", error);
                     $translate('page_error_deleting').then(function(translatedText) { // Need a translation key for delete error
                        $rootScope.$broadcast('notify', { message: translatedText, classes: 'alert-error' });
                    });
                });
        };

        // Watch for Page factory changes (if service updates it)
        $scope.$on('contentGet', function(){
            // Update scope from Page factory
            $scope.page = angular.copy(Page);
        });

        // Delegate save to service
        $scope.savePage = function(duplicate) {
            // Pass relevant data to service
            PageService.savePage($scope.page, duplicate)
                .then(function() {
                    // Service handles success notification and redirect
                })
                .catch(function(error) {
                    // Service handles error notification
                });
        };

        // Delegate autocomplete to service
        $scope.autocompleteTags = function() {
             var tag = $scope.page.tags[$scope.page.tags.length - 1];
             if (tag) {
                 PageService.autocompleteTags(tag)
                     .then(function(data) {
                         $scope.page.suggestions = data;
                     })
                     .catch(function() { // no tag found or error
                         $scope.page.suggestions = [];
                     });
             } else {
                 $scope.page.suggestions = [];
             }
        };

        // ... other simple scope functions ...
        $scope.titleChange = function() { Page.title = $scope.page.title; /* ... url logic ... */ };
        $scope.descriptionChange = function() { Page.description = $scope.page.description; };
        $scope.urlChange = function() { Page.url = $scope.page.url; };
        $scope.updatePageType = function() { Page.type = $scope.page.type; $rootScope.$broadcast('settingsGet'); };
        $scope.selectSuggestion = function(tag) { /* ... update scope.page.tags ... */ };

    }]);
    ```

**Issue 2: Shared Mutable State via Factories**

*   **Explanation:** The `Page` and `Users` factories are used as simple objects that are directly modified by the controller. This makes it hard to track state changes and can lead to unexpected behavior if multiple parts of the application depend on or modify these objects simultaneously.
*   **Problematic Code:** `Page.title = $scope.page.title;`, `Users.id`, etc., throughout `pageCtrl.js`.
    ```js
    // pageCtrl.js - Direct modification of Page factory
    Page.title = $scope.page.title;
    Page.description = $scope.page.description;
    Page.url = $scope.page.url;
    Page.type = $scope.page.type;
    // ... and reading from Page and Users factories ...
    author: Users.id
    ```
*   **Recommendation:** While common in older AngularJS, a more maintainable approach is to use services with methods that control access and modification of the state. The service can hold the data internally and provide getter/setter methods or return copies of the data. For more complex state, consider a simple state management pattern or library.
*   **Corrected Code Example (Conceptual Service):** See `PageService` example above, where the service would manage the `Page` data internally and the controller would interact via service methods.

**Issue 3: High Coupling via `$rootScope.$broadcast`**

*   **Explanation:** The controller uses `$rootScope.$broadcast` to notify other parts of the application about events like 'notify', 'contentGet', and 'settingsGet'. Broadcasting on `$rootScope` creates a global event bus, making it difficult to determine which components are listening and where events originate. This increases coupling.
*   **Problematic Code:** `$rootScope.$broadcast('notify', {message: translatedText});`, `$rootScope.$broadcast('contentGet');`, `$rootScope.$broadcast('settingsGet');`.
*   **Recommendation:** For communication between unrelated components, a dedicated event service is better than `$rootScope`. For communication between parent/child or sibling components, consider using `$scope.$emit`/`$scope.$on` (though still event-based) or, preferably, passing data/callbacks via component bindings (directives). If the communication is part of an asynchronous flow (like data loading), promises or callbacks passed via a service are often cleaner.
*   **Corrected Code Example (Conceptual Service with Events):**
    ```js
    // notificationService.js
    angular.module('cosmo').service('notificationService', ['$rootScope', function($rootScope) {
        return {
            notify: function(message, classes) {
                $rootScope.$broadcast('app:notify', { message: message, classes: classes }); // Use a specific event prefix
            }
        };
    }]);

    // pageCtrl.js - Using notification service
    angular.module('cosmo').controller('pageCtrl', ['$scope', 'PageService', 'Page', '$location', '$rootScope', '$routeParams', 'Users', '$translate', 'notificationService', function($scope, PageService, Page, $location, $rootScope, $routeParams, Users, $translate, notificationService){
        // ...
        PageService.deletePage($scope.page.id)
            .then(function() {
                $translate('deleted').then(function(translatedText) {
                    notificationService.notify(translatedText); // Use the service
                });
                $location.path('new');
            })
            .catch(function(error) {
                 console.error("Delete failed:", error);
                 $translate('page_error_deleting').then(function(translatedText) {
                    notificationService.notify(translatedText, 'alert-error'); // Use the service
                });
            });
        // ...
    }]);
    ```

### 3. Performance Optimization

**Issue 1: Potential Race Conditions and Inefficient API Orchestration**

*   **Explanation:** In the `savePage` function (specifically the update path), tags and extras are deleted, and then new ones are saved in loops. The save operations are asynchronous, but the code doesn't explicitly wait for the delete operations to complete before starting the saves. While `$resource` might handle this internally to some extent, relying on implicit behavior can lead to race conditions where a new item is saved before the old one is deleted, or vice versa, depending on network latency. Additionally, saving tags and extras one by one in a loop can be less efficient than sending them in a single batch request if the backend supports it.
*   **Problematic Code:** Lines 260-263 (`deleteTagsPromise`) and 270-298 (`deleteExtrasPromise`) in `pageCtrl.js`.
    ```js
    // pageCtrl.js - snippet from updatePagePromise
    REST.contentTags.delete({ contentID: $scope.page.id }, deleteTagsPromise); // Fire delete

    // Callback after tags are deleted - THEN save new ones in a loop
    function deleteTagsPromise(){
        angular.forEach($scope.page.tags, function(value){
            REST.contentTags.save({ contentID: $scope.page.id, tag: value }); // Fire saves in a loop
        });
    }

    // Callback after deleting extras - THEN save new ones in a loop
    function deleteExtrasPromise(){
        for (var key in Page.extras){
            // ... save new extra ...
            REST.contentExtras.save({ /* ... */ }, saveExtrasPromise, saveExtrasPromise); // Fire saves in a loop
            // ... save new extra to revisions ...
            REST.contentRevisionsExtras.save({ /* ... */ }); // Fire saves in a loop
        }
        // ... manual counter logic ...
    }
    ```
*   **Recommendation:** Use `$q.all` to wait for all delete operations to complete before starting the save operations. If the backend supports batch operations for tags and extras, modify the API calls to send all items in a single request instead of individual calls within a loop.
*   **Corrected Code Example (Conceptual using `$q.all`):** See the conceptual promise-based refactor in the Readability section. It demonstrates using `$q.all` to wait for multiple promises to resolve concurrently.

**Issue 2: Unnecessary Local Storage Writes (Potential)**

*   **Explanation:** Although the `saveLocal` function is currently dead code, its presence suggests an intention to save form changes to `localStorage` frequently (e.g., on keyup). Saving to `localStorage` on every keystroke can be inefficient, especially for large text areas, and can potentially impact UI responsiveness.
*   **Problematic Code:** The `saveLocal` function (lines 109-121 in `pageCtrl.js`).
*   **Recommendation:** If implementing auto-save to `localStorage`, use debouncing or throttling to limit the frequency of writes. Alternatively, save only when the user navigates away or after a short period of inactivity. Since the function is currently dead code, the immediate action is removal (as per Readability).

**Issue 3: Date Handling Ambiguity**

*   **Explanation:** The code uses a mix of `new Date()`, `Date.parse()`, and potentially Unix timestamps (`Math.round(+new Date().getTime()/1000)`). `Date.parse()` can have inconsistent behavior across different browsers and locales. Handling dates and times, especially for scheduling, is prone to timezone issues if not done carefully.
*   **Problematic Code:** Lines 25-33 and 178-188 in `pageCtrl.js`.
    ```js
    // pageCtrl.js - Date initialization
    if(!$scope.page.scheduleDate || $location.path() === '/new')
        $scope.page.scheduleDate = new Date(); // Math.round(+new Date().getTime()/1000); Depreciate?

    // pageCtrl.js - Date parsing for saving
    else if($scope.page.publish === 'schedule'){
        scheduleDate = Date.parse($scope.page.scheduleDate).getTime()/1000;
        // Check if this is back dated
        if(Date.parse($scope.page.scheduleDate).getTime() < Math.round(+new Date().getTime()))
            $scope.page.publish = 'Y';
        else
            $scope.page.publish = 'N';
    }
    ```
*   **Recommendation:** Use ISO 8601 strings (`YYYY-MM-DDTHH:mm:ss.sssZ`) for transferring dates to/from the backend. Use standard JavaScript `Date` objects for manipulation, being mindful of whether you need local time or UTC. If complex date/time logic is required, consider a library like Moment.js or date-fns, although for simple scheduling, careful use of native `Date` and ISO strings might suffice. Ensure the backend correctly handles the timezone information. The HTML input `type="datetime-local"` binds to a string in `YYYY-MM-DDTHH:mm` format, which needs careful parsing.
*   **Corrected Code Example (Conceptual):**
    ```js
    // pageCtrl.js - Conceptual date handling
    // Initialize schedule date
    if (!$scope.page.scheduleDate || $location.path() === '/new') {
        // Initialize with current date/time in local format for datetime-local input
        var now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Adjust for timezone to get local time string
        $scope.page.scheduleDate = now.toISOString().slice(0, 16); // Format for datetime-local input (YYYY-MM-DDTHH:mm)
    } else {
        // Ensure existing date is in the correct format for the input
        // Assuming Page.scheduleDate comes from backend as Unix timestamp or ISO string
        var existingDate = new Date(Page.scheduleDate * 1000); // If Unix timestamp
        // Or: var existingDate = new Date(Page.scheduleDate); // If ISO string
        existingDate.setMinutes(existingDate.getMinutes() - existingDate.getTimezoneOffset());
        $scope.page.scheduleDate = existingDate.toISOString().slice(0, 16);
    }


    // pageCtrl.js - Date parsing for saving
    var scheduleDateToSend; // This should be a Unix timestamp or ISO string for the backend
    if ($scope.page.publish === 'Y' && Page.publish === 'Y') {
        scheduleDateToSend = Page.scheduleDate; // Use existing date if already published
    } else if ($scope.page.publish === 'Y') {
        scheduleDateToSend = Math.round(Date.now() / 1000); // Current time as Unix timestamp
    } else if ($scope.page.publish === 'schedule') {
        var scheduledDateTime = new Date($scope.page.scheduleDate); // Parse YYYY-MM-DDTHH:mm string
        scheduleDateToSend = Math.round(scheduledDateTime.getTime() / 1000); // Convert to Unix timestamp

        // Check if back dated (compare parsed date with current time)
        if (scheduledDateTime.getTime() < Date.now()) {
            $scope.page.publish = 'Y'; // Treat as published now
            scheduleDateToSend = Math.round(Date.now() / 1000); // Use current time
        } else {
            $scope.page.publish = 'N'; // Keep as scheduled (or 'schedule' if backend supports it)
        }
    }
    // Send scheduleDateToSend to backend
    ```

### 4. Accessibility Improvements

**Issue 1: Autocomplete Suggestions Lack ARIA Attributes and Keyboard Navigation**

*   **Explanation:** The tag suggestions are displayed as `<a>` elements within a `div`. While visually functional, this structure lacks the necessary ARIA attributes (`role="listbox"`, `role="option"`, `aria-autocomplete`, `aria-controls`, `aria-activedescendant`) to inform screen readers and assistive technologies that this is an autocomplete list. Keyboard navigation (up/down arrows to select, Enter to confirm) is also not implemented.
*   **Problematic Code:** Lines 49-51 in `page.html`.
    ```html
    <!-- page.html - Autocomplete suggestions -->
    <div class="tag-suggestions" ng-show="page.suggestions.length">
        <a ng-repeat="tag in page.suggestions | limitTo:10" ng-click="selectSuggestion(tag)">{{tag | titlecase}}</a>
    </div>
    ```
*   **Recommendation:** Implement WAI-ARIA Authoring Practices for autocomplete. Add `role="combobox"` to the input container, `aria-autocomplete="list"` to the input, `role="listbox"` to the suggestions container, and `role="option"` to each suggestion item. Add keyboard event listeners (`ng-keydown`) to the input to handle arrow keys and Enter for navigation and selection.
*   **Corrected Code Example (Conceptual HTML & JS):**
    ```html
    <!-- page.html - Conceptual ARIA for Autocomplete -->
    <label for="tags" translate="tags"></label>
    <div class="autocomplete-container" role="combobox" aria-haspopup="listbox" aria-expanded="{{page.suggestions.length > 0}}">
        <input
            value="tags"
            type="text"
            ng-list
            ng-model="page.tags"
            ng-change="autocompleteTags()"
            ng-keydown="handleTagKeydown($event)"
            placeholder="about, restaurant, food, nyc"
            aria-autocomplete="list"
            aria-controls="tag-suggestions-list"
            aria-describedby="tag-suggestions-desc"
        >
        <div id="tag-suggestions-list" class="tag-suggestions" ng-show="page.suggestions.length" role="listbox">
            <a
                ng-repeat="tag in page.suggestions | limitTo:10"
                ng-click="selectSuggestion(tag)"
                role="option"
                id="tag-suggestion-{{$index}}"
                aria-selected="{{$index === activeSuggestionIndex}}"
            >{{tag | titlecase}}</a>
        </div>
    </div>
    <p id="tag-suggestions-desc" class="sr-only">Type to get tag suggestions.</p> <!-- Screen reader only description -->

    ```
    ```js
    // pageCtrl.js - Conceptual JS for Autocomplete Accessibility
    $scope.activeSuggestionIndex = -1; // Track active suggestion for keyboard nav

    $scope.handleTagKeydown = function(event) {
        var suggestions = $scope.page.suggestions;
        if (!suggestions || suggestions.length === 0) return;

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault(); // Prevent cursor movement in input
                $scope.activeSuggestionIndex = ($scope.activeSuggestionIndex + 1) % suggestions.length;
                // Optional: Scroll active suggestion into view
                break;
            case 'ArrowUp':
                event.preventDefault(); // Prevent cursor movement in input
                $scope.activeSuggestionIndex = ($scope.activeSuggestionIndex - 1 + suggestions.length) % suggestions.length;
                // Optional: Scroll active suggestion into view
                break;
            case 'Enter':
                if ($scope.activeSuggestionIndex > -1) {
                    event.preventDefault(); // Prevent form submission
                    $scope.selectSuggestion(suggestions[$scope.activeSuggestionIndex]);
                }
                break;
            case 'Escape':
                $scope.page.suggestions = []; // Hide suggestions
                $scope.activeSuggestionIndex = -1;
                break;
        }
    };

    $scope.selectSuggestion = function(tag) {
        // ... existing logic ...
        $scope.activeSuggestionIndex = -1; // Reset index
    };

    // Reset active index when suggestions change
    $scope.$watch('page.suggestions', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.activeSuggestionIndex = -1;
        }
    });
    ```

**Issue 2: Notification Accessibility**

*   **Explanation:** The application uses `$rootScope.$broadcast('notify', ...)` to display messages (saved, deleted, errors). It's not clear from the provided code how these notifications are rendered. For accessibility, important notifications (especially errors) should be conveyed to screen reader users, ideally using ARIA live regions.
*   **Problematic Code:** `$rootScope.$broadcast('notify', {message: translatedText});` throughout `pageCtrl.js`.
*   **Recommendation:** Ensure the component that listens for the 'notify' event and displays the message uses an ARIA live region (`role="status"` for non-critical, `role="alert"` for critical errors) so that screen readers automatically announce the message when it appears without the user having to move focus.

**Issue 3: Radio Button `ng-modal` Typo**

*   **Explanation:** The HTML template uses `ng-modal` instead of the correct directive `ng-model` for the radio buttons. This is a functional bug that also impacts accessibility as the form control's value won't be correctly bound, potentially confusing assistive technologies.
*   **Problematic Code:** Lines 65, 67, 69 in `page.html`.
    ```html
    <!-- page.html - Incorrect directive -->
    <input  type="radio" ng-class="{active: page.publish=='Y'}" name="publish" id="Y" value="Y" ng-modal="page.publish">
    <label for="Y" ng-click="page.publish='Y'" translate="publish"></label>
    <input  type="radio" ng-class="{active: page.publish=='N'}" name="publish" id="N" value="N" ng-modal="page.publish">
    <label for="N" ng-click="page.publish='N'" translate="draft"></label>
    <input  type="radio" ng-class="{active: page.publish=='schedule'}" name="publish" id="schedule" value="schedule" ng-modal="page.publish">
    <label for="schedule" ng-click="page.publish='schedule'" translate="schedule"></label>
    ```
*   **Recommendation:** Correct the typo to `ng-model`. The `ng-click` on the label is a common pattern in AngularJS to make the whole label clickable, but the `for` attribute on the label linking to the input's `id` is the standard and most accessible way. Using both is fine, but `ng-model` is essential for binding.
*   **Corrected Code Example:**
    ```html
    <!-- page.html - Corrected directive -->
    <input  type="radio" ng-class="{active: page.publish=='Y'}" name="publish" id="Y" value="Y" ng-model="page.publish">
    <label for="Y" ng-click="page.publish='Y'" translate="publish"></label>
    <input  type="radio" ng-class="{active: page.publish=='N'}" name="publish" id="N" value="N" ng-model="page.publish">
    <label for="N" ng-click="page.publish='N'" translate="draft"></label>
    <input  type="radio" ng-class="{active: page.publish=='schedule'}" name="publish" id="schedule" value="schedule" ng-model="page.publish">
    <label for="schedule" ng-click="page.publish='schedule'" translate="schedule"></label>
    ```

### 5. Angular.js Best Practices

**Issue 1: Fat Controller**

*   **Explanation:** As detailed in Maintainability, the controller handles too much logic.
*   **Problematic Code:** `pageCtrl.js`.
*   **Recommendation:** Move business logic into services.

**Issue 2: Shared Mutable State Factories**

*   **Explanation:** As detailed in Maintainability, using factories as directly mutable shared state is less maintainable than services with controlled access.
*   **Problematic Code:** `Page.js`, `Users.js`, and their usage in `pageCtrl.js`.
*   **Recommendation:** Refactor `Page` and `Users` into services with methods.

**Issue 3: Callback Hell**

*   **Explanation:** As detailed in Readability and Maintainability, the nested callbacks in `savePage` are an anti-pattern.
*   **Problematic Code:** `savePage` function in `pageCtrl.js`.
*   **Recommendation:** Use promises (`.then()`, `$q.all`) for asynchronous flow control.

**Issue 4: `$rootScope.$broadcast` Overuse**

*   **Explanation:** As detailed in Maintainability, using `$rootScope` for general communication increases coupling.
*   **Problematic Code:** `$rootScope.$broadcast` calls in `pageCtrl.js`.
*   **Recommendation:** Use dedicated event services, promises, or component bindings for communication.

**Issue 5: `ng-modal` Typo**

*   **Explanation:** Functional and accessibility bug due to a typo in the directive name.
*   **Problematic Code:** `ng-modal` in `page.html`.
*   **Recommendation:** Correct to `ng-model`.

**Issue 6: Incorrect Object Length Check**

*   **Explanation:** The code attempts to check the number of properties in the `Page.extras` object using `.length`, which is incorrect for plain JavaScript objects.
*   **Problematic Code:** Line 238 and 299 in `pageCtrl.js`.
    ```js
    // pageCtrl.js - Incorrect length check
    if(Object.keys(Page.extras).length === 0){ // Correct check
        // ...
    } else {
        for(var key in Page.extras){ /* ... */ }
    }
    // ...
    if(!Page.extras.length) { // Incorrect check
        // ...
    }
    ```
*   **Recommendation:** Use `Object.keys(Page.extras).length` to get the number of own enumerable properties in an object.
*   **Corrected Code Example:**
    ```js
    // pageCtrl.js - Corrected length check
    if(Object.keys(Page.extras).length === 0){
        // Success message
        $translate('saved').then(function(translatedText){
            $rootScope.$broadcast('notify', {message: translatedText});
        });
        // Redirect to new page
        $location.path($scope.page.url);
    } else {
        for(var key in Page.extras){
            // ...
        }
    }
    // ...
    // If there were no extras, notify right away
    if(Object.keys(Page.extras).length === 0) { // Corrected check
        $translate('page_updated').then(function(translatedText){
            $rootScope.$broadcast('notify', {message: translatedText});
        });
    }
    ```

**Issue 7: Direct DOM Manipulation (Implicit via `ng-class`)**

*   **Explanation:** While not direct DOM manipulation *in the controller*, using `ng-class="{active: page.publish=='Y'}"` for radio buttons is a visual cue. The standard way to style selected radio buttons is via CSS pseudo-classes (`:checked`) combined with styling the associated label, which is generally more robust and separates styling from logic.
*   **Problematic Code:** Lines 65, 67, 69 in `page.html`.
    ```html
    <!-- page.html - Styling via ng-class -->
    <input  type="radio" ng-class="{active: page.publish=='Y'}" name="publish" id="Y" value="Y" ng-model="page.publish">
    <label for="Y" ng-click="page.publish='Y'" translate="publish"></label>
    ```
*   **Recommendation:** Use CSS `:checked` pseudo-class selectors to style the label based on the radio button's state. This keeps styling concerns in CSS.
*   **Corrected Code Example (Conceptual CSS):**
    ```css
    /* styles.css */
    input[type="radio"] {
        /* Hide the default radio button */
        position: absolute;
        opacity: 0;
        pointer-events: none;
    }

    input[type="radio"] + label {
        /* Style the label to look like a button/option */
        display: inline-block;
        padding: 8px 15px;
        border: 1px solid #ccc;
        cursor: pointer;
        margin-right: 10px;
        /* Add other styling */
    }

    input[type="radio"]:checked + label {
        /* Style the label when the radio button is checked */
        background-color: #007bff; /* Example active style */
        color: white;
        border-color: #007bff;
    }

    /* Remove ng-class="active" from HTML */
    ```

### 6. Documentation Enhancement

**Issue 1: Lack of JSDoc**

*   **Explanation:** The JavaScript files have basic comment blocks at the top, but functions and factory properties lack detailed documentation explaining their purpose, parameters, and return values.
*   **Problematic Code:** All JavaScript files.
*   **Recommendation:** Add JSDoc comments to factories, services, and controller functions. This improves code understanding and allows for documentation generation tools.
*   **Corrected Code Example:**
    ```js
    // rest.js - JSDoc for Factory
    /**
     * @ngdoc factory
     * @name cosmo.REST
     * @description
     * Factory to interact with the RESTful backend using $resource.
     * Provides resource definitions for various API endpoints.
     */
    angular.module('cosmo').factory('REST', ['$resource', 'Page', function($resource, Page) {
        return {
            /**
             * @ngdoc property
             * @name cosmo.REST#blocks
             * @propertyOf cosmo.REST
             * @description Resource for managing blocks.
             * @example
             * REST.blocks.get({ blockID: 123 });
             */
            'blocks': $resource('api/blocks/:blockID', { blockID: '@blockID'},{ update: { method: 'PUT' } }),
            // ... add JSDoc for other resources ...
        };
    }]);

    // pageCtrl.js - JSDoc for Controller and Function
    /**
     * @ngdoc controller
     * @name cosmo.pageCtrl
     * @description
     * Controller for managing page creation and editing.
     * Handles form data, local storage, and interaction with backend services.
     */
    angular.module('cosmo').controller('pageCtrl', ['$scope', 'REST', '$location', 'Page', '$rootScope', '$routeParams', '$upload', 'Users', '$translate', function($scope, REST, $location, Page, $rootScope, $routeParams, $upload, Users, $translate){

        // ... initialization ...

        /**
         * @ngdoc method
         * @name cosmo.pageCtrl#savePage
         * @methodOf cosmo.pageCtrl
         * @description
         * Saves or updates the current page. Handles validation, API calls,
         * tag/extra/revision saving, and notifications.
         * @param {boolean} [duplicate=false] If true, saves the page as a new duplicate.
         */
        $scope.savePage = function(duplicate){
            // ... function logic ...
        };

        // ... add JSDoc for other functions ...
    }]);
    ```

**Issue 2: Sparse Inline Comments in Complex Logic**

*   **Explanation:** The `savePage` function, being very complex, lacks sufficient inline comments to explain the different steps, conditions, and the purpose of nested callbacks.
*   **Problematic Code:** The `savePage` function in `pageCtrl.js`.
*   **Recommendation:** Add inline comments within complex functions to explain specific blocks of code, especially conditional logic, loops, and asynchronous calls. This complements JSDoc by explaining *how* a function works internally.

### Summary

The code provides a functional implementation for managing pages in an AngularJS application. The primary areas for improvement lie in **maintainability** and **readability**, largely due to the "fat controller" anti-pattern and the use of callback-based asynchronous logic. Refactoring the `pageCtrl` to delegate business logic to a dedicated service and utilizing promises for API call orchestration would significantly enhance the code's structure, testability, and ease of maintenance. Addressing the identified bugs (`ng-modal`, object length check) and improving accessibility features (autocomplete, notifications) are also important steps. Adding comprehensive documentation will aid future development and understanding.

### Tokens: {'input_tokens': 6530, 'output_tokens': 10372}
### Execution time: 82.19926404953003
