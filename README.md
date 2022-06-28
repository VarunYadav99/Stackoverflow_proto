# stack-overflow

## Kafka Create topic
```
docker exec 87aa91462f56 kafka-topics.sh --create --bootstrap-server localhost:9092 --topic tag
docker exec 87aa91462f56 kafka-topics.sh --create --bootstrap-server localhost:9092 --topic question
docker exec 87aa91462f56 kafka-topics.sh --create --bootstrap-server localhost:9092 --topic profile
```