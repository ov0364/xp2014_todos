/*
	Require and initialise PhantomCSS module
	Paths are relative to CasperJs directory
*/
var phantomcss = require('./lib/phantomcss.js');
var fs = require('fs');

phantomcss.init(
    {
        addLabelToFailedImage: false,
        mismatchTolerance: 0.00,
        screenshotRoot: '../todo/screenshots',
        onComplete: function(allTests, noOfFails, noOfErrors){
            console.log(JSON.stringify(allTests));
            var report = {
                "title" : "todos",
                "story" : "As an user I want to manage my todo so I can achieve more in my life",
                "storyboards" : {
                    "title" : "it should add a todo",
                    "storyboard": [
                        {
                            "id": 0,
                            "title": "opening the app",
                            "screenshot": "01 - opening the app"
                        },
                        {
                            "id": 1,
                            "title": "adding 'Rule the web'",
                            "screenshot": "02 - adding rule the web"
                        }
                    ]
                }
            };
            
            var i, iSize;
            for (i = 0, iSize = allTests.length; i < iSize; i = i + 1){
                report.storyboards.storyboard[i].screenshot = allTests[i].filename.split('.png')[0];
                report.storyboards.storyboard[i].fail = allTests[i].fail;
                report.storyboards.storyboard[i].passed = allTests[i].fail ? undefined : true;
            }
            
            try {
                fs.write("../todo/report.json", JSON.stringify(report, null, '\t'), 'w');
            } catch(e) {
                console.log(e);
            }
            
        },
        fileNameGetter: function overide_file_naming(root, fileName){
        	var name;

            fileName = fileName || "screenshot";
            name = root + fs.separator + fileName;

            if(fs.isFile(name+'.png')){
                return name+'.diff.png';
            } else {
                return name+'.png';
            }
        }
    }
    /*{
	screenshotRoot: '/screenshots',
	failedComparisonsRoot: '/failures'
	casper: specific_instance_of_casper,
	libraryRoot: '/phantomcss',
	fileNameGetter: function overide_file_naming(){},
	onPass: function passCallback(){},
	onFail: function failCallback(){},
	onTimeout: function timeoutCallback(){},
	onComplete: function completeCallback(){},
	hideElements: '#thing.selector',
	addLabelToFailedImage: true
}*/);


/*
	The test scenario
*/
casper.options.waitTimeout = 5000;
casper.start();

casper.viewport(600, 600);

var i = 0;
// Given an open todo app.
casper.thenOpen('http://localhost:8111/src/index.html', function(){
});

casper.waitForSelector('form', function(){
    // HACK
    this.fillSelectors('form', {'input':' '}, false);
    this.fillSelectors('form', {'input':''}, false);
    // END HACK
});



casper.then(function(){
    // Then the title is shown
    // And the list is empty
    phantomcss.screenshot('html', '01 - opening the app');
});

casper.then(function(){
    // When submit'rule the web'
	casper.fillSelectors('form', {'input':'Rule the web'}, true);
});

casper.then(function(){
    // Then "Rule the web" is in the list.
    phantomcss.screenshot('html', '02 - adding rule the web');
});

casper.then( function now_check_the_screenshots(){
	// compare screenshots
	phantomcss.compareAll();
});

casper.then( function end_it(){
	casper.test.done();
});

/*
Casper runs tests
*/
casper.run(function(){
	console.log('\nTHE END.');
	phantom.exit(phantomcss.getExitStatus());
});

