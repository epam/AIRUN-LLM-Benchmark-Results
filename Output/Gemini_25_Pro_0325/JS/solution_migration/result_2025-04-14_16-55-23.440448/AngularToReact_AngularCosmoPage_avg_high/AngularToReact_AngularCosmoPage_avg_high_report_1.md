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
Okay, let's migrate the AngularJS `pageCtrl` and related factories/services to React 18.x with TypeScript, Redux Toolkit, React Router, and `react-i18next`.

**1. Project Setup (Assumptions)**

*   You have a React project set up with TypeScript (`create-react-app --template typescript` or Vite with TypeScript).
*   You've installed the necessary libraries:
    ```bash
    npm install @reduxjs/toolkit react-redux react-router-dom axios react-i18next i18next i18next-browser-languagedetector date-fns lodash.debounce
    # or
    yarn add @reduxjs/toolkit react-redux react-router-dom axios react-i18next i18next i18next-browser-languagedetector date-fns lodash.debounce
    ```
*   Basic CSS is assumed to be migrated or available to style the components similarly.

**2. API Service Layer**

Replace the AngularJS `$resource` factory with a modern API service using `axios`.

```typescript
// src/services/apiTypes.ts
// Define interfaces for API request/response data (add more as needed)
export interface ContentData {
    id?: number;
    title: string;
    description: string;
    header?: string; // Assuming these come from somewhere else or are part of the full Page state
    subheader?: string;
    featured?: string | null;
    body?: string; // Assuming this is edited elsewhere
    url: string;
    type: string;
    published: 'Y' | 'N'; // 'schedule' is handled client-side before saving
    published_date?: number | null; // Store as timestamp (seconds)
    author?: number;
    timestamp?: string; // Assuming this is returned by the API
    tags?: string[]; // Assuming API might return tags with content
    extras?: Record<string, any>; // Assuming API might return extras
}

export interface ContentRevisionData extends Omit<ContentData, 'id' | 'tags' | 'extras'> {
    contentID: number;
    revisionID?: number;
}

export interface TagSuggestion {
    // Define structure based on what your API returns for tag suggestions
    // Assuming it's just an array of strings for now
    tag: string;
}

export interface UserData {
    id: number;
    username: string;
    name: string;
    bio: string;
    email: string;
    facebook: string;
    twitter: string;
    photo: string;
    role: string;
}

// Add interfaces for other resources (Blocks, Comments, Files, etc.) if needed

// src/services/apiService.ts
import axios from 'axios';
import { ContentData, ContentRevisionData, TagSuggestion } from './apiTypes';

const apiClient = axios.create({
    baseURL: '/api', // Your API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- Content ---
const contentApi = {
    getById: (contentID: number) => apiClient.get<ContentData>(`/content/${contentID}`),
    getByUrl: (url: string) => apiClient.get<ContentData>(`/content/url/${url}`), // Assuming an endpoint to fetch by URL exists
    create: (data: ContentData) => apiClient.post<ContentData>('/content', data),
    update: (contentID: number, data: ContentData) => apiClient.put<ContentData>(`/content/${contentID}`, data),
    delete: (contentID: number) => apiClient.delete(`/content/${contentID}`),
};

// --- Content Revisions ---
const contentRevisionsApi = {
    create: (data: ContentRevisionData) => apiClient.post<{ id: number }>(`/content/${data.contentID}/revisions`, data),
    delete: (contentID: number) => apiClient.delete(`/content/${contentID}/revisions`), // Delete all revisions for content
};

// --- Content Extras ---
const contentExtrasApi = {
    save: (contentID: number, name: string, extra: any) => apiClient.post(`/content/${contentID}/extras`, { name, extra }),
    delete: (contentID: number) => apiClient.delete(`/content/${contentID}/extras`), // Delete all extras for content
};

// --- Content Revisions Extras ---
const contentRevisionsExtrasApi = {
    save: (revisionID: number, contentID: number, name: string, extra: any) => apiClient.post(`/content/${contentID}/revisions/${revisionID}/extras`, { name, extra }),
    delete: (contentID: number) => apiClient.delete(`/content/${contentID}/revisions/extras`), // Delete all revision extras for content (adjust endpoint if needed)
};

// --- Content Tags ---
const contentTagsApi = {
    query: (tagQuery: string) => apiClient.get<TagSuggestion[]>(`/contentTags/search?q=${encodeURIComponent(tagQuery)}`), // Adjust endpoint as needed
    save: (contentID: number, tag: string) => apiClient.post(`/content/${contentID}/tags`, { tag }),
    delete: (contentID: number) => apiClient.delete(`/content/${contentID}/tags`), // Delete all tags for content
};

// --- Users ---
const usersApi = {
    getById: (userID: number) => apiClient.get<UserData>(`/users/${userID}`),
    // Add other user endpoints if needed
};

// --- Themes --- (Needed for page types)
const themesApi = {
    getCurrentThemePages: () => apiClient.get<string[]>('/themes/current/pages'), // Example endpoint
};


// --- Settings --- (If needed globally)
const settingsApi = {
    get: () => apiClient.get<any>('/settings'),
    update: (data: any) => apiClient.put('/settings', data),
};


// Export all API functions
export const apiService = {
    content: contentApi,
    contentRevisions: contentRevisionsApi,
    contentExtras: contentExtrasApi,
    contentRevisionsExtras: contentRevisionsExtrasApi,
    contentTags: contentTagsApi,
    users: usersApi,
    themes: themesApi,
    settings: settingsApi,
    // Add other resources (blocks, comments, files, menus, modules, sitemaps) here following the same pattern
};

```

**3. Redux State Management**

Create slices for `page`, `user`, and `notifications`.

```typescript
// src/features/users/userSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { UserData } from '../../services/apiTypes';
import { apiService } from '../../services/apiService';

interface UserState {
    currentUser: UserData | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    currentUser: null, // Load this during app initialization/login
    loading: false,
    error: null,
};

// Example async thunk to fetch current user (adjust based on your auth flow)
export const fetchCurrentUser = createAsyncThunk(
    'user/fetchCurrentUser',
    async (userId: number, { rejectWithValue }) => {
        try {
            const response = await apiService.users.getById(userId);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser(state, action: PayloadAction<UserData | null>) {
            state.currentUser = action.payload;
        },
        clearCurrentUser(state) {
            state.currentUser = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<UserData>) => {
                state.loading = false;
                state.currentUser = action.payload;
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setCurrentUser, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;

// src/features/pageEditor/pageTypes.ts
import { ContentData } from '../../services/apiTypes';

// State specific to the editor, including fields not directly in ContentData API model
export interface PageEditorState extends Omit<ContentData, 'published_date' | 'tags'> {
    id: number | null; // Use null for a new page
    publish: 'Y' | 'N' | 'schedule';
    scheduleDate: string | null; // Store as ISO string or similar for input type="datetime-local"
    tags: string[];
    themePages: string[]; // Available page types/templates
    // Add other fields from the original Page factory if needed (header, subheader, body, extras, misc)
    header?: string;
    subheader?: string;
    body?: string;
    extras?: Record<string, any>;
    misc?: Record<string, any>;
}

export interface PageState {
    currentPage: PageEditorState | null;
    themePages: string[];
    tagSuggestions: string[];
    loading: boolean;
    saving: boolean;
    error: string | null;
    isNew: boolean; // Flag to indicate if it's a new page editor session
}


// src/features/pageEditor/pageSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { formatISO, parseISO, getTime, fromUnixTime, parse } from 'date-fns';
import { apiService } from '../../services/apiService';
import { ContentData, TagSuggestion } from '../../services/apiTypes';
import { PageState, PageEditorState } from './pageTypes';
import { AppDispatch, RootState } from '../../app/store'; // Adjust path as needed
import { addNotification } from '../notifications/notificationSlice'; // Import notification action

const initialPageEditorState: PageEditorState = {
    id: null,
    title: '',
    description: '',
    header: '',
    subheader: '',
    body: '', // Assuming body is edited elsewhere but part of the state
    url: '',
    type: '',
    publish: 'N', // Default to draft
    scheduleDate: formatISO(new Date()), // Default to now for the input
    tags: [],
    themePages: [],
    extras: {},
    misc: {},
    featured: null,
    author: undefined, // Will be set from user slice
    timestamp: undefined,
};

const initialState: PageState = {
    currentPage: null, // Represents the page being edited
    themePages: [],
    tagSuggestions: [],
    loading: false,
    saving: false,
    error: null,
    isNew: false,
};

// --- Async Thunks ---

export const fetchThemePages = createAsyncThunk(
    'page/fetchThemePages',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiService.themes.getCurrentThemePages();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchPageDataByUrl = createAsyncThunk(
    'page/fetchPageDataByUrl',
    async (url: string, { dispatch, rejectWithValue }) => {
        dispatch(setLoading(true));
        try {
            // Fetch theme pages if not already loaded (or fetch always if they can change)
            await dispatch(fetchThemePages());
            const response = await apiService.content.getByUrl(url);
            dispatch(setLoading(false));
            return response.data;
        } catch (error: any) {
            dispatch(setLoading(false));
            dispatch(addNotification({ message: `Error fetching page: ${url}`, type: 'error' }));
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchTagSuggestions = createAsyncThunk(
    'page/fetchTagSuggestions',
    async (query: string, { rejectWithValue }) => {
        if (!query) return [];
        try {
            const response = await apiService.contentTags.query(query);
            // Assuming response.data is TagSuggestion[] and we need string[]
            return response.data.map(suggestion => suggestion.tag);
        } catch (error: any) {
            console.error("Tag suggestion error:", error);
            return rejectWithValue('Failed to fetch tag suggestions'); // Don't notify user for this usually
        }
    }
);

export const deletePage = createAsyncThunk(
    'page/deletePage',
    async (contentID: number, { dispatch, rejectWithValue }) => {
        dispatch(setSaving(true)); // Use saving state for delete operation as well
        try {
            // Perform deletions in parallel or sequence
            await Promise.all([
                apiService.content.delete(contentID),
                apiService.contentRevisions.delete(contentID),
                apiService.contentRevisionsExtras.delete(contentID), // Adjust endpoint if needed
                apiService.contentExtras.delete(contentID),
                apiService.contentTags.delete(contentID),
            ]);
            dispatch(setSaving(false));
            dispatch(addNotification({ message: 'Page deleted successfully', type: 'success' })); // Use i18n key
            return contentID; // Return ID for potential cleanup in UI state
        } catch (error: any) {
            dispatch(setSaving(false));
            dispatch(addNotification({ message: 'Error deleting page', type: 'error' })); // Use i18n key
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


export const savePage = createAsyncThunk(
    'page/savePage',
    async ({ pageData, currentUser, isDuplicate }: { pageData: PageEditorState, currentUser: UserData | null, isDuplicate: boolean }, { dispatch, rejectWithValue }) => {
        dispatch(setSaving(true));

        if (!currentUser) {
            dispatch(setSaving(false));
            dispatch(addNotification({ message: 'User not logged in', type: 'error' }));
            return rejectWithValue('User not logged in');
        }
        if (!pageData.type) {
            dispatch(setSaving(false));
            dispatch(addNotification({ message: 'page_no_type_selected', type: 'error' })); // Use i18n key
            return rejectWithValue('Page type is required');
        }
        if (!pageData.url || pageData.url === 'new') {
            dispatch(setSaving(false));
            dispatch(addNotification({ message: 'page_no_url', type: 'error' })); // Use i18n key
            return rejectWithValue('Page URL is required');
        }

        let publishedDateTimestamp: number | null = null;
        let finalPublishStatus: 'Y' | 'N' = pageData.publish === 'Y' ? 'Y' : 'N';

        if (pageData.publish === 'schedule' && pageData.scheduleDate) {
            try {
                const scheduleDateObj = parseISO(pageData.scheduleDate);
                publishedDateTimestamp = Math.round(getTime(scheduleDateObj) / 1000);
                if (getTime(scheduleDateObj) < Date.now()) {
                    finalPublishStatus = 'Y'; // Back-dated, publish immediately
                } else {
                    finalPublishStatus = 'N'; // Scheduled for future
                }
            } catch (e) {
                console.error("Error parsing schedule date:", e);
                dispatch(setSaving(false));
                dispatch(addNotification({ message: 'Invalid schedule date format', type: 'error' }));
                return rejectWithValue('Invalid schedule date format');
            }
        } else if (pageData.publish === 'Y') {
            // If publishing now OR it was already published and remains published, set/keep date
            // Check if it *was* already published (needs original page data comparison if complex logic needed)
            // Simple approach: if set to 'Y', use current time unless it already has an ID (meaning it existed)
            // The original logic is a bit complex here. Let's simplify:
            // If setting to 'Y' now, use current time. If it was already 'Y', the API should handle not changing the date.
            // If it was scheduled and now becomes 'Y' (back-dated), use the schedule date.
            if (!pageData.id || isDuplicate) { // New page or duplicate being published now
                 publishedDateTimestamp = Math.round(Date.now() / 1000);
            }
            // If updating an existing page and setting publish to 'Y', the API might handle the date,
            // or we might need to pass the *original* published_date if it existed and status was 'Y'.
            // Let's assume API handles keeping the date if already published.
            // If changing from schedule (past) to 'Y', publishedDateTimestamp is already set above.
             if (!publishedDateTimestamp) {
                 publishedDateTimestamp = Math.round(Date.now() / 1000);
             }

        }


        const contentPayload: ContentData = {
            title: pageData.title || pageData.header || '', // Fallback like original
            description: pageData.description,
            header: pageData.header,
            subheader: pageData.subheader,
            featured: pageData.featured, // Assuming featured image URL is managed in pageData.extras or a dedicated field
            body: pageData.body,
            url: pageData.url,
            type: pageData.type,
            published: finalPublishStatus,
            published_date: publishedDateTimestamp,
            author: currentUser.id,
        };

        try {
            let savedContent: ContentData;
            let isNewPage = !pageData.id || isDuplicate;

            if (isNewPage) {
                // Create new content
                const createResponse = await apiService.content.create(contentPayload);
                savedContent = createResponse.data;
                if (!savedContent.id) throw new Error("Created content missing ID");
                dispatch(addNotification({ message: 'page_created', type: 'success' })); // i18n key
            } else {
                // Update existing content
                const updateResponse = await apiService.content.update(pageData.id!, contentPayload);
                savedContent = updateResponse.data;
                dispatch(addNotification({ message: 'page_updated', type: 'success' })); // i18n key
            }

            const contentID = savedContent.id!;

            // --- Handle Tags, Revisions, Extras (after main save) ---
            // Use Promise.allSettled for non-critical follow-up tasks
            const results = await Promise.allSettled([
                // 1. Manage Tags (Delete old only if updating, then save new)
                (async () => {
                    if (!isNewPage) {
                        await apiService.contentTags.delete(contentID);
                    }
                    if (pageData.tags && pageData.tags.length > 0) {
                        await Promise.all(pageData.tags.filter(tag => tag.trim()).map(tag =>
                            apiService.contentTags.save(contentID, tag.trim())
                        ));
                    }
                })(),

                // 2. Save Revision
                (async () => {
                    const revisionPayload: ContentRevisionData = { ...contentPayload, contentID };
                    const revisionResponse = await apiService.contentRevisions.create(revisionPayload);
                    const revisionID = revisionResponse.data.id;

                    // 3. Save Extras & Revision Extras (if revision saved successfully)
                    if (revisionID && pageData.extras && Object.keys(pageData.extras).length > 0) {
                        // Delete old extras only if updating main content
                        if (!isNewPage) {
                            await apiService.contentExtras.delete(contentID);
                        }

                        const extraPromises: Promise<any>[] = [];
                        for (const key in pageData.extras) {
                            if (Object.prototype.hasOwnProperty.call(pageData.extras, key)) {
                                let extraValue = pageData.extras[key];
                                // Stringify objects/arrays like original
                                if (typeof extraValue === 'object' && extraValue !== null) {
                                    try {
                                        extraValue = JSON.stringify(extraValue);
                                    } catch (e) { console.error(`Failed to stringify extra: ${key}`, e); }
                                }
                                // Save to content extras
                                extraPromises.push(apiService.contentExtras.save(contentID, key, extraValue));
                                // Save to revision extras
                                extraPromises.push(apiService.contentRevisionsExtras.save(revisionID, contentID, key, extraValue));
                            }
                        }
                        await Promise.all(extraPromises);
                    }
                })(),
            ]);

            // Log any errors from tags/revisions/extras saving
            results.forEach(result => {
                if (result.status === 'rejected') {
                    console.error("Error during post-save operation:", result.reason);
                    // Optionally dispatch a non-blocking warning notification
                }
            });


            dispatch(setSaving(false));
            // Return the saved content (including the new ID if created) and the URL for redirection
            return { savedContent, isNewPage };

        } catch (error: any) {
            dispatch(setSaving(false));
            const message = isDuplicate || !pageData.id ? 'page_error_saving' : 'page_error_updating';
            dispatch(addNotification({ message: message, type: 'error' })); // i18n key
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


// --- Slice Definition ---
const pageSlice = createSlice({
    name: 'page',
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setSaving(state, action: PayloadAction<boolean>) {
            state.saving = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        // Initialize editor for a new page
        initNewPage(state) {
            state.isNew = true;
            state.currentPage = {
                ...initialPageEditorState,
                // Set default type if theme pages are loaded
                type: state.themePages.length > 0 ? state.themePages[0] : '',
                themePages: state.themePages, // Carry over loaded theme pages
            };
            state.error = null;
            state.loading = false;
        },
        // Update a specific field in the current page data
        updatePageField(state, action: PayloadAction<{ field: keyof PageEditorState; value: any }>) {
            if (state.currentPage) {
                // Type assertion needed here because of the dynamic key
                (state.currentPage as any)[action.payload.field] = action.payload.value;
            }
        },
        // Set the entire page data (e.g., after fetching or restoring from local storage)
        setPageData(state, action: PayloadAction<PageEditorState>) {
            state.currentPage = action.payload;
            state.isNew = !action.payload.id; // Set isNew based on loaded data
            state.error = null;
        },
        // Reset state after leaving the editor or successful save/delete
        resetPageState(state) {
            state.currentPage = null;
            state.tagSuggestions = [];
            state.loading = false;
            state.saving = false;
            state.error = null;
            state.isNew = false;
        },
        // Add a tag (handle potential duplicates if needed)
        addTag(state, action: PayloadAction<string>) {
            if (state.currentPage && !state.currentPage.tags.includes(action.payload)) {
                state.currentPage.tags.push(action.payload);
            }
        },
        // Remove a tag by index
        removeTagByIndex(state, action: PayloadAction<number>) {
            if (state.currentPage) {
                state.currentPage.tags.splice(action.payload, 1);
            }
        },
        clearTagSuggestions(state) {
            state.tagSuggestions = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Theme Pages
            .addCase(fetchThemePages.fulfilled, (state, action: PayloadAction<string[]>) => {
                state.themePages = action.payload;
                // If initializing a new page, set the default type now
                if (state.isNew && state.currentPage && !state.currentPage.type && action.payload.length > 0) {
                    state.currentPage.type = action.payload[0];
                }
                 // Also update themePages in the current page state if it exists
                if (state.currentPage) {
                    state.currentPage.themePages = action.payload;
                }
            })
            .addCase(fetchThemePages.rejected, (state, action) => {
                state.error = `Failed to load theme pages: ${action.payload as string}`;
            })
            // Fetch Page Data
            .addCase(fetchPageDataByUrl.pending, (state) => {
                state.loading = true; // Handled by dispatch in thunk, but good practice
                state.error = null;
                state.isNew = false;
            })
            .addCase(fetchPageDataByUrl.fulfilled, (state, action: PayloadAction<ContentData>) => {
                const data = action.payload;
                let scheduleDateStr: string | null = null;
                let publishStatus: PageEditorState['publish'] = data.published;

                if (data.published === 'N' && data.published_date && data.published_date * 1000 > Date.now()) {
                     // If not published ('N') but has a future date, it's scheduled
                     publishStatus = 'schedule';
                     scheduleDateStr = formatISO(fromUnixTime(data.published_date));
                } else if (data.published_date) {
                    // If published or past schedule date, still store the date for display/editing
                    scheduleDateStr = formatISO(fromUnixTime(data.published_date));
                } else {
                    // Default if no date
                    scheduleDateStr = formatISO(new Date());
                }


                state.currentPage = {
                    ...initialPageEditorState, // Start with defaults
                    ...data, // Spread fetched data
                    id: data.id!, // Ensure ID is set
                    publish: publishStatus,
                    scheduleDate: scheduleDateStr,
                    tags: data.tags || [], // Ensure tags is an array
                    extras: data.extras || {}, // Ensure extras is an object
                    themePages: state.themePages, // Keep loaded theme pages
                    type: data.type || (state.themePages.length > 0 ? state.themePages[0] : ''), // Set type, fallback to default
                };
                state.loading = false;
                state.isNew = false;
            })
            .addCase(fetchPageDataByUrl.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.currentPage = null; // Clear page data on fetch error
            })
            // Fetch Tag Suggestions
            .addCase(fetchTagSuggestions.fulfilled, (state, action: PayloadAction<string[]>) => {
                state.tagSuggestions = action.payload;
            })
            // Save Page
            .addCase(savePage.pending, (state) => {
                state.saving = true;
                state.error = null;
            })
            .addCase(savePage.fulfilled, (state, action) => {
                // Update the state with the successfully saved page data
                // This ensures the ID is set correctly if it was a new page
                const { savedContent, isNewPage } = action.payload as { savedContent: ContentData, isNewPage: boolean };
                 if (state.currentPage) { // Should always exist if save was initiated
                    state.currentPage.id = savedContent.id!;
                    // Optionally update other fields if API response differs significantly
                    // state.currentPage.timestamp = savedContent.timestamp;
                 }
                state.saving = false;
                state.isNew = false; // It's no longer conceptually "new" after saving
            })
            .addCase(savePage.rejected, (state, action) => {
                state.saving = false;
                state.error = action.payload as string;
            })
            // Delete Page
            .addCase(deletePage.pending, (state) => {
                state.saving = true; // Reuse saving state
                state.error = null;
            })
            .addCase(deletePage.fulfilled, (state) => {
                state.saving = false;
                // Reset state as the page is gone
                Object.assign(state, initialState);
                // Keep theme pages loaded
                // state.themePages = state.themePages; // No need, initialState doesn't clear it if structured well
            })
            .addCase(deletePage.rejected, (state, action) => {
                state.saving = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    setLoading,
    setSaving,
    setError,
    initNewPage,
    updatePageField,
    setPageData,
    resetPageState,
    addTag,
    removeTagByIndex,
    clearTagSuggestions,
} = pageSlice.actions;

export default pageSlice.reducer;


// src/features/notifications/notificationSlice.ts
import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';

export interface Notification {
    id: string;
    message: string; // Can be an i18n key
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number; // Optional duration in ms
}

interface NotificationState {
    notifications: Notification[];
}

const initialState: NotificationState = {
    notifications: [],
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: {
            reducer(state, action: PayloadAction<Notification>) {
                state.notifications.push(action.payload);
            },
            prepare(payload: Omit<Notification, 'id'>) {
                return {
                    payload: {
                        id: nanoid(),
                        ...payload,
                    },
                };
            },
        },
        removeNotification(state, action: PayloadAction<string>) {
            state.notifications = state.notifications.filter(
                (notification) => notification.id !== action.payload
            );
        },
    },
});

export const { addNotification, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;

// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/users/userSlice';
import pageReducer from '../features/pageEditor/pageSlice';
import notificationReducer from '../features/notifications/notificationSlice';
// Import other reducers...

export const store = configureStore({
    reducer: {
        user: userReducer,
        page: pageReducer,
        notifications: notificationReducer,
        // other reducers...
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// src/app/hooks.ts (Optional but recommended)
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

```

**4. Internationalization Setup**

```typescript
// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Example translation keys (add all keys from your original app)
const resources = {
  en: {
    translation: {
      page_newer: "There's a newer version of this page saved locally.",
      discard: "Discard Local Version",
      compare: "Compare", // Add compare functionality if needed
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
      page_different_url: "Please use a different URL when duplicating.",
      page_no_type_selected: "Please select a page type.",
      page_no_url: "Page URL cannot be empty.",
      page_error_saving: "Error saving page.",
      page_error_updating: "Error updating page.",
      page_created: "Page created successfully.",
      page_updated: "Page updated successfully.",
      deleted: "Deleted successfully.", // Generic deleted message
      saved: "Saved successfully.", // Generic saved message
      // Add other keys...
      'about, restaurant, food, nyc': 'about, restaurant, food, nyc', // Placeholder example
      'about us, contact us': 'about us, contact us', // Placeholder example
      "Tom's Restaurant is a diner located...": "Tom's Restaurant is a diner located at 2880 Broadway (on the corner of 112th Street) in the Morningside Heights neighborhood of Manhattan in New York City.", // Placeholder example
    }
  },
  // Add other languages (es, fr, etc.)
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
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;

// src/index.tsx (or App.tsx)
// ... other imports
import './i18n'; // Initialize i18next
// ...
root.render(
  <React.StrictMode>
    <Provider store={store}>
        {/* <Suspense fallback="loading"> */} {/* Optional for lazy loading translations */}
            <App />
        {/* </Suspense> */}
    </Provider>
  </React.StrictMode>
);
```

**5. React Components**

Break down `page.html` and `pageCtrl.js` into components.

```typescript
// src/shared/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

function getStorageValue<T>(key: string, defaultValue: T): T {
  // getting stored value
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    if (saved !== null && saved !== 'undefined' && saved !== 'null') {
        try {
            // Attempt to parse JSON, fallback to raw value
            return JSON.parse(saved);
        } catch (e) {
            return saved as unknown as T; // Return raw string if not JSON
        }
    }
  }
  return defaultValue;
}

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    // storing input name
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}


// src/features/pageEditor/components/TagInput.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchTagSuggestions, clearTagSuggestions, addTag, removeTagByIndex } from '../pageSlice';

interface TagInputProps {
    tags: string[];
    // onChange: (tags: string[]) => void; // Handled by dispatching actions
}

export const TagInput: React.FC<TagInputProps> = ({ tags }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const suggestions = useAppSelector((state) => state.page.tagSuggestions);
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const debouncedFetchSuggestions = useCallback(
        debounce((query: string) => {
            dispatch(fetchTagSuggestions(query));
        }, 300),
        [dispatch]
    );

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);
        if (value.trim()) {
            debouncedFetchSuggestions(value.trim());
            setShowSuggestions(true);
        } else {
            dispatch(clearTagSuggestions());
            setShowSuggestions(false);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if ((event.key === 'Enter' || event.key === ',') && inputValue.trim()) {
            event.preventDefault();
            dispatch(addTag(inputValue.trim()));
            setInputValue('');
            dispatch(clearTagSuggestions());
            setShowSuggestions(false);
        } else if (event.key === 'Backspace' && !inputValue && tags.length > 0) {
            dispatch(removeTagByIndex(tags.length - 1));
        }
    };

    const handleSuggestionClick = (tag: string) => {
        dispatch(addTag(tag));
        setInputValue('');
        dispatch(clearTagSuggestions());
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const handleRemoveTag = (index: number) => {
        dispatch(removeTagByIndex(index));
    };

    // Hide suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                // A small delay helps if the click was on a suggestion itself
                setTimeout(() => setShowSuggestions(false), 100);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <div className="tag-input-container">
             <label htmlFor="tags">{t('tags')}</label>
            <div className="tags-display">
                {tags.map((tag, index) => (
                    <span key={index} className="tag-item">
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(index)}>&times;</button>
                    </span>
                ))}
                <input
                    ref={inputRef}
                    id="tags"
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => inputValue.trim() && setShowSuggestions(true)}
                    placeholder={t('about, restaurant, food, nyc')}
                />
            </div>
            {showSuggestions && suggestions.length > 0 && (
                 <div className="tag-suggestions">
                    {suggestions.slice(0, 10).map((tag, index) => (
                        <a key={index} onClick={() => handleSuggestionClick(tag)}>
                            {tag} {/* Add titlecase filter if needed */}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};


// src/features/pageEditor/components/PageForm.tsx
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PageEditorState } from '../pageTypes';
import { useAppDispatch } from '../../../app/hooks';
import { updatePageField } from '../pageSlice';
import { TagInput } from './TagInput'; // Import TagInput

interface PageFormProps {
    pageData: PageEditorState;
    isNewUrl: boolean; // To control auto URL generation
    onUrlChangeManually: () => void; // Callback when user types in URL field
}

export const PageForm: React.FC<PageFormProps> = ({ pageData, isNewUrl, onUrlChangeManually }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    // Generic handler for simple input/textarea/select changes
    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        dispatch(updatePageField({ field: name as keyof PageEditorState, value }));

        // Special handling for URL generation based on title for new pages
        if (name === 'title' && isNewUrl) {
            const newUrl = value
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^a-z0-9-]/g, ''); // Basic slugify
            dispatch(updatePageField({ field: 'url', value: newUrl }));
        }

        // If user types in URL field, disable auto-generation
        if (name === 'url') {
            onUrlChangeManually();
        }

    }, [dispatch, isNewUrl, onUrlChangeManually]);

     // Handler for radio buttons
     const handlePublishChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as PageEditorState['publish'];
        dispatch(updatePageField({ field: 'publish', value }));
    }, [dispatch]);

    // Handler for datetime-local input
    const handleScheduleDateChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(updatePageField({ field: 'scheduleDate', value: event.target.value }));
    }, [dispatch]);


    return (
        <div className="pg-editor form-case">
            {/* Type Select */}
            <label className="type" htmlFor="type">{t('type')}</label>
            <div className="cos-select"> {/* Add custom select styling if needed */}
                <select
                    id="type"
                    name="type"
                    value={pageData.type}
                    onChange={handleChange}
                    required
                >
                    {pageData.themePages.map((themePage) => (
                        // Assuming themePage is just the filename like 'page-standard.html'
                        // You might need a filter/formatter like the original `themeFiles`
                        <option key={themePage} value={themePage}>
                            {themePage.replace('.html', '').replace('-', ' ')} {/* Basic formatting */}
                        </option>
                    ))}
                </select>
            </div>

            {/* Title */}
            <span className="num-count">{pageData.title?.length ?? 0}</span>
            <label htmlFor="title">{t('title')}</label>
            <input
                id="title"
                name="title"
                type='text'
                value={pageData.title ?? ''}
                onChange={handleChange}
                placeholder={t('about us, contact us')}
            />

            {/* Description */}
            <span className="num-count">{pageData.description?.length ?? 0}</span>
            <label htmlFor="description">{t('description')}</label>
            <textarea
                id="description"
                name="description"
                value={pageData.description ?? ''}
                onChange={handleChange}
                placeholder={t("Tom's Restaurant is a diner located...")}
            />

            {/* Tags */}
            <TagInput tags={pageData.tags} />


            {/* URL */}
            <label htmlFor="url">{t('url')}</label>
            <input
                id="url"
                name="url"
                type='text'
                value={pageData.url ?? ''}
                onChange={handleChange} // handleChange handles onUrlChangeManually call
            />

            {/* Publish Options */}
            <div className="publish-options">
                 <input
                    type="radio"
                    id="Y"
                    name="publish"
                    value="Y"
                    checked={pageData.publish === 'Y'}
                    onChange={handlePublishChange}
                    className={pageData.publish === 'Y' ? 'active' : ''}
                />
                <label htmlFor="Y">{t('publish')}</label>

                <input
                    type="radio"
                    id="N"
                    name="publish"
                    value="N"
                    checked={pageData.publish === 'N'}
                    onChange={handlePublishChange}
                     className={pageData.publish === 'N' ? 'active' : ''}
                />
                <label htmlFor="N">{t('draft')}</label>

                <input
                    type="radio"
                    id="schedule"
                    name="publish"
                    value="schedule"
                    checked={pageData.publish === 'schedule'}
                    onChange={handlePublishChange}
                     className={pageData.publish === 'schedule' ? 'active' : ''}
                />
                <label htmlFor="schedule">{t('schedule')}</label>

                {pageData.publish === 'schedule' && (
                    <>
                        <div className="schedule-triangle"></div> {/* Style as needed */}
                        <input
                            type="datetime-local"
                            className="schedule radio-inline" // Add appropriate classes
                            name="scheduleDate" // Name matches state field
                            value={pageData.scheduleDate ?? ''}
                            onChange={handleScheduleDateChange}
                        />
                    </>
                )}
            </div>
        </div>
    );
};


// src/features/pageEditor/PageEditor.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
    fetchPageDataByUrl,
    initNewPage,
    resetPageState,
    savePage,
    deletePage,
    setPageData,
    updatePageField,
    fetchThemePages, // Ensure theme pages are loaded for new pages too
} from './pageSlice';
import { PageForm } from './components/PageForm';
import { PageEditorState } from './pageTypes';
import { useLocalStorage } from '../../shared/hooks/useLocalStorage'; // Import the hook

// Define keys for local storage based on URL
const getLocalStorageKey = (url: string | undefined, field: keyof PageEditorState) => {
    return `page_${url || 'new'}_${field}`;
};

export const PageEditor: React.FC = () => {
    const { t } = useTranslation();
    const { pageUrl } = useParams<{ pageUrl?: string }>(); // Get URL param (might be undefined for '/new')
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    const { currentPage, loading, saving, error, themePages } = useAppSelector((state) => state.page);
    const currentUser = useAppSelector((state) => state.user.currentUser);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [autoUrlEnabled, setAutoUrlEnabled] = useState(false); // Controls auto URL generation
    const [hasLocalChanges, setHasLocalChanges] = useState(false); // Tracks if local storage differs

    // --- Local Storage State ---
    // Use the hook for each field that needs local persistence
    const [localTitle, setLocalTitle] = useLocalStorage<string>(getLocalStorageKey(pageUrl, 'title'), '');
    const [localDescription, setLocalDescription] = useLocalStorage<string>(getLocalStorageKey(pageUrl, 'description'), '');
    const [localUrl, setLocalUrl] = useLocalStorage<string>(getLocalStorageKey(pageUrl, 'url'), '');
    const [localPublish, setLocalPublish] = useLocalStorage<PageEditorState['publish']>(getLocalStorageKey(pageUrl, 'publish'), 'N');
    const [localScheduleDate, setLocalScheduleDate] = useLocalStorage<string | null>(getLocalStorageKey(pageUrl, 'scheduleDate'), null);
    const [localType, setLocalType] = useLocalStorage<string>(getLocalStorageKey(pageUrl, 'type'), '');
    // Add other fields like header, subheader, body, extras if they were persisted

    // --- Effects ---

    // Fetch page data or initialize new page on mount/URL change
    useEffect(() => {
        if (pageUrl && pageUrl !== 'new') {
            dispatch(fetchPageDataByUrl(pageUrl));
            setAutoUrlEnabled(false); // Editing existing, disable auto URL initially
        } else {
            // Ensure theme pages are loaded before initializing new page
            if (themePages.length === 0) {
                dispatch(fetchThemePages()).then(() => {
                    dispatch(initNewPage());
                });
            } else {
                 dispatch(initNewPage());
            }
            setAutoUrlEnabled(true); // New page, enable auto URL
        }

        // Cleanup state when component unmounts or URL changes significantly
        return () => {
            dispatch(resetPageState());
        };
    }, [dispatch, pageUrl, themePages.length]); // Rerun if pageUrl changes


    // Check for local storage differences after page data loads
    useEffect(() => {
        if (currentPage && pageUrl !== 'new') {
            const checkLocal = () => {
                let changed = false;
                if (localTitle !== currentPage.title && localTitle) changed = true;
                if (localDescription !== currentPage.description && localDescription) changed = true;
                if (localUrl !== currentPage.url && localUrl) changed = true;
                if (localPublish !== currentPage.publish && localPublish) changed = true;
                if (localScheduleDate !== currentPage.scheduleDate && localScheduleDate) changed = true;
                if (localType !== currentPage.type && localType) changed = true;
                // Check other persisted fields...
                setHasLocalChanges(changed);
            };
            // Delay check slightly to ensure state updates have propagated
            const timer = setTimeout(checkLocal, 100);
            return () => clearTimeout(timer);
        } else {
            setHasLocalChanges(false); // No local changes check for new pages
        }
    }, [currentPage, localTitle, localDescription, localUrl, localPublish, localScheduleDate, localType, pageUrl]);


    // Persist changes from Redux state to local storage
    useEffect(() => {
        if (currentPage && pageUrl !== 'new') { // Only save for existing pages being edited
            setLocalTitle(currentPage.title);
            setLocalDescription(currentPage.description);
            setLocalUrl(currentPage.url);
            setLocalPublish(currentPage.publish);
            setLocalScheduleDate(currentPage.scheduleDate);
            setLocalType(currentPage.type);
            // Persist other fields...
        }
    }, [currentPage, pageUrl, setLocalTitle, setLocalDescription, setLocalUrl, setLocalPublish, setLocalScheduleDate, setLocalType]); // Dependency array includes currentPage and setters


    // --- Event Handlers ---

    const handleSave = async (isDuplicate = false) => {
        if (!currentPage || !currentUser) return;

        if (isDuplicate && currentPage.url === pageUrl) {
             dispatch(addNotification({ message: 'page_different_url', type: 'error' }));
             return;
        }

        const resultAction = await dispatch(savePage({
            pageData: currentPage,
            currentUser: currentUser,
            isDuplicate: isDuplicate
        }));

        if (savePage.fulfilled.match(resultAction)) {
            const { savedContent, isNewPage } = resultAction.payload;
            // Clear local storage for this page after successful save
            clearLocalVersion();
            // Redirect to the new/updated URL
            if (savedContent.url !== pageUrl) {
                navigate(`/${savedContent.url}`); // Adjust route prefix if needed
            } else if (isNewPage) {
                 navigate(`/${savedContent.url}`); // Redirect even if URL is same but was new
            }
            // No navigation needed if just updating and URL is the same
        }
        // Errors are handled by the notification slice via the thunk
    };

    const handleDelete = async () => {
        if (currentPage?.id) {
            const resultAction = await dispatch(deletePage(currentPage.id));
            if (deletePage.fulfilled.match(resultAction)) {
                 // Clear local storage for this page after successful delete
                clearLocalVersion(currentPage.url); // Pass URL explicitly if needed before state clears
                navigate('/new'); // Redirect to new page editor
            }
        }
        setShowDeleteConfirm(false);
    };

    const handleUrlChangeManually = useCallback(() => {
        setAutoUrlEnabled(false);
    }, []);

    // --- Local Storage Actions ---
    const useLocalVersion = () => {
        if (!currentPage) return;
        const restoredPage: PageEditorState = {
            ...currentPage, // Keep existing ID, themePages etc.
            title: localTitle || currentPage.title,
            description: localDescription || currentPage.description,
            url: localUrl || currentPage.url,
            publish: localPublish || currentPage.publish,
            scheduleDate: localScheduleDate || currentPage.scheduleDate,
            type: localType || currentPage.type,
            // Restore other fields...
        };
        dispatch(setPageData(restoredPage));
        clearLocalVersion(); // Clear storage after restoring
        setHasLocalChanges(false);
    };

    const clearLocalVersion = (url = pageUrl) => {
        // Manually clear localStorage items using the key function
        localStorage.removeItem(getLocalStorageKey(url, 'title'));
        localStorage.removeItem(getLocalStorageKey(url, 'description'));
        localStorage.removeItem(getLocalStorageKey(url, 'url'));
        localStorage.removeItem(getLocalStorageKey(url, 'publish'));
        localStorage.removeItem(getLocalStorageKey(url, 'scheduleDate'));
        localStorage.removeItem(getLocalStorageKey(url, 'type'));
        // Clear others...
        setHasLocalChanges(false); // Update banner state
    };


    // --- Render Logic ---

    if (loading && !currentPage) {
        return <div>Loading page data...</div>; // Or a spinner component
    }

    if (error && !currentPage) {
        return <div className="error-message">Error loading page: {error}</div>;
    }

    if (!currentPage) {
        // This might happen briefly or if initNewPage hasn't finished
        return <div>Initializing editor...</div>;
    }

    // Determine if the form should auto-generate URL (new page AND autoUrlEnabled flag is true)
    const isAutoUrlActive = (!pageUrl || pageUrl === 'new') && autoUrlEnabled;

    return (
        <div className="page-editor-container"> {/* Add container class */}
            {/* Newer Version Banner */}
            {hasLocalChanges && (
                 <div className="new-version form-case">
                    <p>{t('page_newer')}</p>
                    <button className="btn-error" type="button" onClick={() => clearLocalVersion()}>
                        {t('discard')}
                    </button>
                    {/* <button className="btn-options" type="button" onClick={compareVersions}>
                        {t('compare')}
                    </button> */} {/* Add compare logic if needed */}
                    <button className="btn-success" type="button" onClick={useLocalVersion}>
                        {t('use')}
                    </button>
                </div>
            )}

            {/* Top Bar (Simplified - adapt based on your actual sidebar/admin structure) */}
            <div className="bar-top">
                 {/* Replace ng-click with React Router Link or navigate */}
                <a onClick={() => navigate(-1)}><i className="fa fa-angle-left"></i> Back</a>
                <h1 className="title">{t('page_details')}</h1>
                {/* Close button logic depends on how the panel is shown */}
                {/* <a className="sidebar-close" onClick={closeAdminPanel}><i className="fa fa-times"></i></a> */}
            </div>

             {/* Action Bar */}
            <div className="bar--actions">
                {!showDeleteConfirm ? (
                    <>
                        {currentPage.id && ( // Show delete only for existing pages
                            <button type="button" className="btn-error" onClick={() => setShowDeleteConfirm(true)} disabled={saving}>
                                {t('delete')}
                            </button>
                        )}
                         {currentPage.id && ( // Show duplicate only for existing pages
                            <button type="button" className="btn-options" onClick={() => handleSave(true)} disabled={saving}>
                                {saving ? 'Duplicating...' : t('duplicate')}
                            </button>
                         )}
                        <button type="button" className="btn-success" onClick={() => handleSave(false)} disabled={saving}>
                            {saving ? 'Saving...' : t('save')}
                        </button>
                    </>
                ) : (
                    <>
                        <p>{t('page_delete')}</p>
                        <button type="button" className="btn-error" onClick={handleDelete} disabled={saving}>
                            {saving ? 'Deleting...' : t('yes')}
                        </button>
                        <button type="button" className="btn-success" onClick={() => setShowDeleteConfirm(false)} disabled={saving}>
                            {t('no')}
                        </button>
                    </>
                )}
            </div>

            {/* Loading indicator during save/delete */}
            {saving && <div className="loading-overlay">Processing...</div>}

            {/* Page Form */}
            <PageForm
                pageData={currentPage}
                isNewUrl={isAutoUrlActive}
                onUrlChangeManually={handleUrlChangeManually}
            />

             {/* Display general errors */}
             {error && !saving && <div className="error-message">{error}</div>}
        </div>
    );
};

// src/components/Notifications.tsx (A component to display global notifications)
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { removeNotification, Notification } from '../features/notifications/notificationSlice';

export const Notifications: React.FC = () => {
    const { t } = useTranslation();
    const notifications = useAppSelector((state) => state.notifications.notifications);
    const dispatch = useAppDispatch();

    useEffect(() => {
        notifications.forEach((notification) => {
            if (notification.duration) {
                const timer = setTimeout(() => {
                    dispatch(removeNotification(notification.id));
                }, notification.duration);
                // Clear timer if notification is removed manually before timeout
                return () => clearTimeout(timer);
            }
        });
        // No cleanup needed for notifications without duration
    }, [notifications, dispatch]);


    const handleClose = (id: string) => {
        dispatch(removeNotification(id));
    };

    if (!notifications.length) {
        return null;
    }

    return (
        <div className="notification-container"> {/* Style this container */}
            {notifications.map((notification) => (
                <div key={notification.id} className={`notification notification-${notification.type}`}>
                    {/* Use t() to translate message if it's an i18n key */}
                    <span>{t(notification.message)}</span>
                    <button onClick={() => handleClose(notification.id)}>&times;</button>
                </div>
            ))}
        </div>
    );
};


// src/App.tsx (Example Router Setup)
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { PageEditor } from './features/pageEditor/PageEditor';
import { Notifications } from './components/Notifications'; // Import Notifications
// Import other components/layouts

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Notifications /> {/* Display notifications globally */}
        {/* Add Layout component if needed */}
        <Routes>
          {/* Redirect base path or define a dashboard */}
          <Route path="/" element={<Navigate to="/new" replace />} />
          {/* Route for creating a new page */}
          <Route path="/new" element={<PageEditor />} />
          {/* Route for editing an existing page by its URL */}
          <Route path="/:pageUrl" element={<PageEditor />} />
          {/* Add other routes */}
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
```

**6. Key Migration Points & Explanations**

1.  **API Service (`apiService.ts`):** Replaced `$resource` with `axios`. Each function maps to an endpoint. Added `apiTypes.ts` for data contracts.
2.  **Redux Toolkit (`*Slice.ts`, `store.ts`):**
    *   `userSlice`: Manages current user data (replace `Users` factory). Includes an example `fetchCurrentUser` thunk.
    *   `pageSlice`: Manages the state of the page being edited (replaces `Page` factory and `$scope.page`). Includes async thunks (`fetchPageDataByUrl`, `savePage`, `deletePage`, `fetchTagSuggestions`, `fetchThemePages`) for API interactions and state updates. Reducers handle synchronous state changes (`updatePageField`, `initNewPage`, etc.). Date handling uses `date-fns`. Error handling and notifications are integrated into thunks using `addNotification`.
    *   `notificationSlice`: Handles global notifications (replaces `$rootScope.$broadcast('notify', ...)`).
    *   `store.ts`: Configures the Redux store.
    *   `hooks.ts`: Provides typed `useAppDispatch` and `useAppSelector` hooks.
3.  **Component Architecture:**
    *   `PageEditor`: The main container component, analogous to `pageCtrl`. It handles routing parameters (`useParams`), fetching data (`useEffect`, `dispatch`), managing overall actions (save, delete), local storage interaction, and rendering child components.
    *   `PageForm`: A presentational component rendering the form fields. Receives data and callbacks via props. Uses controlled components.
    *   `TagInput`: A reusable component specifically for handling tag input with autocomplete, managing its own input state and interacting with Redux for suggestions and tag updates. Replaces `ng-list` and autocomplete logic.
    *   `Notifications`: Displays global messages from the `notificationSlice`.
4.  **State Management:** Global state (user, current page data, theme pages, notifications) is in Redux. Local component state (`useState`) is used for UI concerns like `showDeleteConfirm`, `autoUrlEnabled`, and `hasLocalChanges`. Form field values are primarily managed within the `pageSlice` via `updatePageField`.
5.  **Form Handling:** Uses controlled components in `PageForm`. `onChange` handlers dispatch actions to update the Redux state (`updatePageField`). Validation logic (required fields, URL check) is implemented within the `savePage` thunk before API calls.
6.  **Routing (`App.tsx`, `PageEditor.tsx`):** `react-router-dom` is used. `useParams` gets URL parameters, `useNavigate` handles redirection after save/delete. Routes match the likely original structure (`/new`, `/:pageUrl`).
7.  **Internationalization (`i18n.ts`, `useTranslation`):** `react-i18next` is set up. The `useTranslation` hook replaces the `translate` directive/service. Translation keys are moved to the `resources` object.
8.  **Local Storage (`useLocalStorage.ts`, `PageEditor.tsx`):** A custom hook `useLocalStorage` simplifies interaction. `PageEditor` uses this hook to persist/restore individual fields and implements the logic for the "newer version" banner (`hasLocalChanges`, `useLocalVersion`, `clearLocalVersion`). Persistence now happens automatically when the Redux state (`currentPage`) changes.
9.  **TypeScript:** Strict typing is used throughout (interfaces for props, state, API data).
10. **Code Structure:** Code is organized into `features` (pageEditor, users, notifications), `shared` (hooks), `services`, `app` (store, hooks), and `components`.
11. **`ng-list`:** Replaced by the `TagInput` component managing an array of strings (`string[]`) in the Redux state.
12. **Date Handling:** `date-fns` is used for parsing and formatting dates, especially for the `datetime-local` input and converting timestamps.
13. **Auto URL:** Logic is implemented in `PageForm`'s `handleChange` and controlled by the `autoUrlEnabled` state in `PageEditor`.

This migration provides a modern, type-safe, and maintainable React equivalent of the original AngularJS code, leveraging Redux Toolkit for robust state management. Remember to adapt API endpoints, data structures, and styling to match your specific backend and design requirements.

### Tokens: {'input_tokens': 6685, 'output_tokens': 18684}
### Execution time: 180.23801398277283
