<?
if(!empty($_GET)) extract($_GET);
if(!empty($_POST)) extract($_POST);
include("head1.shtml");
echo "<table width=650><tr><td class=forum_total>";

// Обращения к БД
// mysql_query("select * from messages where message_id=$sub")
// mysql_query("select * from authors where author_id=$s")

$mysql_login='telemed';$mysql_host='localhost';$mysql_pass='Sync**Pana';$mysql_db='telemed';

if(!@mysql_connect($mysql_host,$mysql_login,$mysql_pass))    
{  echo "Невозможно соединиться с базой. Форум временно недоступен.<br>";    
   echo "</td></tr></table>";
   include("footer.shtml");
   exit;    
}

mysql_select_db($mysql_db);

//===================================================
echo "<blockquote>";
echo "<br>";
echo "<FORM name=MyForm method=POST action=\"do_add.php\" onsubmit=\"return sendform();\">";
echo "Name: <input type=text name=name><p>";
echo "E-mail: <input type=text name=email><p>";

//---------------------------- 1 --------------------------------
// Re: старая тема
$res=mysql_query("select * from messages where message_id=$sub") or die ("Can not Select");
$kol=mysql_num_rows($res);
if ($kol==0) { echo "Theme: <input type=text name=theme><p>";}
else
 {
  $p=mysql_result($res,0,"theme");
  
  echo "Theme: <input type=text name=theme size=50 value=\"Re: $p\"><p>";
 }
if ($kol!=0)
{
if ($quo == 1)
 {
 $p=mysql_result($res,0,"text");
 $d=mysql_result($res,0,"date");
 // prepare $p
 $p = ">>".$p;
///////////////////////////////////////
// Добавить >> в начало каждой строки
//$p = str_replace(chr(10),">>",$p);
$sep = chr(10);
$pieces = explode($sep,$p);
$p = implode($pieces,">>");
///////////////////////////////////////
$p .= chr(10); $p .= chr(32);
$s=mysql_result($res,0,"author_id");  

//---------------------------- 2 --------------------------------
// Старый автор, старая дата и старый текст

 $res1=mysql_query("select * from authors where author_id=$s") or die ("Can not Select in authors");        
 $kol1=mysql_num_rows($res1);
 if ($kol1==0) { echo "Empty author";}
 else
  {
   $email=@mysql_result($res1,0,"email") or die ("Empty");
   $name=mysql_result($res1,0,"name") or die ("Empty");
   
    //"<a href=\"mailto:$email\">$name</a>";
  }
 $u = $name."(".$email.")";
 $p = "At ".$d." ".$u." wrote:".chr(10).$p;
 } // end if ($quo == 1)
 else
 {$p = "";}
echo "Your message:<p><textarea name=text ROWS=10 COLS=40>$p</textarea><p>";
} // end if ($kol1!=0)
else
 {echo "Your message:<p><textarea name=text ROWS=10 COLS=40></textarea><p>";
 }

echo "<input type=hidden name=sub value=$sub>";

echo "<input type=submit value=Send! style=\"COLOR: blue; BACKGROUND-COLOR: #eeeeee; border-color : #eeeeee;\"><p>";
echo "</FORM>";
echo "</blockquote>";
//===================================================

if ($sub==0) 
{ 
echo "<br><br><center><a href=\"forum.php\">One level Up</a>";
echo "<br><a href=\"forum.php\">Main forum page</a></center>";
}
else
{
// Ссылка Back

 //$res=mysql_query("select sub_item_of from messages where message_id=$sub") or die ("Can not Select");
 //$kol=mysql_num_rows($res);
 if ($kol!=0) 
 {
  $p=mysql_result($res,0,"sub_item_of");
  if ($p!=0) {$str = "item.php?item=$p";}
  else {$str = "forum.php";}
 }
 echo "<br><br><center><a href=$str>Back</a>";
 echo "<br><a href=\"forum.php\">Main forum page</a></center>";
}

echo "<br><center><FONT class=forum_copyright>Copyright </FONT><a class=forum_small href=\"mailto:alexevl@csa.ru\">Evlampiev Alexey</a>"."</center>";
echo "</td></tr></table>";
include("foot.shtml");
?>