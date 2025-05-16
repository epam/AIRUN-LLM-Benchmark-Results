I have the following application code that needs to provide the business requirements:

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


Please follow these steps:

1. Analyze the provided Angular.js application code:
   - Identify the main functionality and features
   - Examine the component architecture and data flow
   - Review the RESTful API integration patterns

2. Document the user interaction patterns:
   - Describe the user interface components and their purpose
   - Outline the expected user workflows and interactions
   - Identify form validation and data entry mechanisms

3. Extract the business requirements and objectives:
   - Determine the core business functionality being implemented
   - Identify the business domain and key entities
   - Document the business rules encoded in the application logic

4. Identify technical constraints and assumptions:
   - Note any framework-specific limitations or dependencies
   - Document assumptions about data structure and persistence
   - Identify any browser compatibility or environment requirements

5. Evaluate performance considerations:
   - Analyze data caching and storage strategies
   - Review optimization techniques implemented in the code
   - Identify potential scalability concerns or bottlenecks

6. Document the data management approach:
   - Describe how data is created, retrieved, updated, and deleted
   - Identify client-side data storage mechanisms
   - Analyze the API communication patterns

7. Summarize the authentication and authorization model:
   - Identify user roles and permission structures
   - Document the session management approach
   - Describe any security measures implemented

## Run 1:
### Answer:
Okay, this is a classic AngularJS (1.x) setup for a Content Management System (CMS) or a similar web application that manages "pages" or "content."

Let's break down the business requirements based on the provided code.

**1. Analyze the provided Angular.js application code:**

*   **Main Functionality & Features:**
    *   **Content Management:** The core functionality revolves around creating, reading, updating, and deleting "content" (referred to as "pages").
    *   **Page Attributes Management:** Users can define various attributes for a page, including title, description, URL, type (template), tags, and publication status.
    *   **Revision History:** The system saves revisions of content, allowing for tracking changes over time.
    *   **Content Extras:** Support for additional, potentially custom, data fields associated with content ("extras").
    *   **Tagging System:** Content can be tagged for categorization and discoverability. Tag suggestions are provided.
    *   **Publishing Workflow:** Content can be published immediately, saved as a draft, or scheduled for future publication.
    *   **Local Draft Recovery:** The application attempts to save unsaved changes to local storage and prompts the user if a newer local version exists compared to the server version.
    *   **User Management (Implied):** The `Users` factory and `author: Users.id` suggest user accounts and content authorship.
    *   **Theme/Template Management (Implied):** `page.themePages` and `page.type` suggest that pages can be based on different templates provided by a theme.
    *   **Internationalization:** Use of `$translate` service indicates multi-language support for UI messages.
    *   **Notifications:** A system for notifying users of actions (e.g., save, delete, error) via `$rootScope.$broadcast('notify', ...)`.

*   **Component Architecture and Data Flow:**
    *   **AngularJS (MVW - Model-View-Whatever):**
        *   **Factories (`Page`, `Users`, `REST`):**
            *   `Page`: Acts as a global store/model for the current page being edited. Data flows into it from the controller (user input) and potentially from API responses (when loading a page).
            *   `Users`: Stores information about the currently logged-in user.
            *   `REST`: A service factory that uses `$resource` to define interfaces for communicating with the backend RESTful API. It abstracts HTTP calls.
        *   **Controller (`pageCtrl`):**
            *   Manages the `$scope` for `page.html`.
            *   Initializes page data, often from the `Page` factory or route parameters.
            *   Handles user interactions (button clicks, input changes).
            *   Orchestrates calls to the `REST` factory to persist data.
            *   Updates the `Page` factory with changes.
            *   Manages local state like `page.confirm` for delete confirmation.
        *   **View (`page.html`):**
            *   Displays page data using Angular directives (`ng-model`, `ng-click`, `ng-show`, `ng-options`, `{{ }}`).
            *   Provides UI elements for user interaction.
    *   **Data Flow (Simplified for Page Save):**
        1.  User interacts with `page.html` (e.g., types in title).
        2.  `ng-model` updates `$scope.page.title` in `pageCtrl`.
        3.  Functions like `titleChange()` update the `Page` factory (`Page.title = $scope.page.title`).
        4.  User clicks "Save".
        5.  `savePage()` in `pageCtrl` is called.
        6.  `savePage()` gathers data from `$scope.page` and the `Page` factory.
        7.  `savePage()` calls methods on the `REST` factory (e.g., `REST.content.save()` or `REST.content.update()`).
        8.  `REST` factory makes HTTP requests to the backend API.
        9.  Backend responds; promises in `pageCtrl` handle success/error (e.g., show notification, redirect).

*   **RESTful API Integration Patterns:**
    *   The `REST` factory uses `$resource` to define interactions with various API endpoints.
    *   Endpoints are clearly defined (e.g., `api/blocks/:blockID`, `api/content/:contentID/revisions/:revisionID`).
    *   Standard HTTP methods are used:
        *   `GET` (default for `.query()` and `.get()`) for fetching data.
        *   `POST` (default for `.save()` on a new resource) for creating data.
        *   `PUT` (explicitly defined as `{ update: { method: 'PUT' } }`) for updating existing data.
        *   `DELETE` (default for `.delete()`) for removing data.
    *   Path parameters (e.g., `:blockID`, `:contentID`) are used to identify specific resources.
    *   The `@` symbol (e.g., `blockID: '@blockID'`) indicates that the value for this parameter should be taken from the data object being sent.

**2. Document the user interaction patterns:**

*   **User Interface Components and Their Purpose:**
    *   **Newer Version Bar:**
        *   Appears if a locally saved, unsaved version of the page is detected.
        *   `Discard` button: Deletes the local unsaved version.
        *   `Compare` button (currently calls `localVersion()`): Intended to show differences, but currently loads the local version.
        *   `Use` button (currently calls `localVersion()`): Loads the local unsaved version into the editor.
    *   **Top Bar:**
        *   `Back` icon: Navigates to a previous view/sidebar.
        *   `Title ("Page Details")`: Indicates the current section.
        *   `Close` icon: Hides the admin panel.
    *   **Actions Bar:**
        *   `Delete` button: Initiates the delete process (shows confirmation).
        *   `Duplicate` button: Saves the current page content as a new page (requires a different URL).
        *   `Save` button: Saves the current page (creates new or updates existing).
        *   **Delete Confirmation:**
            *   `"Are you sure you want to delete this page?"` (translated `page_delete`): Confirmation message.
            *   `Yes` button: Confirms deletion.
            *   `No` button: Cancels deletion.
    *   **Page Editor Form (`pg-editor`):**
        *   `Type` dropdown: Selects the page template/type from available theme pages.
        *   `Title` input: For the page's main title (SEO title/meta title). Character count displayed.
        *   `Description` input: For the page's meta description. Character count displayed.
        *   `Tags` input: For adding comma-separated tags. Autocomplete suggestions appear below.
        *   `Tag Suggestions`: Clickable list of suggested tags based on input.
        *   `URL` input: For the page's URL slug.
        *   `Publish Status Radios`:
            *   `Publish`: Makes the page live.
            *   `Draft`: Saves the page as unpublished.
            *   `Schedule`: Allows setting a future date/time for publication.
        *   `Schedule Date/Time Picker`: Appears when "Schedule" is selected, for choosing the publication date and time.

*   **Expected User Workflows and Interactions:**
    *   **Creating a New Page:**
        1.  User navigates to the "new page" interface (e.g., `/new`).
        2.  Fills in Title, Description, URL (can be auto-generated from title initially).
        3.  Selects a Page Type.
        4.  Adds Tags (with autocomplete assistance).
        5.  Chooses a Publish Status (Publish, Draft, or Schedule with date/time).
        6.  Clicks "Save".
        7.  System creates the page, a revision, saves tags, and extras. User is notified and redirected to the new page's edit view.
    *   **Editing an Existing Page:**
        1.  User navigates to an existing page's edit interface.
        2.  If a newer local version exists, the "Newer Version Bar" appears, allowing the user to discard, compare (load), or use the local version.
        3.  User modifies any of the page fields.
        4.  Clicks "Save".
        5.  System updates the page, creates a new revision, updates tags and extras. User is notified.
    *   **Deleting a Page:**
        1.  User clicks "Delete".
        2.  Confirmation prompt appears.
        3.  User clicks "Yes".
        4.  System deletes the page, all its revisions, extras, and tags. User is notified and redirected (likely to `/new`).
    *   **Duplicating a Page:**
        1.  User clicks "Duplicate".
        2.  System validates that the URL is different from the original (if editing an existing page).
        3.  System saves the current form data as a new page, similar to creating a new page.
    *   **Managing Tags:**
        1.  User types in the "Tags" input.
        2.  As they type the last tag, suggestions appear.
        3.  User can click a suggestion to complete the tag and start a new one.
    *   **Auto-Saving (Local Drafts):**
        1.  As the user types in Title, Description, URL, or changes Publish status/Schedule Date/Type, these changes are periodically saved to `localStorage` via `saveLocal()` (though `saveLocal` is not explicitly called on every change in the provided `pageCtrl`, it's likely intended to be or called from elsewhere).
        2.  If the user leaves and returns, `pageCtrl` checks `localStorage` against the `Page` factory data to show the "Newer Version Bar".

*   **Form Validation and Data Entry Mechanisms:**
    *   **Required Fields:**
        *   Page Type (`!$scope.page.type`).
        *   URL (`$scope.page.url.length === 0 || $scope.page.url === 'new'`).
    *   **URL Auto-generation:** For new pages, the URL is auto-generated from the title (lowercase, spaces to hyphens, punctuation removed). This can be manually overridden.
    *   **Duplicate URL Check:** When duplicating, the system checks if the new URL is the same as the current page's URL.
    *   **Tag Input:** `ng-list` directive likely handles comma-separated values into an array.
    *   **Character Counts:** Displayed for Title and Description fields.
    *   **Date/Time Picker:** Standard HTML5 `datetime-local` input for scheduling.

**3. Extract the business requirements and objectives:**

*   **Core Business Functionality Being Implemented:**
    *   **BR1: Content Creation & Management:** The system must allow authorized users to create, view, edit, and delete web pages (content).
    *   **BR2: Content Structuring:** Pages must support core attributes: title, description (for SEO/summary), a unique URL, and body content (managed by `Page.body`, `Page.header`, `Page.subheader` though not directly in this HTML).
    *   **BR3: Content Versioning:** The system must automatically save a revision of a page every time it is saved, allowing for a history of changes.
    *   **BR4: Content Organization (Tagging):** Users must be able to assign multiple tags to pages for categorization and retrieval. The system should assist with tag input by providing suggestions.
    *   **BR5: Publishing Control:** Users must be able to control the visibility of pages by:
        *   Publishing them immediately.
        *   Saving them as drafts (unpublished).
        *   Scheduling them for publication at a future date and time.
    *   **BR6: Template-Driven Pages:** Pages must be associated with a "type" or "template" (derived from themes) that dictates their layout or available features.
    *   **BR7: Data Persistence & Recovery:** Changes made to pages should be saved to a central backend. Unsaved changes should be temporarily stored locally to prevent data loss and offer recovery.
    *   **BR8: Content Duplication:** Users must be able to duplicate existing pages to use as a starting point for new content, requiring a new unique URL.
    *   **BR9: Extensible Content:** The system must support adding arbitrary additional data fields ("extras") to pages.
    *   **BR10: User Authorship:** The system must track the author of page content.
    *   **BR11: User Feedback:** The system must provide clear feedback to users about the success or failure of their actions (e.g., saving, deleting).
    *   **BR12: Internationalization Support:** The user interface text must be translatable into multiple languages.

*   **Business Domain and Key Entities:**
    *   **Content/Page:** The primary entity. Attributes: ID, Title, Description, URL, Type, Publish Status (Published, Draft, Scheduled), Publish Date, Author, Tags, Revisions, Extras, Body, Header, Subheader, Featured Image.
    *   **User:** An individual interacting with the system, particularly as an author. Attributes: ID, Username, Name, Role.
    *   **Tag:** A keyword or label associated with Content for categorization.
    *   **Revision:** A historical snapshot of a Content item.
    *   **Extra:** Custom key-value data associated with Content or Revisions.
    *   **Theme:** (Implied) A collection of templates/page types.
    *   *(Other entities from `rest.js` like Block, Comment, File, Menu, Module, Sitemap, Setting are part of the broader system but not directly managed by this specific page editor view/controller).*

*   **Business Rules Encoded in the Application Logic:**
    *   A page cannot be saved without a selected page type.
    *   A page cannot be saved without a URL.
    *   When creating a new page, if the title is changed, the URL should automatically update (unless manually changed by the user).
    *   When duplicating a page, the new page must have a different URL than the original.
    *   If a page is scheduled for a past date/time, it should be immediately published.
    *   Deleting a page also deletes all its associated revisions, extras, and tags.
    *   Saving a page (new or update) also creates a new revision of that page.
    *   If a page title is empty, the page header content (if available) should be used as the title upon saving.
    *   Users should be warned if they are about to navigate away from or overwrite unsaved local changes.

**4. Identify technical constraints and assumptions:**

*   **Framework-Specific Limitations or Dependencies:**
    *   Built on AngularJS 1.x. This implies a certain architecture (scopes, controllers, services, directives).
    *   Relies on specific Angular modules: `$resource` (for REST), `$location` (for URL path), `$rootScope` (for global events), `$routeParams` (for URL parameters), `$translate` (for i18n). `$upload` is injected but not used in `pageCtrl.js`.
*   **Assumptions About Data Structure and Persistence:**
    *   A RESTful backend API exists at predefined endpoints (e.g., `api/content`, `api/users`).
    *   The backend API expects and returns data in a specific JSON format that aligns with the `$resource` definitions and controller logic.
    *   `Page.extras` is assumed to be a key-value object where values might be strings, arrays, or objects (which are stringified before saving).
    *   `localStorage` is available in the user's browser for draft saving.
*   **Browser Compatibility or Environment Requirements:**
    *   Requires a browser that supports AngularJS 1.x and `localStorage`.
    *   Assumes standard web environment where JavaScript is enabled.

**5. Evaluate performance considerations:**

*   **Data Caching and Storage Strategies:**
    *   **Client-Side Caching:** `localStorage` is used for temporary storage of unsaved page data. This is for draft recovery, not primarily for performance.
    *   **Server-Side Caching:** Not evident from the frontend code, but would be a backend concern.
*   **Optimization Techniques Implemented:**
    *   `ng-options` is generally more performant than `ng-repeat` for select options.
    *   Tag autocomplete queries the API for suggestions, which is good for UX but could be optimized (e.g., debouncing the input).
    *   The `saveLocal()` function is designed to persist intermediate states, but its trigger mechanism isn't fully shown (e.g., `ng-change` on every field could call it, or a periodic save).
*   **Potential Scalability Concerns or Bottlenecks:**
    *   **Multiple Sequential API Calls:** The `savePage` function makes several sequential API calls (save content, then tags, then revision, then extras). If any of these fail, the data could be left in an inconsistent state. A batch API endpoint or a more robust error handling/rollback strategy on the client (or ideally, transactional on backend) would be better. Same for `deletePage`.
    *   **Frequent `Page` Factory Updates:** If `titleChange()`, `descriptionChange()`, etc., are called on every `ng-keyup`, they update the global `Page` factory. If many components are watching this factory, it could lead to performance issues, though likely minor for this scope.
    *   **Tag Autocomplete:** If the tag dataset is very large, querying on every keystroke for the last tag might become slow. Debouncing or client-side filtering of a pre-fetched subset could help.
    *   **Loading `Page.extras`:** The logic for saving extras iterates and makes an API call per extra. If a page has many extras, this could be slow. A batch save for extras would be more efficient.

**6. Document the data management approach:**

*   **How Data is Created, Retrieved, Updated, and Deleted (CRUD):**
    *   **Create:**
        *   New pages: `REST.content.save()`
        *   New tags: `REST.contentTags.save()` (per tag)
        *   New revisions: `REST.contentRevisions.save()`
        *   New extras: `REST.contentExtras.save()` (per extra)
    *   **Retrieve:**
        *   Page data is assumed to be loaded into the `Page` factory (likely via `REST.content.get({contentID: ...})` in another part of the application before this controller loads).
        *   Tag suggestions: `REST.contentTags.query()`
    *   **Update:**
        *   Page content: `REST.content.update()`
        *   Tags: Existing tags are deleted (`REST.contentTags.delete()`) and then new ones are saved (`REST.contentTags.save()`).
        *   Extras: Existing extras are deleted (`REST.contentExtras.delete()`) and then new ones are saved (`REST.contentExtras.save()`).
    *   **Delete:**
        *   Page: `REST.content.delete()`
        *   Associated Revisions: `REST.contentRevisions.delete()`
        *   Associated Extras: `REST.contentExtras.delete()`
        *   Associated Tags: `REST.contentTags.delete()`
*   **Client-Side Data Storage Mechanisms:**
    *   **`Page` Factory:** In-memory JavaScript object holding the state of the current page being edited.
    *   **`Users` Factory:** In-memory JavaScript object holding current user data.
    *   **`$scope.page`:** Controller's local scope, often initialized from/synchronized with the `Page` factory.
    *   **`localStorage`:** Used to persist unsaved changes to page fields (title, description, URL, publish status, schedule date, type) to prevent data loss across sessions or browser crashes.
*   **API Communication Patterns:**
    *   Uses AngularJS `$resource` service to interact with a RESTful backend.
    *   Communication is asynchronous, using promises to handle responses.
    *   Data is typically exchanged in JSON format.
    *   Specific endpoints are defined for each resource type (content, tags, revisions, extras, users, etc.).

**7. Summarize the authentication and authorization model:**

*   **User Roles and Permission Structures:**
    *   The `Users` factory contains a `role` property (`Users.role`). This strongly suggests a Role-Based Access Control (RBAC) system is in place or intended.
    *   The specific roles and their permissions are not defined in this code snippet but would be enforced by the backend API. For example, only users with an "editor" or "admin" role might be able to create/edit/delete pages.
*   **Session Management Approach:**
    *   Not explicitly detailed in this code. Typically, in AngularJS applications, session management (e.g., via tokens in headers or cookies) is handled by `$http` interceptors or managed by the backend, with the frontend simply making authenticated requests.
*   **Security Measures Implemented:**
    *   **Authorship Tracking:** `author: Users.id` is saved with content, which is a basic security/auditing measure.
    *   **Backend Authorization (Assumed):** The primary security measure for controlling who can perform what actions (create, edit, delete) is assumed to be handled by the backend API based on the authenticated user's role/permissions. The frontend doesn't appear to have explicit client-side authorization checks for these actions beyond UI element visibility.
    *   **No Sensitive Data Exposure:** The frontend code itself doesn't seem to handle or expose overly sensitive data beyond user profile information (which should be protected by the API).

This detailed breakdown should provide a comprehensive understanding of the business requirements and technical aspects of the provided AngularJS page editing functionality.

### Tokens: {'input_tokens': 6471, 'output_tokens': 4967}
### Execution time: 84.36697697639465
