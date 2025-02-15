export default class mainMenu extends Phaser.Scene{
    constructor(){
        super('mainMenu')
    }
    
    preload(){
        //loads html elements
        this.load.html("leaderboard", '/templates/leaderboard.html')

        //Loads images + Other Assets
        this.load.image("background", "/static/Assets/Menu Assets/Transparent/water.png")
        
        this.load.image("title", '/static/Assets/Menu Assets/Transparent/Title_Transparent.png')

        this.load.image("play", '/static/Assets/Menu Assets/Transparent/Play_Transparent.png')

        this.load.image("quit", '/static/Assets/Menu Assets/Transparent/Quit_Transparent.png')

        this.load.image("leaderboard", '/static/Assets/Menu Assets/Transparent/leaderboard_Transparent.png')

        this.load.atlas('Main Niko', '/static/Assets/Character_Sprites/Blue Niko/idle_spritesheet.png', '/static/Assets/Character_Sprites/Blue Niko/idle_spritesheet.json')

        this.load.audio("CaveStory01_music", "/static/Assets/Menu Assets/music/CaveStory-01.mp3")

        //Creates the Loading Bar
        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff
            }
        })

        this.load.on("progress", (percent)=>{
            loadingBar.fillRect(0, this.game.renderer.height/2, this.game.renderer.width * percent, 50);
            console.log(percent);
        })

        this.load.on("complete", ()=>{
            console.log("Completeed Load")
        })
        console.log(this.registry.get('username'))
    }

    create(){
        //Creates all the images
        this.add.image(this.game.renderer.width/1.25 ,this.game.renderer.height/1.5 , "background").setScale(0.75,0.75)
        this.add.image(this.game.renderer.width/2 ,this.game.renderer.height/6, "title").setScale(0.60,0.60)
        let playButton = this.add.image(this.game.renderer.width/4 ,this.game.renderer.height/3, "play").setScale(0.60,0.60)
        let leadButton = this.add.image(this.game.renderer.width/4 ,this.game.renderer.height/2, "leaderboard").setScale(0.30,0.30)
        let quit = this.add.image(this.game.renderer.width/5.8 ,this.game.renderer.height/1.6, "quit").setScale(0.35,0.35)
    
        //Music - From Cave Story (Im a nerd)
        this.sound.play("CaveStory01_music", {
            loop: true
        })

        //Settings for our Hover Sprite
        let hoverSp = this.add.sprite(0, 0, "Main Niko")
        hoverSp.setVisible(false)

        this.anims.create({
            key: "idle",
            frameRate: 6,
            repeat: -1,
            frames: this.anims.generateFrameNames("Main Niko", {start: 1, end: 3, prefix: "Blue_Niko (", suffix: ").png"})
        })

        //Sets Animations for Hovering and onClick events
        //  PlayButton Events
        playButton.setInteractive();
        playButton.on("pointerover", ()=>{
            hoverSp.setVisible(true)
            hoverSp.play("idle")
            hoverSp.x = 25
            hoverSp.y = playButton.y
        })
        playButton.on("pointerout", ()=>{
            hoverSp.setVisible(false)
        })
        playButton.on("pointerup", ()=>{
            console.log("Play Button Clicked")
            this.scene.start('levelSelect')
            this.game.sound.stopAll();
            this.scene.stop('mainMenu')
        })

        //  Leaderboard Button Events
        leadButton.setInteractive();
        leadButton.on("pointerover", ()=>{
            hoverSp.setVisible(true)
            hoverSp.play("idle")
            hoverSp.x = 25
            hoverSp.y = leadButton.y
        })
        leadButton.on("pointerout", ()=>{
            hoverSp.setVisible(false)
        })
        leadButton.on("pointerup", ()=>{
            console.log("Leaderboard Button Clicked")
            this.onLeaderboardPressed()
        })

        //  Quit Button Events
        quit.setInteractive();
        quit.on("pointerover", ()=>{
            hoverSp.setVisible(true)
            hoverSp.play("idle")
            hoverSp.x = 25
            hoverSp.y = quit.y
        })
        quit.on("pointerout", ()=>{
            hoverSp.setVisible(false)
        })
    }

    onLeaderboardPressed(){
        let leaderboard = this.add.dom(this.game.renderer.width/2, this.game.renderer.height/2).createFromCache("leaderboard")
        fetch('/api/leaderboard', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const leaderboardTable = document.getElementById("leaderboard");
            
            if(data.error === 'Empty leaderboard'){
                console.log("NO LEADERBOARD LOL")
                for (let i = 0; i < 6; i++) {
                    if(i === 0){
                        const row = leaderboardTable.insertRow(0);
                        const rank = row.insertCell(0);
                        const username = row.insertCell(1);
                        const score = row.insertCell(2);
                        rank.textContent = "Rank";
                        username.textContent = "Name";
                        score.textContent = "Time";
                    } else{
                        const row = leaderboardTable.insertRow(i);
                        const rank = row.insertCell(0);
                        const username = row.insertCell(1);
                        const score = row.insertCell(2);
                        rank.textContent = i;
                        username.textContent = "N/A";
                        score.textContent = 0;
                    }
                }
            }else{
                for(let i = 0; i < 1; i++){
                    row = leaderboardTable.insertRow(0);
                    rank = row.insertCell(0);
                    username = row.insertCell(1);
                    score = row.insertCell(2);
                    rank.textContent = "Rank";
                    username.textContent = "Name";
                    score.textContent = "Time";
                }
                data.forEach((entry, index) => {
                    const row = leaderboardTable.insertRow(index + 1);
                    const rank = row.insertCell(0);
                    const username = row.insertCell(1);
                    const score = row.insertCell(2);
                    rank.textContent = entry.rank;
                    username.textContent = entry.username;
                    score.textContent = entry.score;
                });
            }
        })
        leaderboard.addListener('click');
        var self = this;
        leaderboard.on('click', function (event)
        {
            if (event.target.name === 'close-button')
            {
                console.log("close button clicked")
                leaderboard.destroy();
            }
        })
    }
}