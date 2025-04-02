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
### Thoughts:
Let's analyze the provided code files to create comprehensive technical documentation for this Angular.js application.

## Overview of Files

1. `rest.js`: Angular factory for RESTful API communication
2. `page.html`: HTML template for the page editor component
3. `page.js`: Factory for storing page data globally
4. `users.js`: Factory for storing current user data
5. `pageCtrl.js`: Controller for page creation and editing functionality

These components seem to be part of a content management system (CMS) called "cosmo" that handles page creation, editing, and management.

Let's break down each file to understand its functionality and role:

### REST Factory (`rest.js`)
- Creates an Angular factory service that provides resource objects for RESTful API communication
- Uses Angular's `$resource` service to interact with various API endpoints
- Each resource is defined with URLs, parameters, and custom methods (particularly PUT updates)
- Endpoints include blocks, comments, content, files, menus, users, themes, settings, etc.

### Page Factory (`page.js`)
- A simple global data store for page-related data
- Contains properties for page metadata and content
- Serves as a shared state container across the application

### Users Factory (`users.js`)
- Similar to Page factory, stores user information globally
- Contains properties for user profile data

### Page Template (`page.html`)
- The UI for page editing functionality
- Contains form fields for page title, description, URL, etc.
- Includes publish/draft/schedule options
- Shows local version recovery options
- Contains delete/duplicate/save actions

### Page Controller (`pageCtrl.js`)
- Controller that handles all page editing functionality
- Initializes the page form with data from the Page factory
- Handles saving pages (new or updates)
- Manages versions (local storage for drafts)
- Handles deletion functionality
- Provides URL generation from title
- Tag autocompletion

## Key Features and Functionality

1. **Content Management**:
   - Create, edit, delete, and duplicate pages
   - Manage page metadata (title, description, URL)
   - Set publish status (published, draft, scheduled)

2. **Version Management**:
   - Local storage for unsaved changes
   - Recovery of previous drafts
   - Comparison between versions

3. **REST API Integration**:
   - Communication with backend services
   - Resource-based API approach
   - Handling of complex nested resources

4. **Tag Management**:
   - Adding/removing tags to content
   - Tag autocompletion from existing tags

5. **Media Management**:
   - Featured image handling
   - File uploads

6. **URL Management**:
   - Automatic URL generation from title
   - Custom URL option

Now let's create comprehensive documentation based on this analysis.

### Answer:
# Technical Documentation: Content Page Management System

## 1. Component Overview

The Cosmo CMS Page Management component is an AngularJS-based system for creating, editing, and managing web content pages. This module provides a comprehensive interface for content editors to manage page metadata, content, publishing status, and related assets.

The component follows a Model-View-Controller (MVC) architecture using AngularJS's built-in patterns, with additional factory services for maintaining global application state and handling REST API communication. It serves as a core part of the CMS's content authoring experience.

## 2. Architecture and Components

### 2.1 Factory Services

#### REST Factory (`rest.js`)
A service that provides RESTful API communication through Angular's `$resource`. Acts as a centralized data access layer for all backend API endpoints.

```javascript
// Example usage:
REST.content.get({ contentID: 123 }, function(data) {
    // Handle successful response
});
```

| Resource | Description | Endpoints |
|----------|------------|-----------|
| blocks | Block content management | GET, POST, PUT, DELETE |
| content | Page content management | GET, POST, PUT, DELETE |
| contentRevisions | Version history for content | GET, POST, PUT, DELETE |
| contentTags | Tag management for content | GET, POST, DELETE |
| contentExtras | Additional metadata for content | GET, POST, DELETE |
| files | File asset management | GET, POST, PUT, DELETE |
| users | User account management | GET, POST, PUT, DELETE |
| settings | System settings | GET, PUT |
| themes | Theme management | GET, POST, PUT, DELETE |

#### Page Factory (`page.js`)
A singleton service that stores the current page's data globally across the application, functioning as a shared state container.

```javascript
// Key properties
{
    id: 0,                 // Page ID
    title: '',             // Page title/headline
    description: '',       // Meta description
    header: '',            // Page header content
    subheader: '',         // Page subheader
    body: '',              // Main page content
    url: '',               // Page URL/slug
    type: '',              // Page template type
    published: '',         // Publishing status
    published_date: '',    // Timestamp for publishing
    themePages: [],        // Available page templates
    extras: []             // Additional custom fields
}
```

#### Users Factory (`users.js`)
Stores information about the currently authenticated user, making it accessible throughout the application.

```javascript
// Key properties
{
    id: '',                // User ID
    username: '',          // Username
    name: '',              // Display name
    email: '',             // Email address
    photo: '',             // Profile photo
    role: ''               // User role/permissions
}
```

### 2.2 Page Controller (`pageCtrl.js`)

The controller manages all page editing functionality including:
- Initializing the page editor with current data
- Handling form input changes and validation
- Auto-generating URLs from titles
- Tag autocompletion
- Local draft storage and recovery
- Creating, updating, duplicating, and deleting pages
- Managing page revisions

## 3. Technical Features

### 3.1 Page Editing

The system provides a complete interface for editing page properties through a form-based UI that binds directly to the Page factory.

**Implementation details:**
- Two-way data binding between the form and the global Page object
- Real-time validation and character counting
- Automated URL generation with manual override option
- Draft auto-saving to browser localStorage

```javascript
// Auto-generate URL from title
$scope.titleChange = function(){
    Page.title = $scope.page.title;
    if($scope.autoURL){
        $scope.page.url = $scope.page.title.toLowerCase()
            .replace(/ /g, '-')
            .replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
        Page.url = $scope.page.url;
    }
};
```

### 3.2 Version Management

The component implements a versioning system with two distinct approaches:

1. **Browser-based draft recovery:**
   - Unsaved changes are stored in localStorage
   - Users can recover, compare, or discard unsaved versions
   - Prevents data loss during session interruptions

2. **Server-side revision history:**
   - Full page revisions stored in the database
   - Each save creates a new revision record
   - All page elements including extras are versioned

```javascript
// Check for locally saved drafts
var elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
if($location.path() !== '/new'){ 
    angular.forEach(elements, function(value){
        if(localStorage.getItem($routeParams.url + value) !== Page[value] && 
           localStorage.getItem($routeParams.url + value) !== 'null')
            $scope.newerVersion = true;
    });
}
```

### 3.3 Publishing Workflow

The system supports three publishing states:

1. **Published:** Content is live and accessible
2. **Draft:** Content is saved but not publicly visible
3. **Scheduled:** Content will automatically publish at a specified date/time

**Implementation details:**
- Date/time picker for scheduling
- Server-side timestamp handling for scheduled content
- Support for backdating content

```javascript
// Publishing status handling
if($scope.page.publish === 'Y' && Page.publish === 'Y')
    scheduleDate = Page.scheduleDate;
else if($scope.page.publish === 'Y')
    scheduleDate = Math.round(+new Date().getTime()/1000);
else if($scope.page.publish === 'schedule'){
    scheduleDate = Date.parse($scope.page.scheduleDate).getTime()/1000;
    // Check if this is back dated
    if(Date.parse($scope.page.scheduleDate).getTime() < Math.round(+new Date().getTime()))
        $scope.page.publish = 'Y';
    else
        $scope.page.publish = 'N';
}
```

### 3.4 Tag Management

The system provides tag management with intelligent autocompletion:

- Tags can be added as comma-separated values
- Tag suggestions appear based on existing tags in the system
- Real-time API queries for tag matching
- One-click tag selection from suggestions

```javascript
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
```

### 3.5 Extended Metadata ("Extras")

The system supports arbitrary additional metadata fields:

- Custom fields stored as key-value pairs in `Page.extras`
- JSON serialization for complex data types (arrays/objects)
- Revisioning of all extras alongside the main content
- Separate API endpoints for extras management

```javascript
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
        });
    }
}
```

## 4. API Interface

### 4.1 Page Controller Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `titleChange()` | None | Updates Page.title and optionally generates URL |
| `descriptionChange()` | None | Updates Page.description |
| `urlChange()` | None | Updates Page.url manually |
| `updatePageType()` | None | Updates the page template type |
| `savePage()` | `duplicate` (Boolean) | Saves the page, optionally as a duplicate |
| `deletePage()` | None | Deletes the current page and related data |
| `localVersion()` | None | Recovers locally saved draft version |
| `deleteNewerVersion()` | None | Discards locally saved draft version |
| `autocompleteTags()` | None | Queries for tag suggestions |
| `selectSuggestion()` | `tag` (String) | Selects a tag from autocomplete list |

### 4.2 REST API Endpoints

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `api/content/:contentID` | GET, POST, PUT, DELETE | Main page content |
| `api/content/:contentID/revisions/:revisionID` | GET, POST, PUT, DELETE | Page revisions |
| `api/content/:contentID/extras/` | GET, POST, DELETE | Page metadata |
| `api/content/:contentID/tags/` | GET, POST, DELETE | Page tags |
| `api/content/:contentID/revisions/:revisionID/extras/:extraID` | GET, POST, DELETE | Revision metadata |

## 5. Usage Examples

### 5.1 Creating a New Page

```javascript
// Initialize the Page factory
angular.module('app').run(['Page', function(Page) {
    Page.title = '';
    Page.description = '';
    Page.url = '';
    Page.type = 'default';
    Page.publish = 'N';
    Page.extras = {};
}]);

// Redirect to new page in your navigation controller
$location.path('/new');
```

### 5.2 Editing an Existing Page

```javascript
// Load page data in your route resolver
angular.module('app').config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/:url/edit', {
        templateUrl: 'path/to/page.html',
        controller: 'pageCtrl',
        resolve: {
            pageData: ['$route', 'REST', 'Page', function($route, REST, Page) {
                return REST.content.get({url: $route.current.params.url}).$promise
                    .then(function(data) {
                        // Populate Page factory with retrieved data
                        Page.id = data.id;
                        Page.title = data.title;
                        Page.description = data.description;
                        Page.url = data.url;
                        Page.type = data.type;
                        Page.publish = data.published;
                        // And other properties...
                        
                        return data;
                    });
            }]
        }
    });
}]);
```

## 6. Accessibility Considerations

The current implementation includes the following accessibility features:

- Form labels are properly associated with input fields
- Error messaging for validation issues
- Internationalization support through Angular translate (`$translate`)

For improved accessibility, the following enhancements are recommended:

- Add appropriate ARIA roles and attributes to interactive elements
- Implement keyboard navigation for the tag suggestion component
- Add descriptive texts for screen readers, particularly for form validation

## 7. Conclusion

The Cosmo CMS Page Management system provides a robust solution for content editing with several key advantages:

- **Comprehensive Content Management:** Full control over page content, metadata, and publication status
- **Intelligent Versioning:** Both client-side draft recovery and server-side revision history
- **Flexible Metadata:** Support for extended custom fields and tag management
- **User-Friendly Features:** URL auto-generation, tag autocompletion, and draft recovery

### Best Practices for Implementation

1. **State Management:** Use the Page factory as the single source of truth for page data
2. **Error Handling:** Implement comprehensive error handling for API interactions
3. **Performance:** Consider implementing debounce functions for real-time operations like tag autocompletion
4. **Caching:** Use appropriate caching strategies for frequently accessed data
5. **Validation:** Add client-side validation to complement server-side checks
6. **Internationalization:** Leverage the built-in translation system for all user-facing text

This component stands as a cornerstone of the content management experience, providing authors with the tools needed to efficiently create and manage website content while maintaining a structured approach to content organization.

### Tokens: {'input_tokens': 6969, 'output_tokens': 3650}
### Execution time: 61.31349802017212
