var thumbnailSize = 100;
var thumbnails = null;

/*
	Picture loaded from urlData into the DOM
*/
function picLoaded(id, img) {
	return function() {

		// create a thumbnail using a temporary canvas element
		var canvas = document.createElement("canvas");
		canvas.width = canvas.height = thumbnailSize;

		// determine the croping coordonates
		var crop = squared(img.width, img.height);

		var ctx = canvas.getContext('2d');
		ctx.drawImage(img, crop.sx, crop.sy, crop.sWidth, crop.sHeight, 0, 0, thumbnailSize, thumbnailSize);

		// add the thumbnail to the synchronized array
		thumbnails.push({id: id,  urlData: canvas.toDataURL()});
		
		delete img, canvas, ctx;
	}
}

/*
	Picture loaded from file to urlData string
*/
function picRead(e) {
	var urlData = e.target.result;

	// add the picture to the picture collection and get the _id
	dotcloud.db.insert('pictures', [{urlData: urlData}], function(data) {
		if (data.error) throw data.error;

		var id = data.result[0]._id;

		// load the image before working with it
		var img = new Image();
		img.onload = picLoaded(id, img);
		img.src = urlData;
	});
}

/*
	Create a reader to read the picture as urlData
*/
function picAdd(file) {
	var reader = new FileReader();
	reader.onload = picRead;
	reader.readAsDataURL(file);
}

/*
	Create a reader for each file dropped
*/
function picDrop (e) {
	e.preventDefault(); // we don't want the picture to me display in the tab

	// e.originalEvent to get out of jQuery's event
	_.each(e.originalEvent.dataTransfer.files, function(file){
		picAdd(file);
	});
}

function picDelete(e) {

}
/*
	Looks for the previous and the next thumbnails ID in the sync array
*/
function prevNnext(id) {
	var res = {previous: undefined, next: undefined };

	for (var i = 0; i < thumbnails.length; i++) {
		if(thumbnails.at(i).id != id) continue;

		if(i > 0) res.previous = thumbnails.at(i - 1)._id;
		if(i < thumbnails.length - 1) res.next = thumbnails.at(i + 1)._id;

		break;
	};

	console.log("prev and next: ", res)
	return res;
}

function picChange (e) {
	var id = e.data.id;
	console.log("picChange id: " + id)
	dotcloud.db.find('pictures', id, function(data){
		if (data.error) throw data.error;

		// change the picture
		console.log(data)
		templating("#tmpl-slideshow-image", data.result, "#picture");

		// update the arrows
		var pn = prevNnext(id);
		$("#slideshow .previous").unbind('click');

		if(pn.next != undefined) {
			$("#slideshow .previous").on("click", {id: pn.previous}, picChange);
			$("#slideshow .previous").show();
		}
		else {
			$("#slideshow .previous").hide();
		}
		

		$("#slideshow .next").unbind('click');
		if(pn.next != undefined) {
			$("#slideshow .next").on("click", {id: pn.next}, picChange);
			$("#slideshow .next").show();
		}
		else {
			$("#slideshow .next").hide();
		}
	});
}

function drawThumbnails() {
	$("#thumbnails li").not('.add').remove();

	thumbnails.forEach(function(t){
		$("#thumbnails ul").append(_.template($("#tmpl-thumb-img").html(), t));
	});

	$("#thumbnails li").each(function(){
		$(this).on("click", {id: $(this).attr('data-id')},  picChange);
	});
}

function inSync () {
	drawThumbnails();
	$(document).on("drop", picDrop);
}

dotcloud.ready(function(){
	thumbnails = dotcloud.sync.synchronize('thumbnails');
	thumbnails.observe(function(type, change) {
		console.log("Change of type: " + type);

		if(type == "synchronized") {
			console.log("Thumbnails array in sync!")
			inSync();
		}
		else {
			drawThumbnails();
		}	
	});
});