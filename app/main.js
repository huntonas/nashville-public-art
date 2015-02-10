(function() {

APP = {};

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
        geocoder = new google.maps.Geocoder();
        console.log('In initialize');
        var latlng = new google.maps.LatLng(this.get('latitude'), this.get('longitude'));

        geocoder.geocode({'latLng': latlng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              if (results[1]) {
                this.address = results[1].formatted_address;
                console.log(results[1].formatted_address);
              } else {
                this.address = 'No Address Provided';
                console.log('In first else');
              }
            } else {
              this.address = 'No Address Provided. Google Blocked us';
              console.log('In second else');
            }
        });
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
        var infoWindows = [];
    
        this.collection.each(function (artPiece) {

            var marker = new google.maps.Marker({
                map: this.map,
                position: new google.maps.LatLng(
                    artPiece.get('latitude'),
                    artPiece.get('longitude')
                ),
                title: artPiece.get('title')
            });

            var info = '<div class="info-window">' +
                       '<p class="artist"><strong>Artist: </strong>' +  artPiece.get('first_name') + ' '+ artPiece.get('last_name') + '</p>' +
                        '<p class="type"><strong>Type: </strong>' + artPiece.get('type') + '</p>' +
                        '<p class="medium"><strong>Medium: </strong>' + artPiece.get('medium') + '</p>' +
                        '<p class="description"><strong>Description: </strong>' + artPiece.get('description') + '</p>' +
                        '<p class="location"><strong>Location: </strong>' + artPiece.get('location') + '</p>' +
                        '<p class="address"><strong>Address: </strong>' + artPiece.address + '</p>' +
                        '</div>';

            var infowindow = new google.maps.InfoWindow({
                content: info
            });

            infoWindows[infoWindows.length] = infowindow;

            google.maps.event.addListener(marker, 'click', function() {
                this.map.setZoom(14);
                for(i = 0;i<infoWindows.length; i++) { infoWindows[i].close(); }
                infowindow.open(this.map,marker);
            });
        }, this);
        $('#map').replaceWith(this.el);
        google.maps.event.addDomListener(window, 'load', initialize);
    }
});

APP.mapView = new APP.MapView({
    model: APP.map,
    collection: APP.artPieces
});

})();