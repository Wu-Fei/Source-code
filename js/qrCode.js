
function captureQRCode(okFunc, errFunc) {
	cordova.plugins.barcodeScanner.scan(okFunc, errFunc);
};
