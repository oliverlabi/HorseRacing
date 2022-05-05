# HorseRacing

Simple web application, where you can create horse races and bet on them.

Web application has been deployed to Heroku and is accessible on:
Frontend: https://horseracing-frontend-ol.herokuapp.com/
Backend: https://horseracing-backend-ol.herokuapp.com/
As it is hosted on free Heroku account, it can be slow.

## Functionalities

* Account registration and logging in
* Create horse races:
    * Name your own race
    * Describe your race
    * Choose from four race tracks
    * Set starting time
    * Add up to 6 horses with names and colors
* Bet on your or other user's races by choosing a horse and betting amount
    * System computes winning horse with a random function
* See all previous and also ongoing race results
    * Sort by starting time
* Balance system inspired by clicker games
    * Balance can be earned by clicking top-up button on account page - 1 click, 1 c (currency)
* Page is mostly responsive with few quirks

## Branches

* Main branch stores development build
* Production branch stores production build

## Tests

Backend has 8 integration tests made with Jest.

How to start tests:
* Start command prompt
* Navigate to backend-node/src
* Start command "npm test"

## Screenshots

![Races page with an active bet](/pictures/races-view.jpg)
![Logged in account page](/pictures/account-view.jpg)
![Results table](/pictures/results-view.jpg)
![Login page with small window size](/pictures/login-view-resp.jpg)
![Races page with small window size](/pictures/races-view-resp.jpg)
![Menu view on sider click](/pictures/menu-view-resp.jpg)

## Technologies used

* React frontend
* Node.js backend
* MongoDB Atlas
* Heroku
* Jest
* Ant Design

## Authors

Oliver Labi