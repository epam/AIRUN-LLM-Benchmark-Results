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
**Here's how I'm approaching this documentation task:**

I see the user wants a comprehensive guide to the "Page Management" feature in this AngularJS app.  It's a collection of factories, a controller, and a view that work together, so I'm treating the whole feature as the "component."

First, I'll dive in, analyze the provided code snippets (`rest.js`, `page.html`, `page.js`, `users.js`, `pageCtrl.js`), and understand how everything fits. My mental model is that this feature lets users manage pages with CRUD operations, talking to a REST API backend.  The `Page` factory is acting like a shared model, holding page data.

Then, I'll structure the documentation around the user's requirements:

*   **Overview:** I'll explain what the "Page Management" feature does, its purpose within the application, and its architecture.
*   **Features:** I'll meticulously go through `pageCtrl.js` and `page.html`, detailing each UI element and its corresponding logic.  This includes things like how pages are initialized, how unsaved changes are handled, and all the details of saving, deleting, and duplicating pages. I'll make sure to cover every aspect, from the code to the user interactions.
*   **Interface Specs:** I'll break down the `REST`, `Page`, and `Users` factories, listing their properties and methods. For `pageCtrl`, I'll explain its dependencies, scope variables, and functions. And for `page.html`, I'll look at the user interactions.
*   **Usage:** I'll show how to use the `REST` and `Page` factories and how the controller and view work together.
*   **Accessibility:** I'll scan `page.html` for ARIA attributes and mention that none are present.  I'll then suggest improvements for accessibility, like labeling icon buttons and ensuring good keyboard navigation.
*   **Conclusion:** I'll summarize the benefits of the feature, highlighting its role in streamlining content management. I'll also suggest some best practices, like maintaining separation of concerns and enhancing accessibility.

As I go, I'll use Markdown to format things clearly with headings, lists, and code blocks. I'll be sure to use consistent terminology and double-check for accuracy.  I'll also keep in mind that this is AngularJS 1.x, not React/Angular 2+, so I'll describe components, properties and inputs appropriately.  For example, I'll focus on controller scope variables rather than props.

Importantly, I noticed some areas to improve: I'll flag the lack of accessibility features, point out the injected `$upload` service and mention it as an unused dependency. I'll also keep in mind that it's likely part of a routing setup (though that's not shown). I'll also add details of the depreciate comments, as it seems they are areas the original developers flagged for review. I aim to create a truly useful technical resource.


### Answer:
Okay, this is a classic AngularJS (Angular 1.x) setup for managing content pages within a CMS-like application named "Cosmo."

Let's break down the technical implementation.

## Technical Documentation: Cosmo Page Management

This document outlines the technical implementation of the page management feature within the Cosmo application. It covers the AngularJS factories and controller responsible for creating, reading, updating, and deleting pages, as well as managing their associated data like tags, revisions, and local drafts.

---

### 1. Overall Component Overview

**Purpose:**
The Page Management system provides the core functionality for administrators or content editors to manage web pages within the Cosmo application. This includes creating new pages from scratch, editing existing page details (title, URL, content, metadata), managing page publication status (draft, published, scheduled), handling page revisions, and associating tags.

**Key Functionality & Architectural Role:**
*   **Data Interaction:** Communicates with a RESTful backend API to persist and retrieve page data.
*   **State Management:** Utilizes AngularJS factories (`Page`, `Users`) to hold global application state related to the current page being edited and the logged-in user.
*   **View Logic:** Employs an AngularJS controller (`pageCtrl`) to manage the user interface logic, data binding, and user interactions on the page editing screen.
*   **Local Drafts:** Implements a mechanism to save unsaved changes to `localStorage` and notify the user if a newer local version exists.
*   **Modularity:** The `REST` factory centralizes all API endpoint definitions, promoting reusability and maintainability.

**Fit within Broader Application:**
This system is a fundamental part of the Cosmo Content Management System (CMS). It enables the creation and modification of content that is presumably rendered to end-users on the frontend of the website. It integrates with other potential modules like theme management (evident from `page.themePages`) and user management.

---

### 2. Component Feature Details

The Page Management system is composed of several key AngularJS components:

#### A. `REST` Factory (`rest.js`)

*   **Purpose:** Centralizes all RESTful API endpoint definitions for the application.
*   **Technical Implementation:**
    *   Uses AngularJS's `$resource` service to create resource objects that simplify interaction with RESTful APIs.
    *   Each property in the returned object (e.g., `blocks`, `comments`, `content`) represents a specific API resource.
    *   URL templates with placeholders (e.g., `:blockID`, `:contentID`) are used for dynamic segment binding.
    *   The `@` prefix (e.g., `{ blockID: '@blockID' }`) indicates that the value for this parameter should be taken from the `blockID` property of the data object passed to the action method (e.g., when saving or updating).
    *   Custom actions like `update: { method: 'PUT' }` are defined for resources where the default `$save` (which typically POSTs) is not suitable for updates, or to provide a more semantically named update method.
*   **Dependencies:** `$resource`, `Page` (though `Page` is injected, it's not directly used within this factory's definition, suggesting it might be a leftover or intended for future interceptor logic).

#### B. `Page` Factory (`page.js`)

*   **Purpose:** Acts as a global, in-memory store (a simple service) for the properties of the page currently being created or edited. This allows data to be shared or persisted across different views or controllers if needed, though in this context, it primarily serves as the model for `pageCtrl`.
*   **Technical Implementation:**
    *   Returns a simple JavaScript object with predefined properties (e.g., `id`, `title`, `description`, `url`, `extras`).
    *   These properties are initialized with default/empty values.
    *   The `pageCtrl` reads from and writes to this factory's object to maintain the state of the page being edited.
*   **Dependencies:** None.

#### C. `Users` Factory (`users.js`)

*   **Purpose:** Acts as a global, in-memory store for the properties of the currently logged-in user.
*   **Technical Implementation:**
    *   Returns a simple JavaScript object with predefined properties (e.g., `id`, `username`, `email`, `role`).
    *   This data is likely populated upon user login and used by `pageCtrl` to associate an author with a page.
*   **Dependencies:** None.

#### D. `pageCtrl` Controller (`pageCtrl.js`) & `page.html` View

*   **Purpose:** Manages the logic and user interactions for the page creation/editing interface (`page.html`).
*   **Technical Implementation:**

    1.  **Initialization (`$scope.page`):**
        *   Copies initial page data from the `Page` factory into `$scope.page`. This decouples the controller's scope from the global `Page` service initially, allowing for local modifications before explicitly saving back.
        *   Sets a default `scheduleDate` if none exists or if it's a new page.
        *   Initializes `themePages` from the `Page` factory and sets a default page `type`.

    2.  **Unsaved Local Version Management:**
        *   On load (for existing pages), it checks `localStorage` for properties (`title`, `description`, etc.) prefixed with the current page's URL (`$routeParams.url`).
        *   If a `localStorage` value differs from the `Page` factory's value, `$scope.newerVersion` is set to `true`, displaying a notification bar.
        *   `$scope.localVersion()`: Restores page data from `localStorage` into the `Page` factory and clears the stored items. Broadcasts `contentGet` to refresh the scope.
        *   `$scope.deleteNewerVersion()`: Clears the locally stored version from `localStorage`.

    3.  **Page Deletion (`$scope.deletePage()`):**
        *   Uses `REST.content.delete` to remove the main page content.
        *   Subsequently calls delete on `REST.contentRevisions`, `REST.contentRevisionsExtras`, `REST.contentExtras`, and `REST.contentTags` to clean up all associated data.
        *   Broadcasts a notification and redirects to `/new`.
        *   A confirmation step is implemented using `$scope.page.confirm` in `page.html`.

    4.  **Data Synchronization with `Page` Factory:**
        *   `updatePage()` function: Copies data from the `Page` factory to `$scope.page`.
        *   `$scope.$on('contentGet', updatePage)`: Listens for an event (likely broadcast when page data is fetched or updated elsewhere) to refresh the scope.

    5.  **Form Field Interactions:**
        *   `$scope.updatePageType()`: Updates `Page.type` and broadcasts `settingsGet`.
        *   `$scope.titleChange()`: Updates `Page.title`. If `autoURL` is true (for new pages or empty URLs), it generates a URL slug from the title and updates `Page.url`.
        *   `$scope.descriptionChange()`: Updates `Page.description`.
        *   `$scope.urlChange()`: Updates `Page.url` and sets `autoURL` to `false`.
        *   `$scope.saveLocal()`: Explicitly saves current form field values to the `Page` factory and then to `localStorage` (prefixed with `$routeParams.url`). This is likely triggered by user input changes to ensure unsaved work isn't lost.

    6.  **Tag Autocomplete:**
        *   `$scope.autocompleteTags()`: When the user types in the tags input, it takes the last tag being typed and queries `REST.contentTags.query` to fetch suggestions.
        *   `$scope.selectSuggestion()`: Appends the selected suggestion to the tags list and clears suggestions.

    7.  **Page Saving (`$scope.savePage(duplicate)`):**
        *   This is the most complex function, handling creation, updates, and duplication.
        *   **Validations:**
            *   Checks for duplicate URL if `duplicate` is true.
            *   Ensures a page type is selected.
            *   Ensures URL is not empty or "new".
            *   Uses `Page.header` as fallback for `page.title` if empty.
        *   **Publishing Logic:**
            *   Determines `scheduleDate` based on `$scope.page.publish` status ('Y', 'N', 'schedule').
            *   If scheduling for a past date, it sets publish status to 'Y'.
        *   **Featured Image:** Retrieves `Page.extras.featured.src` if available.
        *   **API Calls (Create/Duplicate):**
            *   Calls `REST.content.save` with page data.
            *   `newPagePromise` (success callback):
                *   Saves tags using `REST.contentTags.save`.
                *   Saves a revision using `REST.contentRevisions.save`.
                *   `saveRevisionPromise` (success callback for revision save):
                    *   Saves extras (`Page.extras`) using `REST.contentExtras.save` and `REST.contentRevisionsExtras.save`.
                    *   `saveExtrasPromise` handles asynchronous saving of multiple extras and notifies/redirects upon completion.
        *   **API Calls (Update):**
            *   Calls `REST.content.update`.
            *   `updatePagePromise` (success callback):
                *   Deletes old tags (`REST.contentTags.delete`). `deleteTagsPromise` then saves new tags.
                *   Saves a new revision (`REST.contentRevisions.save`).
                *   `savePageRevisionPromise` (success callback for revision save):
                    *   Deletes old extras (`REST.contentExtras.delete`). `deleteExtrasPromise` then saves new extras and their revisions.
        *   **Notifications:** Uses `$rootScope.$broadcast('notify', ...)` with messages from `$translate` service for user feedback.
        *   **Redirection:** Uses `$location.path()` to navigate after successful operations.

*   **Dependencies:** `$scope`, `REST`, `$location`, `Page`, `$rootScope`, `$routeParams`, `$upload` (injected but not used in the provided snippet), `Users`, `$translate`.

---

### 3. Interface Specifications

#### A. `REST` Factory

| Resource Key             | API Endpoint Template                                      | Parameters                                     | Custom Methods |
| :----------------------- | :--------------------------------------------------------- | :--------------------------------------------- | :------------- |
| `blocks`                 | `api/blocks/:blockID`                                      | `blockID: '@blockID'`                          | `update: { method: 'PUT' }` |
| `blocksRequirements`     | `api/blocks/:blockID/requirements/:requirementID`          | `blockID: '@blockID', requirementID: '@requirementID'` | `update: { method: 'PUT' }` |
| `comments`               | `api/comments/:commentID`                                  | `commentID: '@commentID'`                      | `update: { method: 'PUT' }` |
| `content`                | `api/content/:contentID`                                   | `contentID: '@contentID'`                      | `update: { method: 'PUT' }` |
| `contentExtras`          | `api/content/:contentID/extras/`                           | `contentID: '@contentID'`                      |                |
| `contentRevisions`       | `api/content/:contentID/revisions/:revisionID`             | `contentID: '@contentID', revisionID: '@revisionID'` | `update: { method: 'PUT' }` |
| `contentRevisionsExtras` | `api/content/:contentID/revisions/:revisionID/extras/:extraID` | `revisionID: '@revisionID', contentID: '@contentID', extraID: '@extraID'` |                |
| `contentTags`            | `api/content/:contentID/tags/`                             | `contentID: '@contentID'`                      |                |
| `files`                  | `api/files/:fileID`                                        | `fileID: '@fileID'`                            | `update: { method: 'PUT' }` |
| `filesTags`              | `api/files/:fileID/tag/:tag`                               | `fileID: '@fileID', tag: '@tag'`               | `update: { method: 'PUT' }` |
| `menus`                  | `api/menus/:menuID`                                        | `menuID: '@menuID'`                            | `update: { method: 'PUT' }` |
| `modules`                | `api/modules/:moduleID`                                    | `moduleID: '@moduleID'`                        | `update: { method: 'PUT' }` |
| `sitemaps`               | `api/sitemaps/`                                            |                                                |                |
| `themes`                 | `api/themes/:themeID`                                      | `themeID: '@themeID'`                          | `update: { method: 'PUT' }` |
| `settings`               | `api/settings/`                                            |                                                | `update: { method: 'PUT' }` |
| `users`                  | `api/users/:userID`                                        | `userID: '@userID'`                            | `update: { method: 'PUT' }` |

*   **Return Value:** Each key returns a `$resource` object with methods like `get()`, `query()`, `save()`, `delete()`, and any custom defined methods (e.g., `update()`).

#### B. `Page` Factory

| Property         | Data Type      | Description                                       | Initial Value |
| :--------------- | :------------- | :------------------------------------------------ | :------------ |
| `id`             | Number         | Unique identifier of the page.                    | `0`           |
| `title`          | String         | Page title (often used for SEO and browser tab).  | `''`          |
| `description`    | String         | Page meta description (for SEO).                  | `''`          |
| `header`         | String         | Main heading content of the page.                 | `''`          |
| `subheader`      | String         | Secondary heading content.                        | `''`          |
| `body`           | String         | Main HTML content of the page.                    | `''`          |
| `url`            | String         | Page URL slug.                                    | `''`          |
| `type`           | String         | Page template/type (e.g., 'article', 'landing').  | `''`          |
| `published`      | String         | Publication status ('Y', 'N', 'schedule').        | `''`          |
| `published_date` | String/Number  | Timestamp or date string of publication.          | `''`          |
| `themePages`     | Array          | List of available page types/templates for theme. | `[]`          |
| `timestamp`      | String/Number  | Last modification timestamp.                      | `''`          |
| `extras`         | Array/Object   | Additional custom fields or metadata for the page.| `[]`          |
| `misc`           | Object         | Miscellaneous other data.                         | `{}`          |

*   **Return Value:** An object containing the above properties.

#### C. `Users` Factory

| Property   | Data Type | Description                        | Initial Value |
| :--------- | :-------- | :--------------------------------- | :------------ |
| `id`       | String    | Unique identifier of the user.     | `''`          |
| `username` | String    | User's login name.                 | `''`          |
| `name`     | String    | User's full name or display name.  | `''`          |
| `bio`      | String    | User's biography.                  | `''`          |
| `email`    | String    | User's email address.              | `''`          |
| `facebook` | String    | User's Facebook profile URL.       | `''`          |
| `twitter`  | String    | User's Twitter profile URL.        | `''`          |
| `photo`    | String    | URL to user's profile photo.       | `''`          |
| `role`     | String    | User's role (e.g., 'admin', 'editor'). | `''`          |

*   **Return Value:** An object containing the above properties.

#### D. `pageCtrl` Controller

*   **Injected Dependencies:**
    *   `$scope`: AngularJS scope object for data-binding.
    *   `REST`: Factory for API communication.
    *   `$location`: Service for URL manipulation and navigation.
    *   `Page`: Factory for current page state.
    *   `$rootScope`: Root scope for broadcasting global events (like notifications).
    *   `$routeParams`: Service to access URL parameters (e.g., current page's URL for `localStorage` keying).
    *   `$upload`: Service for file uploads (injected but not used in the provided code snippet).
    *   `Users`: Factory for current user data.
    *   `$translate`: Service for internationalization.
*   **Scope Variables (Partial List):**
    *   `$scope.page`: Object holding the current page form data, initialized from `Page` factory.
    *   `$scope.newerVersion`: Boolean, true if a newer local version is found in `localStorage`.
    *   `$scope.autoURL`: Boolean, true if the URL should be auto-generated from the title.
*   **Scope Functions (Partial List):**
    *   `localVersion()`: Loads page data from `localStorage`.
    *   `deleteNewerVersion()`: Deletes page data from `localStorage`.
    *   `deletePage()`: Deletes the current page via API.
    *   `updatePageType()`: Updates the page type in the `Page` factory.
    *   `titleChange()`, `descriptionChange()`, `urlChange()`: Handle input changes and update `Page` factory.
    *   `saveLocal()`: Saves current form data to `localStorage`.
    *   `autocompleteTags()`: Fetches tag suggestions.
    *   `selectSuggestion(tag)`: Adds a selected tag suggestion.
    *   `savePage(duplicate)`: Saves or duplicates the page.

#### E. `page.html` View Inputs/Outputs

*   **Inputs (Data bound from `pageCtrl`):**
    *   `newerVersion`: Controls visibility of the "newer version" banner.
    *   `page.confirm`: Controls visibility of delete confirmation buttons.
    *   `page.type`: Model for page type select.
    *   `page.themePages`: Options for page type select.
    *   `page.title`: Model for title input.
    *   `page.description`: Model for description textarea.
    *   `page.tags`: Model for tags input.
    *   `page.suggestions`: Data for tag suggestions display.
    *   `page.url`: Model for URL input.
    *   `page.publish`: Model for publish status radio buttons.
    *   `page.scheduleDate`: Model for schedule date input.
*   **Outputs (User Actions triggering `pageCtrl` functions):**
    *   Clicks on buttons: `deleteNewerVersion()`, `localVersion()`, `admin.sidebar='...'`, `admin.showAdminPanel=false`, `page.confirm=true`, `savePage(true)`, `savePage()`, `deletePage()`, `page.confirm=false`.
    *   Changes/Keyups on inputs: `updatePageType()`, `titleChange()`, `descriptionChange()`, `autocompleteTags()`, `urlChange()`.
    *   Clicks on labels/radio buttons for publish status.

---

### 4. Usage Documentation

#### A. `REST` Factory

To use the `REST` factory, inject it into an AngularJS component (controller, service, etc.).

```javascript
angular.module('cosmo').controller('someOtherCtrl', ['REST', function(REST) {
    // Get a specific content item
    REST.content.get({ contentID: 123 }, function(data) {
        console.log('Fetched content:', data);
    });

    // Save a new content item
    var newContent = {
        title: 'New Page Title',
        body: '<p>Hello World</p>',
        url: 'new-page-title',
        // ... other properties
    };
    REST.content.save(newContent, function(savedData) {
        console.log('Saved content:', savedData);
    });

    // Update an existing content item
    var existingContent = {
        contentID: 123, // Must match the ID in the URL
        title: 'Updated Page Title',
        // ... other properties
    };
    REST.content.update({ contentID: 123 }, existingContent, function(updatedData) {
        console.log('Updated content:', updatedData);
    });
}]);
```

#### B. `Page` and `Users` Factories

Inject `Page` or `Users` to access or modify their properties.

```javascript
angular.module('cosmo').controller('anotherCtrl', ['Page', 'Users', function(Page, Users) {
    console.log('Current Page Title:', Page.title);
    Page.title = 'Programmatically Changed Title';

    console.log('Current User ID:', Users.id);
}]);
```

#### C. `pageCtrl` and `page.html`

These are typically used together within a route definition (e.g., using `ngRoute` or `ui-router`).

**Example Route (Conceptual - actual router config not provided):**

```javascript
// In your app.config.js or similar
$routeProvider
    .when('/new', {
        templateUrl: 'core/html/page.html', // Path to your page.html
        controller: 'pageCtrl'
    })
    .when('/:url*', { // For editing existing pages, assuming URL is a key
        templateUrl: 'core/html/page.html',
        controller: 'pageCtrl',
        resolve: { // Example: Pre-load page data before controller instantiation
            pageData: function(REST, $route, Page) {
                // This is a simplified example; actual loading logic might be more complex
                // and would populate the Page factory
                return REST.content.get({ url: $route.current.params.url }, function(data) {
                    angular.extend(Page, data); // Populate the Page factory
                    return data;
                }).$promise;
            }
        }
    });
```

**Initialization Requirements:**
*   The `cosmo` AngularJS module must be defined.
*   All dependencies (`$resource`, `$location`, `$rootScope`, `$routeParams`, `$upload`, `$translate`) must be available.
*   The `Page` factory should ideally be populated with data for the page to be edited before `pageCtrl` initializes, or `pageCtrl` needs logic to fetch it (as partially seen with `localStorage` and `$routeParams`).
*   The `Users` factory should be populated with the current user's data (e.g., after login).
*   The `translate` filter/directive and `$translate` service (from `angular-translate` or similar) must be configured for internationalization.

---

### 5. Accessibility Features

The provided `page.html` has some basic accessibility considerations but could be improved:

*   **Labels for Form Elements:**
    *   `<label class="type" for="type" translate="type"></label>` - The `for` attribute should match the `id` of the associated `select` element. The `select` currently lacks an `id="type"`.
    *   `<label translate="title"></label>` - This label is not explicitly associated with the title `input` using `for` and `id`.
    *   `<label for="description" translate="description"></label>` - Correctly uses `for`, but the `textarea` lacks `id="description"`.
    *   `<label for="tags" translate="tags"></label>` - Correctly uses `for`, but the tags `input` lacks `id="tags"`.
    *   `<label for="url" translate="url"></label>` - Correctly uses `for`, but the URL `input` lacks `id="url"`.
    *   Publish status radio buttons and labels: `for="Y"`, `for="N"`, `for="schedule"` correctly associate labels with their respective radio inputs.
*   **Icon Buttons:**
    *   `<a ng-click="..."><i class="fa fa-angle-left"></i></a>` and `<a class="sidebar-close" ng-click="..."><i class="fa fa-times"></i></a>` use Font Awesome icons. These should have accessible names, e.g., via `aria-label` or visually hidden text:
        ```html
        <a ng-click="..." aria-label="{{ 'go_back' | translate }}"><i class="fa fa-angle-left"></i></a>
        <a class="sidebar-close" ng-click="..." aria-label="{{ 'close_panel' | translate }}"><i class="fa fa-times"></i></a>
        ```
*   **Dynamic Content (`ng-show`):**
    *   Content appearing/disappearing (e.g., `newerVersion` banner, `page.confirm` section, `tag-suggestions`, `schedule-triangle`) should ideally use `aria-live` regions on a parent container if the changes need to be announced to screen reader users. For example, notifications broadcast via `$rootScope.$broadcast('notify', ...)` should be rendered within an `aria-live` region.
*   **Keyboard Navigation & Focus Management:**
    *   Standard HTML elements (`button`, `input`, `select`, `a`) are keyboard navigable by default.
    *   Focus management for dynamically appearing elements (like modals or suggestion lists) should be handled to ensure a logical tab order and that focus moves appropriately. The tag suggestions list, for instance, should be navigable using arrow keys, and Escape should close it.
*   **Internationalization (`translate` directive):**
    *   The use of the `translate` directive is a good accessibility practice as it allows UI text to be localized, making the application accessible to users in different languages.

**Recommendations for Improvement:**
1.  Ensure all form inputs have corresponding `id` attributes that match the `for` attributes of their `label`s.
2.  Add `aria-label` or screen-reader-only text to icon buttons for clarity.
3.  Consider `aria-live` regions for dynamic content updates and notifications.
4.  Implement robust keyboard navigation for custom widgets like the tag suggestions.
5.  Ensure sufficient color contrast for text and UI elements.

---

### 6. Conclusion

**Benefits and Value:**
The Page Management system within Cosmo provides a robust and feature-rich interface for content creation and administration.
*   **Centralized API Management:** The `REST` factory offers a clean and maintainable way to manage API interactions.
*   **Stateful Editing:** The `Page` factory allows for a persistent state of the page being edited, which is crucial for complex forms and for potentially sharing data across different parts of the editing interface (if it were more componentized).
*   **User-Friendly Features:** Local draft saving, URL auto-generation, tag suggestions, and scheduled publishing enhance the user experience for content editors.
*   **Revision History:** Storing revisions of content and extras is vital for content integrity and rollback capabilities.

**Contribution to Overall User Experience:**
This system streamlines the process of page creation and editing, making it efficient for users to manage website content. The clear separation of concerns (API, data state, view logic) contributes to a more stable and predictable experience. Notifications provide essential feedback to the user.

**Best Practices for Implementation:**
*   **Separation of Concerns:** The code generally follows good separation by using factories for data and services, and a controller for view logic.
*   **Use of `$resource`:** Leveraging `$resource` for RESTful services is a standard AngularJS best practice.
*   **Error Handling:** The `savePage` function includes error callbacks for API requests, which is good. This should be consistently applied.
*   **Code Comments:** The code includes comments explaining the purpose of different sections and functions, which is helpful for maintainability. The `// Depreciate?` comments indicate areas for future review.
*   **Modularity in Saving:** The `savePage` function is quite long and handles many asynchronous operations. While it uses promise-like callbacks, further breaking it down into smaller, more manageable services or helper functions could improve readability and testability, especially for the complex chain of saves (content -> tags -> revision -> extras -> revision extras).
*   **State Management:** For more complex applications, a more robust state management solution (beyond simple factories) might be considered, but for the scope shown, `Page` and `Users` factories serve their purpose as global data stores.
*   **Accessibility:** Continue to prioritize accessibility by implementing the recommendations above to ensure the application is usable by the widest possible audience.

This Page Management system forms a critical part of the Cosmo application, enabling effective content lifecycle management.

---

### Tokens: {'input_tokens': 6477, 'output_tokens': 8966, 'reasoning_tokens': 2349}
### Execution time: 100.39509296417236
