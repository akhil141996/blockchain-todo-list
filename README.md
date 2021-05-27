# To build this project -

## Install Metamask in your chrome extension
Open Metamast and switch the network to localhost:8545

## Download Ganache - https://www.trufflesuite.com/ganache
Run the ganache blockchain - Quickstart.
Copy the mneumonic from ganache and import that seed phrase into your metamask account.
You should be seeing all the accounts in your metamask account now.

## Install Truffle globally to migrate or deploy contracts 
npm install -g truffle

From the root of the application type:
truffle migrate --reset 

This should migrate the contracts to the ethereum blockchain.

## Run the client application
Go to the client folder and run the application using `npm start`
