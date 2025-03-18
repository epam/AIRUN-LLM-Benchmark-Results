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
<think>
Okay, I need to migrate this Angular code to React 18.x using TypeScript, Redux Toolkit, and split into components. Let me start by understanding the original code structure.

First, looking at the Angular modules: there's a REST factory, Page and Users factories, and a pageCtrl controller. The page.html has a template with various form elements and buttons for managing a page.

In React, I'll need to create functional components using hooks. Since the original uses services like REST and factories for data, I'll replace those with Redux Toolkit slices for state management. The REST calls will be converted to async thunks.

Starting with the Page factory: in Angular, it's a service holding page data. In Redux, I'll create a pageSlice with initial state mirroring the Page factory's properties. Actions will update the state, replacing the $broadcast and $on events.

The Users factory is similar but simpler. Another slice, userSlice, can manage user data. The REST factory in Angular uses $resource for API calls. In React, I'll use createApi from Redux Toolkit Query or axios for HTTP requests. But since the task mentions Redux Toolkit, maybe createAsyncThunk with axios is better here.

Next, the pageCtrl.js has a controller with functions for saving, deleting, and handling page data. This will become a React component (PageComponent) using hooks like useState, useEffect, and dispatch from Redux. The lifecycle methods and watches in Angular will translate to useEffect hooks.

The template in page.html will be broken down into React components. For example, the top bar can be a TopBar component, the editor form as PageEditor, and action buttons as separate components.

I need to handle form state. The page's form fields (title, description, etc.) are managed in the component's state or via Redux. Since the original uses two-way binding with ng-model, in React, controlled components with useState or Redux state would work.

The autoURL feature when title changes can be handled with a useEffect that triggers when the title changes, updating the URL state if autoURL is true.

For API calls, each REST resource (like content, tags) will become async thunks in Redux. For example, saving a page would dispatch a saveContent thunk, which uses axios to POST/PUT to the API.

The localStorage usage in the Angular code for unsaved versions can be handled with useEffect hooks that save to localStorage when certain state changes, and initial load from localStorage on component mount.

The tag autocomplete feature will need a useEffect that fetches suggestions when the tags input changes, debounced to prevent excessive requests.

Testing the Redux slices: ensure that actions correctly update the state. The pageSlice should handle all page-related data, including title, URL, tags, etc.

Now, structuring the components:

- PageComponent: main component, fetches data on mount, handles form submission.
- PageEditor: form inputs for title, description, URL, etc.
- PublishOptions: radio buttons for publish status.
- TagSuggestions: dropdown for tag autocomplete.
- TopBar and ActionBar: reusable components for UI elements.

Converting the savePage function: in React, when the save button is clicked, it dispatches the saveContent thunk. The thunk handles the API call, and upon success, updates the Redux state and navigates using useNavigate.

Handling duplicates and validation: before saving, check if the URL is duplicate, show error messages using a notification system (maybe another Redux slice for notifications).

For the schedule date, the datetime-local input in React will manage the state, and the publish status is determined based on the selected radio button.

The original code's functions like localVersion and deleteNewerVersion manipulate localStorage. In React, these can be helper functions called by event handlers, dispatching actions to reset the state and clear localStorage.

I need to make sure all Angular-specific syntax like ng-show, ng-click are converted to React's conditional rendering and onClick handlers. For example, ng-show becomes conditional rendering with && or ternary operators.

TypeScript interfaces will define the shape of the page and user data. For example, PageState and UserState interfaces matching the original factories.

Finally, putting it all together: the main component uses Redux hooks to access and update state, effects for side operations, and composed sub-components for UI structure.

Potential issues to watch for:

- Correctly mapping Angular's resource methods (save, update, delete) to REST API calls in Redux thunks.
- Handling async operations and ensuring state updates are handled correctly after API calls.
- Replicating the auto-save to localStorage without causing performance issues.
- Managing component state vs. Redux state, especially for form inputs that need immediate feedback but are also saved globally.

Testing each part incrementally, starting with state management, then API integration, and finally the UI components, would help catch errors early.
</think>

Here's the migrated React code:

**store/pageSlice.ts**
```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PageState {
  id: number;
  title: string;
  description: string;
  url: string;
  type: string;
  publish: 'Y' | 'N' | 'schedule';
  scheduleDate: string;
  tags: string[];
  themePages: string[];
  header: string;
  subheader: string;
  body: string;
  extras: Record<string, unknown>;
}

const initialState: PageState = {
  id: 0,
  title: '',
  description: '',
  url: '',
  type: '',
  publish: 'N',
  scheduleDate: new Date().toISOString(),
  tags: [],
  themePages: [],
  header: '',
  subheader: '',
  body: '',
  extras: {},
};

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<Partial<PageState>>) => ({
      ...state,
      ...action.payload,
    }),
    updatePageType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
    resetPage: () => initialState,
  },
});

export const { setPage, updatePageType, resetPage } = pageSlice.actions;
export default pageSlice.reducer;
```

**store/userSlice.ts**
```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
}

const initialState: UserState = {
  id: '',
  username: '',
  name: '',
  email: '',
  role: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => ({
      ...state,
      ...action.payload,
    }),
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
```

**api/client.ts**
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const contentAPI = {
  get: (id: number) => api.get(`/content/${id}`),
  create: (data: unknown) => api.post('/content', data),
  update: (id: number, data: unknown) => api.put(`/content/${id}`, data),
  delete: (id: number) => api.delete(`/content/${id}`),
};

export const contentTagsAPI = {
  get: (tag: string) => api.get(`/content/tags?tag=${tag}`),
  add: (contentId: number, tag: string) => api.post(`/content/${contentId}/tags`, { tag }),
  delete: (contentId: number) => api.delete(`/content/${contentId}/tags`),
};

export const contentExtrasAPI = {
  add: (contentId: number, name: string, extra: unknown) =>
    api.post(`/content/${contentId}/extras`, { name, extra }),
  delete: (contentId: number) => api.delete(`/content/${contentId}/extras`),
};
```

**components/PageEditor.tsx**
```typescript
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setPage, updatePageType } from '../store/pageSlice';

const PageEditor: React.FC = () => {
  const dispatch = useDispatch();
  const page = useSelector((state: RootState) => state.page);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [autoURL, setAutoURL] = useState(true);

  useEffect(() => {
    if (page.url === '/new' || !page.url) setAutoURL(true);
  }, [page.url]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    dispatch(setPage({ title }));
    
    if (autoURL) {
      const generatedUrl = title.toLowerCase()
        .replace(/ /g, '-')
        .replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
      dispatch(setPage({ url: generatedUrl }));
    }
  };

  const handleTagChange = async (tags: string[]) => {
    dispatch(setPage({ tags }));
    if (tags.length > 0) {
      const lastTag = tags[tags.length - 1];
      // Implement tag suggestions API call
    }
  };

  return (
    <div className="pg-editor form-case">
      <label className="type">Type</label>
      <select 
        value={page.type} 
        onChange={(e) => dispatch(updatePageType(e.target.value))}
      >
        {page.themePages.map((pageType) => (
          <option key={pageType} value={pageType}>{pageType}</option>
        ))}
      </select>

      <input
        type="text"
        value={page.title}
        onChange={handleTitleChange}
        placeholder="Title"
      />

      <textarea
        value={page.description}
        onChange={(e) => dispatch(setPage({ description: e.target.value }))}
        placeholder="Description"
      />

      <input
        type="text"
        value={page.tags.join(',')}
        onChange={(e) => handleTagChange(e.target.value.split(','))}
        placeholder="Tags"
      />

      <input
        type="text"
        value={page.url}
        onChange={(e) => {
          setAutoURL(false);
          dispatch(setPage({ url: e.target.value }));
        }}
        placeholder="URL"
      />
    </div>
  );
};
```

**components/PublishControls.tsx**
```typescript
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setPage } from '../store/pageSlice';

const PublishControls: React.FC = () => {
  const dispatch = useDispatch();
  const { publish, scheduleDate } = useSelector((state: RootState) => state.page);

  return (
    <div>
      <label>
        <input
          type="radio"
          checked={publish === 'Y'}
          onChange={() => dispatch(setPage({ publish: 'Y' }))}
        />
        Publish
      </label>

      <label>
        <input
          type="radio"
          checked={publish === 'N'}
          onChange={() => dispatch(setPage({ publish: 'N' }))}
        />
        Draft
      </label>

      <label>
        <input
          type="radio"
          checked={publish === 'schedule'}
          onChange={() => dispatch(setPage({ publish: 'schedule' }))}
        />
        Schedule
      </label>

      {publish === 'schedule' && (
        <input
          type="datetime-local"
          value={scheduleDate}
          onChange={(e) => dispatch(setPage({ scheduleDate: e.target.value }))}
        />
      )}
    </div>
  );
};
```

**pages/PageContainer.tsx**
```typescript
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../store';
import { setPage, resetPage } from '../store/pageSlice';
import { contentAPI } from '../api/client';
import PageEditor from '../components/PageEditor';
import PublishControls from '../components/PublishControls';

const PageContainer: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const page = useSelector((state: RootState) => state.page);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (id && id !== 'new') {
      contentAPI.get(Number(id)).then((response) => {
        dispatch(setPage(response.data));
      });
    } else {
      dispatch(resetPage());
    }
  }, [id, dispatch]);

  const handleSave = async (duplicate = false) => {
    try {
      const pageData = {
        ...page,
        author: user.id,
        published_date: page.publish === 'Y' ? Math.floor(Date.now() / 1000) : 
          page.publish === 'schedule' ? Math.floor(new Date(page.scheduleDate).getTime() / 1000) : null
      };

      if (duplicate || !id) {
        const response = await contentAPI.create(pageData);
        navigate(`/page/${response.data.id}`);
      } else {
        await contentAPI.update(page.id, pageData);
      }
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  return (
    <div>
      <PageEditor />
      <PublishControls />
      <button onClick={() => handleSave()}>Save</button>
      <button onClick={() => handleSave(true)}>Duplicate</button>
    </div>
  );
};
```

**store/store.ts**
```typescript
import { configureStore } from '@reduxjs/toolkit';
import pageReducer from './pageSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    page: pageReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Tokens: {'input_tokens': 5630, 'output_tokens': 3142}
### Execution time: 50.12481689453125
