I have the following application code that needs to evaluate:

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

1. Analyze the provided Angular.js application code:
   - Identify issues across multiple technical dimensions
   - Provide specific recommendations with code examples

2. Readability Assessment:
   - Identify unclear variable names, functions, or code blocks
   - Suggest clearer alternatives with specific code examples
   - Highlight complex logic that could be simplified

3. Maintainability Evaluation:
   - Identify non-modular or tightly coupled components
   - Suggest architectural improvements for better separation of concerns
   - Provide examples of more maintainable code structures

4. Performance Optimization:
   - Identify inefficient data handling or processing
   - Highlight potential memory leaks or unnecessary operations
   - Suggest optimized alternatives with code examples

5. Accessibility Improvements:
   - Review UI components for accessibility compliance
   - Suggest ARIA attributes, keyboard navigation, or focus management enhancements
   - Provide code examples demonstrating accessibility best practices

6. Angular.js Best Practices:
   - Identify outdated patterns or anti-patterns
   - Suggest modern Angular.js approaches where applicable
   - Provide examples aligning with current framework recommendations

7. Documentation Enhancement:
   - Evaluate existing comments and documentation
   - Suggest improvements for function, component, and service documentation
   - Provide examples of clear, comprehensive documentation

8. Response Format Requirements:
   - Organize findings by aspect (Readability, Maintainability, etc.)
   - For each issue identified:
     - Provide a descriptive name
     - Include a clear explanation
     - Show the problematic code snippet
     - Provide a corrected code example where applicable
## Run 1:
### Thoughts:
Let me analyze this AngularJS application code comprehensively. I'll go through each aspect systematically.

1. **Readability Assessment:**
- The code has some unclear variable names and complex logic that could be simplified
- The pageCtrl.js has very long functions that are hard to follow
- Some variable names like `i` in extrasCounter are not descriptive

2. **Maintainability Evaluation:**
- The controller is doing too much - it's handling UI logic, data persistence, and business logic
- Tight coupling between controller and services
- No separation of concerns
- Complex callback chains that are hard to follow

3. **Performance Optimization:**
- Multiple sequential API calls that could be batched
- LocalStorage operations in loops
- No debouncing on input fields that trigger operations
- Memory leaks with event listeners not being cleaned up

4. **Accessibility Improvements:**
- Missing ARIA labels on form inputs
- No keyboard navigation support for tag suggestions
- Missing role attributes on interactive elements
- No focus management after actions

5. **Angular.js Best Practices:**
- Using old patterns like `$scope` instead of controller as syntax
- Not using promises properly
- Manual dependency injection instead of using annotations
- Not using one-time bindings where appropriate

6. **Documentation Enhancement:**
- Comments are minimal and not descriptive
- No JSDoc style documentation
- No explanation of complex business logic

Let me provide detailed analysis and recommendations for each aspect.

### Answer:
# Angular.js Application Code Review

## 1. Readability Assessment

### Issue: Unclear Variable Naming
**Problem:** Variables like `Y`, `N`, and single letter properties make code hard to understand.

**Current Code:**
```js
// page.html
<input type="radio" ng-class="{active: page.publish=='Y'}" name="publish" id="Y" value="Y">
<input type="radio" ng-class="{active: page.publish=='N'}" name="publish" id="N" value="N">
```

**Improved Code:**
```js
// Use meaningful constants
<input type="radio" ng-class="{active: page.publish=='PUBLISHED'}" name="publish" id="published" value="PUBLISHED">
<input type="radio" ng-class="{active: page.publish=='DRAFT'}" name="publish" id="draft" value="DRAFT">
```

### Issue: Complex Nested Callbacks
**Problem:** The `savePage` function has deeply nested callbacks that are hard to follow.

**Current Code:**
```js
REST.content.save({...}, newPagePromise, function(){ // Error
    $translate('page_error_saving').then(function(translatedText){
        $rootScope.$broadcast('notify', {message: translatedText, classes: 'alert-error'});
    });
});
```

**Improved Code:**
```js
// Use promise chaining
function savePage(duplicate) {
    return validatePage()
        .then(preparePageData)
        .then(savePageContent)
        .then(savePageRevision)
        .then(savePageExtras)
        .then(notifySuccess)
        .catch(handleError);
}

function handleError(error) {
    return $translate(error.messageKey).then(function(translatedText) {
        $rootScope.$broadcast('notify', {
            message: translatedText, 
            classes: 'alert-error'
        });
    });
}
```

## 2. Maintainability Evaluation

### Issue: Controller Doing Too Much
**Problem:** The `pageCtrl` handles UI logic, data persistence, API calls, and business logic.

**Current Code:**
```js
angular.module('cosmo').controller('pageCtrl', ['$scope', 'REST', '$location', 'Page', '$rootScope', '$routeParams', '$upload', 'Users', '$translate', function($scope, REST, $location, Page, $rootScope, $routeParams, $upload, Users, $translate){
    // 400+ lines of mixed concerns
}]);
```

**Improved Code:**
```js
// Separate into services
angular.module('cosmo')
    .service('PageService', ['REST', '$q', function(REST, $q) {
        this.savePage = function(pageData) {
            return REST.content.save(pageData).$promise;
        };
        
        this.updatePage = function(pageId, pageData) {
            return REST.content.update({contentID: pageId}, pageData).$promise;
        };
    }])
    .service('PageStorageService', ['$window', function($window) {
        this.saveLocal = function(key, data) {
            $window.localStorage.setItem(key, JSON.stringify(data));
        };
        
        this.getLocal = function(key) {
            return JSON.parse($window.localStorage.getItem(key) || 'null');
        };
    }])
    .controller('pageCtrl', ['$scope', 'PageService', 'PageStorageService', function($scope, PageService, PageStorageService) {
        // Simplified controller focusing on view logic
    }]);
```

### Issue: No Factory Pattern for Complex Objects
**Problem:** Page object creation is scattered throughout the code.

**Improved Code:**
```js
angular.module('cosmo')
    .factory('PageFactory', function() {
        function Page(data) {
            this.id = data.id || 0;
            this.title = data.title || '';
            this.description = data.description || '';
            this.url = data.url || '';
            this.publish = data.publish || 'DRAFT';
            this.scheduleDate = data.scheduleDate || new Date();
            this.tags = data.tags || [];
            this.type = data.type || '';
        }
        
        Page.prototype.validate = function() {
            return this.url && this.url !== 'new' && this.type;
        };
        
        return {
            create: function(data) {
                return new Page(data || {});
            }
        };
    });
```

## 3. Performance Optimization

### Issue: Multiple Sequential API Calls
**Problem:** Deleting a page triggers multiple sequential delete operations.

**Current Code:**
```js
$scope.deletePage = function(){
    REST.content.delete({ contentID: $scope.page.id }, function(data){
        $translate('deleted').then(function(translatedText){
            $rootScope.$broadcast('notify', {message: translatedText});
        });
    });
    REST.contentRevisions.delete({ contentID: $scope.page.id });
    REST.contentRevisionsExtras.delete({ contentID: $scope.page.id });
    REST.contentExtras.delete({ contentID: $scope.page.id });
    REST.contentTags.delete({ contentID: $scope.page.id });
};
```

**Improved Code:**
```js
$scope.deletePage = function() {
    var deletePromises = [
        REST.content.delete({ contentID: $scope.page.id }).$promise,
        REST.contentRevisions.delete({ contentID: $scope.page.id }).$promise,
        REST.contentRevisionsExtras.delete({ contentID: $scope.page.id }).$promise,
        REST.contentExtras.delete({ contentID: $scope.page.id }).$promise,
        REST.contentTags.delete({ contentID: $scope.page.id }).$promise
    ];
    
    return $q.all(deletePromises)
        .then(function() {
            return $translate('deleted');
        })
        .then(function(translatedText) {
            $rootScope.$broadcast('notify', {message: translatedText});
            $location.path('new');
        });
};
```

### Issue: No Debouncing on Input Events
**Problem:** Every keystroke triggers operations without debouncing.

**Current Code:**
```js
$scope.titleChange = function(){
    Page.title = $scope.page.title;
    if($scope.autoURL){
        $scope.page.url = $scope.page.title.toLowerCase().replace(/ /g, '-').replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
        Page.url = $scope.page.url;
    }
};
```

**Improved Code:**
```js
// Add debounce service
.service('debounce', ['$timeout', function($timeout) {
    return function(func, wait) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            $timeout.cancel(timeout);
            timeout = $timeout(function() {
                func.apply(context, args);
            }, wait);
        };
    };
}])

// Use in controller
$scope.titleChange = debounce(function() {
    Page.title = $scope.page.title;
    if($scope.autoURL) {
        $scope.page.url = $scope.page.title
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
        Page.url = $scope.page.url;
    }
}, 300);
```

## 4. Accessibility Improvements

### Issue: Missing ARIA Labels and Roles
**Problem:** Form inputs lack proper labeling and ARIA attributes.

**Current Code:**
```html
<input type='text' ng-model="page.title" ng-keyup="titleChange()" placeholder="about us, contact us">
<div class="tag-suggestions" ng-show="page.suggestions.length">
    <a ng-repeat="tag in page.suggestions | limitTo:10" ng-click="selectSuggestion(tag)">{{tag | titlecase}}</a>
</div>
```

**Improved Code:**
```html
<input 
    type="text" 
    id="page-title"
    ng-model="page.title" 
    ng-keyup="titleChange()" 
    placeholder="about us, contact us"
    aria-label="Page title"
    aria-describedby="title-help"
    aria-required="true">
<span id="title-help" class="sr-only">Enter a descriptive title for your page</span>

<div 
    class="tag-suggestions" 
    ng-show="page.suggestions.length"
    role="listbox"
    aria-label="Tag suggestions">
    <a 
        ng-repeat="tag in page.suggestions | limitTo:10" 
        ng-click="selectSuggestion(tag)"
        ng-keydown="handleTagKeydown($event, $index)"
        role="option"
        tabindex="0"
        aria-selected="{{$index === selectedIndex}}">
        {{tag | titlecase}}
    </a>
</div>
```

### Issue: No Keyboard Navigation Support
**Problem:** Tag suggestions are only clickable, not keyboard accessible.

**Improved Code:**
```js
$scope.selectedIndex = -1;

$scope.handleTagKeydown = function(event, index) {
    switch(event.keyCode) {
        case 13: // Enter
            event.preventDefault();
            $scope.selectSuggestion($scope.page.suggestions[index]);
            break;
        case 40: // Down arrow
            event.preventDefault();
            $scope.selectedIndex = Math.min(index + 1, $scope.page.suggestions.length - 1);
            break;
        case 38: // Up arrow
            event.preventDefault();
            $scope.selectedIndex = Math.max(index - 1, 0);
            break;
        case 27: // Escape
            $scope.page.suggestions = [];
            break;
    }
};
```

## 5. Angular.js Best Practices

### Issue: Using $scope Instead of ControllerAs Syntax
**Problem:** Using $scope leads to scope inheritance issues and less readable code.

**Current Code:**
```js
angular.module('cosmo').controller('pageCtrl', ['$scope', function($scope) {
    $scope.page = {...};
    $scope.savePage = function() {...};
}]);
```

**Improved Code:**
```js
angular.module('cosmo').controller('PageController', ['PageService', function(PageService) {
    var vm = this;
    vm.page = {...};
    vm.savePage = savePage;
    
    function savePage() {
        // Implementation
    }
}]);

// In HTML
<div ng-controller="PageController as pageCtrl">
    <input ng-model="pageCtrl.page.title">
</div>
```

### Issue: Not Using Angular's Built-in Form Validation
**Problem:** Manual validation instead of using Angular's form validation.

**Improved Code:**
```html
<form name="pageForm" ng-submit="pageCtrl.savePage()" novalidate>
    <input 
        type="text" 
        name="url"
        ng-model="pageCtrl.page.url" 
        required
        ng-pattern="/^[a-z0-9-]+$/"
        ng-minlength="3">
    
    <div ng-messages="pageForm.url.$error" ng-if="pageForm.url.$touched">
        <p ng-message="required">URL is required</p>
        <p ng-message="pattern">URL can only contain lowercase letters, numbers, and hyphens</p>
        <p ng-message="minlength">URL must be at least 3 characters</p>
    </div>
    
    <button 
        type="submit" 
        ng-disabled="pageForm.$invalid">
        Save
    </button>
</form>
```

## 6. Documentation Enhancement

### Issue: Lack of Comprehensive Documentation
**Problem:** Functions lack proper JSDoc documentation.

**Current Code:**
```js
// Save the page
$scope.savePage = function(duplicate){
    // implementation
};
```

**Improved Code:**
```js
/**
 * Saves the current page to the backend
 * @param {boolean} duplicate - If true, creates a duplicate of the current page
 * @returns {Promise} Promise that resolves when save is complete
 * @throws {ValidationError} If page data is invalid
 * @example
 * // Save current page
 * pageCtrl.savePage();
 * 
 * // Create duplicate
 * pageCtrl.savePage(true);
 */
function savePage(duplicate) {
    // implementation
}

/**
 * Page controller manages page creation and editing
 * @class PageController
 * @requires PageService - Handles page API operations
 * @requires PageStorageService - Manages local storage for drafts
 * @requires $translate - Internationalization service
 */
```

### Issue: No Configuration Documentation
**Problem:** REST factory configuration is not documented.

**Improved Code:**
```js
/**
 * REST Factory provides resource endpoints for backend communication
 * @module REST
 * @requires $resource - Angular resource service
 * @requires Page - Page data model
 * 
 * @example
 * // Get all blocks
 * REST.blocks.query().$promise.then(function(blocks) {
 *     console.log(blocks);
 * });
 * 
 * // Update a specific block
 * REST.blocks.update({blockID: 123}, {name: 'Updated Block'});
 */
angular.module('cosmo').factory('REST', ['$resource', 'Page', function($resource, Page) {
    return {
        /**
         * Blocks resource
         * @type {$resource}
         * @property {function} query - GET /api/blocks
         * @property {function} get - GET /api/blocks/:blockID
         * @property {function} save - POST /api/blocks
         * @property {function} update - PUT /api/blocks/:blockID
         * @property {function} delete - DELETE /api/blocks/:blockID
         */
        'blocks': $resource('api/blocks/:blockID', { blockID: '@blockID'}, { 
            update: { method: 'PUT' } 
        }),
        // ... rest of resources
    };
}]);
```

## Additional Recommendations

1. **Migration Path**: Consider migrating to modern Angular (2+) for better performance and maintainability
2. **Testing**: Add unit tests for services and controllers
3. **Error Handling**: Implement a global error handler service
4. **Security**: Add input sanitization and XSS protection
5. **Build Process**: Use webpack or similar for bundling and optimization

### Tokens: {'input_tokens': 7061, 'output_tokens': 4054}
### Execution time: 53.96073031425476
