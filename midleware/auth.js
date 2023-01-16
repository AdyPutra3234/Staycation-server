const isLogin = (req, res, next) => {
    if (req.session.user == null || req.session.user == undefined) {
        req.flash('alertMessage', 'Your session has expired, Please login again!');
        req.flash('alertStatus', 'danger');
        req.flash('isShow', 'show');

        res.redirect('/admin/login');
    } else {
        next();
    }
}

module.exports = isLogin;