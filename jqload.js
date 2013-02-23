
var callback = null; 
var timeouthandler = null; var timeout = 2000;
var one = function( counter) { 
	if ( counter-- < 0) return console.log( 'failed');
	callback = function() { clearTimeout( timeouthandler); callback = null; onload(); }
	var timeouthandler = setTimeout( function() { callback = null; eval( one)( counter); }, timeout);
	var script = document.createElement( "script");
	script.src = 'requireme.js';
	var head = document.getElementsByTagName("head")[0];    
	head.appendChild( script);
}
eval( one)( 5);


