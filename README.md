# 💰Ganji: M-Pesa Expense Analytics & Tracker

<strong>Ganji</strong> is an Android-based mobile application built with React Native and Expo, designed to give users deep insights into their M-Pesa financial habits. By parsing SMS notifications, Ganji transforms raw text messages into actionable financial data—tracking where your money goes, how much you spend on transaction fees, and the true cost of credit (_Fuliza_).

## 🚀 Key Features

- <strong>SMS Parsing Engine</strong>: Automatically reads and categorizes M-Pesa transaction messages.

- <strong>Expense Analytics</strong>: Identify your most frequent recipients and largest spending categories.

- <strong>Fee Tracking</strong>: Real-time calculation of transaction costs to see exactly how much you pay to move money.

- <strong>Fuliza Debt Monitor</strong>: Specialized tracking for Fuliza overdraft costs and interest rates.

- <strong>Privacy First</strong>: Uses Expo SQLite for local data storage. Your financial data stays on your device—not on a server.

- <strong>Modern UI</strong>: A sleek, performant interface built with NativeWind (Tailwind CSS for React Native) and Figma-inspired design.

## 🛠 Tech Stack

- <strong>Framework</strong>: Expo (SDK 54) / React Native

- <strong>Navigation</strong>: Expo Router (File-based routing)

- <strong>Database</strong>: Expo SQLite for offline persistence.

- <strong>Styling</strong>: NativeWind (Tailwind CSS) & Expo Linear Gradient.

- <strong>SMS Integration</strong>: react-native-get-sms-android

- <strong>Animations</strong>: React Native Reanimated.

## 📦 Installation & Setup

To run this project locally, you must have the Expo CLI installed and an Android Emulator or physical device (as SMS features are Android-specific).

1. <strong>Clone the repository</strong>:

   ```bash
   git clone https://github.com/Yusha254/Ganji.git
   cd Ganji
   ```

2. <strong>Install dependencies</strong>:

   ```bash
   npm i
   ```

3. <strong>Run the application</strong>:
   ```bash
   npx expo start
   ```

<strong>Note</strong>: Because this app requires <strong>READ*SMS</strong> permissions, it utilizes \_expo-dev-client*. You will need to build the development artifact to test SMS functionality.

## 📐 Architecture

The app follows a modern React Native architecture:

- <strong>Service Layer</strong>: Handles SMS fetching and Regex-based parsing of M-Pesa strings.

- <strong>Data Layer</strong>: Managed by SQLite to ensure data is available offline and persists between sessions.

- <strong>UI Layer</strong>: Component-driven design using Tailwind classes for rapid, responsive styling.

## 🤝 Contributing

Contributions are welcome! If you have ideas for better Regex patterns for M-Pesa messages or new visualization features:

1. Fork the Project.

2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).

3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).

4. Push to the Branch (`git push origin feature/AmazingFeature`).

5. Open a Pull Request.
