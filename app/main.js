(function() {

APP = {};

APP.ArtPiece = Backbone.Model.extend({
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

APP.ArtPieces = Backbone.Collection.extend({
    model: APP.ArtPiece,
    url: 'https://data.nashville.gov/resource/dqkw-tj5j.json'
});


APP.artPieces = new APP.ArtPieces();

APP.Map = Backbone.Model.extend({
    defaults: {
        center: new google.maps.LatLng(36.159480, -86.792112),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
});

APP.map = new APP.Map();

APP.MapView = Backbone.View.extend({
    el: '#map',
    initialize: function () {
        this.collection.fetch({ reset: true });
        this.listenTo(this.collection, 'reset', this.render);
        this.map = new google.maps.Map(this.el, this.model.toJSON());
    },
    render: function () {
        this.collection.each(function (artPiece) {
            console.log(artPiece.get('title'));
            var marker = new google.maps.Marker({
                map: this.map,
                position: new google.maps.LatLng(
                    artPiece.get('latitude'),
                    artPiece.get('longitude')
                ),
                title: artPiece.get('title')
            });
        }, this);
        $('#map').replaceWith(this.el);
    }
});

APP.mapView = new APP.MapView({
    model: APP.map,
    collection: APP.artPieces
});

})();