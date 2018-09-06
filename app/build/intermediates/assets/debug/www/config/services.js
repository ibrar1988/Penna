(function () {
    var pennaApp = angular.module('pennaApp');
    pennaApp.service('mobile', function ($uibModalStack,$location) {
    	var chooseImage = function(cb,quality,targetHeight,targetWidth){
            if(!quality) quality =100;
            if(!targetHeight) targetHeight = 200;
            if(!targetWidth) targetWidth = 200;
            document.addEventListener("deviceready", onDeviceReady, false);
            function onDeviceReady() {
                var captureOptions = {
                    quality: quality,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: targetHeight,
                    targetHeight: targetWidth,
                    saveToPhotoAlbum: false
                };                    
                navigator.camera.getPicture(captureImageSuccess,captureImageFailure,captureOptions);
            }
            function captureImageSuccess(imageData){
                if(cb)cb('data:image/png;base64,'+imageData)
            }
            function captureImageFailure(err){
                console.log("CAPTURE IMAGE FAIL ::::::::::::::::::::::::: "+err)
            }
        }
        var getBase64 = function(id,cb) {
            var canvas = document.getElementById("canvas");
            var img = new Image();
            img.setAttribute('crossOrigin', 'anonymous');
            img.src = document.getElementById(id).src;    
            canvas.width = img.width;
            canvas.height = img.width;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            cb(canvas.toDataURL())
        }
        var convertImgToDataURLviaCanvas =  function(url, callback, outputFormat){
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function(){
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                var dataURL;
                canvas.height = this.height;
                canvas.width = this.width;
                ctx.drawImage(this, 0, 0);
                dataURL = canvas.toDataURL(outputFormat);
                callback(dataURL);
                canvas = null; 
            };
            img.src = url;
            img.setAttribute('crossOrigin', 'anonymous');
        }

        var checkConnection = function(cb){
            document.addEventListener("deviceready", onDeviceReady, false);
            function onDeviceReady(){
                if(navigator.connection.type == 'none'){
                     if(cb)cb(false);
                }else{
                   if(cb)cb(true);
                }
            }
        }

        var dismissModel = function(){
            $uibModalStack.dismissAll();
        }

        var backbuttonCount = 0;

        var backButton = function(){
            document.addEventListener("deviceready", onDeviceReady, false);
                function onDeviceReady() {
                    document.addEventListener("backbutton", function(e) {
                        if(document.getElementsByClassName('modal').length>0){
                            e.preventDefault();
                            e.stopPropagation();
                            $uibModalStack.dismissAll();
                        }else{
                            window.history.back();
                        }
                        // mobile.backbuttonCount += 1;
                        // if(mobile.backbuttonCount==2){
                        //     navigator.app.exitApp();
                        // }
                        // $timeout(function(){
                        //     mobile.backbuttonCount = 0;
                        // }, 1500);
                }, false );
            }
        }
        var print = function(data){
            document.addEventListener("deviceready", onDeviceReady, false);
            function onDeviceReady() {
                window.plugin.printer.print(data);
            }
        }
    	return{
    		chooseImage : chooseImage,
            checkConnection : checkConnection,
            getBase64 : getBase64,
            convertImgToDataURLviaCanvas : convertImgToDataURLviaCanvas,
            dismissModel: dismissModel,
            backButton: backButton,
            backbuttonCount: backbuttonCount,
            print : print

    	}
    });
}());