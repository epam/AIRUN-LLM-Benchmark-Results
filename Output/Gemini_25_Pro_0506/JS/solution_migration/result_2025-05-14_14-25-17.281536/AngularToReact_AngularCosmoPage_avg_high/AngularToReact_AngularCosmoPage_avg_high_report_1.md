I have the following application code that needs to migrate:

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

1. Migrate the codebase from Angular to React 18.x:
   - Use TypeScript for all components and services
   - Implement strict typing for all variables, functions, and props
   - Maintain the same functionality as the original Angular application

2. State Management Requirements:
   - Implement Redux Toolkit with createSlice for global state management
   - Create appropriate slices for each data domain
   - Use Redux selectors for accessing state
   - Implement proper action creators for state mutations

3. Component Architecture:
   - Split monolithic controllers into separate functional components
   - Create reusable UI components where patterns are identified
   - Implement proper prop typing with TypeScript interfaces
   - Use React hooks (useState, useEffect, useCallback, useMemo) appropriately

4. API Communication:
   - Replace Angular's $resource with appropriate React/Redux API handling
   - Implement API services using modern fetch or axios
   - Handle API responses and errors consistently
   - Maintain the same API endpoints structure

5. Form Handling:
   - Replace Angular form bindings with React controlled components
   - Implement form validation equivalent to the original
   - Use React hooks for form state management
   - Maintain the same validation rules and error handling

6. Routing:
   - Replace Angular routing with React Router
   - Maintain the same URL structure and parameters
   - Implement route guards where necessary
   - Handle route transitions properly

7. Internationalization:
   - Replace Angular's $translate with appropriate React i18n library
   - Maintain all translation keys and functionality
   - Implement language switching if present in original code

8. Optimization Requirements:
   - Implement code splitting for better performance
   - Use React.memo for expensive renders
   - Implement proper dependency arrays in useEffect and other hooks
   - Optimize re-renders with proper component structure

9. Local Storage Handling:
   - Maintain the same local storage functionality
   - Implement proper hooks for local storage access
   - Handle storage events if needed

10. Code Structure:
    - Organize code into feature folders
    - Separate business logic from UI components
    - Create proper TypeScript interfaces for all data models
    - Implement consistent naming conventions

## Run 1:
### Answer:
Okay, I will provide a migration of the AngularJS codebase to React 18.x with TypeScript, Redux Toolkit, and other modern practices as requested.

This will be a comprehensive migration, broken down into several parts:

**1. Project Setup (Conceptual - you'll need to do this in your environment)**
   - Create a new React project using Vite or Create React App with the TypeScript template.
     ```bash
     # Using Vite
     npm create vite@latest my-react-app -- --template react-ts
     cd my-react-app
     # Using Create React App
     # npx create-react-app my-react-app --template typescript
     # cd my-react-app
     ```
   - Install necessary dependencies:
     ```bash
     npm install redux react-redux @reduxjs/toolkit react-router-dom react-i18next i18next i18next-browser-languagedetector
     npm install axios # Or use fetch, axios is common for robust API calls
     ```

**2. TypeScript Models**
   Define interfaces for your data structures.

   ```typescript
   // src/models/page.ts
   export interface PageExtra {
       [key: string]: any; // Or a more specific type if known
   }

   export interface PageData {
       id: string | number | null; // Allow null for new pages
       title: string;
       description: string;
       header: string; // From original Page factory, used in savePage
       subheader: string; // From original Page factory, used in savePage
       body: string; // From original Page factory, used in savePage
       url: string;
       type: string;
       publish: 'Y' | 'N' | 'schedule'; // 'published' in original factory, 'publish' in controller
       published_date: number | null; // Timestamp or null
       scheduleDate?: Date | string; // For datetime-local input, then converted
       tags: string[];
       themePages: string[];
       timestamp?: string; // From original Page factory
       extras: PageExtra; // Assuming object based on usage
       misc?: Record<string, any>; // From original Page factory
       featured?: string | null; // Derived from extras for saving
       author?: string | null; // User ID
   }

   // src/models/user.ts
   export interface UserData {
       id: string;
       username: string;
       name: string;
       bio: string;
       email: string;
       facebook: string;
       twitter: string;
       photo: string;
       role: string;
   }

   // src/models/api.ts
   export interface TagSuggestion {
       // Define structure based on what `api/content/:contentID/tags/` returns for autocomplete
       // Assuming it's an array of strings for now, as per usage `ng-repeat="tag in page.suggestions"`
       name: string; // Or just string if it's string[]
   }

   export interface ContentResource {
       id: string;
       // other fields returned by API after save/update
   }

   export interface RevisionResource extends ContentResource {
       // any specific revision fields
   }
   ```

**3. Redux Store Setup**

   **a. Notification Slice (for `$rootScope.$broadcast('notify')`)**
   ```typescript
   // src/store/slices/notificationSlice.ts
   import { createSlice, PayloadAction } from '@reduxjs/toolkit';

   export interface NotificationState {
       message: string;
       type: 'success' | 'error' | 'info';
       isOpen: boolean;
   }

   const initialState: NotificationState = {
       message: '',
       type: 'info',
       isOpen: false,
   };

   const notificationSlice = createSlice({
       name: 'notification',
       initialState,
       reducers: {
           showNotification: (state, action: PayloadAction<{ message: string; type?: 'success' | 'error' | 'info' }>) => {
               state.message = action.payload.message;
               state.type = action.payload.type || 'info';
               state.isOpen = true;
           },
           hideNotification: (state) => {
               state.isOpen = false;
               state.message = '';
           },
       },
   });

   export const { showNotification, hideNotification } = notificationSlice.actions;
   export default notificationSlice.reducer;
   ```

   **b. User Slice (migrating `Users` factory)**
   ```typescript
   // src/store/slices/userSlice.ts
   import { createSlice, PayloadAction } from '@reduxjs/toolkit';
   import { UserData } from '../../models/user';

   const initialState: UserData = {
       id: '',
       username: '',
       name: '',
       bio: '',
       email: '',
       facebook: '',
       twitter: '',
       photo: '',
       role: '',
   };

   const userSlice = createSlice({
       name: 'user',
       initialState,
       reducers: {
           setUser: (state, action: PayloadAction<Partial<UserData>>) => {
               return { ...state, ...action.payload };
           },
           clearUser: () => {
               return initialState;
           },
       },
   });

   export const { setUser, clearUser } = userSlice.actions;
   export default userSlice.reducer;
   ```

   **c. Page Slice (migrating `Page` factory)**
   ```typescript
   // src/store/slices/pageSlice.ts
   import { createSlice, PayloadAction } from '@reduxjs/toolkit';
   import { PageData, PageExtra } from '../../models/page';

   // This slice will hold the "canonical" Page data, similar to the AngularJS Page factory.
   // The PageEditor component will have its own form state, which syncs with this on load/save.
   export interface PageState extends PageData {}

   const initialState: PageState = {
       id: null,
       title: '',
       description: '',
       header: '',
       subheader: '',
       body: '',
       url: '',
       type: '',
       publish: 'N',
       published_date: null,
       tags: [],
       themePages: [], // This should be populated, e.g., from a settings API call
       timestamp: '',
       extras: {},
       misc: {},
       // scheduleDate is more of a form concern, will be handled in component state
   };

   const pageSlice = createSlice({
       name: 'page',
       initialState,
       reducers: {
           setPageData: (state, action: PayloadAction<Partial<PageState>>) => {
               return { ...state, ...action.payload };
           },
           updatePageExtras: (state, action: PayloadAction<PageExtra>) => {
               state.extras = { ...state.extras, ...action.payload };
           },
           setPageExtras: (state, action: PayloadAction<PageExtra>) => {
               state.extras = action.payload;
           },
           resetPageData: () => {
               return initialState;
           },
           // Add other specific setters if needed
           setThemePages: (state, action: PayloadAction<string[]>) => {
                state.themePages = action.payload;
           },
           setPageType: (state, action: PayloadAction<string>) => {
                state.type = action.payload;
           },
           setPageCoreContent: (state, action: PayloadAction<{title: string, description: string, url: string, header: string, subheader: string, body: string}>) => {
                state.title = action.payload.title;
                state.description = action.payload.description;
                state.url = action.payload.url;
                state.header = action.payload.header; // Assuming these are edited elsewhere and stored in Page service
                state.subheader = action.payload.subheader;
                state.body = action.payload.body;
           }
       },
   });

   export const { setPageData, updatePageExtras, setPageExtras, resetPageData, setThemePages, setPageType, setPageCoreContent } = pageSlice.actions;
   export default pageSlice.reducer;
   ```

   **d. Root Reducer and Store Configuration**
   ```typescript
   // src/store/rootReducer.ts
   import { combineReducers } from '@reduxjs/toolkit';
   import pageReducer from './slices/pageSlice';
   import userReducer from './slices/userSlice';
   import notificationReducer from './slices/notificationSlice';
   // import adminReducer from '../features/admin/adminSlice'; // If you create an adminSlice

   const rootReducer = combineReducers({
       page: pageReducer,
       user: userReducer,
       notification: notificationReducer,
       // admin: adminReducer,
   });

   export type RootState = ReturnType<typeof rootReducer>;
   export default rootReducer;
   ```

   ```typescript
   // src/store/store.ts
   import { configureStore } from '@reduxjs/toolkit';
   import rootReducer from './rootReducer';

   export const store = configureStore({
       reducer: rootReducer,
       // Middleware can be added here, e.g., for RTK Query or custom middleware
   });

   export type AppDispatch = typeof store.dispatch;
   ```

**4. API Service (migrating `REST` factory)**
   We'll use `axios` for this example. Create a base `apiClient`.

   ```typescript
   // src/services/apiClient.ts
   import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

   const API_BASE_URL = '/api'; // Adjust if your API prefix is different

   const apiClient: AxiosInstance = axios.create({
       baseURL: API_BASE_URL,
       headers: {
           'Content-Type': 'application/json',
       },
   });

   // You can add interceptors for request/response handling (e.g., auth tokens)
   // apiClient.interceptors.request.use(...)
   // apiClient.interceptors.response.use(...)

   export default apiClient;
   ```

   Now, create specific API service functions. I'll focus on those used by `pageCtrl`.

   ```typescript
   // src/services/contentApi.ts
   import apiClient from './apiClient';
   import { PageData, ContentResource, RevisionResource } from '../models/page'; // Assuming ContentResource and RevisionResource are defined
   import { TagSuggestion } from '../models/api';

   // Helper to remove null/undefined values from an object, useful for query params
   const cleanParams = (obj: Record<string, any>): Record<string, any> => {
       return Object.entries(obj).reduce((acc, [key, value]) => {
           if (value !== null && value !== undefined) {
               acc[key] = value;
           }
           return acc;
       }, {} as Record<string, any>);
   };

   export const contentApi = {
       // GET api/content/:contentID
       getById: (contentID: string): Promise<PageData> => // Assuming PageData is the response type
           apiClient.get(`/content/${contentID}`).then(res => res.data),

       // POST api/content/
       create: (data: Partial<PageData>): Promise<ContentResource> =>
           apiClient.post('/content', data).then(res => res.data),

       // PUT api/content/:contentID
       update: (contentID: string | number, data: Partial<PageData>): Promise<ContentResource> =>
           apiClient.put(`/content/${contentID}`, data).then(res => res.data),

       // DELETE api/content/:contentID
       delete: (contentID: string | number): Promise<void> =>
           apiClient.delete(`/content/${contentID}`).then(res => res.data),
   };

   export const contentExtrasApi = {
       // GET api/content/:contentID/extras/ (Original doesn't specify method, assuming GET for list, POST for save)
       // This might need adjustment based on actual API behavior for listing extras.
       // The original code uses contentExtras.delete({ contentID }), implying a bulk delete.
       // And contentExtras.save({ contentID, name, extra }), implying individual save.

       // DELETE api/content/:contentID/extras/ (Bulk delete all extras for content)
       deleteAll: (contentID: string | number): Promise<void> =>
           apiClient.delete(`/content/${contentID}/extras/`).then(res => res.data),

       // POST api/content/:contentID/extras/ (Save one extra)
       save: (contentID: string | number, name: string, extra: any): Promise<any> => // Define specific response type if known
           apiClient.post(`/content/${contentID}/extras/`, { name, extra }).then(res => res.data),
   };

   export const contentRevisionsApi = {
       // DELETE api/content/:contentID/revisions/ (Bulk delete all revisions for content)
       deleteAll: (contentID: string | number): Promise<void> =>
           apiClient.delete(`/content/${contentID}/revisions/`).then(res => res.data),

       // POST api/content/:contentID/revisions/ (Save one revision)
       // The original $resource has revisionID param, but save operation in controller doesn't use it.
       // It seems to create a new revision based on contentID.
       save: (contentID: string | number, data: Partial<PageData>): Promise<RevisionResource> =>
           apiClient.post(`/content/${contentID}/revisions/`, data).then(res => res.data),
   };

   export const contentRevisionsExtrasApi = {
       // DELETE api/content/:contentID/revisions/:revisionID/extras/:extraID (Original uses this for delete)
       // The controller uses a simpler delete: REST.contentRevisionsExtras.delete({ contentID: $scope.page.id });
       // This implies a bulk delete for all extras of all revisions of a content item.
       // This needs clarification. Assuming a bulk delete by contentID for now.
       deleteAllForContent: (contentID: string | number): Promise<void> =>
           apiClient.delete(`/content/${contentID}/revisions/extras/`).then(res => res.data), // Endpoint needs verification

       // POST api/content/:contentID/revisions/:revisionID/extras/
       save: (contentID: string | number, revisionID: string | number, name: string, extra: any): Promise<any> =>
           apiClient.post(`/content/${contentID}/revisions/${revisionID}/extras/`, { name, extra }).then(res => res.data),
   };

   export const contentTagsApi = {
       // GET api/content/:contentID/tags/ (Original uses this for autocomplete with a query param `tag`)
       // The original $resource is `api/content/:contentID/tags/`.
       // The controller calls `REST.contentTags.query({ tag: tag }...` which implies the `tag` is a query param.
       // It doesn't use contentID for querying suggestions. This seems like a general tag suggestion endpoint.
       // Let's assume `api/tags/search?name=tag` or similar for suggestions.
       // For now, I'll adapt the controller's usage: `REST.contentTags.query({ tag: tag }`
       // This implies the $resource should have been `api/tags?tag=:tag` or similar.
       // I'll make a generic search function.
       // If it's specific to content: `api/content/${contentID}/tags?startsWith=${tag}`
       // The original `REST.contentTags` is `api/content/:contentID/tags/`.
       // `REST.contentTags.query({ tag: tag })` is ambiguous.
       // Let's assume a general tag search endpoint:
       query: (tagQuery: string): Promise<string[]> => // Assuming it returns an array of tag strings
           apiClient.get(`/tags/search`, { params: cleanParams({ name_startsWith: tagQuery }) }).then(res => res.data.map((t: TagSuggestion) => t.name)), // Adjust based on actual API

       // POST api/content/:contentID/tags/ (Save one tag for content)
       save: (contentID: string | number, tag: string): Promise<void> =>
           apiClient.post(`/content/${contentID}/tags/`, { tag_name: tag }).then(res => res.data), // Body might be just {tag} or {name:tag}

       // DELETE api/content/:contentID/tags/ (Bulk delete all tags for content)
       deleteAll: (contentID: string | number): Promise<void> =>
           apiClient.delete(`/content/${contentID}/tags/`).then(res => res.data),
   };

   // You would continue this pattern for all resources in rest.js
   // e.g., blocksApi, commentsApi, filesApi, etc.
   ```
   **Note on API Endpoints:** The translation from `$resource` to specific functions requires careful interpretation of how `$resource` actions map to HTTP methods and URL patterns, especially with custom actions and parameter binding. The above is a best guess based on common patterns and the controller usage. You'll need to verify against your actual backend API specification.

**5. Internationalization (i18n)**

   ```typescript
   // src/config/i18n.ts
   import i18n from 'i18next';
   import { initReactI18next } from 'react-i18next';
   import LanguageDetector from 'i18next-browser-languagedetector';

   // Example translation resources
   const resources = {
     en: {
       translation: {
         page_newer: "A newer version of this page was found in your local storage.",
         discard: "Discard Local Version",
         compare: "Compare (Not Implemented)", // Original button, action not fully clear
         use: "Use Local Version",
         page_details: "Page Details",
         delete: "Delete",
         duplicate: "Duplicate",
         save: "Save",
         page_delete: "Are you sure you want to delete this page?",
         yes: "Yes",
         no: "No",
         type: "Type",
         title: "Title",
         description: "Description",
         tags: "Tags",
         url: "URL",
         publish: "Publish",
         draft: "Draft",
         schedule: "Schedule",
         deleted: "Page deleted successfully.",
         page_different_url: "To duplicate, please provide a different URL for the new page.",
         page_no_type_selected: "Please select a page type.",
         page_no_url: "Page URL cannot be empty.",
         page_error_saving: "Error saving page.",
         page_error_updating: "Error updating page.",
         saved: "Page saved successfully.",
         page_created: "Page created successfully.",
         page_updated: "Page updated successfully.",
         // Add other keys from your application
       }
     }
     // Add other languages here, e.g., fr: { translation: { ... } }
   };

   i18n
     .use(LanguageDetector) // Detect user language
     .use(initReactI18next) // Passes i18n down to react-i18next
     .init({
       resources,
       fallbackLng: 'en', // Use English if detected language is not available
       interpolation: {
         escapeValue: false, // React already safes from xss
       },
     });

   export default i18n;
   ```
   Import this in your `main.tsx` or `App.tsx`: `import './config/i18n';`

**6. React Components**

   **a. Reusable UI Components (Examples)**
   ```typescript
   // src/components/ui/Button.tsx
   import React from 'react';

   interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
       variant?: 'primary' | 'secondary' | 'error' | 'success' | 'options';
       children: React.ReactNode;
   }

   const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className, ...props }) => {
       const baseStyle = "btn"; // Your base button style
       const variantStyles = {
           primary: "btn-primary", // Define your styles
           secondary: "btn-secondary",
           error: "btn-error",
           success: "btn-success",
           options: "btn-options",
       };
       return (
           <button className={`${baseStyle} ${variantStyles[variant]} ${className || ''}`} {...props}>
               {children}
           </button>
       );
   };
   export default Button;
   ```

   **b. Notification Display Component**
   ```typescript
   // src/components/layout/NotificationDisplay.tsx
   import React, { useEffect } from 'react';
   import { useSelector, useDispatch } from 'react-redux';
   import { RootState, AppDispatch } from '../../store/store';
   import { hideNotification, NotificationState } from '../../store/slices/notificationSlice';

   const NotificationDisplay: React.FC = () => {
       const dispatch = useDispatch<AppDispatch>();
       const { message, type, isOpen } = useSelector((state: RootState) => state.notification);

       useEffect(() => {
           if (isOpen) {
               const timer = setTimeout(() => {
                   dispatch(hideNotification());
               }, 5000); // Auto-hide after 5 seconds
               return () => clearTimeout(timer);
           }
       }, [isOpen, dispatch]);

       if (!isOpen) {
           return null;
       }

       const alertClasses = {
           success: 'alert-success', // Define your CSS classes
           error: 'alert-error',
           info: 'alert-info',
       };

       return (
           <div className={`notification-banner ${alertClasses[type]}`}>
               {message}
               <button onClick={() => dispatch(hideNotification())} className="close-notification">&times;</button>
           </div>
       );
   };

   export default NotificationDisplay;
   ```
   You would include `<NotificationDisplay />` in your main App layout.

   **c. Page Editor Component (migrating `pageCtrl` and `page.html`)**
   This is the largest piece.

   ```typescript
   // src/features/page/components/PageEditor.tsx
   import React, { useState, useEffect, useCallback, useMemo } from 'react';
   import { useSelector, useDispatch } from 'react-redux';
   import { useNavigate, useParams } from 'react-router-dom';
   import { useTranslation } from 'react-i18next';

   import { RootState, AppDispatch } from '../../../store/store';
   import { PageData, PageExtra } from '../../../models/page';
   import { UserData } from '../../../models/user';
   import {
       setPageData as setGlobalPageData,
       updatePageExtras as updateGlobalPageExtras,
       setPageExtras as setGlobalPageExtras,
       setPageType as setGlobalPageType,
       setPageCoreContent as setGlobalPageCoreContent,
       resetPageData as resetGlobalPageData,
       PageState
   } from '../../../store/slices/pageSlice';
   import { showNotification } from '../../../store/slices/notificationSlice';
   import { contentApi, contentExtrasApi, contentRevisionsApi, contentRevisionsExtrasApi, contentTagsApi } from '../../../services/contentApi';

   import Button from '../../../components/ui/Button'; // Example UI component
   // import Select from '../../../components/ui/Select'; // Example UI component

   // Helper to get item from localStorage
   const getLocalStorageItem = (key: string): string | null => localStorage.getItem(key);
   // Helper to set item in localStorage
   const setLocalStorageItem = (key: string, value: string | null) => {
       if (value === null) localStorage.removeItem(key);
       else localStorage.setItem(key, value);
   };


   interface PageEditorProps {
       // Props if any, e.g. if this component is used for both new and edit
   }
    
   // This is a simplified version of the original Page factory structure for local form state
   interface PageFormState {
       id: string | number | null;
       title: string;
       description: string;
       url: string;
       publish: 'Y' | 'N' | 'schedule';
       scheduleDate: string; // Store as ISO string for datetime-local
       tags: string[]; // Store as array of strings
       type: string;
       // themePages are from global state
   }


   const PageEditor: React.FC<PageEditorProps> = () => {
       const { t } = useTranslation();
       const dispatch = useDispatch<AppDispatch>();
       const navigate = useNavigate();
       const params = useParams<{ pageUrl?: string; contentID?: string }>(); // pageUrl for existing, contentID if directly passed

       const globalPageData = useSelector((state: RootState) => state.page);
       const currentUser = useSelector((state: RootState) => state.user);

       const initialFormState: PageFormState = {
           id: globalPageData.id || null,
           title: globalPageData.title || '',
           description: globalPageData.description || '',
           url: globalPageData.url || (params.pageUrl === 'new' ? 'new' : (params.pageUrl || '')),
           publish: globalPageData.publish || 'N',
           scheduleDate: globalPageData.scheduleDate ? new Date(globalPageData.scheduleDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
           tags: globalPageData.tags ? [...globalPageData.tags] : [],
           type: globalPageData.type || (globalPageData.themePages.length > 0 ? globalPageData.themePages[0] : ''),
       };
       
       const [formState, setFormState] = useState<PageFormState>(initialFormState);
       const [currentTagInput, setCurrentTagInput] = useState<string>(''); // For the ng-list like behavior
       const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
       const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
       const [newerVersionExists, setNewerVersionExists] = useState<boolean>(false);
       const [autoGenerateUrl, setAutoGenerateUrl] = useState<boolean>(!params.pageUrl || params.pageUrl === 'new');

       const pageRouteParam = params.pageUrl || (globalPageData.url && globalPageData.url !== '/new' ? globalPageData.url.replace(/^\//, '') : null);


       // Sync form with global state if globalPageData changes (e.g. after loading)
       useEffect(() => {
            // Only update if the global ID changes or if it's an initial load for an existing page
            if (globalPageData.id && globalPageData.id !== formState.id) {
                setFormState({
                    id: globalPageData.id,
                    title: globalPageData.title,
                    description: globalPageData.description,
                    url: globalPageData.url,
                    publish: globalPageData.publish,
                    scheduleDate: globalPageData.scheduleDate ? new Date(globalPageData.scheduleDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
                    tags: [...globalPageData.tags],
                    type: globalPageData.type || (globalPageData.themePages.length > 0 ? globalPageData.themePages[0] : ''),
                });
                setAutoGenerateUrl(false); // Loaded an existing page, don't auto-generate URL
            } else if (!globalPageData.id && params.pageUrl === 'new') {
                 // Reset form for new page if global state was cleared
                setFormState(initialFormState);
                setAutoGenerateUrl(true);
            }
       }, [globalPageData, params.pageUrl]); // formState.id removed to prevent loop

       // Check for newer version in localStorage
       useEffect(() => {
           if (params.pageUrl && params.pageUrl !== 'new') {
               const elementsToTrack = ['title', 'description', 'publish', 'scheduleDate', 'url', 'type']; // 'header', 'subheader', 'body' are in globalPageData.extras or main content
               let foundNewer = false;
               elementsToTrack.forEach(key => {
                   const storedValue = getLocalStorageItem(`${params.pageUrl}${key}`);
                   // Compare with globalPageData as it's the "saved" version
                   if (storedValue !== null && storedValue !== String(globalPageData[key as keyof PageState])) {
                       foundNewer = true;
                   }
               });
               // Also check for header, subheader, body if they are part of local storage strategy
               // This part needs to align with how Page.header, Page.subheader, Page.body are managed
               // For simplicity, assuming they are part of globalPageData.extras or main content fields
               setNewerVersionExists(foundNewer);
           }
       }, [params.pageUrl, globalPageData]);


       const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
           const { name, value } = e.target;
           setFormState(prevState => ({ ...prevState, [name]: value }));

           if (name === 'title' && autoGenerateUrl) {
               const newUrl = value.toLowerCase().replace(/ /g, '-').replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
               setFormState(prevState => ({ ...prevState, url: newUrl }));
           }
           if (name === 'url') {
               setAutoGenerateUrl(false); // User manually changed URL
           }
       };

       const handlePublishChange = (newPublishState: 'Y' | 'N' | 'schedule') => {
           setFormState(prevState => ({ ...prevState, publish: newPublishState }));
       };
       
       const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setCurrentTagInput(value);
            if (value.endsWith(',')) { // ng-list behavior: add tag on comma
                const newTag = value.slice(0, -1).trim();
                if (newTag && !formState.tags.includes(newTag)) {
                    setFormState(prevState => ({ ...prevState, tags: [...prevState.tags, newTag] }));
                }
                setCurrentTagInput('');
                setTagSuggestions([]);
            } else if (value.trim() !== '') {
                // Debounce this call in a real app
                contentTagsApi.query(value.trim())
                    .then(setTagSuggestions)
                    .catch(() => setTagSuggestions([]));
            } else {
                setTagSuggestions([]);
            }
       };

       const addTagFromSuggestion = (tag: string) => {
           if (tag && !formState.tags.includes(tag)) {
               setFormState(prevState => ({ ...prevState, tags: [...prevState.tags, tag] }));
           }
           setCurrentTagInput('');
           setTagSuggestions([]);
       };

       const removeTag = (tagToRemove: string) => {
           setFormState(prevState => ({ ...prevState, tags: prevState.tags.filter(tag => tag !== tagToRemove) }));
       };

       // Save to Local Storage (called periodically or on blur)
       const saveToLocalStorage = useCallback(() => {
           if (pageRouteParam && pageRouteParam !== 'new') {
               setLocalStorageItem(`${pageRouteParam}title`, formState.title);
               setLocalStorageItem(`${pageRouteParam}description`, formState.description);
               setLocalStorageItem(`${pageRouteParam}url`, formState.url);
               setLocalStorageItem(`${pageRouteParam}publish`, formState.publish);
               setLocalStorageItem(`${pageRouteParam}scheduleDate`, formState.scheduleDate);
               setLocalStorageItem(`${pageRouteParam}type`, formState.type);
               // Potentially save globalPageData.header, subheader, body, extras if they are also part of this "draft"
           }
       }, [formState, pageRouteParam]);

       // Example: auto-save to local storage on form changes (debounced)
       useEffect(() => {
           const handler = setTimeout(() => {
               if (pageRouteParam && pageRouteParam !== 'new') { // Only for existing pages
                   saveToLocalStorage();
               }
           }, 1000); // Debounce time
           return () => clearTimeout(handler);
       }, [formState, saveToLocalStorage, pageRouteParam]);


       const handleUseLocalVersion = () => {
           if (!pageRouteParam) return;
           const localTitle = getLocalStorageItem(`${pageRouteParam}title`);
           const localDescription = getLocalStorageItem(`${pageRouteParam}description`);
           const localUrl = getLocalStorageItem(`${pageRouteParam}url`);
           const localPublish = getLocalStorageItem(`${pageRouteParam}publish`) as PageFormState['publish'];
           const localScheduleDate = getLocalStorageItem(`${pageRouteParam}scheduleDate`);
           const localType = getLocalStorageItem(`${pageRouteParam}type`);

           const updatedFormState: Partial<PageFormState> = {};
           if (localTitle !== null) updatedFormState.title = localTitle;
           if (localDescription !== null) updatedFormState.description = localDescription;
           if (localUrl !== null) updatedFormState.url = localUrl;
           if (localPublish) updatedFormState.publish = localPublish;
           if (localScheduleDate) updatedFormState.scheduleDate = localScheduleDate;
           if (localType) updatedFormState.type = localType;
           
           setFormState(prev => ({...prev, ...updatedFormState}));

           // Also update global Page state parts that are not in formState directly
           // e.g. header, subheader, body, extras. This requires a strategy for local storage of these.
           // For now, this example focuses on formState fields.
           // dispatch(setGlobalPageCoreContent({ title: localTitle || globalPageData.title, ... }))

           // Clear local storage items
           ['title', 'description', 'url', 'publish', 'scheduleDate', 'type'].forEach(key => {
               setLocalStorageItem(`${pageRouteParam}${key}`, null);
           });
           setNewerVersionExists(false);
           dispatch(showNotification({ message: 'Local version loaded.', type: 'info' }));
       };

       const handleDeleteNewerVersion = () => {
           if (!pageRouteParam) return;
           ['title', 'description', 'url', 'publish', 'scheduleDate', 'type'].forEach(key => {
               setLocalStorageItem(`${pageRouteParam}${key}`, null);
           });
           setNewerVersionExists(false);
           dispatch(showNotification({ message: 'Local draft discarded.', type: 'info' }));
       };

       const handleDeletePage = async () => {
           if (!formState.id) return;
           try {
               await contentApi.delete(formState.id);
               // Original code also deletes revisions, extras, tags.
               // These might be handled by backend via cascading delete, or need explicit calls.
               await Promise.all([
                   contentRevisionsApi.deleteAll(formState.id),
                   contentRevisionsExtrasApi.deleteAllForContent(formState.id), // Assuming this endpoint exists
                   contentExtrasApi.deleteAll(formState.id),
                   contentTagsApi.deleteAll(formState.id)
               ]);

               dispatch(showNotification({ message: t('deleted'), type: 'success' }));
               dispatch(resetGlobalPageData()); // Clear global state
               navigate('/new'); // Or to a pages list
           } catch (error) {
               console.error("Error deleting page:", error);
               dispatch(showNotification({ message: 'Error deleting page.', type: 'error' }));
           }
           setShowDeleteConfirm(false);
       };

       const handleSavePage = async (isDuplicate = false) => {
           if (isDuplicate && formState.url === params.pageUrl) {
               dispatch(showNotification({ message: t('page_different_url'), type: 'error' }));
               return;
           }
           if (!formState.type) {
               dispatch(showNotification({ message: t('page_no_type_selected'), type: 'error' }));
               return;
           }
           if (!formState.url || formState.url === 'new' || formState.url.trim() === '') {
               dispatch(showNotification({ message: t('page_no_url'), type: 'error' }));
               return;
           }

           let effectivePublishDate: number | null = globalPageData.published_date;
           let finalPublishStatus = formState.publish;

           if (formState.publish === 'Y') {
               if (globalPageData.publish !== 'Y') { // If it wasn't already published or is being published now
                   effectivePublishDate = Math.round(Date.now() / 1000);
               }
           } else if (formState.publish === 'schedule') {
               const scheduleTimestamp = new Date(formState.scheduleDate).getTime();
               effectivePublishDate = Math.round(scheduleTimestamp / 1000);
               if (scheduleTimestamp < Date.now()) {
                   finalPublishStatus = 'Y'; // Back-dated schedule, publish immediately
               } else {
                   finalPublishStatus = 'N'; // Scheduled for future, mark as draft for now
               }
           } else { // 'N'
               effectivePublishDate = null; // Or keep existing if unpublishing? Original logic implies new date or null.
           }

           const pagePayload: Partial<PageData> = {
               title: formState.title || globalPageData.header, // Use header if title is empty
               description: formState.description,
               url: formState.url.startsWith('/') ? formState.url : `/${formState.url}`,
               type: formState.type,
               published: finalPublishStatus,
               published_date: effectivePublishDate,
               author: currentUser.id || null,
               // These come from the global Page service in AngularJS
               // In React, they should be part of globalPageData if they are edited elsewhere (e.g. a visual editor)
               // Or, if they are not meant to be part of this form, they should be sourced directly from globalPageData
               header: globalPageData.header,
               subheader: globalPageData.subheader,
               body: globalPageData.body,
               featured: globalPageData.extras?.featured?.src || null, // Example access
           };

           try {
               let savedContent: ContentResource;
               const isNewPage = !formState.id || isDuplicate;

               if (isNewPage) {
                   savedContent = await contentApi.create(pagePayload);
                   dispatch(showNotification({ message: t('page_created'), type: 'success' }));
               } else {
                   savedContent = await contentApi.update(formState.id!, pagePayload);
                   dispatch(showNotification({ message: t('page_updated'), type: 'success' }));
                   // Delete old tags before saving new ones (if updating)
                   await contentTagsApi.deleteAll(formState.id!);
                   // Delete old extras before saving new ones (if updating)
                   await contentExtrasApi.deleteAll(formState.id!);
               }
               
               const contentID = savedContent.id;

               // Update global state with the new/updated page ID and other details from response
               dispatch(setGlobalPageData({ ...globalPageData, ...pagePayload, id: contentID, publish: finalPublishStatus }));
               setFormState(prev => ({...prev, id: contentID})); // Update local form id

               // Save revision
               const revisionPayload = { ...pagePayload, contentID };
               const savedRevision = await contentRevisionsApi.save(contentID, revisionPayload);

               // Save tags
               if (formState.tags && formState.tags.length > 0) {
                   await Promise.all(formState.tags.map(tag => contentTagsApi.save(contentID, tag)));
               }
               dispatch(setGlobalPageData({ tags: formState.tags }));


               // Save extras
               const extrasToSave = globalPageData.extras; // Assuming extras are managed in globalPageData.extras
               if (extrasToSave && Object.keys(extrasToSave).length > 0) {
                   const extraSavePromises = Object.entries(extrasToSave).map(([key, value]) => {
                       const extraValue = typeof value === 'object' ? JSON.stringify(value) : value;
                       return contentExtrasApi.save(contentID, key, extraValue)
                           .then(() => {
                               if (savedRevision && savedRevision.id) {
                                   return contentRevisionsExtrasApi.save(contentID, savedRevision.id, key, extraValue);
                               }
                           });
                   });
                   await Promise.all(extraSavePromises);
               }
               
               // Clear local storage for this page as it's now saved
                if (pageRouteParam && pageRouteParam !== 'new') {
                    ['title', 'description', 'url', 'publish', 'scheduleDate', 'type'].forEach(key => {
                        setLocalStorageItem(`${pageRouteParam}${key}`, null);
                    });
                    setNewerVersionExists(false);
                }


               if (isNewPage || isDuplicate || formState.url !== params.pageUrl) {
                   navigate(`/${formState.url.replace(/^\//, '')}`, { replace: true });
               }
               setAutoGenerateUrl(false); // After first save, don't auto-generate URL

           } catch (error) {
               console.error("Error saving page:", error);
               dispatch(showNotification({ message: isNewPage ? t('page_error_saving') : t('page_error_updating'), type: 'error' }));
           }
       };
       
       const themePagesOptions = useMemo(() => {
            // Assuming globalPageData.themePages is an array of strings
            // And themeFiles filter is not doing complex transformation, just for display.
            // If themeFiles is complex, replicate its logic here.
            return globalPageData.themePages.map(themePage => ({
                value: themePage,
                label: themePage // Potentially apply a transformation like `themePage.replace('.html', '')`
            }));
       }, [globalPageData.themePages]);


       // UI Rendering (JSX)
       return (
           <div className="page-editor-container">
               {newerVersionExists && (
                   <div className="new-version form-case">
                       <p>{t('page_newer')}</p>
                       <Button variant="error" type="button" onClick={handleDeleteNewerVersion}>{t('discard')}</Button>
                       {/* <Button variant="options" type="button" onClick={() => {}}> {t('compare')} </Button> */}
                       <Button variant="success" type="button" onClick={handleUseLocalVersion}>{t('use')}</Button>
                   </div>
               )}

               <div className="bar-top">
                   {/* Replace with actual navigation logic for sidebar */}
                   <a onClick={() => console.log('Back to sidebar')}><i className="fa fa-angle-left"></i></a>
                   <h1 className="title">{t('page_details')}</h1>
                   {/* Replace with actual close logic */}
                   <a className="sidebar-close" onClick={() => console.log('Close admin panel')}><i className="fa fa-times"></i></a>
               </div>

               <div className="bar--actions">
                   {!showDeleteConfirm ? (
                       <>
                           {formState.id && <Button variant="error" type="button" onClick={() => setShowDeleteConfirm(true)}>{t('delete')}</Button>}
                           {formState.id && <Button variant="options" type="button" onClick={() => handleSavePage(true)}>{t('duplicate')}</Button>}
                           <Button variant="success" type="button" onClick={() => handleSavePage(false)}>{t('save')}</Button>
                       </>
                   ) : (
                       <>
                           <p>{t('page_delete')}</p>
                           <Button variant="error" type="button" onClick={handleDeletePage}>{t('yes')}</Button>
                           <Button variant="success" type="button" onClick={() => setShowDeleteConfirm(false)}>{t('no')}</Button>
                       </>
                   )}
               </div>

               <div className="pg-editor form-case">
                   <label htmlFor="pageType">{t('type')}</label>
                   <div className="cos-select"> {/* Style this div or use a custom Select component */}
                       <select
                           id="pageType"
                           name="type"
                           value={formState.type}
                           onChange={(e) => {
                               handleInputChange(e);
                               dispatch(setGlobalPageType(e.target.value)); // Update global Page service
                               // Original: $rootScope.$broadcast('settingsGet');
                               // If 'settingsGet' implies re-fetching settings based on type, dispatch an action here.
                           }}
                           required
                       >
                           {themePagesOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                       </select>
                   </div>

                   <label htmlFor="pageTitle">{t('title')}</label>
                   <span className="num-count">{formState.title.length}</span>
                   <input
                       type="text"
                       id="pageTitle"
                       name="title"
                       value={formState.title}
                       onChange={handleInputChange}
                       placeholder="about us, contact us"
                   />

                   <label htmlFor="pageDescription">{t('description')}</label>
                   <span className="num-count">{formState.description.length}</span>
                   <textarea
                       id="pageDescription"
                       name="description"
                       value={formState.description}
                       onChange={handleInputChange}
                       placeholder="Tom's Restaurant is a diner..."
                   />

                   <label htmlFor="pageTags">{t('tags')}</label>
                   <div className="tags-input-container">
                        {formState.tags.map(tag => (
                            <span key={tag} className="tag-item">
                                {tag}
                                <button onClick={() => removeTag(tag)}>&times;</button>
                            </span>
                        ))}
                        <input
                           type="text"
                           id="pageTags"
                           value={currentTagInput}
                           onChange={handleTagInputChange}
                           placeholder="about, restaurant, food, nyc"
                       />
                   </div>
                   {tagSuggestions.length > 0 && (
                       <div className="tag-suggestions">
                           {tagSuggestions.slice(0, 10).map(tag => (
                               <a key={tag} onClick={() => addTagFromSuggestion(tag)} style={{cursor: 'pointer'}}>
                                   {tag} {/* Apply titlecase if needed: {tag.charAt(0).toUpperCase() + tag.slice(1)} */}
                               </a>
                           ))}
                       </div>
                   )}

                   <label htmlFor="pageUrl">{t('url')}</label>
                   <input
                       type="text"
                       id="pageUrl"
                       name="url"
                       value={formState.url}
                       onChange={handleInputChange}
                   />
                   
                   {/* Publish options */}
                   <div>
                       <input type="radio" id="publishY" name="publish" value="Y" checked={formState.publish === 'Y'} onChange={() => handlePublishChange('Y')} />
                       <label htmlFor="publishY" onClick={() => handlePublishChange('Y')}>{t('publish')}</label>

                       <input type="radio" id="publishN" name="publish" value="N" checked={formState.publish === 'N'} onChange={() => handlePublishChange('N')} />
                       <label htmlFor="publishN" onClick={() => handlePublishChange('N')}>{t('draft')}</label>

                       <input type="radio" id="publishSchedule" name="publish" value="schedule" checked={formState.publish === 'schedule'} onChange={() => handlePublishChange('schedule')} />
                       <label htmlFor="publishSchedule" onClick={() => handlePublishChange('schedule')}>{t('schedule')}</label>
                   </div>

                   {formState.publish === 'schedule' && (
                       <>
                           <div className="schedule-triangle"></div> {/* Style as needed */}
                           <input
                               type="datetime-local"
                               className="schedule radio-inline"
                               name="scheduleDate"
                               value={formState.scheduleDate}
                               onChange={handleInputChange}
                           />
                       </>
                   )}
               </div>
           </div>
       );
   };

   export default PageEditor;
   ```

**7. Routing Setup**

   ```typescript
   // src/App.tsx
   import React, { Suspense } from 'react';
   import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
   import { Provider } from 'react-redux';
   import { store } from './store/store';
   import NotificationDisplay from './components/layout/NotificationDisplay';
   // Import your PageEditor component
   // For code splitting:
   const PageEditor = React.lazy(() => import('./features/page/components/PageEditor'));

   // Dummy component for other routes
   const Dashboard = () => <h2>Dashboard</h2>;
   const NotFound = () => <h2>Page Not Found</h2>;

   function App() {
     return (
       <Provider store={store}>
         <BrowserRouter>
           <NotificationDisplay /> {/* Global notifications */}
           {/* Add any global layout/header/sidebar here */}
           <Suspense fallback={<div>Loading page...</div>}>
             <Routes>
               <Route path="/" element={<Dashboard />} /> {/* Example default route */}
               <Route path="/new" element={<PageEditor />} />
               <Route path="/:pageUrl" element={<PageEditor />} /> {/* For editing existing pages */}
               {/* <Route path="/page/:contentID" element={<PageEditor />} /> Alternative if using ID in URL */}
               <Route path="*" element={<Navigate to="/404" replace />} />
               <Route path="/404" element={<NotFound />} />
             </Routes>
           </Suspense>
         </BrowserRouter>
       </Provider>
     );
   }

   export default App;
   ```
   And in `src/main.tsx`:
   ```typescript
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import App from './App';
   import './config/i18n'; // Initialize i18n
   import './index.css'; // Your global styles

   ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <App />
     </React.StrictMode>,
   );
   ```

**Important Considerations and Next Steps:**

*   **`Page.header`, `Page.subheader`, `Page.body`, `Page.extras`:** The original `pageCtrl` reads these from the `Page` service. This implies they might be edited by other parts of the application (e.g., a WYSIWYG editor for `body`, or a separate interface for `extras`). The React `PageEditor` currently sources them from `globalPageData` (Redux `pageSlice`). You need to ensure that `pageSlice` is correctly populated with this data before the editor loads, and that any components modifying these fields also dispatch updates to `pageSlice`.
*   **`Page.themePages`:** This is used to populate the "Type" dropdown. This data needs to be loaded into `pageSlice.themePages` somehow, perhaps from an initial API call when the app loads or when the user navigates to a context where pages are managed.
*   **`admin.sidebar`, `admin.showAdminPanel`, `admin.active`:** These are UI state related to an admin panel. They would typically be managed by a separate Redux slice (e.g., `adminSlice` or `uiSlice`) or by context if they are scoped to a specific part of the layout. The `onClick` handlers for these in `PageEditor.tsx` are currently placeholders.
*   **Error Handling in API Calls:** The `contentApi.ts` functions should ideally include more robust error handling (e.g., transforming error responses).
*   **API Endpoint Verification:** The API endpoints derived from `$resource` need to be carefully checked against your actual backend API.
*   **`themeFiles` Filter:** The AngularJS filter `themeFiles` used in `ng-options` needs its logic replicated in the `themePagesOptions` memoization within `PageEditor.tsx` if it does more than just display the string.
*   **Styling:** All CSS classes from the original HTML (`form-case`, `bar-top`, `btn-error`, etc.) need to be defined in your CSS files.
*   **Testing:** Implement unit and integration tests for components, reducers, and API services.
*   **Optimization:**
    *   Use `React.memo` for components like `Button` if they are pure and receive complex props.
    *   `useCallback` is used for `saveToLocalStorage`. Apply it to other event handlers passed as props if necessary.
    *   The tag autocomplete API call (`contentTagsApi.query`) should be debounced to avoid excessive requests. You can create a `useDebounce` hook.
*   **Local Storage Strategy:** The local storage logic for `newerVersion` is implemented. Ensure the keys and values match your exact requirements, especially for complex data like `Page.extras`.
*   **`$upload`:** This was not used in the provided `pageCtrl.js`. If file uploads are needed, you'll use `FormData` with `fetch` or `axios`.

This migration provides a solid foundation. You'll need to adapt and refine it based on the specifics of your application and backend API. The `PageEditor` component is quite large; consider breaking it down further into smaller, more manageable sub-components (e.g., `PageMetadataForm`, `PagePublishingOptions`, `PageActionsBar`).

### Tokens: {'input_tokens': 6685, 'output_tokens': 12567}
### Execution time: 177.5070161819458
