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
Technical Documentation: Page Editor Module
===========================================

1. Component Overview
---------------------
This AngularJS “Page Editor” module provides:
•	A RESTful client (`REST` factory) for our backend endpoints  
•	Global singletons (`Page`, `Users`) for in‑memory state  
•	A UI controller (`pageCtrl`) and template (`page.html`) to create, edit, schedule, publish, duplicate, delete, and auto‑save pages  
•	Revision management (content, extras, tags) via nested REST calls  

It lives in the `cosmo` Angular module and plugs into an admin panel.  All page‑editor screens use `pageCtrl` + `page.html`.  Under the hood, it uses `$resource` for CRUD and `localStorage` for offline state.

2. Architecture & How It Fits
-----------------------------
•	cosmo.module  
   –	REST factory  
   –	Page factory  
   –	Users factory  
   –	pageCtrl controller  
   –	page.html template  
•	Dependencies:  
   –	ngResource for `$resource`  
   –	ngRoute (or UI‑Router) for `$location` & `$routeParams`  
   –	ngFileUpload (`$upload`) for file extras (featured images)  
   –	pascalprecht.translate for i18n  

Flow:
1.	User navigates to “/new” or “/{pageUrl}”  
2.	`pageCtrl` initializes `Page` and `$scope.page`, loads unsaved localStorage entries  
3.	User edits fields; autosave pushes to `Page` + `localStorage`  
4.	On Save/Delete/Duplicate, `pageCtrl` calls corresponding `REST.content`, then handles nested revisions, extras, tags  
5.	Success/failure notifications are broadcast via `$rootScope`  

3. Detailed Feature Breakdown
-----------------------------

1) REST Factory (rest.js)  
   •	Exposes `$resource` objects for all REST endpoints (`api/blocks`, `api/content`, `api/comments`, etc.)  
   •	Default parameter mappings (`:contentID → contentID`)  
   •	Custom `update: { method:'PUT'}` for PUT operations  
   •	Usage example:  
     –	`REST.content.get({contentID:123}) → GET /api/content/123`  
     –	`REST.content.update({contentID:123}, payload) → PUT /api/content/123`  

2) Page Factory (page.js)  
   •	Singleton JS object to hold current page state (id, title, body, extras, etc.)  
   •	Used to share data between controllers/components  

3) Users Factory (users.js)  
   •	Singleton for current user profile (id, username, role, social links)  
   •	Injected into `pageCtrl` for author attribution  

4) pageCtrl Controller (pageCtrl.js)  
   Main responsibilities:  
   •	Initialize `$scope.page` from `Page` + `$routeParams` + localStorage  
   •	Detect unsaved local changes and offer “Revert” / “Discard” UI  
   •	CRUD operations on pages, revisions, extras, tags via `REST`  
   •	Auto‑generate URL slug from title  
   •	Autosave local changes (`saveLocal`)  
   •	Tag autocomplete via `REST.contentTags.query`  
   •	Publish scheduling logic (now vs. schedule vs. draft)  
   •	File extras upload via `$upload` (not shown in snippet)  
   •	Emit i18n notifications via `$translate` + `$rootScope.$broadcast('notify',…)`  

5) page.html Template  
   •	`ng-controller="pageCtrl"` wrapper  
   •	New‑version alert bar (`ng-show="newerVersion"`)  
   •	Action buttons: Save, Duplicate, Delete + Confirm step  
   •	Form inputs:  
     –	Type (select from `page.themePages`)  
     –	Title, Description (with character count)  
     –	Tags (comma‑list with autocomplete)  
     –	URL slug (auto URL)  
     –	Publish radio + schedule date (`datetime-local`)  

4. Interface Specifications
---------------------------

4.1 REST Factory – Endpoints & Methods
| Resource                     | URL Pattern                                         | URL‐Params                              | Methods                       |
|------------------------------|-----------------------------------------------------|-----------------------------------------|-------------------------------|
| REST.blocks                  | /api/blocks/:blockID                                | blockID (Number)                        | query, get, save, update, delete |
| REST.blocksRequirements      | /api/blocks/:blockID/requirements/:requirementID    | blockID, requirementID (Number)         | query, get, save, update, delete |
| REST.comments                | /api/comments/:commentID                            | commentID (Number)                      | query, get, save, update, delete |
| REST.content                 | /api/content/:contentID                             | contentID (Number)                      | query, get, save, update, delete |
| REST.contentExtras           | /api/content/:contentID/extras/                     | contentID (Number)                      | query, get, save, delete      |
| REST.contentRevisions        | /api/content/:contentID/revisions/:revisionID       | contentID, revisionID (Number)          | query, get, save, update, delete |
| REST.contentRevisionsExtras  | /api/content/:contentID/revisions/:revisionID/extras/:extraID | contentID, revisionID, extraID (Number) | query, get, save, delete      |
| REST.contentTags             | /api/content/:contentID/tags/                       | contentID (Number)                      | query, save, delete           |
| REST.files                   | /api/files/:fileID                                  | fileID (Number)                         | query, get, save, update, delete |
| REST.filesTags               | /api/files/:fileID/tag/:tag                         | fileID (Number), tag (String)           | query, get, save, update, delete |
| REST.menus                   | /api/menus/:menuID                                  | menuID (Number)                         | query, get, save, update, delete |
| REST.modules                 | /api/modules/:moduleID                              | moduleID (Number)                       | query, get, save, update, delete |
| REST.sitemaps                | /api/sitemaps/                                      | —                                       | query                          |
| REST.themes                  | /api/themes/:themeID                                | themeID (Number)                        | query, get, save, update, delete |
| REST.settings                | /api/settings/                                      | —                                       | query, save, update           |
| REST.users                   | /api/users/:userID                                  | userID (Number)                         | query, get, save, update, delete |

4.2 Page Factory – Properties
| Name             | Type          | Description                             | Req’d |
|------------------|---------------|-----------------------------------------|-------|
| id               | Number        | Page primary key                        | Yes   |
| title            | String        | SEO title / header                      | Yes   |
| description      | String        | Meta description                        | Optional|
| header           | String        | H1 header                              | Optional|
| subheader        | String        | Sub‑header                            | Optional|
| body             | String (HTML) | Main content                          | Optional|
| url              | String        | Slug (path)                           | Yes   |
| type             | String        | Template variant                       | Yes   |
| published        | String (Y/N/schedule) | Publish flag                | Yes   |
| published_date   | Number (epoch)| Publish timestamp                     | Optional|
| themePages       | Array[String] | Available page types in current theme | Optional|
| timestamp        | String        | Last‑modified timestamp               | Optional|
| extras           | Object        | Key/value store for custom fields     | Optional|
| misc             | Object        | Miscellaneous data holder             | Optional|

4.3 Users Factory – Properties
| Name      | Type   | Description                           | Req’d |
|-----------|--------|---------------------------------------|-------|
| id        | String | Current user ID                       | Yes   |
| username  | String | Login name                            | Yes   |
| name      | String | Display name                          | Optional|
| bio       | String | User biography                        | Optional|
| email     | String | Email address                         | Optional|
| facebook  | String | FB profile                            | Optional|
| twitter   | String | Twitter handle                        | Optional|
| photo     | String | Avatar URL                            | Optional|
| role      | String | RBAC role (e.g. “admin”)              | Yes   |

4.4 pageCtrl Scope API
•	$scope.page (Object) same shape as Page factory, extended with:
  –	tags: Array[String]  
  –	themePages: Array[String]  
  –	scheduleDate: Date or epoch  
  –	suggestions: Array[String] (for tag autocomplete)  
  –	confirm: Boolean (delete confirmation)  
  –	newerVersion: Boolean (localStorage diff)  

•	$scope Methods:
| Name                   | Params                            | Return          | Description                        |
|------------------------|-----------------------------------|-----------------|------------------------------------|
| localVersion()         | —                                 | void            | Revert to last localStorage values |
| deleteNewerVersion()   | —                                 | void            | Clear localStorage diff flag       |
| deletePage()           | —                                 | void            | DELETE page + all revisions/extras |
| updatePageType()       | —                                 | void            | Sync type → Page + broadcast       |
| titleChange()          | —                                 | void            | Auto‑slugify title                 |
| descriptionChange()    | —                                 | void            | Sync description → Page            |
| urlChange()            | —                                 | void            | Sync URL → Page                     |
| saveLocal()            | —                                 | void            | Persist current form → localStorage|
| autocompleteTags()     | —                                 | void            | Populate `page.suggestions` via REST |
| selectSuggestion(tag)  | String                            | void            | Insert chosen tag                  |
| savePage(duplicate)    | Boolean (optional)                | void            | Main Save / Update logic           |

5. Usage Examples
----------------

1) Module Setup (app.js)
```js
angular.module('cosmo', [
  'ngResource',
  'ngRoute',
  'ngFileUpload',    // for $upload
  'pascalprecht.translate'
]);
```

2) Include Scripts in HTML
```html
<script src="angular.js"></script>
<script src="angular-resource.js"></script>
<script src="angular-route.js"></script>
<script src="angular-translate.js"></script>
<script src="ng-file-upload.js"></script>
<script src="rest.js"></script>
<script src="page.js"></script>
<script src="users.js"></script>
<script src="pageCtrl.js"></script>
```

3) Template Usage (`page.html`)
```html
<div ng-controller="pageCtrl">
  <!-- New Version Banner -->
  <div ng-show="newerVersion" class="form-case new-version">
    <p translate="page_newer"></p>
    <!-- … -->
  </div>
  <!-- Top Bar -->
  <div class="bar-top"> … </div>
  <!-- Action Buttons -->
  <div class="bar--actions"> … </div>
  <!-- Editor Form -->
  <div class="pg-editor form-case">
    <label translate="type"></label>
    <select ng-model="page.type"
            ng-options="tp for tp in page.themePages"
            ng-change="updatePageType()" required>
    </select>
    <!-- title, description, tags, url, publish radios, schedule… -->
  </div>
</div>
```

4) Routing (example)
```js
angular.module('cosmo')
.config(['$routeProvider', function($route){
  $route
    .when('/new', {
      templateUrl: 'page.html',
      controller: 'pageCtrl'
    })
    .when('/:url', {
      templateUrl: 'page.html',
      controller: 'pageCtrl'
    })
    .otherwise({redirectTo:'/new'});
}]);
```

6. Accessibility Features
-------------------------
•	Semantic HTML: `<button>`, `<label for="…">`, `<input>`, `<select>`  
•	Use of `translate` attributes ensures element-level localization  
•	No explicit ARIA roles/attributes currently defined. To improve:
  –	Add `role="alert"` on notification containers  
  –	Use `aria-describedby` on inputs with character‐count spans  
  –	Use `tabindex="0"` on custom `<div>` elements (autocomplete list)  
•	Keyboard support:
  –	Native controls handle tab/focus by default  
  –	Autocomplete suggestions should capture arrow keys & Enter (future enhancement)

7. Conclusion & Best Practices
------------------------------
This module abstracts REST endpoints, centralizes page state, and provides a robust page‑editing UI with auto‑save, scheduling, revisions, and tag autocomplete. It:
•	Keeps controllers thin by delegating CRUD to the `REST` factory  
•	Uses singletons (`Page`, `Users`) for cross‑component state  
•	Offers offline‐save via `localStorage`  
•	Supports multi‑language via `$translate`  

Best practices:
•	Always define custom PUT in `$resource` for updates  
•	Sync `$scope` ↔ factories early, then broadcast events for child components  
•	Keep nested REST calls idempotent and chain via callbacks/promises  
•	Add ARIA roles & keyboard handlers for full accessibility compliance

### Tokens: {'input_tokens': 5580, 'output_tokens': 4901, 'reasoning_tokens': 1984}
### Execution time: 37.54095101356506
