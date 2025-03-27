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
Okay, let's migrate the provided AngularJS code (page editing feature) to React 18.x using TypeScript, Redux Toolkit, React Router, and modern practices.

**1. Project Setup (Assumptions)**

*   You have a React project set up with TypeScript (`create-react-app my-app --template typescript` or similar).
*   You've installed the necessary libraries:
    ```bash
    npm install react-router-dom @types/react-router-dom @reduxjs/toolkit react-redux axios react-i18next i18next i18next-browser-languagedetector
    # or
    yarn add react-router-dom @types/react-router-dom @reduxjs/toolkit react-redux axios react-i18next i18next i18next-browser-languagedetector
    ```

**2. Data Models (TypeScript Interfaces)**

Create interfaces for your data structures.

```typescript
// src/models/page.model.ts
export interface Page {
  id: number | string | null; // Use null for new pages
  title: string;
  description: string;
  header?: string; // Assuming these might come from elsewhere or be optional
  subheader?: string;
  body?: string; // Assuming these might come from elsewhere or be optional
  url: string;
  type: string;
  publish: 'Y' | 'N' | 'schedule';
  published_date: number | null; // Store as timestamp (seconds epoch)
  scheduleDate: string | null; // Store ISO string for datetime-local input
  tags: string[];
  themePages: string[];
  timestamp?: string; // From original factory, keep if needed
  extras: Record<string, any>; // Or a more specific type if known
  misc?: Record<string, any>; // From original factory, keep if needed
  featured?: string | null; // Added based on save logic
  author?: string | number | null; // Added based on save logic
}

export interface PageRevision extends Omit<Page, 'id' | 'themePages' | 'tags' | 'extras' | 'misc' | 'scheduleDate'> {
  contentID: number | string;
  revisionID?: number | string; // ID of the revision itself
}

export interface PageExtra {
  contentID: number | string;
  name: string;
  extra: string; // Stored as JSON string if object/array
}

export interface RevisionExtra extends PageExtra {
  revisionID: number | string;
}

// src/models/user.model.ts
export interface User {
  id: string | number | null;
  username: string;
  name: string;
  bio: string;
  email: string;
  facebook: string;
  twitter: string;
  photo: string;
  role: string;
}

// src/models/api.model.ts
export interface ApiResource<T> {
  data: T | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

export interface TagSuggestion {
  // Define structure based on API response, assuming string array for now
  tag: string;
}
```

**3. API Service (`axios` based)**

Replace the `$resource` factory with functions using `axios`.

```typescript
// src/services/apiService.ts
import axios from 'axios';
import { Page, PageRevision, PageExtra, RevisionExtra, TagSuggestion } from '../models/page.model.ts';
import { User } from '../models/user.model.ts';

const API_BASE = '/api'; // Configure your API base URL

// --- Content ---
export const fetchContentById = (contentID: string | number): Promise<Page> =>
  axios.get(`${API_BASE}/content/${contentID}`).then(res => res.data);

// Assuming fetch by URL might be needed based on routeParams.url
export const fetchContentByUrl = (url: string): Promise<Page> =>
  axios.get(`${API_BASE}/content`, { params: { url } }).then(res => res.data); // Adjust endpoint if needed

export const createContent = (data: Partial<Page>): Promise<{ id: number | string }> =>
  axios.post(`${API_BASE}/content`, data).then(res => res.data);

export const updateContent = (contentID: string | number, data: Partial<Page>): Promise<Page> =>
  axios.put(`${API_BASE}/content/${contentID}`, data).then(res => res.data);

export const deleteContent = (contentID: string | number): Promise<void> =>
  axios.delete(`${API_BASE}/content/${contentID}`).then(res => res.data);

// --- Content Revisions ---
export const createContentRevision = (contentID: string | number, data: Partial<PageRevision>): Promise<{ id: number | string }> =>
  axios.post(`${API_BASE}/content/${contentID}/revisions`, data).then(res => res.data);

export const deleteContentRevisions = (contentID: string | number): Promise<void> =>
  axios.delete(`${API_BASE}/content/${contentID}/revisions`).then(res => res.data);

// --- Content Extras ---
export const createContentExtra = (contentID: string | number, data: Omit<PageExtra, 'contentID'>): Promise<PageExtra> =>
  axios.post(`${API_BASE}/content/${contentID}/extras`, data).then(res => res.data);

export const deleteContentExtras = (contentID: string | number): Promise<void> =>
  axios.delete(`${API_BASE}/content/${contentID}/extras`).then(res => res.data);

// --- Content Revision Extras ---
export const createContentRevisionExtra = (contentID: string | number, revisionID: string | number, data: Omit<RevisionExtra, 'contentID' | 'revisionID'>): Promise<RevisionExtra> =>
  axios.post(`${API_BASE}/content/${contentID}/revisions/${revisionID}/extras`, data).then(res => res.data);

export const deleteContentRevisionExtras = (contentID: string | number): Promise<void> =>
  axios.delete(`${API_BASE}/content/${contentID}/revisions/extras`).then(res => res.data); // Assuming bulk delete endpoint exists

// --- Content Tags ---
export const createContentTag = (contentID: string | number, tag: string): Promise<void> =>
  axios.post(`${API_BASE}/content/${contentID}/tags`, { tag }).then(res => res.data); // Assuming POST body { tag: 'value' }

export const deleteContentTags = (contentID: string | number): Promise<void> =>
  axios.delete(`${API_BASE}/content/${contentID}/tags`).then(res => res.data);

export const fetchTagSuggestions = (tagQuery: string): Promise<TagSuggestion[]> =>
  axios.get(`${API_BASE}/contentTags`, { params: { tag: tagQuery } }).then(res => res.data); // Adjust endpoint if needed

// --- Users ---
export const fetchUser = (userID: string | number): Promise<User> =>
  axios.get(`${API_BASE}/users/${userID}`).then(res => res.data);

// --- Other Resources (Add as needed based on rest.js) ---
// export const fetchBlocks = ...
// export const updateBlock = ...
// ... etc

// Helper to get theme pages (assuming an endpoint exists or it's static)
export const fetchThemePages = (): Promise<string[]> => {
    // Replace with actual API call or return static data
    console.warn("fetchThemePages: Using mock data. Replace with actual API call.");
    return Promise.resolve(['default.html', 'post.html', 'contact.html']);
}
```

**4. Redux State Management (Redux Toolkit)**

*   **User Slice:**

```typescript
// src/store/slices/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../models/user.model.ts';
import { ApiResource } from '../../models/api.model.ts';
import * as api from '../../services/apiService'; // Assuming apiService exports functions

export interface UserState extends ApiResource<User> {}

const initialState: UserState = {
  data: null, // Or load from localStorage/sessionStorage if persisted
  loading: 'idle',
  error: null,
};

// Example async thunk to fetch current user (adjust logic as needed)
export const fetchCurrentUser = createAsyncThunk('user/fetchCurrent', async (_, { rejectWithValue }) => {
  try {
    // Assuming you have a way to know the current user's ID or an endpoint like /api/users/me
    const userId = 'current'; // Replace with actual logic
    const response = await api.fetchUser(userId);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch user');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.data = action.payload;
      state.loading = 'idle';
      state.error = null;
    },
    clearUser: (state) => {
      state.data = null;
      state.loading = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
```

*   **Page Editor Slice:**

```typescript
// src/store/slices/pageEditorSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Page, PageRevision, PageExtra, RevisionExtra } from '../../models/page.model.ts';
import { User } from '../../models/user.model.ts';
import { ApiResource } from '../../models/api.model.ts';
import * as api from '../../services/apiService';
import { RootState } from '../store'; // Import RootState type

// Helper to convert Date object to ISO string suitable for datetime-local
const dateToISOString = (date: Date | null | undefined): string | null => {
    if (!date) return null;
    // Adjust for local timezone offset before converting to ISO string
    const tzoffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = (new Date(date.getTime() - tzoffset)).toISOString().slice(0, 16);
    return localISOTime;
};

// Helper to convert ISO string from datetime-local to Date object
const isoStringToDate = (isoString: string | null | undefined): Date | null => {
    if (!isoString) return null;
    return new Date(isoString);
};

// Helper to convert Date object to seconds epoch timestamp
const dateToTimestamp = (date: Date | null | undefined): number | null => {
    if (!date) return null;
    return Math.round(date.getTime() / 1000);
};

// Helper to convert seconds epoch timestamp to Date object
const timestampToDate = (timestamp: number | null | undefined): Date | null => {
    if (timestamp === null || timestamp === undefined) return null;
    return new Date(timestamp * 1000);
};


export interface PageEditorState extends ApiResource<Page> {
    initialDataLoaded: boolean; // To track if initial fetch is done
    themePages: string[];
    isDirty: boolean; // Track if form has changes compared to fetched data
}

const initialPageData: Page = {
    id: null,
    title: '',
    description: '',
    url: '',
    type: '',
    publish: 'N',
    published_date: null,
    scheduleDate: dateToISOString(new Date()), // Default to now for new pages
    tags: [],
    themePages: [],
    extras: {},
    header: '',
    subheader: '',
    body: '', // Assuming these are edited elsewhere but saved with the page
    featured: null,
    author: null,
};

const initialState: PageEditorState = {
    data: { ...initialPageData },
    initialDataLoaded: false,
    themePages: [],
    loading: 'idle',
    error: null,
    isDirty: false,
};

// --- Async Thunks ---

export const fetchPageData = createAsyncThunk(
    'pageEditor/fetchData',
    async (identifier: { type: 'id' | 'url'; value: string | number }, { rejectWithValue, dispatch }) => {
        try {
            // Fetch theme pages concurrently (or fetch once globally if they don't change)
            const themePagesPromise = api.fetchThemePages();
            let pageDataPromise: Promise<Page>;

            if (identifier.type === 'id') {
                pageDataPromise = api.fetchContentById(identifier.value);
            } else {
                // Assuming API supports fetching by URL, adjust if needed
                pageDataPromise = api.fetchContentByUrl(identifier.value as string);
            }

            const [themePages, pageData] = await Promise.all([themePagesPromise, pageDataPromise]);

            // Prepare data for state
            const scheduleDate = timestampToDate(pageData.published_date);
            const publishStatus = pageData.published === 'Y'
                ? (scheduleDate && scheduleDate.getTime() > Date.now() ? 'schedule' : 'Y')
                : pageData.published; // Keep 'N' or original 'schedule' if saved that way

            const processedPageData: Page = {
                ...initialPageData, // Ensure all fields are present
                ...pageData,
                tags: pageData.tags || [], // Ensure tags is an array
                extras: pageData.extras || {}, // Ensure extras is an object
                themePages: themePages || [],
                // Convert timestamp back to ISO string for input
                scheduleDate: dateToISOString(scheduleDate),
                // Determine publish status based on date if needed (original logic was complex)
                publish: publishStatus,
            };

            return { pageData: processedPageData, themePages };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch page data');
        }
    }
);

export const savePage = createAsyncThunk(
    'pageEditor/savePage',
    async (args: { duplicate: boolean }, { getState, rejectWithValue }) => {
        const { duplicate } = args;
        const state = getState() as RootState;
        const currentPage = state.pageEditor.data;
        const currentUser = state.user.data; // Assuming user slice holds current user

        if (!currentPage || !currentUser?.id) {
            return rejectWithValue('Page data or user data is missing.');
        }
        if (!currentPage.type) {
            return rejectWithValue('page_no_type_selected'); // Use translation key
        }
        if (!currentPage.url || currentPage.url === 'new') {
            return rejectWithValue('page_no_url'); // Use translation key
        }

        // Prepare data for saving
        let scheduleTimestamp: number | null = null;
        let finalPublishStatus: 'Y' | 'N' = currentPage.publish === 'Y' ? 'Y' : 'N'; // Default

        if (currentPage.publish === 'schedule' && currentPage.scheduleDate) {
            const scheduleDateObj = isoStringToDate(currentPage.scheduleDate);
            if (scheduleDateObj) {
                scheduleTimestamp = dateToTimestamp(scheduleDateObj);
                // Original logic: If scheduled date is in the past, set publish to 'Y' immediately
                if (scheduleDateObj.getTime() < Date.now()) {
                    finalPublishStatus = 'Y';
                    // If saving as 'Y' now, use current time as published_date unless it was already published
                    if (state.pageEditor.data?.publish !== 'Y') { // Check original loaded state if needed
                       scheduleTimestamp = dateToTimestamp(new Date());
                    }
                } else {
                    finalPublishStatus = 'N'; // It's scheduled for the future, save as draft ('N')
                }
            }
        } else if (currentPage.publish === 'Y') {
            // If publishing now ('Y') and it wasn't already published ('Y'), set timestamp to now
             if (state.pageEditor.data?.publish !== 'Y') { // Check original loaded state if needed
                scheduleTimestamp = dateToTimestamp(new Date());
             } else {
                // Keep original published_date if it was already published
                scheduleTimestamp = currentPage.published_date;
             }
        } else { // Draft ('N')
            scheduleTimestamp = null; // No publish date for drafts
        }


        const pagePayload: Partial<Page> = {
            title: currentPage.title || currentPage.header || '', // Fallback logic from original
            description: currentPage.description,
            header: currentPage.header,
            subheader: currentPage.subheader,
            featured: currentPage.featured, // Assuming featured image URL is managed in extras or elsewhere
            body: currentPage.body, // Assuming body is managed elsewhere but saved here
            url: currentPage.url,
            type: currentPage.type,
            published: finalPublishStatus,
            published_date: scheduleTimestamp,
            author: currentUser.id,
        };

        try {
            let contentID: string | number;
            let revisionID: string | number | undefined;

            // 1. Save/Update Content
            if (currentPage.id && !duplicate) {
                // Update existing page
                await api.updateContent(currentPage.id, pagePayload);
                contentID = currentPage.id;
            } else {
                // Create new page or duplicate
                const createResponse = await api.createContent(pagePayload);
                contentID = createResponse.id;
            }

            // 2. Save Revision (always create a new revision on save)
            const revisionPayload: Partial<PageRevision> = { ...pagePayload };
            const revisionResponse = await api.createContentRevision(contentID, revisionPayload);
            revisionID = revisionResponse.id;

            // 3. Handle Tags (Delete old, Add new) - Perform concurrently
            const tagPromises: Promise<any>[] = [];
            if (currentPage.id && !duplicate) { // Only delete if updating existing
                tagPromises.push(api.deleteContentTags(contentID));
            }
            // Wait for delete to potentially finish before adding, or handle conflicts server-side
            await Promise.all(tagPromises);

            const addTagPromises = (currentPage.tags || [])
                .filter(tag => tag && tag.trim() !== '') // Ensure tags are valid
                .map(tag => api.createContentTag(contentID, tag.trim()));
            await Promise.all(addTagPromises);


            // 4. Handle Extras (Delete old, Add new) - Perform concurrently
            const extraPromises: Promise<any>[] = [];
             if (currentPage.id && !duplicate) { // Only delete if updating existing
                extraPromises.push(api.deleteContentExtras(contentID));
                // Assuming we also need to delete old revision extras? This wasn't explicitly clear.
                // If needed: extraPromises.push(api.deleteContentRevisionExtras(contentID));
             }
            // Wait for delete to potentially finish before adding
            await Promise.all(extraPromises);

            const addExtraPromises: Promise<any>[] = [];
            const addRevisionExtraPromises: Promise<any>[] = [];

            for (const key in currentPage.extras) {
                if (Object.prototype.hasOwnProperty.call(currentPage.extras, key)) {
                    let extraValue = currentPage.extras[key];
                    // Stringify objects/arrays as per original logic
                    if (typeof extraValue === 'object' && extraValue !== null) {
                        try {
                            extraValue = JSON.stringify(extraValue);
                        } catch (e) {
                            console.error(`Failed to stringify extra '${key}':`, e);
                            continue; // Skip this extra if stringification fails
                        }
                    }

                    const extraPayload: Omit<PageExtra, 'contentID'> = { name: key, extra: extraValue };
                    addExtraPromises.push(api.createContentExtra(contentID, extraPayload));

                    if (revisionID) {
                         const revisionExtraPayload: Omit<RevisionExtra, 'contentID' | 'revisionID'> = { name: key, extra: extraValue };
                        addRevisionExtraPromises.push(api.createContentRevisionExtra(contentID, revisionID, revisionExtraPayload));
                    }
                }
            }
            await Promise.all([...addExtraPromises, ...addRevisionExtraPromises]);

            // Return the final content ID and URL for potential redirect
            return { contentID, url: pagePayload.url };

        } catch (error: any) {
             console.error("Save Page Error:", error);
             // Try to return specific error messages based on API response if available
             const message = error.response?.data?.message || error.message || 'page_error_saving'; // Use translation key
             return rejectWithValue(message);
        }
    }
);

export const deletePage = createAsyncThunk(
    'pageEditor/deletePage',
    async (contentID: string | number, { rejectWithValue }) => {
        try {
            // Perform deletions concurrently
            await Promise.all([
                api.deleteContent(contentID),
                api.deleteContentRevisions(contentID),
                api.deleteContentExtras(contentID),
                api.deleteContentTags(contentID),
                api.deleteContentRevisionExtras(contentID), // Assuming this is desired
            ]);
            return contentID; // Return ID on success
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete page');
        }
    }
);


// --- Slice Definition ---

const pageEditorSlice = createSlice({
    name: 'pageEditor',
    initialState,
    reducers: {
        resetPageEditor: () => initialState,
        setPageField: <K extends keyof Page>(state: PageEditorState, action: PayloadAction<{ field: K; value: Page[K] }>) => {
            if (state.data) {
                state.data[action.payload.field] = action.payload.value;
                state.isDirty = true; // Mark as dirty on any field change
            }
        },
        setPageType: (state, action: PayloadAction<string>) => {
            if (state.data) {
                state.data.type = action.payload;
                state.isDirty = true;
                // Potentially trigger other actions like 'settingsGet' if needed
            }
        },
        setPageTags: (state, action: PayloadAction<string[]>) => {
            if (state.data) {
                state.data.tags = action.payload;
                state.isDirty = true;
            }
        },
        setPageExtras: (state, action: PayloadAction<Record<string, any>>) => {
             if (state.data) {
                state.data.extras = action.payload;
                state.isDirty = true;
            }
        },
        // Reducer to load data from local storage (newer version)
        loadLocalVersion: (state, action: PayloadAction<Partial<Page>>) => {
             if (state.data) {
                // Merge stored data onto current state
                state.data = { ...state.data, ...action.payload };
                // Important: Convert scheduleDate timestamp back to ISO string if stored that way
                if (action.payload.published_date) {
                    state.data.scheduleDate = dateToISOString(timestampToDate(action.payload.published_date));
                }
                state.isDirty = true; // Loaded version is likely different
            }
        }
    },
    extraReducers: (builder) => {
        // Fetch Page Data
        builder
            .addCase(fetchPageData.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
                state.initialDataLoaded = false;
                state.isDirty = false; // Reset dirty flag on new fetch
            })
            .addCase(fetchPageData.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.data = action.payload.pageData;
                state.themePages = action.payload.themePages;
                 // Set default type if not set and theme pages exist
                if (!state.data.type && state.themePages.length > 0) {
                    state.data.type = state.themePages[0];
                }
                state.initialDataLoaded = true;
                state.isDirty = false; // Reset dirty flag after successful fetch
            })
            .addCase(fetchPageData.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload as string;
                state.initialDataLoaded = false; // Failed to load
                state.isDirty = false;
            });

        // Save Page
        builder
            .addCase(savePage.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(savePage.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                // Update page ID if it was a new page
                if (state.data && !state.data.id) {
                    state.data.id = action.payload.contentID;
                }
                 // Update URL in state if it changed (though redirect handles this)
                if (state.data && action.payload.url) {
                    state.data.url = action.payload.url;
                }
                state.isDirty = false; // Reset dirty flag after successful save
                state.error = null;
                // Navigation should happen in the component after success
            })
            .addCase(savePage.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload as string;
            });

        // Delete Page
        builder
            .addCase(deletePage.pending, (state) => {
                state.loading = 'pending'; // Or a specific 'deleting' state
                state.error = null;
            })
            .addCase(deletePage.fulfilled, (state) => {
                // Reset state after successful deletion
                return { ...initialState, loading: 'succeeded' }; // Keep loading status briefly?
            })
            .addCase(deletePage.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const {
    resetPageEditor,
    setPageField,
    setPageType,
    setPageTags,
    setPageExtras,
    loadLocalVersion,
} = pageEditorSlice.actions;
export default pageEditorSlice.reducer;
```

*   **Store Configuration:**

```typescript
// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import pageEditorReducer from './slices/pageEditorSlice';
// Import other reducers as needed

export const store = configureStore({
  reducer: {
    user: userReducer,
    pageEditor: pageEditorReducer,
    // other reducers...
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

*   **Redux Hooks:**

```typescript
// src/store/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

**5. Internationalization (i18next)**

*   **Setup:**

```typescript
// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Example translation resources (move to JSON files)
const resources = {
  en: {
    translation: {
      page_newer: "A newer version of this page was found saved locally.",
      discard: "Discard Local Version",
      compare: "Compare (Not Implemented)", // Add compare functionality if needed
      use: "Use Local Version",
      page_details: "Page Details",
      delete: "Delete",
      duplicate: "Duplicate",
      save: "Save",
      page_delete: "Are you sure you want to delete this page and all its history?",
      yes: "Yes, Delete",
      no: "No, Keep",
      type: "Type",
      title: "Title",
      description: "Description",
      tags: "Tags",
      url: "URL",
      publish: "Published",
      draft: "Draft",
      schedule: "Schedule",
      deleted: "Page deleted successfully.",
      saved: "Page saved successfully.",
      page_created: "Page created successfully.",
      page_updated: "Page updated successfully.",
      page_different_url: "Please use a different URL when duplicating.",
      page_no_type_selected: "Please select a page type.",
      page_no_url: "Page URL cannot be empty.",
      page_error_saving: "Error saving page. Please try again.",
      page_error_updating: "Error updating page. Please try again.",
      // Add other keys from the original code...
    }
  },
  // Add other languages...
};

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Use English if detected language is not available
    interpolation: {
      escapeValue: false // React already safes from xss
    },
    // detection: { // Options for LanguageDetector
    //   order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
    // }
  });

export default i18n;
```

*   **Initialize in `index.tsx`:**

```typescript
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './store/store';
import './i18n'; // Initialize i18next
import './index.css'; // Your global styles

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
```

**6. Routing (React Router)**

```typescript
// src/App.tsx
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import PageEditor from './features/pageEditor/PageEditor';
import { useAppDispatch } from './store/hooks';
import { fetchCurrentUser } from './store/slices/userSlice';
// Import other components/layouts
// import Sidebar from './components/Sidebar';
// import Header from './components/Header';
// import Notifications from './components/Notifications'; // Component to display notifications

function App() {
  const dispatch = useAppDispatch();
  const location = useLocation();

  // Fetch current user on initial load (or based on auth state)
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  // Example: Reset page editor state when navigating away from editor routes
  // useEffect(() => {
  //   if (!location.pathname.startsWith('/new') && !location.pathname.startsWith('/edit/')) {
  //     // dispatch(resetPageEditor()); // Consider if this is desired behavior
  //   }
  // }, [location, dispatch]);


  return (
    <div className="app-container">
      {/* <Notifications /> */}
      {/* <Header /> */}
      {/* <Sidebar /> */}
      <main className="content-area">
        <Routes>
          {/* Define other routes */}
          <Route path="/new" element={<PageEditor key="new" />} /> {/* Use key to force remount */}
          <Route path="/edit/:pageUrl" element={<PageEditor />} />
          <Route path="/" element={<div>Home Page</div>} /> {/* Example Home */}
          {/* Add a 404 route */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
```

**7. Components**

*   **`PageEditor` (Container Component):**

```typescript
// src/features/pageEditor/PageEditor.tsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
    fetchPageData,
    savePage,
    deletePage,
    setPageField,
    setPageType,
    setPageTags,
    resetPageEditor,
    loadLocalVersion,
} from '../../store/slices/pageEditorSlice';
import { Page } from '../../models/page.model.ts';
import PageDetailsForm from './components/PageDetailsForm';
import ActionToolbar from './components/ActionToolbar';
import NewerVersionBanner from './components/NewerVersionBanner';
import LoadingSpinner from '../../components/ui/LoadingSpinner'; // Assume a simple spinner component

// Define keys for local storage check
const LOCAL_STORAGE_FIELDS: (keyof Page)[] = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url', 'type', 'tags', 'extras'];

const PageEditor: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { pageUrl } = useParams<{ pageUrl?: string }>(); // For /edit/:pageUrl
    const isNewPage = location.pathname === '/new';

    const { data: page, loading, error, themePages, initialDataLoaded, isDirty } = useAppSelector(state => state.pageEditor);
    const currentUser = useAppSelector(state => state.user.data);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [newerVersionDetected, setNewerVersionDetected] = useState(false);
    const [localPageIdentifier, setLocalPageIdentifier] = useState<string | null>(null);

    // --- Effects ---

    // Reset state when component unmounts or identifier changes significantly
    useEffect(() => {
        return () => {
            // Optionally reset state when navigating away
            // dispatch(resetPageEditor());
        };
    }, [dispatch]);

    // Fetch page data on mount or when identifier changes
    useEffect(() => {
        if (isNewPage) {
            dispatch(resetPageEditor()); // Start with clean state for new page
            // Fetch theme pages even for new pages
            dispatch(fetchPageData({ type: 'id', value: -1 })); // Trigger fetch logic for theme pages, handle error gracefully in slice
            setLocalPageIdentifier('new');
        } else if (pageUrl) {
            dispatch(fetchPageData({ type: 'url', value: pageUrl }));
            setLocalPageIdentifier(pageUrl); // Use URL as identifier for local storage
        }
    }, [dispatch, pageUrl, isNewPage]);

    // Check for newer version in local storage after initial data loads
    useEffect(() => {
        if (initialDataLoaded && page && localPageIdentifier && !isNewPage) {
            let foundNewer = false;
            for (const key of LOCAL_STORAGE_FIELDS) {
                const storedValue = localStorage.getItem(`${localPageIdentifier}_${key}`);
                if (storedValue !== null && storedValue !== 'null') {
                    // Simple comparison (might need refinement for objects/arrays)
                    let currentValue: any = page[key];
                    let parsedStoredValue: any = storedValue;

                    // Attempt to parse if it looks like JSON
                    if ((key === 'tags' || key === 'extras') && typeof currentValue === 'object') {
                         try { parsedStoredValue = JSON.parse(storedValue); } catch (e) {}
                         // Need a deep comparison for objects/arrays
                         if (JSON.stringify(currentValue) !== JSON.stringify(parsedStoredValue)) {
                            foundNewer = true;
                            break;
                         }
                    } else if (String(currentValue) !== String(parsedStoredValue)) {
                        foundNewer = true;
                        break;
                    }
                }
            }
            setNewerVersionDetected(foundNewer);
        }
    }, [initialDataLoaded, page, localPageIdentifier, isNewPage]);


    // --- Local Storage Handlers ---

    const clearLocalStorageVersion = useCallback(() => {
        if (localPageIdentifier) {
            LOCAL_STORAGE_FIELDS.forEach(key => {
                localStorage.removeItem(`${localPageIdentifier}_${key}`);
            });
            setNewerVersionDetected(false);
        }
    }, [localPageIdentifier]);

    const handleUseLocalVersion = useCallback(() => {
        if (localPageIdentifier) {
            const storedData: Partial<Page> = {};
            LOCAL_STORAGE_FIELDS.forEach(key => {
                const storedValue = localStorage.getItem(`${localPageIdentifier}_${key}`);
                if (storedValue !== null && storedValue !== 'undefined' && storedValue !== 'null') {
                     try {
                        // Attempt to parse JSON for specific fields
                        if ((key === 'tags' || key === 'extras') && storedValue.startsWith('[') || storedValue.startsWith('{')) {
                             storedData[key] = JSON.parse(storedValue);
                        } else if (key === 'published_date' && !isNaN(Number(storedValue))) {
                             storedData[key] = Number(storedValue); // Assuming stored as timestamp
                        }
                        else {
                            storedData[key] = storedValue as any; // Assign directly, handle type in reducer
                        }
                    } catch (e) {
                        console.error(`Error parsing local storage key ${key}:`, e);
                        storedData[key] = storedValue as any; // Fallback to raw string
                    }
                }
            });
            dispatch(loadLocalVersion(storedData));
            clearLocalStorageVersion(); // Clear after loading
        }
    }, [dispatch, localPageIdentifier, clearLocalStorageVersion]);

    // --- Event Handlers ---

    const handleFieldChange = useCallback((field: keyof Page, value: any) => {
        dispatch(setPageField({ field, value }));

        // Auto-generate URL for new pages only if URL hasn't been manually changed
        if (field === 'title' && isNewPage && (!page?.url || page.url === 'new')) {
             const newUrl = String(value)
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^a-z0-9-]/g, ''); // Basic slugify
             dispatch(setPageField({ field: 'url', value: newUrl }));
        }

        // Save changes to local storage (debounced would be better)
        if (localPageIdentifier) {
             let valueToStore = value;
             if (typeof value === 'object') {
                 valueToStore = JSON.stringify(value);
             }
             localStorage.setItem(`${localPageIdentifier}_${field}`, String(valueToStore));
        }

    }, [dispatch, isNewPage, page?.url, localPageIdentifier]);

    const handleTypeChange = useCallback((value: string) => {
        dispatch(setPageType(value));
         if (localPageIdentifier) {
             localStorage.setItem(`${localPageIdentifier}_type`, value);
         }
    }, [dispatch, localPageIdentifier]);

     const handleTagsChange = useCallback((tags: string[]) => {
        dispatch(setPageTags(tags));
         if (localPageIdentifier) {
             localStorage.setItem(`${localPageIdentifier}_tags`, JSON.stringify(tags));
         }
    }, [dispatch, localPageIdentifier]);

    const handleSave = useCallback(async (isDuplicate = false) => {
        if (!page) return;

        // Duplicate URL check
        if (isDuplicate && page.url === pageUrl) {
            // Use a notification system instead of broadcast
            console.error(t('page_different_url'));
            alert(t('page_different_url')); // Simple alert for now
            return;
        }

        const resultAction = await dispatch(savePage({ duplicate: isDuplicate }));

        if (savePage.fulfilled.match(resultAction)) {
            const { contentID, url: savedUrl } = resultAction.payload;
            clearLocalStorageVersion(); // Clear local storage on successful save
            // Use a notification system
            console.log(isNewPage || isDuplicate ? t('page_created') : t('page_updated'));
            alert(isNewPage || isDuplicate ? t('page_created') : t('page_updated')); // Simple alert
            // Redirect to the edited/created page's URL
            navigate(`/edit/${savedUrl}`); // Or navigate based on your routing structure
        } else if (savePage.rejected.match(resultAction)) {
            // Use a notification system
            console.error(t(resultAction.payload as string || 'page_error_saving'));
            alert(t(resultAction.payload as string || 'page_error_saving')); // Simple alert
        }
    }, [dispatch, page, pageUrl, isNewPage, navigate, t, clearLocalStorageVersion]);

    const handleDelete = useCallback(async () => {
        if (page?.id) {
            const resultAction = await dispatch(deletePage(page.id));
            if (deletePage.fulfilled.match(resultAction)) {
                clearLocalStorageVersion();
                // Use a notification system
                console.log(t('deleted'));
                alert(t('deleted')); // Simple alert
                navigate('/new'); // Redirect to new page form after delete
            } else {
                 // Use a notification system
                console.error(t(resultAction.payload as string || 'Failed to delete page'));
                alert(t(resultAction.payload as string || 'Failed to delete page')); // Simple alert
            }
        }
        setShowDeleteConfirm(false);
    }, [dispatch, page?.id, navigate, t, clearLocalStorageVersion]);

    // --- Render Logic ---

    if (loading === 'pending' && !initialDataLoaded) {
        return <LoadingSpinner />; // Show loading indicator on initial load
    }

    if (error && !page) { // Show error if loading failed and no data is present
        return <div className="error-message">Error loading page: {error}</div>;
    }

    if (!page) { // Should not happen if loading/error handled, but good fallback
        return <div>No page data available.</div>;
    }

    return (
        <div className="page-editor-container">
            {/* Add Top Bar / Navigation elements here if needed */}
             {/* <div className="bar-top"> ... </div> */}

            {newerVersionDetected && (
                <NewerVersionBanner
                    onDiscard={clearLocalStorageVersion}
                    onUse={handleUseLocalVersion}
                    onCompare={() => alert('Compare not implemented')} // Implement compare if needed
                />
            )}

            <ActionToolbar
                isNew={isNewPage}
                isDirty={isDirty} // Pass dirty flag if needed for save button state
                isLoading={loading === 'pending'}
                showDeleteConfirm={showDeleteConfirm}
                onSave={() => handleSave(false)}
                onDuplicate={() => handleSave(true)}
                onDelete={() => setShowDeleteConfirm(true)}
                onConfirmDelete={handleDelete}
                onCancelDelete={() => setShowDeleteConfirm(false)}
            />

             {loading === 'pending' && <LoadingSpinner />} {/* Show spinner during save/delete */}
             {error && <div className="error-message">{error}</div>} {/* Show save/delete errors */}


            <PageDetailsForm
                page={page}
                themePages={themePages}
                onFieldChange={handleFieldChange}
                onTypeChange={handleTypeChange}
                onTagsChange={handleTagsChange}
                // Pass other necessary props like tag suggestions fetch logic
            />

            {/* Add other sections like content body editor (e.g., CKEditor, TinyMCE) here */}
            {/* These would likely interact with page.body, page.header etc. via handleFieldChange */}

        </div>
    );
};

export default PageEditor;
```

*   **`PageDetailsForm` (Presentational Component):**

```typescript
// src/features/pageEditor/components/PageDetailsForm.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Page, TagSuggestion } from '../../../models/page.model.ts';
import * as api from '../../../services/apiService'; // For tag suggestions

interface PageDetailsFormProps {
    page: Page;
    themePages: string[];
    onFieldChange: (field: keyof Page, value: any) => void;
    onTypeChange: (value: string) => void;
    onTagsChange: (tags: string[]) => void;
}

// Simple TitleCase filter simulation
const titleCase = (str: string): string =>
    str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

// Simple Theme File filter simulation
const themeFiles = (filename: string): string => filename.replace('.html', '').replace('-', ' ');


const PageDetailsForm: React.FC<PageDetailsFormProps> = ({
    page,
    themePages,
    onFieldChange,
    onTypeChange,
    onTagsChange,
}) => {
    const { t } = useTranslation();
    const [tagInput, setTagInput] = useState<string>(''); // Current input for the next tag
    const [suggestions, setSuggestions] = useState<TagSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

    // Update tag input when tags array changes from outside (e.g., loading local version)
    useEffect(() => {
        setTagInput(''); // Clear input when tags prop changes
    }, [page.tags]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onFieldChange(name as keyof Page, value);
    };

     const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onFieldChange(name as keyof Page, value as Page['publish']);
    };

    const handleScheduleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFieldChange('scheduleDate', e.target.value); // Value is ISO string
    };

    const handleTypeSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onTypeChange(e.target.value);
    };

    // --- Tag Input Logic ---
    const handleTagInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTagInput(value);

        if (value.includes(',')) {
            // Add tags when comma is pressed
            const newTags = value.split(',')
                .map(tag => tag.trim())
                .filter(tag => tag !== '' && !page.tags.includes(tag)); // Avoid duplicates and empty

            if (newTags.length > 0) {
                onTagsChange([...page.tags, ...newTags]);
            }
            setTagInput(''); // Clear input
            setSuggestions([]);
            setShowSuggestions(false);
        } else if (value.trim()) {
            // Fetch suggestions
            try {
                // Debounce this fetch in a real app
                const fetchedSuggestions = await api.fetchTagSuggestions(value.trim());
                setSuggestions(fetchedSuggestions);
                setShowSuggestions(fetchedSuggestions.length > 0);
            } catch (error) {
                console.error("Failed to fetch tag suggestions:", error);
                setSuggestions([]);
                setShowSuggestions(false);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === 'Tab') {
             if (tagInput.trim() && !page.tags.includes(tagInput.trim())) {
                 e.preventDefault();
                 onTagsChange([...page.tags, tagInput.trim()]);
                 setTagInput('');
                 setSuggestions([]);
                 setShowSuggestions(false);
             }
        } else if (e.key === 'Backspace' && tagInput === '' && page.tags.length > 0) {
             // Remove last tag on backspace if input is empty
             e.preventDefault();
             onTagsChange(page.tags.slice(0, -1));
        }
    };

    const removeTag = (indexToRemove: number) => {
        onTagsChange(page.tags.filter((_, index) => index !== indexToRemove));
    };

    const selectSuggestion = (tag: string) => {
        if (!page.tags.includes(tag)) {
            onTagsChange([...page.tags, tag]);
        }
        setTagInput('');
        setSuggestions([]);
        setShowSuggestions(false);
    };


    return (
        <div className="pg-editor form-case">
            {/* Type */}
            <label className="type" htmlFor="type">{t('type')}</label>
            <div className="cos-select"> {/* Keep original class or adapt */}
                <select
                    id="type"
                    name="type"
                    value={page.type || ''}
                    onChange={handleTypeSelectChange}
                    required
                >
                    {/* Add a default placeholder option if needed */}
                    {/* <option value="" disabled>{t('select_type')}</option> */}
                    {themePages.map(themePage => (
                        <option key={themePage} value={themePage}>
                            {titleCase(themeFiles(themePage))}
                        </option>
                    ))}
                </select>
            </div>

            {/* Title */}
            <label htmlFor="title">{t('title')}</label>
            <span className="num-count">{page.title?.length || 0}</span>
            <input
                type='text'
                id="title"
                name="title"
                value={page.title || ''}
                onChange={handleInputChange}
                placeholder="about us, contact us"
            />

            {/* Description */}
            <label htmlFor="description">{t('description')}</label>
            <span className="num-count">{page.description?.length || 0}</span>
            <textarea
                id="description"
                name="description"
                value={page.description || ''}
                onChange={handleInputChange}
                placeholder="Tom's Restaurant is a diner located at..."
            />

            {/* Tags */}
            <label htmlFor="tags">{t('tags')}</label>
            <div className="tags-input-container"> {/* Wrapper for tags */}
                 {page.tags.map((tag, index) => (
                    <span key={index} className="tag-item">
                        {tag}
                        <button type="button" onClick={() => removeTag(index)}>&times;</button>
                    </span>
                 ))}
                <input
                    id="tags"
                    type="text"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onKeyDown={handleTagKeyDown}
                    onFocus={() => setShowSuggestions(suggestions.length > 0)}
                    // onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // Delay hide to allow click
                    placeholder={page.tags.length === 0 ? "about, restaurant, food, nyc" : ""}
                />
            </div>
             {showSuggestions && (
                <div className="tag-suggestions">
                    {suggestions.slice(0, 10).map((suggestion, index) => (
                        <a key={index} onClick={() => selectSuggestion(suggestion.tag)}>
                            {titleCase(suggestion.tag)}
                        </a>
                    ))}
                </div>
            )}


            {/* URL */}
            <label htmlFor="url">{t('url')}</label>
            <input
                id="url"
                name="url"
                type='text'
                value={page.url || ''}
                onChange={handleInputChange}
                // Add pattern validation if needed: pattern="[a-z0-9-]+"
            />

            {/* Publish Status */}
            <div className="publish-options">
                 {/* Published */}
                 <input
                    type="radio"
                    id="Y"
                    name="publish"
                    value="Y"
                    checked={page.publish === 'Y'}
                    onChange={handleRadioChange}
                    className={page.publish === 'Y' ? 'active' : ''}
                 />
                 <label htmlFor="Y">{t('publish')}</label>

                 {/* Draft */}
                 <input
                    type="radio"
                    id="N"
                    name="publish"
                    value="N"
                    checked={page.publish === 'N'}
                    onChange={handleRadioChange}
                    className={page.publish === 'N' ? 'active' : ''}
                 />
                 <label htmlFor="N">{t('draft')}</label>

                 {/* Schedule */}
                 <input
                    type="radio"
                    id="schedule"
                    name="publish"
                    value="schedule"
                    checked={page.publish === 'schedule'}
                    onChange={handleRadioChange}
                    className={page.publish === 'schedule' ? 'active' : ''}
                 />
                 <label htmlFor="schedule">{t('schedule')}</label>

                 {/* Schedule Date Input */}
                 {page.publish === 'schedule' && (
                    <>
                        <div className="schedule-triangle"></div>
                        <input
                            type="datetime-local"
                            className="schedule radio-inline" // Keep classes or adapt
                            value={page.scheduleDate || ''}
                            onChange={handleScheduleDateChange}
                            name="scheduleDate"
                        />
                    </>
                 )}
            </div>
        </div>
    );
};

export default React.memo(PageDetailsForm); // Memoize if props don't change often unnecessarily
```

*   **`ActionToolbar` (Presentational Component):**

```typescript
// src/features/pageEditor/components/ActionToolbar.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/ui/Button'; // Assume a reusable Button component

interface ActionToolbarProps {
    isNew: boolean;
    isDirty: boolean;
    isLoading: boolean;
    showDeleteConfirm: boolean;
    onSave: () => void;
    onDuplicate: () => void;
    onDelete: () => void;
    onConfirmDelete: () => void;
    onCancelDelete: () => void;
    // Add props for Back/Close if needed
    // onBack: () => void;
    // onClose: () => void;
}

const ActionToolbar: React.FC<ActionToolbarProps> = ({
    isNew,
    isDirty,
    isLoading,
    showDeleteConfirm,
    onSave,
    onDuplicate,
    onDelete,
    onConfirmDelete,
    onCancelDelete,
}) => {
    const { t } = useTranslation();

    return (
        <div className="bar--actions"> {/* Keep original class or adapt */}
            {showDeleteConfirm ? (
                <>
                    <p>{t('page_delete')}</p>
                    <Button
                        variant="error"
                        onClick={onConfirmDelete}
                        disabled={isLoading}
                    >
                        {t('yes')}
                    </Button>
                    <Button
                        variant="success"
                        onClick={onCancelDelete}
                        disabled={isLoading}
                    >
                        {t('no')}
                    </Button>
                </>
            ) : (
                <>
                    {!isNew && ( // Show delete only for existing pages
                        <Button
                            variant="error"
                            onClick={onDelete}
                            disabled={isLoading}
                        >
                            {t('delete')}
                        </Button>
                    )}
                     {/* Show duplicate only for existing pages? Or always? Adjust logic */}
                    {!isNew && (
                        <Button
                            variant="options"
                            onClick={onDuplicate}
                            disabled={isLoading}
                        >
                            {t('duplicate')}
                        </Button>
                    )}
                    <Button
                        variant="success"
                        onClick={onSave}
                        disabled={isLoading || !isDirty} // Disable save if not dirty or loading
                    >
                        {t('save')}
                    </Button>
                </>
            )}
        </div>
    );
};

export default ActionToolbar;
```

*   **`NewerVersionBanner` (Presentational Component):**

```typescript
// src/features/pageEditor/components/NewerVersionBanner.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/ui/Button';

interface NewerVersionBannerProps {
    onDiscard: () => void;
    onCompare: () => void;
    onUse: () => void;
}

const NewerVersionBanner: React.FC<NewerVersionBannerProps> = ({ onDiscard, onCompare, onUse }) => {
    const { t } = useTranslation();

    return (
        <div className="new-version form-case"> {/* Keep original class or adapt */}
            <p>{t('page_newer')}</p>
            <Button variant="error" onClick={onDiscard}>{t('discard')}</Button>
            <Button variant="options" onClick={onCompare}>{t('compare')}</Button>
            <Button variant="success" onClick={onUse}>{t('use')}</Button>
        </div>
    );
};

export default NewerVersionBanner;
```

*   **Reusable `Button` Component (Example):**

```typescript
// src/components/ui/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'success' | 'error' | 'options' | 'default';
}

const Button: React.FC<ButtonProps> = ({ variant = 'default', children, className, ...props }) => {
    const baseClasses = "btn"; // Your base button class
    const variantClasses = {
        success: "btn-success",
        error: "btn-error",
        options: "btn-options",
        default: "", // Add a default class if needed
    };

    const combinedClassName = `${baseClasses} ${variantClasses[variant]} ${className || ''}`.trim();

    return (
        <button className={combinedClassName} {...props}>
            {children}
        </button>
    );
};

export default Button;
```

*   **Reusable `LoadingSpinner` Component (Example):**

```typescript
// src/components/ui/LoadingSpinner.tsx
import React from 'react';
import './LoadingSpinner.css'; // Add CSS for animation

const LoadingSpinner: React.FC = () => {
    return (
        <div className="spinner-overlay">
            <div className="spinner"></div>
        </div>
    );
};

export default LoadingSpinner;
```

**8. CSS**

*   You will need to either migrate your existing CSS or create new styles for the components. The provided code uses classes like `form-case`, `bar-top`, `bar--actions`, `pg-editor`, `cos-select`, `num-count`, `tag-suggestions`, `radio-inline`, `schedule-triangle`, `btn-error`, `btn-options`, `btn-success`. Ensure these (or equivalent styles) are defined.
*   Consider using CSS Modules, Styled Components, or Tailwind CSS for better style management in React.

**Summary of Changes and Considerations:**

1.  **State Management:** Moved from AngularJS factories (`Page`, `Users`) to Redux Toolkit slices (`pageEditorSlice`, `userSlice`). Async operations are handled with `createAsyncThunk`.
2.  **API:** Replaced `$resource` with explicit `axios` calls in `apiService.ts`.
3.  **Components:** Broke down `pageCtrl` and `page.html` into container (`PageEditor`) and presentational components (`PageDetailsForm`, `ActionToolbar`, `NewerVersionBanner`). Used React hooks (`useState`, `useEffect`, `useCallback`).
4.  **Routing:** Used `react-router-dom` (`useParams`, `useNavigate`, `Routes`, `Route`).
5.  **Forms:** Implemented controlled components, managing form state in Redux. Tag input logic is recreated using React state and event handlers. Date handling uses `datetime-local` and ISO strings.
6.  **TypeScript:** Added strict typing with interfaces for models, props, and state.
7.  **i18n:** Integrated `react-i18next` using the `useTranslation` hook.
8.  **Local Storage:** Replicated the "newer version" logic using `useEffect` and `localStorage` within the `PageEditor` component, interacting with Redux state.
9.  **Notifications:** Replaced `$rootScope.$broadcast('notify', ...)` with comments indicating where a proper notification system (e.g., `react-toastify` or a custom Redux slice/context) should be integrated. Simple `alert()` calls are used as placeholders.
10. **Code Structure:** Organized into features (`pageEditor`), services, store, models, components/ui.
11. **Optimization:** Used `React.memo` on `PageDetailsForm` as an example. `useCallback` is used for handlers passed down as props. `useEffect` dependencies are specified.
12. **Date Handling:** Carefully converted between `Date` objects, ISO strings (for `datetime-local`), and Unix timestamps (seconds epoch) for API/storage, mirroring the complex logic from the original controller.

This migration provides a solid foundation in React. Further refinements would include adding robust error handling, implementing a notification system, potentially debouncing input handlers (like tag suggestions fetch), adding more comprehensive form validation, and writing unit/integration tests.

### Tokens: {'input_tokens': 6711, 'output_tokens': 14832}
### Execution time: 132.6127529144287
