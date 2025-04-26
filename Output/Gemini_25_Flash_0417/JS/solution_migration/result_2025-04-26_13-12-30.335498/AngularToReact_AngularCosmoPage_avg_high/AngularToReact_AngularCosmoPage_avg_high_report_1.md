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
### Answer:
Okay, let's break down this migration task. We need to translate the Angular 1.x concepts (factories, controllers, scope, $resource, directives, routing, i18n, local storage) into their modern React 18.x, TypeScript, and Redux Toolkit equivalents.

Here's a plan and the resulting code structure:

**Migration Plan:**

1.  **Identify Core Data Models:** `Page`, `User`, `Block`, `Comment`, `Content`, `File`, `Menu`, `Module`, `Sitemap`, `Theme`, `Setting`, `Tag`, `Requirement`, `Revision`, `Extra`. Define TypeScript interfaces for these.
2.  **API Layer:** Replace `$resource` with a dedicated API service using `fetch` or `axios`. Create functions for each endpoint defined in `REST.js`.
3.  **Global State Management (Redux Toolkit):**
    *   Create slices for `page` (the page being edited), `user` (current user), `notifications`, and potentially `tags` (for autocomplete suggestions).
    *   The `Page` factory's role as a global holder of the *current* page data will be handled by the `pageSlice`.
    *   The `Users` factory's role will be handled by the `userSlice`.
4.  **Component Structure:**
    *   The `pageCtrl` logic and `page.html` template will be combined into a single functional React component, likely named `PageEditor`.
    *   Break down the HTML template into smaller, reusable components if necessary (e.g., a `FormInput`, `SelectInput`, `RadioGroup`, `TagInput` component).
5.  **Routing (React Router):** Set up routes for `/pages/:url` and `/pages/new`. Use `useParams` to get the `url`.
6.  **Form Handling:** Use controlled components (`useState`) for form inputs. Handle `onChange`, `onKeyUp`, etc. Implement the `ng-list` behavior for tags manually.
7.  **Side Effects (React Hooks & Redux Thunks):**
    *   `useEffect`: For fetching initial data, checking local storage on mount, saving to local storage on data changes (potentially debounced).
    *   Redux Thunks: For complex asynchronous operations like `savePage` and `deletePage`, which involve multiple API calls and state updates.
8.  **Internationalization (react-i18next):** Set up the library, create translation files, and use the `useTranslation` hook.
9.  **Local Storage:** Use the browser's `localStorage` API directly or wrap it in a custom hook.
10. **Validation:** Implement validation logic within the component or a thunk before dispatching save actions.
11. **Notifications:** Handle the `$rootScope.$broadcast('notify', ...)` by dispatching actions to a `notificationSlice` and having a global `NotificationDisplay` component listen to that slice.

**Code Structure:**

```
src/
├── api/
│   └── apiService.ts
├── components/
│   ├── PageEditor/
│   │   ├── PageEditor.tsx
│   │   └── PageEditor.types.ts
│   └── common/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Textarea.tsx
│       ├── RadioGroup.tsx
│       ├── TagInput.tsx // Custom component for ng-list behavior
│       └── NotificationDisplay.tsx
├── features/
│   ├── page/
│   │   ├── pageSlice.ts
│   │   └── page.types.ts
│   ├── user/
│   │   ├── userSlice.ts
│   │   └── user.types.ts
│   ├── notification/
│   │   ├── notificationSlice.ts
│   │   └── notification.types.ts
│   └── tags/
│       ├── tagsSlice.ts
│       └── tags.types.ts
├── hooks/
│   ├── useLocalStorage.ts
│   └── useTranslation.ts // Wrapper for react-i18next
├── types/
│   └── index.ts // Export all interfaces
├── utils/
│   ├── dateUtils.ts
│   └── stringUtils.ts // For URL slug
├── i18n/
│   ├── index.ts // i18n setup
│   └── locales/
│       └── en.json // Example translation file
├── store/
│   ├── index.ts // Store setup
│   └── rootReducer.ts
├── App.tsx // Router setup, Redux Provider, i18n Provider
├── index.tsx // Entry point
└── react-app-env.d.ts // TypeScript environment types
```

Let's start implementing the key parts.

**1. TypeScript Interfaces (`src/types/index.ts`)**

```typescript
// src/types/index.ts

export interface Page {
  id: number | null;
  title: string;
  description: string;
  header: string;
  subheader: string;
  body: string;
  url: string;
  type: string;
  publish: 'Y' | 'N' | 'schedule';
  published_date: number | null; // Timestamp in seconds
  themePages: string[];
  timestamp: number | null; // Creation/Update timestamp?
  extras: Record<string, any>; // Use Record<string, any> for arbitrary extras
  misc: Record<string, any>; // Use Record<string, any> for arbitrary misc
  tags: string[]; // Assuming tags are stored as an array
  scheduleDate: string | null; // For datetime-local input (ISO string or similar)
  suggestions?: string[]; // For tag autocomplete suggestions
}

export interface User {
  id: string | number | null;
  username: string;
  name: string;
  bio: string;
  email: string;
  facebook: string;
  twitter: string;
  photo: string;
  role: string;
}

// Define interfaces for API responses if they differ significantly
// For simplicity, assuming API returns structures similar to the interfaces above
// or simple success/error objects.

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  // Add other common API response fields
}

export interface TagSuggestion {
  tag: string; // Assuming the API returns an array of objects like { tag: '...' }
}

// Add interfaces for other entities if needed (Block, Comment, etc.)
// based on how they are used in the application, though only Page and User
// are directly manipulated in the provided code.
```

**2. API Service (`src/api/apiService.ts`)**

Using `fetch` for simplicity. You could easily swap this for `axios`.

```typescript
// src/api/apiService.ts

import { Page, TagSuggestion } from '../types';

const API_BASE_URL = '/api'; // Adjust if your API is hosted elsewhere

interface SavePagePayload {
  title: string;
  description: string;
  header: string;
  subheader: string;
  featured: string | null;
  body: string;
  url: string;
  type: string;
  published: 'Y' | 'N' | 'schedule';
  published_date: number | null;
  author: string | number | null;
}

interface UpdatePagePayload extends SavePagePayload {
  contentID: number;
}

interface SaveTagPayload {
  contentID: number;
  tag: string;
}

interface SaveExtraPayload {
  contentID: number;
  name: string;
  extra: any; // Can be stringified JSON
}

interface SaveRevisionPayload extends SavePagePayload {
  contentID: number;
}

interface SaveRevisionExtraPayload {
  revisionID: number;
  contentID: number;
  name: string;
  extra: any; // Can be stringified JSON
}


const request = async <T>(
  url: string,
  method: string,
  data?: any
): Promise<T> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${url}`, config);

  if (!response.ok) {
    // Basic error handling
    const error = await response.json();
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  // Handle cases where the API might return no body (e.g., DELETE)
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

// --- Content Endpoints ---
export const getContent = (contentID: number): Promise<Page> =>
  request<Page>(`/content/${contentID}`, 'GET');

export const saveContent = (payload: SavePagePayload): Promise<{ id: number }> =>
  request<{ id: number }>('/content', 'POST', payload); // Assuming POST for new

export const updateContent = (payload: UpdatePagePayload): Promise<any> =>
  request<any>(`/content/${payload.contentID}`, 'PUT', payload);

export const deleteContent = (contentID: number): Promise<any> =>
  request<any>(`/content/${contentID}`, 'DELETE');

// --- Content Tags Endpoints ---
export const getContentTags = (contentID: number): Promise<string[]> =>
  request<string[]>(`/content/${contentID}/tags/`, 'GET'); // Assuming GET returns array of tags

export const saveContentTag = (payload: SaveTagPayload): Promise<any> =>
  request<any>(`/content/${payload.contentID}/tags/`, 'POST', payload); // Assuming POST to add a tag

export const deleteContentTags = (contentID: number): Promise<any> =>
  request<any>(`/content/${contentID}/tags/`, 'DELETE'); // Assuming DELETE without tagID deletes all

export const getTagSuggestions = (tag: string): Promise<TagSuggestion[]> =>
  request<TagSuggestion[]>(`/contentTags?tag=${encodeURIComponent(tag)}`, 'GET'); // Assuming a query endpoint

// --- Content Extras Endpoints ---
export const getContentExtras = (contentID: number): Promise<Record<string, any>> =>
  request<Record<string, any>>(`/content/${contentID}/extras/`, 'GET'); // Assuming GET returns key-value object

export const saveContentExtra = (payload: SaveExtraPayload): Promise<any> =>
  request<any>(`/content/${payload.contentID}/extras/`, 'POST', payload); // Assuming POST to add/update extra

export const deleteContentExtras = (contentID: number): Promise<any> =>
  request<any>(`/content/${contentID}/extras/`, 'DELETE'); // Assuming DELETE without extraID deletes all

// --- Content Revisions Endpoints ---
export const saveContentRevision = (payload: SaveRevisionPayload): Promise<{ id: number }> =>
  request<{ id: number }>(`/content/${payload.contentID}/revisions`, 'POST', payload); // Assuming POST for new revision

export const deleteContentRevisions = (contentID: number): Promise<any> =>
  request<any>(`/content/${contentID}/revisions`, 'DELETE'); // Assuming DELETE without revisionID deletes all

// --- Content Revisions Extras Endpoints ---
export const saveContentRevisionExtra = (payload: SaveRevisionExtraPayload): Promise<any> =>
  request<any>(`/content/${payload.contentID}/revisions/${payload.revisionID}/extras`, 'POST', payload); // Assuming POST

export const deleteContentRevisionsExtras = (contentID: number): Promise<any> =>
  request<any>(`/content/${contentID}/revisions/extras`, 'DELETE'); // Assuming DELETE without revisionID/extraID deletes all for contentID

// --- Other Endpoints (as defined in REST.js, add as needed) ---
// export const getBlocks = () => request('/blocks', 'GET');
// export const updateBlock = (blockID, payload) => request(`/blocks/${blockID}`, 'PUT', payload);
// ... and so on for comments, files, menus, modules, sitemaps, themes, settings, users
```

**3. Redux Slices (`src/features/`)**

*   **`page.types.ts`**: Already defined in `src/types/index.ts`.
*   **`pageSlice.ts`**:

```typescript
// src/features/page/pageSlice.ts

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Page, User } from '../../types';
import * as apiService from '../../api/apiService';
import { showNotification } from '../notification/notificationSlice';
import { RootState } from '../../store'; // Import RootState for thunk access
import { t } from 'i18next'; // Assuming i18n setup allows direct access or use hook in component

// Define the state shape for the page editor
interface PageState {
  currentPage: Page;
  isLoading: boolean;
  error: string | null;
  newerVersion: boolean; // State for the local storage check UI
  confirmDelete: boolean; // State for the delete confirmation UI
  autoURL: boolean; // State for auto-generating URL
  tagSuggestions: string[]; // State for tag autocomplete suggestions
}

// Initial state based on the Angular factory defaults
const initialState: PageState = {
  currentPage: {
    id: null,
    title: '',
    description: '',
    header: '',
    subheader: '',
    body: '',
    url: '',
    type: '',
    publish: 'N', // Default to draft? Angular had empty string, let's pick a default
    published_date: null,
    themePages: [],
    timestamp: null,
    extras: {},
    misc: {},
    tags: [],
    scheduleDate: null,
  },
  isLoading: false,
  error: null,
  newerVersion: false,
  confirmDelete: false,
  autoURL: true, // Default to true for new pages
  tagSuggestions: [],
};

// --- Async Thunks ---

// Thunk to fetch page data
export const fetchPage = createAsyncThunk<
  Page, // Return type of the payload creator
  number, // Argument type of the payload creator (contentID)
  { rejectValue: string } // Types for ThunkAPI: {state, dispatch, extra, rejectValue}
>('page/fetchPage', async (contentID, { rejectWithValue }) => {
  try {
    const pageData = await apiService.getContent(contentID);
    // Fetch related data if needed, e.g., tags, extras
    const tags = await apiService.getContentTags(contentID);
    const extras = await apiService.getContentExtras(contentID);

    // Combine fetched data
    return {
      ...pageData,
      tags: tags || [], // Ensure tags is an array
      extras: extras || {}, // Ensure extras is an object
      // Note: themePages, timestamp, misc might need separate fetches or come with pageData
      // scheduleDate might need conversion from timestamp
      scheduleDate: pageData.published_date ? new Date(pageData.published_date * 1000).toISOString().slice(0, 16) : null, // Convert timestamp to datetime-local format
    } as Page; // Cast to Page interface
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch page');
  }
});

// Thunk to save or update page data
export const savePage = createAsyncThunk<
  { id: number }, // Return type of the payload creator (assuming API returns { id: ... })
  { duplicate: boolean; currentUrl: string }, // Argument type (duplicate flag, current route URL)
  { state: RootState; rejectValue: string; dispatch: any } // ThunkAPI types
>('page/savePage', async ({ duplicate, currentUrl }, { getState, dispatch, rejectWithValue }) => {
  const state = getState() as RootState;
  const page = state.page.currentPage;
  const currentUser = state.user.currentUser; // Get user from userSlice

  // --- Validation (replicated from Angular controller) ---
  if (duplicate && page.url === currentUrl) {
    dispatch(showNotification({ message: t('page_different_url'), classes: 'alert-error' }));
    return rejectWithValue('Duplicate URL for duplicate action');
  }
  if (!page.type) {
    dispatch(showNotification({ message: t('page_no_type_selected'), classes: 'alert-error' }));
    return rejectWithValue('No page type selected');
  }
  if (!page.url || page.url.length === 0 || page.url === 'new') {
    dispatch(showNotification({ message: t('page_no_url'), classes: 'alert-error' }));
    return rejectWithValue('No page URL provided');
  }
  // If no custom title, use header? (Angular logic, might need adjustment)
  // if (!page.title && page.header) { page.title = page.header; } // This modifies state directly, better handle before dispatch

  // --- Prepare Payload ---
  let scheduleDateTimestamp: number | null = null;
  if (page.publish === 'Y' && state.page.currentPage.publish === 'Y') { // Check against original state if needed, or simplify
      // If already published and staying published, keep original date? Or update?
      // Angular kept original date if already published. Let's replicate.
      // This requires knowing the *original* published_date, which isn't in currentPage state after edits.
      // A better approach might be to fetch the original page state or pass it.
      // For now, let's assume if publish is 'Y', we set it to now, unless it was already 'Y' and we explicitly want to keep the old date (complex).
      // Let's follow the Angular logic: if already 'Y', keep old date. If changing to 'Y', set to now.
      // This requires comparing current state to state *before* edits, which is hard in a simple slice.
      // Alternative: API handles this logic. Or, pass original date.
      // Let's simplify: If publish is 'Y', set date to now. If 'schedule', use scheduleDate. If 'N', null.
       scheduleDateTimestamp = Math.round(Date.now() / 1000); // Publish now
  } else if (page.publish === 'schedule' && page.scheduleDate) {
      const scheduledTime = Date.parse(page.scheduleDate);
      if (isNaN(scheduledTime)) {
           dispatch(showNotification({ message: t('page_invalid_schedule_date'), classes: 'alert-error' }));
           return rejectWithValue('Invalid schedule date');
      }
      scheduleDateTimestamp = Math.round(scheduledTime / 1000);
      // Angular logic: if scheduled date is in the past, change publish to 'Y'
      if (scheduledTime < Date.now()) {
          page.publish = 'Y'; // Modify state before sending? Or let API handle? Let's modify state for consistency
          scheduleDateTimestamp = Math.round(Date.now() / 1000); // Set to now if backdated
      } else {
           page.publish = 'N'; // Set to draft if scheduled for future
      }
  } else {
      scheduleDateTimestamp = null; // Draft or 'N'
  }


  const featured = page.extras?.featured?.src || null; // Assuming featured image is in extras

  const payload: SavePagePayload = {
    title: page.title || page.header, // Apply Angular title fallback here
    description: page.description,
    header: page.header,
    subheader: page.subheader,
    featured: featured,
    body: page.body,
    url: page.url,
    type: page.type,
    published: page.publish,
    published_date: scheduleDateTimestamp,
    author: currentUser?.id || null, // Use user ID from state
  };

  try {
    let contentId: number;
    let revisionId: number;

    if (currentUrl === '/new' || duplicate) {
      // --- Create New Page ---
      const newPageResponse = await apiService.saveContent(payload);
      contentId = newPageResponse.id;

      // Update state with new ID and URL immediately? Or after all saves?
      // Angular redirects after the *first* save promise resolves. Let's replicate.
      // Dispatch an action to update the URL in the component/router?
      // Or handle redirection *after* the thunk completes successfully in the component.
      // Let's handle redirection in the component after the thunk returns the new ID.

      // Save tags
      if (page.tags && page.tags.length > 0) {
        await Promise.all(page.tags.map(tag => apiService.saveContentTag({ contentID: contentId, tag: tag })));
      }

      // Save revision
      const revisionResponse = await apiService.saveContentRevision({ ...payload, contentID: contentId });
      revisionId = revisionResponse.id;

      // Save extras and revision extras
      const extraKeys = Object.keys(page.extras);
      if (extraKeys.length > 0) {
        await Promise.all(extraKeys.map(key => {
          const extraValue = typeof page.extras[key] === 'object' ? JSON.stringify(page.extras[key]) : page.extras[key];
          return Promise.all([
            apiService.saveContentExtra({ contentID: contentId, name: key, extra: extraValue }),
            apiService.saveContentRevisionExtra({ revisionID: revisionId, contentID: contentId, name: key, extra: extraValue }),
          ]);
        }));
      }

      dispatch(showNotification({ message: t('page_created') }));
      return { id: contentId }; // Return the new ID

    } else {
      // --- Update Existing Page ---
      if (page.id === null) {
         // Should not happen if currentUrl is not /new, but safety check
         return rejectWithValue('Page ID is missing for update');
      }
      contentId = page.id;

      await apiService.updateContent({ ...payload, contentID: contentId });

      // Save revision first? Angular saved revision *after* updating content but *before* deleting old tags/extras.
      // Let's follow Angular's sequence: Update content -> Save revision -> Delete old tags -> Save new tags -> Delete old extras -> Save new extras.
      const revisionResponse = await apiService.saveContentRevision({ ...payload, contentID: contentId });
      revisionId = revisionResponse.id;

      // Delete old tags
      await apiService.deleteContentTags(contentId);
      // Save new tags
      if (page.tags && page.tags.length > 0) {
         await Promise.all(page.tags.map(tag => apiService.saveContentTag({ contentID: contentId, tag: tag })));
      }

      // Delete old extras
      await apiService.deleteContentExtras(contentId);
      // Save new extras and revision extras
      const extraKeys = Object.keys(page.extras);
      if (extraKeys.length > 0) {
         await Promise.all(extraKeys.map(key => {
           const extraValue = typeof page.extras[key] === 'object' ? JSON.stringify(page.extras[key]) : page.extras[key];
           return Promise.all([
             apiService.saveContentExtra({ contentID: contentId, name: key, extra: extraValue }),
             apiService.saveContentRevisionExtra({ revisionID: revisionId, contentID: contentId, name: key, extra: extraValue }),
           ]);
         }));
      }

      // Angular notified *after* the last extra save promise.
      // If no extras, notify after deleting extras.
      if (extraKeys.length === 0) {
         dispatch(showNotification({ message: t('page_updated') }));
      } else {
         // Notification will be handled by the last extra save promise resolution in Angular.
         // Here, we can just notify once all promises resolve.
         dispatch(showNotification({ message: t('page_updated') }));
      }

      return { id: contentId }; // Return the updated ID

    }
  } catch (error: any) {
    // Handle errors from any of the API calls
    const errorMessage = error.message || (currentUrl === '/new' || duplicate ? t('page_error_saving') : t('page_error_updating'));
    dispatch(showNotification({ message: errorMessage, classes: 'alert-error' }));
    return rejectWithValue(errorMessage);
  }
});

// Thunk to delete page data
export const deletePage = createAsyncThunk<
  void, // Return type (no payload needed on success)
  number, // Argument type (contentID)
  { rejectValue: string; dispatch: any } // ThunkAPI types
>('page/deletePage', async (contentID, { dispatch, rejectWithValue }) => {
  try {
    // Angular deleted sequentially. Let's replicate or do in parallel if safe.
    // DELETE /api/content/:contentID
    await apiService.deleteContent(contentID);
    // DELETE /api/content/:contentID/revisions
    await apiService.deleteContentRevisions(contentID);
    // DELETE /api/content/:contentID/revisions/extras/:extraID (Angular had contentID only?)
    // Assuming the Angular call `REST.contentRevisionsExtras.delete({ contentID: $scope.page.id });`
    // meant delete all revision extras for that content ID.
    await apiService.deleteContentRevisionsExtras(contentID);
    // DELETE /api/content/:contentID/extras/
    await apiService.deleteContentExtras(contentID);
    // DELETE /api/content/:contentID/tags/
    await apiService.deleteContentTags(contentID);

    dispatch(showNotification({ message: t('deleted') }));

    // Angular redirects to 'new' after delete. Handle this in the component.

  } catch (error: any) {
    const errorMessage = error.message || t('page_error_deleting');
    dispatch(showNotification({ message: errorMessage, classes: 'alert-error' }));
    return rejectWithValue(errorMessage);
  }
});

// Thunk for tag autocomplete suggestions
export const fetchTagSuggestions = createAsyncThunk<
  string[], // Return type (array of tag strings)
  string, // Argument type (tag query)
  { rejectValue: string }
>('page/fetchTagSuggestions', async (tagQuery, { rejectWithValue }) => {
  if (!tagQuery) {
    return []; // Return empty array if query is empty
  }
  try {
    const suggestions = await apiService.getTagSuggestions(tagQuery);
    // Assuming API returns [{ tag: '...' }, ...]
    return suggestions.map(item => item.tag);
  } catch (error: any) {
    // Don't show error notification for no suggestions found, just return empty
    // Angular had a separate error callback for this.
    // Let's check the error response status if possible, or assume any error means no suggestions.
    console.error("Error fetching tag suggestions:", error); // Log error for debugging
    return []; // Return empty array on error
  }
});


// --- Slice Definition ---
const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    // Action to set the entire page state (e.g., after fetching)
    setPage(state, action: PayloadAction<PageState['currentPage']>) {
      state.currentPage = action.payload;
      // Also update local UI state based on fetched data if needed
      state.autoURL = !action.payload.url || action.payload.url === 'new'; // Re-evaluate autoURL based on fetched data
      state.newerVersion = false; // Reset newer version flag when page is loaded
      state.confirmDelete = false; // Reset delete confirmation
    },
    // Actions to update individual fields (controlled components)
    updatePageField<FieldName extends keyof PageState['currentPage']>(
      state,
      action: PayloadAction<{ field: FieldName; value: PageState['currentPage'][FieldName] }>
    ) {
      const { field, value } = action.payload;
      // Special handling for tags (ng-list behavior) might be needed in component or here
      // For now, assume value is the correctly parsed array from the component
      (state.currentPage[field] as any) = value; // Use 'any' temporarily if types are complex

      // Handle autoURL logic here or in component's title change handler
      if (field === 'title' && state.autoURL) {
         state.currentPage.url = String(value).toLowerCase().replace(/ /g, '-').replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
      }
    },
    // Action to set theme pages (fetched elsewhere, e.g., initial app load)
    setThemePages(state, action: PayloadAction<string[]>) {
        state.currentPage.themePages = action.payload;
        // If page type is not set, default to the first theme page
        if (!state.currentPage.type && action.payload.length > 0) {
            state.currentPage.type = action.payload[0];
        }
    },
    // Action to set extras (fetched elsewhere or updated)
    setPageExtras(state, action: PayloadAction<Record<string, any>>) {
        state.currentPage.extras = action.payload;
    },
     // Action to set misc (fetched elsewhere or updated)
    setPageMisc(state, action: PayloadAction<Record<string, any>>) {
        state.currentPage.misc = action.payload;
    },
    // Action to toggle delete confirmation UI
    setConfirmDelete(state, action: PayloadAction<boolean>) {
        state.confirmDelete = action.payload;
    },
    // Action to set newer version flag (from local storage check)
    setNewerVersion(state, action: PayloadAction<boolean>) {
        state.newerVersion = action.payload;
    },
    // Action to reset page state (e.g., navigating to /new)
    resetPage(state) {
        state.currentPage = initialState.currentPage;
        state.isLoading = false;
        state.error = null;
        state.newerVersion = false;
        state.confirmDelete = false;
        state.autoURL = true; // Reset autoURL for new page
        state.tagSuggestions = []; // Clear suggestions
    },
    // Action to set tag suggestions
    setTagSuggestions(state, action: PayloadAction<string[]>) {
        state.tagSuggestions = action.payload;
    },
    // Action to add a selected tag suggestion (used by component)
    addTagSuggestion(state, action: PayloadAction<string>) {
        const tagToAdd = action.payload;
        // Find the last tag being edited (assuming ng-list behavior)
        const lastTagIndex = state.currentPage.tags.length > 0 ? state.currentPage.tags.length - 1 : 0;
        // Replace the last tag (which might be partial) with the suggestion
        state.currentPage.tags[lastTagIndex] = tagToAdd;
        // Add an empty string at the end to allow typing the next tag
        state.currentPage.tags.push('');
        state.tagSuggestions = []; // Clear suggestions after selection
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Page
      .addCase(fetchPage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPage = action.payload;
        state.autoURL = !action.payload.url || action.payload.url === 'new'; // Re-evaluate autoURL
      })
      .addCase(fetchPage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch page';
        // Optionally reset page state on error? Or show error message only.
        // state.currentPage = initialState.currentPage;
      })
      // Save Page
      .addCase(savePage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(savePage.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update page ID if it was a new page save
        if (state.currentPage.id === null) {
            state.currentPage.id = action.payload.id;
            state.autoURL = false; // Disable autoURL after first save
        }
        // Clear local storage flags after successful save
        state.newerVersion = false;
        // Note: The component will handle redirection based on success
      })
      .addCase(savePage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to save page';
      })
      // Delete Page
      .addCase(deletePage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePage.fulfilled, (state) => {
        state.isLoading = false;
        // Reset page state after successful delete
        state.currentPage = initialState.currentPage;
        state.confirmDelete = false; // Hide confirmation
        state.autoURL = true; // Reset autoURL for the new blank state
        // Note: The component will handle redirection after delete
      })
      .addCase(deletePage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete page';
        state.confirmDelete = false; // Hide confirmation on error
      })
      // Fetch Tag Suggestions
      .addCase(fetchTagSuggestions.fulfilled, (state, action) => {
        state.tagSuggestions = action.payload;
      })
      .addCase(fetchTagSuggestions.rejected, (state) => {
        state.tagSuggestions = []; // Clear suggestions on error
      });
  },
});

export const {
  setPage,
  updatePageField,
  setThemePages,
  setPageExtras,
  setPageMisc,
  setConfirmDelete,
  setNewerVersion,
  resetPage,
  setTagSuggestions,
  addTagSuggestion,
} = pageSlice.actions;

export default pageSlice.reducer;
```

*   **`user.types.ts`**: Already defined in `src/types/index.ts`.
*   **`userSlice.ts`**:

```typescript
// src/features/user/userSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface UserState {
  currentUser: User | null;
  // Add loading/error state if fetching user data
}

const initialState: UserState = {
  currentUser: { // Initialize with default empty user or null
    id: null, username: '', name: '', bio: '', email: '',
    facebook: '', twitter: '', photo: '', role: ''
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<User | null>) {
      state.currentUser = action.payload;
    },
    // Add other user-related actions if needed
  },
});

export const { setCurrentUser } = userSlice.actions;

export default userSlice.reducer;
```

*   **`notification.types.ts`**:

```typescript
// src/features/notification/notification.types.ts

export interface Notification {
  id: string; // Unique ID for the notification
  message: string;
  classes?: string; // CSS classes for styling (e.g., 'alert-error', 'alert-success')
  duration?: number; // How long to show (ms), 0 for sticky
}
```

*   **`notificationSlice.ts`**:

```typescript
// src/features/notification/notificationSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from './notification.types';
import { v4 as uuidv4 } from 'uuid'; // Need a UUID library for unique IDs

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification(state, action: PayloadAction<{ message: string; classes?: string; duration?: number }>) {
      const newNotification: Notification = {
        id: uuidv4(), // Generate unique ID
        message: action.payload.message,
        classes: action.payload.classes,
        duration: action.payload.duration ?? 5000, // Default duration 5 seconds
      };
      state.notifications.push(newNotification);
    },
    hideNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearAllNotifications(state) {
      state.notifications = [];
    }
  },
});

export const { showNotification, hideNotification, clearAllNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
```

**4. Redux Store Setup (`src/store/`)**

*   **`rootReducer.ts`**:

```typescript
// src/store/rootReducer.ts

import { combineReducers } from '@reduxjs/toolkit';
import pageReducer from '../features/page/pageSlice';
import userReducer from '../features/user/userSlice';
import notificationReducer from '../features/notification/notificationSlice';
// Import other reducers here

const rootReducer = combineReducers({
  page: pageReducer,
  user: userReducer,
  notification: notificationReducer,
  // Add other reducers here
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
```

*   **`index.ts`**:

```typescript
// src/store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

const store = configureStore({
  reducer: rootReducer,
  // devTools: process.env.NODE_ENV !== 'production', // DevTools are enabled by default in RTK
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(myCustomMiddleware), // Add custom middleware if needed
});

export type AppDispatch = typeof store.dispatch;

export default store;
```

**5. Internationalization (`src/i18n/`)**

*   **`locales/en.json`**: (Example, add all translations from Angular)

```json
// src/i18n/locales/en.json
{
  "page_newer": "There is a newer unsaved version of this page in your browser.",
  "discard": "Discard",
  "compare": "Compare",
  "use": "Use",
  "page_details": "Page Details",
  "delete": "Delete",
  "duplicate": "Duplicate",
  "save": "Save",
  "page_delete": "Are you sure you want to delete this page?",
  "yes": "Yes",
  "no": "No",
  "type": "Type",
  "title": "Title",
  "description": "Description",
  "tags": "Tags",
  "url": "URL",
  "publish": "Publish",
  "draft": "Draft",
  "schedule": "Schedule",
  "page_different_url": "Cannot duplicate to the same URL. Please change the URL.",
  "page_no_type_selected": "Please select a page type.",
  "page_no_url": "Please provide a URL for the page.",
  "page_error_saving": "Error saving page.",
  "page_error_updating": "Error updating page.",
  "page_created": "Page created successfully!",
  "saved": "Saved!",
  "page_updated": "Page updated successfully!",
  "deleted": "Deleted successfully!",
  "page_error_deleting": "Error deleting page.",
  "page_invalid_schedule_date": "Invalid schedule date."
}
```

*   **`index.ts`**:

```typescript
// src/i18n/index.ts

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import en from './locales/en.json';
// import es from './locales/es.json'; // Add other languages

const resources = {
  en: {
    translation: en,
  },
  // es: {
  //   translation: es,
  // },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en', // fallback language if translation is not found
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;

// Optional: Export t function directly if needed in non-component files (like thunks)
// Be cautious with this, hooks are preferred in components.
export { t } from 'i18next';
```

*   **`hooks/useTranslation.ts`**: (Optional wrapper, or just use `react-i18next`'s `useTranslation` directly)

```typescript
// src/hooks/useTranslation.ts

import { useTranslation as useReactI18nextTranslation } from 'react-i18next';

export const useTranslation = () => {
  const { t, i18n } = useReactI18nextTranslation();
  return { t, i18n };
};
```

**6. Local Storage Hook (`src/hooks/useLocalStorage.ts`)**

```typescript
// src/hooks/useLocalStorage.ts

import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = (value: T | ((val: T) => T)) => void;

function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  // State to store our value
  // Pass initial state function to useState so logic is only run once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setValue: SetValue<T> = useCallback((value) => {
    if (typeof window === 'undefined') {
      console.warn('localStorage is not available');
      return;
    }
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error writing localStorage key "${key}":`, error);
    }
  }, [key, storedValue]); // Include storedValue in dependency array if the setter function might depend on the current state

  // Optional: Add effect to sync state if localStorage changes in another tab/window
  // useEffect(() => {
  //   const handleStorageChange = (event: StorageEvent) => {
  //     if (event.key === key && event.newValue !== null) {
  //       try {
  //         setStoredValue(JSON.parse(event.newValue));
  //       } catch (error) {
  //         console.error(`Error parsing localStorage key "${key}" from storage event:`, error);
  //       }
  //     }
  //   };
  //   window.addEventListener('storage', handleStorageChange);
  //   return () => {
  //     window.removeEventListener('storage', handleStorageChange);
  //   };
  // }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;
```

**7. React Component (`src/components/PageEditor/PageEditor.tsx`)**

This is the core component combining the controller logic and the template.

```typescript
// src/components/PageEditor/PageEditor.tsx

import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  fetchPage,
  savePage,
  deletePage,
  updatePageField,
  setConfirmDelete,
  setNewerVersion,
  resetPage,
  fetchTagSuggestions,
  addTagSuggestion,
} from '../../features/page/pageSlice';
import { Page } from '../../types';
import { useTranslation } from 'react-i18next'; // Use react-i18next hook directly
import useLocalStorage from '../../hooks/useLocalStorage';
import debounce from 'lodash.debounce'; // Need lodash for debouncing saveLocal

// Import common components (create these as needed)
// import Input from '../common/Input';
// import Textarea from '../common/Textarea';
// import Select from '../common/Select';
// import Button from '../common/Button';
// import RadioGroup from '../common/RadioGroup';
// import TagInput from '../common/TagInput'; // Custom component for tags

// Define props interface if needed (e.g., if themePages are passed as prop)
// import { PageEditorProps } from './PageEditor.types';

const PageEditor: React.FC = () => {
  const { url: urlParam } = useParams<{ url: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  // Select state from Redux store
  const {
    currentPage,
    isLoading,
    error,
    newerVersion,
    confirmDelete,
    autoURL,
    tagSuggestions,
  } = useSelector((state: RootState) => state.page);
  const themePages = currentPage.themePages; // Get themePages from state

  // Local state for UI elements not directly tied to the Page model
  // const [confirmDelete, setConfirmDeleteLocal] = useState(false); // Moved to Redux slice
  // const [newerVersion, setNewerVersionLocal] = useState(false); // Moved to Redux slice
  // const [autoURL, setAutoURLLocal] = useState(true); // Moved to Redux slice

  // Local storage keys based on the current URL parameter
  const localStorageKeyPrefix = urlParam ? `${urlParam}_` : 'new_'; // Use a prefix for new pages too? Angular used routeParams.url
  const localStorageKeys = useMemo(() => ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url', 'type'], []); // Add 'type' to elements list

  // Use useLocalStorage hook for each field we want to persist
  // This approach is simpler than a single JSON object for complex forms
  // Or, manage a single local storage object and sync it with Redux state
  // Let's try syncing Redux state with local storage via useEffect for simplicity here.

  // --- Local Storage Logic (Replicating Angular's check and restore) ---

  // Check for newer version in local storage on mount
  useEffect(() => {
    if (urlParam && urlParam !== 'new') { // Only check for existing pages
      let foundNewer = false;
      localStorageKeys.forEach(key => {
        const localStorageValue = localStorage.getItem(localStorageKeyPrefix + key);
        // Compare local storage value to the value currently loaded into Redux state (currentPage)
        // Need to handle null/undefined and type differences (e.g., scheduleDate)
        // Angular compared localStorage string to Page factory value.
        // Let's compare to the value fetched into Redux state.
        const pageValue = (currentPage as any)[key]; // Access dynamically, handle potential undefined

        // Simple comparison: if localStorage has a non-null value different from the loaded page value
        // This might need refinement based on how null/empty strings are stored/compared
        if (localStorageValue !== null && localStorageValue !== 'null' && localStorageValue !== JSON.stringify(pageValue)) {
             // Need careful comparison, especially for dates/objects
             // For simplicity, let's just check if *any* key exists in local storage for this URL
             // and is not explicitly 'null'. This is closer to the Angular check.
             if (localStorage.getItem(localStorageKeyPrefix + key) !== null && localStorage.getItem(localStorageKeyPrefix + key) !== 'null') {
                 foundNewer = true;
             }
        }
      });
      dispatch(setNewerVersion(foundNewer));
    } else {
        // For new pages, clear any potential old 'new_' local storage data?
        // Or just ensure newerVersion is false.
        dispatch(setNewerVersion(false));
    }
  }, [urlParam, localStorageKeyPrefix, localStorageKeys, dispatch]); // Depend on urlParam and keys

  // Effect to load page data or reset for new page
  useEffect(() => {
    if (urlParam && urlParam !== 'new') {
      // Fetch existing page data
      // Need to convert urlParam to ID? Or API supports URL?
      // Angular used $routeParams.url but fetched by ID in save/delete.
      // The REST definition for content is `api/content/:contentID`.
      // This implies we need the ID. How does Angular get the ID from the URL?
      // It must be fetching the page data elsewhere (e.g., a parent route resolver)
      // and populating the `Page` factory *before* this controller loads.
      // Let's assume a parent component or route loader fetches the page by URL
      // and dispatches `setPage` to the Redux store.
      // If that's not the case, we'd need a `fetchPageByUrl` thunk.
      // For now, let's assume `currentPage` in Redux is populated by a parent/route.
      // If `currentPage.id` is null but urlParam exists, it means the fetch hasn't happened or failed.
      // We should trigger the fetch here if the page isn't loaded.
      if (currentPage.id === null || currentPage.url !== urlParam) {
           // This is a simplified trigger. A real app might use RTK Query or a more robust loader.
           // We need the ID to fetch. If URL is used, API needs to support it.
           // Let's assume for now the API *can* return page data based on URL for fetching,
           // even if save/delete use ID. Or, the parent component resolves URL to ID.
           // Given the Angular code, it seems the Page factory is populated *before* the controller.
           // Let's simulate that: assume `currentPage` is already in Redux state when this component mounts
           // if `urlParam` is not 'new'. If `urlParam` is 'new', reset state.
           if (urlParam === 'new') {
               dispatch(resetPage());
           } else {
               // If urlParam exists but page.id is null, it means the page wasn't pre-loaded.
               // We *must* fetch it here. But we need the ID.
               // Let's assume the API has an endpoint like `/api/content/by-url/:url`.
               // This wasn't in the original REST factory, so this is a necessary adaptation.
               // Or, the Angular app fetched a list of pages and found the ID from the URL there.
               // Let's add a hypothetical fetchByUrl to our apiService and thunk.
               // *Self-correction:* The Angular code implies the `Page` factory is populated *before* the controller runs, likely by the router resolving the page based on the URL. The controller then just uses the pre-populated `Page` factory. To replicate this, the route setup in React Router should handle fetching the page data and dispatching `setPage` *before* rendering `PageEditor`. However, for a self-contained example, let's add the fetch logic *inside* the component, assuming we can fetch by URL and the API returns the ID.

               // --- Adaptation: Fetch page by URL if not already loaded ---
               const fetchPageByUrl = async (url: string) => {
                   dispatch(pageSlice.actions.startLoading()); // Assuming a loading action
                   try {
                       // Hypothetical API call:
                       const pageData = await fetch(`${API_BASE_URL}/content/by-url/${encodeURIComponent(url)}`).then(res => res.json());
                       // Assuming pageData includes id, tags, extras, etc.
                       dispatch(setPage({
                           ...pageData,
                           tags: pageData.tags || [],
                           extras: pageData.extras || {},
                           scheduleDate: pageData.published_date ? new Date(pageData.published_date * 1000).toISOString().slice(0, 16) : null,
                       }));
                   } catch (err: any) {
                       dispatch(pageSlice.actions.setError(err.message || 'Failed to load page by URL')); // Assuming an error action
                       dispatch(showNotification({ message: t('page_error_loading'), classes: 'alert-error' })); // Need translation key
                       // Optionally redirect or show a "not found" message
                   } finally {
                       dispatch(pageSlice.actions.stopLoading()); // Assuming a stop loading action
                   }
               };

               if (!currentPage.id || currentPage.url !== urlParam) {
                   fetchPageByUrl(urlParam);
               }
           }
      }
    } else {
        // Navigating to /new, reset the state
        dispatch(resetPage());
    }
  }, [urlParam, dispatch, currentPage.id, currentPage.url, t]); // Depend on urlParam and relevant state parts


  // Effect to save relevant fields to local storage whenever they change
  // Use a debounced function to avoid excessive writes
  const saveLocalDebounced = useMemo(() => debounce(() => {
      if (urlParam) { // Only save if we have a URL context
          localStorageKeys.forEach(key => {
              const value = (currentPage as any)[key];
              // Handle null/undefined/objects carefully for localStorage
              if (value !== undefined && value !== null) {
                 localStorage.setItem(localStorageKeyPrefix + key, JSON.stringify(value));
              } else {
                 localStorage.removeItem(localStorageKeyPrefix + key); // Or set to 'null' string like Angular?
                 // Angular set to 'null' string. Let's replicate that behavior.
                 localStorage.setItem(localStorageKeyPrefix + key, 'null');
              }
          });
      }
  }, 500), [localStorageKeyPrefix, localStorageKeys, currentPage, urlParam]); // Dependencies for debounce

  // Watch relevant fields and trigger debounced saveLocal
  useEffect(() => {
      // Trigger saveLocal whenever any of the watched fields change
      // This effect runs after every render where currentPage changes
      saveLocalDebounced();

      // Cleanup the debounced function on unmount
      return () => {
          saveLocalDebounced.cancel();
      };
  }, [currentPage.title, currentPage.description, currentPage.url, currentPage.publish, currentPage.scheduleDate, currentPage.type, saveLocalDebounced]); // Add other fields if needed


  // --- Handlers ---

  const handleFieldChange = useCallback((field: keyof Page, value: any) => {
    dispatch(updatePageField({ field, value }));
  }, [dispatch]);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const title = e.target.value;
      handleFieldChange('title', title);
      // Auto-generate URL logic is now inside the reducer for updatePageField('title')
  }, [handleFieldChange]);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      handleFieldChange('description', e.target.value);
  }, [handleFieldChange]);

  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      // Angular set autoURL=false on manual URL change. Replicate this.
      // Need an action to update autoURL state in the slice.
      // dispatch(pageSlice.actions.setAutoURL(false)); // Assuming such an action exists
      // Or handle autoURL state locally if it's purely UI state.
      // Let's keep autoURL in Redux state as it affects the titleChange logic.
      // Need to add setAutoURL action to slice.
      // dispatch(pageSlice.actions.setAutoURL(false)); // Add this action
      handleFieldChange('url', e.target.value);
  }, [dispatch, handleFieldChange]); // Add dispatch if calling setAutoURL

  const handlePublishChange = useCallback((value: Page['publish']) => {
      handleFieldChange('publish', value);
  }, [handleFieldChange]);

  const handleScheduleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      // datetime-local value is a string "YYYY-MM-DDTHH:mm"
      handleFieldChange('scheduleDate', e.target.value);
  }, [handleFieldChange]);

  // Handle tags input (ng-list behavior)
  const handleTagsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // Split by comma, trim whitespace
      const tagsArray = value.split(',').map(tag => tag.trim());
      handleFieldChange('tags', tagsArray);

      // Trigger autocomplete for the last tag being typed
      const lastTag = tagsArray[tagsArray.length - 1];
      if (lastTag) {
          dispatch(fetchTagSuggestions(lastTag));
      } else {
          dispatch(setTagSuggestions([])); // Clear suggestions if input is empty
      }
  }, [dispatch, handleFieldChange]);

  const handleSelectSuggestion = useCallback((tag: string) => {
      dispatch(addTagSuggestion(tag)); // Dispatch action to add tag and clear suggestions
  }, [dispatch]);


  const handleSavePage = useCallback((duplicate = false) => {
    // Dispatch the savePage thunk
    dispatch(savePage({ duplicate, currentUrl: location.pathname }))
      .unwrap() // Use unwrap to handle fulfilled/rejected promises
      .then((response) => {
        // Thunk was successful, handle redirection if it was a new page
        if (location.pathname === '/new' || duplicate) {
          // Assuming the API response includes the new page's URL or we construct it
          // The thunk returns { id: contentId }. We need the URL.
          // Let's assume the URL is already updated in the state by the component's input.
          // We can navigate using the URL from the state.
          navigate(`/pages/${currentPage.url}`); // Navigate to the new page's URL
        }
        // For updates, no redirection needed, notification is handled by thunk
      })
      .catch((error) => {
        // Error handled by thunk (notification dispatched), no need to do more here
        console.error("Save page failed:", error);
      });
  }, [dispatch, location.pathname, navigate, currentPage.url]); // Depend on dispatch, location, navigate, currentPage.url

  const handleDeletePage = useCallback(() => {
    if (currentPage.id === null) {
        console.error("Cannot delete page: ID is null");
        dispatch(showNotification({ message: t('page_error_deleting_no_id'), classes: 'alert-error' })); // Need translation key
        dispatch(setConfirmDelete(false)); // Hide confirmation
        return;
    }
    dispatch(deletePage(currentPage.id))
      .unwrap()
      .then(() => {
        // Thunk was successful, handle redirection
        navigate('/pages/new'); // Redirect to new page after delete
      })
      .catch((error) => {
         // Error handled by thunk (notification dispatched)
         console.error("Delete page failed:", error);
      });
  }, [dispatch, currentPage.id, navigate, t]);

  const handleLocalVersion = useCallback(() => {
      // Restore from local storage
      localStorageKeys.forEach(key => {
          const localStorageValue = localStorage.getItem(localStorageKeyPrefix + key);
          if (localStorageValue !== null && localStorageValue !== 'null') {
              try {
                  const parsedValue = JSON.parse(localStorageValue);
                  // Dispatch action to update the specific field in Redux state
                  dispatch(updatePageField({ field: key as keyof Page, value: parsedValue }));
              } catch (error) {
                  console.error(`Error parsing local storage key "${key}":`, error);
              }
          }
          // Clear item from storage after restoring
          localStorage.removeItem(localStorageKeyPrefix + key); // Angular set to 'null', let's just remove
      });
      dispatch(setNewerVersion(false)); // Hide the newer version message
      // Angular broadcast 'contentGet'. In Redux, updating the state directly
      // via `updatePageField` actions should cause the component to re-render
      // with the restored data, which is the equivalent effect.
  }, [dispatch, localStorageKeyPrefix, localStorageKeys]);

  const handleDeleteNewerVersion = useCallback(() => {
      // Delete from local storage
      localStorageKeys.forEach(key => {
          localStorage.removeItem(localStorageKeyPrefix + key); // Angular set to 'null', let's just remove
      });
      dispatch(setNewerVersion(false)); // Hide the newer version message
  }, [dispatch, localStorageKeyPrefix, localStorageKeys]);


  // --- Render Logic ---

  // Format schedule date for datetime-local input
  // The state `currentPage.scheduleDate` should ideally be the string format "YYYY-MM-DDTHH:mm"
  // when read from the input or set from a timestamp.
  // When fetching from API (timestamp), convert to this format.
  // When saving to API, convert this format back to timestamp.
  // The thunk handles the conversion for saving.
  // The fetchPage thunk handles conversion for loading.
  // So the input can directly bind to `currentPage.scheduleDate`.

  // Handle ng-list for tags: input value is a string, state is an array.
  // The input value needs to be the comma-separated string representation of the array.
  // The onChange handler needs to parse the string into an array and update state.
  const tagsInputValue = useMemo(() => currentPage.tags.join(', '), [currentPage.tags]);


  return (
    <div className="pg-editor-container"> {/* Add a container div */}
      <div className="new-version form-case" style={{ display: newerVersion ? 'block' : 'none' }}> {/* Use style for ng-show */}
          <p>{t('page_newer')}</p>
          <button className="btn-error" type="button" onClick={handleDeleteNewerVersion}>{t('discard')}</button>
          {/* Angular had compare/use buttons both calling localVersion. Replicate. */}
          <button className="btn-options" type="button" onClick={handleLocalVersion}>{t('compare')}</button>
          <button className="btn-success" type="button" onClick={handleLocalVersion}>{t('use')}</button>
      </div>
      <div className="bar-top">
          {/* Assuming admin sidebar state is managed elsewhere */}
          <a onClick={() => console.log('Toggle sidebar')}><i className="fa fa-angle-left"></i></a> {/* Replace with actual sidebar toggle */}
          <h1 className="title">{t('page_details')}</h1>
          {/* Assuming admin panel state is managed elsewhere */}
          <a className="sidebar-close" onClick={() => console.log('Close admin panel')}><i className="fa fa-times"></i></a> {/* Replace with actual close action */}
      </div>
      <div className="bar--actions">
          {/* Delete button */}
          {!confirmDelete && (
              <button type="button" className="btn-error" onClick={() => dispatch(setConfirmDelete(true))}>
                  {t('delete')}
              </button>
          )}
          {/* Duplicate button */}
          {!confirmDelete && (
              <button type="button" className="btn-options" onClick={() => handleSavePage(true)}>
                  {t('duplicate')}
              </button>
          )}
          {/* Save button */}
          {!confirmDelete && (
              <button type="button" className="btn-success" onClick={() => handleSavePage(false)}>
                  {t('save')}
              </button>
          )}

          {/* Delete confirmation */}
          {confirmDelete && (
              <>
                  <p>{t('page_delete')}</p>
                  <button type="button" className="btn-error" onClick={handleDeletePage}>
                      {t('yes')}
                  </button>
                  <button type="button" className="btn-success" onClick={() => dispatch(setConfirmDelete(false))}>
                      {t('no')}
                  </button>
              </>
          )}
      </div>

      {/* Loading/Error indicators */}
      {isLoading && <p>Loading...</p>} {/* Add proper loading UI */}
      {error && <p className="alert-error">{error}</p>} {/* Error message from state */}

      <div className="pg-editor form-case">
          <label className="type" htmlFor="type">{t('type')}</label>
          <div className="cos-select">
              <select
                  id="type"
                  value={currentPage.type}
                  onChange={(e) => handleFieldChange('type', e.target.value)}
                  required
              >
                  {/* ng-options="(themePage | themeFiles ) for themePage in page.themePages" */}
                  {/* Assuming themeFiles is a filter/pipe that formats the name. Apply formatting here if needed. */}
                  {themePages.map(themePage => (
                      <option key={themePage} value={themePage}>
                          {themePage} {/* Apply formatting if necessary */}
                      </option>
                  ))}
              </select>
          </div>

          <span className="num-count">{currentPage.title.length}</span>
          <label htmlFor="title">{t('title')}</label>
          <input
              id="title"
              type='text'
              value={currentPage.title}
              onChange={handleTitleChange}
              placeholder="about us, contact us"
          />

          <span className="num-count">{currentPage.description.length}</span>
          <label htmlFor="description">{t('description')}</label>
          <textarea
              id="description"
              value={currentPage.description}
              onChange={handleDescriptionChange}
              placeholder="Tom's Restaurant is a diner located at 2880 Broadway (on the corner of 112th Street) in the Morningside Heights neighborhood of Manhattan in New York City."
          ></textarea>

          <label htmlFor="tags">{t('tags')}</label>
          {/* Implement ng-list behavior manually */}
          <input
              id="tags"
              type="text"
              value={tagsInputValue} // Bind to comma-separated string
              onChange={handleTagsChange} // Handle parsing string to array and triggering suggestions
              placeholder="about, restaurant, food, nyc"
          />
          {/* Tag suggestions */}
          {tagSuggestions.length > 0 && (
              <div className="tag-suggestions">
                  {/* ng-repeat="tag in page.suggestions | limitTo:10" */}
                  {tagSuggestions.slice(0, 10).map(tag => (
                      <a key={tag} onClick={() => handleSelectSuggestion(tag)}>
                          {tag} {/* Apply titlecase filter if needed */}
                      </a>
                  ))}
              </div>
          )}


          <label htmlFor="url">{t('url')}</label>
          <input
              id="url"
              type='text'
              value={currentPage.url}
              onChange={handleUrlChange}
          />

          {/* Radio buttons for publish status */}
          {/* Use a common RadioGroup component or implement manually */}
          <div>
              <input
                  type="radio"
                  name="publish"
                  id="publish-Y"
                  value="Y"
                  checked={currentPage.publish === 'Y'}
                  onChange={() => handlePublishChange('Y')}
              />
              <label htmlFor="publish-Y">{t('publish')}</label>

              <input
                  type="radio"
                  name="publish"
                  id="publish-N"
                  value="N"
                  checked={currentPage.publish === 'N'}
                  onChange={() => handlePublishChange('N')}
              />
              <label htmlFor="publish-N">{t('draft')}</label>

              <input
                  type="radio"
                  name="publish"
                  id="publish-schedule"
                  value="schedule"
                  checked={currentPage.publish === 'schedule'}
                  onChange={() => handlePublishChange('schedule')}
              />
              <label htmlFor="publish-schedule">{t('schedule')}</label>
          </div>


          {/* Schedule date input */}
          {currentPage.publish === 'schedule' && (
              <>
                  <div className="schedule-triangle"></div> {/* Styling element */}
                  <input
                      type="datetime-local"
                      className="schedule radio-inline"
                      value={currentPage.scheduleDate || ''} // Use empty string for null/undefined
                      onChange={handleScheduleDateChange}
                  />
              </>
          )}
      </div>
      {/* Add other sections like header, subheader, body, extras editor here */}
      {/* These would likely be separate components that read/write to currentPage state */}
    </div>
  );
};

export default PageEditor;
```

**8. App Setup (`src/App.tsx`, `src/index.tsx`)**

*   **`src/App.tsx`**:

```typescript
// src/App.tsx

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import PageEditor from './components/PageEditor/PageEditor';
import NotificationDisplay from './components/common/NotificationDisplay'; // Create this component
import './i18n'; // Initialize i18n

// Assume you have a component to load initial user data
// import UserLoader from './components/UserLoader';

const App: React.FC = () => {
  // In a real app, you might fetch initial data (user, themePages) here or in a parent component
  // useEffect(() => {
  //   store.dispatch(fetchInitialUserData()); // Example
  //   store.dispatch(fetchThemePages()); // Example
  // }, []);

  return (
    <Provider store={store}>
      <Router>
        {/* <UserLoader /> {/* Component to load user data on app start */}
        <NotificationDisplay /> {/* Global notification display */}
        <Routes>
          {/* Redirect root to /pages/new or a dashboard */}
          <Route path="/" element={<Navigate to="/pages/new" replace />} />
          {/* Route for new page */}
          <Route path="/pages/new" element={<PageEditor />} />
          {/* Route for editing existing page by URL */}
          {/* Note: PageEditor needs to handle fetching data based on URL param */}
          <Route path="/pages/:url" element={<PageEditor />} />
          {/* Add other routes here */}
          {/* Example: <Route path="/dashboard" element={<Dashboard />} /> */}
          {/* Example: <Route path="/settings" element={<Settings />} /> */}
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
```

*   **`src/index.tsx`**:

```typescript
// src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Import global styles if any
// import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**9. Notification Display Component (`src/components/common/NotificationDisplay.tsx`)**

```typescript
// src/components/common/NotificationDisplay.tsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { hideNotification } from '../../features/notification/notificationSlice';
import { Notification } from '../../features/notification/notification.types';

const NotificationDisplay: React.FC = () => {
  const notifications = useSelector((state: RootState) => state.notification.notifications);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        // Hide the oldest notification after its duration
        const oldestNotification = notifications[0];
        if (oldestNotification && oldestNotification.duration !== 0) {
             dispatch(hideNotification(oldestNotification.id));
        }
      }, notifications[0].duration || 5000); // Use duration from the notification, default 5s

      return () => clearTimeout(timer);
    }
  }, [notifications, dispatch]); // Re-run effect when notifications change

  return (
    <div className="notification-container" style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    }}>
      {notifications.map((notification: Notification) => (
        <div
          key={notification.id}
          className={`alert ${notification.classes || ''}`} // Apply classes like 'alert-error', 'alert-success'
          style={{
              padding: '10px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              minWidth: '200px',
              maxWidth: '300px',
              wordBreak: 'break-word',
              // Basic styling based on classes
              ...(notification.classes?.includes('alert-error') && { backgroundColor: '#fdd', borderColor: '#f00' }),
              ...(notification.classes?.includes('alert-success') && { backgroundColor: '#dfd', borderColor: '#0f0' }),
              // Add more styles based on your CSS framework
          }}
        >
          {notification.message}
          {/* Optional close button */}
          {notification.duration !== 0 && (
              <button
                  onClick={() => dispatch(hideNotification(notification.id))}
                  style={{ marginLeft: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                  &times;
              </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationDisplay;
```

**Remaining Tasks & Considerations:**

1.  **CSS:** The provided HTML uses specific CSS classes (`form-case`, `bar-top`, `bar--actions`, `pg-editor`, `cos-select`, `num-count`, `tag-suggestions`, `schedule-triangle`, `radio-inline`, `btn-error`, `btn-options`, `btn-success`). You'll need to migrate or recreate the corresponding CSS styles.
2.  **Other Page Fields:** The Angular template only shows title, description, URL, type, tags, publish status, and schedule date. The `Page` factory and `savePage` logic include `header`, `subheader`, `body`, `extras`, `misc`. You'll need to add UI elements for these fields in `PageEditor.tsx` and ensure they are correctly bound to the `currentPage` state using `updatePageField`.
3.  **`Page.themePages`:** The Angular code gets `themePages` from the `Page` factory. In the Redux version, `themePages` is part of the `pageSlice` state. This data needs to be loaded into the Redux store, likely during application initialization or when entering the page editing section.
4.  **`Page.extras` and `Page.misc` Editor:** The Angular code saves `Page.extras` and `Page.misc`, including stringifying objects. You'll need UI components to edit these arbitrary key-value pairs or structured data, and ensure `updatePageField` correctly handles updating nested objects or arrays within `extras` and `misc`. The save thunk already handles the stringification.
5.  **`Page.header`, `Page.subheader`, `Page.body`:** Add input fields for these.
6.  **`Page.timestamp`:** This field exists in the factory but isn't used in the controller logic provided. If it's an "updated at" timestamp, it might be set by the API on save.
7.  **`Page.published_date`:** The Angular code uses a timestamp (seconds). The React code uses a string for the `datetime-local` input and converts to/from timestamp in the thunk/fetch. Ensure consistency.
8.  **`Users.id`:** The `savePage` th uses `currentUser?.id` from the `userSlice`. Ensure the `userSlice` is populated with the current user's data when the application loads.
9.  **`$upload`:** The Angular controller injects `$upload` but doesn't use it. If file uploads are needed (e.g., for featured image), you'll need to implement this functionality in React using a file input and an API endpoint, potentially with a dedicated thunk or RTK Query mutation.
10. **`themeFiles` filter/pipe:** The Angular template uses `(themePage | themeFiles )`. If `themeFiles` is an Angular filter that formats the theme page name, you'll need to replicate this formatting logic in the React component when rendering the `<option>` elements.
11. **Error Handling Refinement:** The current error handling in thunks is basic. You might want more specific error messages or UI feedback.
12. **Loading States:** The `isLoading` state is in the `pageSlice`. Use this state in the component to disable buttons or show loading spinners during API calls.
13. **Code Splitting:** Apply `React.lazy` and `Suspense` to the route definition in `App.tsx` for the `PageEditor` component if it's large, to improve initial load time.
14. **React.memo:** Consider using `React.memo` for smaller, reusable components (like `Input`, `Button`, etc.) if they are pure and receive props that don't change frequently. The main `PageEditor` component itself might not benefit significantly from `memo` as its state changes often.
15. **Dependency Arrays:** Double-check all `useEffect`, `useCallback`, and `useMemo` dependency arrays to ensure they are correct and avoid unnecessary re-renders or stale closures.
16. **Testing:** Write unit and integration tests for Redux slices, thunks, API service, and components.

This provides a comprehensive structure and implementation for migrating the core functionality of the Angular page editor to React with Redux Toolkit and TypeScript, following the specified requirements. You would need to fill in the details for the missing UI elements and potentially refine the API service and state management based on the full application's needs.

### Tokens: {'input_tokens': 6685, 'output_tokens': 18646}
### Execution time: 118.57150387763977
