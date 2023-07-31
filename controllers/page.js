exports.renderProfile = (req, res, next) => {
    // 서비스 호출
    res.render('profile', { title: '내 정보 - SNS'});
};

exports.renderJoin = (req, res, next) => {
    res.render('join', { title: '회원가입 - SNS'});
};

exports.renderMain = (req, res, next) => {
    res.render('main', {
        title: 'SNS',
        twits: [],
    })
};
// 라우터 -> 컨트롤러 -> 서비스