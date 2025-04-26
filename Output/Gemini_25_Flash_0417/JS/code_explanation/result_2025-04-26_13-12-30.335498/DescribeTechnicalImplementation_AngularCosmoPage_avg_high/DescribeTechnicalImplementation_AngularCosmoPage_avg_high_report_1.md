I have the following application code that needs to describe the technical implementation:

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

1. Create comprehensive technical documentation for the provided Angular.js code:
   - Focus on technical accuracy and completeness
   - Use clear, concise language suitable for developers

2. Document component overview:
   - Provide a brief introduction explaining the component's purpose
   - Summarize key functionality and architectural role
   - Explain how it fits within the broader application

3. Detail all component features:
   - List and describe each major feature
   - Explain the technical implementation of each feature
   - Document any dependencies or requirements

4. Document interface specifications:
   - Create a table listing all props/parameters/inputs
   - For each prop, include: name, data type, description, and required/optional status
   - Document any return values or output formats

5. Provide usage documentation:
   - Include sample code demonstrating proper implementation
   - Show common use cases and patterns
   - Document any initialization requirements

6. Document accessibility features:
   - List all ARIA roles and attributes implemented
   - Explain how these features support assistive technologies
   - Document keyboard navigation and focus management

7. Include a conclusion section:
   - Summarize the component's benefits and value
   - Highlight its contribution to the overall user experience
   - Note any best practices for implementation
## Run 1:
### Answer:
Okay, here is the comprehensive technical documentation for the provided Angular.js code, following your specified structure and requirements.

```markdown
# Technical Documentation: Page Management Component

## 1. Component Overview

This documentation describes the technical implementation of the Page Management component within the `cosmo` Angular.js application. This component provides the user interface and underlying logic for creating, editing, and deleting content "pages".

The component follows a classic Angular 1.x Model-View-Controller (MVC) pattern:

*   **View (`page.html`):** The HTML template defining the structure and binding for the page editing form.
*   **Controller (`pageCtrl.js`):** Contains the logic for handling user interactions, managing the view's scope, interacting with services, and orchestrating data flow.
*   **Models/Services (`Page.js`, `Users.js`, `REST.js`):** Factories acting as singletons to hold shared application state (`Page`, `Users`) and provide communication capabilities (`REST`).

The primary purpose of this component is to offer a dedicated interface for content editors to manage individual pages, including their metadata (title, description, URL, type, tags, publish status) and associated content (header, subheader, body, extras). It integrates with a RESTful backend API for persistence and utilizes local storage for handling unsaved changes.

## 2. Component Features

This component implements the following key features:

1.  **Page Data Loading and Display:**
    *   **Implementation:** The `pageCtrl` initializes its `$scope.page` object by copying data from the `Page` factory. The `page.html` template uses `ng-model` to bind form inputs (title, description, URL, type, tags, publish status, schedule date) directly to properties of `$scope.page`.
    *   **Technical Details:** The `Page` factory is expected to be populated with the current page's data before the controller is instantiated (likely by a parent controller or route resolver). The `updatePage` function and the `$scope.$on('contentGet', ...)` listener ensure that the `$scope.page` reflects changes in the shared `Page` factory.

2.  **RESTful API Communication:**
    *   **Implementation:** The `REST` factory, built using Angular's `$resource` service, provides interfaces for interacting with various backend endpoints related to content, tags, extras, and revisions. The `pageCtrl` injects and uses this factory for all persistence operations (save, update, delete, query).
    *   **Technical Details:** The `REST` factory defines `$resource` objects for specific API paths (`/api/content/:contentID`, `/api/content/:contentID/tags/`, etc.). It configures default parameters (e.g., `contentID: '@contentID'`) and custom methods (e.g., `update: { method: 'PUT' }`). The controller calls methods like `REST.content.save()`, `REST.content.update()`, `REST.content.delete()`, `REST.contentTags.query()`, etc., passing relevant data and callback functions for success and error handling.

3.  **Page Creation and Update:**
    *   **Implementation:** The `savePage` function handles both creating new pages and updating existing ones. It checks the current `$location.path()` and the `duplicate` flag to determine the operation.
    *   **Technical Details:**
        *   **New Page/Duplicate:** If the path is `/new` or `duplicate` is true, it calls `REST.content.save()`. The success callback (`newPagePromise`) then proceeds to save tags, the main content as a revision, and any extras (both to the main extras table and the revision extras table).
        *   **Update Existing:** If updating, it calls `REST.content.update()` using the `Page.id`. The success callback (`updatePagePromise`) first deletes old tags and extras, saves the current state as a new revision, and then saves the new tags and extras.
        *   **Data Payload:** The data sent to the API includes properties like `title`, `description`, `url`, `type`, `published`, `published_date`, `author`, and references to `Page.header`, `Page.subheader`, `Page.body`, and `Page.extras.featured`.

4.  **Page Deletion:**
    *   **Implementation:** The `deletePage` function handles the removal of a page.
    *   **Technical Details:** It makes multiple API calls using the `REST` factory to delete the main content (`REST.content.delete`), all associated revisions (`REST.contentRevisions.delete`), extra revisions (`REST.contentRevisionsExtras.delete`), main extras (`REST.contentExtras.delete`), and tags (`REST.contentTags.delete`). After successful deletion, it redirects the user to the `/new` page path using `$location.path()`.

5.  **Unsaved Changes Detection and Handling:**
    *   **Implementation:** The controller checks `localStorage` on initialization to see if there are saved values for key page properties (`title`, `description`, `publish`, `scheduleDate`, `header`, `subheader`, `body`, `url`) that differ from the data loaded into the `Page` factory. If differences are found, it sets `$scope.newerVersion` to `true`, displaying a warning message in the UI.
    *   **Technical Details:**
        *   `localStorage.getItem($routeParams.url + value)` is used to retrieve potentially unsaved data.
        *   `$scope.localVersion()` restores the data from `localStorage` into the `Page` factory and `$scope.page`, then clears the items from `localStorage` and hides the warning. It broadcasts `contentGet` to potentially trigger updates elsewhere.
        *   `$scope.deleteNewerVersion()` simply clears the items from `localStorage` and hides the warning without restoring the data.
        *   The `saveLocal` function is intended to save the current `$scope.page` values to `localStorage` periodically (though it's not explicitly called by a timer or watch in the provided code snippet, it's available for use).

6.  **URL Auto-generation:**
    *   **Implementation:** The `titleChange` function automatically generates a URL slug based on the page title.
    *   **Technical Details:** When the title changes (`ng-keyup`), if `$scope.autoURL` is true (which is initially set for new pages or if the URL is empty/`/new`), it converts the title to lowercase, replaces spaces with hyphens, and removes punctuation. This generated URL is assigned to `$scope.page.url` and `Page.url`. `$scope.autoURL` is set to `false` if the user manually changes the URL (`urlChange`).

7.  **Tag Management with Autocomplete:**
    *   **Implementation:** The component allows entering tags using `ng-list`. It provides autocomplete suggestions as the user types the last tag.
    *   **Technical Details:**
        *   `ng-list` binds the comma-separated input string to an array `$scope.page.tags`.
        *   `$scope.autocompleteTags` is triggered on `ng-change`. It queries the backend (`REST.contentTags.query`) with the last entered tag fragment to get suggestions.
        *   `$scope.selectSuggestion` is called when a user clicks a suggestion. It replaces the last tag fragment with the selected suggestion and adds an empty string to the array to allow typing the next tag.

8.  **Publishing and Scheduling:**
    *   **Implementation:** The UI provides radio buttons to select the publish status (`Publish`, `Draft`, `Schedule`). If "Schedule" is selected, a date/time input appears.
    *   **Technical Details:** The `ng-model="page.publish"` binds the selected status. `ng-show="page.publish=='schedule'"` controls the visibility of the date input (`ng-model="page.scheduleDate"`). The `savePage` function calculates the `published_date` timestamp based on the selected `publish` status and `scheduleDate`. It also adjusts the `publish` status if the scheduled date is in the past.

9.  **Shared Data Factories (`Page`, `Users`):**
    *   **Implementation:** The `Page` and `Users` factories are simple object literals returned by the factory function.
    *   **Technical Details:** In Angular 1.x, factories are singletons. This means `Page` and `Users` instances are created only once and shared across all components that inject them. This allows `pageCtrl` to access and modify the same page and user data that might be used or populated by other parts of the application.

10. **Inter-component Communication:**
    *   **Implementation:** The controller uses `$rootScope.$broadcast` to emit events (`contentGet`, `notify`, `settingsGet`) that other parts of the application can listen for using `$scope.$on`.
    *   **Technical Details:** This is a common Angular 1.x pattern for communication between controllers or services that don't have a direct parent-child relationship. `notify` is used to display success/error messages via a notification service listening on the root scope. `contentGet` and `settingsGet` seem intended to signal other components to refresh their data based on changes made in the page editor.

11. **Localization:**
    *   **Implementation:** The component uses the `$translate` service to display localized messages.
    *   **Technical Details:** Strings in the HTML template use the `translate` directive (e.g., `<p translate="page_newer"></p>`). In the controller, `$translate('key').then(...)` is used to fetch translated strings asynchronously before using them (e.g., for notification messages).

## 3. Interface Specifications

This section details the variables and functions exposed on the `$scope` object by the `pageCtrl` that are used by the `page.html` template.

| Name             | Data Type        | Description                                                                                                | Usage (Input/Output/Function) |
| :--------------- | :--------------- | :--------------------------------------------------------------------------------------------------------- | :---------------------------- |
| `page`           | Object           | Holds the data for the page being edited. Properties are bound to form elements.                           | Input/Output                  |
| `page.id`        | Number/String    | The unique identifier of the page (0 for new pages).                                                       | Output                        |
| `page.title`     | String           | The title of the page.                                                                                     | Input/Output                  |
| `page.description`| String           | The description of the page.                                                                               | Input/Output                  |
| `page.url`       | String           | The URL slug for the page.                                                                                 | Input/Output                  |
| `page.publish`   | String ('Y','N','schedule') | The publishing status of the page.                                                                 | Input/Output                  |
| `page.scheduleDate`| Date/Timestamp   | The scheduled date/time for publishing (used when `publish` is 'schedule').                                | Input/Output                  |
| `page.tags`      | Array of Strings | An array of tags associated with the page. Bound via `ng-list`.                                            | Input/Output                  |
| `page.type`      | String           | The type of page (e.g., template file name). Selected from `themePages`.                                   | Input/Output                  |
| `page.themePages`| Array of Strings | List of available page types/templates for the current theme. Populated from the `Page` factory.           | Output                        |
| `page.suggestions`| Array of Strings | Autocomplete suggestions for tags.                                                                         | Output                        |
| `page.confirm`   | Boolean          | Flag to show/hide the delete confirmation prompt.                                                          | Input/Output                  |
| `newerVersion`   | Boolean          | Flag indicating if unsaved changes were found in local storage. Controls visibility of the warning message. | Output                        |
| `autoURL`        | Boolean          | Internal flag used to determine if the URL should be auto-generated from the title.                        | Internal (not directly bound) |
| `localVersion`   | Function         | Restores page data from local storage and clears the storage.                                              | Function                      |
| `deleteNewerVersion`| Function      | Discards unsaved changes stored in local storage.                                                          | Function                      |
| `deletePage`     | Function         | Initiates the process to delete the current page via the API.                                              | Function                      |
| `updatePageType` | Function         | Updates the page type in the shared `Page` factory and broadcasts `settingsGet`.                           | Function                      |
| `titleChange`    | Function         | Handles changes to the page title, including auto-generating the URL.                                      | Function                      |
| `descriptionChange`| Function      | Handles changes to the page description.                                                                   | Function                      |
| `urlChange`      | Function         | Handles changes to the page URL, disabling auto-generation.                                                | Function                      |
| `saveLocal`      | Function         | Saves the current `$scope.page` data to local storage. (Note: Not explicitly called in provided code).     | Function                      |
| `autocompleteTags`| Function       | Queries the API for tag suggestions based on the last tag fragment.                                        | Function                      |
| `selectSuggestion`| Function       | Selects a tag suggestion and updates the tags array.                                                       | Function                      |
| `savePage`       | Function         | Initiates the process to save (create or update) the page via the API. Takes an optional `duplicate` flag. | Function                      |

## 4. Usage Documentation

This component is typically used within an Angular 1.x application that utilizes routing (`ngRoute` or `ui-router`) to display the `page.html` template and instantiate the `pageCtrl` controller when a specific route (e.g., `/page/:url` or `/new`) is matched.

**Prerequisites:**

1.  The `cosmo` Angular module must be defined.
2.  The `REST`, `Page`, and `Users` factories must be defined and available within the `cosmo` module.
3.  The `$resource`, `$location`, `$rootScope`, `$routeParams`, `$upload`, and `$translate` Angular services must be available (ensure `ngResource`, `ngRoute`, etc., modules are included).
4.  The `Page` factory should be populated with the data of the page to be edited *before* the `pageCtrl` is instantiated (e.g., using a route resolver or a parent controller that fetches the data via the `REST` service). For new pages (`/new` route), the `Page` factory should be initialized with default values.
5.  A notification service should be listening for `$rootScope.$broadcast('notify', ...)` events to display messages to the user.
6.  Other components might listen for `contentGet` or `settingsGet` broadcasts to update their state.

**Example Implementation (Conceptual):**

```javascript
// app.js (or similar module definition file)

angular.module('cosmo', ['ngRoute', 'ngResource', 'pascalprecht.translate']) // Include necessary modules
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/page/:url', {
                templateUrl: 'path/to/page.html',
                controller: 'pageCtrl',
                resolve: {
                    // Example: Fetch page data before controller loads
                    pageData: ['REST', '$route', 'Page', function(REST, $route, Page) {
                        if ($route.current.params.url !== 'new') {
                            return REST.content.get({ url: $route.current.params.url }).$promise.then(function(data) {
                                // Populate the shared Page factory
                                angular.extend(Page, data);
                                return data; // Resolve with data
                            }).catch(function(error) {
                                console.error('Error fetching page data:', error);
                                // Handle error, maybe redirect or show message
                                return null; // Resolve with null or reject
                            });
                        } else {
                            // Initialize Page factory for a new page
                            angular.extend(Page, {
                                id: 0,
                                title: '',
                                description: '',
                                // ... other default properties
                                themePages: ['default.html', 'landing.html'], // Example theme pages
                                extras: {},
                                misc: {}
                            });
                            return Page; // Resolve with default Page object
                        }
                    }]
                }
            })
            .when('/new', {
                 templateUrl: 'path/to/page.html',
                 controller: 'pageCtrl',
                 resolve: {
                     pageData: ['Page', function(Page) {
                         // Initialize Page factory for a new page
                         angular.extend(Page, {
                             id: 0,
                             title: '',
                             description: '',
                             // ... other default properties
                             themePages: ['default.html', 'landing.html'], // Example theme pages
                             extras: {},
                             misc: {}
                         });
                         return Page; // Resolve with default Page object
                     }]
                 }
             })
            // ... other routes
    }])
    // ... configure REST, Page, Users, $translate, etc.
    .factory('REST', ['$resource', function($resource) { /* ... rest.js code ... */ }])
    .factory('Page', function() { /* ... page.js code ... */ })
    .factory('Users', function() { /* ... users.js code ... */ })
    .controller('pageCtrl', ['$scope', 'REST', '$location', 'Page', '$rootScope', '$routeParams', '$upload', 'Users', '$translate', function(/* ... */) { /* ... pageCtrl.js code ... */ }]);

// index.html (or main application file)
// ... include angular.js, angular-route.js, angular-resource.js, angular-translate.js ...
// ... include rest.js, page.js, users.js, pageCtrl.js ...
// <body ng-app="cosmo">
//   <div ng-view></div> // Or ui-view
// </body>
```

**Common Use Cases:**

*   **Editing an existing page:** User navigates to a URL like `/page/about-us`. The route resolver fetches the page data and populates the `Page` factory. `pageCtrl` loads this data into `$scope.page`. User makes changes and clicks "Save", triggering `savePage` to call `REST.content.update`.
*   **Creating a new page:** User navigates to `/new`. The route resolver initializes the `Page` factory with defaults. `pageCtrl` loads defaults. User fills in details and clicks "Save", triggering `savePage` to call `REST.content.save`.
*   **Duplicating a page:** User is editing a page and clicks "Duplicate". `savePage(true)` is called, which triggers a `REST.content.save` operation with the current page's data, effectively creating a copy. The user is then redirected to the new page's URL.
*   **Handling unsaved work:** If the user leaves the page without saving and returns later, the "Newer Version Found" message appears, allowing them to restore or discard changes from local storage.

## 5. Accessibility Features

The provided code primarily relies on standard HTML elements and browser default behaviors for accessibility.

*   **ARIA Roles and Attributes:** No explicit ARIA roles or attributes (`aria-*`) are implemented in the provided `page.html` template.
*   **Semantic HTML:** Standard semantic elements are used for form controls (`<label>`, `<input>`, `<textarea>`, `<select>`, `<button>`). Labels are correctly associated with their corresponding input elements using the `for` attribute matching the input's `id`. This is crucial for screen readers to announce the purpose of form fields.
*   **Keyboard Navigation:** Standard HTML form elements and buttons are generally keyboard navigable by default using the Tab key. The focus order will follow the structure of the HTML. Custom focus management for dynamic elements (like the tag suggestions) is not explicitly implemented.
*   **Assistive Technologies:** Screen readers will be able to interpret the form structure due to the use of `<label for="...">` and standard input types. However, the lack of explicit ARIA attributes means more complex interactions or dynamic updates (like the tag suggestions appearing/disappearing) might not be optimally conveyed to users of assistive technologies without further enhancements.

**Areas for Potential Accessibility Improvement (Not implemented in provided code):**

*   Adding ARIA attributes to clarify the purpose or state of dynamic elements (e.g., `aria-live` for notifications, `aria-expanded` and `aria-controls` for the tag suggestion dropdown).
*   Implementing explicit focus management for the tag suggestion list to allow keyboard users to navigate and select suggestions easily.
*   Ensuring sufficient color contrast for text and interactive elements.

## 6. Conclusion

The Page Management component provides a robust and functional interface for content editors to manage pages within the `cosmo` application. It effectively utilizes Angular 1.x features like controllers, factories, and services (`$resource`, `$location`, `$rootScope`, `$translate`) to handle data binding, API communication, state management, and basic localization.

Its key strengths include:

*   Clear separation of concerns following the MVC pattern.
*   Comprehensive interaction with the backend API for full CRUD capabilities on pages and related data (tags, extras, revisions).
*   Helpful features like URL auto-generation and tag autocomplete.
*   A mechanism for detecting and handling unsaved changes using local storage, improving user experience in case of accidental navigation or crashes.

While the component provides a solid foundation, potential areas for future enhancement could include more explicit accessibility features, more sophisticated error handling beyond simple notifications, and potentially migrating to a more modern Angular version or state management pattern for larger applications. Overall, it serves as a central and critical piece of the application's content management functionality.
```

### Tokens: {'input_tokens': 6477, 'output_tokens': 4856}
### Execution time: 41.31611704826355
