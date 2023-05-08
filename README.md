# mern-aws-deploy

App is setup in such a way that the build generated from React app is served as static files from the backend (Express) server.

`react`, `react-router-dom`, `axios`, `express`, `cors`.

## Directory Structure

```
> root
    >> client
        >>> build/
        >>> node_modules/
        >>> public/
        >>> src/
        >>> .gitignore
        >>> package-lock.json
        >>> package.json
        >>> README.md
    >> server
        >>> node_modules/
        >>> controllers/
        >>> routes/
        >>> .gitignore
        >>> package-lock.json
        >>> package.json
        >>> README.md
        >>> server.js
```

## Steps

1. Finish developing your React app and Express server.
2. Add line in `client/package.json` for the _"proxy"_ key in the .
   ```json
   {
       ...
       "proxy": "http://localhost:4000/" // or whatever port that your Express server starts is
       ...
   }
   ```
3. Remove all instances of the _host_ URL in all AJAX request calls inside your React app. Ex. `axios.get('http://localhost:5000/api/v1/users')` becomes `axios.get('/api/v1/users')`. _NOTE_: After you do this you will not be able to test your frontend app locally.
4. Add the following code to the entry file in the server code, usually `server.js` or `index.js`.

   ```js
   // Making Build Folder as Public
   app.use(express.static(path.join(__dirname, "client", "build")));

   app.get("/", function (req, res) {
     res.sendFile(path.join(__dirname, "client", "build", "index.html"));
   });
   ```

   - _NOTE_: This assumes that the build that React scripts will generate will be generated inside `<root_project_dir>/client/build` and the server entry file is in `<root_project-dir>/`. If not, please adjust the path you enter in the code above.
   - _NOTE_: This code block should be entered before declaring all the other routes. (60% sure)

5. Set up a blank AWS instance with the security key-pair generated and linked. This deployment works in the _Ubuntu 20.04 AMD x64_ instance. Please not that the security key file (usually `.pem` file) must not be publicly available for all users on your local system to see. Change the permissions accordingly to _400_.
6. Prep your FTP solution at this stage or generate SSH key for server access for GitHub access if you wish to go that route.
7. Clone your repository or copy your the files mentioned below using FTP solution in any folder in the server. In my case, I copied it to `~/projects/mern-deploy` or `/home/ubuntu/projects/mern-deploy`.
   - _NOTE_: In case of FTP transfer, do not copy the `node_modules/` or `build/` folders. We will install and build the apps in the server itself.
8. Install Node, PM2 and Nginx

   ```bash
   # add nodejs 16 ppa (personal package archive) from nodesource
   curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -

   # install nodejs and npm
   sudo apt-get install -y nodejs

   # reload local package database
   sudo apt-get update

   # install pm2 with npm
   sudo npm install -g pm2

   # set pm2 to start automatically on system startup
   sudo pm2 startup systemd

   # install nginx
   sudo apt-get install -y nginx
   ```

9. Setup Firewall to allow SSH and Nginx connections

   ```bash
   # allow ssh connections through firewall
   sudo ufw allow OpenSSH

   # allow http & https through firewall
   sudo ufw allow 'Nginx Full'

   # enable firewall
   sudo ufw --force enable
   ```

10. Navigate to your project directory and install packages for both client and backend using `npm install` in each directory.
11. Run `npm run build` in the `client/` directory to generate production ready build for React app.
12. Navigate to `/etc/nginx/sites-available/`. Delete the `default` file using the commmand `sudo rm default`. You will need _sudo_ permissions for this.
13. Create a new `default` file and paste the following code in that file. `sudo nano default`. Once done, `CTRL + O`, `ENTER key`, `CTRL + X` to write out the file, save the file name as _default_ and exit the editor.

    ```bash
    server {
        listen 80 default_server;
        server_name _;

        # Backend (Put in the same URL below as the one your Express app runs in.)
        location / {
            proxy_pass http://localhost:4000/;
        }
    }

    ```

14. Restart Nginx using `sudo systemctl restart nginx`.
15. Navigate back to your project directory. In my case it is `~/projects/mern-deploy` or `/home/ubuntu/projects/mernn-deploy`.
16. Start a new PM2 process for the backend server using `sudo pm2 start server.js --name "<whatever-name-you-wish-to-identify-the-process-with>".
17. _*DONE*_. You can use the public IPv4 address of the instance to see the app running.
