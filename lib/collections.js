Images = new Mongo.Collection("images");


//set up security on Images collection
Images.allow({
	insert:function(userId, doc){
		console.log("testing security in image insert");
		if(Meteor.user()){ //they are logged in
			// force the image to be owned by the user
			doc.createdBy = userId;
			if (userId != doc.createdBy){ //the user is messing about
				return false;
			}
			else { //the user is logged in, the image has the correct user id
				return true;
			}
		}
		else{ //user not logged in
			return false;
		}
		
	},
	remove:function(userId, doc){
		return true;
	}
});