# build and tag docker images
docker build -t aconlin/multi-client:latest -t aconlin/multi-client:$GIT_SHA -f client/Dockerfile client
docker build -t aconlin/multi-server:latest -t aconlin/multi-server:$GIT_SHA -f api-server/Dockerfile api-server
docker build -t aconlin/multi-worker:latest -t aconlin/multi-worker:$GIT_SHA -f worker/Dockerfile worker

# push images to docker hub
docker push aconlin/multi-client:latest
docker push aconlin/multi-client:$GIT_SHA
docker push aconlin/multi-server:latest
docker push aconlin/multi-server:$GIT_SHA
docker push aconlin/multi-worker:latest
docker push aconlin/multi-worker:$GIT_SHA

# apply kubernetes config
# kubectl apply -f k8s

# force the deployed containers to pick up the latest images
# kubectl set image deployments/client-deployment client=aconlin/multi-client:$GIT_SHA
# kubectl set image deployments/api-server-deployment api-server=aconlin/multi-server:$GIT_SHA
# kubectl set image deployments/worker-deployment worker=aconlin/multi-worker:$GIT_SHA
