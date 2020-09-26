const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util")

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const wirteFileAsync = util.promisify(fs.writeFile)
const employees = []
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

/// this two functions are to validate that the right type of data is being passed 
const stringValidation = async function (input) {
    if (input === null || !isNaN(input)) {
        return 'this field must be a string';
    }
    return true
}
const numericValidation = async function (input) {
    if (input === null || isNaN(input)) {
        return 'this field must be numeric';
    }
    return true
}

///this array holds the managers questions and is set to default as we wil always need one manager
const mgQuestions = [
    {
        type: "input",
        name: "name",
        message: "Enter the manager's name",
        validate: stringValidation
    },
    {
        type: "input",
        name: "id",
        message: "Please enter the employee ID",
        validate: numericValidation
    },
    {
        type: "input",
        name: "email",
        message: "Enter the employee's e-mail",
        validate: stringValidation
    },
    {
        type: "input",
        name: "office",
        message: "What is the the manager's office number?",
        validate: numericValidation
    },
    {
        type: "confirm",
        name: "addEmployee",
        message: "Whould you like to add another employee?"
    },
]
let empQuestions = [
    {
        type: "list",
        name: "typeOfemployee",
        message: "Is this employee a ____?:",
        choices: ["Engineer", "Intern"]
    },
    {
        type: "input",
        name: "name",
        message: "Enter the employee's name",
        validate: stringValidation
    },
    {
        type: "input",
        name: "id",
        message: "Please enter the employee's ID",
        validate: numericValidation
    },
    {
        type: "input",
        name: "email",
        message: "Enter the employee's e-mail",
        validate: stringValidation
    },
    {
        type: "input",
        name: "github",
        message: "What is the engineer's GitHub?",
        validate: stringValidation,
        when: (empQ) => empQ.typeOfemployee === "Engineer"
    },
    {
        type: "input",
        name: "school",
        message: "What is the intern's school?",
        validate: stringValidation,
        when: (empQ) => empQ.typeOfemployee === "Intern"
    },
    {
        type: "confirm",
        name: "addEmployee",
        message: "Whould you like to add another employee?"
    },
]

/// initializing emq.addEmployee to true to save a few lines of code
var emq = { addEmployee: true }
/// this async function is going to execute inquirer with the right set of questions
async function promptUser() {
    //first we pas the default set of questions (manager input) and push the object to the employee array 
    const mgq = await inquirer.prompt(mgQuestions)
    employees.push(new Manager(mgq.name, mgq.id, mgq.email, mgq.office))
    // looping thru the next set of questions and pushing the objects to the employyes array
    while (mgq.addEmployee === true && emq.addEmployee === true) {
        emq = await inquirer.prompt(empQuestions);
        if (emq.typeOfemployee === "Engineer") {
            employees.push(new Engineer(emq.name, emq.id, emq.email, emq.github))
        } else { employees.push(new Intern(emq.name, emq.id, emq.email, emq.school)) }
    }
}
/// this async function will allow to wait for the prompts to execute the render function we imported from render.js
/// and await for render to execute writeFieAsync 
async function init() {
    try {
        await promptUser();
        const rendered = await render(employees)
        await wirteFileAsync(outputPath, rendered)
    } catch (err) {
        console.log(err)
    }
}
// execute init function and let it all happen
init()

