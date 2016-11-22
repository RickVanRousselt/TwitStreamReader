# TwitStreamReader

This is part of a bigger application. Check out [DataExtracter](../../../../DataExtracter) and [PictureTranslater](../../../../PictureTranslater)


This node JS code in a docker container will scrape twitter with a certain hashtag. The values retrieved from twitter will then be
stored in an Azure Table Storage. 

To make sure the next link in this chain knows which items to process it will also create an entry into an Azure Queue.

You will need valid Twitter developer credentials in the form of a set of consumer and access tokens/keys. You can get these at [here](https://apps.twitter.com/) and an [Azure Storage Account](https://docs.microsoft.com/en-us/azure/storage/storage-create-storage-account#create-a-storage-account)

The following environment variables are required to have this run correctly.

    "consumer_key": <Twitter consumer key>,
    "consumer_secret": <Twitter consumer secret>,
    "token": <Twitter token>,
    "token_secret": <Twitter token secret>,
    "azure_key": <Azure key to the storage account>,
    "subject": <The hashtag to follow>,
    "table_name": <The name of the table in the Azure Storage account>

This repo is created to run inside a [docker container](https://hub.docker.com/r/rickvanrousselt/twitstreamreader/). This docker container can then be deployed to the [Azure Container Service](https://azure.microsoft.com/en-us/services/container-service/) to deploy the entire application.

To run this inside ACS the following JSON can be used inside Marathon to run the container.

```javascript
{
  "id": "twitstreamreader",
  "cmd": null,
  "cpus": 0.5,
  "mem": 128,
  "disk": 0,
  "instances": 1,
  "container": {
    "docker": {
      "image": "rickvanrousselt/twitstreamreader",
     "forcePullImage": false,
      "network": "HOST"
    },
    "type": "DOCKER"
  },
  "portDefinitions": [
    {
      "port": 0,
      "protocol": "tcp",
      "name": null,
      "labels": null
    }
  ],
  "env": {
    <Enter here the environment variables described above>
  }
}
```

