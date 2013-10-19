"use strict";

$(document).ready(function(){

	$('input[name="grid-rows"]').val(20);
	$('input[name="grid-cols"]').val(20);
	$('input[name="item-tree"]').val(8);
	$('input[name="item-bush"]').val(6);
	$('input[name="life-tree"]').val(6);
	$('input[name="life-bush"]').val(4);
	$('input[name="step-wolf"]').val(1);
	$('input[name="step-hare"]').val(1);
	$('input[name="time"]').val(1);

	var controller = new Controller();
	var natureItems = [];

	function renderNatureItems(data){
		var items = [];
		
		$.each(data, function(i){
			console.log(data[i].name);
			var item = data[i];
			for (var i=0; i < controller.values()[item.name]; i++) {
				var item = controller.rednerNature(item);
				items.push(item);
			}
		});

		return items;
	};

	$('#render').click(function(){
		controller = new Controller();

		$('#grid-container').html('');
		$('#start').attr('disabled', false);
		$('#stop').attr('disabled', false);

		var wolf = new Animal('wolf', controller.values().steps.wolf);
		var hare = new Animal('hare', controller.values().steps.hare);

		var tree = new Nature('tree', controller.values().life.tree);
		var bush = new Nature('bush', controller.values().life.bush);

		Hare.prototype = hare;
		Wolf.prototype = wolf;
		var ahare = new Hare(controller);
		var awolf = new Wolf(controller);
		hare = ahare;
		wolf = awolf;

		controller.treesAndBushes = [];

		controller.gridRender();
		controller.setPosition(wolf);
		controller.setPosition(hare);

		natureItems = renderNatureItems([tree, bush]);
		natureItems.push(wolf);
		natureItems.push(hare);

		console.log(controller);

	});

	$('#render').click();

	$('#start').click(function(){
		controller.start(natureItems);
		$(this).attr('disabled', true);
	});

	$('#stop').click(function(){
		controller.stop();
		$(this).attr('disabled', true);
		console.log(controller);
	});

});