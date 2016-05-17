
var azure = require('azure-storage');
var Twitter = require('node-tweet-stream')

//ADD CONNECTIONS


queueSvc.createQueueIfNotExists("incomingstreamids", function (error, result, response) {
    if (!error) {
    // Queue created or exists
    }
});

tableSvc.createTableIfNotExists('incomingstreamcontents', function (error, result, response) {
    if (!error) {
    // Table exists or created
    }
});





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

    queueSvc.createMessage('incomingstreamids', tweet, function (error, result, response) {
        if (!error) {
            
        }
    });
    console.log(tweet);
});

t.on('error', function (err){
   
});



t.track('banana')
