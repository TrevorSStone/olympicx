Teams = new Mongo.Collection("teams");
collapsibleCount = 0;
if (Meteor.isClient) {
  $(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal();
  });
  // This code only runs on the client
Template.body.helpers({
  teams:function () {
      // Otherwise, return all of the tasks
       if (window.location.pathname == "/admin"){
      return Teams.find({}, {sort: {teamName: -1}});
      
    }
      return Teams.find({}, {sort: {score: -1}});

  },
  hideCompleted: function () {
    return Session.get("hideCompleted");
  },
  sessionName: function(){

    return Session.get("sessionName")
  },
  hideCompletedcheck: function(){
    return Session.get("hideCompleted")
  },
  teamID : function(){
    return Session.get("teamID")
  }
});
Template.team.rendered = function(event){
 $('.collapsible-header').unbind( "click" );
   $('.collapsible').collapsible({ "accordion" : false });

}

Template.joinmodal.rendered = function(event){
  $('.modal-trigger').leanModal();
}

Template.team.helpers({
  myid: function (team) {
    if(team._id ===Session.get("teamID")){
      return "myteam";
    }
    return "";
  },
  admin: function(){
    if (window.location.pathname == "/admin"){
      return true
    }
    return false
  }
});

  Template.body.events({
  "submit .new-task": function (event) {
    // This function is called when the new task form is submitted
    var text = event.target.text.value;

    Tasks.insert({
      text: text,
      createdAt: new Date() // current time
    });

    // Clear form
    event.target.text.value = "";

    // Prevent default form submit


    return false;
  },
  "change .hide-completed input": function (event) {
  Session.set("hideCompleted", event.target.checked);
},
"submit .new-team": function (event){
    submitTeam(event);
    return false;
  },
  "click .add-team-submit":submitTeam,
  "submit .join-team": function(event){
    addTeammate(event);
    return false;
  },
  "click .join-team-submit":addTeammate,

});


Template.team.events({
  "click .add": function () {
    // Set the checked property to the opposite of its current value
    Teams.update(this._id, {$inc: {score: 1}});
  },
  "click .sub": function () {
    Teams.update(this._id, {$inc: {score: -1}});
   
  }
});
Template.team.helpers


Template.registerHelper("sessionName", function(){

    return Session.get("sessionName")
  });

}
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

function submitTeam(event) {
  var teamname = $("#teamname").val();
    var playername = $("#captain").val();
    if (!teamname || !playername){
     toast('Fill out both fields', 3000)
      return
    }
    id = Teams.insert({
      teamName: teamname,
      player1: playername,
      score: 0,
      createdAt: new Date() // current time
    });
  Session.set("teamID", id)
  Session.set("sessionName", teamname);
  // Session.set("teamid",)
  $('#modal1').closeModal();
}

function addTeammate(event){
form = event.target;
if (form.className != "join-team"){
  form = form.parentElement;
}

name =$(form).find("input").val()
   if (!name){
     toast('Fill out both fields', 3000);
      return false;
    }
    id = $(form).find("[name='id']").val();
    teamname = $(form).find("[name='teamname']").val()
       if (!id || !teamname){
     toast('There was an error', 3000);
      return false;
    }

  Session.set("teamID", id)
  Session.set("sessionName", teamname);

    Teams.update(id, {$set: {"player2": name}});
$('#modal'+id).closeModal();
}