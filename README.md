🌦 Real Time Weather Monitoring System using ESP32

<p align="center">
  <img src="images/iot-poster.png" width="1000">
</p>

---
📌 Project Overview

This project is an IoT-based **Real Time Weather Monitoring System** developed using **ESP32** and multiple environmental sensors.

The system continuously monitors:

* 🌡 Temperature
* 💧 Humidity
* 🌱 Soil Moisture
* 🌧 Rain Detection
* ☀ Light Intensity

The collected data is displayed on:

* 🌐 Custom Live Web Dashboard
* 📱 Blynk IoT Dashboard

---

🚀 Features

✅ Real-time sensor monitoring
✅ Live graphical dashboard
✅ ESP32 WiFi connectivity
✅ Web Server integration
✅ Blynk IoT support
✅ Responsive dashboard UI
✅ Live sensor graph updates
✅ Soil moisture monitoring
✅ Rain detection system

---
 🛠 Technologies Used

| Technology  | Purpose              |
| ----------- | -------------------- |
| ESP32       | Main Microcontroller |
| Arduino IDE | Programming          |
| HTML        | Dashboard Structure  |
| CSS         | Dashboard Design     |
| JavaScript  | Live Data Fetching   |
| Blynk IoT   | Cloud Monitoring     |
| Web Server  | Real-time Data API   |

---
🔧 Sensors Used

| Sensor               | Function                  |
| -------------------- | ------------------------- |
| DHT22 Sensor         | Temperature & Humidity    |
| Soil Moisture Sensor | Soil Water Detection      |
| Rain Sensor          | Rainfall Detection        |
| LDR Sensor           | Light Intensity Detection |

---

📡 Working Principle

The sensors collect environmental data and send it to the ESP32.

ESP32 processes the sensor data and:

1. Sends data to the Blynk IoT platform
2. Hosts a local web server
3. Displays live values on the custom dashboard

---

🔄 System Flow

```text
Sensors → ESP32 → WiFi → Web Server → Dashboard
```

---

🖥 Dashboard Preview

<p align="center">
  <img src="images/dashboard.png" width="900">
</p>

---

⚙ Hardware Setup

<p align="center">
  <img src="images/setup.jpg" width="900">
</p>

---

📷 Sensor Setup

<p align="center">
  <img src="images/sensors.jpg" width="900">
</p>

---

📊 Applications

* 🌱 Smart Agriculture
* 🌦 Weather Monitoring Stations
* 🏠 Smart Home Systems
* 🌍 Environmental Monitoring
* 💧 Smart Irrigation Systems

---

🔥 Advantages

* Low cost
* Easy to use
* Real-time monitoring
* Wireless communication
* Remote monitoring support
* Modern dashboard interface

---

🔮 Future Scope

* Cloud database integration
* AI weather prediction
* Mobile notifications
* Automatic irrigation control
* Mobile app support

---

📁 Project Structure

```bash
Weather-Detection-System/
│
├── code/
│   ├── esp32_code.ino
│   ├── index.html
│   ├── style.css
│   ├── script.js
│
├── images/
│   ├── dashboard.png
│   ├── setup.jpg
│   ├── sensors.jpg
│   ├── iot-poster.png
│
├── README.md
```

---

💻 ESP32 Web Server API

```cpp
server.on("/data", handleData);
server.begin();
```

---

🌐 Web Dashboard

The dashboard fetches live sensor data every 2 seconds using JavaScript fetch API.

```javascript
fetch("http://ESP32_IP/data")
```

---
👨‍💻 Developed By
Prachi Shinde

Electronics & Communication Engineering

---
