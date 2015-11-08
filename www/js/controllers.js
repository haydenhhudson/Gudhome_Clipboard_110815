angular.module('starter.controllers', [])

clipboardApp.controller('HomeCtrl', function($scope, $http) {
	$scope.projects = [];
	
	
	$scope.$watch(
      function() {
        return window.localStorage.pro_id;
      },
      function(newValue, oldValue) {
      	if (window.localStorage.pro_id) {
	        updateDisplay();
	      }
      });
      
      var updateDisplay = function() {
        $http.get('http://www.gudhome.com/mobile/sql/sql-R-projects-homepage.php?r='+window.localStorage['pro_id']).success(function(data){
					$scope.projects = data;
				});
      };
})

clipboardApp.controller('PropertiesCtrl', function($scope, $http) {
	$scope.cities = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-cities.php').success(function(data){
		$scope.cities = data;
	}).error(function(data){
		alert(data);
	});
	
	$scope.addresses = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-addresses.php').success(function(data){
		$scope.addresses = data;
	}).error(function(data){
		alert(data);
	});
})

clipboardApp.controller('AddPropertyCtrl', function($scope, $http, $stateParams, $ionicLoading, $location, $ionicPopup) {
	//alert('a id ' +$stateParams.a_id);
	$scope.homeowners = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-homeowners-address.php?a_id='+$stateParams.a_id).success(function(data){
		$scope.homeowners = data;
	});
	
	$scope.stati = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-customer-stati.php').success(function(data){
		$scope.stati = data;
	});
	
	$scope.new_property = {};
	$scope.addProperty = function(theirinfo, resultVarName){
		var confirmPopup = $ionicPopup.confirm({
	     title: 'Add property',
	     template: 'Are you sure you want to add this property?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	     	var config={params: {theirinfo:theirinfo}};
	      $http.post('http://www.gudhome.com/mobile/sql/sql-C-property.php?&r='+window.localStorage['pro_id']+'&a_id='+$stateParams.a_id, null, config).success(function(data, status, headers, config){
					$scope.new_property = data;
					//alert('a id '+$stateParams.a_id);
					//alert('prop id '+$scope.new_property.receivedPROP_ID);
					$location.path('/app/address/'+$stateParams.a_id+'/'+$scope.new_property.receivedPROP_ID);
					$ionicLoading.hide();
			    $ionicLoading.show({
			        template: '<i class="icon ion-plus"></i> Property added',
			        duration : 1500
			    });
				});
	     } else {
	       //alert('cancelled');
	     }
	   });
	};
})

clipboardApp.controller('CityCtrl', function($scope, $http, $stateParams) {
	$scope.addresses = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-addresses.php?city='+$stateParams.var_city).success(function(data){
		$scope.addresses = data;
	})
})

clipboardApp.controller('AddressCtrl', function($scope, $http, $stateParams, $filter, $ionicLoading, $location, $ionicPopup) {
	$scope.address = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-address.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id).success(function(data){
		$scope.address = data;
	});
	
	$scope.projects = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-projects.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id).success(function(data){
		$scope.projects = data;
	});
	
	$scope.hcid = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-check-next-visit.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id).success(function(data){
		$scope.hcid = data;
	});
	
	$scope.hcids = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-check-history.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id).success(function(data){
		$scope.hcids = data;
	});
	
	$scope.openUrl = function(hcid) {
			//alert('redirecting');
    	window.open('http://gudhome.com/mygudhome/visit-report.php?hcid='+hcid, '_system', 'location=yes');
    };
    $scope.brandNewHC = function(newvisit, resultVarName){
    	var appDate = $filter('date')(newvisit.date, "yyyy-MM-dd");
    	var appTime = $filter('date')(newvisit.visit_time, "HH:mm:ss");
		var config={params: {newvisit:newvisit}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-C-home-check.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&date='+appDate+'&time='+appTime+'&visit_number='+newvisit.visit_number+'&r='+window.localStorage['pro_id'], null, config).success(function(data, status, headers, config){
			$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-check-next-visit.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id).success(function(data){
				$scope.hcid = data;
			});
			
	      	$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-checkmark-circled"></i> Created new home check',
	            duration : 1500
	        });
	      	//alert ('success : '+$scope.new_specs.receivedSPECS);
	      
			
		})
		.error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
          //alert('error');
        });
		};
		
		$scope.new_project = {};
		$scope.brandNewProject = function(project, resultVarName){
			var confirmPopup = $ionicPopup.confirm({
	     title: 'Add project',
	     template: 'Are you sure you want to add this project?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	      var config={params: {project:project}};
				$http.post('http://www.gudhome.com/mobile/sql/sql-C-project.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&r='+window.localStorage['pro_id'], null, config).success(function(data, status, headers, config){
					$scope.new_project = data;
					//alert('tid '+$scope.new_project.receivedT_ID);
					$location.path('/app/project/'+$scope.new_project.receivedT_ID);
				});
	     } else {
	       //alert('cancelled');
	     }
	   });
	};
	
	$scope.services = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-concierge-services.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id).success(function(data){
		$scope.services = data;
	});
	
	$scope.concierge_type = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-concierge-service-types.php').success(function(data){
		$scope.concierge_type = data;
	});
	
	$scope.addConcierge = function(service, resultVarName){
		//alert('type '+service.servicetype);
		//alert('desc '+service.servicename);
		var config={params: {service:service}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-C-concierge-service.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&type='+service.servicetype+'&r='+window.localStorage['pro_id'], null, config).success(function(data, status, headers, config){
			//alert('record '+data.receivedRECORD);
			$location.path('/app/conciergeservice/'+data.receivedRECORD);
		})
		.error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
	
	$scope.addSlack = function(channel, resultVarName){
		$ionicLoading.hide();
    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner> Working...'
    });
		var config={params: {channel:channel}};
		//alert('channel '+channel.channel);
		$http.post('http://www.gudhome.com/mobile/sql/sql-U-slack-channel-address.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id, null, config).success(function(data, status, headers, config){
	      	$scope.new_channel = data;
	      	$http.get('http://www.gudhome.com/mobile/sql/sql-R-address.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id).success(function(data){
						$scope.address = data;
					});
	      	$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-checkmark-circled"></i> Updated',
	            duration : 1500
	        });
	      	 //alert('success '+ $scope.new_note.receivedNOTE);
        })
        .error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
          //alert('error');
        });
		
	};
	
	$scope.addAccess = function(info, resultVarName){
		$ionicLoading.hide();
    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner> Working...'
    });
		var config={params: {info:info}};
		//alert('channel '+channel.channel);
		$http.post('http://www.gudhome.com/mobile/sql/sql-U-address-access-info.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id, null, config).success(function(data, status, headers, config){
	      	$scope.new_channel = data;
	      	$http.get('http://www.gudhome.com/mobile/sql/sql-R-address.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id).success(function(data){
						$scope.address = data;
					});
	      	$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-checkmark-circled"></i> Updated',
	            duration : 1500
	        });
	      	 //alert('success '+ $scope.new_note.receivedNOTE);
        })
        .error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
          //alert('error');
        });
		
	};
})

clipboardApp.controller('HomeProfileCtrl', function($scope, $http, $stateParams, $location, $ionicLoading) {
	$scope.address = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-address.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id).success(function(data){
		$scope.address = data;
	});
	
	$scope.changeables = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-profile-changeables.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id).success(function(data){
			$scope.changeables = data;
	});
	
	$scope.changeablelist = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-profile-changeable-list.php').success(function(data){
		$scope.changeablelist = data;
	});
	
	$scope.addChangeable = function(inspect_id) {
		$http.post('http://www.gudhome.com/mobile/sql/sql-C-home-profile-changeable.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&location_id=-1&inspect_id='+inspect_id).success(function(data){
	      	$location.path('/app/homeprofilechangeable/'+$stateParams.a_id+'/'+$stateParams.prop_id+'/'+inspect_id+'/-1/1');
      });
	};
	
	$scope.components = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-profile-components.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id).success(function(data){
		$scope.components = data;
	});
	
	$scope.componentlist = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-profile-component-list.php').success(function(data){
		$scope.componentlist = data;
	});
	
	$scope.addComponent = function(component_id) {
		$http.post('http://www.gudhome.com/mobile/sql/sql-C-home-profile-component.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&location_id=-1&component_id='+component_id+'&r='+window.localStorage['pro_id']).success(function(data){
	      	$location.path('/app/homeprofilecomponent/'+$stateParams.a_id+'/'+$stateParams.prop_id+'/'+component_id+'/-1/1');
      });
	}
	
	$scope.services = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-profile-services.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id).success(function(data){
			$scope.services = data;
	});
	
	$scope.servicelist = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-profile-service-list.php').success(function(data){
			$scope.servicelist = data;
	});
	
	$scope.addService = function(inspect_id) {
		$http.post('http://www.gudhome.com/mobile/sql/sql-C-home-profile-changeable.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&location_id=-1&inspect_id='+inspect_id).success(function(data){
	      	$location.path('/app/homeprofileservice/'+$stateParams.a_id+'/'+$stateParams.prop_id+'/'+inspect_id+'/-1/1');
      });
	};
	
	$scope.generic = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-profile-generic.php').success(function(data){
			$scope.generic = data;
	});
	$scope.openUrl = function() {
  	window.open('http://gudhome.com/mygudhome/home-profile.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id, '_system', 'location=yes');
  };
  $scope.schedule = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-profile-summary-schedule.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id).success(function(data){
			$scope.schedule = data;
	});
	
})

clipboardApp.controller('HomeProfileChangeableCtrl', function($ionicPlatform, $rootScope, $scope, $cordovaCamera, $ionicLoading, $cordovaFileTransfer, $http, $stateParams, $location, $ionicPopup, $firebaseArray) {
	
	$scope.changeable = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-profile-changeable.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&inspect_id='+$stateParams.inspect_id+'&location_id='+$stateParams.location_id+'&count='+$stateParams.count).success(function(data){
		$scope.changeable = data;
	});
	
	$scope.locations = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-profile-locations.php').success(function(data){
		$scope.locations = data;
	});
	
	$scope.new_location = {};
	$scope.changeLocation = function(location_id){
		$http.post('http://www.gudhome.com/mobile/sql/sql-U-home-profile-changeable-location.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count+'&location_id='+$stateParams.location_id+'&new_location_id='+location_id).success(function(data){
			$scope.new_location = data;
			$location.path('/app/homeprofilechangeable/'+$stateParams.a_id+'/'+$stateParams.prop_id+'/'+$stateParams.inspect_id+'/'+location_id+'/'+$scope.new_location.receivedCOUNT);
			$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-checkmark-circled"></i> Updated',
	            duration : 1500
	        });
		});
	};
	
	$scope.new_location_id = {};
	$scope.brandNewLocation = function(locationname, resultVarName){
		var config={params: {locationname:locationname}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-C-home-location_id.php', null, config).success(function(data, status, headers, config){
			$scope.new_location = data;
			$http.post('http://www.gudhome.com/mobile/sql/sql-U-home-profile-changeable-location.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count+'&location_id='+$stateParams.location_id+'&new_location_id='+$scope.new_location.receivedLOCATION_ID).success(function(data){
	      	$scope.new_location_id = data;
	      	$location.path('/app/homeprofilechangeable/'+$stateParams.a_id+'/'+$stateParams.prop_id+'/'+$stateParams.inspect_id+'/'+$scope.new_location_id.receivedLOCATION_ID+'/1');
	      	$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-checkmark-circled"></i> Updated',
	            duration : 1500
	        });
	      });
		})
		.error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
	
	$scope.specs = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-profile-changeable-specs.php').success(function(data){
		$scope.specs = data;
	});
	
	$scope.new_specs = {};
	$scope.changeSpecs = function(spec_id){
		$http.post('http://www.gudhome.com/mobile/sql/sql-U-home-profile-changeable-specs.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count+'&location_id='+$stateParams.location_id+'&spec_id='+spec_id).success(function(data){
	      	$scope.new_specs = data;
	      	$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-checkmark-circled"></i> Updated',
	            duration : 1500
	        });
	      }); 
	};
	
	$scope.new_spec = {};
	$scope.new_specs = {};
	$scope.brandNewSpecs = function(specname, resultVarName){
		//alert('spec : ' + specname.newspecs);
		var config={params: {specname:specname}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-C-home-profile-spec_id.php', null, config).success(function(data, status, headers, config){
			$scope.new_spec = data;
			//alert('new spec id '+$scope.new_spec.receivedSPEC_ID);
			$http.post('http://www.gudhome.com/mobile/sql/sql-U-home-profile-changeable-specs.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count+'&location_id='+$stateParams.location_id+'&spec_id='+$scope.new_spec.receivedSPEC_ID).success(function(data){
	      	$scope.new_specs = data;
	      	$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-checkmark-circled"></i> Updated',
	            duration : 1500
	        });
	      	//alert ('success : '+$scope.new_specs.receivedSPECS);
	      });
			
		})
		.error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
          //alert('error');
        });
	};
	
	$scope.new_note = {};
	$scope.addNote = function(note, resultVarName){
		var config={params: {note:note}};
		//alert('note '+note.note);
		$http.post('http://www.gudhome.com/mobile/sql/sql-U-home-profile-changeable-note.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count+'&location_id='+$stateParams.location_id, null, config).success(function(data, status, headers, config){
	      	$scope.new_note = data;
	      	$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-checkmark-circled"></i> Updated',
	            duration : 1500
	        });
	      	 //alert('success '+ $scope.new_note.receivedNOTE);
        })
        .error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
          //alert('error');
        });
	};
	
	$scope.new_schedule = {};
	$scope.changeSchedule = function(visit, resultVarName){
		var confirmPopup = $ionicPopup.confirm({
	     title: 'Change schedule',
	     template: 'Are you sure you want to change the schedule?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	     	var config={params: {visit:visit}};
	      $http.post('http://www.gudhome.com/mobile/sql/sql-U-home-profile-changeable-schedule.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count+'&location_id='+$stateParams.location_id, null, config).success(function(data, status, headers, config){
					$scope.new_schedule = data;
					$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-profile-changeable.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&inspect_id='+$stateParams.inspect_id+'&location_id='+$stateParams.location_id+'&count='+$stateParams.count).success(function(data){
						$scope.changeable = data;
					});
					$ionicLoading.hide();
			    $ionicLoading.show({
			        template: '<i class="icon ion-calendar"></i> Schedule updated',
			        duration : 1500
			    });
				});
	     } 
	   });
	};
	
	$scope.thehistory = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-profile-changeable-history.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&inspect_id='+$stateParams.inspect_id+'&location_id='+$stateParams.location_id+'&count='+$stateParams.count).success(function(data){
		$scope.thehistory = data;
	});
	
	$scope.openUrl = function(hcid) {
			//alert('a');
    	window.open('http://gudhome.com/mygudhome/visit-report.php?hcid='+hcid, '_system', 'location=yes');
  };
  
	$scope.deleteChangeable = function(){
	   var confirmPopup = $ionicPopup.confirm({
	     title: 'Delete Changeable',
	     template: 'Are you sure you want to delete this changeable?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	       //alert('confirmed');
	       $http.get('http://www.gudhome.com/mobile/sql/sql-D-home-profile-changeable.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count+'&location_id='+$stateParams.location_id).success(function(data){
		       	$location.path('/app/homeprofile/'+$stateParams.a_id+'/'+$stateParams.prop_id);
		       	$ionicLoading.hide();
		        $ionicLoading.show({
		            template: '<i class="icon ion-trash-a"></i> Deleted',
		            duration : 1500
		        });
	       });
	     } else {
	       //alert('cancelled');
	     }
	   });
	};
	
	
	
	////////////////////////////////////////////////////
	
	$scope.images = [];

  var userReference = fb.child("accounts/"+$stateParams.a_id+"/"+$stateParams.prop_id+"/profile/"+$stateParams.location_id+"/changeables/"+$stateParams.inspect_id+"/"+$stateParams.count);
  var syncArray = $firebaseArray(userReference.child("images"));
  $scope.images = syncArray;

  $scope.upload = function() {
      var options = {
          quality : 75,
          destinationType : Camera.DestinationType.DATA_URL,
          sourceType : Camera.PictureSourceType.CAMERA,
          allowEdit : true,
          encodingType: Camera.EncodingType.JPEG,
          popoverOptions: CameraPopoverOptions,
          targetWidth: 500,
          targetHeight: 500,
          saveToPhotoAlbum: false
      };
      $cordovaCamera.getPicture(options).then(function(imageData) {
          syncArray.$add({image: imageData}).then(function() {
              //alert("Image has been uploaded");
          });
      }, function(error) {
          console.error(error);
      });
  }
	
	
})

clipboardApp.controller('HomeProfileChangeableMediumCtrl', function($scope, $http, $stateParams, $ionicLoading, $location, $ionicPopup) {
	$scope.photo = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-profile-changeable-photo.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count+'&location_id='+$stateParams.location_id+'&rownum='+$stateParams.rownum).success(function(data){
		$scope.photo = data;
	});
	
	$scope.new_note = {};
	$scope.addNote = function(note, resultVarName){
		var config={params: {note:note}};
		//alert('note '+note.note);
		$http.post('http://www.gudhome.com/mobile/sql/sql-U-home-profile-changeable-media-note.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count+'&location_id='+$stateParams.location_id+'&rownum='+$stateParams.rownum, null, config).success(function(data, status, headers, config){
	      	$scope.new_note = data;
	      	$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-checkmark-circled"></i> Updated',
	            duration : 1500
	        });
        })
        .error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
		
	};
	
	
	$scope.deletePhoto = function(){
	   var confirmPopup = $ionicPopup.confirm({
	     title: 'Delete Photo',
	     template: 'Are you sure you want to delete this photo?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	       //alert('confirmed');
	       $http.get('http://www.gudhome.com/mobile/sql/sql-D-home-profile-changeable-media.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count+'&location_id='+$stateParams.location_id+'&rownum='+$stateParams.rownum).success(function(data){
		       	$location.path('/app/homeprofilechangeable/'+$stateParams.a_id+'/'+$stateParams.prop_id+'/'+$stateParams.inspect_id+'/'+$stateParams.location_id+'/'+$stateParams.count);
		       	$ionicLoading.hide();
		        $ionicLoading.show({
		            template: '<i class="icon ion-trash-a"></i> Deleted',
		            duration : 1500
		        });
	       });
	     } 
	   });
	};
})

clipboardApp.controller('HomeProfileServiceCtrl', function($ionicPlatform, $rootScope, $scope, $ionicLoading, $http, $stateParams, $location, $ionicPopup, $cordovaCamera, $firebaseArray) {
	$scope.changeable = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-profile-changeable.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&inspect_id='+$stateParams.inspect_id+'&location_id='+$stateParams.location_id+'&count='+$stateParams.count).success(function(data){
		$scope.changeable = data;
	});
	
	$scope.locations = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-profile-locations.php').success(function(data){
		$scope.locations = data;
	});
	
	$scope.new_location = {};
	$scope.changeLocation = function(location_id){
		$http.post('http://www.gudhome.com/mobile/sql/sql-U-home-profile-changeable-location.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count+'&location_id='+$stateParams.location_id+'&new_location_id='+location_id).success(function(data){
			$scope.new_location = data;
			$location.path('/app/homeprofileservice/'+$stateParams.a_id+'/'+$stateParams.prop_id+'/'+$stateParams.inspect_id+'/'+location_id+'/'+$scope.new_location.receivedCOUNT);
			$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-checkmark-circled"></i> Updated',
	            duration : 1500
	        });
		});
	};
	
	$scope.new_location_id = {};
	$scope.brandNewLocation = function(locationname, resultVarName){
		var config={params: {locationname:locationname}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-C-home-location_id.php', null, config).success(function(data, status, headers, config){
			$scope.new_location = data;
			//alert('new location id '+$scope.new_location.receivedLOCATION_ID);
			$http.post('http://www.gudhome.com/mobile/sql/sql-U-home-profile-changeable-location.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count+'&location_id='+$stateParams.location_id+'&new_location_id='+$scope.new_location.receivedLOCATION_ID).success(function(data){
	      	$scope.new_location_id = data;
	      	$location.path('/app/homeprofileservice/'+$stateParams.a_id+'/'+$stateParams.prop_id+'/'+$stateParams.inspect_id+'/'+$scope.new_location.receivedLOCATION_ID+'/1');
	      	$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-checkmark-circled"></i> Updated',
	            duration : 1500
	        });
	      	//alert ('success : '+$scope.new_specs.receivedSPECS);
	      });
			
		})
		.error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
	
	$scope.new_note = {};
	$scope.addNote = function(note, resultVarName){
		var config={params: {note:note}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-U-home-profile-changeable-note.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count+'&location_id='+$stateParams.location_id, null, config).success(function(data, status, headers, config){
	      	$scope.new_note = data;
	      	$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-checkmark-circled"></i> Updated',
	            duration : 1500
	        });
        })
        .error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
    
		var ref = fb.child("accounts/"+$stateParams.a_id+"/"+$stateParams.prop_id+"/profile/"+$stateParams.location_id+"/services/"+$stateParams.inspect_id+"/"+$stateParams.count);
    var postsRef = ref.child("notes");

	  var newPostRef = postsRef.push();
	  newPostRef.set({
	    note : note.note
	  });
	};
	
	$scope.new_schedule = {};
	$scope.changeSchedule = function(visit, resultVarName){
		var confirmPopup = $ionicPopup.confirm({
	     title: 'Change schedule',
	     template: 'Are you sure you want to change the schedule?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	     	var config={params: {visit:visit}};
	      $http.post('http://www.gudhome.com/mobile/sql/sql-U-home-profile-changeable-schedule.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count+'&location_id='+$stateParams.location_id, null, config).success(function(data, status, headers, config){
					$scope.new_schedule = data;
					$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-profile-changeable.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&inspect_id='+$stateParams.inspect_id+'&location_id='+$stateParams.location_id+'&count='+$stateParams.count).success(function(data){
						$scope.changeable = data;
					});
					$ionicLoading.hide();
			    $ionicLoading.show({
			        template: '<i class="icon ion-calendar"></i> Schedule updated',
			        duration : 1500
			    });
				});
	     } 
	   });
	};
	
	$scope.thehistory = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-profile-changeable-history.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&inspect_id='+$stateParams.inspect_id+'&location_id='+$stateParams.location_id+'&count='+$stateParams.count).success(function(data){
		$scope.thehistory = data;
	});
	
	$scope.openUrl = function(hcid) {
  	window.open('http://gudhome.com/mygudhome/visit-report.php?hcid='+hcid, '_system', 'location=yes');
  };
  
	$scope.deleteChangeable = function(){
	   var confirmPopup = $ionicPopup.confirm({
	     title: 'Delete Service',
	     template: 'Are you sure you want to delete this service?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	       $http.get('http://www.gudhome.com/mobile/sql/sql-D-home-profile-changeable.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count+'&location_id='+$stateParams.location_id).success(function(data){
		       	$location.path('/app/homeprofile/'+$stateParams.a_id+'/'+$stateParams.prop_id);
		       	$ionicLoading.hide();
		        $ionicLoading.show({
		            template: '<i class="icon ion-trash-a"></i> Deleted',
		            duration : 1500
		        });
	       });
	     } 
	   });
	};
	
	////////////////////////////////////////////////////
	
	$scope.images = [];

  var userReference = fb.child("accounts/"+$stateParams.a_id+"/"+$stateParams.prop_id+"/profile/"+$stateParams.location_id+"/services/"+$stateParams.inspect_id+"/"+$stateParams.count);
  var syncArray = $firebaseArray(userReference.child("images"));
  $scope.images = syncArray;

  $scope.upload = function() {
      var options = {
          quality : 75,
          destinationType : Camera.DestinationType.DATA_URL,
          sourceType : Camera.PictureSourceType.CAMERA,
          allowEdit : true,
          encodingType: Camera.EncodingType.JPEG,
          popoverOptions: CameraPopoverOptions,
          targetWidth: 500,
          targetHeight: 500,
          saveToPhotoAlbum: false
      };
      $cordovaCamera.getPicture(options).then(function(imageData) {
          syncArray.$add({image: imageData}).then(function() {
              //alert("Image has been uploaded");
          });
      }, function(error) {
          console.error(error);
      });
  }
	
})

clipboardApp.controller('HomeProfileComponentCtrl', function($ionicPlatform, $rootScope, $scope, $cordovaCamera, $ionicLoading, $cordovaFileTransfer, $http, $stateParams, $location, $ionicPopup, $firebaseArray) {
	
	$scope.component = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-profile-component.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&component_id='+$stateParams.component_id+'&location_id='+$stateParams.location_id+'&count='+$stateParams.count).success(function(data){
		$scope.component = data;
	});
	
	$scope.locations = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-profile-locations.php').success(function(data){
		$scope.locations = data;
	});
	
	$scope.new_location = {};
	$scope.changeLocation = function(location_id){
		$http.post('http://www.gudhome.com/mobile/sql/sql-U-home-profile-component-location.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&component_id='+$stateParams.component_id+'&count='+$stateParams.count+'&location_id='+$stateParams.location_id+'&new_location_id='+location_id).success(function(data){
			$scope.new_location = data;
			$location.path('/app/homeprofilecomponent/'+$stateParams.a_id+'/'+$stateParams.prop_id+'/'+$stateParams.component_id+'/'+location_id+'/'+$scope.new_location.receivedCOUNT);
			$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-checkmark-circled"></i> Updated',
	            duration : 1500
	        });
		});
	};
	
	$scope.new_location_id = {};
	$scope.brandNewLocation = function(locationname, resultVarName){
		var config={params: {locationname:locationname}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-C-home-location_id.php', null, config).success(function(data, status, headers, config){
			$scope.new_location = data;
			$http.post('http://www.gudhome.com/mobile/sql/sql-U-home-profile-component-location.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&component_id='+$stateParams.component_id+'&count='+$stateParams.count+'&location_id='+$stateParams.location_id+'&new_location_id='+$scope.new_location.receivedLOCATION_ID).success(function(data){
	      	$scope.new_location_id = data;
	      	$location.path('/app/homeprofilecomponent/'+$stateParams.a_id+'/'+$stateParams.prop_id+'/'+$stateParams.component_id+'/'+$scope.new_location.receivedLOCATION_ID+'/1');
	      	$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-checkmark-circled"></i> Updated',
	            duration : 1500
	        });
	      });
			
		})
		.error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
	
	$scope.makes = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-profile-make-list.php').success(function(data){
		$scope.makes = data;
	});
	
	$scope.new_make = {};
	$scope.changeMake = function(make_id){
		//alert('spec id '+spec_id);
		$http.post('http://www.gudhome.com/mobile/sql/sql-U-home-profile-component-make.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&component_id='+$stateParams.component_id+'&count='+$stateParams.count+'&location_id='+$stateParams.location_id+'&make_id='+make_id).success(function(data){
	      	$scope.new_make = data;
	      	$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-checkmark-circled"></i> Updated',
	            duration : 1500
	        });
	      });
	};
	
	$scope.new_make_id = {};
	$scope.new_make = {};
	$scope.brandNewMake = function(makename, resultVarName){
		var config={params: {makename:makename}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-C-home-profile-make_id.php?r='+window.localStorage['pro_id'], null, config).success(function(data, status, headers, config){
			$scope.new_make_id = data;
			
			//alert('new spec id '+$scope.new_spec.receivedSPEC_ID);
			$http.post('http://www.gudhome.com/mobile/sql/sql-U-home-profile-component-make.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&component_id='+$stateParams.component_id+'&count='+$stateParams.count+'&location_id='+$stateParams.location_id+'&make_id='+$scope.new_make_id.receivedMAKE_ID+'&r='+window.localStorage['pro_id']).success(function(data){
	      	$scope.new_make = data;
	      	$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-checkmark-circled"></i> Updated',
	            duration : 1500
	        });
	      });
			
		})
		.error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
	
	$scope.new_model = {};
	$scope.addModel = function(model, resultVarName){
		var config={params: {model:model}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-U-home-profile-component-model.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&component_id='+$stateParams.component_id+'&count='+$stateParams.count+'&location_id='+$stateParams.location_id, null, config).success(function(data, status, headers, config){
	      	$scope.new_model = data;
	      	$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-checkmark-circled"></i> Updated',
	            duration : 1500
	        });
        })
        .error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
	
	$scope.new_serial = {};
	$scope.addSerial = function(serial, resultVarName){
		var config={params: {serial:serial}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-U-home-profile-component-serial.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&component_id='+$stateParams.component_id+'&count='+$stateParams.count+'&location_id='+$stateParams.location_id, null, config).success(function(data, status, headers, config){
	      	$scope.new_serial = data;
	      	$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-checkmark-circled"></i> Updated',
	            duration : 1500
	        });
        })
        .error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
	
	$scope.new_note = {};
	$scope.addNote = function(note, resultVarName){
		var config={params: {note:note}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-U-home-profile-component-note.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&component_id='+$stateParams.component_id+'&count='+$stateParams.count+'&location_id='+$stateParams.location_id, null, config).success(function(data, status, headers, config){
	      	$scope.new_note = data;
	      	$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-checkmark-circled"></i> Updated',
	            duration : 1500
	        });
        })
        .error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
	
	$scope.deleteComponent = function(){
	   var confirmPopup = $ionicPopup.confirm({
	     title: 'Delete Component',
	     template: 'Are you sure you want to delete this component?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	       $http.get('http://www.gudhome.com/mobile/sql/sql-D-home-profile-component.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&component_id='+$stateParams.component_id+'&count='+$stateParams.count+'&location_id='+$stateParams.location_id).success(function(data){
		       	$location.path('/app/homeprofile/'+$stateParams.a_id+'/'+$stateParams.prop_id);
		       	$ionicLoading.hide();
		        $ionicLoading.show({
		            template: '<i class="icon ion-trash-a"></i> Deleted',
		            duration : 1500
		        });
	       });
	     }
	   });
	};
	////////////////////////////////////////////////////
	$scope.images = [];

  var userReference = fb.child("accounts/"+$stateParams.a_id+"/"+$stateParams.prop_id+"/profile/"+$stateParams.location_id+"/components/"+$stateParams.component_id+"/"+$stateParams.count);
  var syncArray = $firebaseArray(userReference.child("images"));
  $scope.images = syncArray;

  $scope.upload = function() {
      var options = {
          quality : 75,
          destinationType : Camera.DestinationType.DATA_URL,
          sourceType : Camera.PictureSourceType.CAMERA,
          allowEdit : true,
          encodingType: Camera.EncodingType.JPEG,
          popoverOptions: CameraPopoverOptions,
          targetWidth: 500,
          targetHeight: 500,
          saveToPhotoAlbum: false
      };
      $cordovaCamera.getPicture(options).then(function(imageData) {
          syncArray.$add({image: imageData}).then(function() {
              //alert("Image has been uploaded");
          });
      }, function(error) {
          console.error(error);
      });
  }
	
})

clipboardApp.controller('HomeProfileComponentMediumCtrl', function($scope, $http, $stateParams, $ionicLoading, $location, $ionicPopup) {
	$scope.photo = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-profile-component-photo.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&component_id='+$stateParams.component_id+'&count='+$stateParams.count+'&location_id='+$stateParams.location_id+'&rownum='+$stateParams.rownum).success(function(data){
		$scope.photo = data;
	});
	
	$scope.new_note = {};
	$scope.addNote = function(note, resultVarName){
		var config={params: {note:note}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-U-home-profile-component-media-note.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&component_id='+$stateParams.component_id+'&count='+$stateParams.count+'&location_id='+$stateParams.location_id+'&rownum='+$stateParams.rownum, null, config).success(function(data, status, headers, config){
	      	$scope.new_note = data;
	      	$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-checkmark-circled"></i> Updated',
	            duration : 1500
	        });
        })
        .error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
	
	$scope.deletePhoto = function(){
	   var confirmPopup = $ionicPopup.confirm({
	     title: 'Delete Photo',
	     template: 'Are you sure you want to delete this photo?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	       //alert('confirmed');
	       $http.get('http://www.gudhome.com/mobile/sql/sql-D-home-profile-component-media.php?a_id='+$stateParams.a_id+'&prop_id='+$stateParams.prop_id+'&component_id='+$stateParams.component_id+'&count='+$stateParams.count+'&location_id='+$stateParams.location_id+'&rownum='+$stateParams.rownum).success(function(data){
		       	$location.path('/app/homeprofilecomponent/'+$stateParams.a_id+'/'+$stateParams.prop_id+'/'+$stateParams.component_id+'/'+$stateParams.location_id+'/'+$stateParams.count);
		       	$ionicLoading.hide();
		        $ionicLoading.show({
		            template: '<i class="icon ion-trash-a"></i> Deleted',
		            duration : 1500
		        });
	       });
	     } 
	   });
	};
})

clipboardApp.controller('HomeCheckCtrl', function($scope, $http, $stateParams, $ionicLoading, $location, $ionicPopup) {
	$scope.hcid = {};
	$http.get('http://gudhome.com/mobile/sql/sql-R-home-check.php?hc_id='+$stateParams.hc_id).success(function(data){
		$scope.hcid = {
			HC_ID : data.HC_ID,
			HC_NAME : data.HC_NAME,
			PRETTY_VISIT_NUMBER : data.PRETTY_VISIT_NUMBER,
			PRETTY_DATE_OF_VISIT : data.PRETTY_DATE_OF_VISIT,
			ADDRESS: data.ADDRESS,
			A_ID: data.A_ID,
			PROP_ID: data.PROP_ID,
			NOTE_COUNT: data.NOTE_COUNT,
			HC_STATE_DESC : data.HC_STATE_DESC
		};
	});
	
	$scope.locations = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-check-locations.php?hc_id='+$stateParams.hc_id).success(function(data){
		$scope.locations = data;
	});
	
	$scope.openUrl = function(hcid) {
		//alert('redirecting');
  	window.open('http://gudhome.com/mygudhome/visit-report.php?hcid='+hcid, '_system', 'location=yes');
  };
	
	$scope.close_hcid = {};
	$scope.closeHomeCheck = function(){
	   var confirmPopup = $ionicPopup.confirm({
	     title: 'Close Home Check',
	     template: 'Are you sure you are ready to mark this home check as complete?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	       $http.post('http://www.gudhome.com/mobile/sql/sql-U-home-check-close.php?hc_id='+$stateParams.hc_id).success(function(data){
	       		$scope.close_hcid = data;
		       	$location.path('/app/address/'+$scope.close_hcid.receivedA_ID+'/'+$scope.close_hcid.receivedPROP_ID);
		       	$ionicLoading.hide();
		        $ionicLoading.show({
		            template: '<i class="icon ion-locked"></i> Closed',
		            duration : 1500
		        });
	       });
	     } else {
	       //alert('cancelled');
	     }
	   });
	};
	
	$scope.states = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-hc-states.php').success(function(data){
		$scope.states = data;
	});
	
	$scope.submitAnswer = function(stateid){
		$http.get('http://www.gudhome.com/mobile/sql/sql-U-hc-state.php?state_id='+stateid+'&hc_id='+$stateParams.hc_id+'&r='+window.localStorage['pro_id']).success(function(data){
			$http.get('http://gudhome.com/mobile/sql/sql-R-home-check.php?hc_id='+$stateParams.hc_id).success(function(data){
				$scope.hcid = data;
				$ionicLoading.hide();
        $ionicLoading.show({
            template: '<i class="icon ion-checkmark-circled"></i> Updated',
            duration : 1500
        });
			});
		});
	};
	
	$scope.materials = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-check-materials.php?hc_id='+$stateParams.hc_id).success(function(data){
		$scope.materials = data;
	});
})

clipboardApp.controller('HomeCheckLocationCtrl', function($scope, $http, $stateParams) {
	$scope.location = {};
	$http.get('http://gudhome.com/mobile/sql/sql-R-home-check-location.php?hc_id='+$stateParams.hc_id+'&location_id='+$stateParams.location_id).success(function(data){
		$scope.location = {
			LOCATION_ID : data.LOCATION_ID,
			LOCATION_DESC : data.LOCATION_DESC,
			ADDRESS : data.ADDRESS,
			HC_ID : data.HC_ID,
			HC_NAME: data.HC_NAME
		};
	});
	
	$scope.inspections =[];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-check-inspections.php?hc_id='+$stateParams.hc_id+'&location_id='+$stateParams.location_id).success(function(data){
		$scope.inspections = data;
	})
})

clipboardApp.controller('HomeCheckLocationNotesCtrl', function($ionicPlatform, $rootScope, $scope, $cordovaCamera, $ionicLoading, $cordovaFileTransfer, $http, $stateParams, $location, $ionicPopup) {
	
	$scope.location ={};
	$http.get('http://gudhome.com/mobile/sql/sql-R-home-check-location.php?hc_id='+$stateParams.hc_id+'&location_id='+$stateParams.location_id).success(function(data){
		$scope.location = data;
	});
	
	$scope.notes = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-check-location_notes.php?hc_id='+$stateParams.hc_id+'&location_id='+$stateParams.location_id).success(function(data){
		$scope.notes = data;
	});
	
	$scope.addNote = function(note, resultVarName){
		var config={params: {note:note}};
		//alert('note '+note.note);
		$http.post('http://www.gudhome.com/mobile/sql/sql-C-home-check-location-note.php?hc_id='+$stateParams.hc_id+'&location_id='+$stateParams.location_id, null, config).success(function(data, status, headers, config){
	      	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-check-location_notes.php?hc_id='+$stateParams.hc_id+'&location_id='+$stateParams.location_id).success(function(data){
				$scope.notes = data;
				note.note='';
				$ionicLoading.hide();
		        $ionicLoading.show({
		            template: '<i class="icon ion-checkmark-circled"></i> Added',
		            duration : 1500
		        });
			});
        })
        .error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
	
	$scope.customer = {};
	$scope.customerFacing = function(rownum) {
		$http.get('http://www.gudhome.com/mobile/sql/sql-U-home-check-location-note-customer-facing.php?hc_id='+$stateParams.hc_id+'&rownum='+rownum).success(function(data){
			$scope.customer = data;
			$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-eye"></i> '+$scope.customer.receivedMESSAGE,
	            duration : 1500
	        });
	        $http.get('http://www.gudhome.com/mobile/sql/sql-R-home-check-location_notes.php?hc_id='+$stateParams.hc_id+'&location_id='+$stateParams.location_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count).success(function(data){
				$scope.notes = data;
			});
		});
	}
	
	$scope.customerAlert = function(rownum) {
		//alert('row '+rownum);
		$http.get('http://www.gudhome.com/mobile/sql/sql-U-home-check-location-note-alert.php?hc_id='+$stateParams.hc_id+'&rownum='+rownum).success(function(data){
			$scope.customer = data;
			$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-alert-circled"></i> '+$scope.customer.receivedMESSAGE,
	            duration : 1500
	        });
	        $http.get('http://www.gudhome.com/mobile/sql/sql-R-home-check-location_notes.php?hc_id='+$stateParams.hc_id+'&location_id='+$stateParams.location_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count).success(function(data){
				$scope.notes = data;
			});
		});
	}
	
	$scope.deleteNote = function(rownum){
	   var confirmPopup = $ionicPopup.confirm({
	     title: 'Delete Note',
	     template: 'Are you sure you want to delete this note?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	       //alert('confirmed');
	       $http.get('http://www.gudhome.com/mobile/sql/sql-D-home-check-location-note.php?hc_id='+$stateParams.hc_id+'&location_id='+$stateParams.location_id+'&rownum='+rownum).success(function(data){
	       		$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-check-location_notes.php?hc_id='+$stateParams.hc_id+'&location_id='+$stateParams.location_id).success(function(data){
					$scope.notes = data;
				});
		       	$ionicLoading.hide();
		        $ionicLoading.show({
		            template: '<i class="icon ion-trash-a"></i> Deleted',
		            duration : 1500
		        });
	       });
	     } else {
	       //alert('cancelled');
	     }
	   });
	};
	
})

clipboardApp.controller('HomeCheckLocationMediumCtrl', function($scope, $http, $stateParams, $ionicLoading, $location, $ionicPopup) {
	$scope.photo = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-check-location-medium.php?hc_id='+$stateParams.hc_id+'&location_id='+$stateParams.location_id+'&rownum='+$stateParams.rownum).success(function(data){
		$scope.photo = data;
	});
	
	$scope.new_note = {};
	$scope.addNote = function(note, resultVarName){
		var config={params: {note:note}};
		//alert('note '+note.note);
		$http.post('http://www.gudhome.com/mobile/sql/sql-U-home-check-location-medium-note.php?hc_id='+$stateParams.hc_id+'&location_id='+$stateParams.location_id+'&rownum='+$stateParams.rownum, null, config).success(function(data, status, headers, config){
	      	$scope.new_note = data;
	      	$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-checkmark-circled"></i> Updated',
	            duration : 1500
	        });
        })
        .error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
	
	$scope.deletePhoto = function(){
	   var confirmPopup = $ionicPopup.confirm({
	     title: 'Delete Photo',
	     template: 'Are you sure you want to delete this photo?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	       //alert('confirmed');
	       $http.get('http://www.gudhome.com/mobile/sql/sql-D-home-check-location-medium.php?hc_id='+$stateParams.hc_id+'&location_id='+$stateParams.location_id+'&rownum='+$stateParams.rownum).success(function(data){
		       	$location.path('/app/homechecklocationnotes/'+$stateParams.hc_id+'/'+$stateParams.location_id);
		       	$ionicLoading.hide();
		        $ionicLoading.show({
		            template: '<i class="icon ion-trash-a"></i> Deleted',
		            duration : 1500
		        });
	       });
	     } 
	   });
	};
})

clipboardApp.controller('HomeCheckInspectionCtrl', function($ionicPlatform, $rootScope, $scope, $cordovaCamera, $ionicLoading, $cordovaFileTransfer, $http, $stateParams, $location, $ionicPopup, $firebaseArray) {
	$scope.inspection = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-check-inspection.php?hc_id='+$stateParams.hc_id+'&location_id='+$stateParams.location_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count).success(function(data){
		$scope.inspection = {
			HC_ID : data.HC_ID,
			LOCATION_ID : data.LOCATION_ID,
			LOCATION_DESC : data.LOCATION_DESC,
			INSPECT_ID : data.INSPECT_ID,
			INSPECT_DESC : data.INSPECT_DESC,
			COUNT : data.COUNT,
			PRETTY_COUNT : data.PRETTY_COUNT,
			A_ID : data.A_ID,
			PROP_ID : data.PROP_ID,
			SPEC_DESC : data.SPEC_DESC,
			NOTE : data.NOTE,
			ADDRESS : data.ADDRESS
		};
	});
	
	$scope.action ={};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-check-inspection-action.php?hc_id='+$stateParams.hc_id+'&location_id='+$stateParams.location_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count).success(function(data){
		$scope.action = data;
	});
	
	$scope.actions = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-check-actions.php').success(function(data){
		$scope.actions = data;
	});
	
	$scope.submitAnswer = function(ans){
		//alert('answer '+ans);
		$http.get('http://www.gudhome.com/mobile/sql/sql-C-home-check-inspection-action.php?hc_id='+$stateParams.hc_id+'&location_id='+$stateParams.location_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count+'&action_done_id='+ans).success(function(data){
			$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-check-inspection-action.php?hc_id='+$stateParams.hc_id+'&location_id='+$stateParams.location_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count).success(function(data){
				$scope.action = data;
				$ionicLoading.hide();
		        $ionicLoading.show({
		            template: '<i class="icon ion-checkmark-circled"></i> Updated',
		            duration : 1500
		        });
			});
		});
		
		
		var ref = fb.child("homechecks/"+$stateParams.hc_id+"/"+$stateParams.location_id+"/"+$stateParams.inspect_id+"/"+$stateParams.count);
		var usersRef = ref.child("action");
			usersRef.set({
		  ans
		});
		
	};
	
	$scope.notes = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-check-notes.php?hc_id='+$stateParams.hc_id+'&location_id='+$stateParams.location_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count).success(function(data){
		$scope.notes = data;
	});
	$scope.addNote = function(note, resultVarName){
		var config={params: {note:note}};
		//alert('note '+note.note);
		$http.post('http://www.gudhome.com/mobile/sql/sql-C-home-check-note.php?hc_id='+$stateParams.hc_id+'&location_id='+$stateParams.location_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count, null, config).success(function(data, status, headers, config){
	      	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-check-notes.php?hc_id='+$stateParams.hc_id+'&location_id='+$stateParams.location_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count).success(function(data){
				$scope.notes = data;
				$ionicLoading.hide();
		        $ionicLoading.show({
		            template: '<i class="icon ion-checkmark-circled"></i> Added',
		            duration : 1500
		        });
			});
        })
        .error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
	
	$scope.customer = {};
	$scope.customerFacing = function(rownum) {
		$http.get('http://www.gudhome.com/mobile/sql/sql-U-home-check-note-customer-facing.php?hc_id='+$stateParams.hc_id+'&rownum='+rownum).success(function(data){
			$scope.customer = data;
			$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-eye"></i> '+$scope.customer.receivedMESSAGE,
	            duration : 1500
	        });
	        $http.get('http://www.gudhome.com/mobile/sql/sql-R-home-check-notes.php?hc_id='+$stateParams.hc_id+'&location_id='+$stateParams.location_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count).success(function(data){
				$scope.notes = data;
			});
		});
	}
	
	$scope.customerAlert = function(rownum) {
		//alert('row '+rownum);
		$http.get('http://www.gudhome.com/mobile/sql/sql-U-home-check-note-alert.php?hc_id='+$stateParams.hc_id+'&rownum='+rownum).success(function(data){
			$scope.customer = data;
			$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-alert-circled"></i> '+$scope.customer.receivedMESSAGE,
	            duration : 1500
	        });
	        $http.get('http://www.gudhome.com/mobile/sql/sql-R-home-check-notes.php?hc_id='+$stateParams.hc_id+'&location_id='+$stateParams.location_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count).success(function(data){
				$scope.notes = data;
			});
		});
	}
	
	$scope.deleteNote = function(rownum){
	   var confirmPopup = $ionicPopup.confirm({
	     title: 'Delete Note',
	     template: 'Are you sure you want to delete this note?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	       $http.get('http://www.gudhome.com/mobile/sql/sql-D-home-check-note.php?hc_id='+$stateParams.hc_id+'&location_id='+$stateParams.location_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count+'&rownum='+rownum).success(function(data){
	       		$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-check-notes.php?hc_id='+$stateParams.hc_id+'&location_id='+$stateParams.location_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count).success(function(data){
					$scope.notes = data;
				});
		       	$ionicLoading.hide();
		        $ionicLoading.show({
		            template: '<i class="icon ion-trash-a"></i> Deleted',
		            duration : 1500
		        });
	       });
	     } 
	   });
	};
	///////////////////////////////////
	$scope.images = [];

  var userReference = fb.child("homechecks/"+$stateParams.hc_id+"/"+$stateParams.location_id+"/"+$stateParams.inspect_id+"/"+$stateParams.count);
  var syncArray = $firebaseArray(userReference.child("images"));
  $scope.images = syncArray;

  $scope.upload = function() {
      var options = {
          quality : 75,
          destinationType : Camera.DestinationType.DATA_URL,
          sourceType : Camera.PictureSourceType.CAMERA,
          allowEdit : true,
          encodingType: Camera.EncodingType.JPEG,
          popoverOptions: CameraPopoverOptions,
          targetWidth: 500,
          targetHeight: 500,
          saveToPhotoAlbum: false
      };
      $cordovaCamera.getPicture(options).then(function(imageData) {
          syncArray.$add({image: imageData}).then(function() {
              //alert("Image has been uploaded");
          });
      }, function(error) {
          console.error(error);
      });
  }
  
  $scope.photolib = function() {
      var options = {
          quality : 75,
          destinationType: Camera.DestinationType.DATA_URL,
	      	sourceType: Camera.PictureSourceType.PHOTOLIBRARY
      };
      $cordovaCamera.getPicture(options).then(function(imageData) {
          syncArray.$add({image: imageData}).then(function() {
              //alert("Image has been uploaded");
          });
      }, function(error) {
          console.error(error);
      });
  }
	
})

clipboardApp.controller('HomeCheckMediumCtrl', function($scope, $http, $stateParams, $ionicLoading, $location, $ionicPopup) {
	$scope.photo = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-check-medium.php?hc_id='+$stateParams.hc_id+'&location_id='+$stateParams.location_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count+'&rownum='+$stateParams.rownum).success(function(data){
		$scope.photo = data;
	});
	
	$scope.new_note = {};
	$scope.addNote = function(note, resultVarName){
		var config={params: {note:note}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-U-home-check-medium-note.php?hc_id='+$stateParams.hc_id+'&location_id='+$stateParams.location_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count+'&rownum='+$stateParams.rownum, null, config).success(function(data, status, headers, config){
	      	$scope.new_note = data;
	      	$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-checkmark-circled"></i> Updated',
	            duration : 1500
	        });
        })
        .error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
	
	$scope.deletePhoto = function(){
	   var confirmPopup = $ionicPopup.confirm({
	     title: 'Delete Photo',
	     template: 'Are you sure you want to delete this photo?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	       $http.get('http://www.gudhome.com/mobile/sql/sql-D-home-check-medium.php?hc_id='+$stateParams.hc_id+'&location_id='+$stateParams.location_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count+'&rownum='+$stateParams.rownum).success(function(data){
		       	$location.path('/app/homecheckinspection/'+$stateParams.hc_id+'/'+$stateParams.location_id+'/'+$stateParams.inspect_id+'/'+$stateParams.count);
		       	$ionicLoading.hide();
		        $ionicLoading.show({
		            template: '<i class="icon ion-trash-a"></i> Deleted',
		            duration : 1500
		        });
	       });
	     } 
	   });
	};
})

clipboardApp.controller('HomeCheckMedium2Ctrl', function($scope, $http, $stateParams, $ionicLoading, $location, $ionicPopup, $firebaseArray) {
	
	$scope.inspection = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-home-check-inspection.php?hc_id='+$stateParams.hc_id+'&location_id='+$stateParams.location_id+'&inspect_id='+$stateParams.inspect_id+'&count='+$stateParams.count).success(function(data){
		$scope.inspection = data;
	});
	
	
	$scope.images = [];
	
	fb.child("homechecks/"+$stateParams.hc_id+"/"+$stateParams.location_id+"/"+$stateParams.inspect_id+"/"+$stateParams.count+"/"+$stateParams.imageid).once('value', function(snap) {
		//alert('a');
   //alert('I fetched a user!', snap.val().image);
   $scope.images = snap.val().image;
});
	
  var userReference = fb.child("homechecks/"+$stateParams.hc_id+"/"+$stateParams.location_id+"/"+$stateParams.inspect_id+"/"+$stateParams.count+"/"+$stateParams.imageid);
  var syncArray = $firebaseArray(userReference);
  $scope.images = syncArray;
	
})

clipboardApp.controller('ProjectCtrl', function($scope, $http, $stateParams, $location, $ionicPlatform, $rootScope, $cordovaCamera, $ionicLoading, $cordovaFileTransfer, $ionicPopup, $firebaseArray) {
	
	$scope.project = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project.php?t_id='+$stateParams.t_id+'&r='+window.localStorage['pro_id']).success(function(data){
		$scope.project = {
			T_ID : data.T_ID,
			T_NAME : data.T_NAME,
			T_STATE_DESC : data.T_STATE_DESC,
			SERVICE_REQUEST : data.SERVICE_REQUEST,
			PROJ_CREATE_DAT : data.PROJ_CREATE_DAT,
			A_ID : data.A_ID,
			PROP_ID : data.PROP_ID,
			ADDRESS : data.ADDRESS,
			PRETTY_SENT : data.PRETTY_SENT,
			PRETTY_APPROVED : data.PRETTY_APPROVED,
			BILL : data.BILL
		}
	});
	
	
	$scope.changename=false;
	$scope.showName = function() {
		$scope.changename=!$scope.changename;
	};
	
	$scope.newname = {};
	$scope.changeName = function(project, resultVarName){
		var config={params: {project:project}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-U-project-name.php?t_id='+$stateParams.t_id, null, config).success(function(data, status, headers, config){
			$scope.newname = data;
			$http.get('http://www.gudhome.com/mobile/sql/sql-R-project.php?t_id='+$stateParams.t_id+'&r='+window.localStorage['pro_id']).success(function(data){
				$scope.project = data;
				$scope.changename=false;
				$ionicLoading.hide();
        $ionicLoading.show({
            template: '<i class="icon ion-checkmark-circled"></i> Updated name',
            duration : 1500
        });
			});	
		})
	};
	
	$scope.showmerequest=false;
	$scope.showRequest = function() {
		$scope.showmerequest=!$scope.showmerequest
	};
	
	$scope.request = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-request.php?t_id='+$stateParams.t_id).success(function(data){
		//alert('request ' + data.SERVICE_REQUEST);
		$scope.request = {
			request : data.SERVICE_REQUEST
		};
	});
	
	$scope.addRequest = function(project, resultVarName){
		//alert('request '+request.request);
		$ionicLoading.hide();
    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner> Working...'
    });
		var config={params: {project:project}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-U-project-request.php?t_id='+$stateParams.t_id, null, config).success(function(data, status, headers, config){
					$scope.showmerequest=false;
	      	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project.php?t_id='+$stateParams.t_id+'&r='+window.localStorage['pro_id']).success(function(data){
						$scope.project = data;
					});
	      	$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-checkmark-circled"></i> Updated',
	            duration : 1500
	        });
        })
        .error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
	
	$scope.addtodo=false;
	$scope.showAddTodo = function() {
		$scope.addtodo=!$scope.addtodo
	};
	
	$scope.todos = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-todos.php?t_id='+$stateParams.t_id+'&r='+window.localStorage['pro_id']).success(function(data){
		$scope.todos = data;
	});
	
	$scope.snoozeds = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-todos-snoozed.php?t_id='+$stateParams.t_id+'&r='+window.localStorage['pro_id']).success(function(data){
		$scope.snoozeds = data;
	});
	
	$scope.addTodo = function(todo, resultVarName){
		var config={params: {todo:todo}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-C-project-todo.php?t_id='+$stateParams.t_id+'&r='+window.localStorage['pro_id'], null, config).success(function(data, status, headers, config){
	      	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-todos.php?t_id='+$stateParams.t_id).success(function(data){
						$scope.todos = data;
						todo.todo='';
						$scope.addtodo=false;
						$ionicLoading.hide();
		        $ionicLoading.show({
		            template: '<i class="icon ion-checkmark-circled"></i> Added',
		            duration : 1500
		        });
			});
        })
        .error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
	
	
	$scope.showmestatus=false;
	$scope.showState = function() {
		$scope.showmestatus=!$scope.showmestatus
	};
	
	$scope.states = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-states.php').success(function(data){
		$scope.states = data;
	});
	
	$scope.submitAnswer = function(stateid){
		$http.get('http://www.gudhome.com/mobile/sql/sql-U-project-state.php?state_id='+stateid+'&t_id='+$stateParams.t_id+'&r='+window.localStorage['pro_id']).success(function(data){
			$http.get('http://www.gudhome.com/mobile/sql/sql-R-project.php?t_id='+$stateParams.t_id).success(function(data){
				$scope.project = data;
				$scope.showmestatus=false;
				$ionicLoading.hide();
        $ionicLoading.show({
            template: '<i class="icon ion-checkmark-circled"></i> Updated',
            duration : 1500
        });
			});
		});
	};
	
	$scope.labors =[];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-services.php?t_id='+$stateParams.t_id+'&category=1').success(function(data){
		$scope.labors = data;
	});
	
	$scope.labor_type = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-labor-types.php').success(function(data){
		$scope.labor_type = data;
	});
	
	$scope.materials = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-services.php?t_id='+$stateParams.t_id+'&category=2').success(function(data){
		$scope.materials = data;
	});
	
	$scope.bids = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-services.php?t_id='+$stateParams.t_id+'&category=3').success(function(data){
		$scope.bids = data;
	});
	
	$scope.bid_type = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-bid-types.php').success(function(data){
		$scope.bid_type = data;
	});
	
	$scope.new_service = {};
	$scope.addLabor = function(service, resultVarName){
		var config={params: {service:service}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-C-project-service.php?t_id='+$stateParams.t_id+'&type='+service.servicetype+'&r='+window.localStorage['pro_id'], null, config).success(function(data, status, headers, config){
			$scope.new_service = data;
			$location.path('/app/projectservice/'+$stateParams.t_id+'/'+$scope.new_service.receivedROWNUM);
		})
		.error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
	
	$scope.addMaterial = function(service, resultVarName){
		var config={params: {service:service}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-C-project-service.php?t_id='+$stateParams.t_id+'&type=2&r='+window.localStorage['pro_id'], null, config).success(function(data, status, headers, config){
			$scope.new_service = data;
			$location.path('/app/projectservice/'+$stateParams.t_id+'/'+$scope.new_service.receivedROWNUM);
		})
		.error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
	
	$scope.addBidType = function(service, resultVarName){
		var config={params: {service:service}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-C-project-service-type.php?t_id='+$stateParams.t_id+'&category=3&r='+window.localStorage['pro_id'], null, config).success(function(data, status, headers, config){
			$scope.new_service = data;
			$http.get('http://www.gudhome.com/mobile/sql/sql-C-project-service.php?t_id='+$stateParams.t_id+'&type='+$scope.new_service.receivedSVC_TYPE_ID+'&r='+window.localStorage['pro_id']).success(function(data){
				$scope.new_service = data;
				$location.path('/app/projectservice/'+$stateParams.t_id+'/'+$scope.new_service.receivedROWNUM);
			})
		})
		.error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
	$scope.addBid = function(svc_type_id) {
		$http.get('http://www.gudhome.com/mobile/sql/sql-C-project-service.php?t_id='+$stateParams.t_id+'&type='+svc_type_id+'&r='+window.localStorage['pro_id']).success(function(data){
			$scope.new_service = data;
			$location.path('/app/projectservice/'+$stateParams.t_id+'/'+$scope.new_service.receivedROWNUM);
		})
	}
	
	
	$scope.notes = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-notes.php?t_id='+$stateParams.t_id).success(function(data){
		$scope.notes = data;
	});
	$scope.addNote = function(note, resultVarName){
		var config={params: {note:note}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-C-project-note.php?t_id='+$stateParams.t_id+'&r='+window.localStorage['pro_id'], null, config).success(function(data, status, headers, config){
	      	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-notes.php?t_id='+$stateParams.t_id).success(function(data){
						$scope.notes = data;
						note.note='';
						$scope.showmenote=false;
						$ionicLoading.hide();
		        $ionicLoading.show({
		            template: '<i class="icon ion-checkmark-circled"></i> Added',
		            duration : 1500
		        });
			});
        })
        .error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
	
	$scope.deleteNote = function(rownum){
	   var confirmPopup = $ionicPopup.confirm({
	     title: 'Delete Note',
	     template: 'Are you sure you want to delete this note?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	       //alert('confirmed');
	       $http.get('http://www.gudhome.com/mobile/sql/sql-D-project-note.php?t_id='+$stateParams.t_id+'&rownum='+rownum).success(function(data){
	       		$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-notes.php?t_id='+$stateParams.t_id).success(function(data){
							$scope.notes = data;
						});
		       	$ionicLoading.hide();
		        $ionicLoading.show({
		            template: '<i class="icon ion-trash-a"></i> Deleted',
		            duration : 1500
		        });
	       });
	     } 
	   });
	};
	
	$scope.customer = {};
	$scope.customerFacing = function(rownum) {
		$http.get('http://www.gudhome.com/mobile/sql/sql-U-project-note-slack.php?t_id='+$stateParams.t_id+'&rownum='+rownum+'&r='+window.localStorage['pro_id']).success(function(data){
			$scope.customer = data;
			$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-eye"></i> '+$scope.customer.receivedMESSAGE,
	            duration : 1500
	        });
	        $http.get('http://www.gudhome.com/mobile/sql/sql-R-project-notes.php?t_id='+$stateParams.t_id+'&r='+window.localStorage['pro_id']).success(function(data){
							$scope.notes = data;
					});
		});
	}
	//////////////////////////////////////////////////////////
	$scope.images = [];

  var userReference = fb.child("projects/"+$stateParams.t_id);
  var syncArray = $firebaseArray(userReference.child("images"));
  $scope.images = syncArray;

  $scope.upload = function() {
      var options = {
          quality : 75,
          destinationType : Camera.DestinationType.DATA_URL,
          sourceType : Camera.PictureSourceType.CAMERA,
          allowEdit : true,
          encodingType: Camera.EncodingType.JPEG,
          popoverOptions: CameraPopoverOptions,
          targetWidth: 500,
          targetHeight: 500,
          saveToPhotoAlbum: false
      };
      $cordovaCamera.getPicture(options).then(function(imageData) {
          syncArray.$add({image: imageData}).then(function() {
              //alert("Image has been uploaded");
          });
      }, function(error) {
          console.error(error);
      });
  }
  
  $scope.photolib = function() {
      var options = {
          quality : 75,
          destinationType: Camera.DestinationType.DATA_URL,
	      	sourceType: Camera.PictureSourceType.PHOTOLIBRARY
      };
      $cordovaCamera.getPicture(options).then(function(imageData) {
          syncArray.$add({image: imageData}).then(function() {
              //alert("Image has been uploaded");
          });
      }, function(error) {
          console.error(error);
      });
  }
	
	$scope.report = {};
	$scope.reportHours = function(report, resultVarName){
		var config={params: {report:report}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-C-daily-report-project.php?t_id='+$stateParams.t_id+'&r='+window.localStorage['pro_id'], null, config).success(function(data, status, headers, config){
	      	$scope.report = data;
	      	$location.path('/app/reporthours2/'+$scope.report.receivedREPORT_ID);
        })
        .error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
	
	$scope.hours = {};
	$scope.getTexts = function(texts, resultVarName){
		var config={params: {texts:texts}};
		$http.post('http://www.gudhome.com/gudhome_phone/send_text/send_pro_timer.php?fph=7327225277&r='+window.localStorage['pro_id']+'&t_id='+$stateParams.t_id, null, config).success(function(data, status, headers, config){
	      	$scope.hours = data;
	      	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project.php?t_id='+$stateParams.t_id+'&r='+window.localStorage['pro_id']).success(function(data){
						$scope.project = data;
					});
	      	alert($scope.hours.receivedMESSAGE);
        })
        .error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
	
	$scope.pause = {};
	$scope.pause = function(){
		$http.get('http://www.gudhome.com/mobile/sql/sql-U-project-timer-pause.php?t_id='+$stateParams.t_id+'&r='+window.localStorage['pro_id']).success(function(data){
			$scope.pause = data;
			$http.get('http://www.gudhome.com/mobile/sql/sql-R-project.php?t_id='+$stateParams.t_id+'&r='+window.localStorage['pro_id']).success(function(data){
				$scope.project = data;
			});
		});
	};
	
	$scope.resume = function(){
		$http.get('http://www.gudhome.com/mobile/sql/sql-U-project-timer-pause.php?t_id='+$stateParams.t_id+'&r='+window.localStorage['pro_id']).success(function(data){
			$scope.pause = data;
			$http.get('http://www.gudhome.com/mobile/sql/sql-R-project.php?t_id='+$stateParams.t_id+'&r='+window.localStorage['pro_id']).success(function(data){
				$scope.project = data;
			});
		});
	};
	
	$scope.approveds = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-approved-proposals.php?t_id='+$stateParams.t_id).success(function(data){
		$scope.approveds = data;
	});
	
	$scope.invoices = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-invoices.php?t_id='+$stateParams.t_id).success(function(data){
		$scope.invoices = data;
	});
})

clipboardApp.controller('ProjectMediumCtrl', function($scope, $http, $stateParams, $ionicLoading, $location, $ionicPopup, $firebaseArray) {
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project.php?t_id='+$stateParams.t_id).success(function(data){
		//alert('tid'+data.PROJ_CREATE_DATE);
		$scope.project = {
			T_ID : data.T_ID,
			T_NAME : data.T_NAME,
			T_STATE_DESC : data.T_STATE_DESC,
			SERVICE_REQUEST : data.SERVICE_REQUEST,
			PROJ_CREATE_DAT : data.PROJ_CREATE_DAT,
			A_ID : data.A_ID,
			PROP_ID : data.PROP_ID,
			USER_ID : data.USER_ID,
			ADDRESS : data.ADDRESS,
			PRETTY_SENT : data.PRETTY_SENT,
			PRETTY_APPROVED : data.PRETTY_APPROVED,
			USER_FNAME : data.USER_FNAME,
			USER_LNAME : data.USER_LNAME,
			BILL : data.BILL,
			PROJ_CREATE_DATE : data.PROJ_CREATE_DATE
		}
	});
	
	$scope.note='';
	$scope.image='';
	var ref = new Firebase("https://dazzling-torch-7612.firebaseio.com/projects/"+$stateParams.t_id+"/images/"+$stateParams.image_id);
	// Attach an asynchronous callback to read the data at our posts reference
	ref.on("value", function(snapshot) {
	  //console.log(snapshot.val());
	  console.log(snapshot.val().image);
	  $scope.note = snapshot.val().note;
	  $scope.image = snapshot.val().image;
	  //alert($scope.note);
	  //$scope.$apply()
	  if(!$scope.$$phase) {
         $scope.$apply();
    }
	}, function (errorObject) {
	  console.log("The read failed: " + errorObject.code);
	});
	
	$scope.showmenote=false;
	$scope.noteForm=function() {
		$scope.showmenote=!$scope.showmenote;
	};
	
	//var usersRef = ref.child("users");
	//var noteRef = new Firebase("https://dazzling-torch-7612.firebaseio.com/projects/"+$stateParams.t_id+"/images/"+$stateParams.image_id);
	
	/*$scope.new_note = {};
	$scope.addNote = function(note, resultVarName){
		var config={params: {note:note}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-U-project-photo-note.php?t_id='+$stateParams.t_id+'&rownum='+$stateParams.rownum+'&r='+window.localStorage['pro_id'], null, config).success(function(data, status, headers, config){
	      	$scope.new_note = data;
	      	$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-checkmark-circled"></i> Updated',
	            duration : 1500
	        });
        })
        .error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};*/
	
	/*$scope.deletePhoto = function(){
	   var confirmPopup = $ionicPopup.confirm({
	     title: 'Delete Photo',
	     template: 'Are you sure you want to delete this photo?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	       $http.get('http://www.gudhome.com/mobile/sql/sql-D-project-photo.php?t_id='+$stateParams.t_id+'&rownum='+$stateParams.rownum).success(function(data){
		       	$location.path('/app/project/'+$stateParams.t_id);
		       	$ionicLoading.hide();
		        $ionicLoading.show({
		            template: '<i class="icon ion-trash-a"></i> Deleted',
		            duration : 1500
		        });
	       });
	     }
	   });
	};*/
})

clipboardApp.controller('ProjectServiceCtrl', function($scope, $http, $stateParams, $ionicLoading, $filter) {
	$scope.service = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-service.php?t_id='+$stateParams.t_id+'&rownum='+$stateParams.rownum).success(function(data){
		$scope.service = {
			A_ID : data.A_ID,
			PROP_ID : data.PROP_ID,
			ADDRESS : data.ADDRESS,
			T_ID : data.T_ID,
			T_NAME : data.T_NAME,
			ROWNUM : data.ROWNUM,
			SVC_NAME : data.SVC_NAME,
			SVC_TYPE_DESC : data.SVC_TYPE_DESC,
			SERVICE_STATE_DESC : data.SERVICE_STATE_DESC,
			SVC_CATEGORY_ID : data.SVC_CATEGORY_ID * 1,
			PRICE : data.PRICE * 1,
			SVC_UNIT : data.SVC_UNIT,
			PLACEHOLDER_COST : data.PLACEHOLDER_COST * 1,
			SVC_UNIT_COST : data.SVC_UNIT_COST * 1,
			PLACEHOLDER_QTY : data.PLACEHOLDER_QTY * 1,
			SVC_UNIT_QTY : data.SVC_UNIT_QTY * 1,
			PLACEHOLDER_TAX : data.PLACEHOLDER_TAX * 1,
			S_TAX : data.S_TAX * 1,
			CALC_MARKUP : data.CALC_MARKUP * 1,
			PLACEHOLDER_CUT : data.PLACEHOLDER_CUT * 1,
			GH_CUT : data.GH_CUT * 100,
			S_ASSIGNED_PRO:  data.S_ASSIGNED_PRO,
			PRO_FNAME :  data.PRO_FNAME,
			PRO_LNAME :  data.PRO_LNAME,
			ORG :  data.ORG,
			CREATE_DATE: data.CREATE_DATE
		}
	});
	
	$scope.gh_cost = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-service-cost.php?t_id='+$stateParams.t_id+'&rownum='+$stateParams.rownum).success(function(data){
		//alert('a' + data.SVC_CATEGORY_ID);
		$scope.gh_cost = {
			category_id : data.SVC_CATEGORY_ID * 1,
			price : data.PRICE * 1,
			unit : data.SVC_UNIT,
			unit_cost : data.SVC_UNIT_COST * 1,
			unit_qty : data.SVC_UNIT_QTY * 1,
			tax : data.S_TAX * 1,
			markup : data.CALC_MARKUP * 1,
			ghcut : data.GH_CUT * 100
		}
	});
	
	$scope.costService = function(gh_cost, resultVarName){
		var config={params: {gh_cost:gh_cost}};
		//alert('cut ' + gh_cost.ghcut);
		$http.post('http://www.gudhome.com/mobile/sql/sql-U-project-service-cost.php?t_id='+$stateParams.t_id+'&rownum='+$stateParams.rownum+'&unit_cost='+gh_cost.unit_cost+'&unit_qty='+gh_cost.unit_qty+'&markup='+gh_cost.markup+'&tax='+gh_cost.tax+'&svc_unit='+gh_cost.unit+'&price='+gh_cost.price+'&cut='+gh_cost.ghcut+'&r='+window.localStorage['pro_id'], null, config).success(function(data, status, headers, config){
					$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-service.php?t_id='+$stateParams.t_id+'&rownum='+$stateParams.rownum).success(function(data){
						$scope.service = data;
					});
	      	$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-checkmark-circled"></i> Service Costed',
	            duration : 1500
	        });
		})
		.error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
	
	$scope.changename=false;
	$scope.showName= function() {
		$scope.changename=!$scope.changename;
	};
	
	$scope.newname = {};
	$scope.changeName = function(service, resultVarName){
		var config={params: {service:service}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-U-project-service-desc.php?t_id='+$stateParams.t_id+'&rownum='+$stateParams.rownum, null, config).success(function(data, status, headers, config){
			$scope.newname = data;
			$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-service.php?t_id='+$stateParams.t_id+'&rownum='+$stateParams.rownum).success(function(data){
				$scope.service = data;
				$scope.changename=false;
				$ionicLoading.hide();
        $ionicLoading.show({
            template: '<i class="icon ion-checkmark-circled"></i> Updated name',
            duration : 1500
        });
			});	
		})
	};
	
	$scope.showmestatus=false;
	$scope.StateForm = function() {
		$scope.showmestatus=!$scope.showmestatus;
	};
	
	$scope.actions = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-service-actions.php').success(function(data){
		$scope.actions = data;
	});
	
	$scope.submitAnswer = function(stateid){
		$http.get('http://www.gudhome.com/mobile/sql/sql-U-project-service-action.php?state_id='+stateid+'&t_id='+$stateParams.t_id+'&rownum='+$stateParams.rownum+'&r='+window.localStorage['pro_id']).success(function(data){
			$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-service.php?t_id='+$stateParams.t_id+'&rownum='+$stateParams.rownum+'&r='+window.localStorage['pro_id']).success(function(data){
				$scope.service = data;
				$scope.showmestatus=false;
				$ionicLoading.hide();
		        $ionicLoading.show({
		            template: '<i class="icon ion-checkmark-circled"></i> Updated',
		            duration : 1500
		        });
			});
		});
	};
	
	$scope.visit = {};
	$scope.scheduleService = function(visit, resultVarName){
  	var appDate = $filter('date')(visit.date, "yyyy-MM-dd");
  	var appTime = $filter('date')(visit.visit_time, "HH:mm:ss");
		var config={params: {visit:visit}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-U-project-service-date.php?t_id='+$stateParams.t_id+'&rownum='+$stateParams.rownum+'&visit_date='+appDate+'&visit_time='+appTime+'&duration='+visit.visit_duration+'&r='+window.localStorage['pro_id'], null, config).success(function(data, status, headers, config){
			$scope.visit = data;
			$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-service.php?t_id='+$stateParams.t_id+'&rownum='+$stateParams.rownum).success(function(data){
				$scope.service = data;
			});
	      	$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-checkmark-circled"></i> Service Scheduled',
	            duration : 1500
	        });
		})
		.error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};

	
	
	$scope.pros = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-pros.php').success(function(data){
		$scope.pros = data;
	});
	
	$scope.pro = {};
	$scope.addPro = function(pro) {
		$http.get('http://www.gudhome.com/mobile/sql/sql-U-project-service-pro.php?t_id='+$stateParams.t_id+'&rownum='+$stateParams.rownum+'&pro_id='+pro+'&r='+window.localStorage['pro_id']).success(function(data){
			$scope.pro = data;
			$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-service.php?t_id='+$stateParams.t_id+'&rownum='+$stateParams.rownum).success(function(data){
			$scope.service = data;
			});
			$ionicLoading.hide();
	    $ionicLoading.show({
	        template: '<i class="icon ion-checkmark-circled"></i> Pro added to service',
	        duration : 1500
	    });
		});
	}
	
	$scope.reviews = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-pro-reviews.php?t_id='+$stateParams.t_id+'&rownum='+$stateParams.rownum+'&r='+window.localStorage['pro_id']).success(function(data){
		$scope.reviews = data;
	});
	
	$scope.ratings = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-ratings.php').success(function(data){
		$scope.ratings = data;
	});
	
	$scope.ratePro = function(rating, resultVarName){
		//alert('score '+rating.score);
		//alert('story '+rating.story);
		var config={params: {rating:rating}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-C-pro-rating.php?t_id='+$stateParams.t_id+'&rownum='+$stateParams.rownum+'&r='+window.localStorage['pro_id'], null, config).success(function(data, status, headers, config){
			$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-pro-reviews.php?t_id='+$stateParams.t_id+'&rownum='+$stateParams.rownum+'&r='+window.localStorage['pro_id']).success(function(data){
				$scope.reviews = data;
				$ionicLoading.hide();
		    $ionicLoading.show({
		        template: '<i class="icon ion-checkmark-circled"></i> Pro rated',
		        duration : 1500
		    });
	    });
		})
		.error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
	
})

clipboardApp.controller('ConciergeServiceCtrl', function($scope, $http, $stateParams, $ionicLoading, $filter) {
	$scope.service = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-concierge-service.php?record_id='+$stateParams.record_id).success(function(data){
		$scope.service = data;
	});
	
	$scope.states = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-states.php').success(function(data){
		$scope.states = data;
	});
	
	$scope.submitAnswer = function(stateid){
		//alert('state '+stateid);
		$http.get('http://www.gudhome.com/mobile/sql/sql-U-concierge-service-state.php?state_id='+stateid+'&record_id='+$stateParams.record_id+'&r='+window.localStorage['pro_id']).success(function(data){
			$http.get('http://www.gudhome.com/mobile/sql/sql-R-concierge-service.php?record_id='+$stateParams.record_id).success(function(data){
				$scope.service = data;
				$ionicLoading.hide();
        $ionicLoading.show({
            template: '<i class="icon ion-checkmark-circled"></i> Updated',
            duration : 1500
        });
			});
		});
	};
	
	$scope.note = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-daily-report-note.php?report_id=ec986575-2677-11e5-acff-0cc47a424dee').success(function(data){
		$scope.note = {
			note : data.NOTE
		};
	});
	
	$scope.newname = {};
	$scope.changeName = function(thename, resultVarName){
		var config={params: {thename:thename}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-U-project-service-desc.php?t_id='+$stateParams.t_id+'&rownum='+$stateParams.rownum, null, config).success(function(data, status, headers, config){
			$scope.newname = data;
			$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-service.php?t_id='+$stateParams.t_id+'&rownum='+$stateParams.rownum).success(function(data){
				$scope.service = data;
				$ionicLoading.hide();
        $ionicLoading.show({
            template: '<i class="icon ion-checkmark-circled"></i> Updated name',
            duration : 1500
        });
			});	
		})
	};
	
	$scope.scheduleService = function(visit, resultVarName){
  	var appDate = $filter('date')(visit.date, "yyyy-MM-dd");
  	alert('date '+appDate);
  	var appTime = $filter('date')(visit.visit_time, "HH:mm:ss");
  	alert('date '+appTime);
		var config={params: {visit:visit}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-U-concierge-service-date.php?record_id='+$stateParams.record_id+'&visit_date='+appDate+'&visit_time='+appTime+'&r='+window.localStorage['pro_id'], null, config).success(function(data, status, headers, config){
			$http.get('http://www.gudhome.com/mobile/sql/sql-R-concierge-service.php?record_id='+$stateParams.record_id).success(function(data){
				$scope.service = data;
			});
	      	$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-checkmark-circled"></i> Service Scheduled',
	            duration : 1500
	        });
		})
		.error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
	
})

clipboardApp.controller('InboxTextsCtrl', function($scope, $http, $stateParams, $ionicLoading, $location) {
	$scope.pros = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-pros-digits.php').success(function(data){
		$scope.pros = data;
	});
	$scope.choosePro = function(pro) {
		$location.path('/app/textpro/'+pro);
	}
	
	$scope.pro_texts =[];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-inbox-general-partner-texts.php').success(function(data){
		$scope.pro_texts = data;
	});
	
	$scope.homeowner_texts = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-inbox-general-homeowner-texts.php').success(function(data){
		$scope.homeowner_texts = data;
	});
})

clipboardApp.controller('TextProCtrl', function($scope, $http, $stateParams, $ionicLoading, $location, $ionicPlatform, $rootScope, $cordovaCamera) {
	$scope.pro = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-pro.php?tph='+$stateParams.tph).success(function(data){
		$scope.pro = data;
	});
	
	$scope.pro_texts = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-inbox-partner-texts.php?tph='+$stateParams.tph).success(function(data){
		$scope.pro_texts = data;
	});
	
	$scope.the_text = {};
	$scope.senttext=false;
	$scope.sendText = function(thetext, resultVarName){
		$ionicLoading.hide();
    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner> Working...'
    });
		var config={params: {thetext:thetext}};
		$http.post('http://www.gudhome.com/gudhome_phone/send_text/index.php?fph=7327225277&tph='+$stateParams.tph+'&r='+window.localStorage['pro_id'], null, config).success(function(data, status, headers, config){
			$scope.the_text = data;
			$scope.senttext=true;
			$http.get('http://www.gudhome.com/mobile/sql/sql-R-inbox-partner-texts.php?tph='+$stateParams.tph).success(function(data){
				$scope.pro_texts = data;
			});
			thetext.message='';
			$ionicLoading.hide();
	    $ionicLoading.show({
	        template: '<i class="icon ion-paper-airplane"></i> Text message sent',
	        duration : 1500
	    });
		})
		.error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
})

clipboardApp.controller('TextHomeownerCtrl', function($scope, $http, $stateParams, $ionicLoading, $location, $ionicPlatform, $rootScope, $cordovaCamera) {
	$scope.homeowner = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-homeowner.php?tph='+$stateParams.tph).success(function(data){
		$scope.homeowner = data;
	});
	
	$scope.homeowner_texts = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-inbox-homeowner-texts.php?tph='+$stateParams.tph).success(function(data){
		$scope.homeowner_texts = data;
	});
	
	$scope.the_text = {};
	$scope.senttext=false;
	$scope.sendText = function(thetext, resultVarName){
		$ionicLoading.hide();
    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner> Working...'
    });
		var config={params: {thetext:thetext}};
		$http.post('http://www.gudhome.com/gudhome_phone/send_text/index.php?fph=7327225277&tph='+$stateParams.tph+'&r='+window.localStorage['pro_id'], null, config).success(function(data, status, headers, config){
			$scope.the_text = data;
			$scope.senttext=true;
			$http.get('http://www.gudhome.com/mobile/sql/sql-R-inbox-homeowner-texts.php?tph='+$stateParams.tph).success(function(data){
				$scope.homeowner_texts = data;
			});
			thetext.message='';
			$ionicLoading.hide();
	    $ionicLoading.show({
	        template: '<i class="icon ion-paper-airplane"></i> Text message sent',
	        duration : 1500
	    });
		})
		.error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
})

clipboardApp.controller('ContactsCtrl', function($scope, $http, $stateParams, $ionicLoading, $location) {
	$scope.pros = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-pros.php').success(function(data){
		$scope.pros = data;
	});
	
	$scope.homeowners = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-homeowners.php').success(function(data){
		$scope.homeowners = data;
	});
})

clipboardApp.controller('AddProCtrl', function($scope, $http, $stateParams, $ionicLoading, $location, $ionicPopup) {
	$scope.stati = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-customer-stati.php').success(function(data){
		$scope.stati = data;
	});
	
	$scope.new_pro = {};
	$scope.addPro = function(theirinfo, resultVarName){
		var confirmPopup = $ionicPopup.confirm({
	     title: 'Add partner',
	     template: 'Are you sure you want to add this partner?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	     	var config={params: {theirinfo:theirinfo}};
	      $http.post('http://www.gudhome.com/mobile/sql/sql-C-pro.php?&r='+window.localStorage['pro_id'], null, config).success(function(data, status, headers, config){
					$scope.new_pro = data;
					$location.path('/app/contactpro/'+$scope.new_pro.receivedPRO_ID);
					$ionicLoading.hide();
			    $ionicLoading.show({
			        template: '<i class="icon ion-plus"></i> Partner added',
			        duration : 1500
			    });
				});
	     }
	   });
	};
})

clipboardApp.controller('ContactProCtrl', function($scope, $http, $stateParams, $ionicLoading, $location, $ionicPopup) {
	$scope.pro = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-pro.php?pro_id='+$stateParams.pro_id).success(function(data){
		$scope.pro = data;
	});
	
	$scope.phonenbrs = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-phonenbrs-pro.php?pro_id='+$stateParams.pro_id).success(function(data){
		$scope.phonenbrs = data;
	});
	
	$scope.phonetypes = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-phone-types.php').success(function(data){
		$scope.phonetypes = data;
	});
	
	$scope.place_call = {};
	$scope.openUrl = function(nbr) {
    $http.get('http://gudhome.com/gudhome_phone/place_call/index.php?tph='+nbr+'&r='+window.localStorage['pro_id']).success(function(data){
			$scope.place_call = data;
			$ionicLoading.hide();
	    $ionicLoading.show({
	        template: '<ion-spinner icon="bubbles"></ion-spinner> Connecting...',
	        duration : 15000
	    });
		});
  };
  
  $scope.new_nbr = {};
  $scope.addPhonenbr = function(phone, resultVarName){
		var confirmPopup = $ionicPopup.confirm({
	     title: 'Add phonenumber',
	     template: 'Are you sure you want to add this phonenumber?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
				var config={params: {phone:phone}};
				$http.post('http://www.gudhome.com/mobile/sql/sql-C-phonenbr-pro.php?pro_id='+$stateParams.pro_id+'&phnbr='+phone.nbr+'&phtype='+phone.thetype+'&r='+window.localStorage['pro_id'], null, config).success(function(data, status, headers, config){
					$scope.new_nbr = data;
					$http.get('http://www.gudhome.com/mobile/sql/sql-R-phonenbrs-pro.php?pro_id='+$stateParams.pro_id).success(function(data){
						$scope.phonenbrs = data;
					});
					$ionicLoading.hide();
			    $ionicLoading.show({
			        template: '<i class="icon ion-plus"></i> Phone number added',
			        duration : 1500
			    });
				});
	     }
	   });
	};
	
	$scope.emails = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-emails-pro.php?pro_id='+$stateParams.pro_id).success(function(data){
		$scope.emails = data;
	});
	
	$scope.new_email = {};
	$scope.addEmail = function(email, resultVarName){
		var confirmPopup = $ionicPopup.confirm({
	     title: 'Add email',
	     template: 'Are you sure you want to add this email?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
				var config={params: {email:email}};
				$http.post('http://www.gudhome.com/mobile/sql/sql-C-email-pro.php?pro_id='+$stateParams.pro_id+'&email='+email.address+'&r='+window.localStorage['pro_id'], null, config).success(function(data, status, headers, config){
					$scope.new_email = data;
					$http.get('http://www.gudhome.com/mobile/sql/sql-R-emails-pro.php?pro_id='+$stateParams.pro_id).success(function(data){
						$scope.emails = data;
					});
					$ionicLoading.hide();
			    $ionicLoading.show({
			        template: '<i class="icon ion-plus"></i> Email added',
			        duration : 1500
			    });
				});
	     }
	   });
	};
	
	$scope.projects = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-projects-by-pro.php?pro_id='+$stateParams.pro_id).success(function(data){
		$scope.projects = data;
	});
	
})

clipboardApp.controller('ContactHomeownerCtrl', function($scope, $http, $stateParams, $ionicLoading, $location) {
	$scope.homeowner = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-homeowner.php?a_id='+$stateParams.a_id+'&user_id='+$stateParams.user_id).success(function(data){
		$scope.homeowner = data;
	});
	
	$scope.addresses = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-addresses-homeowner.php?a_id='+$stateParams.a_id+'&user_id='+$stateParams.user_id).success(function(data){
		$scope.addresses = data;
	});
	
	$scope.phonenbrs = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-phonenbrs-homeowner.php?a_id='+$stateParams.a_id+'&user_id='+$stateParams.user_id).success(function(data){
		$scope.phonenbrs = data;
	});
	
	$scope.emails = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-emails-homeowner.php?a_id='+$stateParams.a_id+'&user_id='+$stateParams.user_id).success(function(data){
		$scope.emails = data;
	});
	
	$scope.place_call = {};
	$scope.openUrl = function(nbr) {
    $http.get('http://gudhome.com/gudhome_phone/place_call/index.php?tph='+nbr+'&r='+window.localStorage['pro_id']).success(function(data){
			$scope.place_call = data;
			$ionicLoading.hide();
	    $ionicLoading.show({
	        template: '<ion-spinner icon="bubbles"></ion-spinner> Connecting...',
	        duration : 15000
	    });
		});
  };
  
  $scope.phonetypes = [];
  $http.get('http://www.gudhome.com/mobile/sql/sql-R-phone-types.php').success(function(data){
		$scope.phonetypes = data;
	});
	
	$scope.new_nbr = {};
  $scope.addPhonenbr = function(phone, resultVarName){
		var config={params: {phone:phone}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-C-phonenbr-homeowner.php?a_id='+$stateParams.a_id+'&user_id='+$stateParams.user_id+'&phnbr='+phone.nbr+'&phtype='+phone.thetype+'&r='+window.localStorage['pro_id'], null, config).success(function(data, status, headers, config){
			$scope.new_nbr = data;
			$http.get('http://www.gudhome.com/mobile/sql/sql-R-phonenbrs-homeowner.php?a_id='+$stateParams.a_id+'&user_id='+$stateParams.user_id).success(function(data){
				$scope.phonenbrs = data;
			});
			$ionicLoading.hide();
	    $ionicLoading.show({
	        template: '<i class="icon ion-ios-chatbubble-outline"></i> '+$scope.new_nbr.receivedMESSAGE,
	        duration : 1500
	    });
		})
	};
	
	$scope.new_message = {};
  $scope.email_dashboard = function(message, resultVarName) {
		var config={params: {message:message}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-C-message-id.php?r='+window.localStorage['pro_id']+'&template_id=11&object1='+$stateParams.a_id+'&object2='+$stateParams.user_id, null, config).success(function(data, status, headers, config){
			$scope.new_message = data;
			$http.get('http://www.gudhome.com/mobile/sql/sql-C-message-add-recipients.php?r='+window.localStorage['pro_id']+'&template_id=11&a_id='+$stateParams.a_id+'&user_id='+$stateParams.user_id+'&message_id='+$scope.new_message.receivedMESSAGE_ID).success(function(data){
					$location.path('/app/dashboardemail/'+$scope.new_message.receivedMESSAGE_ID);
			});
		})
  };
  
  $scope.users = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-users.php?a_id='+$stateParams.a_id+'&user_id='+$stateParams.user_id).success(function(data){
		$scope.users = data;
	});
  
})

clipboardApp.controller('DashboardEmailCtrl', function($scope, $http, $stateParams, $ionicLoading, $ionicPopup) {
	$scope.email = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-email-dashboard.php?message_id='+$stateParams.message_id).success(function(data){
		$scope.email = data;
	});
	
	$scope.sendEmail = function() {
			//alert('a');
    	window.open('http://gudhome.com/cmm/forms/send-email.php?mid='+$stateParams.message_id, '_system', 'location=yes');
  };
	
	$scope.openUrl = function() {
			//alert('a');
    	window.open('http://gudhome.com/cmm/forms/send-email.php?mid='+$stateParams.message_id+'&preview=yes', '_system', 'location=yes');
  };
})


clipboardApp.controller('AddCustomerCtrl', function($scope, $http, $stateParams, $ionicLoading, $location) {
	$scope.stati = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-customer-stati.php').success(function(data){
		$scope.stati = data;
	});
	
	$scope.new_customer = {};
	$scope.addCustomer = function(theirinfo, resultVarName){
		var config={params: {theirinfo:theirinfo}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-C-customer.php?&r='+window.localStorage['pro_id'], null, config).success(function(data, status, headers, config){
			$scope.new_customer = data;
			$location.path('/app/contacthomeowner/'+$scope.new_customer.receivedA_ID+'/'+$scope.new_customer.receivedUSER_ID);
			$ionicLoading.hide();
	    $ionicLoading.show({
	        template: '<i class="icon ion-person-add"></i> Customer added',
	        duration : 1500
	    });
		})
		.error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
})

clipboardApp.controller('QuoteBuilderCtrl', function($scope, $http, $stateParams, $ionicLoading, $location) {
	$scope.chosen_quotes = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-message-project-quotes.php?message_id='+$stateParams.message_id).success(function(data){
		$scope.chosen_quotes = data;
	})
	
	$scope.check = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-message-project-quotes-check.php?message_id='+$stateParams.message_id).success(function(data){
		$scope.check = data;
	})
	
	$scope.addresses = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-addresses.php').success(function(data){
		$scope.addresses = data;
	})
	
	$scope.quotes = [];
	$scope.showmeproj=false;
	$scope.pickProperty = function(a_id, prop_id) {
		$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-quotes.php?r='+window.localStorage['pro_id']+'&a_id='+a_id+'&prop_id='+prop_id).success(function(data){
			$scope.quotes = data;
			$scope.showmeproj=true;
		});
	};
	
	$scope.new_quote = {};
	$scope.chosen_quotes ={};
	$scope.addToMessage = function(t_id) {
		$http.get('http://www.gudhome.com/mobile/sql/sql-C-message-project.php?r='+window.localStorage['pro_id']+'&message_id='+$stateParams.message_id+'&t_id='+t_id).success(function(data){
			$scope.new_quote = data;
			$http.get('http://www.gudhome.com/mobile/sql/sql-R-message-project-quotes.php?message_id='+$stateParams.message_id).success(function(data){
				$scope.chosen_quotes = data;
			})
			$http.get('http://www.gudhome.com/mobile/sql/sql-R-message-project-quotes-check.php?message_id='+$stateParams.message_id).success(function(data){
				$scope.check = data;
			})
		});
	};
	
	$scope.remove = function(t_id) {
		$http.get('http://www.gudhome.com/mobile/sql/sql-D-message-project.php?r='+window.localStorage['pro_id']+'&message_id='+$stateParams.message_id+'&t_id='+t_id).success(function(data){
			$scope.new_quote = data;
			$http.get('http://www.gudhome.com/mobile/sql/sql-R-message-project-quotes.php?message_id='+$stateParams.message_id).success(function(data){
				$scope.chosen_quotes = data;
			})
			$http.get('http://www.gudhome.com/mobile/sql/sql-R-message-project-quotes-check.php?message_id='+$stateParams.message_id).success(function(data){
				$scope.check = data;
			})
		});
	};
	
	$scope.recipients = [];
	$scope.previewMessage = function(message_id) {
		$http.get('http://www.gudhome.com/mobile/sql/sql-C-message-default-recipients.php?message_id='+$stateParams.message_id+'&r='+window.localStorage['pro_id']).success(function(data){
			$scope.recipients = data;
			$location.path('/app/previewmessage/'+$stateParams.message_id);
		})
	}
	
})

clipboardApp.controller('PreviewMessageCtrl', function($scope, $http, $stateParams, $ionicLoading, $location ,$ionicPopup) {
	$scope.recipients = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-message-recipients.php?message_id='+$stateParams.message_id).success(function(data){
		$scope.recipients = data;
	})
	
	$scope.digits = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-message-recipients-phonenbrs.php?message_id='+$stateParams.message_id).success(function(data){
		$scope.digits = data;
	})
	
	$scope.honumber = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-homeowner-primary-number.php?message_id='+$stateParams.message_id).success(function(data){
		$scope.honumber = data;
	})
	
	$scope.message = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-quotes.php?r='+window.localStorage['pro_id']+'&message_id='+$stateParams.message_id).success(function(data){
			$scope.message = data;
	})
  
  $scope.delete_recipient = {};
	$scope.removeRecipient = function(rownum){
		var confirmPopup = $ionicPopup.confirm({
	     title: 'Remove recipient',
	     template: 'Are you sure you want to remove this recipient?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	      $http.get('http://www.gudhome.com/mobile/sql/sql-D-message-recipient.php?&r='+window.localStorage['pro_id']+'&message_id='+$stateParams.message_id+'&rownum='+rownum).success(function(data){
					$scope.delete_recipient = data;
					$http.get('http://www.gudhome.com/mobile/sql/sql-R-message-recipients.php?message_id='+$stateParams.message_id).success(function(data){
						$scope.recipients = data;
					})
					$http.get('http://www.gudhome.com/mobile/sql/sql-R-message-recipients-phonenbrs.php?message_id='+$stateParams.message_id).success(function(data){
						$scope.digits = data;
					})
					$ionicLoading.hide();
			    $ionicLoading.show({
			        template: '<i class="icon ion-ios-minus"></i> Recipient removed',
			        duration : 1500
			    });
				});
	     } 
	   });
	};
  
  $scope.the_text = {};
	$scope.senttext=false;
	$scope.sendText = function(thetext, resultVarName){
    var confirmPopup = $ionicPopup.confirm({
	     title: 'Send text',
	     template: 'Are you sure you want to sent this text?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	     	$ionicLoading.hide();
		    $ionicLoading.show({
		        template: '<ion-spinner icon="bubbles"></ion-spinner> Working...'
		    });
	     var config={params: {thetext:thetext}};
				$http.post('http://www.gudhome.com/gudhome_phone/send_text/send_quote.php?fph=7327225277&message_id='+$stateParams.message_id+'&r='+window.localStorage['pro_id'], null, config).success(function(data, status, headers, config){
					$scope.the_text = data;
					$scope.senttext=true;
					$ionicLoading.hide();
			    $ionicLoading.show({
			        template: '<i class="icon ion-paper-airplane"></i> Text message sent',
			        duration : 1500
			    });
				})
	     }
	   });
	};
	
	$scope.openUrl = function() {
    	window.open('http://gudhome.com/mygudhome/proposal.php?message_id='+$stateParams.message_id, '_system', 'location=yes');
  };
	
})

clipboardApp.factory('AuthService', function($rootScope) {
  var loggedIn=false; //change this back once localstorage issue is solved
  //var loggedIn=true;
  return {
    checkLogin : function() {
      //alert('pro name '+window.localStorage['pro_name']);
      if (window.localStorage['pro_name'] != null) {
      	loggedIn=true;
      	//alert(loggedIn);
      };
      $rootScope.$broadcast('loggedIn', { 'loggedIn' : loggedIn });
      return loggedIn;
    },
    login : function() {
      loggedIn = true;
      $rootScope.$broadcast('loggedIn', { 'loggedIn' : loggedIn });
    }  
  }
})

clipboardApp.controller('InvoicingApprovedCtrl', function($scope, $http) {
	$scope.approved = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-invoicing-approved.php').success(function(data){
		$scope.approved = data;
	});
})

clipboardApp.controller('ProposalCtrl', function($scope, $http, $stateParams, $ionicLoading, $ionicPopup) {
	$scope.projects = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-message-projects.php?message_id='+$stateParams.message_id).success(function(data){
		$scope.projects = data;
	});
	
	$scope.ttl_bill = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-message-projects-ttl-bill.php?message_id='+$stateParams.message_id).success(function(data){
		$scope.ttl_bill = data;
	});
	
	$scope.openUrl = function(message_id) {
  	window.open('http://gudhome.com/mygudhome/proposal.php?message_id='+message_id, '_system', 'location=yes');
  };
  
  $scope.proposal = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-proposal.php?message_id='+$stateParams.message_id).success(function(data){
		$scope.proposal = data;
	});
	
	$scope.invoices = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-invoice-installments.php?message_id='+$stateParams.message_id).success(function(data){
		$scope.invoices = data;
	});
	
	$scope.new_invoice = {};
	$scope.createInvoice = function(proposal, resultVarName){ 
    var confirmPopup = $ionicPopup.confirm({
	     title: 'Send to invoicing',
	     template: 'Are you sure you want to sent this proposal to invoicing?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	     var config={params: {proposal:proposal}}; //this is also where invoice_message_id is created with associated recipients
				$http.post('http://www.gudhome.com/mobile/sql/sql-C-invoice-id.php?message_id='+$stateParams.message_id+'&installment='+proposal.installment+'&installment_count='+proposal.count+'&r='+window.localStorage['pro_id'], null, config).success(function(data, status, headers, config){
					$scope.new_invoice = data;
					$http.get('http://www.gudhome.com/mobile/sql/sql-R-proposal.php?message_id='+$stateParams.message_id).success(function(data){
						$scope.proposal = data;
					});
					$http.get('http://www.gudhome.com/mobile/sql/sql-R-invoice-installments.php?message_id='+$stateParams.message_id).success(function(data){
						$scope.invoices = data;
					});
					$ionicLoading.hide();
			    $ionicLoading.show({
			        template: '<i class="icon ion-checkmark-circled"></i> Invoice created',
			        duration : 1500
			    });
				})
	     }
	   });
	};
	
	
  

})

clipboardApp.controller('InvoiceCtrl', function($scope, $http, $stateParams, $ionicLoading, $ionicPopup) {
	$scope.invoice = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-invoice-installment.php?invoice_id='+$stateParams.invoice_id+'&installment_id='+$stateParams.installment_id).success(function(data){
		$scope.invoice = data;
	});
	
	$scope.openInvoiceUrl = function(passwd) {
  	window.open('https://gudhome.com/cmm/invoice.php?invoice='+$stateParams.invoice_id+'&installment='+$stateParams.installment_id+'&pass='+passwd, '_system', 'location=yes');
  };
  
  $scope.refreshEmail = function() {
		var confirmPopup = $ionicPopup.confirm({
	     title: 'Send invoice',
	     template: 'Are you sure you want to send another invoice?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
		     $http.get('http://www.gudhome.com/mobile/sql/sql-U-invoice_message.php?invoice_id='+$stateParams.invoice_id+'&installment_id='+$stateParams.installment_id+'&r='+window.localStorage['pro_id']).success(function(data){
		     		$http.get('http://www.gudhome.com/mobile/sql/sql-R-invoice-installment.php?invoice_id='+$stateParams.invoice_id+'&installment_id='+$stateParams.installment_id).success(function(data){
							$scope.invoice = data;
						});
		     		$http.get('http://www.gudhome.com/mobile/sql/sql-R-message-recipients.php?invoice_id='+$stateParams.invoice_id+'&installment_id='+$stateParams.installment_id).success(function(data){
							$scope.recipients = data;
						});
						$ionicLoading.hide();
				    $ionicLoading.show({
				        template: '<i class="icon ion-paper-airplane"></i> Updated',
				        duration : 1500
				    });
				})
	     }
	   });
  };
  
  $scope.recipients = {};
  $http.get('http://www.gudhome.com/mobile/sql/sql-R-message-recipients.php?invoice_id='+$stateParams.invoice_id+'&installment_id='+$stateParams.installment_id).success(function(data){
		$scope.recipients = data;
	});
	
	$scope.delete_recipient = {};
	$scope.removeRecipient = function(rownum, message_id){
		var confirmPopup = $ionicPopup.confirm({
	     title: 'Remove recipient',
	     template: 'Are you sure you want to remove this recipient?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	      $http.get('http://www.gudhome.com/mobile/sql/sql-D-message-recipient.php?&r='+window.localStorage['pro_id']+'&message_id='+message_id+'&rownum='+rownum).success(function(data){
					$scope.delete_recipient = data;
					$http.get('http://www.gudhome.com/mobile/sql/sql-R-message-recipients.php?invoice_id='+$stateParams.invoice_id+'&installment_id='+$stateParams.installment_id).success(function(data){
						$scope.recipients = data;
					});
					$ionicLoading.hide();
			    $ionicLoading.show({
			        template: '<i class="icon ion-ios-minus"></i> Recipient removed',
			        duration : 1500
			    });
				});
	     } 
	   });
	};
	
	
	$scope.message = {};
	$scope.sendInvoice = function(message_id) {
		var confirmPopup = $ionicPopup.confirm({
	     title: 'Send invoice',
	     template: 'Are you sure you want to sent this invoice?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
		     $http.get('http://gudhome.com/cmm/forms/send-email.php?r='+window.localStorage['pro_id']+'&mid='+message_id).success(function(data){
						$scope.message = data;
						$ionicLoading.hide();
				    $ionicLoading.show({
				        template: '<i class="icon ion-paper-airplane"></i> Quote sent',
				        duration : 1500
				    });
				})
	     }
	   });
  };
})

clipboardApp.controller('CalendarCtrl', function($scope, $http, $stateParams, $ionicLoading, $ionicPopup) {
	$scope.homechecks = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-calendar-homechecks.php').success(function(data){
		$scope.homechecks = data;
	});
})

clipboardApp.controller('TodoCtrl', function($scope, $http, $stateParams, $ionicLoading, $ionicPopup, $filter, $location) {
	//alert('todo id '+$stateParams.todo_id);
	$scope.todo = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-todo.php?todo_id='+$stateParams.todo_id).success(function(data){
		$scope.todo = {
			TODO_DESC : data.TODO_DESC,
			TODO_ID : data.TODO_ID,
			A_ID : data.A_ID,
			PROP_ID : data.PROP_ID,
			ADDRESS : data.ADDRESS,
			T_ID : data.T_ID,
			T_NAME : data.T_NAME
		};
	});
	
	$scope.showmeedit=false;
	$scope.editTodoShow = function() {
		//alert('a'+$scope.showmeedit);
		$scope.showmeedit=!$scope.showmeedit
	};
	
	/*$scope.note = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-todo-desc.php?todo_id='+$stateParams.todo_id).success(function(data){
		//alert('note ' + data.NOTE);
		$scope.note = {
			note : data.TODO_DESC
		};
	});*/
	
	$scope.new_note ={};
	$scope.editTodo = function(note, resultVarName){
		$ionicLoading.hide();
    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner> Working...'
    });
		var config={params: {note:note}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-U-project-todo-desc.php?todo_id='+$stateParams.todo_id, null, config).success(function(data, status, headers, config){
	      	//alert('note '+data.TODO_DESC);
	      	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-todo.php?todo_id='+$stateParams.todo_id).success(function(data){
						$scope.todo = data;
					});
	      	$scope.showmeedit=false;
	      	$ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-checkmark-circled"></i> Updated',
	            duration : 1500
	        });
        })
        .error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
	
	$scope.showmesnooze=false;
	$scope.showSnooze = function() {
		$scope.showmesnooze=!$scope.showmesnooze
	};
	
	
	$scope.snooze = {};
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-todo-date.php').success(function(data){
		//alert('MONTH - 1' + data.THEMONTH);
		//alert('DAY ' + data.THEDAY);
		var theDate = $filter('date')(data.SNOOZED_UNTIL, "yyyy-MM-dd");
		//alert('DATE2 ' + theDate);
		$scope.snooze = {
			//date : theDate
			date: new Date(data.THEYEAR,data.THEMONTH,data.THEDAY)
		};
		//alert ('date '+$scope.snooze.date);
	});
	
	$scope.snoozeTodo = function(snooze, resultVarName){
  	var appDate = $filter('date')(snooze.date, "yyyy-MM-dd");
  	//alert('date ' +appDate);
		var config={params: {snooze:snooze}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-U-project-todo-date.php?todo_id='+$stateParams.todo_id+'&snooze_date='+appDate+'&r='+window.localStorage['pro_id'], null, config).success(function(data, status, headers, config){
			//alert('t id '+data.T_ID);
			$location.path('/app/todo/'+data.NEXT_TO_DO);
			$ionicLoading.hide();
	    $ionicLoading.show({
	        template: '<i class="icon ion-android-cloud-circle"></i> Snoozed until '+appDate,
	        duration : 1500
	    });
		})
		.error(function (data, status, headers, config)
        {
          $scope[resultVarName] = "SUBMIT ERROR";
        });
	};
	
	$scope.closeTodo = function() {
		var confirmPopup = $ionicPopup.confirm({
	     title: 'Close todo',
	     template: 'Are you sure you want to close this todo?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
		     $http.get('http://www.gudhome.com/mobile/sql/sql-U-project-todo-close.php?todo_id='+$stateParams.todo_id+'&r='+window.localStorage['pro_id']).success(function(data){
						$location.path('/app/project/'+data.T_ID);
						$ionicLoading.hide();
				    $ionicLoading.show({
				        template: '<i class="icon ion-checkmark-circled"></i> Closed ',
				        duration : 1500
				    });
				})
	     }
	   });
  };
  
  $scope.nextTodo = function(nexttodoid){
  	$http.get('http://www.gudhome.com/mobile/sql/sql-U-project-todo-next-day.php?todo_id='+$stateParams.todo_id).success(function(data){
			$location.path('/app/todo/'+nexttodoid);
		})
	};	

})

clipboardApp.controller('TodosCtrl', function($scope, $http, $stateParams, $ionicLoading, $ionicPopup) {
	$scope.todos = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-todos-all.php?r='+window.localStorage['pro_id']).success(function(data){
		$scope.todos = data;
	});
	
	$scope.projects = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-projects-no-todo.php?r='+window.localStorage['pro_id']).success(function(data){
		$scope.projects = data;
	});
	
	$scope.snoozeds = [];
	$http.get('http://www.gudhome.com/mobile/sql/sql-R-project-todos-all-snoozed.php?r='+window.localStorage['pro_id']).success(function(data){
		$scope.snoozeds = data;
	});
})

clipboardApp.controller('AppCtrl', function($scope, $http, $ionicModal, $timeout, $ionicLoading, AuthService, $location) {
	
  var fbAuth = fb.getAuth();
  
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

	$scope.pro_name=window.localStorage['pro_name'];
	/*if ($scope.pro_name != null) {
		$scope.modal.show();
	};*/
	
	$scope.login_feedback = '';
	$scope.theLogin = function(loginData, resultVarName){
		var config={params: {loginData:loginData}};
		//alert('email '+loginData.email);
		//alert('password '+loginData.password);
		$http.post('http://www.gudhome.com/mobile/sql/sql-R-login.php', null, config).success(function(data, status, headers, config){
	  	$scope.login = data;
	    window.localStorage['pro_name'] = $scope.login.receivedPRO_FNAME;
			$scope.pro_name=$scope.login.receivedPRO_FNAME;
			window.localStorage['pro_id'] = $scope.login.receivedPRO_ID;
	    var pro_name = window.localStorage['pro_name'] || 'you';
			var pro_id = window.localStorage['pro_id'] || 'NA';
			//alert('pro name '+$scope.login.receivedPRO_FNAME.length);
			//alert('pro name '+$scope.login.receivedPRO_FNAME);
			if($scope.login.receivedPRO_FNAME) {
				$timeout(function() {
			    $scope.closeLogin();
			  }, 1000);
			  $ionicLoading.show({
            template: '<i class="icon ion-unlocked"></i> Welcome, '+$scope.login.receivedPRO_FNAME,
            duration : 1000
        });
			} else {
				$scope.login_feedback = 'Login credentials not recognized. Please try again.';
			}
    })
    .error(function (data, status, headers, config)
    {
      //alert('error');
    });
	};
	
	$scope.$on('loggedIn', function(event,message) {   
	    if(message.loggedIn === true) {
	      console.log('LOGGED IN!');
	      //alert('LOGGED IN!');
	      $scope.modal.hide();
	      $ionicLoading.hide();
	        $ionicLoading.show({
	            template: '<i class="icon ion-unlocked"></i> Welcome, '+window.localStorage['pro_name'],
	            duration : 1000
	        });
	    } else{
	      console.log('NOT LOGGED IN!');
	      //alert('NOT LOGGED IN!');
	      $scope.modal.show();
	    }
	  });
	
	$timeout( function() {
		//alert('timeout');
    	AuthService.checkLogin();
  	}, 500);
	
  ///////////
  
  $scope.reportHours = function() {
    //alert('pro id ' + window.localStorage['pro_id']);
    $location.path('/app/reporthours');
  };
  
  $scope.new_message = {};
  $scope.buildQuote = function(message, resultVarName) {
		var config={params: {message:message}};
		$http.post('http://www.gudhome.com/mobile/sql/sql-C-message-id.php?r='+window.localStorage['pro_id']+'&template_id=3', null, config).success(function(data, status, headers, config){
			$scope.new_message = data;
			$location.path('/app/quotebuilder/'+$scope.new_message.receivedMESSAGE_ID);
		})
  };
})

