const path = require('path');
const cors = require('cors');
const logger = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const bodyParser = require('body-parser');
const http = require('http');
const { redirectToHTTPS } = require('express-http-to-https');
const methodOverride = require('method-override');


const port = process.env.PORT || 3000;
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server, { origins: '*:*' });

const config = require('./config/database');
const api = require('./routes/api'); // b
const firebase = require('./firebase');
/**
 * Routes import
 */
const routes = require('./domains/routes');

const FileRouter = require('./routes/file');

const AddressRouter = require('./routes/address');
const CountyRouter = require('./routes/county');
const ClassroomRouter = require('./routes/classroom');
const CompetenceRouter = require('./routes/competence');
const ContactRouter = require('./routes/contact');
const EnrollmentRouter = require('./routes/enrollment');
const DocumentRouter = require('./routes/document');
const FrequencyRouter = require('./routes/frequency');
const InstitutionRouter = require('./routes/institution');
const LinkRouter = require('./routes/link');
const NotificationRouter = require('./routes/notification');
const NewsRouter = require('./routes/news');
const PeopleRouter = require('./routes/people');
const ProfileRouter = require('./routes/profile');
const ProfileStudentRouter = require('./routes/profile/profile-student');
const ProfileParentRouter = require('./routes/profile/profile-parent');
const ProfileProfessorRouter = require('./routes/profile/profile-professor');
const ProfileSchoolRouter = require('./routes/profile/profile-school');
const ProfileCountyRouter = require('./routes/profile/profile-county');
const ProfileComunityRouter = require('./routes/profile/profile-comunity');
const ProfileSchoolInstitutionalRouter = require('./routes/profile/profile-school-institutional');
const ProfileCountyInstitutionalRouter = require('./routes/profile/profile-county-institutional');

const SchoolYearRouter = require('./routes/schoolYear');
const SchoolYearClassroomRouter = require('./routes/schoolYearClassroom');
const UserRouter = require('./routes/user');
const { checkTokenForSocket } = require('./utils/authService');
// Conexão com o banco process.env.MONGODB_URI config.database
const uristring = process.env.MONGODB_URI || process.env.MONGOHQ_URL;

global.io = io;

const User = require('./models/user');

io.use(async (socket, next) => {
  const handshake = socket.request;
  const { token } = handshake._query;

  const decoded = await checkTokenForSocket(token);
  if (decoded) {
    await User.findOneAndUpdate(
      { _id: decoded.user._id },
      { $set: { socket: socket.id } },
    );
  } else {
    console.log('Erro ao decodificar token para o socket');
  }
  next();
});

// Don't redirect if the hostname is `localhost:port` or the route is `/insecure`
if (process.env.NODE_ENV === 'production') {
  console.log(process.env.NODE_ENV);
  app.use(redirectToHTTPS([/localhost:(\d{4})/], []));
}

mongoose
  .connect(uristring, { useNewUrlParser: true })
  .then(() => console.log('connection succesful'))
  .catch((err) => console.error(err));

mongoose.set('useFindAndModify', false);

app.use(cors({ origin: '*' }));
// Settings for CORS
app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.header('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  );

  // Request headers you wish to allow
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', false);

  // Pass to next layer of middleware
  next();
});

// app.use(
//   cors()
//   // cors({
//   //   origin: function(origin, callback) {
//   //     // allow requests with no origin
//   //     // (like mobile apps or curl requests)
//   //     if (!origin) return callback(null, true);
//   //     if (allowedOrigins.indexOf(origin) === -1) {
//   //       var msg =
//   //         "The CORS policy for this site does not " +
//   //         "allow access from the specified Origin.";
//   //       return callback(new Error(msg), false);
//   //     }
//   //     return callback(null, true);
//   //   }
//   // })
// );
app.use(compression());
app.use(logger('dev'));
app.use(
  bodyParser.json({
    limit: '5mb',
  }),
);
app.use(
  bodyParser.urlencoded({
    limit: '5mb',
  }),
);

app.use(methodOverride('_method'));

app.use('/api', routes);
app.use('/api', api);
app.use('/api/user', UserRouter);
app.use('/api/contact', ContactRouter);
app.use('/api/people', PeopleRouter);
app.use('/api/address', AddressRouter);
app.use('/api/county', CountyRouter);

app.use('/api/file', FileRouter);
app.use('/api/profile/student', ProfileStudentRouter);
app.use('/api/profile/parent', ProfileParentRouter);
app.use('/api/profile/professor', ProfileProfessorRouter);
app.use('/api/profile/school', ProfileSchoolRouter);
app.use('/api/profile/county', ProfileCountyRouter);
app.use('/api/profile/comunity', ProfileComunityRouter);
app.use('/api/profile/school-institutional', ProfileSchoolInstitutionalRouter);
app.use('/api/profile/county-institutional', ProfileCountyInstitutionalRouter);
app.use('/api/profile', ProfileRouter);
app.use('/api/notification', NotificationRouter);
app.use('/api/classroom', ClassroomRouter);
app.use('/api/enrollment', EnrollmentRouter);
app.use('/api/frequency', FrequencyRouter);
app.use('/api/document', DocumentRouter);
app.use('/api/institution', InstitutionRouter);
app.use('/api/social/news', NewsRouter);
app.use('/api/competence', CompetenceRouter);
app.use('/api/link', LinkRouter);
app.use('/api/school-year', SchoolYearRouter);

app.use('/api/school-year-classroom', SchoolYearClassroomRouter);

app.use(express.static(path.join(__dirname, 'client', 'dist')));
app.use('/**', express.static(path.join(__dirname, 'client', 'dist')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err,
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
