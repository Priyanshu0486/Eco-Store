-----

# EcoStore: The Future of Sustainable Shopping ♻️

EcoStore is an innovative e-commerce platform designed to make sustainable shopping the new standard. It leverages a smart recommendation engine to guide users toward eco-friendly products, seamlessly blending a convenient shopping experience with mindful consumption.

### The Problem

In today's fast-paced world, consumers often face a difficult choice between convenience and sustainability. While many want to make environmentally responsible purchases, it can be time-consuming and difficult to research products, verify their eco-credentials, and find alternatives that fit their needs. This "convenience gap" often leads well-intentioned shoppers to fall back on less sustainable habits.

### Our Solution

EcoStore bridges this gap by creating an intelligent and intuitive online marketplace. Our platform not only offers a curated selection of sustainable goods but actively assists users in making better choices.

The core of our platform is a **hybrid recommendation system** that learns from your behavior and product data to suggest the best eco-friendly alternatives for you. To further encourage this positive change, we've introduced the **EcoCoins Reward System**. Users earn EcoCoins for making sustainable choices, such as purchasing a highly-rated green product or opting for low-impact packaging. These coins can be redeemed for discounts, creating a rewarding cycle of conscious consumption.

### Key Features

  * **Smart Recommendation Engine:** Combines Content-Based and Collaborative Filtering to provide personalized, eco-friendly product suggestions.
  * **EcoCoins Reward System:** Earn points for making sustainable choices and redeem them for discounts on future purchases.
  * **Detailed Product Information:** Clear and transparent details on the sustainability and ethical sourcing of every item.
  * **Waste Reduction Options:** Features like minimal-waste packaging and group buying to reduce the overall environmental footprint.
  * **Seamless User Experience:** A clean, modern interface for easy account management, browsing, ordering, and secure payments.

### Tech Stack

This project is built with a modern and robust technology stack to deliver a seamless and intelligent user experience.

  * **Frontend:** `React.js, Material UI`
  * **Backend:** `Spring Boot, Flask`
  * **Database:** `MySQL`
  * **Cloud:** `AWS`
  * **Machine Learning:** `Python, Scikit-learn, Pandas, NumPy`

## Demo Credentials

For testing purposes, you can use the following accounts:

### Regular User Account
- Sign up through the application or for demo use the credentials below:
- Email: `user@ecostore.com`
- Password: `user@123`

### Admin Account
- Email: `admin@ecostore.com`
- Password: `[contact for password]` or `[set during setup]`

## 📸 Application Showcase

Here's a sneak peek into the EcoStore application, from the user-facing storefront to the powerful admin panel.

---

### 🏠 Home Page
*The main landing page that welcomes users, featuring a clean design, featured products, and easy navigation to the main store.*

<img width="1920" height="1020" alt="Screenshot 2025-09-20 185214" src="https://github.com/user-attachments/assets/313f3ff1-0ddc-430b-885b-de544a4e66e8" />

---

### 🛍️ Shopping Page
*The central product catalog where users can browse, search, and filter through all available eco-friendly products. Each product card provides key information at a glance.*

<img width="1920" height="1020" alt="Screenshot 2025-09-20 185401" src="https://github.com/user-attachments/assets/ebc8e939-68f9-4f3f-91c0-5a32d2275131" />


---

### 📦 Product Detail Page
*A detailed view of a single product, showcasing multiple images, a full description, and user ratings.*

<img width="1920" height="1020" alt="Screenshot 2025-09-20 185635" src="https://github.com/user-attachments/assets/077ed47b-423d-4c81-96c4-e347ade82126" />


---

### 🧠 Intelligent Recommendation Engine
*Powered by a Python microservice, our recommendation engine suggests similar products to users in real-time. This feature helps with product discovery and enhances the user's shopping experience.*

<img width="1920" height="1020" alt="Screenshot 2025-09-20 185527" src="https://github.com/user-attachments/assets/7665816f-c03a-4451-8b0d-a92cf3d867dc" />


---

### 💰 EcoCoins Wallet & Balance
*The user's personal wallet where they can view their EcoCoin balance, see their transaction history, and redeem their coins for discounts on future purchases.*

<img width="1920" height="1020" alt="Screenshot 2025-09-20 185422" src="https://github.com/user-attachments/assets/21fadaf1-0346-4aa7-820e-226eb54c0f90" />


---

### 🔒 Admin Dashboard
*The powerful admin-only dashboard that provides a complete overview of the store's performance. Admins can view key statistics like total sales, new users, and recent orders.*

<img width="1920" height="1020" alt="Screenshot 2025-09-20 185707" src="https://github.com/user-attachments/assets/e6dad665-2ab1-43cb-9d65-56d99d4ab1af" />


---

### 📈 Admin Order Management
*A dedicated panel for admins to view, manage, and update the status of all orders in the system, ensuring a smooth fulfillment process.*

<img width="1920" height="1020" alt="Screenshot 2025-09-20 185730" src="https://github.com/user-attachments/assets/7ddce818-3ebc-43ad-a627-2d6521431ae9" />


## 🚀 Getting Started

To get a local copy up and running, follow these simple steps. This project requires three separate services to be running simultaneously: the backend, the frontend, and the recommendation API.

### Prerequisites

Make sure you have the following installed on your system:
*   **Java JDK** (v21 or higher)
*   **Maven** (for Java dependency management)
*   **Node.js** (v16 or higher)
*   **Python** (v3.8 or higher)
*   A **MySQL** database instance running locally.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/Priyanshu0486/Eco-Store.git](https://github.com/Priyanshu0486/Eco-Store.git)
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd Eco-Store
    ```

3.  **Set up the Backend (Java):**
    *   Open the `Backend/` directory in your favorite Java IDE (like IntelliJ IDEA or VS Code with Java extensions).
    *   Your IDE should automatically detect the [pom.xml](cci:7://file:///d:/ecostore%20project/Eco-Store/Backend/pom.xml:0:0-0:0) file and install all required Maven dependencies.
    *   In your local MySQL instance, create a database named `Ecostore`.
    *   Verify the database credentials in [src/main/resources/application.properties](cci:7://file:///d:/ecostore%20project/Eco-Store/Backend/src/main/resources/application.properties:0:0-0:0) match your local setup.

4.  **Set up the Frontend (React):**
    *   Navigate to the frontend directory and install dependencies:
      ```sh
      cd frontend
      npm install
      ```

5.  **Set up the Recommendation API (Python):**
    *   Navigate to the recommendation API directory and install dependencies:
      ```sh
      cd ../recommendation_api
      pip install -r requirements.txt
      ```

### Running the Application

You need to start all three services in separate terminal windows.

1.  **Start the Backend Server:**
    *   In your Java IDE, find the main application class (`BackendApplication.java`) and run it.
    *   *Alternatively, from the `Backend/` directory, you can run:*
      ```sh
      ./mvnw spring-boot:run
      ```
    *   The backend will start on `http://localhost:8080`.

2.  **Start the Recommendation API:**
    *   From the `recommendation_api/` directory, run:
      ```sh
      python app.py
      ```
    *   The recommendation service will start on `http://localhost:5000`.

3.  **Start the Frontend Development Server:**
    *   From the `frontend/` directory, run:
      ```sh
      npm run dev
      ```
    *   This will open the application in your browser.

Once all services are running, you can access the application at **`http://localhost:5173`** (or the port specified in your terminal).
    ```sh
    npm start
    ```
3.  Open your browser and navigate to `http://localhost:3000`.

-----
