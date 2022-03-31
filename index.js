const app = require('./app');
const connectMongo = require('./lib/connectMongo');

connectMongo()
  .then(() => {
    app.listen(process.env.PORT || 3001, () => {
      console.log('Server Started');
      console.log('DB connected');
    });
  })
  .catch((e) => {
    console.log(e);
  });
