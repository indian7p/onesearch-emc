export default async function getDiscordUsernameDiscriminator(client, id) {
  const user = await client.users.fetch(id).catch(err => console.log(err));
  const discord = `\`\@${user.username}#${user.discriminator}\``;
  return discord;
}