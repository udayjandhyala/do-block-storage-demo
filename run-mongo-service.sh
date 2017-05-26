docker service create --name mongo --network demo-app-net \
--mount type=bind,source=/mnt/mongo-vol,destination=/data/db \
--constraint 'node.hostname == swarm-node-db' \
mongo:3.3
