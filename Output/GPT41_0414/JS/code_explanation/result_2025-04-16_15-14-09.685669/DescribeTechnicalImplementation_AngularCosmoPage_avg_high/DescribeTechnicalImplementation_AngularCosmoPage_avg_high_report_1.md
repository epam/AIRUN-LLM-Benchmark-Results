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
# Technical Documentation: AngularJS Page Management Module

---

## 1. Component Overview

### Introduction

This documentation covers the **Page Management Module** of an AngularJS application, which provides a comprehensive interface for creating, editing, duplicating, and deleting content pages. The module is designed to interact with a RESTful backend, manage page state, and facilitate user interactions for content management.

### Key Functionality & Architectural Role

- **RESTful Communication**: Abstracts backend API calls for content, tags, revisions, and related resources.
- **State Management**: Uses AngularJS factories to maintain global state for pages and users.
- **User Interface**: Provides a form-driven UI for page editing, including title, description, tags, URL, type, and publishing options.
- **Local Storage Integration**: Supports draft persistence and recovery using browser localStorage.
- **Tag Autocompletion**: Suggests tags based on user input and backend data.
- **Revision Management**: Handles page versioning and revision history.
- **Accessibility**: Implements standard HTML form controls, with translation support for internationalization.

### Architectural Fit

This module is central to the application's content management system (CMS) functionality. It acts as the primary interface for editors and administrators to manage site content, leveraging AngularJS's dependency injection, two-way data binding, and modular architecture.

---

## 2. Component Features

### 2.1 REST Factory (`REST`)

- **Purpose**: Provides a unified interface for all RESTful API endpoints.
- **Implementation**: Uses AngularJS's `$resource` service to define endpoints for blocks, content, comments, files, menus, modules, sitemaps, themes, settings, and users.
- **Features**:
  - CRUD operations for each resource.
  - Custom `update` method using HTTP PUT.
  - Parameterized URLs for resource identification.

### 2.2 Page Factory (`Page`)

- **Purpose**: Maintains the current page's state across the application.
- **Implementation**: Returns a singleton object with properties for all page attributes (id, title, description, etc.).
- **Features**:
  - Global state management for page editing.
  - Stores extras and miscellaneous data.

### 2.3 Users Factory (`Users`)

- **Purpose**: Stores information about the current user.
- **Implementation**: Singleton object with user attributes (id, username, email, etc.).
- **Features**:
  - Provides user context for content operations (e.g., authoring).

### 2.4 Page Controller (`pageCtrl`)

- **Purpose**: Orchestrates the page editing workflow.
- **Implementation**: AngularJS controller managing form state, REST interactions, and UI logic.
- **Features**:
  - Initializes page data from the `Page` factory.
  - Handles local draft recovery and deletion.
  - Manages CRUD operations for pages and related resources.
  - Implements tag autocompletion and selection.
  - Handles publishing, scheduling, and revision management.
  - Provides user feedback via notifications and translations.

### 2.5 Page Editor UI (`page.html`)

- **Purpose**: Presents the page editing form to the user.
- **Implementation**: AngularJS template with data binding, event handlers, and translation support.
- **Features**:
  - Form fields for all page attributes.
  - Tag input with autocompletion.
  - Publishing controls (publish, draft, schedule).
  - Action buttons for save, duplicate, delete, and discard changes.
  - Conditional UI for unsaved drafts and confirmation dialogs.

---

## 3. Interface Specifications

### 3.1 REST Factory Endpoints

| Name                    | Data Type   | Description                                      | Required/Optional |
|-------------------------|-------------|--------------------------------------------------|-------------------|
| blocks                  | $resource   | CRUD for blocks                                  | Optional          |
| blocksRequirements      | $resource   | CRUD for block requirements                      | Optional          |
| comments                | $resource   | CRUD for comments                                | Optional          |
| content                 | $resource   | CRUD for content pages                           | Required          |
| contentExtras           | $resource   | CRUD for content extras                          | Optional          |
| contentRevisions        | $resource   | CRUD for content revisions                       | Optional          |
| contentRevisionsExtras  | $resource   | CRUD for revision extras                         | Optional          |
| contentTags             | $resource   | CRUD for content tags                            | Optional          |
| files                   | $resource   | CRUD for files                                   | Optional          |
| filesTags               | $resource   | CRUD for file tags                               | Optional          |
| menus                   | $resource   | CRUD for menus                                   | Optional          |
| modules                 | $resource   | CRUD for modules                                 | Optional          |
| sitemaps                | $resource   | CRUD for sitemaps                                | Optional          |
| themes                  | $resource   | CRUD for themes                                  | Optional          |
| settings                | $resource   | CRUD for settings                                | Optional          |
| users                   | $resource   | CRUD for users                                   | Optional          |

### 3.2 Page Factory Properties

| Name           | Data Type   | Description                        | Required/Optional |
|----------------|-------------|------------------------------------|-------------------|
| id             | Number      | Unique page identifier             | Required          |
| title          | String      | Page title                         | Required          |
| description    | String      | Page description                   | Optional          |
| header         | String      | Page header                        | Optional          |
| subheader      | String      | Page subheader                     | Optional          |
| body           | String      | Page body/content                  | Optional          |
| url            | String      | Page URL slug                      | Required          |
| type           | String      | Page type/template                 | Required          |
| published      | String      | Publish status ('Y', 'N', 'schedule') | Required      |
| published_date | String/Date | Publish or schedule date           | Optional          |
| themePages     | Array       | Available page types/templates     | Required          |
| timestamp      | String      | Last modified timestamp            | Optional          |
| extras         | Object/Array| Additional page data               | Optional          |
| misc           | Object      | Miscellaneous data                 | Optional          |

### 3.3 Users Factory Properties

| Name      | Data Type | Description           | Required/Optional |
|-----------|-----------|-----------------------|-------------------|
| id        | String    | User ID               | Required          |
| username  | String    | Username              | Required          |
| name      | String    | Full name             | Optional          |
| bio       | String    | User biography        | Optional          |
| email     | String    | Email address         | Required          |
| facebook  | String    | Facebook profile      | Optional          |
| twitter   | String    | Twitter handle        | Optional          |
| photo     | String    | Profile photo URL     | Optional          |
| role      | String    | User role             | Required          |

### 3.4 Page Controller Scope Properties

| Name             | Data Type   | Description                                 | Required/Optional |
|------------------|-------------|---------------------------------------------|-------------------|
| page             | Object      | Current page data (see Page factory)        | Required          |
| newerVersion     | Boolean     | Indicates if a newer local draft exists     | Optional          |
| autoURL          | Boolean     | Auto-generate URL from title                | Optional          |
| page.suggestions | Array       | Tag suggestions for autocompletion          | Optional          |
| page.confirm     | Boolean     | Delete confirmation state                   | Optional          |

### 3.5 Controller Methods

| Name                | Parameters         | Returns   | Description                                      |
|---------------------|-------------------|-----------|--------------------------------------------------|
| localVersion        | none              | void      | Restores local draft from localStorage           |
| deleteNewerVersion  | none              | void      | Discards local draft                             |
| deletePage          | none              | void      | Deletes the current page and related data        |
| updatePageType      | none              | void      | Updates the page type and triggers settings load |
| titleChange         | none              | void      | Updates title and auto-generates URL             |
| descriptionChange   | none              | void      | Updates description in Page factory              |
| urlChange           | none              | void      | Updates URL in Page factory                      |
| saveLocal           | none              | void      | Saves current page state to localStorage         |
| autocompleteTags    | none              | void      | Fetches tag suggestions from backend             |
| selectSuggestion    | tag (String)      | void      | Selects a tag from suggestions                   |
| savePage            | duplicate (Bool)  | void      | Saves or updates the page, handles revisions     |

---

## 4. Usage Documentation

### 4.1 Initialization

Ensure the following AngularJS modules and dependencies are loaded:

- `ngResource` (for `$resource`)
- `ngRoute` (for `$routeParams`)
- `pascalprecht.translate` (for `$translate`)
- `ngFileUpload` (for `$upload`, if file uploads are used)

Register the factories and controller in your main module:

```js
angular.module('cosmo', ['ngResource', 'ngRoute', 'pascalprecht.translate', 'ngFileUpload'])
  .factory('REST', [...])
  .factory('Page', [...])
  .factory('Users', [...])
  .controller('pageCtrl', [...]);
```

### 4.2 Sample Usage

#### HTML Template

```html
<div ng-controller="pageCtrl">
    <!-- Newer version notification -->
    <div class="new-version form-case" ng-show="newerVersion">
        <p translate="page_newer"></p>
        <button class="btn-error" type="button" ng-click="deleteNewerVersion()" translate="discard"></button>
        <button class="btn-options" type="button" ng-click='localVersion()' translate="compare"></button>
        <button class="btn-success" type="button" ng-click='localVersion()' translate="use"></button>
    </div>
    <!-- Page editor form -->
    <div class="pg-editor form-case">
        <label translate="title"></label>
        <input type='text' ng-model="page.title" ng-keyup="titleChange()" placeholder="Page Title">
        <!-- ... other fields ... -->
        <button type="button" class="btn-success" ng-click="savePage()" translate="save"></button>
    </div>
</div>
```

#### Controller Usage

- **Create New Page**: Navigate to `/new`, fill out the form, and click "Save".
- **Edit Existing Page**: Navigate to `/edit/:url`, modify fields, and click "Save".
- **Duplicate Page**: Click "Duplicate" to create a copy with a new URL.
- **Delete Page**: Click "Delete" and confirm.

#### Tag Autocompletion

- Enter tags in the tag input field.
- Suggestions appear as you type; click a suggestion to select.

#### Local Draft Recovery

- If a local draft exists (e.g., after a browser crash), a notification appears.
- Use "Use", "Compare", or "Discard" to manage the draft.

### 4.3 Common Patterns

- **Two-way Data Binding**: All form fields are bound to `$scope.page` properties.
- **RESTful Operations**: Use `REST.content.save`, `REST.content.update`, etc., for backend communication.
- **State Synchronization**: Update the `Page` factory to reflect changes across the app.

---

## 5. Accessibility Features

### ARIA Roles and Attributes

- **Form Controls**: Standard HTML `<input>`, `<select>`, and `<textarea>` elements are used, which are natively accessible.
- **Labels**: All form fields have associated `<label>` elements, improving screen reader support.
- **Button Roles**: `<button>` elements are used for all actions, ensuring keyboard accessibility.
- **Translation**: The `translate` attribute is used for all user-facing text, supporting internationalization and screen readers.

### Assistive Technology Support

- **Screen Readers**: Proper labeling and form structure ensure compatibility.
- **Keyboard Navigation**: All interactive elements (inputs, buttons) are focusable and operable via keyboard.
- **Focus Management**: No explicit focus management is implemented, but standard tab order is preserved.

### Recommendations

- Consider adding ARIA attributes (e.g., `aria-label`, `aria-live`) for dynamic notifications.
- Ensure color contrast and visual cues for focus states in CSS.

---

## 6. Conclusion

### Benefits and Value

- **Robust Content Management**: Enables editors to efficiently create, edit, and manage site content.
- **User-Friendly**: Draft recovery, tag autocompletion, and revision management enhance usability.
- **Extensible Architecture**: Modular factories and REST abstraction facilitate future enhancements.
- **Accessible and Internationalized**: Supports a wide range of users and locales.

### Contribution to User Experience

- **Reliability**: Local draft storage prevents data loss.
- **Efficiency**: Autocompletion and revisioning streamline content workflows.
- **Clarity**: Immediate feedback and clear UI reduce user errors.

### Best Practices

- **Keep Factories Singleton**: Do not instantiate factories per controller; rely on AngularJS's singleton pattern.
- **Validate Inputs**: Ensure all required fields are validated before saving.
- **Handle Errors Gracefully**: Use `$translate` and notification broadcasts for user feedback.
- **Maintain Accessibility**: Regularly audit UI for accessibility compliance.

---

**End of Documentation**

### Tokens: {'input_tokens': 5581, 'output_tokens': 2887, 'reasoning_tokens': 0}
### Execution time: 70.82513689994812
