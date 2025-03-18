I have the following Angular app code:

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
// store.ts
import { configureStore } from '@reduxjs/toolkit';
import pageReducer from './slices/pageSlice';
import usersReducer from './slices/usersSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './services/api';

export const store = configureStore({
    reducer: {
        page: pageReducer,
        users: usersReducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```typescript
// slices/pageSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PageExtras {
    [key: string]: any;
}

interface PageState {
    id: number;
    title: string;
    description: string;
    header: string;
    subheader: string;
    body: string;
    url: string;
    type: string;
    publish: string;
    scheduleDate: string;
    themePages: string[];
    timestamp: string;
    extras: PageExtras;
    misc: Record<string, any>;
    newerVersion: boolean;
    confirm: boolean;
    autoURL: boolean;
    suggestions: string[];
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
    publish: '',
    scheduleDate: '',
    themePages: [],
    timestamp: '',
    extras: {},
    misc: {},
    newerVersion: false,
    confirm: false,
    autoURL: false,
    suggestions: [],
};

const pageSlice = createSlice({
    name: 'page',
    initialState,
    reducers: {
        setPage(state, action: PayloadAction<Partial<PageState>>) {
            Object.assign(state, action.payload);
        },
        setNewerVersion(state, action: PayloadAction<boolean>) {
            state.newerVersion = action.payload;
        },
        setConfirm(state, action: PayloadAction<boolean>) {
            state.confirm = action.payload;
        },
        setAutoURL(state, action: PayloadAction<boolean>) {
            state.autoURL = action.payload;
        },
        setSuggestions(state, action: PayloadAction<string[]>) {
            state.suggestions = action.payload;
        },
    },
});

export const { setPage, setNewerVersion, setConfirm, setAutoURL, setSuggestions } = pageSlice.actions;
export default pageSlice.reducer;
```

```typescript
// slices/usersSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UsersState {
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

const initialState: UsersState = {
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

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<Partial<UsersState>>) {
            Object.assign(state, action.payload);
        },
    },
});

export const { setUser } = usersSlice.actions;
export default usersSlice.reducer;
```

```typescript
// services/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Content {
    id: number;
    title: string;
    description: string;
    header: string;
    subheader: string;
    body: string;
    url: string;
    type: string;
    publish: string;
    scheduleDate: string;
    author: string;
    featured?: {
        src: string;
    };
}

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    endpoints: (builder) => ({
        getContent: builder.query<Content, string>({
            query: (contentID) => `content/${contentID}`,
        }),
        saveContent: builder.mutation<Content, Partial<Content>>({
            query: (body) => ({
                url: 'content',
                method: 'POST',
                body,
            }),
        }),
        updateContent: builder.mutation<Content, Partial<Content> & { contentID: number }>({
            query: ({ contentID, ...body }) => ({
                url: `content/${contentID}`,
                method: 'PUT',
                body,
            }),
        }),
        deleteContent: builder.mutation<void, number>({
            query: (contentID) => ({
                url: `content/${contentID}`,
                method: 'DELETE',
            }),
        }),
        contentTags: builder.query<string[], { contentID: number; tag: string }>({
            query: ({ contentID, tag }) => `content/${contentID}/tags/?tag=${tag}`,
        }),
        saveContentTags: builder.mutation<void, { contentID: number; tag: string }>({
            query: ({ contentID, tag }) => ({
                url: `content/${contentID}/tags/`,
                method: 'POST',
                body: { tag },
            }),
        }),
    }),
});

export const { useGetContentQuery, useSaveContentMutation, useUpdateContentMutation, useDeleteContentMutation, useContentTagsQuery, useSaveContentTagsMutation } = api;
```

```typescript
// components/Page.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setPage, setNewerVersion } from '../slices/pageSlice';
import { useSaveContentMutation, useUpdateContentMutation, useDeleteContentMutation } from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import BarTop from './BarTop';
import BarActions from './BarActions';
import PgEditor from './PgEditor';
import NewVersion from './NewVersion';
import { useTranslation } from 'react-i18next';

const Page: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { url } = useParams<{ url: string }>();
    const { t } = useTranslation();

    const page = useSelector((state: RootState) => state.page);
    const users = useSelector((state: RootState) => state.users);

    const [saveContent] = useSaveContentMutation();
    const [updateContent] = useUpdateContentMutation();
    const [deleteContent] = useDeleteContentMutation();

    useEffect(() => {
        // Load page data and set to state
    }, [url, dispatch]);

    const deletePage = async () => {
        await deleteContent(page.id).unwrap();
        navigate('/new');
    };

    const savePage = async (duplicate?: boolean) => {
        if (duplicate && page.url === window.location.pathname) {
            // Handle duplicate URL error
            return;
        }

        if (!page.type) {
            // Handle no type selected error
            return;
        }

        if (!page.url || page.url === 'new') {
            // Handle no URL error
            return;
        }

        let scheduleDate: number;
        if (page.publish === 'Y' && page.publish === 'Y') {
            scheduleDate = Number(page.scheduleDate);
        } else if (page.publish === 'Y') {
            scheduleDate = Math.floor(Date.now() / 1000);
        } else if (page.publish === 'schedule') {
            scheduleDate = Math.floor(new Date(page.scheduleDate).getTime() / 1000);
            if (new Date(page.scheduleDate).getTime() < Date.now()) {
                dispatch(setPage({ publish: 'Y' }));
            } else {
                dispatch(setPage({ publish: 'N' }));
            }
        }

        const featured = page.extras.featured?.src || null;

        if (/* new page condition */) {
            const newPage = await saveContent({
                title: page.title,
                description: page.description,
                header: page.header,
                subheader: page.subheader,
                featured,
                body: page.body,
                url: page.url,
                type: page.type,
                publish: page.publish,
                scheduleDate: scheduleDate.toString(),
                author: users.id,
            }).unwrap();

            dispatch(setPage({ id: newPage.id }));
            dispatch(setPage({ autoURL: false }));
            // Save tags and extras
            navigate(newPage.url);
        } else {
            await updateContent({
                contentID: page.id,
                title: page.title,
                description: page.description,
                header: page.header,
                subheader: page.subheader,
                featured,
                body: page.body,
                url: page.url,
                type: page.type,
                publish: page.publish,
                scheduleDate: scheduleDate.toString(),
                author: users.id,
            }).unwrap();
            navigate(page.url);
        }
    };

    return (
        <div>
            {page.newerVersion && <NewVersion />}
            <BarTop />
            <BarActions onDelete={deletePage} onDuplicate={() => savePage(true)} onSave={() => savePage()} />
            <PgEditor />
        </div>
    );
};

export default Page;
```

```typescript
// components/BarTop.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { setPage } from '../slices/pageSlice';
import { useTranslation } from 'react-i18next';

const BarTop: React.FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const handleBackClick = () => {
        dispatch(setPage({ /* sidebar logic */ }));
    };

    const handleClose = () => {
        dispatch(setPage({ /* close admin panel logic */ }));
    };

    return (
        <div className="bar-top">
            <a onClick={handleBackClick}>
                <i className="fa fa-angle-left"></i>
            </a>
            <h1 className="title">{t('page_details')}</h1>
            <a className="sidebar-close" onClick={handleClose}>
                <i className="fa fa-times"></i>
            </a>
        </div>
    );
};

export default BarTop;
```

```typescript
// components/BarActions.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setConfirm } from '../slices/pageSlice';
import { useTranslation } from 'react-i18next';
import { useDeleteContentMutation } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface BarActionsProps {
    onDelete: () => void;
    onDuplicate: () => void;
    onSave: () => void;
}

const BarActions: React.FC<BarActionsProps> = ({ onDelete, onDuplicate, onSave }) => {
    const confirm = useSelector((state: RootState) => state.page.confirm);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [deleteContent] = useDeleteContentMutation();
    const navigate = useNavigate();

    const handleConfirmDelete = async () => {
        await onDelete();
        dispatch(setConfirm(false));
        navigate('/new');
    };

    return (
        <div className="bar--actions">
            {!confirm ? (
                <>
                    <button type="button" className="btn-error" onClick={() => dispatch(setConfirm(true))}>
                        {t('delete')}
                    </button>
                    <button type="button" className="btn-options" onClick={onDuplicate}>
                        {t('duplicate')}
                    </button>
                    <button type="button" className="btn-success" onClick={onSave}>
                        {t('save')}
                    </button>
                </>
            ) : (
                <>
                    <p>{t('page_delete')}</p>
                    <button type="button" className="btn-error" onClick={handleConfirmDelete}>
                        {t('yes')}
                    </button>
                    <button type="button" className="btn-success" onClick={() => dispatch(setConfirm(false))}>
                        {t('no')}
                    </button>
                </>
            )}
        </div>
    );
};

export default BarActions;
```

```typescript
// components/PgEditor.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setPage, setSuggestions } from '../slices/pageSlice';
import { useContentTagsQuery, useSaveContentTagsMutation } from '../services/api';
import { useTranslation } from 'react-i18next';

const PgEditor: React.FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const page = useSelector((state: RootState) => state.page);
    const { data: tagSuggestions } = useContentTagsQuery({ contentID: page.id, tag: '' });
    const [saveTag] = useSaveContentTagsMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        dispatch(setPage({ [name]: value }));
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        dispatch(setPage({ title: value }));
        if (page.autoURL) {
            const url = value.toLowerCase().replace(/ /g, '-').replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
            dispatch(setPage({ url }));
        }
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tags = e.target.value.split(',').map(tag => tag.trim());
        dispatch(setPage({ tags }));
    };

    const autocompleteTags = () => {
        const tag = page.tags[page.tags.length - 1];
        if (tag) {
            dispatch(setSuggestions(tagSuggestions || []));
        } else {
            dispatch(setSuggestions([]));
        }
    };

    const selectSuggestion = (tag: string) => {
        const newTags = [...page.tags];
        newTags[newTags.length - 1] = tag;
        newTags.push('');
        dispatch(setPage({ tags: newTags, suggestions: [] }));
    };

    return (
        <div className="pg-editor form-case">
            <label htmlFor="type">{t('type')}</label>
            <div className="cos-select">
                <select name="type" onChange={handleChange} value={page.type} required>
                    {page.themePages.map((themePage) => (
                        <option key={themePage} value={themePage}>
                            {themePage}
                        </option>
                    ))}
                </select>
            </div>

            <span className="num-count">{page.title.length}</span>
            <label htmlFor="title">{t('title')}</label>
            <input
                type="text"
                name="title"
                value={page.title}
                onChange={handleTitleChange}
                placeholder="about us, contact us"
            />

            <span className="num-count">{page.description.length}</span>
            <label htmlFor="description">{t('description')}</label>
            <textarea
                name="description"
                value={page.description}
                onChange={handleChange}
                placeholder="Tom's Restaurant is a diner located at 2880 Broadway (on the corner of 112th Street) in the Morningside Heights neighborhood of Manhattan in New York City."
            />

            <label htmlFor="tags">{t('tags')}</label>
            <input
                type="text"
                name="tags"
                value={page.tags.join(', ')}
                onChange={handleTagsChange}
                onBlur={autocompleteTags}
                placeholder="about, restaurant, food, nyc"
            />
            {page.suggestions.length > 0 && (
                <div className="tag-suggestions">
                    {page.suggestions.slice(0, 10).map((tag) => (
                        <a key={tag} onClick={() => selectSuggestion(tag)}>
                            {tag.charAt(0).toUpperCase() + tag.slice(1)}
                        </a>
                    ))}
                </div>
            )}

            <label htmlFor="url">{t('url')}</label>
            <input
                type="text"
                name="url"
                value={page.url}
                onChange={(e) => dispatch(setPage({ url: e.target.value, autoURL: false }))}
                placeholder="about-us, contact-us"
            />

            <div>
                <input
                    type="radio"
                    name="publish"
                    id="Y"
                    value="Y"
                    checked={page.publish === 'Y'}
                    onChange={() => dispatch(setPage({ publish: 'Y' }))}
                />
                <label htmlFor="Y">{t('publish')}</label>

                <input
                    type="radio"
                    name="publish"
                    id="N"
                    value="N"
                    checked={page.publish === 'N'}
                    onChange={() => dispatch(setPage({ publish: 'N' }))}
                />
                <label htmlFor="N">{t('draft')}</label>

                <input
                    type="radio"
                    name="publish"
                    id="schedule"
                    value="schedule"
                    checked={page.publish === 'schedule'}
                    onChange={() => dispatch(setPage({ publish: 'schedule' }))}
                />
                <label htmlFor="schedule">{t('schedule')}</label>
                {page.publish === 'schedule' && (
                    <>
                        <div className="schedule-triangle"></div>
                        <input
                            type="datetime-local"
                            className="schedule radio-inline"
                            value={page.scheduleDate}
                            onChange={(e) => dispatch(setPage({ scheduleDate: e.target.value }))}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default PgEditor;
```

```typescript
// components/NewVersion.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { setNewerVersion } from '../slices/pageSlice';
import { useTranslation } from 'react-i18next';

const NewVersion: React.FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const deleteNewerVersion = () => {
        // Implement delete newer version logic
        dispatch(setNewerVersion(false));
    };

    const localVersion = () => {
        // Implement local version logic
    };

    const useVersion = () => {
        // Implement use version logic
    };

    return (
        <div className="new-version form-case">
            <p>{t('page_newer')}</p>
            <button className="btn-error" type="button" onClick={deleteNewerVersion}>
                {t('discard')}
            </button>
            <button className="btn-options" type="button" onClick={localVersion}>
                {t('compare')}
            </button>
            <button className="btn-success" type="button" onClick={useVersion}>
                {t('use')}
            </button>
        </div>
    );
};

export default NewVersion;
```

```typescript
// components/TagSuggestions.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setPage } from '../slices/pageSlice';

const TagSuggestions: React.FC = () => {
    const dispatch = useDispatch();
    const suggestions = useSelector((state: RootState) => state.page.suggestions);

    const selectSuggestion = (tag: string) => {
        const tags = [...tags];
        tags[tags.length - 1] = tag;
        tags.push('');
        dispatch(setPage({ tags, suggestions: [] }));
    };

    return (
        <div className="tag-suggestions" style={{ display: suggestions.length ? 'block' : 'none' }}>
            {suggestions.slice(0, 10).map((tag) => (
                <a key={tag} onClick={() => selectSuggestion(tag)}>
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </a>
            ))}
        </div>
    );
};

export default TagSuggestions;
```

```typescript
// index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Page from './components/Page';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './i18n';

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Routes>
                <Route path="/new" element={<Page />} />
                <Route path="/:url" element={<Page />} />
            </Routes>
        </Router>
    </Provider>,
    document.getElementById('root')
);
```

```typescript
// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            page_details: 'Page Details',
            delete: 'Delete',
            duplicate: 'Duplicate',
            save: 'Save',
            page_delete: 'Are you sure you want to delete this page?',
            yes: 'Yes',
            no: 'No',
            page_newer: 'A newer version exists.',
            discard: 'Discard',
            compare: 'Compare',
            use: 'Use',
            type: 'Type',
            title: 'Title',
            description: 'Description',
            tags: 'Tags',
            url: 'URL',
            publish: 'Publish',
            draft: 'Draft',
            schedule: 'Schedule',
        },
    },
    // Add other languages here
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
```

```typescript
// components/Notifications.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setNotification } from '../slices/notificationSlice';

const Notifications: React.FC = () => {
    const dispatch = useDispatch();
    const notification = useSelector((state: RootState) => state.notification);

    if (!notification.message) return null;

    return (
        <div className={`notification ${notification.classes}`}>
            <p>{notification.message}</p>
            <button onClick={() => dispatch(setNotification({ message: '', classes: '' }))}>X</button>
        </div>
    );
};

export default Notifications;
```

```typescript
// slices/notificationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
    message: string;
    classes: string;
}

const initialState: NotificationState = {
    message: '',
    classes: '',
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotification(state, action: PayloadAction<NotificationState>) {
            state.message = action.payload.message;
            state.classes = action.payload.classes;
        },
    },
});

export const { setNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
```

```typescript
// Updated store.ts to include notificationSlice
import { configureStore } from '@reduxjs/toolkit';
import pageReducer from './slices/pageSlice';
import usersReducer from './slices/usersSlice';
import notificationReducer from './slices/notificationSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './services/api';

export const store = configureStore({
    reducer: {
        page: pageReducer,
        users: usersReducer,
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

```css
/* styles.css */
.bar-top, .bar--actions, .pg-editor, .new-version, .tag-suggestions, .notification {
    /* Add your styles here */
}

.btn-error {
    /* Error button styles */
}

.btn-options {
    /* Options button styles */
}

.btn-success {
    /* Success button styles */
}

.schedule-triangle {
    /* Schedule triangle styles */
}

.num-count {
    /* Character count styles */
}

/* Add other necessary styles */
```

```json
// package.json
{
  "name": "react-migration",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.1",
    "axios": "^0.27.2",
    "i18next": "^21.6.14",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-i18next": "^11.18.4",
    "react-redux": "^8.0.5",
    "react-router-dom": "^6.4.2",
    "typescript": "^4.8.4"
  },
  "devDependencies": {
    "@types/react": "^18.0.21",
    "@types/react-dom": "^18.0.6",
    "@types/react-router-dom": "^5.3.3"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}
```

```typescript
// components/Sidebar.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { setSidebar } from '../slices/pageSlice';

const Sidebar: React.FC = () => {
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(setSidebar(''));
    };

    return (
        <div className="sidebar">
            <a onClick={handleClose}>
                <i className="fa fa-times"></i>
            </a>
            {/* Sidebar content */}
        </div>
    );
};

export default Sidebar;
```

```typescript
// services/localStorage.ts
export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

export const saveState = (state: any) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch {
        // Ignore write errors
    }
};
```

```typescript
// store.ts with localStorage persistence
import { configureStore } from '@reduxjs/toolkit';
import pageReducer from './slices/pageSlice';
import usersReducer from './slices/usersSlice';
import notificationReducer from './slices/notificationSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './services/api';
import { loadState, saveState } from './services/localStorage';

const persistedState = loadState();

export const store = configureStore({
    reducer: {
        page: pageReducer,
        users: usersReducer,
        notification: notificationReducer,
        [api.reducerPath]: api.reducer,
    },
    preloadedState: persistedState,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});

store.subscribe(() => {
    saveState({
        page: store.getState().page,
        users: store.getState().users,
    });
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```typescript
// components/PublishOptions.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setPage } from '../slices/pageSlice';
import { useTranslation } from 'react-i18next';

const PublishOptions: React.FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const publish = useSelector((state: RootState) => state.page.publish);

    const handlePublishChange = (value: string) => {
        dispatch(setPage({ publish: value }));
    };

    return (
        <div>
            <input
                type="radio"
                name="publish"
                id="Y"
                value="Y"
                checked={publish === 'Y'}
                onChange={() => handlePublishChange('Y')}
            />
            <label htmlFor="Y">{t('publish')}</label>

            <input
                type="radio"
                name="publish"
                id="N"
                value="N"
                checked={publish === 'N'}
                onChange={() => handlePublishChange('N')}
            />
            <label htmlFor="N">{t('draft')}</label>

            <input
                type="radio"
                name="publish"
                id="schedule"
                value="schedule"
                checked={publish === 'schedule'}
                onChange={() => handlePublishChange('schedule')}
            />
            <label htmlFor="schedule">{t('schedule')}</label>
        </div>
    );
};

export default PublishOptions;
```

```typescript
// components/ScheduleDate.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setPage } from '../slices/pageSlice';
import { useTranslation } from 'react-i18next';

const ScheduleDate: React.FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const scheduleDate = useSelector((state: RootState) => state.page.scheduleDate);
    const publish = useSelector((state: RootState) => state.page.publish);

    if (publish !== 'schedule') return null;

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setPage({ scheduleDate: e.target.value }));
    };

    return (
        <div>
            <div className="schedule-triangle"></div>
            <input
                type="datetime-local"
                className="schedule radio-inline"
                value={scheduleDate}
                onChange={handleDateChange}
            />
        </div>
    );
};

export default ScheduleDate;
```

```typescript
// components/TagInput.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setPage, setSuggestions } from '../slices/pageSlice';
import { useContentTagsQuery, useSaveContentTagsMutation } from '../services/api';
import { useTranslation } from 'react-i18next';

const TagInput: React.FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const tags = useSelector((state: RootState) => state.page.tags);
    const suggestions = useSelector((state: RootState) => state.page.suggestions);
    const { data } = useContentTagsQuery({ contentID: 0, tag: '' });
    const [saveTag] = useSaveContentTagsMutation();

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputTags = e.target.value.split(',').map(tag => tag.trim());
        dispatch(setPage({ tags: inputTags }));
    };

    const handleBlur = () => {
        const lastTag = tags[tags.length - 1];
        if (lastTag) {
            // Fetch suggestions based on lastTag
            dispatch(setSuggestions(data || []));
        } else {
            dispatch(setSuggestions([]));
        }
    };

    const selectSuggestion = (tag: string) => {
        const newTags = [...tags];
        newTags[newTags.length - 1] = tag;
        newTags.push('');
        dispatch(setPage({ tags: newTags, suggestions: [] }));
    };

    return (
        <div>
            <label htmlFor="tags">{t('tags')}</label>
            <input
                type="text"
                name="tags"
                value={tags.join(', ')}
                onChange={handleTagsChange}
                onBlur={handleBlur}
                placeholder="about, restaurant, food, nyc"
            />
            {suggestions.length > 0 && (
                <div className="tag-suggestions">
                    {suggestions.slice(0, 10).map((tag) => (
                        <a key={tag} onClick={() => selectSuggestion(tag)}>
                            {tag.charAt(0).toUpperCase() + tag.slice(1)}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TagInput;
```

```typescript
// components/InputField.tsx
import React from 'react';

interface InputFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    placeholder?: string;
    type?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, placeholder, type = 'text' }) => {
    return (
        <div>
            <label htmlFor={name}>{label}</label>
            {type === 'textarea' ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                />
            )}
        </div>
    );
};

export default InputField;
```

```typescript
// Updated PgEditor.tsx to use new components
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setPage } from '../slices/pageSlice';
import InputField from './InputField';
import TagInput from './TagInput';
import PublishOptions from './PublishOptions';
import ScheduleDate from './ScheduleDate';
import { useTranslation } from 'react-i18next';

const PgEditor: React.FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const page = useSelector((state: RootState) => state.page);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        dispatch(setPage({ [name]: value }));
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        dispatch(setPage({ title: value }));
        if (page.autoURL) {
            const url = value.toLowerCase().replace(/ /g, '-').replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
            dispatch(setPage({ url }));
        }
    };

    return (
        <div className="pg-editor form-case">
            <InputField
                label={t('type')}
                name="type"
                value={page.type}
                onChange={handleChange}
                type="select"
            >
                <select name="type" onChange={handleChange} value={page.type} required>
                    {page.themePages.map((themePage) => (
                        <option key={themePage} value={themePage}>
                            {themePage}
                        </option>
                    ))}
                </select>
            </InputField>

            <span className="num-count">{page.title.length}</span>
            <InputField
                label={t('title')}
                name="title"
                value={page.title}
                onChange={handleTitleChange}
                placeholder="about us, contact us"
            />

            <span className="num-count">{page.description.length}</span>
            <InputField
                label={t('description')}
                name="description"
                value={page.description}
                onChange={handleChange}
                type="textarea"
                placeholder="Tom's Restaurant is a diner located at 2880 Broadway (on the corner of 112th Street) in the Morningside Heights neighborhood of Manhattan in New York City."
            />

            <TagInput />

            <InputField
                label={t('url')}
                name="url"
                value={page.url}
                onChange={(e) => dispatch(setPage({ url: e.target.value, autoURL: false }))}
                placeholder="about-us, contact-us"
            />

            <PublishOptions />
            <ScheduleDate />
        </div>
    );
};

export default PgEditor;
```

### Tokens: {'input_tokens': 5498, 'output_tokens': 12522, 'reasoning_tokens': 4608}
### Execution time: 80.05802297592163
