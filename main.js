$(document).ready(function() 
{
  	var x, flag = 0, codigo = null, atv, cor_br = null, pat_br = null, link_lt = null, letra = null, tam_lt = null, cor_fd = null, pat_fd = null, pin = null;

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

    var obj = {};

    obj['user-actual'] = id;
    obj['color-br-actual'] = rgb2hex($('#blueBar.fixed_elem').css('background-color'));
    obj['color-fd-actual'] = rgb2hex($('body').css('background-color'));

	chrome.storage.local.set(obj);


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
			if(atv == 0)
			{
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

				if(link_lt != null)
				{
					$('head').append(link_lt);

					$('body').css('font-family', letra);

					$('body').css('font-size', tam_lt);
				}

				if(pin == 1)
				{
					// Se o código for diferente de 0 significa que o utilizador está registado e como tal aparece a janela para introduzir o código

					if(_.isEmpty(codigo) == false)
					{
						$('._42ft.selected')
							.attr('type', 'button')
							.on('click',function() {

								code_input();

						});
					}
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