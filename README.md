# Bluetooth Color Detection

### Overview

This project consists on two parts.
1. The setup of the EZO-RGB color sensor, with Arduino UNO and the HC-05 Bluetooth Module.
2. The creation of a mobile application

The overall goal of the project is to succesfully see the health state of a plant, using the color sensor to show the results, coding implementation to set a color range for each health state, and finally receiving the data via Bluetooth on a mobile device using this App that can satisfactorily process this data and show on a GUI the overall health state of the plant, aditionally giving recomendations in order to mantain, or save the health state.

The mobile app also has other functions labeled as 'free mode' which lets the user play around with the sensor trying with different colors, and a 'terminal mode', which also let the users see the RGB values on a terminal, and also use pre-defined commands to configure the sensor.

The Android application was made using the mobile app development framework Apache Cordova, it enables software programmers to build hybrid web applications for mobile devices using CSS3, HTML5, and JavaScript, instead of relying on platform-specific APIs like those in Android, iOS, or Windows Phone.

## Setting up EZO-RGB with Arduino UNO

1. Download and Install Arduino IDE (Latest Version)

https://www.arduino.cc/en/software

2. Properly connect all components (sensor & bluetooth module) as seen on the Jupyter Notebook.

3. Open Arduino IDE, and when prompted, install all the necesary software and drivers.

4. Connect the Arduino on the computer, then, on the IDE on 'Select Board', look for Arduino UNO.

5. Check that the Serial COM Port has been selected succesfully.

6. Run the Arduino IDE sketch on the ... folder.

7. The color sensor should be succesfully working now, check on 'Serial Monitor' on the upper-right corner.

8. Select 9600 Baud Rate and 'Both NL and CR', you should start seeing RGB values.

## Installing the mobile application on an Android device or emulator

1. Install Node.js (Latest Version)

https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi

2. Open a Node.js command-prompt or windows CMD and type: 
```
npm install -g cordova
```

3. Install all the necessary software & tools for Android.

https://cordova.apache.org/docs/en/12.x/guide/platforms/android/index.html

4. Run to check if everything installed correctly
```
cordova requirements
```

5. on Node.js command-prompt, navigate to the application download path, for example, if your download is in 'Downloads' it should look like this:
```
cd "C:\Users\rcebr\Downloads\ColorDetectionAndroid"
```

6. Run, if everything went correctly, should start popping up.

```
cordova run
```

