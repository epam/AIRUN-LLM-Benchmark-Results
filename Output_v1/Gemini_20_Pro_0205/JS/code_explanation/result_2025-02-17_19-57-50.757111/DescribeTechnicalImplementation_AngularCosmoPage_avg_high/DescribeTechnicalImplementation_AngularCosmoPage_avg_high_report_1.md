I have the following application code that needs to describe in a form of technical documentation

rest.js
```js
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

page.html
```html
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

page.js
```js
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

users.js
```js
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

pageCtrl.js
```js
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


The documentation should cover the following aspects:
- Overview: A brief introduction to the component, including its purpose and key features.
- Features: A detailed list of the component's features. This should include:
- Props: A table or list describing each prop the component accepts, including the prop's name, type, description, and whether it is optional or required.
- Usage: An example of how to use the component in frontend application, including a sample code snippet.
- Accessibility: A detailed explanation of the accessibility features of the component, including any ARIA roles and attributes used. Explain how these features make the component accessible to users with assistive technologies.
- Conclusion: A brief closing statement summarizing the component's benefits and its contribution to creating a user-friendly, accessible UI.
## Run 1:
### Answer:
Okay, let's break down this Angular application into comprehensive technical documentation.  I'll focus on the key components: `REST` factory, `Page` factory, `Users` factory, `pageCtrl` controller, and the associated `page.html` template. I'll structure the documentation as you requested, covering overview, features, props (where applicable), usage, accessibility, and conclusion.

```markdown
# Cosmo Frontend Components Documentation

This document provides a technical overview of the core frontend components of the Cosmo application, built with AngularJS.  It covers the REST interaction layer, data models, controllers, and the main page editing template.

---

## 1. REST Factory (`rest.js`)

### Overview

The `REST` factory provides an abstraction layer for interacting with the backend API. It leverages AngularJS's `$resource` service to define endpoints and methods for CRUD (Create, Read, Update, Delete) operations on various data resources. This factory promotes code reusability and maintainability by centralizing API communication logic.

### Features

*   **Resource Definition:** Defines multiple `$resource` objects, each representing a different API endpoint (e.g., `blocks`, `comments`, `content`, `files`, etc.).
*   **CRUD Operations:**  Provides methods for common HTTP verbs:
    *   `GET`: (Implicit in `$resource`) for retrieving data.
    *   `POST`: (Implicit in `$resource`) for creating new resources.
    *   `PUT`:  Explicitly defined via the `update` method for updating existing resources.
    *   `DELETE`: (Implicit in `$resource`) for deleting resources.
*   **Parameterized Endpoints:** Uses route parameters (e.g., `:blockID`, `:commentID`) to interact with specific resources.
*   **Custom Actions:** Defines custom actions like `update` to handle specific HTTP methods (PUT in this case).

### Usage

The `REST` factory is injected into controllers and other services where API interaction is needed.  Here's how it's used in `pageCtrl.js`:

```javascript
// In pageCtrl.js
angular.module('cosmo').controller('pageCtrl', ['$scope', 'REST', ... , function($scope, REST, ...) {

    // ...

    // Delete a page
    $scope.deletePage = function(){
        REST.content.delete({ contentID: $scope.page.id }, function(data){
            // Success callback
        });

        // ... other delete operations ...
    };

    // Save a new page
    $scope.savePage = function(duplicate){
        // ...
        REST.content.save({
            title: $scope.page.title,
            // ... other data ...
        }, newPagePromise, function(){ // Error
            // Error callback
        });
        // ...
    };

    // Update an existing page
    $scope.savePage = function(duplicate){
      //...
      REST.content.update({
                contentID: Page.id,
                title: $scope.page.title,
                //other data
            }, updatePagePromise, function(data){ // Error
               //error callback
            });
      //...
    }
}]);
```

This demonstrates how to use `REST.content.delete()`, `REST.content.save()`, and `REST.content.update()` to interact with the `/api/content` endpoint.  Similar patterns apply to other resources defined in the `REST` factory.

### Accessibility

The `REST` factory itself doesn't directly handle UI rendering and therefore doesn't have specific accessibility considerations.  Accessibility is primarily the responsibility of the components that consume the data provided by this factory.

### Conclusion

The `REST` factory is a crucial component for abstracting backend communication. It provides a clean and consistent interface for interacting with the API, making the frontend code more organized and easier to maintain.

---

## 2. Page Factory (`page.js`)

### Overview

The `Page` factory serves as a data model for representing a page within the Cosmo application. It defines the structure and default values for page properties.  It acts as a single source of truth for page data across different parts of the application.

### Features

*   **Data Structure:** Defines properties like `id`, `title`, `description`, `url`, `type`, `published`, `themePages`, etc., representing the attributes of a page.
*   **Default Values:** Initializes properties with default values, ensuring a consistent starting point for new pages.
*   **Global Access:** Provides a shared object that can be injected into controllers and services to access and modify page data globally.

### Props

The `Page` factory doesn't accept props in the traditional sense (like a React component).  Instead, it defines the *shape* of the page data.  Here's a table representing the "props" (data properties):

| Property         | Type      | Description                                                                  | Optional/Required |
| ---------------- | --------- | ---------------------------------------------------------------------------- | ----------------- |
| `id`             | Number    | Unique identifier for the page.                                              | Required          |
| `title`          | String    | Title of the page.                                                           | Required          |
| `description`    | String    | Description of the page (for SEO and metadata).                               | Optional          |
| `header`         | String    | Header content of the page.                                                  | Optional          |
| `subheader`      | String    | Subheader content of the page.                                               | Optional          |
| `body`           | String    | Main body content of the page.                                                | Optional          |
| `url`            | String    | URL of the page.                                                             | Required          |
| `type`           | String    | Type of the page (e.g., template name).                                      | Required          |
| `published`      | String    | Publication status ('Y', 'N', or 'schedule').                               | Required          |
| `published_date` | String    | Date when the page was published (timestamp).                                | Optional          |
| `themePages`     | Array     | List of available page types for the current theme.                           | Required          |
| `timestamp`      | String    | Timestamp of the last modification.                                         | Optional          |
| `extras`         | Array     | Array to store additional, custom data associated with the page.             | Optional          |
| `misc`           | Object    | Object to store miscellaneous data.                                          | Optional          |
| `scheduleDate` | Date    | Date and time for scheduled publishing.                                          | Optional          |
|`tags`           | Array     | Array of tags associated with the page.                                       | Optional          |

### Usage

```javascript
// In pageCtrl.js
angular.module('cosmo').controller('pageCtrl', ['$scope', 'Page', ... , function($scope, Page, ...) {

    // Initialize $scope.page with data from the Page factory
    $scope.page = {
        id: Page.id,
        title: Page.title,
        // ... other properties ...
    };

    // ...

    // Update the page type
    $scope.updatePageType = function(){
        Page.type = $scope.page.type;
        // ...
    };

    // ...
}]);
```

This shows how the `Page` factory is injected and used to initialize and update page data within the `pageCtrl` controller. Changes made to `Page` are reflected globally.

### Accessibility

Similar to the `REST` factory, the `Page` factory is a data model and doesn't directly handle UI. Accessibility is handled in the components that use this data.

### Conclusion

The `Page` factory provides a centralized and well-defined data structure for pages, promoting consistency and simplifying data management across the application.

---

## 3. Users Factory (`users.js`)

### Overview
The `Users` factory is designed to store and manage data related to the currently logged-in user. It provides a centralized location to access user information throughout the application.

### Features
*   **User Data Storage:** Defines properties such as `id`, `username`, `name`, `bio`, `email`, `facebook`, `twitter`, `photo`, and `role` to represent user attributes.
*   **Centralized Access:** Allows any component (controller, service, etc.) to access the current user's data by injecting the `Users` factory.

### Props
Like the `Page` factory, `Users` defines the shape of user data rather than accepting props:

| Property   | Type   | Description                                      | Optional/Required |
| ---------- | ------ | ------------------------------------------------ | ----------------- |
| `id`       | String | Unique identifier for the user.                  | Required          |
| `username` | String | User's login username.                           | Required          |
| `name`     | String | User's full name.                                | Optional          |
| `bio`      | String | User's biographical information.                  | Optional          |
| `email`    | String | User's email address.                            | Required          |
| `facebook` | String | User's Facebook profile URL.                      | Optional          |
| `twitter`  | String | User's Twitter profile URL.                       | Optional          |
| `photo`    | String | URL of the user's profile picture.               | Optional          |
| `role`     | String | User's role (e.g., admin, editor).               | Required          |

### Usage
```javascript
// Example (hypothetical - showing how it *would* be used)
angular.module('cosmo').controller('SomeController', ['Users', function(Users) {
    var vm = this;
    vm.currentUser = Users; // Expose user data to the template

    // ... use vm.currentUser.name, vm.currentUser.email, etc. ...
}]);
```

### Accessibility
As a data model, the `Users` factory doesn't directly impact UI accessibility.

### Conclusion
The `Users` factory provides a simple and effective way to manage and access user data, ensuring consistency and ease of use across the application.

---

## 4. Page Controller (`pageCtrl.js`)

### Overview

The `pageCtrl` controller is responsible for managing the logic related to creating, editing, and deleting pages. It interacts with the `REST` factory for API communication, the `Page` factory for page data, and the `Users` factory for user information. It also handles user interactions within the `page.html` template.

### Features

*   **Page Initialization:** Initializes the `$scope.page` object with data from the `Page` factory or default values.
*   **New/Edit Page Handling:**  Distinguishes between creating a new page (`/new` route) and editing an existing page.
*   **Local Storage Versioning:** Checks for unsaved changes in `localStorage` and allows the user to revert to the local version or discard it.
*   **Page Deletion:** Provides functionality to delete a page and its associated data (revisions, extras, tags).
*   **Data Binding:**  Binds page data to the template using `$scope` variables.
*   **Form Handling:** Manages form input, including title, description, URL, tags, and publish settings.
*   **URL Auto-generation:** Automatically generates a URL based on the page title.
*   **Tag Autocomplete:** Provides tag suggestions based on user input.
*   **Page Saving:** Saves new pages and updates existing pages using the `REST` factory.
*   **Page Duplication:** Allows duplicating an existing page.
*   **Revision Handling:** Saves page revisions when changes are made.
*   **Extra Data Handling:** Saves and manages additional, custom data ("extras") associated with the page.
*   **Error Handling:** Displays error messages to the user if API calls fail.
*   **Scheduling:**  Allows scheduling pages for future publication.

### Usage

The `pageCtrl` controller is associated with the `page.html` template using `ng-controller="pageCtrl"`:

```html
<div ng-controller="pageCtrl">
    </div>
```

The controller's methods and properties are accessed within the template using Angular's data binding expressions (e.g., `{{page.title}}`, `ng-click="savePage()"`).

### Accessibility

The `pageCtrl` controller, in conjunction with the `page.html` template, implements several features that contribute to accessibility:

*   **Semantic HTML:** The template uses semantic HTML elements like `<label>`, `<input>`, `<textarea>`, `<select>`, and `<button>`, which provide inherent meaning and structure for assistive technologies.
*   **`for` Attribute:**  `<label>` elements are correctly associated with their corresponding form controls using the `for` attribute (e.g., `<label for="type">`). This is crucial for screen readers to announce the label when the input receives focus.
*   **`placeholder` Attribute:**  `placeholder` attributes are used to provide hints within input fields.  While not a replacement for labels, they offer additional context.
*   **`ng-show` and `ng-hide`:**  These directives are used to conditionally show or hide elements, which can be used to manage the visibility of content based on user interaction or application state.  This can help reduce clutter and improve focus.
*   **ARIA Attributes (Potentially - Needs Improvement):**  While the current code doesn't explicitly use ARIA attributes, it *should* be augmented to include them for enhanced accessibility.  Here are some areas for improvement:
    *   **`role="alert"`:**  For error messages and notifications (e.g., the `div` with class `new-version`), use `role="alert"` to ensure screen readers announce them immediately.
    *   **`aria-label` and `aria-labelledby`:**  Use these attributes to provide accessible names and descriptions for elements that might not have visible labels or sufficient context.  For example, the "close" buttons (`<a class="sidebar-close">`) could benefit from `aria-label="Close sidebar"`.
    *   **`aria-live`:** For dynamic content updates (like the tag suggestions), use `aria-live` to inform screen readers of changes without interrupting the user's current focus.
    * **`aria-expanded`**: For the sidebar, use `aria-expanded` to indicate if the sidebar is open or closed.
    * **`aria-controls`**: For the sidebar, use `aria-controls` to indicate the element that the sidebar controls.

### Conclusion

The `pageCtrl` controller is a complex and vital component that orchestrates the page creation and editing process.  It effectively combines data management, API interaction, and user interface logic.  By incorporating the suggested ARIA attributes, the accessibility of the page editing interface can be significantly improved.

---

## 5. Page Template (`page.html`)

### Overview

The `page.html` template provides the user interface for creating and editing pages. It uses Angular directives to bind data from the `pageCtrl` controller and handle user interactions.

### Features

*   **Form Structure:**  Provides a form with input fields for all page properties (title, description, URL, tags, etc.).
*   **Conditional Rendering:**  Uses `ng-show` and `ng-hide` to display different elements based on application state (e.g., showing a confirmation message before deleting a page).
*   **Data Binding:**  Uses Angular's two-way data binding (`ng-model`) to keep the form inputs synchronized with the controller's data.
*   **Event Handling:**  Uses directives like `ng-click`, `ng-change`, and `ng-keyup` to respond to user actions.
*   **Translation:** Uses the `translate` directive (presumably from `angular-translate`) to support internationalization.
*   **Select Element:** Uses `ng-options` to dynamically populate the options of the page type select element.
*   **Tag Suggestions:** Displays a list of tag suggestions using `ng-repeat` and `ng-show`.
*   **Radio Buttons:** Uses radio buttons for the publish/draft/schedule options.
*   **Date/Time Input:** Uses `datetime-local` input for scheduling.

### Accessibility

(See the Accessibility section in the `pageCtrl` documentation for a detailed discussion. The points made there directly apply to the `page.html` template.)

### Conclusion

The `page.html` template provides a well-structured and interactive user interface for page management.  It leverages Angular's features to create a dynamic and responsive editing experience.  Improving its ARIA attribute usage will make it more accessible to users of assistive technologies.

---

This comprehensive documentation covers the key aspects of the provided code, including its functionality, usage, and accessibility considerations. Remember to update this documentation as the application evolves.


### Tokens: {'input_tokens': 6380, 'output_tokens': 3717}
### Execution time: 46.956329107284546
