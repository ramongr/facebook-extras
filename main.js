$(document).ready(function() 
{
  	var x, flag = 0, codigo = null, atv, cor_br = null, pat_br = null, link_lt = null, letra = null, tam_lt = null, cor_fd = null, pat_fd = null, pin = null, words = null;

  	//Obter o id de utilizador através do cookie

	var cookie = "c_user=";
    var ca = document.cookie.split(';');
    var id;

    for(var i=0; i < ca.length; i++) 
    {
        var c = ca[i];

        while (c.charAt(0)==' ') 
        	c = c.substring(1,c.length);

        if (c.indexOf(cookie) == 0) 
        	id = c.substring(cookie.length,c.length);
    }

    //Grava os detalhes sobre o utilizador actual do facebook

    var obj = {};

    obj['user-actual'] = id;
    obj['color-br-actual'] = rgb2hex($('#blueBar.fixed_elem').css('background-color'));
    obj['color-fd-actual'] = rgb2hex($('body').css('background-color'));

	chrome.storage.local.set(obj);

	//Função para obter um hash code de uma string

	String.prototype.hashCode = function() {

	    if (Array.prototype.reduce)
	    {
	        return this.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
	    } 

	    var hash = 0;

	    if (this.length === 0) 
	    	return hash;

	    for (var i = 0; i < this.length; i++) 
	    {
	        var character  = this.charCodeAt(i);

	        hash  = ((hash<<5)-hash)+character;
	        hash = hash & hash; // Convert to 32bit integer
	    }
	    
	    return hash;
	}

	//Array com as palavras banidas

	ban_words = new Array();

	ban_words[("teste").hashCode()] = "teste";
	ban_words[("adeus").hashCode()] = "adeus";


	//Função que cria a janela para a introdução do código do utilizador

    function code_input()
    {
    	if(flag == 0)
		{
			bootbox.confirm("<div style='text-align:center'>                                                                                                                                                                  <h3 class='title'><b>Insira o código</b></h3>                                                                                                                                                                 <br><br>																																																	  <input id='code' type='password' class='input form-control'>																																				    <br><br>																																																      <button id='num' value='1' type='button' class='buttons-left-middle btn btn-default'> 1 </button>																											    <button id='num' value='2' type='button' class='buttons-left-middle btn btn-default'> 2 </button>																									          <button id='num' value='3' type='button' class='buttons-right btn btn-default'> 3 </button>																													<br><br>																																																	  <button id='num' value='4' type='button' class='buttons-left-middle btn btn-default'> 4 </button>																											    <button id='num' value='5' type='button' class='buttons-left-middle btn btn-default'> 5 </button>																										      <button id='num' value='6' type='button' class='buttons-right btn btn-default'> 6 </button>																													<br><br>																																																      <button id='num' value='7' type='button' class='buttons-left-middle btn btn-default'> 7 </button>																								                <button id='num' value='8' type='button' class='buttons-left-middle btn btn-default'> 8 </button>																						                      <button id='num' value='9' type='button' class='buttons-right btn btn-default'> 9 </button>																												    <br><br>																																																      <button id='num' value='0' type='button' class='buttons-right btn btn-default'> 0 </button>																													</div>", function(result) {

				
				if(result)
				{
					if(_.isEqual(codigo, CryptoJS.SHA3($('#code').val())))
					{
						flag = 1;

						$('._42ft.selected')
							.attr('type', 'submit')
							.trigger('click')
							.attr('type', 'button');
					}
					else
					{
						bootbox.alert("<br><div style='text-align:center' class='title'><h3><b>Código errado</b></h3></div>");
					}
				}
			});

			$('button#num').on('click',function(){
				x = $('#code').val();
				$('#code').val(x+$(this).val());
			});
		}
		else
		{
			flag = 0;
		}
    }

	//Vamos obter todos os users guardados e comparar o seu id com o id da sessão actual. Se não existir vamos guardar o id através do chrome storage para a possibilidade ser criada uma nova conta com esse id

	chrome.storage.local.get(null, function(items) {

	    var allKeys = Object.keys(items);

	    for (var i = 1; i < allKeys.length; i++) 
		{
			if(items['id-'+allKeys[i]] == id)
			{
				codigo = _.cloneDeep(items[allKeys[i]]);

				atv = items['atv-'+allKeys[i]];

				cor_br = items['cor-br-'+allKeys[i]];
				pat_br = items['pat-br-'+allKeys[i]];

				cor_fd = items['cor-fd-'+allKeys[i]];
				pat_fd = items['pat-fd-'+allKeys[i]];

				link_lt = items['link-lt-'+allKeys[i]];
				letra = items['letra-'+allKeys[i]];
				tam_lt = items['tam-lt-'+allKeys[i]];

				pin = items['pin-switch-'+allKeys[i]];

				words = items['words-switch-'+allKeys[i]];
			}
		}

		//Se não existir um código, não existe nenhuma conta para o utilizador atual. Vamos guardar o seu id para o caso de o utilizador querer criar uma conta.

		if(_.isEmpty(codigo) == true)
		{
			var obj = {};

		    obj['c_user'] = id;
		    obj['cor_br_user'] = rgb2hex($('#blueBar.fixed_elem').css('background-color'));
		    obj['cor_fd_user'] = rgb2hex($('body').css('background-color'));

			chrome.storage.local.set(obj);
		}
		else
		{
			//Se a conta estiver activa, então vamos carregar todos os detalhes da conta do utilizador

			if(atv == 0)
			{
				//Verificar se existe uma nova cor ou uma imagem para a barra de topo do facebook

				if(cor_br != null)
				{
					$('#blueBar.fixed_elem').css({
						'background-image': 'none',
						'background-color': cor_br
					});
				}
				else
				{
					if(pat_br != null)
					{
						$('#blueBar.fixed_elem').css('background-image', 'url(' + pat_br + ')');
					}
				}

				//Verificar se existe uma nova cor ou uma imagem para o fundo do facebook

				if(cor_fd != null)
				{
					$('body').css({
						'background-image': 'none',
						'background-color': cor_fd
					});

					$('#leftCol').css({
						'background-image': 'none',
						'background-color': 'white'
					});
				}
				else
				{
					if(pat_fd != null)
					{
						$('body').css('background-image', 'url(' + pat_fd + ')');

						$('#leftCol').css('background-color', 'white');
					}
				}

				//Verificar se existe um novo tipo de letra para o facebook

				if(link_lt != null)
				{
					$('head').append(link_lt);

					$('body').css('font-family', letra);

					$('body').css('font-size', tam_lt);
				}

				//Verificar se o utilizador escolheu a opção de pedir sempre o código

				if(pin == 1)
				{
					$('._42ft.selected')
						.attr('type', 'button')
						.on('click',function() {

							//Verificar se o utilizador escolheu a opção para proibir certas palavras na publicação de textos

							if(words == 1)
							{	
								var text = $('#u_0_1i').val();

								var res = text.split(" ");

								banned = new Array();
								var j = 0;

								for(var i = 0; i < res.length; i++)
								{
									var hash = res[i].hashCode();

									if(ban_words[hash])
									{
										banned[j] = ban_words[hash];
										j++;
									}
								}

								//Se existir alguma palavra proibida na publicação, o utilizador é aviso para as remover

								if(_.isEmpty(banned) == false)
								{
									bootbox.alert("<div><b style='font-size: 12px'>Não é possível publicar o texto inserido.</b><br><br>Para proceder deve apagar as seguintes palavras da sua publicação: <br><br><span id='ban'></span></div>").find('.modal-content').css("width", "400px");
									
									$('#ban').text(banned);
								}
								else
								{
									code_input();
								}
							}
							else
							{
								code_input();
							}
					});
				}
			}
		}
	});

	//Código para tratar das cores

	function rgb2hex(rgb){
		 rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		 return "#" +
		  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
		  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
		  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2);
	}

    
});