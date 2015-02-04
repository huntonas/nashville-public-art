(function() {


	//Models
	var Person = Backbone.Model.extend({
		defaults: {
			name: 'Guest User',
			age: 23,
			occupation: 'worker'
		}
	});

	var PublicArtPiece = Backbone.Model.extend({
		defaults: {
			first_name: null,
			title: null,
			location: null,
			description: null,
			last_name: null,
			longitude: null,
			latitude: null,
			type: null,
			medium: null
		}
	});

	//Collections
	var PublicArtCollection = Backbone.Collection.extend({
		model: PublicArtPiece,
		url: 'https://data.nashville.gov/resource/dqkw-tj5j.json'
	});

	var publicArtCollection = new PublicArtCollection();
	publicArtCollection.fetch();
console.log(publicArtCollection.fetch());

	var PeopleCollection = Backbone.Collection.extend({
		model: Person
	});

	var peopleCollection = new PeopleCollection([
	  {
	      name: 'Mohit Jain',
	      age: 26
	  },
	  {
	      name: 'Taroon Tyagi',
	      age: 25,
	      occupation: 'web designer'
	  },
	  {
	      name: 'Rahul Narang',
	      age: 26,
	      occupation: 'Java Developer'
	  }
	]);


	//Views
	var PersonView = Backbone.View.extend({
		tagName: 'li',
		initialize: function() {
			template = _.template($('#personTemplate').html());
			this.model.on('change', this.render, this);
			this.model.on('destroy', this.remove, this);
		},

		template: _.template($('#personTemplate').html()),

		events: {
			'click .edit' : 'editPerson',
			'click .delete' : 'destroyPerson'
		},
		editPerson: function() {
			var newName = prompt("Please enter the new name", this.model.get('name'));
			if(!newName) return;
			this.model.set('name', newName);
		},
		destroyPerson: function() {
			this.model.destroy();
		},
		remove: function() {
			this.$el.remove();
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});

	var PeopleView = Backbone.View.extend({
		tagName: 'ul',

		initialize: function() {
			this.collection.on('add', this.addOne, this);
		},

		render: function() {
			this.collection.each(function(person) {
				console.log(person.toJSON());
				var personView = new PersonView({model: person});
				this.$el.append(personView.render().el);
			}, this);
			return this;
		},
		addOne: function(person) {
			var personView = new PersonView ({model: person});
			this.$el.append(personView.render().el);
		}
	});

	var AddPersonView = Backbone.View.extend({
		el: '#addPerson',

		events: {
			'submit': 'submit'
		},
		submit: function(e) {
			e.preventDefault();
			var newPersonName = $(e.currentTarget).find('input[type=text]').val();
			var person = new Person({ name: newPersonName });
			this.collection.add(person);
		}
	});

	var addPersonView = new AddPersonView({collection: peopleCollection});
	var peopleView = new PeopleView({collection: peopleCollection});
	$(document.body).append(peopleView.render().el);
})();