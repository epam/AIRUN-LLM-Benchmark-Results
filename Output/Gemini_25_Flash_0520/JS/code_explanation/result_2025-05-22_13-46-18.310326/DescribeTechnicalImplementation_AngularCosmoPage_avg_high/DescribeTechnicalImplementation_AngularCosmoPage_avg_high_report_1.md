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
This document provides a comprehensive technical description of the provided Angular.js application code, focusing on its structure, functionality, and implementation details.

---

## 1. Component Overview

This application segment primarily revolves around a content management system's page editing functionality. It allows users to create, edit, save, and delete web pages, managing their content, metadata, and publication status. The core components involved are:

*   **`REST` Factory (`rest.js`)**: A foundational service responsible for abstracting interactions with the backend RESTful API. It defines various `$resource` instances for different data entities, simplifying CRUD operations.
*   **`Page` Factory (`page.js`)**: A data factory acting as a global singleton to store and manage the state of the currently edited page. This ensures consistent data access across different parts of the application.
*   **`Users` Factory (`users.js`)**: Similar to the `Page` factory, this service holds global information about the currently authenticated user, such as their ID and role, which is crucial for operations like attributing page authorship.
*   **`pageCtrl` Controller (`pageCtrl.js`)**: The central logic unit that orchestrates the page editing process. It binds data from the `Page` factory to the UI, handles user interactions, performs validations, and communicates with the backend via the `REST` factory.
*   **`page.html` Template**: The user interface for the page editor, providing input fields for page title, description, URL, tags, publication status, and actions like save, delete, and duplicate.

Together, these components form a robust system for managing web page content, integrating frontend user experience with backend data persistence and versioning.

---

## 2. Component Features

This section details the major features implemented across the provided code, explaining their technical implementation and dependencies.

### 2.1 RESTful API Communication (`REST` Factory)

The `REST` factory centralizes all backend API interactions, leveraging Angular's `$resource` service.

*   **Purpose**: To provide a consistent and easy-to-use interface for performing CRUD (Create, Read, Update, Delete) operations against various RESTful endpoints.
*   **Technical Implementation**:
    *   It's an Angular factory that returns an object containing multiple `$resource` instances.
    *   Each `$resource` instance is configured with a base URL (e.g., `api/blocks/:blockID`), default parameters (e.g., `blockID: '@blockID'`), and custom methods.
    *   The `update: { method: 'PUT' }` configuration is consistently applied to most resources, enabling explicit PUT requests for updates, which is a common RESTful practice.
    *   **Dependencies**: `ngResource` module (implicitly, as `$resource` is injected), `Page` factory (though not directly used within `REST` factory definition, it's a dependency for `pageCtrl` which uses `REST`).
*   **Key Endpoints Defined**:
    *   `blocks`: `/api/blocks/:blockID`
    *   `blocksRequirements`: `/api/blocks/:blockID/requirements/:requirementID`
    *   `comments`: `/api/comments/:commentID`
    *   `content`: `/api/content/:contentID` (Primary for page management)
    *   `contentExtras`: `/api/content/:contentID/extras/`
    *   `contentRevisions`: `/api/content/:contentID/revisions/:revisionID`
    *   `contentRevisionsExtras`: `/api/content/:contentID/revisions/:revisionID/extras/:extraID`
    *   `contentTags`: `/api/content/:contentID/tags/`
    *   `files`: `/api/files/:fileID`
    *   `filesTags`: `/api/files/:fileID/tag/:tag`
    *   `menus`: `/api/menus/:menuID`
    *   `modules`: `/api/modules/:moduleID`
    *   `sitemaps`: `/api/sitemaps/`
    *   `themes`: `/api/themes/:themeID`
    *   `settings`: `/api/settings/`
    *   `users`: `/api/users/:userID`

### 2.2 Global Page Data Management (`Page` Factory)

The `Page` factory serves as a centralized data store for the current page's attributes.

*   **Purpose**: To maintain a single source of truth for the page data being edited, allowing different controllers or services to access and modify it consistently without direct DOM manipulation or complex event passing.
*   **Technical Implementation**:
    *   It's an Angular factory that returns a plain JavaScript object.
    *   This object acts as a singleton, meaning all injections of `Page` will refer to the same instance.
    *   It initializes various page properties (e.g., `id`, `title`, `description`, `url`, `type`, `published`, `themePages`, `extras`, `misc`).
    *   **Dependencies**: None within its own definition.
*   **Usage**: Controllers like `pageCtrl` inject `Page` and bind its properties to `$scope` variables, ensuring two-way data binding.

### 2.3 Global User Data Management (`Users` Factory)

Similar to the `Page` factory, the `Users` factory manages global user-specific data.

*   **Purpose**: To store and provide access to the current user's profile information across the application.
*   **Technical Implementation**:
    *   An Angular factory returning a plain JavaScript object, acting as a singleton.
    *   Initializes user properties (e.g., `id`, `username`, `name`, `email`, `role`).
    *   **Dependencies**: None within its own definition.
*   **Usage**: `pageCtrl` uses `Users.id` when saving a page to attribute authorship.

### 2.4 Page Editor Functionality (`pageCtrl` and `page.html`)

The `pageCtrl` controller, coupled with `page.html`, provides the interactive page editing experience.

#### 2.4.1 Page Data Initialization and Binding

*   **Purpose**: To load existing page data into the editor and establish two-way binding with UI elements.
*   **Technical Implementation**:
    *   `$scope.page` is initialized with values from the `Page` factory.
    *   `ng-model` directives in `page.html` (e.g., `ng-model="page.title"`) create two-way data binding between the input fields and `$scope.page` properties.
    *   A `$scope.$on('contentGet', ...)` listener updates `$scope.page` when the `Page` factory data changes (e.g., after loading a page).
    *   **Dependencies**: `Page` factory.

#### 2.4.2 Unsaved Changes Detection and Recovery

*   **Purpose**: To warn users about unsaved changes from a previous session and offer options to recover or discard them.
*   **Technical Implementation**:
    *   Upon controller initialization, it checks `localStorage` for specific page properties (`title`, `description`, `publish`, `scheduleDate`, `header`, `subheader`, `body`, `url`) associated with the current page's URL (`$routeParams.url`).
    *   If `localStorage` values differ from `Page` factory values (and are not `null`), `$scope.newerVersion` is set to `true`, displaying a warning.
    *   `$scope.localVersion()`: Restores page data from `localStorage` to the `Page` factory and clears `localStorage` items. Broadcasts `contentGet` to update the UI.
    *   `$scope.deleteNewerVersion()`: Clears the `localStorage` items without restoring, effectively discarding the unsaved version.
    *   `$scope.saveLocal()`: Periodically saves current `$scope.page` values to `localStorage` to enable this feature.
    *   **Dependencies**: `$location`, `$routeParams`, `Page` factory, `localStorage` API.

#### 2.4.3 Page Deletion

*   **Purpose**: To permanently remove a page and all its associated data from the backend.
*   **Technical Implementation**:
    *   `$scope.deletePage()`: Triggered by a confirmation button.
    *   Sends multiple `DELETE` requests using the `REST` factory to ensure comprehensive deletion: `REST.content.delete`, `REST.contentRevisions.delete`, `REST.contentRevisionsExtras.delete`, `REST.contentExtras.delete`, `REST.contentTags.delete`.
    *   Upon successful deletion of the main content, a success notification is broadcasted, and the user is redirected to the `/new` page path.
    *   **Dependencies**: `REST` factory, `$location`, `$translate`, `$rootScope`.

#### 2.4.4 Dynamic URL Generation

*   **Purpose**: To automatically generate a user-friendly URL slug based on the page title, while allowing manual override.
*   **Technical Implementation**:
    *   `$scope.titleChange()`: Triggered on `ng-keyup` of the title input.
    *   Updates `Page.title` with the current input value.
    *   If `$scope.autoURL` is `true` (default for new pages or if URL is empty), it converts the title to lowercase, replaces spaces with hyphens, and removes punctuation to form a URL slug.
    *   `$scope.autoURL` is set to `false` if the user manually edits the URL input, preventing further automatic updates.
    *   **Dependencies**: `Page` factory.

#### 2.4.5 Description and Title Character Count

*   **Purpose**: To provide real-time feedback on the length of the title and description fields.
*   **Technical Implementation**:
    *   `{{page.title.length}}` and `{{page.description.length}}` expressions in `page.html` directly display the length of the bound `$scope.page` properties.
    *   **Dependencies**: None beyond standard Angular data binding.

#### 2.4.6 Tag Autocomplete

*   **Purpose**: To assist users in adding tags by suggesting existing tags from the backend.
*   **Technical Implementation**:
    *   `$scope.autocompleteTags()`: Triggered on `ng-change` of the tags input (which uses `ng-list` to parse comma-separated values into an array).
    *   Queries `REST.contentTags.query` with the last entered tag fragment.
    *   Populates `$scope.page.suggestions` with the returned data.
    *   `$scope.selectSuggestion(tag)`: When a suggestion is clicked, it replaces the last tag fragment with the selected suggestion and adds an empty string to the tags array to allow immediate typing of the next tag.
    *   **Dependencies**: `REST` factory.

#### 2.4.7 Page Type Selection

*   **Purpose**: To allow users to select a predefined template or type for the page.
*   **Technical Implementation**:
    *   `ng-model="page.type"` binds the selected value from a `<select>` element.
    *   `ng-options="(themePage | themeFiles ) for themePage in page.themePages"` populates the dropdown with available theme pages (assuming `themeFiles` is a filter).
    *   `$scope.updatePageType()`: Triggered on `ng-change` of the select element. Updates `Page.type` and broadcasts `settingsGet` (implying other parts of the application might react to page type changes).
    *   **Dependencies**: `Page` factory, `$rootScope`.

#### 2.4.8 Publishing and Scheduling

*   **Purpose**: To control the visibility and publication timing of the page.
*   **Technical Implementation**:
    *   Radio buttons (`ng-model="page.publish"`) allow selecting 'Y' (publish now), 'N' (draft), or 'schedule'.
    *   An `input type="datetime-local"` is conditionally shown (`ng-show="page.publish=='schedule'"`) for scheduling.
    *   The `scheduleDate` is initialized to the current date if not set or on a new page.
    *   During `savePage`, the `published_date` sent to the backend is calculated:
        *   If `publish` is 'Y' and was already 'Y', `Page.scheduleDate` is used.
        *   If `publish` is 'Y' and was not 'Y', `Math.round(+new Date().getTime()/1000)` (current timestamp) is used.
        *   If `publish` is 'schedule`, `Date.parse($scope.page.scheduleDate).getTime()/1000` is used. If the scheduled date is in the past, `publish` is automatically set to 'Y'.
    *   **Dependencies**: `Page` factory, `$location`.

#### 2.4.9 Page Save Logic (New, Update, Duplicate, Revisions, Extras)

*   **Purpose**: The core functionality for persisting page data, including content, metadata, tags, and additional "extras," while also managing content revisions.
*   **Technical Implementation**:
    *   `$scope.savePage(duplicate)`: The main save function.
    *   **Validation**: Checks for duplicate URLs (if duplicating), presence of page type, and a valid URL. Displays error notifications via `$rootScope.$broadcast('notify')`.
    *   **New Page / Duplicate**: If `$location.path() === '/new'` or `duplicate` is `true`:
        *   `REST.content.save()` is called with all page data.
        *   `newPagePromise` callback: Sets `$scope.page.id`, saves tags (`REST.contentTags.save`), and saves a revision (`REST.contentRevisions.save`).
        *   `saveRevisionPromise` callback: Saves "extras" (`REST.contentExtras.save`, `REST.contentRevisionsExtras.save`) and redirects to the new page URL.
    *   **Update Existing Page**: If not a new page or duplicate:
        *   `REST.content.update()` is called with `contentID` and updated page data.
        *   `updatePagePromise` callback: Deletes old tags (`REST.contentTags.delete`), saves a new revision (`REST.contentRevisions.save`).
        *   `savePageRevisionPromise` callback: Deletes old extras (`REST.contentExtras.delete`).
        *   `deleteTagsPromise` callback: Saves new tags (`REST.contentTags.save`).
        *   `deleteExtrasPromise` callback: Saves new extras (`REST.contentExtras.save`, `REST.contentRevisionsExtras.save`).
    *   **Revisions**: Both new and update operations create a new entry in `REST.contentRevisions` and `REST.contentRevisionsExtras`, ensuring a historical record of changes.
    *   **Extras**: `Page.extras` (an object) is iterated, and each key-value pair is saved as a separate "extra" record. Objects within `Page.extras` are `angular.toJson` stringified before saving.
    *   **Notifications**: Success/error messages are broadcasted using `$rootScope.$broadcast('notify')` with translated text.
    *   **Dependencies**: `REST` factory, `Page` factory, `Users` factory, `$location`, `$rootScope`, `$translate`.

#### 2.4.10 Internationalization (i18n)

*   **Purpose**: To support multiple languages for user-facing messages.
*   **Technical Implementation**:
    *   The `$translate` service is injected and used to retrieve translated strings (e.g., `$translate('deleted').then(...)`).
    *   `translate` directive is used in `page.html` (e.g., `<p translate="page_newer"></p>`).
    *   **Dependencies**: `$translate` service (from `angular-translate` module, implicitly).

---

## 3. Interface Specifications

This section details the interfaces of the factories and the controller, including their properties, methods, and parameters.

### 3.1 `REST` Factory Interface

The `REST` factory returns an object containing various `$resource` instances. Each instance provides standard `$resource` methods (`get`, `save`, `query`, `remove`, `delete`) and a custom `update` method configured for PUT requests.

*   **`blocks`**
    *   **URL Pattern**: `api/blocks/:blockID`
    *   **Default Params**: `blockID: '@blockID'`
    *   **Custom Methods**: `update` (PUT)
*   **`blocksRequirements`**
    *   **URL Pattern**: `api/blocks/:blockID/requirements/:requirementID`
    *   **Default Params**: `blockID: '@blockID'`, `requirementID: '@requirementID'`
    *   **Custom Methods**: `update` (PUT)
*   **`comments`**
    *   **URL Pattern**: `api/comments/:commentID`
    *   **Default Params**: `commentID: '@commentID'`
    *   **Custom Methods**: `update` (PUT)
*   **`content`**
    *   **URL Pattern**: `api/content/:contentID`
    *   **Default Params**: `contentID: '@contentID'`
    *   **Custom Methods**: `update` (PUT)
*   **`contentExtras`**
    *   **URL Pattern**: `api/content/:contentID/extras/`
    *   **Default Params**: `contentID: '@contentID'`
    *   **Custom Methods**: None beyond default `$resource` methods.
*   **`contentRevisions`**
    *   **URL Pattern**: `api/content/:contentID/revisions/:revisionID`
    *   **Default Params**: `contentID: '@contentID'`, `revisionID: '@revisionID'`
    *   **Custom Methods**: `update` (PUT)
*   **`contentRevisionsExtras`**
    *   **URL Pattern**: `api/content/:contentID/revisions/:revisionID/extras/:extraID`
    *   **Default Params**: `revisionID: '@revisionID'`, `contentID: '@contentID'`, `extraID: '@extraID'`
    *   **Custom Methods**: None beyond default `$resource` methods.
*   **`contentTags`**
    *   **URL Pattern**: `api/content/:contentID/tags/`
    *   **Default Params**: `contentID: '@contentID'`
    *   **Custom Methods**: None beyond default `$resource` methods.
*   **`files`**
    *   **URL Pattern**: `api/files/:fileID`
    *   **Default Params**: `fileID: '@fileID'`
    *   **Custom Methods**: `update` (PUT)
*   **`filesTags`**
    *   **URL Pattern**: `api/files/:fileID/tag/:tag`
    *   **Default Params**: `fileID: '@fileID'`, `tag: '@tag'`
    *   **Custom Methods**: `update` (PUT)
*   **`menus`**
    *   **URL Pattern**: `api/menus/:menuID`
    *   **Default Params**: `menuID: '@menuID'`
    *   **Custom Methods**: `update` (PUT)
*   **`modules`**
    *   **URL Pattern**: `api/modules/:moduleID`
    *   **Default Params**: `moduleID: '@moduleID'`
    *   **Custom Methods**: `update` (PUT)
*   **`sitemaps`**
    *   **URL Pattern**: `api/sitemaps/`
    *   **Default Params**: None
    *   **Custom Methods**: None beyond default `$resource` methods.
*   **`themes`**
    *   **URL Pattern**: `api/themes/:themeID`
    *   **Default Params**: `themeID: '@themeID'`
    *   **Custom Methods**: `update` (PUT)
*   **`settings`**
    *   **URL Pattern**: `api/settings/`
    *   **Default Params**: None
    *   **Custom Methods**: `update` (PUT)
*   **`users`**
    *   **URL Pattern**: `api/users/:userID`
    *   **Default Params**: `userID: '@userID'`
    *   **Custom Methods**: `update` (PUT)

### 3.2 `Page` Factory Interface

The `Page` factory returns a singleton object representing the current page's data.

*   **`id`**
    *   **Data Type**: `Number`
    *   **Description**: Unique identifier for the page.
    *   **Status**: Optional (0 for new pages)
*   **`title`**
    *   **Data Type**: `String`
    *   **Description**: The main title of the page.
    *   **Status**: Optional (can be empty)
*   **`description`**
    *   **Data Type**: `String`
    *   **Description**: A brief summary or description of the page content (e.g., for SEO).
    *   **Status**: Optional
*   **`header`**
    *   **Data Type**: `String`
    *   **Description**: Main header content of the page.
    *   **Status**: Optional
*   **`subheader`**
    *   **Data Type**: `String`
    *   **Description**: Subheader content of the page.
    *   **Status**: Optional
*   **`body`**
    *   **Data Type**: `String`
    *   **Description**: The main content body of the page (e.g., HTML).
    *   **Status**: Optional
*   **`url`**
    *   **Data Type**: `String`
    *   **Description**: The URL slug for the page.
    *   **Status**: Required for saving
*   **`type`**
    *   **Data Type**: `String`
    *   **Description**: The type or template of the page (e.g., 'blog-post', 'about-page').
    *   **Status**: Required for saving
*   **`published`**
    *   **Data Type**: `String`
    *   **Description**: Publication status ('Y' for published, 'N' for draft, 'schedule' for scheduled).
    *   **Status**: Optional
*   **`published_date`**
    *   **Data Type**: `String` or `Number` (timestamp)
    *   **Description**: The date and time the page was/will be published.
    *   **Status**: Optional
*   **`themePages`**
    *   **Data Type**: `Array<String>`
    *   **Description**: A list of available page types/templates for the current theme.
    *   **Status**: Optional (populated by other parts of the app)
*   **`timestamp`**
    *   **Data Type**: `String`
    *   **Description**: Timestamp of the page's last modification.
    *   **Status**: Optional
*   **`extras`**
    *   **Data Type**: `Object`
    *   **Description**: An object to store additional, arbitrary key-value data associated with the page.
    *   **Status**: Optional
*   **`misc`**
    *   **Data Type**: `Object`
    *   **Description**: Miscellaneous data related to the page.
    *   **Status**: Optional

### 3.3 `Users` Factory Interface

The `Users` factory returns a singleton object representing the current user's data.

*   **`id`**
    *   **Data Type**: `String`
    *   **Description**: Unique identifier for the user.
    *   **Status**: Optional
*   **`username`**
    *   **Data Type**: `String`
    *   **Description**: User's login username.
    *   **Status**: Optional
*   **`name`**
    *   **Data Type**: `String`
    *   **Description**: User's full name.
    *   **Status**: Optional
*   **`bio`**
    *   **Data Type**: `String`
    *   **Description**: User's biography.
    *   **Status**: Optional
*   **`email`**
    *   **Data Type**: `String`
    *   **Description**: User's email address.
    *   **Status**: Optional
*   **`facebook`**
    *   **Data Type**: `String`
    *   **Description**: User's Facebook profile link.
    *   **Status**: Optional
*   **`twitter`**
    *   **Data Type**: `String`
    *   **Description**: User's Twitter handle.
    *   **Status**: Optional
*   **`photo`**
    *   **Data Type**: `String`
    *   **Description**: URL to the user's profile photo.
    *   **Status**: Optional
*   **`role`**
    *   **Data Type**: `String`
    *   **Description**: User's role or permissions level.
    *   **Status**: Optional

### 3.4 `pageCtrl` Controller Interface

The `pageCtrl` controller exposes properties and methods on its `$scope` for data binding and interaction with the `page.html` template.

#### 3.4.1 `$scope` Properties

*   **`page`**
    *   **Data Type**: `Object`
    *   **Description**: An object holding the current page's editable data, bound to UI inputs.
    *   **Properties**:
        *   `id`: `Number` - Page ID.
        *   `title`: `String` - Page title.
        *   `description`: `String` - Page description.
        *   `url`: `String` - Page URL.
        *   `publish`: `String` - Publication status ('Y', 'N', 'schedule').
        *   `scheduleDate`: `Date` - Date object for scheduled publication.
        *   `tags`: `Array<String>` - List of tags associated with the page.
        *   `type`: `String` - Selected page type/template.
        *   `themePages`: `Array<String>` - Available page types for the current theme.
        *   `suggestions`: `Array<String>` - Autocomplete tag suggestions.
        *   `confirm`: `Boolean` - Controls visibility of delete confirmation buttons.
*   **`newerVersion`**
    *   **Data Type**: `Boolean`
    *   **Description**: `true` if an unsaved version of the page exists in local storage.
*   **`autoURL`**
    *   **Data Type**: `Boolean`
    *   **Description**: `true` if the URL should be automatically generated from the title. Set to `false` if the user manually edits the URL.

#### 3.4.2 `$scope` Methods

*   **`localVersion()`**
    *   **Description**: Reverts the page data to the version stored in local storage and clears local storage.
    *   **Parameters**: None
    *   **Returns**: `void`
*   **`deleteNewerVersion()`**
    *   **Description**: Discards the unsaved version of the page by clearing relevant local storage items.
    *   **Parameters**: None
    *   **Returns**: `void`
*   **`deletePage()`**
    *   **Description**: Deletes the current page and all its associated data (revisions, extras, tags) from the backend.
    *   **Parameters**: None
    *   **Returns**: `void`
*   **`updatePageType()`**
    *   **Description**: Updates the `Page` factory's `type` property and broadcasts a `settingsGet` event.
    *   **Parameters**: None
    *   **Returns**: `void`
*   **`titleChange()`**
    *   **Description**: Updates `Page.title` and, if `autoURL` is true, generates a URL slug from the title.
    *   **Parameters**: None
    *   **Returns**: `void`
*   **`descriptionChange()`**
    *   **Description**: Updates `Page.description`.
    *   **Parameters**: None
    *   **Returns**: `void`
*   **`urlChange()`**
    *   **Description**: Updates `Page.url` and sets `autoURL` to `false`.
    *   **Parameters**: None
    *   **Returns**: `void`
*   **`saveLocal()`**
    *   **Description**: Saves the current `$scope.page` data to local storage.
    *   **Parameters**: None
    *   **Returns**: `void`
*   **`autocompleteTags()`**
    *   **Description**: Queries the backend for tag suggestions based on the last entered tag fragment.
    *   **Parameters**: None
    *   **Returns**: `void`
*   **`selectSuggestion(tag)`**
    *   **Description**: Replaces the last tag fragment with the selected suggestion from autocomplete.
    *   **Parameters**:
        *   `tag`: `String` - The selected tag suggestion.
    *   **Returns**: `void`
*   **`savePage(duplicate)`**
    *   **Description**: Saves the page data to the backend. Handles new page creation, existing page updates, and duplication. Manages revisions, extras, and tags.
    *   **Parameters**:
        *   `duplicate`: `Boolean` - If `true`, saves the current page as a new, duplicated page.
    *   **Returns**: `void`

---

## 4. Usage Documentation

This section provides guidance on how to use the `pageCtrl` and its associated factories within the Angular.js application.

### 4.1 Attaching the Controller to the View

The `pageCtrl` is attached to the `page.html` template using the `ng-controller` directive:

```html
<div ng-controller="pageCtrl">
    <!-- ... UI elements bound to $scope.page and controller methods ... -->
</div>
```

### 4.2 Initializing Page Data

The `pageCtrl` automatically initializes its `$scope.page` object from the `Page` factory. For an existing page, the `Page` factory would typically be populated by a preceding route resolver or another service that fetches page data based on `$routeParams.url`. For a new page (when `$location.path() === '/new'`), the `Page` factory would contain default empty values.

### 4.3 Common Use Cases and Patterns

#### 4.3.1 Creating a New Page

1.  Navigate to the `/new` route (e.g., `/admin/pages/new`).
2.  The `pageCtrl` initializes with empty page data.
3.  Fill in the `title`, `description`, `type`, and `tags`. The `url` will auto-generate from the title.
4.  Click the "Save" button.
5.  The controller validates inputs, sends a `POST` request to `api/content`, and then saves revisions, tags, and extras.
6.  Upon success, a notification appears, and the user is redirected to the newly created page's URL.

#### 4.3.2 Editing an Existing Page

1.  Navigate to an existing page's edit route (e.g., `/admin/pages/about-us`).
2.  The `Page` factory is populated with the existing page's data (assumed to be done by a parent controller or route resolver).
3.  The `pageCtrl` initializes `$scope.page` from the `Page` factory.
4.  Make changes to any fields.
5.  Click the "Save" button.
6.  The controller validates inputs, sends a `PUT` request to `api/content/:contentID`, and then updates revisions, tags, and extras.
7.  Upon success, a notification appears.

#### 4.3.3 Duplicating a Page

1.  While editing an existing page, click the "Duplicate" button.
2.  The controller performs the same save logic as creating a new page, but uses the current page's data as the basis.
3.  A validation check ensures the duplicated page has a different URL than the original.

#### 4.3.4 Deleting a Page

1.  Click the "Delete" button.
2.  A confirmation prompt appears.
3.  Click "Yes" to confirm deletion.
4.  The controller sends multiple `DELETE` requests to remove the page and all its associated data.
5.  Upon success, a notification appears, and the user is redirected to the `/new` page path.

#### 4.3.5 Handling Unsaved Changes

If a user navigates away or closes the browser with unsaved changes, upon returning to the same page:

1.  A "Newer Version" warning will appear at the top of the editor.
2.  **Discard**: Click "Discard" to ignore the local changes and load the last saved version from the backend.
3.  **Compare/Use**: Click "Compare" or "Use" (both trigger `localVersion()`) to load the local storage version into the editor. The user can then review and save these changes.

### 4.4 Example Code Snippets

#### 4.4.1 Saving a Page

```javascript
// Inside pageCtrl.js, the savePage function handles this:
$scope.savePage = function(duplicate) {
    // ... validation logic ...

    // Data to be sent to the backend
    var pageData = {
        title: $scope.page.title,
        description: $scope.page.description,
        header: Page.header, // From Page factory
        subheader: Page.subheader, // From Page factory
        featured: Page.extras.featured ? Page.extras.featured.src : null,
        body: Page.body, // From Page factory
        url: $scope.page.url,
        type: $scope.page.type,
        published: $scope.page.publish,
        published_date: scheduleDate, // Calculated based on publish status
        author: Users.id // From Users factory
    };

    if ($location.path() === '/new' || duplicate) {
        // Create new page
        REST.content.save(pageData, function(data) {
            // Success callback: handle new ID, save tags, revisions, extras
            // ... (newPagePromise, saveRevisionPromise, saveExtrasPromise) ...
        }, function(error) {
            // Error callback
            $translate('page_error_saving').then(function(translatedText) {
                $rootScope.$broadcast('notify', { message: translatedText, classes: 'alert-error' });
            });
        });
    } else {
        // Update existing page
        REST.content.update(angular.extend({ contentID: Page.id }, pageData), function(data) {
            // Success callback: delete old tags/extras, save new ones, save revision
            // ... (updatePagePromise, savePageRevisionPromise, deleteTagsPromise, deleteExtrasPromise) ...
        }, function(error) {
            // Error callback
            $translate('page_error_updating').then(function(translatedText) {
                $rootScope.$broadcast('notify', { message: translatedText, classes: 'alert-error' });
            });
        });
    }
};
```

#### 4.4.2 Deleting a Page

```javascript
// Inside pageCtrl.js
$scope.deletePage = function() {
    // Delete the main content
    REST.content.delete({ contentID: $scope.page.id }, function(data) {
        $translate('deleted').then(function(translatedText) {
            $rootScope.$broadcast('notify', { message: translatedText });
        });
    });

    // Delete associated data (revisions, extras, tags)
    REST.contentRevisions.delete({ contentID: $scope.page.id });
    REST.contentRevisionsExtras.delete({ contentID: $scope.page.id });
    REST.contentExtras.delete({ contentID: $scope.page.id });
    REST.contentTags.delete({ contentID: $scope.page.id });

    // Redirect after deletion
    $location.path('new');
};
```

---

## 5. Accessibility Features

The `page.html` template incorporates several standard HTML elements and Angular directives that contribute to accessibility.

*   **Semantic HTML Elements**:
    *   `<label>` elements are correctly associated with their corresponding input fields using the `for` attribute (e.g., `<label for="type">`). This allows screen readers to announce the purpose of an input field when it receives focus.
    *   `type="text"`, `type="radio"`, `type="datetime-local"` are used for appropriate input types, providing semantic meaning to assistive technologies.
    *   `<textarea>` and `<select>` are used for multi-line text input and dropdown selection, respectively.

*   **Keyboard Navigation**:
    *   Standard HTML input elements inherently support keyboard navigation (Tab to move focus, Space/Enter to activate buttons, arrow keys for radio buttons/select options).
    *   The `ng-click` directives on `<a>` and `<button>` elements ensure that these interactive elements are focusable and actionable via keyboard.

*   **Focus Management**:
    *   While explicit programmatic focus management is not extensively shown, the use of standard HTML elements and Angular's binding ensures that focus generally follows user interaction.
    *   The `ng-show` directives for elements like `new-version` and `schedule-triangle` ensure that hidden content is not accessible to screen readers until it becomes visually available.

*   **Internationalization (`translate` directive)**:
    *   The `translate` directive (e.g., `<p translate="page_newer"></p>`) indicates that the text content is subject to translation. This is crucial for users who rely on assistive technologies in languages other than the default, making the interface understandable to a broader audience.

### Potential Accessibility Enhancements:

*   **ARIA Attributes for Dynamic Content**:
    *   For the `tag-suggestions` div, consider `role="listbox"` and `aria-labelledby` or `aria-describedby` to associate it with the tags input. Individual suggestions could use `role="option"`.
    *   When `ng-show` changes visibility of important sections (like the `new-version` warning or confirmation prompts), consider using `aria-live="polite"` on a container element to announce changes to screen reader users.
*   **Keyboard Interaction for Autocomplete**: Ensure that the tag suggestions list is fully navigable by keyboard (e.g., arrow keys to move between suggestions, Enter to select). This might require custom directives or more advanced Angular accessibility patterns.
*   **Error Handling**: When validation errors occur (e.g., "page_no_url"), ensure they are clearly communicated to screen readers, perhaps by associating error messages with the relevant input fields using `aria-describedby` and `aria-invalid`.

---

## 6. Conclusion

The provided Angular.js code demonstrates a well-structured and functional frontend for a content management system's page editor.

**Benefits and Value:**

*   **Modularity**: The separation of concerns into `REST`, `Page`, and `Users` factories, along with the `pageCtrl` controller, promotes a modular and maintainable codebase.
*   **Centralized Data Management**: The `Page` and `Users` factories act as singletons, ensuring consistent data access and state management across the application, reducing potential for data inconsistencies.
*   **Robust Backend Integration**: The `REST` factory, built on `$resource`, simplifies complex API interactions, making it easy to perform CRUD operations on various content types.
*   **User-Friendly Features**: Features like dynamic URL generation, tag autocomplete, unsaved changes detection, and publishing/scheduling options significantly enhance the user experience for content creators.
*   **Data Integrity and Versioning**: The implementation of content revisions and extras ensures that historical data is preserved, providing a safety net for content changes.
*   **Internationalization Support**: The use of `$translate` prepares the application for multi-language support, broadening its potential user base.

**Contribution to Overall User Experience:**

This component is critical for the content management workflow. It empowers users to efficiently create, modify, and publish web pages with a rich set of features, contributing directly to the ease of content creation and the overall quality of the website managed by the system. The attention to detail, such as unsaved changes warnings and comprehensive deletion, enhances user confidence and prevents data loss.

**Best Practices for Implementation:**

*   **Consistent Error Handling**: While notifications are present, consider more granular error handling for specific API calls to provide more precise feedback to the user.
*   **Input Validation**: Client-side validation is present, but robust server-side validation is also crucial to prevent invalid data from being persisted.
*   **Performance Optimization**: For very large pages or extensive tag lists, consider debouncing input events for autocomplete or saving to local storage to prevent excessive function calls.
*   **Testability**: The modular design makes the factories and controller highly testable. Unit tests for each factory and controller method would ensure long-term stability.
*   **Modernization**: While functional, this code is based on AngularJS (1.x). For new development, migrating to a modern framework like React or Angular (2+) would offer improved performance, developer experience, and access to a larger ecosystem of tools and libraries. This would involve a significant rewrite but would align with current frontend development standards.

### Tokens: {'input_tokens': 6484, 'output_tokens': 17809, 'reasoning_tokens': 2008}
### Execution time: 52.73493790626526
