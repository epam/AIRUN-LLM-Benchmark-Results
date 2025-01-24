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
### Answer:
```typescript
// src/types/Page.ts
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
  misc: Record<string, any>;
  publish: string;
  scheduleDate: Date;
  tags: string[];
  suggestions?: string[];
}

// src/types/User.ts
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

// src/services/rest.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const restApi = createApi({
  reducerPath: 'restApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Blocks', 'Comments', 'Content', 'Files', 'Menus', 'Modules', 'Sitemaps', 'Themes', 'Settings', 'Users'],
  endpoints: (builder) => ({
    getBlocks: builder.query<any, string | void>({
      query: (blockID) => `blocks/${blockID || ''}`,
      providesTags: (result, error, id) => [{ type: 'Blocks', id }],
    }),
    updateBlock: builder.mutation<any, { blockID: string; data: any }>({
      query: ({ blockID, data }) => ({
        url: `blocks/${blockID}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { blockID }) => [{ type: 'Blocks', id: blockID }],
    }),
    getBlocksRequirements: builder.query<any, { blockID: string; requirementID?: string }>({
      query: ({ blockID, requirementID }) => `blocks/${blockID}/requirements/${requirementID || ''}`,
    }),
    updateBlocksRequirements: builder.mutation<any, { blockID: string; requirementID: string; data: any }>({
      query: ({ blockID, requirementID, data }) => ({
        url: `blocks/${blockID}/requirements/${requirementID}`,
        method: 'PUT',
        body: data,
      }),
    }),
    getComments: builder.query<any, string | void>({
      query: (commentID) => `comments/${commentID || ''}`,
      providesTags: (result, error, id) => [{ type: 'Comments', id }],
    }),
    updateComment: builder.mutation<any, { commentID: string; data: any }>({
      query: ({ commentID, data }) => ({
        url: `comments/${commentID}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { commentID }) => [{ type: 'Comments', id: commentID }],
    }),
    getContent: builder.query<any, string | void>({
      query: (contentID) => `content/${contentID || ''}`,
      providesTags: (result, error, id) => [{ type: 'Content', id }],
    }),
    updateContent: builder.mutation<any, { contentID: string; data: any }>({
      query: ({ contentID, data }) => ({
        url: `content/${contentID}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { contentID }) => [{ type: 'Content', id: contentID }],
    }),
    getContentExtras: builder.query<any, string>({
      query: (contentID) => `content/${contentID}/extras/`,
    }),
    getContentRevisions: builder.query<any, { contentID: string; revisionID?: string }>({
      query: ({ contentID, revisionID }) => `content/${contentID}/revisions/${revisionID || ''}`,
    }),
    updateContentRevisions: builder.mutation<any, { contentID: string; revisionID: string; data: any }>({
      query: ({ contentID, revisionID, data }) => ({
        url: `content/${contentID}/revisions/${revisionID}`,
        method: 'PUT',
        body: data,
      }),
    }),
    getContentRevisionsExtras: builder.query<any, { contentID: string; revisionID: string; extraID?: string }>({
      query: ({ contentID, revisionID, extraID }) => `content/${contentID}/revisions/${revisionID}/extras/${extraID || ''}`,
    }),
    getContentTags: builder.query<any, string>({
      query: (contentID) => `content/${contentID}/tags/`,
    }),
    getFiles: builder.query<any, string | void>({
      query: (fileID) => `files/${fileID || ''}`,
      providesTags: (result, error, id) => [{ type: 'Files', id }],
    }),
    updateFile: builder.mutation<any, { fileID: string; data: any }>({
      query: ({ fileID, data }) => ({
        url: `files/${fileID}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { fileID }) => [{ type: 'Files', id: fileID }],
    }),
    getFilesTags: builder.query<any, { fileID: string; tag: string }>({
      query: ({ fileID, tag }) => `files/${fileID}/tag/${tag}`,
    }),
    updateFilesTags: builder.mutation<any, { fileID: string; tag: string; data: any }>({
      query: ({ fileID, tag, data }) => ({
        url: `files/${fileID}/tag/${tag}`,
        method: 'PUT',
        body: data,
      }),
    }),
    getMenus: builder.query<any, string | void>({
      query: (menuID) => `menus/${menuID || ''}`,
      providesTags: (result, error, id) => [{ type: 'Menus', id }],
    }),
    updateMenu: builder.mutation<any, { menuID: string; data: any }>({
      query: ({ menuID, data }) => ({
        url: `menus/${menuID}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { menuID }) => [{ type: 'Menus', id: menuID }],
    }),
    getModules: builder.query<any, string | void>({
      query: (moduleID) => `modules/${moduleID || ''}`,
      providesTags: (result, error, id) => [{ type: 'Modules', id }],
    }),
    updateModule: builder.mutation<any, { moduleID: string; data: any }>({
      query: ({ moduleID, data }) => ({
        url: `modules/${moduleID}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { moduleID }) => [{ type: 'Modules', id: moduleID }],
    }),
    getSitemaps: builder.query<any, void>({
      query: () => `sitemaps/`,
      providesTags: ['Sitemaps'],
    }),
    getThemes: builder.query<any, string | void>({
      query: (themeID) => `themes/${themeID || ''}`,
      providesTags: (result, error, id) => [{ type: 'Themes', id }],
    }),
    updateTheme: builder.mutation<any, { themeID: string; data: any }>({
      query: ({ themeID, data }) => ({
        url: `themes/${themeID}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { themeID }) => [{ type: 'Themes', id: themeID }],
    }),
    getSettings: builder.query<any, void>({
      query: () => `settings/`,
      providesTags: ['Settings'],
    }),
    updateSettings: builder.mutation<any, { data: any }>({
      query: ({ data }) => ({
        url: `settings/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),
    getUsers: builder.query<any, string | void>({
      query: (userID) => `users/${userID || ''}`,
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),
    updateUser: builder.mutation<any, { userID: string; data: any }>({
      query: ({ userID, data }) => ({
        url: `users/${userID}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { userID }) => [{ type: 'Users', id: userID }],
    }),
    saveContent: builder.mutation<any, any>({
      query: (data) => ({
        url: 'content',
        method: 'POST',
        body: data,
      }),
    }),
    deleteContent: builder.mutation<any, string>({
      query: (contentID) => ({
        url: `content/${contentID}`,
        method: 'DELETE',
      }),
    }),
    deleteContentRevisions: builder.mutation<any, string>({
      query: (contentID) => ({
        url: `content/${contentID}/revisions`,
        method: 'DELETE',
      }),
    }),
    deleteContentRevisionsExtras: builder.mutation<any, string>({
      query: (contentID) => ({
        url: `content/${contentID}/revisions/extras`,
        method: 'DELETE',
      }),
    }),
    deleteContentExtras: builder.mutation<any, string>({
      query: (contentID) => ({
        url: `content/${contentID}/extras`,
        method: 'DELETE',
      }),
    }),
    deleteContentTags: builder.mutation<any, string>({
      query: (contentID) => ({
        url: `content/${contentID}/tags`,
        method: 'DELETE',
      }),
    }),
    saveContentTags: builder.mutation<any, { contentID: string; tag: string }>({
      query: ({ contentID, tag }) => ({
        url: `content/${contentID}/tags`,
        method: 'POST',
        body: { tag },
      }),
    }),
    saveContentRevisions: builder.mutation<any, any>({
      query: (data) => ({
        url: `content/${data.contentID}/revisions`,
        method: 'POST',
        body: data,
      }),
    }),
    saveContentExtras: builder.mutation<any, any>({
      query: (data) => ({
        url: `content/${data.contentID}/extras`,
        method: 'POST',
        body: data,
      }),
    }),
    saveContentRevisionsExtras: builder.mutation<any, any>({
      query: (data) => ({
        url: `content/${data.contentID}/revisions/${data.revisionID}/extras`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetBlocksQuery,
  useUpdateBlockMutation,
  useGetBlocksRequirementsQuery,
  useUpdateBlocksRequirementsMutation,
  useGetCommentsQuery,
  useUpdateCommentMutation,
  useGetContentQuery,
  useUpdateContentMutation,
  useGetContentExtrasQuery,
  useGetContentRevisionsQuery,
  useUpdateContentRevisionsMutation,
  useGetContentRevisionsExtrasQuery,
  useGetContentTagsQuery,
  useGetFilesQuery,
  useUpdateFileMutation,
  useGetFilesTagsQuery,
  useUpdateFilesTagsMutation,
  useGetMenusQuery,
  useUpdateMenuMutation,
  useGetModulesQuery,
  useUpdateModuleMutation,
  useGetSitemapsQuery,
  useGetThemesQuery,
  useUpdateThemeMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useSaveContentMutation,
  useDeleteContentMutation,
  useDeleteContentRevisionsMutation,
  useDeleteContentRevisionsExtrasMutation,
  useDeleteContentExtrasMutation,
  useDeleteContentTagsMutation,
  useSaveContentTagsMutation,
  useSaveContentRevisionsMutation,
  useSaveContentExtrasMutation,
  useSaveContentRevisionsExtrasMutation,
} = restApi;

// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { restApi } from '../services/rest';
import pageReducer from './slices/pageSlice';
import userReducer from './slices/userSlice';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: {
    [restApi.reducerPath]: restApi.reducer,
    page: pageReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(restApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// src/store/slices/pageSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Page } from '../../types/Page';

const initialState: Page = {
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
  misc: {},
  publish: 'N',
  scheduleDate: new Date(),
  tags: [],
};

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<Page>) => {
      return { ...state, ...action.payload };
    },
    updatePageField: <K extends keyof Page>(state: Page, action: PayloadAction<{ key: K; value: Page[K] }>) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    setPageType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
      if (state.url === '/new' || state.url === 'new' || !state.url) {
        state.url = action.payload.toLowerCase().replace(/ /g, '-').replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
      }
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setUrl: (state, action: PayloadAction<string>) => {
      state.url = action.payload;
    },
    setTags: (state, action: PayloadAction<string[]>) => {
      state.tags = action.payload;
    },
    setSuggestions: (state, action: PayloadAction<string[]>) => {
      state.suggestions = action.payload;
    },
    resetPage: () => initialState,
  },
});

export const {
  setPage,
  updatePageField,
  setPageType,
  setTitle,
  setDescription,
  setUrl,
  setTags,
  setSuggestions,
  resetPage,
} = pageSlice.actions;
export default pageSlice.reducer;

// src/store/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/User';

const initialState: User = {
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
    setUser: (state, action: PayloadAction<User>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;

// src/components/PageForm/PageForm.tsx
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  setPage,
  setPageType,
  setTitle,
  setDescription,
  setUrl,
  setTags,
  setSuggestions,
  resetPage,
} from '../../store/slices/pageSlice';
import {
  useGetContentQuery,
  useGetContentTagsQuery,
  useSaveContentMutation,
  useUpdateContentMutation,
  useDeleteContentMutation,
  useSaveContentTagsMutation,
  useDeleteContentTagsMutation,
  useSaveContentRevisionsMutation,
  useDeleteContentRevisionsMutation,
  useSaveContentExtrasMutation,
  useDeleteContentExtrasMutation,
  useSaveContentRevisionsExtrasMutation,
  useDeleteContentRevisionsExtrasMutation,
} from '../../services/rest';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store';

const PageForm: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const page = useAppSelector((state: RootState) => state.page);
  const user = useAppSelector((state: RootState) => state.user);
  const { url: pageUrl } = useParams<{ url: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [autoURL, setAutoURL] = useState(false);
  const [newerVersion, setNewerVersion] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: contentData } = useGetContentQuery(pageUrl || '', { skip: !pageUrl || pageUrl === 'new' });
  const { data: tagSuggestions } = useGetContentTagsQuery(page.tags[page.tags.length - 1] || '', {
    skip: !page.tags.length,
  });
  const [saveContent] = useSaveContentMutation();
  const [updateContent] = useUpdateContentMutation();
  const [deleteContent] = useDeleteContentMutation();
  const [saveContentTags] = useSaveContentTagsMutation();
  const [deleteContentTags] = useDeleteContentTagsMutation();
  const [saveContentRevisions] = useSaveContentRevisionsMutation();
  const [deleteContentRevisions] = useDeleteContentRevisionsMutation();
  const [saveContentExtras] = useSaveContentExtrasMutation();
  const [deleteContentExtras] = useDeleteContentExtrasMutation();
  const [saveContentRevisionsExtras] = useSaveContentRevisionsExtrasMutation();
  const [deleteContentRevisionsExtras] = useDeleteContentRevisionsExtrasMutation();

  useEffect(() => {
    if (contentData) {
      dispatch(setPage({ ...contentData, scheduleDate: new Date(contentData.published_date * 1000) }));
      setAutoURL(false);
    } else if (location.pathname === '/new') {
      dispatch(resetPage());
      dispatch(updatePageField({ key: 'scheduleDate', value: new Date() }));
      setAutoURL(true);
    }
  }, [contentData, location.pathname, dispatch]);

  useEffect(() => {
    if (tagSuggestions) {
      dispatch(setSuggestions(tagSuggestions));
    } else {
      dispatch(setSuggestions([]));
    }
  }, [tagSuggestions, dispatch]);

  useEffect(() => {
    const elements: (keyof typeof page)[] = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
    if (pageUrl && pageUrl !== 'new') {
      elements.forEach((key) => {
        const storedValue = localStorage.getItem(`${pageUrl}${key}`);
        if (storedValue && storedValue !== 'null' && storedValue !== JSON.stringify(page[key])) {
          setNewerVersion(true);
        }
      });
    }
  }, [pageUrl, page]);

  const handleLocalVersion = () => {
    const elements: (keyof typeof page)[] = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
    elements.forEach((key) => {
      const storedValue = localStorage.getItem(`${pageUrl}${key}`);
      if (storedValue && storedValue !== 'null') {
        if (key === 'scheduleDate') {
          dispatch(updatePageField({ key, value: new Date(storedValue) }));
        } else {
          dispatch(updatePageField({ key, value: storedValue as never }));
        }
      }
      localStorage.removeItem(`${pageUrl}${key}`);
    });
    setNewerVersion(false);
  };

  const handleDeleteNewerVersion = () => {
    const elements: (keyof typeof page)[] = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
    elements.forEach((key) => {
      localStorage.removeItem(`${pageUrl}${key}`);
    });
    setNewerVersion(false);
  };

  const handleDeletePage = async () => {
    if (!page.id) return;

    try {
      await deleteContent(page.id.toString()).unwrap();
      await deleteContentRevisions(page.id.toString()).unwrap();
      await deleteContentRevisionsExtras(page.id.toString()).unwrap();
      await deleteContentExtras(page.id.toString()).unwrap();
      await deleteContentTags(page.id.toString()).unwrap();
      navigate('/new');
    } catch (error) {
      console.error('Failed to delete page:', error);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    dispatch(setTitle(newTitle));
    if (autoURL) {
      const newUrl = newTitle.toLowerCase().replace(/ /g, '-').replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
      dispatch(setUrl(newUrl));
    }
  };

  const handleDescriptionChange = (newDescription: string) => {
    dispatch(setDescription(newDescription));
  };

  const handleUrlChange = (newUrl: string) => {
    dispatch(setUrl(newUrl));
    setAutoURL(false);
  };

  const handleSaveLocal = () => {
    const elements: (keyof typeof page)[] = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
    elements.forEach((key) => {
      localStorage.setItem(`${pageUrl}${key}`, JSON.stringify(page[key]));
    });
  };

  const handleAutocompleteTags = (newTags: string[]) => {
    dispatch(setTags(newTags));
  };

  const handleSelectSuggestion = (tag: string) => {
    const newTags = [...page.tags];
    newTags[newTags.length - 1] = tag;
    newTags.push('');
    dispatch(setTags(newTags));
    dispatch(setSuggestions([]));
  };

  const handleSavePage = async (duplicate: boolean) => {
    if (duplicate && page.url === location.pathname) {
      alert(t('page_different_url'));
      return;
    }

    if (!page.type) {
      alert(t('page_no_type_selected'));
      return;
    }

    if (!page.title) {
      dispatch(setTitle(page.header));
    }

    if (!page.url || page.url === 'new') {
      alert(t('page_no_url'));
      return;
    }

    let scheduleDate;
    if (page.publish === 'Y' && page.published === 'Y') {
      scheduleDate = page.published_date;
    } else if (page.publish === 'Y') {
      scheduleDate = Math.round(Date.now() / 1000);
    } else if (page.publish === 'schedule') {
      scheduleDate = Math.round(page.scheduleDate.getTime() / 1000);
      if (page.scheduleDate.getTime() < Date.now()) {
        dispatch(updatePageField({ key: 'publish', value: 'Y' }));
      } else {
        dispatch(updatePageField({ key: 'publish', value: 'N' }));
      }
    }

    const featured = page.extras.featured?.src || null;

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
      author: user.id,
    };

    try {
      if (location.pathname === '/new' || duplicate) {
        const newPage = await saveContent(pageData).unwrap();
        const contentID = newPage.id;

        dispatch(updatePageField({ key: 'id', value: contentID }));
        setAutoURL(false);

        if (page.tags) {
          for (const tag of page.tags) {
            await saveContentTags({ contentID, tag }).unwrap();
          }
        }

        const revision = await saveContentRevisions({ contentID, ...pageData }).unwrap();
        const revisionID = revision.id;

        if (Object.keys(page.extras).length > 0) {
          for (const key in page.extras) {
            const extra = typeof page.extras[key] === 'object' ? JSON.stringify(page.extras[key]) : page.extras[key];
            await saveContentExtras({ contentID, name: key, extra }).unwrap();
            await saveContentRevisionsExtras({ revisionID, contentID, name: key, extra }).unwrap();
          }
        }

        navigate(`/${page.url}`);
      } else {
        await updateContent({ contentID: page.id.toString(), data: pageData }).unwrap();
        await deleteContentTags(page.id.toString()).unwrap();

        const revision = await saveContentRevisions({ contentID: page.id, ...pageData }).unwrap();
        const revisionID = revision.id;

        await deleteContentExtras(page.id.toString()).unwrap();

        if (page.tags) {
          for (const tag of page.tags) {
            await saveContentTags({ contentID: page.id, tag }).unwrap();
          }
        }

        if (Object.keys(page.extras).length > 0) {
          for (const key in page.extras) {
            const extra = typeof page.extras[key] === 'object' ? JSON.stringify(page.extras[key]) : page.extras[key];
            await saveContentExtras({ contentID: page.id, name: key, extra }).unwrap();
            await saveContentRevisionsExtras({ revisionID, contentID: page.id, name: key, extra }).unwrap();
          }
        } else {
          alert(t('page_updated'));
        }
      }
    } catch (error) {
      console.error('Failed to save page:', error);
    }
  };

  return (
    <div>
      {newerVersion && (
        <div className="new-version form-case">
          <p>{t('page_newer')}</p>
          <button className="btn-error" type="button" onClick={handleDeleteNewerVersion}>
            {t('discard')}
          </button>
          <button className="btn-options" type="button" onClick={handleLocalVersion}>
            {t('compare')}
          </button>
          <button className="btn-success" type="button" onClick={handleLocalVersion}>
            {t('use')}
          </button>
        </div>
      )}
      <div className="bar-top">
        <a onClick={() => {}} className="back-button">
          <i className="fa fa-angle-left"></i>
        </a>
        <h1 className="title">{t('page_details')}</h1>
        <a onClick={() => {}} className="sidebar-close">
          <i className="fa fa-times"></i>
        </a>
      </div>
      <div className="bar--actions">
        <button type="button" className="btn-error" onClick={() => setConfirmDelete(true)} disabled={confirmDelete}>
          {t('delete')}
        </button>
        <button type="button" className="btn-options" onClick={() => handleSavePage(true)} disabled={confirmDelete}>
          {t('duplicate')}
        </button>
        <button type="button" className="btn-success" onClick={() => handleSavePage(false)} disabled={confirmDelete}>
          {t('save')}
        </button>

        {confirmDelete && (
          <>
            <p>{t('page_delete')}</p>
            <button type="button" className="btn-error" onClick={handleDeletePage}>
              {t('yes')}
            </button>
            <button type="button" className="btn-success" onClick={() => setConfirmDelete(false)}>
              {t('no')}
            </button>
          </>
        )}
      </div>
      <div className="pg-editor form-case">
        <label className="type" htmlFor="type">
          {t('type')}
        </label>
        <div className="cos-select">
          <select
            value={page.type}
            onChange={(e) => dispatch(setPageType(e.target.value))}
            required
          >
            {page.themePages.map((themePage) => (
              <option key={themePage} value={themePage}>
                {themePage}
              </option>
            ))}
          </select>
        </div>

        <span className="num-count">{page.title.length}</span>
        <label>{t('title')}</label>
        <input type="text" value={page.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="about us, contact us" />

        <span className="num-count">{page.description.length}</span>
        <label htmlFor="description">{t('description')}</label>
        <textarea
          value={page.description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder="Tom's Restaurant is a diner located at 2880 Broadway (on the corner of 112th Street) in the Morningside Heights neighborhood of Manhattan in New York City."
        />

        <label htmlFor="tags">{t('tags')}</label>
        <input
          value={page.tags.join(',')}
          type="text"
          onChange={(e) => handleAutocompleteTags(e.target.value.split(','))}
          placeholder="about, restaurant, food, nyc"
        />
        <div className="tag-suggestions" style={{ display: page.suggestions?.length ? 'block' : 'none' }}>
          {page.suggestions?.slice(0, 10).map((tag) => (
            <a key={tag} onClick={() => handleSelectSuggestion(tag)}>
              {tag}
            </a>
          ))}
        </div>

        <label htmlFor="url">{t('url')}</label>
        <input type="text" value={page.url} onChange={(e) => handleUrlChange(e.target.value)} />

        <input
          type="radio"
          name="publish"
          id="Y"
          value="Y"
          checked={page.publish === 'Y'}
          onChange={() => dispatch(updatePageField({ key: 'publish', value: 'Y' }))}
        />
        <label htmlFor="Y" onClick={() => dispatch(updatePageField({ key: 'publish', value: 'Y' }))}>
          {t('publish')}
        </label>
        <input
          type="radio"
          name="publish"
          id="N"
          value="N"
          checked={page.publish === 'N'}
          onChange={() => dispatch(updatePageField({ key: 'publish', value: 'N' }))}
        />
        <label htmlFor="N" onClick={() => dispatch(updatePageField({ key: 'publish', value: 'N' }))}>
          {t('draft')}
        </label>
        <input
          type="radio"
          name="publish"
          id="schedule"
          value="schedule"
          checked={page.publish === 'schedule'}
          onChange={() => dispatch(updatePageField({ key: 'publish', value: 'schedule' }))}
        />
        <label htmlFor="schedule" onClick={() => dispatch(updatePageField({ key: 'publish', value: 'schedule' }))}>
          {t('schedule')}
        </label>
        <div className="schedule-triangle" style={{ display: page.publish === 'schedule' ? 'block' : 'none' }}></div>
        <input
          type="datetime-local"
          className="schedule radio-inline"
          value={page.scheduleDate.toISOString().slice(0, 16)}
          onChange={(e) => dispatch(updatePageField({ key: 'scheduleDate', value: new Date(e.target.value) }))}
          style={{ display: page.publish === 'schedule' ? 'block' : 'none' }}
        />
      </div>
    </div>
  );
};

export default PageForm;
```

### Tokens: {'input_tokens': 6338, 'output_tokens': 8024}
### Execution time: 186.73862719535828
