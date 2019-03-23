# PolitCtrl

## Controlling the politicians' posts

This project is created to control what words the politicians delete.
When a politician, that is followed by this script, writes a tweet, it gets saved on a database. When they realise what they just done and delete their tweets, it's too late. **Their words won't be forgotten, forever.**

### Building, running

You need Node.js, yarn and a PostgreSQL database to run this project. You will also need API keys for each platform you will use to get posts from (for Twitter see [developer.twitter.com](https://developer.twitter.com/)).

1. Install dependencies with yarn:
```
$ yarn
```

2. Write needed environment variables

Copy .env.example file to .env and fill it with your variables.

3. Run it lol

To run a development server:
```
$ yarn dev
```

To build a production bundle:
```
$ yarn build
```

### Related

See [`politctrl/frontend`](https://github.com/politctrl/frontend), which uses the API to show data in a human-friendly form on web browsers.