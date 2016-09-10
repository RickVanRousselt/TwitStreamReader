
var azure = require('azure-storage');
var Twitter = require('node-tweet-stream')

var queueSvc = azure.createQueueService('twitstream', process.env.azure_key);

var tableSvc = azure.createTableService('twitstream', process.env.azure_key);

var t = new Twitter({
	consumer_key: process.env.consumer_key,
	consumer_secret: process.env.consumer_secret, 
	token: process.env.token,
	token_secret: process.env.token_secret
});


queueSvc.createQueueIfNotExists("incomingstreamids", function (error, result, response) {
    if (!error) {
        // Queue created or exists
        
        tableSvc.createTableIfNotExists('incomingstreamcontents', function (error, result, response) {
            if (!error) {
                // Table exists or created
                t.on('tweet', function (tweet) {
                    var entGen = azure.TableUtilities.entityGenerator;
                    var task = {
                        PartitionKey: entGen.String(tweet.user.id_str),
                        RowKey: entGen.String(tweet.id_str),
                        description: entGen.String(JSON.stringify(tweet))
                    };
                    
                    tableSvc.insertEntity('incomingstreamcontents', task, function (error, result, response) {
                        if (!error) {
    
                        }
                    });
                    var queMessage = tweet.user.id_str + ';' + tweet.id_str
                    queueSvc.createMessage('incomingstreamids', queMessage , function (error, result, response) {
                        if (!error) {
            
                        }
                    });
                    console.log(tweet);
                });
                
                t.on('error', function (err) {
   
                });


                t.track(process.env.subject);

            }
        });
    }
});







