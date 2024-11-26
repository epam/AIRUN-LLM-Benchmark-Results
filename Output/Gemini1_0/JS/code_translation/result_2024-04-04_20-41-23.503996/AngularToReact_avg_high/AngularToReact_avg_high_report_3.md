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
- Use the following libraries: TypeScript, Redux Toolkit with createSlice, and nanoid.
- Provide configuration of the store and provider if needed.
- Split the code into separate components.
- Optimize the code where possible.
- The converted code should not contain any TODOs.
- Return the translated code as markdown code snippets.
- Simply return the codebase without additional comments or explanations on how to convert it.

## Run 3:
### Answer:
**rest.ts**
```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const restApi = createApi({
  reducerPath: 'rest',
  baseQuery: fetchBaseQuery({ baseUrl: 'api/' }),
  endpoints: (builder) => ({
    getBlocks: builder.query({
      query: () => 'blocks',
    }),
    getBlockRequirements: builder.query({
      query: (blockID) => `blocks/${blockID}/requirements`,
    }),
    getComments: builder.query({
      query: () => 'comments',
    }),
    getContent: builder.query({
      query: (contentID) => `content/${contentID}`,
    }),
    getContentExtras: builder.query({
      query: (contentID) => `content/${contentID}/extras`,
    }),
    getContentRevisions: builder.query({
      query: (contentID) => `content/${contentID}/revisions`,
    }),
    getContentRevisionsExtras: builder.query({
      query: (revisionID, contentID) => `content/${contentID}/revisions/${revisionID}/extras`,
    }),
    getContentTags: builder.query({
      query: (contentID) => `content/${contentID}/tags`,
    }),
    getFiles: builder.query({
      query: () => 'files',
    }),
    getFilesTags: builder.query({
      query: (fileID) => `files/${fileID}/tag`,
    }),
    getMenus: builder.query({
      query: () => 'menus',
    }),
    getModules: builder.query({
      query: () => 'modules',
    }),
    getSitemaps: builder.query({
      query: () => 'sitemaps',
    }),
    getThemes: builder.query({
      query: () => 'themes',
    }),
    getSettings: builder.query({
      query: () => 'settings',
    }),
    getUsers: builder.query({
      query: () => 'users',
    }),
  }),
});

export const {
  useGetBlocksQuery,
  useGetBlockRequirementsQuery,
  useGetCommentsQuery,
  useGetContentQuery,
  useGetContentExtrasQuery,
  useGetContentRevisionsQuery,
  useGetContentRevisionsExtrasQuery,
  useGetContentTagsQuery,
  useGetFilesQuery,
  useGetFilesTagsQuery,
  useGetMenusQuery,
  useGetModulesQuery,
  useGetSitemapsQuery,
  useGetThemesQuery,
  useGetSettingsQuery,
  useGetUsersQuery,
} = restApi;
```

**page.tsx**
```typescript
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetContentQuery, useGetContentRevisionsQuery } from '../services/rest';
import { PageState } from '../store/slices/pageSlice';
import { RootState } from '../store/store';

const Page: React.FC = () => {
  const dispatch = useDispatch();
  const { data: pageData, isLoading: pageLoading } = useGetContentQuery(pageID);
  const { data: revisionsData, isLoading: revisionsLoading } = useGetContentRevisionsQuery(pageID);
  const page = useSelector((state: RootState) => state.page);

  const [newerVersion, setNewerVersion] = useState(false);

  useEffect(() => {
    if (!pageLoading && !revisionsLoading) {
      if (pageData && revisionsData) {
        const pageRevisions = revisionsData.filter((revision) => revision.contentID === pageData.id);
        const latestRevision = pageRevisions[pageRevisions.length - 1];
        if (latestRevision && latestRevision.id !== page.id) {
          setNewerVersion(true);
        }
      }
    }
  }, [pageData, revisionsData, pageLoading, revisionsLoading]);

  const handleLocalVersion = () => {
    dispatch({ type: 'page/localVersion' });
  };

  const handleDeleteNewerVersion = () => {
    dispatch({ type: 'page/deleteNewerVersion' });
  };

  const handleDeletePage = () => {
    dispatch({ type: 'page/deletePage' });
  };

  const handleUpdatePageType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'page/updatePageType', payload: e.target.value });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'page/updateTitle', payload: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'page/updateDescription', payload: e.target.value });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'page/updateUrl', payload: e.target.value });
  };

  const handleSavePage = (duplicate?: boolean) => {
    dispatch({ type: 'page/savePage', payload: duplicate });
  };

  const handleAutocompleteTags = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'page/autocompleteTags', payload: e.target.value });
  };

  const handleSelectSuggestion = (tag: string) => {
    dispatch({ type: 'page/selectSuggestion', payload: tag });
  };

  return (
    <div className="pg-editor form-case">
      <label className="type" htmlFor="type">
        Type
      </label>
      <div className="cos-select">
        <select value={page.type} onChange={handleUpdatePageType} required>
          {page.themePages.map((themePage) => (
            <option key={themePage} value={themePage}>
              {themePage}
            </option>
          ))}
        </select>
      </div>

      <span className="num-count">{page.title.length}</span>
      <label htmlFor="title">Title</label>
      <input type="text" value={page.title} onChange={handleTitleChange} placeholder="about us, contact us" />

      <span className="num-count">{page.description.length}</span>
      <label htmlFor="description">Description</label>
      <textarea
        value={page.description}
        onChange={handleDescriptionChange}
        placeholder="Tom's Restaurant is a diner located at 2880 Broadway (on the corner of 112th Street) in the Morningside Heights neighborhood of Manhattan in New York City."
      />

      <label htmlFor="tags">Tags</label>
      <input
        value={page.tags}
        type="text"
        onChange={handleAutocompleteTags}
        placeholder="about, restaurant, food, nyc"
      />
      <div className="tag-suggestions" style={{ display: page.suggestions.length ? 'block' : 'none' }}>
        {page.suggestions.map((tag) => (
          <a key={tag} onClick={() => handleSelectSuggestion(tag)}>
            {tag}
          </a>
        ))}
      </div>

      <label htmlFor="url">URL</label>
      <input value={page.url} type="text" onChange={handleUrlChange} />

      <input
        type="radio"
        name="publish"
        id="Y"
        value="Y"
        checked={page.publish === 'Y'}
        onChange={() => dispatch({ type: 'page/updatePublish', payload: 'Y' })}
      />
      <label htmlFor="Y" onClick={() => dispatch({ type: 'page/updatePublish', payload: 'Y' })}>
        Publish
      </label>
      <input
        type="radio"
        name="publish"
        id="N"
        value="N"
        checked={page.publish === 'N'}
        onChange={() => dispatch({ type: 'page/updatePublish', payload: 'N' })}
      />
      <label htmlFor="N" onClick={() => dispatch({ type: 'page/updatePublish', payload: 'N' })}>
        Draft
      </label>
      <input
        type="radio"
        name="publish"
        id="schedule"
        value="schedule"
        checked={page.publish === 'schedule'}
        onChange={() => dispatch({ type: 'page/updatePublish', payload: 'schedule' })}
      />
      <label htmlFor="schedule" onClick={() => dispatch({ type: 'page/updatePublish', payload: 'schedule' })}>
        Schedule
      </label>
      <div className="schedule-triangle" style={{ display: page.publish === 'schedule' ? 'block' : 'none' }} />
      <input
        type="datetime-local"
        className="schedule radio-inline"
        value={page.scheduleDate}
        onChange={(e) => dispatch({ type: 'page/updateScheduleDate', payload: e.target.value })}
        style={{ display: page.publish === 'schedule' ? 'inline-block' : 'none' }}
      />
    </div>
  );
};

export default Page;
```

**pageSlice.ts**
```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { PageState } from '../types/page';

const initialState: PageState = {
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
  misc: {},
  newerVersion: false,
  suggestions: [],
};

export const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    updatePage: (state, action: PayloadAction<PageState>) => {
      state.id = action.payload.id;
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.header = action.payload.header;
      state.subheader = action.payload.subheader;
      state.body = action.payload.body;
      state.url = action.payload.url;
      state.type = action.payload.type;
      state.published = action.payload.published;
      state.published_date = action.payload.published_date;
      state.themePages = action.payload.themePages;
      state.timestamp = action.payload.timestamp;
      state.extras = action.payload.extras;
      state.misc = action.payload.misc;
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
    updatePublish: (state, action: PayloadAction<string>) => {
      state.published = action.payload;
    },
    updateScheduleDate: (state, action: PayloadAction<string>) => {
      state.published_date = action.payload;
    },
    updatePageType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
    localVersion: (state) => {
      state.newerVersion = false;
    },
    deleteNewerVersion: (state) => {
      state.newerVersion = false;
    },
    deletePage: (state) => {
      state.id = 0;
      state.title = '';
      state.description = '';
      state.header = '';
      state.subheader = '';
      state.body = '';
      state.url = '';
      state.type = '';
      state.published = '';
      state.published_date = '';
      state.themePages = [];
      state.timestamp = '';
      state.extras = [];
      state.misc = {};
    },
    autocompleteTags: (state, action: PayloadAction<string>) => {
      const tag = action.payload;
      if (tag) {
        state.suggestions = [];
      }
    },
    selectSuggestion: (state, action: PayloadAction<string>) => {
      const tag = action.payload;
      state.suggestions = [];
    },
  },
});

export const {
  updatePage,
  updateTitle,
  updateDescription,
  updateUrl,
  updatePublish,
  updateScheduleDate,
  updatePageType,
  localVersion,
  deleteNewerVersion,
  deletePage,
  autocompleteTags,
  selectSuggestion,
} = pageSlice.actions;

export default pageSlice.reducer;
```

**store.ts**
```typescript
import { configureStore } from '@reduxjs/toolkit';
import { restApi } from './services/rest';
import pageReducer from './store/slices/pageSlice';

export const store = configureStore({
  reducer: {
    page: pageReducer,
    [restApi.reducerPath]: restApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(restApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```
### Tokens: {'prompt_tokens': 6342, 'completion_tokens': 3163, 'total_tokens': 9505}
### Execution time: 61.299217224121094
