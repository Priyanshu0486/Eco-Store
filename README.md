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
  * **Machine Learning:** `Python, Scikit-learn, Pandas, NumPy`

### Folder Structure

Here is an overview of the project's directory structure to help you navigate the codebase.

`Eco-Store/
├── .gitattributes
├── Backend/
├── frontend/
└── recommendation_api/`

**Description of Directories**
  * Backend/: This folder likely contains all the server-side logic for your application, such as the API, database connections, and business logic.

  * frontend/: This folder probably holds all the client-side code, including the user interface components, styling, and logic that runs in the user's browser.

  * recommendation_api/: This directory most likely contains the specific Python scripts and machine learning models for your recommendation engine, which probably runs as a separate service.

  * .gitattributes: This is a configuration file used by Git to define attributes for specific file paths.

### Getting Started

To get a local copy up and running, follow these simple steps.

**Prerequisites**

  * `Node.js v14 or higher`
  * `Python 3.8 or higher`

**Installation**

1.  Clone the repository:
    ```sh
    git clone https://github.com/Priyanshu0486/Eco-Store.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd Eco-Store
    ```
3.  Install backend dependencies:
    ```sh
    cd src/backend
    pip install -r requirements.txt
    ```
4.  Install frontend dependencies:
    ```sh
    cd ../frontend
    npm install
    ```

**Running the Application**

1.  Start the backend server from the `src/backend` directory:
    ```sh
    python app.py
    ```
2.  Start the frontend development server from the `src/frontend` directory:
    ```sh
    npm start
    ```
3.  Open your browser and navigate to `http://localhost:3000`.

-----
