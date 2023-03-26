# @arnavk-09/discord-backups
`@arnavk-09/discord-backups` is an easy-to-use npm package for creating and loading backups of Discord servers. The package is built on top of the popular discord.js library and provides a streamlined interface for creating and restoring backups.
> Custom version of @Androz2091/discord-backup

## 📩 Installation
You can install `@arnavk-09/discord-backups` using npm:
```bash
npm install @arnavk-09/discord-backups 
```

## ✍️ Usage
To use this package first you have to import it
```js
const { createBackup, loadBackup, bkupUtils } = require("@arnavk-09/discord-backups");
```

#### createBackup(guild, options)
The createBackup function creates a backup of the specified Discord guild. It returns a promise that resolves with the backup data. You can then save this data to a file or database for later use.
```js
const backup = await createBackup(guild);
```

#### loadBackup(guild, backupData, options)
The loadBackup function restores a guild from a backup. It takes the guild object and backup data as parameters and returns a promise that resolves when the guild has been fully restored.
```js
await loadBackup(guild, backupData);
```

## 🧪 Example
Here's an example of how to use discord-backups to create and load backups
```js
const { Client, IntentsBitField } = require("discord.js");
const { createBackup, loadBackup, bkupUtils } = require("discord-backups");

const TOKEN = "your-discord-bot-token-here";

const client = new Client({
  intents: [
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.Guilds,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.content === "!backup") {
    const backup = await createBackup(message.guild);
    console.log("backup data", backup);
  }

  if (message.content === "!load") {
    const backupData = /* load backup data from file or database */;
    await loadBackup(message.guild, backupData);
  }
});

client.login(TOKEN);
```

## 👏 Contributing

Contributions are welcome! Here are the steps to contribute:

1. Fork the repository
2. Clone your forked repository to your local machine or use github codespace 
3. Create a new branch for your changes: `git checkout -b my-new-feature`
4. Make your changes & Format It `npx prettier -w src`
5. And commit them: `git commit -m 'Add some feature'`
6. Push your changes to your forked repository: `git push origin my-new-feature`
7. Submit a pull request from your forked repository to the main repository
8. Wait for feedback and approval 

Please make sure your code follows the project's code style.

## ⭐ Star
If you find this package useful, please consider giving it a star on [GitHub](https://github.com/ArnavK-09/discord-backups). It helps to boost our motivation and spread the word about this project. Thank you! 
