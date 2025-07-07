# Time slots management application

## Introduction 

This is a full-stack web application built with **Angular** (frontend) and **NestJS** (backend) that calculates **common available time slots** given:
- A required meeting duration
- A list of busy time slots from multiple participants
- A start and end date of the considered period

## Getting started

The application is dockerized, so if you have docker deamon installed you can easily start development servers with 

```
$ docker compose up
```

Frontend: http://localhost:4200

Backend API: http://localhost:3000

If docker is not available you can install Node 22 and follow the starting commands of each of the frontend and backend.

## 4 Hours checkpoint functionalities

### Backend

* Exposes a POST endpoint that calculates the available time slots given the following criteria
    * Duration of the time slot
    * Start period (date - time)
    * End period (date - time)
    * Time slots that are unavailable (busy)

* Validates the incoming POST request's payload.

* Ensures that given free time slots are in business hours.

* Take into consideration overlaping busy time slots.

### Frontend

Angular application that has a simple UI with a form to input the criteria and a table to display the results.

![alt text](images/previous-ui.png)

