Your task is to write unit-tests for a legacy part of frontend application.

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


When performing this task, please adhere to the following instructions:
- Choose libraries for testing.
- Set up the testing environment.
- Aim to cover at least 80% of the code.
- Use mocking for dependencies if necessary.
- Ensure that the generated code does not contain any TODOs.
- Simply return the codebase without additional comments.
## Run 1:
### Answer:
```javascript
// rest.test.js
describe('REST Factory', function() {
    var REST, $resource;

    beforeEach(module('cosmo'));

    beforeEach(inject(function(_REST_, _$resource_) {
        REST = _REST_;
        $resource = _$resource_;
        spyOn($resource, 'call').and.callThrough();
    }));

    it('should define REST factory', function() {
        expect(REST).toBeDefined();
    });

    it('should create $resource for blocks', function() {
        expect(REST.blocks).toBeDefined();
        expect($resource).toHaveBeenCalledWith('api/blocks/:blockID', { blockID: '@blockID'},{ update: { method: 'PUT' } });
    });

    it('should create $resource for blocksRequirements', function() {
        expect(REST.blocksRequirements).toBeDefined();
        expect($resource).toHaveBeenCalledWith('api/blocks/:blockID/requirements/:requirementID', { blockID: '@blockID', requirementID: '@requirementID'},{ update: { method: 'PUT' } });
    });

    it('should create $resource for comments', function() {
        expect(REST.comments).toBeDefined();
        expect($resource).toHaveBeenCalledWith('api/comments/:commentID', { commentID: '@commentID'},{ update: { method: 'PUT' } });
    });

    it('should create $resource for content', function() {
        expect(REST.content).toBeDefined();
        expect($resource).toHaveBeenCalledWith('api/content/:contentID', { contentID: '@contentID'},{ update: { method: 'PUT' } });
    });

    it('should create $resource for contentExtras', function() {
        expect(REST.contentExtras).toBeDefined();
        expect($resource).toHaveBeenCalledWith('api/content/:contentID/extras/', { contentID: '@contentID'});
    });

    it('should create $resource for contentRevisions', function() {
        expect(REST.contentRevisions).toBeDefined();
        expect($resource).toHaveBeenCalledWith('api/content/:contentID/revisions/:revisionID', { contentID: '@contentID', revisionID: '@revisionID'}, {update: { method: 'PUT' } });
    });

    it('should create $resource for contentRevisionsExtras', function() {
        expect(REST.contentRevisionsExtras).toBeDefined();
        expect($resource).toHaveBeenCalledWith('api/content/:contentID/revisions/:revisionID/extras/:extraID', { revisionID: '@revisionID', contentID: '@contentID', extraID: '@extraID'});
    });

    it('should create $resource for contentTags', function() {
        expect(REST.contentTags).toBeDefined();
        expect($resource).toHaveBeenCalledWith('api/content/:contentID/tags/', { contentID: '@contentID'});
    });

    it('should create $resource for files', function() {
        expect(REST.files).toBeDefined();
        expect($resource).toHaveBeenCalledWith('api/files/:fileID', { fileID: '@fileID'},{ update: { method: 'PUT' } });
    });

    it('should create $resource for filesTags', function() {
        expect(REST.filesTags).toBeDefined();
        expect($resource).toHaveBeenCalledWith('api/files/:fileID/tag/:tag', { fileID: '@fileID', tag: '@tag'},{ update: { method: 'PUT' } });
    });

    it('should create $resource for menus', function() {
        expect(REST.menus).toBeDefined();
        expect($resource).toHaveBeenCalledWith('api/menus/:menuID', { menuID: '@menuID'},{ update: { method: 'PUT' } });
    });

    it('should create $resource for modules', function() {
        expect(REST.modules).toBeDefined();
        expect($resource).toHaveBeenCalledWith('api/modules/:moduleID', { moduleID: '@moduleID'},{ update: { method: 'PUT' } });
    });

    it('should create $resource for sitemaps', function() {
        expect(REST.sitemaps).toBeDefined();
        expect($resource).toHaveBeenCalledWith('api/sitemaps/');
    });

    it('should create $resource for themes', function() {
        expect(REST.themes).toBeDefined();
        expect($resource).toHaveBeenCalledWith('api/themes/:themeID', { themeID: '@themeID' }, { update: { method: 'PUT' } });
    });

    it('should create $resource for settings', function() {
        expect(REST.settings).toBeDefined();
        expect($resource).toHaveBeenCalledWith('api/settings/',{}, { update: { method: 'PUT' } });
    });

    it('should create $resource for users', function() {
        expect(REST.users).toBeDefined();
        expect($resource).toHaveBeenCalledWith('api/users/:userID', { userID: '@userID' }, { update: { method: 'PUT' } });
    });
});
```

```javascript
// page.test.js
describe('Page Factory', function() {
    var Page;

    beforeEach(module('cosmo'));

    beforeEach(inject(function(_Page_) {
        Page = _Page_;
    }));

    it('should define Page factory', function() {
        expect(Page).toBeDefined();
    });

    it('should have default values', function() {
        expect(Page.id).toBe(0);
        expect(Page.title).toBe('');
        expect(Page.description).toBe('');
        expect(Page.header).toBe('');
        expect(Page.subheader).toBe('');
        expect(Page.body).toBe('');
        expect(Page.url).toBe('');
        expect(Page.type).toBe('');
        expect(Page.published).toBe('');
        expect(Page.published_date).toBe('');
        expect(Page.themePages).toEqual([]);
        expect(Page.timestamp).toBe('');
        expect(Page.extras).toEqual([]);
        expect(Page.misc).toEqual({});
    });
});
```

```javascript
// users.test.js
describe('Users Factory', function() {
    var Users;

    beforeEach(module('cosmo'));

    beforeEach(inject(function(_Users_) {
        Users = _Users_;
    }));

    it('should define Users factory', function() {
        expect(Users).toBeDefined();
    });

    it('should have default values', function() {
        expect(Users.id).toBe('');
        expect(Users.username).toBe('');
        expect(Users.name).toBe('');
        expect(Users.bio).toBe('');
        expect(Users.email).toBe('');
        expect(Users.facebook).toBe('');
        expect(Users.twitter).toBe('');
        expect(Users.photo).toBe('');
        expect(Users.role).toBe('');
    });
});
```

```javascript
// pageCtrl.test.js
describe('pageCtrl', function() {
    var $scope, controller, REST, Page, $location, $rootScope, $routeParams, $upload, Users, $translate, localStorage;

    beforeEach(module('cosmo'));

    beforeEach(inject(function($controller, _$rootScope_, _$location_, _REST_, _Page_, _$routeParams_, _$upload_, _Users_, _$translate_) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        REST = _REST_;
        Page = _Page_;
        $location = _$location_;
        $routeParams = _$routeParams_;
        $upload = _$upload_;
        Users = _Users_;
        $translate = _$translate_;
        localStorage = jasmine.createSpyObj('localStorage', ['getItem', 'setItem']);

        controller = $controller('pageCtrl', {
            $scope: $scope,
            REST: REST,
            Page: Page,
            $location: $location,
            $rootScope: $rootScope,
            $routeParams: $routeParams,
            $upload: $upload,
            Users: Users,
            $translate: $translate
        });

        spyOn(REST.content, '$save').and.returnValue({$promise:Promise.resolve({})});
        spyOn(REST.content, '$update').and.returnValue({$promise:Promise.resolve({})});
        spyOn(REST.content, '$delete').and.returnValue({$promise:Promise.resolve({})});
        spyOn(REST.contentRevisions, '$save').and.returnValue({$promise:Promise.resolve({})});
        spyOn(REST.contentRevisions, '$delete').and.returnValue({$promise:Promise.resolve({})});
        spyOn(REST.contentExtras, '$save').and.returnValue({$promise:Promise.resolve({})});
        spyOn(REST.contentExtras, '$delete').and.returnValue({$promise:Promise.resolve({})});
        spyOn(REST.contentRevisionsExtras, '$save').and.returnValue({$promise:Promise.resolve({})});
        spyOn(REST.contentRevisionsExtras, '$delete').and.returnValue({$promise:Promise.resolve({})});
        spyOn(REST.contentTags, '$query').and.returnValue({$promise:Promise.resolve([])});
        spyOn(REST.contentTags, '$save').and.returnValue({$promise:Promise.resolve({})});
        spyOn(REST.contentTags, '$delete').and.returnValue({$promise:Promise.resolve({})});
        spyOn($location, 'path');
        spyOn($rootScope,.$broadcast);
        spyOn($translate, 'instant').and.returnValue('translated text');
        spyOn($translate, 'then').and.callFake(function(callback) {
            var deferred = Promise.defer();
            deferred.resolve(callback('translated text'));
            return deferred.promise;
        });
        spyOn(Date.prototype, 'getHours').and.returnValue(10);
        spyOn(Date.prototype, 'getMinutes').and.returnValue(30);
        spyOn(Date.prototype, 'getMonth').and.returnValue(1);
        spyOn(Date.prototype, 'getDate').and.returnValue(15);
        spyOn(Date.prototype, 'getFullYear').and.returnValue(2024);
        spyOn(Date, 'parse').and.returnValue(new Date(2024, 1, 15, 10, 30));
        spyOn(window, 'localStorage', 'get').and.returnValue(localStorage);
    }));

    it('should initialize $scope.page with Page data', function() {
        Page.id = 1;
        Page.title = 'Test Page';
        Page.description = 'Test Description';
        Page.url = 'test-page';
        Page.publish = 'Y';
        Page.scheduleDate = new Date(2024, 0, 1);
        Page.tags = ['tag1', 'tag2'];
        Page.type = 'article';
        Page.themePages = ['article', 'blog'];

        controller = createController();

        expect($scope.page.id).toBe(1);
        expect($scope.page.title).toBe('Test Page');
        expect($scope.page.description).toBe('Test Description');
        expect($scope.page.url).toBe('test-page');
        expect($scope.page.publish).toBe('Y');
        expect($scope.page.scheduleDate).toEqual(new Date(2024, 0, 1));
        expect($scope.page.tags).toEqual(['tag1', 'tag2']);
        expect($scope.page.type).toBe('article');
        expect($scope.page.themePages).toEqual(['article', 'blog']);
    });

    it('should set scheduleDate to today if not set and path is /new', function() {
        $location.path('/new');
        controller = createController();
        expect($scope.page.scheduleDate).toEqual(jasmine.any(Date));
    });

    it('should set page.type to first themePage if Page.type is not set', function() {
        Page.themePages = ['article', 'blog'];
        Page.type = '';
        controller = createController();
        expect($scope.page.type).toBe('article');
    });

    it('should set page.type to Page.type if Page.type is set', function() {
        Page.themePages = ['article', 'blog'];
        Page.type = 'blog';
        controller = createController();
        expect($scope.page.type).toBe('blog');
    });

    describe('localVersion', function() {
        it('should revert to local version and clear localStorage', function() {
            $routeParams.url = 'test-page';
            localStorage.getItem.and.returnValues('local title', 'local description', 'Y', '1672531200000', null, 'article', 'local url');
            Page.title = 'server title';
            Page.description = 'server description';
            Page.publish = 'N';
            Page.scheduleDate = new Date(2024, 1, 1);
            Page.type = 'blog';
            Page.url = 'server-url';

            $scope.localVersion();

            expect(Page.title).toBe('local title');
            expect(Page.description).toBe('local description');
            expect(Page.publish).toBe('Y');
            expect(Page.scheduleDate).toBe('1672531200000'); // Should be string from localStorage
            expect(Page.type).toBe('article');
            expect(Page.url).toBe('local url');

            expect(localStorage.setItem).toHaveBeenCalledWith('test-pagetitle', null);
            expect(localStorage.setItem).toHaveBeenCalledWith('test-pagedescription', null);
            expect(localStorage.setItem).toHaveBeenCalledWith('test-pagepublish', null);
            expect(localStorage.setItem).toHaveBeenCalledWith('test-pagescheduleDate', null);
            expect(localStorage.setItem).toHaveBeenCalledWith('test-pagetype', null);
            expect(localStorage.setItem).toHaveBeenCalledWith('test-pageurl', null);

            expect($scope.newerVersion).toBe(false);
            expect($rootScope.$broadcast).toHaveBeenCalledWith('contentGet');
        });
    });

    describe('deleteNewerVersion', function() {
        it('should clear localStorage and set newerVersion to false', function() {
            $routeParams.url = 'test-page';
            $scope.deleteNewerVersion();

            expect(localStorage.setItem).toHaveBeenCalledWith('test-pagetitle', null);
            expect(localStorage.setItem).toHaveBeenCalledWith('test-pagedescription', null);
            expect(localStorage.setItem).toHaveBeenCalledWith('test-pagepublish', null);
            expect(localStorage.setItem).toHaveBeenCalledWith('test-pagescheduleDate', null);
            expect(localStorage.setItem).toHaveBeenCalledWith('test-pageheader', null);
            expect(localStorage.setItem).toHaveBeenCalledWith('test-pagesubheader', null);
            expect(localStorage.setItem).toHaveBeenCalledWith('test-pagebody', null);
            expect(localStorage.setItem).toHaveBeenCalledWith('test-pageurl', null);

            expect($scope.newerVersion).toBe(false);
        });
    });

    describe('deletePage', function() {
        it('should delete page and revisions and redirect to new page', function() {
            Page.id = 1;
            $scope.page.id = 1;
            $scope.deletePage();

            expect(REST.content.$delete).toHaveBeenCalledWith({ contentID: 1 });
            expect(REST.contentRevisions.$delete).toHaveBeenCalledWith({ contentID: 1 });
            expect(REST.contentRevisionsExtras.$delete).toHaveBeenCalledWith({ contentID: 1 });
            expect(REST.contentExtras.$delete).toHaveBeenCalledWith({ contentID: 1 });
            expect(REST.contentTags.$delete).toHaveBeenCalledWith({ contentID: 1 });
            expect($location.path).toHaveBeenCalledWith('new');
            expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated text' });
        });
    });

    describe('$on contentGet', function() {
        it('should update page variables when contentGet event is broadcasted', function() {
            Page.title = 'Updated Title';
            Page.description = 'Updated Description';
            Page.url = 'updated-url';
            Page.type = 'updated-type';
            Page.tags = ['updated-tag'];

            $rootScope.$broadcast('contentGet');
            $scope.$digest();

            expect($scope.page.title).toBe('Updated Title');
            expect($scope.page.description).toBe('Updated Description');
            expect($scope.page.url).toBe('updated-url');
            expect($scope.page.type).toBe('updated-type');
            expect($scope.page.tags).toEqual(['updated-tag']);
        });
    });

    describe('updatePageType', function() {
        it('should update Page.type and broadcast settingsGet event', function() {
            $scope.page.type = 'blog';
            $scope.updatePageType();
            expect(Page.type).toBe('blog');
            expect($rootScope.$broadcast).toHaveBeenCalledWith('settingsGet');
        });
    });

    describe('titleChange', function() {
        it('should update Page.title and auto-generate url for new pages', function() {
            $scope.page.title = 'New Page Title';
            $scope.page.url = 'new';
            $scope.titleChange();
            expect(Page.title).toBe('New Page Title');
            expect($scope.page.url).toBe('new-page-title');
            expect(Page.url).toBe('new-page-title');
        });

        it('should not auto-generate url if autoURL is false', function() {
            $scope.page.title = 'New Page Title';
            $scope.page.url = 'existing-url';
            $scope.autoURL = false;
            $scope.titleChange();
            expect($scope.page.url).toBe('existing-url');
            expect(Page.url).toBe('existing-url');
        });
    });

    describe('descriptionChange', function() {
        it('should update Page.description', function() {
            $scope.page.description = 'New Description';
            $scope.descriptionChange();
            expect(Page.description).toBe('New Description');
        });
    });

    describe('urlChange', function() {
        it('should update Page.url', function() {
            $scope.page.url = 'new-url';
            $scope.urlChange();
            expect(Page.url).toBe('new-url');
        });
    });

    describe('saveLocal', function() {
        it('should save page variables to localStorage', function() {
            $routeParams.url = 'test-page';
            $scope.page.title = 'Local Title';
            $scope.page.description = 'Local Description';
            $scope.page.url = 'local-url';
            $scope.page.type = 'local-type';
            Page.title = 'Initial Title';
            Page.description = 'Initial Description';
            Page.url = 'initial-url';
            Page.type = 'initial-type';

            $scope.saveLocal();

            expect(Page.title).toBe('Local Title');
            expect(Page.description).toBe('Local Description');
            expect(Page.url).toBe('local-url');
            expect(Page.type).toBe('local-type');

            expect(localStorage.setItem).toHaveBeenCalledWith('test-page' + 'title', 'Local Title');
            expect(localStorage.setItem).toHaveBeenCalledWith('test-page' + 'description', 'Local Description');
            expect(localStorage.setItem).toHaveBeenCalledWith('test-page' + 'url', 'local-url');
            expect(localStorage.setItem).toHaveBeenCalledWith('test-page' + 'publish', undefined);
            expect(localStorage.setItem).toHaveBeenCalledWith('test-page' + 'scheduleDate', undefined);
            expect(localStorage.setItem).toHaveBeenCalledWith('test-page' + 'type', 'local-type');
        });
    });

    describe('autocompleteTags', function() {
        it('should query contentTags and set suggestions', function() {
            REST.contentTags.$query.and.returnValue({$promise:Promise.resolve(['tag1', 'tag2'])});
            $scope.page.tags = ['te'];
            $scope.autocompleteTags();
            $scope.$digest();
            expect(REST.contentTags.$query).toHaveBeenCalledWith({ tag: 'te' });
            expect($scope.page.suggestions).toEqual(['tag1', 'tag2']);
        });

        it('should clear suggestions if no tag is entered', function() {
            $scope.page.tags = [''];
            $scope.autocompleteTags();
            expect($scope.page.suggestions).toEqual([]);
        });

        it('should clear suggestions if no tag found', function() {
            REST.contentTags.$query.and.returnValue({$promise:Promise.reject()});
            $scope.page.tags = ['test'];
            $scope.autocompleteTags();
            $scope.$digest();
            expect($scope.page.suggestions).toEqual([]);
        });
    });

    describe('selectSuggestion', function() {
        it('should select suggestion and clear suggestions', function() {
            $scope.page.tags = ['te', ''];
            $scope.selectSuggestion('testTag');
            expect($scope.page.tags).toEqual(['te', 'testTag', '']);
            expect($scope.page.suggestions).toEqual([]);
        });
    });

    describe('savePage', function() {
        it('should show error if duplicate url on duplicate save', function() {
            $location.path('/test-page');
            $scope.page.url = '/test-page';
            $scope.savePage(true);
            expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated text', classes: 'alert-error' });
        });

        it('should show error if no page type selected', function() {
            $scope.page.type = null;
            $scope.savePage();
            expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated text', classes: 'alert-error' });
        });

        it('should show error if no url for new page', function() {
            $location.path('/new');
            $scope.page.url = '';
            $scope.savePage();
            expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated text', classes: 'alert-error' });
        });

        describe('new page save', () => {
            beforeEach(() => {
                $location.path('/new');
                $scope.page.title = 'New Title';
                $scope.page.description = 'New Description';
                $scope.page.url = 'new-url';
                $scope.page.type = 'article';
                $scope.page.tags = ['tag1', 'tag2'];
                Users.id = 'user123';
                Page.header = 'header';
                Page.subheader = 'subheader';
                Page.body = 'body';
                Page.extras = { featured: { src: 'image.jpg' }, custom: 'data' };
                REST.content.$save.and.returnValue({$promise:Promise.resolve({id: 1})});
            });

            it('should save new page and redirect', function() {
                $scope.savePage();
                $scope.$digest();

                expect(REST.content.$save).toHaveBeenCalled();
                expect(REST.contentRevisions.$save).toHaveBeenCalled();
                expect(REST.contentTags.$save).toHaveBeenCalledTimes(2);
                expect(REST.contentExtras.$save).toHaveBeenCalledTimes(2);
                expect(REST.contentRevisionsExtras.$save).toHaveBeenCalledTimes(2);
                expect($location.path).toHaveBeenCalledWith('new-url');
                expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated text' });
            });

            it('should handle error on save new page', function() {
                REST.content.$save.and.returnValue({$promise:Promise.reject()});
                $scope.savePage();
                $scope.$digest();
                expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated text', classes: 'alert-error' });
            });
        });

        describe('update existing page', () => {
            beforeEach(() => {
                Page.id = 1;
                $scope.page.id = 1;
                $location.path('/edit-page');
                $scope.page.title = 'Updated Title';
                $scope.page.description = 'Updated Description';
                $scope.page.url = 'updated-url';
                $scope.page.type = 'blog';
                $scope.page.tags = ['tag3', 'tag4'];
                Users.id = 'user456';
                Page.header = 'updated header';
                Page.subheader = 'updated subheader';
                Page.body = 'updated body';
                Page.extras = { featured: { src: 'updated_image.jpg' }, updated_custom: 'updated_data' };
            });

            it('should update existing page and redirect', function() {
                $scope.savePage();
                $scope.$digest();

                expect(REST.content.$update).toHaveBeenCalled();
                expect(REST.contentRevisions.$save).toHaveBeenCalled();
                expect(REST.contentTags.$delete).toHaveBeenCalledWith({ contentID: 1 }, jasmine.any(Function));
                expect(REST.contentTags.$save).toHaveBeenCalledTimes(2);
                expect(REST.contentExtras.$delete).toHaveBeenCalledWith({ contentID: 1 }, jasmine.any(Function));
                expect(REST.contentExtras.$save).toHaveBeenCalledTimes(2);
                expect(REST.contentRevisionsExtras.$save).toHaveBeenCalledTimes(2);
                expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated text' });
            });

             it('should handle error on update existing page', function() {
                REST.content.$update.and.returnValue({$promise:Promise.reject()});
                $scope.savePage();
                $scope.$digest();
                expect($rootScope.$broadcast).toHaveBeenCalledWith('notify', { message: 'translated text', classes: 'alert-error' });
            });
        });
    });

    function createController() {
        return controller = $controller('pageCtrl', {
            $scope: $scope,
            REST: REST,
            Page: Page,
            $location: $location,
            $rootScope: $rootScope,
            $routeParams: $routeParams,
            $upload: $upload,
            Users: Users,
            $translate: $translate
        });
    }
});
```

```javascript
angular.module('cosmo', ['ngResource', 'pascalprecht.translate', 'ngFileUpload']);
```

### Tokens: {'input_tokens': 6309, 'output_tokens': 6213}
### Execution time: 26.436108827590942
