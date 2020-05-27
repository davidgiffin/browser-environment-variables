## NOTES

Following the example given below, I created an app and added react-helmet to modify the head and add a script.
What I found was that the script is being run long after the `config.js` file is being imported and even in 
the script `process.env` doesn't exist nor does modifying it in the script do anything after the fact. I don't 
know if this is a `create-react-app` issue (wouldn't think so) or a `react-helmet` issue (leaning towards this).

Relevant files are `App.js`, `config.js`, and `httpClient.js`

## Logs

```
[HMR] Waiting for update signal from WDS...
config.js:2 logging in config window.process undefined
config.js:3 logging in config process.env {NODE_ENV: "development", PUBLIC_URL: "", WDS_SOCKET_HOST: undefined, WDS_SOCKET_PATH: undefined, WDS_SOCKET_PORT: undefined}
App.js:13 what is process.env in App {NODE_ENV: "development", PUBLIC_URL: "", WDS_SOCKET_HOST: undefined, WDS_SOCKET_PATH: undefined, WDS_SOCKET_PORT: undefined}
VM95124:2 what is window Window {parent: Window, opener: null, top: Window, length: 0, frames: Window, …}
VM95124:3 what is window.process before setting undefined
VM95124:5 what is process.env before setting undefined
VM95124:11 what is env? {REACT_APP_BACKEND_BASE_URL: "localhost:5000"}
App.js:9 what is process.env when clicking? {NODE_ENV: "development", PUBLIC_URL: "", WDS_SOCKET_HOST: undefined, WDS_SOCKET_PATH: undefined, WDS_SOCKET_PORT: undefined}
```

## Original Discussion

```
<!DOCTYPE html>
<html>
  <head>
    <script type="text/javascript">
      /*
      // This is how you would define it in line but I assume this code will be static so
      // this wont work. You need to include it dynamically
      window.process = window.process || {}
      process.env = process.env || {}
      process.env = Object.assign({}, process.env, {
        HOST: "localhost",
        DOG_NAME: "Ollie",
      });
      */
    </script>
    <script type="text/javascript" src="https://releaseapp.io/api/apps/1234/env-vars"></script>
    <title>My cool page</title>
  </head>
  <body>
    So if you want to use a global variable in code that is not behind any kind
    of a callback it needs to be defined before you use it. The easiest way to
    make sure that you have defined it is to make it a blocking script at the
    top of `head` tag.

    One way to make this reusable for all of your client's apps is that you can
    link to a dynamically generated file that exposes the environment variables
    that the user wants to use in their app.

    Now imagine you provide some way to let users pick which env vars they want
    to expose and they can be exposed much like the commented out object above
    but by simply replacing their app id.
    https://releaseapp.io/api/apps/1234/env-vars. You would want to make sure
    this is served really fast because it will be blocking the entire page from
    loading. I would cache it until the env vars change.

    For those that can not or will not load blocking javascript you can also
    expose a version that sets the data then calls a callback.

    The import script can look like: https://releaseapp.io/api/apps/1234/env-vars?callback=whateveryouwant. And then they will call
    whateveryouwant(function() {
      // load scripts here. This way there is no blocking JS but they will need
      // to make sure they load their javascript that will use the environment vars
      // inside the callback
    });

    The way this would work is essentially a function that looks like:
    function whateveryouwant(cb) {
      window.process = window.process || {}
      process.env = process.env || {}
      process.env = Object.assign({}, process.env, {
        HOST: "localhost",
        DOG_NAME: "Ollie",
      });
      cb()
    }


    <script type="text/javascript">
      document.write("HOST: " + process.env.HOST + "<br />")
      document.writeln("DOG_NAME: " + process.env.DOG_NAME)
    </script>
  </body>
</html>
```