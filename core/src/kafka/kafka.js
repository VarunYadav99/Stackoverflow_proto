const { Kafka } = require('kafkajs')
// the client ID lets kafka know who's producing the messages
const clientId = "my-app"
// we can define the list of brokers in the cluster
const brokers = ["localhost:9092"]

const kafkaBroker = new Kafka({ clientId, brokers })

module.exports = {
	kafkaBroker,
	clientId
}

// TODO: Add Popular badge - User Reputation (10, 15)