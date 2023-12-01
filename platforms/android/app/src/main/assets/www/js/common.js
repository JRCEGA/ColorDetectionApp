// common.js
function updateBluetoothStatus(connected) {
    var bluetoothIcon = document.querySelector('.icon-bluetooth');
    var bluetoothText = document.getElementById('bluetoothText');
  
    if (bluetoothIcon && bluetoothText) {
        if (connected) {
            bluetoothIcon.style.fill = "#005EB8"; // Color azul para indicar "Conectado"
            bluetoothText.textContent = ": Conectado";
        } else {
            bluetoothIcon.style.fill = "#000000"; // Color negro para indicar "Desconectado"
            bluetoothText.textContent = ": Desconectado";
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el estado del Bluetooth ya está en el DOM
    var existingBluetoothStatus = document.getElementById('bluetoothStatus');
    if (!existingBluetoothStatus) {
        var bluetoothStatusHTML = `
            <div id="bluetoothStatus" class="bluetooth-status">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" class="icon-bluetooth">
                    <path d="m4.41 16.192 1.18 1.615L10 14.584V21a1 1 0 0 0 1.541.841l7-4.5a.999.999 0 0 0 .049-1.649L13.537 12l5.053-3.692a1.002 1.002 0 0 0-.049-1.65l-7-4.5a1.002 1.002 0 0 0-1.021-.037c-.32.176-.52.513-.52.879v6.416L5.59 6.192 4.41 7.808 10 11.893v.215l-5.59 4.084zM12 4.832l4.232 2.721L12 10.646V4.832zm0 8.522 4.232 3.093L12 19.168v-5.814z"/>
                </svg>
                <span id="bluetoothText">: Desconectado</span>
            </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', bluetoothStatusHTML);
    }

    var isConnected = localStorage.getItem('isBluetoothConnected') === 'true';
    updateBluetoothStatus(isConnected);

    var backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.history.back();
        });
    }
});

  