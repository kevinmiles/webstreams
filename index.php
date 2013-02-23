<?php
session_start();
set_time_limit( 0);
ob_implicit_flush( 1);
require_once( 'requireme.php');
//<!--[if IE]><script type="text/javascript" src="excanvas.js"></script><![endif]-->
?>
<html>
<title><?php echo $ANAME ?></title>
<head>
<meta HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF8">
</head>
<body style="overflow:hidden;"></body>
<script>
var BIP = '<?php echo $BIP ?>';
function onload() { $.jsload( 'script.js'); }
</script>
<?php
if ( $JQMODE == 'debug') { foreach ( $JQ as $k => $files) { foreach ( $files as $file) {  
	?><script src="<?php echo "$ABURL/jq/" . $JQMAP[ $k] . "$file.js?" . mr( 5); ?>"></script><?php echo "\n" ?><?php
}}}
else {	// do not go further, onload() is called by jqload.js
	?><script><?php echo "\n" . implode( '', file( "$ABDIR/jqload.js")) . "\n\n"; ?></script><?php
	echo "</html>\n";
	die( "\n");
}
?>
<script>
onload();	// only called for 'debug' mode
</script>
</html>

