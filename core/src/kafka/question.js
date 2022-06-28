const { kafkaBroker, clientId } = require("./kafka")
const { findMongoID, findMongoUser } = require("../repositories/users.repository")
const { PostsModelSequelize } = require('../models');
const MongoUser = require("../models/users.mongo.model");
const { BADGES } = require("../constants");

const producer = kafkaBroker.producer()
const topic = "post"

const keys = {
	create: "create",
	view: "view",
	vote: "vote",
}

function parsePost(post) {
	return {
		postId: post.id,
		postUserId: post.user_id,
		tags: post.tags?.map((t) => (t.tagname)) ?? []
	}
}


async function produce(post, key) {
	await producer.connect()
	console.log("producing: "+key.toString())
	producer.send({
		topic: topic,
		messages: [{
			key: key,
			value: JSON.stringify(parsePost(post))
		}]
	})
}

const kafkaCreatePost = async (post) => {
	produce(post, keys.create)
}
const viewPost = async (post) => {
	produce(post, keys.view)	
}

/**
 * 
 * @param post 
 * @param vote - poddible values(1/-1) 
 */
const votePost = async (post, vote) => {
	if(vote != 1 || vote != -1) {
		console.error(`Question Producer: Received invalid vote value(${vote}). Only accepts 1/-1`)
		return
	}
	post.vote = vote
	produce(post, keys.vote)
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
	console.log("Question producer-consumer connected")
	await consumer.run({
	  eachMessage: async ({ topic, partition, message }) => {
		const post = JSON.parse(message.value.toString())
		var mongoId = await findMongoID(post.postUserId)
		if(mongoId == null) {
			console.log(`Question Consumer: Could not find Mongo user of id=${post.postUserId}`)
			return
		}
		switch(message.key.toString()){
			case keys.create:
				const tag = "curious"
				var query = {}
				query[`badges.${tag}.count`] = 1
				MongoUser.findByIdAndUpdate(mongoId, {$inc: query}, {new: true}, (error, user) => {
					if(error || user == null) {
						console.log(`Question Consumer: couldn't update tag view count for mongoId=${mongoId}`)
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
								console.log(`Question Consumer: couldn't update ${tag} badgeType for mongoId=${mongoId}, badges=${setBadge}`)
							}
						})
					}
				})
				break
			case keys.view:
					PostsModelSequelize.increment('views',{
						by: 1,
						where: { id: post.postId },
						returning: true
					}).then(async _ => {
						PostsModelSequelize.findOne({
							distinct: true,
							where: {
							  id: post.postId,
							},
							attributes: ['views'],
					}).then(post => {
						var query = {}
						if(post.views == 5) {
							query["badges.notable.badgeType"] = BADGES.GOLD
						} else if(post.views == 15) {
							query["badges.famous.badgeType"] = BADGES.GOLD
						}
						if(Object.keys(query).length > 0) {
							MongoUser.findByIdAndUpdate(mongoId, {$set: query}, {upsert: true, new: true}, (error, user) => {
								if(error != null) {
									console.log(`Question Consumer: couldn't update badgeType for mongoId=${mongoId}, badges=${setBadge}`)
								}
							})
						}
					}
					).catch(error => {
						console.log(`Error in getting post view count: ${error}`)
					})
				}).catch(error => {
					console.log(`Error in updating post view count: ${error}`)
				})
				break
			case keys.vote:
				var query = {};
				post.tags.forEach(tag => {
					query[`badges.${tag}.count`] = 1;
				});
				MongoUser.findByIdAndUpdate(mongoId, {$inc: query}, {upsert: true, new: true}, (error, user) => {
					if(error || user == null) {
						console.log(`Question Consumer: couldn't update tag vote count for mongoId=${mongoId}`)
					}
					const setBadge = {}
					post.tags.forEach(tag => {
						const currentTag = user.badges.get(tag)
						const currentBadge = currentTag.badgeType
						const count = user.badges.get(tag).count
						if(count == 1 || (count <= 10 && currentBadge != BADGES.BRONZE)) {
							setBadge[`badges.${tag}.badgeType`] = BADGES.BRONZE
						} else if(10 <= count && count <= 20 && currentBadge != BADGES.SILVER) {
							setBadge[`badges.${tag}.badgeType`] = BADGES.SILVER
						} else if(count > 20 && currentBadge != BADGES.GOLD) {
							setBadge[`badges.${tag}.badgeType`] = BADGES.GOLD
						}
					})
					if(Object.keys(setBadge).length > 0) {
						MongoUser.findByIdAndUpdate(mongoId, {$set: setBadge}, {upsert: true, new: true}, (error, user) => {
							if(error != null) {
								console.log(`Question Consumer: couldn't update tag badgeType for mongoId=${mongoId}, badges=${setBadge}`)
							}
						})
					}
				})
				// TODO: Add Critic/Sportsmanship(upvote/downvote) for post
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
	  console.error('Failed to gracefully disconnect question consumer', e)
	}
	process.exit(1)
  })

module.exports = { viewPost, votePost, kafkaCreatePost }