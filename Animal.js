function Animal(name, step) {
	this.name = name;
	this.step = step;
	this.alive = true;
};

function Hare(controller) {
	this.go = function() {
		var that = this;
		var time = controller.values().time*1000;
		var steps = controller.values().steps.hare;

		var interval = setInterval(function() {
			if (that.alive) {
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

					var ctrll = {
						x: controller.values().grid.rows - 1,
						y: controller.values().grid.cols - 1
					};
					if (that.position[x] > wolf.position[x]) {
						if (that.position[x] < ctrll[x] && that.position[x] > 0) {
							return 1;
						} else if (that.position[x] === ctrll[x] || that.position[x] === 0) {
							var correct = Math.random() < 0.5 ? -1 : 1;
							parseInt(that.position[y]) + correct;
							return 0;
						} else {
							var correct = Math.random() < 0.5 ? -1 : 1;
							parseInt(that.position[y]) + correct;
							return -1;
						}

					} else if (that.position[x] < wolf.position[x]) {
						if (that.position[x] < ctrll[x] && that.position[x] > 0) {
							return -1;
						} else if (that.position[x] === ctrll[x] || that.position[x] === 0) {
							var correct = Math.random() < 0.5 ? -1 : 1;
							parseInt(that.position[y]) + correct;
							return 0;
						} else {
							var correct = Math.random() < 0.5 ? -1 : 1;
							parseInt(that.position[y]) + correct;
							return 0;
						}

					} else {
						return -1;
					}
				};

				var getposition = function(repeat) {

					x = getXY('x');
					y = getXY('y');

					newpos = {
						x: Math.abs(parseInt(pos.x) + x),
						y: Math.abs(parseInt(pos.y) + y)
					};

					if (repeat) {
						var nx = Math.abs(parseInt(pos.x) + x) + (Math.random() < 0.5 ? 0 : Math.random() < 0.5 ? -1 : 1);
						var ny = Math.abs(parseInt(pos.y) + y) + (Math.random() < 0.5 ? 0 : Math.random() < 0.5 ? -1 : 1);
						newpos = {
							x: nx,
							y: ny
						};
					}

					var newindex = newpos.x * controller.values().grid.cols + newpos.y;

					if (controller.positions[newindex]) {

						$('div.cell[position="' + pos.x + ',' + pos.y + '"]').removeClass(that.name);
						controller.positions[that.index] = pos.x + ',' + pos.y;

						that.index = newindex;
						that.position = newpos;

						delete controller.positions[that.index];
						$('div.cell[position="' + newpos.x + ',' + newpos.y + '"]').addClass(that.name);

					} else {
						getposition('repeat');
					}

				};

				getposition();

			} else {
				console.log('hare stopped');
				clearInterval(interval);
			}

		}, time / steps);
	}
};

function Wolf(controller) {
	this.go = function() {
		var that = this;
		var time = controller.values().time*1000;
		var steps = controller.values().steps.wolf;

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

				if ((Math.abs(that.position.x - hare.position.x) === 0 || Math.abs(that.position.x - hare.position.x) === 1) && (Math.abs(that.position.y - hare.position.y) === 0 || Math.abs(that.position.y - hare.position.y) === 1)) {

					hare.alive = false;
					controller.stop();

					alert('Hare is catched');

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

				var getposition = function(repeat) {

					x = getXY('x');
					y = getXY('y');

					newpos = {
						x: Math.abs(parseInt(pos.x) + x),
						y: Math.abs(parseInt(pos.y) + y)
					};

					if (repeat) {
						var nx = Math.abs(parseInt(pos.x) + x) + (Math.random() < 0.5 ? 0 : Math.random() < 0.5 ? -1 : 1);
						var ny = Math.abs(parseInt(pos.y) + y) + (Math.random() < 0.5 ? 0 : Math.random() < 0.5 ? -1 : 1);
						newpos = {
							x: nx,
							y: ny
						};
					}

					var newindex = newpos.x * controller.values().grid.cols + newpos.y;

					if (controller.positions[newindex]) {
						$('div.cell[position="' + pos.x + ',' + pos.y + '"]').removeClass(that.name);
						controller.positions[that.index] = pos.x + ',' + pos.y;

						that.index = newindex;
						that.position = newpos;

						delete controller.positions[that.index];
						$('div.cell[position="' + newpos.x + ',' + newpos.y + '"]').addClass(that.name);

					} else {
						console.log(that.name, that.index, controller.positions[that.index]);
						getposition('repeat');
					}
				};

				getposition();

			} else {
				console.log('wolf stopped');
			}

		}, time / steps);
	}
};
