"use strict";

function Controller(){
	return {
		Animal: function(name, step){
			this.name = name;
			this.step = step;

			this.position = (function() {
				//return setPosition();
			})();

			this.go = function() {
				//this.position.x += step;
			};
		},

		Nature: function(name, life){
			this.name = name;
			this.life = life;
			
			this.go = function(time, controller){
				var that = this;

				var interval = setInterval(function(){
					if (that.life === 0) {
						var pos = that.position;
						$('div.cell[position="'+pos.x+','+pos.y+'"]').removeClass(that.name);

						controller.positions[that.index] = pos.x+','+pos.y;

						var item = new controller.Nature(that.name, controller.values.life[that.name]);

						var newitem = controller.rednerNature(item);
						controller.start(newitem);

						clearInterval(interval);

					} else {
						that.life--;
					}
				}, time);
			};
		},

		setDefault: function(){
			$('input[name="grid-rows"]').val(10);
			$('input[name="grid-cols"]').val(10);
			$('input[name="item-tree"]').val(3);
			$('input[name="item-bush"]').val(2);
			$('input[name="life-tree"]').val(5);
			$('input[name="life-bush"]').val(4);
			$('input[name="step-wolf"]').val(2);
			$('input[name="step-hare"]').val(1);
		},

		positions: [],

		values: {
			tree: $('input[name="item-tree"]').val(),
			bush: $('input[name="item-bush"]').val(),
			time: $('input[name="time"]').val(),

			life: {
				tree: $('input[name="life-tree"]').val(),
				bush: $('input[name="life-bush"]').val()
			},

			steps: {
				wolf: $('input[name="step-wolf"]').val(),
				hare: $('input[name="step-hare"]').val()	
			},

			grid: {
				rows: $('input[name="grid-rows"]').val(),
				cols: $('input[name="grid-cols"]').val()
			}
		},

		gridRender: function(){
			this.positions = [];
			var count = this.values;
			var grid = this.values.grid;
			var container = document.getElementById('grid-container');
			var w = $(container).css('width');
			var h = $(container).css('height');

			var el = document.createElement('div');
			
			for (var r = 0; r < grid.rows; r++) {
				var row = document.createElement('div');
				row.display = 'block';

				for (var c = 0; c < grid.cols; c++) {
					var col = document.createElement('div');
					$(col).css('display', 'inline-block');
					$(col).css('width', ((parseInt(w) / grid.cols) - 2).toString() + 'px');
					$(col).css('height', ((parseInt(w) / grid.rows) - 2).toString() + 'px');
					$(col).attr('position', r + ',' + c);

					col.className = 'cell';
					col.innerHTML = r + '' + c;

					this.positions.push(r + ',' + c);

					row.appendChild(col);
				}
				el.appendChild(row);
			}
			container.appendChild(el)
		},

		rednerNature: function(item){
			console.log(item);

			var newitem = new this.Nature(item.name, this.values.life[item.name]);
			newitem = this.setPosition(newitem);

			return newitem;
		},

		setPosition: function(item) {
			var that = this;
			var locations = this.positions;
			var random = Math.floor(Math.random() * locations.length);

			$.each(locations, function(d) {
				if (d === random) {
					//console.log('Equal: ' + d);
					//console.log(locations.length);

					if (locations[d] === undefined){
						that.setPosition(item);
						return;
					}

					var coor = locations[d].split(',');
					item.position = {
						x: coor[0],
						y: coor[1]
					};

					item.index = d;

					var cell = $('div.cell[position="' + locations[d] + '"]');
					$(cell).addClass(item.name);
					
					delete locations[d];
					//console.log(cell);
					//console.log(locations);
				}
			});

			return item;
		},

		start: function(items){
			var that = this;
			//console.log(items);
			if (items.length > 1) {
				console.log('start all items together');
				$.each(items, function(i){
					items[i].go((that.values.time)*1000, that);
				});
			} else {
				console.log(items);
				items.go((that.values.time)*1000, that);
			}
		},

		stop: function(){
			console.log('stop');
		}
	}
};


$(document).ready(function(){

	$('input[name="grid-rows"]').val(10);
	$('input[name="grid-cols"]').val(10);
	$('input[name="item-tree"]').val(3);
	$('input[name="item-bush"]').val(2);
	$('input[name="life-tree"]').val(4);
	$('input[name="life-bush"]').val(2);
	$('input[name="step-wolf"]').val(2);
	$('input[name="step-hare"]').val(1);
	$('input[name="time"]').val(1);

	var controller = new Controller();
	var wolf = new controller.Animal('wolf', controller.values.steps.wolf);
	var hare = new controller.Animal('hare', controller.values.steps.hare);
	var tree = new controller.Nature('tree', controller.values.life.tree);
	var bush = new controller.Nature('bush', controller.values.life.bush);

	//controller.setDefault();
	controller.gridRender();
	controller.setPosition(wolf);
	controller.setPosition(hare);

	function renderNatureItems(tree, bush){
		var items = [];
		for (var i=0; i < controller.values[tree.name]; i++) {
			var item = controller.rednerNature(tree);
			console.log(item);
			items.push(item);
		}

		for (var i=0; i < controller.values[bush.name]; i++) {
			var item = controller.rednerNature(bush);
			items.push(item);
		}

		return items;
	};

	renderNatureItems(tree, bush);

	var natureItems = [];

	$('#render').click(function(){
		$('#grid-container').html('');
		controller.gridRender();
		controller.setPosition(wolf);
		controller.setPosition(hare);

		natureItems = renderNatureItems(tree, bush);
		console.log(natureItems);

	});

	$('#start').click(function(){
		controller.start(natureItems);
	});

	$('#stop').click(function(){
		controller.stop();
	});

	wolf.go();

});