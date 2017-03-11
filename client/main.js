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

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});

console.log("I am the client");

Images = new Mongo.Collection("images");
console.log(Images.find().count());

if(Meteor.isClient)
{


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
	Template.images.helpers({images:Images.find({}, {sort:{createdOn:-1, rating:-1}})}); 
	//-1 instead of lowest rating first it means do it the opposite way around. So basically it's going to sort negatively by ratings.
	//it sorts now first by the date and then by the rating
	Template.images.events({
		'click .js-image':function(event){
			console.log(event);
			$(event.target).css("width","50px");
		},
		'click .js-del-image':function(event){
			var image_id=this._id;
			console.log(image_id);
			$("#"+image_id).hide('slow', function(){//just a hide animation
				Images.remove({"_id":image_id}); //actual removal
			}) //the function passed to hide gets called when hide finishes
			
		},
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
			$("#image_form_modal").modal('show');
		}
	});

	Template.image_add_form.events({
		'submit .js-add-image':function(event){
			var img_src, img_alt;
			img_src = event.target.img_src.value;
			img_alt = event.target.img_alt.value;
			console.log("src: "+img_src+", alt: "+img_alt);

			Images.insert({
				img_src:img_src,
				img_alt:img_alt,
				createdOn:new Date()
			})
			$('#image_form_modal').modal('hide');
			return false;
		}
	});
}