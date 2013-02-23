// assumes that the environment has already been set
//$.ioutils.nolog = true
//$.ioutils.jsonsession = true;
//$.io.atoms = {};
// setup
var L; var SETUP; var IP = $.io.bip;
var THRU = 100;
L = [ 1, 2, 3, 5, 7, 10]; $.mathShuffle( L); var STREAMS = L[ 0];
//STREAMS = 2;
L = [ 500, 1000, 2000, 3000, 5000, 10000, 20000, 50000, 100000]; $.mathShuffle( L); var CHUNKSIZE = L[ 0];
//CHUNKSIZE = 5000;
L = $.ttl( 'pull,push,push.worker'); $.mathShuffle( L); var METHOD = L[ 0];
//METHOD = 'push.worker';
L = $.ttl( 'worker.pass.by.copy,worker.pass.by.ref'); $.mathShuffle( L); var WORKER = L[ 0];
L = $.ttl( '1,2,3,5,7,10,15,20,30,40'); $.mathShuffle( L); var LASTPOS = L[ 0];
LASTPOS = 100;
SETUP = { streams: STREAMS, chunksize: CHUNKSIZE, method: METHOD, worker: WORKER, lastpos: LASTPOS};
// working parameters
var TIMESTAMP = $.iotime(); var LASTIME = null; var TIMEGAPS = [];	// [ time gap, time gap, ...]
var SOURCES = [];
var BUFFER = {}; var BUFFERPOS = 0;
var ms; var buffer; var $BOX; var $STATUS; var $STATUS2; var $SETUP; var COUNTDOWN = 15;
function again() { window.location.reload( true); } //{ window.location = $.rurl( $.io.burl, 20); again(); }
function results() { 
	var took = $.iotime( TIMESTAMP);
	var thru = Math.round( 0.000001 * ( ( TIMEGAPS.length * CHUNKSIZE * 8) / ( 0.001 * took)));
	$STATUS.append( ' <span>done(throughput:<strong>' + thru + '</strong>Mbps)</span>')
	.find( 'span').css({ 'font-size': $.io.defs.fonts.small})
	$.jsonload( 'actions.php', { action: 'stats', took: took, setup: $.h2json( SETUP, true), timegaps: $.h2json( TIMEGAPS, true)}, function( json) { 
		$( 'body').stopTime().oneTime( '5s', function() { again(); })
	})
	
}
function countdown() { $BOX.stopTime().oneTime( '1s', function() { 
	if ( COUNTDOWN-- <= 0) return results();
	$STATUS2.empty().append( '' + COUNTDOWN);
	countdown();
})}
function ready() { 
	console.log( 'ready() entered');
	$BOX = $( 'body').ioover().css({ left: '-10px', width: '5px'})
	$STATUS = $( 'body').ioover({ position: 'absolute', bottom: '50%', left: '3px', 'font-size': $.io.defs.fonts.huge})
	$STATUS2 = $( 'body').ioover({ position: 'absolute', top: '50%', left: '3px', 'font-size': $.io.defs.fonts.big})
	$SETUP = $( 'body').ioover({ position: 'absolute', top: '5px', left: '5px', 'font-size': $.io.defs.fonts.normal, width: 'auto', height: 'auto'})
	.append( $.htt( SETUP));
	$.jsonload( 'actions.php', { action: 'websocketserver'}, function( json) {
		$( 'div[id="info"]').empty().append( $.htt( SETUP)).css({ 'font-size': $.io.defs.fonts.big})
		console.log( 'websocketserver started, about to run METHOD:', METHOD);
		$.jsloadbytag( METHOD + '.js');
		var play = function() { $( 'body').stopTime().oneTime( '1ms', function() { while ( 1) { 
			//console.log( 'check', BUFFERPOS, BUFFER[ '' + BUFFERPOS] ? BUFFER[ '' + BUFFERPOS].length : '?');
			if ( ! BUFFER[ '' + BUFFERPOS] || ! BUFFER[ '' + BUFFERPOS].length) break;
			var now = $.iotime(); TIMEGAPS.push( now - LASTIME); LASTIME = now;
			$STATUS.empty().append( BUFFERPOS);
			BUFFERPOS += CHUNKSIZE;
			if ( BUFFERPOS >= LASTPOS * 1000000) return results();
			if ( $.iotime( TIMESTAMP) > 100000) return results();
			COUNTDOWN = 15;
		}; eval( play)();})}
		eval( play)();
	})
	countdown( 15);
}
ready();

