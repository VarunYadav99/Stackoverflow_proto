const API_BASE_URL = 'https://api.stackexchange.com/2.3';

const GRAVATAR_URL = (index) => `https://secure.gravatar.com/avatar/${index}?s=164&d=identicon`;
const BADGES = {
  BRONZE: "BRONZE",
  SILVER: "SILVER",
  GOLD: "GOLD"
}
module.exports = constantsHolder = {
  API_BASE_URL,
  GRAVATAR_URL,
  BADGES
};
