<?php
set_time_limit( 0);
ob_implicit_flush( 1);
require_once( 'requireme.php');
checksession();


if ( $action == 'websocketserver') { 
	if ( procpid( 'websocket.server.with.fork.php')) prockill( procpid( 'websocket.server.with.fork.php'));
	procat( '/usr/local/php/bin/php /web/websockets/websocket.server.with.fork.php > /web/websockets/server.log');
	die( jsonsend( jsonmsg( 'ok')));
}
if ( $action == 'chunk') { // [seek], streams, size
	$in = fopen( 'data.binary', 'r');
	if ( isset( $seek) && $in) fseek( $in, $seek);
	if ( ! $in || feof( $in)) die( '');
	echo fread( $in, $size);
	fclose( $in);
}
if ( $action == 'stats') { // took, setup, timegaps
	$out = foutopen( "raw.bz64jsonl", 'a');
	$time = tsystem(); 
	$setup = json2h( $setup, true);
	$timegaps = json2h( $timegaps, true);
	foutwrite( $out, compact( ttl( 'time,took,setup,timegaps')));
	foutclose( $out);
	die( jsonsend( jsonmsg( 'ok')));
}


?>
