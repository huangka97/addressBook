"use strict";

var fs = require('fs');
var validator = require('validator');
//require columnify here
var columnify=require("columnify");


var JSON_FILE = 'data.json'

ensureFileExists();

var data = JSON.parse(fs.readFileSync(JSON_FILE));




//the message that will be displayed  If no arguments are specified or if user types help
var helpString = "\n\tUsage: addressBook [options] [command]\n\n\n" +"\tOptions:\n" + "\t\thelp   Show this help message and quit"+"\n\n\n\tCommands:\n" + "\t\tadd       Create Contact\n" + "\t\tdisplay   Display all contacts in directory\n" + "\t\tupdate    Update existing contact\n"


var argv = process.argv

argv.splice(0,2); 

            
function parseCommand() {
  // YOUR CODE HERE
  if(argv[0]==undefined){
    //console.log("")
    return "";
  }
  //console.log(argv[0]);
  return String(argv[0]);

}

//store the command and execute its corresponding function
var input = parseCommand()
switch(input){
  case "add":
    addContact();
    break;
  case "update":
    updateContact();
    break;
  case "delete":
    deleteContact()
    break;
  case "display":
    displayContacts();
    break;
  default:
    console.log(helpString); //if command = 'help' or invalid command, print help
}

// Implement displayContacts()

function displayContacts(){
    //YOUR CODE HERE
    var columns = columnify(data, {
      dataTransform: function(data) {
        if(parseInt(data)==-1){
          data="-None-";
        }
        return data
    },
    config: {

        name: {
            headingTransform: function(heading) {
              return "CONTACT_NAME"
            }
        },
        number:{
          headingTransform:function(heading){
            return "PHONE_NUMBER"
          }
        }
    }
})
    console.log(columns); //UNCOMMENT


}



//----------------- PART 3 'add' command---------------------//
/**
* Implement addContacts()
* This is a function that is called to create a new contact.
* Calling `node add contactName contactNumber ` must call our function addContact.
* it should get the name and number of the Contact from process.argv
* You should only create a new contact if a name is provided that doesnt already exist inside your address book (no duplicate contacts)
* and if the name consists of only letters and the number consists of only numbers
* name: string, number: number
* if no number is provided, store -1 as their number
*/
function addContact() {

// YOUR CODE HERE
var contactName = argv[1];
 var contactNumber = argv[2];
 var checker= true;
 console.log(contactNumber);
 //if statement to check the data.json file for duplicates

 for (var i = 0; i < data.length; i++) {
   if (contactName === data[i].name) {
     console.log(contactName + ' name already in addressbook');
     checker = false;
   }
 }
 //check for type coercison or no name input
 if ((contactName === undefined) || (typeof(contactName) !== 'string') || (typeof(parseInt(contactNumber)) !== 'number')) {
   console.log('Invalid Contact format');
 }
 // else add to address book;
 else {
   if (contactNumber === undefined && checker) {
     fs.writeFileSync('./data.json', data.push({name: contactName, number: -1}));
     console.log (`Contact Added ${contactName}`);
   }

   else {
     if (checker) {
       fs.writeFileSync('./data.json', data.push({name: contactName, number: contactNumber}));
       console.log (`Contact Added ${contactName}`);
     }
   }
 }


}


//----------------- PART 4 'update' command---------------------//
/**
* Implement updateContact()
* This is a function that is called to update an existing contact.
* Calling `node addressBook.js update contactName newContactNumber ` updates the number of contact with name contactName to be newContactNumber.
* Calling `node addressBook.js update contactName newContactName ` updates the name of contact with name contactName to be newContactName.
* it should get the name and update field of the Contact from process.argv
* You should only update a contact if it exists inside your address book and the new name or number is valid
*
*/
function updateContact(){
// YOUR CODE HERE
  var newName=argv[1];
  var noContactfound=true;
  var changedNumber=false;
  var previousName="";
  var changedName=false;
  var newNumber=argv[2];
  if ((argv[1] === undefined) || (Number(argv[1]))  || (typeof(parseInt(argv[2])) !== 'number')) {
   console.log('Invalid Contact format');
   return;
 }
  for(var i=0;i<data.length;i++){
    if(data[i].name==argv[1]){
      if(isNaN(newNumber)){
        noContactfound=false;
        previousName=data[i].name;
        data[i].name=newNumber;
        changedName=true;

      }
      else{
        noContactfound=false;
        data[i].number=newNumber;
        changedNumber=true;
      }
    }
  }
  if(noContactfound){
    console.log("No Contact Found");
  }
  if(!noContactfound && changedNumber ){
    console.log("Updated number for "+newName);
  }
  if(!noContactfound && changedName){
    console.log("Updated name for "+newName);
  }
  
}


//BONUS Implement deleteContact
function deleteContact(){
    //YOUR CODE HERE
    var deleteName=argv[1];
    var posDelete;
    var checked=false;
    for(var i=0;i<data.length;i++){
      if(data[i].name===deleteName){
        var posDelete-data.indexOf(data[i]);
        checked=true;
      }
    }
    if(checked){
      data.splice(posDelete,1);
      console.log(deleteName+ " is deleted");
    }
}



// ---Utility functions---

// We use these functions to read and modify our JSON file.
function writeFile(data) {
  fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2));
}

function ensureFileExists() {
  if (! fs.existsSync(JSON_FILE)) {
    writeFile([]);
  }
}


// This command writes  our tasks to the disk
writeFile(data);
