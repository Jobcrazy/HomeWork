## Introduction
Backend source code for BCIT COMM 1800 (Group E)

## Develop Environment
* **IDE**: *Webstorm 2018.3.5*
* **Runtime**: *Node.js 8.17.0*

## Deployment
1. Install and config Node.js (8.17.0 or above)
2. Launch CLI and run commands below:
    ```
    cd /your/path/to/COMM-1800-Backend/
    npm install
    node ./bin/www
    ```
3. Launch Chrome and visit: [http://127.0.0.1:3000](http://127.0.0.1:3000)

## REST API
### 1. Login with Google ID
* **URI**: /user/login

* **Method**: POST

| Name | Description |
| ---- |---- |
| gid  | ***Google ID*** |
| fname  | Full Name |
| gname  | Given Name |
| xname  | Family Name |
| head  | Head Image URI |
| email | Email |

* **Return Value**

| Name | Description |
| ---- |---- |
| code  | 0: success |
| msg  | Error Message |
| token  | Use ***Google ID*** and ***token*** to communicate with our server |
