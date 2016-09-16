const vorpal = require('vorpal')();
const _ = require('lodash');

// Initialize app
// This seems a bit overkill since we don't need the server bit for this, but...
const app = require('./src/app');
const models = app.get('models');

// Get the models for easy access...
const User    = models['user'];
const Account = models['account'];


  //////////////////////
 // Helper functions //
//////////////////////

/**
 * Takes the searchParams, attempts to find a user, and if multiple are found,
 *  asks for a selection from a list.
 *
 * @param object searchParam  The parameters to send to the sequelize model
 * @param function callback   The function to call upon the single user selected
 * @param commandInstance     The current Vorpal commandInstance (typically
 *                             passed as this)
 */
function getUser(searchParams, includes, callback, commandInstance) {
  let params = { where: searchParams };
  if (includes)
    params.include = includes;

  User.findAll(params).then((users) => {
    // If there are multiple with that email, select the one from the list
    //  of accounts
    if (users.length > 1) {
      // Haven't tested yet
      commandInstance.prompt(
        {
          type: 'list',
          name: 'user',
          message: 'Looks like we found multiple users with this email; choose the user you want to change.',
          choices: users.map((u) => u.account.name)
        }, callback(result.user)
      );
    }
    else
      callback(users[0]);
  });
}



vorpal.command('test', 'A playground for testing the Vorpal environment.')
  .action(function(args, callback) {
    // User.belongsTo(Account);
    Student.findOne({ where: {
      "data.hispanic": { $eq: true }
    }}).then((student) => {
      console.log(student.data);
    });
  });



  //////////////////////////
 // End helper functions //
//////////////////////////



vorpal.delimiter('connect:');



vorpal.command('change email <oldEmail> <newEmail>', 'Changes the email of the user (and student / staff)')
.action(function(args, callback) {
  let { oldEmail, newEmail } = args;

  // Get the user model
  getUser({ email: oldEmail }, [], (user) => {
    user.email = newEmail;
    user.save();

    this.log('Changed email from ' + oldEmail + ' to ' + newEmail);
  });

  callback();
});



vorpal.command('change password <email> <newPass>', 'Changes the password of a user')
  .alias('cp')
  .alias('change pass')
  .action(function(args, callback) {
    let { email, newPass } = args;
    this.prompt(
      {
        type: 'password',
        name: 'confirmPass',
        message: 'Retype password to confirm: '
      },
      (result) => {
        if (_.eq(newPass, result.confirmPass))
        {
          // Find the user
          getUser({ email: email }, [{ model: Account, required: true }],
            (user) => {
              user.changePassword(newPass)
                .then((user) => {
                  console.log("After hashing:", user.password);
                  console.log("Saving password...");
                  user.save();
                })
                .catch((error) => console.error(error));
            }, this);

          // Hash the password
            // If we're smart, we'll make this a function of the user model.
            // Yay for DRY programming!
          // Save the model
          this.log('Changed password for ' + email + '.');
        }
        else
          this.log('Passwords do not match.')

        callback();
      }
    );
    // Anything after the prompt is executed *after* the prompt() which is run
    //  asyncronously.
    // this.log('Made it passed the prompt!');
  });



vorpal.command('check password <email> <password>', 'Checks if a password matches the current password in the database')
  .action(function(args, callback) {
    let { email, password } = args;
    getUser({ email: email }, [{ model: Account, required: true }],
      (user) => console.log(user.checkPassword(password)),
      this);

    callback();
  });



vorpal.command('create account', 'Creates an account with the supplied information')
  .action(function(args, callback) {
    this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Account name: '
      }
    ], (result) => {
      let { name, url } = result;
      this.log('Searching for ' + name);

      Account.findOrCreate({
        where: { name }
      })
      .spread((account, created) => {
        this.log((created ? 'Created' : 'Found') + ` account: '${name}' (id: ${account.id})`);

        callback();
      });
    });
  });



vorpal.command('create user', 'Creates a user with the supplied information')
  .action(function(args, callback) {
    // Get accounts
    Account.findAll().then((accounts) => {
      // Bail if there aren't any accounts
      if (!accounts.length) {
        this.log('No accounts to put the user in. Please create an account first.');
        callback();
        return;
      }

      this.prompt([
        {
          type: 'input',
          name: 'email',
          message: 'Email: '
        }, {
          type: 'input',
          name: 'password',
          message: 'Password: '
        }, {
          type: 'list',
          name: 'account',
          message: 'Account to put the user in:',
          choices: function(inputSession, answers) {
            return accounts.map((a) => ({
              name: a.name,
              value: a,
              short: a.name
            }));
          }
        }
      ], (result) => {
        let { email, password, account } = result;
        // It's probably better to call the user service for this, but in my original,
        //  I created the users via a seeder and changed the password with this
        //  utility I wrote, so this is more accurate to the scenario which first
        //  prompted this.
        User.findOrCreate({
          where: { email }
        }).spread((user, created) => {

          // Inefficient in that it makes two db calls, but...I'm not concerned
          //  with efficiency right now, so instead, I'll stick to copying the
          //  original scenario as closely as I can.

          // Note: This will override an existing user. This is intentional.
          //  Makes testing easier.
          user.changePassword(password).then((user) => {
            // Kept throwing an error: user.setAccount is not a function
            // user.setAccount(account);
            user.accountId = account.id;
            user.save();

            this.log((created ? 'Created' : 'Found') + ` user: '${user.email}' (id: ${user.id}, accountId: ${user.accountId})`);
            callback();
          });
        });
      });
    });
  });

// If command line arguments are passed, evaluate them
// Only trouble with this is that it stays in the application after the command
//  has been executed.
vorpal.show().parse(process.argv);
