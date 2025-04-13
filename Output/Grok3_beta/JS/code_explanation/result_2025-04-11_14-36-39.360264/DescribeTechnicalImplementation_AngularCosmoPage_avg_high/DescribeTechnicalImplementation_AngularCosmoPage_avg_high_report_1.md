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
# Technical Documentation for Angular.js Page Management Module

## 1. Component Overview

### Introduction
The Page Management Module is a critical component of a content management system (CMS) built with Angular.js. This module is designed to facilitate the creation, editing, and management of web pages within the application. It provides a user-friendly interface for content creators to define page details, manage publication status, and interact with a RESTful backend for data persistence.

### Purpose and Architectural Role
The primary purpose of this module is to serve as the central hub for page-related operations. It integrates with a REST API to perform CRUD (Create, Read, Update, Delete) operations on page content, revisions, tags, and associated metadata. Architecturally, it follows the Angular.js factory and controller pattern to encapsulate data and logic, ensuring separation of concerns and reusability across the application. The module interacts with other components such as user management (`Users` factory) and translation services (`$translate`) to provide a cohesive user experience.

### Integration within the Application
This module fits into the broader application as the frontend interface for content management. It communicates with a backend API through the `REST` factory, which defines endpoints for various resources. It also leverages Angular's routing system (`$location` and `$routeParams`) to handle navigation and page-specific data retrieval, ensuring seamless transitions between creating new pages and editing existing ones.

## 2. Component Features

### Feature List and Descriptions
1. **Page Creation and Editing**
   - **Description**: Allows users to create new pages or edit existing ones with fields for title, description, URL, tags, and publication status.
   - **Implementation**: Utilizes the `Page` factory to store page data globally and the `pageCtrl` controller to manage user input and updates. Data is saved or updated via the `REST.content` and `REST.contentRevisions` services using HTTP methods (POST for creation, PUT for updates).
   - **Dependencies**: `$scope`, `REST`, `Page`, `$location`, `$routeParams`, `$translate`.

2. **URL Auto-Generation**
   - **Description**: Automatically generates a URL slug from the page title for new pages.
   - **Implementation**: The `titleChange` function in `pageCtrl` transforms the title into a URL-friendly format by converting spaces to hyphens and removing punctuation. This is only applied if the URL is not manually set.
   - **Dependencies**: `$scope`, `Page`.

3. **Tag Autocomplete**
   - **Description**: Provides suggestions for tags as users type, enhancing content categorization.
   - **Implementation**: The `autocompleteTags` function queries the `REST.contentTags` endpoint with the last entered tag to fetch suggestions, which are displayed in a dropdown for selection via `selectSuggestion`.
   - **Dependencies**: `$scope`, `REST`.

4. **Publication Status Management**
   - **Description**: Supports three publication states: Publish, Draft, and Schedule, with a date picker for scheduled publishing.
   - **Implementation**: Radio buttons in the UI (`page.html`) toggle the `publish` property in the `Page` factory. The `savePage` function in `pageCtrl` handles logic for setting publication dates based on the selected status.
   - **Dependencies**: `$scope`, `Page`.

5. **Local Storage for Unsaved Changes**
   - **Description**: Saves unsaved changes to local storage to prevent data loss and alerts users to newer versions.
   - **Implementation**: The `saveLocal` function stores page data in `localStorage` under keys specific to the page URL. The controller checks for discrepancies between stored and current data to display a "newer version" prompt.
   - **Dependencies**: `$scope`, `$routeParams`, `localStorage`.

6. **Page Deletion**
   - **Description**: Allows users to delete pages along with associated revisions, extras, and tags.
   - **Implementation**: The `deletePage` function in `pageCtrl` calls multiple `REST` endpoints to remove the page and related data, then redirects to a new page creation screen.
   - **Dependencies**: `$scope`, `REST`, `$location`, `$translate`.

7. **Duplicate Page Creation**
   - **Description**: Enables creating a duplicate of an existing page with a new URL.
   - **Implementation**: The `savePage` function with a `duplicate` parameter triggers a new page creation with the current page's data, ensuring a unique URL.
   - **Dependencies**: `$scope`, `REST`, `$location`, `$translate`.

### Requirements
- **Angular.js**: Version compatible with `$resource` for RESTful API interactions.
- **Backend API**: Must expose endpoints as defined in `rest.js` for content, revisions, tags, and extras.
- **Translation Service**: `$translate` for multilingual support in UI messages.

## 3. Interface Specifications

### REST Factory (`rest.js`)
| Name                     | Type       | Description                                      | Required/Optional |
|--------------------------|------------|--------------------------------------------------|-------------------|
| `blocks`                 | `$resource`| Endpoint for managing content blocks.            | Optional          |
| `blocksRequirements`     | `$resource`| Endpoint for block requirements.                 | Optional          |
| `comments`               | `$resource`| Endpoint for comments.                           | Optional          |
| `content`                | `$resource`| Endpoint for page content CRUD operations.       | Required          |
| `contentExtras`          | `$resource`| Endpoint for additional page data.               | Optional          |
| `contentRevisions`       | `$resource`| Endpoint for page revision history.              | Required          |
| `contentRevisionsExtras` | `$resource`| Endpoint for revision-specific extras.           | Optional          |
| `contentTags`            | `$resource`| Endpoint for page tags.                          | Optional          |
| `files`                  | `$resource`| Endpoint for file management.                    | Optional          |
| `filesTags`              | `$resource`| Endpoint for file tags.                          | Optional          |
| `menus`                  | `$resource`| Endpoint for menu management.                    | Optional          |
| `modules`                | `$resource`| Endpoint for module management.                  | Optional          |
| `sitemaps`               | `$resource`| Endpoint for sitemaps.                           | Optional          |
| `themes`                 | `$resource`| Endpoint for theme management.                   | Optional          |
| `settings`               | `$resource`| Endpoint for application settings.               | Optional          |
| `users`                  | `$resource`| Endpoint for user data.                          | Optional          |

**Return Values**: Each `$resource` object provides methods like `get`, `save`, `update`, and `delete` for interacting with the respective API endpoints, returning promises with response data.

### Page Factory (`Page`)
| Name             | Type   | Description                              | Required/Optional |
|------------------|--------|------------------------------------------|-------------------|
| `id`             | Number | Unique identifier for the page.          | Required          |
| `title`          | String | Page title.                              | Required          |
| `description`    | String | Page description.                        | Optional          |
| `header`         | String | Page header content.                     | Optional          |
| `subheader`      | String | Page subheader content.                  | Optional          |
| `body`           | String | Main page content.                       | Optional          |
| `url`            | String | Page URL slug.                           | Required          |
| `type`           | String | Page type or template.                   | Required          |
| `published`      | String | Publication status (Y/N/schedule).       | Required          |
| `published_date` | String | Date of publication.                     | Optional          |
| `themePages`     | Array  | Available page types for the theme.      | Required          |
| `timestamp`      | String | Last modified timestamp.                 | Optional          |
| `extras`         | Array  | Additional page metadata.                | Optional          |
| `misc`           | Object | Miscellaneous data.                      | Optional          |

**Return Values**: Returns an object with the above properties for global page state management.

### Users Factory (`Users`)
| Name       | Type   | Description                       | Required/Optional |
|------------|--------|-----------------------------------|-------------------|
| `id`       | String | User ID.                          | Required          |
| `username` | String | User's username.                  | Required          |
| `name`     | String | User's full name.                 | Optional          |
| `bio`      | String | User's biography.                 | Optional          |
| `email`    | String | User's email address.             | Optional          |
| `facebook` | String | User's Facebook profile.          | Optional          |
| `twitter`  | String | User's Twitter handle.            | Optional          |
| `photo`    | String | User's profile photo URL.         | Optional          |
| `role`     | String | User's role in the application.   | Optional          |

**Return Values**: Returns an object with user data for authentication and authorship tracking.

### Page Controller (`pageCtrl`)
| Name            | Type       | Description                                      | Required/Optional |
|-----------------|------------|--------------------------------------------------|-------------------|
| `$scope`        | Object     | Angular scope for binding data and functions.    | Required          |
| `REST`          | Service    | Factory for API interactions.                    | Required          |
| `$location`     | Service    | Angular service for URL manipulation.            | Required          |
| `Page`          | Factory    | Factory for page data storage.                   | Required          |
| `$rootScope`    | Service    | Root scope for broadcasting events.              | Required          |
| `$routeParams`  | Service    | Service for accessing URL parameters.            | Required          |
| `$upload`       | Service    | Service for file uploads (not used in code).     | Optional          |
| `Users`         | Factory    | Factory for user data.                           | Required          |
| `$translate`    | Service    | Service for internationalization.                | Required          |

**Return Values**: Manages UI interactions and data flow, no direct return values but updates `$scope` and `Page` factory.

## 4. Usage Documentation

### Sample Code
```javascript
// Initialize a new page in a controller
angular.module('cosmo').controller('newPageCtrl', ['$scope', 'Page', function($scope, Page) {
    $scope.page = {
        id: 0,
        title: '',
        description: '',
        url: '',
        publish: 'N',
        scheduleDate: new Date(),
        tags: [],
        type: Page.themePages[0] || ''
    };
}]);
```

### Common Use Cases
1. **Creating a New Page**:
   - Navigate to `/new` route.
   - Fill in page details (title, description, etc.) in the form.
   - Click "Save" to persist data via `REST.content.save`.

2. **Editing an Existing Page**:
   - Navigate to a specific page URL.
   - Modify fields as needed.
   - Click "Save" to update via `REST.content.update`.

3. **Scheduling a Page**:
   - Select "Schedule" radio button.
   - Set a future date using the datetime picker.
   - Save to set `published` based on the date.

### Initialization Requirements
- Ensure Angular.js and necessary modules (`ngResource`, `ngRoute`) are included.
- Configure backend API endpoints in `rest.js` to match server setup.
- Initialize `Page` and `Users` factories with default or fetched data if needed.

## 5. Accessibility Features

### ARIA Roles and Attributes
- **No Explicit ARIA Roles**: The provided HTML (`page.html`) does not include explicit ARIA roles or attributes. This is a potential area for improvement to enhance accessibility.
- **Labels and Inputs**: Form elements use `<label>` tags with `for` attributes linked to input IDs, providing basic accessibility for screen readers.

### Support for Assistive Technologies
- **Form Accessibility**: The use of `<label>` elements ensures that screen readers can associate labels with form controls, though additional ARIA attributes like `aria-required` could be added for clarity.
- **Missing Features**: There are no `aria-describedby` or `aria-invalid` attributes to indicate errors or provide additional context, which should be considered for future updates.

### Keyboard Navigation and Focus Management
- **Basic Navigation**: The UI supports keyboard navigation through standard HTML elements like `<input>`, `<select>`, and `<button>`, which are inherently focusable.
- **Improvement Needed**: There is no explicit focus management or custom keyboard shortcuts defined in the code. Adding `tabindex` attributes and handling focus programmatically could improve usability.

## 6. Conclusion

### Benefits and Value
The Page Management Module offers a robust solution for content creation and management within a CMS. Its integration with RESTful services ensures data persistence, while features like URL auto-generation and tag autocomplete streamline the user workflow. The ability to handle publication states and local storage for unsaved changes enhances reliability and user confidence.

### Contribution to User Experience
This module significantly contributes to the overall user experience by providing an intuitive interface for managing web content. The seamless interaction between frontend and backend, coupled with real-time feedback through notifications (via `$translate`), ensures users can create and edit content efficiently.

### Best Practices for Implementation
- **Validation**: Add client-side validation for required fields beyond basic checks to prevent API errors.
- **Accessibility**: Enhance ARIA support and keyboard navigation to meet WCAG standards.
- **Error Handling**: Implement comprehensive error handling for API calls to provide meaningful feedback to users.
- **Testing**: Write unit tests for controller functions and factories using Jasmine or Karma to ensure reliability.

This documentation provides a detailed guide for developers to understand, implement, and extend the Page Management Module, ensuring it meets both functional and accessibility requirements in a production environment.

### Tokens: {'input_tokens': 5552, 'output_tokens': 2886, 'reasoning_tokens': 0}
### Execution time: 36.59451603889465
