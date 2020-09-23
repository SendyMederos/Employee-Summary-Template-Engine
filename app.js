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


const mgquestions = [
    {
        type: "input",
        name: "name",
        message: "Enter the manager's name"
    },
    {
        type: "input",
        name: "id",
        message: "Please enter the employee ID"
    },
    {
        type: "input",
        name: "email",
        message: "Enter the employee's e-mail"
    },
    {
        type: "input",
        name: "office",
        message: "What is the the mangaer's office number?"
    },
    {
        type: "confirm",
        name: "addEmployee",
        message: "Whould you like to add another employee?"
    },
]
const empquestions = [
    {
        type: "list",
        name: "typeOfemployee",
        message: "Is this employee a ____?:",
        choices: ["Engineer", "Intern"]
    },
    {
        type: "input",
        name: "name",
        message: "Enter the employee's name"
    },
    {
        type: "input",
        name: "id",
        message: "Please enter the employee's ID"
    },
    {
        type: "input",
        name: "email",
        message: "Enter the employee's e-mail"
    },
    {
        type: "input",
        name: "github",
        message: "What is the engineer's GitHub?",
        when: (empquestions) => empquestions.typeOfemployee === "Engineer"
    },
    {
        type: "input",
        name: "school",
        message: "What is the intern's school?",
        when: (empquestions) => empquestions.typeOfemployee === "Intern"
    },
    {
        type: "confirm",
        name: "addEmployee",
        message: "Whould you like to add another employee?"
    },

]

async function promptUser() {
    const mgq = await inquirer.prompt(mgquestions)
    employees.push(new Manager(mgq.name, mgq.id, mgq.email, mgq.office))

    if (mgq.addEmployee === true) {
        var emq = await inquirer.prompt(empquestions);
        if (emq.typeOfemployee === "Engineer") {
            employees.push(new Engineer(emq.name, emq.id, emq.email, emq.github))

        } else { employees.push(new Intern(emq.name, emq.id, emq.email, emq.school)) }
        while (emq.addEmployee === true) {
            emq = await inquirer.prompt(empquestions);
            if (emq.typeOfemployee === "Engineer") {
                employees.push(new Engineer(emq.name, emq.id, emq.email, emq.github))

            } else { employees.push(new Intern(emq.name, emq.id, emq.email, emq.school)) }


        }
    }
}
async function init() {
    try {
        await promptUser();
    
        const rendered = await render(employees)

        await wirteFileAsync(outputPath, rendered)
    } catch (err) {
        console.log(err)
    }
}
init()
// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
