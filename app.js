const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');

// process.env
dotenv.config(); 
const pageRouter = require('./routes/page');
const nunjucks = require('nunjucks');
const { Template } = require('nunjucks');

const app = express();
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

// log 모드 설정
app.use(morgan('dev')); 
// public 폴더만 접근 허용
app.use(express.static(path.join(__dirname, 'public')));  
// json 요청  
app.use(express.json());    
// form 요청
app.use(express.urlencoded({ extended: false }));   
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUnintialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    }
}));

app.use('/', pageRouter);
app.use((req, res, next) => {
    // 404 not found
    const error = new Error(`${req.method} ${req.url} 라우터가 존재하지 않습니다.`);
    error.status = 404;
    next(error);
});
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    // 에러 로그를 서비스한테 넘기기
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중...');
});