
This code uses all the recent advances in browsers to stream and aggregate content.  The code is build as an experiment between a browser and a web server.  Web server should have a separate socket server to serve WebSocket requests from the browser. 


==========
Features
==========

(1) traditionally only HTTP GET/POST are possible, this code implements WebSockets for bidirectional connection-oriented communication between the browser and the server. (see recent W3C standards and RFCs)

(2) traditionally browsers are single threaded.  Workers introduce multitreading, they can run in the background and even beyond the lifespan of the page.  On multicore machines, is has become possible to aggregate content via multiple concurrent streams.  This code helps you test the throughput.  In fact, the code was created for the sole purpose of testing the limits of the achievable throughput.

(3) Variable passing between a Worker and the main thread is by default the passing-by-copy type.  However, passing-by-reference is also possible.  Also, passing-by-copy has recently advanced a step step closer to perfection via the "structured copy" algorithm, which is said to perform better than the algorithm used for JSON parsing.  This code can reveal the difference between the passing methods. 

(4) Data can now be handled in binary format without parsing -- remember that it used to be JSON no matter what you send.  This code uses Uint8Array which is received in binary format and does not have to be parsed.  Binary data can be handled in a number of ways, including MediaExtensions, File API, canvas drawing, etc. 


=========
Implementation
=========

The code is written in JS/jQuery on browser and PHP on the server side. 

Server:
(1) PHP web application, serves the page through index.php, actions.php serves 
the 
(2) PHP WebSocket server.  Uses fork() to serve each incoming request.  Uses sockets module of PHP, so your php should have socket enabled (not enabled by default).
(3) the requireme.php library, which has my own functions, including the socket server.

Client:
(1) requireme.js which has jQuery, and a bunch of my own stuff on top of it. 
(2) otherwise, WebSocket and Worker are used out of the box.  However, "the box" itself is the latest development version of Chrome.  The portable version is attached with the code.



