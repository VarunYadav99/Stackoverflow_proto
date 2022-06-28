const { kafkaBroker, clientId } = require("./kafka")
const { findMongoID, findMongoUser } = require("../repositories/users.repository")
const { PostsModelSequelize } = require('../models');
const MongoUser = require("../models/users.mongo.model");
const { BADGES } = require("../constants");

const producer = kafkaBroker.producer()
const topic = "answer"

const keys = {
	create: "create",
	vote: "vote"
}

function parsePost(answer) {
	return {
		postId: answer.post_id,
		userId: answer.user_id,
	}
}


async function produce(answer, key) {
	await producer.connect()
	const res = await producer.send({
		topic: topic,
		messages: [{
			key: key,
			value: JSON.stringify(parsePost(answer))
		}]
	})
    console.info(res)
}

const answerPost = async (answer) => {
    produce(answer, keys.create)
}

const consumer = kafkaBroker.consumer({
	groupId: topic
})

const main = async () => {
	await producer.connect()
	await consumer.connect()
	await consumer.subscribe({
	  topic: topic,
	//   fromBeginning: true
	})
	console.log("Answer producer-consumer connected")
	await consumer.run({
	  eachMessage: async ({ topic, partition, message }) => {
		const answer = JSON.parse(message.value.toString())
		switch(message.key.toString()){
			case keys.create:
                var mongoId = await findMongoID(answer.userId)
				if(mongoId == null) {
					console.log(`Answer Consumer: Could not find Mongo user of id=${post.postUserId}`)
					return
				}
                const tag = "helpfulness"
				var query = {}
				query[`badges.${tag}.count`] = 1
				MongoUser.findByIdAndUpdate(mongoId, {$inc: query}, {new: true}, (error, user) => {
					if(error || user == null) {
						console.log(`Answer Consumer: couldn't update answers count for mongoId=${mongoId}`)
					}
					const setBadge = {}
					const currentTag = user.badges.get(tag)
					const currentBadge = currentTag.badgeType
					const count = user.badges.get(tag).count
					if(count == 1 || (count <= 2 && currentBadge != BADGES.BRONZE)) {
						setBadge[`badges.${tag}.badgeType`] = BADGES.BRONZE
					} else if(2 < count && count < 5 && currentBadge != BADGES.SILVER) {
						setBadge[`badges.${tag}.badgeType`] = BADGES.SILVER
					} else if(count >= 5 && currentBadge != BADGES.GOLD) {
						setBadge[`badges.${tag}.badgeType`] = BADGES.GOLD
					}
					if(Object.keys(setBadge).length > 0) {
						MongoUser.findByIdAndUpdate(mongoId, {$set: setBadge}, {upsert: true, new: true}, (error, user) => {
							if(error != null) {
								console.log(`Answer Consumer: couldn't update ${tag} badgeType for mongoId=${mongoId}, badges=${setBadge}`)
							}
						})
					}
				})
				break
			case keys.vote:
				// TODO: Add Critic/Sportsmanship(upvote/downvote) for answer
				break
		}
	  }
	})
  }
  
  main().catch(async error => {
	console.error(error)
	try {
	  await consumer.disconnect()
	} catch (e) {
	  console.error('Failed to gracefully disconnect answer consumer', e)
	}
	process.exit(1)
  })

module.exports = { answerPost }