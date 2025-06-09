# Uses MarkdownV2 — escape special characters.

## /start command
start = Добро пожаловать в бота\!

## /language command
lang_prompt = Выберите язык\.
lang_uz = 🇺🇿 Узбекский
lang_en = 🇺🇸 Английский
lang_ru = 🇷🇺 Русский
lang_changed = Язык был изменён на { $lang }\.

## /register command
reg_already = Вы уже зарегистрированы\.
reg_ongoing = Регистрация уже выполняется\.
reg_enter = Пожалуйста, введите ваше имя пользователя LeetCode\.
reg_challenge = Решите задачу { $challengeLink } за { $requiredMinutes } минут\.
reg_not_found = Пользователь `{ $username }` не найден\.
reg_exists = Пользователь `{ $username }` уже существует\.
reg_success = Вы успешно зарегистрированы\.
reg_fail = Вы не решили задачу за { $requiredMinutes } минут\.

## /unregister command
unreg_not_found = Вы не зарегистрированы\.
unreg_success = `{ $username }` был удалён из базы данных\.

## /join command
join_not_register = Сначала зарегистрируйтесь через бота\.
join_success = Вы присоединились к заданию\.
join_already = Вы уже участвуете в задании\.
join_not_found = Вы не присоединились к заданию\.

## /leave command
leave_not_found = Вы не участвуете в задании\.
leave_success = Вы покинули задание\.

## daily messages
tag_inactive_users = { $users } \- Старайтесь решать хотя бы одну задачу каждый день\!
tag_active_users = Активные пользователи вчера:  

{ $usersWithSubs }
