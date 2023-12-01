var app = {

    // Inicializar la aplicación
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    // Evento deviceready
    onDeviceReady: function() {
        if (window.configBluetooth) {
            window.configBluetooth.initialize();
        }
    },

};

app.initialize();
