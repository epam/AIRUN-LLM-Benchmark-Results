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
// src/services/restService.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Block {
  blockID?: string;
}

export interface BlockRequirement {
  blockID?: string;
  requirementID?: string;
}

export interface Comment {
  commentID?: string;
}

export interface Content {
  contentID?: string;
}

export interface ContentRevision {
  contentID?: string;
  revisionID?: string;
}

export interface ContentRevisionExtra {
  contentID?: string;
  revisionID?: string;
  extraID?: string;
}

export interface File {
  fileID?: string;
}

export interface FileTag {
  fileID?: string;
  tag?: string;
}

export interface Menu {
  menuID?: string;
}

export interface Module {
  moduleID?: string;
}

export interface Theme {
  themeID?: string;
}

export interface User {
    userID?: string;
}

export const restApi = createApi({
  reducerPath: 'restApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'api/' }),
  tagTypes: ['Blocks', 'Comments', 'Content', 'Files', 'Menus', 'Modules', 'Themes', 'Settings', 'Users'],
  endpoints: (builder) => ({
    getBlocks: builder.query<Block[], void>({
      query: () => 'blocks',
      providesTags: ['Blocks'],
    }),
    getBlockById: builder.query<Block, string>({
      query: (blockID) => `blocks/${blockID}`,
      providesTags: (result, error, arg) => [{ type: 'Blocks', id: arg }],
    }),
    updateBlock: builder.mutation<Block, Partial<Block> & Pick<Block, 'blockID'>>({
      query: ({ blockID, ...patch }) => ({
        url: `blocks/${blockID}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Blocks', id: arg.blockID }],
    }),
    getBlocksRequirements: builder.query<BlockRequirement[], string>({
        query: (blockID) => `blocks/${blockID}/requirements`,
        providesTags: (result, error, arg) => [{ type: 'Blocks', id: arg }],
    }),
    getBlocksRequirementById: builder.query<BlockRequirement, {blockID: string, requirementID: string}>({
        query: ({blockID, requirementID}) => `blocks/${blockID}/requirements/${requirementID}`,
        providesTags: (result, error, arg) => [{ type: 'Blocks', id: arg.blockID }],
    }),
    updateBlocksRequirement: builder.mutation<BlockRequirement, Partial<BlockRequirement> & Pick<BlockRequirement, 'blockID' | 'requirementID'>>({
        query: ({ blockID, requirementID, ...patch }) => ({
          url: `blocks/${blockID}/requirements/${requirementID}`,
          method: 'PUT',
          body: patch,
        }),
        invalidatesTags: (result, error, arg) => [{ type: 'Blocks', id: arg.blockID }],
    }),
    getComments: builder.query<Comment[], void>({
      query: () => 'comments',
      providesTags: ['Comments'],
    }),
    getCommentById: builder.query<Comment, string>({
      query: (commentID) => `comments/${commentID}`,
      providesTags: (result, error, arg) => [{ type: 'Comments', id: arg }],
    }),
    updateComment: builder.mutation<Comment, Partial<Comment> & Pick<Comment, 'commentID'>>({
      query: ({ commentID, ...patch }) => ({
        url: `comments/${commentID}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Comments', id: arg.commentID }],
    }),
    getContent: builder.query<Content[], void>({
      query: () => 'content',
      providesTags: ['Content'],
    }),
    getContentById: builder.query<Content, string>({
      query: (contentID) => `content/${contentID}`,
      providesTags: (result, error, arg) => [{ type: 'Content', id: arg }],
    }),
    updateContent: builder.mutation<Content, Partial<Content> & Pick<Content, 'contentID'>>({
      query: ({ contentID, ...patch }) => ({
        url: `content/${contentID}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Content', id: arg.contentID }],
    }),
    getContentExtras: builder.query<any, string>({
      query: (contentID) => `content/${contentID}/extras/`,
      providesTags: (result, error, arg) => [{ type: 'Content', id: arg }],
    }),
    getContentRevisions: builder.query<ContentRevision[], string>({
        query: (contentID) => `content/${contentID}/revisions`,
        providesTags: (result, error, arg) => [{ type: 'Content', id: arg }],
    }),
    getContentRevisionById: builder.query<ContentRevision, {contentID: string, revisionID: string}>({
        query: ({contentID, revisionID}) => `content/${contentID}/revisions/${revisionID}`,
        providesTags: (result, error, arg) => [{ type: 'Content', id: arg.contentID }],
    }),
    updateContentRevision: builder.mutation<ContentRevision, Partial<ContentRevision> & Pick<ContentRevision, 'contentID' | 'revisionID'>>({
        query: ({ contentID, revisionID, ...patch }) => ({
          url: `content/${contentID}/revisions/${revisionID}`,
          method: 'PUT',
          body: patch,
        }),
        invalidatesTags: (result, error, arg) => [{ type: 'Content', id: arg.contentID }],
    }),
    getContentRevisionsExtras: builder.query<ContentRevisionExtra[], {contentID: string, revisionID: string}>({
        query: ({contentID, revisionID}) => `content/${contentID}/revisions/${revisionID}/extras`,
        providesTags: (result, error, arg) => [{ type: 'Content', id: arg.contentID }],
    }),
    getContentRevisionsExtraById: builder.query<ContentRevisionExtra, {contentID: string, revisionID: string, extraID: string}>({
        query: ({contentID, revisionID, extraID}) => `content/${contentID}/revisions/${revisionID}/extras/${extraID}`,
        providesTags: (result, error, arg) => [{ type: 'Content', id: arg.contentID }],
    }),
    getContentTags: builder.query<any, string>({
      query: (contentID) => `content/${contentID}/tags/`,
      providesTags: (result, error, arg) => [{ type: 'Content', id: arg }],
    }),
    getFiles: builder.query<File[], void>({
      query: () => 'files',
      providesTags: ['Files'],
    }),
    getFileById: builder.query<File, string>({
      query: (fileID) => `files/${fileID}`,
      providesTags: (result, error, arg) => [{ type: 'Files', id: arg }],
    }),
    updateFile: builder.mutation<File, Partial<File> & Pick<File, 'fileID'>>({
      query: ({ fileID, ...patch }) => ({
        url: `files/${fileID}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Files', id: arg.fileID }],
    }),
    getFilesTags: builder.query<FileTag[], string>({
        query: (fileID) => `files/${fileID}/tag`,
        providesTags: (result, error, arg) => [{ type: 'Files', id: arg }],
    }),
    getFileTagByTag: builder.query<FileTag, {fileID: string, tag: string}>({
        query: ({fileID, tag}) => `files/${fileID}/tag/${tag}`,
        providesTags: (result, error, arg) => [{ type: 'Files', id: arg.fileID }],
    }),
    updateFilesTag: builder.mutation<FileTag, Partial<FileTag> & Pick<FileTag, 'fileID' | 'tag'>>({
        query: ({ fileID, tag, ...patch }) => ({
          url: `files/${fileID}/tag/${tag}`,
          method: 'PUT',
          body: patch,
        }),
        invalidatesTags: (result, error, arg) => [{ type: 'Files', id: arg.fileID }],
    }),
    getMenus: builder.query<Menu[], void>({
      query: () => 'menus',
      providesTags: ['Menus'],
    }),
    getMenuById: builder.query<Menu, string>({
      query: (menuID) => `menus/${menuID}`,
      providesTags: (result, error, arg) => [{ type: 'Menus', id: arg }],
    }),
    updateMenu: builder.mutation<Menu, Partial<Menu> & Pick<Menu, 'menuID'>>({
      query: ({ menuID, ...patch }) => ({
        url: `menus/${menuID}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Menus', id: arg.menuID }],
    }),
    getModules: builder.query<Module[], void>({
      query: () => 'modules',
      providesTags: ['Modules'],
    }),
    getModuleById: builder.query<Module, string>({
      query: (moduleID) => `modules/${moduleID}`,
      providesTags: (result, error, arg) => [{ type: 'Modules', id: arg }],
    }),
    updateModule: builder.mutation<Module, Partial<Module> & Pick<Module, 'moduleID'>>({
      query: ({ moduleID, ...patch }) => ({
        url: `modules/${moduleID}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Modules', id: arg.moduleID }],
    }),
    getSitemaps: builder.query<any, void>({
      query: () => 'sitemaps',
    }),
    getThemes: builder.query<Theme[], void>({
      query: () => 'themes',
      providesTags: ['Themes'],
    }),
    getThemeById: builder.query<Theme, string>({
      query: (themeID) => `themes/${themeID}`,
      providesTags: (result, error, arg) => [{ type: 'Themes', id: arg }],
    }),
    updateTheme: builder.mutation<Theme, Partial<Theme> & Pick<Theme, 'themeID'>>({
      query: ({ themeID, ...patch }) => ({
        url: `themes/${themeID}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Themes', id: arg.themeID }],
    }),
    getSettings: builder.query<any, void>({
      query: () => 'settings',
      providesTags: ['Settings'],
    }),
    updateSettings: builder.mutation<any, any>({
      query: (body) => ({
        url: 'settings',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),
    getUsers: builder.query<User[], void>({
      query: () => 'users',
      providesTags: ['Users'],
    }),
    getUserById: builder.query<User, string>({
      query: (userID) => `users/${userID}`,
      providesTags: (result, error, arg) => [{ type: 'Users', id: arg }],
    }),
    updateUser: builder.mutation<User, Partial<User> & Pick<User, 'userID'>>({
      query: ({ userID, ...patch }) => ({
        url: `users/${userID}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Users', id: arg.userID }],
    }),

    saveContent: builder.mutation<Content, Partial<Content>>({
        query: (body) => ({
            url: `content`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Content']
    }),
    deleteContent: builder.mutation<void, string>({
        query: (contentID) => ({
            url: `content/${contentID}`,
            method: 'DELETE'
        }),
        invalidatesTags: ['Content']
    }),
    saveContentRevision: builder.mutation<ContentRevision, Partial<ContentRevision> & Pick<ContentRevision, 'contentID'>>({
        query: ({contentID, ...body}) => ({
            url: `content/${contentID}/revisions`,
            method: 'POST',
            body
        }),
        invalidatesTags: (result, error, arg) => [{ type: 'Content', id: arg.contentID }],
    }),
    deleteContentRevision: builder.mutation<void, {contentID: string, revisionID?: string}>({
        query: ({contentID, revisionID}) => ({
            url: `content/${contentID}/revisions${revisionID ? '/'+revisionID : ''}`,
            method: 'DELETE'
        }),
        invalidatesTags: (result, error, arg) => [{ type: 'Content', id: arg.contentID }],
    }),
    saveContentExtras: builder.mutation<any, {contentID: string, name: string, extra: any}>({
        query: ({contentID, ...body}) => ({
            url: `content/${contentID}/extras`,
            method: 'POST',
            body
        }),
        invalidatesTags: (result, error, arg) => [{ type: 'Content', id: arg.contentID }],
    }),
    deleteContentExtras: builder.mutation<void, string>({
        query: (contentID) => ({
            url: `content/${contentID}/extras`,
            method: 'DELETE'
        }),
        invalidatesTags: ['Content']
    }),
    saveContentRevisionsExtras: builder.mutation<any, {contentID: string, revisionID: string, name: string, extra: any}>({
        query: ({contentID, revisionID, ...body}) => ({
            url: `content/${contentID}/revisions/${revisionID}/extras`,
            method: 'POST',
            body
        }),
        invalidatesTags: (result, error, arg) => [{ type: 'Content', id: arg.contentID }],
    }),
    deleteContentRevisionsExtras: builder.mutation<void, {contentID: string, revisionID?: string}>({
        query: ({contentID, revisionID}) => ({
            url: `content/${contentID}/revisions/${revisionID ? '/'+revisionID : ''}/extras`,
            method: 'DELETE'
        }),
        invalidatesTags: (result, error, arg) => [{ type: 'Content', id: arg.contentID }],
    }),
    saveContentTag: builder.mutation<any, {contentID: string, tag: string}>({
        query: ({contentID, ...body}) => ({
            url: `content/${contentID}/tags`,
            method: 'POST',
            body
        }),
        invalidatesTags: (result, error, arg) => [{ type: 'Content', id: arg.contentID }],
    }),
    deleteContentTags: builder.mutation<void, string>({
        query: (contentID) => ({
            url: `content/${contentID}/tags`,
            method: 'DELETE'
        }),
        invalidatesTags: ['Content']
    }),
    queryContentTags: builder.query<string[], string>({
        query: (tag) => `content/tags?tag=${tag}`
    })
  }),
});

export const {
  useGetBlocksQuery,
  useGetBlockByIdQuery,
  useUpdateBlockMutation,
  useGetBlocksRequirementsQuery,
  useGetBlocksRequirementByIdQuery,
  useUpdateBlocksRequirementMutation,
  useGetCommentsQuery,
  useGetCommentByIdQuery,
  useUpdateCommentMutation,
  useGetContentQuery,
  useGetContentByIdQuery,
  useUpdateContentMutation,
  useGetContentExtrasQuery,
  useGetContentRevisionsQuery,
  useGetContentRevisionByIdQuery,
  useUpdateContentRevisionMutation,
  useGetContentRevisionsExtrasQuery,
  useGetContentRevisionsExtraByIdQuery,
  useGetContentTagsQuery,
  useGetFilesQuery,
  useGetFileByIdQuery,
  useUpdateFileMutation,
  useGetFilesTagsQuery,
  useGetFileTagByTagQuery,
  useUpdateFilesTagMutation,
  useGetMenusQuery,
  useGetMenuByIdQuery,
  useUpdateMenuMutation,
  useGetModulesQuery,
  useGetModuleByIdQuery,
  useUpdateModuleMutation,
  useGetSitemapsQuery,
  useGetThemesQuery,
  useGetThemeByIdQuery,
  useUpdateThemeMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useSaveContentMutation,
  useDeleteContentMutation,
  useSaveContentRevisionMutation,
  useDeleteContentRevisionMutation,
  useSaveContentExtrasMutation,
  useDeleteContentExtrasMutation,
  useSaveContentRevisionsExtrasMutation,
  useDeleteContentRevisionsExtrasMutation,
  useSaveContentTagMutation,
  useDeleteContentTagsMutation,
  useQueryContentTagsQuery
} = restApi;

```

```ts
// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { restApi } from '../services/restService';
import pageReducer from '../features/page/pageSlice';
import userReducer from '../features/user/userSlice';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: {
    [restApi.reducerPath]: restApi.reducer,
    page: pageReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(restApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```ts
// src/features/page/pageSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PageState {
  id: number | null;
  title: string;
  description: string;
  header: string;
  subheader: string;
  body: string;
  url: string;
  type: string;
  published: string;
  published_date: string | null;
  themePages: string[];
  timestamp: string | null;
  extras: Record<string, any>;
  misc: Record<string, any>;
  tags: string[];
  scheduleDate: string | null;
  suggestions: string[];
}

const initialState: PageState = {
  id: null,
  title: '',
  description: '',
  header: '',
  subheader: '',
  body: '',
  url: '',
  type: '',
  published: '',
  published_date: null,
  themePages: [],
  timestamp: null,
  extras: {},
  misc: {},
  tags: [],
  scheduleDate: new Date().toISOString(),
  suggestions: []
};

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<Partial<PageState>>) => {
      Object.assign(state, action.payload);
    },
    resetPage: (state) => {
        Object.assign(state, initialState);
        state.scheduleDate = new Date().toISOString();
    },
    updatePageType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
    updateTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    updateDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    updateUrl: (state, action: PayloadAction<string>) => {
      state.url = action.payload;
    },
    setSuggestions: (state, action: PayloadAction<string[]>) => {
        state.suggestions = action.payload;
    },
    setTags: (state, action: PayloadAction<string[]>) => {
        state.tags = action.payload
    }
  },
});

export const { setPage, resetPage, updatePageType, updateTitle, updateDescription, updateUrl, setSuggestions, setTags } = pageSlice.actions;

export default pageSlice.reducer;
```

```ts
// src/features/user/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
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

const initialState: UserState = {
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
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
```

```tsx
// src/components/PageForm/PageForm.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import {
  setPage,
  updatePageType,
  updateTitle,
  updateDescription,
  updateUrl,
  resetPage,
  setSuggestions,
  setTags
} from '../../features/page/pageSlice';
import { useUpdateContentMutation, useSaveContentMutation, useDeleteContentMutation, useGetContentByIdQuery, useSaveContentRevisionMutation, useDeleteContentRevisionMutation, useSaveContentExtrasMutation, useDeleteContentExtrasMutation, useSaveContentRevisionsExtrasMutation, useDeleteContentRevisionsExtrasMutation, useSaveContentTagMutation, useDeleteContentTagsMutation, useQueryContentTagsQuery } from '../../services/restService';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './PageForm.css';

const PageForm: React.FC = () => {
  const { t } = useTranslation();
  const { url: pageUrl } = useParams<{ url: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const page = useSelector((state: RootState) => state.page);
  const user = useSelector((state: RootState) => state.user);

  const [autoURL, setAutoURL] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newerVersion, setNewerVersion] = useState(false);

  const [updateContent] = useUpdateContentMutation();
  const [saveContent] = useSaveContentMutation();
  const [deleteContent] = useDeleteContentMutation();
  const { data: fetchedPage } = useGetContentByIdQuery(page.id ? page.id.toString() : '', { skip: !page.id });
  const [saveContentRevision] = useSaveContentRevisionMutation();
  const [deleteContentRevision] = useDeleteContentRevisionMutation();
  const [saveContentExtras] = useSaveContentExtrasMutation();
  const [deleteContentExtras] = useDeleteContentExtrasMutation();
  const [saveContentRevisionsExtras] = useSaveContentRevisionsExtrasMutation();
  const [deleteContentRevisionsExtras] = useDeleteContentRevisionsExtrasMutation();
  const [saveContentTag] = useSaveContentTagMutation();
  const [deleteContentTags] = useDeleteContentTagsMutation();
  const { data: suggestionsData } = useQueryContentTagsQuery(page.tags.length > 0 ? page.tags[page.tags.length -1] : '', { skip: page.tags.length === 0 });

    useEffect(() => {
        if(suggestionsData) {
            dispatch(setSuggestions(suggestionsData));
        }
    }, [suggestionsData, dispatch]);

  useEffect(() => {
    if (pageUrl && pageUrl !== 'new' && fetchedPage) {
      dispatch(setPage({
        ...fetchedPage,
        scheduleDate: fetchedPage.published_date ? new Date(Number(fetchedPage.published_date) * 1000).toISOString() : new Date().toISOString(),
        tags: fetchedPage.tags || [],
      }));
    } else if (pageUrl === 'new') {
        dispatch(resetPage());
    }
  }, [fetchedPage, pageUrl, dispatch]);

  useEffect(() => {
    const elements: (keyof typeof page)[] = ['title', 'description', 'publish', 'scheduleDate', 'url'];
    if (pageUrl && pageUrl !== 'new') {
      elements.forEach((key) => {
        const storedValue = localStorage.getItem(`${pageUrl}${key}`);
        if (storedValue && storedValue !== 'null' && storedValue !== String(page[key])) {
          setNewerVersion(true);
        }
      });
    }
  }, [page, pageUrl]);

  const handleLocalVersion = useCallback(() => {
    const elements: (keyof typeof page)[] = ['title', 'description', 'publish', 'scheduleDate', 'url'];
    elements.forEach((key) => {
      const storedValue = localStorage.getItem(`${pageUrl}${key}`);
      if (storedValue && storedValue !== 'null') {
        dispatch(setPage({ [key]: storedValue }));
        localStorage.setItem(`${pageUrl}${key}`, 'null');
      }
    });
    setNewerVersion(false);
  }, [dispatch, pageUrl]);

  const handleDeleteNewerVersion = useCallback(() => {
    const elements: (keyof typeof page)[] = ['title', 'description', 'publish', 'scheduleDate', 'url'];
    elements.forEach((key) => {
      localStorage.setItem(`${pageUrl}${key}`, 'null');
    });
    setNewerVersion(false);
  }, [pageUrl]);

  const handleDeletePage = async () => {
    if (!page.id) return;

    try {
      await deleteContent(page.id.toString()).unwrap();
      await deleteContentRevision({ contentID: page.id.toString() }).unwrap();
      await deleteContentRevisionsExtras({ contentID: page.id.toString() }).unwrap();
      await deleteContentExtras(page.id.toString()).unwrap();
      await deleteContentTags(page.id.toString()).unwrap();
      alert(t('deleted'));
      navigate('/new');
    } catch (error) {
      console.error('Failed to delete page:', error);
    }
  };

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = e.target.value;
      dispatch(updateTitle(newTitle));

      if (page.url === '/new' || page.url === 'new' || !page.url) {
        setAutoURL(true);
      }

      if (autoURL) {
        const newUrl = newTitle
          .toLowerCase()
          .replace(/ /g, '-')
          .replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
        dispatch(updateUrl(newUrl));
      }
      saveLocal();
    },
    [dispatch, autoURL, page.url, saveLocal]
  );

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      dispatch(updateDescription(e.target.value));
      saveLocal();
    },
    [dispatch, saveLocal]
  );

  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(updateUrl(e.target.value));
      saveLocal();
    },
    [dispatch, saveLocal]
  );

    const handleAutocompleteTags = useCallback(() => {
        if(page.tags.length > 0){
            const tag = page.tags[page.tags.length - 1];
            if(!tag) {
                dispatch(setSuggestions([]));
            }
        } else {
            dispatch(setSuggestions([]));
        }
    }, [page.tags, dispatch]);

    const handleSelectSuggestion = useCallback((tag: string) => {
        const tags = [...page.tags];
        tags[tags.length - 1] = tag;
        tags.push('');
        dispatch(setTags(tags));
        dispatch(setSuggestions([]));
    }, [page.tags, dispatch]);

    const handleTagsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const tagsList = e.target.value.split(',');
        dispatch(setTags(tagsList));
        handleAutocompleteTags();
        saveLocal();
    }, [dispatch, handleAutocompleteTags, saveLocal]);

  const saveLocal = useCallback(() => {
    localStorage.setItem(`${pageUrl}title`, page.title);
    localStorage.setItem(`${pageUrl}description`, page.description);
    localStorage.setItem(`${pageUrl}url`, page.url);
    localStorage.setItem(`${pageUrl}publish`, page.published);
    localStorage.setItem(`${pageUrl}scheduleDate`, page.scheduleDate || '');
    localStorage.setItem(`${pageUrl}type`, page.type);
  }, [page.title, page.description, page.url, page.published, page.scheduleDate, page.type, pageUrl]);

  const handleSavePage = async (duplicate = false) => {
    if (duplicate && page.url === pageUrl) {
      alert(t('page_different_url'));
      return;
    }

    if (!page.type) {
      alert(t('page_no_type_selected'));
      return;
    }

    if (!page.title) {
      dispatch(updateTitle(page.header));
    }

    if (!page.url || page.url === 'new') {
      alert(t('page_no_url'));
      return;
    }

    let scheduleDate: number;
    if (page.published === 'Y' && fetchedPage?.published === 'Y') {
      scheduleDate = Number(fetchedPage.published_date);
    } else if (page.published === 'Y') {
      scheduleDate = Math.round(Date.now() / 1000);
    } else if (page.published === 'schedule' && page.scheduleDate) {
      scheduleDate = Math.round(new Date(page.scheduleDate).getTime() / 1000);
      if (new Date(page.scheduleDate).getTime() < Date.now()) {
        dispatch(setPage({ published: 'Y' }));
      } else {
        dispatch(setPage({ published: 'N' }));
      }
    } else {
        scheduleDate = 0;
    }

    const pageData = {
      title: page.title,
      description: page.description,
      header: page.header,
      subheader: page.subheader,
      featured: page.extras.featured?.src || null,
      body: page.body,
      url: page.url,
      type: page.type,
      published: page.published,
      published_date: scheduleDate,
      author: user.id,
    };

    try {
      if (pageUrl === '/new' || duplicate) {
        const newPage = await saveContent(pageData).unwrap();
        const contentID = newPage.id;

        dispatch(setPage({ id: contentID }));
        setAutoURL(false);

        if (page.tags) {
          for (const tag of page.tags) {
            await saveContentTag({ contentID: contentID.toString(), tag });
          }
        }

        const revision = await saveContentRevision({...pageData, contentID: contentID.toString()}).unwrap();
        const revisionID = revision.id;

        if (Object.keys(page.extras).length > 0) {
          for (const key in page.extras) {
            const extraValue = typeof page.extras[key] === 'object' ? JSON.stringify(page.extras[key]) : page.extras[key];
            await saveContentExtras({ contentID: contentID.toString(), name: key, extra: extraValue });
            await saveContentRevisionsExtras({ revisionID: revisionID.toString(), contentID: contentID.toString(), name: key, extra: extraValue });
          }
        }
        alert(t('page_created'));
        navigate(`/${page.url}`);
      } else {
          if(!page.id)
            return;

        await updateContent({ contentID: page.id.toString(), ...pageData }).unwrap();
        await deleteContentTags(page.id.toString());
        const revision = await saveContentRevision({...pageData, contentID: page.id.toString()}).unwrap();
        const revisionID = revision.id;

        if (page.tags) {
          for (const tag of page.tags) {
            await saveContentTag({ contentID: page.id.toString(), tag });
          }
        }

        await deleteContentExtras(page.id.toString());
        await deleteContentRevisionsExtras({contentID: page.id.toString(), revisionID: revisionID.toString()});

        if (Object.keys(page.extras).length > 0) {
          for (const key in page.extras) {
            const extraValue = typeof page.extras[key] === 'object' ? JSON.stringify(page.extras[key]) : page.extras[key];
            await saveContentExtras({ contentID: page.id.toString(), name: key, extra: extraValue });
            await saveContentRevisionsExtras({ revisionID: revisionID.toString(), contentID: page.id.toString(), name: key, extra: extraValue });
          }
        }
        alert(t('page_updated'));
      }
    } catch (error) {
      console.error('Failed to save page:', error);


### Tokens: {'input_tokens': 6338, 'output_tokens': 8191}
### Execution time: 70.34177613258362
