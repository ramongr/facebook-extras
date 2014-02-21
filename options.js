function getData()
{
	chrome.storage.local.get(null, function(items) {

	    var allKeys = Object.keys(items);

	    var table = "<table id='tb' class='text table table-striped'>";

		table += "<tr>																																																		  <td style='width: 50; text-align: center;'><b> # </b></td>																																					              <td style='width: 350px; text-align: center;'><b> E-Mail </b></td>																													              <td style='width: 200px; text-align: center;'><b> Edição </b></td>																																				  </tr>"

		var index = 1;

		for (var i = 1; i < allKeys.length; i++) 
		{
			var a = allKeys[i].search('id-');
			var b = allKeys[i].search('atv-');
			var c = allKeys[i].search('cor-br-');
			var d = allKeys[i].search('user-actual');
			var e = allKeys[i].search('color-br-actual');
			var f = allKeys[i].search('cor_br_user');
			var g = allKeys[i].search('pat-br-');
			var h = allKeys[i].search('pat-fd-');
			var j = allKeys[i].search('cor-fd-');
			var k = allKeys[i].search('color-fd-actual');
			var l = allKeys[i].search('cor_fd_user');
			var m = allKeys[i].search('link-lt-');
			var n = allKeys[i].search('letra-');
			var o = allKeys[i].search('tam-lt-');
			var p = allKeys[i].search('pin-switch-');
			var q = allKeys[i].search('words-switch-');

			if(a == -1 && b == -1 && c == -1 && d == -1 && e == -1 && f == -1 && g == -1 && h == -1 && j == -1 && k == -1 && l == -1 && m == -1 && n == -1 && o == -1 && p == -1 && q == -1)
			{
				table += "<tr><td style='text-align: center;'>" 																																					              + (index) + 																																														            "</td><td style='text-align: center;'>" 																																                          + allKeys[i] + 																																														        "</td><td style='text-align: center;'>																																                          <button style='margin-right: 10px' id='edit' type='button' data-toggle='tooltip' data-original-title='Editar Código' class='btn info'><span class='glyphicon glyphicon-pencil'></span></button>															<button style='margin-right: 10px' id='remove' type='button' data-toggle='tooltip' data-original-title='Remover Utilizador' class='btn off'><span class='glyphicon glyphicon-remove'></span></button>";

				
				//Se a conta estiver ativada, mostra-se o botão verde "ON" e ao carregar nele a conta fica desativada.

				if(items['atv-'+allKeys[i]] == '0')
				{
					table += "<button style='font-size: 11px' id='on' type='button' data-toggle='tooltip' data-original-title='Desativar Conta' class='text btn on'>ON</button></td></tr>";
				}
				else
				{
					table += "<button style='font-size: 11px' id='off' type='button' data-toggle='tooltip' data-original-title='Ativar Conta' class='text btn off'>OFF</button></td></tr>";
				}

				index++;
			}
		}

		table += "</table>";

		document.getElementById('table-print').innerHTML = table;

		$('button#edit').tooltip('hide');
		$('button#remove').tooltip('hide');
		$('button#on').tooltip('hide');
		$('button#off').tooltip('hide');


		$('button#on').on('click',function(){

			var td = $(this).closest('td').parent()[0];

			var mail = td.getElementsByTagName('td')[1].innerHTML;

			User_OFF(mail);
		});

		$('button#off').on('click',function(){

			var td = $(this).closest('td').parent()[0];

			var mail = td.getElementsByTagName('td')[1].innerHTML;

			User_ON(mail);
		});

		$('button#remove').on('click',function(){

			var td = $(this).closest('td').parent()[0];

			var mail = td.getElementsByTagName('td')[1].innerHTML;

			removeUser(mail);
		});

		$('button#edit').on('click',function(){
			
			var td = $(this).closest('td').parent()[0];

			var mail = td.getElementsByTagName('td')[1].innerHTML;

			editUser(mail);
		});
	});
	
}

function clickHandler(e) 
{
	var flag = 0;
	
	bootbox.confirm("<form role='form'>																																													     	    <div class='title'>																																															       <h3><b>Instruções</b></h3>																																													       </div>																																																		       <br>																																																			       <div class='text'><font color='red'>Para criar um novo utilizador, é <b>obrigatório</b> iniciar previamente a sua sessão no Facebook;</font><br><br>O Email escolhido deve ser <b>obrigatoriamente</b> igual ao Email do Facebook; <br><br>O Código só deve conter números entre <b>0</b> e <b>9</b>;											       </div>																																																		       <br><br>																																																		       <div class='form-group'>																																														       <label class='text' for='Email'><b>Email</b></label>																																							       <br>																																																		       <input style='width: 400px;' type='email' class='form-control' id='Email'>																																							       </div>																																																		       <br>																																																			       <div class='form-group'>																																														       <label class='text' for='Password1'><b>Código</b></label>																																						   <br>																																																			       <input style='width: 400px;' type='password' class='form-control' id='Password1'>																																					       </div> 																																																		       <br>																																																			       <div class='form-group'>																																														       <label class='text' for='Password2'><b>Confirmar Código</b></label>																																			       <br>																																																			       <input style='width: 400px;' type='password' class='form-control' id='Password2'>																																					       </div>																																																		       </form>", function(result) {

		if(result)
		{
			var obj = {};
			var email = $('#Email').val();
			var code = $('#Password1').val();

			//Primeiro vamos verificar se já existe um utilizador registado com o mesmo e-mail

			chrome.storage.local.get(email, function (result) {

				if(_.isEmpty(result) == false)
				{
					bootbox.alert("<br><div class='text'><b>Já existe um utilizador com o mesmo Email registado.</b></div>");
				}
				else
				{
					//Se não houver uma sessão aberta do facebook, é devolvido um erro

					chrome.storage.local.get(['c_user', 'cor_br_user', 'cor_fd_user'], function (result) {

						if(_.isEmpty(result['c_user']) == false)
						{
							//Vamos verificar se existe um utilizador registado com o id da sessão aberta do facebook

							chrome.storage.local.get(null, function(items) {

							    var allKeys = Object.keys(items);

							    for (var i = 1; i < allKeys.length; i++) 
								{
									if(items['id-'+allKeys[i]] == result['c_user'])
									{
										flag = 1;
									}
								}

								if(flag == 0)
								{
									if($('#Password1').val() == $('#Password2').val())
									{	
										obj[email] = CryptoJS.SHA3(code);
										obj['id-'+email] = result['c_user'];
										obj['atv-'+email] = '0';
										obj['cor-br-'+email] = result['cor_br_user'];
										obj['cor-fd-'+email] = result['cor_fd_user'];
										obj['pin-switch-'+email] = 1;
										obj['words-switch-'+email] = 1;

										chrome.storage.local.set(obj);

										bootbox.alert("<br><div class='text'><b>Dados guardados com sucesso.</b></div>");

										chrome.storage.local.remove('c_user', function() {});
										chrome.storage.local.remove('cor_br_user', function() {});
										chrome.storage.local.remove('cor_fd_user', function() {});

										getData();
										getCustomData();
									}
									else
									{
										bootbox.alert("<br><div class='text'><b>Os códigos inseridos não são iguais. <br><br>Tente de novo.</b></div>");
									}
								}
								else
								{
									bootbox.alert("<br><div class='text'><b>Já existe um utilizador registado para a atual sessão aberta do Facebook.</b></div>");
								}
							});
						}
						else
						{
							bootbox.alert("<br><div class='text'><b>Não existe uma sessão aberta do Facebook.<br><br>Inicie a sua sessão e tente de novo.</b></div>");
						}
					});
				}
			});
		}
	});
}

function removeUser(Email)
{
	bootbox.confirm("<div class='text'><b>Por favor introduza o seu código.</b><br><br><br>																																				         <div class='form-group'>																																											             <input style='width: 300px;' type='password' class='form-control' id='Password'>																																	 </div>", function(result) {

		if(result)
		{
			chrome.storage.local.get(Email, function (result) {

				var pass = CryptoJS.SHA3($('#Password').val());

				if(_.isEqual(pass, result[Email]))
				{
					bootbox.confirm("<div class='text'><b>Utilizador prestes a ser removido. <br><br>Deseja continuar?</b></div>", function(result) {

						if(result)
						{
							chrome.storage.local.remove(Email, function() {

								chrome.storage.local.remove('id-'+Email, function() {});

								bootbox.alert("<br><div class='text'><b>Utilizador removido com sucesso</b></div>");

								getData();
							});
						}
					});
				}
				else
				{
					bootbox.alert("<br><div class='text'><b>Introduziu um código errado. <br><br>Tente de novo.</b></div>");
				}
			});
		}
	});
}

function editUser(Email)
{
	bootbox.confirm("<form role='form'>																																																  <div class='text'><font size='3' color='red'><b>Aviso:</b></font> O Código só deve conter números entre <b>0</b> e <b>9</b>.</div>																														          <br>																																																		          <div class='form-group'>																																													          <label class='text' for='old-code'><b>Código Atual</b></label>																																		          <br>																																																		          <input style='width: 300px;' type='password' class='form-control' id='old-code'>																																				          </div>																																																	          <div class='form-group'>																																													          <label class='text' for='Password1'><b>Código</b></label>																																					          <br>																																																		          <input style='width: 300px;' type='password' class='form-control' id='Password1'>																																				          </div> 																																														<div class='form-group'>																																													          <label class='text' for='Password2'><b>Confirmar Código</b></label>																																		          <br>																																																		          <input style='width: 300px;' type='password' class='form-control' id='Password2'>																																				          </div>																																																	          </form>", function (result) {

		if(result)
		{
			chrome.storage.local.get(Email, function (result) {

				var pass = CryptoJS.SHA3($('#old-code').val()); 

				if(_.isEqual(pass, result[Email]))
				{
					if($('#Password1').val() == $('#Password2').val())
					{
						var code = $('#Password1').val();

						var obj = {};

		                obj[Email] = CryptoJS.SHA3(code);

						chrome.storage.local.set(obj);

						bootbox.alert("<br><div class='text'><b>Dados alterados com sucesso.</b></div>");

						getData();
					}
					else
					{
						bootbox.alert("<br><div class='text'><b>Os códigos inseridos não são iguais. <br><br>Tente de novo.</b></div>");
					}
				}
				else
				{
					bootbox.alert("<br><div class='text'><b>O código atual introduzido está errado. <br><br>Tente de novo.</b></div>");
				}
			});
		}
	});	
}

function User_ON(Email)
{
	bootbox.confirm("<form role='form'>																																																  <div class='text'><b>Introduza o seu código.</b></div><br>																																					      <div class='form-group'>																																													          <input style='width: 300px;' type='password' class='form-control' id='Password'>																																	  </div></form>", function (result) {

		if(result)
		{
			chrome.storage.local.get(Email, function (result) {

				var pass = CryptoJS.SHA3($('#Password').val()); 

				if(_.isEqual(pass, result[Email]))
				{
					var obj = {};

				    obj['atv-'+Email] = '0';

					chrome.storage.local.set(obj);

					getData();
				}
				else
				{
					bootbox.alert("<br><div class='text'><b>O código introduzido está errado. <br><br>Tente de novo.</b></div>");
				}
			});
		}
	});
}

function User_OFF(Email)
{
	bootbox.confirm("<form role='form'>																																																  <div class='text'><b>Introduza o seu código.</b></div><br>																																					      <div class='form-group'>																																													          <input style='width: 300px;' type='password' class='form-control' id='Password'>																																	  </div></form>", function (result) {

		if(result)
		{
			chrome.storage.local.get(Email, function (result) {

				var pass = CryptoJS.SHA3($('#Password').val()); 

				if(_.isEqual(pass, result[Email]))
				{
					var obj = {};

				    obj['atv-'+Email] = '1';

					chrome.storage.local.set(obj);

					getData();
				}
				else
				{
					bootbox.alert("<br><div class='text'><b>O código introduzido está errado. <br><br>Tente de novo.</b></div>");
				}
			});
		}
	});
}

function toggleChevron(e) {

    $(e.target)
        .prev('.panel-heading')
        .find("i.indicator")
        .toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
}

$(document).ready(function() {

	$('#cor_barra').hide();
	$('#pat_barra').hide();
	$('#cor_fundo').hide();
	$('#pat_fundo').hide();

	$('#rm-cor-barra').tooltip('hide');
	$('#add-pattern-barra').tooltip('hide');
	$('#rm-pattern-barra').tooltip('hide');
	$('#rm-cor-fundo').tooltip('hide');
	$('#add-pattern-fundo').tooltip('hide');
	$('#rm-pattern-fundo').tooltip('hide');
	$('#add-letra').tooltip('hide');
	$('#rm-letra').tooltip('hide');

	$('#letra-exemplo').hide();

	$('.collapse').collapse();

	$('#accordion').on('hidden.bs.collapse', toggleChevron);
	$('#accordion').on('shown.bs.collapse', toggleChevron);

	$('.nav-tabs a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});

	$('#pin-switch').bootstrapSwitch();
	
	$('#pin-switch').on('switchChange', function (e, data) {

		if(data.value == true)
		{
			var obj = {};

            obj['pin-switch-'+$('#email-actual').text()] = 1;

			chrome.storage.local.set(obj);
		}
		else
		{
			var obj = {};

            obj['pin-switch-'+$('#email-actual').text()] = 0;

			chrome.storage.local.set(obj);
		}
	});

	$('#words-switch').bootstrapSwitch();
	
	$('#words-switch').on('switchChange', function (e, data) {

		if(data.value == true)
		{
			var obj = {};

            obj['words-switch-'+$('#email-actual').text()] = 1;

			chrome.storage.local.set(obj);
		}
		else
		{
			var obj = {};

            obj['words-switch-'+$('#email-actual').text()] = 0;

			chrome.storage.local.set(obj);
		}
	});

	$('#barra-switch').bootstrapSwitch();
	
	$('#barra-switch').on('switchChange', function (e, data) {

		if(data.value == true)
		{
			$('#cor_barra').show();
			$('#pat_barra').hide();
		}
		else
		{
			$('#cor_barra').hide();
			$('#pat_barra').show();
		}
	});

	$('#fundo-switch').bootstrapSwitch();
	
	$('#fundo-switch').on('switchChange', function (e, data) {

		if(data.value == true)
		{
			$('#cor_fundo').show();
			$('#pat_fundo').hide();
		}
		else
		{
			$('#cor_fundo').hide();
			$('#pat_fundo').show();
		}
	});

	var c = document.getElementById("cor-barra-input");

	c.addEventListener("change", function() {

        chrome.storage.local.get(null, function(items) {

		    var allKeys = Object.keys(items);

		    for (var i = 1; i < allKeys.length; i++) 
			{
				if(items['id-'+allKeys[i]] == items['user-actual'])
				{
					var obj = {};

	                obj['cor-br-'+allKeys[i]] = '#'+$('#cor-barra-input').val();

	                obj['pat-br-'+allKeys[i]] = null;

	                $('#fbBar1').css('background-color', '#'+$('#cor-barra-input').val());

	                $('#pattern-barra-input').val('');

					chrome.storage.local.set(obj);
				}
			}
		});

	}, false);

	$('#add-pattern-barra').on('click', function() {

		var obj = {};

		obj['cor-br-'+$('#email-actual').text()] = null;

        obj['pat-br-'+$('#email-actual').text()] = $('#pattern-barra-input').val();

        $('#fbBar2').css('background-image', 'url(' + $('#pattern-barra-input').val() + ')');

		chrome.storage.local.set(obj);

	});

	$('#rm-pattern-barra').on('click', function() {

		var obj = {};

        obj['pat-br-'+$('#email-actual').text()] = null;

        $('#pattern-barra-input').val('');

        $('#fbBar2').css({'background-image': 'none', 'background-color': '#3b5998' });

		chrome.storage.local.set(obj);

	});

	$('#rm-cor-barra').on('click', function() {

		var obj = {};

        obj['cor-br-'+$('#email-actual').text()] = "#3b5998";

        $('#fbBar1').css({'background-image': 'none', 'background-color': '#3b5998'});

        $('#cor-barra-input').val("#3b5998");
        $('#cor-barra-input').css("background-color", "#3b5998");

		chrome.storage.local.set(obj);

	});

	var d = document.getElementById("cor-fundo-input");

	d.addEventListener("change", function() {

		if(d.value)
		{
			chrome.storage.local.get(null, function(items) {

			    var allKeys = Object.keys(items);

			    for (var i = 1; i < allKeys.length; i++) 
				{
					if(items['id-'+allKeys[i]] == items['user-actual'])
					{
						var obj = {};

		                obj['cor-fd-'+allKeys[i]] = '#'+$('#cor-fundo-input').val();

		                obj['pat-fd-'+allKeys[i]] = null;

		                $('#pattern-fundo-input').val('');

						chrome.storage.local.set(obj);
					}
				}
			});
		}

	}, false); 

	$('#add-pattern-fundo').on('click', function() {

		var obj = {};

		obj['cor-fd-'+$('#email-actual').text()] = null;

        obj['pat-fd-'+$('#email-actual').text()] = $('#pattern-fundo-input').val();

		chrome.storage.local.set(obj);

	});

	$('#rm-pattern-fundo').on('click', function() {

		var obj = {};

        obj['pat-fd-'+$('#email-actual').text()] = null;

        $('#pattern-fundo-input').val('');

		chrome.storage.local.set(obj);

	});

	$('#rm-cor-fundo').on('click', function() {

		var obj = {};

        obj['cor-fd-'+$('#email-actual').text()] = "#FFFFFF";

        $('#cor-fundo-input').val("#FFFFFF");
        $('#cor-fundo-input').css("background-color", "#FFFFFF");

		chrome.storage.local.set(obj);

	});

	$('#add-letra').on('click', function() {

		var obj = {};

		switch($('#letras-list').val())
		{
			case '0': obj['link-lt-'+$('#email-actual').text()] = "<link href='https://fonts.googleapis.com/css?family=Armata&subset=latin,latin-ext' rel='stylesheet' type='text/css'>";
					  obj['letra-'+$('#email-actual').text()] = "'Armata', sans-serif";

					  $('#letra-exemplo').show();
					  document.getElementById('letra-exemplo').style.cssText = 'font-family: "Armata, sans-serif"';
					  $('#letra-exemplo').text("Isto é um teste");
					  break; 

			case '1': obj['link-lt-'+$('#email-actual').text()] = "<link href='https://fonts.googleapis.com/css?family=Roboto&subset=latin,latin-ext' rel='stylesheet' type='text/css'>";
					  obj['letra-'+$('#email-actual').text()] = "'Roboto', sans-serif";
					  $('#letra-exemplo').show();
					  document.getElementById('letra-exemplo').style.cssText = 'font-family: "Roboto, sans-serif"';
					  $('#letra-exemplo').text("Isto é um teste");
					  break; 

			case '2': obj['link-lt-'+$('#email-actual').text()] = "<link href='https://fonts.googleapis.com/css?family=Happy+Monkey&subset=latin,latin-ext' rel='stylesheet' type='text/css'>";
					  obj['letra-'+$('#email-actual').text()] = "'Happy Monkey', cursive";

					  $('#letra-exemplo').show();
					  document.getElementById('letra-exemplo').style.cssText = 'font-family: "Happy Monkey, cursive"';
					  $('#letra-exemplo').text("Isto é um teste");
					  break;

			case '3': obj['link-lt-'+$('#email-actual').text()] = "<link href='https://fonts.googleapis.com/css?family=Ledger&subset=latin,latin-ext' rel='stylesheet' type='text/css'>";
					  obj['letra-'+$('#email-actual').text()] = "'Ledger', serif";

					  $('#letra-exemplo').show();
					  document.getElementById('letra-exemplo').style.cssText = 'font-family: "Ledger, serif"';
					  $('#letra-exemplo').text("Isto é um teste");
					  break;

			case '4': obj['link-lt-'+$('#email-actual').text()] = "<link href='https://fonts.googleapis.com/css?family=Capriola&subset=latin,latin-ext' rel='stylesheet' type='text/css'>";
					  obj['letra-'+$('#email-actual').text()] = "'Capriola', sans-serif";

					  $('#letra-exemplo').show();
					  document.getElementById('letra-exemplo').style.cssText = 'font-family: "Capriola, sans-serif"';
					  $('#letra-exemplo').text("Isto é um teste");
					  break;

			case '5': obj['link-lt-'+$('#email-actual').text()] = "<link href='https://fonts.googleapis.com/css?family=Ruda&subset=latin,latin-ext' rel='stylesheet' type='text/css'>";
					  obj['letra-'+$('#email-actual').text()] = "'Ruda', sans-serif";

					  $('#letra-exemplo').show();
					  document.getElementById('letra-exemplo').style.cssText = 'font-family: "Ruda, sans-serif"';
					  $('#letra-exemplo').text("Isto é um teste");
					  break;

			case '6': obj['link-lt-'+$('#email-actual').text()] = "<link href='https://fonts.googleapis.com/css?family=Shadows+Into+Light+Two&subset=latin,latin-ext' rel='stylesheet' type='text/css'>";
					  obj['letra-'+$('#email-actual').text()] = "'Shadows Into Light Two', cursive";

					  $('#letra-exemplo').show();
					  document.getElementById('letra-exemplo').style.cssText = "font-family: 'Shadows Into Light Two', cursive";
					  $('#letra-exemplo').text("Isto é um teste");
					  break;

			case '7': obj['link-lt-'+$('#email-actual').text()] = "<link href='https://fonts.googleapis.com/css?family=Courgette&subset=latin,latin-ext' rel='stylesheet' type='text/css'>";
					  obj['letra-'+$('#email-actual').text()] = "'Courgette', cursive";

					  $('#letra-exemplo').show();
					  document.getElementById('letra-exemplo').style.cssText = 'font-family: "Courgette, cursive"';
					  $('#letra-exemplo').text("Isto é um teste");
					  break;
		}

		switch($('#tam-list').val())
		{
			case '0': obj['tam-lt-'+$('#email-actual').text()] = "10px"; 
					  document.getElementById('letra-exemplo').style.cssText = 'font-size: 10px'; 
					  break;

			case '1': obj['tam-lt-'+$('#email-actual').text()] = "12px"; 
					  document.getElementById('letra-exemplo').style.cssText = 'font-size: 12px'; 
					  break;

			case '2': obj['tam-lt-'+$('#email-actual').text()] = "14px"; 
					  document.getElementById('letra-exemplo').style.cssText = 'font-size: 14px'; 
					  break;

			case '3': obj['tam-lt-'+$('#email-actual').text()] = "16px"; 
					  document.getElementById('letra-exemplo').style.cssText = 'font-size: 16px'; 
					  break;

			case '4': obj['tam-lt-'+$('#email-actual').text()] = "18px"; 
					  document.getElementById('letra-exemplo').style.cssText = 'font-size: 18px';
					  break;

			case '5': obj['tam-lt-'+$('#email-actual').text()] = "20px"; 
					  document.getElementById('letra-exemplo').style.cssText = 'font-size: 20px';
					  break;

			case '6': obj['tam-lt-'+$('#email-actual').text()] = "22px"; 
					  document.getElementById('letra-exemplo').style.cssText = 'font-size: 22px'; 
					  break;

			case '7': obj['tam-lt-'+$('#email-actual').text()] = "24px"; 
					  document.getElementById('letra-exemplo').style.cssText = 'font-size: 24px';
					  break;

			case '8': obj['tam-lt-'+$('#email-actual').text()] = "28px"; 
					  document.getElementById('letra-exemplo').style.cssText = 'font-size: 28px';
					  break;

			case '9': obj['tam-lt-'+$('#email-actual').text()] = "32px"; 
					  document.getElementById('letra-exemplo').style.cssText = 'font-size: 32px'; 
					  break;
		}  

		chrome.storage.local.set(obj);
	});

	$('#rm-letra').on('click', function() {

		$('#letras-list').val('-1');

		$('#tam-list').val('-1');

		var obj = {};

		obj['letra-'+$('#email-actual').text()] = "'lucida grande',tahoma,verdana,arial,sans-serif";
		obj['tam-lt-'+$('#email-actual').text()] = "11px";

		chrome.storage.local.set(obj);
	});
});


function getCustomData()
{
	chrome.storage.local.get(null, function(items) {

	    var allKeys = Object.keys(items);

	    for (var i = 1; i < allKeys.length; i++) 
		{
			if(items['id-'+allKeys[i]] == items['user-actual'])
			{
				$('span#email-actual').text(allKeys[i]);

				if(items['cor-br-'+allKeys[i]])
				{
					$('#cor-barra-input').val(items['cor-br-'+allKeys[i]]);
					$('#cor-barra-input').css("background-color", items['cor-br-'+allKeys[i]]);

					$('#fbBar1').css({'background-image': 'none', 'background-color': items['cor-br-'+allKeys[i]]});
				}
				else
				{
					$('#cor-barra-input').val("#3b5998");
					$('#cor-barra-input').css("background-color", "#3b5998");

					$('#fbBar1').css({'background-image': 'none', 'background-color': "#3b5998"});
				}
				
				if(items['pat-br-'+allKeys[i]])
				{
					$('#pattern-barra-input').val(items['pat-br-'+allKeys[i]]);

					$('#fbBar2').css('background-image', 'url(' + items['pat-br-'+allKeys[i]] + ')');
				}
				else
				{
					$('#pattern-barra-input').val('');

					$('#fbBar2').css({'background-image': 'none', 'background-color': "#3b5998"});
				}
				
				if(items['cor-fd-'+allKeys[i]])
				{
					$('#cor-fundo-input').val(items['cor-fd-'+allKeys[i]]);
					$('#cor-fundo-input').css('background-color', items['cor-fd-'+allKeys[i]]);
				}
				else
				{
					$('#cor-fundo-input').val("#FFFFFF");
					$('#cor-fundo-input').css('background-color', "#FFFFFF");
				}
				
				if(items['pat-fd-'+allKeys[i]])
				{
					$('#pattern-fundo-input').val(items['pat-fd-'+allKeys[i]]);
				}
				else
				{
					$('#pattern-fundo-input').val('');
				}
				
				switch(items['letra-'+allKeys[i]])
				{
					case "'Armata', sans-serif": $('#letras-list').val('0'); break;

					case "'Roboto', sans-serif": $('#letras-list').val('1'); break;

					case "'Happy Monkey', cursive": $('#letras-list').val('2'); break;

					case "'Ledger', serif": $('#letras-list').val('3'); break;

					case "'Capriola', sans-serif": $('#letras-list').val('4'); break;

					case "'Ruda', sans-serif": $('#letras-list').val('5'); break;

					case "'Shadows Into Light Two', cursive": $('#letras-list').val('6'); break;

					case "'Courgette', cursive": $('#letras-list').val('7'); break;
				}

				switch(items['tam-lt-'+allKeys[i]])
				{
					case '10px': $('#tam-list').val('0'); break;

					case '12px': $('#tam-list').val('1'); break;

					case '14px': $('#tam-list').val('2'); break;

					case '16px': $('#tam-list').val('3'); break;

					case '18px': $('#tam-list').val('4'); break;

					case '20px': $('#tam-list').val('5'); break;

					case '22px': $('#tam-list').val('6'); break;

					case '24px': $('#tam-list').val('7'); break;

					case '28px': $('#tam-list').val('8'); break;

					case '32px': $('#tam-list').val('9'); break;
				}

				switch(items['pin-switch-'+allKeys[i]])
				{
					case 0: $('#pin-switch').bootstrapSwitch('state', false); break;

					case 1: $('#pin-switch').bootstrapSwitch('state', true); break;
				}

				switch(items['words-switch-'+allKeys[i]])
				{
					case 0: $('#words-switch').bootstrapSwitch('state', false); break;

					case 1: $('#words-switch').bootstrapSwitch('state', true); break;
				}
			}
		}
	});
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('button').addEventListener('click', clickHandler);
  getData();
  getCustomData();
});
	
