<?php
// setup
$port = 5000;	// port to listen to
$wdir = '/web/websockets'; // will write delay stats to wdir/sleeps.hcsv
chdir( $wdir);
// run
require_once( 'requireme2.php');
function tsystem() {	// epoch of system time
	$list = @gettimeofday();
	return ( double)( $list[ 'sec'] + 0.000001 * $list[ 'usec']);
}
class MyWebSocketServer extends WebSocketServerStreamingWithFork {
	var $delay;
	//protected $maxBufferSize = 1048576; //1MB... overkill for an echo server, but potentially plausible for other applications.
	protected function rx( $user, $message) {
		global $wdir;
		$L = explode( ' ', $message);
		$pos = array_shift( $L); $blocksize = array_shift( $L);
		$step = array_shift( $L); $thru = array_shift( $L); $until = array_shift( $L);
		echo "received($message)  pos=$pos,blocksize=$blocksize,step=$step,thru=$thru,until=$until\n";
		// calculate per-block request delay
		$user->in = fopen( 'data.binary', 'r');
		//if ( ! $user->in || feof( $user->in)) return $user->disconnect( $user->socket);
		$user->pos = $pos; 
		$user->blocksize = $blocksize;
		$user->step = $step;
		$user->lastpos = $until;
	}
	protected function tx( $user) {
		if ( ! $user->in || @feof( $user->in)) return false; // no file to read from
		if ( $user->pos >= $user->lastpos) { @fclose( $user->in);  return false; }
		rewind( $user->in);
		echo ' ' . $user->pos;
		fseek( $user->in, $user->pos);
		$msg = fread( $user->in, $user->blocksize);
		$this->send( $user, $msg, 'binary');
		$user->pos += $user->step * $user->blocksize;
		//usleep( $this->delay);
		return true;
	}
	protected function connected( $user) {
		echo "new client\n";
		$out = fopen( 'websocket.client.log', 'a');
		fwrite( $out, "user=" . $user->id . ",action=connected,time=" . tsystem() . "\n");
		fclose( $out);
	}
	protected function closed( $user) {
		echo "client closed\n";
		$out = fopen( 'websocket.client.log', 'a');
		fwrite( $out, "user=" . $user->id . ",action=closed,time=" . tsystem() . "\n");
		fclose( $out);
	}
	
}	
$echo = new MyWebSocketServer( '0.0.0.0', $port, 2048, 10);


?>