<?
if(!empty($_GET)) extract($_GET);
if(!empty($_POST)) extract($_POST);

include("header1.shtml");
 

$no_text="Вы забыли написать сообщение";
$no_email="Вы указали неверный E-mail адрес!";
$no_name="Укажите Ваше имя";

$result=1;

if ($text==""){
$result=0;
$error2="<li>$no_text</li>";
}

if (!eregi("^.+@.+\\..+$",$email)){
$error3="<li>$no_email</li>";
$result=0;
}

if ($username==""){
$result=0;
$error4="<li>$no_theme</li>";
}



if ($result==1){
//$item1 = convert_cyr_string($item,"k","w"); 
$headers="Content-Type: text/html; charset=koi8-r\n";
$headers.="From: $username<$email>";
// Prepare text
// 40 simbols in line

//end Prepare text
if (mail("alexevl@csa.ru", "$item", "$text", "$headers"))
{
echo ("

<FONT class=f>
<br>
<table width=600>
<tr>
<td>&nbsp;</td>
<td> 
<FONT class=f>
Ваше письмо успешно послано! Ждите ответа.
<br><br><br><br><br><br><br><br><br>
</FONT>
</td></tr></table>
</FONT>
");

}
}

if ($result!=1){
echo ("

<FONT class=f>
<br>
<table width=600>
<tr>
<td>&nbsp;</td>
<td> 

$error1$error2$error3$error4


<p>
<FONT class=f>

<FORM name=MyForm action=sent.php method=post onsubmit=\"return sendform();\">

    Ваше имя: <input type=\"text\" name=\"username\" value=\"$username\"><p>
    Ваш адрес e-mail: <input type=\"text\" name=\"email\" value=\"$email\"><p>
    Тема письма: <input type=\"text\" name=\"item\" size=40 value=\"$item\">
<p>
    Текст письма: <br><textarea name=\"text\" rows=10 cols=40 >$text</textarea><p>
       
    <input type=\"submit\" value = \"Послать\" style=\"color: blue\">

</FORM>
<FORM name=MyForm1 action=\"return.php\" method=\"post\">
<input type=\"submit\" value = \"Отмена\">
</FORM>
</td></tr></table>
</FONT>

");

}

include("footer.shtml");

?>
