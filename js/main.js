function picAdd(file) {
	var reader = new FileReader();
	

}

function picDrop (e) {
	e.preventDefault();

	_.each(e.originalEvent.dataTransfer.files, function(file){
		picAdd(file);
	});
}

function picDragEnter (e) {
	console.log("not implemented yet");
}

function picChange () {
	console.log("change picture to: " + this)
} 

function eventsBindings () {
	$("#thumbnails li.add").on("drop", picDrop);
	$("#thumbnails li.add").on("dragenter", picDragEnter);

	$("#thumbnails li img.pic").on("click", picChange);
}

$(function(){
	eventsBindings();
});

dotcloud.ready(function(){

});