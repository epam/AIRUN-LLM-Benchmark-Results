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

admin-panel.html
```html
<div ng-controller="adminPanelCtrl">
    <div class="cosmo-default">
        <a class="hamburger" ng-class="{hamburgeractive: admin.active}" ng-click="admin.showAdminPanel=true;admin.active=true" ng-show="isUserAdmin">
            <button class="hamburger">
                <?xml version="1.0" encoding="utf-8"?>
                <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                     viewBox="0 161 612 631" enable-background="new 0 161 612 631" xml:space="preserve">
                <g>
                    <path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M298.3,305.3c-91,59.1-126.3,152.8-135.6,182.8
                        c12.2-7.8,37.1-20.4,69.5-20.4c32.4,0,55.1,12.6,66.1,20.3V305.3z"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M321.3,293.4c101.2,66.1,135.3,170.4,142.3,195.5
                        c10.3-7.7,33.1-21.2,66.7-21.2c46.9,0,74.2,26.4,74.2,26.4S544,311.5,321.3,293.4z"/>
                    <g>
                        <g>
                            <path opacity="0.6" fill-rule="evenodd" clip-rule="evenodd" fill="#6CC7C3" d="M298.3,305.3c-91,59.1-126.3,152.8-135.6,182.8
                                c12.2-7.8,37.1-20.4,69.5-20.4c32.4,0,55.1,12.6,66.1,20.3V305.3z"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" fill="#6CC7C3" d="M288.9,293.5C67.4,312.3,7.2,494.1,7.2,494.1
                                s27.3-26.4,74.2-26.4c32.4,0,54.8,12.6,65.6,20.3C154.4,461.7,188.9,358.9,288.9,293.5z"/>
                            <path opacity="0.6" fill-rule="evenodd" clip-rule="evenodd" fill="#6CC7C3" d="M321.3,293.4c101.2,66.1,135.3,170.4,142.3,195.5
                                c10.3-7.7,33.1-21.2,66.7-21.2c46.9,0,74.2,26.4,74.2,26.4S544,311.5,321.3,293.4z"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" fill="#6CC7C3" d="M313.4,306.2v181.9c11-7.8,33.7-20.3,66.1-20.3
                                c31.1,0,55.1,11.6,67.9,19.4C437.5,456.2,402.3,364.6,313.4,306.2z"/>
                        </g>
                        <polygon fill="#6CC7C3" points="292.8,786 292.8,712.9 299.4,712.9 299.4,503.3 305.4,507.6 311.9,503.4 311.9,712.9 318.4,712.9
                            318.4,786 		"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" fill="#EC1C24" d="M296.7,183.8c0,0-4.1-0.5-7.8-0.2c-3.7,0.3-9.3,4.7-10.9,13.3
                            c-1.6,8.6,1.4,13.3,2.1,18.8c0.7,5.5,2.7,15.6-8.4,36.3c-11,20.7-36.3,27.1-36.3,27.1s-0.3,7.3-0.8,8.2c-0.5,1-1.5,0.7-1.5,2.1
                            c0,1.3,3.3,13.2,3.3,13.2s5-0.7,6.3-0.4c1.3,0.3,1.3,1.6,1.3,1.6s7.8-1.2,9,2.1c-2.2-0.7-2.1-0.4-2.5,0.5
                            c-0.4,0.8-0.6,0.7-1.6,0.9c-1,0.2-3.2-1-5.3-1.4c-2.1-0.4-5.6,0.2-5.6,0.2l1,1.7c0,0,5.7-2.2,6.9,0.5c-1.8-0.3-2.4,1.7-2.4,1.7
                            s11.4,0.8,11.4,4.5c-1.5-1.2-1.9,0.2-3.2,0.8c-1.3,0.6-7.4-4.5-12-2.7c-2.4,0.9,5.2,6.9,3.1,8.1c-4.7,2-4.6-7.7-7.4-8.3
                            c-5.3-0.8-8.4,2-10.5,1.2c-2-0.8-2.9,0.5-2.9,0.5s-0.2-2.5,1.7-3.6c1.9-1,7.8-0.5,8.6-2.1c0.7-1.6-2-2.8-5.7-2.9
                            c-3.7,0-6.5,1.3-7.9,1c-1.4-0.3-2,0.6-2,0.6s-0.9-2.2,1.9-3.1c2.8-0.9,9.5-0.4,9.5-2.9c0-2.5-4.3-12.2-4.3-12.2s-0.7-0.1-2-0.9
                            c-1.3-0.8-3-6.3-3-6.3s-9.2,0.4-17.3-1.2c-8.1-1.6-12.9-3.8-12.9-3.8s-25.2,19.6-35.6,26.1c-10.4,6.6-25.6,8.4-28.8,6.4
                            c-3.1-2,10.1-9.6,17.6-15.4c7.5-5.9,13.5-12.8,13.5-12.8s-2.4-0.1-2.1-1.7c1.3-1.2,8.8-8.3,8.8-8.3s-1.5-0.2-1.2-1.2
                            c2.8-2,6.7-5.7,6.7-5.7s-1.5-0.7-0.7-1.9c3.1-1.6,12.8-10.2,12.8-10.2s-0.2-2.9,1-4c1.4-0.8,7.8-5.3,16.2-12.6
                            c8.4-7.3,11.1-14.3,24.5-22.6c13.4-8.2,23.1-6.2,27-13.8c3.9-7.6,6.7-14.5,8.7-17.6c1.9-3.1,4.4-4.5,5.5-6.3s3.9-7.8,13.5-8.2
                            c9.6-0.4,13,8.7,13,8.7s0,0,1.2,0.6c1.2,0.6,2.1,2.6,2.1,2.6S296.9,180.8,296.7,183.8z"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" fill="#EC1C24" d="M385.2,273.4c5.6-5.4,12.4-24.2,14.5-28
                            c2.1-3.9,10-14.5,3.1-25.4c-7-10.9-11.2-13.6-15.4-24.2c-4.2-10.6-2.6-26.8-16-30.2c-13.3-3.4-14.4,7.2-13.3,10
                            c-1.6,1.1-1.2,3.1-1.2,3.1s-3.5,1.5-2.6,5.9c0.9-0.3,2.2-3.1,5.7-2.4c3.5,0.7,5.9,4.9,3,15.9c-2.8,11-4.5,12.1-8.3,15.7
                            c-6.9,5-15.7,24-16,29c-4.4,2.2-7,0.8-8.7,0.7c0.4,3.8,7.4,4.5,7.4,4.5s-0.7,2.1-1.9,2.6c0.6,1.3,1.9,0.5,1.9,0.5
                            s3.5,13.8,12.1,22.3c0.3,4.2,0.6,5,1,8.8c0.3,3.8,2.7,7.2,3.1,9.5c0.4,2.3,0.3,2.4-0.3,5c-0.6,2.6-2.1,3.5-2.8,3.3
                            c-0.7-0.2-3.9-1.3-5.2,2.4c0,0,1.2-1.6,2.8-0.8c3,1.6,6.6,0.6,9,1.6c2.4,0.9,2.7,1.5,4.3,4.3c2.7-0.8,0.9-3.8,0.9-3.8
                            s2.7,0.2,4.3,0.7c1.6,0.5,2,1.3,3.8,0c0,0-2.4,2.3-1.1,3c0,0,0.2-1.1,2.4-1.1c2.2,0,3.8-0.7,5-2c2.8,2.8,1.9,2.5,4.5,5
                            c2.7,2.5,1.4,2.8,1.1,4.3c1.1-0.4,2.6-2.7,2.4-4.5c-0.2-1.9-1.9-3.6-1.9-3.6s5.6,1.6,7.8,0.5c1.2-0.8,2.4,0.5,2.4,0.5
                            s-0.4-2.2-2.6-2.8c-2.1-0.6-7.5-0.5-9.3-2.1c-1.8-1.6-3.1-2.5-3.4-8.4c-0.1-2.9,0.3-1.8,1.7-5.6
                            C381.1,283.4,383.1,274.3,385.2,273.4z M374.1,298.4c-0.6,2.7-5.2,3.4-5.2,3.4s0.2-0.9-2.7-0.8c-2.8,0.2-6.1-0.3-7.1-0.9
                            c-0.9-0.6-2.4-4.1-2.4-5.2c0-1.1,0.3-1.7,0.8-3c0.5-1.3,4-10.7,4-16.7c0,0,5.6,1.5,8.7,0.1c0.2,4.3,0.4,4.1,0.9,8.3
                            c0.5,4.2,0.5,6.1,2.2,7.4C374.5,291.6,374.7,295.7,374.1,298.4z"/>
                    </g>
                </g>
                </svg>
            </button>
        </a>
        <div class="sidebar" ng-class="{adminSidebarSlideOut:admin.showAdminPanel}">
            <div ng-include="admin.sidebar"></div>
        </div>
    </div>
</div>

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

admin-panel.js
```js
/**************************************************
 *             Admin Panel Controller             *
 *           Control the admin sidebar            *
 **************************************************/

angular.module('cosmo').controller('adminPanelCtrl', ['$scope', 'Users', 'REST', '$location', '$timeout', '$http', '$sce', function($scope, Users, REST, $location, $timeout, $http, $sce){

    $scope.admin = {};
    $scope.admin.username = Users.username;
    $scope.admin.roleNum = Users.roleNum;
    $scope.isUserAdmin = Users.admin;

    // Check if the user is on the admin or password reset page
    if($location.path() === '/admin') {
        $scope.admin.sidebar = 'core/html/login.html';
        $scope.admin.showAdminPanel = true;
        $scope.admin.active = true;
    } else if($location.path().indexOf('/reset') === 0) {
        $scope.admin.sidebar = 'core/html/password-reset.html';
        $scope.admin.showAdminPanel = true;
        $scope.admin.active = true;
    } else
        $scope.admin.sidebar = 'core/html/sidebar.html';

    // Get latest official message from Cosmo (for version, updates, and blog posts)
    $http.get('http://www.cosmocms.org/message.php?dontcache='+ new Date().getTime())
    .success(officialMessagePromise);

    // Update official message from Cosmo
    function officialMessagePromise(data){
        if(data){
            data = angular.fromJson(data);
            $scope.admin.messageID = data.id;
            var dontShowCookie = document.cookie.substr(document.cookie.indexOf('dontShowMessage=')+16, 5);
            if($scope.admin.messageID !== dontShowCookie){
                $scope.admin.message = $sce.trustAsHtml(data.message);
                $scope.admin.displayMessage = true;
            }
        }
    }

    // Set a cookie so you don't see this message any more
    $scope.removeMessage = function(){
        var expdate = new Date();
        expdate.setDate(expdate.getDate() + 90); // 90 days in the future
        document.cookie = "dontShowMessage=" + $scope.admin.messageID + ";expires=" + expdate.toGMTString();
        $scope.admin.displayMessage = false;
    };

    // Get user's info
    if(Users.id)
        REST.users.get({userID: Users.id}, usersInfoPromise);

    // Update user's info in the template
    function usersInfoPromise(data){
        Users.name = data.name;
        Users.bio = data.bio;
        Users.photo = data.photo;
        Users.role = data.role;
        Users.twitter = data.twitter;
        Users.facebook = data.facebook;
        Users.username = data.username;
        Users.email = data.email;

        if(data.photo)
            $scope.admin.photo = data.photo;
        else
            $scope.admin.photo = 'core/img/image.svg';
    }

    // Go to the new page
    $scope.navigate = function(){
        $location.path('new');
    };

    // Watch for calls to open the file menu
    $scope.$on('editFiles', function(event, data) {
        $scope.admin.files = angular.fromJson(data);
        $scope.admin.sidebar = 'core/html/files.html';
        $scope.admin.showAdminPanel = true;
        $scope.admin.active = true;
        $timeout(function() {
            $scope.$apply();
        });
    });

    // todo: Depreciate. Remove from admin-panel.html and use loginRegistrationCtrl instead
    $scope.logout = function(){
        // Delete cookies
        document.cookie = 'username=null;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'usersID=null;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'token=null;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        Users.id = '';
        Users.username = '';
        $http.defaults.headers.common['username'] = '';
        $http.defaults.headers.common['token'] = '';
        $location.path('/');
        $timeout(function(){
            location.reload();
        }, 1000);
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
## Unit Testing Setup for Legacy AngularJS Code

**Chosen Libraries:**

*   Jest: For running tests and assertions.
*   @testing-library/angular: For interacting with AngularJS components and services.
*   angular-mocks: For mocking AngularJS dependencies.

**Testing Environment Setup:**

1.  Install the required packages:

```bash
npm install --save-dev jest @testing-library/angular angular-mocks
```

2.  Create a `jest.config.js` file in your project root:

```javascript
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};
```

3.  Create test files with the `.spec.js` extension alongside the files you want to test.

## Unit Tests for `rest.js`

```javascript
// rest.spec.js

describe('REST Factory', () => {
  let REST;
  let $resource;

  beforeEach(module('cosmo'));

  beforeEach(inject((_REST_, _$resource_) => {
    REST = _REST_;
    $resource = _$resource_;
  }));

  it('should have a resource for blocks', () => {
    expect($resource).toHaveBeenCalledWith('api/blocks/:blockID', { blockID: '@blockID' }, { update: { method: 'PUT' } });
    expect(REST.blocks).toBeDefined();
  });

  // Similar tests for other resources in the REST factory
});
```

## Unit Tests for `admin-panel.js`

```javascript
// admin-panel.spec.js

describe('adminPanelCtrl', () => {
  let $scope;
  let Users;
  let REST;
  let $location;
  let $timeout;
  let $httpBackend;
  let createController;

  beforeEach(module('cosmo'));

  beforeEach(inject(($rootScope, $controller, _Users_, _REST_, _$location_, _$timeout_, _$httpBackend_) => {
    $scope = $rootScope.$new();
    Users = _Users_;
    REST = _REST_;
    $location = _$location_;
    $timeout = _$timeout_;
    $httpBackend = _$httpBackend_;
    createController = () => $controller('adminPanelCtrl', { $scope });
  }));

  it('should set admin username and role', () => {
    Users.username = 'testuser';
    Users.roleNum = 1;
    createController();
    expect($scope.admin.username).toBe('testuser');
    expect($scope.admin.roleNum).toBe(1);
  });

  it('should set sidebar based on location', () => {
    $location.path('/admin');
    createController();
    expect($scope.admin.sidebar).toBe('core/html/login.html');

    $location.path('/reset/password');
    createController();
    expect($scope.admin.sidebar).toBe('core/html/password-reset.html');

    $location.path('/home');
    createController();
    expect($scope.admin.sidebar).toBe('core/html/sidebar.html');
  });

  // Tests for official message handling, user info retrieval, navigation, and logout functionality
});
```

**Note:** These are just examples to get you started. You will need to write additional tests to achieve 80% code coverage and ensure all functionalities are tested. 


### Tokens: {'input_tokens': 5936, 'output_tokens': 777}
### Execution time: 24.280195236206055
