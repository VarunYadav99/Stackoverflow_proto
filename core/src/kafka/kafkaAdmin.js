const { kafkaBroker } = require("./kafka");

const admin = kafkaBroker.admin()
const topics = ["profile", "tag", "post", "answer"]


async function kafkaAdminConnect() {
    await admin.connect()
    console.log("Connected to kafka admin")
    const created = await admin.createTopics({topics: topics.map((t) => {
        return {
            topic: t,
        }
    })})
    if(created) {
        console.log("Following topics were created: " + topics)
    }

}

module.exports = kafkaAdminConnect