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
Below is a comprehensive technical documentation for the provided AngularJS code. This documentation is organized into clear sections that cover an overview of each component, feature details, interface specifications, usage examples, accessibility considerations, and a conclusion.

────────────────────────────────────────────────────────────────────────
1. INTRODUCTION
────────────────────────────────────────────────────────────────────────
This code forms part of an AngularJS (1.x) application named “cosmo.” It provides functionality for creating, editing, and managing content pages within the application. The main components include:

• REST Factory – A central service that configures $resource endpoints for communicating with a RESTful backend.  
• Page Factory – A shared object where page-level data is stored and made globally available.  
• Users Factory – A shared object that stores data about the current user.  
• pageCtrl – A controller that provides UI logic for creating and editing pages, integrating with the Page, Users, and REST services.

────────────────────────────────────────────────────────────────────────
2. COMPONENT OVERVIEW
────────────────────────────────────────────────────────────────────────
2.1 REST Factory (rest.js)
• Purpose: Defines multiple $resource objects that point to backend API endpoints (e.g., api/blocks, api/content, api/files, etc.).  
• Role: Simplifies HTTP communication by exposing standard CRUD methods: GET, POST (save), PUT (update), DELETE.  
• Key Functionality:  
  – “blocks,” “content,” “files,” etc., are resource objects with custom update methods.  
  – Allows consistent, centralized REST calls across the application.

2.2 Page Factory (page.js)
• Purpose: Stores essential page data (title, description, url, etc.) globally.  
• Role: Acts like a “single-source-of-truth” for current page information.  
• Key Functionality:  
  – Holds default values for new pages (e.g., id=0) and can persist data across controllers.  
  – Minimizes repeated code by centralizing page-related state.

2.3 Users Factory (users.js)
• Purpose: Contains information about the currently logged-in user (id, username, email, etc.).  
• Role: Similar to Page, it exposes user information to other parts of the application that need it.  
• Key Functionality:  
  – Stores user profile details, social links, and roles.

2.4 pageCtrl (pageCtrl.js)
• Purpose: Manages the creation and editing of pages, tying together data from Page, Users, and REST.  
• Role: Provides extensive logic for saving, deleting, updating, and duplicating pages, including local storage checks for unsaved changes.  
• Key Functionality:  
  1. Local Version Checking: Detects if a newer unsaved version of a page exists in localStorage.  
  2. Dynamic URL Generation: Updates a page’s URL based on its title.  
  3. Publishing & Scheduling: Handles immediate or scheduled publishing of pages.  
  4. Tagging & Autocomplete: Integrates with REST to retrieve and suggest tags.  
  5. Revisioning: Automatically creates new revisions whenever a page is saved or updated.

────────────────────────────────────────────────────────────────────────
3. DETAILED FEATURES
────────────────────────────────────────────────────────────────────────
3.1 Data Retrieval and Storage (REST)  
• Each entry (e.g., REST.blocks, REST.content) corresponds to an API endpoint.  
• CRUD operations use Angular’s $resource methods: get, save, update, query, delete.  
• The “update” method is explicitly defined as method: 'PUT'.

3.2 Page Management (pageCtrl)  
• Initialization:
  – Merges factory defaults (Page factory) with scope’s own page object.  
  – Conditionally sets scheduleDate to the current time when creating a new page.  
• Local Storage Check:  
  – Compares stored items with current page data.  
  – If discrepancies exist, prompts the user about a “newer version.”  
• Save and Update:
  – Validates required fields (title, type, url).  
  – If adding a new page, uses REST.content.save().  
  – If updating, uses REST.content.update().  
  – Maintains revision history via REST.contentRevisions.  
• Delete:
  – Orchestrates deleting the page and its revisions, extras, and tags.  
  – Afterwards, redirects to a new blank page (path 'new').  
• Tag Autocomplete:
  – Calls REST.contentTags.query to fetch suggestions.  
  – Replaces partial tag with selected suggestion.

3.3 Theming and Page Types  
• pageCtrl fetches available "themePages" from Page.themePages.  
• The user can switch the page’s “type” from those available in the currently active theme.

────────────────────────────────────────────────────────────────────────
4. INTERFACE SPECIFICATIONS
────────────────────────────────────────────────────────────────────────

4.1 REST Factory Return Object
Below is a summary of resource objects exposed by the REST factory:

┌───────────────────────┬─────────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────┐
│ Name                  │ Path                        │ Description                                                                                │
├───────────────────────┼─────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────┤
│ blocks                │ api/blocks/:blockID         │ Manages block resources, supporting GET, POST, PUT (update), DELETE.                        │
│ blocksRequirements    │ api/blocks/:blockID/…       │ Manages block requirements. Supports GET, PUT, etc.                                         │
│ comments              │ api/comments/:commentID      │ Manages comment entities.                                                                   │
│ content               │ api/content/:contentID       │ Manages primary content objects (pages).                                                    │
│ contentExtras         │ api/content/:contentID/extras│ Manages additional data linked to a content item (storage for “extras”).                     │
│ contentRevisions      │ api/content/:contentID/…     │ Manages versions (revisions) of a content item.                                             │
│ contentRevisionsExtras│ api/content/:contentID/…     │ Manages extra data for specific content revisions.                                          │
│ contentTags           │ api/content/:contentID/tags  │ Manages tags associated with a content item.                                                │
│ files                 │ api/files/:fileID            │ Manages uploaded file entities.                                                             │
│ filesTags             │ api/files/:fileID/tag/:tag   │ Manages tags on a file resource.                                                            │
│ menus                 │ api/menus/:menuID            │ Manages navigation menu entities.                                                           │
│ modules               │ api/modules/:moduleID        │ Manages module definitions.                                                                 │
│ sitemaps              │ api/sitemaps/                │ Fetches or updates the site’s sitemaps.                                                    │
│ themes                │ api/themes/:themeID          │ Manages UI theme definitions.                                                               │
│ settings              │ api/settings/                │ Manages site-wide settings.                                                                 │
│ users                 │ api/users/:userID            │ Manages user objects.                                                                      │
└───────────────────────┴─────────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────┘


4.2 Page Factory Properties
Below are the main properties exposed by the Page factory:

┌───────────────────────┬────────────┬───────────────────────────────────────────────────────────────────────────────┬──────────┐
│ Property              │ Data Type  │ Description                                                                    │ Required │
├───────────────────────┼────────────┼───────────────────────────────────────────────────────────────────────────────┼──────────┤
│ id                    │ Number     │ Unique page identifier.                                                        │ No       │
│ title                 │ String     │ Page title, displayed in various places.                                       │ No       │
│ description           │ String     │ Brief page description (used in meta tags or lists).                           │ No       │
│ header                │ String     │ Main header for the page.                                                      │ No       │
│ subheader             │ String     │ Subheader text for secondary headings.                                         │ No       │
│ body                  │ String     │ Main content/body of the page.                                                 │ No       │
│ url                   │ String     │ Unique slug used in navigation.                                                │ No       │
│ type                  │ String     │ Identifies a template or theme page type.                                      │ No       │
│ published             │ String     │ Publication status (“Y,” “N,” or “schedule”).                                  │ No       │
│ published_date        │ Number     │ Timestamp of when the page was published.                                      │ No       │
│ themePages            │ Array      │ Theme-specific layout options.                                                 │ No       │
│ timestamp             │ Number     │ General time-stamp or last update time.                                        │ No       │
│ extras                │ Object     │ Holds additional page data (e.g., featured images).                            │ No       │
│ misc                  │ Object     │ Miscellaneous storage for custom properties.                                   │ No       │
└───────────────────────┴────────────┴───────────────────────────────────────────────────────────────────────────────┴──────────┘

4.3 Users Factory Properties
Below are the main properties exposed by the Users factory:

┌───────────┬────────────┬─────────────────────────────────────────────────────────────────────────────┬──────────┐
│ Property  │ Data Type  │ Description                                                                 │ Required │
├───────────┼────────────┼─────────────────────────────────────────────────────────────────────────────┼──────────┤
│ id        │ String     │ Unique user identifier.                                                     │ No       │
│ username  │ String     │ Login username.                                                             │ No       │
│ name      │ String     │ Full name.                                                                  │ No       │
│ bio       │ String     │ Short bio or description of the user.                                       │ No       │
│ email     │ String     │ Email address of the user.                                                  │ No       │
│ facebook  │ String     │ Facebook profile URL.                                                       │ No       │
│ twitter   │ String     │ Twitter handle or URL.                                                      │ No       │
│ photo     │ String     │ URL for a profile photo.                                                    │ No       │
│ role      │ String     │ User role (e.g., admin, editor).                                            │ No       │
└───────────┴────────────┴─────────────────────────────────────────────────────────────────────────────┴──────────┘

4.4 pageCtrl Scope and Methods
pageCtrl sets/reads the following properties on $scope.page and offers these methods:

┌───────────────────────────┬────────────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┐
│ Method / Property         │ Type       │ Description                                                                                                 │ Required │
├───────────────────────────┼────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤──────────┤
│ $scope.page               │ Object     │ Local representation of Page factory data (id, title, url, publish, scheduleDate, tags, etc.).              │ Yes (core of ctrl) │
│ $scope.newerVersion       │ Boolean    │ Indicates if localStorage has unsaved changes.                                                               │ No       │
│ localVersion()            │ Function   │ Reverts to the localStorage version of the page (applies unsaved changes).                                   │ No       │
│ deleteNewerVersion()      │ Function   │ Clears the localStorage version.                                                                             │ No       │
│ deletePage()              │ Function   │ Deletes the content, its revisions, and extras, then redirects to a new page form.                           │ No       │
│ savePage(duplicate)       │ Function   │ Saves or duplicates the current page; updates revisions, extras, and tags.                                   │ No       │
│ titleChange()             │ Function   │ Updates $scope.page.title and optionally regenerates the URL if autoURL is true.                             │ No       │
│ descriptionChange()       │ Function   │ Syncs the page description to the Page factory.                                                              │ No       │
│ urlChange()               │ Function   │ Syncs $scope.page.url to the Page factory.                                                                   │ No       │
│ autocompleteTags()        │ Function   │ Queries REST.contentTags for tag suggestions, storing them in $scope.page.suggestions.                       │ No       │
│ selectSuggestion(tag)     │ Function   │ Replaces the last typed tag with the chosen suggestion.                                                      │ No       │
│ updatePageType()          │ Function   │ Updates Page.type from $scope.page.type, then broadcasts ‘settingsGet.’                                      │ No       │
│ saveLocal()               │ Function   │ Persists basic page info to localStorage (title, description, publish, etc.).                                │ No       │
└───────────────────────────┴────────────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┘

────────────────────────────────────────────────────────────────────────
5. USAGE DOCUMENTATION
────────────────────────────────────────────────────────────────────────
5.1 Example Setup
1. Include AngularJS and the “cosmo” module in your HTML:  
   <script src="angular.js"></script>  
   <script src="path/to/rest.js"></script>  
   <script src="path/to/page.js"></script>  
   <script src="path/to/users.js"></script>  
   <script src="path/to/pageCtrl.js"></script>

2. Define an AngularJS application with a dependency on “cosmo”:  
   angular.module('myApp', ['cosmo']);

3. Use pageCtrl in your HTML:  
   <div ng-app="myApp" ng-controller="pageCtrl">  
       <!-- Insert form fields, referencing $scope.page properties -->  
       <input type="text" ng-model="page.title" />  
       <button ng-click="savePage()">Save Page</button>  
   </div>

5.2 Common Patterns
• Retrieving Page Data: Access $scope.page.* within templates.  
• Local Storage Auto-Saving: call $scope.saveLocal() after changes for an offline draft.  
• Tagging: Type your tags into the input field bound to page.tags and let autocompleteTags() handle suggestions.

5.3 Initialization Requirements
• The Page and Users factories should be loaded before using pageCtrl.  
• A backend RESTful service must be available to handle the $resource endpoints.

────────────────────────────────────────────────────────────────────────
6. ACCESSIBILITY FEATURES
────────────────────────────────────────────────────────────────────────
• Form Elements: Standard <label>, <input>, <select>, and <textarea> are used, which inherently provides basic support for assistive technologies.  
• Angular Translate (translate attribute): Provides internationalization. It can improve accessibility by localizing text labels.  
• Potential Enhancements:  
  – Add ARIA attributes or roles for more granular screen reader support.  
  – Provide aria-label or aria-describedby for form elements if the textual labels are not sufficient.  
  – Ensure focus management is clear when showing or hiding form fields (e.g., scheduled publishing date input).

────────────────────────────────────────────────────────────────────────
7. CONCLUSION
────────────────────────────────────────────────────────────────────────
This set of AngularJS components and services provides a robust framework for creating and managing pages within the “cosmo” application. By centralizing REST communications (via the REST factory) and storing global state (via Page and Users factories), the architecture remains modular and maintainable. The pageCtrl demonstrates flexible UI logic, including autosaving, revision tracking, and scheduled publishing.  

Best Practices:  
• Ensure that your backend aligns with the endpoints defined in rest.js to avoid 404 or 500 errors.  
• Keep each factory focused on a single data concern (e.g., Pages, Users) for clearer separation of responsibilities.  
• Where necessary, incorporate ARIA labels and roles to optimize accessibility.  

By following this documentation and adhering to recommended patterns, developers can effectively integrate, extend, and maintain these AngularJS components to build a dynamic and user-friendly content management experience.

### Tokens: {'input_tokens': 5645, 'output_tokens': 4147, 'reasoning_tokens': 832}
### Execution time: 118.17884397506714
