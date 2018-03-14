const { Command } = require('discord.js-commando');
const { MessageEmbed  } = require('discord.js');
module.exports = class BallCommand extends Command {
    constructor(client) {
        super(client, {
            name: '8ball',
            group: 'игрульки',
            memberName: '8ball',
            description: 'Задай вопрос Магическому Шару!',
            examples: ['8ball']
        });

        this.responses = [
            'невероятно, но факт',
            'никаких сомнений',
            'абсолютли',
            'можешь быть уверен в этом',
            'вазмижна',
            'знаки говорят — "да"',
            'лучше не рассказывать',
            'вероятно, но не факт',
            'нет',
            'даже не думай такого',
            'весьма сомнительно',
            'неа'
        ];

        this.randomInteger = function(min, max) {
            let rand = min + Math.random() * (max + 1 - min);
            rand = Math.floor(rand);
            return rand;
        }
    }

    run(message) {
        let ballAnswer = 'Ты не задал вопрос.';
        if(message.argString !== '') {
            let answerNumber = this.randomInteger(0, this.responses.length - 1);
            ballAnswer = this.responses[answerNumber];
        }
        message.delete();
        const embed = new MessageEmbed()
            .setAuthor('🎱 🎱 🎱 Магический Шар Святогуб 🎱 🎱 🎱')
            .setTitle(message.argString || '')
            .setDescription(message.author.username + ', ' + ballAnswer)
            .setFooter(message.author.username, message.author.displayAvatarURL())
            .setTimestamp()
            .setColor(0x673AB7);
        message.delete();
        return message.say(embed);
    }
};