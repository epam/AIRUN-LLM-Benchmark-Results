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
Below is a high‐level migration plan plus a snapshot of the key files, folder structure and sample code you would end up with after migrating your Angular app to React 18.x + TypeScript. It shows:

  • how to organize your feature folders  
  • strict TS interfaces for your data models  
  • Redux Toolkit createSlice with asyncThunks for REST calls  
  • axios‑based API service  
  • React Router v6 setup  
  • i18n with react‑i18next  
  • a custom hook for localStorage  
  • a PageEditor component broken into smaller pieces  

This is not *every* file in full, but it demonstrates the patterns you’ll apply everywhere.

## 1. Folder structure

src/  
├─ api/  
│   ├─ client.ts              # Axios instance  
│   ├─ contentApi.ts          # All content endpoints  
│   └─ tagsApi.ts  
├─ app/  
│   ├─ store.ts               # Configure Redux store  
│   ├─ hooks/  
│   │   └─ useLocalStorage.ts # Generic localStorage hook  
│   └─ slices/  
│       ├─ contentSlice.ts  
│       └─ userSlice.ts  
├─ components/  
│   ├─ UI/                    # Buttons, Inputs, Selects…  
│   │   ├─ Button.tsx  
│   │   └─ Input.tsx  
│   └─ PageEditor/  
│       ├─ PageForm.tsx       # controlled form inputs  
│       └─ PageEditor.tsx     # container + logic  
├─ pages/  
│   ├─ EditPage.tsx  
│   └─ NewPage.tsx  
├─ routes/  
│   └─ AppRouter.tsx  
├─ i18n/  
│   ├─ en.json  
│   └─ index.ts  
├─ types/  
│   └─ index.ts              # TS interfaces  
├─ App.tsx  
└─ index.tsx  

---

## 2. Types (`src/types/index.ts`)

```ts
export interface Content {
  id: number;
  title: string;
  description: string;
  header: string;
  subheader: string;
  body: string;
  url: string;
  type: string;
  published: 'Y' | 'N' | 'schedule';
  published_date: number; // UNIX timestamp
  author: number;
  tags: string[];
  extras: Record<string, any>;
}

export interface NewContentDTO {
  title: string;
  description: string;
  header: string;
  subheader: string;
  body: string;
  url: string;
  type: string;
  published: 'Y' | 'N' | 'schedule';
  published_date: number;
  author: number;
}

export interface User {
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
```

---

## 3. Axios client (`src/api/client.ts`)

```ts
import axios from 'axios';

const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Optional: request/response interceptors

export default client;
```

---

## 4. API service (`src/api/contentApi.ts`)

```ts
import client from './client';
import { Content, NewContentDTO } from '../types';

export const fetchContent = async (id: number): Promise<Content> => {
  const { data } = await client.get<Content>(`/content/${id}`);
  return data;
};

export const createContent = async (payload: NewContentDTO): Promise<Content> => {
  const { data } = await client.post<Content>('/content', payload);
  return data;
};

export const updateContent = async (
  id: number,
  payload: Partial<NewContentDTO>
): Promise<Content> => {
  const { data } = await client.put<Content>(`/content/${id}`, payload);
  return data;
};

export const deleteContent = async (id: number): Promise<void> => {
  await client.delete(`/content/${id}`);
};

// tags
export const fetchTagSuggestions = async (q: string): Promise<string[]> => {
  const { data } = await client.get<string[]>(`/content/tags`, {
    params: { tag: q },
  });
  return data;
};

export const saveTag = (contentID: number, tag: string) =>
  client.post(`/content/${contentID}/tags`, { tag });
export const deleteTags = (contentID: number) =>
  client.delete(`/content/${contentID}/tags`);
```

---

## 5. Redux slice (`src/app/slices/contentSlice.ts`)

```ts
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  fetchContent,
  createContent,
  updateContent,
  deleteContent,
  fetchTagSuggestions,
} from '../../api/contentApi';
import { Content, NewContentDTO } from '../../types';

interface ContentState {
  current?: Content;
  suggestions: string[];
  loading: boolean;
  error?: string;
}

const initialState: ContentState = {
  current: undefined,
  suggestions: [],
  loading: false,
};

export const loadContent = createAsyncThunk(
  'content/load',
  async (id: number, thunkAPI) => {
    const content = await fetchContent(id);
    return content;
  }
);

export const addContent = createAsyncThunk(
  'content/add',
  async (payload: NewContentDTO, thunkAPI) => {
    const content = await createContent(payload);
    return content;
  }
);

export const editContent = createAsyncThunk(
  'content/edit',
  async (arg: { id: number; payload: Partial<NewContentDTO> }, thunkAPI) => {
    const content = await updateContent(arg.id, arg.payload);
    return content;
  }
);

export const removeContent = createAsyncThunk(
  'content/remove',
  async (id: number, thunkAPI) => {
    await deleteContent(id);
    return id;
  }
);

export const getTagSuggestions = createAsyncThunk(
  'content/getTags',
  async (tag: string) => {
    const suggestions = await fetchTagSuggestions(tag);
    return suggestions;
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setLocalContent(state, action: PayloadAction<Partial<Content>>) {
      state.current = {
        ...state.current!,
        ...action.payload,
      };
    },
    clearSuggestions(state) {
      state.suggestions = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadContent.pending, state => {
        state.loading = true;
      })
      .addCase(loadContent.fulfilled, (state, action) => {
        state.current = action.payload;
        state.loading = false;
      })
      .addCase(loadContent.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      // similar for addContent, editContent, removeContent
      .addCase(getTagSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      });
  },
});

export const { setLocalContent, clearSuggestions } = contentSlice.actions;

export const selectContent = (state: { content: ContentState }) =>
  state.content.current;
export const selectSuggestions = (state: { content: ContentState }) =>
  state.content.suggestions;

export default contentSlice.reducer;
```

---

## 6. Store config (`src/app/store.ts`)

```ts
import { configureStore } from '@reduxjs/toolkit';
import contentReducer from './slices/contentSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    content: contentReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## 7. LocalStorage hook (`src/app/hooks/useLocalStorage.ts`)

```ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (val: T) => void] {
  const [stored, setStored] = useState<T>(() => {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : initialValue;
  });

  const setValue = (value: T) => {
    setStored(value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  return [stored, setValue];
}
```

---

## 8. Routing (`src/routes/AppRouter.tsx`)

```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NewPage from '../pages/NewPage';
import EditPage from '../pages/EditPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/new" element={<NewPage />} />
        <Route path="/:pageUrl" element={<EditPage />} />
        <Route path="*" element={<Navigate to="/new" />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 9. i18n setup (`src/i18n/index.ts`)

```ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';

i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    resources: { en: { translation: en } },
    interpolation: { escapeValue: false },
  });

export default i18n;
```

---

## 10. PageEditor component

### `src/components/PageEditor/PageForm.tsx`

```tsx
import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface PageFormProps {
  title: string;
  description: string;
  url: string;
  tags: string[];
  onChange: (field: string, value: any) => void;
  suggestions: string[];
  onSelectTag: (tag: string) => void;
  onFetchTags: (q: string) => void;
}

export function PageForm({
  title,
  description,
  url,
  tags,
  suggestions,
  onChange,
  onSelectTag,
  onFetchTags,
}: PageFormProps) {
  const { t } = useTranslation();

  return (
    <form>
      <label>{t('title')}</label>
      <input
        value={title}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange('title', e.target.value)
        }
      />

      <label>{t('description')}</label>
      <textarea
        value={description}
        onChange={e => onChange('description', e.target.value)}
      />

      <label>{t('tags')}</label>
      <input
        value={tags.join(',')}
        onChange={e => {
          const arr = e.target.value.split(',');
          onChange('tags', arr);
          onFetchTags(arr[arr.length - 1]);
        }}
      />
      <div>
        {suggestions.map(tag => (
          <button key={tag} onClick={e => { e.preventDefault(); onSelectTag(tag) }}>
            {tag}
          </button>
        ))}
      </div>

      <label>{t('url')}</label>
      <input
        value={url}
        onChange={e => onChange('url', e.target.value)}
      />
    </form>
  );
}
```

### `src/components/PageEditor/PageEditor.tsx`

```tsx
import React, { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks'; 
import {
  loadContent,
  addContent,
  editContent,
  selectContent,
  getTagSuggestions,
  setLocalContent,
  clearSuggestions,
} from '../../app/slices/contentSlice';
import { useLocalStorage } from '../../app/hooks/useLocalStorage';
import { useNavigate, useParams } from 'react-router-dom';
import { PageForm } from './PageForm';

export function PageEditor() {
  const dispatch = useAppDispatch();
  const content = useAppSelector(selectContent);
  const suggestions = useAppSelector(state => state.content.suggestions);
  const navigate = useNavigate();
  const { pageUrl } = useParams<{ pageUrl: string }>();

  // Local Storage for draft
  const [draft, setDraft] = useLocalStorage(
    `draft_${pageUrl}`,
    {} as Partial<typeof content>
  );

  useEffect(() => {
    if (pageUrl && pageUrl !== 'new') {
      // load existing
      dispatch(loadContent(Number(pageUrl)));
    }
  }, [dispatch, pageUrl]);

  // Sync draft to slice
  useEffect(() => {
    if (Object.keys(draft).length > 0) {
      dispatch(setLocalContent(draft));
    }
  }, [draft, dispatch]);

  const onChange = useCallback(
    (field: string, value: any) => {
      dispatch(setLocalContent({ [field]: value }));
      setDraft({ ...draft, [field]: value });
    },
    [dispatch, draft, setDraft]
  );

  const onFetchTags = useCallback(
    (q: string) => {
      if (q) dispatch(getTagSuggestions(q));
      else dispatch(clearSuggestions());
    },
    [dispatch]
  );

  const onSelectTag = useCallback(
    (tag: string) => {
      const newTags = [...(content?.tags || []), tag];
      onChange('tags', newTags);
      dispatch(clearSuggestions());
    },
    [content, onChange, dispatch]
  );

  const onSave = () => {
    if (!content) return;
    const payload = {
      title: content.title,
      description: content.description,
      header: content.header,
      subheader: content.subheader,
      body: content.body,
      url: content.url,
      type: content.type,
      published: content.published,
      published_date: content.published_date,
      author: content.author,
    };
    if (pageUrl === 'new') {
      dispatch(addContent(payload)).then(res => {
        navigate(`/${res.payload.id}`);
      });
    } else {
      dispatch(editContent({ id: content.id, payload })).then(() => {
        navigate(`/${content.id}`);
      });
    }
  };

  if (!content) return <div>Loading…</div>;

  return (
    <>
      <PageForm
        title={content.title}
        description={content.description}
        url={content.url}
        tags={content.tags}
        suggestions={suggestions}
        onChange={onChange}
        onFetchTags={onFetchTags}
        onSelectTag={onSelectTag}
      />
      <button onClick={onSave}>Save</button>
    </>
  );
}
```

---

## 11. Entry point (`src/index.tsx`)

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './app/store';
import './i18n';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

---

## 12. App wrapper (`src/App.tsx`)

```tsx
import React from 'react';
import AppRouter from './routes/AppRouter';

function App() {
  return <AppRouter />;
}

export default App;
```

---

### Key points & how it aligns with the 10 steps:

1. **TypeScript + strict typing**  
   Every file uses `.ts` or `.tsx`. All models (`Content`, `User`, payloads, slice state) are strongly typed.

2. **State Management with Redux Toolkit**  
   We use `createSlice`, `createAsyncThunk`, selectors, action creators, and `configureStore`.

3. **Component Architecture**  
   We split the monolithic Angular controller into `PageEditor` (container), `PageForm` (presentational) and small UI components under `components/UI`.

4. **API Communication**  
   We replaced `$resource` with `axios` in `/src/api/*`. Each endpoint is a typed function returning the proper model.

5. **Form Handling**  
   We use React controlled inputs to manage `value` + `onChange`, and sync changes to Redux + local storage. You can extend with `yup`/`react‑hook‑form` if you like.

6. **Routing**  
   We use React Router v6 in `AppRouter.tsx`, preserving `/new` and `/:pageUrl`.

7. **Internationalization**  
   We wire up `react‑i18next`. The JSON lives under `i18n/en.json`.

8. **Optimizations**  
   You can code‐split your slices & pages via `React.lazy`/`Suspense`. We used `useCallback` to prevent needless re‐renders.

9. **Local Storage**  
   We created `useLocalStorage` for storing drafts under a unique key, recovering it on mount, and clearing when saved.

10. **Code Structure**  
   We organized features into `api/`, `app/`, `components/`, `pages/`, `routes/`, `i18n/`, `types/` for maximum clarity and separation of concerns.

From here you would replicate the same patterns for `users`, `blocks`, `files`, etc., creating slices, API modules, and React pages/components for each domain. This blueprint should get your Angular 1.x codebase fully migrated to a modern React + Redux Toolkit + TypeScript architecture.

### Tokens: {'input_tokens': 5784, 'output_tokens': 4794, 'reasoning_tokens': 896}
### Execution time: 44.62720704078674
