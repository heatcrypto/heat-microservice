<h1 style="color:red"><b><u>UNDER CONSTRUCTION</u></b></h1>
<span style="color:red"><b><u>This repository is under active development and in the process of migrating 
our internally developed version of the HDK to this new public web-home.</u></b></span>

<hr>

# Heat Developer Kit (HDK)

Built real-time blockchain applications on HEAT with the HDK.

Write your blockchain applications in developer friendly TypeScript, add them to your local HEAT server `scripts` 
folder and expose your real time application to the world.

### Technology

HEAT is not just a cryptocurrency, HEAT is an application development platform that allows anyone to built blockchain 
driven real-time applications which are backed by the fast and decentralized HEAT network.

Applications for HEAT are written in [TypeScript](https://www.typescriptlang.org/) (which is a __much better__ type of 
JavaScript) which are compiled automatically to JavaScript and loaded __into__ HEAT by placing your compiled JavaScript in the `scripts` folder.

When HEAT sees your application it loads it in the [Java embedded JavaScript engine (Nashorn)](https://en.wikipedia.org/wiki/Nashorn_(JavaScript_engine)) 
which makes your application 'part' of HEAT. 

A side effect of using the Java JavaScript engine is that your code, while coded in TypeScript, basically runs as scripted Java which
exposes all standard Java classes including all core HEAT Java classes to your application. 

Through this mechanism HEAT applications can do anything a full-on Java application can do, expect with your HEAT application to:

* Connect to __any__ type/make of database
* Connect to __any__ legacy system using __any__ protocol supported by Java
* Use Java's __superior multi-threading__ support (not available in other JavaScript runtimes)
* Directly interface with HEAT and have __real-time__ instant notifications of __everything__ that happens on the HEAT network
* Create __any__ type of HEAT transaction
* Connect to __any__ other HEAT server on the network

HEAT applications offer the power of Java and the flexibility and overall joy of working with TypeScript. 

# One time setup

To get started writing HEAT applications you need to prepare your development environment, wheter you are developing on Linux, Mac or 
Windows the steps involved are roughly the same.

### Install Visual Studio Code

Microsoft Visual Studio Code is a __**free**__ and __**opensource**__ developer suite which we use to develop TypeScript applications.

We highly recommend using Microsoft Visual Studio Code for your TypeScript development since it works very well, is free, opensource and cross platform.

TypeScript however is a mature language and is supported by [many development tools](https://www.slant.co/topics/5815/~ides-for-typescript-development).

Visit https://code.visualstudio.com/ to install Visual Studio Code. 

### Install Git

If you don't have git installed, install it now. Follow the link that matches your platform.

[Install Git on Mac OS X](https://www.atlassian.com/git/tutorials/install-git#mac-os-x)

[Install Git on Windows](https://www.atlassian.com/git/tutorials/install-git#windows)

[Install Git on Linux](https://www.atlassian.com/git/tutorials/install-git#linux)

### Clone HDK

To write HEAT applications you always start by cloning the HDK. The HDK comes with a collection of base libraries to make writing HEAT 
applications easier plus a collection of development tools that assist you compile, package and test your HEAT applications.

To clone the HDK to your local machine we use Git. Do the following to proceed.

```
# navigate to where you want to put your clone of the HDK
# now clone the HDK repository
$ git clone https://github.com/Heat-Ledger-Ltd/heat-dev-kit.git

# you can now find your private copy
$ cd heat-dev-kit
```
### Install Node.js and npm

Node.js is a JavaScript runtime environment. The HDK uses Node.js run it's compilation and package scripts.

NPM is the Node Package Manager, it's software tool that runs on Node.js and helps you install other Node.js packages.

If you don't have Node.js and NPM installed, install them now. Follow the link that matches your platform.

[Install Node.js on Mac OS X](http://blog.teamtreehouse.com/install-node-js-npm-mac)

[Install Node.js on Windows](http://blog.teamtreehouse.com/install-node-js-npm-windows)

[Install Node.js on Linux](https://nodejs.org/en/download/package-manager/)

### Finally.. install developer dependencies

The last stap in our one time setup is to install the developer dependencies, for this we use `npm` which we installed in the previous step.

```
# first navigate to your local hdk copy
$ cd heat-dev-kit

# now install all dependencies
# what dependencies will be installed can be seen in heat-dev-kit/package.json
$ npm install
```

# Creating your first microservice

Please see https://github.com/Heat-Ledger-Ltd/heat-dev-kit/blob/master/src/microservice/gateway/service.ts for an actual working **ASSET to BITCOIN gateway microservice** in just 22 lines of effective TypeScript (lots of comments there to explain things).

Steps completed so far:

1. Automatic Java class to TypeScript generation (strong typing for all heat java classes and most java standard lib classes)
2. Java Nashorn sourcemap support built-in to heat server
3. Visual Studio Code test run integration (run your microservice from within vscode, includes clickable stacktraces on Nashorn errors)
4. Heat command line interface for running microservice (tests)
5. Microservice client framework
6. Gulp build pipeline which does your typescript compilation, sourcemap generation and runs heat server to execute tests

Next: Documentation. Stay tuned.