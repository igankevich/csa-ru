<?

$mysql_login='telemed';     
$mysql_host='localhost';       
$mysql_pass='4ddykTNZ9B';       
$mysql_db='telemed';

$no_text="Вы забыли написать сообщение";
$no_email="Вы указали неверный E-mail адрес!";
$no_theme="Укажите тему";
$no_name="Укажите Ваше имя";

$error2="";
$error3="";
$error4="";
$error5="";

$result=1;

if ($text==""){
$result=0;
$error2="<li>$no_text</li>";
}

if (!eregi("^.+@.+\\..+$",$email)){
$error3="<li>$no_email</li>";
$result=0;
}

if ($name==""){
$result=0;
$error4="<li>$no_theme</li>";
}

if ($theme==""){
$result=0;
$error5="<li>$no_theme</li>";
}

if ($result==1)
{
////////////////////// Удачно /////////////////////////////

if(!@mysql_connect($mysql_host,$mysql_login,$mysql_pass))    
{  echo "Невозможно соединиться с базой. Форум временно недоступен.<br>";    
   echo "</td></tr></table>";
   include("footer.shtml");
   exit;    
}
//mysql_connect($mysql_host,$mysql_login,$mysql_pass);
mysql_select_db($mysql_db);

////
if ($sub==0) {$str="forum.php";}
else {$str="item.php?item=$sub";}

header("location: $str");
echo "<table width=650><tr><td class=forum_total>";
/////

//echo "$name<br>";
//echo "$email<br>";

$res=mysql_query("select * from authors where name='$name' AND email='$email'");// or die ("Can not Select");
$kol=mysql_num_rows($res);
if ($kol==0) 
{

mysql_query("insert into authors values('','$name','$email')") or die ("Can not Insert1");
}

$res=mysql_query("select author_id from authors where name='$name' AND email='$email'") or die ("Can not Select");
$p=mysql_result($res,0,"author_id");
echo "$p<br>";
$d = date("Y-m-d");
if (mysql_query("insert into messages values('','$theme','$d','0','$p','$sub','$text')") or die ("Can not Insert2"))
{ 
  $res=mysql_query("select * from messages where message_id=$sub");
  $kol=mysql_num_rows($res);
  if ($kol!=0) 
  {
   $p=mysql_result($res,0,"number_of_answers");
   $p+=1;
   mysql_query("update messages set number_of_answers='$p' where message_id='$sub'");
  }
  /////////////////////////////////////////////////////////
  /// Increase number_of_messages anywhere in message-tree
  $sb = $sub;
  while ( $sb!=0)
  {
   $sb=mysql_result($res,0,"sub_item_of");   
   if ( $sb!=0)
   {
    $res=mysql_query("select * from messages where message_id=$sb");
    $p=mysql_result($res,0,"number_of_answers");
    $p+=1;
    mysql_query("update messages set number_of_answers='$p' where message_id='$sb'");
   }
  }
  /// end increase code
  /////////////////////////////////////////////////////////
}
} // if ($result==1)

if ($result!=1)
{
////////////////////// НеУдачно /////////////////////////////

include("head1.shtml");

echo "<table width=650><tr><td class=forum_total>";
echo "<blockquote>";

$mysql_login='telemed';     
$mysql_host='localhost';       
$mysql_pass='4ddykTNZ9B';       
$mysql_db='telemed';

if(!@mysql_connect($mysql_host,$mysql_login,$mysql_pass))    
{  echo "Невозможно соединиться с базой. Форум временно недоступен.<br>";    
   echo "</td></tr></table>";
   include("footer.shtml");
   exit;    
}
//mysql_connect($mysql_host,$mysql_login,$mysql_pass);
mysql_select_db($mysql_db);


echo "$error2$error3$error4$error5";

echo "<FORM name=MyForm method=POST action=\"do_add.php\" onsubmit=\"return sendform();\">";
echo "Name: <input type=text name=name value=$name><p>";
echo "E-mail: <input type=text name=email value=$email><p>";
echo "Theme: <input type=text name=theme value=$theme><p>";
echo "Your message:<p><textarea name=text ROWS=10 COLS=40>$text</textarea><p>";
echo "<input type=hidden name=sub value=$sub>";
echo "<input type=submit value=Send!>";
echo "</FORM>";

if ($sub==0) 
{ 
echo "<br><br><center><a href=\"forum.php\">One level Up</a>";
echo "<br><a href=\"forum.php\">Main forum page</a></center>";
}
else
{
 $res=mysql_query("select sub_item_of from messages where message_id=$sub") or die ("Can not Select");
 $kol=mysql_num_rows($res);
 if ($kol!=0) 
 {
  $p=mysql_result($res,0,"sub_item_of");
  if ($p==0) { $str = "forum.php";}
  else {  $str="item.php?item=$p";}
 }
 echo "<br><br><center><a href=$str>Back</a>";
 echo "<br><a href=\"forum.php\">Main forum page</a></center>";
}

echo "<br><center><FONT class=forum_copyright>Copyright ".chr(169)." </FONT><a class=forum_small href=\"mailto:alexevl@fn.csa.ru\">Evlampiev Alexey</a>"."</center>";
echo "</blockquote>";
echo "</td></tr></table>";

include("foot.shtml");
} // if ($result!=1)

?>