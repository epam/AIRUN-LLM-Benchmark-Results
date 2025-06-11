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
**Here's how I'm going to document this AngularJS application's page editor feature, based on the provided code:**

**Overview & Architecture:**  This feature allows users to create, edit, and manage web pages within this CMS-like application. It's built using the standard AngularJS (1.x) Model-View-Controller (MVC) pattern. The `pageCtrl` is the controller, the `page.html` is the view, and the `Page` factory (along with the data fetched from the backend) is the model. The key components are the `pageCtrl` (the logic), the `page.html` (the user interface), the `REST` factory (the API layer), and the `Page` and `Users` factories (for managing shared state).

**Component Breakdown & Functionality:**

*   **`REST` Factory:** This factory centralizes all API interactions. It uses AngularJS's `$resource` service to provide a clean abstraction for working with RESTful APIs. Think of it as a set of pre-configured "resource objects" corresponding to different API endpoints.  Each property (e.g., `blocks`, `content`, `users`) represents an endpoint.  It's set up to easily handle standard CRUD operations (GET, POST, DELETE) and custom actions, like `update`. The use of parameterized URLs (like `api/content/:contentID`) enables dynamic resource fetching.

*   **`Page` & `Users` Factories:**  These are global state management singletons. They hold shared data for the current page being edited and the current user, respectively.  They are simple factory functions that return a JavaScript object, allowing any component to inject these factories and access the state. This helps decouple components; the controller and other parts of the application have direct access to and can modify the current page's and user's information.

*   **`pageCtrl` Controller:**  This is the brain of the page editor. It's responsible for orchestrating the page editing logic:

    *   **Initialization:**  It begins by copying initial data from the `Page` factory into `$scope.page`. It also sets default values and checks `localStorage` for any unsaved changes from a previous editing session, displaying a warning if necessary.
    *   **Page Creation & Updating (`savePage`):** This is the core function.  It handles both creating new pages (often reached through the `/new` route or the `duplicate` functionality) and updating existing pages. It performs validation checks (URL and page type).  It then calculates the `published_date` based on whether the user wants to publish immediately, save as a draft, or schedule the page. The actual saving happens through the `REST.content` method (either `save` or `update`). A crucial part of this is the use of a chain of promises/callbacks (`newPagePromise`, `updatePagePromise`, and so on) to manage the sequential API calls: save the content, save tags, save revisions, and save additional data.
    *   **Page Deletion (`deletePage`):**  This uses a confirmation flag (`page.confirm`) displayed in the UI. When confirmed, multiple API calls are made to delete the content and associated data.
    *   **Local Version Management (`localVersion`, `deleteNewerVersion`):** It interacts with `localStorage` to either restore unsaved changes or discard them. It then broadcasts a `contentGet` event to signal to other components that the page has been updated.
    *   **Data Binding & Local State (various "Change" functions):** Functions are triggered by changes in the UI elements (using `ng-keyup` or `ng-change`).  They update the `Page` factory in real-time. For instance, `titleChange` includes logic for auto-generating a URL slug.
    *   **Tag Management:** Functions like `autocompleteTags` (that queries the backend as the user types) and `selectSuggestion` (to add selected tags to the list) are provided for a great user experience.
    *   **Inter-component Communication:** It broadcasts events (using `$rootScope.$broadcast`) to other parts of the application. These include `notify` (for user feedback), `contentGet` (to request a data refresh), and `settingsGet`. It also listens for `contentGet` using `$scope.$on` to refresh its own state.

**Interface Specifications:**

*   **`pageCtrl` Dependencies (Inputs):** I'll document all the services injected into the `pageCtrl` (like `$scope`, `REST`, `$location`, and `Page`) and explain their specific roles in the controller's logic.
*   **`REST` Factory Endpoints:** A detailed table will show each resource defined in the `rest.js` factory, including the resource name, the corresponding

### Answer:
Of course. Here is the comprehensive technical documentation for the provided AngularJS application code.

---

## Technical Documentation: Page Management Module

### 1. Overview

This document outlines the technical implementation of the Page Management module, a core feature of the Cosmo AngularJS application. This module provides a comprehensive interface for administrators and content creators to create, edit, manage, and delete web pages.

The architecture follows the classic AngularJS (1.x) Model-View-Controller (MVC) pattern. It is composed of a controller (`pageCtrl`), a view (`page.html`), a centralized API service (`REST` factory), and singleton factories for state management (`Page`, `Users`). This separation of concerns ensures a modular, maintainable, and testable codebase.

**Key Functionality:**
*   **CRUD Operations:** Full create, read, update, and delete functionality for page content.
*   **State Management:** Utilizes shared factories (`Page`, `Users`) to maintain global state for the current page and user, accessible across different application components.
*   **API Abstraction:** Centralizes all backend communication through a dedicated `REST` factory, which uses `$resource` for clean, declarative API interactions.
*   **Rich Content Editing:** Supports editing of title, description, URL slug, tags, and publication status.
*   **Draft Persistence:** Automatically saves unsaved work to the browser's `localStorage`, allowing users to recover changes after a session interruption.
*   **Content Versioning:** Creates a new revision of a page upon every save.
*   **Scheduling:** Allows content to be published at a future date and time.

---

### 2. Component & Feature Details

#### 2.1. `REST` Factory (`rest.js`)

This factory is the single source of truth for all communication with the backend RESTful API. It uses AngularJS's `$resource` service to create objects that represent API endpoints.

*   **Purpose:** To abstract and centralize API calls, making controllers cleaner and backend interactions consistent.
*   **Implementation:**
    *   Each property of the returned object (e.g., `blocks`, `content`, `users`) is a `$resource` instance mapped to a specific API endpoint.
    *   URL parameters like `:blockID` or `:contentID` are dynamically populated from the data object passed to the resource's methods. The `@` prefix (e.g., `{ blockID: '@blockID' }`) tells `$resource` to pull the value from the data object itself.
    *   A custom `update` action is defined for most resources, mapping it to the `PUT` HTTP method, as `$resource` does not provide this out of the box.

#### 2.2. State Management Factories (`page.js`, `users.js`)

These factories serve as singleton services to hold and share application state.

*   **`Page` Factory:**
    *   **Purpose:** To maintain the state of the page currently being edited. This allows various components (e.g., the page details form, the main content editor) to access and modify the same page data without direct dependencies on each other.
    *   **Implementation:** Returns a simple JavaScript object with default values for a page's properties. Any component that injects the `Page` factory receives a reference to this same object.

*   **`Users` Factory:**
    *   **Purpose:** To store information about the currently authenticated user.
    *   **Implementation:** Similar to the `Page` factory, it returns an object containing user details, which can be populated after login and accessed globally.

#### 2.3. `pageCtrl` Controller (`pageCtrl.js`)

This is the primary controller that contains the business logic for the page editor view.

*   **Initialization:**
    *   On load, it populates its local `$scope.page` object with data from the shared `Page` factory.
    *   It checks `localStorage` for any unsaved versions of the current page (identified by its URL). If a newer local version is found, it prompts the user with options to use, compare, or discard it.
    *   It initializes the `scheduleDate` with the current date for new pages.

*   **Core Features:**
    *   **Saving and Updating (`savePage`):** This is the module's most complex function.
        *   It distinguishes between creating a new page and updating an existing one based on the current route (`/new`) or a `duplicate` flag.
        *   **Validation:** It performs client-side validation to ensure a page type and URL are provided, broadcasting user-friendly error notifications via `$rootScope.$broadcast('notify', ...)`.
        *   **Asynchronous Workflow:** It uses a chain of callbacks and promises to execute a sequence of API calls:
            1.  **Save/Update Main Content:** Calls `REST.content.save()` or `REST.content.update()`.
            2.  **Save Revisions:** Upon success, it saves the current state as a new entry in `contentRevisions`.
            3.  **Manage Tags:** It deletes all existing tags for the page and saves the new set.
            4.  **Manage Extras:** It deletes and re-saves all associated "extra" content (custom fields).
            5.  **Redirect:** After all operations complete successfully, it redirects the user to the new page URL using `$location.path()`.
    *   **Page Deletion (`deletePage`):**
        *   The UI uses a `page.confirm` flag to show a confirmation step before deletion.
        *   When confirmed, it makes parallel API calls to delete the page content, all its revisions, extras, and tags, ensuring no orphaned data remains.
    *   **Local Draft Management (`localVersion`, `deleteNewerVersion`):**
        *   `localVersion`: Restores page data from `localStorage` into the `Page` factory and broadcasts a `contentGet` event to signal other components to refresh their views.
        *   `deleteNewerVersion`: Clears the saved draft from `localStorage`.
    *   **Real-time Data Binding and Updates:**
        *   `titleChange()`: Updates `Page.title` and automatically generates a URL-friendly slug from the title for new pages.
        *   `descriptionChange()`, `urlChange()`: Immediately update the corresponding properties in the `Page` factory.
        *   `saveLocal()`: Persists the current form state to `localStorage` to prevent data loss.
    *   **Tag Autocomplete (`autocompleteTags`, `selectSuggestion`):**
        *   As the user types in the tags input, `autocompleteTags` queries the `contentTags` API endpoint for matching suggestions.
        *   `selectSuggestion` allows the user to click a suggestion to add it to the tag list.

#### 2.4. View (`page.html`)

This is the HTML template that provides the user interface for the page editor.

*   **Controller Binding:** `ng-controller="pageCtrl"` links this view to its corresponding controller.
*   **Data Binding:** Uses AngularJS directives like `ng-model`, `ng-click`, `ng-show`, and `ng-options` to create a dynamic, two-way data-bound interface with the `$scope` of `pageCtrl`.
*   **Conditional UI:**
    *   The "newer version" banner is shown/hidden based on the `newerVersion` scope variable.
    *   The delete confirmation prompt is toggled using the `page.confirm` flag.
    *   The date/time input for scheduling is only visible when `page.publish` is set to `'schedule'`.
*   **Internationalization:** Uses the `translate` directive (e.g., `<p translate="page_newer"></p>`) for displaying text, allowing for easy localization.

---

### 3. Interface Specifications

#### 3.1. `pageCtrl` Injected Dependencies

| Dependency       | Type      | Description                                                                                             |
| ---------------- | --------- | ------------------------------------------------------------------------------------------------------- |
| `$scope`         | Service   | The binding part between the HTML (view) and the JavaScript (controller).                               |
| `REST`           | Factory   | Provides access to all backend API endpoints. Used for all server communication.                        |
| `$location`      | Service   | Used to read the current URL path (to detect new vs. edit) and to redirect the user after saving.       |
| `Page`           | Factory   | The shared state object for the current page's data.                                                    |
| `$rootScope`     | Service   | Used to broadcast global events, such as notifications (`notify`) or data refresh requests (`contentGet`). |
| `$routeParams`   | Service   | Provides access to URL parameters, used here to get the page URL for `localStorage` keys.               |
| `$upload`        | Service   | (Injected but not used in the provided code) Likely intended for file upload functionality.             |
| `Users`          | Factory   | The shared state object for the current user's data. Used to set the page author.                       |
| `$translate`     | Service   | A service for handling internationalization (i18n) of UI strings.                                       |

#### 3.2. `REST` Factory Endpoints

| Resource Name              | API Endpoint                                         | URL Parameters                               | Custom Methods |
| -------------------------- | ---------------------------------------------------- | -------------------------------------------- | -------------- |
| `blocks`                   | `api/blocks/:blockID`                                | `blockID`                                    | `update` (PUT) |
| `blocksRequirements`       | `api/blocks/:blockID/requirements/:requirementID`    | `blockID`, `requirementID`                   | `update` (PUT) |
| `comments`                 | `api/comments/:commentID`                            | `commentID`                                  | `update` (PUT) |
| `content`                  | `api/content/:contentID`                             | `contentID`                                  | `update` (PUT) |
| `contentExtras`            | `api/content/:contentID/extras/`                     | `contentID`                                  | -              |
| `contentRevisions`         | `api/content/:contentID/revisions/:revisionID`       | `contentID`, `revisionID`                    | `update` (PUT) |
| `contentRevisionsExtras`   | `api/content/:contentID/revisions/:revisionID/extras/:extraID` | `contentID`, `revisionID`, `extraID` | -              |
| `contentTags`              | `api/content/:contentID/tags/`                       | `contentID`                                  | -              |
| `files`                    | `api/files/:fileID`                                  | `fileID`                                     | `update` (PUT) |
| `filesTags`                | `api/files/:fileID/tag/:tag`                         | `fileID`, `tag`                              | `update` (PUT) |
| `menus`                    | `api/menus/:menuID`                                  | `menuID`                                     | `update` (PUT) |
| `modules`                  | `api/modules/:moduleID`                              | `moduleID`                                   | `update` (PUT) |
| `sitemaps`                 | `api/sitemaps/`                                      | -                                            | -              |
| `themes`                   | `api/themes/:themeID`                                | `themeID`                                    | `update` (PUT) |
| `settings`                 | `api/settings/`                                      | -                                            | `update` (PUT) |
| `users`                    | `api/users/:userID`                                  | `userID`                                     | `update` (PUT) |

---

### 4. Usage Documentation

To integrate and use this module, ensure the application's routing is configured to use `pageCtrl` and `page.html` for the relevant routes.

**Example Route Configuration (`ngRoute`):**

```javascript
angular.module('cosmo').config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/new', { // Route for creating a new page
            templateUrl: 'core/html/page.html',
            controller: 'pageCtrl'
        })
        .when('/:url', { // Route for editing an existing page
            templateUrl: 'core/html/page.html',
            controller: 'pageCtrl',
            resolve: {
                // A resolver can pre-fetch page data before the controller loads
                pageData: function(REST, $route, Page) {
                    return REST.content.get({ url: $route.current.params.url }, function(data) {
                        // Populate the Page factory with fetched data
                        angular.extend(Page, data);
                    }).$promise;
                }
            }
        });
}]);
```

**Initialization Requirements:**
*   The `Users` factory should be populated with the current user's data upon application login.
*   The `Page` factory should be cleared or reset when navigating to the `/new` page route to ensure no data carries over from a previous editing session.

---

### 5. Accessibility Features

The module implements several standard accessibility practices but also has areas for improvement.

*   **Semantic HTML & Labels:**
    *   The view uses `<label>` elements with the `for` attribute, correctly associating them with their corresponding `<input>`, `<textarea>`, and `<select>` controls. This is crucial for screen reader users.
    *   Headings (`<h1>`) and buttons (`<button>`) are used appropriately.

*   **Keyboard Navigation:**
    *   All interactive elements (`input`, `button`, `select`, `a`) are part of the natural tab order and are keyboard-operable by default.

*   **Areas for Improvement:**
    *   **Custom Radio Buttons:** The "Publish", "Draft", and "Schedule" options are styled to look like buttons. While they use `<input type="radio">`, the state is visually managed by `ng-class="{active: ...}"` and the selection is handled by `ng-click` on the `<label>`. This pattern can be problematic:
        *   The visual "active" state is not programmatically conveyed as a "checked" state to assistive technologies. The native `checked` attribute should be the source of truth.
        *   Using `ng-modal` (a typo for `ng-model`) on the radio inputs is incorrect. It should be `ng-model="page.publish"`.
    *   **ARIA Attributes:** The implementation could be enhanced with ARIA (Accessible Rich Internet Applications) attributes.
        *   The tag suggestions `div` (`class="tag-suggestions"`) should use ARIA roles for a combobox/listbox pattern to announce the presence and state of suggestions to screen readers.
        *   Live notifications broadcast via `$rootScope` should be rendered in an element with `role="alert"` or `aria-live="polite"` to ensure they are announced by assistive technologies.

---

### 6. Conclusion

The Page Management module is a well-structured and feature-rich component that serves as a cornerstone of the application's content management capabilities.

**Benefits & Value:**
*   **Modularity:** The clear separation of concerns between the API layer, state management, and controller logic makes the code easier to understand, maintain, and extend.
*   **User Experience:** Features like auto-saving to local storage, real-time UI updates, and clear notifications provide a robust and user-friendly editing experience.
*   **Centralized Logic:** Consolidating API interactions and state management into factories promotes code reuse and consistency throughout the application.

**Best Practices & Recommendations:**
*   **State Management:** The use of singleton factories for state is an effective pattern in AngularJS 1.x.
*   **Asynchronous Code:** The callback-based approach in `savePage` is functional but can lead to "callback hell." In future refactoring, consider wrapping the `$resource` calls in `$q` promises to create a cleaner, more readable promise chain with `.then()`.
*   **Accessibility:** Address the identified accessibility issues, particularly with the custom radio buttons and the lack of ARIA attributes for dynamic UI components, to ensure the feature is usable by all users.
*   **Code Cleanup:** Remove unused injected dependencies (like `$upload`) and fix typos (`ng-modal` -> `ng-model`) to improve code quality.

### Tokens: {'input_tokens': 6477, 'output_tokens': 5680, 'reasoning_tokens': 2063}
### Execution time: 66.720862865448
