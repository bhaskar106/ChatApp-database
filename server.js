var mysql = require("mysql");

var connection = mysql.createConnection({
	host: "127.0.0.1",
	user: "sanjay",
	password: "",
	database: "Chat"
});

connection.connect(function (error) {
if(error)throw error;

var app =require('express')();

var http = require('http').Server(app);

var io = require ('socket.io')(http);

app.get('/', (req, res)  => {
  res.sendFile(__dirname + '/client.html');
})

http.listen(106, () =>{
  console.log('Server is started')
})

var users = [];

io.sockets.on('connection', socket => {
  console.log('connected');


   socket.on('new-user', name => {
      io.sockets.emit('name',name);
      users[socket.id] = name;
      var Value = [
          [0,name]
       ];
      connection.query("INSERT INTO Clients(Id,UserName) VALUES ?", [Value] , function (err, result, fields) {
        if (err) throw err;
       console.log(result);
       });
      socket.emit('id',socket.id);
      socket.emit('Allusers',users);
      //console.log(Object.keys(users));
      //console.log(Object.values(users));
      //console.log(users);
      clients=Object(users);
      socket.emit('clients', Object.values(users));
      socket.broadcast.emit('user-connected', name);
      var U=(Object.values(users))
      var u=(Object.keys(users))
      //console.log(U.length)
      //console.log(u.length-1)
      //console.log(socket.id)
      for(i=0;i<U.length-1;i++)
      {
      //console.log("for loop");
      //console.log(U.length)
      if(U[U.length-1] == U[i])
      {
        io.to(socket.id).emit('Userdisconnect',{name:`${name}`});
        //console.log("if condition");
        //console.log(u[U.length-1]);
        break;
      }
      }
   })

  socket.on('username', Value => {
    var V=Object.values(users);
    var K=Object.keys(users);
    var N=`${Value.Select}`;
    var M=`${Value.message}`;
    a = new Date();
    console.log(a);
    d = a.toJSON();
    console.log(d);
    date = d.substring(0,10);
    console.log(date);
    time = d.substring(11,19);
    console.log(time);
    var name= users[socket.id];
    Value = [
          [name,date,time,M,N]
       ];
      connection.query("INSERT INTO Mdata(UserName,Date,Time,Message,ToUser) VALUES ?", [Value] , function (err, result, fields) {
        if (err) throw err;
       console.log(result);
       });

    //console.log(N);
    //console.log(V.indexOf(N));
    //console.log(K[V.indexOf(N)]);
    //console.log('entered option value')
    //console.log(M); 
     if(V.indexOf(N) != -1)
     {
      //console.log("entered if condition")
      socket.to(K[V.indexOf(N)]).emit('chat-message',{ message: M, name: users[socket.id] });
      //console.log("closing if")
      Value = [users[socket.id]];
      connection.query("SELECT * FROM Mdata WHERE UserName= ?",[Value] , function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        });
      connection.query("SELECT * FROM Mdata WHERE ToUser= ?",[Value] , function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        });
     }
     else
     {
      //console.log("enter else")
      socket.broadcast.emit('chat-message', { message: M, name: users[socket.id] });
      //console.log("close else")
      connection.query("SELECT * FROM Mdata", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        });
     }
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];
  });

});

});
