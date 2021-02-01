REQUIREMENTS TO RUN THIS PROJECT
- yarn as package manager installed
- Node.js in versin 10 or higher
- Android Stuido (Android SKD, Anroid SDK Platform, Anroid Virtual Device) & Java Development Kit version >= 0
- (You can also add the "expo cli", but npm should be enough)

---

STARTING THE PROJECT: 
```
1. Clone this repo to your machine
2. Make sure you have all requirements installed and setup. You can find a basic toturial on how to setup React Native on your OS here: https://reactnative.dev/docs/environment-setup
3. After installation you need to install all project specific dependencies. Therefor move into the root directory of the project and run:
```
yarn install
```
4. After installing dependencies should be good to go. To Start the local server and run the application either on a virutal or physical device, make sure the device is connected and turned on. Afterwards run the following command to start the metro server as well as the application:
```
npx react-native run-android
```
To only start the local server run: 
```
npx react-native start
```
5. You should now be able to use the application on your device. Saving changes in your code will automatically trigger a rerender of the application.


Sometimes after adding a new dependency you might have to delete the cache and restart the android dev env
```
npx start —–reset-cache
npx react-native run-android
```

---

Last but not least, if anything is not working always feel free to message me. I'll try my best to help you out as soon as posible!
