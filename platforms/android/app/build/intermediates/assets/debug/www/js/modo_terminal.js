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
            bluetoothSerial.write('c,1\r\n', this.onWriteSuccess, this.onWriteError);
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
        } else {
            console.log("Formato de datos incorrecto:", data);
        }
    },

    // Actualizar la interfaz de usuario
    updateInterface: function() {
        var colorDisplay = document.getElementById('colorDisplay');
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

// Inicializar la interfaz del sensor cuando la aplicación esté lista
document.addEventListener('deviceready', function() {
    sensorInterface.initialize();
    setupButtonListeners();
    setupCommandInputListener();
}, false);

function setupButtonListeners() {
    document.getElementById('CMONButton').addEventListener('click', function() {
        sendCommand('C,1'); // Suponiendo que 'C,1' es el comando para activar la lectura continua
    });

    document.getElementById('CMOFFButton').addEventListener('click', function() {
        sendCommand('C,0'); // Suponiendo que 'C,0' es el comando para detener la lectura continua
    });

    document.getElementById('SRButton').addEventListener('click', function() {
        sendCommand('R'); // Suponiendo que 'C,0' es el comando para detener la lectura continua
    });

    document.getElementById('LOFFButton').addEventListener('click', function() {
        sendCommand('L,50,T'); // Suponiendo que 'C,0' es el comando para detener la lectura continua
    });

    document.getElementById('LONButton').addEventListener('click', function() {
        sendCommand('L,50'); // Suponiendo que 'C,0' es el comando para detener la lectura continua
    });

    document.getElementById('CALButton').addEventListener('click', function() {
        sendCommand('Cal'); // Suponiendo que 'C,0' es el comando para detener la lectura continua
    });

}

function sendCommand(command) {
    bluetoothSerial.write(command + '\r\n', sensorInterface.onWriteSuccess, sensorInterface.onWriteError);
}

function sendCommandKeyboard() {
    var command = document.getElementById('commandInput').value; // Obtiene el comando del área de texto
    if (command) { // Si hay un comando para enviar
        bluetoothSerial.write(command + '\r\n', sensorInterface.onWriteSuccess, sensorInterface.onWriteError);
        document.getElementById('commandInput').value = ''; // Limpia el área de texto después de enviar
    }
}   