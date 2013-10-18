"use strict";

function Controller(){
	$('#start').attr('disabled', true);
	$('#stop').attr('disabled', true);

	return {
		Animal: function(name, step){
			this.name = name;
			this.step = step;
			this.alive = true;
		},

		Nature: function(name, life){
			this.name = name;
			this.life = life;
			this.alive = true;
			this.go = function(time, controller){
				var that = this;

				var interval = setInterval(function(){
					if (that.life === 0 && that.alive) {
						var pos = that.position;
						var treesAndBushes = controller.treesAndBushes;
						$('div.cell[position="'+pos.x+','+pos.y+'"]').removeClass(that.name);

						controller.positions[that.index] = pos.x+','+pos.y; // back free position
						
						$.each(treesAndBushes, function(i){
							if (treesAndBushes[i] === that) {
								treesAndBushes.splice(i, 1);
							}
						});

						var item = new controller.Nature(that.name, controller.values().life[that.name]);
						var newitem = controller.rednerNature(item);
						controller.start(newitem);

						clearInterval(interval);

					} else if (that.alive){
						that.life--;
					}

				}, time);
			};
		},

		positions: [],
		treesAndBushes: [],
		personages: [],

		values: function(){
			return {
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
			}
		},

		gridRender: function(){
			this.positions = [];

			var grid = this.values().grid;
			var container = document.getElementById('grid-container');
			var w = $(container).css('width');
			var h = $(container).css('height');

			var el = document.createElement('div');
			console.log(grid);
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
			// console.log(item);

			var newitem = new this.Nature(item.name, this.values().life[item.name]);
			newitem = this.setPosition(newitem);
			
			this.treesAndBushes.push(newitem);

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

			if (item.name === 'wolf' || item.name === 'hare') {
				this.personages.push(item);
			}

			return item;
		},

		start: function(item){
			var that = this;
			//console.log(items);
			if (item.length > 1) {
				console.log('start all items together');
				//console.log(that);
				$.each(item, function(i){
					item[i].go((that.values().time)*1000, that);
				});
			} else {
				item.go((that.values().time)*1000, that);
			}
		},

		stop: function(){
			var items = this.treesAndBushes.concat(this.personages);
			$.each(items, function(i){
				if (items[i].alive){
					items[i].alive = false;
					delete items[i];
				}
			});
			this.treesAndBushes = [];
		},

		wolfGo: function(time, controller) {
			var that = this;

			var interval = setInterval(function() {
				if (that.alive) {
					var pos = that.position,
						treesAndBushes = controller.treesAndBushes,
						personages = controller.personages,
						hare, x, y, newpos, oldpos, oldindex;

					$.each(personages, function(i) {
						if (personages[i].name === 'hare') {
							hare = personages[i];
						}
					});

					if ((Math.abs(that.position.x - hare.position.x) === 0 
						|| Math.abs(that.position.x - hare.position.x) === 1) 
						&& (Math.abs(that.position.y - hare.position.y) === 0 
						|| Math.abs(that.position.y - hare.position.y) === 1)) {
						
						console.log('catched');
						hare.alive = false;
						controller.stop();
						clearInterval(interval);
						return;
					}

					var getXY = function(coor) {
						if (that.position[coor] < hare.position[coor]) {
							return 1;
						} else if (that.position[coor] > hare.position[coor]) {
							return -1;
						} else {
							return 0;
						}
					};
	
					var getposition = function(){

						x = getXY('x');
						y = getXY('y');

						newpos = {
							x: Math.abs(parseInt(pos.x) + x),
							y: Math.abs(parseInt(pos.y) + y)
						};

						var newindex = newpos.x*controller.values().grid.cols + newpos.y;

						if (controller.positions[newindex]) {
							$('div.cell[position="' + pos.x + ',' + pos.y + '"]').removeClass(that.name);
							controller.positions[that.index] = pos.x + ',' + pos.y;

							that.index = newindex;
							that.position = {
								x: Math.abs(parseInt(pos.x) + x),
								y: Math.abs(parseInt(pos.y) + y)
							};

							delete controller.positions[that.index];
							$('div.cell[position="' + newpos.x + ',' + newpos.y + '"]').addClass(that.name);

						} else {
							console.log(that.name, that.index, controller.positions[that.index]);
							//controller.positions[oldindex] = oldpos;

							// that.position = {
							// 	x: x + Math.random() < 0.5 ? -1 : 0,
							// 	y: y + Math.random() < 0.5 ? -1 : 0
							// };
							return false;
							//getposition();
						}
					};

					getposition();

				} else {
					console.log('wolf stopped');
				}

			}, time/controller.values().steps.wolf);
		},

		hareGo: function(time, controller){
			var that = this;

			var interval = setInterval(function(){
				if (that.alive){
					var pos = that.position,
						treesAndBushes = controller.treesAndBushes,
						personages = controller.personages,
						wolf, x, y, newpos;

					$.each(personages, function(i) {
						if (personages[i].name === 'wolf') {
							wolf = personages[i];
						}
					});

					var getXY = function(x) {

						var y = x === 'x' ? 'y' : 'x';

						var ctrll = {x: controller.values().grid.rows - 1, y: controller.values().grid.cols - 1};

						//console.log(ctrll);
						//console.log(that.position);

						if (that.position[x] > wolf.position[x]) {
							if (that.position[x] < ctrll[x] && that.position[x] > 0) {
								return 1;
							}
							else if (that.position[x] === ctrll[x] || that.position[x] === 0){
								var correct =  Math.random() < 0.5 ? -1 : 1;
								//console.log(y + ': ' + correct);
								parseInt(that.position[y]) + correct;
								return 0;
							}
							else { 
								//console.log(x+': error 1'); 
								var correct =  Math.random() < 0.5 ? -1 : 1;
								//
								parseInt(that.position[y]) + correct;
								return -1;
							}

						} else if (that.position[x] < wolf.position[x]) {
							if (that.position[x] < ctrll[x] && that.position[x] > 0) {
								return -1;
							}
							else if (that.position[x] === ctrll[x] || that.position[x] === 0){
								var correct =  Math.random() < 0.5 ? -1 : 1;
								//console.log(y + ': ' + correct);
								parseInt(that.position[y]) + correct;
								return 0;
							} 
							else { 
								//console.log(x+': error -1');
								var correct =  Math.random() < 0.5 ? -1 : 1;
								//console.log(y + ': ' + correct);
								parseInt(that.position[y]) + correct;
								return 0;
							}

						} else {
							return -1;
						}
					};

					var getposition = function(){

						x = getXY('x');
						y = getXY('y');	

						newpos = {
							x: Math.abs(parseInt(pos.x) + x),
							y: Math.abs(parseInt(pos.y) + y)
						};

						var newindex = newpos.x*controller.values().grid.cols + newpos.y;

						if (controller.positions[newindex]){
							
							$('div.cell[position="' + pos.x + ',' + pos.y + '"]').removeClass(that.name);
							controller.positions[that.index] = pos.x + ',' + pos.y;

							that.index = newindex;
							that.position = {
								x: Math.abs(parseInt(pos.x) + x),
								y: Math.abs(parseInt(pos.y) + y)
							};

							delete controller.positions[that.index];
							$('div.cell[position="' + newpos.x + ',' + newpos.y + '"]').addClass(that.name);

						} else {
							console.log(that.name, that.index, controller.positions[that.index]);
							// that.position = {
							// 	x: x + Math.random() < 0.5 ? 0 : 1, 
							// 	y: y + Math.random() < 0.5 ? 0 : 1
							// };
							return false;
							//getposition();
						}

					};

					getposition();

				} else {
					console.log('hare stopped');
					clearInterval(interval);
				}

			}, time/controller.values().steps.hare);
		}
	}
};


$(document).ready(function(){

	$('input[name="grid-rows"]').val(10);
	$('input[name="grid-cols"]').val(10);
	$('input[name="item-tree"]').val(4);
	$('input[name="item-bush"]').val(5);
	$('input[name="life-tree"]').val(6);
	$('input[name="life-bush"]').val(4);
	$('input[name="step-wolf"]').val(1);
	$('input[name="step-hare"]').val(1);
	$('input[name="time"]').val(1);

	var controller = new Controller();

	function renderNatureItems(data){
		var items = [];
		
		$.each(data, function(i){
			console.log(data[i].name);
			var item = data[i];
			for (var i=0; i < controller.values()[item.name]; i++) {
				var item = controller.rednerNature(item);
				// console.log(item);
				items.push(item);
			}
		});

		return items;
	};

	var natureItems;
	$('#render').click(function(){
		controller = new Controller();

		$('#grid-container').html('');
		$('#start').attr('disabled', false);
		$('#stop').attr('disabled', false);

		var wolf = new controller.Animal('wolf', controller.values().steps.wolf);
		var hare = new controller.Animal('hare', controller.values().steps.hare);
		var tree = new controller.Nature('tree', controller.values().life.tree);
		var bush = new controller.Nature('bush', controller.values().life.bush);
		wolf.go = controller.wolfGo;
		hare.go = controller.hareGo;

		controller.treesAndBushes = [];

		controller.gridRender();
		controller.setPosition(wolf);
		controller.setPosition(hare);

		natureItems = renderNatureItems([tree, bush]);
		natureItems.push(wolf);
		natureItems.push(hare);

		console.log(controller);

	});

	//var natureItems = renderNatureItems([tree, bush]);
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