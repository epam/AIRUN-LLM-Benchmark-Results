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
## Technical Documentation: AngularJS Page Editor Component

This document provides a comprehensive technical description of the AngularJS code provided, focusing on its implementation details, features, and usage. This component is part of a larger application, likely a Content Management System (CMS), built with AngularJS. It facilitates the creation and editing of pages by interacting with a RESTful backend.

### 1. Component Overview

This AngularJS component is designed to manage the creation and modification of web pages within a CMS application. It comprises several interconnected parts:

*   **`rest.js` (REST Factory):**  This factory acts as a central communication layer with the backend REST API. It encapsulates `$resource` objects for various entities like blocks, comments, content, files, menus, settings, themes, and users, providing a consistent interface for data interaction.
*   **`page.js` (Page Factory):** This factory serves as a data model for page objects. It stores page-related variables globally, allowing different parts of the application to access and modify page data consistently.
*   **`users.js` (Users Factory):**  Similar to the `Page` factory, this factory stores user-related data globally, representing the currently logged-in user.
*   **`pageCtrl.js` (Page Controller):** This controller (`pageCtrl`) is responsible for the logic behind the page editing view (`page.html`). It handles user interactions, data binding, API calls via the `REST` factory, and manages the state of the page editing process.
*   **`page.html` (Page View):** This HTML template defines the user interface for editing page details. It uses AngularJS directives to bind to the `pageCtrl`'s scope, displaying form elements for page attributes and handling user actions.

**Key Functionality:**

*   **REST API Communication:**  Handles all communication with the backend REST API for CRUD operations on various content entities.
*   **Page Data Management:**  Provides a central data store (`Page` factory) for page attributes, ensuring data consistency across the application.
*   **User Data Management:** Provides a central data store (`Users` factory) for current user information.
*   **Page Editing UI:**  Offers a user-friendly interface for editing page metadata like title, description, URL, type, tags, and publishing status.
*   **Local Storage for Unsaved Changes:** Implements local storage to preserve unsaved changes and offer version comparison.
*   **URL Auto-generation:** Automatically generates page URLs based on the title.
*   **Tag Autocomplete:** Provides tag suggestions during page editing.
*   **Page Saving and Duplication:** Allows users to save new pages, update existing ones, and duplicate pages.
*   **Page Deletion:** Enables users to delete pages and associated data.
*   **Revision Management (Implicit):** While not explicitly a feature of this component alone, the code interacts with revision endpoints, suggesting integration with a broader revision management system.

**Architectural Role:**

This component acts as the **View-Controller** layer in an MVC-like architecture within the AngularJS application.

*   **View:** `page.html` - Presents the user interface.
*   **Controller:** `pageCtrl.js` - Manages user interactions and application logic.
*   **Model (Data):** `Page` and `Users` factories - Store and manage application data.
*   **Service Layer:** `REST` factory - Handles communication with the backend data source.

It fits within the broader application by providing the specific functionality for page management, a core feature of most CMS systems. It relies on other modules (`cosmo` module, `$resource`, `$location`, `$rootScope`, `$routeParams`, `$upload`, `$translate`) and backend API endpoints to function correctly.

### 2. Component Features

#### 2.1. REST API Communication (`rest.js`)

**Feature:** Centralized REST API interaction using AngularJS `$resource`.

**Technical Implementation:**

*   The `REST` factory is defined within the `cosmo` AngularJS module.
*   It injects `$resource` and `Page` services. While `Page` is injected, it's not directly used within the factory's logic. This might be a remnant or intended for future use.
*   It returns an object containing multiple properties, each representing a specific API endpoint.
*   Each property is assigned a `$resource` object configured with:
    *   **URL Template:** Defines the API endpoint URL with placeholders for parameters (e.g., `'api/blocks/:blockID'`).
    *   **Default Parameters:** Specifies default values for URL parameters (e.g., `{ blockID: '@blockID'}`). The `@` symbol indicates that the value will be taken from the parameter of the `$resource` method call.
    *   **Custom Actions:**  Defines custom actions beyond the default `$resource` methods (GET, POST, DELETE). In this case, `update: { method: 'PUT' }` is defined for several resources, explicitly setting the HTTP method for update operations to PUT.

**Dependencies:**

*   `$resource`: AngularJS service for creating RESTful resources.
*   `Page`: AngularJS factory (injected but not directly used in the current code).

**API Endpoints Defined:**

| Resource Name          | Endpoint URL                                      | Parameters                               | Methods (Default + Custom) | Description                                     |
| ---------------------- | ------------------------------------------------- | ---------------------------------------- | -------------------------- | ----------------------------------------------- |
| `blocks`             | `api/blocks/:blockID`                             | `blockID`                                | GET, POST, PUT, DELETE     | Operations on blocks                              |
| `blocksRequirements` | `api/blocks/:blockID/requirements/:requirementID` | `blockID`, `requirementID`               | GET, POST, PUT, DELETE     | Operations on block requirements                  |
| `comments`           | `api/comments/:commentID`                           | `commentID`                              | GET, POST, PUT, DELETE     | Operations on comments                            |
| `content`            | `api/content/:contentID`                            | `contentID`                              | GET, POST, PUT, DELETE     | Operations on content (pages)                     |
| `contentExtras`      | `api/content/:contentID/extras/`                   | `contentID`                              | GET, POST, DELETE          | Operations on content extras                      |
| `contentRevisions`   | `api/content/:contentID/revisions/:revisionID`    | `contentID`, `revisionID`               | GET, POST, PUT, DELETE     | Operations on content revisions                   |
| `contentRevisionsExtras`| `api/content/:contentID/revisions/:revisionID/extras/:extraID` | `revisionID`, `contentID`, `extraID` | GET, POST, DELETE          | Operations on content revision extras             |
| `contentTags`        | `api/content/:contentID/tags/`                     | `contentID`                              | GET, POST, DELETE, QUERY     | Operations on content tags                        |
| `files`              | `api/files/:fileID`                                | `fileID`                                 | GET, POST, PUT, DELETE     | Operations on files                               |
| `filesTags`          | `api/files/:fileID/tag/:tag`                       | `fileID`, `tag`                          | GET, POST, PUT, DELETE     | Operations on file tags                           |
| `menus`              | `api/menus/:menuID`                                | `menuID`                                 | GET, POST, PUT, DELETE     | Operations on menus                               |
| `modules`            | `api/modules/:moduleID`                              | `moduleID`                               | GET, POST, PUT, DELETE     | Operations on modules                             |
| `sitemaps`           | `api/sitemaps/`                                     | None                                     | GET, POST, DELETE, QUERY     | Operations on sitemaps                            |
| `themes`             | `api/themes/:themeID`                               | `themeID`                                | GET, POST, PUT, DELETE     | Operations on themes                              |
| `settings`           | `api/settings/`                                     | None                                     | GET, POST, PUT, DELETE, QUERY     | Operations on settings                            |
| `users`              | `api/users/:userID`                                | `userID`                                 | GET, POST, PUT, DELETE     | Operations on users                               |

#### 2.2. Page Data Model (`page.js`)

**Feature:** Global storage and management of page-related data.

**Technical Implementation:**

*   The `Page` factory is defined within the `cosmo` AngularJS module.
*   It returns a simple JavaScript object with properties representing various page attributes.
*   These properties are initialized with default values (e.g., empty strings, 0, empty arrays).
*   This factory acts as a singleton data container. When injected into different controllers or services, they all receive the same instance of the object, allowing for shared state management.

**Properties:**

| Property Name     | Data Type | Description                                  |
| ----------------- | --------- | -------------------------------------------- |
| `id`              | Number    | Page ID                                      |
| `title`           | String    | Page title                                   |
| `description`     | String    | Page description                             |
| `header`          | String    | Page header content                          |
| `subheader`       | String    | Page subheader content                       |
| `body`            | String    | Page body content                            |
| `url`             | String    | Page URL                                     |
| `type`            | String    | Page type (template)                         |
| `published`       | String    | Publish status ('Y', 'N', 'schedule')        |
| `published_date`  | String    | Published date (likely timestamp or date string) |
| `themePages`      | Array     | Array of available theme page templates      |
| `timestamp`       | String    | Timestamp of page modification               |
| `extras`          | Array     | Array of extra page data (key-value pairs)   |
| `misc`            | Object    | Miscellaneous page data                      |

#### 2.3. User Data Model (`users.js`)

**Feature:** Global storage and management of current user data.

**Technical Implementation:**

*   The `Users` factory is defined within the `cosmo` AngularJS module.
*   It returns a JavaScript object with properties representing user attributes.
*   Properties are initialized with empty strings.
*   Similar to the `Page` factory, it acts as a singleton for shared user data.

**Properties:**

| Property Name | Data Type | Description                  |
| ------------- | --------- | ---------------------------- |
| `id`          | String    | User ID                      |
| `username`    | String    | Username                     |
| `name`        | String    | User's full name             |
| `bio`         | String    | User biography               |
| `email`       | String    | User email address           |
| `facebook`    | String    | Facebook profile URL         |
| `twitter`     | String    | Twitter profile URL          |
| `photo`       | String    | URL of user's profile photo  |
| `role`        | String    | User role (e.g., admin, editor) |

#### 2.4. Page Controller (`pageCtrl.js`) and View (`page.html`)

**Feature:** User interface and logic for creating and editing pages.

**Technical Implementation:**

*   **Controller Initialization:**
    *   Injects `$scope`, `REST`, `$location`, `Page`, `$rootScope`, `$routeParams`, `$upload`, `Users`, and `$translate` services.
    *   Initializes `$scope.page` object by copying properties from the `Page` factory. This binds the view to the shared `Page` data model.
    *   Sets the `scheduleDate` to the current date if it's not already set or if creating a new page (`/new` path).
    *   Retrieves `themePages` from the `Page` factory and assigns them to `$scope.page.themePages`.
    *   Sets the initial `page.type` based on `Page.type` or defaults to the first available theme page.
    *   Checks for newer versions of page data in `localStorage` compared to the `Page` factory data. If a newer version exists, sets `$scope.newerVersion` to `true` to display a notification in the view.

*   **Local Version Management:**
    *   `$scope.localVersion()`: Reverts page data to the locally stored version from `localStorage`. It iterates through specified page attributes, restores them from `localStorage` to the `Page` factory, clears the `localStorage` entries, sets `$scope.newerVersion` to `false`, and broadcasts a `'contentGet'` event to refresh content in other parts of the application.
    *   `$scope.deleteNewerVersion()`: Discards the locally stored version by clearing the relevant `localStorage` entries and sets `$scope.newerVersion` to `false`.

*   **Page Deletion:**
    *   `$scope.deletePage()`: Deletes the current page and related data.
        *   Uses `REST.content.delete()` to delete the main content entity.
        *   Uses `REST.contentRevisions.delete()`, `REST.contentRevisionsExtras.delete()`, and `REST.contentExtras.delete()` to delete associated revisions and extras.
        *   Uses `REST.contentTags.delete()` to delete page tags.
        *   Redirects the user to the `/new` page after deletion.
        *   Broadcasts a `'notify'` event with a success message using `$translate` for localization.

*   **Page Data Synchronization:**
    *   `updatePage()`: Function to update `$scope.page` properties from the `Page` factory.
    *   `$scope.$on('contentGet', ...)`:  Event listener that calls `updatePage()` when a `'contentGet'` event is broadcast, ensuring the `$scope.page` is synchronized with the `Page` factory whenever content is retrieved or updated elsewhere in the application.

*   **Page Type Update:**
    *   `$scope.updatePageType()`: Updates the `Page.type` in the `Page` factory with the selected type from the view and broadcasts a `'settingsGet'` event, likely to trigger updates in settings-related components.

*   **URL Auto-generation:**
    *   `$scope.titleChange()`: Handles changes to the page title input.
        *   Updates `Page.title` in the `Page` factory.
        *   If `$scope.autoURL` is true (initially true for new pages or when URL is default), it automatically generates a URL from the title by:
            *   Converting the title to lowercase.
            *   Replacing spaces with hyphens.
            *   Removing punctuation.
        *   Updates `Page.url` with the generated URL.

*   **Data Binding for Description and URL:**
    *   `$scope.descriptionChange()`: Updates `Page.description` in the `Page` factory when the description input changes.
    *   `$scope.urlChange()`: Updates `Page.url` in the `Page` factory and sets `$scope.autoURL` to `false` when the URL input is manually changed, disabling auto-generation.

*   **Local Storage Saving:**
    *   `$scope.saveLocal()`: Saves current page attributes (`title`, `description`, `url`, `publish`, `scheduleDate`, `type`) to `localStorage` for the current page URL (obtained from `$routeParams.url`). This is likely used to persist unsaved changes between sessions.

*   **Tag Autocomplete:**
    *   `$scope.autocompleteTags()`: Handles tag autocomplete functionality.
        *   Gets the last entered tag from `$scope.page.tags`.
        *   If a tag is present, it queries `REST.contentTags.query()` to fetch tag suggestions from the backend based on the entered tag.
        *   Assigns the suggestions to `$scope.page.suggestions`.
        *   If no tag is entered or no suggestions are found, it clears `$scope.page.suggestions`.
    *   `$scope.selectSuggestion(tag)`: Handles the selection of a tag suggestion.
        *   Copies the current `$scope.page.tags` array.
        *   Replaces the last entered tag with the selected `tag`.
        *   Appends an empty string to the `tags` array to allow for further tag input.
        *   Updates `$scope.page.tags` with the modified array.
        *   Clears `$scope.page.suggestions`.

*   **Page Saving and Updating (`$scope.savePage(duplicate)`):**
    *   Handles saving new pages, updating existing pages, and duplicating pages.
    *   **Validation:**
        *   Checks for duplicate URLs if duplicating a page and the URL is the same as the current page's URL.
        *   Ensures a page type is selected.
        *   Validates that the page URL is not empty or 'new'.
    *   **Schedule Date Handling:**
        *   Determines the `scheduleDate` based on the publish status (`$scope.page.publish`) and the previous publish status (`Page.publish`).
        *   If publishing now (`'Y'`) and was already published, it keeps the existing `Page.scheduleDate`.
        *   If publishing now for the first time, it sets `scheduleDate` to the current timestamp.
        *   If scheduling (`'schedule'`), it parses `$scope.page.scheduleDate` and converts it to a timestamp.
        *   Checks if the scheduled date is in the past and adjusts the publish status to `'Y'` if so.
    *   **Featured Image Handling:**
        *   Retrieves the featured image URL from `Page.extras.featured.src` if it exists.
    *   **Save/Update Logic:**
        *   **New Page or Duplicate (`$location.path() === '/new' || duplicate`):**
            *   Uses `REST.content.save()` to create a new content entity.
            *   Calls `newPagePromise` on success and handles errors.
        *   **Update Existing Page (else):**
            *   Uses `REST.content.update()` to update the existing content entity (identified by `Page.id`).
            *   Calls `updatePagePromise` on success and handles errors.
    *   **`newPagePromise(data)`:** Callback function after successfully saving a new page.
        *   Extracts the `contentID` from the response data.
        *   Updates `$scope.page.id` and sets `$scope.autoURL` to `false`.
        *   Saves tags using `REST.contentTags.save()` for each tag in `$scope.page.tags`.
        *   Saves a revision of the page using `REST.contentRevisions.save()`.
        *   Calls `saveRevisionPromise` after saving the revision.
    *   **`saveRevisionPromise(data)`:** Callback after saving a page revision.
        *   Extracts the `revisionID` from the response data.
        *   If `Page.extras` is empty, it broadcasts a success `'notify'` event, translates "saved" or "page_created" messages, and redirects to the new page URL.
        *   If `Page.extras` is not empty, it iterates through `Page.extras`, saves each extra using `REST.contentExtras.save()` and `REST.contentRevisionsExtras.save()`, and uses `saveExtrasPromise` as a callback.
    *   **`saveExtrasPromise()`:** Callback after saving each extra.
        *   Uses a counter (`extrasCounter`) to track saved extras.
        *   When all extras are saved, it broadcasts a success `'notify'` event, translates "saved" or "page_created" messages, and redirects to the new page URL.
    *   **`updatePagePromise(data)`:** Callback after successfully updating an existing page.
        *   Deletes old tags using `REST.contentTags.delete()` and calls `deleteTagsPromise`.
        *   Saves a revision of the page using `REST.contentRevisions.save()` and calls `savePageRevisionPromise`.
    *   **`savePageRevisionPromise(data)`:** Callback after saving a page revision during update.
        *   Extracts `revisionID`.
        *   Deletes old extras using `REST.contentExtras.delete()` and calls `deleteExtrasPromise`.
    *   **`deleteTagsPromise()`:** Callback after deleting old tags.
        *   Saves new tags using `REST.contentTags.save()` for each tag in `$scope.page.tags`.
    *   **`deleteExtrasPromise()`:** Callback after deleting old extras.
        *   Iterates through `Page.extras`, saves each extra using `REST.contentExtras.save()` and `REST.contentRevisionsExtras.save()`, and uses `saveExtrasPromise` as a callback.
        *   If there are no extras, it broadcasts a success `'notify'` event and translates "page_updated" message.

**Dependencies:**

*   `$scope`: AngularJS scope service.
*   `REST`: REST Factory (`rest.js`).
*   `$location`: AngularJS location service for URL manipulation.
*   `Page`: Page Factory (`page.js`).
*   `$rootScope`: AngularJS root scope service for broadcasting events.
*   `$routeParams`: AngularJS route parameters service for accessing URL parameters.
*   `$upload`: AngularJS file upload service (injected but not used in the provided code).
*   `Users`: Users Factory (`users.js`).
*   `$translate`: AngularJS translate service for localization.

**View (`page.html`) Structure and Bindings:**

*   **Newer Version Notification:**
    *   `ng-show="newerVersion"`: Conditionally displays a div if `$scope.newerVersion` is true.
    *   Buttons with `ng-click` directives to call `$scope.deleteNewerVersion()` and `$scope.localVersion()`.
    *   `translate` directive for localization of text.

*   **Top Bar:**
    *   Navigation links with `ng-click` to manipulate `admin.sidebar` and `admin.showAdminPanel` (likely related to a sidebar menu in the larger application).

*   **Action Bar:**
    *   Buttons for "delete", "duplicate", and "save" with `ng-click` directives calling `$scope.deletePage()`, `$scope.savePage(true)`, and `$scope.savePage()` respectively.
    *   Conditional display of confirmation buttons for delete action using `ng-show="page.confirm"` and `ng-click` to manage `$scope.page.confirm`.

*   **Page Editor Form (`pg-editor` div):**
    *   **Page Type Select:**
        *   `<select>` element with `ng-model="page.type"`, `ng-options="(themePage | themeFiles ) for themePage in page.themePages"`, and `ng-change="updatePageType()"`.
        *   `ng-options` dynamically generates options from `$scope.page.themePages` and uses a filter `themeFiles` (not defined in the provided code, likely external).
    *   **Title Input:**
        *   `<input type='text' ng-model="page.title" ng-keyup="titleChange()"`.
        *   `ng-model` binds to `$scope.page.title`.
        *   `ng-keyup` calls `$scope.titleChange()` on key release.
    *   **Description Textarea:**
        *   `<textarea ng-model="page.description" ng-keyup="descriptionChange()"`.
        *   `ng-model` binds to `$scope.page.description`.
        *   `ng-keyup` calls `$scope.descriptionChange()` on key release.
    *   **Tags Input:**
        *   `<input type="text" ng-list ng-model="page.tags" ng-change="autocompleteTags()"`.
        *   `ng-list` directive likely parses comma-separated input into an array.
        *   `ng-model` binds to `$scope.page.tags`.
        *   `ng-change` calls `$scope.autocompleteTags()` when the input changes.
    *   **Tag Suggestions:**
        *   `<div class="tag-suggestions" ng-show="page.suggestions.length">` - Conditionally displays suggestions if `$scope.page.suggestions` has length.
        *   `<a ng-repeat="tag in page.suggestions | limitTo:10" ng-click="selectSuggestion(tag)">{{tag | titlecase}}</a>` - Repeats through `$scope.page.suggestions` (limited to 10), displays each tag with `titlecase` filter (not defined, likely external), and calls `$scope.selectSuggestion(tag)` on click.
    *   **URL Input:**
        *   `<input type='text' ng-model='page.url' ng-keyup="autoURL=false;urlChange()">`
        *   `ng-model` binds to `$scope.page.url`.
        *   `ng-keyup` sets `$scope.autoURL` to `false` and calls `$scope.urlChange()`.
    *   **Publish Status Radio Buttons:**
        *   Radio buttons for "publish", "draft", and "schedule" with `ng-model` (incorrectly used as `ng-modal`, should be `ng-model`), `ng-class` for active state, and `ng-click` to set `$scope.page.publish`.
    *   **Schedule Date Input:**
        *   `<input type="datetime-local" ng-model="page.scheduleDate" ng-show="page.publish=='schedule'">` - Displays datetime-local input only when publish status is "schedule".

### 3. Interface Specifications

#### 3.1. Page Controller (`pageCtrl`) Scope

| Scope Variable/Function | Data Type | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                

### Tokens: {'input_tokens': 6506, 'output_tokens': 5782}
### Execution time: 36.56147575378418
