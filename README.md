# DigitalOcean Block Storage Demo
Sample code to demonstrate the usage of DigitalOcean block storage for MongoDB Docker container

# Import remote DigitalOcean Droplets into local machine with docker-machine
docker-machine create --driver generic --generic-ip-address=\<IP-Address\> --generic-ssh-key ~/.ssh/id_rsa --generic-ssh-user core swarm-mgr

docker-machine create --driver generic --generic-ip-address=\<IP-Address\> --generic-ssh-key ~/.ssh/id_rsa --generic-ssh-user core swarm-node-db

# Initialise a Docker Swarm Cluster
eval $(docker-machine env swarm-mgr)

docker swarm init --advertise-addr \<IP-Address\>

docker network create -d overlay demo-app-net

eval $(docker-machine env swarm-node-db)

docker swarm join \<copy paste the worker token here\>

# Start Docker Services
docker service create --name demo-app --network demo-app-net --publish 80:80 --constraint 'node.hostname == swarm-mgr' demo-app-img

docker service create --name mongo --network demo-app-net --mount type=bind,source=/mnt/mongo-vol,destination=/data/db --constraint 'node.hostname == swarm-node-db' mongo:3.3
