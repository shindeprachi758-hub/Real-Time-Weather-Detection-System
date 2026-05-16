/**
 * REAL TIME WEATHER MONITORING SYSTEM
 * 
 * SETUP INSTRUCTIONS:
 * 1. ESP32 IP Address: Replace the 'esp32Url' below with the IP address of your ESP32.
 *    Example: If your ESP32 IP is 192.168.1.100, leave it as 'http://192.168.1.100/data'
 * 2. Running the Dashboard: Open 'index.html' using the VS Code "Live Server" extension, 
 *    or simply double-click 'index.html' to open it in your browser.
 * 3. Testing JSON Data: If the ESP32 is offline, the script will automatically generate
 *    dummy values to demonstrate how the dashboard works.
 * 4. Connecting ESP32: Ensure your ESP32 code includes CORS headers so the browser 
 *    allows the fetch request (e.g., server.sendHeader("Access-Control-Allow-Origin", "*");)
 */

// ==========================================
// CONFIGURATION
// ==========================================
const esp32Url = 'http://172.22.25.112//data'; // <-- PASTE ESP32 IP ADDRESS HERE
const refreshInterval = 2000; // 2 seconds

// ==========================================
// DOM ELEMENTS
// ==========================================
const statusIndicator = document.getElementById('connection-status');
const statusText = statusIndicator.querySelector('.status-text');

// Value Elements
const elTemp = document.getElementById('val-temp');
const elHum = document.getElementById('val-hum');
const elSoil = document.getElementById('val-soil');
const elRain = document.getElementById('val-rain');
const elLdr = document.getElementById('val-ldr');

// Status Label Elements
const lblSoil = document.getElementById('status-soil');
const lblRain = document.getElementById('status-rain');
const lblLdr = document.getElementById('status-ldr');

// ==========================================
// CHART.JS INITIALIZATION
// ==========================================
const ctx = document.getElementById('weatherChart').getContext('2d');
const maxDataPoints = 20; // Keep the last 20 data points

const weatherChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Time labels
        datasets: [
            {
                label: 'Temperature (°C)',
                borderColor: '#ef4444', // Red
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 2,
                pointRadius: 3,
                tension: 0.4, // Smooth curve
                data: [],
                yAxisID: 'y'
            },
            {
                label: 'Humidity (%)',
                borderColor: '#3b82f6', // Blue
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                pointRadius: 3,
                tension: 0.4,
                data: [],
                yAxisID: 'y1'
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: '#f8fafc' }
            }
        },
        scales: {
            x: {
                ticks: { color: '#94a3b8' },
                grid: { color: '#334155' }
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                ticks: { color: '#ef4444' },
                grid: { color: '#334155' },
                title: { display: true, text: 'Temp °C', color: '#ef4444' }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                ticks: { color: '#3b82f6' },
                grid: { drawOnChartArea: false }, // don't draw grid lines over previous
                title: { display: true, text: 'Hum %', color: '#3b82f6' }
            }
        }
    }
});

// ==========================================
// DUMMY DATA GENERATOR (Fallback)
// ==========================================
let dummyTemp = 30;
let dummyHum = 65;
let dummySoil = 450;

function getDummyData() {
    // Add some random fluctuations
    dummyTemp += (Math.random() - 0.5) * 2;
    dummyHum += (Math.random() - 0.5) * 3;
    dummySoil += (Math.random() - 0.5) * 20;

    // Constrain values
    if (dummyTemp < 15) dummyTemp = 15; if (dummyTemp > 45) dummyTemp = 45;
    if (dummyHum < 30) dummyHum = 30; if (dummyHum > 95) dummyHum = 95;
    if (dummySoil < 0) dummySoil = 0; if (dummySoil > 1023) dummySoil = 1023;

    return {
        temperature: dummyTemp.toFixed(1),
        humidity: dummyHum.toFixed(1),
        soil: Math.round(dummySoil),
        rain: Math.random() > 0.8 ? 0 : 1023, // 20% chance of rain
        light: Math.random() > 0.5 ? 800 : 200  // Randomly toggle day/night
    };
}

// ==========================================
// UPDATE UI FUNCTION
// ==========================================
function setStatusLabel(element, text, statusClass) {
    element.innerText = text;
    element.className = 'status-label ' + statusClass;
}

function updateDashboard(data) {
    // 1. Update Numerical Values
    elTemp.innerText = data.temperature;
    elHum.innerText = data.humidity;
    elSoil.innerText = data.soil;
    elRain.innerText = data.rain;
    elLdr.innerText = data.light;

    // 2. Update Status Indicators
    // Soil: assuming < 600 is wet, > 600 is dry
    if (data.soil < 600) {
        setStatusLabel(lblSoil, "Soil is Wet", "status-good");
    } else {
        setStatusLabel(lblSoil, "Soil is Dry", "status-warn");
    }

    // Rain: assuming 0 or low value means rain detected
    if (data.rain < 500) {
        setStatusLabel(lblRain, "Rain Detected", "status-info");
    } else {
        setStatusLabel(lblRain, "No Rain", "status-neutral");
    }

    // LDR: assuming > 500 is day, < 500 is night
    if (data.light > 500) {
        setStatusLabel(lblLdr, "Daytime", "status-good");
    } else {
        setStatusLabel(lblLdr, "Nighttime", "status-neutral");
    }

    // 3. Update Chart
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' +
        now.getMinutes().toString().padStart(2, '0') + ':' +
        now.getSeconds().toString().padStart(2, '0');

    // Add new data
    weatherChart.data.labels.push(timeString);
    weatherChart.data.datasets[0].data.push(data.temperature);
    weatherChart.data.datasets[1].data.push(data.humidity);

    // Remove oldest data if we exceed max points
    if (weatherChart.data.labels.length > maxDataPoints) {
        weatherChart.data.labels.shift();
        weatherChart.data.datasets[0].data.shift();
        weatherChart.data.datasets[1].data.shift();
    }

    weatherChart.update();
}

// ==========================================
// FETCH DATA LOOP
// ==========================================
async function fetchSensorData() {
    try {
        // Attempt to fetch from ESP32
        // We use AbortController to timeout the request if the ESP32 is offline
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);

        const response = await fetch(esp32Url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();

        // Update connection status
        statusIndicator.className = 'status-indicator connected';
        statusText.innerText = 'ESP32 Connected';

        // Update UI
        updateDashboard(data);

    } catch (error) {
        // Fetch failed (ESP32 is offline or wrong IP)
        // Update connection status
        statusIndicator.className = 'status-indicator disconnected';
        statusText.innerText = 'ESP32 Offline (Using Dummy Data)';

        console.warn("Could not connect to ESP32. Using simulated data. Error:", error.message);

        // Use dummy data so the dashboard still looks active
        const simulatedData = getDummyData();
        updateDashboard(simulatedData);
    }
}

// Start fetching data immediately, then repeat every X milliseconds
fetchSensorData();
setInterval(fetchSensorData, refreshInterval);
