
var azure = require('azure-storage');
var Twitter = require('node-tweet-stream');

var QueueSvc = azure.createQueueService(process.env.table_name, process.env.azure_key);

var TableSvc = azure.createTableService(process.env.table_name, process.env.azure_key);

var T = new Twitter({
	consumer_key: process.env.consumer_key,
	consumer_secret: process.env.consumer_secret, 
	token: process.env.token,
	token_secret: process.env.token_secret
});


QueueSvc.createQueueIfNotExists("incomingstreamids", function (error, result, response) {
    if (!error) {
        // Queue created or exists
        
        TableSvc.createTableIfNotExists('incomingstreamcontents', function (error, result, response) {
            if (!error) {
                // Table exists or created
                T.on('tweet', function (tweet) {
                    var entGen = azure.TableUtilities.entityGenerator;
                    var task = {
                        PartitionKey: entGen.String(tweet.user.id_str),
                        RowKey: entGen.String(tweet.id_str),
                        description: entGen.String(JSON.stringify(tweet))
                    };
                    
                    TableSvc.insertEntity('incomingstreamcontents', task, function (error, result, response) {
                        if (!error) {
    
                        }
                    });
                    var queMessage = tweet.user.id_str + ';' + tweet.id_str;
                    QueueSvc.createMessage('incomingstreamids', queMessage , function (error, result, response) {
                        if (!error) {
            
                        }
                    });
                    console.log(tweet);
                });
                
                T.on('error', function (err) {
   
                });


                T.track(process.env.subject);

            }
        });
    }
});







