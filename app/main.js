(function() {

APP = {};

APP.template = function(id) {
    return _.template($('#' + id).html());
};

APP.ArtPiece = Backbone.Model.extend({
    defaults: {
        first_name: 'First Name not provided',
        title: 'Title not provided',
        location: 'Location not provided',
        description: 'Description not provided',
        last_name: 'Last Name not provided',
        longitude: null,
        latitude: null,
        type: 'Type not provided',
        medium: 'Medium not provided'
    },
    initialize: function() {

    },
    address: function() {

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

APP.MarkerInfo = Backbone.Model.extend({
    defaults :{
        first_name: 'First Name not provided',
        last_name: "Last Name not provided",
        title: 'Title not provided',
        location: 'Location not provided',
        description: 'Description not provided',
        type: 'Type not provided',
        medium: 'Medium not provided',
        address: "Not Available"
    },
    getAddress: function(lat, lng) {

        geocoder = new google.maps.Geocoder();

        var latlng = new google.maps.LatLng(lat, lng);

        geocoder.geocode({'latLng': latlng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              if (results[1]) {
                return results[1].formatted_address;
              } else {
                return 'No address available';
              }
            } else {
              return 'No Address Provided. Google screwed us!';
            }
        });
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
        var infoWindows = [];
        mapView = this;
        this.collection.each(function (artPiece) {

            var marker = new google.maps.Marker({
                map: this.map,
                position: new google.maps.LatLng(
                    artPiece.get('latitude'),
                    artPiece.get('longitude')
                ),
                title: artPiece.get('title'),
                markerId: artPiece.cid
            });

            var info = '<div class="info-window">' +
                       '<p class="info-title">' + artPiece.get('title') +
                       '</div>';

            var infowindow = new google.maps.InfoWindow({
                content: info,
                infoId: artPiece.cid
            });

            infoWindows[infoWindows.length] = infowindow;

            google.maps.event.addListener(marker, 'click', function() {
                this.map.setZoom(14);
                this.map.setCenter(marker.position);
                for(i = 0;i<infoWindows.length; i++) { infoWindows[i].close(); }
                mapView.displayInformation(marker);
                infowindow.open(this.map,marker);
            });
        }, this);
        $('#map').replaceWith(this.el);
        google.maps.event.addDomListener(window, 'load', initialize);
    },
    displayInformation: function(marker) {
        console.log(this.collection.get(marker.markerId));
    }
});

APP.MarkerInfoBoxView = Backbone.View.extend({
    el: 'info-box',

    template: APP.template('markerInfoBox'),

    initialize: function() {
        this.render();
        this.listenTo(this.model, 'change', this.render());
    },

    render: function() {
        this.getFullAddress();
        console.log(this.model.toJSON());
        this.$el.html(this.template(this.model.toJSON()));
    },

    getFullAddress: function() {

        var address = this.model.getAddress(this.model.get('latitude'), this.model.get('longitude'));
        this.model.set({address: address});
        return this;
    }
});

APP.markerInfo = new APP.MarkerInfo();

APP.mapView = new APP.MapView({
    model: APP.map,
    collection: APP.artPieces
});

APP.markerInfoBox = new APP.MarkerInfoBoxView({model: APP.markerInfo});
$('#info-box').html(APP.markerInfoBox.el);

})();
