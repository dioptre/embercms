// phantomjs test script
// opens url and reports time to load
// requires an active internet connection
var page = require('webpage').create()
var system = require('system')
var t = Date.now()
var address, pathname

phantom.page.injectJs( 'inject.js');
console.log("AHAHAAH");
address = system.args[1]
pathname = system.args[2]
console.log("AHAHAAH2");
phantom.onError = function(msg, stack) {
  console.log("FATAL ERROR!\nMessage: " + msg + "\nStack: " + JSON.stringify(stack));
  phantom.exit(1);
}
console.log("AHAHAAH3");
page.onError = function(msg, trace) {
    var msgStack = ['ERROR: ' + msg];
    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
        });
    }
    console.error(msgStack.join('\n'));
};
console.log(JSON.stringify(phantom.version))
page.open(address, function(status){
console.log("ASDASD7");
	if (status == "success") {

		setTimeout(function () {
console.log("JJJJas")
			page.render(pathname, function(){
console.log("ASDASD8");
				phantom.exit();
			});
		}, 30000);
		setTimeout(function () {
			phantom.exit();
		}, 40000);
	}
	else {
console.log("error", status)
		phantom.exit();
	}

});

