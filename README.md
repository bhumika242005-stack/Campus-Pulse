\# Campus Pulse



\### Real-Time Campus Entry, Exit and Occupancy Monitoring System



Campus Pulse is a software-based campus monitoring system that helps track student entry and exit activity through a mobile application. It combines location-based check-in/check-out functionality with event streaming, backend processing, database storage and monitoring dashboards.



The system is designed to provide campus activity information, zone occupancy, analytics and alerts.



\---



\## 1. Project Objectives



\- Digitize student campus entry and exit tracking.

\- Provide location-based check-in and check-out through a mobile application.

\- Process campus activity events using a real-time data pipeline.

\- Monitor occupancy across different campus zones.

\- Store and retrieve campus activity records.

\- Present monitoring information through dashboards and analytics.



\## 2. Key Features



\- Mobile application for student check-in and check-out.

\- Location-based entry and exit functionality.

\- Event generation and Kafka message publishing.

\- Kafka-based event streaming.

\- Python event consumption and processing.

\- PostgreSQL storage for events and student presence.

\- Redis integration for fast data access and alert information.

\- Campus zone occupancy monitoring.

\- Analytics dashboard.

\- Alert information and monitoring.

\- REST API and WebSocket backend integration.



\## 3. Technology Stack



| Component | Technology |

|---|---|

| Mobile application | React Native, Expo |

| Web dashboard | React |

| Backend | Java, Spring Boot |

| Event producer | Python |

| Event consumer and processing | Python |

| Message broker | Apache Kafka |

| Relational database | PostgreSQL |

| In-memory data store | Redis |

| Containerization | Docker |

| Mobile builds | Expo Application Services (EAS) |

| Version control | Git, GitHub |



\## 4. System Architecture



```mermaid

flowchart TD

&#x20;   A\[Mobile Application] --> B\[Spring Boot Backend]

&#x20;   C\[React Web Dashboard] --> B

&#x20;   B --> D\[Apache Kafka]

&#x20;   E\[Python Producer and Simulator] --> D

&#x20;   D --> F\[Python Consumer]

&#x20;   F --> G\[Event Aggregator]

&#x20;   G --> H\[PostgreSQL]

&#x20;   G --> I\[Redis]

&#x20;   B --> H

&#x20;   B --> I

&#x20;   B --> J\[REST APIs]

&#x20;   B --> K\[WebSocket Updates]

&#x20;   J --> C

&#x20;   K --> C

```



\### Data Processing Workflow



1\. The mobile application supports student check-in and check-out.

2\. The Spring Boot backend provides API endpoints for application communication.

3\. Campus activity events are published to Kafka.

4\. The Python consumer receives events from Kafka.

5\. The processing module validates and processes incoming events.

6\. PostgreSQL stores event and student presence information.

7\. Redis supports fast access to relevant monitoring and alert information.

8\. The backend retrieves information and exposes it through REST APIs and WebSocket integration.

9\. The dashboard displays available campus monitoring information.



The Python producer and simulator also support simulated campus activity for testing the event-streaming pipeline.



\## 5. Project Structure



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



\## 6. Module Responsibilities



| Member | Responsibility | Technologies |

|---|---|---|

| Member 1 | Kafka Consumer, Stream Processing, PostgreSQL, Redis and Alert Processing | Python, Kafka, PostgreSQL, Redis |

| Member 2 | Kafka Producer, Event Generation and Publishing | Python, Kafka, Docker |

| Member 3 | Mobile Application UI, Location-Based Check-in/Check-out and API Integration | React Native, Expo |

| Member 4 | Spring Boot Backend, REST APIs, WebSocket Integration and React Dashboard | Java, Spring Boot, React |



\## 7. Prerequisites



Install the following software:



\- Git

\- Java Development Kit (JDK)

\- Python 3

\- Node.js and npm

\- Docker Desktop

\- Android device or emulator for mobile testing



\## 8. Configuration



The backend and Python processing modules use environment variables for database configuration.



| Variable | Purpose |

|---|---|

| `DB\_HOST` | PostgreSQL hostname |

| `DB\_PORT` | PostgreSQL port |

| `DB\_NAME` | Database name |

| `DB\_USER` | Database username |

| `DB\_PASSWORD` | Database password |



Never commit database passwords, API keys or other credentials to GitHub.



\## 9. Running the Project Locally



\### Step 1: Clone the repository



```bash

git clone https://github.com/bhumika242005-stack/Campus-Pulse.git

cd Campus-Pulse

```



Switch to the integrated project branch:



```bash

git checkout integration/final-system

```



\### Step 2: Start Kafka



From the project root:



```bash

docker compose up -d

```



Check the running container:



```bash

docker ps

```



\### Step 3: Create the Kafka topic



```bash

docker exec campus-kafka /opt/kafka/bin/kafka-topics.sh --create --topic campus-events --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1

```



\### Step 4: Run the Python producer



Open a terminal in the project root:



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



The producer publishes simulated campus events to the `campus-events` Kafka topic.



\### Step 5: Run the Python processing module



Open another terminal:



```bash

cd processing

```



Install dependencies:



```bash

pip install -r requirements.txt

```



Configure the database environment variables and ensure PostgreSQL and Redis are running.



For Windows PowerShell, example environment variables are:



```powershell

$env:DB\_HOST="localhost"

$env:DB\_PORT="5432"

$env:DB\_NAME="campus\_pulse"

$env:DB\_USER="campus"

$env:DB\_PASSWORD="your\_database\_password"

```



Run the appropriate consumer or aggregator entry point according to the module configuration.



\### Step 6: Run the Spring Boot backend



Open another terminal:



```powershell

cd backend

```



Configure the required environment variables, including `DB\_PASSWORD`, and ensure Kafka, PostgreSQL and Redis are available.



Run:



```powershell

.\\mvnw.cmd spring-boot:run

```



The backend runs on port `8080` with the current local configuration.



\### Step 7: Run the React frontend



Open another terminal:



```powershell

cd frontend

```



Install dependencies:



```bash

npm install

```



Start the frontend using its configured development script:



```bash

npm run dev

```



\### Step 8: Run the Expo mobile application



Open another terminal:



```powershell

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



\*\*Note:\*\* PostgreSQL and Redis must be started separately according to their configured local setup. The current root Docker Compose file defines Kafka only.



\## 10. Kafka Event Structure



The producer generates JSON events containing the following fields:



| Field | Description |

|---|---|

| `event\_id` | Unique event identifier |

| `student\_id` | Student identifier |

| `zone` | Campus zone |

| `event\_type` | Event type, such as check-in |

| `timestamp` | Event timestamp in ISO format |



Example:



```json

{

&#x20; "event\_id": "70d7bcbd-ec81-4ea4-9eb6-da5fcc74b97f",

&#x20; "student\_id": "S0369",

&#x20; "zone": "Library",

&#x20; "event\_type": "check\_in",

&#x20; "timestamp": "2026-09-21T10:50:58.123456+00:00"

}

```



The producer uses the zone as the Kafka message key and publishes events to the `campus-events` topic.



\## 11. API Endpoints



| HTTP Method | Endpoint | Purpose |

|---|---|---|

| GET | `/api/zones` | Retrieve campus zone occupancy |

| GET | `/api/events` | Retrieve campus activity events |

| GET | `/api/alerts` | Retrieve alert information |



The backend also contains WebSocket configuration for live update communication.



\## 12. Deployment



The planned cloud deployment uses a Linux virtual machine to host the backend infrastructure and processing services.



The intended cloud architecture includes:



\- Apache Kafka

\- PostgreSQL

\- Redis

\- Spring Boot backend

\- Python consumer and aggregator

\- HTTPS access for the mobile application



Deployment-specific environment variables and secrets should be configured securely on the cloud server rather than committed to the repository.



\## 13. Future Scope



\- Improved location validation and geofencing.

\- Enhanced occupancy reporting.

\- Configurable alert thresholds.

\- Automated cloud deployment and service recovery.

\- Improved scalability of the event-processing pipeline.

\- Additional campus monitoring features.



\## 14. Team Members



| Member | Name | Responsibility |

|---|---|---|

| Member 1 | Dishita | Backend Processing and Database |

| Member 2 | Bhumika | Kafka Producer and Event Generation |

| Member 3 | Uttra | Mobile Application Development |

| Member 4 | Ishani | Backend APIs and Web Dashboard |



\---



\*\*Project:\*\* Campus Pulse  

\*\*Repository:\*\* https://github.com/bhumika242005-stack/Campus-Pulse  

\*\*Integration Branch:\*\* `integration/final-system`



