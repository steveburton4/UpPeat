
if [ "$TRAVIS_BRANCH" == "master" ]; then
    export PATH=$PATH:$HOME/.local/bin;
    eval $(aws ecr get-login --no-include-email --region eu-west-2);
    docker tag uppeat:latest 236542331794.dkr.ecr.eu-west-2.amazonaws.com/uppeat:latest;
    docker push 236542331794.dkr.ecr.eu-west-2.amazonaws.com/uppeat:latest;
fi