Tasks = new Mongo.Collection('tasks');


if (Meteor.isClient) {
  //this code only runs on client side
  
  Meteor.subscribe('tasks-pulication');


  Template.body.helpers({
    tasks : function(){

      if(!Session.get('hideCompleted')) {

        return Tasks.find({checked : {$ne : true}}, {sort : {createAt : -1}});

      } else {
        return Tasks.find({},{sort : {createAt : -1}});
      }
    },
    hideCompleted : function() {

      return Session.get('hideCompleted');
    },

    incompleteCount : function (){
      return Tasks.find({checked : {$ne : true}}).count();
    }



  });


  Template.body.events({
    'submit .new-task' : function(event){

      event.preventDefault();

      console.log(event);

      //get value from form element
      var text = event.target.text.value;

      //insert a task into collection
      Meteor.call('addTask',text);


      //clear the form 
      event.target.text.value = '';
    }

  });

  Template.body.events({
    'click .toggle-checked' : function() {
      //set the checked property to the oppersite of its value
      //$set : {checked : !this.checked}
      Meteor.call('setChecked', this._id, ! this.checked);
    },
    'click .delete' : function() {
      Meteor.call('deleteTask', this._id);
      
    },
    'change .hide-completed input' : function(event){
      Session.set('hideCompleted', event.target.checked);

    },
    'click .toggle-private' : function(){
      Meteor.call('setPrivate', this._id, !this.private);
    }

  });

  Template.task.helper({
    isOwner : function(){
      return this.owner == Meteor.userId();
    }

  });

  Template.task.events({
    'click .toggle-checked' : function(){
      Meteor.call('setChecked', this._id, ! this.checked);
    }

  });


  Accounts.ui.config({
    passwordSignupFields : 'USERNAME_ONLY'
  });




}


// defines for both client side and server side
  Meteor.methods({
    addTask : function(text){
      //make sure userId is loggin before insert
      if(! Meteor.userId()) {
        throw new Meteor.Error('non authenticated user');
      }

      Tasks.insert({
        text : text,
        createAt : new Date(),
        owner : Meteor.userId(),
        username : Meteor.user().username
      });
    },

    deleteTask : function(taskId){
      Tasks.remove(taskId);

    },

    setChecked : function(taskId,setChecked){
      Tasks.update(taskId,{$set : {checked : setChecked}});
    },

    setPrivate : function(taskId, setToPrivate){
      var task = Tasks.find(taskId);

      //make sure only the task owner can make a task private
      if(!task.owner == Meteor.userId()){
          throw new Meteor.Error('non authenticated user');
      }

      Tasks.update(taskId, {$set : {private : setToPrivate}});
    }

  });



if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.publish('tasks-pulication',function(){

    return Tasks.find({
      $or : [{
        private : {$ne : true}
      },
      {
        owner : this.userId
      }
      ]
    });
  });
}
