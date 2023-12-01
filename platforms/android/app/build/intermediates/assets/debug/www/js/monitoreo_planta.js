var sensorInterface = {
    color: { r: 0, g: 0, b: 0 },

    // Inicializar la interfaz del sensor después de la conexión Bluetooth exitosa
    initialize: function() {
        this.setupSensor();
        this.readSensorData();
    },

    // Configuración inicial del sensor
    setupSensor: function() {
        // Envía comandos de configuración inicial al dispositivo Bluetooth
        bluetoothSerial.write('c,0\r\n', this.onWriteSuccess, this.onWriteError);
        setTimeout(() => {
            bluetoothSerial.write('l,50,t\r\n', this.onWriteSuccess, this.onWriteError);
            bluetoothSerial.write('g,1.00\r\n', this.onWriteSuccess, this.onWriteError);
            bluetoothSerial.write('c,0\r\n', this.onWriteSuccess, this.onWriteError);
        }, 600);
    },

    // Leer datos del sensor
    readSensorData: function() {
        bluetoothSerial.subscribe('\r', function(data) {
            if (data) {
                data = data.trim();
                sensorInterface.processReceivedData(data);
                sensorInterface.updateBluetoothData(data);
            }
        }, sensorInterface.onReadError);
    },

    // Procesar los datos recibidos
    processReceivedData: function(data) {
        var parts = data.split(',');
        if (parts.length === 3) {
            this.color.r = parseInt(parts[0]);
            this.color.g = parseInt(parts[1]);
            this.color.b = parseInt(parts[2]);
            this.updateInterface();

            // Después de actualizar la interfaz, verifica la salud de la planta.
            var healthStatus = checkPlantHealth(this.color.r, this.color.g, this.color.b);
            displayPlantHealthMessage(healthStatus);
        } else {
            console.log("Formato de datos incorrecto:", data);
        }
    },

    // Actualizar la interfaz de usuario
    updateInterface: function() {
        var colorDisplay = document.getElementById('colorDisplayTerminal');
        var rLabel = document.getElementById('rLabel');
        var gLabel = document.getElementById('gLabel');
        var bLabel = document.getElementById('bLabel');

        colorDisplay.style.backgroundColor = 'rgb(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ')';
        rLabel.textContent = 'R: ' + this.color.r;
        gLabel.textContent = 'G: ' + this.color.g;
        bLabel.textContent = 'B: ' + this.color.b;
    },

    // Actualizar la mini terminal Bluetooth con los datos recibidos
    updateBluetoothData: function(data) {
        var bluetoothDataElement = document.getElementById('bluetoothData');
        bluetoothDataElement.textContent += data + '\n';
        bluetoothDataElement.scrollTop = bluetoothDataElement.scrollHeight;
    },

    onWriteSuccess: function() {
        console.log("Comando enviado exitosamente");
    },

    onWriteError: function(error) {
        console.error("Error enviando comando:", error);
    },

    onReadError: function(error) {
        console.error("Error leyendo datos:", error);
    }
};

var healthyGreenRanges = [
    { min: { r: 0, g: 90, b: 0 }, max: { r: 140, g: 255, b: 130 } }
];

var moderateGreenRanges = [
    { min: { r: 50, g: 50, b: 0 }, max: { r: 255, g: 200, b: 150 } }
];

var unhealthyGreenRanges = [
    { min: { r: 0, g: 0, b: 0 }, max: { r: 110, g: 80, b: 45 } },
];

function checkPlantHealth(r, g, b) {
    if (isInRange(r, g, b, healthyGreenRanges)) {
        return 'saludable';
    } else if (isInRange(r, g, b, moderateGreenRanges)) {
        return 'moderado';
    } else if (isInRange(r, g, b, unhealthyGreenRanges)) {
        return 'no saludable';
    } else {
        return "El color detectado parece no ser el de una planta.";
    }
}

function isInRange(r, g, b, ranges) {
    return ranges.some(function(range) {
        return r >= range.min.r && r <= range.max.r &&
               g >= range.min.g && g <= range.max.g &&
               b >= range.min.b && b <= range.max.b;
    });
}

function processReceivedData(data) {
    var parts = data.split(',');
    if (parts.length === 3) {
        var r = parseInt(parts[0]),
            g = parseInt(parts[1]),
            b = parseInt(parts[2]),
            healthStatus = checkPlantHealth(r, g, b);

        // Aquí actualizas la interfaz con el mensaje de salud de la planta
        var healthStatus = checkPlantHealth(this.color.r, this.color.g, this.color.b);
        displayPlantHealthMessage(healthStatus);
    } else {
        console.log("Formato de datos incorrecto:", data);
    }
}

function displayPlantHealthMessage(healthStatus) {
    // Primero, ocultar todos los mensajes
    document.getElementById('mensajeSaludable').style.display = 'none';
    document.getElementById('mensajeModerado').style.display = 'none';
    document.getElementById('mensajeNoSaludable').style.display = 'none';
    document.getElementById('mensajeError').style.display = 'none';

    // Luego, mostrar el mensaje adecuado basado en el estado de salud
    var mensajeId = '';
    switch (healthStatus) {
        case 'saludable':
            mensajeId = 'mensajeSaludable';
            break;
        case 'moderado':
            mensajeId = 'mensajeModerado';
            break;
        case 'no saludable':
            mensajeId = 'mensajeNoSaludable';
            break;
        default:
            mensajeId = 'mensajeError';
            break;
    }
    document.getElementById(mensajeId).style.display = 'block';
}

// Inicializar la interfaz del sensor cuando la aplicación esté lista
document.addEventListener('deviceready', function() {
    sensorInterface.initialize();
    setupButtonListeners();
    setupCommandInputListener();
}, false);

function setupButtonListeners() {
    document.getElementById('plantReadingButton').addEventListener('click', function() {
        sendCommand('R');
        showPlantColorInfo();
    });
}

function showPlantColorInfo() {
    var label = document.getElementById('label1');
    label.style.display = 'block'; // Esto hará que el div sea visible.
}

function sendCommand(command) {
    bluetoothSerial.write(command + '\r\n', sensorInterface.onWriteSuccess, sensorInterface.onWriteError);
}
