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
Okay, here is the technical documentation for the provided AngularJS code snippets, focusing on the page management functionality within the 'cosmo' application.

---

## Technical Documentation: Cosmo Page Management Module

### 1. Overall System Overview

This documentation describes a core feature of the 'cosmo' AngularJS application: **Page Management**. This module allows users to create, read, update, and delete content pages within the application.

It comprises several key components working together:

1.  **`REST` Factory (`rest.js`):** A centralized service responsible for all communication with the backend RESTful API. It uses Angular's `$resource` service to define endpoints for various data entities, including pages (content), users, themes, settings, etc.
2.  **`Page` Factory (`page.js`):** A simple state management service holding the data for the *currently active* page being viewed or edited. This allows different components (like the controller and potentially directives) to share and react to changes in the page data.
3.  **`Users` Factory (`users.js`):** Similar to the `Page` factory, this service holds information about the currently logged-in user.
4.  **`pageCtrl` Controller (`pageCtrl.js`):** The main controller managing the logic for the page editing view. It interacts with the `REST` factory to fetch and save data, uses the `Page` and `Users` factories for state, handles user input, performs validations, manages local storage for unsaved changes, and updates the view.
5.  **`page.html` Template:** The HTML view associated with `pageCtrl`. It defines the user interface for editing page details, including forms, buttons, and data display, using AngularJS directives for data binding and event handling.

These components follow a common AngularJS pattern: the Controller orchestrates interactions between the View (`page.html`), backend services (`REST`), and shared application state (`Page`, `Users`).

---

### 2. `REST` Factory (`rest.js`)

#### 2.1. Overview

The `REST` factory serves as the primary Data Access Layer for the frontend application. It encapsulates all interactions with the backend API endpoints using Angular's `$resource` service. This centralizes API communication, making it easier to manage, update, and test.

#### 2.2. Key Functionality

*   **Resource Definition:** Defines `$resource` objects for various application entities (e.g., `blocks`, `comments`, `content`, `files`, `users`, `settings`).
*   **Endpoint Mapping:** Maps frontend resource actions (like `query`, `get`, `save`, `delete`, `update`) to specific backend API URLs and HTTP methods.
*   **Parameter Handling:** Configures URL parameters (e.g., `:contentID`) and maps them to data properties (e.g., `{ contentID: '@contentID' }`).
*   **Custom Actions:** Defines custom actions like `update` using the `PUT` HTTP method, which is not included by default in `$resource` prior to Angular 1.1.3.

#### 2.3. Interface Specification

The factory returns an object where each key corresponds to a specific API resource. Each resource object provides standard `$resource` methods (`$query`, `$get`, `$save`, `$delete`) and any custom actions defined (like `$update`).

| Property                 | Resource URL                                                    | Parameters                                | Custom Actions       | Description                                                                 |
| :----------------------- | :-------------------------------------------------------------- | :---------------------------------------- | :------------------- | :-------------------------------------------------------------------------- |
| `blocks`                 | `api/blocks/:blockID`                                           | `blockID: '@blockID'`                     | `update: {method:'PUT'}` | Manages content blocks.                                                     |
| `blocksRequirements`     | `api/blocks/:blockID/requirements/:requirementID`               | `blockID: '@blockID', requirementID: '@requirementID'` | `update: {method:'PUT'}` | Manages requirements associated with blocks.                                |
| `comments`               | `api/comments/:commentID`                                       | `commentID: '@commentID'`                 | `update: {method:'PUT'}` | Manages comments.                                                           |
| **`content`**            | **`api/content/:contentID`**                                    | **`contentID: '@contentID'`**             | **`update: {method:'PUT'}`** | **Manages main page content (Used extensively by `pageCtrl`).**             |
| **`contentExtras`**      | **`api/content/:contentID/extras/`**                            | **`contentID: '@contentID'`**             |                      | **Manages additional/custom data fields associated with content.**          |
| **`contentRevisions`**   | **`api/content/:contentID/revisions/:revisionID`**              | **`contentID: '@contentID', revisionID: '@revisionID'`** | **`update: {method:'PUT'}`** | **Manages historical revisions of content.**                                |
| **`contentRevisionsExtras`** | **`api/content/:contentID/revisions/:revisionID/extras/:extraID`** | **`revisionID: '@revisionID', contentID: '@contentID', extraID: '@extraID'`** |                      | **Manages extra data associated with specific content revisions.**          |
| **`contentTags`**        | **`api/content/:contentID/tags/`**                              | **`contentID: '@contentID'`**             |                      | **Manages tags associated with content.**                                   |
| `files`                  | `api/files/:fileID`                                             | `fileID: '@fileID'`                       | `update: {method:'PUT'}` | Manages file uploads.                                                       |
| `filesTags`              | `api/files/:fileID/tag/:tag`                                    | `fileID: '@fileID', tag: '@tag'`          | `update: {method:'PUT'}` | Manages tags associated with files.                                         |
| `menus`                  | `api/menus/:menuID`                                             | `menuID: '@menuID'`                       | `update: {method:'PUT'}` | Manages navigation menus.                                                   |
| `modules`                | `api/modules/:moduleID`                                         | `moduleID: '@moduleID'`                   | `update: {method:'PUT'}` | Manages application modules.                                                |
| `sitemaps`               | `api/sitemaps/`                                                 |                                           |                      | Accesses sitemap generation/data.                                           |
| `themes`                 | `api/themes/:themeID`                                           | `themeID: '@themeID'`                     | `update: {method:'PUT'}` | Manages application themes.                                                 |
| `settings`               | `api/settings/`                                                 | `{}`                                      | `update: {method:'PUT'}` | Manages global application settings.                                        |
| `users`                  | `api/users/:userID`                                             | `userID: '@userID'`                       | `update: {method:'PUT'}` | Manages user accounts.                                                      |

*(Properties relevant to `pageCtrl` are highlighted in bold)*

#### 2.4. Usage Example (within another component like `pageCtrl`)

```javascript
angular.module('cosmo').controller('someCtrl', ['REST', function(REST) {
    // Get content with ID 123
    REST.content.get({ contentID: 123 }, function(data) {
        console.log('Content data:', data);
    });

    // Save new content
    const newPageData = { title: 'New Page', body: '<p>Hello</p>', url: '/new-page', /* ... */ };
    REST.content.save(newPageData, function(savedData) {
        console.log('Saved content:', savedData);
    });

    // Update content with ID 456
    const updatedPageData = { contentID: 456, title: 'Updated Title' };
    REST.content.update(updatedPageData, function(response) {
        console.log('Update response:', response);
    });

    // Delete content with ID 789
    REST.content.delete({ contentID: 789 }, function(response) {
        console.log('Delete response:', response);
    });
}]);
```

#### 2.5. Dependencies

*   `angular.module('cosmo')`
*   `ngResource` (`$resource`)
*   `Page` (Injected but not directly used within the factory definition itself. May indicate an intended pattern or leftover code.)

---

### 3. `Page` Factory (`page.js`)

#### 3.1. Overview

The `Page` factory acts as a simple, singleton service to hold the state of the page currently being edited or viewed. It provides a shared object that controllers and potentially other components can inject to access and modify page data consistently across the application without relying solely on scope inheritance or event broadcasting for all state changes.

#### 3.2. Key Functionality

*   **State Holding:** Stores properties related to a single page (e.g., `id`, `title`, `description`, `url`, `type`, `tags`, `extras`).
*   **Data Sharing:** Allows different parts of the application (primarily controllers) to access and modify the *same* page data object.
*   **Initialization:** Provides default values for page properties.

#### 3.3. Interface Specification

The factory returns a plain JavaScript object.

| Property         | Data Type | Description                                                                 | Required/Optional |
| :--------------- | :-------- | :-------------------------------------------------------------------------- | :---------------- |
| `id`             | Number    | The unique identifier of the page (0 for a new page).                       | Required          |
| `title`          | String    | The main title of the page (often used for `<title>` tag).                  | Optional          |
| `description`    | String    | The meta description of the page.                                           | Optional          |
| `header`         | String    | Primary heading content within the page body (e.g., H1).                    | Optional          |
| `subheader`      | String    | Secondary heading content within the page body (e.g., H2).                  | Optional          |
| `body`           | String    | The main HTML content of the page.                                          | Optional          |
| `url`            | String    | The URL slug/path for the page.                                             | Required (on save)|
| `type`           | String    | The template or type identifier for the page (maps to a theme file).        | Required (on save)|
| `published`      | String    | Publish status ('Y' = Yes, 'N' = No/Draft, 'schedule' = Scheduled).         | Optional          |
| `published_date` | String/Number | Timestamp or date string indicating when the page was/will be published. | Optional          |
| `themePages`     | Array     | List of available page types/templates provided by the current theme.       | Optional          |
| `timestamp`      | String    | Last modified timestamp (usage context unclear from snippet).               | Optional          |
| `extras`         | Array/Object | Container for additional, non-standard page data (key-value pairs).       | Optional          |
| `misc`           | Object    | A generic object for miscellaneous data (usage context unclear).            | Optional          |
| `tags`           | Array     | (Implicitly used by `pageCtrl`) An array of strings representing page tags. | Optional          |
| `scheduleDate`   | Date/Number | (Implicitly used by `pageCtrl`) The date/time for scheduled publishing.   | Optional          |

*(Note: `tags` and `scheduleDate` are managed by `pageCtrl` and stored within the `Page` service, although not explicitly initialized in the factory definition provided).*

#### 3.4. Usage Example

```javascript
// In Controller A
angular.module('cosmo').controller('ControllerA', ['Page', function(Page) {
    Page.title = 'Setting Title Here';
    Page.id = 123;
}]);

// In Controller B (or a directive)
angular.module('cosmo').controller('ControllerB', ['Page', function(Page) {
    console.log('Current Page Title:', Page.title); // Outputs: 'Setting Title Here'
    console.log('Current Page ID:', Page.id);     // Outputs: 123
}]);
```

#### 3.5. Dependencies

*   `angular.module('cosmo')`

---

### 4. `Users` Factory (`users.js`)

#### 4.1. Overview

Similar to the `Page` factory, the `Users` factory is a singleton service that holds state information about the currently authenticated user. This allows various parts of the application to easily access user details like ID, name, role, etc.

#### 4.2. Key Functionality

*   **State Holding:** Stores properties related to the logged-in user.
*   **Data Sharing:** Provides a central place to access user information.

#### 4.3. Interface Specification

The factory returns a plain JavaScript object.

| Property   | Data Type | Description                               | Required/Optional |
| :--------- | :-------- | :---------------------------------------- | :---------------- |
| `id`       | String/Number | The unique identifier of the user.        | Optional          |
| `username` | String    | The user's login name.                    | Optional          |
| `name`     | String    | The user's display name.                  | Optional          |
| `bio`      | String    | A short biography of the user.            | Optional          |
| `email`    | String    | The user's email address.                 | Optional          |
| `facebook` | String    | Link to the user's Facebook profile.      | Optional          |
| `twitter`  | String    | Link to the user's Twitter profile.       | Optional          |
| `photo`    | String    | URL to the user's profile picture.        | Optional          |
| `role`     | String    | The user's role or permission level.      | Optional          |

#### 4.4. Usage Example

```javascript
angular.module('cosmo').controller('someCtrl', ['Users', 'REST', function(Users, REST) {
    function saveContent() {
        const pageData = {
            // ... other page data
            author: Users.id // Get the current user's ID
        };
        REST.content.save(pageData);
    }
}]);
```

#### 4.5. Dependencies

*   `angular.module('cosmo')`

---

### 5. `pageCtrl` Controller & `page.html` Template

#### 5.1. Overview

`pageCtrl` is the controller responsible for managing the page creation and editing interface defined in `page.html`. It acts as the intermediary between the user interface, the backend API (via the `REST` factory), and the shared application state (via the `Page` and `Users` factories). It handles data binding, user actions (saving, deleting, duplicating), validation, state synchronization, and interaction with local storage for unsaved changes.

#### 5.2. Component Features (`pageCtrl`)

*   **Initialization:**
    *   Populates the local `$scope.page` object with data from the injected `Page` factory.
    *   Sets default values, particularly for the `scheduleDate`.
    *   Retrieves available page types (`themePages`) from the `Page` factory.
    *   Checks `localStorage` for unsaved changes from previous sessions for the current page URL (`newerVersion` flag).
*   **Unsaved Changes Management:**
    *   `localVersion()`: Restores page data from `localStorage` into the `Page` factory and clears the stored data. Broadcasts `contentGet` to update components.
    *   `deleteNewerVersion()`: Clears the unsaved data from `localStorage`.
*   **Page CRUD Operations:**
    *   `savePage(duplicate)`:
        *   Handles both creating new pages (`/new` path or `duplicate=true`) and updating existing ones.
        *   Performs validation checks (e.g., page type selected, non-empty/unique URL).
        *   Determines the correct `published` status and `published_date` based on user selection (Publish Now, Draft, Schedule).
        *   Constructs the data payload, including basic fields, author ID (from `Users` factory), and featured image URL (from `Page.extras`).
        *   Calls `REST.content.save` or `REST.content.update`.
        *   Uses a promise/callback chain (`newPagePromise`, `updatePagePromise`, etc.) to handle sequential saving of:
            *   Main content data.
            *   Content tags (`REST.contentTags`).
            *   Content revision (`REST.contentRevisions`).
            *   Extra content data (`REST.contentExtras`).
            *   Extra revision data (`REST.contentRevisionsExtras`).
        *   Handles deletion of old tags/extras before saving new ones during updates.
        *   Provides user feedback via `$rootScope.$broadcast('notify', ...)` using translated messages (`$translate`).
        *   Redirects using `$location.path()` upon successful creation/duplication.
    *   `deletePage()`:
        *   Requires confirmation (`$scope.page.confirm`).
        *   Calls `REST.content.delete` for the main content.
        *   Calls `REST.contentRevisions.delete`, `REST.contentRevisionsExtras.delete`, `REST.contentExtras.delete`, and `REST.contentTags.delete` to clean up related data.
        *   Provides user feedback and redirects to the `/new` page.
*   **Data Synchronization & Local State:**
    *   `updatePage()`: Function to sync `$scope.page` from the `Page` factory. Called initially and on `$scope.$on('contentGet', ...)`.
    *   `titleChange()`, `descriptionChange()`, `urlChange()`, `updatePageType()`: Update the `Page` factory service when corresponding form fields change in the view.
    *   `titleChange()` includes logic (`autoURL`) to auto-generate a URL slug from the title for *new* pages only.
    *   `saveLocal()`: Persists current form state (`$scope.page`) and relevant `Page` factory properties to `localStorage`, keyed by the page URL (`$routeParams.url`). *Note: The trigger for calling `saveLocal` is not shown but is likely tied to input changes or intervals.*
*   **Tag Management:**
    *   `autocompleteTags()`: Fetches tag suggestions based on the last typed tag using `REST.contentTags.query`.
    *   `selectSuggestion()`: Updates the `$scope.page.tags` array when a suggestion is clicked.
*   **UI Logic:**
    *   Manages the visibility of elements based on state (e.g., `newerVersion` banner, delete confirmation buttons, schedule date input).
    *   Handles navigation clicks (back button, close button).

#### 5.3. Interface Specification (`pageCtrl` Scope & Dependencies)

*   **Scope Properties (`$scope`):**
    *   `page`: (Object) Holds the data bound to the form fields in `page.html`. Mirrors structure from `Page` factory but is used for direct view binding (e.g., `page.title`, `page.description`, `page.url`, `page.type`, `page.tags`, `page.publish`, `page.scheduleDate`, `page.themePages`, `page.suggestions`, `page.confirm`).
    *   `newerVersion`: (Boolean) Flag indicating if a newer, unsaved version exists in local storage.
    *   `autoURL`: (Boolean) Flag controlling automatic URL generation from the title.
    *   `admin`: (Object - likely inherited) Used for controlling sidebar visibility (`admin.sidebar`) and closing the admin panel (`admin.showAdminPanel`, `admin.active`).
*   **Scope Methods (`$scope`):**
    *   `localVersion()`: Function to load local storage version.
    *   `deleteNewerVersion()`: Function to discard local storage version.
    *   `deletePage()`: Function to delete the current page.
    *   `savePage(duplicate)`: Function to save or duplicate the page.
    *   `updatePageType()`: Function called when page type changes.
    *   `titleChange()`: Function called on title input keyup.
    *   `descriptionChange()`: Function called on description textarea keyup.
    *   `urlChange()`: Function called on URL input keyup.
    *   `saveLocal()`: Function to save current state to local storage.
    *   `autocompleteTags()`: Function to fetch tag suggestions.
    *   `selectSuggestion(tag)`: Function to apply a selected tag suggestion.
*   **Dependencies:**
    *   `$scope`: Angular scope service.
    *   `REST`: Custom factory for API calls.
    *   `$location`: Angular service for URL interaction/navigation.
    *   `Page`: Custom factory for current page state.
    *   `$rootScope`: Angular root scope for broadcasting events (`notify`).
    *   `$routeParams`: Angular service to access URL parameters (like the current page's URL for local storage keying).
    *   `$upload`: Angular service for file uploads (injected but *not used* in the provided `pageCtrl` snippet).
    *   `Users`: Custom factory for current user state.
    *   `$translate`: Service for internationalization.

#### 5.4. Usage Documentation (`page.html`)

*   **Implementation:** This template is typically loaded via Angular's routing mechanism (e.g., `ngRoute` or `ui-router`) and associated with `pageCtrl`.
    ```html
    <!-- Example Route Definition (Conceptual) -->
    <!-- $routeProvider.when('/:url*', { templateUrl: 'path/to/page.html', controller: 'pageCtrl' }); -->

    <div ng-controller="pageCtrl">
        <!-- Template content as provided -->
        <!-- ... -->
    </div>
    ```
*   **Key Directives Used:**
    *   `ng-controller="pageCtrl"`: Attaches the controller.
    *   `ng-show`: Conditionally displays elements (e.g., `newerVersion` banner, confirmation buttons, schedule input).
    *   `ng-click`: Binds button/link clicks to controller methods (e.g., `savePage()`, `deletePage()`, `localVersion()`).
    *   `ng-model`: Provides two-way data binding between form inputs/selects/textareas and `$scope.page` properties (e.g., `page.title`, `page.description`, `page.url`, `page.type`, `page.tags`, `page.publish`, `page.scheduleDate`).
    *   `ng-options`: Populates the `<select>` element for page type based on `$scope.page.themePages`.
    *   `ng-change`: Calls controller methods when input values change (e.g., `updatePageType()`, `autocompleteTags()`).
    *   `ng-keyup`: Calls controller methods on key release events (e.g., `titleChange()`, `descriptionChange()`, `urlChange()`).
    *   `ng-list`: Converts comma-separated input string into an array for `$scope.page.tags`.
    *   `ng-repeat`: Iterates over `$scope.page.suggestions` to display tag suggestions.
    *   `ng-class`: Conditionally applies CSS classes (e.g., `active` class on publish radio buttons).
    *   `translate`: Directive (from `angular-translate`) to display localized text based on translation keys (e.g., `translate="page_details"`).
    *   Custom Filters: `themeFiles`, `titlecase` (implementations not provided, but used in expressions).

#### 5.5. Accessibility Features (`page.html`)

*   **Labels:** Uses `<label>` elements associated with form controls (`input`, `textarea`, `select`) via the `for` attribute or by wrapping, which is good for screen readers.
*   **Semantic Elements:** Uses standard HTML elements like `<button>`, `<input>`, `<select>`, `<textarea>`, `<h1>`, `<p>`, `<a>` which have inherent accessibility semantics.
*   **Keyboard Navigation:** Standard form controls and links (`<button>`, `<input>`, `<select>`, `<a>`) are generally keyboard accessible by default. Focus order should follow the visual layout.
*   **Potential Improvements / Considerations:**
    *   **ARIA Attributes:** No explicit ARIA roles or properties (e.g., `aria-live` for notifications, `aria-invalid` for validation, `aria-describedby` for complex inputs) are used in the snippet. Adding these could enhance accessibility, especially for dynamic updates and error states.
    *   **Focus Management:** When elements appear/disappear (`ng-show`), ensure focus is managed logically. For example, when the delete confirmation appears, focus should ideally move to the "Yes" or "No" button. When tag suggestions appear, managing focus for selection might be needed.
    *   **Button Text:** Buttons rely on the `translate` directive for their accessible name. Ensure translation keys provide clear, concise action descriptions.
    *   **Color Contrast:** Ensure sufficient color contrast for text, UI elements, and focus indicators (defined in CSS, not shown).
    *   **Custom Select (`cos-select`):** If the `div.cos-select` implements a custom dropdown widget, it needs proper ARIA attributes (`role="combobox"`, `aria-expanded`, etc.) and keyboard interaction patterns to be accessible.

---

### 6. Conclusion

This Page Management module provides a comprehensive interface for content creation and editing within the 'cosmo' application.

*   **Benefits:**
    *   **Modularity:** Separates concerns into distinct factories (data access, state) and a controller (logic), promoting maintainability.
    *   **Centralized API:** The `REST` factory simplifies backend communication.
    *   **Shared State:** `Page` and `Users` factories provide reliable state sharing.
    *   **Rich Functionality:** Includes essential CRUD operations, revision history, tagging, scheduling, unsaved changes recovery, and URL management.
    *   **Internationalization:** Uses `angular-translate` for UI text.
*   **Contribution:** It forms a critical part of the content management capabilities of the application, directly impacting the user's ability to manage the website's content.
*   **Best Practices:**
    *   Leverages AngularJS services (`$resource`, factories) effectively.
    *   Uses data binding (`ng-model`) for form interactions.
    *   Implements basic unsaved changes handling via `localStorage`.
    *   Consider enhancing accessibility with appropriate ARIA attributes and focus management, especially for dynamic UI sections.
    *   Ensure robust error handling in API callbacks beyond simple notifications.
    *   The trigger mechanism for `saveLocal` should be clearly defined and efficient (e.g., using debouncing on input changes).

### Tokens: {'input_tokens': 6477, 'output_tokens': 8648}
### Execution time: 91.51392412185669
