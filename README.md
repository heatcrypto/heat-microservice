<b>Note! `subscriber.onComplete` method is not yet functional, all other parts are working, Please use `subscriber.onAdd` until further notice.</b>

# Heat Developer Kit (HDK)

Built real-time blockchain applications (microservices) on HEAT with the HDK.

Write your blockchain applications in developer friendly TypeScript, add them to your local HEAT server `scripts` 
folder and expose your real time application to the world.

## Complete programming environment

We believe we've gone the extra mile to make programming HEAT microservices as easy and as productive as possible.

We envision a future where decentralized blockchain based applications will give birth to a whole new eco system on itself, where traditionally 
complex client facing services like accepting payments in any currency from anyone customer in the world or offering decentralized escrow
services with bank grade levels of security, becomes available to anyone who wants to create and operate such a service.

The HEAT core server is written in Java, which is a wonderful language for our needs, but most likely not for the majority of
all potential HEAT microservice developers. Java involves external libraries, a compiler, you need to package your final code 
and when coding for instance directly against HEAT core, basically a lot can go wrong.

Developing microservices is in many ways much easier, we've basically done most of the work that involve creating powerful blockchain based
applications for you, all you need to do is come up with an idea and in most cases with just a few lines of code and your idea can become reality. 

When you combine all that with our choice of [TypeScript](https://www.typescriptlang.org/) as the main language and our
complete one click solution to both test and deploy your microservices. 

Well you do the math what becomes possible now.

### Tooling

For anyone doing a job the right tools to do your job are essential, the same goes for developers writing blockchain based microservices.

Your main tool when creating microservices will be Visual Studio Code, which is Microsoft's _Open Source_, _Free_ and _Cross Platform_ version 
of its development platform (VSCode runs on Windows, Mac OS, Linux and in the future probably even in your browser!). 

__Fun fact!__ Heat Desktop Wallet is built on the same platform as Visual Studio Code ([Electron](https://electron.atom.io/)), which is from the creators of
[Github](https://github.com/).

VSCode together with the HDK allows you to easily write, test, debug and build your microservices. All in one nice package.

![heat global autocomplete](http://i.imgur.com/lnulBEf.gif)

## Technology

HEAT is a cryptocurrency, but HEAT also is an application development platform that allows anyone to built blockchain 
driven real-time applications which are backed by the fast and decentralized HEAT network.

Applications for HEAT are written in [TypeScript](https://www.typescriptlang.org/) (which is a __much better__ type of 
JavaScript) which is compiled to JavaScript and loaded __into__ HEAT by placing your compiled JavaScript in the `scripts` folder.

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

HEAT applications offer the power of Java and the flexibility and overall joy of working with easy to use TypeScript.

# Installation

To get started writing HEAT applications you need to prepare your development environment, wheter you are developing on Linux, Mac or 
Windows the steps involved are roughly the same.

## Install Visual Studio Code

Microsoft Visual Studio Code is a __**free**__ and __**opensource**__ developer suite which we use to develop TypeScript applications.

We highly recommend using Microsoft Visual Studio Code for your TypeScript development since it works very well, is free, opensource and cross platform.

TypeScript however is a mature language and is supported by [many development tools](https://www.slant.co/topics/5815/~ides-for-typescript-development).

Visit [https://code.visualstudio.com/](https://code.visualstudio.com/) to download and install Visual Studio Code.

## Install Git

If you don't have git installed, install it now. Follow the link that matches your platform.

[Install Git on Mac OS X](https://www.atlassian.com/git/tutorials/install-git#mac-os-x)

[Install Git on Windows](https://www.atlassian.com/git/tutorials/install-git#windows)

[Install Git on Linux](https://www.atlassian.com/git/tutorials/install-git#linux)

## Clone HDK

To write HEAT applications you always start by cloning the HDK. The HDK comes with a collection of base libraries to make writing HEAT 
applications easier plus a collection of development tools that assist you to compile, package and test your microservices.

By sticking to the preferred project layout and starting with a clone of the official heat-dev-kit, as a bonus you get the possibility
to always and easily update to the latest version which is compatible with the latest HEAT server implemtations.

To clone the HDK to your local machine we use Git. Do the following to proceed.

Navigate to where you want to put your clone of the HDK, now clone the HDK repository.

`$ git clone https://github.com/Heat-Ledger-Ltd/heat-dev-kit.git`

Find your private clone of the HDK in the `heat-dev-kit` folder, you will be coding your microservice in the `heat-dev-kit/src/microservice/[MICROSERVICE NAME HERE]` folder.

Navigate to the `heat-dev-kit` folder.

`$ cd heat-dev-kit`

## Install Node.js and npm

Node.js is a JavaScript runtime environment. The HDK uses Node.js to run it's compilation and package scripts.

NPM is the Node Package Manager, it's a software tool that runs on Node.js and helps you install other Node.js packages.

If you don't have Node.js and NPM installed, install them now. Follow the link that matches your platform.

[Install Node.js on Mac OS X](http://blog.teamtreehouse.com/install-node-js-npm-mac)

[Install Node.js on Windows](http://blog.teamtreehouse.com/install-node-js-npm-windows)

[Install Node.js on Linux](https://nodejs.org/en/download/package-manager/)

## Use npm to install developer dependencies

The last stap in our one time setup is to install the developer dependencies, for this we use `npm` which we installed in the previous step.

Navigate to the `heat-dev-kit` folder.

`$ cd heat-dev-kit`

Now install all dependencies, what dependencies will be installed can be seen in heat-dev-kit/package.json. Run the following command.

`$ npm install`

Finally install the (gulp)[http://gulpjs.com/] command line tool globally. 

Run the following command to install gulp command (note that it could be that you have to run this command as root).

`$ npm install --global gulp-cli`

# Microservices

Applications built with the Heat Developer Kit are what we call microservices.

The term is two fold:

- micro stands for the fact that each microservice does just one (small) task and has a small footprint in the amount
of code involved
- service stands for a microservice doing something for you when you request it to

## Service Pattern

When writing a microservice you start by creating its main implementation file, this is done by deciding on a unique id for your service
and creating a folder in your cloned heat-dev-kit repo `src/microservices/[unique id]`. In this folder create a file called service.ts.

![Create sample service](http://i.imgur.com/LiG5kAZ.gif)

To create a minimal working microservice place the following in the `service.ts` file you just created. The `console.log(..)` statement is 
added so we can see it works when we test run it.

```typescript
module microservice.sample {
  @MicroService('sample.service')
  class SampleService extends AbstractMicroService {
    constructor(private config: any) {
      super();
      console.log("Sample microservice says: Hello!");
    }
  }
}
```

The contents are important as they register the microservice with the HEAT server script manager and they determine the namespace within
which your microservice operates, this shields your implementation from interfering with other microservices.

At the top we declare the [TypeScript module](https://www.typescriptlang.org/docs/handbook/modules.html) within which your code will live, note
that its name starts with `microservice.` which is required for all microservices, and it ends with the name of your service in lower case.

```typescript
module microservice.sample { ... }
```

Inside the module declaration we declare the [TypeScript class](https://www.typescriptlang.org/docs/handbook/classes.html) that implements your 
service, the name of the class `SampleService` in this case is not important, you can name it anyway you want. Not required but recommended is that
your implementation class extends the `AbstractMicroService`. More on that later.

Above the class declaration is the `@MicroService('sample.service')` [TypeScript decorator](https://www.typescriptlang.org/docs/handbook/decorators.html),
this is an important step since it registers the service with the script manager by the id you provide. Decorators are much like Java Annotations which
is a sort of meta programming and one of the things that make TypeScript the powerful language it is.

```typescript
@MicroService('sample.service')
class SampleService extends AbstractMicroService { ... }
```

Microservices are enabled and configured through a central configuration file, the configuration contains the id's of your microservices (`sample.service` in
this case) and the configuration parameters with which it runs. When the HEAT server script manager starts it will create and initialize registered 
microservices, when it does this it passes the configuration parameters defined in the central configuration file as an `Object` to your microservice
class constructor.

The `constructor(private config: any) {}` statement in the `SampleService` is TypeScripts way to allow code to run on class creation, the word private in 
`(private config:any)` is TypeScripts way of saying: "Create a property on this object with the name 'config' and assign the parameter value". Other options
are public or protected, these either make the property a public or protected property. Since we extend the `AbstractMicroService` class we have to
add a call to `super();` at the top of the constructor, TypeScript requires this. If you are not extending `AbstractMicroService` you can omit that.

No worries if you don't understand all of that yet, this is probaly as complex as it get, it's downhill from here on.

```typescript
class SampleService extends AbstractMicroService {
  constructor(private config: any) {
    super();
  }
}
```

## Testing your service

After you've created your microservice we will want to run it to see if works. The Heat Developer Kit comes with a set of command line tools that allows you
to run or test your service right from the Visual Studio Code's embedded terminal. More on that later.

First we'll start by creating a new file named `src/microservice/test.ts`.

![Create test.ts](http://i.imgur.com/Vxz3F4O.gif)

To test our sample service put the following code to your new `test.ts` file.

```typescript
module microservice.sample {
  export function test() {
    microservice.manager().runService('sample.service', {});
    heat.exit();
  }
}
```

The line that says `microservice.manager().runService('sample.service', {})` is how from tests we create and initialize microservices, the runService method
accepts two arguments; 1. the id of the service (see @MicroService('sample.service')), 2. the configuration object which is passed to the SampleService constructor
(remember this the same data that is later placed in the central configuration file - for tests we however have to enter that manually).

The other line that says `heat.exit()` shuts down HEAT server, if we would omit that statement HEAT would start and remain running, for tests most of the time you don't want that.

For tests its best to use the same module name `module microservice.sample` as for the service we are testing. A `test.ts` file can contain multiple tests, for 
simplicity we named our one test `test`, but it could have been any name and if you want you can add parameters to your test function.

In order to run our tests we need two things.

1. A properly configured development setup (if you've followed the installation instructions you already have that)
2. A copy of HEAT server edition

If you don't already have HEAT server go and download the latest version now, get it here [HEAT server](https://github.com/Heat-Ledger-Ltd/heatledger/releases). 

When you've downloaded the `heatledger-x.x.x.zip` file (x meaning latest version number) make sure you save and extract it to an easily accessible location, preferably
to a location with a short file path, no spaces in the file path is recommended.

In order to run the test we just created we need to first find the filepath to the HEAT server installation folder, the installation folder can be identified as follows:

1. The installation folder name starts with `heatledger` optionally followed by a version number
2. The installation folder contains at least the following directories. `bin`, `config`, `lib` and `scripts`

After you found the path to your HEAT server installation you need to one time add that to your heatledger config, in order to do that create a file
called `heatledger.json` in the root directory of this project.

![Create heatledger.json](http://i.imgur.com/AyUi2Sg.gif)

Place the following contents in `heatledger.json`, you need to edit the part that says `/path/to/heat/installation/directory` and replace it with the path to the
HEAT server installation directory.

```json
{
  "dir": "/path/to/heat/installation/directory"
}
```
 
To test your configuration do the following; either press CTRL+\` or in the Visual Studio Code menu bar click `View / Integrated Terminal`. When the terminal opens
enter the following command `gulp verify`. If your configuration is correct it will say so, if its not follow the instructions in the terminal until all is correct.
 
![Run gulp verify](http://i.imgur.com/GWPyHmI.gif)

Now we are ready to test our microservice, remember our test function was in the module `microservice.sample` and the function name is `test`. To run that test we open
the terminal and execute the following command: `gulp test --run "microservice.sample.test()"`. If you thought the argument for the `--run` parameter looked like 
javascript, you are correct. The HEAT server after bootstrapping takes the `--run` parameter and evaluates that in the same JavaScript engine where it 
loaded your microservices.

Lets try it:

![Run gulp test](http://i.imgur.com/a8itVwv.gif)

And as you see it prints `Sample microservice says: Hello!` which we coded in our microservice. You have succesfully created your first microservice, a test and you
can run that test from the command line.

The `gulp test` command also supports these commands (nice to know, but not important so skip when reading for first time)

- --heatdir Absolute path to heat installation directory.
- --run The script to execute, must be surrounded in quotes ("..")
- --config The path to a json document whose contents will be encoded to a single line string
  and are passed to HEAT server as the --properties argument, each property in the 
  json object will be added to HEAT configuration properties.
- --verbose When provided will also include all console output from heat server,
  otherwise only console output from your script is shown.
- --mode Either; main, test or fake (default)

## Behind the scenes

While developing and especially debugging your microservices some knowledge of what happens behind the scenes can help you in big ways.

Please take a moment to look at the console output. 

Firstly microservice outputs (like status or console.log() output) can be identified by the __*&lt;script&gt;*__ identifier at the start of the console output line.

If you look carefully you'll see which file the script engine loads, see `[23:36:33] <script> Load file: /home/dirk/git/heat-dev-kit/dist/index.js`. That file is the
result of the TypeScript compiler combining and compiling all the TypeScript files and producing the JavaScript file that the HEAT script engine loads. 

```bash
➜  heat-dev-kit git:(master) ✗ gulp test --run "microservice.sample.test()"
[23:36:31] Using gulpfile ~/git/heat-dev-kit/gulpfile.js
[23:36:31] Starting 'clean'...
[23:36:31] Starting 'ts2js'...
[23:36:32] Finished 'clean' after 350 ms
[23:36:32] Finished 'ts2js' after 1.08 s
[23:36:32] Starting 'build'...
[23:36:32] Finished 'build' after 14 μs
[23:36:32] Starting 'test'...
[23:36:33] <script> Load file: /home/dirk/git/heat-dev-kit/dist/index.js
[23:36:34] Starting HEAT server 1.0.1
[23:36:34] {"application":"HEAT","version":"1.0.1","platform":"PC","shareAddress":true}
[23:36:34] Running 2 tasks...
[23:36:34] <script> Run script: microservice.sample.test()
[23:36:34] <script> Sample microservice says: Hello!
[23:36:34] Shutdown hook triggered, initiating HEAT 1.0.1 shutdown
```

Looking at the file explorer in Visual Studio Code you'll see a new directory appeared named `dist`, please take a moment to inspect its contents so that you properly
understand how TypeScript works and how your code is compiled into the `dist/index.js` file.

![The dist folder](http://i.imgur.com/nbGEhcZ.png)

The `dist` folder contains two files.

1. The index.js file ([sample](https://gist.github.com/dmdeklerk/6ebb05d28ee28a70f99406c93711324d)) contains the compiled TypeScript
2. The index.map.js file ([sample](https://gist.github.com/dmdeklerk/d47a2d074170f447e6be3152310cb053)) is a sourcemap, sourcemaps are used to map errors in the 
generated JavaScript to the correct TypeScript file and line in your project.

We did our best to integrate sourcemap support into HEAT server script manager, this means most times when there is an error in your code, HEAT server script manager is
able to translate both the error location and most of the error stack frames to their actual file and line in your project. There are edge cases however where we cannot 
translate either an error location or a stack frame location. When this happens the actual (real) location of an error is reported which always is in the generated 
`dist/index.js` file, most of the times however its not too dificult to determine in what TypeScript file the actual error is from looking at the `dist/index.js` file.

When running tests from the integrated terminal in Visual Studio Code and an error is reported, you can CTRL+click on the file path in the console on both the error file 
and on all stackframe files and Visual Studio Code will jump to the affected file and line for your convenience.

## Runtime Environment

Microservices are translated to JavaScript and loaded in the Jave embedded JavaScript engine named Nashorn ([wiki](https://en.wikipedia.org/wiki/Nashorn_(JavaScript_engine))),
the code running in the JavaScript engine runs in the same memory as HEAT server. This means that from a microservice you can directly call any public method on all java 
classes that make up HEAT server.

With Nashorn microservices have access to the full java runtime, to make TypeScript (and by proxy VSCode) aware of all java interfaces and classes the HEAT server 
built system auto creates on each build a full set of TypeScript typings of selected set of java classes. 
See `src\typings\java.heatledger.interfaces.d.ts` ([sample](https://gist.github.com/dmdeklerk/b5363431e6f71994da6bc44b0ada874a)).

The generated typings are not actually part of the microservice runtime, instead they are used by the TypeScript compiler to validate your code to a high degree
before we pass it on to the HEAT javascript engine (this way we catch errors before running your code) and probably as important, they are used by VSCode to
assist you during coding. By Visual Studio Code knowing about all Classes, Methods, Parameters and Types it can help us code and increase productivity in huge
ways, not only will it tell you through popups or autocompletes what code you could write. It will instantly tell you as soon as you pass one to many parameters or
spell a method incorrectly. In short, this will save you A LOT of time.

For microservices HEAT server adds a single global variable to each runtime. This global variable is named `heat` and is an instance of
`com.heatledger.scripting.ScriptGlobalBinding`. Almost everything you do is done through the `heat` global variable, using it is easy, simply type `heat.` and make
a selection from any of the options. Further inspection can be done by CTRL+click on any option you select which will make Visual Studio Code jump to the TypeScript
typing for further inspection.

![Heat global autocomplete](http://i.imgur.com/jiNShrD.gif)

More specific details on coding in the Nashorn runtime environment can be 
[found here - nashorn API](https://docs.oracle.com/javase/8/docs/technotes/guides/scripting/nashorn/api.html),
in short it's pretty much the same as coding in any JavaScript runtime. But since the nashorn engine runs __inside__ Java there are some subtle differences
as well as some powerful additions not found in any other javascript engine. If reading about microservices for a first time, best to skip. But when you are
looking to make the most use of your app runnning in the Java engine, make sure to check back later.

## Blockchain Events

Most microservices respond to (certain selected) blockchain events, these could be transactions (both confirmed- and/or uncofirmed/real-time), blocks added or removed
or trades on the asset exchange.

To subscribe to blockchain events you use the global variable named `subscriber`.

A typical microservice that observes payments would look like this.

```typescript
module microservice.sample {
  var SERVICE = 'sample.service';
  @MicroService(SERVICE)
  class SampleService extends AbstractMicroService {
    constructor(private config: any) {
      super();
      subscriber.create(SERVICE).payment()
                                .recipient(config.account)
                                .confirmations(10)
                                .onConfirmed((event)=> {
                                  ...
                                })
                                .subscribe();
    }
  }
}
```

The code in the onConfirmed block will run when a payment to `config.account` was made and the transaction involved was not marked **COMPLETE** in the global
`TransactionStore` which can be found in `heat.transactionStore`.

The `TransactionStore` is a method to store any status or processed state about any transaction you ever process, we need this since a blockchain can be scanned 
again or you could redownload the blockchain and thus apply all its transactions again which causes our service event listeners to execute again. 
One piece of data in the `TransactionStore` is important and automatically handled for you, the **COMPLETE** marker.

The subscriber mechanism will always make sure your `onConfirmed` listener only executes once, no matter if the code in `onConfirmed` is successfull or if it crashes, 
__before its invoked__ it will already be marked **COMPLETE**. If you want to override this behavior and determine yourself if the transaction is **COMPLETE** or that 
you wish to process the transaction again on a rescan. You must set COMPLETE=FALSE in the `TransactionStore` to have it processed again the next time.

Example of setting **COMPLETE** marker for transactions with id `event.transaction.id` to false. Note that if you do this the subscriber mechanism will fire
`onComplete` again the next time it 'sees' your transaction.

```typescript
  .onComplete((event)=> {
    heat.transactionStore.setEntryValue(SERVICE, event.transaction.id, subscriber.COMPLETE, subscriber.FALSE);
    ...
  })
```

When subscribing to blockchain events you'll use one of the builders on `subscriber`. Each builder requires a service id so that it can uniquely store the **COMPLETE**
state for processed transactions.

The `event` argument to the `onComplete` (and `onAdd` + `onRemove`) callback is of type `Java.com.heatledger.scripting.NativeTransactionEvent`. Two properties are important
on this type which are `unconfirmed`, a boolean property indicating this transaction is either confirmed (on the blockchain) or unconfirmed, and the `transaction` property
which is of type `Java.com.heatledger.Transaction`. Again, use Visual Studio Code code complete and type inspection to see what properties are available.

Through auto complete we can see which events can be subscribed too.

![Subscriber auto complete](http://i.imgur.com/QMp9YqD.gif)

Once you've created the builder you can assign various event filters (`confirmations`, `recipient`, `sender`, etc..)
that limit when the event will fire. 

You would also assign code blocks that react to the events. 

For `payment`, `message` and `assetTransfer` these event listeners exist.

1. `onComplete`, this is the event listener you would most likely use. It has to be used in combination with setting `confirmations`.
   It's also this event listener which automatically handles the **COMPLETE** status for your processed transactions.
2. `onAdd`, this event listener is more low level. It fires whenever a transaction is processed, which could be the case even when
   a rescan is done or when switching forks and downloading blocks. If you set `unconfirmed(true)` on the builder this event
   will also fire for unconfirmed transactions (this means its instant or real-time).
3. `onRemove`, low level event that you will most likely not use. It is called whenever a transaction is removed from the unconfirmed
   pool and added to a block. Or when a transaction got removed since its block got popped.
   
When observing orders on the asset exchange things are a bit different, to create the order subscriber we use the `order()` builder.
For the order subscriber builder these event listeners exist.

1. `onCreate`, this event is fired when a new order is created. To see orders in real-time make sure you set `unconfirmed(true)`.
2. `onUpdate`, whenever a trade is made both the seller and buyer orders have their quantities updated, you can detect this
   by subscribing and adding an `onUpdate` listener.
3. `onDelete`, this event fires either when an order got cancelled or expires. Or when the order was matched entirely and it was removed.

We can also subscribe to and oberve trades on the asset exchange with the `trade()` builder, also real-time unconfirmed trades could be observed when you set the
`unconfirmed(true)` filter to true. For trades you can observe just one event; `onAdd`.

1. `onAdd`, this event listener is fired when a trade occurs. If you don't set `unconfirmed(true)` this event will fire the moment the trade is 
   included in a block. If you do accept unconfirmed trades you will be notified in real-time the moment the trade hits the network.

Finally there is the `block()` subscriber builder, through this you can observe blocks being added (or removed) from the blockchain. Two events can be 
observed:

1. `onPush`, this is fired whenever a new block is pushed (added to the blockchain). It could be because of the nature of a blockchain that you see this event 
   multiple times this happens for instance when we switch to a better fork only to decide the fork is not better afterall and your old block is `pushed` again.
2. `onPop`, this is fired whenever a block is popped (removed from the blockchain). As with `onPush` this event can occur multiple times. When observing both 
   `onPush` and `onPop` you can keep track of exactly what blocks are on the blockchain.

### Unsubscribing Events

To unsubcribe a previously subscribed event you need to catch the return value from the `subscribe()` method on each of the subscriber builders. Calling that
method will unsubscribe the event.

```typescript
let builder = subscriber.create(SERVICE).block().onPush((event)=> {
  ...
});
let unsubscribe = builder.subscribe();
unsubscribe(); // this unsubscribes your event listener
```

## Creating/Broadcasting Transactions

An important part when creating microservices is creating transactions and sending them to the HEAT network. When looked from above there are two things involved
in blockchain based applications or basically any kind of application. There is the part where we observe (or **READ**), in our case this is done through
subscribing to events (or manually by iterating over existing blocks, transactions, accounts, trades, orders, etc..). The other part involves **WRITING** (or updating)
data, in blockchain terms this part can be considered as sending a transaction.

To create, sign and broadcast transactions we use the global `transactionBuilder`. Its usage is straight forward and works similar to the `subscriber` builder pattern.

Lets see if we can improve the sample service, to keep things simple we'll subscribe to payment events directed to an account we control, 
now as soon as we receive a payment in HEAT we award the payment sender with the same amount of an asset we created. 

We'll use the `transactionBuilder` to create and broadcast an asset transfer transaction.

![Send asset on payment](http://i.imgur.com/4sXLIjN.gif)

Thats simple right! 

### Message Attachments

All transaction types can be created through the `transactionBuilder`. Shared among all different builders is the ability to attach public and encrypted messages to
each kind of transaction. Attaching messages also has been made as simple as possible. There are three types of messages you can attach to a transaction:

1. Public message, these messages can be either binary or text and are readable by anyone.
2. Encrypted message, these messages are encrypted and only readable by you and the recipient.
3. Encrypt to self message, this message type is only readable by you.

Attaching any one type of message is easy and is done through the `transactionBuilder`. Simply use `message`, `encryptedMessage` or `encryptToSelfMessage` methods
on anyone of the transaction builders and have your message attached to your transaction.

![Attach message to payment](http://i.imgur.com/YpfM42J.gif)

## External Data

One of the strengths of microservices is its ability to connect to virtually every other service out there;

1. Got a legacy enterprise database? No problem, microservices can do everything Java can do, there are java connectors for virtually every database vendor out there.
2. Want to connect to some internet data source? No problem, there are Java libraries available for virtually every internet protocol that exists.
3. Need to connect to some IOT device? Again no problem, Java got you covered.

To make things even simpler for one of the most used protocols (HTTP protocol), microservices exposes easy access to `okhttp` HTTP & HTTP2 client which is included
and exposed by HEAT server. The OkHTTP ([website](http://square.github.io/okhttp/)) HTTP client has been adopted by [Android](https://www.android.com/) as its default HTTP 
client and is available to you from your microservice scripts.

Usage is simple through `heat.createHTTPClient()`, lets see if we can get the latest BITCOIN price from the blockchain.info API.

![Test HTTP microservice](http://i.imgur.com/LGYBDfQ.gif)

At this time GET and POST request are supported, if you need access to other protocols or need to do other types of request you can do so already, just follow the 
instructions in the Nashorn engine documentation to access any of the Java classes you would need.

## Extend the HEAT API

With microservices you can also easily extend the HEAT core server HTTP API, what this means in practice is that you can directly access your microservice running in 
HEAT server by exposing one or more `routes` to the outside world. 

Through this mechanism outside parties or you yourself can directly invoke functionality defined in your microservice. Data could be gotten out your service and 
information could be put in with minimal effort.

Lets see how this works through an example. Imagine the most simple microservice, which does nothing basically.

```typescript
module microservice.sample {
  @MicroService('sample.service')
  export class SampleService {
    constructor(private config: any) {}
  }
}
```

There thats it, we have a microservice that does nothing, for now. Now imagine your microservice doing a payment to some account. As we've seen previously
this is pretty easy actually. Imagine the following method added to your service, it accepts a recipient and a payment amount.

```typescript
   sendPayment(recipient: number, amount: number) {
     heat.transactionBuilder.payment(this.config.secretPhrase)
                            .recipient(recipient)
                            .amountHQT(amount)
                            .broadcast();
   }
```

More logic could be added of course, but lets keep it simple. Now the question becomes, once your microservice is runnning in your HEAT server, how could
we call this method? We could write a test of course using the `gulp test --run "your code here"` and run it from the command line. But this wont work,
at least not when we need to call this method in a running HEAT server, from for instance a php/perl/nodejs/bash script we have.

What we want is to __expose__ our one microservice method, which can be done with a single line of code. If above the `sendPayment` method we add the 
microservice Api annotation `@Api('GET', 'sample/sendpayment/:recipient/:amount')` the microservice script manager will make sure your microservice
will be configured with the HEAT HTTP API so that when you call:

http://heat-server-host:api-port/microservice/sample/sendpayment/1234539893839883/100000

Now HEAT will forward your HTTP GET request and even parse the URL parameters and forward them to your microservice. Lets look a full example.

```typescript
module microservice.sample {
  @MicroService('sample.service')
  export class SampleService {
    constructor(private config: any) {}

    @Api('GET', 'sample/sendpayment/:recipient/:amount')
    sendPayment(recipientParam: string, amountParam: string) {
      let recipient = Long.parseUnsignedLong(recipientParam);
      let amount = Long.parseLong(amountParam);
      heat.transactionBuilder.payment(this.config.secretPhrase)
                             .recipient(recipient)
                             .amountHQT(amount)
                             .broadcast();
    }    
  }
}
```

If you look closely you'll see we changed the `sendPayment(recipientParam: string, amountParam: string)` method signature slightly, important to understand is
that whenever you expose a microservice method as an external HTTP API you must always expect your parameters to be of type `string`. Conversion from `string`
to Java Long types is not difficult however, as you see using the global `Long` variable does just that.

You can also make your microservice responde to HTTP POST messages, to do this you'll pass 'POST' as the first parameter of the @Api annotation and add one
extra parameter to your method for the POST BODY variable (which is also string).

Here's an example:

```typescript
  @Api('POST', 'sample/post/:urlArg')
  postData(urlParam: string, bodyParam: string) {
    let body = util.postBodyToJson(bodyParam);
    ...
  }
```

As can be seen the method now accepts two parameters, yet the `path` only contains one (the `:urlArg` part). The first parameter will receive the value in the URL,
the second parameter is the raw `POST body`. The call to `util.postBodyToJson(bodyParam)` is for your convenience, when the body consists of JSON data it will
parse it. If however the body is encoded as `application/x-www-form-urlencoded` it will parse that and return it as a JSON object.

## Websockets

Microservices also support real-time websocket connections. For this we piggy back on the existing websocket support in HEAT server, the URL for this depends on
your configuration in HEAT server config (usually located at `config/heat.properties`).

As an example, the main HEAT testnet public facing server has `wss://alpha.heatledger.com:7755/ws/` as its URL. The variable parts are the following:

- `wss://` in our case we use a secure connection which is why we use wss, in case you would not run with SSL enabled this would be ws://
- `alpha.heatledger.com:7755` these are your host and port, 7755 is the default websocket port
- `/ws/` this is the heat standard websocket path, you would likely not change this

HEAT core websocket server comes with a subscriptions mechanism, you would subscribe to `topics` by sending a message to the websocket server.

The subscription protocol works as follows; you will be subscribing to a variable filter. Lets say your filter looks like the following:

```json
{
  "name": "hello"
}
```

Now when a microservice sends a message to listening websockets that contains **ALL** parts of your filter, you would receive that message. A microservice
could send a message with the following filter and you would receive it.

```json
{
  "name": "hello",
  "age": 45,
}
```

Note that if your filter (while subscribing) also contained `"city":"paris"` you would not receive the message since the sender would determine your filter
to not match the filter of the sending microservice.

On the client (we're using javascript for our sample) to create a subscription message you would do the following (notice how its all JSON, and its parsed as 
such on both ends):

```javascript
let websocket = new WebSocket(`wss://alpha.heatledger.com:7755/ws/`);
let topic = JSON.stringify(["subscribe",[["8",{"name": "hello"}]]]);
websocket.send(topic);
```

The string "8" and the way its wrapped in an two array literals is important so that HEAT server understands your subscription and correctly matches it to
the microservices. To subscribe to multiple topics with one message you would be adding more `["8",{}]` to the mix, for instance like this:
`["subscribe",[["8",{"name": "hello"}],["8",{"name": "dirk"}]]]`

To unsubcribe from a topic you would send the following JSON; `["unsubscribe",[["8",{"name": "hello"}]]]`. Also multiple unsubscribe topics can be combined.

From your microservice, pushing messages to subscribed websocket clients is even easier. Use the `heat.websocket.send()` to instantly update all connected
clients from a single call.

Lets say we want to push a message to all subscribers to the `{"name": "hello"}` topic. Messages always come in the shape of Object.

```typescript
heat.websocket.send({"name": "hello"}, {"this":"is send", "to":"all subscribers"});
```

## Replicators (blockchain backed SQL database)

Replicators is a feature used **a lot** in HEAT, for microservices we've ported and simplified this. 

With HEAT replicators you can create real SQL database tables (mysql/h2/postgress etc..)! What is special for replicators is that your data is stored 
permanently on the blockchain first before its picked up by the replicator and neatly placed in the right parts in the database. Replicators work with
all types of transactions and can store their data encrypted if needed.

All that is expected from you is to provide is the code that translates your domain objects to `transaction bundles` and back to objects, as well as the 
definitions for your SQL tables and the SQL INSERT logic.

Lets explain this with a simple example; imagine we wanted a SQL table of customers. 

We would start with the two most important parts:

1. The definition of a `Customer`
2. The code to encode/decode a customer to/from a (encrypted) binary transaction message.

```typescript
interface Customer {
  name: string;
  address: string;
}
class CustomerReplicatorBundle extends BundleMessage<Customer> {
  constructor() { super(1234567) }
  encode(customer: Customer, buffer: ScriptableByteBuffer) {
    buffer.putString(customer.name);
    buffer.putString(customer.address);
  }
  decode(buffer: ScriptableByteBuffer): Customer {
    return { name: buffer.getString(), address: buffer.getString() };
  }
}
```

Transactions and their attached messages are just byte arrays, the code above shows you how to turn an Object (Customer in our case) into a set of 
bytes, and vice versa to an object again. To uniquely identify your binary `Customer` object from any other message on the blockchain we define
a unique `seed`, this can be seen in `constructor() { super(1234567) }` where we set the id to `1234567`. Make sure to pick a unique id!

Our replicator who does the actual work would use the `BundleMessage` we just created. Lets look at that.

```typescript
class CustomerReplicator extends AbstractBundleReplicator<Customer> {
  constructor(secretPhrase: string) {
    super({
      id: 'customer',
      includeUnconfirmed: true,
      bundle: new CustomerReplicatorBundle(),
      secretPhrase: secretPhrase
    });
    this.update(`
      CREATE TABLE IF NOT EXISTS customer (
        transaction_id BIGINT NOT NULL, 
        name VARCHAR NOT NULL, 
        address VARCHAR NOT NULL
      )
    `);
    this.update('CREATE UNIQUE INDEX IF NOT EXISTS transaction_id_customer_idx ON customer (transaction_id)');
    this.update('CREATE UNIQUE INDEX IF NOT EXISTS name_customer_idx ON customer (name)');
  }
}
```

All replicator objects [or sql tables] would extend the `AbstractBundleReplicator` class as can be seen on the first line in
`class CustomerReplicator extends AbstractBundleReplicator<Customer>`. The object passed to the call to `super()` is called the 
`BundleReplicatorConfig`, please use Visual Studio Code autocomplete or IDENTIFIER+CTRL+CLICK to inspect what other parameters can 
be provided. Mandatory for `BundleReplicatorConfig` are the `id` and `bundle` properties, the `bundle` would refer to the decoder/encoder
class we created earlier and the `id` has to be a unique name for your replicator which is used by the database schema versioning manager.

The calls to `update(sql)` are collected and applied before HEAT server is started, if you wish to include updates to your database
schema at a later time simply add more calls to `update`. But make sure to add them after all other `update` calls in order for the 
version manager to apply them correctly, updates will be applied only once.

What remains is implementing three abstract methods on `AbstractBundleReplicator` after which HEAT server knows enough to 
keep your database table in perfect sync the blockchain.

Lets see what that looks like:

```typescript
class CustomerReplicator extends AbstractBundleReplicator<Customer> {
  public clear() { ... }
  public add(customer: Customer, event: Java.com.heatledger.scripting.NativeTransactionEvent) { ...  }
  public remove(customer: Customer, event: Java.com.heatledger.scripting.NativeTransactionEvent) { ... }
}
```

In order to keep a blockchain backed database table in sync we need to determine what happens when the blockchain is rescanned (@see `clear`),
when a customer is added (@see `add`) and when a transaction is removed (blockchain reorg/wind back) (@see `remove`).

To assist you implementing these methods we expose the global `db` variable. Lets see how simple a complete implementation could be with
actual SQL statements included.

```typescript
class CustomerReplicator extends AbstractBundleReplicator<Customer> {
  public clear() {
    db.batch(['TRUNCATE TABLE customer']);
  }
  public add(customer: Customer, event: Java.com.heatledger.scripting.NativeTransactionEvent) {
    db.statement('MERGE INTO customer (transaction_id, name, address) KEY (transaction_id) VALUES(?,?,?)', (pstmt) => {
      pstmt.setLong(1, event.transaction.id);
      pstmt.setString(2, customer.name);
      pstmt.setString(3, customer.address);
      pstmt.executeUpdate();
    });
  }
  public remove(customer: Customer, event: Java.com.heatledger.scripting.NativeTransactionEvent) {
    db.statement('DELETE FROM customer WHERE transaction_id = ?', (pstmt) => {
      pstmt.setLong(1, event.transaction.id);
      pstmt.executeUpdate();
    });
  }
}
```

The `db.batch` call will execute your SQL statements, we'll use this when we want to clear the database when the blockchain is being
rescanned, dont worry about your data, deleting the table should not be an issue since the following rescan will re-populate your table.

The `db.statement` call is used when need a java `PreparedStatement` which has to be populated with parameter data before we excute the
SQL update. By wrapping your code in a closure the java parts can handle all your connection open/close logic so no open database connections
will be left laying around.

Now that we've got a blockchain backed SQL table, what would be greater than getting the actual data out for us to use? Well no worries, replicator
has you covered here also. Lets see how we can get one entry or all entries out of our blockchain backed database.

```typescript
class CustomerReplicator extends AbstractBundleReplicator<Customer> {
  public getCustomerByName(name: string): Customer {
    return db.select('SELECT transaction_id, name, address FROM customer WHERE name = ?', (pstmt) => {
      pstmt.setString(1, name);
      let result = pstmt.executeQuery();
      if (result && result.next()) {
        return { name: result.getString('name'), address: result.getString('address') }
      }
    });
  }
  public getAllCustomers(from: number, to: number): Array<Customer> {
    let customers = [];
    db.iterator('SELECT transaction_id, name, address FROM customer ' + db.limitsClause(from, to),       
      (pstmt) => {    // setup and execute the query
        db.setLimits(1, pstmt, from, to);
        return pstmt.executeQuery();
      }, 
      (result) => {   // translate a sql result to a Customer
        return { name: result.getString('name'), address: result.getString('address') }
      }, 
      (iterator) => { // use the fully setup and translated iterator here, collects all customers
        iterator.forEachRemaining(c => {
          customers.push(c);
        })
      }
    );
    return customers;
  }  
}
```

To get data 'out' of our replicated tables we would use `db.select` for single results or `db.iterator` for result sets. What this last sample also
shows is how beatifully compact code can be written when we combine Java + Nashorn(JS) + TypeScript.

Lets see if we can test this code and see if it runs. The `microservice.shop` test code can be found
[here](https://github.com/Heat-Ledger-Ltd/heat-dev-kit/blob/master/src/microservice/shop/test.ts). The `shop` microservice can be
[seen here](https://github.com/Heat-Ledger-Ltd/heat-dev-kit/blob/master/src/microservice/shop/service.ts).

![Run shop test](http://i.imgur.com/Y3MD3s2.gif)

## And...

There is quite a lot more to describe but we'll leave that for when we launch on main net.