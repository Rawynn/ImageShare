import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup

  console.log("I am the server");

  //Images = new Mongo.Collection("images"); //moved to share folder
  console.log(Images.find().count());

  if(Images.find().count() == 0){

  	for(var i=1;i<23;i++){

  		Images.insert(
	  	{
	  		img_src:"img"+i+".jpg",
			img_alt:"Image number"+i
	  	});
  	}//end of iterationg images
  	//count the images
  	console.log("server main.js says: "+Images.find().count());
  } //end of if have no images
});
