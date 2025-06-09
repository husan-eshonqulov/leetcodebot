# Uses MarkdownV2 — escape special characters.

## /start command
start = Welcome to the bot\!

## /language command
lang_prompt = Choose a language\.
lang_uz = 🇺🇿 Uzbek
lang_en = 🇺🇸 English
lang_ru = 🇷🇺 Russian
lang_changed = Language has been changed to { $lang }\.

## /register command
reg_already = You are already registered\.
reg_ongoing = Registration is already in process\.
reg_enter = Please enter your LeetCode username\.
reg_challenge = Solve the problem { $challengeLink } within { $requiredMinutes } minutes\.
reg_not_found = The username `{ $username }` doesn't exist\.
reg_exists = The username `{ $username }` already exists\.
reg_success = You have been registered successfully\.
reg_fail = You didn't solve the problem within { $requiredMinutes } minutes\.

## /unregister command
unreg_not_found = You are not registered\.
unreg_success = `{ $username }` has been unregistered\.

## /join command
join_not_register = You need to register through the bot first\.
join_success = You have joined the challenge\.
join_already = You have already joined the challenge\.
join_not_found = You have not joined the challenge\.

## /leave command
leave_not_found = You have not joined the challenge\.
leave_success = You have left the challenge\.

## daily messages
tag_inactive_users = { $users } \- Try to solve at least one problem every day\!
tag_active_users = Active users from yesterday:  

{ $usersWithSubs }
