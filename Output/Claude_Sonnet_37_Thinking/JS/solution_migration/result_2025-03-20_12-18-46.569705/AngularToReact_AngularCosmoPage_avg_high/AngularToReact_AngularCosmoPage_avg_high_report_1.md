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
### Thoughts:
Let's break down the migration plan from Angular to React 18.x with Redux Toolkit for this application. I'll work through this step by step:

First, let's understand what the original Angular code does:

1. **REST Factory**: A service that provides resources for communicating with the backend API.
2. **Page Factory**: Stores global page variables.
3. **Users Factory**: Stores data about the current user.
4. **pageCtrl**: Controller for creating and editing pages.
5. **page.html**: The template for the page editor.

Now, let's plan the React/Redux architecture:

### 1. Redux Store Structure

We'll need to create Redux slices for:
- **Page** - For page-related state
- **User** - For user-related state
- **UI** - For UI-related state (notifications, sidebar visibility, etc.)

### 2. API Services

We'll create API services using axios or fetch to replace Angular's $resource.

### 3. React Components

- **PageEditor** - Main component for editing pages (replaces pageCtrl)
- Reusable components:
  - **FormField** - For form inputs with labels, validation, etc.
  - **Button** - For action buttons (save, delete, etc.)
  - **TagInput** - For handling tags with autocomplete
  - **Notification** - For showing notifications

### 4. TypeScript Interfaces

We'll define interfaces for:
- Page data
- User data
- API responses
- Component props

Let's start implementing the migration:

### Step 1: Set up TypeScript Interfaces

```typescript
// src/types/page.ts
export interface Page {
  id: number;
  title: string;
  description: string;
  header: string;
  subheader: string;
  body: string;
  url: string;
  type: string;
  publish: string;
  published: string;
  published_date: string;
  scheduleDate: Date | null;
  themePages: string[];
  timestamp: string;
  extras: Record<string, any>;
  tags: string[];
  misc: Record<string, any>;
}

// src/types/user.ts
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

### Step 2: Create Redux Slices

```typescript
// src/store/slices/pageSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Page } from '../../types/page';

const initialState: Page = {
  id: 0,
  title: '',
  description: '',
  header: '',
  subheader: '',
  body: '',
  url: '',
  type: '',
  publish: '',
  published: '',
  published_date: '',
  scheduleDate: null,
  themePages: [],
  timestamp: '',
  extras: {},
  tags: [],
  misc: {}
};

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<Page>) => {
      return { ...state, ...action.payload };
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setUrl: (state, action: PayloadAction<string>) => {
      state.url = action.payload;
    },
    setType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
    setPublish: (state, action: PayloadAction<string>) => {
      state.publish = action.payload;
    },
    setScheduleDate: (state, action: PayloadAction<Date | null>) => {
      state.scheduleDate = action.payload;
    },
    setTags: (state, action: PayloadAction<string[]>) => {
      state.tags = action.payload;
    },
    resetPage: () => initialState
  }
});

export const { 
  setPage, 
  setTitle, 
  setDescription, 
  setUrl, 
  setType, 
  setPublish, 
  setScheduleDate, 
  setTags, 
  resetPage 
} = pageSlice.actions;

export default pageSlice.reducer;

// src/store/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/user';

const initialState: User = {
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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      return { ...state, ...action.payload };
    },
    resetUser: () => initialState
  }
});

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;

// src/store/slices/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  message: string;
  classes?: string;
}

interface UiState {
  notification: Notification | null;
  sidebarTemplate: string;
  showAdminPanel: boolean;
  active: string;
  newerVersion: boolean;
}

const initialState: UiState = {
  notification: null,
  sidebarTemplate: '',
  showAdminPanel: false,
  active: '',
  newerVersion: false
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<Notification>) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    },
    setSidebarTemplate: (state, action: PayloadAction<string>) => {
      state.sidebarTemplate = action.payload;
    },
    setShowAdminPanel: (state, action: PayloadAction<boolean>) => {
      state.showAdminPanel = action.payload;
    },
    setActive: (state, action: PayloadAction<string>) => {
      state.active = action.payload;
    },
    setNewerVersion: (state, action: PayloadAction<boolean>) => {
      state.newerVersion = action.payload;
    }
  }
});

export const { 
  setNotification, 
  clearNotification, 
  setSidebarTemplate, 
  setShowAdminPanel, 
  setActive,
  setNewerVersion
} = uiSlice.actions;

export default uiSlice.reducer;
```

### Step 3: Configure Redux Store

```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import pageReducer from './slices/pageSlice';
import userReducer from './slices/userSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    page: pageReducer,
    user: userReducer,
    ui: uiReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Step 4: Create API Services

```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/', // Adjust as needed
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;

// src/services/pageService.ts
import api from './api';
import { Page } from '../types/page';

export const pageService = {
  getPage: async (url: string): Promise<Page> => {
    const response = await api.get(`api/content/${url}`);
    return response.data;
  },
  
  createPage: async (page: Partial<Page>): Promise<Page> => {
    const response = await api.post('api/content', page);
    return response.data;
  },
  
  updatePage: async (id: number, page: Partial<Page>): Promise<Page> => {
    const response = await api.put(`api/content/${id}`, page);
    return response.data;
  },
  
  deletePage: async (id: number): Promise<void> => {
    await api.delete(`api/content/${id}`);
  },
  
  // Additional methods for tags, revisions, extras, etc.
  getPageTags: async (contentId: number): Promise<string[]> => {
    const response = await api.get(`api/content/${contentId}/tags`);
    return response.data;
  },
  
  addPageTag: async (contentId: number, tag: string): Promise<void> => {
    await api.post(`api/content/${contentId}/tags`, { tag });
  },
  
  deletePageTags: async (contentId: number): Promise<void> => {
    await api.delete(`api/content/${contentId}/tags`);
  },
  
  // ... other methods for extras, revisions, etc.
};

// src/services/userService.ts
import api from './api';
import { User } from '../types/user';

export const userService = {
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('api/users/current');
    return response.data;
  },
  
  getUser: async (id: string): Promise<User> => {
    const response = await api.get(`api/users/${id}`);
    return response.data;
  },
  
  updateUser: async (id: string, user: Partial<User>): Promise<User> => {
    const response = await api.put(`api/users/${id}`, user);
    return response.data;
  }
};
```

### Step 5: Create React Components and Hooks

```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

// src/hooks/useTranslation.ts
import { useCallback } from 'react';

// This is a simplified i18n implementation
// For a real app, you'd use a library like react-i18next
const translations: Record<string, string> = {
  'page_details': 'Page Details',
  'delete': 'Delete',
  'duplicate': 'Duplicate',
  'save': 'Save',
  'page_delete': 'Are you sure you want to delete this page?',
  'yes': 'Yes',
  'no': 'No',
  'type': 'Type',
  'title': 'Title',
  'description': 'Description',
  'tags': 'Tags',
  'url': 'URL',
  'publish': 'Publish',
  'draft': 'Draft',
  'schedule': 'Schedule',
  'page_newer': 'You have a newer version of this page saved locally.',
  'discard': 'Discard',
  'compare': 'Compare',
  'use': 'Use',
  'deleted': 'Deleted successfully',
  'page_error_saving': 'Error saving page',
  'page_error_updating': 'Error updating page',
  'saved': 'Saved successfully',
  'page_created': 'Page created successfully',
  'page_updated': 'Page updated successfully',
  'page_different_url': 'For a duplicate, you need a different URL',
  'page_no_type_selected': 'No page type selected',
  'page_no_url': 'URL is required'
};

export const useTranslation = () => {
  const t = useCallback((key: string) => {
    return translations[key] || key;
  }, []);

  return { t };
};

// src/components/ui/Button.tsx
import React from 'react';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  type = 'button', 
  onClick, 
  className = '', 
  children, 
  disabled = false 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;

// src/components/ui/FormField.tsx
import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
  required?: boolean;
  counter?: boolean;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  textarea = false,
  required = false,
  counter = false,
  className = ''
}) => {
  return (
    <div className={`form-field ${className}`}>
      {counter && <span className="num-count">{value.length}</span>}
      <label htmlFor={name}>{label}</label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );
};

export default FormField;

// src/components/ui/TagsInput.tsx
import React, { useState, useEffect } from 'react';
import { pageService } from '../../services/pageService';

interface TagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

const TagsInput: React.FC<TagsInputProps> = ({ 
  tags, 
  onChange, 
  placeholder = '' 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.trim()) {
      // Fetch tag suggestions
      pageService.getTagSuggestions(value.trim())
        .then(data => setSuggestions(data))
        .catch(() => setSuggestions([]));
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTags = [...tags, inputValue.trim()];
      onChange(newTags);
      setInputValue('');
      setSuggestions([]);
    }
  };

  const selectSuggestion = (tag: string) => {
    const newTags = [...tags, tag];
    onChange(newTags);
    setInputValue('');
    setSuggestions([]);
  };

  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    onChange(newTags);
  };

  return (
    <div className="tags-input">
      <div className="tags-container">
        {tags.map((tag, index) => (
          <div key={index} className="tag">
            {tag}
            <button type="button" onClick={() => removeTag(index)}>×</button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
      </div>
      {suggestions.length > 0 && (
        <div className="tag-suggestions">
          {suggestions.slice(0, 10).map((tag, index) => (
            <div 
              key={index} 
              className="suggestion" 
              onClick={() => selectSuggestion(tag)}
            >
              {tag}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagsInput;

// src/components/ui/Notification.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { clearNotification } from '../../store/slices/uiSlice';

const Notification: React.FC = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state: RootState) => state.ui.notification);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  if (!notification) return null;

  return (
    <div className={`notification ${notification.classes || ''}`}>
      {notification.message}
    </div>
  );
};

export default Notification;
```

Now, let's implement the main PageEditor component:

```typescript
// src/components/pages/PageEditor.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '../../store';
import { 
  setPage, 
  setTitle, 
  setDescription, 
  setUrl, 
  setTags, 
  setType,
  setPublish,
  setScheduleDate,
  resetPage
} from '../../store/slices/pageSlice';
import { setNotification, setNewerVersion } from '../../store/slices/uiSlice';
import { pageService } from '../../services/pageService';
import { useTranslation } from '../../hooks/useTranslation';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import TagsInput from '../ui/TagsInput';

interface PageEditorParams {
  url?: string;
}

const PageEditor: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { url } = useParams<PageEditorParams>();
  
  const page = useSelector((state: RootState) => state.page);
  const user = useSelector((state: RootState) => state.user);
  const newerVersion = useSelector((state: RootState) => state.ui.newerVersion);
  
  const [confirm, setConfirm] = useState(false);
  const [autoURL, setAutoURL] = useState(true);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  
  const isNewPage = location.pathname === '/new';
  
  // Load page data
  useEffect(() => {
    if (!isNewPage && url) {
      pageService.getPage(url)
        .then(data => {
          dispatch(setPage(data));
          
          // Check for unsaved local version
          const elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
          const hasNewerVersion = elements.some(key => {
            const localValue = localStorage.getItem(`${url}${key}`);
            return localValue !== null && localValue !== 'null' && localValue !== String(data[key as keyof typeof data] || '');
          });
          
          dispatch(setNewerVersion(hasNewerVersion));
        })
        .catch(error => {
          console.error('Error loading page', error);
          dispatch(setNotification({ 
            message: 'Error loading page', 
            classes: 'alert-error' 
          }));
        });
    } else {
      // Initialize new page
      dispatch(resetPage());
      
      // Set current date for scheduling
      dispatch(setScheduleDate(new Date()));
      
      // Set default page type if available
      if (page.themePages.length > 0) {
        dispatch(setType(page.themePages[0]));
      }
    }
  }, [dispatch, isNewPage, url, page.themePages]);
  
  // Handle title change and auto-generate URL
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    dispatch(setTitle(title));
    
    // Auto-generate URL for new pages
    if (autoURL && (isNewPage || !page.url)) {
      const generatedUrl = title
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
      
      dispatch(setUrl(generatedUrl));
    }
  };
  
  // Handle URL change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setUrl(e.target.value));
    setAutoURL(false);
  };
  
  // Handle description change
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setDescription(e.target.value));
  };
  
  // Handle tags change
  const handleTagsChange = (tags: string[]) => {
    dispatch(setTags(tags));
  };
  
  // Handle type change
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setType(e.target.value));
  };
  
  // Handle publish change
  const handlePublishChange = (value: string) => {
    dispatch(setPublish(value));
  };
  
  // Handle schedule date change
  const handleScheduleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setScheduleDate(new Date(e.target.value)));
  };
  
  // Delete newer version
  const deleteNewerVersion = useCallback(() => {
    if (url) {
      const elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
      elements.forEach(key => {
        localStorage.removeItem(`${url}${key}`);
      });
      dispatch(setNewerVersion(false));
    }
  }, [dispatch, url]);
  
  // Use local version
  const useLocalVersion = useCallback(() => {
    if (url) {
      const elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
      const updatedPage = { ...page };
      
      elements.forEach(key => {
        const localValue = localStorage.getItem(`${url}${key}`);
        if (localValue && localValue !== 'null') {
          updatedPage[key as keyof typeof updatedPage] = localValue;
        }
        localStorage.removeItem(`${url}${key}`);
      });
      
      dispatch(setPage(updatedPage));
      dispatch(setNewerVersion(false));
    }
  }, [dispatch, page, url]);
  
  // Save local version
  const saveLocalVersion = useCallback(() => {
    if (url) {
      localStorage.setItem(`${url}title`, page.title);
      localStorage.setItem(`${url}description`, page.description);
      localStorage.setItem(`${url}url`, page.url);
      localStorage.setItem(`${url}publish`, page.publish);
      localStorage.setItem(`${url}scheduleDate`, page.scheduleDate ? page.scheduleDate.toISOString() : '');
      localStorage.setItem(`${url}type`, page.type);
    }
  }, [page, url]);
  
  // Delete page
  const deletePage = useCallback(() => {
    if (page.id) {
      pageService.deletePage(page.id)
        .then(() => {
          dispatch(setNotification({ message: t('deleted') }));
          navigate('/new');
        })
        .catch(error => {
          console.error('Error deleting page', error);
          dispatch(setNotification({ 
            message: 'Error deleting page', 
            classes: 'alert-error' 
          }));
        });
    }
  }, [dispatch, navigate, page.id, t]);
  
  // Save page
  const savePage = useCallback((duplicate: boolean = false) => {
    // Validations
    if (duplicate && page.url === location.pathname) {
      dispatch(setNotification({
        message: t('page_different_url'),
        classes: 'alert-error'
      }));
      return;
    }
    
    if (!page.type) {
      dispatch(setNotification({
        message: t('page_no_type_selected'),
        classes: 'alert-error'
      }));
      return;
    }
    
    if (page.url.length === 0 || page.url === 'new') {
      dispatch(setNotification({
        message: t('page_no_url'),
        classes: 'alert-error'
      }));
      return;
    }
    
    // Calculate schedule date
    let scheduleDate: number | null = null;
    if (page.publish === 'Y' && !isNewPage) {
      scheduleDate = page.scheduleDate ? Math.floor(page.scheduleDate.getTime() / 1000) : null;
    } else if (page.publish === 'Y') {
      scheduleDate = Math.floor(new Date().getTime() / 1000);
    } else if (page.publish === 'schedule' && page.scheduleDate) {
      scheduleDate = Math.floor(page.scheduleDate.getTime() / 1000);
      
      // Check if backdated
      if (page.scheduleDate.getTime() < new Date().getTime()) {
        dispatch(setPublish('Y'));
      } else {
        dispatch(setPublish('N'));
      }
    }
    
    // Get featured image
    const featured = page.extras.featured ? page.extras.featured.src : null;
    
    // Create payload
    const pageData = {
      title: page.title,
      description: page.description,
      header: page.header,
      subheader: page.subheader,
      featured,
      body: page.body,
      url: page.url,
      type: page.type,
      published: page.publish,
      published_date: scheduleDate,
      author: user.id
    };
    
    if (isNewPage || duplicate) {
      // Create new page
      pageService.createPage(pageData)
        .then(data => {
          // Save tags
          if (page.tags && page.tags.length > 0) {
            page.tags.forEach(tag => {
              pageService.addPageTag(data.id, tag);
            });
          }
          
          // Save extras
          Object.keys(page.extras).forEach(key => {
            const extraValue = typeof page.extras[key] === 'object' 
              ? JSON.stringify(page.extras[key]) 
              : page.extras[key];
            
            pageService.addPageExtra(data.id, key, extraValue);
          });
          
          dispatch(setNotification({ message: t('page_created') }));
          navigate(`/${page.url}`);
        })
        .catch(error => {
          console.error('Error creating page', error);
          dispatch(setNotification({
            message: t('page_error_saving'),
            classes: 'alert-error'
          }));
        });
    } else {
      // Update existing page
      pageService.updatePage(page.id, pageData)
        .then(() => {
          // Update tags (delete old ones first)
          pageService.deletePageTags(page.id)
            .then(() => {
              // Add new tags
              if (page.tags && page.tags.length > 0) {
                page.tags.forEach(tag => {
                  pageService.addPageTag(page.id, tag);
                });
              }
              
              // Delete old extras
              return pageService.deletePageExtras(page.id);
            })
            .then(() => {
              // Add new extras
              Object.keys(page.extras).forEach(key => {
                const extraValue = typeof page.extras[key] === 'object' 
                  ? JSON.stringify(page.extras[key]) 
                  : page.extras[key];
                
                pageService.addPageExtra(page.id, key, extraValue);
              });
              
              dispatch(setNotification({ message: t('page_updated') }));
              navigate(`/${page.url}`);
            });
        })
        .catch(error => {
          console.error('Error updating page', error);
          dispatch(setNotification({
            message: t('page_error_updating'),
            classes: 'alert-error'
          }));
        });
    }
  }, [dispatch, isNewPage, location.pathname, navigate, page, t, user.id]);
  
  return (
    <div className="page-editor">
      {newerVersion && (
        <div className="new-version form-case">
          <p>{t('page_newer')}</p>
          <Button 
            className="btn-error" 
            onClick={deleteNewerVersion}
          >
            {t('discard')}
          </Button>
          <Button 
            className="btn-options" 
            onClick={useLocalVersion}
          >
            {t('compare')}
          </Button>
          <Button 
            className="btn-success" 
            onClick={useLocalVersion}
          >
            {t('use')}
          </Button>
        </div>
      )}
      
      <div className="bar-top">
        <a onClick={() => {/* handle sidebar click */}}>
          <i className="fa fa-angle-left"></i>
        </a>
        <h1 className="title">{t('page_details')}</h1>
        <a className="sidebar-close" onClick={() => {/* handle close click */}}>
          <i className="fa fa-times"></i>
        </a>
      </div>
      
      <div className="bar--actions">
        {!confirm ? (
          <>
            <Button 
              className="btn-error" 
              onClick={() => setConfirm(true)}
            >
              {t('delete')}
            </Button>
            <Button 
              className="btn-options" 
              onClick={() => savePage(true)}
            >
              {t('duplicate')}
            </Button>
            <Button 
              className="btn-success" 
              onClick={() => savePage()}
            >
              {t('save')}
            </Button>
          </>
        ) : (
          <>
            <p>{t('page_delete')}</p>
            <Button 
              className="btn-error" 
              onClick={deletePage}
            >
              {t('yes')}
            </Button>
            <Button 
              className="btn-success" 
              onClick={() => setConfirm(false)}
            >
              {t('no')}
            </Button>
          </>
        )}
      </div>
      
      <div className="pg-editor form-case">
        <label className="type" htmlFor="type">{t('type')}</label>
        <div className="cos-select">
          <select
            value={page.type}
            onChange={handleTypeChange}
            required
          >
            {page.themePages.map((themePage, index) => (
              <option key={index} value={themePage}>
                {themePage}
              </option>
            ))}
          </select>
        </div>
        
        <FormField
          label={t('title')}
          name="title"
          value={page.title}
          onChange={handleTitleChange}
          placeholder="about us, contact us"
          counter
        />
        
        <FormField
          label={t('description')}
          name="description"
          value={page.description}
          onChange={handleDescriptionChange}
          placeholder="Tom's Restaurant is a diner located at 2880 Broadway (on the corner of 112th Street) in the Morningside Heights neighborhood of Manhattan in New York City."
          textarea
          counter
        />
        
        <div className="form-field">
          <label htmlFor="tags">{t('tags')}</label>
          <TagsInput
            tags={page.tags || []}
            onChange={handleTagsChange}
            placeholder="about, restaurant, food, nyc"
          />
        </div>
        
        <FormField
          label={t('url')}
          name="url"
          value={page.url}
          onChange={handleUrlChange}
        />
        
        <div className="radio-group">
          <div className="radio-option">
            <input
              type="radio"
              id="publish-y"
              name="publish"
              checked={page.publish === 'Y'}
              onChange={() => handlePublishChange('Y')}
            />
            <label htmlFor="publish-y">{t('publish')}</label>
          </div>
          
          <div className="radio-option">
            <input
              type="radio"
              id="publish-n"
              name="publish"
              checked={page.publish === 'N'}
              onChange={() => handlePublishChange('N')}
            />
            <label htmlFor="publish-n">{t('draft')}</label>
          </div>
          
          <div className="radio-option">
            <input
              type="radio"
              id="publish-schedule"
              name="publish"
              checked={page.publish === 'schedule'}
              onChange={() => handlePublishChange('schedule')}
            />
            <label htmlFor="publish-schedule">{t('schedule')}</label>
          </div>
        </div>
        
        {page.publish === 'schedule' && (
          <>
            <div className="schedule-triangle"></div>
            <input
              type="datetime-local"
              className="schedule radio-inline"
              value={page.scheduleDate ? page.scheduleDate.toISOString().slice(0, 16) : ''}
              onChange={handleScheduleDateChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PageEditor;
```

Lastly, let's set up the router and main App component:

```typescript
// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userService } from './services/userService';
import { setUser } from './store/slices/userSlice';
import PageEditor from './components/pages/PageEditor';
import Notification from './components/ui/Notification';

const App: React.FC = () => {
  const dispatch = useDispatch();
  
  // Load current user on app start
  useEffect(() => {
    userService.getCurrentUser()
      .then(user => {
        dispatch(setUser(user));
      })
      .catch(error => {
        console.error('Error loading user', error);
      });
  }, [dispatch]);
  
  return (
    <Router>
      <div className="app">
        <Notification />
        <Routes>
          <Route path="/new" element={<PageEditor />} />
          <Route path="/:url" element={<PageEditor />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

// src/index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import './styles/main.css';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

There's a lot more we could implement, but this provides the core structure for migrating from Angular to React with Redux Toolkit. A real implementation would need additional refinements, but this demonstrates the pattern and approach for the migration.

Key aspects of this implementation:

1. Redux Toolkit for state management, replacing Angular's factories
2. React hooks for local state and side effects
3. TypeScript interfaces for type safety
4. Axios for API communication, replacing $resource
5. React Router for navigation
6. Local storage hooks for managing unsaved changes
7. Component-based architecture with proper separation of concerns

The migration maintains the core functionality of the original Angular application while adopting React best practices.

### Answer:
# Angular to React Migration

I'll create a comprehensive migration of the Angular code to React 18 with TypeScript, Redux Toolkit, and modern React patterns.

## Project Structure

```
src/
├── api/
│   ├── apiClient.ts
│   └── endpoints.ts
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── FormField.tsx
│   │   ├── Notification.tsx
│   │   └── TagInput.tsx
│   └── pages/
│       └── PageEditor/
│           ├── PageEditor.tsx
│           ├── PageActions.tsx
│           ├── PageForm.tsx
│           └── VersionNotice.tsx
├── hooks/
│   ├── useLocalStorage.ts
│   └── useTranslation.ts
├── store/
│   ├── index.ts
│   └── slices/
│       ├── pageSlice.ts
│       ├── userSlice.ts
│       └── uiSlice.ts
├── types/
│   ├── page.ts
│   └── user.ts
├── utils/
│   ├── formatters.ts
│   └── validators.ts
├── App.tsx
└── index.tsx
```

## 1. TypeScript Interfaces

```typescript
// src/types/page.ts
export interface Page {
  id: number;
  title: string;
  description: string;
  header: string;
  subheader: string;
  body: string;
  url: string;
  type: string;
  publish: string;
  published_date: string;
  scheduleDate: Date | null;
  themePages: string[];
  timestamp: string;
  extras: Record<string, any>;
  tags: string[];
  misc: Record<string, any>;
}

// src/types/user.ts
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

// src/types/notification.ts
export interface Notification {
  message: string;
  classes?: string;
}
```

## 2. API Client

```typescript
// src/api/apiClient.ts
import axios, { AxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.get<T>(url, config);
  return response.data;
};

export const post = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
};

export const put = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.put<T>(url, data, config);
  return response.data;
};

export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
};

// src/api/endpoints.ts
import { get, post, put, del } from './apiClient';
import { Page, User } from '../types';

export const pageApi = {
  getPage: (id: number) => get<Page>(`api/content/${id}`),
  createPage: (page: Partial<Page>) => post<Page>('api/content', page),
  updatePage: (id: number, page: Partial<Page>) => put<Page>(`api/content/${id}`, page),
  deletePage: (id: number) => del(`api/content/${id}`),
  
  getPageTags: (contentId: number) => get<string[]>(`api/content/${contentId}/tags`),
  addPageTag: (contentId: number, tag: string) => post(`api/content/${contentId}/tags`, { tag }),
  deletePageTags: (contentId: number) => del(`api/content/${contentId}/tags`),
  
  getTagSuggestions: (tag: string) => get<string[]>(`api/content/tags?tag=${tag}`),
  
  getExtras: (contentId: number) => get(`api/content/${contentId}/extras`),
  addExtra: (contentId: number, name: string, value: any) => 
    post(`api/content/${contentId}/extras`, { name, extra: value }),
  deleteExtras: (contentId: number) => del(`api/content/${contentId}/extras`),
  
  addRevision: (contentId: number, revision: Partial<Page>) => 
    post(`api/content/${contentId}/revisions`, revision),
  addRevisionExtra: (contentId: number, revisionId: number, name: string, value: any) => 
    post(`api/content/${contentId}/revisions/${revisionId}/extras`, { name, extra: value })
};

export const userApi = {
  getCurrentUser: () => get<User>('api/users/current'),
  getUser: (id: string) => get<User>(`api/users/${id}`),
  updateUser: (id: string, user: Partial<User>) => put<User>(`api/users/${id}`, user)
};
```

## 3. Redux Store and Slices

```typescript
// src/store/slices/pageSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Page } from '../../types/page';
import { pageApi } from '../../api/endpoints';

export const fetchPage = createAsyncThunk(
  'page/fetchPage',
  async (id: number) => {
    return await pageApi.getPage(id);
  }
);

export const savePage = createAsyncThunk(
  'page/savePage',
  async (arg: { id?: number; page: Partial<Page> }, { getState }) => {
    const { id, page } = arg;
    
    if (id) {
      return await pageApi.updatePage(id, page);
    } else {
      return await pageApi.createPage(page);
    }
  }
);

export const deletePage = createAsyncThunk(
  'page/deletePage',
  async (id: number) => {
    await pageApi.deletePage(id);
    return id;
  }
);

const initialState: Page = {
  id: 0,
  title: '',
  description: '',
  header: '',
  subheader: '',
  body: '',
  url: '',
  type: '',
  publish: 'N',
  published_date: '',
  scheduleDate: null,
  themePages: [],
  timestamp: '',
  extras: {},
  tags: [],
  misc: {}
};

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    resetPage: () => initialState,
    updatePage: (state, action: PayloadAction<Partial<Page>>) => {
      return { ...state, ...action.payload };
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setUrl: (state, action: PayloadAction<string>) => {
      state.url = action.payload;
    },
    setType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
    setPublish: (state, action: PayloadAction<string>) => {
      state.publish = action.payload;
    },
    setScheduleDate: (state, action: PayloadAction<Date | null>) => {
      state.scheduleDate = action.payload;
    },
    setTags: (state, action: PayloadAction<string[]>) => {
      state.tags = action.payload;
    },
    setThemePages: (state, action: PayloadAction<string[]>) => {
      state.themePages = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPage.fulfilled, (state, action) => {
        return { ...state, ...action.payload };
      })
      .addCase(savePage.fulfilled, (state, action) => {
        return { ...state, ...action.payload };
      });
  }
});

export const { 
  resetPage, 
  updatePage, 
  setTitle, 
  setDescription, 
  setUrl, 
  setType, 
  setPublish, 
  setScheduleDate, 
  setTags,
  setThemePages
} = pageSlice.actions;

export default pageSlice.reducer;

// src/store/slices/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/user';
import { userApi } from '../../api/endpoints';

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async () => {
    return await userApi.getCurrentUser();
  }
);

const initialState: User = {
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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      return { ...state, ...action.payload };
    },
    resetUser: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        return { ...state, ...action.payload };
      });
  }
});

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;

// src/store/slices/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '../../types/notification';

interface UiState {
  notification: Notification | null;
  sidebarTemplate: string;
  showAdminPanel: boolean;
  active: string;
  newerVersion: boolean;
}

const initialState: UiState = {
  notification: null,
  sidebarTemplate: 'core/html/sidebar.html',
  showAdminPanel: false,
  active: '',
  newerVersion: false
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<Notification>) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    },
    setSidebarTemplate: (state, action: PayloadAction<string>) => {
      state.sidebarTemplate = action.payload;
    },
    setShowAdminPanel: (state, action: PayloadAction<boolean>) => {
      state.showAdminPanel = action.payload;
    },
    setActive: (state, action: PayloadAction<string>) => {
      state.active = action.payload;
    },
    setNewerVersion: (state, action: PayloadAction<boolean>) => {
      state.newerVersion = action.payload;
    }
  }
});

export const { 
  setNotification, 
  clearNotification, 
  setSidebarTemplate, 
  setShowAdminPanel, 
  setActive,
  setNewerVersion
} = uiSlice.actions;

export default uiSlice.reducer;

// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import pageReducer from './slices/pageSlice';
import userReducer from './slices/userSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    page: pageReducer,
    user: userReducer,
    ui: uiReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## 4. Custom Hooks

```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string, 
  initialValue: T
): [T, (value: T) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue, removeValue];
}

// src/hooks/useTranslation.ts
import { useCallback } from 'react';

// This would typically use a proper i18n library like react-i18next
// This is a simplified version for the migration example
const translations: Record<string, string> = {
  'page_details': 'Page Details',
  'delete': 'Delete',
  'duplicate': 'Duplicate',
  'save': 'Save',
  'page_delete': 'Are you sure you want to delete this page?',
  'yes': 'Yes',
  'no': 'No',
  'type': 'Type',
  'title': 'Title',
  'description': 'Description',
  'tags': 'Tags',
  'url': 'URL',
  'publish': 'Publish',
  'draft': 'Draft',
  'schedule': 'Schedule',
  'page_newer': 'You have a newer version of this page saved locally.',
  'discard': 'Discard',
  'compare': 'Compare',
  'use': 'Use',
  'deleted': 'Deleted successfully',
  'page_error_saving': 'Error saving page',
  'page_error_updating': 'Error updating page',
  'saved': 'Saved successfully',
  'page_created': 'Page created successfully',
  'page_updated': 'Page updated successfully',
  'page_different_url': 'For a duplicate, you need a different URL',
  'page_no_type_selected': 'No page type selected',
  'page_no_url': 'URL is required'
};

export const useTranslation = () => {
  const t = useCallback((key: string): string => {
    return translations[key] || key;
  }, []);

  return { t };
};
```

## 5. Reusable Components

```typescript
// src/components/common/Button.tsx
import React from 'react';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  type = 'button', 
  onClick, 
  className = '', 
  children, 
  disabled = false 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;

// src/components/common/FormField.tsx
import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
  required?: boolean;
  showCharCount?: boolean;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  textarea = false,
  required = false,
  showCharCount = false,
  className = ''
}) => {
  return (
    <div className={`form-field ${className}`}>
      {showCharCount && <span className="num-count">{value.length}</span>}
      <label htmlFor={name}>{label}</label>
      
      {textarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );
};

export default FormField;

// src/components/common/TagInput.tsx
import React, { useState, useEffect } from 'react';
import { pageApi } from '../../api/endpoints';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({ 
  tags, 
  onChange, 
  placeholder = '' 
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.trim()) {
      // Fetch tag suggestions
      pageApi.getTagSuggestions(value.trim())
        .then(data => setSuggestions(data))
        .catch(() => setSuggestions([]));
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      onChange([...tags, inputValue.trim()]);
      setInputValue('');
      setSuggestions([]);
    }
  };

  const selectSuggestion = (tag: string) => {
    onChange([...tags, tag]);
    setInputValue('');
    setSuggestions([]);
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="tag-input">
      <div className="tags-list">
        {tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
            <button type="button" onClick={() => removeTag(index)}>×</button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
      </div>
      
      {suggestions.length > 0 && (
        <div className="tag-suggestions">
          {suggestions.slice(0, 10).map((tag, index) => (
            <a 
              key={index} 
              onClick={() => selectSuggestion(tag)} 
              className="suggestion"
            >
              {tag}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagInput;

// src/components/common/Notification.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { clearNotification } from '../../store/slices/uiSlice';

const Notification: React.FC = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state: RootState) => state.ui.notification);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  if (!notification) return null;

  return (
    <div className={`notification ${notification.classes || ''}`}>
      {notification.message}
    </div>
  );
};

export default Notification;
```

## 6. Page Editor Components

```typescript
// src/components/pages/PageEditor/VersionNotice.tsx
import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import Button from '../../common/Button';

interface VersionNoticeProps {
  onUseLocalVersion: () => void;
  onDeleteNewerVersion: () => void;
}

const VersionNotice: React.FC<VersionNoticeProps> = ({
  onUseLocalVersion,
  onDeleteNewerVersion
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="new-version form-case">
      <p>{t('page_newer')}</p>
      <Button 
        className="btn-error" 
        onClick={onDeleteNewerVersion}
      >
        {t('discard')}
      </Button>
      <Button 
        className="btn-options" 
        onClick={onUseLocalVersion}
      >
        {t('compare')}
      </Button>
      <Button 
        className="btn-success" 
        onClick={onUseLocalVersion}
      >
        {t('use')}
      </Button>
    </div>
  );
};

export default VersionNotice;

// src/components/pages/PageEditor/PageActions.tsx
import React, { useState } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import Button from '../../common/Button';

interface PageActionsProps {
  onSave: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const PageActions: React.FC<PageActionsProps> = ({
  onSave,
  onDuplicate,
  onDelete
}) => {
  const { t } = useTranslation();
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const handleDelete = () => {
    if (confirmDelete) {
      onDelete();
    } else {
      setConfirmDelete(true);
    }
  };
  
  return (
    <div className="bar--actions">
      {!confirmDelete ? (
        <>
          <Button 
            className="btn-error" 
            onClick={handleDelete}
          >
            {t('delete')}
          </Button>
          <Button 
            className="btn-options" 
            onClick={onDuplicate}
          >
            {t('duplicate')}
          </Button>
          <Button 
            className="btn-success" 
            onClick={onSave}
          >
            {t('save')}
          </Button>
        </>
      ) : (
        <>
          <p>{t('page_delete')}</p>
          <Button 
            className="btn-error" 
            onClick={onDelete}
          >
            {t('yes')}
          </Button>
          <Button 
            className="btn-success" 
            onClick={() => setConfirmDelete(false)}
          >
            {t('no')}
          </Button>
        </>
      )}
    </div>
  );
};

export default PageActions;

// src/components/pages/PageEditor/PageForm.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { 
  setTitle, 
  setDescription, 
  setUrl, 
  setTags, 
  setType,
  setPublish,
  setScheduleDate
} from '../../../store/slices/pageSlice';
import { useTranslation } from '../../../hooks/useTranslation';
import FormField from '../../common/FormField';
import TagInput from '../../common/TagInput';

interface PageFormProps {
  autoURL: boolean;
  setAutoURL: (value: boolean) => void;
}

const PageForm: React.FC<PageFormProps> = ({ autoURL, setAutoURL }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const page = useSelector((state: RootState) => state.page);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    dispatch(setTitle(title));
    
    // Auto-generate URL if enabled
    if (autoURL) {
      const url = title
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
      
      dispatch(setUrl(url));
    }
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setDescription(e.target.value));
  };
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutoURL(false);
    dispatch(setUrl(e.target.value));
  };
  
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setType(e.target.value));
  };
  
  const handleTagsChange = (tags: string[]) => {
    dispatch(setTags(tags));
  };
  
  const handlePublishChange = (value: string) => {
    dispatch(setPublish(value));
  };
  
  const handleScheduleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setScheduleDate(new Date(e.target.value)));
  };
  
  return (
    <div className="pg-editor form-case">
      <label className="type" htmlFor="type">{t('type')}</label>
      <div className="cos-select">
        <select
          value={page.type}
          onChange={handleTypeChange}
          required
        >
          {page.themePages.map((themePage, index) => (
            <option key={index} value={themePage}>
              {themePage}
            </option>
          ))}
        </select>
      </div>
      
      <FormField
        label={t('title')}
        name="title"
        value={page.title}
        onChange={handleTitleChange}
        placeholder="about us, contact us"
        showCharCount
      />
      
      <FormField
        label={t('description')}
        name="description"
        value={page.description}
        onChange={handleDescriptionChange}
        placeholder="Tom's Restaurant is a diner located at 2880 Broadway (on the corner of 112th Street) in the Morningside Heights neighborhood of Manhattan in New York City."
        textarea
        showCharCount
      />
      
      <label htmlFor="tags">{t('tags')}</label>
      <TagInput
        tags={page.tags || []}
        onChange={handleTagsChange}
        placeholder="about, restaurant, food, nyc"
      />
      
      <FormField
        label={t('url')}
        name="url"
        value={page.url}
        onChange={handleUrlChange}
      />
      
      <div className="publish-options">
        <div className="radio-group">
          <input 
            type="radio"
            id="publish-yes"
            name="publish"
            checked={page.publish === 'Y'}
            onChange={() => handlePublishChange('Y')}
          />
          <label 
            htmlFor="publish-yes" 
            onClick={() => handlePublishChange('Y')}
          >
            {t('publish')}
          </label>
          
          <input 
            type="radio"
            id="publish-no"
            name="publish"
            checked={page.publish === 'N'}
            onChange={() => handlePublishChange('N')}
          />
          <label 
            htmlFor="publish-no" 
            onClick={() => handlePublishChange('N')}
          >
            {t('draft')}
          </label>
          
          <input 
            type="radio"
            id="publish-schedule"
            name="publish"
            checked={page.publish === 'schedule'}
            onChange={() => handlePublishChange('schedule')}
          />
          <label 
            htmlFor="publish-schedule" 
            onClick={() => handlePublishChange('schedule')}
          >
            {t('schedule')}
          </label>
        </div>
        
        {page.publish === 'schedule' && (
          <>
            <div className="schedule-triangle"></div>
            <input 
              type="datetime-local"
              className="schedule radio-inline"
              value={page.scheduleDate ? page.scheduleDate.toISOString().slice(0, 16) : ''}
              onChange={handleScheduleDateChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PageForm;

// src/components/pages/PageEditor/PageEditor.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { 
  resetPage, 
  updatePage, 
  savePage, 
  deletePage as deletePageAction
} from '../../../store/slices/pageSlice';
import { setNotification, setNewerVersion } from '../../../store/slices/uiSlice';
import { fetchCurrentUser } from '../../../store/slices/userSlice';
import { useTranslation } from '../../../hooks/useTranslation';
import { pageApi } from '../../../api/endpoints';
import VersionNotice from './VersionNotice';
import PageActions from './PageActions';
import PageForm from './PageForm';

interface RouteParams {
  url?: string;
}

const PageEditor: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { url } = useParams<RouteParams>();
  
  const page = useSelector((state: RootState) => state.page);
  const user = useSelector((state: RootState) => state.user);
  const newerVersion = useSelector((state: RootState) => state.ui.newerVersion);
  const showAdminPanel = useSelector((state: RootState) => state.ui.showAdminPanel);
  
  const [autoURL, setAutoURL] = useState(true);
  const isNewPage = location.pathname === '/new';
  
  // Fetch current user
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);
  
  // Initialize page data
  useEffect(() => {
    if (isNewPage) {
      dispatch(resetPage());
      dispatch(updatePage({ 
        scheduleDate: new Date() 
      }));
    } else if (url) {
      // Load existing page
      pageApi.getPage(parseInt(url))
        .then(pageData => {
          dispatch(updatePage(pageData));
          
          // Check for local storage versions
          const elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
          const hasNewerVersion = elements.some(key => {
            const localValue = localStorage.getItem(`${url}${key}`);
            return localValue && localValue !== 'null' && localValue !== String(pageData[key as keyof typeof pageData] || '');
          });
          
          dispatch(setNewerVersion(hasNewerVersion));
        })
        .catch(error => {
          console.error("Error loading page:", error);
          dispatch(setNotification({
            message: "Error loading page",
            classes: "alert-error"
          }));
        });
    }
  }, [dispatch, isNewPage, url]);
  
  // Handle using local version
  const handleUseLocalVersion = useCallback(() => {
    if (url) {
      const elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
      let updatedFields: Partial<typeof page> = {};
      
      elements.forEach(key => {
        const localValue = localStorage.getItem(`${url}${key}`);
        if (localValue && localValue !== 'null') {
          updatedFields[key as keyof typeof page] = 
            key === 'scheduleDate' ? new Date(localValue) : localValue;
          
          // Clear local storage
          localStorage.removeItem(`${url}${key}`);
        }
      });
      
      dispatch(updatePage(updatedFields));
      dispatch(setNewerVersion(false));
    }
  }, [dispatch, page, url]);
  
  // Handle deleting newer version
  const handleDeleteNewerVersion = useCallback(() => {
    if (url) {
      const elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
      elements.forEach(key => {
        localStorage.removeItem(`${url}${key}`);
      });
      dispatch(setNewerVersion(false));
    }
  }, [dispatch, url]);
  
  // Handle save page
  const handleSavePage = useCallback(async (duplicate = false) => {
    // Validations
    if (duplicate && page.url === location.pathname.substring(1)) {
      dispatch(setNotification({
        message: t('page_different_url'),
        classes: 'alert-error'
      }));
      return;
    }
    
    if (!page.type) {
      dispatch(setNotification({
        message: t('page_no_type_selected'),
        classes: 'alert-error'
      }));
      return;
    }
    
    if (!page.url || page.url === 'new') {
      dispatch(setNotification({
        message: t('page_no_url'),
        classes: 'alert-error'
      }));
      return;
    }
    
    // Prepare schedule date
    let scheduleDate: number | null = null;
    let publishStatus = page.publish;
    
    if (page.publish === 'Y') {
      scheduleDate = page.scheduleDate ? Math.floor(page.scheduleDate.getTime() / 1000) : Math.floor(Date.now() / 1000);
    } else if (page.publish === 'schedule' && page.scheduleDate) {
      scheduleDate = Math.floor(page.scheduleDate.getTime() / 1000);
      
      // Check if backdated
      if (page.scheduleDate.getTime() < Date.now()) {
        publishStatus = 'Y';
      } else {
        publishStatus = 'N';
      }
    }
    
    // Get featured image
    const featured = page.extras.featured ? page.extras.featured.src : null;
    
    // Prepare page data
    const pageData = {
      title: page.title,
      description: page.description,
      header: page.header,
      subheader: page.subheader,
      featured,
      body: page.body,
      url: page.url,
      type: page.type,
      published: publishStatus,
      published_date: scheduleDate ? String(scheduleDate) : '',
      author: user.id
    };
    
    try {
      // Save page
      const savedPage = isNewPage || duplicate
        ? await pageApi.createPage(pageData)
        : await pageApi.updatePage(page.id, pageData);
      
      // Update Redux store
      dispatch(updatePage(savedPage));
      
      // Handle tags
      if (!isNewPage && !duplicate) {
        await pageApi.deletePageTags(savedPage.id);
      }
      
      if (page.tags && page.tags.length > 0) {
        await Promise.all(page.tags.map(tag => 
          pageApi.addPageTag(savedPage.id, tag)
        ));
      }
      
      // Handle extras
      if (!isNewPage && !duplicate) {
        await pageApi.deleteExtras(savedPage.id);
      }
      
      if (Object.keys(page.extras).length > 0) {
        await Promise.all(Object.entries(page.extras).map(([key, value]) => {
          const extraValue = typeof value === 'object' ? JSON.stringify(value) : value;
          return pageApi.addExtra(savedPage.id, key, extraValue);
        }));
      }
      
      // Save revision
      await pageApi.addRevision(savedPage.id, pageData);
      
      // Show success message
      dispatch(setNotification({
        message: isNewPage || duplicate ? t('page_created') : t('page_updated')
      }));
      
      // Navigate to new page URL
      navigate(`/${savedPage.url}`);
    } catch (error) {
      console.error("Error saving page:", error);
      dispatch(setNotification({
        message: isNewPage ? t('page_error_saving') : t('page_error_updating'),
        classes: 'alert-error'
      }));
    }
  }, [dispatch, navigate, page, user.id, isNewPage, location.pathname, t]);
  
  // Handle delete page
  const handleDeletePage = useCallback(async () => {
    if (page.id) {
      try {
        await dispatch(deletePageAction(page.id)).unwrap();
        
        // Delete related data
        await pageApi.deletePageTags(page.id);
        await pageApi.deleteExtras(page.id);
        
        dispatch(setNotification({ message: t('deleted') }));
        navigate('/new');
      } catch (error) {
        console.error("Error deleting page:", error);
        dispatch(setNotification({
          message: "Error deleting page",
          classes: "alert-error"
        }));
      }
    }
  }, [dispatch, navigate, page.id, t]);
  
  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    dispatch(updatePage({ sidebarTemplate: 'core/html/sidebar.html' }));
  };
  
  // Handle admin panel toggle
  const handleAdminPanelToggle = () => {
    dispatch({
      type: 'ui/setShowAdminPanel',
      payload: !showAdminPanel
    });
  };
  
  return (
    <div className="page-editor-container">
      {newerVersion && (
        <VersionNotice
          onUseLocalVersion={handleUseLocalVersion}
          onDeleteNewerVersion={handleDeleteNewerVersion}
        />
      )}
      
      <div className="bar-top">
        <a onClick={handleSidebarToggle}>
          <i className="fa fa-angle-left"></i>
        </a>
        <h1 className="title">{t('page_details')}</h1>
        <a className="sidebar-close" onClick={handleAdminPanelToggle}>
          <i className="fa fa-times"></i>
        </a>

### Tokens: {'input_tokens': 7201, 'output_tokens': 20000}
### Execution time: 241.31742429733276
