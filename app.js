const Discord = require('discord.js');
require('dotenv').config();

const client = new Discord.Client();
client.login(process.env.BOT_TOKEN)

client.on('ready', () => {
    console.log('Bot is ready');
});
  
client.on('message', (msg) => {
if (/^\!\w+/.test(msg.content)) {
    //console.log(msg.member);
        command = msg.content.substring(1).split(' ');
        if (command[0].toUpperCase() === 'ROLL')
        {
            if (command.length < 2) msg.channel.send("ERROR: roll command should have at least one other argument");
            //TODO: update command to add + or - numbers and adv / dis
            var roll = command[1].match(/([0-9]*d[0-9]+)(\+*-*[0-9]+)/gi);
            if (roll !== null)
            {
                roll = roll[0];
                console.log(roll);
                var numberOfDice = roll.match(/[0-9]+d/gi);
                var sizeOfDice
                if (numberOfDice === null)
                {
                    numberOfDice = 1;
                    sizeOfDice = roll.match(/[0-9]+/gi)[0]
                } 
                else 
                {
                    numberOfDice = numberOfDice[0].substring(0, numberOfDice[0].length-1);
                    sizeOfDice = roll.match(/[0-9]+/gi)[1];
                }
                var modifier = roll.match(/([\+-][0-9]+$)/gi);
                //TODO: rework the advantage / disadvantage system to include whole groups of rolls not just the best of single rolls
                var advOrDis = false;
                if (command[2] !== undefined)
                {
                    if (command[2].toUpperCase() === 'ADV' || command[2].toUpperCase() === 'DIS') numberOfDice++;
                    advOrDis = true;
                }
                var rollResults = RollDice(numberOfDice, sizeOfDice);
                var rollTotal = 0;
                var rollIndex = 0;
                if (!advOrDis)
                {
                    for (var i = 0; i < rollResults.length; i++)
                    {
                        rollTotal += rollResults[i];
                    }
                }
                else
                {
                    var higher = (command[2].toUpperCase() === 'ADV') ? true : false;
                    for (var i = 0; i < rollResults.length; i++)
                    { 
                        if (higher)
                        {
                            if (rollResults[i] > rollResults[rollIndex]) rollIndex = i;
                        }
                        else
                        {
                            if (rollResults[i] < rollResults[rollIndex]) rollIndex = i;
                        }
                    }
                    rollTotal = rollResults[rollIndex];
                }
                if (modifier !== null)
                {
                    modifier = modifier[0];
                    var convertedModifier = parseInt(modifier.substring(1));
                    if (modifier[0] === '+') rollTotal += convertedModifier;
                    else rollTotal -= convertedModifier;
                }
                var initialRollMessage = `${msg.member.nickname} Roll: [ **${rollResults.join(", ")}** ]`;
                if (!advOrDis) msg.channel.send(`${initialRollMessage}. Result: **${rollTotal}**`);
                else msg.channel.send(`${initialRollMessage}\n${(command[2].toUpperCase() === 'ADV') ? "Advantage" : "Disadvantage"} Result: **${rollTotal}**`);
            }
            else msg.channel.send("ERROR: roll command does not have the proper roll format. Example command format: '!roll 1d20'");
        }
        else msg.channel.send(`ERROR: ${command} is not a valid command`);            
    }
});

function RollDice(numberOfDice, sizeOfDice)
{
    var rollResult = [numberOfDice];
    for (var i = 0; i < numberOfDice; i++)
    {
        rollResult[i] = Math.floor(Math.random() * sizeOfDice) + 1;
        //console.log(rollResult[i]);
    }
    return rollResult;
}