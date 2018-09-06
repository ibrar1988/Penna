// create the module and name it scotchApp
// also include ngRoute for all our routing needs
var pennaApp = angular.module('pennaApp');

// // create the controller and inject Angular's $scope
// pennaApp.controller('mainController', function ($scope, $rootScope) {
//     // create a message to display in our view
//     $scope.message = 'Everyone come and see how good I look!';
//     $rootScope.$on('$stateChangeSuccess', function () {
//         document.body.scrollTop = document.documentElement.scrollTop = 0;
//     });
// });


pennaApp.controller('aboutController', function ($scope) {
    $scope.message = 'Look! I am an about page.';
});

pennaApp.controller('contactController', function ($scope) {
    $scope.message = 'Contact us! JK. This is just a demo.';
});

pennaApp.run(function ($state, $rootScope) {
    $rootScope.$state = $state;
})

//Modal for Add family Members details 
angular.module('pennaApp').controller('ModalCtrl', function ($scope, $uibModal, $log, ctrlComm) {

    $scope.dateOptions = ctrlComm.get('dateOptions');
    $scope.marital = [{name:'Married'},{name:'Unmarried'}];


    $scope.animationsEnabled = true;
    $scope.tempdatafamily = [];
    $scope.tempdatapatner = [];
    $scope.tempdatabilladd = [];


    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };
});




//MODAL FOR ADDING BANK ACCOUNT
angular.module('pennaApp').controller('bankAccount', function ($scope, $uibModal, $log) {

    $scope.animationsEnabled = true;

    $scope.openbank = function (size) {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'addbankDet.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };

});

//MODAL FOR CONFIRM SAVE CHANGES profile over all save
angular.module('pennaApp').controller('saveChange', function ($scope, $rootScope, $uibModal, $log) {

    $scope.animationsEnabled = true;

    $scope.open = function (size) {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'savechangepop.html',
            controller: 'ModalSavechangeCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };

});



angular.module('pennaApp').controller('addOrders', function ($scope, $uibModal, $log) {

    $scope.animationsEnabled = true;

    $scope.open = function (size) {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'orderstat-modal.html',
            controller: 'addOrdersCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };

});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

angular.module('pennaApp').controller('addOrdersCtrl', function ($scope, $uibModalInstance, items) {

    $scope.ok = function () {
        $uibModalInstance.close('ok');
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})



//package com.android.plugins;
//
//import android.os.Build;
//
//import org.apache.cordova.CallbackContext;
//import org.apache.cordova.CordovaPlugin;
//import org.json.JSONArray;
//import org.json.JSONException;
//import org.json.JSONObject;
//
///**
// * Created by JasonYang on 2016/3/11.
// */
//public class Permissions extends CordovaPlugin {
//
//    private static final String ACTION_HAS_PERMISSION = "hasPermission";
//    private static final String ACTION_REQUEST_PERMISSION = "requestPermission";
//    private static final String ACTION_REQUEST_PERMISSIONS = "requestPermissions";
//
//    private static final int REQUEST_CODE_ENABLE_PERMISSION = 55433;
//
//    private static final String KEY_ERROR = "error";
//    private static final String KEY_MESSAGE = "message";
//
//    private CallbackContext permissionsCallback;
//
//    @Override
//    public boolean execute(String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
//        if (ACTION_HAS_PERMISSION.equals(action)) {
//            cordova.getThreadPool().execute(new Runnable() {
//                @Override
//				public void run() {
//                    hasPermissionAction(callbackContext, args);
//                }
//            });
//            return true;
//        } else if (ACTION_REQUEST_PERMISSION.equals(action) || ACTION_REQUEST_PERMISSIONS.equals(action)) {
//            cordova.getThreadPool().execute(new Runnable() {
//                @Override
//				public void run() {
//                    try {
//                        requestPermissionAction(callbackContext, args);
//                    } catch (Exception e) {
//                        e.printStackTrace();
//                        JSONObject returnObj = new JSONObject();
//                        addProperty(returnObj, KEY_ERROR, ACTION_REQUEST_PERMISSION);
//                        addProperty(returnObj, KEY_MESSAGE, "Request permission has been denied.");
//                        callbackContext.error(returnObj);
//                        permissionsCallback = null;
//                    }
//                }
//            });
//            return true;
//        }
//        return false;
//    }
//
//    @Override
//    public void onRequestPermissionResult(int requestCode, String[] permissions, int[] grantResults) throws JSONException {
//        if (permissionsCallback == null) {
//            return;
//        }
//
//        JSONObject returnObj = new JSONObject();
//        if (permissions != null && permissions.length > 0) {
//            //Call hasPermission again to verify
//            boolean hasAllPermissions = hasAllPermissions(permissions);
//            addProperty(returnObj, ACTION_HAS_PERMISSION, hasAllPermissions);
//            permissionsCallback.success(returnObj);
//        } else {
//            addProperty(returnObj, KEY_ERROR, ACTION_REQUEST_PERMISSION);
//            addProperty(returnObj, KEY_MESSAGE, "Unknown error.");
//            permissionsCallback.error(returnObj);
//        }
//        permissionsCallback = null;
//    }
//
//    private void hasPermissionAction(CallbackContext callbackContext, JSONArray permission) {
//        if (permission == null || permission.length() == 0 || permission.length() > 1) {
//            JSONObject returnObj = new JSONObject();
//            addProperty(returnObj, KEY_ERROR, ACTION_HAS_PERMISSION);
//            addProperty(returnObj, KEY_MESSAGE, "One time one permission only.");
//            callbackContext.error(returnObj);
//        } else if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
//            JSONObject returnObj = new JSONObject();
//            addProperty(returnObj, ACTION_HAS_PERMISSION, true);
//            callbackContext.success(returnObj);
//        } else {
//            try {
//                JSONObject returnObj = new JSONObject();
//                addProperty(returnObj, ACTION_HAS_PERMISSION, cordova.hasPermission(permission.getString(0)));
//                callbackContext.success(returnObj);
//            } catch (JSONException e) {
//                e.printStackTrace();
//            }
//        }
//    }
//
//    private void requestPermissionAction(CallbackContext callbackContext, JSONArray permissions) throws Exception {
//        if (permissions == null || permissions.length() == 0) {
//            JSONObject returnObj = new JSONObject();
//            addProperty(returnObj, KEY_ERROR, ACTION_REQUEST_PERMISSION);
//            addProperty(returnObj, KEY_MESSAGE, "At least one permission.");
//            callbackContext.error(returnObj);
//        } else if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
//            JSONObject returnObj = new JSONObject();
//            addProperty(returnObj, ACTION_HAS_PERMISSION, true);
//            callbackContext.success(returnObj);
//        } else if (hasAllPermissions(permissions)) {
//            JSONObject returnObj = new JSONObject();
//            addProperty(returnObj, ACTION_HAS_PERMISSION, true);
//            callbackContext.success(returnObj);
//        } else {
//            permissionsCallback = callbackContext;
//            String[] permissionArray = getPermissions(permissions);
//            cordova.requestPermissions(this, REQUEST_CODE_ENABLE_PERMISSION, permissionArray);
//        }
//    }
//
//    private String[] getPermissions(JSONArray permissions) {
//        String[] stringArray = new String[permissions.length()];
//        for (int i = 0; i < permissions.length(); i++) {
//            try {
//                stringArray[i] = permissions.getString(i);
//            } catch (JSONException ignored) {
//                //Believe exception only occurs when adding duplicate keys, so just ignore it
//            }
//        }
//        return stringArray;
//    }
//
//    private boolean hasAllPermissions(JSONArray permissions) throws JSONException {
//        return hasAllPermissions(getPermissions(permissions));
//    }
//
//    private boolean hasAllPermissions(String[] permissions) throws JSONException {
//
//        for (String permission : permissions) {
//            if(!cordova.hasPermission(permission)) {
//                return false;
//            }
//        }
//
//        return true;
//    }
//
//    private void addProperty(JSONObject obj, String key, Object value) {
//        try {
//            if (value == null) {
//                obj.put(key, JSONObject.NULL);
//            } else {
//                obj.put(key, value);
//            }
//        } catch (JSONException ignored) {
//            //Believe exception only occurs when adding duplicate keys, so just ignore it
//        }
//    }
//}
