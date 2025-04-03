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
Below is a high-level guide for migrating your existing AngularJS application to a modern React 18 + TypeScript setup, leveraging Redux Toolkit for global state management. The goal is to preserve the existing functionality while updating to current best practices.

────────────────────────────────────────────────────────
1. PROJECT & FOLDER STRUCTURE
────────────────────────────────────────────────────────

A recommended folder structure might look like this (you can adjust to your preference, but this layout keeps concerns well separated):

  your-app/
  ├─ src/
  │   ├─ app/
  │   │   ├─ store.ts           // Redux store configuration
  │   │   └─ rootReducer.ts     // Combines slices
  │   ├─ features/
  │   │   ├─ pages/
  │   │   │   ├─ components/
  │   │   │   │   ├─ PageForm.tsx
  │   │   │   │   └─ PageEditor.tsx
  │   │   │   ├─ pageSlice.ts
  │   │   │   ├─ pageTypes.ts   // TypeScript interfaces for Page
  │   │   │   └─ pageAPI.ts     // REST calls for pages
  │   │   ├─ users/
  │   │   │   ├─ components/
  │   │   │   │   └─ UserProfile.tsx
  │   │   │   ├─ userSlice.ts
  │   │   │   ├─ userTypes.ts   // TypeScript interfaces for User
  │   │   │   └─ userAPI.ts     // REST calls for users
  │   │   └─ ...
  │   ├─ components/
  │   │   └─ SharedUIComponents.tsx
  │   ├─ hooks/
  │   │   ├─ useLocalStorage.ts  // local storage helper hook
  │   │   └─ ...
  │   ├─ i18n/
  │   │   └─ index.ts            // i18n setup with react-i18next or similar
  │   ├─ routes/
  │   │   └─ AppRouter.tsx       // React Router setup
  │   ├─ index.tsx               // React entry point
  │   └─ App.tsx                 // Top-level <App> component
  └─ package.json

This structure:
• Separates “features” by domain (e.g., pages, users).
• Includes dedicated files for Redux slices (pageSlice.ts, userSlice.ts, etc.).
• Organizes UI components (PageForm.tsx, PageEditor.tsx, etc.) separately.
• Uses a “hooks” folder for reusable hooks.
• Keeps translations in an “i18n” folder.

────────────────────────────────────────────────────────
2. STATE MANAGEMENT WITH REDUX TOOLKIT
────────────────────────────────────────────────────────

Since AngularJS used “factories” to store global data (e.g., Page, Users), create Redux slices to replicate this functionality.

Below is an example of a pageSlice.ts in TypeScript:

--------------------------------------------------------------------------------
// src/features/pages/pageTypes.ts
--------------------------------------------------------------------------------
export interface PageState {
  id: number
  title: string
  description: string
  header: string
  subheader: string
  body: string
  url: string
  type: string
  publish: string
  scheduleDate: Date | null
  tags: string[]
  themePages: string[]
  extras: Record<string, unknown>
  // Add any other fields needed from your original Angular “Page”
}

export interface SavePagePayload {
  title: string
  description: string
  header: string
  subheader: string
  body: string
  url: string
  type: string
  publish: string
  scheduleDate: Date | number | null
  authorId: string
  tags?: string[]
  extras?: Record<string, unknown>
  // ...
}

--------------------------------------------------------------------------------
// src/features/pages/pageSlice.ts
--------------------------------------------------------------------------------
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PageState, SavePagePayload } from './pageTypes'
// If you use RTK Query, you'd also define an API slice. Or you can just fetch in thunks.

const initialState: PageState = {
  id: 0,
  title: '',
  description: '',
  header: '',
  subheader: '',
  body: '',
  url: '',
  type: '',
  publish: '',
  scheduleDate: null,
  tags: [],
  themePages: [],
  extras: {}
}

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<PageState>) {
      return { ...action.payload }
    },
    updateField(state, action: PayloadAction<{ key: keyof PageState; value: any }>) {
      const { key, value } = action.payload
      state[key] = value
    },
    savePage(state, action: PayloadAction<SavePagePayload>) {
      // Example – merges payload into Redux state
      const payload = action.payload
      state.title = payload.title
      state.description = payload.description
      state.header = payload.header
      state.subheader = payload.subheader
      // ...
    },
    // Additional reducers for local updates as needed
  }
})

export const { setPage, updateField, savePage } = pageSlice.actions
export default pageSlice.reducer

--------------------------------------------------------------------------------
// src/app/store.ts (Redux configuration)
--------------------------------------------------------------------------------
import { configureStore } from '@reduxjs/toolkit'
import pageReducer from '../features/pages/pageSlice'
import userReducer from '../features/users/userSlice'
// ... import other slices

export const store = configureStore({
  reducer: {
    page: pageReducer,
    user: userReducer,
    // ...
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

You can later use React-Redux hooks (useSelector, useDispatch) throughout your components.

────────────────────────────────────────────────────────
3. API COMMUNICATION
────────────────────────────────────────────────────────

In AngularJS, $resource was used. In React, you can use fetch, axios, or RTK Query. Below is an example using axios in a “pageAPI.ts” file. You can adapt it to your needs:

--------------------------------------------------------------------------------
// src/features/pages/pageAPI.ts
--------------------------------------------------------------------------------
import axios from 'axios'
import { SavePagePayload } from './pageTypes'

const API_URL = '/api'

// Example: Create new page
export async function createPage(payload: SavePagePayload) {
  const response = await axios.post(`${API_URL}/content`, payload)
  return response.data
}

// Example: Update existing page
export async function updatePage(pageId: number, payload: SavePagePayload) {
  const response = await axios.put(`${API_URL}/content/${pageId}`, payload)
  return response.data
}

// Example: Delete page
export async function deletePage(pageId: number) {
  const response = await axios.delete(`${API_URL}/content/${pageId}`)
  return response.data
}

// ... similarly for tags (contentTags), extras, revisions, etc.

────────────────────────────────────────────────────────
4. REPLACING THE ANGULAR CONTROLLER WITH REACT COMPONENTS
────────────────────────────────────────────────────────

In AngularJS, “pageCtrl” handled everything. In React, split it into:
• A “PageForm” component handling the form.  
• A “PageEditor” (or “PageDetails”) component for related UI.  
• Possibly separate lower-level components for repeated patterns (e.g., tag input, schedule date, etc.).

Below is a simplified example of a “PageForm” functional component using Redux and TypeScript. Notice we replaced ng-model with controlled inputs (via React state or Redux).

--------------------------------------------------------------------------------
// src/features/pages/components/PageForm.tsx
--------------------------------------------------------------------------------
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { updateField, savePage } from '../pageSlice'
import { RootState } from '../../../app/store'
import { SavePagePayload } from '../pageTypes'
import { useNavigate } from 'react-router-dom'

interface PageFormProps {
  isDuplicate?: boolean
}

const PageForm: React.FC<PageFormProps> = ({ isDuplicate }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const page = useAppSelector((state: RootState) => state.page)

  const [localTitle, setLocalTitle] = useState(page.title)
  const [localDescription, setLocalDescription] = useState(page.description)
  const [localURL, setLocalURL] = useState(page.url)
  const [localPublish, setLocalPublish] = useState(page.publish)
  const [localScheduleDate, setLocalScheduleDate] = useState<Date | null>(
    page.scheduleDate ? new Date(page.scheduleDate) : null
  )

  // On mount, initialize from Redux state (if needed)
  useEffect(() => {
    setLocalTitle(page.title)
    setLocalDescription(page.description)
    setLocalURL(page.url)
    setLocalPublish(page.publish)
    setLocalScheduleDate(page.scheduleDate ? new Date(page.scheduleDate) : null)
  }, [page])

  // Form submit handler
  const handleSubmit = async () => {
    // Basic validation logic
    if (!localURL || localURL.trim() === '' || localURL === 'new') {
      alert('URL is invalid')
      return
    }

    // Create the payload
    const payload: SavePagePayload = {
      title: localTitle,
      description: localDescription,
      header: page.header,
      subheader: page.subheader,
      body: page.body,
      url: localURL,
      type: page.type || 'default',
      publish: localPublish,
      scheduleDate: localScheduleDate,
      authorId: 'currentUserId', // get from user slice
      tags: page.tags,
      extras: page.extras
    }

    // If duplicating or new, create. Otherwise, update existing.
    try {
      dispatch(savePage(payload)) // local state update
      // Optionally call an async thunk or direct API function
      // e.g., await createPage(payload)

      // Navigate to the newly created or updated page
      navigate(`/${localURL}`)
    } catch (error) {
      console.error('Error saving page', error)
      // show error message
    }
  }

  // Example of auto-generate URL from title
  useEffect(() => {
    if (!page.id && localTitle && (localURL === 'new' || localURL === '')) {
      setLocalURL(
        localTitle
          .toLowerCase()
          .replace(/ /g, '-')
          .replace(/[\.,\/#!$%\^&\*;:{}=_'~()?]/g, '')
      )
    }
  }, [localTitle])

  return (
    <div className="page-form">
      <h1>Page Details</h1>
      <label>Title</label>
      <input
        type="text"
        value={localTitle}
        onChange={(e) => setLocalTitle(e.target.value)}
      />

      <label>Description</label>
      <textarea
        value={localDescription}
        onChange={(e) => setLocalDescription(e.target.value)}
      />

      <label>URL</label>
      <input
        type="text"
        value={localURL}
        onChange={(e) => setLocalURL(e.target.value)}
      />

      <label>Publish Status</label>
      <select
        value={localPublish}
        onChange={(e) => setLocalPublish(e.target.value)}
      >
        <option value="Y">Publish</option>
        <option value="N">Draft</option>
        <option value="schedule">Schedule</option>
      </select>

      {/* If scheduling */}
      {localPublish === 'schedule' && (
        <input
          type="datetime-local"
          value={
            localScheduleDate
              ? localScheduleDate.toISOString().slice(0, 16)
              : ''
          }
          onChange={(e) => setLocalScheduleDate(new Date(e.target.value))}
        />
      )}

      <button onClick={handleSubmit}>Save</button>
    </div>
  )
}

export default PageForm

────────────────────────────────────────────────────────
5. REACT ROUTER CONFIGURATION
────────────────────────────────────────────────────────

Replace Angular’s routes ($routeParams, etc.) with React Router. Below is a simple example:

--------------------------------------------------------------------------------
// src/routes/AppRouter.tsx
--------------------------------------------------------------------------------
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PageForm from '../features/pages/components/PageForm'
import PageEditor from '../features/pages/components/PageEditor'
// ...

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/new" element={<PageForm />} />
        <Route path="/:url" element={<PageEditor />} />
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </Router>
  )
}

export default AppRouter

• :url param replaces the $routeParams.url.  
• Use useParams() from 'react-router-dom' in your PageEditor to load the page data from the store or via an API call.

────────────────────────────────────────────────────────
6. INTERNATIONALIZATION
────────────────────────────────────────────────────────

If you used Angular’s $translate, you can migrate to react-i18next (or another i18n library). Example:

--------------------------------------------------------------------------------
// src/i18n/index.ts
--------------------------------------------------------------------------------
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import translationEN from './locales/en/translation.json'
// import translationOther from './locales/...

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN }
      // other languages...
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  })

export default i18n

Then in your React components:

--------------------------------------------------------------------------------
// Example usage in a React component
--------------------------------------------------------------------------------
import { useTranslation } from 'react-i18next'

const MyComponent: React.FC = () => {
  const { t } = useTranslation()
  return <div>{t('page_delete')}</div>
}

────────────────────────────────────────────────────────
7. LOCAL STORAGE HANDLING
────────────────────────────────────────────────────────

If your Angular code used localStorage to store partial form data, you can replicate that in React by using a custom hook, e.g.:

--------------------------------------------------------------------------------
// src/hooks/useLocalStorage.ts
--------------------------------------------------------------------------------
import { useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.warn(error)
      return initialValue
    }
  })

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(error)
    }
  }

  return [storedValue, setValue] as const
}

Then, in your PageForm, you can do:

--------------------------------------------------------------------------------
const [draftTitle, setDraftTitle] = useLocalStorage<string>('pageTitle', '')

useEffect(() => {
  // whenever localTitle changes, update local storage
  setDraftTitle(localTitle)
}, [localTitle, setDraftTitle])
--------------------------------------------------------------------------------

────────────────────────────────────────────────────────
8. PERFORMANCE & OPTIMIZATION
────────────────────────────────────────────────────────

• Code-splitting: Use React.lazy or dynamic import() in your router to split large components.  
• Use memoization (React.memo, useMemo, useCallback) for expensive operations or large lists.  
• Limit re-renders by selecting only needed slices of Redux state with useSelector.  
• Carefully manage the dependency arrays in useEffect.

────────────────────────────────────────────────────────
9. FORM VALIDATION & ERROR HANDLING
────────────────────────────────────────────────────────

• If you need more advanced validation, consider libraries like react-hook-form, Formik, or Yup.  
• Replicate Angular’s required fields, pattern validations, etc.  
• Where Angular used ng-show for error messages, you can conditionally render with boolean state.

────────────────────────────────────────────────────────
10. WRAPPING UP
────────────────────────────────────────────────────────

Following these steps:

1. Set up your React project with TypeScript, React Router, and Redux Toolkit.  
2. Create typed slices (pageSlice.ts, userSlice.ts) to store global app data.  
3. Move each Angular factory’s data structure and logic into the appropriate slice or utility file.  
4. Refactor Angular controllers (pageCtrl) into multiple React functional components (PageForm, PageEditor, etc.).  
5. Replace Angular templates with JSX, using controlled components for forms.  
6. Replace $resource with axios or fetch in dedicated API modules.  
7. Use an i18n library (e.g., react-i18next) for translations.  
8. Implement localStorage logic with custom hooks.  
9. Optimize performance with code splitting, React.memo, and carefully managed hooks.

By implementing these guidelines and carefully mapping old AngularJS functionality to modern React + TypeScript equivalents, you will preserve your application’s behavior while improving maintainability, performance, and long-term viability.

### Tokens: {'input_tokens': 5784, 'output_tokens': 4573, 'reasoning_tokens': 832}
### Execution time: 60.726048707962036
