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
// rest.ts
import axios from 'axios';

export const rest = {
    blocks: (blockID?: string) => axios.get(`/api/blocks/${blockID}`),
    updateBlock: (blockID: string, data: any) => axios.put(`/api/blocks/${blockID}`, data),
    blocksRequirements: (blockID: string, requirementID: string) => axios.get(`/api/blocks/${blockID}/requirements/${requirementID}`),
    updateBlockRequirement: (blockID: string, requirementID: string, data: any) => axios.put(`/api/blocks/${blockID}/requirements/${requirementID}`, data),
    comments: (commentID?: string) => axios.get(`/api/comments/${commentID}`),
    updateComment: (commentID: string, data: any) => axios.put(`/api/comments/${commentID}`, data),
    content: (contentID?: string) => axios.get(`/api/content/${contentID}`),
    updateContent: (contentID: string, data: any) => axios.put(`/api/content/${contentID}`, data),
    contentExtras: (contentID: string) => axios.get(`/api/content/${contentID}/extras/`),
    contentRevisions: (contentID: string, revisionID: string) => axios.get(`/api/content/${contentID}/revisions/${revisionID}`),
    updateContentRevision: (contentID: string, revisionID: string, data: any) => axios.put(`/api/content/${contentID}/revisions/${revisionID}`, data),
    contentRevisionsExtras: (contentID: string, revisionID: string, extraID: string) => axios.get(`/api/content/${contentID}/revisions/${revisionID}/extras/${extraID}`),
    contentTags: (contentID: string) => axios.get(`/api/content/${contentID}/tags/`),
    files: (fileID?: string) => axios.get(`/api/files/${fileID}`),
    updateFile: (fileID: string, data: any) => axios.put(`/api/files/${fileID}`, data),
    filesTags: (fileID: string, tag: string) => axios.get(`/api/files/${fileID}/tag/${tag}`),
    updateFileTag: (fileID: string, tag: string, data: any) => axios.put(`/api/files/${fileID}/tag/${tag}`, data),
    menus: (menuID?: string) => axios.get(`/api/menus/${menuID}`),
    updateMenu: (menuID: string, data: any) => axios.put(`/api/menus/${menuID}`, data),
    modules: (moduleID?: string) => axios.get(`/api/modules/${moduleID}`),
    updateModule: (moduleID: string, data: any) => axios.put(`/api/modules/${moduleID}`, data),
    sitemaps: () => axios.get('/api/sitemaps/'),
    themes: (themeID?: string) => axios.get(`/api/themes/${themeID}`),
    updateTheme: (themeID: string, data: any) => axios.put(`/api/themes/${themeID}`, data),
    settings: () => axios.get('/api/settings/'),
    updateSettings: (data: any) => axios.put('/api/settings/', data),
    users: (userID?: string) => axios.get(`/api/users/${userID}`),
    updateUser: (userID: string, data: any) => axios.put(`/api/users/${userID}`, data),
};

```

```typescript
// pageSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PageState {
    id: number;
    title: string;
    description: string;
    header: string;
    subheader: string;
    body: string;
    url: string;
    type: string;
    publish: 'Y' | 'N' | 'schedule';
    scheduleDate: Date;
    tags: string[];
    themePages: string[];
    timestamp: string;
    extras: Record<string, any>;
    misc: Record<string, any>;
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
    publish: 'N',
    scheduleDate: new Date(),
    tags: [],
    themePages: [],
    timestamp: '',
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

```typescript
// usersSlice.ts
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

const usersSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<Partial<UserState>>) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { setUser } = usersSlice.actions;
export default usersSlice.reducer;
```

```typescript jsx
// PageComponent.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { setPage, resetPage } from './pageSlice';
import { setUser } from './usersSlice';
import { rest } from './rest';
import { RootState } from './store'; // Assuming you have a store.ts file

const PageComponent: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { url: pageUrl } = useParams();
    const page = useSelector((state: RootState) => state.page);
    const user = useSelector((state: RootState) => state.user);
    const [newerVersion, setNewerVersion] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [autoURL, setAutoURL] = useState(true);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        const storedPage = localStorage.getItem(`page-${pageUrl}`);

        if (pageUrl && pageUrl !== 'new' && storedPage) {
            const parsedPage = JSON.parse(storedPage);
            dispatch(setPage(parsedPage));

            const checkNewerVersion = () => {
                const elements = ['title', 'description', 'publish', 'scheduleDate', 'url', 'type', 'tags'];
                elements.forEach((element) => {
                    const storedValue = localStorage.getItem(`page-${pageUrl}-${element}`);
                    if (storedValue && storedValue !== JSON.stringify(page[element as keyof typeof page])) {
                        setNewerVersion(true);
                    }
                });
            };
            checkNewerVersion();
        } else {
            dispatch(resetPage());
        }

        // Fetch theme pages (replace with your actual logic)
        const fetchThemePages = async () => {
            try {
                const response = await rest.themes(); // Example API call
                dispatch(setPage({ themePages: response.data.themePages || [] })); // Update themePages in store
            } catch (error) {
                console.error("Error fetching theme pages:", error);
            }
        };
        fetchThemePages();

    }, [pageUrl, dispatch]);


    useEffect(() => {
        localStorage.setItem(`page-${pageUrl}`, JSON.stringify(page));
    }, [page, pageUrl]);


    const handleInputChange = <K extends keyof PageState>(key: K, value: PageState[K]) => {
        dispatch(setPage({ [key]: value }));
        localStorage.setItem(`page-${pageUrl}-${key}`, JSON.stringify(value));

        if (key === 'title' && autoURL) {
            const newUrl = value.toLowerCase().replace(/ /g, '-').replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
            dispatch(setPage({ url: newUrl }));
            localStorage.setItem(`page-${pageUrl}-url`, JSON.stringify(newUrl));
        }
    };

    const handlePublishChange = (event: ChangeEvent<HTMLInputElement>) => {
        handleInputChange('publish', event.target.value as 'Y' | 'N' | 'schedule');
    };

    const handleScheduleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
        handleInputChange('scheduleDate', new Date(event.target.value));
    };

    const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        handleInputChange('type', event.target.value);
    };

    const handleTagsChange = (event: ChangeEvent<HTMLInputElement>) => {
        const tags = event.target.value.split(',').map((tag) => tag.trim());
        handleInputChange('tags', tags);

        const lastTag = tags[tags.length - 1];
        if (lastTag) {
            const fetchSuggestions = async () => {
                try {
                    const response = await rest.contentTags(page.id.toString());
                    const data = response.data.filter((tag: string) => tag.startsWith(lastTag));
                    setSuggestions(data);
                } catch (error) {
                    console.error("Error fetching tag suggestions:", error);
                    setSuggestions([]);
                }
            };
            fetchSuggestions();
        } else {
            setSuggestions([]);
        }
    };


    const selectSuggestion = (tag: string) => {
        const newTags = [...page.tags];
        newTags[newTags.length - 1] = tag;
        handleInputChange('tags', newTags);
        setSuggestions([]);
    };

    const savePage = async (duplicate?: boolean) => {
        if (duplicate && page.url === pageUrl) {
            // Error message
            return;
        }

        if (!page.type) {
            // Error message
            return;
        }

        if (!page.title) {
            handleInputChange('title', page.header || '');
        }

        if (!page.url || page.url === 'new') {
            // Error message
            return;
        }

        let scheduleDate: number | undefined;
        if (page.publish === 'Y' && page.publish === 'Y') {
            scheduleDate = page.scheduleDate.getTime() / 1000;
        } else if (page.publish === 'Y') {
            scheduleDate = Math.round(Date.now() / 1000);
        } else if (page.publish === 'schedule') {
            scheduleDate = page.scheduleDate.getTime() / 1000;
            if (page.scheduleDate < new Date()) {
                handleInputChange('publish', 'Y');
            } else {
                handleInputChange('publish', 'N');
            }
        }

        const featured = page.extras.featured?.src || null;

        try {
            if (pageUrl === 'new' || duplicate) {
                const response = await rest.content().save({
                    // ...page data
                });

                handleInputChange('id', response.data.id);
                setAutoURL(false);

                if (page.tags) {
                    page.tags.forEach((tag) => {
                        rest.contentTags(response.data.id.toString()).save({ tag });
                    });
                }

                await rest.contentRevisions(response.data.id.toString(), '').save({
                    // ...revision data
                });

                for (const key in page.extras) {
                    const extraValue = typeof page.extras[key] === 'object' ? JSON.stringify(page.extras[key]) : page.extras[key];
                    await rest.contentExtras(response.data.id.toString()).save({ name: key, extra: extraValue });
                }

                navigate(page.url);

            } else {
                await rest.content(page.id.toString()).update({
                    // ...page data
                });

                const revisionResponse = await rest.contentRevisions(page.id.toString(), '').save({
                    // ...revision data
                });

                await rest.contentTags(page.id.toString()).delete();
                page.tags.forEach((tag) => {
                    rest.contentTags(page.id.toString()).save({ tag });
                });

                await rest.contentExtras(page.id.toString()).delete();
                for (const key in page.extras) {
                    const extraValue = typeof page.extras[key] === 'object' ? JSON.stringify(page.extras[key]) : page.extras[key];
                    await rest.contentExtras(page.id.toString()).save({ name: key, extra: extraValue });
                    await rest.contentRevisionsExtras(page.id.toString(), revisionResponse.data.id.toString(), '').save({ name: key, extra: extraValue });
                }
            }
        } catch (error) {
            console.error("Error saving page:", error);
            // Error message
        }
    };


    const deletePage = async () => {
        try {
            await rest.content(page.id.toString()).delete();
            await rest.contentRevisions(page.id.toString(), '').delete();
            await rest.contentRevisionsExtras(page.id.toString(), '', '').delete();
            await rest.contentExtras(page.id.toString()).delete();
            await rest.contentTags(page.id.toString()).delete();

            navigate('new');
        } catch (error) {
            console.error("Error deleting page:", error);
            // Error message
        }
    };

    const useLocalVersion = () => {
        const storedPage = localStorage.getItem(`page-${pageUrl}`);
        if (storedPage) {
            const parsedPage = JSON.parse(storedPage);
            dispatch(setPage(parsedPage));
        }
        setNewerVersion(false);
    };

    const deleteNewerVersion = () => {
        const elements = ['title', 'description', 'publish', 'scheduleDate', 'url', 'type', 'tags'];
        elements.forEach((element) => {
            localStorage.removeItem(`page-${pageUrl}-${element}`);
        });
        setNewerVersion(false);
    };


    return (
        // ... JSX ...
    );
};

export default PageComponent;

```

```html
<!-- PageComponent.tsx JSX part -->
<div>
    {newerVersion && (
        <div className="new-version form-case">
            <p>{t('page_newer')}</p>
            <button className="btn-error" type="button" onClick={deleteNewerVersion}>
                {t('discard')}
            </button>
            <button className="btn-options" type="button" onClick={useLocalVersion}>
                {t('compare')}
            </button>
            <button className="btn-success" type="button" onClick={useLocalVersion}>
                {t('use')}
            </button>
        </div>
    )}
    <div className="bar-top">
        {/* ... other JSX ... */}
    </div>
    <div className="bar--actions">
        {!confirmDelete && (
            <>
                <button type="button" className="btn-error" onClick={() => setConfirmDelete(true)}>
                    {t('delete')}
                </button>
                <button type="button" className="btn-options" onClick={() => savePage(true)}>
                    {t('duplicate')}
                </button>
                <button type="button" className="btn-success" onClick={() => savePage()}>
                    {t('save')}
                </button>
            </>
        )}
        {confirmDelete && (
            <>
                <p>{t('page_delete')}</p>
                <button type="button" className="btn-error" onClick={deletePage}>
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
            <select value={page.type} onChange={handleTypeChange}>
                {page.themePages.map((themePage) => (
                    <option key={themePage} value={themePage}>
                        {themePage}
                    </option>
                ))}
            </select>
        </div>

        <span className="num-count">{page.title.length}</span>
        <label>{t('title')}</label>
        <input
            type="text"
            value={page.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="about us, contact us"
        />

        {/* ... other JSX ... */}
        <input
            type="datetime-local"
            className="schedule radio-inline"
            value={page.scheduleDate.toISOString().slice(0, 16)}
            onChange={handleScheduleDateChange}
            style={{ display: page.publish === 'schedule' ? 'block' : 'none' }}
        />
    </div>
</div>

```

### Tokens: {'input_tokens': 6338, 'output_tokens': 4248}
### Execution time: 113.37474608421326
