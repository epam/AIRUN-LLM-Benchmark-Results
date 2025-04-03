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
1. INTRODUCTION AND OVERVIEW
--------------------------------------------------------------------------------
The code presented is part of an AngularJS 1.x application called “cosmo.” It comprises several components—factories for REST communication (REST), global data storage (Page, Users), an AngularJS controller (pageCtrl) for handling page operations, and a companion HTML template (page.html). Together, they implement CRUD interactions for website content (pages), manage local drafts, handle page publishing schedules, and provide user identity information.

This set of components is essential for:
• Creating and editing “pages” (title, description, body contents, etc.) in a content management system (CMS)-style approach.  
• Handling publishing, scheduling, and versioning/revision of pages.  
• Storing global state for the currently edited page (Page factory) and user information (Users factory).  
• Accessing and manipulating backend resources via RESTful calls (REST factory) using $resource services in AngularJS.  

2. ARCHITECTURAL ROLE
--------------------------------------------------------------------------------
• REST Factory (rest.js): Central point of communication with the backend RESTful endpoints. Each property in the returned object (e.g. blocks, comments, content, menus) is a configured $resource that facilitates HTTP requests for the corresponding server URLs.  
• Page Factory (page.js): Maintains global data about the “current page” being edited or viewed. It exposes fields like title, description, URL, etc., which are updated through the application.  
• Users Factory (users.js): Holds user-related data (id, username, email, etc.) for the currently logged-in user.  
• pageCtrl (pageCtrl.js): Coordinates all logic for creating, editing, scheduling, duplicating, or deleting pages. It interacts with the REST, Page, and Users factories and synchronizes changes with the backend and localStorage.  
• page.html: The HTML template controlled by pageCtrl that provides the form and UI elements for editing and managing pages (title, description, tags, publishing state, scheduling, etc.).  

3. DETAILED FEATURES
--------------------------------------------------------------------------------
The main features are outlined below:

3.1 REST Factory (rest.js)
• Provides multiple $resource endpoints for various data types (e.g. blocks, content, comments, files, menus, modules, themes, settings, users).  
• Each $resource can perform standard CRUD operations and is configured with a custom "update" method (PUT).  
• Supports dynamic parameters, for example, contentRevisions: $resource('api/content/:contentID/revisions/:revisionID', …).  
• Ensures the application has a consistent and centralized way to call backend APIs.

3.2 Page Factory (page.js)
• Exposes a singleton object that holds key fields related to a page’s metadata (id, title, description, url, type, publish state, etc.).  
• Allows other parts of the application to retrieve and modify page data easily.  
• Facilitates data persistence across controllers and routes.

3.3 Users Factory (users.js)
• Stores user information like id, username, name, email, and social media handles.  
• Allows the application to check and utilize information about the currently logged-in user for authoring or editing pages.

3.4 pageCtrl (pageCtrl.js)
• Orchestrates page creation and editing via the REST.content $resource.  
• Maintains local scope variables (e.g., $scope.page) and synchronizes them with the Page factory.  
• Implements “localVersion” checks using localStorage to see if there is an unsaved version of a page, thus preventing data loss.  
• Provides methods for:  
  – localVersion() and deleteNewerVersion() to manage unsaved local versions.  
  – deletePage() to remove a page and its revisions/extras from the backend.  
  – titleChange(), descriptionChange(), urlChange() to keep Page updated with user input.  
  – autocompleteTags() and selectSuggestion() to offer tag suggestions from the backend.  
  – savePage() to save or duplicate page data to the backend and create page revisions.  
• Handles scheduling logic (immediate publish vs. future publish date) and abnormal cases (publishing older dates).  
• Broadcasts and listens to custom events ($rootScope.$broadcast, $scope.$on) to synchronize page data across different parts of the application (e.g., 'contentGet', 'settingsGet').

3.5 page.html
• Provides the user interface for editing, duplicating, and deleting pages.  
• Includes elements for:  
  – Title, description, URL, tags, extra data, publishing schedules.  
  – Buttons to confirm or cancel page deletions or scheduling actions.  
  – AngularJS directives such as ng-show for conditional display of UI sections, ng-model for two-way data binding, and ng-repeat for tag suggestions.  
• Contains translation directives (e.g., translate="page_newer") to support multiple languages.

4. INTERFACE SPECIFICATIONS
--------------------------------------------------------------------------------
Because these are AngularJS factories and controllers, we typically work with $scope and service properties rather than classic “props.” Below is a reference table to the main factory fields and relevant controller scope variables.

4.1 Page Factory Fields

| Field          | Type     | Description                                          | Required |
|----------------|---------|------------------------------------------------------|----------|
| id             | Number   | Page’s unique identifier                             | No       |
| title          | String   | Page’s title                                         | No       |
| description    | String   | Short textual description                            | No       |
| header         | String   | Page header text                                     | No       |
| subheader      | String   | Page subheader text                                  | No       |
| body           | String   | Main content of the page                            | No       |
| url            | String   | Relative path/URL slug for the page                 | Yes (for saving)  |
| type           | String   | Page type used for theming                          | Yes (for saving)  |
| published      | String   | Published status: 'Y', 'N', or 'schedule'           | No       |
| published_date | Number   | Timestamp of publish date                           | No       |
| themePages     | Array    | List of valid page types from the current theme     | No       |
| timestamp      | String   | Timestamp string for last updates                   | No       |
| extras         | Object   | Additional custom data stored with the page         | No       |
| misc           | Object   | Miscellaneous data                                  | No       |

4.2 Users Factory Fields

| Field    | Type   | Description                          | Required |
|----------|--------|--------------------------------------|----------|
| id       | String | User’s unique identifier             | Yes      |
| username | String | User’s username                      | Yes      |
| name     | String | User’s full name                     | No       |
| bio      | String | Brief biography                      | No       |
| email    | String | User’s email                         | No       |
| facebook | String | Facebook username/URL for the user   | No       |
| twitter  | String | Twitter handle for the user          | No       |
| photo    | String | URL/path to user’s profile photo     | No       |
| role     | String | User’s role (admin, editor, etc.)    | Yes      |

4.3 REST Factory Methods (representative sampling)
Each returned resource uses the standard AngularJS $resource API. Inputs and outputs align with the CRUD endpoints on the backend:
• REST.content  
  – .get({contentID}) → Retrieves a single content entry.  
  – .query() → Retrieves an array of content entries.  
  – .save(payload) → Creates a new content entry.  
  – .update({contentID}, payload) → Updates an existing content entry (PUT).  
  – .delete({contentID}) → Deletes a content entry.  

Other resources (e.g., blocks, comments, modules) follow the same pattern.

4.4 pageCtrl Scope Variables

| Variable               | Type     | Description                                                  | Required |
|------------------------|----------|--------------------------------------------------------------|----------|
| $scope.page.id         | Number   | Current page ID                                              | No       |
| $scope.page.title      | String   | Page title, bound to Page.title                              | No       |
| $scope.page.description| String   | Page description, bound to Page.description                  | No       |
| $scope.page.url        | String   | Page URL, bound to Page.url                                  | Yes      |
| $scope.page.publish    | String   | Publish state ('Y', 'N', or 'schedule'), bound to Page.publish | No    |
| $scope.page.scheduleDate| Date    | Date object for scheduling, bound to Page.scheduleDate       | No       |
| $scope.page.tags       | Array    | List of tags for the page                                    | No       |
| $scope.page.type       | String   | Page type, must be valid with available themePages           | Yes      |
| $scope.page.themePages | Array    | Valid theme pages from the theme                             | No       |
| $scope.newerVersion    | Boolean  | Indicates if discovered localStorage version is new          | No       |

5. USAGE DOCUMENTATION
--------------------------------------------------------------------------------
Below is a minimal example showing how to use these components within the AngularJS “cosmo” module:

--------------------------------------------------------------------------------
// app.js
angular.module('cosmo', ['ngResource'])
  .config([...]) // application configuration
  .run([...]);   // application initialization
--------------------------------------------------------------------------------

Include the factories and controllers in your application scripts (or load them separately via script tags):
--------------------------------------------------------------------------------
// Load scripts in index.html or equivalent:
<script src="rest.js"></script>
<script src="page.js"></script>
<script src="users.js"></script>
<script src="pageCtrl.js"></script>
--------------------------------------------------------------------------------

Inject the “REST,” “Page,” or “Users” factories into any other AngularJS component where you need to access or modify the respective data:
--------------------------------------------------------------------------------
angular.module('cosmo')
  .controller('someController', ['$scope', 'REST', 'Page', 'Users', function($scope, REST, Page, Users) {
    // Example usage:
    const pageData = Page;  // Get the current page data
    const userData = Users; // Get user info
    // Fetch content from the backend
    REST.content.get({ contentID: 123 }, function(response) {
      console.log('Content retrieved:', response);
    });
  }]);
--------------------------------------------------------------------------------

Using the pageCtrl and page.html:
• In your route configuration or template references, point to the page.html template.  
• The <div ng-controller="pageCtrl"> in page.html sets up the editing interface for the “page” object.  
• The user can fill out form fields, which are two-way bound to $scope.page.*.  
• The controller’s logic handles saving, deletion, scheduling, and local drafts automatically.

Initialization Requirements:
• The “cosmo” module must be declared and all factories/controllers must be included within it (or declared as dependencies).  
• $resource (ngResource) must be available as a dependency for the REST factory.  
• The built-in localStorage is used for draft functionality, requiring a modern browser environment.

6. ACCESSIBILITY FEATURES
--------------------------------------------------------------------------------
• Labels and Input Fields: The page.html uses standard HTML <label for="..."> elements along with corresponding input fields (e.g., <input type="radio" name="publish" id="Y">). This provides a label–input pairing, aiding screen readers and keyboard navigation.  
• Translation Directives: Use of ng-translate directives (e.g., translate="page_newer") ensures text is not only localized but also can be made consistent for assistive technologies if translations are appropriately managed.  
• Keyboard and Focus Management: Because page.html uses standard HTML form elements, default browser behavior is intact—users can tab through fields, press Enter to submit, etc. No specialized ARIA roles are included in the code, but the code’s structure is semantically correct (labels, placeholders), enhancing form accessibility.  

7. CONCLUSION
--------------------------------------------------------------------------------
This AngularJS setup provides a modular and maintainable way to manage content in a CMS-like application. Key benefits include:
• Centralized and consistent RESTful communication via the REST factory.  
• Unified global state storage for page data (Page factory) and user data (Users factory), simplifying data flow.  
• Comprehensive page editing lifecycle in pageCtrl: creation, duplication, local draft storage, versioning, scheduling, and deletion.  
• A straightforward UI in page.html that systematically uses AngularJS directives and translatable labels.  

By following best practices—such as consistent naming, thorough use of $resource for REST endpoints, and leveraging localStorage for drafts—this codebase remains organized, developer-friendly, and feature-complete for managing pages.

### Tokens: {'input_tokens': 5580, 'output_tokens': 3449, 'reasoning_tokens': 768}
### Execution time: 48.317723989486694
