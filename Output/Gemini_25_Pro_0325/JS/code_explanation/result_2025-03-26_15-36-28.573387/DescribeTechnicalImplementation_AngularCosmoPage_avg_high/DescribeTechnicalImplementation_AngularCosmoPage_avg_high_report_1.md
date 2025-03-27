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
Okay, here is the technical documentation for the provided AngularJS code snippets, focusing on the Page Management feature.

---

## Technical Documentation: Page Management Feature (AngularJS)

### 1. Overview

This documentation describes the technical implementation of the Page Management feature within the `cosmo` AngularJS application. This feature allows users to create, view, edit, and delete web pages.

**Core Components:**

1.  **`REST` Factory (`rest.js`):** Provides `$resource` instances for interacting with the backend REST API endpoints related to content, blocks, users, settings, etc.
2.  **`Page` Factory (`page.js`):** A service acting as a global data store for the properties of the page currently being viewed or edited.
3.  **`Users` Factory (`users.js`):** A service acting as a global data store for the currently logged-in user's information.
4.  **`pageCtrl` Controller (`pageCtrl.js`):** The controller responsible for the logic behind the page editing interface, handling user input, interacting with the `REST` and `Page` factories, and managing the view state.
5.  **`page.html` Template:** The HTML view associated with `pageCtrl`, presenting the form for editing page details and triggering controller actions.

**Architectural Role:**

This feature follows a typical AngularJS structure. The `REST` factory encapsulates backend communication. The `Page` and `Users` factories manage shared application state related to the current page and user, respectively. The `pageCtrl` acts as the intermediary between the view (`page.html`) and the model (represented by the factories and backend data), handling user interactions and data manipulation. It relies heavily on AngularJS's data binding (`ng-model`), dependency injection, and event system (`$scope.$on`, `$rootScope.$broadcast`).

### 2. Component Features

#### 2.1. REST API Interaction (`REST` Factory)

*   **Purpose:** Centralizes all communication with the backend RESTful API.
*   **Implementation:** Uses AngularJS's `$resource` service to create resource objects for various API endpoints. Each resource object provides methods (`query`, `get`, `save`, `delete`, `update`) corresponding to HTTP verbs.
*   **Endpoints Defined:**
    *   `/api/blocks/:blockID`
    *   `/api/blocks/:blockID/requirements/:requirementID`
    *   `/api/comments/:commentID`
    *   `/api/content/:contentID` (Core endpoint for pages)
    *   `/api/content/:contentID/extras/`
    *   `/api/content/:contentID/revisions/:revisionID`
    *   `/api/content/:contentID/revisions/:revisionID/extras/:extraID`
    *   `/api/content/:contentID/tags/`
    *   `/api/files/:fileID`
    *   `/api/files/:fileID/tag/:tag`
    *   `/api/menus/:menuID`
    *   `/api/modules/:moduleID`
    *   `/api/sitemaps/`
    *   `/api/themes/:themeID`
    *   `/api/settings/`
    *   `/api/users/:userID`
*   **Custom Methods:** Defines a custom `update` method using `PUT` for most resources, as `$resource` defaults `save` to `POST`.
*   **Dependencies:** `$resource`, `Page` (Note: `Page` is injected but not used within the factory itself in the provided snippet).

#### 2.2. Page State Management (`Page` Factory)

*   **Purpose:** Holds the data for the page currently being edited or viewed, making it accessible across different controllers or services.
*   **Implementation:** A simple factory returning an object with predefined properties (`id`, `title`, `description`, `url`, `type`, etc.). Components inject `Page` and can read or modify these properties directly.
*   **Properties:** See Interface Specifications below.
*   **Dependencies:** None.

#### 2.3. User State Management (`Users` Factory)

*   **Purpose:** Holds data about the currently authenticated user.
*   **Implementation:** Similar to the `Page` factory, returns an object with user-related properties. This data is likely populated after login.
*   **Properties:** See Interface Specifications below.
*   **Dependencies:** None.

#### 2.4. Page Editing Interface (`pageCtrl` & `page.html`)

*   **Purpose:** Provides the user interface and logic for creating and modifying page properties.
*   **Implementation:**
    *   `pageCtrl` initializes its local `$scope.page` by copying data from the `Page` factory.
    *   `page.html` uses `ng-model` to bind form inputs (`<input>`, `<textarea>`, `<select>`) to properties on `$scope.page`.
    *   User actions (button clicks, input changes) trigger functions defined in `pageCtrl` via directives like `ng-click`, `ng-keyup`, `ng-change`.
    *   The controller updates the `Page` factory directly during certain actions (e.g., `titleChange`, `descriptionChange`, `urlChange`, `updatePageType`) and uses it as the source of truth when saving.
    *   Uses `$translate` service for internationalization of UI text.
    *   Uses `$rootScope.$broadcast('notify', ...)` to trigger application-wide notifications (presumably handled by another component).

#### 2.5. Page Creation and Saving (`pageCtrl.savePage`)

*   **Purpose:** Handles the logic for persisting new or updated page data to the backend.
*   **Implementation:**
    1.  **Validation:** Checks for required fields (type, URL), duplicate URLs (if duplicating), and title presence (falls back to `Page.header`).
    2.  **Data Preparation:** Determines the correct `published` status ('Y'/'N') and calculates the `published_date` based on the selected option ('Publish', 'Draft', 'Schedule'). Extracts the featured image URL from `Page.extras.featured`.
    3.  **API Call:** Uses `REST.content.save` for new pages/duplicates or `REST.content.update` for existing pages, sending the prepared page data.
    4.  **Promise Chaining:** Implements a complex chain of promises to handle sequential saving operations after the main content is saved/updated:
        *   **Tags:** Deletes existing tags (on update), then saves new tags using `REST.contentTags`.
        *   **Revisions:** Saves the current state as a new revision using `REST.contentRevisions`.
        *   **Extras:** Deletes existing extras (on update), then saves current extras (`Page.extras`) using `REST.contentExtras`. Also saves extras associated with the new revision using `REST.contentRevisionsExtras`. Objects/arrays in `Page.extras` are stringified using `angular.toJson`.
    5.  **Feedback & Redirect:** Broadcasts success or error notifications using `$rootScope.$broadcast('notify', ...)`. Redirects the user to the new/updated page's URL using `$location.path()` upon successful completion of all steps.
*   **Dependencies:** `REST`, `Page`, `Users`, `$location`, `$rootScope`, `$translate`.

#### 2.6. Page Deletion (`pageCtrl.deletePage`)

*   **Purpose:** Handles the removal of a page and its associated data.
*   **Implementation:**
    1.  Uses `REST.content.delete` to remove the main page content.
    2.  Sequentially calls `delete` on `REST.contentRevisions`, `REST.contentRevisionsExtras`, `REST.contentExtras`, and `REST.contentTags` to remove all associated data for that `contentID`.
    3.  Broadcasts a success notification.
    4.  Redirects the user to the '/new' path.
*   **Dependencies:** `REST`, `$location`, `$rootScope`, `$translate`.

#### 2.7. Local Storage Recovery (`pageCtrl`, `page.html`)

*   **Purpose:** Detects and allows recovery of unsaved page data stored in `localStorage` from a previous session.
*   **Implementation:**
    1.  **Detection:** On controller initialization (for existing pages), it iterates through specific `Page` properties (`title`, `description`, etc.) and compares them with values stored in `localStorage` (keyed by `routeParams.url + propertyName`). If discrepancies are found (and the stored value isn't `null`), `$scope.newerVersion` is set to `true`.
    2.  **UI (`page.html`):** An alert (`div.new-version`) is shown using `ng-show="newerVersion"`, offering options to Discard, Compare (currently triggers `localVersion`), or Use the newer version.
    3.  **Recovery (`localVersion`):** Restores the `Page` factory properties from `localStorage` values and clears those items from `localStorage`. Broadcasts `'contentGet'` to potentially refresh other components.
    4.  **Discard (`deleteNewerVersion`):** Clears the relevant items from `localStorage` without restoring them.
*   **Dependencies:** `$routeParams`, `Page`, `$rootScope`.

#### 2.8. URL Auto-Generation (`pageCtrl.titleChange`)

*   **Purpose:** Automatically generates a URL slug based on the page title for new pages.
*   **Implementation:**
    1.  The `titleChange` function is triggered on `ng-keyup` in the title input.
    2.  It updates `Page.title`.
    3.  If the page is new (`$scope.page.url` is empty or '/new') or the `autoURL` flag is true, it generates a URL by lowercasing the title, replacing spaces with hyphens, and removing punctuation.
    4.  Updates `$scope.page.url` and `Page.url`.
    5.  The `autoURL` flag is set to `false` if the user manually edits the URL input (`urlChange` function).
*   **Dependencies:** `Page`.

#### 2.9. Tag Autocomplete (`pageCtrl.autocompleteTags`, `page.html`)

*   **Purpose:** Suggests existing tags as the user types in the tags input.
*   **Implementation:**
    1.  `autocompleteTags` is triggered on `ng-change` in the tags input (`ng-list` directive splits input into an array).
    2.  It takes the last tag being typed.
    3.  If a tag fragment exists, it calls `REST.contentTags.query({ tag: tag })`.
    4.  The results (or an empty array on error/no results) are stored in `$scope.page.suggestions`.
    5.  `page.html` uses `ng-repeat` to display suggestions (`div.tag-suggestions`), shown via `ng-show="page.suggestions.length"`.
    6.  Clicking a suggestion calls `selectSuggestion(tag)`, which replaces the last tag fragment with the selected tag and clears the suggestions.
*   **Dependencies:** `REST`.

### 3. Interface Specifications

#### 3.1. `REST` Factory

*   **Type:** AngularJS Factory
*   **Returns:** `Object` containing `$resource` instances.

| Property               | Type       | Description                                                                 | Endpoint Pattern                                             | Methods Provided                               |
| :--------------------- | :--------- | :-------------------------------------------------------------------------- | :----------------------------------------------------------- | :--------------------------------------------- |
| `blocks`               | `$resource` | Interface for Block data.                                                   | `api/blocks/:blockID`                                        | `query`, `get`, `save`, `delete`, `update` (PUT) |
| `blocksRequirements`   | `$resource` | Interface for Block Requirements.                                           | `api/blocks/:blockID/requirements/:requirementID`            | `query`, `get`, `save`, `delete`, `update` (PUT) |
| `comments`             | `$resource` | Interface for Comments.                                                     | `api/comments/:commentID`                                    | `query`, `get`, `save`, `delete`, `update` (PUT) |
| `content`              | `$resource` | Interface for main Page/Content data.                                       | `api/content/:contentID`                                     | `query`, `get`, `save`, `delete`, `update` (PUT) |
| `contentExtras`        | `$resource` | Interface for Content Extras (key-value pairs).                             | `api/content/:contentID/extras/`                             | `query`, `get`, `save`, `delete`               |
| `contentRevisions`     | `$resource` | Interface for Content Revisions.                                            | `api/content/:contentID/revisions/:revisionID`               | `query`, `get`, `save`, `delete`, `update` (PUT) |
| `contentRevisionsExtras`| `$resource` | Interface for Extras associated with specific Content Revisions.            | `api/content/:contentID/revisions/:revisionID/extras/:extraID`| `query`, `get`, `save`, `delete`               |
| `contentTags`          | `$resource` | Interface for Content Tags.                                                 | `api/content/:contentID/tags/`                               | `query`, `get`, `save`, `delete`               |
| `files`                | `$resource` | Interface for Files.                                                        | `api/files/:fileID`                                          | `query`, `get`, `save`, `delete`, `update` (PUT) |
| `filesTags`            | `$resource` | Interface for File Tags.                                                    | `api/files/:fileID/tag/:tag`                                 | `query`, `get`, `save`, `delete`, `update` (PUT) |
| `menus`                | `$resource` | Interface for Menus.                                                        | `api/menus/:menuID`                                          | `query`, `get`, `save`, `delete`, `update` (PUT) |
| `modules`              | `$resource` | Interface for Modules.                                                      | `api/modules/:moduleID`                                      | `query`, `get`, `save`, `delete`, `update` (PUT) |
| `sitemaps`             | `$resource` | Interface for Sitemaps.                                                     | `api/sitemaps/`                                              | `query`, `get`                                 |
| `themes`               | `$resource` | Interface for Themes.                                                       | `api/themes/:themeID`                                        | `query`, `get`, `save`, `delete`, `update` (PUT) |
| `settings`             | `$resource` | Interface for global Settings.                                              | `api/settings/`                                              | `query`, `get`, `save`, `update` (PUT)         |
| `users`                | `$resource` | Interface for User data.                                                    | `api/users/:userID`                                          | `query`, `get`, `save`, `delete`, `update` (PUT) |

#### 3.2. `Page` Factory

*   **Type:** AngularJS Factory
*   **Returns:** `Object` (Shared state object)

| Property       | Data Type     | Description                                                                 | Required/Optional |
| :------------- | :------------ | :-------------------------------------------------------------------------- | :---------------- |
| `id`           | Number/String | Unique identifier of the page (0 or empty for new pages).                   | Optional          |
| `title`        | String        | Page title (often used for `<title>` tag).                                  | Optional          |
| `description`  | String        | Page description (often used for meta description).                         | Optional          |
| `header`       | String        | Main heading content within the page body/template.                         | Optional          |
| `subheader`    | String        | Secondary heading content within the page body/template.                    | Optional          |
| `body`         | String        | Main content body (likely HTML).                                            | Optional          |
| `url`          | String        | URL slug for the page.                                                      | Optional          |
| `type`         | String        | Template type/name used to render the page.                                 | Optional          |
| `published`    | String        | Publish status ('Y', 'N', potentially others).                              | Optional          |
| `published_date`| String/Number | Timestamp or date string indicating when the page was/will be published.    | Optional          |
| `themePages`   | Array         | List of available page types/templates for the current theme.               | Optional          |
| `timestamp`    | String/Number | Last modified timestamp.                                                    | Optional          |
| `extras`       | Object/Array  | Container for additional, non-standard page data (e.g., featured image).    | Optional          |
| `misc`         | Object        | A general-purpose object for miscellaneous data related to the page state.  | Optional          |
| `tags`         | Array         | (Implicitly used via `pageCtrl`, not explicitly defined in factory snippet) | Optional          |
| `scheduleDate` | Date/Number   | (Implicitly used via `pageCtrl`, not explicitly defined in factory snippet) | Optional          |

#### 3.3. `Users` Factory

*   **Type:** AngularJS Factory
*   **Returns:** `Object` (Shared state object)

| Property   | Data Type     | Description                       | Required/Optional |
| :--------- | :------------ | :-------------------------------- | :---------------- |
| `id`       | String/Number | Unique identifier of the user.    | Optional          |
| `username` | String        | User's login name.                | Optional          |
| `name`     | String        | User's display name.              | Optional          |
| `bio`      | String        | User's biography.                 | Optional          |
| `email`    | String        | User's email address.             | Optional          |
| `facebook` | String        | User's Facebook profile URL.      | Optional          |
| `twitter`  | String        | User's Twitter handle/URL.        | Optional          |
| `photo`    | String        | URL to the user's profile photo.  | Optional          |
| `role`     | String        | User's role within the system.    | Optional          |

#### 3.4. `pageCtrl` Controller

*   **Type:** AngularJS Controller
*   **Dependencies:** `$scope`, `REST`, `$location`, `Page`, `$rootScope`, `$routeParams`, `$upload` (injected but unused in snippet), `Users`, `$translate`.
*   **Scope Properties:**
    *   `page`: (Object) Local copy of page data for form binding. Includes `id`, `title`, `description`, `url`, `publish`, `scheduleDate`, `tags`, `type`, `themePages`, `suggestions`.
    *   `newerVersion`: (Boolean) Flag indicating if a newer version exists in `localStorage`.
    *   `autoURL`: (Boolean) Flag controlling automatic URL generation from the title.
    *   `admin`: (Object) Used for sidebar/panel control (`admin.sidebar`, `admin.showAdminPanel`, `admin.active`).
*   **Scope Functions:** `localVersion`, `deleteNewerVersion`, `deletePage`, `updatePageType`, `titleChange`, `descriptionChange`, `urlChange`, `saveLocal` (saves to localStorage), `autocompleteTags`, `selectSuggestion`, `savePage`.
*   **Events Listened:** `$rootScope.$on('contentGet', handler)`: Refreshes `$scope.page` from the `Page` factory.
*   **Events Broadcast:** `$rootScope.$broadcast('notify', { message: '...', classes: '...' })`: Sends notifications.

### 4. Usage Documentation

#### 4.1. Initialization

1.  **Routing:** This controller and view are typically associated with routes defined using AngularJS's `$routeProvider`. Routes for `/new` (creating a page) and `/:url` (editing an existing page) would likely be configured.
2.  **Data Resolving (Recommended):** For editing existing pages, the route configuration should ideally use a `resolve` block to fetch the necessary page data (using `REST.content.get`) and potentially theme information *before* the controller is instantiated. This resolved data can then be used to populate the `Page` factory.
3.  **Dependency Injection:** AngularJS automatically injects the required dependencies (`REST`, `Page`, `Users`, etc.) into the controller when it's instantiated.

#### 4.2. Sample Route Configuration (Conceptual)

```javascript
// Example app.config.js (Conceptual)
angular.module('cosmo').config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/new', {
            templateUrl: 'core/html/page.html', // Path to page.html
            controller: 'pageCtrl',
            resolve: {
                // Resolve initial data for a new page, e.g., theme pages
                pageData: ['Page', 'REST', function(Page, REST) {
                    // Reset Page factory for a new entry
                    Page.id = 0;
                    Page.title = '';
                    // ... reset other Page properties ...
                    Page.url = 'new'; // Indicate it's a new page

                    // Example: Fetch available theme pages
                    return REST.themes.query().$promise.then(function(themes) {
                         // Assuming themes[0] is the active theme and has page templates
                         Page.themePages = themes[0] ? themes[0].templates : [];
                         Page.type = Page.themePages[0] || '';
                         return Page;
                    });
                }]
            }
        })
        .when('/:url', { // Route for editing existing pages
            templateUrl: 'core/html/page.html',
            controller: 'pageCtrl',
            resolve: {
                // Resolve existing page data before controller loads
                pageData: ['$route', 'REST', 'Page', function($route, REST, Page) {
                    var pageUrl = $route.current.params.url;
                    return REST.content.get({ url: pageUrl /* Adjust if API uses URL or ID */ }).$promise.then(function(content) {
                        // Populate the Page factory with fetched data
                        Page.id = content.id;
                        Page.title = content.title;
                        Page.description = content.description;
                        Page.header = content.header;
                        Page.subheader = content.subheader;
                        Page.body = content.body;
                        Page.url = content.url;
                        Page.type = content.type;
                        Page.publish = content.published;
                        Page.scheduleDate = content.published_date; // May need conversion
                        Page.tags = content.tags || []; // Assuming tags are returned
                        Page.extras = content.extras || {}; // Assuming extras are returned

                        // Also fetch theme pages if not already available
                        // Page.themePages = ... fetch theme pages ...

                        return Page; // Return populated Page factory
                    }).catch(function() {
                        // Handle error, e.g., redirect to 404
                        console.error("Page not found:", pageUrl);
                        // $location.path('/404');
                    });
                }]
            }
        });
}]);
```

#### 4.3. Common Use Cases

*   **Creating a New Page:** Navigate to the `/new` route. Fill in the form details (Title will auto-generate URL initially). Select Type, Status, etc. Click "Save".
*   **Editing an Existing Page:** Navigate to the page's URL (e.g., `/about-us`). The form will be pre-populated. Make changes. Click "Save".
*   **Duplicating a Page:** Load an existing page. Modify the URL field to be unique. Click "Duplicate". A new page is created with the current form content at the new URL.
*   **Deleting a Page:** Load an existing page. Click "Delete". Confirm by clicking "Yes".
*   **Scheduling a Page:** Select the "Schedule" radio button. Choose a future date/time using the `datetime-local` input. Click "Save". The page will be saved as a draft (`published: 'N'`) but with the future `published_date`. A separate process/cron job would be needed on the backend to check and update the status to 'Y' when the date is reached.
*   **Recovering Unsaved Changes:** If the browser is closed unexpectedly while editing, upon returning to the edit page, a notification bar will appear if changes were detected in `localStorage`. Click "Use" to restore the unsaved data.

### 5. Accessibility Features

*   **Semantic HTML:** Uses standard HTML form elements (`<label>`, `<input>`, `<select>`, `<textarea>`, `<button>`), which provide baseline accessibility and keyboard navigation.
*   **Labels:** `<label>` elements are used for form inputs, although the `for` attribute linking them explicitly to input `id`s is present for some but not all (e.g., missing for tags, url, radio buttons). Best practice is to ensure all interactive form elements have associated labels.
*   **Keyboard Navigation:** Standard browser keyboard navigation (Tab, Shift+Tab, Enter, Space) should work for interacting with form fields and buttons.
*   **Focus Management:** Relies primarily on default browser focus management. No custom focus directives are apparent in the provided code.
*   **ARIA Attributes:** No explicit custom ARIA roles or attributes (`aria-label`, `aria-describedby`, etc.) are added in the provided `page.html` snippet, beyond those inherent to standard HTML elements. Icons used (`<i class="fa ...">`) lack alternative text or `aria-label`, potentially making their function unclear to screen reader users.

**Recommendations for Improvement:**

1.  Ensure all form inputs have explicitly linked `<label>` elements using `for` and `id`.
2.  Add `aria-label` or screen-reader-only text (`<span class="sr-only">`) to icon buttons (Back, Close, Delete, etc.) to describe their function.
3.  Consider adding `aria-live` regions for notifications (`$rootScope.$broadcast('notify', ...)`).
4.  Review focus management during dynamic UI changes (e.g., showing/hiding the confirmation buttons, tag suggestions) to ensure logical focus flow.

### 6. Conclusion

The Page Management feature, composed of the `pageCtrl`, `page.html`, `Page`, `Users`, and `REST` components, provides the core functionality for content creation and editing within the `cosmo` application.

**Benefits:**

*   **Clear Separation of Concerns:** API logic (`REST`), shared state (`Page`, `Users`), and view logic (`pageCtrl`) are reasonably separated.
*   **Centralized API Access:** The `REST` factory provides a single point of interaction with the backend.
*   **Shared State:** `Page` and `Users` factories allow easy access to relevant data across the application.
*   **User Experience Features:** Includes helpful features like URL auto-generation, tag autocomplete, and recovery of unsaved changes.
*   **Robust Saving Process:** The `savePage` function handles the complexities of saving related data (tags, revisions, extras) sequentially.

**Contribution:** This feature is fundamental to the CMS, enabling users to manage the primary content of the website.

**Best Practices/Considerations:**

*   The promise chaining in `savePage` is complex and could potentially be simplified or made more robust, perhaps using `$q.all` if some operations could run in parallel after the initial save/update.
*   Error handling in API calls could be more granular in some places.
*   Ensure consistent use of `localStorage` keys, especially considering potential URL changes during editing. Using the page `id` might be more reliable than `url` once an ID exists.
*   Enhance accessibility as noted in Section 5.
*   The code includes comments like `// Depreciate?` suggesting potential areas for refactoring or removal.

---

### Tokens: {'input_tokens': 6506, 'output_tokens': 6271}
### Execution time: 72.50914788246155
