# feathers-auth-bug

> A project demonstrating the bug I&#39;m having with `feathers-authentication`.


## About

This project uses [Feathers](http://feathersjs.com), an open source web framework for building modern real-time applications. In particular, this demonstrates the issue I'm experiencing when using the `feathers-authentication` package.


## Setup

As usual, we can kick things off with a (sometimes-not-so) quick:

```
$ npm install
```

I've provided a Vagrantfile along with this code in case the environment is important when duplicating this bug.

This Vagrantfile will spin up an Ubuntu-15.10 box with a (mostly useless) chef provisioner and a bash provisioner. It will install PostgreSQL 9.3 and create a database called feathersAuthBug, then change the password for the database user `postgres` to whatever you specify in the `postgres-password` file (which is just a SQL command to change the password for the user). Make sure you put this password in `config/default.json` if you change it

After that's done, you should be able to:

```
$ vagrant up
```

Once up, tunnel into the vagrant box:

```
$ vagrant ssh
```

`cd` to the directory where our code is:

```
vagrant@vagrant:/$ cd /vagrant
```

Finally, we can start the server:

```
vagrant@vagrant:/vagrant$ nodemon -L
```

We now have our Feathers server running on Vagrant at `192.168.10.10:3030`, so we can head over there in our browser in just a moment.

I've already compiled the client-side code, but if you're going to make changes, I've got it configured for webpack (again, I recommend doing this outside the virtual machine since it's likely to be much faster):

```
$ webpack --progress --colors --watch
```


## Create Testing Data

We'll now need to run the database migrations:

```
$ sequelize db:migrate
```

I've created a little [Vorpal JS](http://vorpal.js.org/) utility to make things a little easier for creating and testing data, so we'll need to fire it up now:

```
$ node connect
```

We can do a few things in here (which you can see by issuing the `help` command), but the ones we're interested in are `create account` and `create user`. Give it those commands (in that order) and enter whatever information you like when prompted--it's not picky.

If you want to test the password you just entered, check out the `check password` command. It'll output whether or not the password you supply matches what's currently in the db.


## Test

Fire up your browser and head on over to `192.168.10.10:3030`. Enter in your login credentials. If they were incorrect, you'll get the output:

> Invalid username or password. Check the console log for details.

But if they were correct, you'll find something strange happening:

> Could not log in as [username]. Check the console log for details.

When you do so, you should find the object returned as `error` in `app.authenticate().catch(function(error) {})`.

Odd, isn't it?
