module.exports = function(app){
    authRouter = require('../routes/auth')(app);
    app.use('/auth',authRouter);
    app.use('/',authRouter);
    userRouter = require('../routes/user')(app);
    app.use('/user',userRouter);
    homesRouter = require('../routes/homes')(app);
    app.use('/homes',homesRouter);
}