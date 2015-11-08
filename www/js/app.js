// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var clipboardApp = angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'firebase'])
var fb = new Firebase("https://dazzling-torch-7612.firebaseio.com/");

clipboardApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

clipboardApp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })
    
    .state('app.home', {
    	cache: false,
        url: "/home",
        views: {
            'menuContent': {
                templateUrl: "templates/home.html",
                controller: 'HomeCtrl'
            }
        }
    })
    
    .state('app.properties', {
    	cache: false,
        url: "/properties",
        views: {
            'menuContent': {
                templateUrl: "templates/properties.html",
                controller: 'PropertiesCtrl'
            }
        }
    })
    
    .state('app.add-property', {
    	cache: false,
        url: "/addproperty/:a_id",
        views: {
            'menuContent': {
                templateUrl: "templates/add-property.html",
                controller: 'AddPropertyCtrl'
            }
        }
    })
    
    .state('app.city', {
        url: "/city/:var_city",
        views: {
            'menuContent': {
                templateUrl: "templates/city.html",
                controller: 'CityCtrl'
            }
        }
    })
    
    .state('app.address', {
    	cache: false,
        url: "/address/:a_id/:prop_id",
        views: {
            'menuContent': {
                templateUrl: "templates/address.html",
                controller: 'AddressCtrl'
            }
        }
    })
    
    .state('app.home-profile', {
    	cache: false,
        url: "/homeprofile/:a_id/:prop_id",
        views: {
            'menuContent': {
                templateUrl: "templates/home-profile.html",
                controller: 'HomeProfileCtrl'
            }
        }
    })
    
    .state('app.homeprofilechangeable', {
    	cache: false,
        url: "/homeprofilechangeable/:a_id/:prop_id/:inspect_id/:location_id/:count",
        views: {
            'menuContent': {
                templateUrl: "templates/home-profile-changeable.html",
                controller: 'HomeProfileChangeableCtrl'
            }
        }
    })
    
    .state('app.homeprofilechangeablemedium', {
        url: "/homeprofilechangeablemedia/:a_id/:prop_id/:inspect_id/:location_id/:count/:rownum",
        views: {
            'menuContent': {
                templateUrl: "templates/home-profile-changeable-medium.html",
                controller: 'HomeProfileChangeableMediumCtrl'
            }
        }
    })
    
    .state('app.homeprofileservice', {
        url: "/homeprofileservice/:a_id/:prop_id/:inspect_id/:location_id/:count",
        views: {
            'menuContent': {
                templateUrl: "templates/home-profile-service.html",
                controller: 'HomeProfileServiceCtrl'
            }
        }
    })
    
    .state('app.homeprofilecomponent', {
    	cache: false,
        url: "/homeprofilecomponent/:a_id/:prop_id/:component_id/:location_id/:count",
        views: {
            'menuContent': {
                templateUrl: "templates/home-profile-component.html",
                controller: 'HomeProfileComponentCtrl'
            }
        }
    })
    
    .state('app.homeprofilecomponentmedium', {
        url: "/homeprofilecomponentmedia/:a_id/:prop_id/:component_id/:location_id/:count/:rownum",
        views: {
            'menuContent': {
                templateUrl: "templates/home-profile-component-medium.html",
                controller: 'HomeProfileComponentMediumCtrl'
            }
        }
    })
    
    .state('app.home-check', {
    	cache: false,
        url: "/homecheck/:hc_id",
        views: {
            'menuContent': {
                templateUrl: "templates/home-check.html",
                controller: 'HomeCheckCtrl'
            }
        }
    })
    
    .state('app.home-check-location', {
    	cache: false,
        url: "/homechecklocation/:hc_id/:location_id",
        views: {
            'menuContent': {
                templateUrl: "templates/home-check-location.html",
                controller: 'HomeCheckLocationCtrl'
            }
        }
    })
    
    .state('app.home-check-notes', {
    	cache: false,
        url: "/homechecklocationnotes/:hc_id/:location_id",
        views: {
            'menuContent': {
                templateUrl: "templates/home-check-location-notes.html",
                controller: 'HomeCheckLocationNotesCtrl'
            }
        }
    })
    
    .state('app.home-check-location-medium', {
        url: "/homechecklocationmedium/:hc_id/:location_id/:rownum",
        views: {
            'menuContent': {
                templateUrl: "templates/home-check-location-medium.html",
                controller: 'HomeCheckLocationMediumCtrl'
            }
        }
    })
    
    .state('app.home-check-inspection', {
    	cache: false,
        url: "/homecheckinspection/:hc_id/:location_id/:inspect_id/:count",
        views: {
            'menuContent': {
                templateUrl: "templates/home-check-inspection.html",
                controller: 'HomeCheckInspectionCtrl'
            }
        }
    })
    
    .state('app.home-check-medium', {
        url: "/homecheckmedium/:hc_id/:inspect_id/:location_id/:count/:rownum",
        views: {
            'menuContent': {
                templateUrl: "templates/home-check-medium.html",
                controller: 'HomeCheckMediumCtrl'
            }
        }
    })
    
    .state('app.home-check-medium2', {
        url: "/homecheckmedium2/:hc_id/:inspect_id/:location_id/:count/:imageid",
        views: {
            'menuContent': {
                templateUrl: "templates/home-check-medium2.html",
                controller: 'HomeCheckMedium2Ctrl'
            }
        }
    })
    
    .state('app.project', {
    	cache: false,
        url: "/project/:t_id",
        views: {
            'menuContent': {
                templateUrl: "templates/project.html",
                controller: 'ProjectCtrl'
            }
        }
    })
    
    .state('app.project-medium', {
    	cache: false,
        url: "/projectmedium/:t_id/:image_id",
        views: {
            'menuContent': {
                templateUrl: "templates/project-medium.html",
                controller: 'ProjectMediumCtrl'
            }
        }
    })
    
    .state('app.project-service', {
    	cache: false,
        url: "/projectservice/:t_id/:rownum",
        views: {
            'menuContent': {
                templateUrl: "templates/project-service.html",
                controller: 'ProjectServiceCtrl'
            }
        }
    })
    
    .state('app.concierge-service', {
    	cache: false,
        url: "/conciergeservice/:record_id",
        views: {
            'menuContent': {
                templateUrl: "templates/concierge-service.html",
                controller: 'ConciergeServiceCtrl'
            }
        }
    })
    
    .state('app.contacts', {
    	cache: false,
        url: "/contacts",
        views: {
            'menuContent': {
                templateUrl: "templates/contacts.html",
                controller: 'ContactsCtrl'
            }
        }
    })
    
    .state('app.contact-pro', {
    	cache: false,
        url: "/contactpro/:pro_id",
        views: {
            'menuContent': {
                templateUrl: "templates/contact-pro.html",
                controller: 'ContactProCtrl'
            }
        }
    })
    
    .state('app.add-pro', {
    	cache: false,
        url: "/addpro",
        views: {
            'menuContent': {
                templateUrl: "templates/add-pro.html",
                controller: 'AddProCtrl'
            }
        }
    })
    
    .state('app.contact-homeowner', {
    	cache: false,
        url: "/contacthomeowner/:a_id/:user_id",
        views: {
            'menuContent': {
                templateUrl: "templates/contact-homeowner.html",
                controller: 'ContactHomeownerCtrl'
            }
        }
    })
    
    .state('app.dashboard-email', {
    	cache: false,
        url: "/dashboardemail/:message_id",
        views: {
            'menuContent': {
                templateUrl: "templates/dashboard-email.html",
                controller: 'DashboardEmailCtrl'
            }
        }
    })
    
    .state('app.inbox-texts', {
    	cache: false,
        url: "/inboxtexts",
        views: {
            'menuContent': {
                templateUrl: "templates/inbox-texts.html",
                controller: 'InboxTextsCtrl'
            }
        }
    })
    
    .state('app.text-pro', {
    	cache: false,
        url: "/textpro/:tph",
        views: {
            'menuContent': {
                templateUrl: "templates/inbox-text-pro.html",
                controller: 'TextProCtrl'
            }
        }
    })
    
    .state('app.text-homeowner', {
    	cache: false,
        url: "/texthomeowner/:tph",
        views: {
            'menuContent': {
                templateUrl: "templates/inbox-text-homeowner.html",
                controller: 'TextHomeownerCtrl'
            }
        }
    })
    
    .state('app.report-hours', {
    	cache: false,
        url: "/reporthours",
        views: {
            'menuContent': {
                templateUrl: "templates/report-hours.html",
                controller: 'ReportHoursCtrl'
            }
        }
    })
    
    .state('app.report-hours2', {
    	cache: false,
        url: "/reporthours2/:report_id",
        views: {
            'menuContent': {
                templateUrl: "templates/report-hours2.html",
                controller: 'ReportHours2Ctrl'
            }
        }
    })
    
    .state('app.open-hours', {
    	cache: false,
        url: "/openhours",
        views: {
            'menuContent': {
                templateUrl: "templates/open-hours.html",
                controller: 'OpenHoursCtrl'
            }
        }
    })
    
    .state('app.add-customer', {
    	cache: false,
        url: "/addcustomer",
        views: {
            'menuContent': {
                templateUrl: "templates/add-customer.html",
                controller: 'AddCustomerCtrl'
            }
        }
    })
    
     .state('app.quote-builder', {
    	cache: false,
        url: "/quotebuilder/:message_id",
        views: {
            'menuContent': {
                templateUrl: "templates/quote-builder.html",
                controller: 'QuoteBuilderCtrl'
            }
        }
    })
    
     .state('app.preview-message', {
    	cache: false,
        url: "/previewmessage/:message_id",
        views: {
            'menuContent': {
                templateUrl: "templates/inbox-text-homeowner-quote.html",
                controller: 'PreviewMessageCtrl'
            }
        }
    })
    
     .state('app.membership-pricing', {
    	cache: false,
        url: "/membershippricing",
        views: {
            'menuContent': {
                templateUrl: "templates/membership-pricing.html",
                controller: 'MembershipPricingCtrl'
            }
        }
    })
    
    .state('app.invoicing-approved', {
    	cache: false,
        url: "/invoicingapproved",
        views: {
            'menuContent': {
                templateUrl: "templates/invoicing-approved.html",
                controller: 'InvoicingApprovedCtrl'
            }
        }
    })
    
     .state('app.proposal', {
    	cache: false,
        url: "/proposal/:message_id",
        views: {
            'menuContent': {
                templateUrl: "templates/proposal.html",
                controller: 'ProposalCtrl'
            }
        }
    })
    
    .state('app.invoice', {
    	cache: false,
        url: "/invoice/:invoice_id/:installment_id",
        views: {
            'menuContent': {
                templateUrl: "templates/invoice.html",
                controller: 'InvoiceCtrl'
            }
        }
    })
    
    .state('app.calendar', {
    	cache: false,
        url: "/calendar",
        views: {
            'menuContent': {
                templateUrl: "templates/calendar.html",
                controller: 'CalendarCtrl'
            }
        }
    })
    
    .state('app.todo', {
    	cache: false,
        url: "/todo/:todo_id",
        views: {
            'menuContent': {
                templateUrl: "templates/todo.html",
                controller: 'TodoCtrl'
            }
        }
    })
    
    .state('app.todos', {
    	cache: false,
        url: "/todos",
        views: {
            'menuContent': {
                templateUrl: "templates/todos.html",
                controller: 'TodosCtrl'
            }
        }
    })
    ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/properties');
});
