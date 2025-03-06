I have the following Angular app code:

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


Your task is to migrate this code to React 18.x.
When performing the translation, ensure to adhere to the instructions below:
- Use TypeScript for translated code.
- If it needs to manage local data - use Redux Toolkit with createSlice.
- Split the code into separate components.
- Optimize the code where possible.
- The converted code should not contain any TODOs.
- Return the translated code as markdown code snippets.
- Simply return the codebase without additional comments or explanations on how to convert it.

## Run 1:
### Thoughts:
Let's analyze the provided Angular code and convert it to React 18.x with TypeScript. Here's my plan:

1. First, understand the main functionality in the Angular code
2. Define the TypeScript interfaces and types
3. Create Redux slices for global state management (similar to Angular factories)
4. Implement React components equivalent to the Angular controllers
5. Convert Angular templates to React JSX
6. Implement similar REST functionality using Redux Toolkit's RTK Query or Axios

Let's start by understanding the main functionality in the provided code:

1. **REST.js**: A factory that provides API endpoints for various resources
2. **Page.js**: A factory that stores page-related data globally
3. **Users.js**: A factory that stores user data globally
4. **pageCtrl.js**: Controller that handles page operations (creating, editing, deleting, etc.)
5. **page.html**: Template for the page editor

Now, let's start the conversion:

### 1. Define TypeScript interfaces

```typescript
// types.ts
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
  scheduleDate: Date | null;
  tags: string[];
  themePages: string[];
  published: string;
  published_date: string;
  timestamp: string;
  extras: Record<string, any>;
  misc: Record<string, any>;
}

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

export interface NotifyPayload {
  message: string;
  classes?: string;
}
```

### 2. Create API client using RTK Query

```typescript
// api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Page, User } from './types';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['Page', 'User', 'Content', 'Block', 'Comment', 'File', 'Menu', 'Module', 'Sitemap', 'Theme', 'Setting'],
  endpoints: (builder) => ({
    getBlocks: builder.query({
      query: () => 'api/blocks',
      providesTags: ['Block'],
    }),
    getBlockById: builder.query({
      query: (blockID) => `api/blocks/${blockID}`,
      providesTags: (result, error, id) => [{ type: 'Block', id }],
    }),
    updateBlock: builder.mutation({
      query: ({ blockID, ...body }) => ({
        url: `api/blocks/${blockID}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { blockID }) => [{ type: 'Block', id: blockID }],
    }),
    
    // Content endpoints
    getContent: builder.query({
      query: () => 'api/content',
      providesTags: ['Content'],
    }),
    getContentById: builder.query({
      query: (contentID) => `api/content/${contentID}`,
      providesTags: (result, error, id) => [{ type: 'Content', id }],
    }),
    createContent: builder.mutation({
      query: (content) => ({
        url: 'api/content',
        method: 'POST',
        body: content,
      }),
      invalidatesTags: ['Content'],
    }),
    updateContent: builder.mutation({
      query: ({ contentID, ...body }) => ({
        url: `api/content/${contentID}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { contentID }) => [{ type: 'Content', id: contentID }],
    }),
    deleteContent: builder.mutation({
      query: (contentID) => ({
        url: `api/content/${contentID}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Content'],
    }),
    
    // Content extras
    getContentExtras: builder.query({
      query: (contentID) => `api/content/${contentID}/extras`,
      providesTags: (result, error, contentID) => [{ type: 'Content', id: `${contentID}-extras` }],
    }),
    createContentExtra: builder.mutation({
      query: ({ contentID, name, extra }) => ({
        url: `api/content/${contentID}/extras`,
        method: 'POST',
        body: { name, extra },
      }),
      invalidatesTags: (result, error, { contentID }) => [{ type: 'Content', id: `${contentID}-extras` }],
    }),
    deleteContentExtras: builder.mutation({
      query: (contentID) => ({
        url: `api/content/${contentID}/extras`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, contentID) => [{ type: 'Content', id: `${contentID}-extras` }],
    }),
    
    // Content revisions
    getContentRevisions: builder.query({
      query: (contentID) => `api/content/${contentID}/revisions`,
      providesTags: (result, error, contentID) => [{ type: 'Content', id: `${contentID}-revisions` }],
    }),
    createContentRevision: builder.mutation({
      query: ({ contentID, ...body }) => ({
        url: `api/content/${contentID}/revisions`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { contentID }) => [{ type: 'Content', id: `${contentID}-revisions` }],
    }),
    deleteContentRevisions: builder.mutation({
      query: (contentID) => ({
        url: `api/content/${contentID}/revisions`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, contentID) => [{ type: 'Content', id: `${contentID}-revisions` }],
    }),
    
    // Content revision extras
    createContentRevisionExtra: builder.mutation({
      query: ({ revisionID, contentID, name, extra }) => ({
        url: `api/content/${contentID}/revisions/${revisionID}/extras`,
        method: 'POST',
        body: { name, extra },
      }),
      invalidatesTags: (result, error, { contentID, revisionID }) => [
        { type: 'Content', id: `${contentID}-revisions-${revisionID}-extras` }
      ],
    }),
    deleteContentRevisionExtras: builder.mutation({
      query: ({ contentID, revisionID }) => ({
        url: `api/content/${contentID}/revisions/${revisionID}/extras`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { contentID, revisionID }) => [
        { type: 'Content', id: `${contentID}-revisions-${revisionID}-extras` }
      ],
    }),
    
    // Content tags
    getContentTags: builder.query({
      query: (contentID) => `api/content/${contentID}/tags`,
      providesTags: (result, error, contentID) => [{ type: 'Content', id: `${contentID}-tags` }],
    }),
    createContentTag: builder.mutation({
      query: ({ contentID, tag }) => ({
        url: `api/content/${contentID}/tags`,
        method: 'POST',
        body: { tag },
      }),
      invalidatesTags: (result, error, { contentID }) => [{ type: 'Content', id: `${contentID}-tags` }],
    }),
    deleteContentTags: builder.mutation({
      query: (contentID) => ({
        url: `api/content/${contentID}/tags`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, contentID) => [{ type: 'Content', id: `${contentID}-tags` }],
    }),
    searchContentTags: builder.query({
      query: (tag) => `api/content/tags?tag=${tag}`,
    }),
    
    // Users
    getUsers: builder.query({
      query: () => 'api/users',
      providesTags: ['User'],
    }),
    getUserById: builder.query({
      query: (userID) => `api/users/${userID}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
  }),
});

export const {
  useGetBlocksQuery,
  useGetBlockByIdQuery,
  useUpdateBlockMutation,
  useGetContentQuery,
  useGetContentByIdQuery,
  useCreateContentMutation,
  useUpdateContentMutation,
  useDeleteContentMutation,
  useGetContentExtrasQuery,
  useCreateContentExtraMutation,
  useDeleteContentExtrasMutation,
  useGetContentRevisionsQuery,
  useCreateContentRevisionMutation,
  useDeleteContentRevisionsMutation,
  useCreateContentRevisionExtraMutation,
  useDeleteContentRevisionExtrasMutation,
  useGetContentTagsQuery,
  useCreateContentTagMutation,
  useDeleteContentTagsMutation,
  useSearchContentTagsQuery,
  useGetUsersQuery,
  useGetUserByIdQuery,
} = api;
```

### 3. Create Redux slices

```typescript
// pageSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Page } from './types';

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
  scheduleDate: null,
  tags: [],
  themePages: [],
  published: '',
  published_date: '',
  timestamp: '',
  extras: {},
  misc: {}
};

export const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<Partial<Page>>) => {
      return { ...state, ...action.payload };
    },
    resetPage: () => {
      return initialState;
    },
    updatePageField: (state, action: PayloadAction<{ field: keyof Page, value: any }>) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
  },
});

export const { setPage, resetPage, updatePageField } = pageSlice.actions;
export default pageSlice.reducer;

// userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from './types';

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

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      return action.payload;
    },
    resetUser: () => {
      return initialState;
    },
    updateUserField: (state, action: PayloadAction<{ field: keyof User, value: any }>) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
  },
});

export const { setUser, resetUser, updateUserField } = userSlice.actions;
export default userSlice.reducer;

// notificationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotifyPayload } from './types';

const initialState: {
  notifications: NotifyPayload[]
} = {
  notifications: []
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    notify: (state, action: PayloadAction<NotifyPayload>) => {
      state.notifications.push(action.payload);
    },
    clearNotification: (state, action: PayloadAction<number>) => {
      state.notifications.splice(action.payload, 1);
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { notify, clearNotification, clearAllNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
```

### 4. Create store

```typescript
// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import pageReducer from './pageSlice';
import userReducer from './userSlice';
import notificationReducer from './notificationSlice';
import { api } from './api';

export const store = configureStore({
  reducer: {
    page: pageReducer,
    user: userReducer,
    notification: notificationReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 5. Create React components

First, let's create some utility hooks:

```typescript
// hooks.ts
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

Next, we'll create the main PageEditor component:

```tsx
// PageEditor.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks';
import { setPage, updatePageField } from './pageSlice';
import { notify } from './notificationSlice';
import { 
  useCreateContentMutation,
  useUpdateContentMutation,
  useDeleteContentMutation,
  useCreateContentRevisionMutation, 
  useDeleteContentTagsMutation,
  useCreateContentTagMutation,
  useDeleteContentExtrasMutation,
  useCreateContentExtraMutation,
  useCreateContentRevisionExtraMutation,
  useSearchContentTagsQuery
} from './api';

const PageEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { url } = useParams<{ url: string }>();
  
  const page = useAppSelector(state => state.page);
  const user = useAppSelector(state => state.user);
  
  const [newerVersion, setNewerVersion] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [autoURL, setAutoURL] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [localTitle, setLocalTitle] = useState(page.title);
  const [localDescription, setLocalDescription] = useState(page.description);
  const [localURL, setLocalURL] = useState(page.url);
  const [localPublish, setLocalPublish] = useState(page.publish || 'N');
  const [localTags, setLocalTags] = useState<string[]>(page.tags || []);
  const [localType, setLocalType] = useState(page.type || (page.themePages[0] || ''));
  const [localScheduleDate, setLocalScheduleDate] = useState<Date | null>(
    page.scheduleDate || new Date()
  );
  
  // RTK Query hooks
  const [createContent, { isLoading: isCreating }] = useCreateContentMutation();
  const [updateContent, { isLoading: isUpdating }] = useUpdateContentMutation();
  const [deleteContent] = useDeleteContentMutation();
  const [createRevision] = useCreateContentRevisionMutation();
  const [deleteTags] = useDeleteContentTagsMutation();
  const [createTag] = useCreateContentTagMutation();
  const [deleteExtras] = useDeleteContentExtrasMutation();
  const [createExtra] = useCreateContentExtraMutation();
  const [createRevisionExtra] = useCreateContentRevisionExtraMutation();
  
  const isNew = url === 'new';
  
  // Check for local storage version
  useEffect(() => {
    if (!isNew) {
      const elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
      let hasNewerVersion = false;
      
      elements.forEach(field => {
        const storedValue = localStorage.getItem(`${url}${field}`);
        if (storedValue && storedValue !== 'null' && storedValue !== page[field as keyof typeof page]) {
          hasNewerVersion = true;
        }
      });
      
      setNewerVersion(hasNewerVersion);
    }
  }, [isNew, url, page]);
  
  // Initialize page
  useEffect(() => {
    setLocalTitle(page.title);
    setLocalDescription(page.description);
    setLocalURL(page.url);
    setLocalPublish(page.publish || 'N');
    setLocalTags(page.tags || []);
    setLocalType(page.type || (page.themePages[0] || ''));
    setLocalScheduleDate(page.scheduleDate || new Date());
  }, [page]);
  
  // Load local version
  const loadLocalVersion = () => {
    const elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
    const updates: Partial<typeof page> = {};
    
    elements.forEach(field => {
      const storedValue = localStorage.getItem(`${url}${field}`);
      if (storedValue && storedValue !== 'null') {
        updates[field as keyof typeof page] = storedValue;
        localStorage.removeItem(`${url}${field}`);
      }
    });
    
    dispatch(setPage(updates));
    setNewerVersion(false);
  };
  
  // Delete newer version
  const deleteNewerVersion = () => {
    const elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
    elements.forEach(field => {
      localStorage.removeItem(`${url}${field}`);
    });
    setNewerVersion(false);
  };
  
  // Delete page
  const deletePage = async () => {
    try {
      await deleteContent(page.id).unwrap();
      dispatch(notify({ message: 'Page deleted successfully' }));
      navigate('/new');
    } catch (error) {
      dispatch(notify({ message: 'Error deleting page', classes: 'alert-error' }));
    }
  };
  
  // Title change handler
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalTitle(value);
    dispatch(updatePageField({ field: 'title', value }));
    
    // Auto-generate URL for new pages
    if (isNew || autoURL) {
      const generatedUrl = value
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
      
      setLocalURL(generatedUrl);
      dispatch(updatePageField({ field: 'url', value: generatedUrl }));
    }
  };
  
  // Description change handler
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setLocalDescription(value);
    dispatch(updatePageField({ field: 'description', value }));
  };
  
  // URL change handler
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalURL(value);
    setAutoURL(false);
    dispatch(updatePageField({ field: 'url', value }));
  };
  
  // Handle page type change
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setLocalType(value);
    dispatch(updatePageField({ field: 'type', value }));
  };
  
  // Handle publish change
  const handlePublishChange = (value: string) => {
    setLocalPublish(value);
    dispatch(updatePageField({ field: 'publish', value }));
  };
  
  // Handle schedule date change
  const handleScheduleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = new Date(e.target.value);
    setLocalScheduleDate(value);
    dispatch(updatePageField({ field: 'scheduleDate', value }));
  };
  
  // Save local changes
  const saveLocal = () => {
    localStorage.setItem(`${url}title`, localTitle);
    localStorage.setItem(`${url}description`, localDescription);
    localStorage.setItem(`${url}url`, localURL);
    localStorage.setItem(`${url}publish`, localPublish);
    localStorage.setItem(`${url}scheduleDate`, localScheduleDate?.toString() || '');
    localStorage.setItem(`${url}type`, localType);
  };
  
  // Autocomplete tags
  const handleTagsChange = (tags: string[]) => {
    setLocalTags(tags);
    dispatch(updatePageField({ field: 'tags', value: tags }));
    
    // Get suggestions for the last tag
    const lastTag = tags[tags.length - 1];
    if (lastTag && lastTag.trim()) {
      // We'll use the API to get suggestions
      // This would normally use the useSearchContentTagsQuery hook
      // But for manual changes we need to trigger it differently
      fetch(`api/content/tags?tag=${lastTag}`)
        .then(response => response.json())
        .then(data => setSuggestions(data))
        .catch(() => setSuggestions([]));
    } else {
      setSuggestions([]);
    }
  };
  
  // Select a tag suggestion
  const selectSuggestion = (tag: string) => {
    const newTags = [...localTags];
    newTags[newTags.length - 1] = tag;
    newTags.push('');
    setLocalTags(newTags);
    dispatch(updatePageField({ field: 'tags', value: newTags }));
    setSuggestions([]);
  };
  
  // Save the page
  const savePage = async (duplicate = false) => {
    // Validations
    if (duplicate && localURL === url) {
      dispatch(notify({ 
        message: 'When duplicating, please use a different URL', 
        classes: 'alert-error'
      }));
      return;
    }
    
    if (!localType) {
      dispatch(notify({
        message: 'Please select a page type',
        classes: 'alert-error'
      }));
      return;
    }
    
    if (!localTitle && page.header) {
      setLocalTitle(page.header);
      dispatch(updatePageField({ field: 'title', value: page.header }));
    }
    
    if (!localURL || localURL === 'new') {
      dispatch(notify({
        message: 'Please enter a valid URL',
        classes: 'alert-error'
      }));
      return;
    }
    
    // Determine publish date
    let scheduleDate;
    let publishStatus = localPublish;
    
    if (localPublish === 'Y' && page.publish === 'Y') {
      scheduleDate = page.published_date;
    } else if (localPublish === 'Y') {
      scheduleDate = Math.round(Date.now() / 1000);
    } else if (localPublish === 'schedule') {
      scheduleDate = Math.round(localScheduleDate!.getTime() / 1000);
      
      // Check if this is backdated
      if (localScheduleDate!.getTime() < Date.now()) {
        publishStatus = 'Y';
      } else {
        publishStatus = 'N';
      }
    }
    
    // Get featured image if it exists
    const featured = page.extras.featured ? page.extras.featured.src : null;
    
    // Create content object
    const contentData = {
      title: localTitle,
      description: localDescription,
      header: page.header,
      subheader: page.subheader,
      featured,
      body: page.body,
      url: localURL,
      type: localType,
      published: publishStatus,
      published_date: scheduleDate,
      author: user.id
    };
    
    try {
      if (isNew || duplicate) {
        // Create new page
        const newPage = await createContent(contentData).unwrap();
        const contentID = newPage.id;
        
        // Save tags
        if (localTags && localTags.length) {
          for (const tag of localTags) {
            if (tag) {
              await createTag({ contentID, tag }).unwrap();
            }
          }
        }
        
        // Save revision
        const revision = await createRevision({
          contentID,
          ...contentData
        }).unwrap();
        
        const revisionID = revision.id;
        
        // Save extras
        const extrasKeys = Object.keys(page.extras);
        if (extrasKeys.length > 0) {
          for (const key of extrasKeys) {
            let extraValue = page.extras[key];
            
            // Stringify objects
            if (typeof extraValue === 'object') {
              extraValue = JSON.stringify(extraValue);
            }
            
            // Save to content
            await createExtra({
              contentID,
              name: key,
              extra: extraValue
            }).unwrap();
            
            // Save to revision
            await createRevisionExtra({
              revisionID,
              contentID,
              name: key,
              extra: extraValue
            }).unwrap();
          }
        }
        
        dispatch(notify({ message: 'Page created successfully' }));
        navigate(`/${localURL}`);
        
      } else {
        // Update existing page
        await updateContent({
          contentID: page.id,
          ...contentData
        }).unwrap();
        
        // Delete old tags and create new ones
        await deleteTags(page.id).unwrap();
        
        for (const tag of localTags) {
          if (tag) {
            await createTag({ contentID: page.id, tag }).unwrap();
          }
        }
        
        // Create revision
        const revision = await createRevision({
          contentID: page.id,
          ...contentData
        }).unwrap();
        
        const revisionID = revision.id;
        
        // Delete old extras and create new ones
        await deleteExtras(page.id).unwrap();
        
        const extrasKeys = Object.keys(page.extras);
        for (const key of extrasKeys) {
          let extraValue = page.extras[key];
          
          // Stringify objects
          if (typeof extraValue === 'object') {
            extraValue = JSON.stringify(extraValue);
          }
          
          // Save to content
          await createExtra({
            contentID: page.id,
            name: key,
            extra: extraValue
          }).unwrap();
          
          // Save to revision
          await createRevisionExtra({
            revisionID,
            contentID: page.id,
            name: key,
            extra: extraValue
          }).unwrap();
        }
        
        dispatch(notify({ message: 'Page updated successfully' }));
      }
      
    } catch (error) {
      dispatch(notify({ 
        message: isNew ? 'Error creating page' : 'Error updating page', 
        classes: 'alert-error'
      }));
    }
  };
  
  return (
    <div>
      {newerVersion && (
        <div className="new-version form-case">
          <p>A newer version of this page was found in your browser's storage.</p>
          <button className="btn-error" type="button" onClick={deleteNewerVersion}>Discard</button>
          <button className="btn-options" type="button" onClick={loadLocalVersion}>Compare</button>
          <button className="btn-success" type="button" onClick={loadLocalVersion}>Use</button>
        </div>
      )}
      
      <div className="bar-top">
        <a onClick={() => navigate(-1)}><i className="fa fa-angle-left"></i></a>
        <h1 className="title">Page Details</h1>
        <a className="sidebar-close" onClick={() => navigate('/')}><i className="fa fa-times"></i></a>
      </div>
      
      <div className="bar--actions">
        {!confirm ? (
          <>
            <button type="button" className="btn-error" onClick={() => setConfirm(true)}>Delete</button>
            <button type="button" className="btn-options" onClick={() => savePage(true)}>Duplicate</button>
            <button type="button" className="btn-success" onClick={() => savePage(false)}>Save</button>
          </>
        ) : (
          <>
            <p>Are you sure you want to delete this page?</p>
            <button type="button" className="btn-error" onClick={deletePage}>Yes</button>
            <button type="button" className="btn-success" onClick={() => setConfirm(false)}>No</button>
          </>
        )}
      </div>
      
      <div className="pg-editor form-case">
        <label className="type" htmlFor="type">Type</label>
        <div className="cos-select">
          <select 
            value={localType} 
            onChange={handleTypeChange}
            required
          >
            {page.themePages.map((themePage, index) => (
              <option key={index} value={themePage}>{themePage}</option>
            ))}
          </select>
        </div>
        
        <span className="num-count">{localTitle.length}</span>
        <label>Title</label>
        <input 
          type="text" 
          value={localTitle} 
          onChange={handleTitleChange}
          placeholder="about us, contact us"
        />
        
        <span className="num-count">{localDescription.length}</span>
        <label htmlFor="description">Description</label>
        <textarea 
          value={localDescription} 
          onChange={handleDescriptionChange} 
          placeholder="Tom's Restaurant is a diner located at 2880 Broadway (on the corner of 112th Street) in the Morningside Heights neighborhood of Manhattan in New York City."
        />
        
        <label htmlFor="tags">Tags</label>
        <input 
          type="text" 
          value={localTags.join(',')} 
          onChange={(e) => {
            const tags = e.target.value.split(',');
            handleTagsChange(tags);
          }}
          placeholder="about, restaurant, food, nyc"
        />
        
        {suggestions.length > 0 && (
          <div className="tag-suggestions">
            {suggestions.slice(0, 10).map((tag, index) => (
              <a key={index} onClick={() => selectSuggestion(tag)}>
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </a>
            ))}
          </div>
        )}
        
        <label htmlFor="url">URL</label>
        <input 
          type="text" 
          value={localURL} 
          onChange={handleUrlChange}
        />
        
        <div>
          <input
            type="radio"
            className={localPublish === 'Y' ? 'active' : ''}
            name="publish"
            id="Y"
            value="Y"
            checked={localPublish === 'Y'}
            onChange={() => handlePublishChange('Y')}
          />
          <label htmlFor="Y" onClick={() => handlePublishChange('Y')}>Publish</label>
          
          <input
            type="radio"
            className={localPublish === 'N' ? 'active' : ''}
            name="publish"
            id="N"
            value="N"
            checked={localPublish === 'N'}
            onChange={() => handlePublishChange('N')}
          />
          <label htmlFor="N" onClick={() => handlePublishChange('N')}>Draft</label>
          
          <input
            type="radio"
            className={localPublish === 'schedule' ? 'active' : ''}
            name="publish"
            id="schedule"
            value="schedule"
            checked={localPublish === 'schedule'}
            onChange={() => handlePublishChange('schedule')}
          />
          <label htmlFor="schedule" onClick={() => handlePublishChange('schedule')}>Schedule</label>
          
          {localPublish === 'schedule' && (
            <>
              <div className="schedule-triangle"></div>
              <input 
                type="datetime-local" 
                className="schedule radio-inline" 
                value={localScheduleDate ? new Date(localScheduleDate.getTime() - (localScheduleDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : ''}
                onChange={handleScheduleDateChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageEditor;
```

Next, let's create a notifications component for displaying messages:

```tsx
// Notifications.tsx
import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './hooks';
import { clearNotification } from './notificationSlice';

const Notifications: React.FC = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(state => state.notification.notifications);
  
  // Auto-dismiss notifications after 5 seconds
  useEffect(() => {
    if (notifications.length > 0) {
      const timerId = setTimeout(() => {
        dispatch(clearNotification(0));
      }, 5000);
      
      return () => clearTimeout(timerId);
    }
  }, [notifications, dispatch]);
  
  if (notifications.length === 0) {
    return null;
  }
  
  return (
    <div className="notifications">
      {notifications.map((notification, index) => (
        <div 
          key={index} 
          className={`notification ${notification.classes || ''}`}
          onClick={() => dispatch(clearNotification(index))}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
};

export default Notifications;
```

Let's create the main App component:

```tsx
// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import PageEditor from './PageEditor';
import Notifications from './Notifications';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Notifications />
        <Routes>
          <Route path="/new" element={<PageEditor />} />
          <Route path="/:url" element={<PageEditor />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
```

Finally, let's create the entry point:

```tsx
// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

And that's it! I've converted the Angular app to a React app with TypeScript, Redux Toolkit, and proper component structure. The core functionality is preserved:

1. Page editing and creation
2. Version comparison and management
3. Publishing and scheduling
4. Tag management and autocomplete
5. API integration using RTK Query

The React version has several improvements:
1. Type safety with TypeScript
2. More modular code structure
3. More efficient state management with Redux Toolkit
4. Better API call handling with RTK Query
5. More maintainable component-based architecture

### Answer:
# React 18.x Migration

## Types Definition

```tsx
// src/types/index.ts
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
  scheduleDate: Date | null;
  published: string;
  published_date: string;
  timestamp: string;
  tags: string[];
  themePages: string[];
  extras: Record<string, any>;
  misc: Record<string, any>;
  confirm?: boolean;
  suggestions?: string[];
}

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

export interface NotificationPayload {
  message: string;
  classes?: string;
}
```

## Redux Store Setup

```tsx
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { api } from '../services/api';
import pageReducer from './pageSlice';
import userReducer from './userSlice';
import notificationReducer from './notificationSlice';

export const store = configureStore({
  reducer: {
    page: pageReducer,
    user: userReducer,
    notification: notificationReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## Redux Hooks

```tsx
// src/hooks/redux.ts
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## Page Slice

```tsx
// src/store/pageSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Page } from '../types';

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
  timestamp: '',
  scheduleDate: null,
  tags: [],
  themePages: [],
  extras: {},
  misc: {},
  suggestions: []
};

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<Partial<Page>>) => {
      return { ...state, ...action.payload };
    },
    updatePageField: (state, action: PayloadAction<{ field: keyof Page; value: any }>) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetPage: () => initialState,
    titleChange: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    descriptionChange: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    urlChange: (state, action: PayloadAction<string>) => {
      state.url = action.payload;
    },
    updatePageType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
    setConfirm: (state, action: PayloadAction<boolean>) => {
      state.confirm = action.payload;
    },
    setSuggestions: (state, action: PayloadAction<string[]>) => {
      state.suggestions = action.payload;
    },
  },
});

export const {
  setPage,
  updatePageField,
  resetPage,
  titleChange,
  descriptionChange,
  urlChange,
  updatePageType,
  setConfirm,
  setSuggestions,
} = pageSlice.actions;

export default pageSlice.reducer;
```

## User Slice

```tsx
// src/store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';

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
    resetUser: () => initialState,
  },
});

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
```

## Notification Slice

```tsx
// src/store/notificationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationPayload } from '../types';

interface NotificationState {
  notifications: NotificationPayload[];
}

const initialState: NotificationState = {
  notifications: []
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    notify: (state, action: PayloadAction<NotificationPayload>) => {
      state.notifications.push(action.payload);
    },
    clearNotification: (state, action: PayloadAction<number>) => {
      state.notifications = state.notifications.filter((_, index) => index !== action.payload);
    },
  },
});

export const { notify, clearNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
```

## API Service

```tsx
// src/services/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Page, User } from '../types';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['Page', 'Content', 'Tag'],
  endpoints: (builder) => ({
    // Block endpoints
    getBlocks: builder.query({
      query: () => 'api/blocks',
      providesTags: ['Page'],
    }),
    updateBlock: builder.mutation({
      query: ({ blockID, ...body }) => ({
        url: `api/blocks/${blockID}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Page'],
    }),

    // Content endpoints
    getContent: builder.query<Page, string>({
      query: (contentID) => `api/content/${contentID}`,
      providesTags: (result, error, arg) => [{ type: 'Content', id: arg }],
    }),
    createContent: builder.mutation<Page, Partial<Page>>({
      query: (content) => ({
        url: 'api/content',
        method: 'POST',
        body: content,
      }),
      invalidatesTags: ['Content'],
    }),
    updateContent: builder.mutation<Page, { contentID: number; updates: Partial<Page> }>({
      query: ({ contentID, updates }) => ({
        url: `api/content/${contentID}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { contentID }) => [{ type: 'Content', id: contentID.toString() }],
    }),
    deleteContent: builder.mutation<void, number>({
      query: (contentID) => ({
        url: `api/content/${contentID}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Content'],
    }),

    // Content extras
    getContentExtras: builder.query({
      query: (contentID) => `api/content/${contentID}/extras`,
      providesTags: (result, error, contentID) => [{ type: 'Content', id: `${contentID}-extras` }],
    }),
    createContentExtra: builder.mutation<void, { contentID: number; name: string; extra: any }>({
      query: ({ contentID, name, extra }) => ({
        url: `api/content/${contentID}/extras`,
        method: 'POST',
        body: { name, extra },
      }),
      invalidatesTags: (result, error, { contentID }) => [{ type: 'Content', id: `${contentID}-extras` }],
    }),
    deleteContentExtras: builder.mutation<void, number>({
      query: (contentID) => ({
        url: `api/content/${contentID}/extras`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, contentID) => [{ type: 'Content', id: `${contentID}-extras` }],
    }),

    // Content revisions
    createContentRevision: builder.mutation<{ id: number }, { contentID: number; revision: Partial<Page> }>({
      query: ({ contentID, revision }) => ({
        url: `api/content/${contentID}/revisions`,
        method: 'POST',
        body: revision,
      }),
      invalidatesTags: (result, error, { contentID }) => [{ type: 'Content', id: `${contentID}-revisions` }],
    }),
    deleteContentRevisions: builder.mutation<void, number>({
      query: (contentID) => ({
        url: `api/content/${contentID}/revisions`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, contentID) => [{ type: 'Content', id: `${contentID}-revisions` }],
    }),

    // Revision extras
    createRevisionExtra: builder.mutation<
      void,
      { contentID: number; revisionID: number; name: string; extra: any }
    >({
      query: ({ contentID, revisionID, name, extra }) => ({
        url: `api/content/${contentID}/revisions/${revisionID}/extras/${name}`,
        method: 'POST',
        body: { extra },
      }),
      invalidatesTags: (result, error, { contentID, revisionID }) => [
        { type: 'Content', id: `${contentID}-revisions-${revisionID}-extras` },
      ],
    }),
    deleteRevisionExtras: builder.mutation<void, { contentID: number; revisionID: number }>({
      query: ({ contentID, revisionID }) => ({
        url: `api/content/${contentID}/revisions/${revisionID}/extras`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { contentID, revisionID }) => [
        { type: 'Content', id: `${contentID}-revisions-${revisionID}-extras` },
      ],
    }),

    // Tags
    getContentTags: builder.query<string[], number>({
      query: (contentID) => `api/content/${contentID}/tags`,
      providesTags: (result, error, contentID) => [{ type: 'Tag', id: contentID.toString() }],
    }),
    createContentTag: builder.mutation<void, { contentID: number; tag: string }>({
      query: ({ contentID, tag }) => ({
        url: `api/content/${contentID}/tags`,
        method: 'POST',
        body: { tag },
      }),
      invalidatesTags: (result, error, { contentID }) => [{ type: 'Tag', id: contentID.toString() }],
    }),
    deleteContentTags: builder.mutation<void, number>({
      query: (contentID) => ({
        url: `api/content/${contentID}/tags`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, contentID) => [{ type: 'Tag', id: contentID.toString() }],
    }),
    searchTags: builder.query<string[], string>({
      query: (tag) => `api/content/tags?tag=${tag}`,
    }),

    // Users
    getUser: builder.query<User, string>({
      query: (userID) => `api/users/${userID}`,
    }),
  }),
});

export const {
  useGetContentQuery,
  useCreateContentMutation,
  useUpdateContentMutation,
  useDeleteContentMutation,
  useGetContentExtrasQuery,
  useCreateContentExtraMutation,
  useDeleteContentExtrasMutation,
  useCreateContentRevisionMutation,
  useDeleteContentRevisionsMutation,
  useCreateRevisionExtraMutation,
  useDeleteRevisionExtrasMutation,
  useGetContentTagsQuery,
  useCreateContentTagMutation,
  useDeleteContentTagsMutation,
  useSearchTagsQuery,
  useGetUserQuery,
} = api;
```

## Components

### Notification Component

```tsx
// src/components/Notification.tsx
import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { clearNotification } from '../store/notificationSlice';

const Notification: React.FC = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notification.notifications);

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        dispatch(clearNotification(0));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notifications, dispatch]);

  if (!notifications.length) return null;

  return (
    <div className="notifications">
      {notifications.map((notification, index) => (
        <div
          key={index}
          className={`notification ${notification.classes || ''}`}
          onClick={() => dispatch(clearNotification(index))}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
};

export default Notification;
```

### Tag Suggestions Component

```tsx
// src/components/TagSuggestions.tsx
import React from 'react';
import { useAppDispatch } from '../hooks/redux';
import { titleCase } from '../utils/helpers';

interface TagSuggestionsProps {
  suggestions: string[];
  onSelectSuggestion: (tag: string) => void;
}

const TagSuggestions: React.FC<TagSuggestionsProps> = ({ suggestions, onSelectSuggestion }) => {
  if (!suggestions || !suggestions.length) return null;

  return (
    <div className="tag-suggestions">
      {suggestions.slice(0, 10).map((tag, idx) => (
        <a key={idx} onClick={() => onSelectSuggestion(tag)}>
          {titleCase(tag)}
        </a>
      ))}
    </div>
  );
};

export default TagSuggestions;
```

### PageForm Component

```tsx
// src/components/PageForm.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { titleChange, descriptionChange, urlChange, updatePageType, setSuggestions } from '../store/pageSlice';
import TagSuggestions from './TagSuggestions';
import { useSearchTagsQuery } from '../services/api';

interface PageFormProps {
  autoURL: boolean;
  setAutoURL: (value: boolean) => void;
  onTagsChange: (tags: string[]) => void;
  onSelectSuggestion: (tag: string) => void;
  onPublishChange: (value: string) => void;
  onScheduleDateChange: (date: Date) => void;
}

const PageForm: React.FC<PageFormProps> = ({
  autoURL,
  setAutoURL,
  onTagsChange,
  onSelectSuggestion,
  onPublishChange,
  onScheduleDateChange,
}) => {
  const dispatch = useAppDispatch();
  const page = useAppSelector((state) => state.page);
  const [tagInput, setTagInput] = useState(page.tags?.join(',') || '');
  const [lastTag, setLastTag] = useState<string>('');

  const { data: suggestions } = useSearchTagsQuery(lastTag, { skip: !lastTag });

  useEffect(() => {
    if (suggestions) {
      dispatch(setSuggestions(suggestions));
    }
  }, [suggestions, dispatch]);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(titleChange(value));

    if (autoURL) {
      const url = value.toLowerCase().replace(/ /g, '-').replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
      dispatch(urlChange(url));
    }
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(descriptionChange(e.target.value));
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAutoURL(false);
    dispatch(urlChange(e.target.value));
  };

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(updatePageType(e.target.value));
  };

  const handleTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    const tags = value.split(',').map(tag => tag.trim());
    onTagsChange(tags);

    const lastTagValue = tags[tags.length - 1]?.trim();
    if (lastTagValue) {
      setLastTag(lastTagValue);
    } else {
      setLastTag('');
      dispatch(setSuggestions([]));
    }
  };

  const formatDateTimeLocal = (date: Date | null) => {
    if (!date) return '';
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  return (
    <div className="pg-editor form-case">
      <label className="type" htmlFor="type">Type</label>
      <div className="cos-select">
        <select
          value={page.type}
          onChange={handleTypeChange}
          required
        >
          {page.themePages.map((themePage, index) => (
            <option key={index} value={themePage}>{themePage}</option>
          ))}
        </select>
      </div>

      <span className="num-count">{page.title.length}</span>
      <label>Title</label>
      <input
        type="text"
        value={page.title}
        onChange={handleTitleChange}
        placeholder="about us, contact us"
      />

      <span className="num-count">{page.description.length}</span>
      <label htmlFor="description">Description</label>
      <textarea
        value={page.description}
        onChange={handleDescriptionChange}
        placeholder="Tom's Restaurant is a diner located at 2880 Broadway (on the corner of 112th Street) in the Morningside Heights neighborhood of Manhattan in New York City."
      />

      <label htmlFor="tags">Tags</label>
      <input
        type="text"
        value={tagInput}
        onChange={handleTagsChange}
        placeholder="about, restaurant, food, nyc"
      />
      
      <TagSuggestions 
        suggestions={page.suggestions || []} 
        onSelectSuggestion={onSelectSuggestion} 
      />

      <label htmlFor="url">URL</label>
      <input
        type="text"
        value={page.url}
        onChange={handleUrlChange}
      />

      <div>
        <input
          type="radio"
          className={page.publish === 'Y' ? 'active' : ''}
          name="publish"
          id="Y"
          value="Y"
          checked={page.publish === 'Y'}
          onChange={() => onPublishChange('Y')}
        />
        <label htmlFor="Y" onClick={() => onPublishChange('Y')}>Publish</label>

        <input
          type="radio"
          className={page.publish === 'N' ? 'active' : ''}
          name="publish"
          id="N"
          value="N"
          checked={page.publish === 'N'}
          onChange={() => onPublishChange('N')}
        />
        <label htmlFor="N" onClick={() => onPublishChange('N')}>Draft</label>

        <input
          type="radio"
          className={page.publish === 'schedule' ? 'active' : ''}
          name="publish"
          id="schedule"
          value="schedule"
          checked={page.publish === 'schedule'}
          onChange={() => onPublishChange('schedule')}
        />
        <label htmlFor="schedule" onClick={() => onPublishChange('schedule')}>Schedule</label>

        {page.publish === 'schedule' && (
          <>
            <div className="schedule-triangle"></div>
            <input
              type="datetime-local"
              className="schedule radio-inline"
              value={formatDateTimeLocal(page.scheduleDate)}
              onChange={(e) => onScheduleDateChange(new Date(e.target.value))}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PageForm;
```

### PageEditor Component

```tsx
// src/components/PageEditor.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { setPage, updatePageField, setConfirm } from '../store/pageSlice';
import { notify } from '../store/notificationSlice';
import PageForm from './PageForm';
import {
  useCreateContentMutation,
  useUpdateContentMutation,
  useDeleteContentMutation,
  useCreateContentRevisionMutation,
  useDeleteContentTagsMutation,
  useCreateContentTagMutation,
  useDeleteContentExtrasMutation,
  useCreateContentExtraMutation,
  useCreateRevisionExtraMutation,
} from '../services/api';

const PageEditor: React.FC = () => {
  const { url } = useParams<{ url: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const page = useAppSelector((state) => state.page);
  const user = useAppSelector((state) => state.user);
  
  const [newerVersion, setNewerVersion] = useState(false);
  const [autoURL, setAutoURL] = useState(false);
  const [tags, setTags] = useState<string[]>(page.tags || []);

  const [createContent] = useCreateContentMutation();
  const [updateContent] = useUpdateContentMutation();
  const [deleteContent] = useDeleteContentMutation();
  const [createRevision] = useCreateContentRevisionMutation();
  const [deleteTags] = useDeleteContentTagsMutation();
  const [createTag] = useCreateContentTagMutation();
  const [deleteExtras] = useDeleteContentExtrasMutation();
  const [createExtra] = useCreateContentExtraMutation();
  const [createRevisionExtra] = useCreateRevisionExtraMutation();

  const isNewPage = url === 'new';

  useEffect(() => {
    // Initialize page
    if (isNewPage) {
      dispatch(setPage({
        ...page,
        scheduleDate: new Date(),
        type: page.themePages.length > 0 ? page.themePages[0] : '',
      }));
    }
    
    // Check for locally stored versions
    if (!isNewPage) {
      const elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
      let hasNewerVersion = false;
      
      elements.forEach(field => {
        const storedValue = localStorage.getItem(`${url}${field}`);
        if (storedValue && storedValue !== 'null' && storedValue !== page[field as keyof typeof page]) {
          hasNewerVersion = true;
        }
      });
      
      setNewerVersion(hasNewerVersion);
    }
  }, [dispatch, isNewPage, page, url]);

  const localVersion = () => {
    const elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
    const updates: Partial<typeof page> = {};
    
    elements.forEach(field => {
      const storedValue = localStorage.getItem(`${url}${field}`);
      if (storedValue && storedValue !== 'null') {
        updates[field as keyof typeof page] = storedValue;
        localStorage.removeItem(`${url}${field}`);
      }
    });
    
    dispatch(setPage({ ...page, ...updates }));
    setNewerVersion(false);
  };

  const deleteNewerVersion = () => {
    const elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
    elements.forEach(field => {
      localStorage.removeItem(`${url}${field}`);
    });
    setNewerVersion(false);
  };

  const handleDeletePage = async () => {
    try {
      await deleteContent(page.id);
      dispatch(notify({ message: 'Page deleted successfully' }));
      navigate('/new');
    } catch (error) {
      dispatch(notify({ message: 'Error deleting page', classes: 'alert-error' }));
    }
  };

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
    dispatch(updatePageField({ field: 'tags', value: newTags }));
  };

  const handleSelectSuggestion = (tag: string) => {
    const newTags = [...tags];
    newTags[newTags.length - 1] = tag;
    newTags.push('');
    setTags(newTags);
    dispatch(updatePageField({ field: 'tags', value: newTags }));
  };

  const handlePublishChange = (value: string) => {
    dispatch(updatePageField({ field: 'publish', value }));
  };

  const handleScheduleDateChange = (date: Date) => {
    dispatch(updatePageField({ field: 'scheduleDate', value: date }));
  };

  const saveLocal = () => {
    localStorage.setItem(`${url}title`, page.title);
    localStorage.setItem(`${url}description`, page.description);
    localStorage.setItem(`${url}url`, page.url);
    localStorage.setItem(`${url}publish`, page.publish);
    localStorage.setItem(`${url}scheduleDate`, page.scheduleDate?.toString() || '');
    localStorage.setItem(`${url}type`, page.type);
  };

  const savePage = async (duplicate = false) => {
    // Validations
    if (duplicate && page.url === url) {
      dispatch(notify({
        message: 'When duplicating, please use a different URL',
        classes: 'alert-error'
      }));
      return;
    }

    if (!page.type) {
      dispatch(notify({
        message: 'Please select a page type',
        classes: 'alert-error'
      }));
      return;
    }

    if (!page.url || page.url === 'new') {
      dispatch(notify({
        message: 'Please enter a valid URL',
        classes: 'alert-error'
      }));
      return;
    }

    // Determine publish date
    let scheduleDate;
    let publish = page.publish;

    if (page.publish === 'Y' && page.published === 'Y') {
      scheduleDate = page.published_date;
    } else if (page.publish === 'Y') {
      scheduleDate = Math.round(Date.now() / 1000);
    } else if (page.publish === 'schedule') {
      scheduleDate = Math.round(page.scheduleDate!.getTime() / 1000);
      
      if (page.scheduleDate!.getTime() < Date.now()) {
        publish = 'Y';
      } else {
        publish = 'N';
      }
    }

    // Get featured image if it exists
    const featured = page.extras.featured ? page.extras.featured.src : null;

    try {
      if (isNewPage || duplicate) {
        // Create new page
        const contentData = {
          title: page.title,
          description: page.description,
          header: page.header,
          subheader: page.subheader,
          featured,
          body: page.body,
          url: page.url,
          type: page.type,
          published: publish,
          published_date: scheduleDate,
          author: user.id
        };

        const newPage = await createContent(contentData).unwrap();
        const contentID = newPage.id;

        // Save tags
        if (tags && tags.length) {
          for (const tag of tags) {
            if (tag) {
              await createTag({ contentID, tag });
            }
          }
        }

        // Save revision
        const revision = await createRevision({
          contentID,
          revision: contentData
        }).unwrap();

        const revisionID = revision.id;

        // Save extras
        const extrasKeys = Object.keys(page.extras);
        if (extrasKeys.length > 0) {
          for (const key of extrasKeys) {
            let extraValue = page.extras[key];
            
            // Stringify objects
            if (typeof extraValue === 'object') {
              extraValue = JSON.stringify(extraValue);
            }
            
            // Save to content
            await createExtra({
              contentID,
              name: key,
              extra: extraValue
            });
            
            // Save to revision
            await createRevisionExtra({
              revisionID,
              contentID,
              name: key,
              extra: extraValue
            });
          }
        }

        dispatch(notify({ message: 'Page created successfully' }));
        navigate(`/${page.url}`);
      } else {
        // Update existing page
        const contentData = {
          contentID: page.id,
          updates: {
            title: page.title,
            description: page.description,
            header: page.header,
            subheader: page.subheader,
            featured,
            body: page.body,
            url: page.url,
            type: page.type,
            published: publish,
            published_date: scheduleDate,
            author: user.id
          }
        };

        await updateContent(contentData);

        // Delete old tags and create new ones
        await deleteTags(page.id);
        
        for (const tag of tags) {
          if (tag) {
            await createTag({ contentID: page.id, tag });
          }
        }

        // Create revision
        const revision = await createRevision({
          contentID: page.id,
          revision: contentData.updates
        }).unwrap();

        const revisionID = revision.id;

        // Delete old extras and create new ones
        await deleteExtras(page.id);
        
        const extrasKeys = Object.keys(page.extras);
        for (const key of extrasKeys) {
          let extraValue = page.extras[key];
          
          // Stringify objects
          if (typeof extraValue === 'object') {
            extraValue = JSON.stringify(extraValue);
          }
          
          // Save to content
          await createExtra({
            contentID: page.id,
            name: key,
            extra: extraValue
          });
          
          // Save to revision
          await createRevisionExtra({
            revisionID,
            contentID: page.id,
            name: key,
            extra: extraValue
          });
        }

        dispatch(notify({ message: 'Page updated successfully' }));
      }
    } catch (error) {
      dispatch(notify({
        message: isNewPage ? 'Error creating page' : 'Error updating page',
        classes: 'alert-error'
      }));
    }
  };

  return (
    <div>
      {newerVersion && (
        <div className="new-version form-case">
          <p>A newer version of this page was found in your browser's storage.</p>
          <button className="btn-error" type="button" onClick={deleteNewerVersion}>Discard</button>
          <button className="btn-options" type="button" onClick={localVersion}>Compare</button>
          <button className="btn-success" type="button" onClick={localVersion}>Use</button>
        </div>
      )}
      
      <div className="bar-top">
        <a onClick={() => navigate(-1)}><i className="fa fa-angle-left"></i></a>
        <h1 className="title">Page Details</h1>
        <a className="sidebar-close" onClick={() => navigate('/')}><i className="fa fa-times"></i></a>
      </div>
      
      <div className="bar--actions">
        {!page.confirm ? (
          <>
            <button type="button" className="btn-error" onClick={() => dispatch(setConfirm(true))}>Delete</button>
            <button type="button" className="btn-options" onClick={() => savePage(true)}>Duplicate</button>
            <button type="button" className="btn-success" onClick={() => savePage()}>Save</button>
          </>
        ) : (
          <>
            <p>Are you sure you want to delete this page?</p>
            <button type="button" className="btn-error" onClick={handleDeletePage}>Yes</button>
            <button type="button" className="btn-success" onClick={() => dispatch(setConfirm(false))}>No</button>
          </>
        )}
      </div>
      
      <PageForm
        autoURL={autoURL}
        setAutoURL={setAutoURL}
        onTagsChange={handleTagsChange}
        onSelectSuggestion={handleSelectSuggestion}
        onPublishChange={handlePublishChange}
        onScheduleDateChange={handleScheduleDateChange}
      />
    </div>
  );
};

export default PageEditor;
```

## Utility Functions

```tsx
// src/utils/helpers.ts
export const titleCase = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
```

## App Component

```tsx
// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import PageEditor from './components/PageEditor';
import Notification from './components/Notification';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Notification />
        <div className="container">
          <Routes>
            <Route path="/new" element={<PageEditor />} />
            <Route path="/:url" element={<PageEditor />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
```

## Entry Point

```tsx
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Tokens: {'input_tokens': 6796, 'output_tokens': 18627}
### Execution time: 219.6280026435852
