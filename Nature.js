function Nature (name, life) {
	this.name = name;
	this.life = life;
	this.alive = true;
	this.go = function(time, controller) {
		var that = this;

		var interval = setInterval(function() {
			if (that.life === 0 && that.alive) {
				var pos = that.position;
				var treesAndBushes = controller.treesAndBushes;
				$('div.cell[position="' + pos.x + ',' + pos.y + '"]').removeClass(that.name);

				controller.positions[that.index] = pos.x + ',' + pos.y; // back free position

				$.each(treesAndBushes, function(i) {
					if (treesAndBushes[i] === that) {
						treesAndBushes.splice(i, 1);
					}
				});

				var item = new Nature(that.name, controller.values().life[that.name]);
				var newitem = controller.rednerNature(item);
				controller.start(newitem);

				clearInterval(interval);

			} else if (that.alive) {
				that.life--;
			}

		}, time);
	};
};