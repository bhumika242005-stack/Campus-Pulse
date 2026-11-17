# Campus Pulse



<h3 align="center">Real-Time Campus Entry, Exit & Occupancy Monitoring System</h3>



<p align="center">

&#x20; A software-based campus monitoring system for location-based student check-in, check-out, real-time event processing and campus occupancy monitoring.

</p>



<p align="center">

&#x20; <img src="https://img.shields.io/badge/React_Native-Expo-blue?logo=react" alt="React Native"/>

&#x20; <img src="https://img.shields.io/badge/Java-Spring_Boot-green?logo=springboot" alt="Spring Boot"/>

&#x20; <img src="https://img.shields.io/badge/Python-Processing-yellow?logo=python" alt="Python"/>

&#x20; <img src="https://img.shields.io/badge/Apache_Kafka-Event_Streaming-black?logo=apachekafka" alt="Kafka"/>

&#x20; <img src="https://img.shields.io/badge/PostgreSQL-Database-blue?logo=postgresql" alt="PostgreSQL"/>

&#x20; <img src="https://img.shields.io/badge/Redis-Cache-red?logo=redis" alt="Redis"/>

</p>



\---



## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Project Objectives](#2-project-objectives)
3. [Key Features](#3-key-features)
4. [Technology Stack](#4-technology-stack)
5. [System Architecture](#5-system-architecture)
6. [Project Structure](#6-project-structure)
7. [Team Responsibilities](#7-team-responsibilities)
8. [Prerequisites](#8-prerequisites)
9. [Environment Configuration](#9-environment-configuration)
10. [Local Setup and Execution](#10-local-setup-and-execution)
11. [Kafka Event Structure](#11-kafka-event-structure)
12. [API Endpoints](#12-api-endpoints)
13. [Deployment](#13-deployment)
14. [Future Scope](#14-future-scope)
15. [Team Members](#15-team-members)

\---



## 1. Project Overview



\*\*Campus Pulse\*\* is a software-based campus monitoring application designed to track student entry and exit activity through a location-based mobile application.



The system combines mobile application functionality with a real-time data processing pipeline to monitor campus activity across different zones.



Student activity events are processed using Apache Kafka and Python, with PostgreSQL and Redis supporting data storage and retrieval. The system also provides a web dashboard, analytics and alert information.



The project aims to make campus monitoring more efficient through digital tracking, event processing and centralized information management.



## 2. Project Objectives



\- Digitize student campus entry and exit tracking.

\- Provide location-based check-in and check-out through a mobile application.

\- Process campus activity events using a real-time data pipeline.

\- Monitor occupancy across different campus zones.

\- Store and retrieve campus activity records.

\- Present monitoring information through dashboards and analytics.

\- Improve the accessibility of campus activity information.



## 3. Key Features

| Feature | Description |
|---|---|
| Location-Based Tracking | Supports student check-in and check-out through the mobile application. |
| Event Streaming | Uses Apache Kafka to publish and consume campus activity events. |
| Event Processing | Processes and validates incoming events using Python. |
| Occupancy Monitoring | Tracks student presence across campus zones. |
| Database Management | Stores event and student presence information in PostgreSQL. |
| Redis Integration | Supports fast access to monitoring and alert information. |
| Analytics Dashboard | Displays campus activity and occupancy information. |
| Alert Monitoring | Provides campus alert information. |
| Backend Integration | Uses REST APIs and WebSocket configuration. |



## 4. Technology Stack

| Component | Technology |
|---|---|
| Mobile Application | React Native, Expo |
| Web Dashboard | React |
| Backend | Java, Spring Boot |
| Event Producer | Python |
| Event Consumer and Processing | Python |
| Message Broker | Apache Kafka |
| Relational Database | PostgreSQL |
| In-Memory Data Store | Redis |
| Containerization | Docker |
| Mobile Builds | Expo EAS |
| Version Control | Git and GitHub |



## 5. System Architecture



The Campus Pulse architecture consists of a mobile application, backend services, event streaming, data processing and database components.



```mermaid

flowchart TD

&#x20;   A\["Campus Pulse Mobile App"] --> B\["Spring Boot Backend"]

&#x20;   C\["React Web Dashboard"] --> B



&#x20;   B --> D\["Apache Kafka"]

&#x20;   E\["Python Producer / Simulator"] --> D



&#x20;   D --> F\["Python Kafka Consumer"]

&#x20;   F --> G\["Event Validation and Aggregation"]



&#x20;   G --> H\[("PostgreSQL")]

&#x20;   G --> I\[("Redis")]



&#x20;   B --> H

&#x20;   B --> I



&#x20;   B --> J\["REST APIs"]

&#x20;   B --> K\["WebSocket"]



&#x20;   J --> C

&#x20;   K --> C

```



### Data Processing Workflow



1\. The mobile application supports student check-in and check-out.

2\. The Spring Boot backend provides API endpoints for application communication.

3\. Campus activity events are published to Kafka.

4\. The Python consumer receives events from Kafka.

5\. The processing module validates and processes incoming events.

6\. PostgreSQL stores event and student presence information.

7\. Redis supports fast access to relevant monitoring and alert information.

8\. The backend retrieves information and exposes it through REST APIs and WebSocket integration.

9\. The dashboard displays available campus monitoring information.



\*\*Note:\*\* The Python producer and simulator also generate simulated campus activity for testing the event-streaming pipeline. This is separate from the mobile application's location-based workflow.



## 6. Project Structure



```text

Campus-Pulse/

│

├── backend/

│   ├── src/

│   │   ├── main/

│   │   │   ├── java/com/campuspulse/backend/

│   │   │   │   ├── config/

│   │   │   │   ├── controller/

│   │   │   │   ├── service/

│   │   │   │   └── websocket/

│   │   │   └── resources/

│   │   └── test/

│   ├── pom.xml

│   ├── mvnw

│   └── mvnw.cmd

│

├── frontend/

│   └── src/

│       ├── App.jsx

│       └── services/

│

├── mobile/

│   ├── src/

│   │   └── app/

│   ├── plugins/

│   ├── assets/

│   ├── app.json

│   ├── eas.json

│   └── package.json

│

├── producer/

│   ├── producer.py

│   ├── simulator.py

│   ├── requirements.txt

│   └── README.md

│

├── processing/

│   ├── aggregation/

│   ├── alerts/

│   ├── consumer/

│   ├── database/

│   ├── schema/

│   ├── requirements.txt

│   └── README.md

│

├── docker-compose.yml

└── README.md

```



## 7. Team Responsibilities

| Member | Responsibility | Technologies |
|---|---|---|
| Member 1 | Kafka Consumer, Stream Processing, PostgreSQL, Redis and Alert Processing | Python, Kafka, PostgreSQL, Redis |
| Member 2 | Kafka Producer, Event Generation and Publishing | Python, Kafka, Docker |
| Member 3 | Mobile Application UI, Location-Based Check-in/Check-out and API Integration | React Native, Expo |
| Member 4 | Spring Boot Backend, REST APIs, WebSocket Integration and React Dashboard | Java, Spring Boot, React |


## 8. Prerequisites

Install the following software before running the project:

- **Git:** Version control.
- **Java Development Kit (JDK):** Spring Boot backend.
- **Python 3:** Producer and processing modules.
- **Node.js and npm:** React and Expo applications.
- **Docker Desktop:** Kafka container.
- **Android device or emulator:** Mobile application testing.


## 9. Environment Configuration

The backend and Python processing modules use environment variables for database configuration.

| Variable | Purpose |
|---|---|
| `DB_HOST` | PostgreSQL hostname |
| `DB_PORT` | PostgreSQL port |
| `DB_NAME` | Database name |
| `DB_USER` | Database username |
| `DB_PASSWORD` | Database password |

Never commit actual database passwords, API keys or other sensitive credentials to GitHub.



## 10. Local Setup and Execution



### Step 1: Clone the repository



```bash

git clone https://github.com/bhumika242005-stack/Campus-Pulse.git



cd Campus-Pulse



git checkout integration/final-system

```



### Step 2: Start Kafka



From the project root directory:



```bash

docker compose up -d

```



Verify that the Kafka container is running:



```bash

docker ps

```



### Step 3: Create the Kafka topic



Create the `campus-events` topic:



```bash

docker exec campus-kafka /opt/kafka/bin/kafka-topics.sh --create --topic campus-events --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1

```



### Step 4: Run the Python Producer



Open a new terminal:



```bash

cd producer

```



Install dependencies:



```bash

pip install -r requirements.txt

```



Run the producer:



```bash

python producer.py

```



The producer publishes simulated campus activity events to the `campus-events` Kafka topic.



### Step 5: Run the Python Processing Module



Open another terminal:



```bash

cd processing

```



Install dependencies:



```bash

pip install -r requirements.txt

```



Configure the PostgreSQL environment variables in PowerShell:



```powershell

$env:DB_HOST="localhost"

$env:DB_PORT="5432"

$env:DB_NAME="campus_pulse"

$env:DB_USER="campus"

$env:DB_PASSWORD="your_database_password"

```



Ensure PostgreSQL and Redis are running.



Run the appropriate consumer or aggregator entry point according to the module configuration.



### Step 6: Run the Spring Boot Backend



Open another terminal:



```powershell

cd backend

```



Configure the required environment variables, including `DB_PASSWORD`.



Ensure Kafka, PostgreSQL and Redis are available.



Run the backend:



```powershell

.\\mvnw.cmd spring-boot:run

```



The backend uses port `8080` with the current local configuration.



### Step 7: Run the React Web Dashboard



Open another terminal:



```bash

cd frontend

```



Install dependencies:



```bash

npm install

```



Start the frontend using the development script configured in `package.json`:



```bash

npm run dev

```



### Step 8: Run the Mobile Application



Open another terminal:



```bash

cd mobile

```



Install dependencies:



```bash

npm install

```



Start Expo:



```bash

npx expo start

```



Use an Android device or emulator to test the mobile application.



> \*\*Infrastructure note:\*\* The current root `docker-compose.yml` defines Kafka only. PostgreSQL and Redis must be started separately according to their local configuration.



## 11. Kafka Event Structure

The producer generates JSON events containing the following fields:

| Field | Description |
|---|---|
| `event_id` | Unique event identifier |
| `student_id` | Student identifier |
| `zone` | Campus zone |
| `event_type` | Event type, such as check-in |
| `timestamp` | Event timestamp in ISO format |

### Example Event

```json
{
  "event_id": "70d7bcbd-ec81-4ea4-9eb6-da5fcc74b97f",
  "student_id": "S0369",
  "zone": "Library",
  "event_type": "check_in",
  "timestamp": "2026-09-21T10:50:58.123456+00:00"
}
```

### 12. API Endpoints



The Spring Boot backend provides the following REST endpoints:



| HTTP Method | Endpoint | Purpose |

|---|---|---|

| GET | `/api/zones` | Retrieve campus zone occupancy information |

| GET | `/api/events` | Retrieve campus activity events |

| GET | `/api/alerts` | Retrieve alert information |



The backend also contains WebSocket configuration for live update communication.



## 13. Deployment



The planned cloud deployment uses a Linux virtual machine to host the backend infrastructure and processing services.



The intended deployment architecture includes:



\- Apache Kafka

\- PostgreSQL

\- Redis

\- Spring Boot backend

\- Python consumer and aggregator

\- HTTPS access for the mobile application



Deployment-specific environment variables and secrets will be configured securely on the cloud server rather than committed to the repository.



## 14. Future Scope



\- Improved location validation and geofencing.

\- Enhanced campus occupancy reporting.

\- Configurable alert thresholds.

\- Automated cloud deployment and service recovery.

\- Improved scalability of the event-processing pipeline.

\- Additional campus monitoring features.



## 15. Team Members

| Member | Name | Responsibility |
|---|---|---|
| Member 1 | Dishita | Backend Processing and Database |
| Member 2 | Bhumika | Kafka Producer and Event Generation |
| Member 3 | Uttra | Mobile Application Development |
| Member 4 | Ishani | Backend APIs and Web Dashboard |

---

**Repository:** [Campus Pulse on GitHub](https://github.com/bhumika242005-stack/Campus-Pulse)
