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
**Executive Summary**

Below is a structured, end‑to‑end documentation of the provided AngularJS application code (REST factory, Page/User services, page controller, and page view).  It covers:

1. **Main functionality & features**
2. **Component architecture & data flow**
3. **RESTful API integration**
4. **User interface & interaction patterns**
5. **Business requirements & objectives**
6. **Technical constraints & assumptions**
7. **Performance considerations**
8. **Data management approach**
9. **Authentication & authorization model**

Wherever relevant, code‐level citations (file name ＋ line numbers) are provided to tie behavior back to the source.

---

## 1. Main Functionality & Features

### 1.1 CRUD operations on “Pages”  
The application lets users **create**, **read**, **update**, and **delete** (CRUD) pages, including:
- **New page creation** (/new route)
- **Editing existing pages**
- **Duplicating pages**
- **Deleting pages** and all associated revisions, extras, and tags  

<small>【F:pageCtrl.js†L196-L229】【F:pageCtrl.js†L248-L305】</small>

### 1.2 Versioning & Local Drafts  
- **Local draft detection**: Detects unsaved localStorage drafts from previous sessions and prompts users to compare or discard newer versions.  
- **Revisions**: Each save creates a new revision via REST APIs.  
- **Extras**: Arbitrary “extras” (metadata) are saved both to content and to each revision.

<small>【F:pageCtrl.js†L44-L62】【F:pageCtrl.js†L314-L383】</small>

### 1.3 Tag Autocomplete  
As the user types tags, the UI queries existing tags via REST and shows suggestions.

<small>【F:pageCtrl.js†L132-L142】【F:pageCtrl.js†L144-L156】</small>

### 1.4 Scheduling & Publishing  
Users can publish immediately, save drafts, or schedule future publication with built‑in date/time controls.

<small>【F:page.html†L55-L73】【F:pageCtrl.js†L96-L127】</small>

---

## 2. Component Architecture & Data Flow

### 2.1 Angular Modules & Services

| File             | Description                                         |
|------------------|-----------------------------------------------------|
| **rest.js**      | Central `$resource` factory for all REST endpoints. |
| **page.js**      | `Page` service: client‑side singleton holding the active page’s state. |
| **users.js**     | `Users` service: client‑side singleton for current user’s profile. |

<small>【F:rest.js†L1-L22】【F:page.js†L1-L15】【F:users.js†L1-L15】</small>

### 2.2 Controller & View

- **Controller:** `pageCtrl` wires scope (`$scope.page`) to the `Page` service, orchestrates REST calls, handles user actions (save, delete, schedule, draft), and broadcasts notifications.
- **View:** `page.html` is the template driven by `pageCtrl`, containing forms and buttons for the page lifecycle.

<small>【F:pageCtrl.js†L1-L385】【F:page.html†L1-L85】</small>

### 2.3 Data Flow

1. On load, `pageCtrl` initializes `$scope.page` from `Page` service.【F:pageCtrl.js†L7-L25】
2. If editing, fetch content via a separate listener (`contentGet`), populating `Page` service (not shown).
3. User interacts with form (title, description, tags, publish settings).
4. Local changes immediately update the `Page` service and localStorage (if enabled).
5. On “Save” or “Duplicate”, controller invokes `$resource` methods in `REST.content`, `REST.contentRevisions`, `REST.contentExtras`, etc.
6. Upon success, controller broadcasts notifications (`$rootScope.$broadcast('notify',…)`) and navigates via `$location.path`.

---

## 3. RESTful API Integration Patterns

All REST interactions are centralized in a factory that returns `$resource` objects for various endpoints:

```js
angular.module('cosmo').factory('REST', ['$resource', 'Page', function($resource, Page) {
  return {
    'content':           $resource('api/content/:contentID', { contentID: '@contentID' }, { update: { method: 'PUT' } }),
    'contentRevisions':  $resource('api/content/:contentID/revisions/:revisionID', { contentID: '@contentID', revisionID: '@revisionID' }, { update: { method: 'PUT' } }),
    'contentExtras':     $resource('api/content/:contentID/extras/', { contentID: '@contentID' }),
    'contentRevisionsExtras': $resource('api/content/:contentID/revisions/:revisionID/extras/:extraID', { contentID: '@contentID', revisionID: '@revisionID', extraID: '@extraID'}),
    'contentTags':       $resource('api/content/:contentID/tags/', { contentID: '@contentID' })
    // ... other resources omitted for brevity
  };
}]);
```
【F:rest.js†L1-L22】

**Key Patterns:**
- **GET**: `REST.content.get()` or `REST.content.query()`
- **POST**: `REST.content.save(...)`
- **PUT (update)**: via the `{update: {method: 'PUT'}}` action
- **DELETE**: via `.delete(...)`
- Separate resources for **tags**, **extras**, **revisions**, and **revision extras** to maintain normalization and history.

---

## 4. User Interface & Interaction Patterns

### 4.1 UI Components & Purpose

| Element                                 | Purpose |
|-----------------------------------------|---------|
| New‐version banner (`.new-version`)     | Prompt to compare/discard drafts from localStorage. |
| Top action bar (`.bar-top`)             | Navigation (“back”) and title. |
| Action buttons (`.bar--actions`)<br>Delete / Duplicate / Save / Confirm | Manage page lifecycle actions. |
| Form fields (`input`, `textarea`, `select`) | Edit page metadata: type, title, description, tags, URL, publish/draft/schedule. |
| Tag suggestions (`.tag-suggestions`)    | Autocomplete dropdown for tags. |
| Schedule date picker (`<input type="datetime-local">`) | Set a future publish date/time. |

<small>【F:page.html†L1-L85】</small>

### 4.2 Expected User Workflows

1. **Create New Page**  
   - Navigate to `/new`
   - Fill in title, description, select page type.
   - Optionally add tags (autocomplete available).
   - Choose publish/draft/schedule, set date if scheduling.
   - Click **Save** or **Duplicate** to commit new content.

2. **Edit Existing Page**  
   - Navigate to existing page URL.
   - If localStorage draft exists, banner prompts to **Compare**, **Discard**, or **Use** local version.
   - Modify any field; changes auto-populate `Page` service.
   - Click **Save** to update existing page (creates revision & updates extras/tags).

3. **Delete Page**  
   - Click **Delete**, then confirm in the inline confirmation prompt.
   - Controller deletes content, revisions, extras, tags, then routes to `/new`.

4. **Duplicate Page**  
   - Click **Duplicate** to clone an existing page as new (with same fields).
   - User must change URL, else an error prompt occurs.

### 4.3 Form Validation & Data Entry

- **Required**: Page type must be selected.  
- **URL auto-generation**: Title changes auto‐slugify to URL when URL is blank/new.  
- **Duplicate URL check**: Prevent duplicating if new URL equals current path.
- **Empty URL/title checks**: Blocking save if missing URL or type.
- **ng-model** bound to `$scope.page` and mirrored to `Page` service on key events.

<small>【F:pageCtrl.js†L64-L94】【F:pageCtrl.js†L153-L196】</small>

---

## 5. Business Requirements & Objectives

### 5.1 Core Business Functionality

- **Content Management**: Create, edit, delete, duplicate, and version content pages.
- **Scheduling**: Publish immediately, draft, or schedule content for future publication.
- **Metadata**: Associate tags and “extras” (arbitrary metadata fields) with pages.
- **Version Control**: Maintain full revision history, including revision‑level extras.
- **Local Draft Support**: Safeguard unsaved changes in browser localStorage.

### 5.2 Business Domain & Key Entities

| Entity          | Description                                           |
|-----------------|-------------------------------------------------------|
| **Page (Content)**      | Main content item (title, URL, body, type).       |
| **Revision**    | Historical snapshot of a page and its extras.        |
| **Extra**       | Arbitrary metadata fields (images, custom JSON, etc.). |
| **Tag**         | Keyword taxonomy assigned to pages.                   |
| **User**        | Authoring identity (Users service).                   |

### 5.3 Business Rules Encoded

- **Mandatory page type**: A page must belong to one themePage type.
- **Unique URL per duplication**: Duplicate requires new URL.
- **Auto-slugify title**: Titles auto-convert to SEO-friendly URLs.
- **Future scheduling**: If schedule date < now, auto-publish; if > now, set as draft.
- **LocalStorage vs. server**: Local unsaved data can overwrite server state but must be confirmed.

<small>【F:pageCtrl.js†L96-L127】【F:pageCtrl.js†L44-L62】</small>

---

## 6. Technical Constraints & Assumptions

### 6.1 Framework & Library Dependencies

- **AngularJS v1.x** (ngResource, ngRoute, ngUpload, ngTranslate)
- **FontAwesome** for icons
- **HTML5 `<input type="datetime-local">`** for schedule (newer browsers)
- **localStorage** for client persistence

### 6.2 Data Structure & Persistence Assumptions

- **Page.extras** is an object of arbitrary key→value pairs; complex types are JSON‐stringified.
- **User roles** (“author: Users.id”) assumed to drive server-side permissions.
- **Theme pages** (Page.themePages) applied via `select ng-options`.
- scheduled date/time stored as Unix timestamp (seconds since epoch).

### 6.3 Browser Compatibility & Environment

- **Modern browsers** supporting `<input type="datetime-local">` and `localStorage`.
- **Fallbacks absent** for older browsers (no polyfills shown).
- **Server-side API** must conform to REST URIs shown (`api/content`, `api/content/:id/revisions`, etc.).

---

## 7. Performance Considerations

### 7.1 Data Caching & Storage

- **localStorage** retains unsaved changes across sessions.
- **`Page` service** holds in‑memory model, preventing excessive REST calls for form operations.

### 7.2 Optimization Techniques

- **Batch deletion** via single REST calls (e.g., delete all revisions/extras/tags).
- **Limit tag suggestions** to first 10 matches using `limitTo:10`.
- **Conditional autosave**: URL auto-generation only when blank/new to reduce watchers.

<small>【F:pageCtrl.js†L134-L142】【F:page.html†L45-L49】</small>

### 7.3 Scalability Concerns

- **Multiple sequential REST calls** when saving revisions and extras could be slow if `Page.extras` is large.
- **No debounce** on tag autocomplete; rapid typing may generate many requests.
- **localStorage loops** (for each field) on every saveLocal; minimal cost but scales with number of fields.

---

## 8. Data Management Approach

### 8.1 CRUD via `$resource`

| Operation | Controller Method                               | Resource                   |
|-----------|-------------------------------------------------|----------------------------|
| Create    | `REST.content.save(...)`                        | api/content POST           |
| Read      | `REST.content.get(...)` / broadcast `contentGet` | api/content/:id GET        |
| Update    | `REST.content.update(...)`                      | api/content/:id PUT        |
| Delete    | `REST.content.delete(...)`                      | api/content/:id DELETE     |

Additional inserts/deletes for tags, extras, revisions, and revision-extras ensure normalized history.

<small>【F:pageCtrl.js†L202-L229】【F:pageCtrl.js†L248-L283】</small>

### 8.2 Client‑side Storage

- **`Page` service**: in-memory singleton storing current page properties until scope changed.
- **`Users` service**: in-memory current user profile.
- **`localStorage`**: for persisting drafts across page reloads and browser sessions.

<small>【F:pageCtrl.js†L44-L62】【F:pageCtrl.js†L112-L124】</small>

### 8.3 API Communication Patterns

- **Synchronous flow**: Call REST, then on callbacks update UI or broadcast notifications.
- **Chained operations**: E.g., after creating a page, immediately post its tags, then its revision(s), then extras.
- **Error handling**: Each save/update has an error callback broadcasting an “alert-error” notification.

<small>【F:pageCtrl.js†L234-L241】【F:pageCtrl.js†L260-L267】</small>

---

## 9. Authentication & Authorization Model

### 9.1 User Roles & Permissions

- **`Users.id`** (current user) passed as `author` in content saves; server enforces author-based permissions.
- Roles in `Users.role` (factory default empty) likely govern UI capabilities (not shown in code).

<small>【F:users.js†L1-L15】【F:pageCtrl.js†L222-L228】</small>

### 9.2 Session Management

- **Client**: `Users` service holds user info; likely populated at app bootstrap (code not shown).
- **Server**: REST calls rely on existing session or token (unseen in client code).

### 9.3 Security Measures

- No CSRF tokens or auth headers shown (assumed globally configured).
- Sensitive actions (delete, update) require explicit confirmation in UI.

---

**References to Source Code**

| File               | Description                                     |
|--------------------|-------------------------------------------------|
| rest.js            | REST factory definitions for all entities       |
| page.js            | `Page` service (page model)                     |
| users.js           | `Users` service (current user model)            |
| page.html          | Page editing template                           |
| pageCtrl.js        | Controller orchestrating UI, data flow, and APIs|

The line‑number citations above directly tie each documented behavior back to the source code.

### Tokens: {'input_tokens': 5578, 'output_tokens': 3382, 'reasoning_tokens': 128}
### Execution time: 24.885992765426636
