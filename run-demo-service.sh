docker service create --name demo-app --network demo-app-net \
--publish 80:80 \
--constraint 'node.hostname == swarm-mgr' \
demo-app-img
