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
# Technical Documentation: Page Management Module in AngularJS Application

This documentation provides a comprehensive overview of the provided AngularJS code, which implements a page management module for a content management system (CMS)-like application. The module handles the creation, editing, duplication, and deletion of pages, integrating with a RESTful backend for data persistence. It uses AngularJS factories for data storage and REST communication, a controller for business logic, and an HTML template for the user interface.

The documentation is structured according to the specified steps, focusing on technical accuracy, completeness, and clarity for developers familiar with AngularJS (version 1.x). Key concepts include dependency injection, $resource for API interactions, $scope for data binding, and event broadcasting via $rootScope.

## 1. Comprehensive Technical Documentation

### Architecture Overview
The module is built on AngularJS principles:
- **Factories**: `REST`, `Page`, and `Users` provide shared services for API interactions and data storage.
- **Controller**: `pageCtrl` manages the page editing logic, handling user inputs, validation, and API calls.
- **Template**: `page.html` defines the UI for page details, using Angular directives like `ng-model`, `ng-click`, `ng-show`, and `ng-repeat`.
- **Dependencies**: Relies on AngularJS core modules (`$resource`, `$location`, `$rootScope`, `$routeParams`, `$upload`, `$translate`), and assumes a backend API with endpoints like `/api/content/:contentID`.

The module supports features like auto-generating URLs from titles, tag autocompletion, scheduling publications, local storage for unsaved changes, and revision history. Data is persisted via REST calls, with support for extras (custom fields) and tags.

### Key Implementation Details
- **Data Flow**: User inputs bind to `$scope.page` via `ng-model`. Changes trigger updates to the `Page` factory. Saves invoke REST resources to create/update content, revisions, extras, and tags.
- **Error Handling**: Uses promise callbacks for API errors, broadcasting notifications via `$rootScope.$broadcast('notify', ...)`.
- **Localization**: Integrates with `$translate` for multilingual support.
- **Routing**: Uses `$location` and `$routeParams` for URL-based navigation (e.g., `/new` for new pages).
- **Local Storage**: Persists unsaved changes to detect and handle newer versions.
- **Promises and Callbacks**: API operations use chained promises (e.g., save content → save revision → save extras).

Potential Improvements: Add unit tests with Karma/Jasmine, handle API rate limiting, and enhance error recovery.

## 2. Component Overview

### Introduction
The Page Management Module is a core component of a web-based CMS application built with AngularJS. It enables users to create, edit, duplicate, and delete content pages, managing metadata like titles, descriptions, URLs, tags, and publication status. The module interacts with a RESTful backend to persist data, supports content revisions for versioning, and includes UI elements for intuitive editing.

### Key Functionality and Architectural Role
- **Core Functions**: Page creation/editing, URL auto-generation, tag autocompletion, publication scheduling, duplicate detection, revision saving, and deletion (including cascading deletes for revisions, extras, and tags).
- **Architectural Role**: Acts as a single-page application (SPA) feature, integrating with global services (`Page`, `Users`) for state management. It broadcasts events (e.g., `contentGet`, `settingsGet`) to synchronize with other modules. Fits into a larger app with themes, menus, and user management.
- **Fit Within Broader Application**: This module is likely part of an admin panel for content authoring. It depends on theme data (e.g., available page types) and user authentication (via `Users`). Outputs updated content that can be rendered in frontend views.

## 3. Detail All Component Features

### Feature List and Descriptions
1. **Page Creation and Editing**
   - **Description**: Allows creating new pages or editing existing ones, including metadata like title, description, URL, type, tags, and publication status.
   - **Technical Implementation**: Binds form inputs to `$scope.page` in `pageCtrl`. On save, constructs a payload and calls `REST.content.save` or `REST.content.update`. Handles new pages via `/new` route.
   - **Dependencies**: `REST` factory, `Page` factory for state, `$translate` for messages.

2. **URL Auto-Generation**
   - **Description**: Automatically generates a URL slug from the page title for new pages.
   - **Technical Implementation**: In `$scope.titleChange()`, replaces spaces with hyphens, lowercases, and removes punctuation. Sets `autoURL` flag to control behavior.
   - **Dependencies**: None beyond core AngularJS.

3. **Tag Autocompletion**
   - **Description**: Suggests existing tags as the user types.
   - **Technical Implementation**: Uses `ng-list` on input; `$scope.autocompleteTags()` queries `REST.contentTags` with the last tag. Displays suggestions via `ng-repeat` and handles selection with `$scope.selectSuggestion()`.
   - **Dependencies**: `REST` factory.

4. **Publication Scheduling**
   - **Description**: Supports immediate publish, draft, or scheduled publication with date picker.
   - **Technical Implementation**: Radio buttons toggle `page.publish`. For scheduling, parses date with `Date.parse()` and adjusts publish status if backdated. Saves timestamp in Unix format.
   - **Dependencies**: HTML5 `datetime-local` input.

5. **Local Storage for Unsaved Changes**
   - **Description**: Detects and allows reverting to unsaved versions from previous sessions.
   - **Technical Implementation**: Checks `localStorage` on load; shows UI for discard/compare/use. `$scope.localVersion()` restores and clears storage; broadcasts `contentGet`.
   - **Dependencies**: Browser `localStorage`.

6. **Page Duplication**
   - **Description**: Creates a copy of the current page with a new URL.
   - **Technical Implementation**: Calls `$scope.savePage(true)`; validates URL uniqueness before saving as new content.
   - **Dependencies**: Same as creation/editing.

7. **Page Deletion**
   - **Description**: Deletes the page, revisions, extras, and tags with confirmation.
   - **Technical Implementation**: Confirms via `page.confirm`; cascades deletes using multiple `REST` calls (e.g., `REST.content.delete`, `REST.contentRevisions.delete`).
   - **Dependencies**: `REST` factory.

8. **Revision and Extras Management**
   - **Description**: Automatically saves revisions on updates; handles custom "extras" fields.
   - **Technical Implementation**: After save/update, creates revisions via `REST.contentRevisions.save`. Deletes/saves extras/tags in callbacks. Stringifies objects/arrays with `angular.toJson`.
   - **Dependencies**: `Page.extras` object.

9. **Notification and Redirection**
   - **Description**: Shows success/error messages and redirects post-save/delete.
   - **Technical Implementation**: Broadcasts `notify` events; uses `$location.path()` for redirects.
   - **Dependencies**: `$rootScope`, `$location`.

## 4. Document Interface Specifications

### Factory Interfaces
The factories expose objects with properties/methods. Below are tables for key interfaces.

#### REST Factory
Provides $resource-wrapped API endpoints.

| Name | Data Type | Description | Required/Optional |
|------|-----------|-------------|-------------------|
| blocks | Object ($resource) | Resource for /api/blocks/:blockID (GET, POST, PUT, DELETE) | Optional |
| blocksRequirements | Object ($resource) | Resource for block requirements | Optional |
| comments | Object ($resource) | Resource for comments | Optional |
| content | Object ($resource) | Resource for /api/content/:contentID (core page data) | Required |
| contentExtras | Object ($resource) | Resource for page extras | Required |
| contentRevisions | Object ($resource) | Resource for revisions | Required |
| contentRevisionsExtras | Object ($resource) | Resource for revision extras | Required |
| contentTags | Object ($resource) | Resource for page tags | Required |
| files | Object ($resource) | Resource for files | Optional |
| filesTags | Object ($resource) | Resource for file tags | Optional |
| menus | Object ($resource) | Resource for menus | Optional |
| modules | Object ($resource) | Resource for modules | Optional |
| sitemaps | Object ($resource) | Resource for sitemaps | Optional |
| themes | Object ($resource) | Resource for themes | Optional |
| settings | Object ($resource) | Resource for settings | Optional |
| users | Object ($resource) | Resource for users | Optional |

- **Return Values**: Each resource returns promise-based methods (e.g., `save()`, `update()`, `query()`, `delete()`).

#### Page Factory
Stores global page data.

| Name | Data Type | Description | Required/Optional |
|------|-----------|-------------|-------------------|
| id | Number | Page ID | Required |
| title | String | Page title | Required |
| description | String | Meta description | Optional |
| header | String | Page header | Optional |
| subheader | String | Page subheader | Optional |
| body | String | Page body content | Optional |
| url | String | Page URL slug | Required |
| type | String | Page type (from theme) | Required |
| published | String | Publication status ('Y', 'N', 'schedule') | Required |
| published_date | Number | Unix timestamp for publish date | Optional |
| themePages | Array<String> | Available page types from theme | Required |
| timestamp | String | Last update timestamp | Optional |
| extras | Object | Custom extra fields (e.g., {featured: {src: 'url'}}) | Optional |
| misc | Object | Miscellaneous data | Optional |

- **Return Values**: Returns the object itself for injection.

#### Users Factory
Stores user data.

| Name | Data Type | Description | Required/Optional |
|------|-----------|-------------|-------------------|
| id | String | User ID | Required |
| username | String | Username | Required |
| name | String | Full name | Optional |
| bio | String | Biography | Optional |
| email | String | Email | Optional |
| facebook | String | Facebook URL | Optional |
| twitter | String | Twitter URL | Optional |
| photo | String | Profile photo URL | Optional |
| role | String | User role | Optional |

- **Return Values**: Returns the object itself.

### Controller Interface (pageCtrl)
Injected dependencies and $scope properties.

| Name | Data Type | Description | Required/Optional |
|------|-----------|-------------|-------------------|
| $scope.page | Object | Mirrors Page factory properties, bound to UI | Required |
| $scope.newerVersion | Boolean | Flag for unsaved local changes | Optional |
| $scope.savePage(duplicate: Boolean) | Function | Saves or duplicates page | Required |
| $scope.deletePage() | Function | Deletes page | Required |
| $scope.localVersion() | Function | Reverts to local version | Optional |
| $scope.deleteNewerVersion() | Function | Discards local version | Optional |
| $scope.updatePageType() | Function | Updates page type and broadcasts | Required |
| $scope.titleChange() | Function | Handles title changes and URL auto-gen | Required |
| $scope.descriptionChange() | Function | Updates description | Required |
| $scope.urlChange() | Function | Updates URL | Required |
| $scope.autocompleteTags() | Function | Queries tag suggestions | Required |
| $scope.selectSuggestion(tag: String) | Function | Adds suggested tag | Required |

- **Return Values**: None; side-effects include API calls and broadcasts.
- **Events Broadcast**: `contentGet`, `settingsGet`, `notify`.

## 5. Provide Usage Documentation

### Sample Code
To use this module, include it in your AngularJS app and route to the template.

```javascript
// app.js (main module)
angular.module('cosmo', ['ngResource', 'ngRoute', 'pascalprecht.translate'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/:url', {
      templateUrl: 'page.html',
      controller: 'pageCtrl'
    }).when('/new', {
      templateUrl: 'page.html',
      controller: 'pageCtrl'
    });
  }]);
```

### Common Use Cases
1. **Creating a New Page**:
   - Navigate to `/new`.
   - Fill form; save triggers `REST.content.save` and redirects to new URL.

2. **Editing Existing Page**:
   - Navigate to `/:url` (e.g., `/about`).
   - Changes auto-save to localStorage; on save, updates via `REST.content.update`.

3. **Scheduling Publication**:
   - Select "schedule" radio; pick date. Save computes timestamp and status.

### Initialization Requirements
- Inject factories into controllers as needed (e.g., `['$scope', 'REST', 'Page', ...]`).
- Populate `Page.themePages` from theme data before use.
- Ensure backend API is available and authenticated.

## 6. Document Accessibility Features

The provided HTML template includes basic accessibility support, but enhancements are recommended.

### ARIA Roles and Attributes Implemented
- **None Explicitly**: The template lacks ARIA attributes like `aria-label`, `aria-describedby`, or roles (e.g., `role="button"` on custom buttons).
- **Implicit Support**: Uses semantic HTML elements (e.g., `<label for="id">` pairs with inputs, `<select>`, `<textarea>`), which assistive technologies like screen readers can interpret.

### Support for Assistive Technologies
- **Labels and Placeholders**: Labels are linked via `for` attributes, and placeholders provide context, aiding screen readers (e.g., VoiceOver, NVDA).
- **Character Counts**: `<span class="num-count">` displays lengths for title/description, but lacks ARIA live regions for dynamic updates.
- **Suggestions List**: Tag suggestions use `<a>` elements in a `<div>`, navigable via tab; could be improved with `role="listbox"` and `aria-autocomplete`.

### Keyboard Navigation and Focus Management
- **Tab Navigation**: Standard form elements (inputs, buttons, select) are tab-focusable. Custom elements like radio labels use `ng-click` but lack `tabindex="0"` for keyboard activation.
- **Focus Management**: No explicit `$scope.$apply` or focus directives; relies on Angular's digest cycle. Radio buttons use `ng-class` for visual feedback but not ARIA `aria-checked`.
- **Recommendations**: Add `tabindex`, `aria-live` for dynamic content (e.g., suggestions), and ensure keyboard shortcuts for actions like delete confirmation.

Overall, the module is partially accessible but should be audited with tools like WAVE or axe for full WCAG compliance.

## 7. Conclusion

The Page Management Module offers robust, feature-rich content editing capabilities, streamlining CMS workflows with automated features like URL generation and revisions. Its benefits include efficient data persistence, user-friendly interfaces, and extensibility via extras/tags, enhancing productivity for content creators.

It contributes significantly to the overall user experience by providing intuitive controls, real-time feedback (e.g., tag suggestions), and safeguards (e.g., local storage recovery), resulting in a reliable admin tool.

**Best Practices for Implementation**:
- Validate all user inputs server-side to prevent security issues.
- Use promises consistently for async operations to avoid callback hell.
- Test across browsers, especially for `datetime-local` support.
- Extend with ngAria module for better accessibility.
- Monitor performance for large extras objects during serialization.

### Tokens: {'input_tokens': 5553, 'output_tokens': 3255, 'reasoning_tokens': 249}
### Execution time: 50.587733030319214
