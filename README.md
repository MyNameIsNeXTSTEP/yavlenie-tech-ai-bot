# Yavlenie-tech-ai-bot

The project is an AI powered telegram chat for making engineers or (gas, water, etc.) meters owners be able to manage their data remotely.

## How to prepare

1. Clone this repo
_you'll need `nodejs` and `npm` installed, latest version are preffered_
2. Run `npm install`
3. Copy the `.env.example` file content to a new file named `.env`:
```Bash
cp .env.example .env
```
4. Open Telegram BotFather and create a bot, copy it's token and place it right after the `TELEGRAM_TOKEN` variable in `.env` file
5. Also, since the chat is powered with OpenAI, you'll need an OpenAI ChatGPT api-key. Copy it and plave after the `OPENAI_API_KEY` variable in `.env` file
6. Paste the `RECOGNITION_API_KEY` in the `.env` file for the Yavlenie-tech recognition API, i.e. https://...yavlenie.pro/v1/recognize

## How to start

- Open telegram new chat bot you've just created for this project
- Run the process in the terminal: `npm run dev`

You should see no errors in **master** branch and the telegram chat-bot must be started, enjoy it!