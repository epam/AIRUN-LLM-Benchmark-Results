I have the following application code that needs review and improvement:

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


Your task is to analyze the code and suggest enhancements focusing on the following aspects:
- Readability: Identify unclear parts and suggest clearer alternatives with code examples.
- Maintainability: Point out non-modular or hard-to-maintain structures and provide modular, maintainable code examples.
- Performance: Highlight performance issues and offer optimized code snippets.
- Accessibility: Suggest improvements for better accessibility with example code.
- Best Practices: Indicate deviations from best practices in the used tech stack (e.g., React, TypeScript) and correct them with code examples.
- Testing: Comment on testability and suggest testable code structures with example tests.
- Documentation: If documentation/comments are lacking or unclear, suggest better documentation with examples.

Provide answer in the next format:
## {Aspect 1}
### 1. {Name of the Issue}
{description}
Example
```<Code snippet or part of code with issue>```
Example of fixed issue - if applicable
```<Code snippet with fixed issue>``` - if applicable
## Run 1:
### Answer:
Below is a review of your code with suggestions for improvement. Each section describes one or more issues along with examples of the problematic code and suggestions for how to fix them.

────────────────────────────
## Readability

### 1. Overly Verbose Controller Functions  
The controller (pageCtrl.js) mixes many responsibilities into one large function. For example, functions such as titleChange, urlChange, and savePage handle both view logic and business logic. This makes the code hard to follow and test.  
Example  
------------------------------------------------
angular.module('cosmo').controller('pageCtrl', ['$scope', …, function($scope, REST, $location, Page, …){
    $scope.titleChange = function(){
        // Log changes to the Page object and auto-generate URL if needed
        Page.title = $scope.page.title;
        if($scope.page.url === '/new' || !$scope.page.url)
            $scope.autoURL = true;
        if($scope.autoURL){
            $scope.page.url = $scope.page.title.toLowerCase().replace(/ /g, '-').replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
            Page.url = $scope.page.url;
        }
    };
    // many similar methods…
}]);
------------------------------------------------  
Suggested fix: Extract specific business logic into smaller, named functions or better yet, separate services. For example, create a URL service that is solely responsible for generating a URL from a title.  
Example of fixed issue  
------------------------------------------------
angular.module('cosmo').factory('UrlService', function(){
    return {
        generate: function(title) {
            return title.toLowerCase()
                        .replace(/ /g, '-')
                        .replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
        }
    };
});
  
// And in your controller:
$scope.titleChange = function(){
    Page.title = $scope.page.title;
    if(!$scope.page.url || $scope.page.url === 'new'){
        $scope.autoURL = true;
    }
    if($scope.autoURL){
        $scope.page.url = UrlService.generate($scope.page.title);
        Page.url = $scope.page.url;
    }
};
------------------------------------------------

### 2. Duplicated LocalStorage Element Handling  
The code that loops over the same list of element names for localStorage operations appears in several places. This duplication makes updates error-prone if the fields change.  
Example  
------------------------------------------------
var elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
angular.forEach(elements, function(value){
    if(localStorage.getItem($routeParams.url + value) !== Page[value] && localStorage.getItem($routeParams.url + value) !== 'null')
        $scope.newerVersion = true;
});
------------------------------------------------  
Suggested fix: Create a helper function (or service) that encapsulates the localStorage key naming and get/set operations.  
Example of fixed issue  
------------------------------------------------
angular.module('cosmo').factory('StorageService', function(){
    return {
        getKey: function(base, field) {
            return base + field;
        },
        get: function(base, field) {
            return localStorage.getItem(this.getKey(base, field));
        },
        set: function(base, field, value) {
            localStorage.setItem(this.getKey(base, field), value);
        },
        clear: function(base, fields) {
            fields.forEach(field => localStorage.setItem(base + field, null));
        }
    };
});
------------------------------------------------
Then use StorageService in your controller when saving/retrieving page fields.

────────────────────────────
## Maintainability

### 1. Hard-Coded REST Endpoints in the Factory  
All endpoints are defined inline, which makes it difficult to update if the API changes.  
Example  
------------------------------------------------
'blocks': $resource('api/blocks/:blockID', { blockID: '@blockID' }, { update: { method: 'PUT' } }),
------------------------------------------------  
Suggested fix: Extract a configuration object for API endpoints so that you only need to change the base URL or path in one location.  
Example of fixed issue  
------------------------------------------------
angular.module('cosmo')
    .constant('API_CONFIG', {
        blocks: 'api/blocks/:blockID',
        blocksRequirements: 'api/blocks/:blockID/requirements/:requirementID',
        comments: 'api/comments/:commentID'
        // ... other endpoints
    })
    .factory('REST', ['$resource', 'API_CONFIG', function($resource, API_CONFIG) {
        return {
            blocks: $resource(API_CONFIG.blocks, { blockID: '@blockID' }, { update: { method: 'PUT' } }),
            // ... use API_CONFIG for the others
        };
    }]);
------------------------------------------------

### 2. Large Controller with Multiple Responsibilities  
The pageCtrl is juggling business logic, view updates, and direct API actions. Splitting it into multiple controllers or, better yet, directives/components (if and when migrating to a newer Angular version) can improve reusability and clarity.  
Suggested fix:  
• Use controllerAs syntax  
• Extract business logic for saving and version management into services  
Example snippet  
------------------------------------------------
// Using controllerAs syntax and a separate service for page management
angular.module('cosmo')
    .controller('PageController', ['PageService', function(PageService){
         var vm = this;
         vm.page = PageService.getPage();
         vm.titleChange = PageService.handleTitleChange;
         // etc.
    }]);
------------------------------------------------

────────────────────────────
## Performance

### 1. Repeated Access to localStorage in Loops  
Accessing localStorage multiple times inside loops may slow the performance for larger payloads.  
Example  
------------------------------------------------
angular.forEach(elements, function(value){
    if(localStorage.getItem($routeParams.url + value) !== 'null')
        Page[value] = localStorage.getItem($routeParams.url + value);
});
------------------------------------------------  
Suggested fix: Cache localStorage values in a temporary object, then iterate over it.  
Example of fixed issue  
------------------------------------------------
var cachedData = {};
elements.forEach(function(key){
    cachedData[key] = localStorage.getItem($routeParams.url + key);
});
angular.forEach(elements, function(key){
    if(cachedData[key] !== 'null'){
        Page[key] = cachedData[key];
    }
});
------------------------------------------------

### 2. Inefficient Loops for Saving Extras  
When saving extras, the code loops over Page.extras and makes separate API calls for each. This could be optimized by collecting the data and sending a batch request if your backend supports it.  
Suggested fix:  
• Refactor the REST services to allow for batch saves  
• Consider using Promise.all to manage multiple requests in parallel  
Example of improved approach  
------------------------------------------------
var promises = [];
for (var key in Page.extras) {
    if(Page.extras.hasOwnProperty(key)){
        var extraData = angular.isObject(Page.extras[key]) 
                        ? angular.toJson(Page.extras[key]) 
                        : Page.extras[key];
        promises.push(REST.contentExtras.save({ contentID: $scope.page.id, name: key, extra: extraData }).$promise);
        promises.push(REST.contentRevisionsExtras.save({ revisionID: revisionID, contentID: $scope.page.id, name: key, extra: extraData }).$promise);
    }
}
Promise.all(promises).then(function(){
    // Notify user on completion
});
------------------------------------------------

────────────────────────────
## Accessibility

### 1. Missing ARIA Attributes and Semantic HTML Enhancements  
Buttons and interactive elements should include ARIA labels and roles so that screen readers better interpret their purpose.  
Example  
------------------------------------------------
<button class="btn-error" type="button" ng-click="deleteNewerVersion()" translate="discard"></button>
------------------------------------------------  
Suggested fix:  
------------------------------------------------
<button class="btn-error" type="button" ng-click="deleteNewerVersion()" aria-label="Discard unsaved changes" translate="discard"></button>
------------------------------------------------

### 2. Incorrect Input Attribute and Label Associations  
Radio inputs have a typo (ng-modal instead of ng-model) and missing proper form field associations.  
Example (issue)  
------------------------------------------------
<input  type="radio" ng-class="{active: page.publish=='Y'}" name="publish" id="Y" value="Y" ng-modal="page.publish">
<label for="Y" ng-click="page.publish='Y'" translate="publish"></label>
------------------------------------------------  
Suggested fix:  
------------------------------------------------
<input type="radio" ng-class="{active: page.publish=='Y'}" name="publish" id="Y" value="Y" ng-model="page.publish" aria-labelledby="publish-label-Y">
<label id="publish-label-Y" for="Y" ng-click="page.publish='Y'" translate="publish"></label>
------------------------------------------------

────────────────────────────
## Best Practices

### 1. Use of Deprecated or Incorrect Attributes  
The typo “ng-modal” should be “ng-model” in the radio inputs. Using correct matching of attributes is crucial for both data binding and clarity.  
Example (issue)  
------------------------------------------------
<input type="radio" ... ng-modal="page.publish">
------------------------------------------------  
Example of fixed issue  
------------------------------------------------
<input type="radio" ... ng-model="page.publish">
------------------------------------------------

### 2. Lack of Component-Based Structure  
AngularJS 1.x applications can already be structured using the component method. This approach encapsulates the view, controller, and even styles making it easier to migrate or test.  
Suggested approach:  
------------------------------------------------
angular.module('cosmo')
  .component('pageEditor', {
    templateUrl: 'page.html',
    controller: 'pageEditorCtrl',
    bindings: { /* bind required data */ }
  });
// Then refactor pageCtrl.js into pageEditorCtrl.js using controllerAs (vm pattern)
------------------------------------------------

────────────────────────────
## Testing

### 1. Difficulty to Unit Test Large Monolithic Controllers  
The controller currently directly accesses services such as REST and localStorage. This makes mocking and unit testing more challenging.  
Suggested fix:  
• Separate pure business logic into services  
• Use “controllerAs” syntax and dependency injection for ease of mocking  
Example of testable structure  
------------------------------------------------
describe('Page Controller', function() {
    var $componentController, PageService, $q, $rootScope;
  
    beforeEach(module('cosmo'));
    beforeEach(inject(function(_$componentController_, _PageService_, _$q_, _$rootScope_){
        $componentController = _$componentController_;
        PageService = _PageService_;
        $q = _$q_;
        $rootScope = _$rootScope_;
    }));
  
    it('should generate URL based on title', function(){
        var bindings = { /* any necessary bindings */ };
        var ctrl = $componentController('pageEditor', null, bindings);
        spyOn(PageService, 'handleTitleChange').and.callThrough();
        ctrl.page.title = 'New Page Title';
        ctrl.titleChange();
        expect(PageService.handleTitleChange).toHaveBeenCalled();
    });
});
------------------------------------------------

────────────────────────────
## Documentation

### 1. Improving In-Code Comments and Documentation  
Some code areas lack clear documentation. Use clearer, consistent documentation (for example, JSDoc) to explain the purpose, parameters, and return values of functions or services.  
Example (before)  
------------------------------------------------
/**************************************************
 *      Make new pages and edit old pages.        *
 **************************************************/
angular.module('cosmo').controller('pageCtrl', [ … ]);
------------------------------------------------  
Suggested fix:  
------------------------------------------------
/**
 * @ngdoc controller
 * @name PageController
 * @description
 * The PageController handles creation and edition of pages.
 * It manages page data, interacts with the REST API, and maintains local versioning.
 * 
 * Functions:
 *   - titleChange: Updates title and auto-generates the URL
 *   - savePage: Handles both creation and updating of a page.
 *
 * @requires REST
 * @requires PageService
 * @requires $location
 */
angular.module('cosmo').controller('PageController', [function() {
    // Controller implementation…
}]);
------------------------------------------------  
Using this approach consistently across files will help both new and experienced developers understand and test the code.

────────────────────────────
By addressing these issues in readability, maintainability, performance, accessibility, best practices, testing, and documentation, your codebase will become easier to understand, maintain, and extend.

### Tokens: {'input_tokens': 5505, 'output_tokens': 3365, 'reasoning_tokens': 768}
### Execution time: 21.11585569381714
