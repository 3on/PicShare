function anim(e, CSSClass) {
	if($(e).hasClass(CSSClass))
		$(e).removeClass(CSSClass);

	$(e).addClass(CSSClass);

	setTimeout(function() {
		$(e).removeClass(CSSClass);
	}, 500);
}

function templating (tmpl, data, selector) {
	$(selector).empty();
	var template = _.template($(tmpl).html(), data);
	$(selector).append(template);
}

function squaredSized(width, height) {
  var w = 0, h = 0;

  if(width <= height) {
    w = width;
    h = width;
  } else {
    w = height;
    h = height;
  }

  return {sWidth: w, sHeight: h, sx: 0, sy: 0};
}