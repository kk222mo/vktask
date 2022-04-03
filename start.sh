mkdir server/mediadata
export ACCESS_TOKEN_SECRET="YOUR JWT SECRET"
export MONGODB_CONNECTION_STRING="YOUR CONNECTION STRING"
cd client
npm run buildClient
cd ..
cd server
npm start