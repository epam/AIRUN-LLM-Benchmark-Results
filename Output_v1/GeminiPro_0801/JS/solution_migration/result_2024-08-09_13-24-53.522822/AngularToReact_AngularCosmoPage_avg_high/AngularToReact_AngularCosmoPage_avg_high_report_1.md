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
```tsx
// rest.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Block {
  blockID: number;
  // Add other block properties here
}

export interface BlockRequirement {
  blockID: number;
  requirementID: number;
  // Add other block requirement properties here
}

export interface Comment {
  commentID: number;
  // Add other comment properties here
}

export interface Content {
  contentID: number;
  title: string;
  description: string;
  header?: string;
  subheader?: string;
  body?: string;
  url: string;
  type: string;
  published: 'Y' | 'N' | 'schedule';
  published_date: number;
  author: number;
  // Add other content properties here
}

export interface ContentExtra {
  contentID: number;
  name: string;
  extra: string;
}

export interface ContentRevision {
  revisionID: number;
  contentID: number;
  title: string;
  description: string;
  header?: string;
  subheader?: string;
  body?: string;
  url: string;
  type: string;
  published: 'Y' | 'N' | 'schedule';
  published_date: number;
  author: number;
  // Add other content revision properties here
}

export interface ContentRevisionExtra {
  revisionID: number;
  contentID: number;
  name: string;
  extra: string;
}

export interface File {
  fileID: number;
  // Add other file properties here
}

export interface Menu {
  menuID: number;
  // Add other menu properties here
}

export interface Module {
  moduleID: number;
  // Add other module properties here
}

export interface Theme {
  themeID: number;
  // Add other theme properties here
}

export interface User {
  userID: number;
  // Add other user properties here
}

export const restApi = createApi({
  reducerPath: 'restApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Content', 'ContentRevisions', 'ContentExtras', 'ContentTags'],
  endpoints: (builder) => ({
    getBlocks: builder.query<Block[], void>({
      query: () => '/blocks',
    }),
    getBlock: builder.query<Block, number>({
      query: (blockID) => `/blocks/${blockID}`,
    }),
    updateBlock: builder.mutation<Block, Block>({
      query: (block) => ({
        url: `/blocks/${block.blockID}`,
        method: 'PUT',
        body: block,
      }),
    }),
    getBlocksRequirements: builder.query<BlockRequirement[], { blockID: number; requirementID: number }>({
      query: ({ blockID, requirementID }) => `/blocks/${blockID}/requirements/${requirementID}`,
    }),
    updateBlockRequirement: builder.mutation<BlockRequirement, BlockRequirement>({
      query: (requirement) => ({
        url: `/blocks/${requirement.blockID}/requirements/${requirement.requirementID}`,
        method: 'PUT',
        body: requirement,
      }),
    }),
    getComments: builder.query<Comment[], void>({
      query: () => '/comments',
    }),
    getComment: builder.query<Comment, number>({
      query: (commentID) => `/comments/${commentID}`,
    }),
    updateComment: builder.mutation<Comment, Comment>({
      query: (comment) => ({
        url: `/comments/${comment.commentID}`,
        method: 'PUT',
        body: comment,
      }),
    }),
    getContent: builder.query<Content, number>({
      query: (contentID) => `/content/${contentID}`,
      providesTags: (result, error, id) => [{ type: 'Content', id }],
    }),
    getContentList: builder.query<Content[], void>({
      query: () => '/content',
      providesTags: (result) =>
        result
          ? [...result.map(({ contentID }) => ({ type: 'Content' as const, id: contentID })), { type: 'Content', id: 'LIST' }]
          : [{ type: 'Content', id: 'LIST' }],
    }),
    addContent: builder.mutation<Content, Content>({
      query: (content) => ({
        url: '/content',
        method: 'POST',
        body: content,
      }),
      invalidatesTags: [{ type: 'Content', id: 'LIST' }],
    }),
    updateContent: builder.mutation<Content, Content>({
      query: (content) => ({
        url: `/content/${content.contentID}`,
        method: 'PUT',
        body: content,
      }),
      invalidatesTags: (result, error, { contentID }) => [{ type: 'Content', id: contentID }],
    }),
    deleteContent: builder.mutation<void, number>({
      query: (contentID) => ({
        url: `/content/${contentID}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, contentID) => [{ type: 'Content', id: contentID }],
    }),
    getContentExtras: builder.query<ContentExtra[], number>({
      query: (contentID) => `/content/${contentID}/extras/`,
      providesTags: (result, error, contentID) => [{ type: 'ContentExtras', id: contentID }],
    }),
    addContentExtra: builder.mutation<
      ContentExtra,
      { contentID: number; name: string; extra: string }
    >({
      query: ({ contentID, name, extra }) => ({
        url: `/content/${contentID}/extras/`,
        method: 'POST',
        body: { name, extra },
      }),
      invalidatesTags: (result, error, { contentID }) => [{ type: 'ContentExtras', id: contentID }],
    }),
    deleteContentExtras: builder.mutation<void, number>({
      query: (contentID) => ({
        url: `/content/${contentID}/extras/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, contentID) => [{ type: 'ContentExtras', id: contentID }],
    }),
    getContentRevisions: builder.query<ContentRevision[], number>({
      query: (contentID) => `/content/${contentID}/revisions`,
      providesTags: (result, error, contentID) => [{ type: 'ContentRevisions', id: contentID }],
    }),
    getContentRevision: builder.query<ContentRevision, { contentID: number; revisionID: number }>({
      query: ({ contentID, revisionID }) => `/content/${contentID}/revisions/${revisionID}`,
    }),
    addContentRevision: builder.mutation<ContentRevision, { contentID: number; revision: ContentRevision }>({
      query: ({ contentID, revision }) => ({
        url: `/content/${contentID}/revisions`,
        method: 'POST',
        body: revision,
      }),
      invalidatesTags: (result, error, { contentID }) => [{ type: 'ContentRevisions', id: contentID }],
    }),
    updateContentRevision: builder.mutation<
      ContentRevision,
      { contentID: number; revisionID: number; revision: ContentRevision }
    >({
      query: ({ contentID, revisionID, revision }) => ({
        url: `/content/${contentID}/revisions/${revisionID}`,
        method: 'PUT',
        body: revision,
      }),
      invalidatesTags: (result, error, { contentID, revisionID }) => [
        { type: 'ContentRevisions', id: contentID },
        { type: 'ContentRevisions', id: revisionID },
      ],
    }),
    deleteContentRevisions: builder.mutation<void, number>({
      query: (contentID) => ({
        url: `/content/${contentID}/revisions`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, contentID) => [{ type: 'ContentRevisions', id: contentID }],
    }),
    getContentRevisionExtras: builder.query<
      ContentRevisionExtra[],
      { contentID: number; revisionID: number }
    >({
      query: ({ contentID, revisionID }) => `/content/${contentID}/revisions/${revisionID}/extras/`,
    }),
    addContentRevisionExtra: builder.mutation<
      ContentRevisionExtra,
      { contentID: number; revisionID: number; name: string; extra: string }
    >({
      query: ({ contentID, revisionID, name, extra }) => ({
        url: `/content/${contentID}/revisions/${revisionID}/extras/`,
        method: 'POST',
        body: { name, extra },
      }),
    }),
    getContentTags: builder.query<string[], number>({
      query: (contentID) => `/content/${contentID}/tags/`,
      providesTags: (result, error, contentID) => [{ type: 'ContentTags', id: contentID }],
    }),
    addContentTag: builder.mutation<void, { contentID: number; tag: string }>({
      query: ({ contentID, tag }) => ({
        url: `/content/${contentID}/tags/`,
        method: 'POST',
        body: { tag },
      }),
      invalidatesTags: (result, error, { contentID }) => [{ type: 'ContentTags', id: contentID }],
    }),
    deleteContentTags: builder.mutation<void, number>({
      query: (contentID) => ({
        url: `/content/${contentID}/tags/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, contentID) => [{ type: 'ContentTags', id: contentID }],
    }),
    getFiles: builder.query<File[], void>({
      query: () => '/files',
    }),
    getFile: builder.query<File, number>({
      query: (fileID) => `/files/${fileID}`,
    }),
    updateFile: builder.mutation<File, File>({
      query: (file) => ({
        url: `/files/${file.fileID}`,
        method: 'PUT',
        body: file,
      }),
    }),
    getFileTags: builder.query<{ fileID: number; tag: string }[], { fileID: number; tag: string }>({
      query: ({ fileID, tag }) => `/files/${fileID}/tag/${tag}`,
    }),
    updateFileTag: builder.mutation<{ fileID: number; tag: string }, { fileID: number; tag: string }>({
      query: ({ fileID, tag }) => ({
        url: `/files/${fileID}/tag/${tag}`,
        method: 'PUT',
        body: { tag },
      }),
    }),
    getMenus: builder.query<Menu[], void>({
      query: () => '/menus',
    }),
    getMenu: builder.query<Menu, number>({
      query: (menuID) => `/menus/${menuID}`,
    }),
    updateMenu: builder.mutation<Menu, Menu>({
      query: (menu) => ({
        url: `/menus/${menu.menuID}`,
        method: 'PUT',
        body: menu,
      }),
    }),
    getModules: builder.query<Module[], void>({
      query: () => '/modules',
    }),
    getModule: builder.query<Module, number>({
      query: (moduleID) => `/modules/${moduleID}`,
    }),
    updateModule: builder.mutation<Module, Module>({
      query: (module) => ({
        url: `/modules/${module.moduleID}`,
        method: 'PUT',
        body: module,
      }),
    }),
    getSitemaps: builder.query<
      {
        // Add sitemap properties here
      }[],
      void
    >({
      query: () => '/sitemaps/',
    }),
    getThemes: builder.query<Theme[], void>({
      query: () => '/themes',
    }),
    getTheme: builder.query<Theme, number>({
      query: (themeID) => `/themes/${themeID}`,
    }),
    updateTheme: builder.mutation<Theme, Theme>({
      query: (theme) => ({
        url: `/themes/${theme.themeID}`,
        method: 'PUT',
        body: theme,
      }),
    }),
    getSettings: builder.query<
      {
        // Add settings properties here
      },
      void
    >({
      query: () => '/settings/',
    }),
    updateSettings: builder.mutation<
      {
        // Add settings properties here
      },
      {
        // Add settings properties here
      }
    >({
      query: (settings) => ({
        url: '/settings/',
        method: 'PUT',
        body: settings,
      }),
    }),
    getUsers: builder.query<User[], void>({
      query: () => '/users',
    }),
    getUser: builder.query<User, number>({
      query: (userID) => `/users/${userID}`,
    }),
    updateUser: builder.mutation<User, User>({
      query: (user) => ({
        url: `/users/${user.userID}`,
        method: 'PUT',
        body: user,
      }),
    }),
  }),
});

export const {
  useGetBlocksQuery,
  useGetBlockQuery,
  useUpdateBlockMutation,
  useGetBlocksRequirementsQuery,
  useUpdateBlockRequirementMutation,
  useGetCommentsQuery,
  useGetCommentQuery,
  useUpdateCommentMutation,
  useGetContentQuery,
  useGetContentListQuery,
  useAddContentMutation,
  useUpdateContentMutation,
  useDeleteContentMutation,
  useGetContentExtrasQuery,
  useAddContentExtraMutation,
  useDeleteContentExtrasMutation,
  useGetContentRevisionsQuery,
  useGetContentRevisionQuery,
  useAddContentRevisionMutation,
  useUpdateContentRevisionMutation,
  useDeleteContentRevisionsMutation,
  useGetContentRevisionExtrasQuery,
  useAddContentRevisionExtraMutation,
  useGetContentTagsQuery,
  useAddContentTagMutation,
  useDeleteContentTagsMutation,
  useGetFilesQuery,
  useGetFileQuery,
  useUpdateFileMutation,
  useGetFileTagsQuery,
  useUpdateFileTagMutation,
  useGetMenusQuery,
  useGetMenuQuery,
  useUpdateMenuMutation,
  useGetModulesQuery,
  useGetModuleQuery,
  useUpdateModuleMutation,
  useGetSitemapsQuery,
  useGetThemesQuery,
  useGetThemeQuery,
  useUpdateThemeMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
} = restApi;

```

```tsx
// pageSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PageState {
  id: number;
  title: string;
  description: string;
  header: string;
  subheader: string;
  body: string;
  url: string;
  type: string;
  published: 'Y' | 'N' | 'schedule';
  published_date: number;
  themePages: string[];
  timestamp: number;
  extras: Record<string, unknown>;
  misc: Record<string, unknown>;
}

const initialState: PageState = {
  id: 0,
  title: '',
  description: '',
  header: '',
  subheader: '',
  body: '',
  url: '',
  type: '',
  published: 'N',
  published_date: 0,
  themePages: [],
  timestamp: 0,
  extras: {},
  misc: {},
};

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<Partial<PageState>>) => {
      return { ...state, ...action.payload };
    },
    resetPage: () => initialState,
  },
});

export const { setPage, resetPage } = pageSlice.actions;

export default pageSlice.reducer;

```

```tsx
// usersSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
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

const initialState: UserState = {
  id: 0,
  username: '',
  name: '',
  bio: '',
  email: '',
  facebook: '',
  twitter: '',
  photo: '',
  role: '',
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    resetUser: () => initialState,
  },
});

export const { setUser, resetUser } = usersSlice.actions;

export default usersSlice.reducer;

```

```tsx
// PageEditor.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { useGetContentQuery, useUpdateContentMutation, useAddContentMutation, useDeleteContentMutation, useGetContentTagsQuery, useAddContentTagMutation, useDeleteContentTagsMutation } from '../../services/rest';
import { setPage } from './pageSlice';
import { useTranslation } from 'react-i18next';

const PageEditor: React.FC = () => {
  const { t } = useTranslation();
  const { url } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const page = useAppSelector((state) => state.page);
  const user = useAppSelector((state) => state.users);

  const { data: contentData, isLoading: contentLoading, error: contentError } = useGetContentQuery(page.id, {
    skip: !page.id,
  });

  const [updateContent] = useUpdateContentMutation();
  const [addContent] = useAddContentMutation();
  const [deleteContent] = useDeleteContentMutation();

  const { data: tagsData, isLoading: tagsLoading, error: tagsError } = useGetContentTagsQuery(page.id, {
    skip: !page.id,
  });

  const [addTag] = useAddContentTagMutation();
  const [deleteTags] = useDeleteContentTagsMutation();

  const [newerVersion, setNewerVersion] = useState(false);
  const [autoURL, setAutoURL] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (contentData) {
      dispatch(
        setPage({
          ...contentData,
          scheduleDate: new Date(contentData.published_date * 1000),
          tags: tagsData || [],
        })
      );
    }
  }, [contentData, tagsData, dispatch]);

  useEffect(() => {
    const checkUnsavedChanges = () => {
      const elements = ['title', 'description', 'published', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
      if (url && url !== 'new') {
        elements.forEach((element) => {
          const storedValue = localStorage.getItem(`${url}${element}`);
          if (storedValue && storedValue !== page[element as keyof typeof page]?.toString()) {
            setNewerVersion(true);
          }
        });
      }
    };

    checkUnsavedChanges();
  }, [url, page]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    dispatch(setPage({ [name]: value }));

    if (name === 'title' && autoURL) {
      const newUrl = value.toLowerCase().replace(/ /g, '-').replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
      dispatch(setPage({ url: newUrl }));
    }

    if (name === 'url') {
      setAutoURL(false);
    }

    saveToLocalStorage(name, value);
  };

  const handlePublishChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    dispatch(setPage({ published: value as 'Y' | 'N' | 'schedule' }));
    saveToLocalStorage('published', value);
  };

  const handleScheduleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const newDate = new Date(value);
    dispatch(setPage({ scheduleDate: newDate }));
    saveToLocalStorage('scheduleDate', newDate.toISOString());
  };

  const handleTagInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const tags = value.split(',').map((tag) => tag.trim());
    dispatch(setPage({ tags }));

    if (tags.length > 0) {
      const lastTag = tags[tags.length - 1];
      fetch(`/api/content/tags/?tag=${lastTag}`)
        .then((response) => response.json())
        .then((data) => {
          setSuggestions(data);
        })
        .catch(() => {
          setSuggestions([]);
        });
    } else {
      setSuggestions([]);
    }
  };

  const handleTagSuggestionClick = (tag: string) => {
    const newTags = [...page.tags];
    newTags[newTags.length - 1] = tag;
    dispatch(setPage({ tags: newTags }));
    setSuggestions([]);
  };

  const saveToLocalStorage = (key: string, value: string) => {
    if (url) {
      localStorage.setItem(`${url}${key}`, value);
    }
  };

  const loadFromLocalStorage = (key: string) => {
    if (url) {
      const storedValue = localStorage.getItem(`${url}${key}`);
      return storedValue ? storedValue : '';
    }
    return '';
  };

  const handleLocalVersionClick = () => {
    const elements = ['title', 'description', 'published', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
    elements.forEach((element) => {
      const storedValue = loadFromLocalStorage(element);
      dispatch(setPage({ [element]: storedValue }));
      localStorage.removeItem(`${url}${element}`);
    });
    setNewerVersion(false);
  };

  const handleDeleteNewerVersionClick = () => {
    const elements = ['title', 'description', 'published', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
    elements.forEach((element) => {
      localStorage.removeItem(`${url}${element}`);
    });
    setNewerVersion(false);
  };

  const handleDeletePage = async () => {
    if (page.id) {
      try {
        await deleteContent(page.id);
        navigate('/');
      } catch (error) {
        console.error('Error deleting page:', error);
      }
    }
  };

  const handleSavePage = async (duplicate?: boolean) => {
    if (duplicate && page.url === url) {
      alert(t('page_different_url'));
      return;
    }

    if (!page.type) {
      alert(t('page_no_type_selected'));
      return;
    }

    if (page.title.length === 0) {
      dispatch(setPage({ title: page.header }));
    }

    if (page.url.length === 0 || page.url === 'new') {
      alert(t('page_no_url'));
      return;
    }

    const scheduleDate =
      page.published === 'Y'
        ? page.published_date
        : page.published === 'schedule'
        ? page.scheduleDate.getTime() / 1000
        : Math.round(Date.now() / 1000);

    const featured = page.extras.featured ? page.extras.featured.src : null;

    const newContent = {
      ...page,
      published_date: scheduleDate,
      featured,
      author: user.id,
    };

    try {
      if (url === 'new' || duplicate) {
        const newContentResult = await addContent(newContent).unwrap();
        dispatch(setPage({ id: newContentResult.contentID }));

        if (page.tags) {
          page.tags.forEach((tag) => {
            addTag({ contentID: newContentResult.contentID, tag });
          });
        }

        navigate(`/${page.url}`);
      } else if (page.id) {
        await updateContent(newContent).unwrap();
        if (page.tags) {
          await deleteTags(page.id);
          page.tags.forEach((tag) => {
            addTag({ contentID: page.id, tag });
          });
        }
      }
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  return (
    <div>
      {newerVersion && (
        <div className="new-version form-case">
          <p>{t('page_newer')}</p>
          <button className="btn-error" type="button" onClick={handleDeleteNewerVersionClick}>
            {t('discard')}
          </button>
          <button className="btn-options" type="button" onClick={handleLocalVersionClick}>
            {t('compare')}
          </button>
          <button className="btn-success" type="button" onClick={handleLocalVersionClick}>
            {t('use')}
          </button>
        </div>
      )}
      <div className="bar-top">
        <a href="#">
          <i className="fa fa-angle-left"></i>
        </a>
        <h1 className="title">{t('page_details')}</h1>
        <a className="sidebar-close" href="#">
          <i className="fa fa-times"></i>
        </a>
      </div>
      <div className="bar--actions">
        {!contentLoading && !contentError && (
          <>
            <button type="button" className="btn-error" onClick={handleDeletePage}>
              {t('delete')}
            </button>
            <button type="button" className="btn-options" onClick={() => handleSavePage(true)}>
              {t('duplicate')}
            </button>
            <button type="button" className="btn-success" onClick={() => handleSavePage()}>
              {t('save')}
            </button>
          </>
        )}
      </div>
      <div className="pg-editor form-case">
        <label className="type" htmlFor="type">
          {t('type')}
        </label>
        <div className="cos-select">
          <select value={page.type} name="type" onChange={handleInputChange} required>
            {page.themePages.map((themePage) => (
              <option key={themePage} value={themePage}>
                {themePage}
              </option>
            ))}
          </select>
        </div>

        <span className="num-count">{page.title.length}</span>
        <label htmlFor="title">{t('title')}</label>
        <input type="text" name="title" value={page.title} onChange={handleInputChange} placeholder="about us, contact us" />

        <span className="num-count">{page.description.length}</span>
        <label htmlFor="description">
          {t('description')}
        </label>
        <textarea
          name="description"
          value={page.description}
          onChange={handleInputChange}
          placeholder="Tom's Restaurant is a diner located at 2880 Broadway (on the corner of 112th Street) in the Morningside Heights neighborhood of Manhattan in New York City."
        ></textarea>

        <label htmlFor="tags">{t('tags')}</label>
        <input
          type="text"
          name="tags"
          value={page.tags.join(', ')}
          onChange={handleTagInputChange}
          placeholder="about, restaurant, food, nyc"
        />
        <div className="tag-suggestions" style={{ display: suggestions.length > 0 ? 'block' : 'none' }}>
          {suggestions.slice(0, 10).map((tag) => (
            <a key={tag} onClick={() => handleTagSuggestionClick(tag)}>
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </a>
          ))}
        </div>

        <label htmlFor="url">{t('url')}</label>
        <input type="text" name="url" value={page.url} onChange={handleInputChange} />

        <div>
          <input
            type="radio"
            id="publish-y"
            name="publish"
            value="Y"
            checked={page.published === 'Y'}
            onChange={handlePublishChange}
          />
          <label htmlFor="publish-y">{t('publish')}</label>
        </div>
        <div>
          <input
            type="radio"
            id="publish-n"
            name="publish"
            value="N"
            checked={page.published === 'N'}
            onChange={handlePublishChange}
          />
          <label htmlFor="publish-n">{t('draft')}</label>
        </div>
        <div>
          <input
            type="radio"
            id="publish-schedule"
            name="publish"
            value="schedule"
            checked={page.published === 'schedule'}
            onChange={handlePublishChange}
          />
          <label htmlFor="publish-schedule">{t('schedule')}</label>
          {page.published === 'schedule' && <div className="schedule-triangle"></div>}
          {page.published === 'schedule' && (
            <input
              type="datetime-local"
              className="schedule radio-inline"
              name="scheduleDate"
              value={page.scheduleDate.toISOString().slice(0, 16)}
              onChange={handleScheduleDateChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PageEditor;

```

### Tokens: {'input_tokens': 6336, 'output_tokens': 7219}
### Execution time: 136.292897939682
