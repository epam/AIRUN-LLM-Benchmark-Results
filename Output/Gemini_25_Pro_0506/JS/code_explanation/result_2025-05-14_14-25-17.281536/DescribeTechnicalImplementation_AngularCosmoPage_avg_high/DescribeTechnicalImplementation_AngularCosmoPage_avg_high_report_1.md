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
Okay, this is a classic AngularJS (Angular 1.x) setup for a content management system's page editing functionality. Let's break it down.

## Technical Documentation: Cosmo Page Management Module

**Last Updated:** October 26, 2023
**Version:** (Assuming based on code structure, likely pre-Angular 2)
**Framework:** AngularJS (v1.x)

---

### 1. Component Overview

The Cosmo Page Management module is responsible for creating, editing, and managing web pages within the Cosmo application. It provides a user interface for content editors to define page properties such as title, description, URL, content type, tags, and publishing status.

**Key Functionality:**
*   Provides a form-based interface for page attribute editing.
*   Communicates with a RESTful backend for data persistence.
*   Manages page state locally using AngularJS factories.
*   Supports features like auto-URL generation, tag suggestions, scheduled publishing, and local draft recovery.
*   Integrates with a translation service for internationalization.

**Architectural Role:**
This module is a core part of the content creation and management workflow in the Cosmo application. It leverages several AngularJS services and factories:
*   `REST` factory: For all backend API communications.
*   `Page` factory: As a global state store for the page currently being edited.
*   `Users` factory: To access current user information (e.g., for authorship).
*   `pageCtrl`: The controller orchestrating the view logic and data binding.
*   `page.html`: The HTML template defining the user interface.

It fits within a broader Model-View-Controller (MVC) or Model-View-ViewModel (MVVM) pattern common in AngularJS applications, where the factories act as part of the Model, the HTML is the View, and the controller is the ViewModel/Controller.

---

### 2. Detailed Component Features

This module consists of several interconnected AngularJS components:

#### 2.1. `REST` Factory (`rest.js`)

*   **Purpose:** A centralized factory for defining and accessing RESTful API endpoints. It uses AngularJS's `$resource` service to simplify communication with the backend.
*   **Technical Implementation:**
    *   Defines multiple resource objects, each corresponding to a specific API endpoint (e.g., `api/blocks/:blockID`, `api/content/:contentID`).
    *   Each resource object provides methods for CRUD operations (e.g., `query()`, `get()`, `save()`, `delete()`).
    *   Custom actions like `update: { method: 'PUT' }` are defined for resources that require PUT requests for updates.
    *   Parameters in the URL (e.g., `:blockID`) are bound to properties of the data object passed to the resource methods, often prefixed with `@` (e.g., `{ blockID: '@blockID' }`) to indicate they should be read from the data object instance.
*   **Dependencies:** `$resource`, `Page` (Note: `Page` is injected but not directly used within the factory's return object definition, which might be a remnant or for future use).

#### 2.2. `Page` Factory (`page.js`)

*   **Purpose:** Acts as a global singleton service to store and share the state of the page currently being created or edited across different parts of the application (e.g., between the controller and potentially other directives or services).
*   **Technical Implementation:**
    *   Returns an object with predefined properties representing various attributes of a page (e.g., `id`, `title`, `description`, `url`, `type`, `extras`).
    *   These properties are initialized with default/empty values.
    *   Other components (like `pageCtrl`) can inject this factory to read or modify the current page's data.
*   **Dependencies:** None.

#### 2.3. `Users` Factory (`users.js`)

*   **Purpose:** A global singleton service to store and share data about the currently authenticated user.
*   **Technical Implementation:**
    *   Returns an object with predefined properties representing user attributes (e.g., `id`, `username`, `email`, `role`).
    *   This data is likely populated upon user login and can be accessed by any component that injects the `Users` factory.
*   **Dependencies:** None.

#### 2.4. `pageCtrl` Controller (`pageCtrl.js`)

*   **Purpose:** Manages the logic, data binding, and event handling for the page editing interface (`page.html`).
*   **Technical Implementation:**
    *   **Initialization:**
        *   Initializes `$scope.page` by copying data from the `Page` factory. This decouples the controller's scope from the global `Page` service initially but keeps them in sync through various functions.
        *   Sets a default `scheduleDate` if none exists or if creating a new page.
        *   Loads available `themePages` from the `Page` factory.
        *   Initializes the page `type`.
    *   **Local Storage Draft Recovery:**
        *   Checks `localStorage` for a newer, unsaved version of the page (for existing pages only).
        *   `$scope.newerVersion` flag controls the visibility of the recovery UI.
        *   `$scope.localVersion()`: Restores page data from `localStorage` into the `Page` factory and broadcasts `contentGet` to refresh UI.
        *   `$scope.deleteNewerVersion()`: Clears the local draft from `localStorage`.
    *   **Page Operations:**
        *   `$scope.deletePage()`:
            *   Uses `REST.content.delete` to remove the page.
            *   Also deletes associated revisions, extras, and tags via respective `REST` service calls.
            *   Broadcasts a notification and redirects to the 'new page' view.
        *   `$scope.savePage(duplicate)`:
            *   Handles both creating new pages (or duplicates) and updating existing ones.
            *   Performs validations (e.g., unique URL for duplicates, page type selection, non-empty URL).
            *   Determines `scheduleDate` and `publish` status based on user input.
            *   Extracts featured image URL from `Page.extras.featured`.
            *   Uses `REST.content.save()` for new/duplicate pages or `REST.content.update()` for existing pages.
            *   Employs a chain of promise callbacks (`newPagePromise`, `saveRevisionPromise`, `saveExtrasPromise`, etc.) to sequentially save the main content, then tags, then create a revision, and finally save any "extra" content fields. This ensures data integrity and proper sequencing of API calls.
            *   Broadcasts notifications (`$rootScope.$broadcast('notify', ...)`) for success or error messages, using `$translate` for internationalization.
    *   **Form Field Interactions & Data Sync:**
        *   `updatePage()`: Syncs `$scope.page` with the `Page` factory. Triggered on `contentGet` event.
        *   `$scope.updatePageType()`: Updates `Page.type` and broadcasts `settingsGet`.
        *   `$scope.titleChange()`: Updates `Page.title`. If `autoURL` is true (for new pages or empty URLs), it generates a URL slug from the title.
        *   `$scope.descriptionChange()`: Updates `Page.description`.
        *   `$scope.urlChange()`: Updates `Page.url` and sets `autoURL` to `false`.
        *   `$scope.saveLocal()`: Persists current form field values to both the `Page` factory and `localStorage` (scoped by `$routeParams.url` and field name). This is likely used for the draft recovery feature.
    *   **Tag Autocomplete:**
        *   `$scope.autocompleteTags()`: When the user types in the tags input, it queries `REST.contentTags` for suggestions based on the last typed tag.
        *   `$scope.selectSuggestion()`: Adds a selected suggestion to the `page.tags` array.
    *   **Event Handling:**
        *   Listens for `$rootScope.$on('contentGet', ...)` to refresh its local page data from the `Page` factory.
*   **Dependencies:** `$scope`, `REST`, `$location`, `Page`, `$rootScope`, `$routeParams`, `$upload` (injected but not used in the provided snippet), `Users`, `$translate`.

#### 2.5. Page Editor View (`page.html`)

*   **Purpose:** The HTML template providing the user interface for page creation and editing.
*   **Technical Implementation:**
    *   Uses `ng-controller="pageCtrl"` to bind to `pageCtrl`.
    *   **Newer Version Bar:** `div.new-version` shown/hidden by `ng-show="newerVersion"`. Contains buttons to discard, compare (seems to trigger `localVersion`), or use the local version.
    *   **Top Bar:** Navigation (back, close panel) and title "Page Details".
    *   **Action Bar:** Buttons for "Delete", "Duplicate", "Save". These toggle visibility with a confirmation state (`page.confirm`) for deletion.
    *   **Page Editor Form (`div.pg-editor`):**
        *   **Type:** A `select` dropdown (`ng-model="page.type"`) populated by `page.themePages` via `ng-options`. `ng-change="updatePageType()"` updates the type.
        *   **Title:** `input[type='text']` (`ng-model="page.title"`) with character count and `ng-keyup="titleChange()"`.
        *   **Description:** `textarea` (`ng-model="page.description"`) with character count and `ng-keyup="descriptionChange()"`.
        *   **Tags:** `input[type='text']` (`ng-model="page.tags"`) using `ng-list` to handle comma-separated values as an array. `ng-change="autocompleteTags()"` triggers tag suggestions.
            *   **Tag Suggestions:** `div.tag-suggestions` (`ng-show="page.suggestions.length"`) displays clickable suggestions using `ng-repeat`.
        *   **URL:** `input[type='text']` (`ng-model='page.url'`) with `ng-keyup="autoURL=false;urlChange()"`.
        *   **Publish Status:** A set of three radio button-like controls (implemented with `input[type="radio"]` and styled labels).
            *   `ng-modal="page.publish"` (likely a typo for `ng-model`) binds the selected value.
            *   Labels use `ng-click` to set `page.publish`.
            *   `ng-class="{active: ...}"` on the radio inputs highlights the active choice.
            *   A `datetime-local` input (`ng-model="page.scheduleDate"`) is shown when `page.publish=='schedule'`.
    *   **Directives:** Extensive use of AngularJS directives: `ng-controller`, `ng-show`, `ng-click`, `ng-model` (and `ng-modal` typo), `ng-options`, `ng-change`, `ng-keyup`, `ng-list`, `ng-class`, `ng-repeat`, `translate` (for i18n).
    *   **Styling:** CSS classes like `form-case`, `btn-error`, `btn-success`, `bar-top`, `pg-editor` suggest a custom styling system.

---

### 3. Interface Specifications

#### 3.1. `REST` Factory

*   **Return Value:** `Object`
    *   An object where each key is a string representing an entity (e.g., 'blocks', 'content', 'users') and the value is an AngularJS `$resource` object.
    *   Each `$resource` object provides methods like:
        *   `get(params, successCb, errorCb)`
        *   `query(params, successCb, errorCb)`
        *   `save(params, payload, successCb, errorCb)`
        *   `delete(params, payload, successCb, errorCb)`
        *   `update(params, payload, successCb, errorCb)` (if defined, like for 'blocks')

#### 3.2. `Page` Factory

*   **Return Value:** `Object`
    *   An object with the following properties (data types are illustrative based on usage):
        *   `id`: `Number` | `String` (Page identifier)
        *   `title`: `String`
        *   `description`: `String`
        *   `header`: `String`
        *   `subheader`: `String`
        *   `body`: `String` (HTML content, likely)
        *   `url`: `String`
        *   `type`: `String` (Page template/type identifier)
        *   `published`: `String` ('Y', 'N', or 'schedule')
        *   `published_date`: `String` | `Number` (Timestamp or date string)
        *   `themePages`: `Array<String>` (List of available page types/templates for the current theme)
        *   `timestamp`: `String` | `Number`
        *   `extras`: `Array` | `Object` (Container for custom fields/data)
        *   `misc`: `Object` (General purpose miscellaneous data)

#### 3.3. `Users` Factory

*   **Return Value:** `Object`
    *   An object with the following properties:
        *   `id`: `String` | `Number`
        *   `username`: `String`
        *   `name`: `String`
        *   `bio`: `String`
        *   `email`: `String`
        *   `facebook`: `String`
        *   `twitter`: `String`
        *   `photo`: `String` (URL to photo)
        *   `role`: `String`

#### 3.4. `pageCtrl` Controller

*   **Injected Dependencies:**
    | Name           | Type     | Description                                      |
    |----------------|----------|--------------------------------------------------|
    | `$scope`       | Object   | AngularJS scope object for data-binding.         |
    | `REST`         | Service  | Factory for backend API communication.           |
    | `$location`    | Service  | For URL manipulation and navigation.             |
    | `Page`         | Service  | Global state for the current page.               |
    | `$rootScope`   | Service  | For broadcasting global events (e.g., 'notify'). |
    | `$routeParams` | Service  | To access URL parameters.                        |
    | `$upload`      | Service  | (Injected but not used in snippet) For file uploads. |
    | `Users`        | Service  | Global state for the current user.               |
    | `$translate`   | Service  | For internationalization of messages.            |

*   **`$scope` Properties Exposed to View (`page.html`):**
    | Name                 | Type          | Description                                                                 |
    |----------------------|---------------|-----------------------------------------------------------------------------|
    | `page`               | Object        | Local copy of page data for the form (title, description, url, publish, etc.) |
    | `page.id`            | String/Number | ID of the current page.                                                     |
    | `page.title`         | String        | Page title.                                                                 |
    | `page.description`   | String        | Page meta description.                                                      |
    | `page.url`           | String        | Page URL slug.                                                              |
    | `page.publish`       | String        | Publish status ('Y', 'N', 'schedule').                                      |
    | `page.scheduleDate`  | Date/String   | Date for scheduled publishing.                                              |
    | `page.tags`          | Array<String> | List of tags associated with the page.                                        |
    | `page.type`          | String        | Selected page type/template.                                                |
    | `page.themePages`    | Array<String> | Available theme page types for the select dropdown.                         |
    | `page.suggestions`   | Array<String> | Tag suggestions for autocomplete.                                           |
    | `page.confirm`       | Boolean       | Flag to control visibility of delete confirmation UI.                       |
    | `newerVersion`       | Boolean       | Flag indicating if a newer local draft exists in `localStorage`.            |
    | `autoURL`            | Boolean       | Flag to control automatic URL generation from title.                        |
    | `admin.sidebar`      | String        | (Accessed in HTML) Path to sidebar template.                                |
    | `admin.showAdminPanel`| Boolean       | (Accessed in HTML) Controls visibility of admin panel.                      |
    | `admin.active`       | Boolean       | (Accessed in HTML) Controls active state of admin panel.                    |

*   **`$scope` Methods Exposed to View (`page.html`):**
    | Name                   | Parameters    | Description                                                              |
    |------------------------|---------------|--------------------------------------------------------------------------|
    | `localVersion()`       | None          | Reverts page data to the version stored in `localStorage`.               |
    | `deleteNewerVersion()` | None          | Deletes the newer version from `localStorage`.                           |
    | `deletePage()`         | None          | Deletes the current page from the backend.                               |
    | `updatePageType()`     | None          | Updates the `Page.type` service when the page type select changes.       |
    | `titleChange()`        | None          | Handles changes to the title input, updates `Page.title`, may auto-gen URL.|
    | `descriptionChange()`  | None          | Handles changes to the description input, updates `Page.description`.    |
    | `urlChange()`          | None          | Handles changes to the URL input, updates `Page.url`.                    |
    | `saveLocal()`          | None          | Saves current form data to `Page` service and `localStorage`.            |
    | `autocompleteTags()`   | None          | Fetches tag suggestions based on current input.                          |
    | `selectSuggestion(tag)`| `tag`: String | Adds a selected tag suggestion to `page.tags`.                           |
    | `savePage(duplicate)`  | `duplicate` (Optional): Boolean | Saves or updates the page. If `duplicate` is true, saves as a new page. |

---

### 4. Usage Documentation

This module is typically used within an admin section of the Cosmo application where content management tasks are performed.

**Initialization Requirements:**
1.  The AngularJS application must have the `cosmo` module defined.
2.  The `REST`, `Page`, and `Users` factories must be registered with the `cosmo` module.
3.  The `pageCtrl` controller must be registered.
4.  Dependencies like `$resource` (for `angular-resource.js`) and `$translate` (e.g., `angular-translate.js`) must be included and configured.
5.  Routing (e.g., using `ngRoute` or `ui-router`) must be set up to associate a URL pattern (e.g., `/pages/edit/:url` or `/new`) with the `page.html` template and `pageCtrl`.

**Sample Route Configuration (using `ngRoute`):**

```javascript
angular.module('cosmo').config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/new', { // For creating a new page
            templateUrl: 'path/to/page.html',
            controller: 'pageCtrl',
            resolve: {
                pageData: ['Page', function(Page) {
                    // Reset Page factory for a new page
                    Page.id = 0;
                    Page.title = '';
                    // ... reset other Page properties
                    Page.url = 'new'; // Special identifier
                    return Page;
                }]
            }
        })
        .when('/:url*', { // For editing an existing page (assuming :url is the page identifier)
            templateUrl: 'path/to/page.html',
            controller: 'pageCtrl',
            resolve: {
                pageData: ['$route', 'REST', 'Page', function($route, REST, Page) {
                    // Fetch page data from backend and populate Page factory
                    // This is a simplified example; actual loading logic might be more complex
                    // and likely happens before controller instantiation or via an event.
                    // The provided pageCtrl seems to expect Page factory to be pre-populated.
                    var pageUrl = $route.current.params.url;
                    return REST.content.get({ url: pageUrl }, function(data) {
                        angular.extend(Page, data); // Populate Page factory
                        // Also fetch themePages, extras, tags etc. and populate Page factory
                        return Page;
                    }).$promise;
                }]
            }
        });
}]);
```

**Common Use Cases:**
1.  **Creating a New Page:** User navigates to a route like `/new`. `pageCtrl` initializes with default/empty values from the `Page` factory. User fills the form and clicks "Save". `savePage()` is called, making API requests to create the page, its tags, revision, and extras.
2.  **Editing an Existing Page:** User navigates to a route like `/my-awesome-page`. Data for this page is pre-loaded into the `Page` factory (often via a route resolver or a service call triggered by a parent controller). `pageCtrl` initializes its scope from the `Page` factory. User modifies data and clicks "Save". `savePage()` is called, updating the page and its related entities.
3.  **Draft Recovery:** If the user was editing a page, and their session was interrupted, upon returning to edit the same page, the `newerVersion` bar will appear if `localStorage` contains changes. The user can choose to load or discard these local changes.

---

### 5. Accessibility Features

The provided `page.html` template includes some elements that contribute to accessibility, but also areas for potential improvement:

*   **Labels:** `<label>` elements are used for form inputs.
    *   `Type`: `<label class="type" for="type" translate="type"></label>` - Associated with a select, but the select itself lacks an `id="type"`. **Correction needed:** Add `id="type"` to the `<select>`.
    *   `Title`: `<label translate="title"></label>` - Not explicitly linked with `for`. **Improvement:** Add `id` to input and `for` to label.
    *   `Description`: `<label for="description" translate="description"></label>` - Associated with a textarea, but the textarea lacks `id="description"`. **Correction needed:** Add `id="description"` to the `<textarea>`.
    *   `Tags`: `<label for="tags" translate="tags"></label>` - Associated with an input, but the input lacks `id="tags"`. **Correction needed:** Add `id="tags"` to the tags `<input>`.
    *   `URL`: `<label for="url" translate="url"></label>` - Associated with an input, but the input lacks `id="url"`. **Correction needed:** Add `id="url"` to the URL `<input>`.
    *   `Publish/Draft/Schedule`: `<label for="Y">`, `<label for="N">`, `<label for="schedule">` are correctly associated with their respective radio inputs.
*   **Placeholders:** `placeholder` attributes are used on text inputs and textareas, offering hints to users.
*   **Internationalization:** The `translate` directive is used extensively, suggesting that UI text can be localized, which is beneficial for users speaking different languages.
*   **Keyboard Navigation:**
    *   Standard HTML form elements (`input`, `select`, `textarea`, `button`) are generally keyboard accessible by default.
    *   The custom radio button implementation (`<label ng-click="...">`) should be tested to ensure that the actual radio inputs are focusable and can be changed using arrow keys and selected with the spacebar, as is standard for radio groups. The `ng-modal` (likely `ng-model`) on the radio inputs should handle this, but the `ng-click` on the label is an additional interaction layer.
    *   Tag suggestions (`<a>` tags within `div.tag-suggestions`) should be keyboard navigable (e.g., using arrow keys) and selectable (e.g., using Enter). Currently, they rely on `ng-click`.
*   **ARIA Attributes:**
    *   No explicit ARIA roles or attributes (e.g., `aria-live` for notifications or dynamic content like tag suggestions, `aria-expanded` for collapsible sections if any) are visible in the provided snippet.
    *   **Recommendation:**
        *   For the "Newer Version" bar (`div.new-version`) and "Tag Suggestions" (`div.tag-suggestions`), consider using `aria-live="polite"` so screen readers announce their appearance.
        *   Ensure interactive elements like buttons have clear, descriptive text (which `translate` helps with).
        *   The `num-count` spans for character counts could be linked to their respective inputs using `aria-describedby` if they provide crucial information not otherwise obvious.

**Focus Management:**
*   No explicit focus management logic is visible in the controller. Standard browser behavior will apply.
*   When tag suggestions appear, focus should ideally move to the suggestions or allow easy navigation into them.
*   After actions like "Save" or "Delete", focus should be managed predictably (e.g., return to a logical element or move to a success message).

---

### 6. Conclusion

The Cosmo Page Management module provides a robust and feature-rich interface for content editors. Its separation of concerns (REST communication, page state, user state, controller logic, and view) using AngularJS factories and controllers promotes modularity and testability.

**Benefits & Value:**
*   **Centralized API Management:** `REST` factory offers a single place to define backend interactions.
*   **Global State Management:** `Page` and `Users` factories provide accessible global state for page and user data.
*   **Rich User Experience:** Features like auto-URL generation, tag suggestions, draft recovery, and scheduled publishing enhance usability.
*   **Data Integrity:** The sequential promise-based saving mechanism in `savePage()` helps ensure that related data (content, tags, revisions, extras) is persisted correctly.
*   **Internationalization:** Built-in support for translation via the `translate` directive.

**Contribution to Overall User Experience:**
This module is critical for the primary task of content creation and management within the Cosmo application. A well-functioning page editor directly impacts editor productivity and the quality of content produced.

**Best Practices for Implementation/Maintenance:**
*   **Typo Correction:** Correct `ng-modal` to `ng-model` in `page.html` for the publish status radio buttons.
*   **HTML Semantics & Accessibility:** Ensure all form labels are correctly associated with their inputs using `for` and `id` attributes. Enhance with ARIA attributes where appropriate for dynamic content and custom interactions.
*   **Error Handling:** While notifications are broadcast, ensure comprehensive error handling for all API calls, providing clear feedback to the user.
*   **Code Clarity:** The promise chain in `savePage()` is complex. Consider refactoring for better readability if possible, perhaps by breaking down functions further or using async/await patterns if a transpiler (like Babel for ES6+ features in an AngularJS context) were ever introduced.
*   **Dependency Management:** Review injected dependencies like `$upload` in `pageCtrl` and `Page` in `rest.js` to remove them if they are truly unused.
*   **Testing:** Given the separation, unit tests can be written for the factories and controller logic. End-to-end tests would cover the UI interactions.
*   **State Management:** For more complex applications, consider if the simple factory-based state management is sufficient or if a more structured approach (like a rudimentary Redux-like pattern or migrating to a newer framework) might be beneficial in the long term.

This documentation provides a technical deep-dive into the provided AngularJS code, outlining its structure, functionality, and areas for consideration.

### Tokens: {'input_tokens': 6477, 'output_tokens': 6361}
### Execution time: 101.62193298339844
