import dotenv from "dotenv";
dotenv.config();
import { REST, Routes } from "discord.js";
const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
  {
    name: "random-product",
    description: "Replies with a random product of cart-O !",
  },
  {
    name: "user",
    description: "Replies with user info!",
  },
  {
    name: "avatar",
    description: "Replies with user avatar!",
  },
  {
    name: "tellmeajoke",
    description: "Replies with a joke!",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
async function refreshCommands() {
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}

try {
  refreshCommands();
} catch (error) {
  console.error(error);
}
