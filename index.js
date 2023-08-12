import dotenv from "dotenv";
dotenv.config();
import { EmbedBuilder } from "discord.js";
import { Client, GatewayIntentBits } from "discord.js";
import { randomJoke } from "./joke.js";
import { connectToCluster } from "./dbConnect.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// will refractor later
async function handleServerCommand(interaction) {
  const mongoClient = await connectToCluster(process.env.MONGODB_URL);
  const db = mongoClient.db("cart");
  const collection = db.collection("products");
  const products = await collection.find({}).toArray();
  const data = products[Math.floor(Math.random() * products.length)];

  let exampleEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(data.name)
    .setDescription(
      `Category: ${data.category}\n\nPrice: $${data.price}\n\nStock: ${data.stock}`
    )
    .setThumbnail(data.images[0])
    .addFields(
      { name: "Prodcut Details: ", value: data.spec },
      { name: "\u200B", value: "\u200B" }
    )
    .setImage(data.images[0])
    .setTimestamp();
  await interaction.reply({ embeds: [exampleEmbed] });
}

const getNewProduct = async (interaction) => {
  const mongoClient = await connectToCluster(process.env.MONGODB_URL);
  const db = mongoClient.db("cart");
  const collection = db.collection("products");
  const products = await collection.find({}).toArray();
  const data = products[products.length - 1];

  let exampleEmbed = new EmbedBuilder()
    .setColor(0x9900FF)
    .setTitle(data.name)
    .setDescription(
      `Category: ${data.category}\n\nPrice: $${data.price}\n\nStock: ${data.stock}`
    )
    .setThumbnail(data.images[0])
    .addFields(
      { name: "Prodcut Details: ", value: data.spec },
      { name: "\u200B", value: "\u200B" }
    )
    .setImage(data.images[0])
    .setTimestamp();
  await interaction.reply({ embeds: [exampleEmbed] });
};

client.on("interactionCreate", (interaction) => {
  if (!interaction.isCommand()) return;
  switch (interaction.commandName) {
    case "ping":
      interaction.reply("Pong!");
      break;
    case "random-product":
      handleServerCommand(interaction);
      break;
    case "user":
      interaction.reply(
        `Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`
      );
      break;
    case "avatar":
      interaction.reply(interaction.user.displayAvatarURL({ dynamic: true }));
      break;
    case "tellmeajoke":
      const joke = randomJoke();
      const message = new EmbedBuilder()
        .setTitle(joke.category)
        .setDescription(`${joke.body}`)
        .setColor("#0000FF");
      interaction.reply({ embeds: [message] });
      break;
    case "new":
      getNewProduct(interaction);
      break;

    default:
      interaction.reply("Unknown command");
      break;
  }
});

client.login(process.env.TOKEN);


