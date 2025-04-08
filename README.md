# 📧 Email Marketing Flowchart Builder

A visual flowchart builder for designing and scheduling email marketing sequences. Built using the **MERN Stack**, **React Flow** for the visual editor, **Agenda** for task scheduling, and **Nodemailer** for sending emails.

---

## ✨ Features

- **Drag & Drop Flowchart UI** using React Flow
- Add nodes for:
  - `Lead Source`: Starting point with recipient email
  - `Cold Email`: Define subject and body of the email
  - `Wait`: Specify delay (in hours) between emails
- Save and load custom email flows
- Automatically schedule and send emails based on flow logic
- Emails are sent using Agenda and Nodemailer
- Backend jobs queue for delayed sending

---

## 📦 Tech Stack

- **Frontend:** React, React Flow, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB, Agenda, Nodemailer
- **Database:** MongoDB (for persisting scheduled jobs)

---

## 🚀 How It Works

1. User creates a flow with "Lead Source", "Cold Email", and optional "Wait" nodes.
2. Clicking "Start Flow" sends the structure to the backend.
3. The backend calculates delays and schedules emails using Agenda.
4. Emails are sent to the recipient as per the defined flow.

---

## 🛠️ Local Setup

### Prerequisites

- Node.js & npm
- MongoDB running locally or via cloud (e.g. MongoDB Atlas)
