

var firmware_verifier;
var fileData;
var fs = require('fs');
var path = require('path');

var testFiles = [{
		'deviceType': 'T7',
		'fileName': 'T7firmware_010146_2015-01-19.bin',
		'test': true,
	}, {
		'deviceType': 'T7',
		'fileName': 'T7recovery_006602_07232013.bin',
		'test': true,
	}, {
		'deviceType': 'T4',
		'fileName': 'T4firmware_101401_2016-08-01.bin',
		'test': true,
	}, {
		'deviceType': 'Digit',
		'fileName': 'DigitFW_012200_04222015.bin',
		'test': true,
	}, {
		'deviceType': 'T8',
		'fileName': 'T8firmware_009009_2019-12-26.bin',
		'test': true,
	}];
testFiles.forEach(function(testFile) {
	testFile.path = path.join(process.cwd(), 'test', testFile.fileName);
});
exports.tests = {
	'load firmware_verifier': function(test) {
		firmware_verifier = require('../lib/firmware_verifier');
		test.ok(true);
		test.done();
	},
	'test valid file': function(test) {
		var fileData = fs.readFileSync(testFiles[0].path);

		firmware_verifier.validateFirmwareFile(fileData, {
			'version': '1.0146',
			'deviceType': 'T7', // This flag isn't currently enabled but should be...
		})
		.then(function(parsedData) {
			// console.log('Parsed Data', parsedData);
			test.ok(parsedData.isValid, parsedData.message);
			test.done();
		});
	},
	'test T7 recovery fw': function(test) {
		var fileData = fs.readFileSync(testFiles[1].path);

		firmware_verifier.validateFirmwareFile(fileData, {
			'version': '0.6602',
			'deviceType': 'T7', // This flag isn't currently enabled but should be...
		})
		.then(function(parsedData) {
			// console.log('Parsed Data', parsedData);
			test.ok(parsedData.isValid, parsedData.message);
			test.done();
		});
	},
	'test T4 fw file': function(test) {
		var fileData = fs.readFileSync(testFiles[2].path);

		firmware_verifier.validateFirmwareFile(fileData, {
			'version': '10.1401',
			'deviceType': 'T4', // This flag isn't currently enabled but should be...
		})
		.then(function(parsedData) {
			// console.log('Parsed Data', parsedData);
			test.ok(parsedData.isValid, parsedData.message);
			test.done();
		});
	},
	'test T8 fw file': function(test) {
		var fileData = fs.readFileSync(testFiles[4].path);

		firmware_verifier.validateFirmwareFile(fileData, {
			'version': '0.9009',
			'deviceType': 'T8', // This flag isn't currently enabled but should be...
		})
		.then(function(parsedData) {
			// console.log('Parsed Data', parsedData);
			test.ok(parsedData.isValid, parsedData.message);
			test.done();
		});
	},
	'test invalid file': function(test) {
		// Try to load a Digit's firmware file as a T7.
		var fileData = fs.readFileSync(testFiles[3].path);

		firmware_verifier.validateFirmwareFile(fileData, {
			'version': '1.0146',
			'deviceType': 'T7', // This flag isn't currently enabled but should be...
		})
		.then(function(parsedData) {
			test.strictEqual(parsedData.isValid, false, 'Should have failed');
			var reqMessage = 'Incorrect device type.';
			// console.log('Data', parsedData);
			test.deepEqual(parsedData.message, reqMessage, 'Wrong error message');
			test.done();
		});
	},
};