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
First, the user has provided Angular.js code and asked me to create comprehensive technical documentation based on specific steps. The code includes several files: rest.js, page.html, page.js, users.js, and pageCtrl.js. This seems to be part of an Angular application for managing pages, likely in a CMS or similar system.

The steps to follow are:

1. Create comprehensive technical documentation for the provided Angular.js code.

2. Document component overview.

3. Detail all component features.

4. Document interface specifications.

5. Provide usage documentation.

6. Document accessibility features.

7. Include a conclusion section.

I need to focus on technical accuracy, completeness, and use clear, concise language for developers.

The code appears to be centered around the "pageCtrl" controller, which handles page creation and editing. There's also a REST factory for API communications, a Page factory for storing page data, a Users factory, and the HTML template for the page editor.

I should treat the "pageCtrl" as the main component here, since it's the controller that ties everything together. The documentation should cover the controller, its associated template, and the factories it depends on.

Organize the documentation:

- **Component Overview**: Introduce the pageCtrl controller and its purpose.

- **Key Functionality**: Summarize what it does, like creating, editing, deleting pages, handling local storage for unsaved changes, etc.

- **Architectural Role**: Explain how it fits in the Angular app, using services like REST, Page, Users, etc.

- **Detail All Component Features**: List features like auto-generating URLs, tag autocompletion, saving pages, handling revisions, etc., and describe their implementation.

- **Interface Specifications**: For the controller, document the dependencies injected (like $scope, REST, etc.), and perhaps the methods and variables it exposes.

- **Usage Documentation**: Provide sample code on how to use this controller, perhaps in a route configuration.

- **Accessibility Features**: Check the HTML for any ARIA attributes or keyboard navigation. From the page.html, there are buttons with ng-click, but no explicit ARIA roles are visible. I need to document what's there and suggest improvements if necessary.

- **Conclusion**: Summarize benefits and best practices.

Since the code is in Angular.js (Angular 1.x), I need to use terminology appropriate for that version, like controllers, factories, directives, etc.

Start by identifying the main component. The controller is 'pageCtrl', and it's associated with the 'page.html' template. The factories are 'REST', 'Page', and 'Users'.

For interface specifications, in Angular 1.x, controllers don't have props like in React; instead, they have injected dependencies. So, I should document the injected services and the scope variables.

For accessibility, the HTML has elements like buttons with ng-click, but no ARIA attributes are present in the provided code. I should document what's implemented and note that accessibility might need enhancement.

Now, outline the documentation structure:

1. **Component Overview**

   - Brief introduction

   - Summary of key functionality

   - Architectural role

2. **Detailed Features**

   - List each feature with description and implementation details

3. **Interface Specifications**

   - Table for injected dependencies

   - Table for scope variables or methods

4. **Usage Documentation**

   - Sample code for route configuration

   - Common use cases

5. **Accessibility Features**

   - List any ARIA roles, attributes

   - Explain keyboard navigation if present

6. **Conclusion**

   - Benefits

   - Best practices

Ensure the language is clear and concise. Use code snippets where appropriate.

Finally, since the user mentioned proficiency in React and Angular, but the code is Angular.js, I'll stick to Angular 1.x concepts.

### Answer:
# Technical Documentation for Angular.js Page Management Component

This document provides comprehensive technical documentation for the provided Angular.js (Angular 1.x) code, focusing on the `pageCtrl` controller, its associated template (`page.html`), and dependent factories (`REST`, `Page`, and `Users`). The documentation is tailored for developers familiar with Angular.js, emphasizing technical accuracy, completeness, and clarity. The code implements a page management system for a content management application, allowing users to create, edit, delete, and manage pages with features like auto-URL generation, tag autocompletion, and revision handling.

The documentation follows the specified steps: component overview, detailed features, interface specifications, usage documentation, accessibility features, and a conclusion.

---

## 1. Component Overview

### Introduction
The `pageCtrl` controller is a core component of an Angular.js application (module `cosmo`) that handles the creation, editing, and deletion of pages in a content management system (CMS). It integrates with a RESTful backend to manage page data, revisions, tags, and extras. The controller works in conjunction with the `page.html` template to provide a user interface for page management, including form inputs, buttons for actions, and dynamic behaviors like auto-completion and local storage for unsaved changes.

### Key Functionality
- **Page CRUD Operations**: Supports creating new pages, updating existing ones, duplicating pages, and deleting pages along with associated data (e.g., revisions, tags, extras).
- **Dynamic Form Handling**: Manages user inputs for page attributes (e.g., title, description, URL, tags, publish status) and provides real-time updates, such as auto-generating URLs from titles and autocompleting tags.
- **Unsaved Changes Management**: Uses local storage to detect and handle unsaved changes from previous sessions, offering options to revert or discard them.
- **Publishing and Scheduling**: Allows pages to be published immediately, saved as drafts, or scheduled for future publication, with date handling.
- **Integration with Backend**: Leverages the `REST` factory to communicate with a RESTful API for data persistence and retrieval.
- **Event Broadcasting**: Uses Angular's event system (e.g., `$rootScope.$broadcast`) to notify other parts of the application about changes, such as saving or deleting pages.

### Architectural Role
In the broader application, `pageCtrl` serves as a controller within the MVC (Model-View-Controller) pattern of Angular.js. It acts as the intermediary between the view (`page.html`) and the model (factories like `Page` and `Users`), handling user interactions and business logic. The controller depends on:
- **Factories**: `REST` for API calls, `Page` for storing page data globally, and `Users` for user-specific data (e.g., author ID).
- **Services**: Angular services like `$location`, `$routeParams`, and `$translate` for routing, parameter handling, and internationalization.
- **Scope**: Binds data and methods to the view for dynamic updates.

This component fits into a larger CMS application by providing a dedicated interface for page management, which is likely accessed via routes (e.g., `/new` for new pages or `/page-url` for editing). It promotes reusability by relying on factories for data management and ensures data consistency through API interactions.

---

## 2. Detailed Component Features

This section lists and describes each major feature of the `pageCtrl` controller, including its technical implementation, dependencies, and requirements. Features are derived from the controller's logic, the `page.html` template, and related factories.

### Feature List and Descriptions

1. **Page Initialization and Data Binding**
   - **Description**: Initializes the page object with data from the `Page` factory and handles loading of theme-specific page types. It also checks for unsaved changes in local storage and sets up the form for editing or creating pages.
   - **Technical Implementation**:
     - Uses `$scope.page` to bind data from `Page` factory to the view.
     - Checks local storage for unsaved changes using `localStorage.getItem` and sets `$scope.newerVersion` flag if discrepancies are found.
     - Watches for changes via `$scope.$on('contentGet')` to update the page data dynamically.
     - Dependencies: `Page` factory, `$routeParams`, `$location`.
     - Requirements: The `Page` factory must be populated with initial data (e.g., via a resolver in route configuration).

2. **Auto-URL Generation from Title**
   - **Description**: Automatically generates a URL slug from the page title when creating a new page, replacing spaces with hyphens, converting to lowercase, and removing punctuation.
   - **Technical Implementation**:
     - Triggered by `ng-keyup` on the title input in `page.html`, calling `$scope.titleChange()`.
     - Logic in `$scope.titleChange()` updates `Page.url` and only applies auto-generation if the URL is not manually set (controlled by `$scope.autoURL` flag).
     - Uses string manipulation methods like `toLowerCase()`, `replace()`, and regular expressions.
     - Dependencies: None beyond Angular core.
     - Requirements: Must be used only for new pages; manual URL changes disable auto-generation.

3. **Tag Autocompletion**
   - **Description**: Provides suggestions for tags based on backend data as the user types, allowing selection from a dropdown list.
   - **Technical Implementation**:
     - Bound to an input with `ng-change` in `page.html`, calling `$scope.autocompleteTags()`.
     - Queries the backend using `REST.contentTags.query()` with the last tag in the input array.
     - Displays suggestions in a div with `ng-repeat` and handles selection via `$scope.selectSuggestion()`, which updates the tags array.
     - Dependencies: `REST` factory for API calls.
     - Requirements: Backend must support querying tags (e.g., via `api/content/:contentID/tags/` endpoint).

4. **Unsaved Changes Detection and Management**
   - **Description**: Detects unsaved changes from previous sessions and provides options to revert, discard, or save them, enhancing user experience by preventing data loss.
   - **Technical Implementation**:
     - On initialization, compares local storage values with `Page` factory data using `localStorage.getItem` and sets `$scope.newerVersion`.
     - Methods like `$scope.localVersion()` restore data from local storage and clear it, while `$scope.deleteNewerVersion()` removes stored data.
     - Saves changes to local storage in `$scope.saveLocal()` on keyup events for fields like title and description.
     - Dependencies: `localStorage` (browser API), `$routeParams` for key generation.
     - Requirements: Local storage must be enabled in the browser; keys are based on the page URL to avoid conflicts.

5. **Page Saving and Updating (Including Duplication)**
   - **Description**: Handles saving new pages, updating existing ones, or duplicating pages, including validation, API calls, and handling of related data like tags and extras.
   - **Technical Implementation**:
     - Called via `ng-click` on save/duplicate buttons, invoking `$scope.savePage(duplicate)`.
     - Performs validations (e.g., checks for empty URL or page type), then uses `REST.content.save()` or `REST.content.update()` for CRUD operations.
     - Manages revisions by calling `REST.contentRevisions.save()` and handles associated data (e.g., tags via `REST.contentTags.save()`, extras via `REST.contentExtras.save()`).
     - For duplication, ensures a different URL is used to avoid conflicts.
     - Uses promises and callbacks (e.g., `newPagePromise`, `updatePagePromise`) for asynchronous API handling and error notification via `$rootScope.$broadcast`.
     - Dependencies: `REST` factory, `Users` for author ID, `$translate` for internationalization.
     - Requirements: Backend must support all REST endpoints (e.g., `api/content`, `api/content/tags`); date parsing for scheduling.

6. **Page Deletion**
   - **Description**: Deletes a page and all associated data (e.g., revisions, tags, extras) with confirmation.
   - **Technical Implementation**:
     - Triggered by `ng-click` on a delete button, setting a confirmation flag and calling `$scope.deletePage()` on confirm.
     - Uses `REST.content.delete()` and related delete methods (e.g., `REST.contentRevisions.delete()`) to remove data.
     - Redirects to a new page route after deletion and broadcasts a success notification.
     - Dependencies: `REST` factory, `$location`, `$translate`.
     - Requirements: Confirmation UI must be handled in the template; backend must cascade deletes or handle related resources.

7. **Publishing and Scheduling**
   - **Description**: Manages page publish status (publish now, draft, or schedule), with date handling for scheduled publication.
   - **Technical Implementation**:
     - Controlled by radio buttons in `page.html` with `ng-model` bound to `page.publish`.
     - In `$scope.savePage()`, calculates the publish date based on status (e.g., current time for immediate publish, parsed date for scheduled).
     - Uses `Date.parse()` and timestamp conversion for scheduling logic.
     - Dependencies: None beyond Angular core.
     - Requirements: Input type `datetime-local` for scheduling; backend must handle `published` and `published_date` fields.

8. **Event Handling and Broadcasting**
   - **Description**: Broadcasts events to other parts of the application for synchronization, such as notifying of content changes or errors.
   - **Technical Implementation**:
     - Uses `$rootScope.$broadcast` to emit events like `'notify'` for messages or `'contentGet'` for data refresh.
     - Listens for events via `$scope.$on` to update the page data.
     - Dependencies: `$rootScope`, `$scope`.
     - Requirements: Other controllers or directives must listen for these events to react appropriately.

---

## 3. Interface Specifications

In Angular.js, controllers do not have "props" like in React; instead, they rely on injected dependencies and scope variables. This section documents:
- **Injected Dependencies**: Services and factories injected into the controller.
- **Scope Variables and Methods**: Data and functions exposed to the view.
- **Return Values**: Controllers typically do not return values; they modify scope and broadcast events.

### Injected Dependencies Table

| Name          | Data Type | Description | Required/Optional |
|---------------|----------|-------------|-------------------|
| `$scope`     | Object  | Angular scope for binding data and methods to the view. | Required |
| `REST`       | Object  | Factory for RESTful API communications (e.g., `$resource` instances). | Required |
| `$location`  | Object  | Angular service for handling URL changes and routing. | Required |
| `Page`       | Object  | Factory storing global page data (e.g., title, URL). | Required |
| `$rootScope` | Object  | Angular root scope for broadcasting events across the application. | Required |
| `$routeParams` | Object | Angular service for accessing route parameters (e.g., page URL). | Required |
| `$upload`    | Object  | Service for file uploads (not heavily used in this code; may be for future extensions). | Optional |
| `Users`      | Object  | Factory storing user data (e.g., ID for authorship). | Required |
| `$translate` | Object  | Service for internationalization, providing translated strings. | Required |

### Scope Variables and Methods Table

| Name          | Data Type | Description | Required/Optional |
|---------------|----------|-------------|-------------------|
| `page`       | Object  | Holds page data (e.g., `id`, `title`, `url`, `tags`). Bound to form inputs in `page.html`. | Required |
| `newerVersion` | Boolean | Flag indicating unsaved changes from local storage. | Optional |
| `autoURL`    | Boolean | Controls whether URL auto-generation is active. | Optional |
| `confirm`    | Boolean | Flag for delete confirmation UI. | Optional |
| `localVersion()` | Function | Reverts to locally stored unsaved changes and clears storage. | Optional |
| `deleteNewerVersion()` | Function | Discards unsaved changes by clearing local storage. | Optional |
| `deletePage()` | Function | Deletes the page and associated data via API calls. | Required for delete functionality |
| `updatePageType()` | Function | Updates the page type in the `Page` factory and broadcasts an event. | Optional |
| `titleChange()` | Function | Handles title changes, auto-generating URL if applicable. | Required for auto-URL feature |
| `descriptionChange()` | Function | Saves description changes to the `Page` factory. | Required for real-time updates |
| `urlChange()` | Function | Saves URL changes to the `Page` factory. | Required for manual URL editing |
| `saveLocal()` | Function | Saves current page data to local storage on changes. | Required for unsaved changes feature |
| `autocompleteTags()` | Function | Queries backend for tag suggestions based on input. | Required for tag autocompletion |
| `selectSuggestion(tag)` | Function | Selects a tag from suggestions and updates the tags array. | Required for tag selection |
| `savePage(duplicate)` | Function | Saves or updates the page, handling validation, API calls, and duplication. | Required for save functionality |

### Return Values or Output Formats
- The controller does not explicitly return values.
- Outputs are handled through:
  - Scope modifications (e.g., updating `$scope.page`).
  - Event broadcasting (e.g., `'notify'` with a message object).
  - Side effects like route changes via `$location.path()`.

---

## 4. Usage Documentation

### Sample Code for Implementation
To use `pageCtrl`, it must be associated with a route in the Angular application. Below is a sample route configuration in an Angular module (e.g., in `app.js`).

```js
angular.module('cosmo').config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/new', {
            templateUrl: 'path/to/page.html', // Ensure this points to the correct template
            controller: 'pageCtrl',
            resolve: {
                // Optional: Resolve dependencies, e.g., load initial page data
                pageData: ['Page', function(Page) {
                    // Populate Page factory with default or fetched data
                    return Page; // Or fetch from API if needed
                }]
            }
        })
        .when('/:url', {
            templateUrl: 'path/to/page.html',
            controller: 'pageCtrl'
        });
}]);
```

### Common Use Cases and Patterns
- **Creating a New Page**: Navigate to `/new`. The controller initializes a blank page, and users can fill in details. Auto-URL generation and tag autocompletion enhance usability.
- **Editing an Existing Page**: Access via a URL like `/about-us`. The controller loads existing data and checks for unsaved changes.
- **Duplicating a Page**: Click the "duplicate" button to create a copy with a new URL, useful for templating content.
- **Handling Unsaved Changes**: If a user closes the browser, changes are stored locally. On revisit, they can revert or discard.
- **Best Practices for Usage**:
  - Ensure the `Page` factory is reset or initialized properly between routes to avoid stale data.
  - Use event listeners in other controllers to react to broadcasts (e.g., refresh a page list after saving).
  - Validate user inputs on the client-side and server-side to prevent errors.

### Initialization Requirements
- **Dependencies**: Ensure all injected services (e.g., `REST`, `Page`) are defined in the module.
- **Template Integration**: The `page.html` must be correctly referenced in routes. It uses Angular directives like `ng-model`, `ng-click`, and `ng-change`.
- **Global Setup**: The `REST` factory must be configured with correct API endpoints, and `$translate` should be set up for language support.

---

## 5. Accessibility Features

The provided code has limited explicit accessibility features. The `page.html` template includes interactive elements like buttons and inputs, but lacks ARIA attributes or robust keyboard navigation. This section documents what is implemented and suggests improvements.

### List of ARIA Roles and Attributes Implemented
- **None Explicitly Defined**: The code does not include any ARIA roles (e.g., `role="button"`) or attributes (e.g., `aria-label`, `aria-expanded`) in the provided `page.html`. All buttons use `ng-click` but rely on native HTML elements (e.g., `<button>`) for basic accessibility.
- **Implicit Accessibility**:
  - Buttons have `type="button"` to prevent form submission issues.
  - Labels are associated with inputs using `for` attributes (e.g., `<label for="type">`), which supports screen readers.
  - The tag suggestions div uses `ng-repeat`, but lacks ARIA attributes to indicate it as a listbox or combobox.

### Explanation of Support for Assistive Technologies
- **Current Support**: 
  - Native HTML elements (e.g., `<input>`, `<textarea>`, `<button>`) provide basic accessibility, allowing screen readers to interpret content. For example, the radio buttons for publish status can be navigated and read by assistive technologies.
  - Focus management is partially handled by Angular's default behavior, but no custom focus trapping or announcements are implemented.
- **Keyboard Navigation**: 
  - Buttons and inputs are focusable by default, supporting tab navigation. However, there is no explicit handling for keyboard-only users (e.g., no `tabindex` adjustments or custom key handlers).
  - The confirmation dialog for deletion uses conditional rendering (`ng-show`), but it may not be announced properly to screen readers.

### Recommendations for Improvement
- Add ARIA attributes: For example, add `aria-label` to buttons (e.g., `<button aria-label="Save page" ...>`), and use `role="listbox"` for the tag suggestions div.
- Enhance keyboard navigation: Implement custom directives to handle focus management, such as moving focus to the first input on load.
- Test with assistive technologies: Use tools like NVDA or VoiceOver to ensure all interactive elements are announced correctly.

---

## 6. Conclusion

### Summary of Benefits and Value
The `pageCtrl` controller and its associated components provide a robust, user-friendly interface for page management in an Angular.js-based CMS. Key benefits include seamless integration with a RESTful backend, real-time data handling, and features like unsaved changes recovery, which enhance productivity and reduce data loss. By leveraging Angular's dependency injection and event system, it promotes maintainability and scalability, making it a valuable asset for developers building content-driven applications.

### Contribution to User Experience
This component improves the overall user experience by offering intuitive editing tools, validation, and scheduling options, allowing content creators to focus on content rather than technical details. It supports internationalization and dynamic updates, ensuring a responsive and accessible interface when enhanced.

### Best Practices for Implementation
- **Code Organization**: Keep factories separate for reusability and test them independently.
- **Error Handling**: Expand on existing notifications to handle all API errors gracefully.
- **Performance**: Minimize watchers and use debouncing for events like keyup to improve efficiency.
- **Security**: Sanitize user inputs (e.g., URLs) to prevent injection attacks.
- **Upgrades**: Consider migrating to Angular (2+) or modern frameworks like React for better performance and accessibility, as the user has expertise in those areas.

This documentation ensures developers can understand, implement, and extend the component effectively. For further questions or customizations, refer to the source code or consult Angular.js best practices.

### Tokens: {'input_tokens': 5553, 'output_tokens': 4104, 'reasoning_tokens': 768}
### Execution time: 30.845196962356567
