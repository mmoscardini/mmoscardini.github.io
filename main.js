$(document).ready(function(){
	//Definindo variaveis do canvas
	var canvas = $("#canvas"); 		//pega o canvas pelo ID
	canvas = canvas[0];				//seleciona o canvas em si, porque usando Jquery da problema
	if (canvas.getContext) {
       	var ctx = canvas.getContext("2d");	//pega o contexto se for possivel
   	}

   	var tone = require('tone');

   	//create a synth and connect it to the master output (your speakers)
	var synth = new tone.Synth({
		"oscillator": {
	        "type": "triangle",
            //"modulationFrequency": 0.2
        },
        "envelope": {
            "attack": 0.02,
            "decay": 0.5,
            "sustain": 0.2,
            "release": 1,
        }
	}).toMaster();

	function Start(){
		//define tamanho do canvas = tamanho da tela
		ctx.canvas.width = window.innerWidth;
		ctx.canvas.height = window.innerHeight;

		

		//Desenhar circulos no click
		canvas.addEventListener('mousedown', function (event){
			var mouseX = event.offsetX;
			var mouseY = event.offsetY;
			var mousePos = [mouseX, mouseY];

			//Play sounds
			playSound(mouseX, mouseY);

			//Retorna um numero aleatório entre min e max
	  		function getRandomArbitrary(min, max) {
			    return Math.random() * (max - min) + min;
			}
			//Variaveis

			var multiplay = getRandomArbitrary(1,1.5); //Multiplicador de tamanho
			var raio = 3; //raio inicial do circulo
			var delay = 0; //delay entre animaçoes
			var scaleRatio = 2; //ratio que os circulos aumentam
			var eraseOffset = 5; //tamanho inicial do quadrado que apaga os circulos
			
			/*
			var color = {r: 0,g:0,b:0};
			color.r = Math.floor(Math.random()*255); //cores aleatorias
			color.g = Math.floor(Math.random()*255);
			color.b = Math.floor(Math.random()*255);
			*/

			var color = setColor(mouseX, mouseY);

			//desenha o primeiro circulo
			ctx.strokeStyle = 'rgba('+color.r+','+color.g+','+color.b+',1)';
			ctx.beginPath();
    		ctx.arc(mouseX, mouseY, raio, 0 , 2*Math.PI, false);
    		ctx.stroke ();
			
    		//for que roda 35 x redesenhando o circulo cada vez maior
    		for (var i = 0; i<=35; i++){
    			delay += 50;	//delay entre cada desenho
				var transparency = 0.9;	//transparencia do ciruclo

				//função que desenha os novos circulos com um delay de 50ms entre cada uma
				var timer = setTimeout(function(){
			   		ctx.save();	//salva a versão atual do canvas
	   				ctx.clearRect(mouseX-eraseOffset, mouseY-eraseOffset,eraseOffset*2,eraseOffset*2); //apaga o que esta em volta do mouse
	   				ctx.strokeStyle = 'rgba('+color.r+','+color.g+','+color.b+','+transparency+')'; //define cor e transparencia desse desenho
	 		  		ctx.beginPath(); //inicia desenho do circulo
	 		  		ctx.fillStyle = "rgb(220,220,220)"; //cor do fundo
					ctx.fillRect (mouseX-eraseOffset, mouseY-eraseOffset,eraseOffset*2+1,eraseOffset*2+1); //repinta o fundo
					ctx.scale(scaleRatio, scaleRatio); //aumenta o tamanho do circulo
			   		ctx.arc(mouseX/scaleRatio, mouseY/scaleRatio, raio, 0 , 2*Math.PI, false); //desenha o circulo
			   		ctx.stroke (); //efetiva o desenho
	 		  		ctx.restore();	//restora versão salva

	 		  		//aumento das variaveis para proximo ciclo
	 		  		raio += 0.4*multiplay;
	 		  		scaleRatio += 0.08*multiplay;
	 		  		eraseOffset += 2*multiplay;
	 		  		transparency -= 0.04;	 		  		
				},delay);
			}	
		}, false);

		//Chama função para desenhar coisas na tela
		DrawBackground();
		MainLoop();
	}
	Start();

	function MainLoop(){
		DrawGrid();
		requestAnimationFrame(MainLoop);
	};

	function DrawGrid(delay){
		ctx.beginPath();
		ctx.moveTo(window.innerWidth/3, 0);
		ctx.lineTo(window.innerWidth/3,window.innerHeight);
		ctx.moveTo(2* window.innerWidth/3, 0);
		ctx.lineTo(2* window.innerWidth/3,window.innerHeight);
		ctx.moveTo(0, window.innerHeight/3);
		ctx.lineTo(window.innerWidth, window.innerHeight/3);
		ctx.moveTo(0, 2* window.innerHeight/3);
		ctx.lineTo(window.innerWidth, 2* window.innerHeight/3);		

		ctx.stroke();
	}

	function DrawBackground(){
		//background
		ctx.fillStyle = "rgb(220,220,220)";
		ctx.fillRect (0,0,window.innerWidth,window.innerHeight);


		
	}

	function playSound(x, y){
		var noteFrequency = Math.floor((x+y)*0.1)*5;
		synth.triggerAttackRelease(noteFrequency,0.175);

		console.log ('x: '+x+'/ y:' +y);
		//console.log(noteFrequency);
		//console.log ('x: '+ x/window.innerWidth + '/ y: '+y/window.innerHeight);

	}

	function setColor (x, y){
		var tercoX = window.innerWidth / 3;
		var doisTercosX = 2*window.innerWidth/3
		var tercoY = window.innerHeight/3;
		var doisTercosY = 2*window.innerHeight/3;

		//window.innerWidth
		if (x < tercoX && y < tercoY){
			//azul
			r = 0;
			g = 50;
			b = 200;
			console.log('supe');
			return {r,g,b};
			
		}
		//superior central
		if (tercoX <= x && x < doisTercosX && y < tercoY){
			//azul
			r = 50;
			g = 100;
			b = 250;
			return {r,g,b};
			console.log('supe');
		}
		//superior direito
		if (doisTercosX <= x && y < tercoY){
			//azul
			r = 100;
			g = 200;
			b = 255;
			return {r,g,b};
		}
		//cental esquerdo
		if (x < tercoX && tercoY <= y && y <  doisTercosY){
			//verde
			r = 0;
			g = 200;
			b = 50;
			return {r,g,b};
		}
		//central centro
		if (tercoX <= x && x < doisTercosX && tercoY <= y && y <  doisTercosY){
			//verde
			r = 50;
			g = 255;
			b = 100;
			return {r,g,b};
		}
		//central direito
		if (doisTercosX <= x && tercoY <= y && y <  doisTercosY){
			//verde
			r = 100;
			g = 255;
			b = 150;
			return {r,g,b};
		}
		//inferior esquerdo
		if (x < tercoX &&  y >=  doisTercosY){
			//vermeho
			r = 200;
			g = 0;
			b = 0;
			return {r,g,b};
		}
		//inferior centro
		if (tercoX <= x && x < doisTercosX && y >=  doisTercosY){
			//vermeho
			r = 255;
			g = 50;
			b = 100;
			return {r,g,b};
		}
		//inferior direita
		if (doisTercosX <= x &&  y >=  doisTercosY){
			//vermeho
			r = 255;
			g = 100;
			b = 150;
			return {r,g,b};
		}
		else{
			r = 0;
			g = 0;
			b = 0;
			return {r,g,b};
		}
				
	}

	/*proximas etapas:
		- criar um campo na interface para que a pessoa poss alerar e formula da noteFrequency (func playSound)
		- criar campo que mostra os valores de X e de Y ao mover o mouse
		- adicionar botao para alterar o ocilator type
	*/
});