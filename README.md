# Ku Laundry
Korea university washing machines at dorm check web service.
kulaundry.kro.kr
❌ Non-commercial ❌
( Commercial use of this project is prohibited. )

any question please send me an email.

using node.js | mysql | html | ejs | css

## Server - node.js

express framework.

connected with mysql.

ejs view template.

router to login, insert, delete, etc..

## Front - ejs & html & css

CSS template : Thanks to Colorlib.com 
https://colorlib.com/wp/template/login-form-v3/

ejs view template is used to show data from node server with MySQL.

## Database - mysql

1.  Machine.sql has Machine Id which is a primary key, and location attribute where it is located at the dorm.

2.  Account.sql has User Id that is a primary key, password, user name, and email attributes.

3.  State.sql has User Id, Machine Id. Those two are primary keys & foreign keys(each from machine and account relation).
    Plus, it has room number and start time attributes.
