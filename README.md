## NOTES

Following the example given below, I created an app and added react-helmet to modify the head and add a script.
What I found was that the script is being run long after the `config.js` file is being imported and even in 
the script `process.env` doesn't exist nor does modifying it in the script do anything after the fact. I don't 
know if this is a `create-react-app` issue (wouldn't think so) or a `react-helmet` issue (leaning towards this).
Looks like it isn't a `react-helmet` issue because I tried just dropping the code into the `index.html` `<head>` section and
I got the same result. I also noticed that using `react-helmet` runs the script way after the imports occur and it
seems wouldn't be able to set the environment variables in time.

This is a link to SO question where the answer basically says this isn't possible: 
https://stackoverflow.com/questions/52871895/cant-set-values-on-process-env-in-client-side-javascript

Create React App talks about replacing them but you have to use SSR: https://create-react-app.dev/docs/title-and-meta-tags/#injecting-data-from-the-server-into-the-page

Which makes me wonder if there is a possibility of like a docker-esqe SSR solution? Like could we just take a statically
built JS app and drop it into this "container" and it magically adds a minimal SSR solution?

Relevant files are `App.js`, `config.js`, and `httpClient.js`

## Logs

```
(index):29 ***** LOGGING FROM index.html *****
(index):30 what is window Window {parent: Window, opener: null, top: Window, length: 0, frames: Window, …}
(index):31 what is window.process before setting undefined
(index):33 what is process.env before setting undefined
(index):39 what is env? {REACT_APP_BACKEND_BASE_URL1: "localhost:5001"}
log.js:24 [HMR] Waiting for update signal from WDS...
config.js:4 logging in config window.process {env: {…}}
config.js:5 logging in config process.env {NODE_ENV: "development", PUBLIC_URL: "", WDS_SOCKET_HOST: undefined, WDS_SOCKET_PATH: undefined, WDS_SOCKET_PORT: undefined}
App.js:13 what is process.env in App {NODE_ENV: "development", PUBLIC_URL: "", WDS_SOCKET_HOST: undefined, WDS_SOCKET_PATH: undefined, WDS_SOCKET_PORT: undefined}
VM119140:2 ***** LOGGING FROM HELMET *****
VM119140:3 what is window Window {parent: Window, opener: null, top: Window, length: 0, frames: Window, …}
VM119140:4 what is window.process before setting {env: {…}}
VM119140:6 what is process.env before setting {REACT_APP_BACKEND_BASE_URL1: "localhost:5001"}
VM119140:12 what is env? {REACT_APP_BACKEND_BASE_URL1: "localhost:5001", REACT_APP_BACKEND_BASE_URL2: "localhost:5002"}
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