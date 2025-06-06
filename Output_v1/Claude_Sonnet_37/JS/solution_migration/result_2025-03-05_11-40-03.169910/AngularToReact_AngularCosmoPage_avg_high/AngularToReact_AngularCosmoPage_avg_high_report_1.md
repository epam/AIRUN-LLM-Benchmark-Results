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
# React 18.x Migration

## Types

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
  published: string;
  published_date: string;
  themePages: string[];
  timestamp: string;
  extras: Record<string, any>;
  misc: Record<string, any>;
  tags: string[];
  publish: string;
  scheduleDate: Date | null;
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

## API Service

```typescript
// api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const contentAPI = {
  getContent: (contentID: number) => api.get(`api/content/${contentID}`),
  createContent: (content: any) => api.post('api/content', content),
  updateContent: (contentID: number, content: any) => api.put(`api/content/${contentID}`, content),
  deleteContent: (contentID: number) => api.delete(`api/content/${contentID}`),
  
  getRevisions: (contentID: number) => api.get(`api/content/${contentID}/revisions`),
  getRevision: (contentID: number, revisionID: number) => api.get(`api/content/${contentID}/revisions/${revisionID}`),
  createRevision: (contentID: number, revision: any) => api.post(`api/content/${contentID}/revisions`, revision),
  updateRevision: (contentID: number, revisionID: number, revision: any) => 
    api.put(`api/content/${contentID}/revisions/${revisionID}`, revision),
  deleteRevision: (contentID: number, revisionID: number) => 
    api.delete(`api/content/${contentID}/revisions/${revisionID}`),
  
  getExtras: (contentID: number) => api.get(`api/content/${contentID}/extras`),
  createExtra: (contentID: number, extra: any) => api.post(`api/content/${contentID}/extras`, extra),
  deleteExtras: (contentID: number) => api.delete(`api/content/${contentID}/extras`),
  
  getRevisionExtras: (contentID: number, revisionID: number) => 
    api.get(`api/content/${contentID}/revisions/${revisionID}/extras`),
  createRevisionExtra: (contentID: number, revisionID: number, extra: any) => 
    api.post(`api/content/${contentID}/revisions/${revisionID}/extras`, extra),
  deleteRevisionExtras: (contentID: number, revisionID: number) => 
    api.delete(`api/content/${contentID}/revisions/${revisionID}/extras`),
  
  getTags: (contentID: number) => api.get(`api/content/${contentID}/tags`),
  createTag: (contentID: number, tag: string) => api.post(`api/content/${contentID}/tags`, { tag }),
  deleteTags: (contentID: number) => api.delete(`api/content/${contentID}/tags`),
  
  searchTags: (tag: string) => api.get(`api/content/tags?tag=${tag}`),
};

export default api;
```

## Redux Store

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import pageReducer from './pageSlice';
import userReducer from './userSlice';
import notificationReducer from './notificationSlice';

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

## Page Slice

```typescript
// store/pageSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { contentAPI } from '../api';
import { Page } from '../types';

interface PageState {
  page: Page;
  newerVersion: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: PageState = {
  page: {
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
    tags: [],
    publish: '',
    scheduleDate: new Date(),
  },
  newerVersion: false,
  loading: false,
  error: null,
};

export const fetchPage = createAsyncThunk(
  'page/fetchPage',
  async (contentID: number, { rejectWithValue }) => {
    try {
      const response = await contentAPI.getContent(contentID);
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
      if (page.id === 0 || duplicate) {
        const response = await contentAPI.createContent(page);
        
        // Save tags
        if (page.tags && page.tags.length > 0) {
          for (const tag of page.tags) {
            await contentAPI.createTag(response.data.id, tag);
          }
        }
        
        // Save revision
        const revisionResponse = await contentAPI.createRevision(response.data.id, page);
        
        // Save extras
        if (Object.keys(page.extras).length > 0) {
          for (const [key, value] of Object.entries(page.extras)) {
            const extraValue = typeof value === 'object' ? JSON.stringify(value) : value;
            await contentAPI.createExtra(response.data.id, { name: key, extra: extraValue });
            await contentAPI.createRevisionExtra(response.data.id, revisionResponse.data.id, { name: key, extra: extraValue });
          }
        }
        
        return response.data;
      } else {
        // Update existing page
        const response = await contentAPI.updateContent(page.id, page);
        
        // Delete old tags and add new ones
        await contentAPI.deleteTags(page.id);
        if (page.tags && page.tags.length > 0) {
          for (const tag of page.tags) {
            await contentAPI.createTag(page.id, tag);
          }
        }
        
        // Save revision
        const revisionResponse = await contentAPI.createRevision(page.id, page);
        
        // Delete old extras and add new ones
        await contentAPI.deleteExtras(page.id);
        if (Object.keys(page.extras).length > 0) {
          for (const [key, value] of Object.entries(page.extras)) {
            const extraValue = typeof value === 'object' ? JSON.stringify(value) : value;
            await contentAPI.createExtra(page.id, { name: key, extra: extraValue });
            await contentAPI.createRevisionExtra(page.id, revisionResponse.data.id, { name: key, extra: extraValue });
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
  async (contentID: number, { rejectWithValue }) => {
    try {
      await contentAPI.deleteContent(contentID);
      await contentAPI.deleteRevision(contentID, 0); // Delete all revisions
      await contentAPI.deleteRevisionExtras(contentID, 0); // Delete all revision extras
      await contentAPI.deleteExtras(contentID); // Delete all extras
      await contentAPI.deleteTags(contentID); // Delete all tags
      return contentID;
    } catch (error) {
      return rejectWithValue('Failed to delete page');
    }
  }
);

export const searchTags = createAsyncThunk(
  'page/searchTags',
  async (tag: string, { rejectWithValue }) => {
    try {
      const response = await contentAPI.searchTags(tag);
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
    setPage: (state, action: PayloadAction<Page>) => {
      state.page = action.payload;
    },
    updateTitle: (state, action: PayloadAction<string>) => {
      state.page.title = action.payload;
      
      // Auto-generate URL if it's a new page
      if (state.page.url === '/new' || state.page.url === 'new' || !state.page.url) {
        state.page.url = action.payload
          .toLowerCase()
          .replace(/ /g, '-')
          .replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
      }
    },
    updateDescription: (state, action: PayloadAction<string>) => {
      state.page.description = action.payload;
    },
    updateUrl: (state, action: PayloadAction<string>) => {
      state.page.url = action.payload;
    },
    updateType: (state, action: PayloadAction<string>) => {
      state.page.type = action.payload;
    },
    updatePublish: (state, action: PayloadAction<string>) => {
      state.page.publish = action.payload;
    },
    updateScheduleDate: (state, action: PayloadAction<Date>) => {
      state.page.scheduleDate = action.payload;
    },
    updateTags: (state, action: PayloadAction<string[]>) => {
      state.page.tags = action.payload;
    },
    setNewerVersion: (state, action: PayloadAction<boolean>) => {
      state.newerVersion = action.payload;
    },
    resetPage: (state) => {
      state.page = initialState.page;
    },
    saveLocalVersion: (state) => {
      const { page } = state;
      const currentUrl = window.location.pathname.substring(1);
      
      localStorage.setItem(`${currentUrl}title`, page.title);
      localStorage.setItem(`${currentUrl}description`, page.description);
      localStorage.setItem(`${currentUrl}url`, page.url);
      localStorage.setItem(`${currentUrl}publish`, page.publish);
      localStorage.setItem(`${currentUrl}scheduleDate`, page.scheduleDate?.toString() || '');
      localStorage.setItem(`${currentUrl}type`, page.type);
    },
    loadLocalVersion: (state) => {
      const currentUrl = window.location.pathname.substring(1);
      
      state.page.title = localStorage.getItem(`${currentUrl}title`) || state.page.title;
      state.page.description = localStorage.getItem(`${currentUrl}description`) || state.page.description;
      state.page.url = localStorage.getItem(`${currentUrl}url`) || state.page.url;
      state.page.publish = localStorage.getItem(`${currentUrl}publish`) || state.page.publish;
      
      const savedDate = localStorage.getItem(`${currentUrl}scheduleDate`);
      if (savedDate) {
        state.page.scheduleDate = new Date(savedDate);
      }
      
      state.page.type = localStorage.getItem(`${currentUrl}type`) || state.page.type;
      state.newerVersion = false;
    },
    deleteLocalVersion: (state) => {
      const currentUrl = window.location.pathname.substring(1);
      
      localStorage.removeItem(`${currentUrl}title`);
      localStorage.removeItem(`${currentUrl}description`);
      localStorage.removeItem(`${currentUrl}url`);
      localStorage.removeItem(`${currentUrl}publish`);
      localStorage.removeItem(`${currentUrl}scheduleDate`);
      localStorage.removeItem(`${currentUrl}type`);
      
      state.newerVersion = false;
    },
    checkLocalVersion: (state) => {
      const currentUrl = window.location.pathname.substring(1);
      
      if (currentUrl === 'new') return;
      
      const elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
      
      for (const element of elements) {
        const localValue = localStorage.getItem(`${currentUrl}${element}`);
        if (localValue && localValue !== 'null' && localValue !== state.page[element as keyof Page]?.toString()) {
          state.newerVersion = true;
          break;
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPage.fulfilled, (state, action) => {
        state.loading = false;
        state.page = action.payload;
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
        state.page.id = action.payload.id;
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
        state.page = initialState.page;
      })
      .addCase(deletePage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setPage,
  updateTitle,
  updateDescription,
  updateUrl,
  updateType,
  updatePublish,
  updateScheduleDate,
  updateTags,
  setNewerVersion,
  resetPage,
  saveLocalVersion,
  loadLocalVersion,
  deleteLocalVersion,
  checkLocalVersion,
} = pageSlice.actions;

export default pageSlice.reducer;
```

## User Slice

```typescript
// store/userSlice.ts
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
    clearUser: () => initialState
  }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
```

## Notification Slice

```typescript
// store/notificationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationPayload } from '../types';

interface NotificationState {
  message: string;
  classes: string;
  visible: boolean;
}

const initialState: NotificationState = {
  message: '',
  classes: '',
  visible: false
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification: (state, action: PayloadAction<NotificationPayload>) => {
      state.message = action.payload.message;
      state.classes = action.payload.classes || '';
      state.visible = true;
    },
    hideNotification: (state) => {
      state.visible = false;
    }
  }
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
```

## Hooks

```typescript
// hooks/useAppDispatch.ts
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
```

```typescript
// hooks/useAppSelector.ts
import { useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '../store';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## Components

```typescript
// components/PageEditor.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import {
  updateTitle,
  updateDescription,
  updateUrl,
  updateType,
  updatePublish,
  updateScheduleDate,
  updateTags,
  savePage,
  deletePage,
  fetchPage,
  checkLocalVersion,
  loadLocalVersion,
  deleteLocalVersion,
  searchTags
} from '../store/pageSlice';
import { showNotification } from '../store/notificationSlice';
import NewerVersionAlert from './NewerVersionAlert';
import PageTypeSelector from './PageTypeSelector';
import TagInput from './TagInput';

const PageEditor: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { url } = useParams<{ url: string }>();
  
  const { page, newerVersion, loading } = useAppSelector(state => state.page);
  const user = useAppSelector(state => state.user);
  
  const [confirm, setConfirm] = useState(false);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [autoURL, setAutoURL] = useState(false);
  
  useEffect(() => {
    if (url && url !== 'new') {
      // Fetch page data
      dispatch(fetchPage(parseInt(url)));
      
      // Check for local version
      dispatch(checkLocalVersion());
    } else {
      // Set default schedule date for new pages
      dispatch(updateScheduleDate(new Date()));
      setAutoURL(true);
    }
  }, [dispatch, url]);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    dispatch(updateTitle(title));
    
    if (autoURL) {
      const generatedUrl = title
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
      dispatch(updateUrl(generatedUrl));
    }
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(updateDescription(e.target.value));
  };
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutoURL(false);
    dispatch(updateUrl(e.target.value));
  };
  
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateType(e.target.value));
  };
  
  const handlePublishChange = (value: string) => {
    dispatch(updatePublish(value));
  };
  
  const handleScheduleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateScheduleDate(new Date(e.target.value)));
  };
  
  const handleTagsChange = (tags: string[]) => {
    dispatch(updateTags(tags));
    
    // Get suggestions for the last tag
    if (tags.length > 0) {
      const lastTag = tags[tags.length - 1];
      if (lastTag) {
        dispatch(searchTags(lastTag))
          .unwrap()
          .then(data => setTagSuggestions(data))
          .catch(() => setTagSuggestions([]));
      } else {
        setTagSuggestions([]);
      }
    } else {
      setTagSuggestions([]);
    }
  };
  
  const handleSelectSuggestion = (tag: string) => {
    const newTags = [...page.tags];
    newTags[newTags.length - 1] = tag;
    newTags.push('');
    dispatch(updateTags(newTags));
    setTagSuggestions([]);
  };
  
  const handleSavePage = (duplicate = false) => {
    // Validation
    if (duplicate && page.url === window.location.pathname.substring(1)) {
      dispatch(showNotification({
        message: t('page_different_url'),
        classes: 'alert-error'
      }));
      return;
    }
    
    if (!page.type) {
      dispatch(showNotification({
        message: t('page_no_type_selected'),
        classes: 'alert-error'
      }));
      return;
    }
    
    if (page.url.length === 0 || page.url === 'new') {
      dispatch(showNotification({
        message: t('page_no_url'),
        classes: 'alert-error'
      }));
      return;
    }
    
    // Prepare schedule date
    let scheduleDate = page.scheduleDate;
    if (page.publish === 'Y' && page.id === 0) {
      scheduleDate = new Date();
    } else if (page.publish === 'schedule') {
      if (page.scheduleDate && page.scheduleDate.getTime() < Date.now()) {
        dispatch(updatePublish('Y'));
      } else {
        dispatch(updatePublish('N'));
      }
    }
    
    // Save the page
    dispatch(savePage({ 
      page: {
        ...page,
        scheduleDate,
        author: user.id
      }, 
      duplicate 
    }))
      .unwrap()
      .then(() => {
        dispatch(showNotification({ message: duplicate ? t('page_created') : t('saved') }));
        navigate(`/${page.url}`);
      })
      .catch((error) => {
        dispatch(showNotification({
          message: error || t('page_error_saving'),
          classes: 'alert-error'
        }));
      });
  };
  
  const handleDeletePage = () => {
    if (page.id) {
      dispatch(deletePage(page.id))
        .unwrap()
        .then(() => {
          dispatch(showNotification({ message: t('deleted') }));
          navigate('/new');
        })
        .catch((error) => {
          dispatch(showNotification({
            message: error || t('error_deleting'),
            classes: 'alert-error'
          }));
        });
    }
  };
  
  if (loading && !page.id) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      {newerVersion && (
        <NewerVersionAlert
          onUse={() => dispatch(loadLocalVersion())}
          onCompare={() => dispatch(loadLocalVersion())}
          onDiscard={() => dispatch(deleteLocalVersion())}
        />
      )}
      
      <div className="bar-top">
        <a href="#" onClick={() => navigate(-1)}><i className="fa fa-angle-left"></i></a>
        <h1 className="title">{t('page_details')}</h1>
        <a className="sidebar-close" href="#" onClick={() => navigate('/')}><i className="fa fa-times"></i></a>
      </div>
      
      <div className="bar--actions">
        {!confirm ? (
          <>
            <button type="button" className="btn-error" onClick={() => setConfirm(true)}>{t('delete')}</button>
            <button type="button" className="btn-options" onClick={() => handleSavePage(true)}>{t('duplicate')}</button>
            <button type="button" className="btn-success" onClick={() => handleSavePage()}>{t('save')}</button>
          </>
        ) : (
          <>
            <p>{t('page_delete')}</p>
            <button type="button" className="btn-error" onClick={handleDeletePage}>{t('yes')}</button>
            <button type="button" className="btn-success" onClick={() => setConfirm(false)}>{t('no')}</button>
          </>
        )}
      </div>
      
      <div className="pg-editor form-case">
        <label className="type" htmlFor="type">{t('type')}</label>
        <div className="cos-select">
          <PageTypeSelector
            value={page.type}
            options={page.themePages}
            onChange={handleTypeChange}
          />
        </div>
        
        <span className="num-count">{page.title.length}</span>
        <label>{t('title')}</label>
        <input
          type="text"
          value={page.title}
          onChange={handleTitleChange}
          placeholder="about us, contact us"
        />
        
        <span className="num-count">{page.description.length}</span>
        <label htmlFor="description">{t('description')}</label>
        <textarea
          id="description"
          value={page.description}
          onChange={handleDescriptionChange}
          placeholder="Tom's Restaurant is a diner located at 2880 Broadway (on the corner of 112th Street) in the Morningside Heights neighborhood of Manhattan in New York City."
        />
        
        <label htmlFor="tags">{t('tags')}</label>
        <TagInput
          tags={page.tags || []}
          onChange={handleTagsChange}
          placeholder="about, restaurant, food, nyc"
          suggestions={tagSuggestions}
          onSelectSuggestion={handleSelectSuggestion}
        />
        
        <label htmlFor="url">{t('url')}</label>
        <input
          id="url"
          type="text"
          value={page.url}
          onChange={handleUrlChange}
        />
        
        <div className="publish-options">
          <div>
            <input
              type="radio"
              id="publish-yes"
              name="publish"
              checked={page.publish === 'Y'}
              onChange={() => handlePublishChange('Y')}
            />
            <label htmlFor="publish-yes" onClick={() => handlePublishChange('Y')}>{t('publish')}</label>
          </div>
          
          <div>
            <input
              type="radio"
              id="publish-no"
              name="publish"
              checked={page.publish === 'N'}
              onChange={() => handlePublishChange('N')}
            />
            <label htmlFor="publish-no" onClick={() => handlePublishChange('N')}>{t('draft')}</label>
          </div>
          
          <div>
            <input
              type="radio"
              id="publish-schedule"
              name="publish"
              checked={page.publish === 'schedule'}
              onChange={() => handlePublishChange('schedule')}
            />
            <label htmlFor="publish-schedule" onClick={() => handlePublishChange('schedule')}>{t('schedule')}</label>
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

```typescript
// components/NewerVersionAlert.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

interface NewerVersionAlertProps {
  onUse: () => void;
  onCompare: () => void;
  onDiscard: () => void;
}

const NewerVersionAlert: React.FC<NewerVersionAlertProps> = ({ onUse, onCompare, onDiscard }) => {
  const { t } = useTranslation();
  
  return (
    <div className="new-version form-case">
      <p>{t('page_newer')}</p>
      <button className="btn-error" type="button" onClick={onDiscard}>{t('discard')}</button>
      <button className="btn-options" type="button" onClick={onCompare}>{t('compare')}</button>
      <button className="btn-success" type="button" onClick={onUse}>{t('use')}</button>
    </div>
  );
};

export default NewerVersionAlert;
```

```typescript
// components/PageTypeSelector.tsx
import React from 'react';

interface PageTypeSelectorProps {
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const PageTypeSelector: React.FC<PageTypeSelectorProps> = ({ value, options, onChange }) => {
  return (
    <select value={value} onChange={onChange} required>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option.replace(/\.[^/.]+$/, '')} {/* Remove file extension */}
        </option>
      ))}
    </select>
  );
};

export default PageTypeSelector;
```

```typescript
// components/TagInput.tsx
import React, { useState } from 'react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  onSelectSuggestion?: (tag: string) => void;
}

const TagInput: React.FC<TagInputProps> = ({ 
  tags, 
  onChange, 
  placeholder, 
  suggestions = [], 
  onSelectSuggestion 
}) => {
  const [inputValue, setInputValue] = useState('');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value.includes(',')) {
      // Add new tag when comma is typed
      const newTag = value.replace(',', '').trim();
      if (newTag) {
        const newTags = [...tags, newTag];
        onChange(newTags);
        setInputValue('');
      }
    } else {
      setInputValue(value);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      const newT

### Tokens: {'input_tokens': 6767, 'output_tokens': 8192}
### Execution time: 94.25644493103027
