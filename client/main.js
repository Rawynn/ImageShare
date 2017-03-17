import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

/*Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});

console.log("I am the client");

//Images = new Mongo.Collection("images"); //moved to share folder
console.log(Images.find().count()); */

if(Meteor.isClient) // not needed
{
	//routing
	Router.configure({
		layoutTemplate: 'ApplicationLayout'
	});

	Router.route('/', function () {
	  this.render('welcome',{
	  	to:"main"
	  });
	});

	Router.route('/images', function () {
	  this.render('navbar',{
	  	to:"navbar"
	  });
	  this.render('images',{
	  	to:"main"
	  });
	});

	Router.route('/image/:_id', function () {
	  this.render('navbar',{
	  	to:"navbar"
	  });
	  this.render('image',{
	  	to:"main",
	  	data:function(){
	  		return Images.findOne({_id:this.params._id})
	  	}
	  });
	});



	//infiniscroll
	Session.set("imageLimit", 8);
	lastScrollTop=0;

	$(window).scroll(function(event){	
		//test if we are near the bottom of the window
		if($(window).scrollTop() + $(window).height() > $(document).height() - 100){
			//console.log(new Date());
			
			// where are we in the page?
			var scrollTop = $(this).scrollTop();
			//test if we are going down
			if (scrollTop > lastScrollTop){
				//yes, we are heading down...
				Session.set("imageLimit", Session.get("imageLimit") + 4);
			}
			lastScrollTop = scrollTop;

		}
		
	});

// accounts config

	Accounts.ui.config({
		passwordSignupFields: "USERNAME_AND_EMAIL" //display email and user name

	});


	var img_data = 
	[
		{
			img_src:"img1.jpg",
			img_alt:"An abstract artwork of dear-like girl"
		},

		{
			img_src:"img2.jpg",
			img_alt:"Another abstract artwork of dear-like girl"
		},

		{
			img_src:"img3.jpg",
			img_alt:"Another abstract artwork of elvish circus girl"
		},

	];

	//Template.images.helpers({images:img_data});

	//Template.images.helpers({images:Images.find()});


//sorting, filters and finding user by id


	Template.images.helpers({
		images:function(){
			if (Session.get("userFilter")){ //they set a filter
				return Images.find({createdBy:Session.get("userFilter")}, {sort:{createdOn:-1, rating:-1}})
			}
			else{
				return Images.find({}, {sort:{createdOn:-1, rating:-1}, limit:Session.get("imageLimit")})
			}
			//return Images.find({}, {sort:{createdOn:-1, rating:-1}})
		
		//-1 instead of lowest rating first it means do it the opposite way around. So basically it's going to sort negatively by ratings.
		//it sorts now first by the date and then by the rating
		},
		filtering_images:function(){
			if (Session.get("userFilter")){ //they set a filter
				return true;
			}
			else{
				return false;
			}
		},
		getFilterUser:function(){
			if (Session.get("userFilter")){ //they set a filter
				var user = Meteor.users.findOne({_id:Session.get("userFilter")});
				return user.username;
			}
			else{
				return false;
			}
		},
		getUser:function(user_id){
			var user = Meteor.users.findOne({_id:user_id});
			if (user){
				return user.username;
			}
			else{
				return "anonymous";
			}
		}
	}); 


	Template.body.helpers({username:function(){
			if(Meteor.user()){
				return Meteor.user().username;
				//return Meteor.user().emails[0].address;
			}
			else{
				return "anonymous internet user";
			}
		}
	});

	Template.images.events({ //manipulate the css when clicked image - it shrinks
	/*	'click .js-image':function(event){
			console.log(event);
			$(event.target).css("width","50px");
		},*/
		//remove image function
		'click .js-del-image':function(event){
			var image_id=this._id;
			console.log(image_id);
			$("#"+image_id).hide('slow', function(){//just a hide animation
				Images.remove({"_id":image_id}); //actual removal
			}) //the function passed to hide gets called when hide finishes
			
		},
		//rate image function
		'click .js-rate-image':function(event){
			console.log("you clicked a star");
			var rating = $(event.currentTarget).data("userrating");
			console.log("Rating: "+rating);
			var image_id = this.id;
			console.log("Image id: "+image_id);

			//update takes two arguments - frist is the ID of the image, second is the thing that you want to change about it
			Images.update({_id:image_id}, {$set: {rating:rating}}); 

			//console.log(Images.find({"rating":4}));
		},
		'click .js-show-image-form':function(event){
			$("#image_add_form").modal('show');
		},
		'click .js-set-image-filter':function(event){
			Session.set("userFilter", this.createdBy); 
			//session allows to store temporary variables, so that we can use them in app to remember what kind of state the app is in.
		},
		'click .js-unset-image-filter':function(event){
			Session.set("userFilter", undefined);
		}
	});

//uploading an image
	Template.image_add_form.events({
		'submit .js-add-image':function(event){
			var img_src, img_alt;
			img_src = event.target.img_src.value;
			img_alt = event.target.img_alt.value;
			console.log("src: "+img_src+", alt: "+img_alt);

			if(Meteor.user()){
				Images.insert({
					img_src:img_src,
					img_alt:img_alt,
					createdOn:new Date(),
					createdBy:Meteor.user()._id
				});
			}
			
			$('#image_form_modal').modal('hide');
			return false;
		}
	});
}