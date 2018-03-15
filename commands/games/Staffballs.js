const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
module.exports = class StaffballsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'throw',
            group: 'игрульки',
            memberName: 'throw',
            description: 'Кидайся предметами в других людей!',
            examples: ['throw'],
            argsCount: 2,
            argsType: 'multiple'
        });

        this.variants = {
            results: {
                negative: [
                    '**{{user}}** кидает {{thing}} в {{otherUser}} и промахивается!',
                    '**{{user}}** швыряет {{thing}} в {{otherUser}} и промахивается!',
                    '**{{user}}** напрягся и кинул {{thing}} в {{otherUser}}, но промахнулся!',
                    '**{{user}}** кидает {{thing}} в {{otherUser}}, но рикошетом попадает в <@{{somebody}}>!',
                    '**{{user}}** швыряет {{thing}} в {{otherUser}}, но рикошетом попадает в <@{{somebody}}>!',
                    '**{{user}}** напрягся и кинул {{thing}} в {{otherUser}}, но рикошетом попал в <@{{somebody}}>!',
                    '**{{user}}** кидает {{thing}} в {{otherUser}}, но рикошетом попадает <@{{somebody}}> прямо в {{bodypart}}!',
                    '**{{user}}** швыряет {{thing}} в {{otherUser}}, но рикошетом попадает <@{{somebody}}> прямо в {{bodypart}}!',
                    '**{{user}}** напрягся и кинул {{thing}} в {{otherUser}}, но рикошетом попал <@{{somebody}}> прямо в {{bodypart}}!'
                ],
                positive: [
                    '**{{user}}** кидает {{thing}} и попадает  в {{otherUser}}!',
                    '**{{user}}** швыряет {{thing}} и попадает  в {{otherUser}}!',
                    '**{{user}}** напрягся и кинул {{thing}}, попав  в {{otherUser}}!',
                    '**{{user}}** кидает {{thing}} и попадает {{otherUser}} прямо в {{bodypart}}!',
                    '**{{user}}** швыряет {{thing}} и попадает {{otherUser}} прямо в {{bodypart}}!',
                    '**{{user}}** напрягся и кинул {{thing}}, попав {{otherUser}} прямо в {{bodypart}}!'
                ]
            },
            bodyParts: [
                'правый глаз',
                'левый глаз',
                'рот',
                'нос',
                'левое ухо',
                'правое ухо',
                'левую руку',
                'правую руку',
                'левый сосок',
                'правый сосок',
                'живот',
                'спину',
                'пуп',
                'писюн',
                'попу',
                'правую ногу',
                'левую ногу',
                'пятку'
            ]
        };

        this.randomInteger = function (min, max) {
            let rand = min + Math.random() * (max + 1 - min);
            rand = Math.floor(rand);
            return rand;
        };

        this.getAllMembers = function (members, message) {
            let allMembers = [];
            let mentions = message.mentions.members;
            members.forEach((item) => {
                if (!item.user.bot) {
                    if(mentions.length > 0) {
                        mentions.forEach((user) => {
                            if(user.user.id !== item.user.id) {
                                allMembers.push(
                                    {
                                        userNick: item.user.username,
                                        userId: item.user.id
                                    }
                                )
                            }
                        })
                    } else {
                        allMembers.push(
                            {
                                userNick: item.user.username,
                                userId: item.user.id
                            }
                        )
                    }
                }
            });
            return allMembers;
        };

        this.getActiveMembers = function (members, message) {
            let activeMembers = [];
            members.forEach((item) => {
                if (!item.user.bot && item.user.id !== message.author.id && item.user.presence.status !== 'offline') {
                    activeMembers.push(
                        {
                            userNick: item.user.username,
                            userId: item.user.id
                        }
                    )
                }
            });
            return activeMembers;
        };

        this.getRandomDecision = function () {
            let propertyArray = Object.getOwnPropertyNames(this.variants.results);
            let randomProperty = propertyArray[this.randomInteger(0, propertyArray.length - 1)];
            return this.variants.results[randomProperty];
        };

        this.formatMessage = function (message, data) {
            return message.replace(/{{user}}/g, data.username).replace(/{{thing}}/g, data.thing)
                .replace(/{{otherUser}}/g, data.otherUser).replace(/{{somebody}}/g, data.somebody)
                .replace(/{{bodypart}}/g, this.variants.bodyParts[this.randomInteger(0, this.variants.bodyParts.length - 1)]);
        }
    }

    run(message) {
        let positiveOrNegative, resultMessage, resultMessageNum, formattedResultMessage, textData = {};

        let args = message.parseArgs(message.argString);

        let members = message.guild.members;
        let activeMembers = this.getActiveMembers(members, message);
        let allMembers = this.getAllMembers(members, message);
        let activeMembersCount = activeMembers.length;

        let throwThing = args[0] || 'снежок';
        let targetUser = args[1] || '<@' + allMembers[this.randomInteger(0, allMembers.length - 1)].userId + '>';

        if (activeMembersCount > 0) {
            positiveOrNegative = this.getRandomDecision();
            resultMessageNum = this.randomInteger(0, positiveOrNegative.length - 1);
        } else {
            positiveOrNegative = this.variants.results['negative'];
            resultMessageNum = this.randomInteger(0, 2);
        }

        resultMessage = positiveOrNegative[resultMessageNum];
        textData.username = message.author.username;
        textData.thing = throwThing;
        textData.otherUser = targetUser;
        textData.somebody = allMembers.length > 0 ? allMembers[this.randomInteger(0, allMembers.length - 1)].userId : 'себе';

        formattedResultMessage = this.formatMessage(resultMessage, textData);


        const embed = new MessageEmbed()
            .setTitle('💣 💣 💣 💣')
            .setDescription(formattedResultMessage)
            .setFooter(message.author.username, message.author.displayAvatarURL())
            .setTimestamp()
            .setColor(0xC2185B);
        message.delete();
        return message.say(embed);
    }
};