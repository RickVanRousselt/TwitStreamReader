
var azure = require('azure-storage');
var Twitter = require('node-tweet-stream')

var queueSvc = azure.createQueueService('twitstream', '525tGSMvxz9I4mir3ucxqmdaUJTEjNLVNC9UIyVWYudHrU3jU2Pi7YCYLOVcoWj6YyI08DW8SGp8CrVpIrF2iQ==');

var tableSvc = azure.createTableService('twitstream', '525tGSMvxz9I4mir3ucxqmdaUJTEjNLVNC9UIyVWYudHrU3jU2Pi7YCYLOVcoWj6YyI08DW8SGp8CrVpIrF2iQ==');

var t = new Twitter({
    consumer_key: 'e7uYUZqywGZBMyH2BIySt9RZe',
    consumer_secret: 'DwqgPkj7a84jlPNd8F6Txdeb7eghRFoRWgkPzTdXMHyg9rBqNC',
    token: '348352862-wh76w5xkwUxBj0jLmwN6VwwGYIYOTtJDQBGUjpxv',
    token_secret: 'L1XZOqqzFktuumgK0OnSFCbC1cbq2njlBzfDSYfL2ELpy'
})


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
                
                
                
                t.track('SPSSTHLM')

            }
        });
    }
});







