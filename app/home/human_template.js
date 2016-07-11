var canvas, ctx, img, model;

function testImage() {
	var w = 300, h = 400;
	var p = new PNGlib(w, h, 256);
	var background = p.color(0, 0, 0, 255); // set the background transparent
	var x_mod = 20, y_mod = x_mod;

	for (var x = 0; x < w; x++) {
		for (var y = 0; y < h; y++) {
			if ((x % x_mod) == 0 || (y % y_mod) == 0) {
				p.buffer[p.index(x, y)] = p.color(255, 255, 255, 0);
			}
		}
	}
	return p.getBase64();
	
}

function base64HumanTemplateSrc(resource) {
    return "data:image/png;base64," + testImage();

}

function _base64HumanTemplateSrc(resource) {
    return "data:image/png;base64," + resource.Base64Image;
}

function objects_to_data(event) {
    var objects = canvas.getObjects();
    objects.forEach(function(o){
        console.log(o.top + " " + o.left + " " + o.angle);
    });
    // var data = document.getElementById('data');
}

function getMouseCoords(event) {
    var pointer = canvas.getPointer(event.e);
    var posX = pointer.x;
    var posY = pointer.y;
    console.log(posX+", "+posY);    // Log to console
    
    var imgBound = img.getBoundingRect();
    addPoint(posX, posY);
}

function changePoint(event) {
    console.log(event);
}

function addPoint(posX, posY) {
    var circle = new fabric.Circle({
		  top: -10,
		  left: -10,
          radius: 10,
          stroke: 'red',
          strokeWidth: 2,
          selectable: false,
          fill: 'rgba(0,0,0,0)'
    });

    var pointer = new fabric.Line(
        [0, 0, 0, -30], {
            selectable: false,
			strokeWidth: 2,
			stroke: 'red'
		}
     );
    var group = new fabric.Group(
        [circle, pointer], {
            left: posX,
            top: posY,
        });

    group.setControlsVisibility({
        bl: false,
        br: false,
        mb: false,
        ml: false,
        mr: false,
        mt: false,
        tl: false,
        tr: false,
    });
    canvas.add(group);
    circle.on('selected', function(){ console.log('foo') });
}

function loadTemplate(resource) {
    if (canvas == null) {
        canvas = new fabric.Canvas('humanTemplate');
    }
    canvas.selection = false;
    canvas.on("object:selected", objects_to_data);
    var humanTemplateImg = new fabric.Image.fromURL(
        base64HumanTemplateSrc(resource),
        function(newImg){
            if (img != null) {
                canvas.remove(img);
            }
            img = newImg;
            img.set({
                left: 0,
                top: 0,
                angle: 0,
                opacity: 0.85,
                selectable: false,
                hoverCursor: 'pointer'
            });
            img.on("mousedown", getMouseCoords);
            canvas.setWidth(img.width);
            canvas.setHeight(img.height);
            canvas.add(img).renderAll();
        }
    );
}
