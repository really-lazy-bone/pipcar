# pipcar
It's like pip boy but for car.

For AT&T Connected Car Hackathon Los Angeles 2015

Team PipCar
- Michael Hsu
- Eric Liao
- Morakot Pilouk

What is pipcar?
An application platform for timely and accurate first response in emergency situations. The platform consists of 3 apps: A car companion app for the driver with Mojio as the focus, a communication app for the first response officer, and a central command windows app for dispatchers. In normal driving mode, the car companion app warns the driver about reckless driving. When an officer/dispatcher creates an emergency event in a region, all car companion apps in the region will enter emergency mode. Users can request for help with their Mojio car data (lat/long, fuel/battery status) attached, communicate with nearby officers, and send text messages with their location to their emergency contacts. Nearby officers can view cars in the area on their map and can send commands/announcements to the cars using a Plantronics headset/Myo Armband. Central Dispatchers using their windows app can view live status of vehicles, and perform Watson Tradeoff analytics to decide which vehicles to assist first.​

![PipCar](https://raw.githubusercontent.com/really-lazy-bone/pipcar/master/pipcar.PNG?raw=true)

Platform Solutions
- Mojio devices and API
- Plantronics Voyager Edge UC
- Myo Armband
- AT&T Speech to Text
- IBM Bluemix server & Watson Analytics, text to speech

PipCar Applications
- Car companion app (mobile app)
- Officer app
- Dispatcher app

Features
- Amber alerts for cars on in-dash display console and audio via speakers 
- Government/Officer directions/instructions broadcast to car app
- Emergency escalation
- Driving behaviors & feedback
