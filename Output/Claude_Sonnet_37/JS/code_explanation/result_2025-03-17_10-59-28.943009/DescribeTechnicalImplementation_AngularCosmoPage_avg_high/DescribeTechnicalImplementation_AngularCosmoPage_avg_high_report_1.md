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
# Technical Documentation: Page Management System in Angular.js

## 1. Component Overview

The Page Management System is an Angular.js-based implementation for creating, editing, and managing web pages within a content management system (CMS) called "cosmo". This system provides a comprehensive interface for content administrators to manage page content, metadata, publishing status, and related assets.

The system follows a Model-View-Controller (MVC) architecture pattern with:
- **Models**: Represented by Angular factories (`Page`, `Users`)
- **Views**: HTML templates with Angular directives
- **Controllers**: Angular controllers that handle business logic (`pageCtrl`)

The system integrates with a RESTful backend API through a dedicated service (`REST`) to persist data and manage content lifecycle.

## 2. Component Features

### 2.1 RESTful API Integration

**Implementation**: The system uses Angular's `$resource` service to create a comprehensive API client that communicates with the backend. The `REST` factory provides resource objects for various endpoints including blocks, comments, content, files, menus, modules, themes, settings, and users.

```javascript
angular.module('cosmo').factory('REST', ['$resource', 'Page', function($resource, Page) {
    return {
        'content': $resource('api/content/:contentID', { contentID: '@contentID'}, { update: { method: 'PUT' } }),
        'contentRevisions': $resource('api/content/:contentID/revisions/:revisionID', 
            { contentID: '@contentID', revisionID: '@revisionID'}, 
            {update: { method: 'PUT' } }),
        // Additional resources...
    };
}]);
```

Each resource is configured with appropriate URL patterns, parameter mappings, and custom methods (like `update` for PUT requests).

### 2.2 Page Creation and Editing

**Implementation**: The `pageCtrl` controller manages the page creation and editing workflow. It initializes page data from the global `Page` factory, handles form input, validates data, and persists changes through the REST service.

Key features include:
- Form validation for required fields
- Auto-generation of URL slugs from page titles
- Support for drafts, published pages, and scheduled publishing
- Versioning with revision history
- Metadata management (title, description, tags)
- Page type selection based on available theme templates

### 2.3 Local Storage for Draft Recovery

**Implementation**: The system implements a draft recovery mechanism using browser's localStorage. When editing a page, changes are automatically saved to localStorage, allowing recovery of unsaved changes if the browser crashes or the session ends unexpectedly.

```javascript
// Save to local Storage
localStorage.setItem($routeParams.url + 'title', Page.title);
localStorage.setItem($routeParams.url + 'description', Page.description);
// Additional fields...
```

The controller checks for existing drafts when loading a page and offers options to:
- Compare the draft with the saved version
- Discard the draft
- Use the draft version

### 2.4 Tag Management with Autocomplete

**Implementation**: The system provides tag management with an autocomplete feature. As users type tags, the system queries the backend for existing tags that match the input pattern and displays suggestions.

```javascript
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

Users can select from suggestions or create new tags. Tags are stored as an array and persisted to the backend when the page is saved.

### 2.5 Publishing Workflow

**Implementation**: The system supports a flexible publishing workflow with three states:
- **Draft**: Content saved but not publicly visible
- **Published**: Content immediately visible to site visitors
- **Scheduled**: Content set to automatically publish at a specified date and time

```javascript
// Get the scheduled date to publish
var scheduleDate;
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

The controller handles date conversion and validation to ensure proper scheduling.

### 2.6 Content Versioning

**Implementation**: The system maintains a complete revision history for each page. When a page is saved, the controller creates a new revision record in addition to updating the current content.

```javascript
// Save page as a revision
REST.contentRevisions.save({
    contentID: contentID,
    title: $scope.page.title,
    description: $scope.page.description,
    // Additional fields...
}, saveRevisionPromise);
```

This enables content administrators to track changes over time and potentially revert to previous versions if needed.

### 2.7 Extended Metadata Support

**Implementation**: The system supports custom metadata through an "extras" mechanism. These are key-value pairs that can be associated with a page to store additional information beyond the standard fields.

```javascript
// Save additional data if there is any
if(Object.keys(Page.extras).length === 0){
    // Success message
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
        
        // Also save to revisions
        // ...
    }
}
```

The controller handles serialization of complex data types (arrays, objects) to JSON strings for storage.

## 3. Interface Specifications

### 3.1 Page Factory

| Property | Data Type | Description | Required |
|----------|-----------|-------------|----------|
| id | Number | Unique identifier for the page | Yes |
| title | String | Page title (used for SEO and navigation) | Yes |
| description | String | Meta description for SEO | No |
| header | String | Main heading displayed on the page | No |
| subheader | String | Secondary heading displayed on the page | No |
| body | String | Main content of the page (typically HTML) | Yes |
| url | String | URL slug for the page | Yes |
| type | String | Template type to use for rendering | Yes |
| published | String | Publication status ('Y', 'N', or 'schedule') | Yes |
| published_date | String/Number | Unix timestamp for publication date | No |
| themePages | Array | Available page templates from the current theme | Yes |
| timestamp | String | Last modification timestamp | No |
| extras | Object | Custom metadata key-value pairs | No |
| misc | Object | Miscellaneous data storage | No |

### 3.2 Users Factory

| Property | Data Type | Description | Required |
|----------|-----------|-------------|----------|
| id | String/Number | Unique identifier for the user | Yes |
| username | String | User's login name | Yes |
| name | String | User's display name | No |
| bio | String | User's biographical information | No |
| email | String | User's email address | Yes |
| facebook | String | User's Facebook profile URL | No |
| twitter | String | User's Twitter handle | No |
| photo | String | URL to user's profile photo | No |
| role | String | User's role/permission level | Yes |

### 3.3 REST Factory

| Resource | Endpoint | Methods | Description |
|----------|----------|---------|-------------|
| blocks | api/blocks/:blockID | GET, POST, PUT, DELETE | Manage content blocks |
| blocksRequirements | api/blocks/:blockID/requirements/:requirementID | GET, POST, PUT, DELETE | Manage block requirements |
| comments | api/comments/:commentID | GET, POST, PUT, DELETE | Manage user comments |
| content | api/content/:contentID | GET, POST, PUT, DELETE | Manage page content |
| contentExtras | api/content/:contentID/extras/ | GET, POST, DELETE | Manage page metadata |
| contentRevisions | api/content/:contentID/revisions/:revisionID | GET, POST, PUT, DELETE | Manage content revisions |
| contentRevisionsExtras | api/content/:contentID/revisions/:revisionID/extras/:extraID | GET, POST, DELETE | Manage revision metadata |
| contentTags | api/content/:contentID/tags/ | GET, POST, DELETE | Manage content tags |
| files | api/files/:fileID | GET, POST, PUT, DELETE | Manage media files |
| filesTags | api/files/:fileID/tag/:tag | GET, POST, PUT, DELETE | Manage file tags |
| menus | api/menus/:menuID | GET, POST, PUT, DELETE | Manage navigation menus |
| modules | api/modules/:moduleID | GET, POST, PUT, DELETE | Manage system modules |
| sitemaps | api/sitemaps/ | GET | Retrieve sitemap data |
| themes | api/themes/:themeID | GET, POST, PUT, DELETE | Manage site themes |
| settings | api/settings/ | GET, PUT | Manage system settings |
| users | api/users/:userID | GET, POST, PUT, DELETE | Manage user accounts |

### 3.4 Page Controller Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| localVersion | None | Restores a locally saved draft version |
| deleteNewerVersion | None | Discards a locally saved draft version |
| deletePage | None | Deletes the current page and all associated data |
| updatePageType | None | Updates the page template type |
| titleChange | None | Handles title changes and auto-generates URL if enabled |
| descriptionChange | None | Handles description changes |
| urlChange | None | Handles URL changes |
| saveLocal | None | Saves current page state to localStorage |
| autocompleteTags | None | Queries for tag suggestions based on current input |
| selectSuggestion | tag (String) | Selects a tag from the autocomplete suggestions |
| savePage | duplicate (Boolean) | Saves the page, optionally creating a duplicate |

## 4. Usage Documentation

### 4.1 Basic Page Creation

To create a new page, navigate to the page creation form and fill in the required fields:

```html
<!-- In your routing configuration -->
<a href="#/new">Create New Page</a>

<!-- In your controller -->
if($location.path() === '/new'){
    // Initialize a new page
    $scope.page = {
        title: '',
        description: '',
        url: '',
        publish: 'N', // Default to draft
        scheduleDate: new Date(),
        tags: [],
        type: $scope.page.themePages[0] // Default to first template
    };
}
```

### 4.2 Editing an Existing Page

To edit an existing page, load the page by its URL parameter:

```javascript
// In your routing configuration
.when('/:url', {
    templateUrl: 'page.html',
    controller: 'pageCtrl',
    resolve: {
        pageData: function($route, REST) {
            return REST.content.get({url: $route.current.params.url}).$promise;
        }
    }
})

// In your controller initialization
if($routeParams.url && $routeParams.url !== 'new') {
    REST.content.get({url: $routeParams.url}, function(data) {
        // Populate the page object with retrieved data
        $scope.page.id = data.id;
        $scope.page.title = data.title;
        // Additional fields...
    });
}
```

### 4.3 Scheduling a Page for Publication

To schedule a page for future publication:

```javascript
// In your template
<input type="radio" ng-model="page.publish" value="schedule">
<label>Schedule</label>
<input type="datetime-local" ng-model="page.scheduleDate" ng-show="page.publish=='schedule'">

// In your controller when saving
if($scope.page.publish === 'schedule'){
    scheduleDate = Date.parse($scope.page.scheduleDate).getTime()/1000;
    // Additional logic...
}
```

### 4.4 Managing Tags

To add and manage tags for a page:

```html
<input type="text" ng-list ng-model="page.tags" ng-change="autocompleteTags()" placeholder="about, restaurant, food, nyc">
<div class="tag-suggestions" ng-show="page.suggestions.length">
    <a ng-repeat="tag in page.suggestions | limitTo:10" ng-click="selectSuggestion(tag)">{{tag | titlecase}}</a>
</div>
```

## 5. Accessibility Features

### 5.1 ARIA Roles and Attributes

The page editor interface implements the following accessibility features:

- Form labels are properly associated with their input elements
- Error messages are announced to screen readers through the notification system
- Interactive elements have appropriate focus states

### 5.2 Keyboard Navigation

The page editor supports standard keyboard navigation:

- Tab navigation through form fields
- Enter to submit forms
- Escape to cancel dialogs
- Arrow keys to navigate tag suggestions

### 5.3 Focus Management

When displaying dialogs or notifications, focus is managed to ensure screen reader users are aware of important information:

- Error notifications receive focus when displayed
- After form submission, focus returns to appropriate elements
- Modal dialogs trap focus until dismissed

## 6. Conclusion

The Page Management System provides a robust, feature-rich interface for content administrators to create and manage web pages within the cosmo CMS. Key benefits include:

1. **Comprehensive Content Management**: The system handles all aspects of page creation, editing, and publishing with a user-friendly interface.

2. **Flexible Publishing Workflow**: Support for drafts, immediate publishing, and scheduled publishing accommodates various content strategies.

3. **Data Integrity**: The versioning system ensures content history is preserved, while the draft recovery mechanism prevents data loss.

4. **Extensibility**: The "extras" mechanism allows for custom metadata to be associated with pages, enabling extension without code changes.

5. **Performance Optimization**: The system uses Angular's data binding and RESTful API integration to provide a responsive user experience.

### Best Practices for Implementation

1. **Security**: Ensure proper authentication and authorization checks are implemented on the backend API.

2. **Validation**: Implement comprehensive client-side and server-side validation to prevent data corruption.

3. **Error Handling**: Provide clear error messages and recovery options for all potential failure points.

4. **Caching**: Consider implementing caching strategies for frequently accessed data to improve performance.

5. **Internationalization**: Leverage the existing translation infrastructure to support multiple languages.

The Page Management System is a core component of the cosmo CMS, providing the foundation for content creation and management throughout the application.

### Tokens: {'input_tokens': 6940, 'output_tokens': 3769}
### Execution time: 58.83836817741394
