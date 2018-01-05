var express = require('express');
var app = express();
app.set('view engine' , 'ejs');
app.set('views', __dirname);
app.use(express.static(__dirname));
app.set('port',(process.env.PORT || 5000));
app.listen(app.get('port'), function(){
    console.log('API is running on port', app.get('port'))
})
var ejs =require("ejs");
app.get('/',function(req,res){
    res.render('chess');
});
