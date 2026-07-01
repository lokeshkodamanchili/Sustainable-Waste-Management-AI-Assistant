# Sustainable Waste Management Assistant Using Generative AI

An AI-powered civic platform designed to help citizens identify household waste items, discover step-by-step sorting instructions, locate nearby dropoff facilities via maps, and monitor recycling progress. 

This repository is structured according to the **AI Specialist Track Project Template** standards, organized into 8 distinct engineering lifecycle stages.

---

## 📂 Repository Structure

* **[1. Brainstorming & Ideation](file:///C:/Users/sande/.gemini/antigravity/scratch/Sustainable-Waste-Management-AI-Assistant/1.%20Brainstorming%20&%20Ideation/)**: Empathy maps, prioritization, and problem statements.
* **[2. Requirement Analysis](file:///C:/Users/sande/.gemini/antigravity/scratch/Sustainable-Waste-Management-AI-Assistant/2.%20Requirement%20Analysis/)**: Functional/non-functional requirements, data flow diagram (DFD), customer journey map, and tech stack sheets.
* **[3. Project Design Phase](file:///C:/Users/sande/.gemini/antigravity/scratch/Sustainable-Waste-Management-AI-Assistant/3.%20Project%20Design%20Phase/)**: Problem-solution fit matrices.
* **[4. Project Planning Phase](file:///C:/Users/sande/.gemini/antigravity/scratch/Sustainable-Waste-Management-AI-Assistant/4.%20Project%20Planning%20Phase/)**: Sprint planning, timeline Gantt layout.
* **[5. Project Development Phase](file:///C:/Users/sande/.gemini/antigravity/scratch/Sustainable-Waste-Management-AI-Assistant/5.%20Project%20Development%20Phase/)**: Staging directory containing full production code for the Flask backend and React client.
* **[6. Performance Testing](file:///C:/Users/sande/.gemini/antigravity/scratch/Sustainable-Waste-Management-AI-Assistant/6.%20Performance%20Testing/)**: Automated backend unit test results and latency tables.
* **[7. Documentation & Demo](file:///C:/Users/sande/.gemini/antigravity/scratch/Sustainable-Waste-Management-AI-Assistant/7.%20Documentation%20&%20Demo/)**: Deploy specifications, installation manuals, and live server endpoints.
* **[8. Project Demonstration](file:///C:/Users/sande/.gemini/antigravity/scratch/Sustainable-Waste-Management-AI-Assistant/8.%20Project%20Demonstration/)**: Future scalability plans (Edge CV, PWAs) and community environmental impact.

---

## 🌐 Live Application Links

* **Live Unified Web Application (Render)**: 
  👉 **[https://sustainable-waste-management-amrn.onrender.com/](https://sustainable-waste-management-amrn.onrender.com/)**
* **Live Static Frontend Client (GitHub Pages mirror)**: 
  👉 **[https://lokeshkodamanchili.github.io/Sustainable-Waste-Management/](https://lokeshkodamanchili.github.io/Sustainable-Waste-Management/)**
* **Flask API Health Check**: 
  👉 **[https://sustainable-waste-management-amrn.onrender.com/api/health](https://sustainable-waste-management-amrn.onrender.com/api/health)**

---

## 🚀 Quick Local Setup Guide

1. **Backend Server Setup**:
   ```bash
   cd "5. Project Development Phase/backend"
   python -m venv venv
   # On Windows:
   .\venv\Scripts\Activate.ps1
   # On macOS/Linux:
   source venv/bin/activate
   pip install -r requirements.txt
   python app.py
   ```
2. **Frontend client**:
   ```bash
   cd "5. Project Development Phase/frontend"
   npm install
   npm run dev
   ```
3. Open your browser to `http://localhost:5173`. Select **System Settings** and click **Seed Sample Dataset** to populate the charts and maps!
