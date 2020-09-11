# Circle Community Social App (圈子社区) - MERNG Stack

MERNG stands for MongoDB, Express, React, Node.js & GraphQL. 

### Prerequisites

Make sure you have all the requirements installed

```
- A MLab, Mongo Atlas or local Mongo instance is required
- Node.js installed
```

### Installing

Clone this git repo

```
# Open a terminal
yarn install

cd client
yarn install
```

Create a new '.env' file under your root folder, paste the following code into it and change the MONGO_URI to whatever your mongo instance will be, and SECRET_KEY to whatever the key you want

```
MONGO_URI='mongodb://db_username:db_password@db_url:db_port/db_name'
SECRET_KEY='TopSecretDontLetOtherPeopleKnow'
PORT=5000
SMTP_SERVICE='qq'
SMTP_HOST='smtp.qq.com'
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER='619455181@qq.com'
SMTP_PASS='zhzksz*****ubeac'
```

For example:
```
MONGO_URI='mongodb://localhost/group'
SECRET_KEY='TopSecretDontLetOtherPeopleKnow'
PORT=5000
SMTP_SERVICE='qq'
SMTP_HOST='smtp.qq.com'
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER='619455181@qq.com'
SMTP_PASS='zhzksz*****ubeac'
```

### Up and Running

```
# Open a terminal, at the root folder
yarn start:dev

# Open another terminal
cd client
yarn start
```

### Deploy to heroku

You must have heroku toolbelt installed before continue

```
# Open a terminal, at the root folder
heroku login
heroku create

git add .
git commit -am "Whatever message"
git push heroku master

heroku config:set MONGO_URI=mongodb://db_username:db_password@db_url:db_port/db_name
heroku config:set SECRET_KEY=TopSecretDontLetOtherPeopleKnow

heroku open
```
