var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	socket.broadcast.emit('chat message', 'new member income');
	var sessionid = socket.id;
	io.emit('init', sessionid);
	socket.on('chat message', function(msg) {
			io.emit('chat message', msg);
			console.log('message: ' + msg);
	});
	socket.on('disconnect', function(){
		socket.broadcast.emit('chat message', 'member out');
	});
	socket.on('private', function(data) {
		io.to(data.to).emit('private', { from: data.from, to:data.to, msg: data.msg});
	});
	socket.on('typing', function(data) {
		io.emit('typing', data);
	});
	socket.on('typing_done', function(data) {
		io.emit('typing_done');
	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
