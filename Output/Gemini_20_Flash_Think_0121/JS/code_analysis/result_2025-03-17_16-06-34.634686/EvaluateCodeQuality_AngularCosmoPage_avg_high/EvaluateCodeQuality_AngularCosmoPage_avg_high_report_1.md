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
Okay, let's analyze the provided AngularJS application code based on your criteria.

## Code Evaluation Report

Here's an evaluation of the provided code, broken down by the aspects you requested.

### 1. Readability Assessment

**Issue 1.1: Inconsistent Variable Naming (Minor)**

*   **Explanation:** While generally good, there's a slight inconsistency. In `pageCtrl.js`, within the `savePage` function, `scheduleDate` is sometimes used as a variable name and sometimes `$scope.page.scheduleDate`. While understandable in context, consistent usage improves readability.
*   **Problematic Code Snippet:**

    ```js
    // pageCtrl.js - inside savePage function
    if($scope.page.publish === 'Y' && Page.publish === 'Y') // If this was already published, don't update the published date
        scheduleDate = Page.scheduleDate;
    else if($scope.page.publish === 'Y') // If publishing now, set the publish date to the current time
        scheduleDate = Math.round(+new Date().getTime()/1000);
    else if($scope.page.publish === 'schedule'){
        scheduleDate = Date.parse($scope.page.scheduleDate).getTime()/1000;
        // ...
    ```

*   **Recommendation:**  Be consistent with using `$scope.page.scheduleDate` throughout the controller to refer to the model value, or if `scheduleDate` is meant to be a temporary variable within the scope of `savePage`, make it explicitly clear and consistently used within that scope. For this case, using `$scope.page.scheduleDate` consistently would be clearer.

**Issue 1.2: Complex Logic in `savePage` Function (Moderate)**

*   **Explanation:** The `savePage` function in `pageCtrl.js` is quite long and handles multiple scenarios (new page, duplicate, update, revisions, extras, tags). This makes it harder to follow the logic at a glance.
*   **Problematic Code Snippet:** The entire `savePage` function in `pageCtrl.js` is lengthy.
*   **Recommendation:** Break down the `savePage` function into smaller, more focused functions. For example:
    *   `_saveNewPage(duplicate)`: Handles saving a new page or a duplicate.
    *   `_updateExistingPage()`: Handles updating an existing page.
    *   `_savePageRevision(contentID)`: Handles saving a page revision.
    *   `_savePageExtras(contentID, revisionID)`: Handles saving page extras.
    *   `_savePageTags(contentID)`: Handles saving page tags.

*   **Corrected Code Example (Conceptual - Refactoring `savePage`):**

    ```js
    // pageCtrl.js - Refactored savePage (Conceptual)
    $scope.savePage = function(duplicate){
        // ... (Input validations and checks - URL, type, etc.) ...

        if($location.path() === '/new' || duplicate){
            $scope._saveNewPage(duplicate);
        } else {
            $scope._updateExistingPage();
        }
    };

    $scope._saveNewPage = function(duplicate) {
        // ... (Prepare data, scheduleDate, featured image) ...
        REST.content.save({ /* ... page data ... */ }, function newPagePromise(data){
            var contentID = data.id;
            $scope._savePageTags(contentID);
            $scope._savePageRevision(contentID);
            // ... (Success notification and redirect) ...
        }, function(){ /* ... error handling ... */ });
    };

    $scope._updateExistingPage = function() {
        // ... (Prepare data, scheduleDate, featured image) ...
        REST.content.update({ /* ... page data ... */ }, function updatePagePromise(data){
            $scope._savePageTags($scope.page.id); // Assuming $scope.page.id is available
            $scope._savePageRevision($scope.page.id);
            // ... (Success notification) ...
        }, function(data){ /* ... error handling ... */ });
    };

    $scope._savePageRevision = function(contentID) {
        // ... (Prepare revision data) ...
        REST.contentRevisions.save({ /* ... revision data ... */ }, function saveRevisionPromise(data){
            var revisionID = data.id;
            $scope._savePageExtras(contentID, revisionID);
        });
    };

    $scope._savePageExtras = function(contentID, revisionID) {
        // ... (Logic to save extras, potentially using promises for better control) ...
    };

    $scope._savePageTags = function(contentID) {
        // ... (Logic to save tags) ...
    };
    ```

    **Note:** This is a conceptual refactoring. The actual implementation would involve moving the relevant code blocks from the original `savePage` function into these new, smaller functions. This approach significantly improves readability by breaking down the complex logic into manageable parts.

### 2. Maintainability Evaluation

**Issue 2.1: Tight Coupling with `localStorage` in Controller (Moderate)**

*   **Explanation:** The `pageCtrl.js` directly interacts with `localStorage` to persist unsaved changes (`saveLocal`, `localVersion`, `deleteNewerVersion`). This tightly couples the controller to browser-specific storage and makes testing and potential future changes (e.g., using a different storage mechanism) more difficult.
*   **Problematic Code Snippet:**

    ```js
    // pageCtrl.js - saveLocal function and related functions
    $scope.saveLocal = function(){
        // ...
        localStorage.setItem($routeParams.url + 'title', Page.title);
        // ...
    };

    $scope.localVersion = function(){
        // ...
        if(localStorage.getItem($routeParams.url + value) !== 'null')
            Page[value] = localStorage.getItem($routeParams.url + value);
        // ...
    };
    ```

*   **Recommendation:** Create a dedicated service (e.g., `localStorageService` or `pagePersistenceService`) to handle all interactions with `localStorage`. This service would encapsulate the storage logic, making the controller cleaner and more maintainable.

*   **Corrected Code Example (Service for localStorage):**

    ```js
    // localStorageService.js (New Service)
    angular.module('cosmo').service('localStorageService', ['$routeParams', 'Page', function($routeParams, Page) {
        var storagePrefix = $routeParams.url; // Or a more robust key generation

        this.savePageData = function(pageData) {
            var elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url', 'type']; // Include 'type'
            angular.forEach(elements, function(value){
                localStorage.setItem(storagePrefix + value, pageData[value]); // Use pageData instead of Page
            });
        };

        this.getLocalPageData = function() {
            var localData = {};
            var elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url', 'type']; // Include 'type'
            angular.forEach(elements, function(value){
                localData[value] = localStorage.getItem(storagePrefix + value);
            });
            return localData;
        };

        this.clearLocalPageData = function() {
            var elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url', 'type']; // Include 'type'
            angular.forEach(elements, function(value){
                localStorage.setItem(storagePrefix + value, null);
            });
        };
    }]);

    // pageCtrl.js - Updated to use localStorageService
    angular.module('cosmo').controller('pageCtrl', ['$scope', 'REST', '$location', 'Page', '$rootScope', '$routeParams', '$upload', 'Users', '$translate', 'localStorageService', function($scope, REST, $location, Page, $rootScope, $routeParams, $upload, Users, $translate, localStorageService){
        // ... (Controller initialization) ...

        $scope.saveLocal = function(){
            localStorageService.savePageData($scope.page); // Pass $scope.page data
        };

        $scope.localVersion = function(){
            var localData = localStorageService.getLocalPageData();
            var elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url', 'type']; // Include 'type'
            angular.forEach(elements, function(value){
                if(localData[value] !== 'null' && localData[value] !== null) { // Check for null string and actual null
                    Page[value] = localData[value];
                }
            });
            localStorageService.clearLocalPageData();
            $scope.newerVersion = false;
            $rootScope.$broadcast('contentGet');
        };

        $scope.deleteNewerVersion = function(){
            localStorageService.clearLocalPageData();
            $scope.newerVersion = false;
        };

        // ... (Rest of the controller) ...
    }]);
    ```

    **Benefits:**
    *   **Separation of Concerns:** Controller logic is separated from storage logic.
    *   **Testability:** `localStorageService` can be easily mocked for unit testing `pageCtrl`.
    *   **Flexibility:**  Easier to switch to a different storage mechanism (e.g., IndexedDB, server-side storage) in the future by modifying only the service.

**Issue 2.2: Global `Page` and `Users` Factories as State Containers (Moderate for larger apps)**

*   **Explanation:**  The `Page` and `Users` factories are used as global state containers. While this is common in smaller AngularJS applications, for larger applications, it can lead to less predictable state management and potential issues with data flow and debugging.
*   **Problematic Code Snippet:**  `Page.js`, `Users.js`, and how they are used throughout `pageCtrl.js`.
*   **Recommendation:** For larger applications, consider using a more structured state management approach. Options include:
    *   **Services with events:**  Instead of directly modifying `Page` factory properties, use methods on a `PageService` that emit events when page data changes. Controllers can then subscribe to these events.
    *   **Flux/Redux-like architecture (with libraries like `ng-redux`):**  For more complex state management needs, consider adopting a Flux or Redux-inspired architecture. This provides a more predictable and unidirectional data flow.
    *   **Component-based architecture (if migrating towards Angular):** If considering a migration to newer Angular versions, adopting a component-based architecture naturally promotes better state management within components and using services for shared state.

*   **Corrected Code Example (Conceptual - Service with Events):**

    ```js
    // pageService.js (New Service)
    angular.module('cosmo').service('pageService', ['$rootScope', function($rootScope) {
        var pageData = { // Private page data
            id: 0,
            title: '',
            // ... other properties ...
        };

        this.getPageData = function() {
            return angular.copy(pageData); // Return a copy to prevent direct modification
        };

        this.updatePageData = function(newData) {
            angular.extend(pageData, newData); // Merge new data
            $rootScope.$broadcast('pageDataUpdated', pageData); // Emit event
        };

        // ... methods to update specific properties, etc. ...
    }]);

    // pageCtrl.js - Updated to use pageService
    angular.module('cosmo').controller('pageCtrl', ['$scope', 'pageService', function($scope, pageService) {
        $scope.page = pageService.getPageData(); // Get initial page data

        $scope.titleChange = function(){
            $scope.page.title = Page.title; // Still updating $scope.page directly in view
            pageService.updatePageData({ title: $scope.page.title }); // Update service state
            // ...
        };

        $scope.$on('pageDataUpdated', function(event, updatedPageData) {
            // React to page data updates if needed (e.g., for cross-component communication)
            console.log("Page data updated:", updatedPageData);
        });

        // ... (Rest of the controller, using pageService to manage Page data) ...
    }]);
    ```

    **Note:** This is a simplified example. A full implementation would involve more methods in `pageService` to manage different aspects of page data and potentially more granular events.

### 3. Performance Optimization

**Issue 3.1: Potentially Inefficient `localStorage` Usage in `saveLocal` (Minor)**

*   **Explanation:** The `saveLocal` function is called on every `ng-keyup` event for title, description, and URL inputs.  Saving to `localStorage` on every keystroke might be slightly inefficient, especially for longer content or slower browsers.
*   **Problematic Code Snippet:**

    ```html
    // page.html
    <input type='text' ng-model="page.title" ng-keyup="titleChange(); saveLocal()" placeholder="about us, contact us">
    <textarea value="description" ng-model="page.description" ng-keyup="descriptionChange(); saveLocal()" placeholder="..."> </textarea>
    <input value="url" type='text' ng-model='page.url' ng-keyup="autoURL=false;urlChange(); saveLocal()">
    ```

*   **Recommendation:** Debounce or throttle the `saveLocal` function.  Instead of saving on every `keyup`, save after a short delay of inactivity (e.g., 300-500ms) or when the input field loses focus (`ng-blur`).

*   **Corrected Code Example (Debouncing with `$timeout`):**

    ```js
    // pageCtrl.js - Debounced saveLocal
    angular.module('cosmo').controller('pageCtrl', ['$scope', '$timeout', /* ... other dependencies ... */ function($scope, $timeout, /* ... */) {
        var saveLocalTimeout;

        $scope.saveLocalDebounced = function() {
            if (saveLocalTimeout) {
                $timeout.cancel(saveLocalTimeout);
            }
            saveLocalTimeout = $timeout($scope.saveLocal, 500); // 500ms delay
        };

        $scope.saveLocal = function(){ // Original saveLocal function
            Page.title = $scope.page.title;
            Page.description = $scope.page.description;
            Page.url = $scope.page.url;
            Page.type = $scope.page.type;
            // Save to local Storage (using localStorageService if implemented)
            localStorage.setItem($routeParams.url + 'title', Page.title);
            localStorage.setItem($routeParams.url + 'description', Page.description);
            localStorage.setItem($routeParams.url + 'url', Page.url);
            localStorage.setItem($routeParams.url + 'publish', Page.publish);
            localStorage.setItem($routeParams.url + 'scheduleDate', Page.scheduleDate);
            localStorage.setItem($routeParams.url + 'type', Page.type);
        };

        // ... (Rest of the controller) ...
    }]);

    // page.html - Use debounced function
    <input type='text' ng-model="page.title" ng-keyup="titleChange(); saveLocalDebounced()" placeholder="about us, contact us">
    <textarea value="description" ng-model="page.description" ng-keyup="descriptionChange(); saveLocalDebounced()" placeholder="..."> </textarea>
    <input value="url" type='text' ng-model='page.url' ng-keyup="autoURL=false;urlChange(); saveLocalDebounced()">
    ```

    **Alternatively, using `ng-blur`:**

    ```html
    // page.html - Using ng-blur instead of ng-keyup for saveLocal
    <input type='text' ng-model="page.title" ng-keyup="titleChange()" ng-blur="saveLocal()" placeholder="about us, contact us">
    <textarea value="description" ng-model="page.description" ng-keyup="descriptionChange()" ng-blur="saveLocal()" placeholder="..."> </textarea>
    <input value="url" type='text' ng-model='page.url' ng-keyup="autoURL=false;urlChange()" ng-blur="saveLocal()">
    ```

    Using `ng-blur` might be simpler and sufficient in many cases, as it saves when the user finishes interacting with the input field.

**Issue 3.2: Potential Redundant REST Calls in `savePage` (Minor)**

*   **Explanation:** In the `savePage` function, after updating or creating content, there are separate REST calls for `contentRevisions.save`, `contentExtras.save`, and `contentTags.save`. While necessary, consider if these calls can be optimized or parallelized if order is not strictly critical.
*   **Problematic Code Snippet:**  The sequence of REST calls within `savePage` in `pageCtrl.js`.
*   **Recommendation:**
    *   **Parallelize calls (if order allows):** If the order of saving revisions, extras, and tags is not strictly dependent, use `$q.all` to execute these REST calls in parallel. This can reduce the overall save time.
    *   **Batch operations (if backend supports):** If the backend API supports batch operations for saving tags or extras, consider using them to reduce the number of HTTP requests.

*   **Corrected Code Example (Conceptual - Parallelizing with `$q.all`):**

    ```js
    // pageCtrl.js - Conceptual parallel REST calls in savePage (simplified for illustration)
    angular.module('cosmo').controller('pageCtrl', ['$scope', '$q', /* ... other dependencies ... */ function($scope, $q, /* ... */) {
        // ... (Inside savePage, after content is saved/updated and contentID is available) ...

        var revisionPromise = REST.contentRevisions.save({ /* ... revision data ... */ }).$promise;
        var tagsPromise = $q.when($scope._savePageTags(contentID)); // Assuming _savePageTags returns a promise or wraps REST calls in promises
        var extrasPromise = $q.when($scope._savePageExtras(contentID, revisionID)); // revisionID might be needed from revisionPromise

        $q.all([revisionPromise, tagsPromise, extrasPromise]).then(function(results) {
            // All save operations completed successfully
            // ... (Success notification and redirect) ...
        }, function(errors) {
            // Handle errors from any of the promises
            // ... (Error notification) ...
        });

        // ... (Rest of the controller) ...
    }]);
    ```

    **Important:**  Carefully consider the dependencies and error handling when parallelizing REST calls. Ensure that the application logic correctly handles potential failures in any of these parallel operations. Also, the backend API and server load should be considered before implementing aggressive parallelization.

### 4. Accessibility Improvements

**Issue 4.1: Radio Buttons Lack ARIA Attributes and Grouping (Moderate)**

*   **Explanation:** The radio buttons for "Publish," "Draft," and "Schedule" lack proper ARIA attributes to enhance accessibility for screen reader users. They also could benefit from explicit grouping.
*   **Problematic Code Snippet:**

    ```html
    // page.html - Radio buttons for publish status
    <input  type="radio" ng-class="{active: page.publish=='Y'}" name="publish" id="Y" value="Y" ng-modal="page.publish">
    <label for="Y" ng-click="page.publish='Y'" translate="publish"></label>
    <input  type="radio" ng-class="{active: page.publish=='N'}" name="publish" id="N" value="N" ng-modal="page.publish">
    <label for="N" ng-click="page.publish='N'" translate="draft"></label>
    <input  type="radio" ng-class="{active: page.publish=='schedule'}" name="publish" id="schedule" value="schedule" ng-modal="page.publish">
    <label for="schedule" ng-click="page.publish='schedule'" translate="schedule"></label>
    ```

*   **Recommendation:**
    *   **`aria-label` or `aria-labelledby` on radio inputs:** Provide a clear label for each radio button for screen readers. Since labels are already present, `aria-labelledby` is appropriate.
    *   **`aria-describedby` (optional):** If there's additional descriptive text for the radio group, use `aria-describedby` to associate it.
    *   **`fieldset` and `legend` for grouping (semantic HTML):** Wrap the radio buttons in a `<fieldset>` element with a `<legend>` to semantically group them.

*   **Corrected Code Example (Accessibility Enhanced Radio Buttons):**

    ```html
    // page.html - Accessibility enhanced radio buttons
    <fieldset aria-label="{{ 'page_publish_status_group' | translate }}"> <legend class="visually-hidden" translate="page_publish_status_group"></legend> <!-- Visually hidden legend for screen readers -->
        <input  type="radio" ng-class="{active: page.publish=='Y'}" name="publish" id="Y" value="Y" ng-model="page.publish" aria-labelledby="publish-label">
        <label for="Y" ng-click="page.publish='Y'" translate="publish" id="publish-label"></label>
        <input  type="radio" ng-class="{active: page.publish=='N'}" name="publish" id="N" value="N" ng-model="page.publish" aria-labelledby="draft-label">
        <label for="N" ng-click="page.publish='N'" translate="draft" id="draft-label"></label>
        <input  type="radio" ng-class="{active: page.publish=='schedule'}" name="publish" id="schedule" value="schedule" ng-model="page.publish" aria-labelledby="schedule-label">
        <label for="schedule" ng-click="page.publish='schedule'" translate="schedule" id="schedule-label"></label>
    </fieldset>
    ```

    **Explanation of Changes:**
    *   **`<fieldset>` and `<legend>`:**  Semantically groups the radio buttons. The `<legend>` is visually hidden using a CSS class (you'd need to define `.visually-hidden` in your CSS to hide it visually but keep it accessible to screen readers). The `aria-label` on `<fieldset>` provides a general label for the group.
    *   **`aria-labelledby`:** Each radio input now uses `aria-labelledby` to associate it with its corresponding `<label>` element using the `id` of the label. This explicitly tells screen readers which label belongs to which radio button.
    *   **`translate="page_publish_status_group"`:**  Added translation key for the fieldset's `aria-label` and the visually hidden `legend`.

**Issue 4.2: Focus Management and Keyboard Navigation (Moderate)**

*   **Explanation:**  The code doesn't explicitly handle focus management or ensure full keyboard navigation for all interactive elements. Users who rely on keyboards for navigation should be able to access and interact with all controls.
*   **Problematic Code Snippet:**  Lack of explicit focus management throughout `page.html`.
*   **Recommendation:**
    *   **Ensure logical tab order:** Verify that the tab order of elements in `page.html` is logical and follows the visual flow of the form.
    *   **Keyboard access for custom controls:** If there are any custom interactive elements (beyond standard HTML controls), ensure they are keyboard accessible (e.g., using `tabindex`, handling `keydown` events for custom actions). In this code, the `<a>` tags in `tag-suggestions` and the buttons in `bar--actions` and `new-version` should be keyboard navigable.
    *   **Focus indicators:** Ensure that there are clear visual focus indicators for all interactive elements when they are focused via keyboard navigation. This is usually handled by default browser styles, but ensure they are not overridden in a way that makes focus invisible.

*   **Corrected Code Example (Keyboard Navigation for Tag Suggestions - Conceptual):**

    ```html
    // page.html - Tag suggestions with keyboard navigation (Conceptual)
    <div class="tag-suggestions" ng-show="page.suggestions.length">
        <a ng-repeat="tag in page.suggestions | limitTo:10"
           ng-click="selectSuggestion(tag)"
           tabindex="0"  <!-- Make links focusable -->
           ng-keydown="$event.keyCode === 13 && selectSuggestion(tag)"> <!-- Handle Enter key for selection -->
           {{tag | titlecase}}
        </a>
    </div>
    ```

    **Explanation:**
    *   **`tabindex="0"`:**  Makes the `<a>` tags within `tag-suggestions` focusable using the keyboard (Tab key).
    *   **`ng-keydown="$event.keyCode === 13 && selectSuggestion(tag)"`:**  Handles the Enter key (`keyCode === 13`). When a suggestion link is focused and Enter is pressed, it triggers the `selectSuggestion(tag)` function, allowing keyboard users to select suggestions.

    **Further Accessibility Considerations:**
    *   **Error messages:** Ensure error messages (e.g., for form validation) are programmatically associated with the relevant input fields for screen readers (using `aria-describedby` or `aria-errormessage`).
    *   **Color contrast:** Check color contrast ratios for text and interactive elements to ensure they meet WCAG guidelines for users with low vision.
    *   **Testing with screen readers:**  The most effective way to ensure accessibility is to test the application with actual screen readers (like NVDA, VoiceOver, JAWS) and keyboard-only navigation.

### 5. Angular.js Best Practices

**Issue 5.1: Using `$rootScope.$broadcast` for Notifications (Acceptable for small apps, Scalability Concern)**

*   **Explanation:**  `$rootScope.$broadcast` is used for notifications (`$rootScope.$broadcast('notify', {message: translatedText, ...})`). While this works for simple applications, it can become harder to manage and debug in larger applications as the application grows and more components start broadcasting and listening to events on `$rootScope`. It can lead to tight coupling and make it difficult to track event flow.
*   **Problematic Code Snippet:**  Usage of `$rootScope.$broadcast` in `pageCtrl.js` for notifications.
*   **Recommendation:** For larger applications, consider using a more structured event bus or a dedicated notification service.

*   **Corrected Code Example (Conceptual - Notification Service):**

    ```js
    // notificationService.js (New Service)
    angular.module('cosmo').service('notificationService', ['$rootScope', function($rootScope) {
        this.notify = function(message, options) {
            $rootScope.$broadcast('appNotification', { message: message, options: options });
        };
    }]);

    // pageCtrl.js - Using notificationService
    angular.module('cosmo').controller('pageCtrl', ['$scope', 'notificationService', /* ... other dependencies ... */ function($scope, notificationService, /* ... */) {
        // ... (Inside savePage, deletePage, etc.) ...

        $translate('saved').then(function(translatedText){
            notificationService.notify(translatedText); // Use notification service
        });

        // ... (Rest of the controller) ...
    }]);

    // In a component or controller that needs to display notifications (e.g., main app controller)
    angular.module('cosmo').controller('appCtrl', ['$scope', function($scope) {
        $scope.$on('appNotification', function(event, notification) {
            // Display the notification (e.g., using an alert component)
            console.log("Notification:", notification.message, notification.options);
            // ... (Logic to display notification in UI) ...
        });
    }]);
    ```

    **Benefits:**
    *   **Decoupling:** Controllers and services that trigger notifications are decoupled from the components that display them. They only interact through the `notificationService`.
    *   **Centralized Logic:** Notification display logic is centralized in the component listening for `appNotification` events.
    *   **Testability:** `notificationService` can be easily mocked for testing components that use it.

**Issue 5.2:  `ng-modal` typo (Minor)**

*   **Explanation:** There's a typo in `page.html`. `ng-modal` should be `ng-model`.
*   **Problematic Code Snippet:**

    ```html
    // page.html - Radio buttons - typo in ng-model
    <input  type="radio" ng-class="{active: page.publish=='Y'}" name="publish" id="Y" value="Y" ng-modal="page.publish">
    <input  type="radio" ng-class="{active: page.publish=='N'}" name="publish" id="N" value="N" ng-modal="page.publish">
    <input  type="radio" ng-class="{active: page.publish=='schedule'}" name="publish" id="schedule" value="schedule" ng-modal="page.publish">
    ```

*   **Recommendation:** Correct the typo to `ng-model`.

*   **Corrected Code Example:**

    ```html
    // page.html - Corrected ng-model
    <input  type="radio" ng-class="{active: page.publish=='Y'}" name="publish" id="Y" value="Y" ng-model="page.publish">
    <input  type="radio" ng-class="{active: page.publish=='N'}" name="publish" id="N" value="N" ng-model="page.publish">
    <input  type="radio" ng-class="{active: page.publish=='schedule'}" name="publish" id="schedule" value="schedule" ng-model="page.publish">
    ```

### 6. Documentation Enhancement

**Issue 6.1: Lack of Detailed Function Comments in `pageCtrl.js` (Moderate)**

*   **Explanation:** While there are file-level comments, individual functions in `pageCtrl.js`, especially the larger ones like `savePage`, lack detailed comments explaining their purpose, parameters, and return values (if any). This makes it harder for other developers (or your future self) to understand the function's logic quickly.
*   **Problematic Code Snippet:**  Most functions in `pageCtrl.js` lack detailed comments.
*   **Recommendation:** Add JSDoc-style comments to all functions in `pageCtrl.js`, especially the more complex ones.

*   **Corrected Code Example (JSDoc for `savePage` -

### Tokens: {'input_tokens': 6558, 'output_tokens': 7034}
### Execution time: 39.847756147384644
