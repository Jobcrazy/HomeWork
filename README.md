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
| gid  | Google ID |
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
| uid  | User ID |
| token  | Use ***uid*** and ***token*** to communicate with our server |

### 2. Get User Information
* **URI**: /user/info

* **Method**: POST

| Name | Description |
| ---- |---- |
| uid  | User ID |
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
| uid  | User ID |
| token  | token got from login API |
| courseid  | Official Course ID. e.g.: "COMM 1116" |
| term  | Term. e.g.: "Fall 2020" |
| instructor  | Instructor's Name |
| class  | Class, Set or Group. e.g.: "SET E" |

* **Return Value**

| Name | Description |
| ---- |---- |
| code  | 0: success |
| cid  | Course index in database  |
| msg  | Error Message |

### 4. Delete a Course
* **URI**: /course/del

* **Method**: POST

| Name | Description |
| ---- |---- |
| uid  | User ID |
| token  | token got from login API |
| cid  | Course index in database. e.g.: 4 |

* **Return Value**

| Name | Description |
| ---- |---- |
| code  | 0: success |
| msg  | Error Message |

### 5. Search a Course by Course ID
* **URI**: /course/search

* **Method**: POST

| Name | Description |
| ---- |---- |
| courseid  | Official Course ID |
| page  | Page Number |
| limit | Items Per Page |

* **Return Value**

| Name | Description |
| ---- |---- |
| code  | 0: success |
| msg  | Error Message |
| id  | Course Index in database |
| courseid  | Official Course ID |
| term  | Term |
| instructor  | Instructor's Name |
| class  | Class, Set or Group |

### 6. List Course
* **URI**: /course/list

* **Method**: POST

| Name | Description |
| ---- |---- |
| page  | Page Number |
| limit | Items Per Page |

* **Return Value**

| Name | Description |
| ---- |---- |
| code  | 0: success |
| msg  | Error Message |
| id  | Course Index in database |
| courseid  | Official Course ID |
| term  | Term |
| instructor  | Instructor's Name |
| class  | Class, Set or Group |

### 7. Add Volunteer for Course
* **URI**: /volunteer/add

* **Method**: POST

| Name | Description |
| ---- |---- |
| uid  | User ID |
| token | Token |
| cid | Course Index ID |
| vid | Volunteer User ID |

* **Return Value**

| Name | Description |
| ---- |---- |
| code  | 0: success |
| msg  | Error Message |

### 8. Delete Volunteer for Course
* **URI**: /volunteer/del

* **Method**: POST

| Name | Description |
| ---- |---- |
| uid  | User ID |
| token | Token |
| cid | Course Index ID |
| vid | Volunteer User ID |

* **Return Value**

| Name | Description |
| ---- |---- |
| code  | 0: success |
| msg  | Error Message |

### 9. Get Volunteers of a Course
* **URI**: /volunteer/get

* **Method**: POST

| Name | Description |
| ---- |---- |
| uid  | User ID |
| token | Token |
| cid | Course Index ID |

* **Return Value**
```
{
    "code": 0,
    "data": [
        {
            "uid": 1
        },
        {
            "uid": 2
        }
    ]
}
```

| Name | Description |
| ---- |---- |
| code  | 0: success |
| msg  | Error Message |
| data  | See Below |
| uid  | Volunteer's User ID |