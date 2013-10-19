function Controller(){
	$('#start').attr('disabled', true);
	$('#stop').attr('disabled', true);

	return {

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
				row.display = 'inline-block';

				for (var c = 0; c < grid.cols; c++) {
					var col = document.createElement('div');
					$(col).css('display', 'inline-block');
					$(col).css('width', ((parseInt(w) / grid.cols) - 2).toString() + 'px');
					$(col).css('height', ((parseInt(w) / grid.rows) - 2).toString() + 'px');
					$(col).attr('position', r + ',' + c);

					col.className = 'cell';
					col.innerHTML = r + ',' + c;

					this.positions.push(r + ',' + c);

					row.appendChild(col);
				}
				el.appendChild(row);
			}
			container.appendChild(el)
		},

		rednerNature: function(item){
			var newitem = new Nature(item.name, this.values().life[item.name]);
			newitem = this.setPosition(newitem);

			newitem.life = Math.floor(Math.random()*this.values().life[item.name] + 1);
			
			this.treesAndBushes.push(newitem);

			return newitem;
		},

		setPosition: function(item) {
			var that = this;
			var locations = this.positions;
			var random = Math.floor(Math.random() * locations.length);

			$.each(locations, function(d) {
				if (d === random) {
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
				}
			});

			if (item.name === 'wolf' || item.name === 'hare') {
				this.personages.push(item);
			}

			return item;
		},

		start: function(item){
			var that = this;
			if (item.length > 1) {
				console.log('start all items together');
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
			this.personages = [];
		}
	}
};