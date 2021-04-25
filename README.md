# UberBus Frontend


## Introduction

In this application, there are two user type: customer and admin. When logged in as customer, we can book a bus from a location; when logged in as admin user, we can make operations on user/bus/location.

### WorkFlow
  - After push code to github, `github action` will first run automated testing for endpoint, then it will automatically build and push docker image to `Azure ACR`.(CI)
  - After pushed image to `ACR`, `github action` will deploy the image to `Azure AKS` and launch the application.(CD)

### How to run
  - Clone the repository to your local: `git clone https://github.com/ManasaVanga/UberBusApp-React-fe.git`.
  - Run `npm install` to install the depencency, then run `npm start`, you can run it locally.
  - If you want to run in Azure cloud, you need to config Azure cloud environment and config git action, then you can push the code to github to do the CI/CD in Azure.

### Key Functionality
  - Mobile Ready UI ( Responsive UI)
  - CI/CD using Azure cloud and Github Action
  - JWT login functionality
  - Application Testing as part of the CI/CD pipeline

### Technical stack:
Language| Framework | Platform |
| --------| --------| --------|
javascript| React | Azure cloud|
css       | Bootstrap | Azure cloud|
html      | html    | Azure cloud|
