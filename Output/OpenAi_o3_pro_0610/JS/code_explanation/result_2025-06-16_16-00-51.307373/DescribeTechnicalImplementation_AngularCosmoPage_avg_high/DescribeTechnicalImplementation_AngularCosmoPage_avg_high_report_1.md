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
Cosmo - Page Authoring Module  
Comprehensive Technical Documentation
==================================================

1. Overview
-----------

The fragment you are looking at is the **Page Authoring module** of the *Cosmo* CMS-like single-page application.  
It is written with Angular 1.x and consists of five major artefacts:

• `REST` factory – strongly typed gateway to the RESTful back-end (wraps `$resource`).  
• `Page` factory – singleton that holds the page currently being authored / edited.  
• `Users` factory – singleton with information about the signed-in user.  
• `pageCtrl` – controller that drives the authoring UI, orchestrates state changes, persistence, revisioning and notifications.  
• `page.html` – view template bound to `pageCtrl`.

Internally this module is responsible for:

• Creating, duplicating, updating and deleting “pages” (`/api/content`).  
• Revisioning (`/api/content/:contentID/revisions`).  
• Tag management and auto-complete (`/api/content/:contentID/tags`).  
• Client side draft caching in `localStorage`.  
• Scheduled publishing logic.  
• Emitting application-wide events (`$broadcast`) for other subsystems (sidebar, WYSIWYG editor, notifications, …).

Within the broader application this component acts as **the canonical authoring interface** and is the only place where the `Page` singleton is mutated.


2. Feature Matrix
-----------------

1. CRUD operations  
   • `savePage()` decides whether to POST (create) or PUT (update).  
   • Multiple dependent resources (tags, extras, revisions) are created or deleted in cascade.

2. Duplication  
   • Passing `duplicate === true` forces a new POST even while editing an existing page.

3. Auto generated URL slugs  
   • `titleChange()` lower-cases, strips punctuation, replaces blanks with “-”.  
   • Generation stops as soon as the user manually edits `url`.

4. Local draft recovery  
   • Every keystroke calls `saveLocal()` which writes the latest values into `localStorage`.  
   • On controller start a diff is executed; if mismatches are found the banner “newerVersion” is shown with actions *Compare / Discard / Use*.

5. Scheduled publishing  
   • Three radio buttons map to `publish = 'Y' | 'N' | 'schedule'`.  
   • A native `<input type="datetime-local">` is conditionally shown.  
   • When saving the effective `published_date` is normalised to **Unix seconds** (UTC).

6. Tag auto-complete  
   • `autocompleteTags()` queries `/api/content/:contentID/tags?tag=…`.  
   • Suggestions are shown in a lightweight list, picked via `selectSuggestion()`.

7. Extras subsystem  
   • Arbitrary key/value pairs (`Page.extras`) can be attached to both page *and* revision level.  
   • Complex objects are serialised through `angular.toJson()`.

8. Revisioning  
   • Each successful create/update persists an immutable snapshot to `/api/content/:contentID/revisions` and its extras to `/revisions/:revisionID/extras`.

9. Notification bus  
   • `$rootScope.$broadcast('notify', {message, classes?})` is used throughout in combination with `$translate` for i18n strings.

10. Permission / author attribution  
    • `Users.id` is sent with every POST / PUT.



3. Component APIs
-----------------

3.1 `REST` Factory (service)

All members are `$resource` instances and thus expose the standard **Action API**  
(`get`, `query`, `save (POST)`, `update (PUT)`, `delete`) plus any custom actions you define later.

| property                     | REST endpoint template                                                     | remarks                                   |
|------------------------------|----------------------------------------------------------------------------|-------------------------------------------|
| blocks                       | `api/blocks/:blockID`                                                     |                                           |
| blocksRequirements           | `api/blocks/:blockID/requirements/:requirementID`                         |                                           |
| comments                     | `api/comments/:commentID`                                                 |                                           |
| content                      | `api/content/:contentID`                                                  | Core page entity                          |
| contentExtras                | `api/content/:contentID/extras/`                                          | Free-form key/value store for a page      |
| contentRevisions             | `api/content/:contentID/revisions/:revisionID`                            | Snapshots                                 |
| contentRevisionsExtras       | `api/content/:contentID/revisions/:revisionID/extras/:extraID`            | Extras for a snapshot                     |
| contentTags                  | `api/content/:contentID/tags/`                                            | Simple list of strings                    |
| files / filesTags / menus …  | Additional CMS resources (not used directly inside `pageCtrl`)            |

All resources are created with `update : { method : 'PUT' }` to allow an *idempotent* update action.

3.2 `Page` Factory (singleton)

| field            | type              | description                                            |
|------------------|-------------------|--------------------------------------------------------|
| id               | number            | Primary key of the page                               |
| title            | string            | `<title>` or SEO title                                |
| description      | string            | Meta description                                      |
| header           | string            | H1 or visual header (edited elsewhere)                |
| subheader        | string            | H2 or sub header (edited elsewhere)                   |
| body             | string / HTML     | Main content (edited elsewhere)                       |
| url              | string            | Public URL slug                                       |
| type             | string            | Logical layout / template name                        |
| published        | `'Y' | 'N'`       | Current state                                         |
| published_date   | number (epoch s)  | When the page became public                           |
| themePages       | string[]          | Layouts available, injected by the active theme       |
| extras           | object\<string,*\>| Arbitrary side-car data                               |
| misc             | object            | Reserved for future extensions                        |

3.3 `Users` Factory

Holds the authenticated user – mostly needed for server attribution.

| field   | type   | comment |
|---------|--------|---------|
| id      | number | primary key |
| …       | string | name, bio, photo, role, socials |

3.4 `pageCtrl` – public members available to the template

| name                        | type                 | description                                  |
|-----------------------------|----------------------|----------------------------------------------|
| page                        | object (see below)   | Two-way bound working copy                   |
| newerVersion                | boolean              | Shows yellow “unsaved changes” banner        |
| titleChange()               | fn()                 | Generates slug, updates singleton            |
| descriptionChange()         | fn()                 | Updates singleton                            |
| urlChange()                 | fn()                 | Updates singleton                            |
| saveLocal()                 | fn()                 | Writes working copy to `localStorage`        |
| autocompleteTags()          | fn()                 | Retrieves tag suggestions                    |
| selectSuggestion(tag)       | fn(string)           | Inserts chosen tag into the list             |
| savePage(duplicate?)        | fn(bool)             | Main entry point for create / update / copy  |
| deletePage()                | fn()                 | Hard delete + redirects to `/new`            |
| localVersion()              | fn()                 | Restores draft from `localStorage`           |
| deleteNewerVersion()        | fn()                 | Discards draft in `localStorage`             |

`$scope.page` (UI working copy)

| field           | type                   | optional | notes                                              |
|-----------------|------------------------|----------|----------------------------------------------------|
| id              | number                | yes      | filled after first successful POST                 |
| title           | string                | yes      | bound to `<input>`                                 |
| description     | string                | yes      | bound to `<textarea>`                              |
| url             | string                | yes      | bound to `<input>`                                 |
| publish         | `'Y' \| 'N' \| 'schedule'` | no | current selection of radio group                   |
| scheduleDate    | Date object           | no       | bound to `<input type="datetime-local">`           |
| tags            | string[]              | yes      | list edited by ng-list                             |
| type            | string                | no       | one of `themePages`                                |
| themePages      | string[]              | no       | populated from `Page.themePages`                   |
| suggestions     | string[]              | yes      | auto-complete candidates (not persisted)           |

Return values  
All `$resource` calls return a **promise-like** object. Success handlers (`fn ok`) receive the decoded payload (`data`). Error handlers receive the HTTP error object.


4. Usage & Integration
----------------------

```html
<!-- embed the template inside your admin shell -->
<div ng-controller="pageCtrl">
  <!-- page.html content copied earlier -->
</div>
```

Router example (ngRoute)

```js
$routeProvider
  .when('/new', {
     templateUrl : 'core/html/page.html',
     controller  : 'pageCtrl'
  })
  .when('/:url', {
     templateUrl : 'core/html/page.html',
     controller  : 'pageCtrl',
     resolve : {
        // ensure Page singleton is populated before controller instantiates
        preload : function(REST, Page, $route){
           return REST.content.get({contentID : $route.current.params.url}).$promise
                  .then(function(dto){ angular.extend(Page, dto); });
        }
     }
  });
```

Common patterns

1. **Creating a blank page**

```js
$location.path('/new');   // controller initialises defaults
// user fills form -> presses “Save”, POST is triggered automatically
```

2. **Duplicating the current page**

```html
<button ng-click="savePage(true)">Duplicate</button>
```

3. **Recovering an abandoned draft**

Controller auto-detects, user clicks “Compare / Use” in the yellow banner.

4. **Adding a custom extra field in another directive**

```js
// any child component can do:
Page.extras.gallery = filesArray;      // object or array
$rootScope.$broadcast('previewReload');
```


Init requirements
• `ngResource` (`angular-resource.js`) must be loaded **after** Angular core.  
• `$upload` dependency suggests you already added `ng-file-upload`.  
• Make sure every REST endpoint listed in section 3.1 exists server-side and respects CORS if needed.


5. Accessibility
----------------

Current template relies mainly on **native HTML semantics**:

• `<label for=…>` is correctly paired with the matching form control.  
• `<button>` elements are real buttons, therefore keyboard accessible.  

ARIA roles/attributes **implemented**: *none explicitly*.  
Keyboard navigation:  
– Radio buttons and inputs are naturally tabbable.  
– All action buttons are `<button>` elements (receive focus, activate on Space/Enter).  

Recommended improvements:

• Add `role="alert"` to the notification area that listens for `notify` events.  
• Add `aria-live="polite"` inside `.tag-suggestions` for dynamic suggestion lists.  
• Use `aria-pressed` on the three publish radio wrappers if they are visually styled as toggle buttons.  
• Ensure colour-only cues (e.g. active CSS class) are accompanied by some textual or programmatic indication.


6. Conclusion & Best Practices
------------------------------

The Page Authoring module offers a **self-contained, extensible and testable** solution for managing web pages in Cosmo:

• Clear separation of concerns – data (factories), logic (controller) and presentation (template).  
• `$resource`-based gateway keeps HTTP logic declarative and reusable.  
• Local draft store shields the user from data loss and promotes confidence.  
• Revision subsystem guarantees historical traceability.  
• Granular events (`contentGet`, `settingsGet`, `notify`) allow plug-ins to hook into the workflow.  

Best practices:

1. Keep the `Page` singleton **serialisable** – avoid putting DOM nodes or circular references in `extras`.  
2. Always use `REST.*.update()` instead of bare `$http.put` to keep caching and interceptors consistent.  
3. When you extend the template with new inputs, remember to:  
   • Bind them bi-directionally to `$scope.page.*`.  
   • Mirror them in the `Page` factory so they survive controller destruction.  
4. Maintain i18n coverage by wrapping user-visible strings with `$translate`.  
5. Consider migrating to **component-based** (`.component()`) syntax or Angular (>2) when planning large refactors; the logical boundaries showcased here map one-to-one to modern frameworks.

With these guidelines the Page Authoring module will remain robust, accessible and easy to evolve alongside the rest of the Cosmo application.

### Tokens: {'input_tokens': 5580, 'output_tokens': 3454, 'reasoning_tokens': 704}
### Execution time: 244.40510392189026
