I have the following application code:

index.html
```html
<!DOCTYPE html>
<html lang="en" ng-app="calendarDemoApp" id="top">
<head>
    <title>AngularUI Calendar for AngularJS</title>
    <link rel="icon" href="favicon.ico" />
    <link rel="stylesheet" href="/../bower_components/bootstrap-css/css/bootstrap.css" />
    <link rel="stylesheet" href="/../bower_components/fullcalendar/dist/fullcalendar.css">
    <link rel="stylesheet" href="calendarDemo.css" />

    <script src="../bower_components/jquery/dist/jquery.js"></script>

    <script src="../bower_components/angular/angular.js"></script>
    <script src="http://angular-ui.github.io/bootstrap/ui-bootstrap-tpls-0.13.0.js"></script>
    <script src="../bower_components/moment/moment.js"></script>
    <script src="../bower_components/fullcalendar/dist/fullcalendar.js"></script>
    <script src="../bower_components/fullcalendar/dist/gcal.js"></script>
    <script src="../src/calendar.js"></script>
    <script src="calendarDemo.js"></script>
</head>
<body data-spy="scroll">
<header class="navbar navbar-fixed-top">
    <div class="navbar-inner">
        <div class="container">
            <div class="dropdown pull-left">
                <a class="brand dropdown-toggle" role="button" data-toggle="dropdown" href="#">
                    AngularUI
                    <b class="caret"></b>
                </a>
                <ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">
                    <li><a href="https://github.com/angular-ui/"><strong>Related Projects:</strong></a></li>
                    <li class="divider"></li>
                    <li><a href="http://angular-ui.github.com/bootstrap/">Bootstrap</a></li>
                    <li><a href="http://angular-ui.github.com/ng-grid/">Grid</a></li>
                    <li><a href="https://github.com/angular-ui/AngularJs.tmbundle">AngularJS.tmbundle</a></li>
                    <li><a href="http://angular-ui.github.io/ui-router/sample/">Router <span
                            class="label label-success">New!</span></a></li>
                    <li><a href="http://angular-ui.github.com/Tips-n-Tricks/">Tips-n-Tricks <span
                            class="label">WIP</span></a></li>
                </ul>
            </div>
        </div>
    </div>
</header>
<div class="hero-unit">
            <div class="container">
                <h1>UI Calendar</h1>
                <p>A complete AngularJS directive for the <a href="http://arshaw.com/fullcalendar/">Arshaw FullCalendar</a>.</p>
                <p class="btn-group">
                    <a href="https://github.com/angular-ui/ui-calendar" class='btn'><i class='icon-github'></i> Code on Github</a>
                    <a href="https://github.com/angular-ui/ui-calendar/archive/master.zip" class='btn btn-primary'><i class="icon-download-alt icon-white"></i> Download <small>(0.8.1)</small></a>
                </p>
            </div>
            <div class="bs-docs-social">
                <div class="container">
                    <ul class="bs-docs-social-buttons">
                        <li>
                            <iframe src="http://ghbtns.com/github-btn.html?user=angular-ui&amp;repo=ui-calendar&amp;type=watch&amp;count=true" allowtransparency="true" frameborder="0" scrolling="0" width="110" height="20"></iframe>
                        </li>
                        <li>
                            <iframe src="http://ghbtns.com/github-btn.html?user=angular-ui&amp;repo=ui-calendar&amp;type=fork&amp;count=true" allowtransparency="true" frameborder="0" scrolling="0" width="95" height="20"></iframe>
                        </li>
                        <li>
                            <div class="g-plusone" data-size="medium"></div>        
                            <!-- Place this tag after the last +1 button tag. -->
                            <script type="text/javascript">
                                (function () {
                                    var po = document.createElement('script');
                                    po.type = 'text/javascript';
                                    po.async = true;
                                    po.src = 'https://apis.google.com/js/plusone.js';
                                    var s = document.getElementsByTagName('script')[0];
                                    s.parentNode.insertBefore(po, s);
                                })();
                            </script>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
<div role="main">
    <div class="container">
        <section id="directives-calendar" ng-controller="CalendarCtrl">
            <div class="page-header">
                <h1>UI-Calendar</h1>
            </div>
            <div class="well">
                <div class="row-fluid">
                    <div class="span4">
                        <h3>What?</h3>

                        <p>Attach Angular objects to a calendar.</p>
                        <p>Show the data binding between two different calendars using the same event sources.</p>

                        <h3>Why?</h3>

                        <p>Why Not?</p>
                        
                        <div class="btn-group calTools">
                          <button class="btn" ng-click="changeLang()">
                            {{changeTo}}
                          </button>              
                          <button class="btn" ng-click="addRemoveEventSource(eventSources,eventSource)">
                            Toggle Source
                          </button>
                          <button type="button" class="btn btn-primary" ng-click="addEvent()">
                            Add Event
                          </button>
                        </div>

                        <ul class="unstyled">
                            <li ng-repeat="e in events">
                                <div class="alert alert-info">
                                    <a class="close" ng-click="remove($index)"><i class="icon-remove"></i></a>
                                    <b> <input ng-model="e.title"></b> 
                                    {{e.start | date:"MMM dd"}} - {{e.end | date:"MMM dd"}}
                                </div>
                            </li>
                        </ul>

                    </div>

                    <div class="span8">
                        <tabset>
                            <tab select="renderCalendar('myCalendar1');">
                              <tab-heading>
                               <i class="glyphicon glyphicon-bell"></i> Calendar One
                              </tab-heading>
                              <div class="alert-success calAlert" ng-show="alertMessage != undefined && alertMessage != ''">
                                <h4>{{alertMessage}}</h4>
                              </div>
                              <div class="btn-toolbar">
                                <p class="pull-right lead">Calendar One View Options</p>
                                <div class="btn-group">
                                    <button class="btn btn-success" ng-click="changeView('agendaDay', 'myCalendar1')">AgendaDay</button>
                                    <button class="btn btn-success" ng-click="changeView('agendaWeek', 'myCalendar1')">AgendaWeek</button>
                                    <button class="btn btn-success" ng-click="changeView('month', 'myCalendar1')">Month</button>
                                </div>
                              </div>
                            <div class="calendar" ng-model="eventSources" calendar="myCalendar1" ui-calendar="uiConfig.calendar"></div>
                           </tab>
                           <tab select="renderCalendar('myCalendar2');">
                            <tab-heading>
                              <i class="glyphicon glyphicon-bell"></i> Calendar Two
                            </tab-heading>
                              <div class="alert-success calAlert" ng-show="alertMessage != undefined && alertMessage != ''">
                                <h4>{{alertMessage}}</h4>
                              </div>
                              <div class="btn-toolbar">
                                <p class="pull-right lead">Calendar Two View Options</p>
                                <div class="btn-group">
                                    <button class="btn btn-success" ng-click="changeView('agendaDay', 'myCalendar2')">AgendaDay</button>
                                    <button class="btn btn-success" ng-click="changeView('agendaWeek', 'myCalendar2')">AgendaWeek</button>
                                    <button class="btn btn-success" ng-click="changeView('month', 'myCalendar2')">Month</button>
                                </div>
                              </div>
                            <div class="calendar" ng-model="eventSources" calendar="myCalendar2" ui-calendar="uiConfig.calendar"></div>
                           </tab>
                           <tab select="renderCalendar('myCalendar3');">
                            <tab-heading>
                              <i class="glyphicon glyphicon-bell"></i> Calendar Three
                            </tab-heading>
                              <div class="alert-success calAlert">
                                <h4>This calendar uses the extended form</h4>
                              </div>
                              <div class="btn-toolbar">
                                <p class="pull-right lead">Calendar Three View Options</p>
                                <div class="btn-group">
                                    <button class="btn btn-success" ng-click="changeView('agendaDay', 'myCalendar3')">AgendaDay</button>
                                    <button class="btn btn-success" ng-click="changeView('agendaWeek', 'myCalendar3')">AgendaWeek</button>
                                    <button class="btn btn-success" ng-click="changeView('month', 'myCalendar3')">Month</button>
                                </div>
                              </div>
                            <div class="calendar" ng-model="eventSources2" calendar="myCalendar3" ui-calendar="uiConfig.calendar"></div>
                           </tab>
                        </tabset>
                    </div>
                </div>
            </div>
        </section>
    </div>
</div>
        <script type="text/javascript">
            var _gaq = _gaq || [];
            _gaq.push(['_setAccount', 'UA-17352735-3']);
            _gaq.push(['_trackPageview']);
            (function () {
                var ga = document.createElement('script');
                ga.type = 'text/javascript';
                ga.async = true;
                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(ga, s);
            })();
        </script>
    </body>
</html>

```

calendarDemo.js
```js
/**
 * calendarDemoApp - 0.9.0
 */
var calendarDemoApp = angular.module('calendarDemoApp', ['ui.calendar', 'ui.bootstrap']);

calendarDemoApp.controller('CalendarCtrl',
   function($scope, $compile, $timeout, uiCalendarConfig) {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $scope.changeTo = 'Hungarian';
    /* event source that pulls from google.com */
    $scope.eventSource = {
            url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            className: 'gcal-event',           // an option!
            currentTimezone: 'America/Chicago' // an option!
    };
    /* event source that contains custom events on the scope */
    $scope.events = [
      {title: 'All Day Event',start: new Date(y, m, 1)},
      {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
      {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
      {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    ];
    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
      var s = new Date(start).getTime() / 1000;
      var e = new Date(end).getTime() / 1000;
      var m = new Date(start).getMonth();
      var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
      callback(events);
    };

    $scope.calEventsExt = {
       color: '#f00',
       textColor: 'yellow',
       events: [
          {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
          {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
          {type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
        ]
    };
    /* alert on eventClick */
    $scope.alertOnEventClick = function( date, jsEvent, view){
        $scope.alertMessage = (date.title + ' was clicked ');
    };
    /* alert on Drop */
     $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Dropped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
       $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };
    /* add custom event*/
    $scope.addEvent = function() {
      $scope.events.push({
        title: 'Open Sesame',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        className: ['openSesame']
      });
    };
    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view,calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalendar = function(calendar) {
      $timeout(function() {
        if(uiCalendarConfig.calendars[calendar]){
          uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
      });
    };
     /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) {
        element.attr({'tooltip': event.title,
                      'tooltip-append-to-body': true});
        $compile(element)($scope);
    };
    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };

    $scope.changeLang = function() {
      if($scope.changeTo === 'Hungarian'){
        $scope.uiConfig.calendar.dayNames = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
        $scope.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
        $scope.changeTo= 'English';
      } else {
        $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        $scope.changeTo = 'Hungarian';
      }
    };
    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
    $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
});
/* EOF */

```

calendar.js
```js
/*
*  AngularJs Fullcalendar Wrapper for the JQuery FullCalendar
*  API @ http://arshaw.com/fullcalendar/
*
*  Angular Calendar Directive that takes in the [eventSources] nested array object as the ng-model and watches it deeply changes.
*       Can also take in multiple event urls as a source object(s) and feed the events per view.
*       The calendar will watch any eventSource array and update itself when a change is made.
*
*/

angular.module('ui.calendar', [])

    .constant('uiCalendarConfig', {
        calendars : {}
    })
    .controller('uiCalendarCtrl', ['$scope', '$locale',
        function ($scope, $locale) {

            var sources = $scope.eventSources;
            var extraEventSignature = $scope.calendarWatchEvent ? $scope.calendarWatchEvent : angular.noop;

            var wrapFunctionWithScopeApply = function (functionToWrap) {
                return function () {
                    // This may happen outside of angular context, so create one if outside.
                    if ($scope.$root.$$phase) {
                        return functionToWrap.apply(this, arguments);
                    }

                    var args = arguments;
                    var that = this;
                    return $scope.$root.$apply(
                        function () {
                            return functionToWrap.apply(that, args);
                        }
                    );
                };
            };

            var eventSerialId = 1;
            // @return {String} fingerprint of the event object and its properties
            this.eventFingerprint = function (e) {
                if (!e._id) {
                    e._id = eventSerialId++;
                }

                var extraSignature = extraEventSignature({
                    event : e
                }) || '';
                var start = moment.isMoment(e.start) ? e.start.unix() : (e.start ? moment(e.start).unix() : '');
                var end = moment.isMoment(e.end) ? e.end.unix() : (e.end ? moment(e.end).unix() : '');

                // This extracts all the information we need from the event. http://jsperf.com/angular-calendar-events-fingerprint/3
                return [e._id, e.id || '', e.title || '', e.url || '', start, end, e.allDay || '', e.className || '', extraSignature].join('');
            };

            var sourceSerialId = 1;
            var sourceEventsSerialId = 1;
            // @return {String} fingerprint of the source object and its events array
            this.sourceFingerprint = function (source) {
                var fp = '' + (source.__id || (source.__id = sourceSerialId++));
                var events = angular.isObject(source) && source.events;

                if (events) {
                    fp = fp + '-' + (events.__id || (events.__id = sourceEventsSerialId++));
                }
                return fp;
            };

            // @return {Array} all events from all sources
            this.allEvents = function () {
                return Array.prototype.concat.apply(
                    [],
                    (sources || []).reduce(
                        function (previous, source) {
                            if (angular.isArray(source)) {
                                previous.push(source);
                            } else if (angular.isObject(source) && angular.isArray(source.events)) {
                                var extEvent = Object.keys(source).filter(
                                    function (key) {
                                        return (key !== '_id' && key !== 'events');
                                    }
                                );

                                source.events.forEach(
                                    function (event) {
                                        angular.extend(event, extEvent);
                                    }
                                );

                                previous.push(source.events);
                            }
                            return previous;
                        },
                        []
                    )
                );
            };

            // Track changes in array of objects by assigning id tokens to each element and watching the scope for changes in the tokens
            // @param {Array|Function} arraySource array of objects to watch
            // @param tokenFn {Function} that returns the token for a given object
            // @return {Object}
            //  subscribe: function(scope, function(newTokens, oldTokens))
            //    called when source has changed. return false to prevent individual callbacks from firing
            //  onAdded/Removed/Changed:
            //    when set to a callback, called each item where a respective change is detected
            this.changeWatcher = function (arraySource, tokenFn) {
                var self;

                var getTokens = function () {
                    return ((angular.isFunction(arraySource) ? arraySource() : arraySource) || []).reduce(
                        function (rslt, el) {
                            var token = tokenFn(el);
                            map[token] = el;
                            rslt.push(token);
                            return rslt;
                        },
                        []
                    );
                };

                // @param {Array} a
                // @param {Array} b
                // @return {Array} elements in that are in a but not in b
                // @example
                //  subtractAsSets([6, 100, 4, 5], [4, 5, 7]) // [6, 100]
                var subtractAsSets = function (a, b) {
                    var obj = (b || []).reduce(
                        function (rslt, val) {
                            rslt[val] = true;
                            return rslt;
                        },
                        Object.create(null)
                    );
                    return (a || []).filter(
                        function (val) {
                            return !obj[val];
                        }
                    );
                };

                // Map objects to tokens and vice-versa
                var map = {};

                // Compare newTokens to oldTokens and call onAdded, onRemoved, and onChanged handlers for each affected event respectively.
                var applyChanges = function (newTokens, oldTokens) {
                    var i;
                    var token;
                    var replacedTokens = {};
                    var removedTokens = subtractAsSets(oldTokens, newTokens);
                    for (i = 0; i < removedTokens.length; i++) {
                        var removedToken = removedTokens[i];
                        var el = map[removedToken];
                        delete map[removedToken];
                        var newToken = tokenFn(el);
                        // if the element wasn't removed but simply got a new token, its old token will be different from the current one
                        if (newToken === removedToken) {
                            self.onRemoved(el);
                        } else {
                            replacedTokens[newToken] = removedToken;
                            self.onChanged(el);
                        }
                    }

                    var addedTokens = subtractAsSets(newTokens, oldTokens);
                    for (i = 0; i < addedTokens.length; i++) {
                        token = addedTokens[i];
                        if (!replacedTokens[token]) {
                            self.onAdded(map[token]);
                        }
                    }
                };

                self = {
                    subscribe : function (scope, onArrayChanged) {
                        scope.$watch(getTokens, function (newTokens, oldTokens) {
                            var notify = !(onArrayChanged && onArrayChanged(newTokens, oldTokens) === false);
                            if (notify) {
                                applyChanges(newTokens, oldTokens);
                            }
                        }, true);
                    },
                    onAdded : angular.noop,
                    onChanged : angular.noop,
                    onRemoved : angular.noop
                };
                return self;
            };

            this.getFullCalendarConfig = function (calendarSettings, uiCalendarConfig) {
                var config = {};

                angular.extend(config, uiCalendarConfig);
                angular.extend(config, calendarSettings);

                angular.forEach(config, function (value, key) {
                    if (typeof value === 'function') {
                        config[key] = wrapFunctionWithScopeApply(config[key]);
                    }
                });

                return config;
            };

            this.getLocaleConfig = function (fullCalendarConfig) {
                if (!fullCalendarConfig.lang && !fullCalendarConfig.locale || fullCalendarConfig.useNgLocale) {
                    // Configure to use locale names by default
                    var tValues = function (data) {
                        // convert {0: "Jan", 1: "Feb", ...} to ["Jan", "Feb", ...]
                        return (Object.keys(data) || []).reduce(
                            function (rslt, el) {
                                rslt.push(data[el]);
                                return rslt;
                            },
                            []
                        );
                    };

                    var dtf = $locale.DATETIME_FORMATS;
                    return {
                        monthNames : tValues(dtf.MONTH),
                        monthNamesShort : tValues(dtf.SHORTMONTH),
                        dayNames : tValues(dtf.DAY),
                        dayNamesShort : tValues(dtf.SHORTDAY)
                    };
                }

                return {};
            };
        }
    ])
    .directive('uiCalendar', ['uiCalendarConfig',
        function (uiCalendarConfig) {

            return {
                restrict : 'A',
                scope : {
                    eventSources : '=ngModel',
                    calendarWatchEvent : '&'
                },
                controller : 'uiCalendarCtrl',
                link : function (scope, elm, attrs, controller) {
                    var sources = scope.eventSources;
                    var sourcesChanged = false;
                    var calendar;
                    var eventSourcesWatcher = controller.changeWatcher(sources, controller.sourceFingerprint);
                    var eventsWatcher = controller.changeWatcher(controller.allEvents, controller.eventFingerprint);
                    var options = null;

                    function getOptions () {
                        var calendarSettings = attrs.uiCalendar ? scope.$parent.$eval(attrs.uiCalendar) : {};
                        var fullCalendarConfig = controller.getFullCalendarConfig(calendarSettings, uiCalendarConfig);
                        var localeFullCalendarConfig = controller.getLocaleConfig(fullCalendarConfig);
                        angular.extend(localeFullCalendarConfig, fullCalendarConfig);
                        options = {
                            eventSources : sources
                        };
                        angular.extend(options, localeFullCalendarConfig);
                        //remove calendars from options
                        options.calendars = null;

                        var options2 = {};
                        for (var o in options) {
                            if (o !== 'eventSources') {
                                options2[o] = options[o];
                            }
                        }
                        return JSON.stringify(options2);
                    }

                    scope.destroyCalendar = function () {
                        if (calendar && calendar.fullCalendar) {
                            calendar.fullCalendar('destroy');
                        }
                        if (attrs.calendar) {
                            calendar = uiCalendarConfig.calendars[attrs.calendar] = angular.element(elm).html('');
                        } else {
                            calendar = angular.element(elm).html('');
                        }
                    };

                    scope.initCalendar = function () {
                        if (!calendar) {
                            calendar = $(elm).html('');
                        }
                        calendar.fullCalendar(options);
                        if (attrs.calendar) {
                            uiCalendarConfig.calendars[attrs.calendar] = calendar;
                        }
                    };

                    scope.$on('$destroy', function () {
                        scope.destroyCalendar();
                    });

                    eventSourcesWatcher.onAdded = function (source) {
                        if (calendar && calendar.fullCalendar) {
                            calendar.fullCalendar(options);
                            if (attrs.calendar) {
                                uiCalendarConfig.calendars[attrs.calendar] = calendar;
                            }
                            calendar.fullCalendar('addEventSource', source);
                            sourcesChanged = true;
                        }
                    };

                    eventSourcesWatcher.onRemoved = function (source) {
                        if (calendar && calendar.fullCalendar) {
                            calendar.fullCalendar('removeEventSource', source);
                            sourcesChanged = true;
                        }
                    };

                    eventSourcesWatcher.onChanged = function () {
                        if (calendar && calendar.fullCalendar) {
                            calendar.fullCalendar('refetchEvents');
                            sourcesChanged = true;
                        }
                    };

                    eventsWatcher.onAdded = function (event) {
                        if (calendar && calendar.fullCalendar) {
                            calendar.fullCalendar('renderEvent', event, !!event.stick);
                        }
                    };

                    eventsWatcher.onRemoved = function (event) {
                        if (calendar && calendar.fullCalendar) {
                            calendar.fullCalendar('removeEvents', event._id);
                        }
                    };

                    eventsWatcher.onChanged = function (event) {
                        if (calendar && calendar.fullCalendar) {
                            var clientEvents = calendar.fullCalendar('clientEvents', event._id);
                            for (var i = 0; i < clientEvents.length; i++) {
                                var clientEvent = clientEvents[i];
                                clientEvent = angular.extend(clientEvent, event);
                                calendar.fullCalendar('updateEvent', clientEvent);
                            }
                        }
                    };

                    eventSourcesWatcher.subscribe(scope);
                    eventsWatcher.subscribe(scope, function () {
                        if (sourcesChanged === true) {
                            sourcesChanged = false;
                            // return false to prevent onAdded/Removed/Changed handlers from firing in this case
                            return false;
                        }
                    });

                    scope.$watch(getOptions, function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            scope.destroyCalendar();
                            scope.initCalendar();
                        } else if ((newValue && angular.isUndefined(calendar))) {
                            scope.initCalendar();
                        }
                    });
                }
            };
        }
    ]
);

```


Analyze the provided code and outline the business requirements it addresses by following these instructions:
- Functionality: Summarize the main functionality and features of the code.
- User Interaction: Describe expected user interactions with these features.
- Business Objectives: Infer the business objectives met by this code.
- Constraints & Assumptions: Note any constraints or assumptions evident in the code.
- Performance & Scalability: Mention any performance optimizations or scalability considerations.
## Run 1:
### Answer:
**Functionality:**

The provided code is an AngularJS directive that integrates the jQuery FullCalendar library into AngularJS applications. It allows developers to bind AngularJS objects to a calendar and display events from multiple sources.

**User Interaction:**

Users can interact with the calendar by:

- Adding, removing, and modifying events
- Changing the calendar view (e.g., agenda day, agenda week, month)
- Clicking on events to view details or trigger actions

**Business Objectives:**

The code meets the following business objectives:

- **Event Management:** Provides a user-friendly interface for managing events and appointments.
- **Data Visualization:** Allows users to visualize events in a calendar format, making it easy to track schedules and identify conflicts.
- **Collaboration:** Enables multiple users to share and collaborate on calendars, improving coordination and communication.

**Constraints & Assumptions:**

- The code assumes that the jQuery FullCalendar library is available and loaded.
- It also assumes that the eventSources property in the scope is an array of event sources.

**Performance & Scalability:**

The code does not include any specific performance optimizations or scalability considerations. However, the use of AngularJS's data binding and change detection mechanisms helps ensure efficient updates to the calendar when data changes.
### Tokens: {'prompt_tokens': 7587, 'completion_tokens': 262, 'total_tokens': 7849}
### Execution time: 5.524472713470459
