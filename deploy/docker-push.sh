
if [ "$TRAVIS_BRANCH" == "master" ]; then
    export PATH=$PATH:$HOME/.local/bin;
    eval $(aws ecr get-login --no-include-email --region $AWS_DEFAULT_REGION);
    docker tag uppeat:latest $REMOTE_IMAGE_URL:latest;
    docker push $REMOTE_IMAGE_URL:latest;
fi