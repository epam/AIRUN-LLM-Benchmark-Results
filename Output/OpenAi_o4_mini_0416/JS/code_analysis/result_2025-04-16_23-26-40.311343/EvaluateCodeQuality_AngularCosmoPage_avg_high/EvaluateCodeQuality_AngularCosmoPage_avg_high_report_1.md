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
### Answer:
Below is a structured review organized by aspect.  For each issue you’ll find:

  • Issue name  
  • Explanation  
  • Problematic snippet  
  • Corrected / improved snippet  

––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––  
1. Readability Assessment  
––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––  

Issue: Ambiguous argument name in savePage  
Explanation  
• The boolean parameter `duplicate` is confusing – at call sites it isn’t obvious whether `true` means “I want to duplicate” or “I don’t want to.”  
• Rename to a self‑documenting identifier.  

Problematic snippet  
```js
// pageCtrl.js
$scope.savePage = function(duplicate){
  if (duplicate && $scope.page.url === $location.path()) { … }
  // …
};
```

Corrected snippet  
```js
$scope.savePage = function(isDuplicate){
  if (isDuplicate && $scope.page.url === $location.path()) {
    // now clear: isDuplicate means “create a duplicate”
    // ...
  }
  // …
};
```

Issue: Generic `elements` array for localStorage fields  
Explanation  
• The name `elements` gives no clue that these are the page‑field keys you’re persisting locally.  
• Rename to something more descriptive (e.g. `persistedFields`).  

Problematic snippet  
```js
var elements = ['title','description','publish','scheduleDate','header','subheader','body','url'];
angular.forEach(elements,function(value){ 
  localStorage.setItem($routeParams.url+value, null);
});
```

Corrected snippet  
```js
var persistedFields = ['title','description','publish','scheduleDate','header','subheader','body','url'];
persistedFields.forEach(function(fieldName){
  localStorage.removeItem($routeParams.url + fieldName);
});
```

Issue: Inline complex date formatting  
Explanation  
• Manually building strings (`MM/DD/YYYY HH:MM AM/PM`) inline makes the controller hard to read and maintain.  
• Leverage Angular’s built-in `date` filter (or a custom filter) for formatting.  

Problematic snippet  
```js
var date = new Date($scope.page.scheduleDate * 1000);
var hours = date.getHours()>12?date.getHours()-12:date.getHours();
var ampm = date.getHours()>12?'PM':'AM';
var formattedDate = date.getMonth()+1+'/'+date.getDate()+
    '/'+date.getFullYear()+' '+hours+':'+date.getMinutes()+' '+ampm;
// $scope.page.scheduleDate = formattedDate;
```

Corrected snippet (using built‑in filter in template)  
```html
<!-- page.html -->
<label for="schedule" translate="schedule"></label>
<input type="datetime-local" 
       ng-model="page.scheduleDate"
       ng-show="page.publish=='schedule'">
<p>Scheduled: {{ page.scheduleDate * 1000 | date:'MM/dd/yyyy h:mm a' }}</p>
```

––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––  
2. Maintainability Evaluation  
––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––  

Issue: Monolithic controller violates SRP  
Explanation  
• `pageCtrl` contains paging, localStorage, REST calls, tag logic, revision logic, notifications, etc.  
• Break into smaller services (e.g. `LocalStorageService`, `PageService`, `TagService`, `NotificationService`) and let the controller orchestrate only.  

Problematic snippet  
```js
// in pageCtrl.js – 300 lines of mixed logic
$scope.deletePage = function(){
  REST.content.delete({contentID:$scope.page.id},…);
  REST.contentRevisions.delete({contentID:$scope.page.id});
  REST.contentRevisionsExtras.delete({contentID:$scope.page.id});
  REST.contentExtras.delete({contentID:$scope.page.id});
  REST.contentTags.delete({contentID:$scope.page.id});
  $location.path('new');
};
```

Corrected snippet (extracted to PageService)  
```js
// page.service.js
angular.module('cosmo')
  .service('PageService', ['REST', function(REST){
    this.deleteAll = function(contentID){
      var promises = [];
      promises.push(REST.content.delete({contentID}).$promise);
      promises.push(REST.contentRevisions.delete({contentID}).$promise);
      promises.push(REST.contentRevisionsExtras.delete({contentID}).$promise);
      promises.push(REST.contentExtras.delete({contentID}).$promise);
      promises.push(REST.contentTags.delete({contentID}).$promise);
      return Promise.all(promises);
    };
  }]);

// in pageCtrl.js
$scope.deletePage = function(){
  PageService.deleteAll($scope.page.id).then(function(){
    NotificationService.success($translate.instant('deleted'));
    $location.path('new');
  });
};
```

Issue: Direct localStorage access couples controller to storage implementation  
Explanation  
• Mixing storage calls with controller logic makes future changes (e.g. migrating to IndexedDB) painful.  
• Extract to a `LocalStorageService`.  

Problematic snippet  
```js
localStorage.setItem($routeParams.url + 'title', Page.title);
```

Corrected snippet  
```js
// local-storage.service.js
angular.module('cosmo')
  .service('LocalStorageService', function(){
    this.save = function(key, value){
      localStorage.setItem(key, angular.toJson(value));
    };
    this.load = function(key){
      return angular.fromJson(localStorage.getItem(key));
    };
    this.clear = function(key){
      localStorage.removeItem(key);
    };
  });

// in pageCtrl.js
LocalStorageService.save($routeParams.url + 'title', Page.title);
```

Issue: Page and Users factories hold mutable global state without API  
Explanation  
• Plain objects let any code arbitrarily modify properties.  
• Encapsulate accessors/mutators in a service so you can add hooks or validation.  

Problematic snippet  
```js
// page.js
angular.module('cosmo').factory('Page', function(){
  return { id:0, title:'',… };
});
```

Corrected snippet  
```js
// page.service.js
angular.module('cosmo')
  .service('PageService', function(){
    var _page = { id:0, title:'', … };
    return {
      get: function(){ return angular.copy(_page); },
      set: function(data){ angular.extend(_page, data); },
      clear: function(){ /* reset fields */ }
    };
  });
```

––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––  
3. Performance Optimization  
––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––  

Issue: Unthrottled ng‑keyup events  
Explanation  
• `ng-keyup="titleChange()"` fires on every keystroke, triggering two‑way binding and localStorage writes (if hooked).  
• Use `ng-model-options` to debounce.  

Problematic snippet  
```html
<input type="text"
       ng-model="page.title"
       ng-keyup="titleChange()"
       placeholder="…">
```

Corrected snippet  
```html
<input type="text"
       ng-model="page.title"
       ng-model-options="{ debounce: 300 }"
       ng-change="titleChange()"
       placeholder="…">
```

Issue: Tag-autocomplete fires immediate HTTP on every change  
Explanation  
• As the user types comma‑separated tags, each keystroke issues a new `REST.contentTags.query`.  
• Debounce the calls with `$timeout`.  

Problematic snippet  
```js
$scope.autocompleteTags = function(){
  var tag = $scope.page.tags.slice(-1)[0];
  if(tag){
    REST.contentTags.query({tag:tag},function(data){
      $scope.page.suggestions = data;
    });
  }
};
```

Corrected snippet  
```js
var tagTimeout;
$scope.autocompleteTags = function(){
  $timeout.cancel(tagTimeout);
  tagTimeout = $timeout(function(){
    var tag = $scope.page.tags.slice(-1)[0];
    if(tag){
      REST.contentTags.query({tag:tag}).$promise
        .then(function(data){ $scope.page.suggestions = data; })
        .catch(function(){ $scope.page.suggestions = []; });
    } else {
      $scope.page.suggestions = [];
    }
  }, 300);
};
```

Issue: Not unregistering event listeners  
Explanation  
• `$scope.$on('contentGet', ...)` remains active after controller destruction, risking memory leaks if the view is re‑instantiated.  
• Capture the deregistration handle and clean up.  

Problematic snippet  
```js
$scope.$on('contentGet', function(){
  updatePage();
});
```

Corrected snippet  
```js
var deregisterContentGet = $scope.$on('contentGet', updatePage);
$scope.$on('$destroy', function(){
  deregisterContentGet();
});
```

––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––  
4. Accessibility Improvements  
––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––  

Issue: Buttons lack ARIA labels  
Explanation  
• Relying on icons or `translate` attributes alone may not convey meaning to screen‑readers.  
• Add `aria-label="{{ 'save'|translate }}"` or embed readable text.  

Problematic snippet  
```html
<button class="btn-success" ng-click="savePage()" translate="save"></button>
```

Corrected snippet  
```html
<button class="btn-success"
        ng-click="savePage()"
        aria-label="{{ 'save'|translate }}">
  <i class="fa fa-save" aria-hidden="true"></i>
  <span class="sr-only">{{ 'save'|translate }}</span>
</button>
```

Issue: Radios not in a fieldset with legend  
Explanation  
• Grouping related radio buttons in a `<fieldset>` with a `<legend>` gives screen‑reader users context.  

Problematic snippet  
```html
<input type="radio" ng-model="page.publish" id="Y" value="Y">…
<input type="radio" ng-model="page.publish" id="N" value="N">…
```

Corrected snippet  
```html
<fieldset>
  <legend translate="publication_status"></legend>
  <label for="publish-yes">
    <input type="radio" id="publish-yes" ng-model="page.publish" value="Y">
    {{ 'publish'|translate }}
  </label>
  <label for="publish-no">
    <input type="radio" id="publish-no" ng-model="page.publish" value="N">
    {{ 'draft'|translate }}
  </label>
  <!-- … -->
</fieldset>
```

Issue: Tag suggestions list items not keyboard‑navigable  
Explanation  
• `<a>` without `href` or `role="button"` is not announced as actionable; keyboard users cannot focus or “click” with Enter.  

Problematic snippet  
```html
<div class="tag-suggestions" ng-show="page.suggestions.length">
  <a ng-repeat="tag in page.suggestions" ng-click="selectSuggestion(tag)">{{tag}}</a>
</div>
```

Corrected snippet  
```html
<ul class="tag-suggestions" ng-show="page.suggestions.length" role="listbox">
  <li ng-repeat="tag in page.suggestions"
      role="option"
      tabindex="0"
      ng-click="selectSuggestion(tag)"
      ng-keydown="$event.key==='Enter' && selectSuggestion(tag)">
    {{tag | titlecase}}
  </li>
</ul>
```

––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––  
5. Angular.js Best Practices  
––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––  

Issue: Using `$scope` rather than `controllerAs` syntax  
Explanation  
• The “controllerAs” approach removes `$scope` noise and makes code easier to ES6‑ify later.  

Problematic snippet  
```js
angular.module('cosmo').controller('pageCtrl', ['$scope',…,
  function($scope, REST, …){
    $scope.page = { … };
    // …
  }
]);
```

Corrected snippet  
```js
angular.module('cosmo')
  .controller('PageCtrl', PageCtrl);

PageCtrl.$inject = ['REST','PageService','NotificationService','$routeParams','$timeout'];
function PageCtrl(REST, PageService, NotificationService, $routeParams, $timeout){
  var vm = this;
  vm.page = PageService.get();
  vm.savePage = savePage;
  // …
}
```
```html
<div ng-controller="PageCtrl as pageVm">
  <button ng-click="pageVm.savePage()">…</button>
</div>
```

Issue: Inline $resource definitions duplicate code  
Explanation  
• In `rest.js` you repeatedly define `{ update: { method: 'PUT' } }`.  
• Extract a default `actions` object and reuse.  

Problematic snippet  
```js
angular.module('cosmo').factory('REST',['$resource',function($resource){
  return {
    content: $resource('api/content/:id',{id:'@id'},{ update:{method:'PUT'} }),
    comments: $resource('api/comments/:id',{id:'@id'},{ update:{method:'PUT'} }),
    // …
  };
}]);
```

Corrected snippet  
```js
angular.module('cosmo')
  .constant('DEFAULT_ACTIONS', { update:{method:'PUT'} })
  .factory('REST',['$resource','DEFAULT_ACTIONS',function($resource,DEFAULT_ACTIONS){
    return {
      content: $resource('api/content/:id',{id:'@id'},DEFAULT_ACTIONS),
      comments: $resource('api/comments/:id',{id:'@id'},DEFAULT_ACTIONS),
      // …
    };
  }]);
```

Issue: Excessive use of `$rootScope.$broadcast` for notifications  
Explanation  
• Broadcasting across the entire app can lead to tangled event flows and unexpected listeners firing.  
• Use a dedicated `NotificationService` that exposes `success()`, `error()`, etc.  

Problematic snippet  
```js
$translate('deleted').then(function(t){
  $rootScope.$broadcast('notify',{ message:t });
});
```

Corrected snippet  
```js
NotificationService.success($translate.instant('deleted'));
```

––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––  
6. Documentation Enhancement  
––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––  

Issue: File‑level comments are generic banners  
Explanation  
• These banners (“REST Factory”, “Page Factory”) don’t conform to ngDoc and don’t document inputs, outputs or events.  
• Use ngDoc to document what the service provides, its methods, and its API.  

Problematic snippet  
```js
/**************************************************
 *                 REST Factory                   *
 *       Communicate with RESTful backend         *
 **************************************************/
angular.module('cosmo').factory('REST', …);
```

Corrected snippet  
```js
/**
 * @ngdoc service
 * @name cosmo.service:REST
 * @description
 *   Provides $resource wrappers for all core API endpoints.
 *
 * @example
 *   REST.content.get({contentID:123}).$promise.then(…);
 *
 * @requires $resource
 * @requires DEFAULT_ACTIONS
 */
angular.module('cosmo')
  .factory('REST', ['$resource','DEFAULT_ACTIONS', function($resource, DEFAULT_ACTIONS){
    // …
  }]);
```

Issue: Missing method‑level documentation in controllers  
Explanation  
• Functions like `localVersion()`, `deleteNewerVersion()`, `savePage()` have no docblocks explaining their purpose, parameters, or side‑effects.  
• Add ngDoc comments before each.  

Corrected snippet  
```js
/**
 * @ngdoc method
 * @name cosmo.controller:PageCtrl#localVersion
 * @methodOf cosmo.controller:PageCtrl
 * @description
 *   Restores unsaved changes from localStorage into the Page model,
 *   clears those localStorage entries, and updates the view.
 */
vm.localVersion = function(){
  // …
};
```

Issue: Unclear events and data contracts  
Explanation  
• You broadcast `'contentGet'`, `'settingsGet'`, and `'notify'` events on `$rootScope`.  No code comments explain who listens, what data they expect or emit.  
• Document all events and payloads in one place.  

Corrected snippet (example)  
```js
/**
 * @ngdoc event
 * @name cosmo.event:notify
 * @eventOf cosmo.controller:PageCtrl
 * @description
 *   Notifies the user of a status message.
 * @param {Object} args
 * @param {String} args.message   Localized message text.
 * @param {String=} args.classes  Optional CSS classes (e.g. 'alert-error').
 */
```

––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––  
By addressing the above points you will improve the clarity, modularity, performance and accessibility of your AngularJS application, and bring it more in line with current best practices.

### Tokens: {'input_tokens': 5628, 'output_tokens': 6016, 'reasoning_tokens': 2304}
### Execution time: 58.85059404373169
