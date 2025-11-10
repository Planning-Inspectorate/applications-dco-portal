# Function
This package includes Azure Functions which are used for CBOS integration.

## Setup

* install azurite storage emulator with `npm install -g azurite`
* install azure-function-core-tools with `npm install -g azure-functions-core-tools@4`

See also [Code and test Azure Functions locally](https://learn.microsoft.com/en-us/azure/azure-functions/functions-develop-local?pivots=programming-language-javascript)

## Run

* Run `azurite` in a temporary directory somewhere as a storage emulator
* Run `npm run start` in `apps/function` to start the function(s)
