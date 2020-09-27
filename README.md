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

### 2. Get User Information
* **URI**: /user/info

* **Method**: POST

| Name | Description |
| ---- |---- |
| gid  | ***Google ID*** |
| token  | token got from login API |

* **Return Value**
```
{
    "code": 0,
    "data": [
        {
            "id": 1,
            "fname": "刘航",
            "gname": "航",
            "xname": "刘",
            "head": "https://lh5.googleusercontent.com/-WmSZDdMVzsg/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmhRt5YTKrH8CXq2eFAEeFcnis2JA/s96-c/photo.jpg"
        }
    ]
}
```
| Name | Description |
| ---- |---- |
| code  | 0: success |
| data  | See description below |
| id  | User ID |
| fname  | Full Name |
| gname  | Given Name |
| xname  | Family Name |
| head  | Head Image URI |

### 3. Add a Course
* **URI**: /course/add

* **Method**: POST

| Name | Description |
| ---- |---- |
| gid  | ***Google ID*** |
| token  | token got from login API |
| courseid  | Official Course ID. e.g.: "COMM 1116" |
| term  | Term. e.g.: "Fall 2020" |
| instructor  | Instructor Name |
| class  | Class, Set or Group. e.g.: "SET E" |

* **Return Value**

| Name | Description |
| ---- |---- |
| code  | 0: success |
| msg  | Error Message |
