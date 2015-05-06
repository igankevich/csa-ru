<?
if(!empty($_GET)) extract($_GET);
if(!empty($_POST)) extract($_POST);

include("head.shtml");
echo "<table width=650><tr><td class=forum_total>";

$mysql_login='telemed';     
$mysql_host='localhost';       
$mysql_pass='Sync**Pana';       
$mysql_db='telemed';

if(!@mysql_connect($mysql_host,$mysql_login,$mysql_pass))    
{  echo "<br>&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;";
   echo "<center>Невозможно соединиться с базой. Форум временно недоступен.</center><br>";    
   echo "<br>&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;";
   echo "</td></tr></table>";
   include("footer.shtml");
   exit;    
}

mysql_select_db($mysql_db);
$res=mysql_query("select * from messages where sub_item_of=0") or die ("Can not Select");

$kol=mysql_num_rows($res);
if ($kol==0) { echo "<center><FONT class=forum_headers>No items at forum yet...</FONT></center>";}
else
{
echo "<center><FONT class=forum_headers>Main forum page</FONT></center><br>";
echo "<center><table width=600 border=1><tr><td class=forum_headers>Theme</td><td class=forum_headers>Date</td><td class=forum_headers>Number of Answers</td><td class=forum_headers>Author</td></tr>";
echo "<FORM name=AdmForm method=GET action=\"adm.php\">";
echo "<input type=submit value=Delete! style=\"COLOR: blue; BACKGROUND-COLOR: #eeeeee; border-color : #eeeeee;\"><p>";
for ($i=0; $i<$kol; $i++)
 {
  echo "<tr><td class=forum_serv>";
  $j=mysql_result($res,$i,"message_id");
  $s=mysql_result($res,$i,"sub_item_of");
  ///
  echo "<input type=checkbox name=n$i>";
  echo "<input type=hidden name=id$i value=$j>";
  echo "<input type=hidden name=subitemof value=$s>";
  ///
  /// link or plain text?
  $pp=mysql_result($res,$i,"message_id");
  $res1=mysql_query("select * from messages where sub_item_of=$pp") or die ("Can not Select");
  $kol1=mysql_num_rows($res1);
  
  $p=mysql_result($res,$i,"theme");
  if (strlen($p)>20) { $p=substr($p,0,20).'...';}
  $j=mysql_result($res,$i,"message_id");
  //if ($kol1!=0)
  { echo "<a class=forum_big href=\"item.php?item=$j\">$p</a>"; }
  //else
  //{ echo "<FONT class=forum_big>$p</FONT>";}
  echo "</td><td class=forum_serv>";
  ///
  
  $p=mysql_result($res,$i,"date");
  echo "$p";
  echo "</td><td align=center class=forum_serv>";
  $p=mysql_result($res,$i,"number_of_answers");
  echo "$p";
  echo "</td><td class=forum_serv>";
  $p=mysql_result($res,$i,"author_id");  
  $res1=mysql_query("select * from authors where author_id=$p"); //or die ("Can not Select in authors");        
  $kol1=mysql_num_rows($res1);
  if ($kol1==0) { echo "Empty author";}
  else
  {
   $email=@mysql_result($res1,0,"email") or die ("Empty");
   $name=mysql_result($res1,0,"name") or die ("Empty");
   if (strlen($name)>10) { $name=substr($name,0,10).'...'; }
   echo "<a class=forum_big href=\"mailto:$email\">$name</a>";
   echo "</td></tr>";
  }
  echo "<tr><td colspan=4 class=forum_main>";
  $p=mysql_result($res,$i,"text");
  $pp=mysql_result($res,$i,"message_id");
// prepare text
 $p = ltrim($p);
 $p = nl2br($p);
 if (strlen($p)>60) { $p=substr($p,0,60)." <a class=forum_small href=\"item.php?item=$pp\">More...</a>"; }
//
  echo "$p";
  echo "<br><a class=forum_small href=\"add_message.php?sub=$pp&quo=0\">Answer</a>";
  echo "&nbsp;&nbsp;<a class=forum_small href=\"add_message.php?sub=$pp&quo=1\">Answer with quotation</a>";
  echo "</td></tr>";
 }// end for
echo "<input type=hidden name=kol value=$kol>";
echo "</FORM>";
echo "</table>";

}      
echo "<br><br><a class=forum_big href=\"add_message.php?sub=0\">New Theme</a></center>";
echo "</td></tr></table>";

echo "<br><center><FONT class=forum_copyright>Copyright ".chr(169)." </FONT><a class=forum_small href=\"mailto:alexevl@fn.csa.ru\">Evlampiev Alexey</a>"."</center>";

include("foot.shtml");
?>