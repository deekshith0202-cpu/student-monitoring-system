import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "./firebase";
import "./App.css";

function App() {
  const [data, setData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const monitorRef = ref(database, "studyMonitor");

    const unsubscribe = onValue(monitorRef, (snapshot) => {
      const value = snapshot.val();

      if (value) {
        setData(value);
        setLastUpdated(new Date());
      }
    });

    return () => unsubscribe();
  }, []);

  // --------------------------------------------------
  // Default values
  // --------------------------------------------------

  const studentStatus = data?.studentStatus || "WAITING";
  const temperature = data?.temperature ?? "--";
  const humidity = data?.humidity ?? "--";
  const ldrValue = data?.ldrValue ?? "--";
  const lightStatus = data?.lightStatus || "UNKNOWN";
  const studyTime = data?.studyTime || "0m 0s";
  const awayTime = data?.awayTime || "0m 0s";
  const buzzerStatus = data?.buzzerStatus ?? false;
  const deviceStatus = data?.deviceStatus || "OFFLINE";

  const isPresent = studentStatus === "PRESENT";
  const isBuzzerOn = buzzerStatus === true || buzzerStatus === "true";
  const isOnline = deviceStatus === "ONLINE";

  // --------------------------------------------------
  // Light percentage for visual meter
  // --------------------------------------------------

  let lightPercentage = 50;

  if (typeof ldrValue === "number") {
    lightPercentage = Math.min(100, Math.max(0, (ldrValue / 1023) * 100));
  } else if (!isNaN(Number(ldrValue))) {
    lightPercentage = Math.min(
      100,
      Math.max(0, (Number(ldrValue) / 1023) * 100)
    );
  }

  // --------------------------------------------------
  // Format last update
  // --------------------------------------------------

  const formattedTime = lastUpdated
    ? lastUpdated.toLocaleTimeString()
    : "--:--:--";

  return (
    <div className="app">

      {/* Background effects */}
      <div className="bg-glow glow-one"></div>
      <div className="bg-glow glow-two"></div>
      <div className="grid-background"></div>

      <div className="dashboard">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="topbar">

          <div className="brand">

            <div className="brand-icon">
              🎓
            </div>

            <div>
              <h1>StudyPulse</h1>
              <p>SMART STUDY MONITORING SYSTEM</p>
            </div>

          </div>

          <div className="top-status">

            <div className={`online-dot ${isOnline ? "active" : ""}`}></div>

            <div>
              <span className="status-label">
                SYSTEM
              </span>

              <strong>
                {isOnline ? "ONLINE" : "OFFLINE"}
              </strong>
            </div>

          </div>

        </header>

        {/* =================================================
            WELCOME
        ================================================= */}

        <section className="welcome-section">

          <div>
            <p className="small-heading">
              REAL-TIME MONITORING
            </p>

            <h2>
              Student Focus
              <span> Dashboard</span>
            </h2>

            <p className="welcome-text">
              Monitor study activity, environment conditions
              and focus sessions in real time.
            </p>
          </div>

          <div className="live-pill">
            <span></span>
            LIVE DATA
          </div>

        </section>

        {/* =================================================
            MAIN STATUS CARDS
        ================================================= */}

        <section className="main-cards">

          {/* Student Card */}

          <div className={`main-card student-card ${isPresent ? "present" : "away"}`}>

            <div className="card-top">

              <div className="card-icon">
                {isPresent ? "👨‍🎓" : "🚶"}
              </div>

              <span className="card-tag">
                STUDENT
              </span>

            </div>

            <div className="main-card-content">

              <p>Current Status</p>

              <h3>
                {studentStatus}
              </h3>

              <span className="description">
                {isPresent
                  ? "Focus monitoring is active"
                  : "Student is currently away"}
              </span>

            </div>

            <div className="status-wave">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

          </div>

          {/* Study Time Card */}

          <div className="main-card focus-card">

            <div className="card-top">

              <div className="card-icon purple">
                📚
              </div>

              <span className="card-tag">
                FOCUS SESSION
              </span>

            </div>

            <div className="main-card-content">

              <p>Total Study Time</p>

              <h3 className="study-time">
                {studyTime}
              </h3>

              <span className="description">
                Keep going — stay focused!
              </span>

            </div>

            <div className="focus-progress">

              <div className="progress-label">
                <span>Focus progress</span>
                <span>ACTIVE</span>
              </div>

              <div className="progress-bar">
                <div></div>
              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            SENSOR CARDS
        ================================================= */}

        <section className="sensor-grid">

          {/* Temperature */}

          <div className="sensor-card">

            <div className="sensor-header">

              <div className="sensor-icon temperature">
                🌡️
              </div>

              <span className="sensor-live">
                LIVE
              </span>

            </div>

            <p className="sensor-title">
              TEMPERATURE
            </p>

            <div className="sensor-value">
              {temperature}
              <span>°C</span>
            </div>

            <div className="sensor-footer">
              <span>Environment</span>
              <span>● NORMAL</span>
            </div>

          </div>

          {/* Humidity */}

          <div className="sensor-card">

            <div className="sensor-header">

              <div className="sensor-icon humidity">
                💧
              </div>

              <span className="sensor-live">
                LIVE
              </span>

            </div>

            <p className="sensor-title">
              HUMIDITY
            </p>

            <div className="sensor-value">
              {humidity}
              <span>%</span>
            </div>

            <div className="humidity-bar">
              <div
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, Number(humidity) || 0)
                  )}%`,
                }}
              ></div>
            </div>

            <div className="sensor-footer">
              <span>Air moisture</span>
              <span>● MONITORING</span>
            </div>

          </div>

          {/* Light */}

          <div className="sensor-card">

            <div className="sensor-header">

              <div className="sensor-icon light">
                ☀️
              </div>

              <span className="sensor-live">
                LIVE
              </span>

            </div>

            <p className="sensor-title">
              LIGHT LEVEL
            </p>

            <div className="sensor-value light-value">
              {lightStatus}
            </div>

            <div className="light-meter">

              <div
                className="light-fill"
                style={{
                  width: `${lightPercentage}%`,
                }}
              ></div>

            </div>

            <div className="sensor-footer">
              <span>LDR: {ldrValue}</span>
              <span>● SENSOR</span>
            </div>

          </div>

          {/* Buzzer */}

          <div className={`sensor-card buzzer-card ${isBuzzerOn ? "alarm" : ""}`}>

            <div className="sensor-header">

              <div className="sensor-icon buzzer">
                🔔
              </div>

              <span className="sensor-live">
                ALERT
              </span>

            </div>

            <p className="sensor-title">
              BUZZER
            </p>

            <div className="sensor-value">
              {isBuzzerOn ? "ON" : "OFF"}
            </div>

            <div className="buzzer-status">

              <div className={`pulse-dot ${isBuzzerOn ? "danger" : ""}`}>
              </div>

              <span>
                {isBuzzerOn
                  ? "Attention required"
                  : "System is quiet"}
              </span>

            </div>

          </div>

        </section>

        {/* =================================================
            LOWER SECTION
        ================================================= */}

        <section className="lower-grid">

          {/* Environment Monitor */}

          <div className="panel environment-panel">

            <div className="panel-header">

              <div>
                <p className="panel-label">
                  SENSOR ANALYTICS
                </p>

                <h3>
                  Environment Monitor
                </h3>
              </div>

              <div className="live-circle">
                ●
              </div>

            </div>

            <div className="environment-content">

              <div className="environment-item">

                <div className="env-icon">
                  🌡️
                </div>

                <div>
                  <span>Temperature</span>
                  <strong>{temperature}°C</strong>
                </div>

              </div>

              <div className="environment-item">

                <div className="env-icon">
                  💧
                </div>

                <div>
                  <span>Humidity</span>
                  <strong>{humidity}%</strong>
                </div>

              </div>

              <div className="environment-item">

                <div className="env-icon">
                  💡
                </div>

                <div>
                  <span>Lighting</span>
                  <strong>{lightStatus}</strong>
                </div>

              </div>

            </div>

            <div className="mini-chart">

              <div className="chart-line">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>

            </div>

          </div>

          {/* Away Monitor */}

          <div className="panel away-panel">

            <div className="panel-header">

              <div>
                <p className="panel-label">
                  ATTENTION MONITOR
                </p>

                <h3>
                  Away Session
                </h3>
              </div>

              <div className="away-icon">
                🚶
              </div>

            </div>

            <div className="away-time">
              {awayTime}
            </div>

            <p className="away-description">

              {isPresent
                ? "Student has returned. Study session resumed."
                : "Student is away from the study area."}

            </p>

            <div className="away-indicator">

              <div className={`away-dot ${!isPresent ? "warning" : ""}`}>
              </div>

              <span>
                {isPresent
                  ? "SESSION ACTIVE"
                  : "AWAY MONITORING"}
              </span>

            </div>

          </div>

        </section>

        {/* =================================================
            SYSTEM INFORMATION
        ================================================= */}

        <section className="system-panel">

          <div className="system-item">

            <span className="system-icon">
              📡
            </span>

            <div>
              <small>DEVICE</small>
              <strong>
                {deviceStatus}
              </strong>
            </div>

          </div>

          <div className="system-item">

            <span className="system-icon">
              🔥
            </span>

            <div>
              <small>FIREBASE</small>
              <strong>
                CONNECTED
              </strong>
            </div>

          </div>

          <div className="system-item">

            <span className="system-icon">
              🟢
            </span>

            <div>
              <small>DATA STREAM</small>
              <strong>
                REAL-TIME
              </strong>
            </div>

          </div>

          <div className="system-item">

            <span className="system-icon">
              🕐
            </span>

            <div>
              <small>LAST UPDATE</small>
              <strong>
                {formattedTime}
              </strong>
            </div>

          </div>

        </section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer>

          <span>
            STUDYPULSE • SMART STUDY MONITORING SYSTEM
          </span>

          <span>
            ESP8266 + FIREBASE
          </span>

        </footer>

      </div>
    </div>
  );
}

export default App;