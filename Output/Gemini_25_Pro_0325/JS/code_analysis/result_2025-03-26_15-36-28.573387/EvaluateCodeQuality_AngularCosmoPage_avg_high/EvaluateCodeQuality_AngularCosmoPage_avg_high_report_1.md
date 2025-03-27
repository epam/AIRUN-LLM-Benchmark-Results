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
Okay, let's evaluate the provided AngularJS application code.

**Overall Impression:**

The code represents a typical AngularJS (v1.x) application structure for handling CRUD operations via a REST API. It uses common patterns like factories for services (`REST`, `Page`, `Users`) and controllers (`pageCtrl`). However, it exhibits several areas for improvement regarding modern best practices, maintainability, readability, and performance, characteristic of older AngularJS patterns or less experienced development.

---

**1. Readability Assessment**

*   **Issue:** Unclear/Generic Variable Names
    *   **Explanation:** Variables like `elements` in `pageCtrl.js` are too generic and don't convey the specific purpose (storing property names for local storage checks/operations).
    *   **Problematic Code (`pageCtrl.js`):**
        ```javascript
        var elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
        // ... later usage ...
        angular.forEach(elements, function(value){
            // ...
        });
        ```
    *   **Recommendation:** Use more descriptive names.
    *   **Corrected Code Example:**
        ```javascript
        const pagePropertiesForStorage = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
        // ... later usage ...
        angular.forEach(pagePropertiesForStorage, function(propertyName){
             if(localStorage.getItem($routeParams.url + propertyName) !== Page[propertyName] && localStorage.getItem($routeParams.url + propertyName) !== 'null')
                $scope.newerVersion = true;
        });
        // Or even better, abstract this logic into a function/service
        ```

*   **Issue:** Complex Logic in `savePage` (Callback Hell)
    *   **Explanation:** The `savePage` function uses deeply nested callbacks (`newPagePromise`, `saveRevisionPromise`, `saveExtrasPromise`, etc.) to handle sequential asynchronous operations. This makes the code flow extremely difficult to follow, debug, and maintain.
    *   **Problematic Code (`pageCtrl.js`):**
        ```javascript
        function newPagePromise(data){
            // ... calls REST.contentTags.save ...
            // ... calls REST.contentRevisions.save(..., saveRevisionPromise);
        }

        function saveRevisionPromise(data){
            // ... loops through Page.extras ...
            // ... calls REST.contentExtras.save(..., saveExtrasPromise, saveExtrasPromise);
            // ... calls REST.contentRevisionsExtras.save ...
        }

        function saveExtrasPromise(){
            // ... counter logic ...
            // ... potentially redirects ...
        }
        // Similar nesting exists for the update path
        ```
    *   **Recommendation:** Refactor using promises (`$q` service or the promises returned by `$resource`) and chaining (`.then()`). This flattens the structure and improves readability significantly.
    *   **Corrected Code Example (Conceptual):**
        ```javascript
        // Inside savePage function
        var saveData = { /* ... page data ... */ };
        var saveOperation;

        if ($location.path() === '/new' || duplicate) {
            saveOperation = REST.content.save(saveData).$promise;
        } else {
            saveOperation = REST.content.update({ contentID: Page.id }, saveData).$promise
                .then(function(updateData) {
                    // Chain deletion of old tags/extras before saving new ones if needed
                    return REST.contentTags.delete({ contentID: Page.id }).$promise
                        .then(function() {
                            return REST.contentExtras.delete({ contentID: Page.id }).$promise;
                        })
                        .then(function() {
                            return updateData; // Pass original update data along
                        });
                });
        }

        saveOperation
            .then(function(savedContentData) {
                var contentID = savedContentData.id || Page.id; // Get ID from new or existing
                $scope.page.id = contentID; // Update scope if needed
                $scope.autoURL = false;

                // Prepare promises for tags and revision
                var tagPromises = ($scope.page.tags || []).map(function(tag) {
                    return REST.contentTags.save({ contentID: contentID, tag: tag }).$promise;
                });

                var revisionData = { /* ... revision data ... */ };
                var revisionPromise = REST.contentRevisions.save({ contentID: contentID }, revisionData).$promise;

                // Wait for tags and revision to be saved
                return $q.all([...tagPromises, revisionPromise]);
            })
            .then(function(results) {
                // results[results.length - 1] contains the saved revision data
                var savedRevision = results[results.length - 1];
                var revisionID = savedRevision.id;

                // Prepare promises for extras
                var extraPromises = [];
                angular.forEach(Page.extras, function(value, key) {
                    var extraValue = (typeof value === 'object') ? angular.toJson(value) : value;
                    extraPromises.push(
                        REST.contentExtras.save({ contentID: $scope.page.id, name: key, extra: extraValue }).$promise
                    );
                    extraPromises.push(
                        REST.contentRevisionsExtras.save({ revisionID: revisionID, contentID: $scope.page.id, name: key, extra: extraValue }).$promise
                    );
                });

                return $q.all(extraPromises);
            })
            .then(function() {
                // All operations successful
                var successMsgKey = ($location.path() === '/new' || duplicate) ? 'page_created' : 'page_updated';
                $translate(successMsgKey).then(function(translatedText) {
                    $rootScope.$broadcast('notify', { message: translatedText });
                });
                // Clear local storage for this page after successful save
                clearLocalStorageForPage(); // Abstract this logic
                $location.path($scope.page.url); // Redirect
            })
            .catch(function(error) {
                // Handle errors from any step in the chain
                console.error("Error saving page:", error);
                var errorMsgKey = ($location.path() === '/new' || duplicate) ? 'page_error_saving' : 'page_error_updating';
                $translate(errorMsgKey).then(function(translatedText) {
                    $rootScope.$broadcast('notify', { message: translatedText, classes: 'alert-error' });
                });
            });
        ```

*   **Issue:** Redundant Code for Local Storage Handling
    *   **Explanation:** The logic to iterate over `elements` and interact with `localStorage` is duplicated in `localVersion` and `deleteNewerVersion`.
    *   **Recommendation:** Create a helper function or move this logic to a dedicated service.

---

**2. Maintainability Evaluation**

*   **Issue:** Fat Controller (`pageCtrl.js`)
    *   **Explanation:** `pageCtrl` handles too many responsibilities: UI state management (`newerVersion`, `page.confirm`), direct `localStorage` manipulation, complex multi-step API interactions (`savePage`, `deletePage`), data transformation (dates, URLs), and direct manipulation of the shared `Page` factory state. This makes the controller large, hard to test, and difficult to maintain.
    *   **Recommendation:**
        1.  **Create a Service for Page Operations:** Move the logic for saving, updating, deleting pages (including handling revisions, tags, extras, and the promise chaining) into a dedicated service (e.g., `PageService`). The controller should call methods on this service.
        2.  **Create a Local Storage Service:** Abstract all `localStorage.getItem`/`setItem`/`removeItem` calls into a dedicated service (e.g., `StorageService`) to handle key generation and interaction.
        3.  **Refine `Page` Factory:** Consider making the `Page` factory more than just a data bag. It could potentially hold methods for initializing or resetting page data, but complex operations belong in a dedicated service.
    *   **Corrected Code Example (Conceptual Structure):**
        ```javascript
        // pageService.js (New File)
        angular.module('cosmo').factory('PageService', ['$q', 'REST', 'Users', 'StorageService', /* other dependencies */ function($q, REST, Users, StorageService) {
            function savePage(pageData, extras, isDuplicate, currentPath) {
                // ... Implement the promise-based save logic from Readability section here ...
                // ... Use StorageService.clearPageData(pageData.url) on success ...
            }

            function deletePage(pageId) {
                // ... Implement promise-based delete logic for content, revisions, extras, tags ...
            }

            function checkNewerVersion(routeUrl, currentPageData) {
               // ... Use StorageService to check for newer version ...
            }

            function restoreLocalVersion(routeUrl) {
               // ... Use StorageService to get data and return it ...
            }

            function deleteNewerVersion(routeUrl) {
               // ... Use StorageService to clear data ...
            }

            return { savePage, deletePage, checkNewerVersion, restoreLocalVersion, deleteNewerVersion };
        }]);

        // storageService.js (New File)
        angular.module('cosmo').factory('StorageService', [function() {
            const buildKey = (pageUrl, propertyName) => `${pageUrl}_${propertyName}`;

            function getPageProperty(pageUrl, propertyName) {
                return localStorage.getItem(buildKey(pageUrl, propertyName));
            }

            function setPageProperty(pageUrl, propertyName, value) {
                localStorage.setItem(buildKey(pageUrl, propertyName), value);
            }
             function clearPageData(pageUrl, properties) {
                 properties.forEach(prop => localStorage.removeItem(buildKey(pageUrl, prop)));
             }
            // ... other methods ...

            return { getPageProperty, setPageProperty, clearPageData /* ... */ };
        }]);

        // pageCtrl.js (Refactored)
        angular.module('cosmo').controller('pageCtrl', ['$scope', 'PageService', 'StorageService', 'Page', /* ... */ function($scope, PageService, StorageService, Page /* ... */){
            // ... initialize $scope.page ...

            // Check for newer version using the service
            $scope.newerVersion = PageService.checkNewerVersion($routeParams.url, Page);

            $scope.localVersion = function() {
                const restoredData = PageService.restoreLocalVersion($routeParams.url);
                // Update Page factory and scope based on restoredData
                // ...
                $scope.newerVersion = false;
                $rootScope.$broadcast('contentGet'); // Still might need refinement
            };

            $scope.deleteNewerVersion = function() {
                PageService.deleteNewerVersion($routeParams.url);
                $scope.newerVersion = false;
            };

            $scope.deletePage = function() {
                PageService.deletePage($scope.page.id)
                    .then(() => { /* Success notification, redirect */ })
                    .catch(() => { /* Error notification */ });
            };

            $scope.savePage = function(duplicate) {
                // ... Perform validation ...
                const pageDataToSave = { /* gather data from $scope.page and Page */ };
                PageService.savePage(pageDataToSave, Page.extras, duplicate, $location.path())
                    .then(() => { /* Success handling (already done in service?) */ })
                    .catch(() => { /* Error handling (already done in service?) */ });
            };

            // ... other controller logic remains, but simplified ...
        }]);
        ```

*   **Issue:** Tight Coupling via `$rootScope.$broadcast`
    *   **Explanation:** Using `$rootScope.$broadcast` (`notify`, `contentGet`, `settingsGet`) creates a global event system where components implicitly depend on each other. It's hard to trace where events originate and who is listening, making debugging and refactoring difficult.
    *   **Recommendation:**
        *   For parent-child communication, use component bindings or `scope.$emit` / `scope.$on`.
        *   For sibling or unrelated component communication, use a shared service (like the `Page` factory, but potentially a dedicated event bus service) to mediate communication.
        *   Notifications (`notify`) could be handled by a dedicated `NotificationService` that components inject and call directly.
    *   **Corrected Code Example (Notification Service):**
        ```javascript
        // notificationService.js
        angular.module('cosmo').factory('NotificationService', ['$rootScope', '$timeout', function($rootScope, $timeout) {
            $rootScope.notifications = [];

            function add(message, type = 'success', duration = 3000) {
                const notification = { message, type, id: Date.now() };
                $rootScope.notifications.push(notification);

                if (duration) {
                    $timeout(() => {
                        remove(notification.id);
                    }, duration);
                }
                return notification.id;
            }

            function remove(id) {
                $rootScope.notifications = $rootScope.notifications.filter(n => n.id !== id);
            }

            return { add, remove };
        }]);

        // In a controller (e.g., pageCtrl)
        // Inject NotificationService
        NotificationService.add('Page saved successfully!', 'success');
        // Instead of: $rootScope.$broadcast('notify', {message: 'Saved'});

        // In your main template/component displaying notifications:
        // <div ng-repeat="notification in notifications" class="alert alert-{{notification.type}}">
        //   {{ notification.message }}
        //   <button ng-click="NotificationService.remove(notification.id)">&times;</button>
        // </div>
        ```

*   **Issue:** Global State Factories (`Page`, `Users`)
    *   **Explanation:** While simple, these factories act like global variables. Any part of the application can inject and modify them, potentially leading to unexpected state changes and making state management hard to track.
    *   **Recommendation:** Encapsulate state modification logic within services. Instead of directly setting `Page.title = '...'` everywhere, call a method like `PageService.updateTitle('...')` which internally updates the state and potentially performs other related actions. For more complex state, consider patterns like Redux (using `ng-redux`) even within AngularJS, although this might be overkill depending on the app's scale.

---

**3. Performance Optimization**

*   **Issue:** Frequent Updates on Input Changes
    *   **Explanation:** Functions like `titleChange`, `descriptionChange`, `urlChange`, and `saveLocal` are called on every `ng-keyup` or `ng-change`. `saveLocal` writes to `localStorage` on every keystroke for multiple fields, which is inefficient and unnecessary. `autocompleteTags` makes an API call on every change to the tags input.
    *   **Problematic Code (`pageCtrl.js` & `page.html`):**
        ```html
        <input type='text' ng-model="page.title" ng-keyup="titleChange()">
        <textarea value="description" ng-model="page.description" ng-keyup="descriptionChange()"></textarea>
        <input value="tags" type="text" ng-list ng-model="page.tags" ng-change="autocompleteTags()">
        ```
        ```javascript
        $scope.saveLocal = function(){ // Called frequently? (Not shown where, but likely intended for frequent calls)
            // ... updates Page factory ...
            // ... writes to localStorage multiple times ...
        };
        $scope.autocompleteTags = function(){ // Called on ng-change
             // ... makes REST call ...
        };
        ```
    *   **Recommendation:** Use debouncing (`$timeout` or a library like Lodash/Underscore's `_.debounce`) for functions triggered by frequent events like `ng-keyup` or `ng-change`, especially if they perform expensive operations like API calls or `localStorage` writes. Use `ng-model-options="{ debounce: 500 }"` (AngularJS 1.3+) for simpler model debouncing.
    *   **Corrected Code Example (`page.html` using `ng-model-options`):**
        ```html
        <input type='text' ng-model="page.title" ng-model-options="{ debounce: 500 }" ng-change="titleChange()"> <!-- titleChange might still be needed for URL generation -->
        <textarea ng-model="page.description" ng-model-options="{ debounce: 500 }" ng-change="descriptionChange()"></textarea>
        <input type="text" ng-list ng-model="page.tags" ng-model-options="{ debounce: 300 }" ng-change="autocompleteTags()">
        <input type='text' ng-model='page.url' ng-model-options="{ debounce: 500 }" ng-keyup="autoURL=false;urlChange()">
        ```
    *   **Corrected Code Example (`pageCtrl.js` debouncing `saveLocal` if needed):**
        ```javascript
        // Inject $timeout
        var debouncedSaveLocal = debounce(function() {
            // Original saveLocal logic here
            Page.title = $scope.page.title;
            // ... etc ...
            StorageService.setPageProperty($routeParams.url, 'title', Page.title); // Using hypothetical StorageService
            // ... etc ...
            $scope.$apply(); // May be needed if debounce runs outside digest cycle
        }, 1000); // Debounce for 1 second

        $scope.titleChange = function() {
            Page.title = $scope.page.title;
            // ... auto URL logic ...
            debouncedSaveLocal(); // Call the debounced function
        };
        // Similar calls in descriptionChange, urlChange etc.

        // Simple debounce implementation (or use Lodash)
        function debounce(func, wait) {
            var timeout;
            return function executedFunction() {
                var context = this;
                var args = arguments;
                var later = function() {
                    timeout = null;
                    func.apply(context, args);
                };
                clearTimeout(timeout);
                timeout = $timeout(later, wait);
            };
        };
        ```

*   **Issue:** Multiple API Calls in Sequence/Parallel
    *   **Explanation:** `deletePage` makes 5 separate DELETE requests. `savePage` makes numerous requests for content, tags, revisions, and extras. While sometimes necessary, evaluate if the backend could offer batch endpoints (e.g., delete page and all related data with one call, save page with tags/extras in one payload).
    *   **Recommendation:** If possible, modify the backend API to support batch operations or accept nested data structures to reduce the number of HTTP requests required for common operations like saving or deleting a page. If not possible, using `$q.all` for parallel operations (like saving tags) is good, but the sequential nature might be unavoidable for dependencies (save content -> get ID -> save revision).

---

**4. Accessibility Improvements**

*   **Issue:** Non-semantic Elements for Actions
    *   **Explanation:** Using `<a>` tags with `ng-click` for button-like actions (like sidebar navigation/close) is not semantically correct and can be confusing for assistive technologies.
    *   **Problematic Code (`page.html`):**
        ```html
        <a ng-click="admin.sidebar='core/html/sidebar.html';active=''"><i class="fa fa-angle-left"></i></a>
        <a class="sidebar-close" ng-click="admin.showAdminPanel=false;admin.active=false;" ><i class="fa fa-times"></i></a>
        ```
    *   **Recommendation:** Use `<button type="button">` for elements that perform actions. Add `aria-label` if the button content (like an icon) isn't descriptive.
    *   **Corrected Code Example:**
        ```html
        <button type="button" ng-click="admin.sidebar='core/html/sidebar.html';active=''" aria-label="Open Sidebar Menu">
            <i class="fa fa-angle-left" aria-hidden="true"></i>
        </button>
        <button type="button" class="sidebar-close" ng-click="admin.showAdminPanel=false;admin.active=false;" aria-label="Close Admin Panel">
            <i class="fa fa-times" aria-hidden="true"></i>
        </button>
        ```

*   **Issue:** Redundant `ng-click` on Radio Button Labels
    *   **Explanation:** The `<label>` elements for radio buttons have `ng-click` handlers that manually set the `$scope.page.publish` model value. This is unnecessary; the `ng-model` on the `<input type="radio">` handles this automatically when the label is clicked (due to the `for` attribute). It also uses `ng-modal` which is a typo for `ng-model`.
    *   **Problematic Code (`page.html`):**
        ```html
        <input  type="radio" ng-class="{active: page.publish=='Y'}" name="publish" id="Y" value="Y" ng-modal="page.publish">
        <label for="Y" ng-click="page.publish='Y'" translate="publish"></label>
        <!-- Similar for N and schedule -->
        ```
    *   **Recommendation:** Remove the `ng-click` from the labels and correct `ng-modal` to `ng-model`. Ensure the `for` attribute correctly matches the input `id`.
    *   **Corrected Code Example:**
        ```html
        <input type="radio" ng-class="{active: page.publish=='Y'}" name="publish" id="publish_Y" value="Y" ng-model="page.publish">
        <label for="publish_Y" translate="publish"></label>

        <input type="radio" ng-class="{active: page.publish=='N'}" name="publish" id="publish_N" value="N" ng-model="page.publish">
        <label for="publish_N" translate="draft"></label>

        <input type="radio" ng-class="{active: page.publish=='schedule'}" name="publish" id="publish_schedule" value="schedule" ng-model="page.publish">
        <label for="publish_schedule" translate="schedule"></label>
        ```

*   **Issue:** Missing ARIA Attributes for Dynamic Content
    *   **Explanation:** Elements that appear/disappear (`ng-show`) or update dynamically should ideally use ARIA attributes (like `aria-live`) to inform screen readers about changes. The tag suggestions also need proper roles and keyboard interaction.
    *   **Recommendation:**
        *   Add `aria-live="polite"` to regions like `.new-version` or the confirmation message area (`<p ng-show="page.confirm">`) so changes are announced.
        *   For the tag suggestions (`div.tag-suggestions`), consider using ARIA roles for listbox/options or providing keyboard navigation (arrow keys, Enter to select).
    *   **Corrected Code Example (Conceptual):**
        ```html
         <div class="new-version form-case" ng-show="newerVersion" aria-live="polite">
             <!-- ... -->
         </div>

         <p ng-show="page.confirm" aria-live="polite" translate="page_delete"></p>

         <!-- Tag suggestions need more work for full accessibility (keyboard nav, roles) -->
         <div class="tag-suggestions" ng-show="page.suggestions.length" role="listbox">
             <a ng-repeat="tag in page.suggestions | limitTo:10"
                ng-click="selectSuggestion(tag)"
                role="option"
                tabindex="0" <!-- Make focusable -->
                ng-keydown="$event.keyCode === 13 && selectSuggestion(tag)"> <!-- Basic Enter key support -->
                 {{tag | titlecase}}
             </a>
         </div>
        ```

---

**5. Angular.js Best Practices**

*   **Issue:** Outdated Patterns (Fat Controller, `$rootScope` Abuse, Callback Hell)
    *   **Explanation:** As detailed under Maintainability and Readability, the code relies heavily on patterns discouraged in later AngularJS development and modern frameworks: controllers doing too much, global event broadcasting, and nested callbacks instead of promises.
    *   **Recommendation:** Refactor towards service-based architecture, promise chaining (`.then()`), and component-based communication where possible (even within AngularJS 1.x, using directives/components).

*   **Issue:** Direct `localStorage` Usage
    *   **Explanation:** Directly using `localStorage` couples the controller to the browser's specific storage API and makes it harder to test or potentially swap the storage mechanism later.
    *   **Recommendation:** Abstract `localStorage` access into a dedicated service (as shown in the Maintainability section).

*   **Issue:** `$resource` Configuration Repetition
    *   **Explanation:** The `{ update: { method: 'PUT' } }` configuration is repeated for almost every resource definition in `rest.js`.
    *   **Recommendation:** While minor, you could potentially create a helper function or a base configuration object to reduce this repetition if desired, although it's often acceptable as is for clarity.
    *   **Corrected Code Example (Conceptual):**
        ```javascript
        // rest.js
        angular.module('cosmo').factory('REST', ['$resource', 'Page', function($resource, Page) {
            const commonActions = {
                update: { method: 'PUT' }
            };

            function createResource(url, params = {}, actions = {}) {
                return $resource(url, params, { ...commonActions, ...actions });
            }

            return {
                'blocks': createResource('api/blocks/:blockID', { blockID: '@blockID' }),
                'blocksRequirements': createResource('api/blocks/:blockID/requirements/:requirementID', { blockID: '@blockID', requirementID: '@requirementID' }),
                'comments': createResource('api/comments/:commentID', { commentID: '@commentID' }),
                // ... other resources using createResource ...
                'sitemaps': $resource('api/sitemaps/'), // No PUT needed
                'settings': createResource('api/settings/'),
                'users': createResource('api/users/:userID', { userID: '@userID' })
            };
        }]);
        ```

*   **Issue:** Manual State Synchronization (`updatePage` function and `$on('contentGet')`)
    *   **Explanation:** The controller manually copies properties from the `Page` factory to its local `$scope.page` object initially and listens for a `contentGet` event to re-sync. This is prone to errors if not all properties are copied or if updates happen elsewhere without broadcasting.
    *   **Recommendation:** Bind directly to the factory's properties in the template where possible, or have a single source of truth. If using a local scope copy is necessary (e.g., for form editing before saving), ensure the synchronization logic is robust or triggered more reliably, perhaps by watching the factory object (though this can have performance implications). A better approach is often to have the service managing the data provide methods to get/update it, reducing the need for manual sync.

*   **Issue:** Date Handling Complexity
    *   **Explanation:** The commented-out date formatting, use of `Date.parse().getTime()/1000`, and direct binding to `datetime-local` suggest potential inconsistencies or difficulties with date/time handling. `datetime-local` input format can be strict and browser support varies. Storing timestamps (seconds or ms) is common, but conversion for display/editing needs care.
    *   **Recommendation:**
        *   Standardize on storing UTC timestamps (e.g., milliseconds since epoch: `Date.now()` or `.getTime()`).
        *   Use a dedicated date library (like Moment.js - though now in maintenance mode, or preferably `date-fns` or `Day.js` if possible, though they are not AngularJS specific) for reliable parsing, formatting, and manipulation, especially when dealing with timezones or the `datetime-local` input.
        *   Create filters or service methods for consistent date formatting.

---

**6. Documentation Enhancement**

*   **Issue:** Lack of Detailed Function Documentation
    *   **Explanation:** While file headers exist, complex functions like `savePage`, `deletePage`, `localVersion`, etc., lack detailed comments (e.g., JSDoc style) explaining their purpose, parameters, return values (especially promises), and side effects (API calls, `localStorage` changes, `$rootScope` broadcasts, redirects).
    *   **Recommendation:** Add JSDoc-style comments to significant functions, especially in services and controllers. Explain the asynchronous flow in `savePage`/`deletePage`.
    *   **Corrected Code Example (JSDoc):**
        ```javascript
        /**
         * @ngdoc method
         * @name pageCtrl#savePage
         * @methodOf cosmo.controller:pageCtrl
         *
         * @description
         * Saves the current page data (from $scope.page and Page factory) to the backend.
         * Handles creating a new page, updating an existing page, or duplicating a page.
         * Manages saving content, tags, revisions, and extras sequentially.
         * Shows notifications and redirects upon success or failure.
         *
         * @param {boolean} duplicate If true, saves the current data as a new page,
         *                          even if editing an existing one (requires URL change).
         */
        $scope.savePage = function(duplicate) {
            // ... implementation ...
        };
        ```

*   **Issue:** Ambiguous TODOs and Comments
    *   **Explanation:** Comments like `// Depreciate?` indicate uncertainty that should be resolved. `// todo: Save Page.extras save locally too` is a task reminder but lacks context on *why* or *how*.
    *   **Recommendation:** Resolve uncertain comments. Expand TODOs with more detail or link them to issue tracking systems. Remove redundant comments like `// Initialize variables`.

*   **Issue:** Lack of Documentation for Factory Properties
    *   **Explanation:** The `Page` and `Users` factories list properties but don't explain what each represents (e.g., `Page.misc`, `Page.extras`).
    *   **Recommendation:** Add brief comments explaining each property in the factory definitions.

---

**Conclusion:**

The codebase provides basic functionality but requires significant refactoring to align with better software engineering practices. Key areas for improvement include:

1.  **Refactoring `pageCtrl`:** Extract logic into dedicated services (API interactions, local storage, notifications).
2.  **Using Promises:** Replace callback hell with promise chaining (`.then()`, `$q.all`) for asynchronous operations.
3.  **Improving State Management:** Reduce reliance on global factories as mutable state bags and minimize `$rootScope` broadcasting.
4.  **Optimizing Performance:** Debounce frequent operations triggered by user input.
5.  **Enhancing Accessibility:** Use semantic HTML and ARIA attributes correctly.
6.  **Improving Documentation:** Add detailed comments for complex functions and factory properties.

Addressing these points will lead to a more readable, maintainable, testable, performant, and robust application.

### Tokens: {'input_tokens': 6558, 'output_tokens': 7146}
### Execution time: 79.33977007865906
