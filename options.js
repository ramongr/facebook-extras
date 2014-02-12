function getData()
{
	chrome.storage.local.get(null, function(items) {

	    var allKeys = Object.keys(items);

	    var table = "<table id='tb' class='text table table-striped'>";

		table += "<tr>																																																		  <td style='text-align: center;'><b> # </b></td>																																					              <td style='text-align: center;'><b> E-Mail </b></td>																													              <td style='text-align: center;'><b> Edição </b></td>																																				  </tr>"
		var index = 1;

		for (var i = 1; i < allKeys.length; i++) 
		{
			var n = allKeys[i].search('id-');
			var m = allKeys[i].search('atv-');
			var p = allKeys[i].search('cor-');
			var q = allKeys[i].search('user-actual');
			var r = allKeys[i].search('color-actual');
			var s = allKeys[i].search('cor_user');

			if(n == -1 && m == -1 && p == -1 && q == -1 && r == -1 && s == -1)
			{
				table += "<tr><td style='text-align: center;'>" 																																					              + (index) + 																																														            "</td><td style='text-align: center;'>" 																																                          + allKeys[i] + 																																														        "</td><td style='text-align: center;'>																																                          <button style='margin-right: 10px;' id='edit' type='button' data-toggle='tooltip' data-original-title='Editar Código' class='btn btn-warning'><span class='glyphicon glyphicon-pencil'></span></button>															<button style='margin-right: 10px;' id='remove' type='button' data-toggle='tooltip' data-original-title='Remover Utilizador' class='btn btn-danger'><span class='glyphicon glyphicon-remove'></span></button>";

				
				//Se a conta estiver ativada, mostra-se o botão verde "ON" e ao carregar nele a conta fica desativada.

				if(items['atv-'+allKeys[i]] == '0')
				{
					table += "<button style='font-size:11px' id='on' type='button' data-toggle='tooltip' data-original-title='Desativar Conta' class='text btn btn-success'>ON</button></td></tr>";
				}
				else
				{
					table += "<button style='font-size:11px' id='off' type='button' data-toggle='tooltip' data-original-title='Ativar Conta' class='text btn btn-danger'>OFF</button></td></tr>";
				}

				index++;
			}
		}

		table += "</table>";

		document.getElementById('table-print').innerHTML = table;

		//$('button#new-code').tooltip('hide');
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

		/*$('button#new-code').on('click',function(){
			
			var td = $(this).closest('td').parent()[0];

			var mail = td.getElementsByTagName('td')[1].innerHTML;

			recoverCode(mail);
		});*/
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

					chrome.storage.local.get(['c_user', 'cor_user'], function (result) {

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
										obj['cor-'+email] = result['cor_user'];

										chrome.storage.local.set(obj);

										bootbox.alert("<br><div class='text'><b>Dados guardados com sucesso.</b></div>");

										chrome.storage.local.remove('c_user', function() {});
										chrome.storage.local.remove('cor_user', function() {});

										getData();
										getCor();
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

/*function sendMail(Email, Code) 
{
	var param = {
            "email": Email,
            "code": Code
    };

    $.ajax({
        url: 'http://megajpc.net23.net/Email.php',
        data: param,
        type: 'POST',
        success: function (data) {}
    });
}

function recoverCode(Email)
{
	//bootbox.confirm("<div class='text'><b>Caso não se recorde do seu código, é possível receber um novo através do E-mail registado.<br><br>Deseja continuar?</b></div>", function(result) {

		var code = Math.floor((Math.random()*1000000)+1);

		var obj = {};

        obj[Email] = CryptoJS.SHA3(code.toString());

		//chrome.storage.local.set(obj);

		//sendMail(Email, code);

		//bootbox.alert("<br><div class='text'><b></b></div>");
	//});
}*/

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


//Funções para testes

/*function setData()
{
	chrome.storage.local.set({'megajpc': '123'});
	chrome.storage.local.set({'ramon': '456'});
	chrome.storage.local.set({'sandra': '789'});
	chrome.storage.local.set({'sofia': '0'});
}

function returnData(Email)
{
	chrome.storage.local.get(Email, function (result) {

		console.log(Email, result[Email]);
	});
}

function getAll()
{
	chrome.storage.local.get(null, function(items) {

	    var allKeys = Object.keys(items);

	    for (var i = 0; i < allKeys.length; i++) 
		{
			console.log(i + ", " + allKeys[i] + ", " + items[allKeys[i]] + ", " + items['id-'+allKeys[i]] + ", " + items['atv-'+allKeys[i]]);
		}

	});
}

function teste()
{
	var a = CryptoJS.SHA3('123');
	var b = CryptoJS.SHA3('456');
	var c = CryptoJS.SHA3('123');

	console.log(_.isEqual(a, b));
	console.log(_.isEqual(a, c));
}*/

$(document).ready(function(){

	$('.nav-tabs a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});

	var c = document.getElementById("cor-input");

	c.addEventListener("input", function() {

		if(c.value)
		{
			chrome.storage.local.get(null, function(items) {

			    var allKeys = Object.keys(items);

			    for (var i = 1; i < allKeys.length; i++) 
				{
					if(items['id-'+allKeys[i]] == items['user-actual'])
					{
						var obj = {};

		                obj['cor-'+allKeys[i]] = $('#cor-input').val();

						chrome.storage.local.set(obj);
					}
				}
			});
		}

	}, false); 
});


function getCor()
{
	chrome.storage.local.get(null, function(items) {

	    var allKeys = Object.keys(items);

	    for (var i = 1; i < allKeys.length; i++) 
		{
			if(items['id-'+allKeys[i]] == items['user-actual'])
			{
				$('#email-actual').text(allKeys[i]);
				$('#cor-input').val(items['cor-'+allKeys[i]]);
			}
		}
	});
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('button').addEventListener('click', clickHandler);
  getData();
  getCor();
  //getAll();
});
	
