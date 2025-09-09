# LeetCode Activity Tracker Bot 🤖

A Telegram bot that helps groups stay consistent with daily LeetCode practice.  
The bot tracks registered users’ activity and checks whether they solved at least one problem yesterday.  

## 🔗 Live Demo
- 🤖 [Use the bot on Telegram](https://t.me/LeetcodeUzbot)  
- 👥 [Join the challenge group (Uzbek)](https://t.me/leetcodeUzChallenge)  

---

## ✨ Features
- 📌 **Group support** – works in multiple Telegram groups independently.  
- 📝 **Daily check** – verifies if each registered user solved at least one problem yesterday.  
- 📊 **Summary report** – sends a message listing all problems solved by members yesterday.  
- 🚨 **Reminder** – mentions users who didn’t solve any problems yesterday.  
- 🔒 **Opt-in tracking** – users must `/join` to be included in the challenge and `/leave` to stop tracking.  

---

## 🚀 How It Works
1. Add the bot to your group.  
2. Each user registers their LeetCode username using: `/register` 
3. Users who want to participate in daily challenges use: `/join`
  - To stop being tracked, simply use: `/leave`
4. Every day, the bot sends **two messages** to the group:
  - **Report Message** – shows all problems solved yesterday by each participating user.  
  - **Reminder Message** – mentions users who didn’t solve at least one problem yesterday.  
  
