const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const loginRouter = require('./routes/login');
const usuarioRouter = require('./routes/usuario');
const modeloRouter = require('./routes/modelo');
const dispositivoRouter = require('./routes/dispositivo');
const mqttRouter = require('./routes/mqtt');
const dashboardRouter = require('./routes/dashboard');
const dadosEntradaRouter = require('./routes/dadoEntrada');
const tiposDeDadosRouter = require('./routes/tiposDados');
const medicoesRouter = require('./routes/medicoes');

const gaugesRouter = require('./routes/gauges');
const linhasRouter = require('./routes/linhas');
const barrasRouter = require('./routes/barras');
const radaresRouter = require('./routes/radares');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/login', loginRouter);
app.use('/usuario', usuarioRouter);
app.use('/modelo', modeloRouter);
app.use('/dispositivo', dispositivoRouter);
app.use('/mqtt', mqttRouter);
app.use('/dashboard', dashboardRouter);
app.use('/dadosEntrada', dadosEntradaRouter);
app.use('/tiposDados', tiposDeDadosRouter);
app.use('/medicoes', medicoesRouter);

app.use('/gauges', gaugesRouter);
app.use('/linhas', linhasRouter);
app.use('/barras', barrasRouter);
app.use('/radares', radaresRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
