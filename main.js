// This JavaScript file is a financial system that will keep track of financial transactions between
// different parties - people and organizations. In this system, these parties are indentified by a
// simple string, such as "John" or "Supermarket." There is no UI for this file. A browser console
// is the target UI. This file is an all-in-one JavaScript file created to run in https://repl.it 
// to solve a homework problem.
//
// To get started, run this JavaScript file in a browser, or copy paste it to a site like https://repl.it.
// When the file runs, instructions will be printed to the console window.
//
// Functions that are meant to be excuted in the console window.
//    // to add transaction entries
//    addTransactionEntry("2017-04-01,John Smith,Mary Moore,32.50");
//    addTransactionEntry("2017-04-03,John Smith,Costco,650.25");
//    addTransactionEntry("2017-05-15,Mary Moore,Rent,1800.00");
//    addTransactionEntry("2017-06-01,IBM,Mary Moore,5000.00");
//
//    // to get the current balance for a user (payer or payee)
//    getBalance("John Smith");
//
//    // to get the balance of a user on a specific date
//    getBalanceAsOfDate("Mary Moore", "2017-05-20");
//
//    // to run all the basic verification tests for aspects of this system
//    new TestRunner().runAll();
//
// Note:
// This file is not a production ready file. For production considerations, I would remove
// the tests, the sample data, and I would run this file through minification and JSLint. 
// I would bundle this JS file and other CSS assets into a single document, with some sort
// of unique key for a file name. For a development release, I want source maps for
// debugging. I recommend different configurations for different environment requirements.


function print(msg){
  console.log(msg);
}

var ledger = [];

function loadSampleData(){
  var data = sampleData.split(/\n/);
  for (var i=0; i<data.length; i++){
    addTransactionEntry(data[i]);
  }
}

function isDateValid(date){
  // Date format: YYYY-mm-dd, where year can be 1900-2099
  var dateFormat = /^[1-2]{1}[0,9]{1}[0-9]{2}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
  if (!date) return false;
  return date.match(dateFormat) != null;
}

function addTransactionEntry(entry){
  // Entry format: "2017-10-28,Mary Moore,Acme Supermarket,678.22"
  if (!entry ||
    entry.length == 0 ||
    entry.indexOf(',') == -1 ||
    entry.split(',').length != 4){
      throw new Error('Ledger Entry format is invalid. Please use: "YYYY-mm-dd,Payer Name,Payee Name,####.##" where ####.## is a currency ammount.');
    }

  // Split entry into parts and validate
  var entryParts = entry.split(',');

  var date = entryParts[0];
  if (!isDateValid(date)){
    throw new Error('Ledger Entry format is invalid. Date must match the format = YYYY-mm-dd.');
  }

  var payer = entryParts[1];
  var payee = entryParts[2];

  var amountFormat = /^[0-9]*[.]{1}[0-9]{2}$/;
  var amount = entryParts[3];
  if (!amount.match(amountFormat)){
    throw new Error('Ledge Entry format is invalid. Amount must match the format = ###.## without commas.');
  }

  // add entry to ledger
  ledger.push({
    date: date,
    payer: payer,
    payee: payee,
    amount: amount
  });

  return "Transaction added: on " + date + ", " + payer + " paid " + payee + " " + currencyFormat(amount) + ".";
}

function getBalance(userName){
  return getBalanceAsOfDate(userName, undefined);
}

function getBalanceAsOfDate(userName, date){
  if (date != undefined && !isDateValid(date)){
    throw new Error('Date format is invalid. Date must match the format = YYYY-mm-dd.');
  }

  var totalPaidOut = ledger.filter((x) => {
    return date ? x.payer == userName && new Date(x.date) <= new Date(date) : x.payer == userName;
  });

  if (totalPaidOut.length > 0){
    totalPaidOut = totalPaidOut.map((x) => {
      return Number.parseFloat(x.amount);
    });

    if (totalPaidOut.length > 0) {
        totalPaidOut = totalPaidOut.reduce((prev, curr) => {
        return prev + curr;
      });  
    }
  }

  var totalEarned = ledger.filter((x) => {
    return date ? x.payee == userName && new Date(x.date) <= new Date(date) : x.payee == userName;
  });

  if (totalEarned.length > 0) {
    totalEarned = totalEarned.map((x) => {
      return Number.parseFloat(x.amount);
    });

    if (totalEarned.length > 0) {
      totalEarned = totalEarned.reduce((prev, curr) => {
        return prev + curr;
      });
    }
  }

  var balance = totalEarned - totalPaidOut;
  return currencyFormat(balance);
}

function currencyFormat (num) {
  if (num == undefined || isNaN(num) || num.toString().trim().length == 0) {
    throw new Error('The value of "num" provided to currencyFormat is invalid. Num must be a number, interger, or float value.');
  }
  num = Number.parseFloat(num);
  return '\u00A7' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

var CurrencyFormatTests = (function() {
  var invalidMessage = 'The value of "num" provided to currencyFormat is invalid. Num must be a number, interger, or float value.';
  var symbol = '\u00A7';
  return {
    undefinedNumShouldThrowError: (() => {
      try {
        currencyFormat(undefined);
      } catch (err){
        if (err.message != invalidMessage){
          print("FAILED: undefinedNumShouldThrowError - " + err.message);
        }
        print("Passed: undefinedNumShouldThrowError");
      }
    }),
    isNanNumShouldThrowError: (() => {
      try {
        currencyFormat("nan");
      } catch (err){
        if (err.message != invalidMessage){
          print("FAILED: isNanNumShouldThrowError - " + err.message);
        }
        print("Passed: isNanNumShouldThrowError");
      }
    }),
    emptyStringNumOfZeroLengthShouldThrowError: (() => {
      try {
        currencyFormat("");
      } catch (err){
        if (err.message != invalidMessage){
          print("FAILED: emptyStringNumOfZeroLengthShouldThrowError - " + err.message);
        }
        print("Passed: emptyStringNumOfZeroLengthShouldThrowError");
      }
    }),
    emptyStringNumGreaterThanZeroLengthShouldThrowError: (() => {
      try {
        currencyFormat(" ");
      } catch (err){
        if (err.message != invalidMessage){
          print("FAILED: emptyStringNumGreaterThanZeroLengthShouldThrowError - " + err.message);
        }
        print("Passed: emptyStringNumGreaterThanZeroLengthShouldThrowError");
      }
    }),
    validNumberShouldReturnFormattedCurrency: (() => {
      var result;
      try {
        result = currencyFormat(120);
      } catch (err){
        print("FAILED: validNumberShouldReturnFormattedCurrency - " + err.message);
      }
      if (result != symbol + "120.00"){
        print("FAILED: validNumberShouldReturnFormattedCurrency - " + result); 
      }
      print("Passed: validNumberShouldReturnFormattedCurrency");
    }),
    validNumberGreaterThan999ShouldReturnFormattedCurrency: (() => {
      var result;
      try {
        result = currencyFormat(32300);
      } catch (err){
        print("FAILED: validNumberGreaterThan999ShouldReturnFormattedCurrency - " + err.message);
      }
      if (result != symbol + "32,300.00"){
        print("FAILED: validNumberGreaterThan999ShouldReturnFormattedCurrency - " + result); 
      }
      print("Passed: validNumberGreaterThan999ShouldReturnFormattedCurrency");
    }),
    validNegativeNumberShouldReturnFormattedCurrency: (() => {
      var result;
      try {
        result = currencyFormat(-321);
      } catch (err){
        print("FAILED: validNegativeNumberShouldReturnFormattedCurrency - " + err.message);
      }
      if (result != symbol + "-321.00"){
        print("FAILED: validNegativeNumberShouldReturnFormattedCurrency - " + result); 
      }
      print("Passed: validNegativeNumberShouldReturnFormattedCurrency");
    }),
    validNegativeFloatNumberShouldReturnFormattedCurrency: (() => {
      var result;
      try {
        result = currencyFormat(-1.05);
      } catch (err){
        print("FAILED: validNegativeFloatNumberShouldReturnFormattedCurrency - " + err.message);
      }
      if (result != symbol + "-1.05"){
        print("FAILED: validNegativeFloatNumberShouldReturnFormattedCurrency - " + result); 
      }
      print("Passed: validNegativeFloatNumberShouldReturnFormattedCurrency");
    }),
  };
});

var DateValidationTests = (function() {
  return {
    undefinedDateShouldReturnFalse: (() => {
      if (isDateValid(undefined)){
        print("FAILED: undefinedDateShouldReturnFalse"); 
      } else {
        print("Passed: undefinedDateShouldReturnFalse"); 
      }
    }),
    emptyDateShouldReturnFalse: (() => {
      if (isDateValid()){
        print("FAILED: emptyDateShouldReturnFalse"); 
      } else {
        print("Passed: emptyDateShouldReturnFalse"); 
      }
    }),
    emptyStringShouldReturnFalse: (() => {
      if (isDateValid("")){
        print("FAILED: emptyStringShouldReturnFalse"); 
      } else {
        print("Passed: emptyStringShouldReturnFalse"); 
      }
    }),
    invalidTextDateShouldReturnFalse: (() => {
      if (isDateValid("abc")){
        print("FAILED: invalidTextDateShouldReturnFalse"); 
      } else {
        print("Passed: invalidTextDateShouldReturnFalse"); 
      }
    }),
    invalidFormattedTextDateShouldReturnFalse: (() => {
      if (isDateValid("02/22/2017")){
        print("FAILED: invalidFormattedTextDateShouldReturnFalse"); 
      } else {
        print("Passed: invalidFormattedTextDateShouldReturnFalse"); 
      }
    }),
    invalidDayGreaterThan31ShouldReturnFalse: (() => {
      if (isDateValid("2017-02-32")){
        print("FAILED: invalidDayGreaterThan31ShouldReturnFalse"); 
      } else {
        print("Passed: invalidDayGreaterThan31ShouldReturnFalse"); 
      }
    }),
    validFormattedTextDateShouldReturnTrue: (() => {
      if (isDateValid("2017-02-22")){
        print("Passed: validFormattedTextDateShouldReturnTrue"); 
      } else {
        print("FAILED: validFormattedTextDateShouldReturnTrue"); 
      }
    })
  }
});

var addTransactionEntryTests = (function() {
  var badEntryMessage = 'Ledger Entry format is invalid. Please use: "YYYY-mm-dd,Payer Name,Payee Name,####.##" where ####.## is a currency ammount.';
  var badDateMessage = 'Ledger Entry format is invalid. Date must match the format = YYYY-mm-dd.';
  var badAmountMessage = 'Ledge Entry format is invalid. Amount must match the format = ###.## without commas.';
  return {
    undefinedEntryShouldThrowError: (() => {
      try {
        addTransactionEntry(undefined);
      } catch (err){
        if (err.message != badEntryMessage){
          print("FAILED: undefinedEntryShouldThrowError - " + err.message);
        }
        print("Passed: undefinedEntryShouldThrowError");
      }
    }),
    entryLengthOfZeroShouldThrowError: (() => {
      try {
        addTransactionEntry("");
      } catch (err){
        if (err.message != badEntryMessage){
          print("FAILED: entryLengthOfZeroShouldThrowError - " + err.message);
        }
        print("Passed: entryLengthOfZeroShouldThrowError");
      }
    }),
    entryWithoutCommasShouldThrowError: (() => {
      try {
        addTransactionEntry("bad entry");
      } catch (err){
        if (err.message != badEntryMessage){
          print("FAILED: entryWithoutCommasShouldThrowError - " + err.message);
        }
        print("Passed: entryWithoutCommasShouldThrowError");
      }
    }),
    entryWithLessThanFourCommasShouldThrowError: (() => {
      try {
        addTransactionEntry("one,bad,entry");
      } catch (err){
        if (err.message != badEntryMessage){
          print("FAILED: entryWithLessThanFourCommasShouldThrowError - " + err.message);
        }
        print("Passed: entryWithLessThanFourCommasShouldThrowError");
      }
    }),
    entryWithMoreLessThanFourCommasShouldThrowError: (() => {
      try {
        addTransactionEntry("this,is,one,more,bad,entry");
      } catch (err){
        if (err.message != badEntryMessage){
          print("FAILED: entryWithMoreLessThanFourCommasShouldThrowError - " + err.message);
        }
        print("Passed: entryWithMoreLessThanFourCommasShouldThrowError");
      }
    }),
    entryWithInvalidDateShouldThrowError: (() => {
      try {
        addTransactionEntry("02/02/2017,John,Mary,65.50");
      } catch (err){
        if (err.message != badDateMessage){
          print("FAILED: entryWithInvalidDateShouldThrowError - " + err.message);
        }
        print("Passed: entryWithInvalidDateShouldThrowError");
      }
    }),
    entryWithAmountThatIsNotATwoFixedFloatShouldThrowError: (() => {
      try {
        addTransactionEntry("2017-02-12,John,Mary,65");
      } catch (err){
        if (err.message != badAmountMessage){
          print("FAILED: entryWithAmountThatIsNotATwoFixedFloatShouldThrowError - " + err.message);
        }
        print("Passed: entryWithAmountThatIsNotATwoFixedFloatShouldThrowError");
      }
    })
  }
});

var TestRunner = (function() {
  var currencyTests = new CurrencyFormatTests();
  var dateTests = new DateValidationTests();
  var ledgerEntryTests = new addTransactionEntryTests;

  return {
    runAll: (() => {
      var runner = new TestRunner();
      runner.runCurrencyFormatTests();
      runner.runDateValidationTests();
      runner.runLedgerEntryTests();
      return "all tests completed";
    }),
    runCurrencyFormatTests: (() => {
      currencyTests.undefinedNumShouldThrowError();
      currencyTests.isNanNumShouldThrowError();
      currencyTests.emptyStringNumOfZeroLengthShouldThrowError();
      currencyTests.emptyStringNumGreaterThanZeroLengthShouldThrowError();
      currencyTests.validNumberShouldReturnFormattedCurrency();
      currencyTests.validNumberGreaterThan999ShouldReturnFormattedCurrency();
      currencyTests.validNegativeNumberShouldReturnFormattedCurrency();
      currencyTests.validNegativeFloatNumberShouldReturnFormattedCurrency();
      return "runCurrencyFormatTests completed";
    }),
    runDateValidationTests: (() => {
      dateTests.undefinedDateShouldReturnFalse();
      dateTests.emptyDateShouldReturnFalse();
      dateTests.emptyStringShouldReturnFalse();
      dateTests.invalidTextDateShouldReturnFalse();
      dateTests.invalidFormattedTextDateShouldReturnFalse();
      dateTests.invalidDayGreaterThan31ShouldReturnFalse();
      dateTests.validFormattedTextDateShouldReturnTrue();
      return "runDateValidationTests completed";
    }),
    runLedgerEntryTests: (() => {
      ledgerEntryTests.undefinedEntryShouldThrowError();
      ledgerEntryTests.entryLengthOfZeroShouldThrowError();
      ledgerEntryTests.entryWithoutCommasShouldThrowError();
      ledgerEntryTests.entryWithLessThanFourCommasShouldThrowError();
      ledgerEntryTests.entryWithMoreLessThanFourCommasShouldThrowError();
      ledgerEntryTests.entryWithInvalidDateShouldThrowError();
      ledgerEntryTests.entryWithAmountThatIsNotATwoFixedFloatShouldThrowError();
      return "runLedgerEntryTests completed";
    })
  };
});

// sample data
var sampleData = 

  "2017-01-01,IBM,Alex,5000.00\n" + 
  "2017-02-01,IBM,Alex,5000.00\n" + 
  "2017-03-01,IBM,Alex,5000.00\n" + 
  "2017-04-01,IBM,Alex,5000.00\n" + 
  "2017-05-01,IBM,Alex,5000.00\n" + 
  "2017-06-01,IBM,Alex,5000.00\n" + 
  "2017-07-01,IBM,Alex,5000.00\n" + 
  "2017-08-01,IBM,Alex,5000.00\n" + 
  "2017-09-01,IBM,Alex,5000.00\n" + 
  "2017-10-01,IBM,Alex,5000.00\n" + 

  "2017-01-01,Alex,Tuition,750.00\n" + 
  "2017-02-01,Alex,Tuition,750.00\n" + 
  "2017-03-01,Alex,Tuition,750.00\n" + 
  "2017-04-01,Alex,Tuition,750.00\n" + 
  "2017-05-01,Alex,Tuition,750.00\n" + 
  "2017-06-01,Alex,Tuition,750.00\n" + 
  "2017-07-01,Alex,Tuition,750.00\n" + 
  "2017-08-01,Alex,Tuition,750.00\n" + 
  "2017-09-01,Alex,Tuition,750.00\n" + 
  "2017-10-01,Alex,Tuition,750.00\n" + 


  // John makes $60K/year salary with Dell
  "2017-01-01,Dell Inc.,John Smith,5000.00\n" + 
  "2017-02-01,Dell Inc.,John Smith,5000.00\n" + 
  "2017-03-01,Dell Inc.,John Smith,5000.00\n" + 
  "2017-04-01,Dell Inc.,John Smith,5000.00\n" + 
  "2017-05-01,Dell Inc.,John Smith,5000.00\n" + 
  "2017-06-01,Dell Inc.,John Smith,5000.00\n" + 
  "2017-07-01,Dell Inc.,John Smith,5000.00\n" + 
  "2017-08-01,Dell Inc.,John Smith,5000.00\n" + 
  "2017-09-01,Dell Inc.,John Smith,5000.00\n" + 
  "2017-10-01,Dell Inc.,John Smith,5000.00\n" + 
  
  // Mary makes $80K/year salary with Toyota
  "2017-01-01,Toyota,Mary Moore,3333.00\n" +
  "2017-01-15,Toyota,Mary Moore,3333.00\n" +
  "2017-02-01,Toyota,Mary Moore,3333.00\n" + 
  "2017-02-15,Toyota,Mary Moore,3333.00\n" + 
  "2017-03-01,Toyota,Mary Moore,3333.00\n" + 
  "2017-03-15,Toyota,Mary Moore,3333.00\n" + 
  "2017-04-01,Toyota,Mary Moore,3333.00\n" + 
  "2017-04-15,Toyota,Mary Moore,3333.00\n" + 
  "2017-05-01,Toyota,Mary Moore,3333.00\n" + 
  "2017-05-15,Toyota,Mary Moore,3333.00\n" + 
  "2017-06-01,Toyota,Mary Moore,3333.00\n" + 
  "2017-06-15,Toyota,Mary Moore,3333.00\n" + 
  "2017-07-01,Toyota,Mary Moore,3333.00\n" + 
  "2017-07-15,Toyota,Mary Moore,3333.00\n" + 
  "2017-08-01,Toyota,Mary Moore,3333.00\n" + 
  "2017-08-15,Toyota,Mary Moore,3333.00\n" + 
  "2017-09-01,Toyota,Mary Moore,3333.00\n" + 
  "2017-09-15,Toyota,Mary Moore,3333.00\n" + 
  "2017-10-01,Toyota,Mary Moore,3333.00\n" + 
  "2017-10-15,Toyota,Mary Moore,3333.00\n" + 
  
  // John bills
  "2017-01-02,John Smith,Daycare,1250.00\n" + 
  "2017-01-05,John Smith,State Farm,437.25\n" + 
  "2017-01-10,John Smith,US Bank,2215.35\n" + 
  "2017-01-10,John Smith,Mary Moore,130.00\n" + 
  "2017-01-20,John Smith,Capitol One Auto,387.45\n" + 
  "2017-01-25,John Smith,Eddies Supermarket,1422.98\n" + 
  "2017-02-02,John Smith,Daycare,1250.00\n" + 
  "2017-02-05,John Smith,State Farm,437.25\n" + 
  "2017-02-06,John Smith,Texaco,73.13\n" + 
  "2017-02-10,John Smith,US Bank,2215.35\n" + 
  "2017-02-20,John Smith,Capitol One Auto,387.45\n" + 
  "2017-02-25,John Smith,Costco,870.00\n" +
  "2017-03-02,John Smith,Daycare,1250.00\n" + 
  "2017-03-05,John Smith,State Farm,437.25\n" + 
  "2017-03-10,John Smith,US Bank,2215.35\n" + 
  "2017-03-20,John Smith,Capitol One Auto,387.45\n" + 
  "2017-03-25,John Smith,Whole Foods,572.65\n" + 
  "2017-04-02,John Smith,Daycare,1250.00\n" + 
  "2017-04-05,John Smith,State Farm,437.25\n" + 
  "2017-04-10,John Smith,US Bank,2215.35\n" + 
  "2017-04-13,John Smith,Texaco,72.52\n" + 
  "2017-04-20,John Smith,Capitol One Auto,387.45\n" + 
  "2017-04-25,John Smith,Eddies Supermarket,933.32\n" + 
  "2017-05-02,John Smith,Daycare,1250.00\n" + 
  "2017-05-05,John Smith,State Farm,437.25\n" + 
  "2017-05-10,John Smith,US Bank,2215.35\n" + 
  "2017-05-16,John Smith,Mary Moore,220.00\n" + 
  "2017-05-20,John Smith,Capitol One Auto,387.45\n" + 
  "2017-05-25,John Smith,Winco,642.68\n" + 
  "2017-06-02,John Smith,Daycare,1250.00\n" + 
  "2017-06-05,John Smith,State Farm,437.25\n" + 
  "2017-06-10,John Smith,US Bank,2215.35\n" + 
  "2017-06-20,John Smith,Capitol One Auto,387.45\n" + 
  "2017-06-25,John Smith,Eddies Supermarket,182.31\n" + 
  "2017-06-26,John Smith,Texaco,66.31\n" + 
  "2017-07-02,John Smith,Daycare,1250.00\n" + 
  "2017-07-05,John Smith,State Farm,437.25\n" + 
  "2017-07-10,John Smith,US Bank,2215.35\n" + 
  "2017-07-20,John Smith,Capitol One Auto,387.45\n" + 
  "2017-07-25,John Smith,Costco,1351.68\n" + 
  "2017-08-02,John Smith,Daycare,1250.00\n" + 
  "2017-08-05,John Smith,State Farm,437.25\n" + 
  "2017-08-10,John Smith,US Bank,2215.35\n" + 
  "2017-08-16,John Smith,Texaco,65.14\n" + 
  "2017-08-20,John Smith,Capitol One Auto,387.45\n" + 
  "2017-08-25,John Smith,Whole Foods,725.44\n" + 
  "2017-09-02,John Smith,Daycare,1250.00\n" + 
  "2017-09-05,John Smith,State Farm,437.25\n" + 
  "2017-09-06,John Smith,Mary Moore,90.00\n" + 
  "2017-09-10,John Smith,US Bank,2215.35\n" + 
  "2017-09-20,John Smith,Capitol One Auto,387.45\n" + 
  "2017-09-25,John Smith,Eddies Supermarket,1352.98\n" + 
  "2017-10-02,John Smith,Daycare,1250.00\n" + 
  "2017-10-03,John Smith,Texaco,71.29\n" + 
  "2017-10-05,John Smith,State Farm,437.25\n" + 
  "2017-10-10,John Smith,US Bank,2215.35\n" + 
  "2017-10-20,John Smith,Capitol One Auto,387.45\n" + 
  "2017-10-25,John Smith,Winco,1532.67\n" + 
  
  // Mary bills
  "2017-01-02,Mary Moore,Petcare,480.00\n" + 
  "2017-01-05,Mary Moore,Geico,268.58\n" + 
  "2017-01-19,Mary Moore,Northwest Auto,635.85\n" + 
  "2017-01-20,Mary Moore,HR Rent,1825.65\n" + 
  "2017-01-28,Mary Moore,Acme Supermarket,678.22\n" + 
  "2017-02-02,Mary Moore,Petcare,480.00\n" + 
  "2017-02-05,Mary Moore,Geico,268.58\n" + 
  "2017-02-19,Mary Moore,Northwest Auto,635.85\n" + 
  "2017-02-20,Mary Moore,HR Rent,1825.65\n" + 
  "2017-02-28,Mary Moore,Acme Supermarket,678.22\n" + 
  "2017-03-02,Mary Moore,Petcare,480.00\n" + 
  "2017-03-05,Mary Moore,Geico,268.58\n" + 
  "2017-03-19,Mary Moore,Northwest Auto,635.85\n" + 
  "2017-03-20,Mary Moore,HR Rent,1825.65\n" + 
  "2017-03-28,Mary Moore,Acme Supermarket,678.22\n" + 
  "2017-04-02,Mary Moore,Petcare,480.00\n" + 
  "2017-04-05,Mary Moore,Geico,268.58\n" + 
  "2017-04-19,Mary Moore,Northwest Auto,635.85\n" + 
  "2017-04-19,Mary Moore,John Smith,65.00\n" + 
  "2017-04-20,Mary Moore,HR Rent,1825.65\n" + 
  "2017-04-28,Mary Moore,Acme Supermarket,678.22\n" + 
  "2017-05-02,Mary Moore,Petcare,480.00\n" + 
  "2017-05-05,Mary Moore,Geico,268.58\n" + 
  "2017-05-19,Mary Moore,Northwest Auto,635.85\n" + 
  "2017-05-20,Mary Moore,HR Rent,1825.65\n" + 
  "2017-05-28,Mary Moore,Acme Supermarket,678.22\n" + 
  "2017-06-02,Mary Moore,Petcare,480.00\n" + 
  "2017-06-05,Mary Moore,Geico,268.58\n" + 
  "2017-06-19,Mary Moore,Northwest Auto,635.85\n" + 
  "2017-06-20,Mary Moore,HR Rent,1825.65\n" + 
  "2017-06-28,Mary Moore,Acme Supermarket,678.22\n" + 
  "2017-07-02,Mary Moore,Petcare,480.00\n" + 
  "2017-07-05,Mary Moore,Geico,268.58\n" + 
  "2017-07-19,Mary Moore,Northwest Auto,635.85\n" + 
  "2017-07-20,Mary Moore,HR Rent,1825.65\n" + 
  "2017-07-28,Mary Moore,Acme Supermarket,678.22\n" + 
  "2017-08-02,Mary Moore,Petcare,480.00\n" + 
  "2017-08-05,Mary Moore,Geico,268.58\n" + 
  "2017-08-19,Mary Moore,Northwest Auto,635.85\n" + 
  "2017-08-20,Mary Moore,HR Rent,1825.65\n" + 
  "2017-08-28,Mary Moore,Acme Supermarket,678.22\n" + 
  "2017-09-02,Mary Moore,Petcare,480.00\n" + 
  "2017-09-05,Mary Moore,Geico,268.58\n" + 
  "2017-09-19,Mary Moore,Northwest Auto,635.85\n" + 
  "2017-09-20,Mary Moore,HR Rent,1825.65\n" + 
  "2017-09-28,Mary Moore,Acme Supermarket,678.22\n" + 
  "2017-10-02,Mary Moore,Petcare,480.00\n" + 
  "2017-10-05,Mary Moore,Geico,268.58\n" + 
  "2017-10-19,Mary Moore,Northwest Auto,635.85\n" + 
  "2017-10-20,Mary Moore,HR Rent,1825.65\n" + 
  "2017-10-28,Mary Moore,Acme Supermarket,678.22";
;

(function(){
  
  // load sample data
  loadSampleData();

  // Print instructions for how to use this system.
  print('This system will keep track of financial transactions between different parties - people and organizations. In this system, these parties are indentified by a simple string, such as "John" or "Supermarket."');
  print("");
  print("The ledger of transactions will have the format shown below as an example:");
  print("\t2015-01-16,john,mary,125.00");
  print("\t2015-01-17,john,supermarket,20.00");
  print("\t2015-01-17,john,mary,100.00");
  print("");
  print('This system allows the input of transaction data, one ledger entry at a time. This system also comes with sample data. If you prefer to use the sample data, in the JavaScript code, uncomment the line "loadSampleData()" to populate the ledger, then save the file and refresh the web page.');
  print("");
  print("To add a ledger entry, execute the following function, addTransactionEntry(), in your browser, with your sample data. Below is an example.");
  print('\taddTransactionEntry("2017-10-02,Me,You,55.25");');
  print("");
  print('To check the current balance of a "Payer" or "Payee," execute the following function, getBalance(). Below is an example.');
  print('\tgetBalance("John Smith");');
  print("");
  print('To check the balance of a "Payer" or "Payee" at a specific date, execute the following function, getBalanceAsOfDate(). Below is an example.');
  print('\tgetBalanceAsOfDate("John Smith", "2017-03-15");');
  print("");
  print("This system comes with some basic verification tests. To run those, execute the following in your browser, as shown below,");
  print("\tnew TestRunner().runAll();");
  print("");
  
})();
