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
## Run 2:
### Answer:
```typescript
// rest.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor() { }

  getBlocks(blockID: string): Observable<any> {
    // Simulated backend response
    return of({ data: { blockID } });
  }

  // Add other REST methods similarly...
}

```

```typescript
// page.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  private _id: number = 0;
  private _title: string = '';
  private _description: string = '';
  private _header: string = '';
  private _subheader: string = '';
  private _body: string = '';
  private _url: string = '';
  private _type: string = '';
  private _published: string = '';
  private _publishedDate: string = '';
  private _themePages: string[] = [];
  private _timestamp: string = '';
  private _extras: any[] = [];
  private _misc: any = {};

  constructor() { }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }
  // Add getters and setters for other properties similarly...
}

```

```typescript
// users.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private _id: string = '';
  private _username: string = '';
  private _name: string = '';
  private _bio: string = '';
  private _email: string = '';
  private _facebook: string = '';
  private _twitter: string = '';
  private _photo: string = '';
  private _role: string = '';

  constructor() { }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  // Add getters and setters for other properties similarly...
}

```

```typescript
// page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageComponent } from './page.component';
import { RestService } from '../rest.service';
import { of } from 'rxjs';
import { PageService } from '../page.service';
import { UsersService } from '../users.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('PageComponent', () => {
  let component: PageComponent;
  let fixture: ComponentFixture<PageComponent>;
  let restServiceMock: jasmine.SpyObj<RestService>;
  let pageService: PageService;
  let usersService: UsersService;

  beforeEach(async () => {
    restServiceMock = jasmine.createSpyObj('RestService', ['content', 'contentRevisions', 'contentRevisionsExtras', 'contentExtras', 'contentTags']);
    restServiceMock.content = jasmine.createSpyObj('content', ['save', 'update', 'delete']);
    restServiceMock.contentRevisions = jasmine.createSpyObj('contentRevisions', ['save', 'delete']);
    restServiceMock.contentRevisionsExtras = jasmine.createSpyObj('contentRevisionsExtras', ['save', 'delete']);
    restServiceMock.contentExtras = jasmine.createSpyObj('contentExtras', ['save', 'delete']);
    restServiceMock.contentTags = jasmine.createSpyObj('contentTags', ['save', 'query', 'delete']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [PageComponent],
      providers: [
        { provide: RestService, useValue: restServiceMock },
        PageService,
        UsersService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageComponent);
    component = fixture.componentInstance;
    pageService = TestBed.inject(PageService);
    usersService = TestBed.inject(UsersService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize page properties', () => {
    expect(component.page.id).toBe(0);
    expect(component.page.title).toBe('');
    // ... other properties
  });

  it('should delete a page', () => {
    const contentID = 1;
    component.page.id = contentID;
    restServiceMock.content.delete.and.returnValue(of({}));
    restServiceMock.contentRevisions.delete.and.returnValue(of({}));
    restServiceMock.contentRevisionsExtras.delete.and.returnValue(of({}));
    restServiceMock.contentExtras.delete.and.returnValue(of({}));
    restServiceMock.contentTags.delete.and.returnValue(of({}));

    component.deletePage();

    expect(restServiceMock.content.delete).toHaveBeenCalledWith({ contentID });
    expect(restServiceMock.contentRevisions.delete).toHaveBeenCalledWith({ contentID });
    expect(restServiceMock.contentRevisionsExtras.delete).toHaveBeenCalledWith({ contentID });
    expect(restServiceMock.contentExtras.delete).toHaveBeenCalledWith({ contentID });
    expect(restServiceMock.contentTags.delete).toHaveBeenCalledWith({ contentID });
    // ... assertions for redirect and notifications
  });

  it('should update page type', () => {
    const newType = 'new-type';
    component.page.type = newType;

    component.updatePageType();

    expect(pageService.type).toBe(newType);
    // ... assertions for broadcasting event
  });

  it('should auto-generate URL from title', () => {
    const newTitle = 'Test Title';
    component.page.title = newTitle;

    component.titleChange();

    expect(component.page.url).toBe('test-title');
    expect(pageService.url).toBe('test-title');
  });

  it('should save description changes', () => {
    const newDescription = 'New description';
    component.page.description = newDescription;

    component.descriptionChange();

    expect(pageService.description).toBe(newDescription);
  });

  it('should save URL changes', () => {
    const newUrl = '/new-url';
    component.page.url = newUrl;

    component.urlChange();

    expect(pageService.url).toBe(newUrl);
  });

  it('should save page locally', () => {
    component.page.title = 'Test Title';
    component.page.description = 'Test Description';
    component.page.url = '/test-url';
    component.page.type = 'test-type';

    component.saveLocal();

    expect(pageService.title).toBe('Test Title');
    expect(pageService.description).toBe('Test Description');
    expect(pageService.url).toBe('/test-url');
    expect(pageService.type).toBe('test-type');
    // ... assertions for local storage
  });

  it('should autocomplete tags', () => {
    const tag = 'test';
    restServiceMock.contentTags.query.and.returnValue(of({ data: ['test-tag'] }));

    component.page.tags.push(tag);
    component.autocompleteTags();

    expect(restServiceMock.contentTags.query).toHaveBeenCalledWith({ tag });
    expect(component.page.suggestions).toEqual(['test-tag']);
  });

  it('should select a tag suggestion', () => {
    const tag = 'test-tag';
    component.page.tags = ['test', ''];
    component.page.suggestions = [tag];

    component.selectSuggestion(tag);

    expect(component.page.tags).toEqual(['test', 'test-tag', '']);
    expect(component.page.suggestions).toEqual([]);
  });

  it('should save a new page', () => {
    component.page.title = 'New Page';
    component.page.description = 'New page description';
    component.page.url = '/new-page';
    component.page.type = 'page-type';
    component.page.publish = 'Y';
    usersService.id = '1';

    const featuredImage = 'http://example.com/image.jpg';
    pageService.extras = { featured: { src: featuredImage } };

    restServiceMock.content.save.and.returnValue(of({ id: 1 }));
    restServiceMock.contentRevisions.save.and.returnValue(of({ id: 1 }));

    component.savePage();

    const expectedPageData = {
      title: 'New Page',
      description: 'New page description',
      header: '',
      subheader: '',
      featured: featuredImage,
      body: '',
      url: '/new-page',
      type: 'page-type',
      published: 'Y',
      published_date: jasmine.any(Number),
      author: '1'
    };

    expect(restServiceMock.content.save).toHaveBeenCalledWith(expectedPageData);
    // ... assertions for saving tags, revisions, extras, and notifications
  });

  it('should update an existing page', () => {
    component.page.id = 1;
    component.page.title = 'Updated Page';
    component.page.description = 'Updated page description';
    component.page.url = '/updated-page';
    component.page.type = 'updated-page-type';
    component.page.publish = 'N';
    usersService.id = '1';

    const featuredImage = 'http://example.com/updated-image.jpg';
    pageService.extras = { featured: { src: featuredImage } };

    restServiceMock.content.update.and.returnValue(of({}));
    restServiceMock.contentRevisions.save.and.returnValue(of({ id: 2 }));
    restServiceMock.contentTags.delete.and.returnValue(of({}));
    restServiceMock.contentExtras.delete.and.returnValue(of({}));

    component.savePage();

    const expectedPageData = {
      contentID: 1,
      title: 'Updated Page',
      description: 'Updated page description',
      header: '',
      subheader: '',
      featured: featuredImage,
      body: '',
      url: '/updated-page',
      type: 'updated-page-type',
      published: 'N',
      published_date: jasmine.any(Number),
      author: '1'
    };

    expect(restServiceMock.content.update).toHaveBeenCalledWith(expectedPageData);
    // ... assertions for saving tags, revisions, extras, and notifications
  });
});

```

```typescript
// page.component.ts
import { Component, OnInit } from '@angular/core';
import { PageService } from '../page.service';
import { UsersService } from '../users.service';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

  page = {
    id: this.pageService.id,
    title: this.pageService.title,
    description: this.pageService.description,
    url: this.pageService.url,
    publish: this.pageService.published,
    scheduleDate: this.pageService.publishedDate,
    tags: this.pageService.tags,
    type: this.pageService.type,
    themePages: [] as string[],
    suggestions: [] as string[]
  };
  newerVersion: boolean = false;
  autoURL: boolean = false;

  constructor(
    private pageService: PageService,
    private usersService: UsersService,
    private restService: RestService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.page.themePages = this.pageService.themePages;

    if (this.pageService.type) {
      this.page.type = this.pageService.type;
    } else {
      this.page.type = this.page.themePages[0] || '';
    }

    this.route.paramMap.subscribe(params => {
      const url = params.get('url');
      if (url && url !== 'new') {
        this.checkForUnsavedVersion(url);
      } else {
        this.page.scheduleDate = new Date();
      }
    });
  }

  checkForUnsavedVersion(url: string): void {
    const elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
    elements.forEach(element => {
      const storedValue = localStorage.getItem(`${url}${element}`);
      if (storedValue && storedValue !== this.pageService[element as keyof PageService]) {
        this.newerVersion = true;
      }
    });
  }

  localVersion(): void {
    this.route.paramMap.subscribe(params => {
      const url = params.get('url');
      if (url) {
        const elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
        elements.forEach(element => {
          const storedValue = localStorage.getItem(`${url}${element}`);
          if (storedValue) {
            this.pageService[element as keyof PageService] = storedValue;
            localStorage.removeItem(`${url}${element}`);
          }
        });
        this.newerVersion = false;
      }
    });
  }

  deleteNewerVersion(): void {
    this.route.paramMap.subscribe(params => {
      const url = params.get('url');
      if (url) {
        const elements = ['title', 'description', 'publish', 'scheduleDate', 'header', 'subheader', 'body', 'url'];
        elements.forEach(element => {
          localStorage.removeItem(`${url}${element}`);
        });
        this.newerVersion = false;
      }
    });
  }

  deletePage(): void {
    const contentID = this.page.id;
    if (contentID) {
      this.restService.content.delete({ contentID }).subscribe(
        () => {
          // Success message
          // Redirect to the default new page
          this.router.navigate(['/new']);
        },
        error => {
          // Handle error
        }
      );
    }
  }

  updatePageType(): void {
    this.pageService.type = this.page.type;
  }

  titleChange(): void {
    this.pageService.title = this.page.title;

    if (this.page.url === '/new' || this.page.url === 'new' || !this.page.url) {
      this.autoURL = true;
    }

    if (this.autoURL) {
      this.page.url = this.page.title.toLowerCase().replace(/ /g, '-').replace(/[\.,\/#!$%\^&\*;:{}=_'~()\?]/g, '');
      this.pageService.url = this.page.url;
    }
  }

  descriptionChange(): void {
    this.pageService.description = this.page.description;
  }

  urlChange(): void {
    this.pageService.url = this.page.url;
  }

  saveLocal(): void {
    this.pageService.title = this.page.title;
    this.pageService.description = this.page.description;
    this.pageService.url = this.page.url;
    this.pageService.type = this.page.type;

    this.route.paramMap.subscribe(params => {
      const url = params.get('url');
      if (url) {
        localStorage.setItem(`${url}title`, this.pageService.title);
        localStorage.setItem(`${url}description`, this.pageService.description);
        localStorage.setItem(`${url}url`, this.pageService.url);
        localStorage.setItem(`${url}publish`, this.pageService.published);
        localStorage.setItem(`${url}scheduleDate`, this.pageService.publishedDate);
        localStorage.setItem(`${url}type`, this.pageService.type);
      }
    });
  }

  autocompleteTags(): void {
    const tag = this.page.tags[this.page.tags.length - 1];
    if (tag) {
      this.restService.contentTags.query({ tag }).subscribe(
        data => {
          this.page.suggestions = data;
        },
        () => {
          this.page.suggestions = [];
        }
      );
    } else {
      this.page.suggestions = [];
    }
  }

  selectSuggestion(tag: string): void {
    this.page.tags[this.page.tags.length - 1] = tag;
    this.page.tags.push('');
    this.page.suggestions = [];
  }

  savePage(duplicate?: boolean): void {
    if (duplicate && this.page.url === this.router.url) {
      // Show error message
      return;
    }

    if (!this.page.type) {
      // Show error message
      return;
    }

    if (this.page.title.length === 0) {
      this.page.title = this.pageService.header;
    }

    if (this.page.url.length === 0 || this.page.url === 'new') {
      // Show error message
      return;
    }

    let scheduleDate: number;
    if (this.page.publish === 'Y' && this.pageService.published === 'Y') {
      scheduleDate = parseInt(this.pageService.publishedDate, 10);
    } else if (this.page.publish === 'Y') {
      scheduleDate = Math.round(new Date().getTime() / 1000);
    } else if (this.page.publish === 'schedule') {
      scheduleDate = new Date(this.page.scheduleDate).getTime() / 1000;
      if (new Date(this.page.scheduleDate).getTime() < new Date().getTime()) {
        this.page.publish = 'Y';
      } else {
        this.page.publish = 'N';
      }
    } else {
      scheduleDate = 0; // Default value
    }

    const featured = this.pageService.extras['featured'] ? this.pageService.extras['featured'].src : null;

    if (this.router.url === '/new' || duplicate) {
      this.createNewPage(scheduleDate, featured);
    } else {
      this.updateExistingPage(scheduleDate, featured);
    }
  }

  private createNewPage(scheduleDate: number, featured: string | null): void {
    this.restService.content.save({
      title: this.page.title,
      description: this.page.description,
      header: this.pageService.header,
      subheader: this.pageService.subheader,
      featured: featured,
      body: this.pageService.body,
      url: this.page.url,
      type: this.page.type,
      published: this.page.publish,
      published_date: scheduleDate,
      author: this.usersService.id
    }).subscribe(
      (data: any) => {
        this.page.id = data.id;
        this.autoURL = false;

        this.saveTags(this.page.id);

        this.saveRevision(this.page.id, scheduleDate, featured);
      },
      error => {
        // Handle error
      }
    );
  }

  private updateExistingPage(scheduleDate: number, featured: string | null): void {
    this.restService.content.update({
      contentID: this.page.id,
      title: this.page.title,
      description: this.page.description,
      header: this.pageService.header,
      subheader: this.pageService.subheader,
      featured: featured,
      body: this.pageService.body,
      url: this.page.url,
      type: this.page.type,
      published: this.page.publish,
      published_date: scheduleDate,
      author: this.usersService.id
    }).subscribe(
      () => {
        this.restService.contentTags.delete({ contentID: this.page.id }).subscribe(
          () => {
            this.saveTags(this.page.id);
          },
          error => {
            // Handle error
          }
        );

        this.saveRevision(this.page.id, scheduleDate, featured);
      },
      error => {
        // Handle error
      }
    );
  }

  private saveTags(contentID: number): void {
    if (this.page.tags) {
      this.page.tags.forEach(tag => {
        this.restService.contentTags.save({ contentID, tag }).subscribe(
          () => {},
          error => {
            // Handle error
          }
        );
      });
    }
  }

  private saveRevision(contentID: number, scheduleDate: number, featured: string | null): void {
    this.restService.contentRevisions.save({
      contentID: contentID,
      title: this.page.title,
      description: this.page.description,
      header: this.pageService.header,
      subheader: this.pageService.subheader,
      featured: featured,
      body: this.pageService.body,
      url: this.page.url,
      type: this.page.type,
      published: this.page.publish,
      published_date: scheduleDate,
      author: this.usersService.id
    }).subscribe(
      (data: any) => {
        const revisionID = data.id;
        this.saveExtras(contentID, revisionID);
      },
      error => {
        // Handle error
      }
    );
  }

  private saveExtras(contentID: number, revisionID: number): void {
    let extrasCounter = 0;
    const extrasLength = Object.keys(this.pageService.extras).length;

    if (extrasLength === 0) {
      // Show success message
      // Redirect to new page
      this.router.navigate([this.page.url]);
    } else {
      for (const key in this.pageService.extras) {
        if (this.pageService.extras.hasOwnProperty(key)) {
          const extraValue = typeof this.pageService.extras[key] === 'object'
            ? JSON.stringify(this.pageService.extras[key])
            : this.pageService.extras[key];

          this.restService.contentExtras.save({
            contentID: contentID,
            name: key,
            extra: extraValue
          }).subscribe(
            () => {
              extrasCounter++;
              if (extrasCounter === extrasLength) {
                // Show success message
                // Redirect to new page
                this.router.navigate([this.page.url]);
              }
            },
            error => {
              // Handle error
            }
          );

          this.restService.contentRevisionsExtras.save({
            revisionID: revisionID,
            contentID: contentID,
            name: key,
            extra: extraValue
          }).subscribe(
            () => {},
            error => {
              // Handle error
            }
          );
        }
      }
    }
  }
}

```

### Tokens: {'input_tokens': 6307, 'output_tokens': 5677}
### Execution time: 106.99565196037292
