console.log('hello world');

const { response } = require("express");
const express = require("express");
const app = express();
const fs = require('fs');



app.set('views',__dirname + '/views'); // 뷰폴더 지정
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));

app.use(express.json());
app.use(express.urlencoded({extended: true})); // json에서 다중객체 읽기 허용



// 홈화면
app.get('/',(req, res) => {
    // res.sendFile(__dirname + '/main.html');
    res.render('main');
});

app.post('/api/image_upload', (req, res) => {
    // const { file } = req;
    console.log(req);
    console.log('body is '+req.body);
    console.log('header is ' + req.headers.data);
    let decode = Buffer.from(req.headers.data, 'base64');
    let makeDecodeFile = fs.writeFileSync('./decode.jpg', decode);
    return res.send({result: 'success'})
})

app.use((req, res, next) => {
    response.status(404).send("Page not found: ");
})

app.listen(8080);


