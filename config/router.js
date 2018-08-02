module.exports = function(app, jwt, configWT){
    authRouter = require('../routes/auth')(app, jwt, configWT);
    app.use('/auth',authRouter);
    app.use('/',authRouter);
    userRouter = require('../routes/user')(app);
    app.use('/user',userRouter);
    homesRouter = require('../routes/homes')(app);
    app.use('/homes',homesRouter);
}