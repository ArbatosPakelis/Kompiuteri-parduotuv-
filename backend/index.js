const cors = require('cors');
const express = require('express')
const app = express()
const partsRouter = require('./routers/partsRouter');
const computerSetRouter = require('./routers/ComputerSetRouter');
const AppError = require('./utils/appError');


app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(
    cors()
);

app.use('/', partsRouter);
app.use('/computerSet', computerSetRouter);
app.use('*', (req, res, next) => {
    next(new AppError(`Can not find ${req.originalUrl} on this server`, 404));
  });

app.listen(5000, () => {console.log("Server started on port 5000")})