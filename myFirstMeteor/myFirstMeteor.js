if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
    

  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });


  Template.helloName.helpers({


    sayHello : funciton() {
      return Session.get('yourname');
    }

  }

    );

  Template.helloName.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('yourname', Session.get('yourname'));
    }
  });



}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
