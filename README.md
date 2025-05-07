# 🎧 InTune - Interactive Online Radio Platform

## 👨‍💻 Team Members
- Uday (Team Leader)
- Abhishek
- Sourabh
- Yash

## 📄 Project Description
**InTune** is a real-time interactive radio platform that allows users to stream music by genre and chat live with others — all from a clean, browser-based interface. Unlike traditional radio, it fosters engagement and community by integrating a live chatbox alongside seamless music streaming, with no login required.

## 🎥 Video Explanation
[Watch the Video Presentation Here](https://drive.google.com/file/d/1ai5_zkU8It6ynA6ws2V6E3wAWoJodSUM/view?usp=drive_link)

## 🧰 Technologies Used
- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Python (Flask)
- **Real-Time Communication:** Socket.IO
- **Additional:** Bleach (for cleaning of comments)

## ▶️ How to Run the Project

1. **Clone the Repository**  
   Open terminal or command prompt and run:
   ```bash
   git clone https://github.com/Abhishek-inc/Abhishek_Thakur_DS_InTune.git
   cd InTune
   ```

2. **Set Up a Virtual Environment (Optional but Recommended)**
   ```bash
   python -m venv venv
   source venv/bin/activate   # For Linux/Mac
   venv\Scripts\activate      # For Windows
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask App**
   ```bash
   python app.py
   ```

5. **Open in Browser**
   Navigate to `http://localhost:5000` in your browser.

## 📁 Repository Structure
- `app.py`: Main Flask application file
- `templates/`: Contains HTML files
- `static/`: Includes CSS, JS, and image assets
- `static/js/radio.js`: Handles real-time chat and frontend socket events
- `static/images/`: Genre-related banner images

## ✅ Features
- Live radio streaming based on selected genre
- Real-time chat with connected users
- Set username without login (stored in localStorage)
- Responsive, clean UI
- Community-driven experience

## 🔗 GitHub Repository Link
[https://github.com/Abhishek-inc/Abhishek_Thakur_DS_InTune](https://github.com/Abhishek-inc/Abhishek_Thakur_DS_InTune)
