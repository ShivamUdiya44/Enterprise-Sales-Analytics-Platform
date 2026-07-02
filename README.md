# Enterprise Sales Analytics Platform

A full-stack Business Intelligence platform that transforms raw sales data into actionable insights through interactive dashboards, KPI monitoring, automated analytics, and scalable data ingestion.

Built with **React**, **FastAPI**, and **MongoDB**, the platform enables organizations to upload business datasets, visualize performance metrics, analyze trends, and support data-driven decision-making.

---

## Key Features

### Interactive Dashboard

* Real-time KPI monitoring
* Revenue, Orders, Units Sold & Average Order Value
* Product-wise performance analysis
* Regional sales analytics
* Category-wise business insights
* Revenue trend visualization
* Recent transactions overview

### Advanced Analytics

* Dynamic filtering by:

  * Date Range
  * Product
  * Category
  * Region
* Daily, Weekly and Monthly trend analysis
* Revenue growth calculation
* Order growth analysis

### Data Management

* CSV Upload Support
* Automated data validation
* MongoDB integration
* Dynamic schema handling
* Support for additional business attributes
* RESTful API architecture

### Business Intelligence

* Export analytics
* Modular analytics engine
* Scalable service architecture
* AI-ready backend for future insight generation

---

## Tech Stack

### Frontend

* React.js
* JavaScript
* Tailwind CSS
* Recharts
* SWR

### Backend

* FastAPI
* Python
* Pandas
* REST APIs

### Database

* MongoDB

---

## Project Architecture

```text
Enterprise Sales Analytics Platform

                React Frontend
                      │
                      ▼
                FastAPI Backend
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
 Analytics      Upload Service   REST APIs
        │             │
        └──────┬──────┘
               ▼
           MongoDB Database
               │
               ▼
      Business Intelligence Dashboard
```

---

## Project Structure

```text
backend/
│
├── Database/
│   └── mongo.py
│
├── routes/
│   ├── dashboard.py
│   └── upload.py
│
├── services/
│   └── dashboard_service.py
│
├── scripts/
│   └── seedSales.py
│
├── data/
│   └── sales.csv
│
└── server.py

frontend/
│
├── components/
├── pages/
├── services/
├── hooks/
└── App.jsx
```

---

## Workflow

```text
Company Dataset
        │
        ▼
 Upload CSV
        │
        ▼
 Data Validation
        │
        ▼
 MongoDB Storage
        │
        ▼
 Analytics Engine
        │
        ▼
 Interactive Dashboard
```

---

## REST API Endpoints

| Method | Endpoint                     | Description             |
| ------ | ---------------------------- | ----------------------- |
| GET    | /api/dashboard/kpis          | Dashboard KPIs          |
| GET    | /api/dashboard/filters       | Available Filters       |
| GET    | /api/dashboard/revenue-trend | Revenue Trend           |
| GET    | /api/dashboard/top-products  | Top Products            |
| GET    | /api/dashboard/categories    | Category Analytics      |
| GET    | /api/dashboard/regions       | Regional Analytics      |
| GET    | /api/dashboard/recent-orders | Recent Orders           |
| POST   | /api/upload/csv              | Upload Business Dataset |

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd Enterprise-Sales-Analytics-Platform
```

### Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn server:app --reload
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Future Enhancements

* Authentication & Authorization
* Multi-tenant Organization Support
* AI-powered Business Insights
* Natural Language Query Interface
* Forecasting & Predictive Analytics
* Automated PDF & Excel Report Generation
* Interactive Business Assistant
* Dynamic Column Mapping
* Excel (.xlsx) Support
* Scheduled Data Synchronization
* Role-Based Access Control
* Cloud Deployment

---

## Learning Outcomes

* Full-Stack Application Development
* REST API Design
* MongoDB Integration
* Business Intelligence Dashboard Development
* Data Analytics & Visualization
* Scalable Backend Architecture
* CSV Processing & Data Validation
* Modular Software Engineering

---

## License

This project is developed for educational and portfolio purposes.
