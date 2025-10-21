# Cypress E2E Automation testing

These Cypress tests form the highest level of the automation test pyramid, running through the browser and testing entire journeys. They are designed to give the highest level of confidence that no regressions have been introduced into the system by running through a complete set of high level journeys. However this does mean that they are likely to take longer to run than lower level forms of testing (e.g. unit or integration)

## Usage

### Run all tests 

Tests can be run using various modes depending on requirement 

#### Headless mode 

The following commands will run tests for different environments 

```
cy:run - run tests for local  
cy:run:dev - run tests for dev 
cy:run:test - run tests for test 
```

#### Interactive mode 

The following commands will launch the test runner for different environments 

```
cy:open - run tests for local  
cy:open:dev - run tests for dev 
cy:open:test - run tests for test 
```

#### CI mode 

The tests can also be run as per CI (continues integration) - i.e. as would be in the pipeline 

```
cy:ci:local - run tests for local  
cy:ci:dev - run tests for dev 
cy:ci:test - run tests for test 
```

### Run only smoke tests (sub-set)

`npm run cy:run-smoke` (Headless)\
`npm run cy:open-smoke` (Interactive mode)

Alternatively you can run tests from the root via `npm run e2e` or `npm run e2e:open` to run in interactive mode.

## Getting Started

### Prerequisites

- [Node.js LTS](https://nodejs.org/en/) (installation through a Node version manager such as [Nvm](https://github.com/nvm-sh/nvm) is recommended)

### Install packages

Ensure you have run `npm i` from inside `/e2e` to install the requisite node packages

### Running dev server

The Cypress tests will expect to find the application running at your BASE_URL defined in your config. By default the dev server will run on https://localhost:8080/ so this ought to be what your BASE_URL is too. Ensure the application is running at the BASE_URL for e2e testing to work.

Also ensure your docker container is running so that the app can access the database.

### Setup .env file

Create a file called `.env` in this directory, using `.env.sample` as a starting point

You should now be able to run tests against a remote environment (e.g. test)

## Running smoke tests only (tags)

By default all tests are run as the full **regression test** suite. However it's also possible to run a sub-set, should as the **smoke tests** only which are designed to quickly give confidence that basic functionality is working.

The [Cypress Grep package](https://github.com/cypress-io/cypress/tree/develop/npm/grep) is used to provide this functionality. Tags that feature a tag have it indicated after the test name, such as

```
it('Test name', { tags: tag.smoke }, () => {
	/* Test goes here */
})
```

To only run **smoke tests** the following command would be used

```
npx cypress run --env grepTags="smoke"
```

## Architecture

All tests are defined within the `*.cy.js` files, stored in the `/e2e/dco-portal` directory. These in turn should use files within the `/page_object` directory to interact with the page.

Every test is designed to be [fully independent](https://docs.cypress.io/guides/references/best-practices#Having-Tests-Rely-On-The-State-Of-Previous-Tests) and able to run in isolation. In order to allow this a series of [custom Cypress Commands](https://docs.cypress.io/api/cypress-api/custom-commands) have been created that are defined in the `support/commands.js` file.

### Folder structure

```
Cypress/
├── downloads/       				- Temporary file downloads used during tests
├── e2e/dco-portal			        - Test specifications
├── fixtures/        				- Fixtures are fixed sets of data used by tests
├── page_objects/    				- Used by test spec files to interact with pages being tested
└── support/						- Utilities and scripts that enhance the testing setup
```
