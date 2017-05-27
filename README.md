![alt tag](https://circleci.com/gh/ChrisPenner/scavenger.png)
# Scavenger 

A basic texting scavenger hunt using Twilio

## Local Setup

```
cd scavenger
npm install
npm install -g webpack webpack-dev-server
npm install -g webpack-dev-server
```

Also ensure that the [Python App-engine
SDK](https://cloud.google.com/appengine/docs/standard/python/download) is
installed.

## Running it locally

```
npm start # In one terminal window
npm run backend # In another terminal window
```

Then navigate to [localhost:8080](http://localhost:8080) to authenticate
You'll find all of your local datastore objects in [localhost:8000](http://localhost:8000)
Manage your running app here [localhost:3000](http://localhost:3000)

## Deploying it

If you're fortune enough to have nose installed and working correctly you can simply run the following command

```
npm run deploy
```

Otherwise you're gonna want to build and then deploy via bash

```
npm run build
bash ./deploy.sh
```