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
# Angular to React 18 Migration

I'll migrate the provided Angular codebase to React 18 with TypeScript, Redux Toolkit, and all the required features. Let's start with the project structure and then implement each component.

## Project Structure

```
src/
├── api/
│   ├── apiClient.ts
│   └── endpoints.ts
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   └── Notification.tsx
│   └── page/
│       ├── PageEditor.tsx
│       ├── PageForm.tsx
│       ├── PageActions.tsx
│       └── VersionControl.tsx
├── features/
│   ├── page/
│   │   ├── pageSlice.ts
│   │   └── pageSelectors.ts
│   └── user/
│       ├── userSlice.ts
│       └── userSelectors.ts
├── hooks/
│   ├── useLocalStorage.ts
│   └── useTranslation.ts
├── models/
│   ├── Page.ts
│   └── User.ts
├── routes/
│   └── AppRoutes.tsx
├── store/
│   └── store.ts
├── utils/
│   ├── formatters.ts
│   └── validators.ts
├── App.tsx
└── index.tsx
```

## Models

First, let's define our TypeScript interfaces for the data models:

**src/models/Page.ts**
```typescript
export interface Page {
  id: number;
  title: string;
  description: string;
  header: string;
  subheader: string;
  body: string;
  url: string;
  type: string;
  published: string;
  published_date: string;
  themePages: string[];
  timestamp: string;
  extras: Record<string, any>;
  tags?: string[];
  publish?: string;
  scheduleDate?: Date | string;
  misc: Record<string, any>;
  suggestions?: string[];
  confirm?: boolean;
}

export interface PageRevision {
  id: number;
  contentID: number;
  title: string;
  description: string;
  header: string;
  subheader: string;
  featured: string | null;
  body: string;
  url: string;
  type: string;
  published: string;
  published_date: string | number;
  author: string | number;
}
```

**src/models/User.ts**
```typescript
export interface User {
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
```

## API Client

**src/api/apiClient.ts**
```typescript
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
```

**src/api/endpoints.ts**
```typescript
import apiClient from './apiClient';
import { Page, PageRevision } from '../models/Page';

// Generic CRUD operations
const createCrudEndpoints = <T>(resource: string) => ({
  getAll: () => apiClient.get<T[]>(`/${resource}`),
  getById: (id: string | number) => apiClient.get<T>(`/${resource}/${id}`),
  create: (data: Partial<T>) => apiClient.post<T>(`/${resource}`, data),
  update: (id: string | number, data: Partial<T>) => apiClient.put<T>(`/${resource}/${id}`, data),
  delete: (id: string | number) => apiClient.delete(`/${resource}/${id}`),
});

// Specific endpoints matching the original Angular $resource structure
export const API = {
  blocks: {
    ...createCrudEndpoints<any>('blocks'),
    requirements: {
      ...createCrudEndpoints<any>('blocks/:blockID/requirements'),
    },
  },
  comments: createCrudEndpoints<any>('comments'),
  content: {
    ...createCrudEndpoints<Page>('content'),
    extras: {
      getAll: (contentID: number) => apiClient.get(`/content/${contentID}/extras`),
      create: (contentID: number, name: string, extra: any) => 
        apiClient.post(`/content/${contentID}/extras`, { name, extra }),
      delete: (contentID: number) => apiClient.delete(`/content/${contentID}/extras`),
    },
    revisions: {
      ...createCrudEndpoints<PageRevision>('content/:contentID/revisions'),
      extras: {
        create: (contentID: number, revisionID: number, name: string, extra: any) => 
          apiClient.post(`/content/${contentID}/revisions/${revisionID}/extras`, { name, extra }),
        delete: (contentID: number, revisionID: number) => 
          apiClient.delete(`/content/${contentID}/revisions/${revisionID}/extras`),
      },
    },
    tags: {
      getAll: (contentID: number) => apiClient.get(`/content/${contentID}/tags`),
      create: (contentID: number, tag: string) => apiClient.post(`/content/${contentID}/tags`, { tag }),
      delete: (contentID: number) => apiClient.delete(`/content/${contentID}/tags`),
      search: (tag: string) => apiClient.get(`/content/tags?tag=${tag}`),
    },
  },
  files: {
    ...createCrudEndpoints<any>('files'),
    tags: {
      update: (fileID: number, tag: string) => apiClient.put(`/files/${fileID}/tag/${tag}`),
    },
  },
  menus: createCrudEndpoints<any>('menus'),
  modules: createCrudEndpoints<any>('modules'),
  sitemaps: {
    getAll: () => apiClient.get('/sitemaps'),
  },
  themes: createCrudEndpoints<any>('themes'),
  settings: {
    getAll: () => apiClient.get('/settings'),
    update: (data: any) => apiClient.put('/settings', data),
  },
  users: createCrudEndpoints<any>('users'),
};
```

## Redux Store Setup

**src/store/store.ts**
```typescript
import { configureStore } from '@reduxjs/toolkit';
import pageReducer from '../features/page/pageSlice';
import userReducer from '../features/user/userSlice';
import notificationReducer from '../features/notification/notificationSlice';

export const store = configureStore({
  reducer: {
    page: pageReducer,
    user: userReducer,
    notification: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## Redux Slices

**src/features/page/pageSlice.ts**
```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Page, PageRevision } from '../../models/Page';
import { API } from '../../api/endpoints';

interface PageState {
  currentPage: Page;
  loading: boolean;
  error: string | null;
  newerVersion: boolean;
}

const initialState: PageState = {
  currentPage: {
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
    extras: {},
    tags: [],
    misc: {},
    suggestions: [],
  },
  loading: false,
  error: null,
  newerVersion: false,
};

// Async thunks
export const fetchPage = createAsyncThunk(
  'page/fetchPage',
  async (url: string, { rejectWithValue }) => {
    try {
      const response = await API.content.getById(url);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch page');
    }
  }
);

export const savePage = createAsyncThunk(
  'page/savePage',
  async ({ page, duplicate = false }: { page: Page, duplicate?: boolean }, { rejectWithValue, getState }) => {
    try {
      // Determine if this is a new page, update, or duplicate
      if (page.id === 0 || duplicate) {
        const response = await API.content.create(page);
        
        // Save tags
        if (page.tags && page.tags.length > 0) {
          page.tags.forEach(async (tag) => {
            await API.content.tags.create(response.data.id, tag);
          });
        }
        
        // Save as revision
        const revisionResponse = await API.content.revisions.create(response.data.id, page as unknown as PageRevision);
        
        // Save extras
        if (page.extras && Object.keys(page.extras).length > 0) {
          for (const [key, value] of Object.entries(page.extras)) {
            const extraValue = typeof value === 'object' ? JSON.stringify(value) : value;
            await API.content.extras.create(response.data.id, key, extraValue);
            await API.content.revisions.extras.create(
              response.data.id, 
              revisionResponse.data.id, 
              key, 
              extraValue
            );
          }
        }
        
        return response.data;
      } else {
        // Update existing page
        const response = await API.content.update(page.id, page);
        
        // Delete old tags and add new ones
        await API.content.tags.delete(page.id);
        if (page.tags && page.tags.length > 0) {
          page.tags.forEach(async (tag) => {
            await API.content.tags.create(page.id, tag);
          });
        }
        
        // Save as revision
        const revisionResponse = await API.content.revisions.create(page.id, page as unknown as PageRevision);
        
        // Delete old extras and add new ones
        await API.content.extras.delete(page.id);
        if (page.extras && Object.keys(page.extras).length > 0) {
          for (const [key, value] of Object.entries(page.extras)) {
            const extraValue = typeof value === 'object' ? JSON.stringify(value) : value;
            await API.content.extras.create(page.id, key, extraValue);
            await API.content.revisions.extras.create(
              page.id, 
              revisionResponse.data.id, 
              key, 
              extraValue
            );
          }
        }
        
        return response.data;
      }
    } catch (error) {
      return rejectWithValue('Failed to save page');
    }
  }
);

export const deletePage = createAsyncThunk(
  'page/deletePage',
  async (id: number, { rejectWithValue }) => {
    try {
      await API.content.delete(id);
      await API.content.revisions.delete(id);
      await API.content.revisions.extras.delete(id, 0); // Delete all revision extras
      await API.content.extras.delete(id);
      await API.content.tags.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete page');
    }
  }
);

export const searchTags = createAsyncThunk(
  'page/searchTags',
  async (tag: string, { rejectWithValue }) => {
    try {
      const response = await API.content.tags.search(tag);
      return response.data;
    } catch (error) {
      return rejectWithValue([]);
    }
  }
);

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    updatePageField: (state, action: PayloadAction<{ field: keyof Page, value: any }>) => {
      const { field, value } = action.payload;
      (state.currentPage[field] as any) = value;
    },
    setNewerVersion: (state, action: PayloadAction<boolean>) => {
      state.newerVersion = action.payload;
    },
    resetPage: (state) => {
      state.currentPage = initialState.currentPage;
    },
    updatePageType: (state, action: PayloadAction<string>) => {
      state.currentPage.type = action.payload;
    },
    updatePageTags: (state, action: PayloadAction<string[]>) => {
      state.currentPage.tags = action.payload;
    },
    updatePageSuggestions: (state, action: PayloadAction<string[]>) => {
      state.currentPage.suggestions = action.payload;
    },
    confirmDelete: (state, action: PayloadAction<boolean>) => {
      state.currentPage.confirm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPage.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPage = action.payload;
      })
      .addCase(fetchPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(savePage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savePage.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPage = action.payload;
      })
      .addCase(savePage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deletePage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePage.fulfilled, (state) => {
        state.loading = false;
        state.currentPage = initialState.currentPage;
      })
      .addCase(deletePage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(searchTags.fulfilled, (state, action) => {
        state.currentPage.suggestions = action.payload;
      })
      .addCase(searchTags.rejected, (state) => {
        state.currentPage.suggestions = [];
      });
  },
});

export const { 
  updatePageField, 
  setNewerVersion, 
  resetPage, 
  updatePageType, 
  updatePageTags,
  updatePageSuggestions,
  confirmDelete
} = pageSlice.actions;

export default pageSlice.reducer;
```

**src/features/page/pageSelectors.ts**
```typescript
import { RootState } from '../../store/store';

export const selectCurrentPage = (state: RootState) => state.page.currentPage;
export const selectPageLoading = (state: RootState) => state.page.loading;
export const selectPageError = (state: RootState) => state.page.error;
export const selectNewerVersion = (state: RootState) => state.page.newerVersion;
export const selectPageTitle = (state: RootState) => state.page.currentPage.title;
export const selectPageDescription = (state: RootState) => state.page.currentPage.description;
export const selectPageUrl = (state: RootState) => state.page.currentPage.url;
export const selectPageType = (state: RootState) => state.page.currentPage.type;
export const selectPageTags = (state: RootState) => state.page.currentPage.tags || [];
export const selectPageSuggestions = (state: RootState) => state.page.currentPage.suggestions || [];
export const selectPageConfirm = (state: RootState) => state.page.currentPage.confirm;
export const selectPagePublish = (state: RootState) => state.page.currentPage.publish;
export const selectPageScheduleDate = (state: RootState) => state.page.currentPage.scheduleDate;
export const selectPageThemePages = (state: RootState) => state.page.currentPage.themePages;
```

**src/features/user/userSlice.ts**
```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../models/User';
import { API } from '../../api/endpoints';

interface UserState {
  currentUser: User;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: {
    id: '',
    username: '',
    name: '',
    bio: '',
    email: '',
    facebook: '',
    twitter: '',
    photo: '',
    role: ''
  },
  loading: false,
  error: null
};

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      // Assuming there's an endpoint to get the current user
      const response = await API.users.getById('current');
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch user');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
```

**src/features/user/userSelectors.ts**
```typescript
import { RootState } from '../../store/store';

export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;
export const selectUserId = (state: RootState) => state.user.currentUser.id;
```

**src/features/notification/notificationSlice.ts**
```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  message: string;
  classes?: string;
  timeout?: number;
}

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action: PayloadAction<number>) => {
      state.notifications.splice(action.payload, 1);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { addNotification, removeNotification, clearNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
```

## Hooks

**src/hooks/useLocalStorage.ts**
```typescript
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Get from local storage then parse stored json or return initialValue
  const readValue = (): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [storedValue, setValue];
}
```

**src/hooks/useTranslation.ts**
```typescript
import { useCallback } from 'react';

// This is a simplified implementation. In a real app, you'd use a library like i18next
const translations: Record<string, Record<string, string>> = {
  en: {
    page_details: 'Page Details',
    delete: 'Delete',
    duplicate: 'Duplicate',
    save: 'Save',
    page_delete: 'Are you sure you want to delete this page?',
    yes: 'Yes',
    no: 'No',
    type: 'Type',
    title: 'Title',
    description: 'Description',
    tags: 'Tags',
    url: 'URL',
    publish: 'Publish',
    draft: 'Draft',
    schedule: 'Schedule',
    page_newer: 'There is a newer version of this page.',
    discard: 'Discard',
    compare: 'Compare',
    use: 'Use',
    deleted: 'Page deleted successfully',
    page_error_saving: 'Error saving page',
    page_error_updating: 'Error updating page',
    page_different_url: 'Please use a different URL for the duplicate',
    page_no_type_selected: 'Please select a page type',
    page_no_url: 'Please enter a URL',
    page_created: 'Page created successfully',
    page_updated: 'Page updated successfully',
    saved: 'Saved successfully',
  },
};

export const useTranslation = () => {
  const t = useCallback((key: string): string => {
    const language = 'en'; // In a real app, this would be dynamic
    return translations[language][key] || key;
  }, []);

  return { t };
};
```

## Components

**src/components/common/Notification.tsx**
```typescript
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { removeNotification } from '../../features/notification/notificationSlice';

const Notification: React.FC = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notification.notifications);

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        dispatch(removeNotification(0));
      }, notifications[0].timeout || 3000);

      return () => clearTimeout(timer);
    }
  }, [notifications, dispatch]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notifications">
      {notifications.map((notification, index) => (
        <div key={index} className={`notification ${notification.classes || ''}`}>
          {notification.message}
          <button onClick={() => dispatch(removeNotification(index))}>×</button>
        </div>
      ))}
    </div>
  );
};

export default Notification;
```

**src/components/common/Button.tsx**
```typescript
import React from 'react';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  type = 'button', 
  className = '', 
  onClick, 
  children, 
  disabled = false 
}) => {
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default React.memo(Button);
```

**src/components/page/VersionControl.tsx**
```typescript
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { selectNewerVersion } from '../../features/page/pageSelectors';
import { setNewerVersion, updatePageField } from '../../features/page/pageSlice';
import Button from '../common/Button';

const VersionControl: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { url } = useParams<{ url: string }>();
  const newerVersion = useSelector(selectNewerVersion);

  const deleteNewerVersion = useCallback(() => {
    const elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
    elements.forEach(element => {
      localStorage.removeItem(`${url}${element}`);
    });
    dispatch(setNewerVersion(false));
  }, [dispatch, url]);

  const useLocalVersion = useCallback(() => {
    const elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
    elements.forEach(element => {
      const value = localStorage.getItem(`${url}${element}`);
      if (value && value !== 'null') {
        dispatch(updatePageField({ field: element as any, value }));
      }
      localStorage.removeItem(`${url}${element}`);
    });
    dispatch(setNewerVersion(false));
  }, [dispatch, url]);

  if (!newerVersion) {
    return null;
  }

  return (
    <div className="new-version form-case">
      <p>{t('page_newer')}</p>
      <Button className="btn-error" onClick={deleteNewerVersion}>
        {t('discard')}
      </Button>
      <Button className="btn-options" onClick={useLocalVersion}>
        {t('compare')}
      </Button>
      <Button className="btn-success" onClick={useLocalVersion}>
        {t('use')}
      </Button>
    </div>
  );
};

export default VersionControl;
```

**src/components/page/PageActions.tsx**
```typescript
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { 
  selectCurrentPage, 
  selectPageConfirm 
} from '../../features/page/pageSelectors';
import { 
  confirmDelete, 
  deletePage, 
  savePage 
} from '../../features/page/pageSlice';
import { addNotification } from '../../features/notification/notificationSlice';
import Button from '../common/Button';

const PageActions: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const page = useSelector(selectCurrentPage);
  const confirmDeleteState = useSelector(selectPageConfirm);

  const handleSavePage = useCallback((duplicate = false) => {
    dispatch(savePage({ page, duplicate }))
      .unwrap()
      .then(() => {
        dispatch(addNotification({ 
          message: duplicate ? t('page_created') : t('page_updated'),
          classes: 'alert-success'
        }));
        if (!duplicate) {
          navigate(`/${page.url}`);
        }
      })
      .catch((error) => {
        dispatch(addNotification({ 
          message: error,
          classes: 'alert-error'
        }));
      });
  }, [dispatch, navigate, page, t]);

  const handleDeletePage = useCallback(() => {
    if (page.id) {
      dispatch(deletePage(page.id))
        .unwrap()
        .then(() => {
          dispatch(addNotification({ 
            message: t('deleted'),
            classes: 'alert-success'
          }));
          navigate('/new');
        })
        .catch((error) => {
          dispatch(addNotification({ 
            message: error,
            classes: 'alert-error'
          }));
        });
    }
  }, [dispatch, navigate, page.id, t]);

  const handleConfirmDelete = useCallback(() => {
    dispatch(confirmDelete(true));
  }, [dispatch]);

  const handleCancelDelete = useCallback(() => {
    dispatch(confirmDelete(false));
  }, [dispatch]);

  return (
    <div className="bar--actions">
      {!confirmDeleteState ? (
        <>
          <Button 
            className="btn-error" 
            onClick={handleConfirmDelete}
          >
            {t('delete')}
          </Button>
          <Button 
            className="btn-options" 
            onClick={() => handleSavePage(true)}
          >
            {t('duplicate')}
          </Button>
          <Button 
            className="btn-success" 
            onClick={() => handleSavePage(false)}
          >
            {t('save')}
          </Button>
        </>
      ) : (
        <>
          <p>{t('page_delete')}</p>
          <Button 
            className="btn-error" 
            onClick={handleDeletePage}
          >
            {t('yes')}
          </Button>
          <Button 
            className="btn-success" 
            onClick={handleCancelDelete}
          >
            {t('no')}
          </Button>
        </>
      )}
    </div>
  );
};

export default PageActions;
```

**src/components/page/PageForm.tsx**
```typescript
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { 
  selectCurrentPage, 
  selectPageDescription, 
  selectPagePublish, 
  selectPageScheduleDate, 
  selectPageSuggestions, 
  selectPageTags, 
  selectPageThemePages, 
  selectPageTitle, 
  selectPageType, 
  selectPageUrl 
} from '../../features/page/pageSelectors';
import {

### Tokens: {'input_tokens': 7172, 'output_tokens': 8192}
### Execution time: 94.96589994430542
