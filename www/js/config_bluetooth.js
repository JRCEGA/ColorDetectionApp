    var bluetoothApp = {
        macAddress: "98:D3:02:96:C3:41", // Asegúrate de que esta es la dirección MAC correcta
        isConnected: false,

        setupConnectButton: function() {
            var connectButton = document.getElementById('connectButton');
            if (connectButton) {
                connectButton.addEventListener('click', function() {
                    if (bluetoothApp.isConnected) {
                        bluetoothApp.disconnectFromBluetoothDevice();
                    } else {
                        bluetoothApp.connectToBluetoothDevice();
                    }
                });
            }
        },

        connectToBluetoothDevice: function() {
            var permissions = cordova.plugins.permissions;
            permissions.hasPermission(permissions.BLUETOOTH_CONNECT, function(status) {
                if (!status.hasPermission) {
                    permissions.requestPermission(permissions.BLUETOOTH_CONNECT, function(status) {
                        if (status.hasPermission) {
                            // Ahora comprueba el permiso BLUETOOTH_SCAN
                            permissions.hasPermission(permissions.BLUETOOTH_SCAN, function(status) {
                                if (!status.hasPermission) {
                                    permissions.requestPermission(permissions.BLUETOOTH_SCAN, function(status) {
                                        if (status.hasPermission) {
                                            bluetoothSerial.connect(bluetoothApp.macAddress, bluetoothApp.onConnectSuccess, bluetoothApp.onConnectError);
                                        }
                                    }, function() {
                                        console.warn('BLUETOOTH_SCAN permission denied');
                                    });
                                } else {
                                    bluetoothSerial.connect(bluetoothApp.macAddress, bluetoothApp.onConnectSuccess, bluetoothApp.onConnectError);
                                }
                            });
                        }
                    }, function() {
                        console.warn('BLUETOOTH_CONNECT permission denied');
                    });
                } else {
                    // Si ya tiene el permiso BLUETOOTH_CONNECT, comprueba BLUETOOTH_SCAN
                    permissions.hasPermission(permissions.BLUETOOTH_SCAN, function(status) {
                        if (!status.hasPermission) {
                            permissions.requestPermission(permissions.BLUETOOTH_SCAN, function(status) {
                                if (status.hasPermission) {
                                    bluetoothSerial.connect(bluetoothApp.macAddress, bluetoothApp.onConnectSuccess, bluetoothApp.onConnectError);
                                }
                            }, function() {
                                console.warn('BLUETOOTH_SCAN permission denied');
                            });
                        } else {
                            bluetoothSerial.connect(bluetoothApp.macAddress, bluetoothApp.onConnectSuccess, bluetoothApp.onConnectError);
                        }
                    });
                }
            });
        },

        disconnectFromBluetoothDevice: function() {
            bluetoothSerial.disconnect(bluetoothApp.onDisconnectSuccess, bluetoothApp.onDisconnectError);
        },

        onConnectSuccess: function() {
            bluetoothApp.isConnected = true;
            bluetoothApp.updateConnectButton();
            document.getElementById('statusMessage').textContent = "Conectado!";
            localStorage.setItem('isBluetoothConnected', 'true');
            updateBluetoothStatus(true);
            // Aquí puedes continuar con otras operaciones después de la conexión
        },

        onConnectError: function(error) {
            bluetoothApp.isConnected = false;
            bluetoothApp.updateConnectButton();
            document.getElementById('statusMessage').textContent = "Error de conexión: " + error;
        },

        onDisconnectSuccess: function() {
            bluetoothApp.isConnected = false;
            bluetoothApp.updateConnectButton();
            document.getElementById('statusMessage').textContent = "Desconectado!";
            localStorage.setItem('isBluetoothConnected', 'false');
            updateBluetoothStatus(false);
        },

        onDisconnectError: function(error) {
            document.getElementById('statusMessage').textContent = "Error al desconectar: " + error;
        },

        updateConnectButton: function() {
            var connectButton = document.getElementById('connectButton');
            if (bluetoothApp.isConnected) {
                connectButton.textContent = "Desconectar Bluetooth";
            } else {
                connectButton.textContent = "Conectar Bluetooth";
            }
        }
        
    };

    bluetoothApp.setupConnectButton();
